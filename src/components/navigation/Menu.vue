<script setup>
</script>

<template>
</template>

<style lang="postcss" scoped>
  
.menu {
  position: fixed;
  list-style: none;
  z-index: 3;
  height: 100%;
  bottom: 0;
  top: 0;
  
  li {
    text-align: center;
    list-style: none;
    margin: 0;

    .logo {
      height: 70px;
  
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
        position: absolute;
        width: 200px;
        left: 70px;
        line-height: 1.2em;
        padding: 10px;
        display: none;
      }
  
    }
  }
}  
</style>
