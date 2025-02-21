<template>
  <div class="home">
    <Menu />
    <Header />
    <div class="content-with-menu">
      <div class="top-menu">
        <h2>Связи</h2>
        <div>
          <button class="btn">Сохранить</button>
        </div>
      </div>
      <div class="content">
				<table class="table">
					<thead>
						<tr>
							<th>id</th>
							<th>Название</th>
							<th>Код</th>
							<th>Артикул WB</th>
							<th>Ozon ID</th>
							<th>Ozon FBW SKU</th>
							<th>Мой Склад ID</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="product in products" :key="product.id">
							<td>{{product.id}}</td>
							<td>{{product.name}}</td>
							<td>{{product.code}}</td>
							<td :class="product.wbid ? '' : 'wrong'"><input type="text" v-model="product.wbid" /></td>
							<td :class="product.ozonid ? '' : 'wrong'"><input type="text" v-model="product.ozonid" /></td>
							<td :class="product.ozonsku ? '' : 'wrong'"><input type="text" v-model="product.ozonsku" /></td>
							<td :class="product.msid ? '' : 'wrong'"><input type="text" v-model="product.msid" /></td>
						</tr>
					</tbody>
				</table>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.wrong {
	background: #ff8893;

	input {
		border: #ddd solid 1px;
		background: transparent;
	}	
}
</style>

<script>
import Header from '@/components/navigation/Header.vue'
import Menu from '@/components/navigation/Menu.vue'
import mpr from './../tools/mpr'

export default {
  name: 'ConnectionsView',
  components: {
    Menu, Header
  },
	data(){
		return {
			loaded: false,
			products: [],
		}
	},
	methods: {
		loadProducts() {
			mpr({
				url: '/products/all',
			}).then(response => {
				for (const item of response.data.result) {
					this.products.push(item);
				}
				this.loaded = true;
			}).catch((error) => {
		     console.log('error', error);
		  });
		},
	},
	mounted(){
		this.loadProducts();
	}
}
</script>
