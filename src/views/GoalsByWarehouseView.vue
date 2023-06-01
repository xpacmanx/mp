<template>
  <div class="home">
    <Menu />
    <Header />
		<form @submit.prevent="onSubmit">
    <div class="content-with-menu">
      <div class="top-menu">
        <h2>3. Цели для выбранного склада</h2>
				<span v-if="!warehouses_loaded">Загрузка складов...</span>
        <select v-if="warehouses_loaded" @change="wChange($event)">
          <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id" :selected="warehouse.id == current_warehouse.id">{{warehouse.id}}. {{warehouse.slug_name}}</option>
        </select>
				<span v-if="loaded">
					Ожидаемый срок:
					<select v-model="current_warehouse.ship_days">
	          <option v-for="n in 20" :key="n" :value="n">Дней: {{n}}</option>
	        </select>
				</span>
        <div>
          <button type="submit" v-if="loaded && !saving" class="btn">Сохранить</button>
					<span v-if="saving">Сохраняется..</span>
        </div>
      </div>
      <div class="content">
				<p v-if="!loaded">Загрузка контента...</p>
	        <table v-if="loaded" class="table">
						<thead>
							<tr>
								<th>#</th>
								<th>Название товара</th>
								<th>Код</th>
								<th>Приоритет склада</th>
								<th>Срок подготовки товара к отгрузке, дней (подгружается из МС)</th>
								<th>Ожидаемый срок с момента создания подсортного задания до приемки на данном складе маркетплейсом, дней</th>
								<th>Наличие на какое кол-во дней должно быть</th>
								<th>Планируем ли дальше продавать на этом складе</th>
								<th>Целевое кол-во продаж в месяц с {{current_warehouse.type.toUpperCase()}} {{current_warehouse.slug_name}} До коэф.</th>
								<th>Временный коэффициент для учета сезона (может быть не надо)</th>
								<th>Целевое кол-во продаж в месяц с {{current_warehouse.type.toUpperCase()}} {{current_warehouse.slug_name}} После коэф.</th>
								<th>Переключатель: формулам ориентироваться на Целевое кол-во или на Факт. оборот</th>
								<th>Кол-во продаж с {{current_warehouse.type.toUpperCase()}} {{current_warehouse.slug_name}} за 30?? дней Факт</th>
								<th>Дата последней актуализации строки человеком</th>
								<th>{{current_warehouse.type.toUpperCase()}} Текущая доходность</th>
								<th>Мастер</th>
								<th>{{current_warehouse.type.toUpperCase()}} Планируем ли и дальше продавать</th>
								<th>{{current_warehouse.type.toUpperCase()}} Кол-во продаж за 7 дней Со всех складов</th>
								<th>{{current_warehouse.type.toUpperCase()}} Кол-во продаж за 30 дней Со всех складов</th>
								<th>{{current_warehouse.type.toUpperCase()}} Целевое кол-во продаж в месяц Со всех складов</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(goal,i) in goals" :key="goal.product_id">
								<td>{{goal.product_id}}</td>
								<td>{{goal.name}}</td>
								<td>{{goal.code}}</td>
								<td><input type="number" v-model.number="goal.priority" @input="handleUpdateGoal(goal)" min="1" max="10" /></td>
								<td>{{goal.days_to_ready}}</td>
								<td>{{Number(goal.days_to_ready) + Number(current_warehouse.ship_days)}}</td>
								<td><input type="number" v-model.number="goal.goal_days" @input="handleUpdateGoal(goal)" min="1" max="60" /></td>
								<td><input type="number" v-model.number="goal.active_for_sell" @input="handleUpdateGoal(goal)" min="0" max="3" /></td>
								<td><input type="number" v-model.number="goal.sales_goal" @input="handleUpdateGoal(goal)" min="0" /></td>
								<td><input type="number" v-model.number="goal.season_koef" @input="handleUpdateGoal(goal)" min="0" /></td>
								<td>{{goal.season_koef > 0 ? goal.sales_goal * goal.season_koef : goal.sales_goal}}</td>
								<td><input type="number" v-model.number="goal.goal_sale_toggle" @input="handleUpdateGoal(goal)" min="0" max="1" /></td>
								<td><input type="number" v-model.number="goal.sales" @input="handleUpdateGoal(goal)" min="0" max="9999999999" /></td>
								<td>{{niceDate(goal.last_updated)}}</td>
								<td>{{getPercent(goal[current_warehouse.type + '_profitability'])}}</td>
								<td>{{goal.master}}</td>
								<td>{{goal[current_warehouse.type + '_active_for_sell']}}</td>
								<td>{{goal[current_warehouse.type + '_sales7']}}</td>
								<td>{{goal[current_warehouse.type + '_sales30']}}</td>
								<td>{{goal[current_warehouse.type + '_sales_goal']}}</td>
							</tr>
						</tbody>
					</table>
      </div>
    </div>
		</form>
  </div>
</template>

<script>
import Menu from '@/components/navigation/Menu.vue'
import Header from '@/components/navigation/Header.vue'
import mpr from './../tools/mpr'
import moment from 'moment'

export default {
  name: 'GoalsByWarehouseView',
  components: {
    Menu, Header
  },
	data(){
		return {
			warehouses_loaded: false,
			loaded: false,
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
				url: '/warehouses/list',
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
		     console.log('/warehouses/list error', error);
		  });
		},
		getPercent(n){
			return (parseFloat(n)*100).toFixed(2)+'%';
		},
		niceDate(date){
			const momentDate = moment(date).format('DD.MM.YYYY')
			return momentDate == 'Invalid date' ? '-' : momentDate;
		},
		choose(id) {
			this.loaded = false;
			this.$route.params.wid = id;
			
			mpr({
				url: '/getGoalsByWarehouse',
				params: {
					id: id,
				}
			}).then(response => {
				this.current_warehouse = this.warehouses.find(w => w.id == id);
				this.goals_updated = [];
				this.goals = [];
				for (const item of response.data.result) {
					this.goals.push(item);
				}
				this.loaded = true;
			}).catch((error) => {
		     console.log('getGoalsByWarehouse Error', error);
		  });
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
		async save(){
			this.saving = true;
			await this.saveCurrentWarehouse();
			await this.saveCurrentGoals();
			this.saving = false;
		},
		async saveCurrentWarehouse(){
			if (!(this.current_warehouse.ship_days > 0)) return alert('Заполните ожидаемый срок!');
			let result = await mpr({
				url: '/warehouse/edit',
				method: 'post',
				data: {
					id: this.current_warehouse.id,
					ship_days: this.current_warehouse.ship_days,
				}
			})
			return result;
		},
		async saveCurrentGoals(){
			let result = await mpr({
				url: '/warehouseproductsgoals/edit',
				method: 'post',
				data: {goals: this.goals_updates}
			})
			// console.log(result);
			return result;
		},
		onSubmit(){
			this.save();
		},
	},
	mounted(){
		this.loadWarehouses(this.$route.params.wid);
	},
	created() {
    this.$watch(
      () => this.$route.params,
      (toParams, previousParams) => {
        this.choose(this.$route.params.wid);
      }
    )
  },
}
</script>

