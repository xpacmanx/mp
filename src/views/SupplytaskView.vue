<template>
  <div class="min-h-full bg-gray-50 dark:bg-gray-900">
    <Header />
    <div class="py-6">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
              Задание к поставкам #{{ supplytask.id }}
            </h1>
            <div class="flex space-x-3">
              <button 
                @click="syncMs()" 
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Синхронизировать
              </button>
            </div>
          </div>
        </div>

        <!-- Main Info Card -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-8">
          <div class="px-4 py-5 sm:p-6">
            <dl class="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Склад</dt>
                <dd class="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{{ supplytask.warehouse_name }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Товара штук</dt>
                <dd class="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{{ supplytask.qty_amount }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Статус</dt>
                <dd class="mt-1">
                  <span 
                    :class="[
                      'px-3 py-1 text-sm font-medium rounded-full',
                      supplytask.status_id === 10 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                    ]"
                  >
                    {{ supplytask.status_id === 10 ? 'Принято' : 'Не принято' }}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          <div class="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
            <dl class="grid grid-cols-1 gap-5 sm:grid-cols-4">
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Дата создания</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ supplytask.start_date }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Прогноз приемки</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ supplytask.estimated_date }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Финальная дата приемки</dt>
                <dd class="mt-1 flex items-center space-x-2">
                  <button @click="minus()" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                    </svg>
                  </button>
                  <span class="text-sm text-gray-900 dark:text-white">{{ dateInput }}</span>
                  <button @click="plus()" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <button 
                    v-if="dateInput != supplytask.finish_date"
                    @click="changeDate()"
                    class="ml-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    Сохранить
                  </button>
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Мой склад</dt>
                <dd class="mt-1">
                  <a 
                    v-if="supplytask.remote_id" 
                    :href="'https://online.moysklad.ru/app/#move/edit?id='+supplytask.remote_id"
                    class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                    target="_blank"
                  >
                    Перейти в мой склад
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div v-if="supplytask.status_id !== 10" class="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
            <button 
              @click="changeStatus()"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
            >
              Принять
            </button>
          </div>
        </div>

        <!-- Positions Table -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Позиции</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Название</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Код</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Количество</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Действия</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="task in supplytask.positions" :key="task.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ task.product_id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ task.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ task.code }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ task.qty }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button 
                      @click="removePosition(task.id)"
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <Notifications />
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
			id: 0,
			dateInput: '',
			supplytask: {
				
			},
		}
	},
	methods: {
		addNotification(type, text) {
			this.$store.dispatch('add', {type: type, text: text});
		},
		deleteTask(id) {
			mpr({
				url: '/supplytask/'+id,
				method: 'delete',
			}).then(res => {
				// console.log(res.data);
				this.getSupplytasks();
			});
		},
		getSupplytask(id) {
			mpr({
				url: '/supplytask/'+id,
			}).then(res => {
				if (res.data.length > 0) {
					this.supplytask = res.data[0];
					this.dateInput = this.supplytask.finish_date
				}
			})
		},
		plus(){
			let start = moment(this.dateInput);
			this.dateInput = start.add({days: 1}).format('YYYY-MM-DD'); 
		},
		minus(){
			let start = moment(this.dateInput);
			this.dateInput = start.add({days: -1}).format('YYYY-MM-DD'); 
		},
		changeDate(){
			this.addNotification('Пошло', 'Сейчас все поменяем');
			mpr({
				url: '/supplytasks/'+this.supplytask.id,
				method: 'put',
				data: {
					finish_date: this.dateInput,
				},
			}).then(res => {
				if (res.status == 200) {  // Assuming 200 is the success status code
						this.getSupplytask(this.supplytask.id);
		        this.addNotification('success', 'Все прошло хорошо');
		    } else {
		        this.addNotification('error', 'Something went wrong');
		    }
			})
			.catch(error => {
					this.addNotification('error', 'Failed to update the supply task');
			});
		},
		changeStatus(){
			let result = confirm('Проверьте, что принимаете правильное задание к поставкам. Подтверждаете?');
			if (result == false) return false;
			
			this.addNotification('Пошло', 'Сейчас все примем');
			mpr({
				url: '/supplytasks/'+this.supplytask.id,
				method: 'put',
				data: {
					status_id: 10,
				},
			}).then(res => {
				if (res.status == 200) {  // Assuming 200 is the success status code
						this.getSupplytask(this.supplytask.id);
		        this.addNotification('success', 'Все прошло хорошо');
		    } else {
		        this.addNotification('error', 'Something went wrong');
		    }
			})
			.catch(error => {
					this.addNotification('error', 'Failed to update the supply task');
			});
		},
		syncMs() {
			this.addNotification('default', 'Синхронизация началась, подожди чуток');
			const id = this.id;
			mpr({
				url: '/automation/ms/sync',
				params: {
					id: id
				},
			}).then(res => {
				this.addNotification('success', 'Синхронизация прошла успешно, обновил сапплайтаск');
				this.getSupplytask(id);
			}).catch(error => {
				this.addNotification('error', 'Что-то пошло не так - вот ошибка' + JSON.stringify(error));
				// alert('Синхронизация затянулась, сообщу о завершение в телеграме');
			});
		},
	},
	mounted() {
		this.id = this.$route.params.id;
		this.getSupplytask(this.$route.params.id);
	},
	created() {
    this.$watch(
      () => this.$route.params,
      (toParams, previousParams) => {
				if (this.$route.params.id > 0) {
					this.choose(this.$route.params.id);
				}
      }
    )
  }
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

.btn {
	@apply bg-lime-300 text-gray-950 px-4 py-2 rounded-md;
}
</style>