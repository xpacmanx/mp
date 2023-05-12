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

.process {
	padding: 10px;
	text-align: left;
	
	h3 {
		font-weight: bold;
	}

	ol {
		margin: 0;
		padding: 0;
		list-style-position: inside;
	}

	span {
		display: inline-block;
		border-left: #222 solid 2px;
		padding: 0px 5px;
		font-size: 0.8em;
		font-weight: bold;
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
	min-height: 80vh;
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

.container-table {
	overflow: scroll;
	position: relative;
	height: 100%;
	max-height: calc(100vh - 110px);
}

.table {
  width: 100%;
	overflow: scroll;
  border-collapse: collapse;

	&__title {
		min-width: 350px;
	}

	&__code {
		width: 100%;
		max-width: 120px;
		overflow: scroll;
		-ms-overflow-style: none;  /* IE and Edge */
	  scrollbar-width: none;  /* Firefox */
		
		&::-webkit-scrollbar {
		  display: none;
		}
	}

  tr, th, td {
    margin: 0;
    padding: 3px;
    border: rgba($dark-color, .1) solid 1px;
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

	td {
		font-size: 12px;
		line-height: 1.2em;
	}

	td:nth-child(3) {
		position: -webkit-sticky;
	  position: sticky;
	  left: 0;
		z-index: 1;
		background: $light-color;
	}

  td.editable {
    background: $super-light-color;
  }
  
  th {
    font-weight: bold;
    text-align: center;
    font-size: 0.6em;
    padding: 9px 5px;
		background: $light-color;
  }

	thead th {
	  position: -webkit-sticky;
	  position: sticky;
	  top: 0;
		z-index: 2;
	}
	
	tbody th {
	  position: -webkit-sticky;
	  position: sticky;
	  left: 0;
	}

	tr:hover, td:active {
		td {
			/*background: rgba(193, 255, 66, 0.05);*/
			background: #e5ffef;
		}
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
  padding-left: 70px;
}

.sorting {
	display: flex;
	flex-direction: row;
	margin-top: 10px;
	margin-bottom: -10px;
	justify-content: flex-end;
	font-size: 12px;

	span {
		margin-top: 5px;
		margin-left: 15px;
	}
	
	div {
		display: flex;
	}
	
	ul {
		display: flex;
		list-style: none;
    margin-left: 10px;
    padding: 0;
		
		li {
			cursor: pointer;
			background: #eee;
			border-radius: 10px;
			padding: 5px;
			list-style: none;
			margin-right: 5px;
		}
	}
}
</style>
