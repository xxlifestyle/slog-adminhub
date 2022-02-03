<template>
  <div class="app-login">
    <div class="login-form">
      <q-form @submit.prevent="enterAdmin">
        <div class="login-header">
        <img src="@/assets/icon.png" class="icon-login" alt="Логин" />
          <h2 class="title">SLOG-ADMIN</h2>
        </div>
        <q-input required class="login-input" :dense="true"  type="text" outlined v-model="username" label="Логин" />
        <q-input required class="login-input" :dense="true" type="password" outlined v-model="password" label="Пароль" />
        <q-btn :loading="isSending" :disabled="isSending" class="confirm-button" color="primary" type="submit">
          Войти
          <template v-slot:loading>
            <q-spinner-hourglass class="on-left" />Подождите...
          </template>
        </q-btn>
      </q-form>
    </div>
  </div>
</template>

<script>
import api from "@/plugins/axios";

export default {
  name: "Login",
  data(){
    return{
      isSending:false,
      username:"",
      password:"",
    }
  },
  methods:{
   async enterAdmin(){
      this.isSending = true
    await api.post('accounts/auth/point_admin/commerce/',
         {
           username:this.username,
           password:this.password
         })
      .then((response)=>{
        if(response.status < 205) {
          localStorage.setItem('token', response.data.token)

        }
      })
      .finally(()=>{
        this.isSending = false
         this.$router.go()
      })
    },
  },
};
</script>

<style src="./Login.css" scoped></style>
