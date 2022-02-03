<template>
  <div class="q-pa-md">
    <q-layout view="lHh lpr lFf" container style="height: 400px" class="shadow-2 rounded-borders">
      <q-table
          title="Компании"
          separator="cell"
          :rows="rows"
          :columns="columns"
          row-key="id"
          :loading="loading"
          @row-dblclick="chooseCompany"
      >
        <template v-slot:body-cell-_admins="props">
          <q-td :props="props">
            {{props.row._admins.join(' , ')}}
          </q-td>
        </template>

      </q-table>
    </q-layout>

    <!-- dialog edit -->
    <q-dialog v-model="editDialog">
      <q-card style="max-height: 72vh; min-width: 30vw !important">
        <q-card-section >
          <div class="text-h6">Редактировать компанию</div>
        </q-card-section>
        <q-separator />
        <q-form @submit="editCompany">
          <q-card-section class="scroll block-edit">
            <div class="con-inputs">
              <q-input required class="form-input con-item" dense square outlined v-model="rowSelected.name" label="Название" />
              <q-input required class="form-input con-item" dense square outlined v-model="rowSelected.full_name" label="Полное название" />
            </div>
            <div class="con-inputs">
              <q-input type="number" required class="form-input con-item" dense square outlined v-model="rowSelected.inn" label="ИНН" />
              <q-input type="number" class="form-input con-item" dense square outlined v-model="rowSelected.orgn" label="ОГРН" />
            </div>
              <q-input type="number" class="form-input" dense square outlined v-model="rowSelected.kpp" label="КПП" />
              <q-input  class="form-input" dense square outlined v-model="rowSelected.legal_address" label="Юр.Адрес" />
              <q-input  class="form-input" dense square outlined v-model="rowSelected.fact_address" label="Факт. Адрес" />
            <div class="con-inputs">
              <q-input type="number" class="form-input con-item" dense square outlined v-model="rowSelected.okpo" label="ОКПО" />
              <q-input type="number" class="form-input con-item" dense square outlined v-model="rowSelected.okved" label="ОКВД" />
            </div>
              <q-input type="number" class="form-input" dense square outlined v-model="rowSelected.checking_account" label="Расчетный счёт" />
              <q-input type="number" class="form-input" dense square outlined v-model="rowSelected.bank_correspondent_account" label="Корреспондентский счёт" />
              <q-input type="number" class="form-input" dense square outlined v-model="rowSelected.bik_bank" label="БИК" />
<!--            <q-select-->
<!--                filled-->
<!--                v-model="adminsEdit"-->
<!--                multiple-->
<!--                :options="adminsOpt"-->
<!--                label="Multiple"-->
<!--                style="width: 250px"-->
<!--            />-->
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn type="submit"  label="Сохранить" color="green"/>
            <q-btn  label="Отмена" color="red" v-close-popup />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>





  </div>
</template>

<script>
import api from "@/plugins/axios";

export default {
  name: "Company",
  data(){
    return{
      loading:false,
      adminsOpt:[],
      rowSelected:[],
      adminsEdit:[],
      editDialog:false,
      columns:[
        {
          name: 'name',
          required: true,
          label: 'Наименование',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        { name: '_admins',align:"left", label: 'Руководители', field: '_admins' },
        { name: 'create',align:"left", label: 'Создано', field: 'create' },
      ],
      rows: []
    }
  },
  methods:{
    chooseCompany(evt, row){
      JSON.parse(JSON.stringify(row))
      let copy = Object.assign({}, row);
      this.rowSelected = JSON.parse(JSON.stringify(copy))
      this.editDialog = true


    },
    editCompany(){
      this.loading = true
      api.put('shipment_points/admin/company/'+ this.rowSelected.id + '/', this.rowSelected)
          .then((response)=>{
            if(response.status < 205){
              this.editDialog = false
              this.refreshTable()
            }
          })
      .finally(()=>{
        this.loading = false
      })
    },
    refreshTable(){
      this.loading = true
      api('shipment_points/admin/company/')
          .then((response)=>{
            this.rows = response.data.results
          })
      .finally(()=>{
        this.loading = false
      })
    },
  },
 async mounted() {
    this.loading = true
   await api('shipment_points/admin/company/')
    .then((response)=>{
      this.rows = response.data.results
    })
    this.loading = false
  }
}
</script>

<style src="./Company.css" scoped>

</style>