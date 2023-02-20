<template>
    <div class="app-container">
      <el-form ref="quote" :model="quote" label-width="120px">
        <el-form :inline="true">
          
          <el-form-item label="Quote Number:">
            <el-input v-model="quote.quote_number" placeholder="KHI-"/>
          </el-form-item>
          
          <el-form-item label="Quote date:">
              <el-date-picker v-model="quote.quote_date" 
              type="date" placeholder="Pick a date" style="width: 100%;" 
              value-format="yyyy-MM-dd"/>
          </el-form-item>
          
          <el-form-item label="Owner">
            <el-select v-model="quote.owner" placeholder="please select the Owner">
              <el-option label="Diane" value="Diane" />
              <el-option label="Tony" value="Tony" />
            </el-select>
          </el-form-item>
        
        </el-form>
        
        <el-form :inline="true">
          <el-form-item label="Company">
            <el-input v-model="quote.company"  />
          </el-form-item>
  
          <el-form-item label="Contact">
            <el-input v-model="quote.contact"  />
          </el-form-item>
        </el-form>
  
        <!-- invoke sub-component with parameter:quote_number -->
        <ComplexTable :quoteNumber="PassQuoteNumber"
        v-on:itemChange="itemChange"/>
        
        <el-form :inline="true">
          <el-form-item label="Direct discount">
            <el-input v-model="quote.discount_direct"  />
          </el-form-item>
  
          <el-form-item label="Discount %">
            <el-input v-model="quote.discount"  />
          </el-form-item>
          
          <el-form-item label="VAT">
            <el-input v-model="quote.vat" size="mini" />
          </el-form-item>

          <el-form-item label="Total">
            <el-input v-model="quote.total"  />
          </el-form-item>
        </el-form>

        <el-form :inline="true">
          <el-form-item label="Currency">
            <el-input v-model="quote.currency"  />
          </el-form-item>
  
          <el-form-item label="Price">
            <el-input v-model="quote.price"  />
          </el-form-item>      
          
          <el-form-item label="Trade Term">
            <el-input v-model="quote.trade_term"  />
          </el-form-item>
        </el-form>
  
        <el-form :inline="true">
          <el-form-item label="Delivery">
            <el-input v-model="quote.delivery"  />
          </el-form-item>      
          
          <el-form-item label="Payment Term">
            <el-input v-model="quote.payment"  />
          </el-form-item>
        </el-form>
  
        <el-form :inline="true">
          <el-form-item label="Validity">
            <el-input v-model="quote.validity"  />
          </el-form-item>      
          
          <el-form-item label="Warranty">
            <el-input v-model="quote.warranty"  />
          </el-form-item>
        </el-form>
  
        <!-- <el-form-item label="Instant delivery">
          <el-switch v-model="quote.delivery" />
        </el-form-item>
        <el-form-item label="Activity type">
          <el-checkbox-group v-model="quote.type">
            <el-checkbox label="Online activities" name="type" />
            <el-checkbox label="Promotion activities" name="type" />
            <el-checkbox label="Offline activities" name="type" />
            <el-checkbox label="Simple brand exposure" name="type" />
          </el-checkbox-group>
        </el-form-item> -->
        <!-- <el-form-item label="Resources">
          <el-radio-group v-model="quote.resource">
            <el-radio label="Sponsor" />
            <el-radio label="Venue" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Activity form">
          <el-input v-model="quote.desc" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">Create</el-button>
          <el-button @click="onCancel">Cancel</el-button>
        </el-form-item> -->
      </el-form>
      <el-button @click="isEdit?editQuote():addQuote()">Confirm</el-button>
    </div>
  </template>
  
  <script>
  import ComplexTable from './quoteItems.vue'
  import {fetchQuote, createQuote} from '@/api/quote'
 
  //seems useless
//   const defaultForm = {
//       quote_number: '',
//       quote_date: '',
//       currency: '',
//       vat:'',
//       discount: '',
//       discount_direct:'' ,
//       total: '',
//       contactid: '',
//       owner: '',
//       item_quantity: '',
//       company: '',
//       contact: '',
//       price: '',
//       trade_term: 'F',
//       delivery: '',
//       payment: '',
//       validity: '',
//       warranty: ''
// }

  export default {
    name:'create',
  
    components: {
      ComplexTable
    },  
    props: {
      isEdit:{
        type: Boolean,
        default: false
      }},
    data() {
      return {
        //postForm: Object.assign({}, defaultForm),
        quote: {
          quote_number: '',
          currency: '',
          vat: '',
          discount_direct: '',
          discount: '',
          total:'',
          company:'',
          contact:'',
          greeting:'',
          owner:'',
          date_quote:'',
          ending:'',
          price:'',
          trade_term:'',
          delivery:'',
          payment:'',
          validity:'',
          warranty:''
        },
        quoteItem:{
          quote_number:'',
        },
        PassQuoteNumber:'',
      }
    },
    created(){
      console.log('created')
      if(this.isEdit){
        this.fetchDate(this.$route.params.id)
      }
    },
    updated(){
      this.PassQuoteNumber = this.quote.quote_number
    },
    methods: {
      fetchDate(quote_number){
        console.log('fetch')
        fetchQuote(quote_number).then(response => {
          this.quote = response.data
          this.PassQuoteNumber = this.quote.quote_number
        }).catch(err => {
          console.log(err)
        })
    },
      onSubmit() {
        this.$message('submit!')
      },
      onCancel() {
        this.$message({
          message: 'cancel!',
          type: 'warning'
        })
      },
      addQuote(){
        createQuote(this.quote).then(response=>{
          this.$message({
            type:'success',
            message:'Successfully added'
          })
        })
        this.$router.push({path:'/quote/list'})
      },
      editQuote(){
        console.log(this.isEdit)
        alert('edit')
      },
      itemChange: function (itemchange){
        console.log(itemchange)
        let cal = 0
        for(const item of itemchange){
          cal += item.price*(item.quantity*1)
        }
        console.log(cal)
        this.quote.total = (cal - this.quote.discount_direct)*(1-this.quote.discount)*(1+this.quote.vat)
      }
    }
  }
  </script>
  
  <style scoped>
  .line{
    text-align: center;
  }
  </style>
  
  