<template>
  <div class="home">
    <Menu />
    <Header />
    <div class="content-with-menu">
      <div class="top-menu">
        <h2>Задание к поставкам #{{supplytask.id}}</h2>
      </div>
      <div class="content">
				<Notifications />
				
        <h1></h1>
				<table>
					<thead>
						<tr>
							<th>#</th>
							<th>Склад</th>
							<th>Товара штук</th>
							<th>Дата создания</th>
							<th>Прогноз приемки</th>
							<th>Финальная дата приемки</th>
							<th>Мой склад</th>
							<th>Статус</th>
							<th>Действия</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{{supplytask.id}}</td>
							<td>{{supplytask.warehouse_name}}</td>
							<td>{{supplytask.qty_amount}}</td>
							<td>{{supplytask.start_date}}</td>
							<td>{{supplytask.estimated_date}}</td>
							<td>
								<button class="btn btn-transparent" @click="minus()">-1</button> {{dateInput}} <button class="btn btn-transparent" @click="plus()">+1</button>
								<br/>
								<button class="btn" type="submit" v-if="dateInput != supplytask.finish_date" @click="changeDate()">Сохранить</button>
							</td>
							<td><a v-if="supplytask.remote_id" :href="'https://online.moysklad.ru/app/#move/edit?id='+supplytask.remote_id">Перейти в мой склад</a></td>
							<td>
								<span v-if="supplytask.status_id == 10">Принято</span>
								<span v-else>Не принято</span>
							</td>
							<td>
								<button v-if="supplytask.status_id !== 10" class="btn btn-transparent" @click="changeStatus();">Принять</button>
							</td>
						</tr>
					</tbody>
				</table>
				<br/>
				<h2>Действия</h2>
				<ul style="text-align:left;">
				<li>
					<button class="btn" @click="syncMs()">Синхронизировать</button><br />
					<i>Загрузить позиции из моего склада в систему</i>
				</li>
				<!--li>
					<button class="btn">Удалить</button>
				</li-->
				</ul>

				<h2>Позиции</h2>
				<table class="table">
					<thead>
						<tr>
							<th>id</th>
							<th>Название</th>
							<th>Код</th>
							<th>Количество</th>
							<th>Действия</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="task in supplytask.positions">
							<td>{{task.product_id}}</td>
							<td>{{task.code}}</td>
							<td>{{task.name}}</td>
							<td>{{task.qty}}</td>
							<td><button @click="removePosition(task.id)">Удалить позицию {{task.id}}</button></td>
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

<style lang="scss">
	
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