<script setup>
import { computed, defineEmits } from 'vue'
import { ChevronUpDownIcon } from '@heroicons/vue/24/outline'
const emit = defineEmits(['onSort']);
	
const props = defineProps({
  filters: {
    type: Object,
    required: true
  },
	sorting: {
		type: Object,
		required: true
	},
	name: {
		type: String,
		required: true
	}
})

function checkActive(type, direction) {
	let flag = false;
	for (const item of props[type]) {
		if (item.name == props.name) {
			if (direction != undefined) {
				if (item.direction != direction) continue;
			}
			flag = true;
		}
	}
	return flag;
}

function checkActiveAny() {
	let flag  = true;
	for (const item of props.sorting) {
		if (item.name == props.name) flag = false;
	}
	for (const item of props.filters) {
		if (item.name == props.name) flag = false;
	}
	return flag;
}

function onSort(type, direction) {
  emit('onSort', type, props.name, direction);
}

function sort(direction) {
	// console.log(direction);
	onSort('sort', direction);
}

function filter() {
	onSort('filter');
}

</script>

<template>
<div class="button-sort">
	<span v-if="checkActiveAny()" class="button-sort__icon"><ChevronUpDownIcon class="w-5 h-5"/></span>
	<span v-else class="button-sort__icon"><ChevronUpDownIcon class="w-5 h-5 stroke-blue-500"/></span>
	<ul class="sorting-menu z-40">
		<li :class="checkActive('sorting', 'asc') ? 'active' : ''" @click="sort('asc')">Сортировать A-Z</li>
		<li :class="checkActive('sorting', 'desc') ? 'active' : ''" @click="sort('desc')">Сортировать Z-A</li>
		<li :class="checkActive('filters') ? 'active' : ''" @click="filter()">Убрать нулевые значения</li>
	</ul>
</div>
</template>

<style lang="postcss">
	
.button-sort {
	@apply mb-2;

	&__icon {	
		font-size: 14px;
	}

	&:hover {
		.sorting-menu {
			display: block;
		}
	}
	.sorting-menu {
		position: absolute;
		display: none;
		list-style: none;
		margin-left: 20px;
        margin-top: -20px;
    }
	ul {
		@apply bg-gray-50 rounded-md;

		li {
			padding: 10px;
			min-width: 200px;
			font-weight: bold;
			font-size: 12px;
			
			@apply hover:text-gray-600 hover:bg-white;

			&.active {
				color: #be1616;
			}

			&:hover {
				cursor: pointer;

			}
		}
	}
}
</style>
