<template>
  <div class="home">
    <Menu />
    <Header />
    <div class="content-with-menu">
      <div class="top-menu">
        <h2>2. Подсорт для выбранного склада</h2>
				<span v-if="!warehouses_loaded">Загрузка складов...</span>
        <select v-if="warehouses_loaded" @change="wChange($event)">
          <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id" :selected="warehouse.id == current_warehouse.id">{{warehouse.id}}. {{warehouse.name}}</option>
        </select>
				
        <div>
          <button class="btn">Создать подсорт</button>
          <button class="btn btn-transparent">Предпросмотр</button>
        </div>
      </div>
      <div class="content">
				<p v-if="!loaded">Загрузка контента...</p>
        <table v-if="loaded" class="table">
					<thead>
						<tr>
							<th>#</th>
							<th>Название товара</th>
							<th>Код</th>
							<th>Программа предлагает Переместить в Подготовить</th>
							<th>Основной склад + Упакованное (расчет)</th>
							<th>Находится</th>
							<th>Срок подготовки товара к отгрузке, дней (подгружается из МС)</th>
							<th>На сколько дней находится на выбранном складе сейчас</th>
							<th>Расчетное наличие на день приемки [сегодняшняя дата + срок поставки] без текущей поставки</th>
							<th>На сколько дней будет на день приемки [сегодняшняя дата + срок поставки] без текущей поставки</th>
							<th>Наличие на какое кол-во дней должно быть (N)</th>
							<th>Кол-во продаж за N дней</th>
							<th>Рассчетно от факта за 30 дней</th>
							<th>Кол-во продаж за N дней Цель</th>
							<th>Статус переключателя Цель/Факт</th>
							<th>Приоритет склада</th>
							<th>Планируем ли дальше продавать на этом складе</th>
							<th>В транзите</th>
							<th>Готово по факту</th>
							<th>Подготовить</th>
							<th>Останется после перемещения</th>
							<th>WB Текущая доходность</th>
							<th>Осталось товара (наш склад + транзит + МП)</th>
							<th>Осталось товара (наш склад + транзит WB + FBW + FBS WB)</th>
							<th>Мастер</th>
							<th>WB Планируем ли и дальше продавать</th>
							<th>WB Кол-во продаж за 7 дней</th>
							<th>WB Кол-во продаж за 30 дней</th>
							<th>WB Целевое кол-во продаж в месяц</th>
							<th>WB На скольки складах есть товар</th>
							<th>WB Осталось товара складах маркетплейса</th>
							<th>WB Товар в офисе, распределенный для МП</th>
							<th>WB Товар в транзите МП</th>
							<th>Ожидание товара 1я неделя</th>
							<th>Ожидание товара 2я неделя</th>
							<th>Ожидание товара 3я неделя</th>
							<th>Ожидание товара 4я неделя</th>
							<th>Ожидание товара 5я неделя</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(goal,i) in goals" :key="goal.product_id">
							<td>{{goal.product_id}}</td>
							<td>{{goal.name}}</td>
							<td>{{goal.code}}</td>
							<td><input type="number" v-model.number="goal.priority" @input="handleUpdateGoal(goal)" min="1" max="10" /></td>
							<td>{{goal.days_to_ready}}</td>
							<td>{{Number(goal.days_to_ready) + Number(current_warehouse.ship_days)}}</td>
							<td><input type="number" v-model.number="goal.goal_days" @input="handleUpdateGoal(goal)" min="1" max="60" /></td>
							<td><input type="number" v-model.number="goal.active_for_sell" @input="handleUpdateGoal(goal)" min="0" max="1" /></td>
							<td><input type="number" v-model.number="goal.sales_goal" @input="handleUpdateGoal(goal)" /></td>
							<td><input type="number" v-model.number="goal.season_koef" @input="handleUpdateGoal(goal)" /></td>
							<td>{{goal.season_koef > 0 ? goal.sales_goal * goal.season_koef : goal.sales_goal}}</td>
							<td><input type="number" v-model.number="goal.goal_sale_toggle" @input="handleUpdateGoal(goal)" /></td>
							<td>{{goal.sales}}</td>
							<td>{{niceDate(goal.last_updated)}}</td>
							<td>{{goal[current_warehouse.type + '_profitability']}}</td>
							<td>{{goal.master}}</td>
							<td>{{goal[current_warehouse.type + '_active_for_sell']}}</td>
							<td>{{goal[current_warehouse.type + '_sales7']}}</td>
							<td>{{goal[current_warehouse.type + '_sales30']}}</td>
							<td>{{goal[current_warehouse.type + '_sales_goal']}}</td>
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
import mpr from './../tools/mpr'
import moment from 'moment'
	
export default {
  name: 'NewSupplyTaskView',
	data(){
		return {
			warehouses_loaded: false,
			loaded: true,
			saving: false,
			current_warehouse: {},
			warehouses: [],
			goals_updates: [],
			goals: [],
		}
	},
  components: {
    Menu, Header
  },
	mounted(){
	}
}
</script>

