<template>
  <div class="home">
    <Menu />
    <Header />
    <div class="content-with-menu">
      <div class="top-menu">
        <h2>3. Goals by warehouse</h2>
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
				<p v-if="!loaded">Загрузка контента...</p>
        <HelloWorld v-if="loaded" msg="Welcome to Your Vue.js App"/>
      </div>
    </div>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import Menu from '@/components/navigation/Menu.vue'
import Header from '@/components/navigation/Header.vue'
import mpr from './../tools/mpr'
import axios from 'axios'

export default {
  name: 'GoalsByWarehouseView',
  components: {
    HelloWorld, Menu, Header
  },
	data(){
		return {
			loaded: false,
			warehouses: [],
		}
	},
	mounted(){
		mpr({
			url: '/warehouses/all',
		}).then(response => {
			for (const item of response.data.result) {
				item.add = 0;
				this.warehouses.push(item);
			}
			this.loaded = true;
		}).catch((error) => {
	     console.log('error', error);
	  });
		console.log('mounted');
	},
}
</script>

