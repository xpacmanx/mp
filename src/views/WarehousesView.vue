<template>
  <div class="home">
    <Menu />
    <Header />
    <div class="content-with-menu">
      <div class="top-menu">
        <h2>Склады</h2>
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
							<th>slug</th>
							<th>Тип</th>
							<th>Регион</th>
							<th>Группа</th>
							<th>slug_name</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="warehouse in warehouses" :key="warehouse.id">
							<td>{{warehouse.id}}</td>
							<td>{{warehouse.name}}</td>
							<td>{{warehouse.type}}</td>
							<td><input type="text" v-model="warehouse.slug" /></td>
							<td><input type="text" v-model="warehouse.region" /></td>
							<td><input type="text" v-model="warehouse.group" /></td>
							<td>{{warehouse.slug_name}}</td>
						</tr>
					</tbody>
				</table>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
  name: 'WarehousesView',
  components: {
    Menu, Header
  },
	data(){
		return {
			loaded: false,
			warehouses: [],
		}
	},
	methods: {
		loadProducts() {
			mpr({
				url: '/warehouses/all',
			}).then(response => {
				for (const item of response.data.result) {
					this.warehouses.push(item);
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
