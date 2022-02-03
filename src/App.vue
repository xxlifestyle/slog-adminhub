<template>
  <q-layout view="hhh lpR lFr">

    <q-header elevated style="background-color: rgb(91,185,90)" class=" text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="header-flex ">
          <div>
          <q-avatar>
            <img src="@/assets/icon.png">
          </q-avatar>
          SLOG-ADMIN
          </div>
          <q-btn @click="exitDialog = true" color="white" style="color: red !important;" outline="false" size="xs" round  icon="logout" />
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" side="left" elevated>
      <div class="">
          <q-item

              clickable
              v-ripple
              :active="selectedLink === ''"
              @click="goTo('')"
              active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="inbox" />
            </q-item-section>

            <q-item-section>Точки</q-item-section>
          </q-item>

          <q-item
              clickable
              v-ripple
              :active="selectedLink === 'company'"
              @click="goTo('company')"
              active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="send" />
            </q-item-section>

            <q-item-section>Компании</q-item-section>
          </q-item>

          <q-item
              clickable
              v-ripple
              :active="selectedLink === 'users'"
              @click="goTo('users')"
              active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="delete" />
            </q-item-section>

            <q-item-section>Пользователи</q-item-section>
          </q-item>

          <q-separator spaced />


      </div>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>


    <q-dialog v-model="exitDialog">
      <q-card style="max-height: 40vh; width:30vw !important;">
        <q-card-section>
          <div class="text-h6">Выход из системы</div>
        </q-card-section>
        <q-separator />
        <q-form @submit="logout">
          <q-card-section  class="scroll">
         Вы уверены что хотите выйти?
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn type="submit"  label="Да" color="green"/>
            <q-btn  label="Нет" color="red" v-close-popup />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

  </q-layout>
</template>
<script>


export default {
  name:"App",
  data(){
    return{
      exitDialog:false,
      leftDrawerOpen:false,
      selectedLink:'points',
    }
  },
  methods:{
    logout(){
      localStorage.clear()
      this.$router.go()
    },
    toggleLeftDrawer () {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
    goTo(tab){
      if (tab === '' ){
        this.$router.push({path:'/'})
        this.selectedLink = tab
      } else if (tab === "employee"){
        this.$router.push({path:'employee'})
        this.selectedLink = tab
      } else if (tab === "company"){
        this.$router.push({path:'company'})
        this.selectedLink = tab
      } else if (tab === "users"){
        this.$router.push({path:'users'})
        this.selectedLink = tab
      }
    },
  },
  mounted() {
    if (localStorage.token == null || localStorage == undefined){
      this.$router.push({path:'login'})
    }
  }
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.header-flex{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
