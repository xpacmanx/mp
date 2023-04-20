<template>
  <div class="home">
    <Menu />
    <Header />
    <div class="content-with-menu">
      <div class="top-menu">
        <h2>2. Подсорт для выбранного склада</h2>
				<span v-if="!warehouses_loaded">Загрузка складов...</span>
        <select v-if="warehouses_loaded" @change="wChange($event)">
          <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id" :selected="warehouse.id == current_warehouse.id">{{warehouse.id}}. {{warehouse.slug_name}}</option>
        </select>
				<div>
					<input type="text" placeholder="Дата задания" disabled /><br/>
					<input type="text" placeholder="Дата оприходывания" disabled />
				</div>
				<div>
					Вес: {{calcWeight()}}кг
				</div>
        <div>
          <button class="btn">Создать подсорт</button>
          <button class="btn btn-transparent" @click="makeSort()">Предпросмотр</button>
        </div>
      </div>
      <div class="content">
				<p v-if="!loaded">Загрузка контента...</p>
        <table class="table" v-if="loaded">
					<thead>
						<th>#</th>
						<th class="table__title">Название товара</th>
						<th class="table__code">Код</th>
						<th>Подготовить</th>
						<th>Программа предлагает Переместить в Подготовить</th>
						<th>Основной склад + Упакованное (расчет)</th>
						<th>Находится</th>
						<th>Срок подготовки товара к отгрузке, дней (подгружается из МС)</th>
						<th>На сколько дней находится в городе выбранного склада сейчас</th>
						<th>Расчетное наличие на день приемки [сегодняшняя дата + срок поставки] без текущей поставки</th>
						<th>На сколько дней будет на день приемки [сегодняшняя дата + срок поставки] без текущей поставки в городе выбранного склада</th>
						<th>Наличие на какое кол-во дней должно быть
(N)</th>
						<th>Кол-во продаж за N дней в городе выбранного склада Рассчетно от факта за 30 дней</th>
						<th>Кол-во продаж за N дней в городе выбранного склада Цель</th>
						<th>Статус переключателя Цель/Факт</th>
						<th>Приоритет склада</th>
						<th>Планируем ли дальше продавать на этом складе</th>
						<th>В транзите в город выбранного склада</th>
						<th>Готово по факту в город выбранного склада</th>
						<th>Подготовить в город выбранного склада</th>
						<th>Останется после перемещения</th>
						<th>{{current_warehouse.type.toUpperCase()}} Текущая доходность</th>
						<th>Осталось товара (наш склад + транзит + МП)</th>
						<th>Осталось товара (наш склад + транзит {{current_warehouse.type.toUpperCase()}} + FBW + FBS {{current_warehouse.type.toUpperCase()}})</th>
						<th>Мастер</th>
						<th>{{current_warehouse.type.toUpperCase()}} Планируем ли и дальше продавать</th>
						<th>{{current_warehouse.type.toUpperCase()}} Кол-во продаж за 7 дней</th>
						<th>{{current_warehouse.type.toUpperCase()}} Кол-во продаж за 30 дней</th>
						<th>{{current_warehouse.type.toUpperCase()}} Целевое кол-во продаж в месяц</th>
						<th>{{current_warehouse.type.toUpperCase()}} На скольки складах есть товар</th>
						<th>{{current_warehouse.type.toUpperCase()}} Осталось товара складах маркетплейса</th>
						<th>{{current_warehouse.type.toUpperCase()}} Товар в офисе, распределенный для МП</th>
						<th>Товар в транзите МП</th>
						<th>Ожидание товара 1я неделя</th>
						<th>Ожидание товара 2я неделя</th>
						<th>Ожидание товара 3я неделя</th>
						<th>Ожидание товара 4я неделя</th>
						<th>Ожидание товара 5я неделя</th>
					</thead>
					<tbody>
						<SupplyTaskRow v-for="(task,i) in goals" :key="task.product_id" :task="task" :whtype="current_warehouse.type" :whname="current_warehouse.slug_name" :region="current_warehouse.region" />
						<!-- tr v-for="(goal,i) in goals" :key="goal.product_id">
						</tr -->
					</tbody>
				</table>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from '@/components/navigation/Menu.vue'
import Header from '@/components/navigation/Header.vue'
import SupplyTaskRow from '@/components/SupplyTaskRow.vue'
import mpr from './../tools/mpr'
import moment from 'moment'
	
export default {
  name: 'NewSupplyTaskView',
	components: {
    Menu, Header, SupplyTaskRow
  },
	data(){
		return {
			warehouses_loaded: false,
			loaded: false,
			saving: false,
			current_warehouse: {},
			warehouses: [],
			goals: [],
		}
	},
	methods: {
		wChange(event){
			this.choose(event.target.value);
		},
		calcWeight() {
			let weight = 0
			if (this.goals.length > 0) {
				for (const item of this.goals) {
					if (item.task == undefined) item.task = 0;
					if (item.weight == undefined) item.weight = 0;
					weight += item.task*item.weight;
				}
			}
			return weight.toFixed(2);
		},
		currentWhQty(item,wh_name) {
			let qty = 0;
			let stock = item.stocks.find(stock => stock.name == wh_name);
			if (stock != undefined) qty = stock.qty;
			return qty;
			
		},
		countStocks(item,type){
			return item.stocks.filter(a => a.type == type).length;
		},
		countStocksQty(item,type){
			let qty = 0;
			for (const stock of item.stocks) {
				if (stock.type != type) continue;
				qty += Number(stock.qty);
			}
			return qty;
		},
		getStocks(name, id) {
			const goal = this.goals.find(goal => goal.product_id = id);
			const stock = goal.stocks.find(stock => stock.name == name);
			if (stock) return stock.qty;
			return 'Склад не создан';
		},
		getPercent(n){
			if (n == '' || n == null) return '0%';
			let f = parseFloat(n);
			if (typeof f == 'number') {
				f *= 100;
				return f.toFixed(2) + '%';
			}
			else return '0%';
		},
		makeSort() {
			this.goals.sort((a,b) => a.id - b.id);
			this.goals.sort((a,b) => b.task - a.task);
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
					item.task = 0;
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

