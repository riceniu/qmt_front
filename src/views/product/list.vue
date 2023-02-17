<template>
  <div class="app-container">
    <!-- Table -->
    <el-table v-loading="listLoading" 
    :data="list" 
    :default-sort = "{prop: 'id', order: 'descending'}"
    border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="65" sortable prop='id'>
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="Category" width="110" sortable prop="category">
        <template slot-scope="scope">
          <span>{{ scope.row.category }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Product" width="120px" sortable prop="productname">
        <template slot-scope="scope">
          <span>{{ scope.row.productname }}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="Price" width="80px" sortable prop="price">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Currency" width="110px" sortable prop="currency">
        <template slot-scope="scope">
          <span>{{ scope.row.currency }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="250px" label="Quote text">
        <template slot-scope="{row}">
          <router-link :to="'/product/edit/'+row.id" class="link-type">
            <span>{{ row.quote_text }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="{row}">
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(row)"/>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(row)"/>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- Add button -->
    <div>
    <el-button type="success" @click="handleAdd">Add</el-button>
    </div>

    <!--dialog-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"   :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="90px" style="margin-left:20px; margin-right:40px">
          
        <el-form-item label="ID" prop="id">
          <el-input v-model="temp.id" :disabled="true"/>
        </el-form-item>

        <el-form-item label="Category" prop="category">
          <el-select v-model="temp.category" class="filter-item" placeholder="Category">
            <el-option v-for="item in CategoryType" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
      
        <el-form-item label="Product" prop="productname">
          <el-input v-model="temp.productname" placeholder="X-xxx"/>
        </el-form-item>

        <el-form-item label="Price" prop="price">
          <el-input v-model="temp.price" />
        </el-form-item>

        <el-form-item label="Currency" prop="currency">
          <el-select v-model="temp.currency" class="filter-item" >
            <el-option v-for="item in CurrencyType" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input
            type="textarea"
            placeholder="Quote text"
            v-model="temp.quote_text"
            rows="4"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">
          Close
        </el-button>
        <el-button type="primary" @click="dialogStatus==='Add'?createData():updateData()">
          Confirm
        </el-button> 
      </div>
    </el-dialog>
    
  </div>
</template>

<script>
import { fetchList,fetchLastId,addProduct,editProduct,deleteProduct } from '@/api/product'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
const CategoryType =[
  {key:'Type-A',value:'Type-A'},
  {key:'Type-B',value:'Type-B'},
  {key:'Type-C',value:'Type-C'},
]
const CurrencyType =[
  {key:'USD',value:'USD'},
  {key:'GBP',value:'GBP'},
  {key:'EURO',value:'EURO'},
  {key:'CNY',value:'CNY'}
]
export default {
  name: 'ProductList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      CategoryType,
      CurrencyType,
      category:{},
      textMap: {
        Edit: 'Edit',
        Add: 'Add new product'
      },
      dialogFormVisible : false,
      dialogStatus:'',
      temp:{
        id: '',
        quote_text: '',
        currency:'',
        category:'',
        price: '',
        productname:''
      },
      rules:{
        category: [{ required: true, message: 'This is mandatory', trigger: 'blur' }],
        price:[{ required: true, message: 'This is mandatory', trigger:'blur'},
                {type:'number', transform(value) {return value ==="" ? 0 : Number(value);} , trigger:'blur'},],
        currency:[{ required: true, message: 'This is mandatory', trigger:'blur'}]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleEdit(row){
      this.temp = Object.assign({}, row)
      this.dialogStatus='Edit'
      this.dialogFormVisible=true
      
    },
    handleUpdate(row){
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus='Edit'
      this.dialogFormVisible=true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row){
      this.temp = Object.assign({},row)
      this.$confirm('Confirm to delete ' + this.temp.productname + ' ID: '+ this.temp.id, 'Attention', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          deleteProduct(this.temp)
          this.$message({
            type: 'success',
            message: 'Product deleted!'
          });
          this.getList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Canceled'
          });
        })
    },
    closeDialog(){
      this.dialogFormVisible=false ;
      if(this.tempPw) {
        this.temp.password = this.tempPw
        this.resetPassword = false
      }
    },
    handleAdd(){
      this.dialogStatus='Add'
      this.resetTemp()
      this.dialogFormVisible=true
    },
    resetTemp(){
      this.temp={
        id: '',
        quote_text: '',
        currency:'',
        category:'',
        price: '',
        productname:''
      }
      if(this.dialogStatus === 'Add'){
        fetchLastId().then(response=>{
          this.temp.id = response.data +1
        })
      }
    },

    updateData(){
      this.$refs['dataForm'].validate((valid) => {
        if(valid){
          editProduct(this.temp).then()
          this.dialogFormVisible = false
          this.$notify({
            title: 'Success',
            message: 'Update Successfully',
            type: 'success',
            duration: 2000
          })
          this.getList()
        }

      })
    },
    createData(){
      this.$refs['dataForm'].validate((valid) => {
      if (valid) {
        console.log('view/product/list.vue->createData')
        console.log(this.temp)
        addProduct(this.temp).then(() => {
          this.dialogFormVisible = false
          this.$notify({
            title: 'Success',
            message: 'Created Successfully',
            type: 'success',
            duration: 2000
          })
        })
      }
    })}
  },

}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
