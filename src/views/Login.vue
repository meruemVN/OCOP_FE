<!-- Login.vue -->
<template>
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <img src="@/assets/logo.svg" alt="OCOP Market" class="mx-auto h-12 w-auto">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Đăng nhập vào tài khoản
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Hoặc
          <router-link to="/register" class="font-medium text-green-600 hover:text-green-500">
            đăng ký tài khoản mới
          </router-link>
        </p>
      </div>
  
      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form class="space-y-6" @submit.prevent="login">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div class="mt-1">
                <input 
                  id="email" 
                  type="email" 
                  v-model="email" 
                  required 
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
              </div>
            </div>
  
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <div class="mt-1">
                <input 
                  id="password" 
                  type="password" 
                  v-model="password" 
                  required 
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
              </div>
            </div>
  
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input 
                  id="remember-me" 
                  type="checkbox" 
                  v-model="rememberMe" 
                  class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                >
                <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                  Ghi nhớ đăng nhập
                </label>
              </div>
  
              <div class="text-sm">
                <a href="#" class="font-medium text-green-600 hover:text-green-500">
                  Quên mật khẩu?
                </a>
              </div>
            </div>
  
            <div>
              <button 
                type="submit" 
                :disabled="loading"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <LoadingSpinner v-if="loading" class="h-5 w-5 mr-2" />
                Đăng nhập
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>