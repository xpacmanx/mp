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
					<input type="text" placeholder="Дата задания" v-model="fromDate" disabled /><br/>
					<input type="text" placeholder="Дата оприходования" v-model="estimateDate" disabled />
				</div>
				<div>
					Вес: {{calcWeight()}}кг
				</div>
        <div v-if="positions.length > 0 && process_status">
          <button class="btn" @click="makeTask()">Создать подсорт</button>
          <button class="btn btn-transparent" @click="makeSort()">Предпросмотр</button>
        </div>
      </div>
			<div class="sorting" v-if="loaded && process_status">
				<div>
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
									<Sorting :filters="filters" :sorting="sorting" name="computed.suggestion" @onSort="onSort"/>
								</th>
								<th>
									Основной склад + Упакованное (расчет)
									<Sorting :filters="filters" :sorting="sorting" name="computed.mainAndPacked" @onSort="onSort"/>
								</th>
								<th>Находится на складе</th>
								<th>Находится в регионе</th>
								<th>Срок подготовки товара к отгрузке, дней (подгружается из МС)</th>
								<th>На сколько дней находится в городе выбранного склада сейчас</th>
								<th>Расчетное наличие на день приемки
		[сегодняшняя дата + срок поставки]
		без текущей поставки
		в городе выбранного склада</th>
								<th>На сколько дней будет
		на день приемки
		[сегодняшняя дата + срок поставки]
		без текущей поставки
		в городе выбранного склада</th>
								<th>Наличие на какое кол-во дней должно быть
		(N)</th>
								<th>Кол-во
		продаж
		за N дней
		в городе выбранного склада
		
		Рассчетно от факта за 30 дней</th>
								<th>
									Кол-во продаж за N дней в городе выбранного склада Цель
									<Sorting :filters="filters" :sorting="sorting" name="computed.goalNDays" @onSort="onSort"/>
								</th>
								<th>Статус переключателя Цель/Факт</th>
								<th>Приоритет склада</th>
								<th>
									Планируем ли дальше продавать на этом складе
									<Sorting :filters="filters" :sorting="sorting" name="goal_active" @onSort="onSort"/>
								</th>
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
							<SupplyTaskRow v-for="(task,i) in sortedData" :key="task.product_id" :task="task" :whtype="current_warehouse.type" :whname="current_warehouse.slug_name" :region="current_warehouse.region" :estimateDate="estimateDate" :fromDate="fromDate" :supplytasks="filteredSupplytasks" :regionWarehouses="regionWarehouses" :warehouses="warehouses" @onEdit="onEdit" @makeEdit="makeEdit"/>
						</tbody>
					</table>
				</div>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from '@/components/navigation/Menu.vue'
import Header from '@/components/navigation/Header.vue'
import SupplyTaskRow from '@/components/SupplyTaskRow.vue'
import Sorting from '@/components/SortingComponent.vue'
import mpr from './../tools/mpr'
import moment from 'moment'
	
export default {
  name: 'NewSupplyTaskView',
	components: {
    Menu, Header, SupplyTaskRow, Sorting
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
		}
	},
	computed: {
		estimateDate() {
			let estimated = moment(this.fromDate, "DD.MM.YYYY");
			if (this.current_warehouse.ship_days == undefined) return "Загрузка..";
			estimated.add(this.current_warehouse.ship_days, 'days');
			estimated.add(this.longestDate, 'days');
			// console.log(this.longestDate);
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
					id: task.product_id,
					qty: qty,
					weight: (weight*qty).toFixed(2),
				})
			}
			return arr;
		},
		sortedData() {
			let arr = [];
			for (const task of this.tasks) {
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
		    qty_amount: this.calcQty(),
		    weight_amount: this.calcWeight(),
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
			return this.warehouses.filter(w => w.region == this.current_warehouse.region);
		},
	},
	methods: {
		onEdit(prop, value, id) {
			const task = this.tasks.find(task => task.product_id == id);
			if (task !== undefined) {
				task.computed[prop] = value;
			}
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
							method: 'get',
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
				console.log(err);
				// alert(err);
			}
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
					// console.log('choose ID', id);
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
			this.filters = [];
			this.sorting = [];
			
			// this.$route.params.wid = id;
			this.reset();
			
			mpr({
				url: '/supplytask/new',
				params: {
					id: id,
				}
			}).then(response => {
				this.current_warehouse = this.warehouses.find(w => w.id == id);
				this.tasks = [];
				// console.log(response.data.supplytasks);
				for (const item of response.data.result) {
					item.task = 0;
					item.computed = {
						suggestion: 0,
						goalNDays: 0,
						mainAndPacked: 0,
					};
					this.tasks.push(item);
				}
				for (const item of response.data.supplytasks) {
					this.supply_tasks.push(item);
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
	},
	mounted() {
		this.fromDate = moment(new Date()).format('DD.MM.YYYY')
		this.loadWarehouses();
	}
}
</script>

