<template>
  <div class="home">
    <Menu />
    <Header />
    <div class="content-with-menu">
      <div class="top-menu">
        <h2>3. Goals by warehouse</h2>
				<span v-if="!warehouses_loaded">Загрузка складов...</span>
        <select v-if="warehouses_loaded" @change="wChange($event)">
          <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">{{warehouse.id}}. {{warehouse.name}}</option>
        </select>
				<span v-if="warehouses_loaded">
					Ожидаемый срок:
					<select v-model="current_warehouse.ship_days">
	          <option v-for="n in 20" :key="n" :value="n">Дней: {{n}}</option>
	        </select>
				</span>
        <div>
          <button v-if="loaded && !saving" class="btn" @click="save()">Сохранить</button>
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
							<th>Целевое кол-во продаж в месяц с WB Москва До коэф.</th>
							<th>Временный коэффициент для учета сезона (может быть не надо)</th>
							<th>Целевое кол-во продаж в месяц с WB Москва После коэф.</th>
							<th>Переключатель: формулам ориентироваться на Целевое кол-во или на Факт. оборот</th>
							<th>Кол-во продаж с WB Москва за 30 дней Факт</th>
							<th>Дата последней актуализации строки человеком</th>
							<th>WB Текущая доходность</th>
							<th>Мастер</th>
							<th>WB Планируем ли и дальше продавать</th>
							<th>WB Кол-во продаж за 7 дней Со всех складов</th>
							<th>WB Кол-во продаж за 30 дней Со всех складов</th>
							<th>WB Целевое кол-во продаж в месяц Со всех складов</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(goal,i) in goals" :key="goal.product_id">
							<td>{{goal.product_id}}</td>
							<td>{{goal.name}}</td>
							<td>{{goal.code}}</td>
							<td><input type="number" v-model.number="goal.priority" @input="handleUpdateGoal(goal)" /></td>
							<td>{{goal.days_to_ready}}</td>
							<td>{{goal.goal_days}}</td>
							<td>0</td>
							<td>0</td>
							<td>0</td>
							<td>0</td>
							<td>0</td>
							<td>0</td>
							<td>0</td>
							<td>0</td>
							<td>0</td>
							<td>0</td>
							<td>0</td>
							<td>0</td>
							<td>0</td>
							<td>0</td>
						</tr>
					</tbody>
				</table>
      </div>
    </div>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import Menu from '@/components/navigation/Menu.vue'
import Header from '@/components/navigation/Header.vue'
import mpr from './../tools/mpr'

export default {
  name: 'GoalsByWarehouseView',
  components: {
    HelloWorld, Menu, Header
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
		loadWarehouses(){
			this.warehouses = [];
			this.warehouses_loaded = false;
			
			mpr({
				url: '/warehouses/all',
			}).then(response => {
				for (const item of response.data.result) {
					item.add = 0;
					this.warehouses.push(item);
				}
				this.warehouses_loaded = true;
				this.choose(this.warehouses[0].id);
			}).catch((error) => {
		     console.log('/warehouses/all error', error);
		  });
		},
		choose(id) {
			this.loaded = false;
			this.current_warehouse = this.warehouses.find(w => w.id == id);
			this.goals_updated = [];
			this.goals = [];
			console.log('run choose', id);
			
			mpr({
				url: '/getGoalsByWarehouse',
				params: {
					id: id,
				}
			}).then(response => {
				console.log(response.data.result);
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
				newGoal[name] = goal[name];
			}
			delete newGoal.name;
			delete newGoal.code;
			
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
			console.log(result);
			return result;
		},
	},
	mounted(){
		this.loadWarehouses();
	}
}
</script>

