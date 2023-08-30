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
				<table class="table">
					<thead>
						<th>#</th>
						<th>Склад</th>
						<th>Товара штук</th>
						<th>Вес</th>
						<th>Дата создания</th>
						<th>Прогноз приемки</th>
						<th>Финальная дата приемки</th>
						<th>Мой склад</th>
						<th>Действия</th>
					</thead>
					<tbody>
						<tr>
							<td>{{supplytask.id}}</td>
							<td>{{supplytask.warehouse_name}}</td>
							<td>{{supplytask.qty_amount}}</td>
							<td>{{supplytask.weight_amount}}</td>
							<td>{{supplytask.start_date}}</td>
							<td>{{supplytask.estimated_date}}</td>
							<td>{{supplytask.finish_date}}</td>
							<td><a v-if="supplytask.remote_id" :href="'https://online.moysklad.ru/app/#move/edit?id='+supplytask.remote_id">Перейти в мой склад</a></td>
							<td>
								<!--a href="javascript://">Удалить</a-->		
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
						<th>id</th>
						<th>Название</th>
						<th>Код</th>
						<th>Количество</th>
						<th>Действия</th>
					</thead>
					<tbody>
						<tr v-for="task in supplytask.positions">
							<td>{{task.product_id}}</td>
							<td>{{task.code}}</td>
							<td>{{task.name}}</td>
							<td>{{task.qty}}</td>
							<td>
								
								<!--a href="javascript://" @click="deleteTask(task.id)">Удалить</a-->		
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
  name: 'HomeView',
  components: {
  	Menu, Header, Notifications
  },
	data() {
		return {
			id: 0,
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
				}
			})
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