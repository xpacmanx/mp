<template>
  <router-view/>
</template>

<style lang="scss">
@import "./scss/_variables.scss";
  
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;700&display=swap');
  
#app {
  background: $super-light-color;
  font-family: Rubik, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $dark-color;
}

a {
  color: $main-color;

  &:hover {
    color: $accent-color;
  }
}

.top-menu {
  background: lighten($light-color, 50%);
  height: 70px;
  padding: 20px 30px;
  display: flex;
  align-items: center;
  text-align: left;
  border-bottom: rgba($dark-color, 0.1) solid 1px;
  justify-content: space-between;

  h2 {
    font-size: 1em;
    font-weight: bold;
    max-width: 400px;
    line-height: 1em;
    margin-right: 20px;
  }
  .btn {
    margin-right: 10px;
  }
  select {
    margin-right: 10px;
  }
}

.content {
	width: 100%;
  padding: 20px;
	overflow: scroll;
}

.btn {
  display: inline-block;
  background: $main-color;
  border: $main-color solid 1px;
  border-radius: 3px;
  font-size: .8em;
  font-weight: bold;
  padding: 6px 15px;
  color: $super-light-color;
  text-transform: uppercase;
}

.btn-transparent {
  background: transparent;
  color: $main-color;
}

.table {
  width: 100%;
	overflow: scroll;
  border-collapse: collapse;

  tr, th, td {
    margin: 0;
    padding: 5px;
    border: rgba($dark-color, 0.1) solid 1px;
    border-collapse: collapse;
    background: rgba($dark-color, .02);

		input {
			width: 100%;
			text-align: center;
			appearance: none;
			border: #ccc solid 1px;
			font-size: 1em;
			height: 100%;
		}

		input::-webkit-outer-spin-button,
		input::-webkit-inner-spin-button {
		  -webkit-appearance: none;
		  margin: 0;
		}
  }

  td.editable {
    background: $super-light-color;
  }
  
  th {
    font-weight: bold;
    text-align: center;
    font-size: 0.6em;
    padding: 9px 5px;
  }
}

nav {

  a {
    font-weight: bold;
    color: $main-color;

    &.router-link-exact-active {
      color: $accent-color;
    }
  }
}

.content-with-menu {
  padding-left: 100px;
}
</style>
