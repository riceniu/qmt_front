<template>
  <div class="app-container">
    <el-form ref="quote" :model="form" label-width="120px">
      <el-form :inline="true">
        
        <el-form-item label="Quote Number:">
          <el-input v-model="quote.quotenumber" placeholder="KHI-"/>
        </el-form-item>
        
        <el-form-item label="Quote date:">
            <el-date-picker v-model="quote.date_quote" 
            type="date" placeholder="Pick a date" style="width: 100%;" />
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

      <!-- <quoteItems></quoteItems> -->
      <ComplexTable/>
      
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
  </div>
</template>

<script>
import ComplexTable from './quoteItems.vue'

export default {
  name:'create',

  components: {
    ComplexTable
  },  
  
  data() {
    return {
      quote: {
        number: '',
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
      }
    }
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

