<template>
  <div class="home">
    <Menu />
    <Header />
    <div class="content-with-menu">
      <div class="top-menu">
        <h2>Панель управления сервисом поставок</h2>
      </div>
      <div class="content">
				<Notifications />
				<div>
					Количество дней на подготовку:
					<select v-model.number="days_to_ready" @change="getDate()">
						<option>0</option>
						<option>1</option>
						<option>2</option>
						<option>3</option>
						<option>4</option>
						<option>5</option>
					</select>
				</div>
				<table class="table">
					<thead>
						<th>#</th>
						<th>Регион</th>
						<th>Приоритет</th>
						<th>Склад маркетплейса</th>
						<th>Кол-во наименований предлагаемых сервисом к возможной поставке сейчас</th>
						<th>Общее кол-во штук предлагаемых сервисом к возможной поставке сейчас</th>
						<th>Действия</th>
					</thead>
					<tbody>
						<tr v-for="item in data">
							<td>{{item.id}}</td>
							<td>{{item.region}}</td>
							<td>{{item.priority}}</td>
							<td>{{item.name}}</td>
							<td>{{item.suggestions_products}}</td>
							<td>{{item.suggestions}}</td>
							<td>
								<router-link :to="'/newsupplytask2/'+item.id">Создать поставку</router-link>
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
			data: {
				
			},
		}
	},
	methods: {
		addNotification(type, text) {
			this.$store.dispatch('add', {type: type, text: text});
		},
		
		getData() {
			mpr({
				url: '/supplytasks/dashboard',
				params: {
					days_to_ready: this.days_to_ready
				},
			}).then(res => {
				if (res.status == 200) {
					this.data = res.data.result.data;
					this.days_to_ready = res.data.result.days_to_ready;
				} else {
					this.addNotification('error', 'Что-то пошло не так - вот ошибка' + JSON.stringify(error));
				}
			}).catch(error => {
				this.addNotification('error', 'Что-то пошло не так - вот ошибка' + JSON.stringify(error));
			});
		},
	},
	mounted() {
		this.getData();
	},
	created() {
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