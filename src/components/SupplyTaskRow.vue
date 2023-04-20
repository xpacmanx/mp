<script setup>
import { computed } from 'vue'
	
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
	}
})

const percent = computed(() => {
	const n = props.task[props.whtype + '_profitability'];
	if (n == '' || n == null) return '0%';
	let f = parseFloat(n);
	if (typeof f == 'number') {
		f *= 100;
		return f.toFixed(2) + '%';
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
	
	if (props.task.product_id == 12) console.log(props.task.stocks);
	
const stocks = props.task.stocks.filter(stock => stock.name.includes(name + whtype) && stock.region == props.region);
	qty = stocks.reduce((sum, s) => sum + s.qty, 0);
	return qty;
}

function getExactlyStocks(name) {
	let qty = 0;
	const stocks = props.task.stocks.find(stock => stock.name == name);
	if (stocks) qty = stocks.qty;
	return qty;
}

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
	return qty;
});

const lost = computed(() => {
	return Number(mainAndPacked.value) - Number(props.task.task);
});

</script>

<template>
  <tr>
		<td>{{task.product_id}}</td>
		<td>{{task.name}}</td>
		<td class="table__code">{{task.code}}</td>
		<td><input type="number" v-model="task.task" @input="handleUpdateGoal(task)" min="1" max="999" /></td>
		<td>?</td>
		<td>{{mainAndPacked}}</td>
		<td>{{currentWhQty}}</td>
		<td>{{task.days_to_ready}}</td>
		<td>?</td>
		<td>?</td>
		<td>?</td>
		<td>{{task.goal_days}}</td>
		<td>-</td>
		<td>-</td>
		<td>{{task.goal_toggle}}</td>
		<td>{{task.goal_priority}}</td>
		<td>{{task.goal_active}}</td>
		<td>{{getStocks('8 - В транзит на ')}}</td>
		<td>{{getStocks('7 - Готово по факту для ')}}</td>
		<td>{{getStocks('6 - Подготовить для ')}}</td>
		<td>{{ lost }}</td>
		<td>{{ percent }}</td>
		<td></td>
		<td></td>
		<td>{{task.master}}</td>
		<td>{{task[whtype + '_active_for_sell']}}</td>
		<td>{{task[whtype + '_sales7']}}</td>
		<td>{{task[whtype + '_sales30']}}</td>
		<td>{{task[whtype + '_sales_goal']}}</td>
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
