<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th>#</th>
        <th>Заголовок</th>
        <th>Код МС</th>
        <th>Что-то еще</th>
        <th>Что-то еще</th>
        <th>Что-то еще</th>
        <th>Что-то еще</th>
        <th>Что-то еще</th>
        <th>Что-то еще</th>
        <th>Что-то еще</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Автосканер</td>
        <td class="editable">Scanner02</td>
        <td>Залупа</td>
        <td>Залупа</td>
        <td>Залупа</td>
        <td>Залупа</td>
        <td>Залупа</td>
        <td>Залупа</td>
        <td>Залупа</td>
      </tr>
      <tr>
        <td>2</td>
        <td>Рюкзак для кошек</td>
        <td class="editable">Backpack02</td>
        <td>Залупа</td>
        <td>Залупа</td>
        <td>Залупа</td>
        <td>Залупа</td>
        <td>Залупа</td>
        <td>Залупа</td>
        <td>Залупа</td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss">
@import "./src/scss/_variables.scss";
  
.table {
  width: 100%;
  border-collapse: collapse;

  tr, th, td {
    margin: 0;
    padding: 5px;
    border: rgba($dark-color, 0.1) solid 1px;
    border-collapse: collapse;
    background: rgba($dark-color, .02);
  }

  td.editable {
    background: $super-light-color;
  }
  
  th {
    font-weight: bold;
    text-align: center;
    font-size: 0.8em;
    padding: 9px 5px;
  }
}
  
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
