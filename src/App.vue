<template>
  <div id="app">
    <div v-if="isLoading" class="loading-screen">
      <div class="loading-spinner"></div>
      <p>Загрузка...</p>
    </div>
    <div v-else>
      <AuthManager />
      <AuthGuard>
        <router-view></router-view>
      </AuthGuard>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import AuthManager from '@/components/auth/AuthManager.vue'
import AuthGuard from '@/components/auth/AuthGuard.vue'
import Header from '@/components/navigation/Header.vue'
import { authEvents } from '@/router'
import { wasAuthenticated } from '@/tools/userState'

export default {
  name: 'App',
  components: {
    AuthManager,
    AuthGuard,
    Header
  },
  setup() {
    const isLoading = ref(true)

    onMounted(() => {
      console.log('App mounted, starting loading timer')
      
      // Проверяем токены при загрузке
      const token = localStorage.getItem('authToken')
      const refreshToken = localStorage.getItem('refreshToken')
      
      console.log('App initial auth check:', { 
        hasToken: !!token, 
        hasRefreshToken: !!refreshToken,
        wasAuthenticated: wasAuthenticated.value 
      })
      
      // Показываем модальное окно логина только если пользователь был авторизован ранее
      // или если токен истек (потеря токена)
      if ((!token || !refreshToken) && wasAuthenticated.value) {
        console.log('User was authenticated before, showing login modal')
        setTimeout(() => {
          authEvents.emit('tokenExpired')
        }, 200) // Даем время AuthManager инициализироваться
      }
      
      // Имитируем загрузку для предотвращения мерцания
      setTimeout(() => {
        console.log('App loading completed')
        isLoading.value = false
      }, 100)
    })

    return {
      isLoading
    }
  }
}
</script>

<style lang="postcss">
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;700&display=swap');
  
#app {
	font-family: Rubik, sans-serif;
}

.loading-screen {
  @apply fixed inset-0 bg-gray-900 flex items-center justify-center z-50;
}

.loading-spinner {
  @apply w-8 h-8 border-4 border-lime-300 border-t-transparent rounded-full animate-spin;
}

.loading-screen p {
  @apply text-lime-300 mt-4 text-lg;
}

a {
  @apply text-lime-500 hover:text-lime-300;
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
  height: 70px;
  padding: 20px 30px;
  display: flex;
  align-items: center;
  text-align: left;
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
  border-radius: 3px;
  font-size: .8em;
  font-weight: bold;
  padding: 6px 15px;
  text-transform: uppercase;
}

.btn-transparent {
  background: transparent;
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
    border-collapse: collapse;

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
	}
  
  th {
    font-weight: bold;
    text-align: center;
    font-size: 0.6em;
    padding: 9px 5px;
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
  }
}


</style>
