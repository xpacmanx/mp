<template>
  <div class="home">
    <Menu />
    <Header />
    <div class="content-with-menu">
      <div class="top-menu">
        <h2>Главная страница</h2>
      </div>
      <div class="content">
        <h1>Dashboard</h1>
				<div class="panels">
					<div class="panel">
						<h2>Продукты</h2>
						<div class="panel__number">...</div>
						<button class="btn" @click="syncProducts()">Синхронизировать</button>
					</div>
					<div class="panel">
						<h2>Склады</h2>
						<div class="panel__number">...</div>
						<button class="btn" @click="syncWarehouses()">Синхронизировать</button>
					</div>
					<div class="panel">
						<h2>Остатки</h2>
						<div class="panel__number">...</div>
						<button class="btn" @click="syncStocks()">Синхронизировать</button>
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
	methods: {
		syncProducts() {
			mpr({
				url: '/automation/products/sync'
			});
			alert('Синхронизация началась, сообщу о завершение в телеграме');
		},
		syncWarehouses() {
			mpr({
				url: '/automation/warehouses/sync'
			});
			alert('Синхронизация началась, сообщу о завершение в телеграме');
		},
		syncStocks() {
			mpr({
				url: '/automation/stocks/sync'
			});
			alert('Синхронизация началась, сообщу о завершение в телеграме');
		}
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
	justify-content: space-between;
}
	
.panel {
	background: $light-color;
	border-radius: 8px;
	padding: 15px;

	h2 {
		font-size: 16px;
		font-weight: bold;
	}

	&__number {
		margin: 30px 0;
		font-size: 38px;
		font-weight: bold;
	}
}
</style>