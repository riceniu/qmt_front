<template>
    <div class="app-container">
  
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        stripe
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="No." type="index" sortable="custom" align="center" width="80" >
          <!-- <template slot-scope="{row}">
            <span>{{ row.No }}</span>
          </template> -->
        </el-table-column>

        <el-table-column label="Item" width="300px" align="Left">
          <template slot-scope="{row}">
            <span style="text-align:left" >{{ row.item }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Quantity" width="155px" align="center">
          <template slot-scope="{row}">
            <el-input-number v-model="row.quantity" size="mini"
             @change="handleQuantityChange()">
              {{ row.quantity }}
            </el-input-number>
          </template>
        </el-table-column>

        <el-table-column label="Unit price" width="110px" align="right">
          <template slot-scope="{row}">
            <span>{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Sum" width="110px" align="right">
          <template slot-scope="{row}">
            <span>{{ row.price *row.quantity }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Actions" align="center" width="100px" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
              Reomve
            </el-button>
          </template>
        </el-table-column>
        
        
      </el-table>

      <br/>
      <div style="float:right; margin-right:300px;">
      Subtotal: <el-input label="subtotal" type="text" v-model="subtotal" :disabled="true" style="width:100px" margin-right="50px">
      
      </el-input>
    </div>
      <br/>
      <el-button type="primary" @click="handleAdd">Add</el-button>
    </div>
  </template>
  
<script>
  import { fetchList, fetchPv, fetchQuoteItems } from '@/api/quote'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  
  export default {
    name: 'ComplexTable',
    props: ['quoteNumber'],
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        QueryList:{
          quote_number:''
        },
        rules:{
          quantity:[{ required: true, message: 'This is mandatory', trigger:'blur'},
                {type:'number', transform(value) {return value ==="" ? 0 : Number(value);} , trigger:'blur'}]
      },
        temp: {
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        downloadLoading: false,
        subtotal:0,
      }
    },
    watch: {
      quoteNumber(newnumber,oldnumber){    
        this.QueryList.quote_number = this.quoteNumber
        this.getList()  
      }
    },
    methods: {
      async getList() {
        this.listLoading = true
        await fetchQuoteItems(this.QueryList).then(response => {
          this.list = response.data
          this.listLoading = false
        })
        this.updateSubtotal()
      },
      handleAdd(){
        alert('add')
      },
      resetTemp() {
        this.temp = {
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleDelete(row, index) {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
        this.handleQuantityChange()
      },
      handleQuantityChange(){
        console.log('handelQuantityChange()')
        console.log(this.list)
        this.$emit('itemChange',this.list)
        this.updateSubtotal()

      },
      updateSubtotal(){
        this.subtotal = 0
        if(this.list){
        for(const item of this.list){
          this.subtotal += item.price * item.quantity
        }}
      }
    }
  }
  </script>
<style>
.Item{
  text-align: center;
}

</style>