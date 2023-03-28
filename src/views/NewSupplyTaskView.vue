<template>
  <div class="home">
    <Menu />
    <Header />
    <div class="content-with-menu">
      <div class="top-menu">
        <h2>2. Подсорт для выбранного склада и что-то еще проверка на перенос строки</h2>
				<span v-if="!loaded">Загрузка складов...</span>
        <select v-if="loaded">
          <option v-for="warehouse in warehouses" :key="warehouse.id">{{warehouse.name}}</option>
        </select>
        <div>
          <button class="btn">Создать подсорт</button>
          <button class="btn btn-transparent">Предпросмотр</button>
        </div>
      </div>
      <div class="content">
        <HelloWorld msg="Welcome to Your Vue.js App"/>
      </div>
    </div>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import Menu from '@/components/navigation/Menu.vue'
import Header from '@/components/navigation/Header.vue'

import axios from 'axios'

export default {
  name: 'NewSupplyTaskView',
	data(){
		return {
			loaded: false,
			warehouses: [],
		}
	},
  components: {
    HelloWorld, Menu, Header
  },
	async mounted(){
		axios.get('https://robot.teslalasers.com/webhook/test/get/warehouses').then(response => {
		  for (const item of response.data.result) {
				item.add = 0;
				this.warehouses.push(item);
			}
			this.loaded = true;
		});
		//
		console.log('mounted');
	}
}
</script>

