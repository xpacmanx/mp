<template>
  <div class="min-h-full dark:bg-gray-900">
    <Header />
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			
      <div class="flex items-top justify-between my-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white text-left">Список складов рекомендованные к поставкам</h2>
				<div class="flex flex-col">
					<label class="block text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">Количество дней на подготовку:</label>
					<select v-model.number="days_to_ready" @change="getDate()" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
						<option value="0">0 дней (сразу)</option>
						<option value="1">1 дня</option>
						<option value="2">2 дня</option>
						<option value="3">3 дня</option>
						<option value="4">4 дня</option>
						<option value="5">5 дня</option>
					</select>
				</div>
      </div>
			
      <div class="">
				<Notifications />

        <div v-if="isLoading" class="flex items-center gap-2 mb-4 text-sm text-blue-700 dark:text-blue-300">
          <span class="inline-flex h-3 w-3 animate-pulse rounded-full bg-blue-500"></span>
          <span>Формируем данные по поставкам, пожалуйста подождите… (попытка {{ retryCount }} из {{ maxRetries }})</span>
        </div>

        <div v-if="statusMessage && !isLoading" class="mb-4 text-sm text-yellow-700 dark:text-yellow-300">
          {{ statusMessage }}
        </div>
				
				<table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
					<thead class="text-xs text-gray-950 bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
						<tr>
							<th scope="col" class="px-6 py-3">#</th>
							<th scope="col" class="px-6 py-3">Регион</th>
							<th scope="col" class="px-6 py-3">Приоритет</th>
							<th scope="col" class="px-6 py-3">Склад маркетплейса</th>
							<!--th>Нехватка в регионе, на сегодня, %</th>
							<th>Излишки в регионе, на сегодня, %</th-->
							<th scope="col" class="px-6 py-3">Кол-во наименований предлагаемых сервисом к возможной поставке сейчас</th>
							<th scope="col" class="px-6 py-3">Общее кол-во штук предлагаемых сервисом к возможной поставке сейчас</th>
							<th scope="col" class="px-6 py-3">Действия</th>
						</tr>
					</thead>
					<tbody>
						<tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-100 even:dark:bg-gray-800 border-b dark:border-gray-700" v-for="item in data">
							<td class="px-6 py-4">{{item.id}}</td>
							<td class="px-6 py-4 whitespace-nowrap text-gray-950 dark:text-gray-200">{{item.region}}</td>
							<td class="px-6 py-4">{{item.priority}}</td>
							<td class="px-6 py-4 whitespace-nowrap text-gray-950 dark:text-gray-200">{{item.name}}</td>
							<!--td>{{toPercent(item.deficit)}}</td>
							<td>{{toPercent(item.proficit)}}</td-->
							<td class="px-6 py-4">{{item.suggestions_products}}</td>
							<td class="px-6 py-4">{{item.suggestions}}</td>
							<td class="px-6 py-4">
								<router-link :to="'/newsupplytask2/'+item.id" class="bg-lime-300 p-2 whitespace-nowrap rounded-md text-gray-950">Создать поставку</router-link>
							</td>
						</tr>
					</tbody>
				</table>

      </div>
    </div>
  </div>
</template>

<script>
import Menu from '@/components/navigation/Menu.vue'
import Header from '@/components/navigation/Header.vue'
import Notifications from '@/components/Notifications.vue'
import mpr from './../tools/mpr'
import moment from 'moment'
	
export default {
  name: 'SupplytasksDashboardView',
  components: {
  	Menu, Header, Notifications
  },
	data() {
		return {
			days_to_ready: 2,
			data: [],
      isLoading: false,
      retryCount: 0,
      maxRetries: 10,
      pollTimeoutId: null,
      statusMessage: '',
		}
	},
	methods: {
		addNotification(type, text) {
			this.$store.dispatch('add', {type: type, text: text});
		},

		toPercent(num){
			return (num*10).toFixed(2) + '%'
		},
    
    clearPollTimeout() {
      if (this.pollTimeoutId) {
        clearTimeout(this.pollTimeoutId);
        this.pollTimeoutId = null;
      }
    },

		getData(isRetry = false) {
			// const data = {
			// 		"result": {
			// 				"days_to_ready": 2,
			// 				"data": [
			// 						{
			// 								"id": 11,
			// 								"name": "WB МСК Коледино",
			// 								"region": "Москва",
			// 								"deficit": 0.293313786208446,
			// 								"proficit": 0.25295119775636665,
			// 								"type": "wb",
			// 								"ship_days": 3,
			// 								"priority": 1,
			// 								"estimated_date": 5,
			// 								"estimated_avl": 0,
			// 								"suggestions_products": 25,
			// 								"suggestions": 82,
			// 								"region_goal_value": 11448572
			// 							},
			// 					]
			// 			}
			// 	};
			
			// this.data = data.result.data;
			// this.days_to_ready = data.result.days_to_ready;
			// return true;
      
      if (!isRetry) {
        this.retryCount = 0;
        this.statusMessage = '';
      }

      this.isLoading = true;
      this.clearPollTimeout();

			mpr({
				url: '/supplytasks/dashboard',
				params: {
					days_to_ready: this.days_to_ready
				},
			}).then(res => {
				if (res.status === 200) {
          const result = res.data && res.data.result ? res.data.result : res.data;

          if (result && result.status === 'updating') {
            if (this.retryCount < this.maxRetries) {
              this.retryCount += 1;
              this.statusMessage = 'Сервер обновляет данные, повторяем запрос…';
              this.pollTimeoutId = setTimeout(() => {
                this.getData(true);
              }, 20000);
            } else {
              this.isLoading = false;
              this.statusMessage = '';
              this.addNotification('error', 'Данные по поставкам не успели сформироваться. Попробуйте позже.');
            }
          } else if (result && result.status === 'error') {
            this.isLoading = false;
            this.statusMessage = '';
            this.addNotification('error', 'Ошибка при формировании данных по поставкам.');
          } else if (result && result.data) {
            this.data = result.data;
            if (typeof result.days_to_ready !== 'undefined') {
              this.days_to_ready = result.days_to_ready;
            }
            this.isLoading = false;
            this.statusMessage = '';
          } else {
            this.isLoading = false;
            this.statusMessage = '';
            this.addNotification('error', 'Некорректный ответ от сервера.');
          }
				} else {
          this.isLoading = false;
          this.statusMessage = '';
					this.addNotification('error', 'Что-то пошло не так - вот ошибка ' + JSON.stringify(res));
				}
			}).catch(error => {
        this.isLoading = false;
        this.statusMessage = '';
				this.addNotification('error', 'Что-то пошло не так - вот ошибка' + JSON.stringify(error));
			});
		},
	},
	mounted() {
		this.getData();
	},
  beforeUnmount() {
    this.clearPollTimeout();
  },
}
</script>

<style lang="postcss">
	
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
	}
}
</style>