<template>
  <div class="home">
    <Menu />
    <Header />
    <div class="content-with-menu">
      <div class="top-menu">
        <h2>4. Goals by product</h2>
				<span v-if="!loaded">Загрузка товаров...</span>
        <select v-if="loaded">
          <option v-for="product in products" :key="product.id">[{{product.code}}] {{product.name}}</option>
        </select>
        <div>
          <button class="btn">Создать подсорт</button>
          <button class="btn btn-transparent">Предпросмотр</button>
        </div>
      </div>
      <div class="content">
<!--         <HelloWorld msg="Welcome to Your Vue.js App"/> -->
      </div>
    </div>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import Menu from '@/components/navigation/Menu.vue'
import Header from '@/components/navigation/Header.vue'
import mpr from './../tools/mpr'

export default {
  name: 'GoalsByProductView',
  components: {
    HelloWorld, Menu, Header
  },
	data(){
		return {
			loaded: false,
			products: [],
			goals: [],
		}
	},
	mounted(){
		mpr({
			url: '/products/all',
		}).then(response => {
			for (const item of response.data.result) {
				item.add = 0;
				this.products.push(item);
			}
			this.loaded = true;
		}).catch((error) => {
	     console.log('error', error);
	  });
	},
}
</script>

