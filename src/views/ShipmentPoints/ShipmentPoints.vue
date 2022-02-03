 <template>
  <div class="q-pa-md">
    <q-layout view="lHh lpr lFf" container style="height: 400px" class="shadow-2 rounded-borders">
      <q-table
          title="Точки"
          separator="cell"
          :rows="rows"
          :columns="columns"
          row-key="id"
          @row-dblclick="choosePoints"
          :loading="loading"
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

      </q-table>
    </q-layout>


    <!-- dialogs -->
    <q-dialog v-model="createDialog">
      <q-card style="max-height: 70vh; width:30vw !important;">
        <q-card-section>
          <div class="text-h6">Добавить точку</div>
        </q-card-section>
        <q-separator />
        <q-form @submit="createPoint">
        <q-card-section  class="scroll">

            <q-input required class="form-input" dense square outlined v-model="createName" label="Наименованиe" />
            <q-input min="0" max="100"  step="0.000001" type="number" required class="form-input" dense square outlined v-model="createLatitude" label="Широта" />
            <q-input min="0" max="100" step="0.000001" type="number"  required class="form-input" dense square outlined v-model="createLongitude" label="Долгота" />
            <q-input required class="form-input" dense square outlined v-model="createAddress" label="Адрес" />
            <q-input required class="form-input" dense square outlined v-model="createWorktime" label="Часы работы" />
            <q-select
                class="form-input"
                outlined
                dense
                square
                v-model="createRecyclables"
                :options="categoryOpt"
                option-value="id"
                option-label="name"
                input-debounce="0"
                label="Категории"
            />
          <q-select
              class="form-input"
              outlined
              dense
              square
              use-input
              v-model="createCompany"
              :options="companyOpt"
              option-value="id"
              option-label="name"
              input-debounce="0"
              label="Компания"
          />
            <q-select
                class="form-input"
                outlined
                dense
                square
                use-input
                v-model="createEmployee"
                :options="employeeOpt"
                option-value="id"
                option-label="name"
                input-debounce="0"
                label="Пользователи"
            />
            <q-file
                v-on:change="handleFileUpload()"
                required square dense outlined type="file" id="file" ref="fileCreate" v-model="fileCreate" label="Фото">
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>

        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn type="submit"  label="Сохранить" color="green"/>
          <q-btn  label="Отмена" color="red" v-close-popup />
        </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- dialog edit -->
    <q-dialog v-model="editDialog">
      <q-card style="max-height: 72vh; ,min-width: 70vw !important">
        <q-card-section class="flex justify-between">
          <div class="text-h6">Редактировать точку</div>
          <q-btn @click="deleteDialog = true"  color="red" icon="delete" />
        </q-card-section>
        <q-separator />
        <q-form @submit="editPoint">
          <q-card-section class="scroll flex block-edit">
<div class="edit-form">
            <q-input required class="form-input" dense square outlined v-model="rowSelected.name" label="Наименованиe" />
  <q-input required readonly class="form-input" dense square outlined v-model="rowSelected.ship_id" label="ID" >
    <template v-slot:append>
      <q-btn @click="rowSelected.ship_id = ''" title="Сбросить ID" round dense flat icon="autorenew" />
    </template>
  </q-input>
            <q-input min="0" max="100"  step="0.000001" type="number"  required class="form-input" dense square outlined v-model.number="rowSelected.latitude" label="Широта" />
            <q-input min="0" max="100" step="0.000001" type="number"  required class="form-input" dense square outlined v-model.number="rowSelected.longitude" label="Долгота" />
            <q-input required class="form-input" dense square outlined v-model="rowSelected.address" label="Адрес" />
            <q-input required class="form-input" dense square outlined v-model="rowSelected.work_time" label="Часы работы" />
            <q-select
                class="form-input"
                outlined
                dense
                square
                v-model="rowSelected.accepted_recyclables"
                :options="categoryOpt"
                option-value="id"
                option-label="name"
                input-debounce="0"
                label="Категории"
            />
            <q-select
                class="form-input"
                outlined
                dense
                square
                use-input
                v-model="rowSelected.company"
                :options="companyOpt"
                option-value="id"
                option-label="name"
                input-debounce="0"
                label="Компания"
            />
            <q-select
                class="form-input"
                outlined
                dense
                square
                use-input
                v-model="rowSelected.employees"
                :options="employeeOpt"
                option-value="id"
                option-label="name"
                input-debounce="0"
                label="Пользователи"
            />
            <q-file
                v-on:change="handleFileUpload()"
                 square dense outlined type="file" id="file" ref="fileCreate" v-model="fileCreate" label="Фото">
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
</div>
            <div class="qr-code">
              <img :src="rowSelected.qr" alt="QR">
              <q-btn v-if="qrRefresh == false" @click="qrRefresh = true" color="red">Сбросить QR</q-btn>
              <q-btn v-if="qrRefresh == true" @click="qrRefresh = false" color="primary">Отменить сброс QR</q-btn>
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
  name: "ShipmentPoints",
  data(){
    return{
      // editLatitude:"",
      // editLongitude:"",
      // editAddress:"",
      // editWorktime:'',
      // editCompany:null,
      // editEmployee:null,
      // editRecyclables:null,
      // editName:'',
      deleteDialog:false,
      loading: false,
      rowSelected:null,
      companyOpt:[],
      createEmployee:null,
      createRecyclables:null,
      createName:'',
      fileCreate:'',
      editDialog:false,
      createLatitude:"",
      createLongitude:"",
      createAddress:"",
      createWorktime:'',
      createCompany:null,
      createDialog:false,
      nomenclatureOpt:[],
      categoryOpt:[],
      employeeOpt:[],
      qrRefresh: false,
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
        { name: 'work_time',align: 'left', label: 'Часы работы', field: 'work_time' },
        { name: 'address', align:"left", label: 'Адрес', field: 'address' },
        { name: 'create',align:"left", label: 'Создано', field: 'create' },

      ],
       rows: []
    }
  },
  watch:{
    createRecyclables(){
      console.log(this.createRecyclables)
    }
  },
  methods:{
    async deleteItem(){
      this.loading = true
      await api.delete('shipment_points/admin/shipment_points/' + this.rowSelected.id + '/')
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
    choosePoints(evt, row){
      JSON.parse(JSON.stringify(row))
      let copy = Object.assign({}, row);
      this.rowSelected = JSON.parse(JSON.stringify(copy))
      this.editDialog = true
    },
    handleFileUpload(){
      this.fileCreate = this.$refs.file.files[0]
    },
    clear(){
      this.createName=''
      this.createLatitude = ''
      this.createLongitude = ''
      this.createAddress = ''
      this.createWorktime = ''
      this.createRecyclables = ''
      this.createCompany = ''
      this.createEmployee = ''
      this.fileCreate = ''
      this.qrRefresh = false
    },
    async refreshTable(){
      this.loading = true
      await api.get('shipment_points/admin/shipment_points/')
          .then((response)=>{
            this.rows = response.data.results
          })
      .finally(()=>{
        this.loading = false
      })
    },
    async createPoint(){
      this.loading = true
      let formData = new FormData();
      formData.append('name', this.createName);
      formData.append('latitude', this.createLatitude);
      formData.append('longitude', this.createLongitude);
      formData.append('address', this.createAddress);
      formData.append('work_time', this.createWorktime);
      formData.append('accepted_recyclables', JSON.parse(JSON.stringify(this.createRecyclables.id)));
      formData.append('company', JSON.parse(JSON.stringify(this.createCompany.id)));
      formData.append('employees', JSON.parse(JSON.stringify(this.createEmployee.id)));
      formData.append('img', this.fileCreate);
      await api.post('shipment_points/admin/shipment_points/', formData)
      .then(response =>{
        if (response.status < 205){
          this.createDialog = false
          this.clear()
          this.refreshTable()
        }
      })
      .finally(()=>{
        this.loading = false
      })
},
    async editPoint(){
      this.loading = true
      let formData = new FormData();
      if (this.fileCreate != '') { formData.append('img', this.fileCreate);}
      if (this.rowSelected.ship_id == '') { formData.append('ship_id', '');}
      if (this.qrRefresh == true) { formData.append('qr', null);}
      formData.append('name', this.rowSelected.name);
      formData.append('latitude', this.rowSelected.latitude);
      formData.append('longitude', this.rowSelected.longitude);
      formData.append('address', this.rowSelected.address);
      formData.append('work_time', this.rowSelected.work_time);
      formData.append('accepted_recyclables', this.rowSelected.accepted_recyclables);
      formData.append('company', this.rowSelected.company);
      formData.append('employees', this.rowSelected.employees);

      await api.put('shipment_points/admin/shipment_points/' + this.rowSelected.id + '/', formData)
          .then(response =>{
            if (response.status < 205){
              this.editDialog = false
              this.refreshTable()
              this.clear()
            }
          })
      .finally(()=>{
        this.loading = false
      })
    },
  },
  async mounted() {
    this.loading = true
await api.get('shipment_points/admin/shipment_points/')
    .then((response)=>{
      this.rows = response.data.results
    })
    await api.get('accounts/admin/employee/?opt')
        .then((response)=>{
          this.employeeOpt = response.data.results
        })
    await api.get('shipment_points/admin/company/?opt')
        .then((response)=>{
          this.companyOpt = response.data.results

        })
    await api.get('recyclable_materials/recyclable_categories/?opt')
        .then((response)=>{
          this.categoryOpt = response.data.results

        })
    await api.get('recyclable_materials/nomenclature/?opt')
        .then((response)=>{
          this.nomenclatureOpt = response.data.results
        });
    this.loading = false
  },
};
</script>
<style src="./ShipmentPoints.css" scoped>
</style>
/* eslint-disable */