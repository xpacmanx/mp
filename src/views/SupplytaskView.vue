<template>
  <div class="home">
    <Menu />
    <Header />
    <div class="content-with-menu">
      <div class="top-menu">
        <h2>Начальная страница</h2>
      </div>
      <div class="content">
        <h1>Dashboard </h1>
				<div class="panels">
					<div class="panel">
						<h2>Товаров</h2>
						<div class="panel__number">{{products.qty}}</div>
						<button v-if="!products.sync" class="btn" @click="syncProducts()">Синхронизировать</button>
						<p v-else>Синхронизация..</p>
						<p>Дата последнего изменения:<br />{{products.date}}</p>
					</div>
					<div class="panel">
						<h2>Склады</h2>
						<div class="panel__number">{{warehouses.total.qty}}</div>
						<button v-if="!warehouses.total.sync" class="btn" @click="syncWarehouses()">Синхронизировать</button>
						<p v-else>Синхронизация..</p>
						<p>Дата последнего изменения:<br />{{warehouses.total.date}}</p>
					</div>
					<div class="panel">
						<h2>WB остатки</h2>
						<div class="panel__number">{{wbstocks.qty}}</div>
						<button v-if="!stocks.sync" class="btn" @click="syncStocks()">Синхронизировать</button>
						<p v-else>Синхронизация..</p>
						<p>Дата последнего изменения:<br />{{wbstocks.date}}</p>
					</div>
					<div class="panel">
						<h2>Ozon остатки</h2>
						<div class="panel__number">{{ozonstocks.qty}}</div>
						<button v-if="!stocks.sync" class="btn" @click="syncStocks()">Синхронизировать</button>
						<p v-else>Синхронизация..</p>
						<p>Дата последнего изменения:<br />{{ozonstocks.date}}</p>
					</div>
				</div>
				<h2>Supply Tasks</h2>
				<div>
					<table class="table">
						<thead>
							<th>#</th>
							<th>Склад</th>
							<th>Товара штук</th>
							<th>Дата создания</th>
							<th>Дата приемки</th>
							<th>Действия</th>
						</thead>
						<tbody>
							<tr v-for="task in supplytasks">
								<td>{{task.id}}</td>
								<td>{{task.warehouse_name}}</td>
								<td>{{task.qty_amount}}</td>
								<td>{{task.start_date}}</td>
								<td>{{task.finish_date}}</td>
								<td>
									<!--a href="javascript://">Изменить</a-->
									<a href="javascript://" @click="deleteTask(task.id)">Удалить</a>		
								</td>
							</tr>
						</tbody>
					</table>
					<!--router-link>Список тасков</router-link-->
				</div>
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
  name: 'HomeView',
  components: {
  	Menu, Header
  },
	data() {
		return {
			products: {
				qty: '...',
				date: '',
				sync: false,
			},
			warehouses: {
				wb: {
					qty: '...',
					date: '',
				},
				ozon: {
					qty: '...',
					date: '',
				},
				total: {
					qty: '...',
					date: '',
					sync: false,
				},
			},
			stocks: {
				qty: '...',
				date: '',
				sync: false,
			},
			wbstocks: {
				qty: '...',
				date: '',
				sync: false,
			},
			ozonstocks: {
				qty: '...',
				date: '',
				sync: false,
			},
			supplytasks: [],
		}
	},
	methods: {
		deleteTask(id) {
			mpr({
				url: '/supplytask/'+id,
				method: 'delete',
			}).then(res => {
				// console.log(res.data);
				this.getSupplytasks();
			});
		},
		getSupplytasks() {
			mpr({
				url: '/supplytask/'+id,
			}).then(res => {
				this.supplytasks = res.data;
			})
		},
	},
	mounted() {
		this.updateDashboard();
	}
}
</script>

<style lang="scss">
@import "./../scss/_variables.scss";
	
h1 {
	font-size: 28px;
	font-weight: bold;
}

.panels {
	display: flex;	
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: space-around;
}
	
.panel {
	background: $light-color;
	border-radius: 8px;
	padding: 15px;
	min-width: 20%;

	h2 {
		font-size: 16px;
		font-weight: bold;
	}

	&__number {
		margin: 30px 0;
		font-size: 38px;
		font-weight: bold;
	}

	p {
		font-size: 12px;
		margin-top: 10px;
		color: rgba($dark-color, .4);
	
	}
}
</style>