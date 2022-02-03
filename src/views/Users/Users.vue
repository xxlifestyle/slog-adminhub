<template>
  <div class="q-pa-md">
    <q-layout view="lHh lpr lFf" container style="height: 400px" class="shadow-2 rounded-borders">
      <q-table
          title="Пользователи"
          separator="cell"
          :loading="loading"
          :rows="rows"
          :columns="columns"
          row-key="id"
          @row-dblclick="chooseUser"
      >
        <template v-slot:top>
          <q-btn  color="primary" :disable="loading" label="Добавить" @click="createDialog = true" />

          <q-space />
          <q-input borderless dense debounce="300" color="primary" v-model="filter">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body-cell-is_active="props">
          <q-td :props="props">
            <span style="color: green" v-if="props.row.is_active === true"><b>ДА</b></span>
            <span style="color: red" v-if="props.row.is_active === false"><b>НЕТ</b></span>
          </q-td>
        </template>
      </q-table>
    </q-layout>

    <q-dialog v-model="createDialog">
      <q-card style="max-height: 70vh; width:30vw !important;">
        <q-card-section>
          <div class="text-h6">Добавить пользователя</div>
        </q-card-section>
        <q-separator />
        <q-form @submit="createUser">
          <q-card-section  class="scroll">

            <q-input required class="form-input" dense square outlined v-model="newUserForm.username" label="Username" />
            <q-input  required class="form-input" dense square outlined v-model="newUserForm.name" label="Имя" />
            <q-input  required class="form-input" dense square outlined v-model="newUserForm.phone" label="Телефон" />
            <div class="checkbox-block">
            <q-checkbox class="form-input" v-model="newUserForm.is_active" label="Активный" />
            <q-checkbox class="form-input" v-model="newUserForm.company_admin" label="Админ" />
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn type="submit"  label="Сохранить" color="green"/>
            <q-btn  label="Отмена" color="red" v-close-popup />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editDialog">
      <q-card style="max-height: 70vh; width:30vw !important;">
        <q-card-section class="flex justify-between">
          <div class="text-h6">Изменить пользователя</div>
          <q-btn @click="deleteDialog = true"  color="red" icon="delete" />
        </q-card-section>
        <q-separator />
        <q-form @submit="editUser">
          <q-card-section  class="scroll">

            <q-input required class="form-input" dense square outlined v-model="rowSelected.username" label="Username" />
            <q-input  required class="form-input" dense square outlined v-model="rowSelected.name" label="Имя" />
            <q-input  required class="form-input" dense square outlined v-model="rowSelected.phone" label="Телефон" />
            <div class="checkbox-block">
              <q-checkbox class="form-input" v-model="rowSelected.is_active" label="Активный" />
              <q-checkbox class="form-input" v-model="rowSelected.company_admin" label="Админ" />
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn type="submit"  label="Сохранить" color="green"/>
            <q-btn  label="Отмена" color="red" v-close-popup />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>


    <q-dialog v-model="deleteDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card  style="width: 300px">
        <q-card-section>
          <div class="text-h6">Удаление пользователя</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Вы уверены что хотите удалить пользователя?
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn @click="deleteItem" color="green"  label="Да"  />
          <q-btn  label="Нет" color="red" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>


  </div>
</template>

<script>
import api from "@/plugins/axios";

export default {
  name: "Users",
  data(){
    return{
      deleteDialog:false,
      rowSelected:null,
      createDialog:false,
      editDialog:false,
      loading:false,
      newUserForm:{
        username:'',
        name:'',
        phone:'',
        is_active:false,
        company_admin:false,
      },
      columns:[
        {
          name: 'username',
          required: true,
          label: 'Username',
          align: 'left',
          field: "username",
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'name',
          required: true,
          label: 'Имя',
          align: 'left',
          field: 'name',
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'phone',
          required: true,
          label: 'Телефон',
          align: 'left',
          field: 'phone',
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'is_active',
          required: true,
          label: 'Активный',
          align: 'left',
          field: 'is_active',
          format: val => `${val}`,
          sortable: true
        },
      ],
      rows: []
    }
  },
  methods:{
   async deleteItem(){
      this.loading = true
      await api.delete('accounts/admin/employee/' + this.rowSelected.id + '/')
        .then((response)=>{
          if (response.status < 205){
            this.editDialog = false
            this.deleteDialog = false
            this.refreshTable()
          }
        })
      .finally(()=>{
        this.loading = false
      })
    },
    chooseUser(evt, row){
      JSON.parse(JSON.stringify(row))
      let copy = Object.assign({}, row);
      this.rowSelected = JSON.parse(JSON.stringify(copy))
      this.editDialog = true
    },
    async refreshTable(){
      this.loading = true
      await api('accounts/admin/employee/')
          .then((response)=>{
            this.rows = response.data.results
          })
      .finally(()=>{
        this.loading = false
      })
    },
    async createUser(){
      this.loading = true
      await api.post('accounts/admin/employee/', this.newUserForm)
          .then((response)=>{
            if (response.status < 205){
              this.createDialog = false
              this.refreshTable()
            }
          })
          .finally(()=>{
            this.loading = false
          })
    },
   async editUser(){
      this.loading = true
      await api.put('accounts/admin/employee/' + this.rowSelected.id + '/', this.rowSelected)
          .then((response)=>{
            if (response.status < 205){
              this.editDialog = false
              this.refreshTable()
            }
          })
     .finally(()=>{
       this.loading = false
     })
    },
  },
  async mounted() {
    this.loading = true
    await api('accounts/admin/employee/')
        .then((response)=>{
          this.rows = response.data.results
        })
    this.loading = false
  }
}
</script>

<style src="./Users.css" scoped>

</style>