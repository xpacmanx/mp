<template>
  <div class="min-h-full dark:bg-gray-900">
    <!--Menu /-->
    <Header />
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

			<div class="flex h-16 items-center justify-between">
				<h2 class="text-2xl font-bold text-left dark:text-lime-300">Сервис поставок</h2>
				<div class="flex items-center">
					<router-link to="/supplytasks/dashboard" class="rounded-md mr-2 bg-gray-200 px-3 py-2 text-sm font-medium text-gray-950 hover:text-gray-600 visited:text-gray-950" aria-current="page">Список складов к распределению</router-link>
					<router-link to="/newsupplytask2/" class="rounded-md bg-lime-300 px-3 py-2 text-sm font-medium text-gray-950 hover:text-gray-600 visited:text-gray-950" aria-current="page">Новая поставка</router-link>
				</div>
			</div>
			
      <div>
				<Notifications />
        
				<!--h2 class="text-xl font-bold text-left py-8">Cинхронизации</h2-->
				<div class="flex items-center justify-between space-x-4 dark:text-gray-200">
					
					<div class="basis-1/4 flex flex-col bg-gray-200 dark:bg-gray-800 p-4 rounded-md">
						<div class="flex flex-row items-center justify-between">
							<div class="text-m text-left">Товаров</div>
							<ArrowPathIcon class="h-5 w-5 hover:cursor-pointer" v-if="!products.sync" @click="syncProducts()" />
							<ArrowPathIcon class="h-5 w-5 hover:cursor-progress animate-spin" v-else />
						</div>
						<div class="text-4xl font-bold text-left pt-5">{{products.qty}}</div>
						<p class="text-left text-xs">Дата последнего изменения:<br />{{products.date}}</p>
					</div>

					<div class="basis-1/4 flex flex-col bg-gray-200 dark:bg-gray-800 p-4 rounded-md">
						<div class="flex flex-row items-center justify-between">
							<div class="text-m text-left">Складов</div>
							<ArrowPathIcon class="h-5 w-5 hover:cursor-pointer" v-if="!warehouses.total.sync" @click="syncWarehouses()" />
							<ArrowPathIcon class="h-5 w-5 hover:cursor-progress animate-spin" v-else />
						</div>
						<div class="text-4xl font-bold text-left pt-5">{{warehouses.total.qty}}</div>
						<p class="text-left text-xs">Дата последнего изменения:<br />{{warehouses.total.date}}</p>
					</div>

					<div class="basis-1/4 flex flex-col bg-gray-200 dark:bg-gray-800 p-4 rounded-md">
						<div class="flex flex-row items-center justify-between">
							<div class="text-m text-left">Остатки WB</div>
							<ArrowPathIcon class="h-5 w-5 hover:cursor-pointer" v-if="!stocks.sync" @click="syncStocks()" />
							<ArrowPathIcon class="h-5 w-5 hover:cursor-progress animate-spin" v-else />
						</div>
						<div class="text-4xl font-bold text-left pt-5">{{wbstocks.qty}}</div>
						<p class="text-left text-xs">Дата последнего изменения:<br />{{wbstocks.date}}</p>
					</div>

					<div class="basis-1/4 flex flex-col bg-gray-200 dark:bg-gray-800 p-4 rounded-md">
						<div class="flex flex-row items-center justify-between">
							<div class="text-m text-left">Остатки Ozon</div>
							<ArrowPathIcon class="h-5 w-5 hover:cursor-pointer" v-if="!stocks.sync" @click="syncStocks()" />
							<ArrowPathIcon class="h-5 w-5 hover:cursor-progress animate-spin" v-else />
						</div>
						<div class="text-4xl font-bold text-left pt-5">{{ozonstocks.qty}}</div>
						<p class="text-left text-xs">Дата последнего изменения:<br />{{ozonstocks.date}}</p>
					</div>
				</div>
				
				<!--div class="panels">
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
				</div-->
				
				<h2 class="text-xl font-bold text-left pt-6 py-3 dark:text-lime-300">Непринятые задания:</h2>
				
				<div>
					
					<table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
						<thead class="text-xs text-gray-950 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
							<tr>
								<th scope="col" class="px-6 py-3">#</th>
								<th scope="col" class="px-6 py-3">Склад</th>
								<th scope="col" class="px-6 py-3">Товара штук</th>
								<th scope="col" class="px-6 py-3">Дата создания</th>
								<th scope="col" class="px-6 py-3">Дата приемки</th>
								<th scope="col" class="px-6 py-3">Действия</th>
							</tr>
						</thead>
						<tbody>
							<tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-100 even:dark:bg-gray-800 border-b dark:border-gray-700" v-for="task in supplytasks">
								<td scope="row" class="px-6 py-4">{{task.id}}</td>
								<td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
									<router-link class="hover:cursor-pointer" :to="'/supplytask/'+task.id">{{task.warehouse_name}}</router-link>
								</td>
								<td class="px-6 py-4">{{task.qty_amount}}</td>
								<td class="px-6 py-4">{{task.start_date}}</td>
								<td class="px-6 py-4">{{task.finish_date}}</td>
								<td class="px-6 py-4">
									<router-link :to="'/supplytask/'+task.id">Открыть</router-link> | 
									<router-link :to="'/newsupplytask2/'+task.warehouse_id+'/'+task.id">Сделать добавку</router-link> | 
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
import Notifications from '@/components/Notifications.vue'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
	
import mpr from './../tools/mpr'
import moment from 'moment'
	
export default {
  name: 'HomeView',
  components: {
  	Menu, Header, Notifications, ArrowPathIcon
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
		addNotification(type, text) {
			this.$store.dispatch('add', {type: type, text: text});
		},
		deleteTask(id) {
			if (confirm("Точно хотите удалить это задание к перемещению?")) {
				mpr({
					url: '/supplytask/'+id,
					method: 'delete',
				}).then(res => {
					this.getSupplytasks();
					this.addNotification('success', 'Задание успешно удалено');
				});
			}
		},
		syncProducts() {
			this.products.sync = true;
			mpr({
				url: '/automation/products/sync'
			}).then(res => {
				this.updateDashboard();
				this.products.sync = false;
			}).catch(error => {
				this.products.sync = false;
				this.addNotification('error', 'Синхронизация затянулась, сообщу о завершение в телеграме' + JSON.stringify(error));
				// alert('Синхронизация затянулась, сообщу о завершение в телеграме');
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
				this.addNotification('error', 'Синхронизация затянулась, сообщу о завершение в телеграме' + JSON.stringify(error));
				// alert('Синхронизация затянулась, сообщу о завершение в телеграме');
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
				this.addNotification('error', 'Синхронизация затянулась, сообщу о завершение в телеграме' + JSON.stringify(error));
				// alert('Синхронизация затянулась, сообщу о завершение в телеграме');
			});
		},
		getSupplytasks() {
			mpr({
				url: '/supplytasks/list'
			}).then(res => {
				this.supplytasks = res.data;
			})
		},
		updateDashboard() {
			this.getSupplytasks();
			mpr({
				url: '/dashboard/'
			}).then(res => {
				if (res.data.dashboard !== undefined) {
					for (const item of res.data.dashboard) {
						let date = item.last_updated.split('z').length > 1 ? item.last_updated.slice(0,-5) : item.last_updated
						switch (item.name) {
							case 'warehouses': 
								this.warehouses.total = {
									qty: item.qty,
									date: moment(date).format('DD.MM.YYYY в hh:mm'),
								}
							break;
							case 'ozon': 
								this.warehouses.ozon = {
									qty: item.qty,
									date: moment(date).format('DD.MM.YYYY в hh:mm'),
								}
							break;
							case 'wb': 
								this.warehouses.wb = {
									qty: item.qty,
									date: moment(date).format('DD.MM.YYYY в hh:mm'),
								}
							break;
							default:
								this[item.name] = {
									qty: item.qty,
									date: moment(date).format('DD.MM.YYYY в hh:mm'),
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
</style>