<script setup>
import { computed } from 'vue'
	
defineProps({
  task: {
    type: Object,
    required: true
  },
	whname: {
		type: String,
		required: true
	},
	whtype: {
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
