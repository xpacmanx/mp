<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

      <!-- Modal panel -->
      <div class="relative inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
        <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                Требуется повторная авторизация
              </h3>
              <div class="mt-4">
                <div v-if="errorMessage" class="mb-4 rounded-md bg-red-50 p-4">
                  <div class="text-sm text-red-700">{{ errorMessage }}</div>
                </div>
                <div class="space-y-4">
                  <div>
                    <label for="login" class="block text-sm font-medium text-gray-700">Логин</label>
                    <input type="text" id="login" v-model="login" 
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500 sm:text-sm"
                           @keyup.enter="handleLogin" />
                  </div>
                  <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Пароль</label>
                    <input type="password" id="password" v-model="password" 
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500 sm:text-sm"
                           @keyup.enter="handleLogin" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button type="button" 
                  @click="handleLogin"
                  :disabled="isLoading"
                  class="inline-flex w-full justify-center rounded-md border border-transparent bg-lime-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isLoading ? 'Вход...' : 'Войти' }}
          </button>
          <button type="button" 
                  @click="$emit('close')"
                  class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
            Отмена
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loginUser } from '../tools/auth'

export default {
  name: 'LoginModal',
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      login: '',
      password: '',
      errorMessage: '',
      isLoading: false
    }
  },
  methods: {
    async handleLogin() {
      if (!this.login || !this.password) {
        this.errorMessage = 'Пожалуйста, заполните все поля';
        return;
      }

      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        const result = await loginUser(this.login, this.password);
        if (result.success) {
          this.$emit('success');
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