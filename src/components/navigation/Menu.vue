<script setup>
</script>

<template>
  <nav class="menu">
    <li>
      <div class="logo">
        <router-link to="/"><img src="./../../assets/logo.svg" /></router-link>
      </div>
    </li>
<!--     <li>
      <router-link to="/">Home</router-link>
    </li>
		<li>
      <router-link to="/">
        <i>1</i>
        <span>-</span>
      </router-link>
    </li>-->
    <li>
      <router-link to="/newsupplytask">
        <i>2</i>
        <span>Подсорт для выбранного склада</span>
      </router-link>
    </li>
    <li>
      <router-link to="/goalsbywarehouse">
        <i>3</i>
        <span>Цели факты для выбранного склада</span>
      </router-link>
    </li>
<!--    <li>
      <router-link to="/goalsbyproduct">
        <i>4</i>
        <span>Цели и факты для выбранного товара</span>
      </router-link>
    </li>-->
  </nav>
</template>

<style lang="scss" scoped>
@import "./src/scss/_variables.scss";
  
.menu {
  position: fixed;
  list-style: none;
  background: $light-color;
  z-index: 1;
  height: 100%;
  bottom: 0;
  top: 0;
  
  li {
    text-align: center;
    list-style: none;
    margin: 0;

    .logo {
      height: 70px;
      background: $dark-color;
  
      img {
        margin-top: 10px;
        width: 50px;
      }
  
    }
  
    a {
      display: block;
      padding: 0 10px;
      height: 70px;
      text-align: center;
      color: $dark-color;
      border-bottom: rgba($dark-color, 0.2) solid 1px;

      &:hover {
        span {
          display: inline-block;
        }
      }
  
      i {
        font-style: normal;
        font-weight: bold;
        font-size: 3em;
        line-height: 70px;
      }

      span {
        background: $light-color;
        position: absolute;
        width: 200px;
        left: 80px;
        line-height: 1.2em;
        padding: 10px;
        display: none;
      }
  
    }
  }
}  
</style>
