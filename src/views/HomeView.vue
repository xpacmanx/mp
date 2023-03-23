<template>
  <div class="home">
    <Menu />
    <Header />
    <div class="content-with-menu">
      <div class="top-menu">
        <h2>Главная страница</h2>
        <select>
          <option>Коледино</option>
          <option>Санкт-Петербург</option>
        </select>
        <div>
          <button class="btn">Создать подсорт</button>
          <button class="btn btn-transparent">Предпросмотр</button>
        </div>
      </div>
      <div class="content">
        <h1>Dashboard</h1>
      </div>
    </div>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import Menu from '@/components/navigation/Menu.vue'
import Header from '@/components/navigation/Header.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld, Menu, Header
  }
}
</script>

