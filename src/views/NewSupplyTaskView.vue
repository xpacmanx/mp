<template>
  <div class="home">
    <Menu />
    <Header />
    <div class="content-with-menu">
      <div class="top-menu">
        <h2>2. Подсорт для выбранного склада</h2>
				<span v-if="!warehouses_loaded">Загрузка складов...</span>
        <select v-if="warehouses_loaded" @change="wChange($event)">
          <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id" :selected="warehouse.id == current_warehouse.id">{{warehouse.id}}. [{{warehouse.type.toUpperCase()}}] {{warehouse.name}}</option>
        </select>
				<div>
					<input type="text" /><br/>
					<input type="text" />
				</div>
				<div>
					Вес: 0кг
				</div>
        <div>
          <button class="btn">Создать подсорт</button>
          <button class="btn btn-transparent">Предпросмотр</button>
        </div>
      </div>
      <div class="content">
				<p v-if="!loaded">Загрузка контента...</p>
        <table class="table" v-if="loaded">
					<thead>
						<tr>
							<th>#</th>
							<th>Название товара</th>
							<th>Код</th>
							<th>Подготовить</th>
							<th>Программа предлагает Переместить в Подготовить</th>
							<th>Основной склад + Упакованное (расчет)</th>
							<th>Находится</th>
							<th>Срок подготовки товара к отгрузке, дней (подгружается из МС)</th>
							<th>На сколько дней находится на выбранном складе сейчас</th>
							<th>Расчетное наличие на день приемки [сегодняшняя дата + срок поставки] без текущей поставки</th>
							<th>На сколько дней будет на день приемки [сегодняшняя дата + срок поставки] без текущей поставки</th>
							<th>Наличие на какое кол-во дней должно быть (N)</th>
							<th>Кол-во продаж за N дней</th>
							<th>Рассчетно от факта за 30 дней</th>
							<th>Кол-во продаж за N дней Цель</th>
							<th>Статус переключателя Цель/Факт</th>
							<th>Приоритет склада</th>
							<th>Планируем ли дальше продавать на этом складе</th>
							<th>В транзите</th>
							<th>Готово по факту</th>
							<th>Подготовить</th>
							<th>Останется после перемещения</th>
							<th>WB Текущая доходность</th>
							<th>Осталось товара (наш склад + транзит + МП)</th>
							<th>Осталось товара (наш склад + транзит WB + FBW + FBS WB)</th>
							<th>Мастер</th>
							<th>WB Планируем ли и дальше продавать</th>
							<th>WB Кол-во продаж за 7 дней</th>
							<th>WB Кол-во продаж за 30 дней</th>
							<th>WB Целевое кол-во продаж в месяц</th>
							<th>WB На скольки складах есть товар</th>
							<th>WB Осталось товара складах маркетплейса</th>
							<th>WB Товар в офисе, распределенный для МП</th>
							<th>WB Товар в транзите МП</th>
							<th>Ожидание товара 1я неделя</th>
							<th>Ожидание товара 2я неделя</th>
							<th>Ожидание товара 3я неделя</th>
							<th>Ожидание товара 4я неделя</th>
							<th>Ожидание товара 5я неделя</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(goal,i) in goals" :key="goal.product_id">
							<td>{{goal.product_id}}</td>
							<td>{{goal.name}}</td>
							<td>{{goal.code}}</td>
							<td><input type="number" value="0" @input="handleUpdateGoal(goal)" min="1" max="999" /></td>
							<td>0</td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td>{{goal.master}}</td>
							<td>{{goal[current_warehouse.type + '_active_for_sell']}}</td>
							<td>{{goal[current_warehouse.type + '_sales7']}}</td>
							<td>{{goal[current_warehouse.type + '_sales30']}}</td>
							<td>{{goal[current_warehouse.type + '_sales_goal']}}</td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
					</tbody>
				</table>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from '@/components/navigation/Menu.vue'
import Header from '@/components/navigation/Header.vue'
import mpr from './../tools/mpr'
import moment from 'moment'
	
export default {
  name: 'NewSupplyTaskView',
	components: {
    Menu, Header
  },
	data(){
		return {
			warehouses_loaded: false,
			loaded: true,
			saving: false,
			current_warehouse: {},
			warehouses: [],
			goals_updates: [],
			goals: [],
		}
	},
	methods: {
			wChange(event){
			this.choose(event.target.value);
		},
		loadWarehouses(id){
			this.warehouses = [];
			this.warehouses_loaded = false;
			// console.log('ID', id, );
			
			mpr({
				url: '/warehouses/all',
			}).then(response => {
				for (const item of response.data.result) {
					item.add = 0;
					this.warehouses.push(item);
				}
				this.warehouses_loaded = true;
				if (id !== undefined) {
					console.log('choose ID', id);
					this.choose(Number(id));
				} else {
					this.choose(this.warehouses[0].id);	
				}
			}).catch((error) => {
		     console.log('/warehouses/all error', error);
		  });
		},
		choose(id) {
			this.loaded = false;
			// this.$route.params.wid = id;
			
			mpr({
				url: '/supplytask/new',
				params: {
					id: id,
				}
			}).then(response => {
				this.current_warehouse = this.warehouses.find(w => w.id == id);
				this.goals_updated = [];
				this.goals = [];
				console.log(response.data.result);
				for (const item of response.data.result) {
					this.goals.push(item);
				}
				this.loaded = true;
			}).catch((error) => {
		     console.log('getGoalsByWarehouse Error', error);
		  });
		},
		niceDate(date){
			const momentDate = moment(date).format('DD.MM.YYYY')
			return momentDate == 'Invalid date' ? '-' : momentDate;
		},
		handleUpdateGoal(goal) {
			const newGoal = {};
			newGoal.warehouse_id = this.current_warehouse.id;
			for (const name in goal) {
				if (goal[name] == '' || !(goal[name] > 0)) continue;
				newGoal[name] = goal[name];
			}
			delete newGoal.name;
			delete newGoal.code;
			delete newGoal.last_updated;
			delete newGoal.days_to_ready;
			delete newGoal.wb_profitability;
			delete newGoal.ozon_profitability;
			delete newGoal.master;
			delete newGoal.wb_active_for_sell;
			delete newGoal.wb_sales_goal;
			delete newGoal.wb_sales7;
			delete newGoal.wb_sales30;
			delete newGoal.ozon_active_for_sell;
			delete newGoal.ozon_sales_goal;
			delete newGoal.ozon_sales7;
			delete newGoal.ozon_sales30;
			
			if (this.goals_updates.find(current => current.product_id == newGoal.product_id) !== undefined) {
				for (const current in this.goals_updates) {
					if (this.goals_updates[current].product_id == newGoal.product_id) {
						this.goals_updates[current] = newGoal;
						break;
					}
				}	
			} else {
				this.goals_updates.push(newGoal);
			}
		},
	},
	mounted(){
		this.loadWarehouses();
	}
}
</script>

