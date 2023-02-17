<template>
  <div class="app-container">

    <!-- Table -->
    <el-table v-loading="listLoading" 
    :data="list" 
    border fift highlight-current-row style="width: 100%">
      
      <el-table-column type="index" label="No." align="center" width="50" />
      <el-table-column prop="name" label="Employee" width="300" />
      <el-table-column prop="username" label="Username" width="150"/>
      <el-table-column prop="password" type="password" label="Password" width="150">
        <template>
        <p>Password saved</p>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="150">
        <template slot-scope="{row}">
          
            <el-button type="primary" size="small" icon="el-icon-edit" @click="handleUpdate(row)">
              Edit
            </el-button>

        </template>
      </el-table-column>
    </el-table>
    <br/>

    <!-- Add button -->
    <div>
    <el-button type="success" @click="handleAdd">Add</el-button>
    </div>
    
    <!-- dialog for edit/add -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"   :close-on-click-modal="false">
        <el-form v-if="dialogStatus==='Add'" ref="dataForm" :rules="rules" :model="temp" label-position="left" style="width: 400px; margin-left:50px;">
          <el-form-item label="Name" prop="name">
            <el-input v-model="temp.name" placeholder="First name, Last name"/>
          </el-form-item>
          <el-form-item label="Username" prop="username">
            <el-input v-model="temp.username" placeholder="Username to login"/>
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <el-input v-model="temp.password" placeholder="Password" type="password" show-password/>
          </el-form-item>
        </el-form>

        <el-form v-if="dialogStatus==='Edit'" ref="dataForm" :rules="rules" :model="temp" label-position="left" style="width: 400px; margin-left:50px;">
          <el-form-item label="Name">
            <el-input v-model="temp.name" :disabled="true"/>
          </el-form-item>
          <el-form-item label="Username">
            <el-input v-model="temp.username" :disabled="true"/>
          </el-form-item>
          <el-form-item prop="password" label="Password">
            <el-button @click="resetPw">Reset password</el-button>
            <div v-if="resetPassword">
              <br/>
            <el-input v-model="temp.password" placeholder="Password" type="password" show-password/>
            <el-button @click="resetPw">Cancel</el-button>
            <el-button type="primary" @click="setPassword">Confirm</el-button>
            <br/>
            </div>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">
            Close
          </el-button>
          <el-button v-if="dialogStatus==='Add'" type="primary" @click="dialogStatus==='Add'?createData():updateData()">
            Confirm
          </el-button> 
        </div>
    </el-dialog>
    
    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->
  </div>

</template>

<script>
import { fetchList, addUser, updateUser } from '@/api/user'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ProductList',
  components: { Pagination },
  filters: {
  },
  data() {
    return {
      list: null,
      listLoading: true,
      temp: {
          name:'',
          username:'',
          password:''
        },
      tempPw:'',
      dialogFormVisible: false,
      dialogStatus: 'Edit',
      textMap: {
        Edit: 'Edit user',
        Add: 'Add user'
      },
      resetPassword: false,
      rules: {
        name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
        username: [{required: true, message: 'Username is required', trigger: 'blur' }],
        password: [{ required: true, message: 'Password is required', trigger: 'blur' }]
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleAdd(){
      this.resetTemp()
      this.dialogStatus='Add'
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
    resetTemp() {
        this.temp = {
          name:'',
          username:'',
          password:''
        }
      },
    resetPw(){
      if(this.resetPassword==false){
        this.resetPassword=true
        this.tempPw = this.temp.password
        this.temp.password=''
      }else{
        this.resetPassword = false
        this.temp.password = this.tempPw
        this.tempPw=''
      }
    },
    setPassword(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateUser(tempData).then(() => {
            // const index = this.list.findIndex(v => v.id === this.temp.id)
            // this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            if(this.tempPw) {
              this.temp.password = this.tempPw
              this.resetPassword = false
            }
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })

    },
    closeDialog(){
      this.dialogFormVisible=false ;
      if(this.tempPw) {
        this.temp.password = this.tempPw
        this.resetPassword = false
      }
    },
    createData(){
      this.$refs['dataForm'].validate((valid) => {
      if (valid) {
        console.log('view/user/list.vue->createData')
        console.log(this.temp)
        addUser(this.temp).then(() => {
          this.list.push(this.temp)
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
  }
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
