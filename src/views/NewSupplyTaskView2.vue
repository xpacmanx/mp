<template>
  <div class="home">
    <Menu />
    <Header />
		<Notifications />
    <div class="content-with-menu">
      <div class="top-menu">
        <h2>2.1. Подсорт для выбранного склада</h2>
				<div class="warehouse">
					<span v-if="!warehouses_loaded">Загрузка складов...</span>
					<ul>
						<li>
			        <select v-if="warehouses_loaded" @change="wChange($event)">
			          <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id" :selected="warehouse.id == current_warehouse.id">{{warehouse.id}}. {{warehouse.slug_name}}</option>
			        </select>
						</li>
						<li>
							<span><label>Регион:</label> {{current_warehouse.region}}</span>
							<span><label>Приоритет склада:</label> {{current_warehouse.priority}}</span>
						</li>
					</ul>
				</div>
				<div class="dates">
					<ul>
						<li><label>Дата создания:</label><input type="text" placeholder="Дата задания" v-model="fromDate" disabled /></li>
						<li><label><span>Предполагаемая</span>Дата приемки:</label><input type="text" placeholder="Дата оприходования" v-model="estimateDate" disabled /></li>
					</ul>
				</div>
				<div>
					Вес: {{calcWeight()}}кг<br/>
					Всего: {{calcQty()}}шт
				</div>
        <div v-if="positions.length > 0 && process_status">
          <button class="btn" @click="makeTask()">Создать подсорт</button>
          <button class="btn btn-transparent" @click="makeSort()">Предпросмотр</button>
        </div>
      </div>
			<div class="sorting" v-if="loaded && process_status">
				<div>
					<span>Товаров из Китая: {{positions_groups.is_chinese}}шт</span>
					<span>Товаров собственного производства: {{positions_groups.produced}}шт</span>
					<span>
						Количество дней на подготовку
						<select v-model="days_to_ready" @change="update();">
							<option v-for="i in 10">{{i}}</option>
						</select>
					</span>
					<span>
						<label>Показывать причины предложения:
						<input type="checkbox" v-model="showReason" /></label><br />
						<!--button class="btn btn-transparent" @click="loadDebug();">Загрузить дебаг инфу для suggestions</button-->
					</span>
					<span>Сортировка:</span>
					<ul>
						<li v-for="(item,i) in sorting" @click="removeSort('sorting', i)">{{item.name.includes('computed') ? item.name.split('.')[1] : item.name}} <span>{{item.direction == 'asc' ? '↑' : '↓'}}</span> | 🅧</li>
					</ul>
				</div>
				<div>
					<span>Фильтрация:</span>
					<ul>
						<li v-for="(item,i) in filters" @click="removeSort('filters', i)">{{item.name.includes('computed') ? item.name.split('.')[1] : item.name}} | 🅧</li>
					</ul>
				</div>
			</div>
      <div class="content">
				<div class="process error" v-if="loaded && estimateDate == 'Загрузка..'">
				<h3>Ошибка, продолжать нельзя</h3>
				Нужно заполнить дату ожидания для склада этого склада. Сейчас она не заполнена.</div>
				<div class="process" v-if="!process_status">
					<h3>Создания задания к подсорту..</h3>
					<div v-if="process_success">
						Задание к подсорту создано 🥰<br/>
						Я сообщу в телеграме, когда обновлю остатки<br/>
						<b>Пока не сообщу, не начинай новый подсорт, а то данные будут неправильные.</b>
					</div>
					<div v-if="!process_success">
						<p>Не закрывайте вкладку, пока все пункты не будут исполнены.</p>
						<ol>
							<li v-for="p in process">{{p.title}} - <span>{{p.status}}</span></li>
						</ol>
					</div>
					<div class="positions-list" style="margin-top: 20px;">
						<p style="position: absolute;right: 0;z-index:2;">
							<button class="btn" @click="makeTask()">Повторить запрос</button>
						</p>
						<h3>Позиции для отправки:</h3>
						<table class="table" style="text-align: center;">
							<thead>
								<th>#</th>
								<th>Код</th>
								<th>Кол-во</th>
								<th>Вес</th>
							</thead>
							<tbody>
								<tr v-for="item in positions">
									<td>{{item.id}}</td>
									<td>{{item.code}}</td>
									<td>{{item.qty}}</td>
									<td>{{item.weight}}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<p v-if="!loaded">Загрузка контента...</p>
				<div class="container-table">
	        <table class="table" v-if="loaded && process_status">
						<thead>
								<th>#</th>
								<th class="table__title">Название товара</th>
								<th class="table__code">Код</th>
								<th>Подготовить</th>
								<th>
									Программа предлагает Переместить в Подготовить 
									<Sorting :filters="filters" :sorting="sorting" name="suggest" @onSort="onSort"/>
									<a href="javascript://" @click="applySuggestions()">Переместить все</a>
								</th>
								<th>
									Основной склад + Упакованное (расчет)
									<Sorting :filters="filters" :sorting="sorting" name="main_and_already_packed" @onSort="onSort"/>
								</th>
								<th>
									Осталось меньше, чем на неделю (суммарно по складам)
									<Sorting :filters="filters" :sorting="sorting" name="notice_flag" @onSort="onSort"/>
								</th>
							  <th>Останется после перемещения</th>
								<th>Находится на складе</th>
								<th>Находится в регионе</th>
								<th>На сколько дней находится в городе выбранного склада сейчас</th>
								<th>
									Товар собственного производства
									<Sorting :filters="filters" :sorting="sorting" name="produced" @onSort="onSort"/>
								</th>
								<th>Расчетное наличие на день приемки
		[сегодняшняя дата + срок поставки]
		без текущей поставки
		в городе выбранного склада</th>
								<th>На сколько дней будет
		на день приемки
		[сегодняшняя дата + срок поставки]
		без текущей поставки
		в городе выбранного склада</th>
								<th>Кол-во
		продаж
		за N дней
		в городе выбранного склада
		
		Рассчетно от факта за 30 дней</th>
								<th>
									Кол-во продаж за N дней в городе выбранного склада Цель
									<Sorting :filters="filters" :sorting="sorting" name="qty_sales_goal" @onSort="onSort"/>
								</th>
								<th>{{current_warehouse.type.toUpperCase()}} Новый товар
									<Sorting :filters="filters" :sorting="sorting" :name="current_warehouse.type + '_new'" @onSort="onSort"/>
								</th>
								<th>{{current_warehouse.type.toUpperCase()}} Текущая доходность</th>
								<th>{{current_warehouse.type.toUpperCase()}} Планируем ли и дальше продавать</th>
								<th>{{current_warehouse.type.toUpperCase()}} Кол-во продаж за 7 дней</th>
								<th>{{current_warehouse.type.toUpperCase()}} Кол-во продаж за 30 дней</th>
															<th>{{current_warehouse.type.toUpperCase()}} Целевое кол-во продаж в месяц</th>
								<th>Статус переключателя Цель/Факт</th>
								<th>Цена</th>
								<th>
									Планируем ли дальше продавать на этом складе
									<Sorting :filters="filters" :sorting="sorting" name="goal_active" @onSort="onSort"/>
								</th>
								<th>В транзите в город выбранного склада</th>
								<th>Готово по факту в город выбранного склада</th>
								<th>Подготовить в город выбранного склада</th>
								
								<th>Осталось товара (наш склад + транзит + МП)</th>
								<th>Осталось товара (наш склад + транзит {{current_warehouse.type.toUpperCase()}} + FBW + FBS {{current_warehouse.type.toUpperCase()}})</th>
								<th>Мастер</th>
								<th>Наличие на какое кол-во дней должно быть
		(N)</th>
								<th>Срок подготовки товара к отгрузке, дней (подгружается из МС)</th>
								<th>{{current_warehouse.type.toUpperCase()}} На скольки складах есть товар</th>
								<th>{{current_warehouse.type.toUpperCase()}} Осталось товара складах маркетплейса</th>
								<th>{{current_warehouse.type.toUpperCase()}} Товар в офисе, распределенный для МП</th>
								<th>Товар в транзите МП</th>
								<th>Ожидание товара 1я неделя</th>
								<th>Ожидание товара 2я неделя</th>
								<th>Ожидание товара 3я неделя</th>
								<th>Ожидание товара 4я неделя</th>
								<th>Ожидание товара 5я неделя</th>
								<th>Аккаунт</th>
						</thead>
						<tbody>
							<tr v-for="position in sortedData">
								<td>{{position.pid}}</td>
								<td>{{position.name}}</td>
								<td>{{position.code}}</td>
								<td><input type="number" v-model.number="position.task" /></td>
								<td class="suggestion" :class="position.suggestion.color">
									<p v-if="showReason">
										{{position.suggestion.reason}}
										{{position.debug}}
									</p>
									<a v-if="position.suggestion.result > 0" href="javascript://" @click="suggest(position);">⬅️</a>
									{{Math.floor(position.suggest)}}</td>
								<td>{{position.main_and_already_packed}}</td>
								<td :class="position.notice_flag == 1 ? 'red' : ''">{{position.notice_flag == 1 ? 'Да' : ''}}</td>
								<td :class="position.main_and_already_packed-position.task < 0 ? 'red' : ''">{{position.main_and_already_packed-position.task}}</td>
								<td>{{position.qty_in_wh}}</td>
								<td>{{position.qty_in_region}}</td>
								<td>{{position.days_in_city}}</td>
								<td>{{position.produced == 1 ? 'Да' : ''}}</td>
								<td>{{position.estimated_avl}}</td>
								<td>{{position.qty_on_day_acceptance}}</td>
								<td>{{position.qty_sales_fact}}</td>
								<td>{{position.qty_sales_goal}}</td>
								<td>{{position[current_warehouse.type+'_new'] == 1 ? 'Да': ''}}</td>
								<td>{{percent(position[current_warehouse.type+'_profitability'])}}</td>
								<td>{{position[current_warehouse.type+'_active_for_sell']}}</td>
								<td>{{position[current_warehouse.type+'_sales7']}}</td>
								<td>{{position[current_warehouse.type+'_sales30']}}</td>
								<td>{{position[current_warehouse.type+'_sales_goal']}}</td>
								<td>{{position.goal_toggle}}</td>
								<td>{{position[current_warehouse.type+'_price']}}&nbsp;руб</td>
								<td>{{position.goal_active}}</td>
								<td>{{position.transit_qty}}</td>
								<td>{{position.ready_qty}}</td>
								<td>{{position.prepare_qty}}</td>
								<td>{{position.avl_product}}</td>
								<td>{{position.avl_product_and_fwb}}</td>
								<td>{{position.master}}</td>
								<td>{{position.goal_days}}</td>
								<td>{{position.days_to_ready}}</td>
								<td>{{position.avl_wh}}</td>
								<td>{{position.avl_stk}}</td>
								<td>{{position.mp_product_office}}</td>
								<td>{{position.mp_transit_product}}</td>
								<td>{{position.arrived1}}</td>
								<td>{{position.arrived2}}</td>
								<td>{{position.arrived3}}</td>
								<td>{{position.arrived4}}</td>
								<td>{{position.arrived5}}</td>						
								<td>{{position.account}}</td>						
							</tr>
						</tbody>
					</table>
				</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
	
import Menu from '@/components/navigation/Menu.vue'
import Header from '@/components/navigation/Header.vue'
import SupplyTaskRow from '@/components/SupplyTaskRow.vue'
import Sorting from '@/components/SortingComponent.vue'
import Notifications from '@/components/Notifications.vue'
import mpr from './../tools/mpr'
import moment from 'moment'

function getValue(obj, key) {
  const keys = key.split('.');
  let result = obj;

  for (const k of keys) {
    if (result.hasOwnProperty(k)) {
      result = result[k];
    } else {
      result = undefined;
      break;
    }
  }

  return result;
}
	
export default {
  name: 'NewSupplyTaskView2',
	components: {
    Menu, Header, SupplyTaskRow, Sorting, Notifications
  },
	data(){
		return {
			warehouses_loaded: false,
			loaded: false,
			saving: false,
			current_warehouse: {},
			supply_tasks: [],
			warehouses: [],
			tasks: [],
			filters: [],
			sorting: [],
			messages: [],
			showReason: false,
			days_to_ready: 2,
			process: [
				{
					id: 1,
					url: '/supplytask/create',
					title: 'Создание подсорта внутри системы',
					status: 'Ожидание',
				},
				{
					id: 2,
					url: '/supplytask/msupdate',
					title: 'Создание перемещения в моем складе',
					status: 'Ожидание',
				},
				{
					id: 3,
					url: '/automation/stock/sheet/update',
					title: 'Обновление остатков в старом подсорте',
					status: 'Ожидание',
				},
			],
			fromDate: '',
			suggestionsDate: 0,
		}
	},
	computed: {
		masters() {
			const arr = [];
			for (const product of this.tasks) {
				if (!arr.includes(product.master)) {
					arr.push(product.master);
				}
			}
			return arr;
		},
		estimateDate() {
			let estimated = moment(this.fromDate, "DD.MM.YYYY");
			if (this.current_warehouse.ship_days == undefined) return "Загрузка..";
			let days = this.current_warehouse.ship_days + this.longestDate;
			if (days > this.suggestionsDate) {
				estimated.add(this.current_warehouse.ship_days, 'days');
				estimated.add(this.longestDate, 'days');
			} else {
				estimated.add(this.suggestionsDate, 'days');
			}
			
			return estimated.format('DD.MM.YYYY');
		},
		longestDate(){
			const tasks = this.tasks.filter(task => task.task > 0);
			if (tasks.length > 0) {
				return tasks.sort((a,b) => b.days_to_ready - a.days_to_ready)[0].days_to_ready;
			}
			return 0;
		},
		process_status() {
			return this.process.filter(step => step.status == 'Ожидание').length == 3
		},
		process_success() {
			return this.process.filter(step => step.status == 'Готово').length == 3
		},
		positions() {
			const arr = [];
			const tasks = this.tasks.filter(task => task.task > 0);
			for (const task of tasks) {
				let qty = Number(task.task);
				let weight = task.weight;
				arr.push({
					id: task.pid,
					code: task.code,
					qty: qty,
					weight: (weight*qty).toFixed(2),
				})
			}
			return arr;
		},
		positions_groups() {
			const result = {
				produced: 0,
				is_chinese: 0,
			};
			const tasks = this.tasks.filter(task => task.task > 0);
			for (const task of tasks) {
				let qty = Number(task.task);
				if (task.produced) result.produced += qty;
				if (task.is_chinese) result.is_chinese += qty;
			}
			return result;
		},
		sortedData() {
			let arr = [];
			for (const task of this.tasks) {
				task.task = parseInt(task.task);
				arr.push(task);
			}
			
			//filters
			if (this.filters.length > 0) {
				for (let filter of this.filters) {
					let name = filter.name + '';
					const computed = filter.name.includes('computed');
					if (computed) name = filter.name.split('.')[1];
					// console.log('filter =>', name, arr);
					arr = arr.filter(task => 
						computed ? 
						task.computed[name] != 0  :
						task[name] != 0 && task[name] != null
					);
				}
			}
			//sorting
			if (this.sorting.length > 0) {
				for (const sort of this.sorting) {
					let name = sort.name + '';
					let computed = sort.name.includes('computed');
					if (computed) name = sort.name.split('.')[1];
					let versa = 1;
					if (sort.direction == 'desc') versa = -1;
					arr = arr.sort((a,b) => 
						computed ? 
						(a.computed[name])*versa - (b.computed[name])*versa :
						(a[name])*versa - (b[name])*versa
					);
				}
			}
			// console.log('Длина массива:', arr.length);
			return arr;
		},
		requestData() {
			return {
				start_date: moment().format('YYYY-MM-DD'),
		    estimated_date: moment(this.estimateDate, 'DD.MM.YYYY').format('YYYY-MM-DD'),
		    finish_date: moment(this.estimateDate, 'DD.MM.YYYY').format('YYYY-MM-DD'),
		    warehouse_id: this.current_warehouse.id,
		    qty: this.calcQty(),
		    weight: this.calcWeight(),
		    status_id: 1,
				positions: this.positions
			}
		},
		filteredSupplytasks() {
			const from = moment(this.fromDate, 'DD.MM.YYYY');
			const to = moment(this.estimateDate, 'DD.MM.YYYY');
			const tasks = this.supply_tasks.filter(task => moment(task.finishDate).isBetween(from, to, undefined, '[]'));
			return tasks;
		},
		regionWarehouses() {
			return this.warehouses.filter(w => w.region == this.current_warehouse.region && w.type == this.current_warehouse.type );
		},
	},
	methods: {
		percent(n){
			return (n * 100).toFixed() + '%';
		},
		
		onEdit(prop, value, id) {
			const task = this.tasks.find(task => task.product_id == id);
			if (task !== undefined) {
				task.computed[prop] = value;
			}
		},

		suggest(position) {
			position.task = Math.floor(position.suggestion.result);
		},

		applySuggestions() {
			this.tasks.forEach(item => {
				if(item.suggestion.result > 0) 
					item.task = Math.floor(item.suggestion.result);
			})
		},
		
		makeEdit(prop, value, id) {
			const task = this.tasks.find(task => task.product_id == id);
			if (task !== undefined) task[prop] = value;
		},

		onSort(type, name, value) {
			// console.log(type,name,value, this.sorting);
			if (type == 'sort') {
				const sort = this.sorting.find(sort => sort.name == name );
				if (sort == undefined) {
					this.sorting.push({
						name: name,
						direction: value,
					})
				} else {
					if (sort.direction == value) {
						for (let i in this.sorting) {
							if (this.sorting[i].name == name) {
								this.sorting.splice(i, 1);
							}
						}
					} else {
						sort.direction = value;
					}
				}
			}

			if (type == 'filter') {
				const filter = this.filters.find(sort => sort.name == name);
				if (filter == undefined) {
					this.filters.push({
						name: name
					})
				} else {
					for (let i in this.filters) {
						if (this.filters[i].name == name) {
							this.filters.splice(i, 1);
						}
					}
				}
			}
		},
		
		removeSort(type, i) {
			if (i == -1) this[type] = [];
			this[type].splice(i, 1);
		},
		
		wChange(event){
			this.choose(event.target.value);
		},
		
		calcWeight() {
			let weight = 0
			if (this.tasks.length > 0) {
				for (const item of this.tasks) {
					if (item.task == undefined) item.task = 0;
					if (item.weight == undefined) item.weight = 0;
					weight += item.task*item.weight;
				}
			}
			return weight.toFixed(2);
		},
		
		calcQty() {
			let qty = 0
			if (this.tasks.length > 0) {
				for (const item of this.tasks) {
					if (item.task == undefined) item.task = 0;
					qty += item.task;
				}
			}
			return qty;
		},
		
		makeSort() {
			this.sorting = [{name:'task', direction: 'desc'}];
			this.filters = [];
			// this.tasks.sort((a,b) => a.id - b.id);
			// this.tasks.sort((a,b) => b.task - a.task);
		},

		reset() {
			for (const step of this.process) {
				step.status = 'Ожидание';
			}
		},

		async makeTask() {
			try {
				const check = confirm('Вы уверены, что хотите продолжить?');
				if (check == false) return false;
				
				let response = {};
				for (const step of this.process) {
					step.status = 'Выполняется..';
					if (step.id == 1) {
						response = await mpr({
							url: step.url,
							method: 'post',
							data: this.requestData,
						});
					} else if (step.id == 2) {
						const id = response.data.result[0].supplytask_id;
						response = await mpr({
							method: 'post',
							url: step.url,
							params: {
								id: id,
							},
						});
					} else {
						response = await mpr({
							url: step.url,
							method: 'get'
						})
					}
					
					step.status = 'Готово';
				}
			} catch(err) {
				this.addNotification('error', JSON.stringify(error));
				// alert(err);
			}
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
				if (id !== undefined && id > 0) {
					// console.log('choose ID', id);
					this.choose(Number(id));
				} else {
					this.choose(this.warehouses[0].id);	
				}
			}).catch((error) => {
		     // console.log('/warehouses/list error', error);
				 this.addNotification('error', JSON.stringify(error));
		  });
		},
		choose(id) {
			this.loaded = false;
			this.filters = [];
			this.sorting = [];
			this.messages = [];
			this.$router.push({path: '/newsupplytask2/'+id})
			this.current_warehouse = this.warehouses.find(w => w.id == id);
			this.reset();
			
			mpr({
				url: '/supplytask/new2',
				params: {
					id: id,
					days_to_ready: this.days_to_ready,
				}
			}).then(response => {
				if (response.data.error != undefined) {
					this.messages.push({
						type: 'error',
						text: response.data.error,
					})
				}
				this.current_warehouse = this.warehouses.find(w => w.id == id);
				this.current_warehouse.priority = response.data.wh_priority;
				this.tasks = [];
				// console.log(response.data.supplytasks);
				for (const item of response.data.result) {
					item.task = 0;
					item.suggest = item.suggestion.result;
					this.tasks.push(item);
				}
				if (response.data.estimateDate != undefined)
					this.suggestionsDate = response.data.estimateDate;
				// for (const item of response.data.supplytasks) {
				// 	this.supply_tasks.push(item);
				// }
				this.loaded = true;
			}).catch((error) => {
				this.addNotification('error', 'getGoalsByWarehouse' + JSON.stringify(error));
		    console.log('getGoalsByWarehouse Error', error);
		  });
		},

		loadDebug(){
			this.addNotification('notice', 'Загрузка началась, надо немного подождать');
			mpr({
				url: '/supplytask/new2test',
				params: {
					id: this.current_warehouse.id,
					days_to_ready: this.days_to_ready,
				}
			}).then(response => {
				if (response.data.error != undefined) {
					this.addNotification('error', 'Ошибка загрузки' + JSON.stringify(response.data.error));
				}

				for (const item of response.data.products) {
					for (const n in item) {
						this.updateDebug(n, item);
						break;	
					}
				}

				this.addNotification('success', 'Дебаг инфа загрузилась');
			}).catch((error) => {
				 this.addNotification('error', JSON.stringify(error));
		     console.log('getGoalsByWarehouse Error', error);
		  });	
		},

		addNotification(type, text) {
			this.$store.dispatch('add', {type: type, text: text});
		},

		addMessage(message, type, sec) {
			this.addNotification(type, message);
		},
		
		update() {
			this.loaded = false;
			mpr({
				url: '/supplytask/new2',
				params: {
					id: this.current_warehouse.id,
					days_to_ready: this.days_to_ready,
				}
			}).then(response => {
				for (const item of response.data.result) {
					item.suggest = item.suggestion.result;
					this.updateTask(item.pid, item);
				}
				if (response.data.estimateDate != undefined)
					this.suggestionsDate = response.data.estimateDate;
				this.loaded = true;
			}).catch((error) => {
					this.addNotification('error', JSON.stringify(error));
		     console.log('getGoalsByWarehouse Error', error);
		  });
		},
		updateTask(id, data){
			for (const i in this.tasks) {
				if (this.tasks[i].pid == id) {
					for (const v in this.tasks[i]) {
						if (v == 'task') continue;
						this.tasks[i][v] = data[v];
					}
					break;
				}
			}
		},
		updateDebug(id, data){
			for (const i in this.tasks) {
				if (this.tasks[i].pid == id) {
					this.tasks[i].debug = data;
					break;
				}
			}
		},
		niceDate(date){
			const momentDate = moment(date).format('DD.MM.YYYY')
			return momentDate == 'Invalid date' ? '-' : momentDate;
		},
	},
	mounted() {
		this.fromDate = moment(new Date()).format('DD.MM.YYYY')
		this.loadWarehouses(this.$route.params.wid);
		// this.addNotification('error', 'text');
	},
	created() {
    this.$watch(
      () => this.$route.params,
      (toParams, previousParams) => {
				if (this.$route.params.wid > 0) {
					this.choose(this.$route.params.wid);
				}
      }
    )
  }
}
</script>

<style lang="scss" scoped>
	.suggestion.orange {
		background: #ffd56e;
		color: #e15613;
	}
	
	.suggestion p {
		display: none;
    position: absolute;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    z-index: 2;
    bottom: 20px;
    width: 350px;
		margin-left: -120px;
		max-height: 200px;
		overflow: scroll;
	}
	.suggestion:hover p {
		display: block;
	}

	.red {
		background: #f6b2ba!important;
		font-weight: 700;
		color: #fff;
	}

	.warehouse {
		border-left: #ddd solid 1px;
		padding: 0 20px;
	
		ul {
			list-style: none;
			margin: 0;
			padding: 0;

			li {
				margin: 0;
				padding: 0;

				span {
					font-size: 12px;
					font-weight: bold;
					padding-right: 20px;
					margin-right: 20px;
					border-right: #ddd solid 1px;

					&:last-child {
						border: none;
					}
					
					label {
						font-weight: normal;
					}
				}
			}
		}
	}

	.dates {
		border-left: #ddd solid 1px;
		padding: 0 20px;
		border-right: #ddd solid 1px;
	
		ul {
			list-style: none;
			margin: 0;
			padding: 0;
		}
		li {
			margin: 0;
			padding: 0;
			margin-top: 5px;
			display: flex;
		}
		label {
			width: 100px;
			font-size: 12px;
			font-weight: bold;
			position: relative;
			
			span {
				position: absolute;
				top: 15px;
				font-size: 10px;
				color: #aaa;
				text-transform: uppercase;
				z-index: 1;
				display: none;
			}
		}

		input {
			width: 80px;
			text-align: center;
		}
	}
</style>