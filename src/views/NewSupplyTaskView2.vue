<template>
	<div class="min-h-full dark:bg-gray-900">
		<Header />
		<Notifications />

		<div class="">
			<div class="top-menu">

				<h2 v-if="taskId">Добавка к поставке #{{taskId}}</h2>
				<h2 v-else>Создание поставки</h2>

				<div class="warehouse">
					<span v-if="!warehouses_loaded">Загрузка складов...</span>
					<ul>
						<li>
							<select v-if="warehouses_loaded" @change="wChange($event)" :disabled="taskId > 0"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
								<option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id"
									:selected="warehouse.id == current_warehouse.id">{{warehouse.id}}.
									{{warehouse.slug_name}}</option>
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
						<li><label>Дата создания:</label><input type="text" placeholder="Дата задания"
								v-model="fromDate" disabled /></li>
						<li><label><span>Предполагаемая</span>Дата приемки:</label><input type="text"
								placeholder="Дата оприходования" v-model="estimateDate" disabled /></li>
					</ul>
				</div>
				<div>
					Вес: {{calcWeight()}}кг<br />
					Всего: {{calcQty()}}шт
				</div>
				<div v-if="positions.length > 0 && process_status">
					<button v-if="taskId > 0" class="btn" @click="addToTask()">Завершить добавку</button>
					<button v-else class="btn" @click="makeTask()">Создать подсорт</button>
					<button class="btn btn-transparent" @click="makeSort()">Предпросмотр</button>
				</div>
			</div>

			<div class="bg-blue-500 text-white p-4 rounded" v-if="taskId > 0">
				Надо выбрать количество дней на подготовку. Это Изменить дату приемки.
			</div>

			<div v-if="task_info" class="dark:text-gray-300 max-w-7xl mx-auto">
				<h2 class="text-2xl font-bold my-4 text-left">Текущая поставка:</h2>
				<table
					class="main-table w-full text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400 border-collapse">
					<thead class="text-xs text-gray-950 bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
						<tr>
							<th scope="col" class="px-5 py-2">#</th>
							<th scope="col" class="px-5 py-2">Код МС</th>
							<th scope="col" class="px-5 py-2">Имя</th>
							<th scope="col" class="px-5 py-2">Количество</th>
						</tr>
					</thead>
					<tbody class="">
						<tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-100 even:dark:bg-gray-800 border-b dark:border-gray-700"
							v-for="(item, i) in task_info.positions" :key="i">
							<td class="px-5 py-2 text-left">{{i+1}}</td>
							<td class="px-5 py-2 text-left" style="text-align: left">{{item.code}}</td>
							<td class="px-5 py-2 text-left" style="text-align: left">{{item.name}}</td>
							<td class="px-5 py-2 text-center">{{item.qty}}</td>
						</tr>
					</tbody>
				</table>

				<h2 class="text-2xl font-bold my-4 text-left">Дополнительные товары сверх этого:</h2>
			</div>

			<div class="sorting" v-if="loaded && process_status">
				
				<div class="sorting-option">
					<h3>Параметры:</h3>
					<span>
						Количество дней на подготовку:
						<select v-model="days_to_ready" @change="update();">
							<option v-for="i in 10">{{i}}</option>
						</select>
					</span>
					<span>
						<label>Показывать причины предложения:
							<input type="checkbox" v-model="showReason" /></label><br />
						<!--button class="btn btn-transparent" @click="loadDebug();">Загрузить дебаг инфу для suggestions</button-->
					</span>
				</div>

				<div class="sorting-stats">
					<h3>Статистика:</h3>
					<div>Товаров из Китая: {{positions_groups.is_chinese}} шт </div>
					<div>Товаров собственного производства: {{positions_groups.produced}}шт</div>
				</div>

				<div class="stock-filter">
					<div class="stock-filter__container">
						<div class="stock-filter__legend">Показывать:</div>
						<div class="stock-filter__element" @click="removeFilter('main_and_already_packed')">
							<input id="push-everything" name="stock" type="radio" :checked="!has_stock" />
							<label for=" push-everything">Все</label>
						</div>
						<div class="stock-filter__element" @click="addFilter('main_and_already_packed')">
							<input id="push-email" name="stock" type="radio"
								:checked="has_stock" />
							<label for="push-email">В наличие на складе</label>
						</div>
					</div>
				</div>

				<div class="main-sorting">
					<div class="main-sorting__element">
						<h3>Сортировка:</h3>
						<ul>
							<li v-for="(item,i) in sorting" @click="removeSort('sorting', i)">
								<span>{{item.name.includes('computed') ? item.name.split('.')[1] : item.name}}</span>
								<span>
									<ArrowLongUpIcon v-if="item.direction == 'asc'" class="icon h-5 w-5" />
									<ArrowLongDownIcon v-if="item.direction == 'desc'" class="icon h-5 w-5" />
								</span>
								<XCircleIcon class="icon h-5 w-5" />
							</li>
						</ul>
					</div>
					<div class="main-sorting__element">
						<h3>Фильтрация:</h3>
						<ul>
							<li v-for="(item,i) in filters" @click="removeSort('filters', i)">
								{{item.name.includes('computed') ? item.name.split('.')[1] : item.name}} <XCircleIcon class="h-5 w-5" /></li>
						</ul>
					</div>
				</div>
			</div>

			<div class="dark:text-gray-300">
				<div class="process error" v-if="loaded && estimateDate == 'Загрузка..'">
					<h3>Ошибка, продолжать нельзя</h3>
					Нужно заполнить дату ожидания для склада этого склада. Сейчас она не заполнена.
				</div>
				<div class="process" v-if="!process_status">
					<h3>Создания задания к подсорту..</h3>
					<div v-if="process_success">
						Задание к подсорту создано 🥰<br />
						Я сообщу в телеграме, когда обновлю остатки<br />
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
								<tr>
									<th>#</th>
									<th>Код</th>
									<th>Кол-во</th>
									<th>Вес</th>
								</tr>
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
				<div class="h-screen overflow-auto">
					<table class="main-table" v-if="loaded && process_status">
						<thead>
							<tr>
								<th scope="col">#</th>
								<th class="table__title">Название товара</th>
								<th class="table__code">Код</th>
								<th scope="col">Подготовить</th>
								<th scope="col">
									Программа предлагает Переместить в Подготовить
									<Sorting :filters="filters" :sorting="sorting" name="suggest" @onSort="onSort" />
									<a href="javascript://" @click="applySuggestions()">Переместить все</a>
								</th>
								<th scope="col">
									Основной склад + Упакованное (расчет)
									<Sorting :filters="filters" :sorting="sorting" name="main_and_already_packed"
										@onSort="onSort" />
								</th>
								<th scope="col">
									Осталось меньше, чем на неделю (суммарно по складам)
									<Sorting :filters="filters" :sorting="sorting" name="notice_flag"
										@onSort="onSort" />
								</th>
								<th scope="col">Останется после перемещения</th>
								<th scope="col">Находится на складе</th>
								<th scope="col">Находится в регионе</th>
								<th scope="col">На сколько дней находится в городе выбранного склада сейчас</th>
								<th scope="col">
									Товар собственного производства
									<Sorting :filters="filters" :sorting="sorting" name="produced" @onSort="onSort" />
								</th>
								<th scope="col">Расчетное наличие на день приемки
									[сегодняшняя дата + срок поставки]
									без текущей поставки
									в городе выбранного склада</th>
								<th scope="col">На сколько дней будет
									на день приемки
									[сегодняшняя дата + срок поставки]
									без текущей поставки
									в городе выбранного склада</th>
								<th scope="col">Кол-во
									продаж
									за N дней
									в городе выбранного склада

									Рассчетно от факта за 30 дней</th>
								<th scope="col">
									Кол-во продаж за N дней в городе выбранного склада Цель
									<Sorting :filters="filters" :sorting="sorting" name="qty_sales_goal"
										@onSort="onSort" />
								</th>
								<th scope="col">{{current_warehouse.type.toUpperCase()}} Новый товар
									<Sorting :filters="filters" :sorting="sorting"
										:name="current_warehouse.type + '_new'" @onSort="onSort" />
								</th>
								<th scope="col">{{current_warehouse.type.toUpperCase()}} Текущая доходность</th>
								<th scope="col">{{current_warehouse.type.toUpperCase()}} Планируем ли и дальше продавать
									<Sorting :filters="filters" :sorting="sorting" :name="current_warehouse.type+'_active_for_sell'"
										@onSort="onSort" />
								</th>
								<th scope="col">{{current_warehouse.type.toUpperCase()}} Кол-во продаж за 7 дней</th>
								<th scope="col">{{current_warehouse.type.toUpperCase()}} Кол-во продаж за 30 дней</th>
								<th>{{current_warehouse.type.toUpperCase()}} Целевое кол-во продаж в месяц</th>
								<th scope="col">Статус переключателя Цель/Факт</th>
								<th scope="col">Цена</th>
								<th scope="col">
									Планируем ли дальше продавать на этом складе
									<Sorting :filters="filters" :sorting="sorting" name="goal_active"
										@onSort="onSort" />
								</th>
								<th scope="col">В транзите в город выбранного склада</th>
								<th scope="col">Готово по факту в город выбранного склада</th>
								<th scope="col">Подготовить в город выбранного склада</th>

								<th scope="col">Осталось товара (наш склад + транзит + МП)</th>
								<th scope="col">Осталось товара (наш склад + транзит
									{{current_warehouse.type.toUpperCase()}} + FBW + FBS
									{{current_warehouse.type.toUpperCase()}})</th>
								<th scope="col">Мастер</th>
								<th scope="col">Наличие на какое кол-во дней должно быть
									(N)</th>
								<th scope="col">Срок подготовки товара к отгрузке, дней (подгружается из МС)</th>
								<th scope="col">{{current_warehouse.type.toUpperCase()}} На скольки складах есть товар
								</th>
								<th scope="col">{{current_warehouse.type.toUpperCase()}} Осталось товара складах
									маркетплейса</th>
								<th scope="col">{{current_warehouse.type.toUpperCase()}} Товар в офисе, распределенный
									для МП</th>
								<th scope="col">Товар в транзите МП</th>
								<th scope="col">Ожидание товара 1я неделя</th>
								<th scope="col">Ожидание товара 2я неделя</th>
								<th scope="col">Ожидание товара 3я неделя</th>
								<th scope="col">Ожидание товара 4я неделя</th>
								<th scope="col">Ожидание товара 5я неделя</th>
								<th scope="col">Аккаунт</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(position, index) in sortedData" :key="index" :class="{ odd: index % 2 !== 0 }">
								<td>{{position.pid}}</td>
								<td>{{position.name}}</td>
								<td>{{position.code}}</td>
								<td><input type="number" class="suggestion-input" v-model.number="position.task"
										@input="position.task = position.task || 0" />
								</td>
								<td class="border border-gray-300 dark:border-gray-800 suggestion"
									:class="position.suggestion.color">
									<p v-if="showReason">
										{{position.suggestion.reason}}
										{{position.debug}}
									</p>
									<a v-if="position.suggestion.result > 0" href="javascript://"
										@click="suggest(position);">⬅️</a>
									{{Math.floor(position.suggest)}}
								</td>
								<td>{{position.main_and_already_packed}}</td>
								<td :class="position.notice_flag == 1 ? 'red' : ''">{{position.notice_flag == 1 ? 'Да' :
									''}}</td>
								<td :class="position.main_and_already_packed-position.task < 0 ? 'red' : ''">
									{{position.main_and_already_packed-position.task}}</td>
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
import { XCircleIcon, ArrowLongDownIcon, ArrowLongUpIcon, BarsArrowDownIcon } from '@heroicons/vue/24/outline'

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
    Menu, Header, SupplyTaskRow, Sorting, Notifications, 
	XCircleIcon, ArrowLongDownIcon, ArrowLongUpIcon, BarsArrowDownIcon
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
			defaultFilters: [{name: 'main_and_already_packed'}],
			defaultSort: [{ name: 'notice_flag', direction: 'desc' }, { name: 'suggest', direction: 'desc' }],
			sorting: [],
			messages: [],
			showReason: false,
			days_to_ready: 2,
			taskId: undefined,
			task_info: undefined,
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
				{
					id: 4,
					url: '/supplytask/updatesuggestions',
					title: 'Обновление предложений подсорта в дешборде',
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
		has_stock() {
			return this.filters.some(f => f.name === 'main_and_already_packed');
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
				positions: this.positions,
				task_id: this.taskId,
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
			console.log(value);
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

		addFilter(name) {
			if (!this.filters.some(filter => filter.name === name)) {
				this.filters.push({ name });
			}
		},
		removeFilter(name) {
			this.filters = this.filters.filter(f => f.name !== name);
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
			this.filters = this.defaultFilters;
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

		async addToTask() {
			try {
				const check = confirm('Вы уверены, что хотите продолжить?');
				if (check == false) return false;

				let response = {};
				response = await mpr({
					url: '/supplytask/addto',
					method: 'post',
					data: this.requestData,
				});

				if (response) {
					alert('Огонь, все добавилось, соррян, не успел нарисовать интерфейс. Сейчас начнется скачивание файла, если потеряешь - потом уже не поулчить такой.');
					this.exportToCSV(response.data.new_positions)
					
					alert('Сейчас обновлю остатки, после обновление переброшу на главную.')
					response = await mpr({url: '/automation/stock/sheet/update'});
					if (response) {
						this.$router.push({path: '/'});
					}
				}

			} catch(err) {
				this.addNotification('error', JSON.stringify(err));
				// alert(err);
			}
		},

		async exportToCSV(positions) {
			try {
				// Convert positions to CSV format
				const headers = ['Product', 'Articul', 'Code', 'Barcode', 'Qty'];
				// const headers = ['msid', 'qty'];
				const csvContent = [
					headers.join(';'), // Header row
					...positions.map(pos => [
						// pos.msid, 
						// pos.qty
						pos.name,
						pos.wbid,
						pos.code,
						pos.barcode,
						pos.qty
					].join(';'))
				].join('\n');

				// Create and download the file
				const csvWithBOM = '\uFEFF' + csvContent;

				const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = `${this.taskId}_positions_${new Date().toISOString().split('T')[0]}.csv`;
				link.click();
				window.URL.revokeObjectURL(url);

			} catch (error) {
				console.error('Error exporting CSV:', error);
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
			this.filters = this.defaultFilters;
			this.sorting = this.defaultSort;
			this.messages = [];
			this.$router.push({path: '/newsupplytask2/'+id})
			this.current_warehouse = this.warehouses.find(w => w.id == id);
			this.reset();

			// const data = {
			// 		"today": "2024-12-09",
			// 		"estimateDateDate": "2024-12-14",
			// 		"estimateDate": 5,
			// 		"result": [
			// 				{
			// 						"name": "Рюкзак переноска черный",
			// 						"code": "BACKPACKCAT01",
			// 						"master": "Нет",
			// 						"days_to_ready": 0,
			// 						"produced": false,
			// 						"is_chinese": true,
			// 						"wb_price": null,
			// 						"wb_profitability": 0.0,
			// 						"wb_active_for_sell": 0,
			// 						"wb_sales_goal": 0,
			// 						"wb_sales7": 0,
			// 						"wb_sales30": 0,
			// 						"wb_new": null,
			// 						"ozon_price": null,
			// 						"ozon_profitability": 0.0,
			// 						"ozon_active_for_sell": 0,
			// 						"ozon_sales_goal": 0,
			// 						"ozon_sales7": 0,
			// 						"ozon_sales30": 0,
			// 						"ozon_new": null,
			// 						"weight": 1.5,
			// 						"arrived1": 0,
			// 						"arrived2": 0,
			// 						"arrived3": 0,
			// 						"arrived4": 0,
			// 						"arrived5": 0,
			// 						"goal_id": null,
			// 						"goal_priority": null,
			// 						"goal_active": null,
			// 						"goal_sales_goal": null,
			// 						"goal_season_koef": null,
			// 						"goal_toggle": null,
			// 						"goal_days": null,
			// 						"goal_sales": null,
			// 						"goal_last_updated": null,
			// 						"account": "v1",
			// 						"pid": 2,
			// 						"qty_sales_goal": 0,
			// 						"qty_sales_fact": 0,
			// 						"qty_in_wh": 0,
			// 						"qty_in_region": 0,
			// 						"main_and_already_packed": 0,
			// 						"notice_flag": 0,
			// 						"notice_calc": "0 0 0.0 0",
			// 						"days_in_city": 0,
			// 						"region_sales_pd": 0.0,
			// 						"estimated_avl": 0,
			// 						"suggestion": {
			// 								"result": 0,
			// 								"reason": "Не заполнено поле goal_days на проверяемом складе"
			// 						},
			// 						"qty_on_day_acceptance": 0,
			// 						"avl_product": 0,
			// 						"avl_product_and_fwb": 0,
			// 						"prepare_qty": 0,
			// 						"ready_qty": 0,
			// 						"transit_qty": 0,
			// 						"mp_transit_product": 0,
			// 						"mp_product_office": 0,
			// 						"avl_stk": 0,
			// 						"avl_wh": 0,
			// 						"stocks": [
			// 								{
			// 										"wid": 113,
			// 										"product_id": 2,
			// 										"name": "9 - Обезличка Wildberries",
			// 										"ship_days": null,
			// 										"qty": 1,
			// 										"type": "ms",
			// 										"region": null,
			// 										"priority": null
			// 								},
			// 								{
			// 										"wid": 128,
			// 										"product_id": 2,
			// 										"name": "3 - Wildberries FBW",
			// 										"ship_days": null,
			// 										"qty": -32,
			// 										"type": "ms",
			// 										"region": null,
			// 										"priority": null
			// 								},
			// 								{
			// 										"wid": 134,
			// 										"product_id": 2,
			// 										"name": "3 - OZON FBO",
			// 										"ship_days": null,
			// 										"qty": -4,
			// 										"type": "ms",
			// 										"region": null,
			// 										"priority": null
			// 								},
			// 								{
			// 										"wid": 170,
			// 										"product_id": 2,
			// 										"name": "9 - Брак товара",
			// 										"ship_days": null,
			// 										"qty": 7,
			// 										"type": "ms",
			// 										"region": null,
			// 										"priority": null
			// 								}
			// 						]
			// 				},
			// 			{
			// 					"name": "Рюкзак переноска черный",
			// 					"code": "BACKPACKCAT01",
			// 					"master": "Нет",
			// 					"days_to_ready": 0,
			// 					"produced": false,
			// 					"is_chinese": true,
			// 					"wb_price": null,
			// 					"wb_profitability": 0.0,
			// 					"wb_active_for_sell": 0,
			// 					"wb_sales_goal": 0,
			// 					"wb_sales7": 0,
			// 					"wb_sales30": 0,
			// 					"wb_new": null,
			// 					"ozon_price": null,
			// 					"ozon_profitability": 0.0,
			// 					"ozon_active_for_sell": 0,
			// 					"ozon_sales_goal": 0,
			// 					"ozon_sales7": 0,
			// 					"ozon_sales30": 0,
			// 					"ozon_new": null,
			// 					"weight": 1.5,
			// 					"arrived1": 0,
			// 					"arrived2": 0,
			// 					"arrived3": 0,
			// 					"arrived4": 0,
			// 					"arrived5": 0,
			// 					"goal_id": null,
			// 					"goal_priority": null,
			// 					"goal_active": null,
			// 					"goal_sales_goal": null,
			// 					"goal_season_koef": null,
			// 					"goal_toggle": null,
			// 					"goal_days": null,
			// 					"goal_sales": null,
			// 					"goal_last_updated": null,
			// 					"account": "v1",
			// 					"pid": 2,
			// 					"qty_sales_goal": 0,
			// 					"qty_sales_fact": 0,
			// 					"qty_in_wh": 0,
			// 					"qty_in_region": 0,
			// 					"main_and_already_packed": 0,
			// 					"notice_flag": 0,
			// 					"notice_calc": "0 0 0.0 0",
			// 					"days_in_city": 0,
			// 					"region_sales_pd": 0.0,
			// 					"estimated_avl": 0,
			// 					"suggestion": {
			// 							"result": 0,
			// 							"reason": "Не заполнено поле goal_days на проверяемом складе"
			// 					},
			// 					"qty_on_day_acceptance": 0,
			// 					"avl_product": 0,
			// 					"avl_product_and_fwb": 0,
			// 					"prepare_qty": 0,
			// 					"ready_qty": 0,
			// 					"transit_qty": 0,
			// 					"mp_transit_product": 0,
			// 					"mp_product_office": 0,
			// 					"avl_stk": 0,
			// 					"avl_wh": 0,
			// 					"stocks": [
			// 							{
			// 									"wid": 113,
			// 									"product_id": 2,
			// 									"name": "9 - Обезличка Wildberries",
			// 									"ship_days": null,
			// 									"qty": 1,
			// 									"type": "ms",
			// 									"region": null,
			// 									"priority": null
			// 							},
			// 							{
			// 									"wid": 128,
			// 									"product_id": 2,
			// 									"name": "3 - Wildberries FBW",
			// 									"ship_days": null,
			// 									"qty": -32,
			// 									"type": "ms",
			// 									"region": null,
			// 									"priority": null
			// 							},
			// 							{
			// 									"wid": 134,
			// 									"product_id": 2,
			// 									"name": "3 - OZON FBO",
			// 									"ship_days": null,
			// 									"qty": -4,
			// 									"type": "ms",
			// 									"region": null,
			// 									"priority": null
			// 							},
			// 							{
			// 									"wid": 170,
			// 									"product_id": 2,
			// 									"name": "9 - Брак товара",
			// 									"ship_days": null,
			// 									"qty": 7,
			// 									"type": "ms",
			// 									"region": null,
			// 									"priority": null
			// 							}
			// 					]
			// 			},
			// 		],
			// 		"wh_priority": 1
			// }

			// this.current_warehouse = this.warehouses.find(w => w.id == id);
			// this.current_warehouse.priority = data.wh_priority;
			// this.tasks = [];
			// // console.log(response.data.supplytasks);
			// for (const item of data.result) {
			// 	item.task = 0;
			// 	item.suggest = item.suggestion.result;
			// 	this.tasks.push(item);
			// }
			// if (data.estimateDate != undefined)
			// 	this.suggestionsDate = data.estimateDate;

			// this.loaded = true;
			// return true;
			
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

		loadTask(){
			// this.addNotification('notice', 'Загрузка началась, надо немного подождать');
			mpr({
				url: '/supplytask/'+this.taskId
			}).then(response => {
				for (const item of response.data) {
					this.task_info = item;
				}

				// this.addNotification('success', 'Дебаг инфа загрузилась');
			}).catch((error) => {
				 this.addNotification('error', JSON.stringify(error));
				 // console.log('getGoalsByWarehouse Error', error);
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
		
		const { wid, taskId } = this.$route.params;
		this.taskId = taskId;
		
		// this.addNotification('error', 'text');
	},
	created() {
    this.$watch(
      () => this.$route.params,
      (toParams, previousParams) => {
				if (this.$route.params.wid > 0) {
					this.choose(this.$route.params.wid);
					if (this.taskId) {
						this.loadTask();
					}
				}
      }
    )
  }
}
</script>

<style lang="postcss" scoped>
	.top-menu {
		@apply flex justify-between dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800 border-b border-slate-300;
		
		h2 {
			@apply text-xl dark:text-lime-300;
		}
	}

	.main-table {
		@apply w-full text-xs text-left rtl:text-right text-gray-950 dark:text-gray-200 border-separate border-spacing-0;

		thead {
			@apply text-xs sticky top-0 z-20;
			
			tr {
				/* @apply border border-gray-300 dark:border-gray-800; */
				th {
					@apply text-gray-950 bg-gray-200 dark:bg-gray-700 dark:text-gray-400 px-2 py-3 border border-gray-300 dark:border-gray-800 font-bold;

					a {
						@apply whitespace-nowrap p-2 bg-lime-300 rounded-md font-bold my-5 hover:text-black;
					}
				}

				th.table__title {
					min-width: 400px;
				}

				th.table__code {
					@apply sticky left-0 z-20;
				}
			}
		}

		tbody {
			@apply text-left;

			tr {
				@apply border-b dark:border-gray-700;

				td {
					@apply bg-white dark:bg-gray-900 px-2 py-2 border border-gray-300 dark:border-gray-700 text-center;
				}

				.suggestion-input {
					@apply py-1 w-16 bg-inherit text-center font-bold
				}

				td:nth-child(2) {
					@apply text-left truncate;
				}
				
				td:nth-child(3) {
					@apply  text-left font-bold sticky left-0 z-10;
				}
				
				&.odd {
					td {
						@apply bg-gray-200 dark:bg-gray-800
					}
					td:nth-child(3) {
						@apply bg-gray-200 dark:bg-gray-800
					}
				}

				td.red {
					@apply text-white bg-rose-500 font-bold;
				}

				&:hover, &.odd:hover {
					td {
						@apply bg-lime-300 dark:text-black;
					}
				}
			}
		}
	}

	.btn {
		@apply rounded-md bg-lime-300;
	}

	.btn-transparent {
		@apply rounded-md bg-slate-500 text-white;
	}

	.sorting {
		@apply flex flex-row flex-wrap justify-between dark:text-gray-300 mb-2;

		.sorting-stats {
			@apply flex flex-col basis-1/2 p-2 px-3 py-5;
			
			h3 {
				@apply text-sm font-bold;
			}
		}
		.sorting-option {
			@apply flex flex-col basis-1/2 p-2 px-3 py-5;

			h3 {
				@apply text-sm font-bold;
			}

			select {
				@apply text-black bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-400 font-medium rounded-lg text-sm px-2 py-1 text-center inline-flex items-center;
			}
		}
		.main-sorting {
			@apply flex flex-row basis-1/2 px-3 py-2;
		}
		.stock-filter {
			@apply flex flex-row basis-1/2 px-3 py-2;
		}
	}

	.stock-filter {
		@apply flex flex-row justify-between basis-full items-center;

		.stock-filter__container {
			@apply flex flex-row flex-wrap basis-full items-center;
		}
		
		.stock-filter__legend {
			@apply basis-full text-sm font-semibold text-gray-900 items-center mb-1;
		}

		.stock-filter__element {
			@apply flex items-center gap-x-2 pr-5;

			input {
				@apply relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden;
			}

			label {
				@apply block text-sm font-medium text-gray-900;
			}
		}
	}

	.main-sorting {
		@apply flex justify-between;

		.main-sorting__element {
			@apply basis-1/2;

			h3 {
				@apply text-sm font-bold;
			}

			ul {
				@apply flex space-x-2;

				li {
					@apply flex items-center bg-gray-200 px-2 py-1 rounded-md;
				}
			}
		}
	}
	
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

	.clearfix {
		clear: both;
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