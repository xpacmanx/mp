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
						<h2>Продукты</h2>
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
						<h2>Остатки</h2>
						<div class="panel__number">{{stocks.qty}}</div>
						<button v-if="!stocks.sync" class="btn" @click="syncStocks()">Синхронизировать</button>
						<p v-else>Синхронизация..</p>
						<p>Дата последнего изменения:<br />{{stocks.date}}</p>
					</div>
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
		}
	},
	methods: {
		syncProducts() {
			this.products.sync = true;
			mpr({
				url: '/automation/products/sync'
			}).then(res => {
				this.updateDashboard();
				this.products.sync = false;
			}).catch(error => {
				this.products.sync = false;
				alert('Синхронизация затянулась, сообщу о завершение в телеграме');
			});
		},
		syncWarehouses() {
			this.warehouses.total.sync = true;
			mpr({
				url: '/automation/warehouses/sync'
			}).then(res => {
				this.updateDashboard();
				this.warehouses.total.sync = false;
			}).catch(error => {
				this.warehouses.total.sync = false;
				alert('Синхронизация затянулась, сообщу о завершение в телеграме');
			});
		},
		syncStocks() {
			this.stocks.sync = true;
			mpr({
				url: '/automation/stocks/sync'
			}).then(res => {
				this.updateDashboard();
				this.stocks.sync = false;
			}).catch(error => {
				this.stocks.sync = false;
				alert('Синхронизация затянулась, сообщу о завершение в телеграме');
			});
		},
		updateDashboard() {
			mpr({
				url: '/dashboard/'
			}).then(res => {
				if (res.data.dashboard !== undefined) {
					for (const item of res.data.dashboard) {
						switch (item.name) {
							case 'warehouses': 
								this.warehouses.total = {
									qty: item.qty,
									date: moment(item.last_updated.slice(0, -5)).format('DD.MM.YYYY в hh:mm'),
								}
							break;
							case 'ozon': 
								this.warehouses.ozon = {
									qty: item.qty,
									date: moment(item.last_updated.slice(0, -5)).format('DD.MM.YYYY в hh:mm'),
								}
							break;
							case 'wb': 
								this.warehouses.wb = {
									qty: item.qty,
									date: moment(item.last_updated.slice(0, -5)).format('DD.MM.YYYY в hh:mm'),
								}
							break;
							default:
								this[item.name] = {
									qty: item.qty,
									date: moment(item.last_updated.slice(0, -5)).format('DD.MM.YYYY в hh:mm'),
								}
							break
						}
					}
				}
			})
		}
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