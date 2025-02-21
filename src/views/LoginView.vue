<template>
  <div class="home">
    <Header />

    <div class="container max-w-sm mx-auto">
        <h2 class="heading">Вход в систему</h2>
        <div class="login-form">
            <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
            </div>
            <label>Логин:</label>
            <input type="text" v-model="login" placeholder="user@teslalasers.com" @keyup.enter="signin" />
            <label>Пароль:</label>
            <input type="password" v-model="password" placeholder="***" @keyup.enter="signin" />
            <button type="button" @click="signin" :disabled="isLoading">
                {{ isLoading ? 'Вход...' : 'Войти' }}
            </button>
        </div>
    </div>
  </div>
</template>

<style lang="postcss">
.heading {
    @apply text-center text-3xl p-5 font-bold;
}

.login-form {
    @apply bg-gray-200 rounded-md p-5 mt-5 flex flex-col;

    label {
        @apply mb-1;
    }

    input {
        @apply border-gray-700 mb-5 p-2 rounded-md;
    }

    button {
        @apply bg-lime-300 p-2 rounded-md font-bold hover:bg-lime-200 disabled:opacity-50 disabled:cursor-not-allowed;
    }

    .error-message {
        @apply bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4;
    }
}
</style>

<script>
import Header from '@/components/navigation/Header.vue'
import { loginUser, getRedirectPath } from './../tools/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'LoginView',
  components: {
    Header
  },
  setup() {
    const router = useRouter()
    return { router }
  },
  data(){
    return {
      loaded: false,
      login: '',
      password: '',
      errorMessage: '',
      isLoading: false
    }
  },
  methods: {
    async signin(){
      if (!this.login || !this.password) {
        this.errorMessage = 'Пожалуйста, заполните все поля';
        return;
      }

      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        const result = await loginUser(this.login, this.password);
        if (result.success) {
          const redirectPath = getRedirectPath(this.router);
          this.router.push(redirectPath);
        }
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>
