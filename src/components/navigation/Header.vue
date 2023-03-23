<script setup>
</script>

<template>
  <header class="header">
    <div class="User">Пользователь 1</div>
  </header>
</template>

<style lang="scss" scoped>
@import "./src/scss/_variables.scss";

.header {
  background: $main-color;
  padding: 10px;
  color: $light-color;
  display: flex;
  flex-direction: row;
  display: none;

  .logo {
    img {
      width: 25px;
    }
  }
}

</style>
