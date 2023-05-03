<template>
  <div class="app-container">
    <el-form
      ref="quote"
      :model="quote"
      label-width="120px"
      :rules="rules"
      style="margin-right: 30px"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="Quote No.:" prop="quoteNumber">
            <el-input
              :disabled="isEdit"
              v-model="quote.quoteNumber"
              placeholder="KHI-"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Quote date:" prop="dateQuote">
            <el-date-picker
              v-model="quote.dateQuote"
              type="date"
              placeholder="Pick a date"
              style="width: 100%"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Owner" prop="owner">
            <el-select v-model="quote.owner" placeholder="Please select">
              <el-option
                v-for="item in ownerList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="Contact" prop="contact">
            <el-input v-model="quote.contact" />
          </el-form-item>
        </el-col>

        <el-col :span="14">
          <el-form-item label="Company" prop="company">
            <el-input type="textarea" v-model="quote.company" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="Greeting" prop="greeting">
        <el-input type="textarea" :rows="4" v-model="quote.greeting" />
      </el-form-item>

      <!-- invoke sub-component with parameter:quotenumber -->
      <ComplexTable
        :quotenumber="PassQuoteNumber"
        :ListItems="items"
        v-on:itemChange="itemChange"
      />
      <div>
        <el-row>
          <div>
            <el-row>
              <el-col :span="8">
                <el-form-item label="Currency" class="narrow"
                  ><el-input v-model="quote.currency"
                /></el-form-item>
              </el-col>
              <el-col :span="6" :offset="7">
                <el-form-item label="Direct discount" class="narrow">
                  <el-input
                    v-model="quote.discountDirect"
                    @change="updateTotal"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="Trade Term" class="narrow">
                  <el-input v-model="quote.trade_term" />
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="5">
                <el-form-item label="Discount %" class="narrow">
                  <el-input v-model="quote.discount" @change="updateTotal"
                /></el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="Price" class="narrow">
                  <el-input v-model="quote.price" />
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="5">
                <el-form-item label="VAT %" class="narrow">
                  <el-input v-model="quote.vat" @change="updateTotal" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!-- <el-col :span="6" :offset="15">
            <div>
              <el-form-item label="Direct discount" class="narrow">
              <el-input v-model="quote.discountDirect" @change="updateTotal"  />
              </el-form-item >
              <el-form-item label="Discount %" class="narrow">
              <el-input v-model="quote.discount"  @change="updateTotal" /></el-form-item>
              <el-form-item label="VAT" >
              <el-input v-model="quote.vat"  @change="updateTotal" /></el-form-item>
              <hr />
              <el-form-item label="Total">
              <el-input v-model="quote.total"  :disabled="true"/></el-form-item>
            </div>
          </el-col>  -->
          <el-row>
            <el-col :span="10">
              <el-form-item label="Delivery" class="narrow">
                <el-input v-model="quote.delivery" />
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="5">
              <hr style="margin-bottom: 0; margin-top: 0" />
              <el-form-item label="Total" class="narrow">
                <el-input v-model="quote.total" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
        <!-- <el-row>
          <el-col :span="5">
            <el-form-item label="Direct discount">
              <el-input v-model="quote.discountDirect" @change="updateTotal"  />
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="2">
            <el-form-item label="Discount %">
              <el-input v-model="quote.discount"  @change="updateTotal" />
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="2">
            <el-form-item label="VAT">
              <el-input v-model="quote.vat"  @change="updateTotal" />
            </el-form-item>
          </el-col>
        </el-row> -->
        <!-- <el-row>
          <el-col :span="6" :offset="15">
            <hr />
            <el-form-item label="Total">
              <el-input v-model="quote.total"  :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row> -->
      </div>
      <!-- <el-row>
            <el-col :span="7">
              <el-form-item label="Trade Term">
                <el-input v-model="quote.trade_term"  />
              </el-form-item>
            </el-col>

            <el-col :span="7">
              <el-form-item label="Currency">
                <el-input v-model="quote.currency"  />
              </el-form-item>
            </el-col>

            <el-col :span="7">
              <el-form-item label="Price">
                <el-input v-model="quote.price"  />
              </el-form-item>  
            </el-col>    
          </el-row> -->

      <!-- 
          <el-form-item label="Delivery">
            <el-input v-model="quote.delivery"  />
          </el-form-item>       -->
      <el-row>
        <el-col :span="10">
          <el-form-item label="Payment Term" class="narrow">
            <el-input v-model="quote.payment" />
          </el-form-item>

          <el-form-item label="Validity" class="narrow">
            <el-input v-model="quote.validity" />
          </el-form-item>

          <el-form-item label="Warranty" class="narrow">
            <el-input v-model="quote.warranty" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-button type="success" @click="isEdit ? editQuote() : addQuote()"
      >Save</el-button
    >
  </div>
</template>
  
  <script>
import ComplexTable from "./quoteItems.vue";
import { fetchQuoteItems, createQuote, updateQuote } from "@/api/quote";

export default {
  name: "create",

  components: {
    ComplexTable,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      //flag if got data from database
      gotList: false,
      //postForm: Object.assign({}, defaultForm),
      ownerList: [
        { label: "Diane", value: "Diane" },
        { label: "NZ", value: "NZ" },
        { label: "API", value: "API" },
      ],
      quote: {
        quoteNumber: "",
        currency: "",
        vat: "",
        discountDirect: "",
        discount: "",
        total: "",
        company: "",
        contact: "",
        greeting: "",
        owner: "",
        dateQuote: "",
        ending: "",
        price: "",
        trade_term: "",
        delivery: "",
        payment: "",
        validity: "",
        warranty: "",
      },
      items: [],
      rules: {
        quoteNumber: [
          { required: true, message: "This is mandatory", trigger: "blur" },
        ],
        dateQuote: [
          { required: true, message: "This is mandatory", trigger: "blur" },
        ],
        owner: [
          { required: true, message: "This is mandatory", trigger: "change" },
        ],
        company: [
          { required: true, message: "This is mandatory", trigger: "blur" },
        ],
        contact: [
          { required: true, message: "This is mandatory", trigger: "blur" },
        ],
        nnn: [
          { required: true, message: "This is mandatory", trigger: "blur" },
          {
            type: "number",
            transform(value) {
              return value === "" ? 0 : Number(value);
            },
            trigger: "blur",
          },
        ],
      },
      quoteItem: {
        quotenumber: "",
      },
      PassQuoteNumber: "",
      subtotal: 0,
      tempQuoteItemQueryVO:""
    };
  },
  created() {
    console.log("created");
    if (this.isEdit) {
      this.fetchDate(this.$route.params.id);
    }
  },
  mounted() {},
  beforeDestroy() {},
  updated() {},
  methods: {
    fetchDate(quotenumber) {
      console.log("fetch");
      console.log(quotenumber);
      this.quoteItem.quotenumber = quotenumber;
      fetchQuoteItems(this.quoteItem)
        .then((response) => {
          this.tempQuoteItemQueryVO = response.data
          console.log(this.tempQuoteItemQueryVO)
          this.quote = response.data.quote;
          this.items = response.data.itemList;
          this.PassQuoteNumber = this.quote.quoteNumber;
          this.gotList = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onSubmit() {
      this.$message("submit!");
    },
    onCancel() {
      this.$message({
        message: "cancel!",
        type: "warning",
      });
    },
    addQuote() {
      this.$refs["quote"].validate((valid) => {
        if (valid) {
          let quotedata = {
            quote: this.quote,
            itemList: this.items,
          };
          console.log("adddQuote");
          console.log(quotedata);
          createQuote(quotedata).
          then(
            this.$message({
              type: "success",
              message: "Quote successfully added",
            })
          );
        }
        this.$router.push({ path: "/quote/list" });
      });
    },
    editQuote() {
      this.$refs["quote"].validate((valid) => {
        if (valid) {
          let quotedata = {
            quote: this.quote,
            itemList: this.items,
          };
          console.log("editQuote");
          console.log(quotedata);
          updateQuote(quotedata).then(
            this.$message({
              type: "success",
              message: "Successfully saved",
            })
          );
        }
        this.$router.push({ path: "/quote/list" });
      });
    },

    itemChange: function (itemchange) {
      console.log("parent->itemchange")
      console.log(itemchange)
      if (itemchange.length > 0) {
        console.log(itemchange);
        let cal = 0;
        for (const item of itemchange) {
          cal += item.price * (item.quantity * 1);
        }
        console.log(cal);
        this.subtotal = cal;
        this.quote.total =
          (cal - this.quote.discountDirect) *
          (1 - this.quote.discount / 100) *
          (1 + this.quote.vat / 100);
        // if (itemchange[0].quotenumber === this.quote.quotenumber) {
        //   //this.items = Object.assign({},itemchange)
        //   this.items = itemchange;
        //   console.log("this.items");
        //   console.log(this.items);
        // } else {
        //   alert("Error: quotate_number error");
        // }
      }
    },
    updateTotal() {
      this.quote.total =
        (this.subtotal - this.quote.discountDirect) *
        (1 - this.quote.discount / 100) *
        (1 + this.quote.vat / 100);
    },
  },
};
</script>
  
  <style scoped>
.line {
  text-align: center;
}
.narrow {
  margin-bottom: 2px;
}
</style>
  
  