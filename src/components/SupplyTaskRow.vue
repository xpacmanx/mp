<script setup>
import moment from 'moment'
import { computed, defineEmits } from 'vue'

const emit = defineEmits(['onEdit','makeEdit'])
	
const props = defineProps({
  task: {
    type: Object,
    required: true
  },
	whname: {
		type: String,
		required: true
	},
	whtype: {
		type: String,
		required: true
	},
	region: {
		type: String,
		required: true
	},
	fromDate: {
		type: String,
		required: true
	},
	estimateDate: {
		type: String,
		required: true
	},
	supplytasks: {
		type: Object,
		required: true
	},
	regionWarehouses: {
		type: Object,
		required: true
	},
	warehouses: {
		type: Object,
		required: true
	},
})

function onEdit(prop, value) {
	// console.log(props.task);
  emit('onEdit', prop, value, props.task.product_id);
}

function makeEdit(prop, value) {
	// console.log(props.task);
  emit('makeEdit', prop, value, props.task.product_id);
}

const percent = computed(() => {
	const n = props.task[props.whtype + '_profitability'];
	if (n == '' || n == null) return '0%';
	let f = parseFloat(n);
	if (typeof f == 'number') {
		f *= 100;
		return f.toFixed(0) + '%';
	}
	else return '0%';
})

const countStocks = computed(() => {
	const type = props.whtype;
	return props.task.stocks.filter(a => a.type == type).length;
});

const countStocksQty = computed(() => {
	const type = props.whtype;
	let qty = 0;
	for (const stock of props.task.stocks) {
		if (stock.type != type) continue;
		qty += Number(stock.qty);
	}
	return qty;
});

const countRegionStocks = computed(() => {
	const type = props.whtype;
	let qty = 0;
	for (const stock of props.task.stocks) {
		if (stock.type != type) continue;
		if (stock.region != props.region) continue;
		qty += Number(stock.qty);
	}
	return qty;
});

const currentWhQty = computed(() => {
	const type = props.whtype;
	let qty = 0;
	let stock = props.task.stocks.find(stock => stock.name == props.whname);
	if (stock != undefined) qty = Number(stock.qty);
	return qty;
});

function getStocks(name) {
	let qty = 0;
	let whtype = props.whtype;
	if (whtype == 'wb') whtype = 'WB';
	if (whtype == 'ozon') whtype = 'Ozon';
	
const stocks = props.task.stocks.filter(stock => stock.name.includes(name + whtype) && stock.region == props.region);
	qty = stocks.reduce((sum, s) => sum + s.qty, 0);
	return qty;
}

function getStocksById(id) {
	let qty = 0;
	let whtype = props.whtype;
	if (whtype == 'wb') whtype = 'WB';
	if (whtype == 'ozon') whtype = 'Ozon';
	
const stocks = props.task.stocks.filter(stock => stock.wid == id);
	qty = stocks.reduce((sum, s) => sum + s.qty, 0);
	return qty;
}

function getExactlyStocks(name) {
	let qty = 0;
	const stocks = props.task.stocks.find(stock => stock.name == name);
	if (stocks) qty = stocks.qty;
	return qty;
}

const fbs = computed(() => {
	let type = props.whtype;
	return getExactlyStocks(`5 - ${type == 'wb' ? 'Wildberries' : 'OZON'} FBS`);
});
	
const fbsexpress = computed(() => {
	let type = props.whtype;
	return getExactlyStocks(`4 - Бронь для Ozon Express`);
});

const allTransit = computed(() => {
	let whtype = props.whtype;
	if (whtype == 'wb') whtype = 'WB';
	if (whtype == 'ozon') whtype = 'Ozon';

	let qty = 0;
	const stocks = props.task.stocks.filter(stock => stock.name.includes('8 - В транзит на ' + whtype));
	
	qty = stocks.reduce((sum, s) => sum + s.qty, 0);
	return qty;
});

const allPrepared = computed(() => {
	let whtype = props.whtype;
	if (whtype == 'wb') whtype = 'WB';
	if (whtype == 'ozon') whtype = 'Ozon';

	let qty = 0;
	const stocks = props.task.stocks.filter(stock => stock.name.includes('6 - Подготовить для ' + whtype) || stock.name.includes('7 - Готово по факту для ' + whtype));
	
	qty = stocks.reduce((sum, s) => sum + s.qty, 0);
	return qty;
});

const mainAndPacked = computed(() => {
	let qty = 0;
	for (const stock of props.task.stocks) {
		if (stock.name == 'Основной склад (Рассчет)') qty += stock.qty;
		if (stock.name == '2 - Упакованное') qty += stock.qty;
	}
	onEdit('mainAndPacked', qty);
	return qty;
});

const lost = computed(() => {
	return Number(mainAndPacked.value) - Number(props.task.task);
});

const goalNDays = computed(() => {
	let qty = 0;
	if (props.task.goal_sales_goal != null && props.task.goal_days != null) {
	qty = Math.round(Number(props.task.goal_sales_goal) / 30 * Number(props.task.goal_days));
	}
	onEdit('goalNDays', qty);
	return qty;
});

const ourStockAndMp = computed(() => {
	let qty = 0;
	qty += Number(mainAndPacked.value); //main and packed
	qty += Number(allPrepared.value); //prepared
	qty += Number(allTransit.value); //transit
	qty += Number(countStocksQty.value); //mp
	return qty;
});

const ourStockAndMpFbs = computed(() => {
	let qty = 0;
	qty += Number(ourStockAndMp.value);
	qty += Number(fbs.value);
	if (props.whtype == 'ozon') qty +=  Number(fbsexpress.value);
	return qty;
});

const salesPerDay = computed(() => {
	let qty = 0;
	const goals = props.task.goals.filter(goal => goal.region == props.region && goal.type == props.whtype)
	if (goals.length > 0) {
		// console.log(goals);
		qty = goals.reduce((sum, item) => sum + Number(item.sales_per_day), 0);
	}
	return qty;
});

function getGoalById(id) {
	// console.log('getGoalById');
	const goal = props.task.goals.find(goal => goal.warehouse_id == id);
	if (goal !== undefined) return goal.sales_per_day;
	return 0;
}


const countRegionDays = computed(() => {
	let days = 0;
	if (Number(countRegionStocks.value) > 0 && salesPerDay.value != undefined) {
		days = Number(countRegionStocks.value) / parseFloat(salesPerDay.value);
	}
	return Math.floor(days);
});

const groupByType = computed(() => {
	const result = {
		wb: {},
		ozon: {},
	};
	for (const w of props.warehouses) {
		if (result[w.type][w.region] == undefined) result[w.type][w.region] = [];
			result[w.type][w.region].push(w);
	}
	return result;
})

const countSupplyTaskByDate = computed(() => {
	const currentQty = Number(countRegionStocks.value);
	const sales_Per_Day = Number(salesPerDay.value);
	const from = moment(props.fromDate, 'DD.MM.YYYY');
	const to = moment(props.estimateDate, 'DD.MM.YYYY');
	const days = to.diff(from, 'days');
	const result = {qty: currentQty, messages: []}
	if (days > 0) {
		for (let i = 0; i <= days; i++) {
			const current = moment(from).add(i, 'days');
			const supplytasks = props.supplytasks.filter(task => moment(task.finish_date).isSame(current, 'day') && task.product_id == props.task.product_id);
			if (supplytasks.length > 0) {
				supplytasks.forEach(task => result.messages.push({
					id: task.id,
					date: moment(task.finish_date).format('DD.MM.YYYY'),
					qty: task.qty,
				}))
			}
			const incomeQty = supplytasks.reduce((sum, task) => task.qty, 0);
			result.qty += incomeQty;
			result.qty -= sales_Per_Day;
			if (result.qty < 0) result.qty = 0;
		}
	}
	result.qty = Math.floor(result.qty);
	return result;
});

function countSupplyTaskForWhId(id){
	const currentQty = getStocksById(id);
	const sales_Per_Day = getGoalById(id);
	const from = moment(props.fromDate, 'DD.MM.YYYY');
	const to = moment(props.estimateDate, 'DD.MM.YYYY');
	const days = to.diff(from, 'days');
	const result = {qty: 0};
	if (days > 0) {
		for (let i = 0; i <= days; i++) {
			const current = moment(from).add(i, 'days');
			const supplytasks = props.supplytasks.filter(task => moment(task.finish_date).isSame(current, 'day') && task.product_id == props.task.product_id && task.warehouse_id == id);

			const incomeQty = supplytasks.reduce((sum, task) => task.qty, 0);
			result.qty += incomeQty;
			result.qty -= sales_Per_Day;
			if (result.qty < 0) result.qty = 0;
		}
	}
	result.qty = Math.floor(result.qty);
	return result.qty;
}

function getGoalNdays(id) {
	const task = props.task.goals.find(g => g.warehouse_id == id);
	if (task == undefined) {
		return 0;
	}
	if (task.sales_goal != null && task.goal_days != null) {
		let qty = Math.round((Number(task.sales_goal) / 30) * Number(task.goal_days));
		return qty;
	}
	return 0;
}

const countSupplyTaskByDateDays = computed(() => {
	let days = 0;
	if (salesPerDay.value == 0 || salesPerDay.value == null) return "Infinity";
	if (countSupplyTaskByDate.value.qty > 0) {
		days = countSupplyTaskByDate.value.qty / salesPerDay.value;
	}
	return Math.floor(days);
});

function suggest(n) {
	makeEdit('task', n)
}

const suggestion = computed(() => {

	let qty = 0;
	const goal = Number(goalNDays.value);

	// Step 0
	if (goal == 0) {
		onEdit('suggestion', 0);
		return 0 + '(п0)';
	}

	// Step 1
	const regionalWarehousesIds = props.regionWarehouses.map(w => w.id);

	let amount1 = 0;
	if (props.task.goals.length > 0) {

		for (const id of regionalWarehousesIds) {
			amount1 += getGoalNdays(id) - countSupplyTaskForWhId(id);
		}

		if (amount1 <= 0) {
			onEdit('suggestion', 0);
			return 0 + ' (п1)';
		}
	}

	// Step 2

	if (props.task.goals.length > 0) {

		const sum = {
			wb: {},
			ozon: {},
		}
		for (const type in groupByType.value) {
			for (const region in groupByType.value[type]) {
				for (const w of groupByType.value[type][region]) {
					if (sum[type][region] == undefined) sum[type][region] = 0;
					sum[type][region] += getGoalNdays(w.id) - countSupplyTaskForWhId(w.id);
					if (sum[type][region] <= 0) sum[type][region] = 0;
				}
			}
		}
		let amount2 = 0;
		for (const region in sum[props.whtype]) {
			amount2 += sum[props.whtype][region];
		}

		// console.log(amount2)

		// Step 3
		const condition = Number(mainAndPacked.value) - amount2;
		if (condition < 0) {
			// TODO mark cell yellow
			const condition2 = (amount1 / amount2) * Number(mainAndPacked.value);
			if (condition2 <= 0) {
				onEdit('suggestion', 0);
				return 0;// + ' п3.1';
			}
			onEdit('suggestion', condition2);
			return Math.round(condition2) ' п3.1';
		} else {
			onEdit('suggestion', amount1);
			return Math.round(amount1); ' п3.2'; 
		}
		
	}

	onEdit('suggestion', qty);
	return qty;
});

// function handleUpdateTask (task) {
// 	this.$parent.handleUpdateTask(task);
// };

	function checkZero(){
		if (props.task.task == 0) props.task.task = '';
	}
	
	function makeZero(){
		if (props.task.task == '') props.task.task = 0;
	}

	function getMessages(messages) {
		return messages;
	}

</script>

<template>
  <tr>
		<td>{{task.product_id}}</td>
		<td>{{task.name}}</td>
		<td class="table__code">{{task.code}}</td>
		<td><input type="number" v-model.number="task.task" @focus="checkZero" @blur="makeZero" min="1" max="999" /></td>
		<td><a v-if="suggestion > 0" href="javascript://" @click="suggest(suggestion);">⬅️</a> {{suggestion}}</td>
		<td>{{mainAndPacked}}</td>
		<td>{{ lost }}</td>
		<td>{{currentWhQty}}</td>
		<td>{{ countRegionStocks }}</td>
		<td>{{ countRegionDays }}</td>
		<td>
			{{ countSupplyTaskByDate.qty }} 
			<div class="messages" v-if="countSupplyTaskByDate.messages.length > 0">
				<span>📋
					<ul class="messages__list">
						<li v-for="item in getMessages(countSupplyTaskByDate.messages)">
							{{item.date}}: {{item.qty}}шт
						</li>
					</ul>
				</span>
			</div>
		</td>
		<td>{{ countSupplyTaskByDateDays }}</td>
		<td>{{ task.goal_sales }}</td>
		<td>{{ goalNDays }}</td>
		
		<td>{{ percent }}</td>
		<td>{{task[whtype + '_active_for_sell']}}</td>
		<td>{{task[whtype + '_sales7']}}</td>
		<td>{{task[whtype + '_sales30']}}</td>
		<td>{{task[whtype + '_sales_goal']}}</td>
		

		<td>{{task.goal_toggle}}</td>
		<td>{{task.goal_priority}}</td>
		<td>{{task.goal_active}}</td>
		<td>{{getStocks('8 - В транзит на ')}}</td>
		<td>{{getStocks('7 - Готово по факту для ')}}</td>
		<td>{{getStocks('6 - Подготовить для ')}}</td>

		<td>{{ ourStockAndMp }}</td>
		<td>{{ ourStockAndMpFbs}}</td>
		<td>{{task.master}}</td>
		
		<td>{{task.goal_days}}</td>
		<td>{{task.days_to_ready}}</td>
		<td>{{countStocks}}</td>
		<td>{{countStocksQty}}</td>
		<td>{{allPrepared}}</td>
		<td>{{allTransit}}</td>
		<td>{{task.arrived1}}</td>
		<td>{{task.arrived2}}</td>
		<td>{{task.arrived3}}</td>
		<td>{{task.arrived4}}</td>
		<td>{{task.arrived5}}</td>
	</tr>
</template>

<style lang="scss">
.messages {
	display: inline;
	position: relative;
	
	&__list {
		display: none;
		position: absolute;
		background: #fff;
		padding: 10px;
		left: 15px;
		top: -10px;
		z-index: 1;
		border-radius: 5px;
		box-shadow: rgba(0,0,0,.1) 0 1px 2px;

		li {
			white-space: nowrap;
			list-style: none;
		}
	}
	
	span {
		font-size: 1.2em;
		cursor: pointer;
	
		&:hover {
			.messages__list {
				display: block;
			}
		}
	}
}
</style>