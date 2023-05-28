<template>
  <div class="app-container">
    <div class="float-button">
      <el-button type="success" @click="isEdit ? editQuote() : addQuote()"
        >Save</el-button
      >
      <br />
      <br />
      <el-tooltip
        v-if="isEdit && previousQuote != ''"
        :content="previousQuote"
        placement="top-end"
      >
        <el-button
          icon="el-icon-arrow-left"
          type="primary"
          @click="jump(previousQuote)"
          >Previous</el-button
        >
      </el-tooltip>
      <el-tooltip
        v-if="isEdit && nextQuote != ''"
        :content="nextQuote"
        placement="top-end"
      >
        <el-button
          icon="el-icon-arrow-right"
          type="primary"
          @click="jump(nextQuote)"
          >Next</el-button
        >
      </el-tooltip>
    </div>
    <el-form
      ref="quote"
      :model="quote"
      label-width="120px"
      :rules="rules"
      style="margin-right: 30px"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item label="Quote No.:" prop="quoteNumber">
            <el-input
              :disabled="isEdit"
              v-model="quote.quoteNumber"
              placeholder="KIxxxx-xxx"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
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
        <el-col :span="4">
          <el-form-item label="Owner" prop="owner">
            <el-select
              v-model="quote.owner"
              filterable
              remote
              :remote-method="getUserList"
              placeholder="Please select"
              automatic-dropdown
            >
              <el-option
                v-for="(item, index) in ownerList"
                :key="item + index"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Stage" prop="stage">
            <el-select
              v-model="quote.stage"
              placeholder="Please select"
              automatic-dropdown
            >
              <el-option
                v-for="item in stageList"
                :key="item + index"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <!-- <el-form-item label="Contact" prop="contact">
            <el-input v-model="quote.contact" />
          </el-form-item> -->
          <el-form-item label="Contact" prop="contact">
            <el-select
              v-model="quote.contact"
              @change="selectContact"
              value-key="id"
              filterable
              remote
              :remote-method="getContactList"
              placeholder="Please select"
              default-first-option
              no-data-text="No such contact, please add"
            >
              <el-option
                v-for="item in contactOptionList"
                :key="item.contactId"
                :label="item.contactName"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <!-- <el-form-item label="Company" prop="company">
            <el-input type="textarea" v-model="quote.company" />
          </el-form-item> -->
          <el-form-item label="Company" prop="company">
            <el-select
              v-model="quote.company"
              @change="selectCompany"
              value-key="id"
              filterable
              remote
              default-first-option
              :remote-method="getCompanyList"
              placeholder="Please select"
              no-data-text="No such company, please add"
            >
              <el-option
                v-for="item in companyOptionList"
                :key="item.companyId"
                :label="item.company"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="Greeting" prop="greeting">
        <el-input type="textarea" :rows="2" v-model="quote.greeting" />
      </el-form-item>

      <el-form-item label="Ending" prop="ending">
        <el-input type="textarea" :rows="2" v-model="quote.ending" />
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
                <el-form-item label="Currency" class="narrow" prop="currency">
                  <!-- <el-input v-model="quote.currency"/> -->
                  <el-select v-model="quote.currency" class="filter-item">
                    <el-option
                      v-for="item in CurrencyType"
                      :key="item.key"
                      :label="item.display_name"
                      :value="item.key"
                    /> </el-select
                ></el-form-item>
              </el-col>
              <el-col :span="6" :offset="7">
                <el-form-item label="Direct discount" class="narrow">
                  <!-- <el-input
                    v-model="quote.discountDirect"
                    @change="updateTotal"
                  /> -->
                  <el-input-number
                    v-model="quote.discountDirect"
                    @change="updateTotal"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="Trade Term" class="narrow">
                  <el-input v-model="quote.tradeTerm" />
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="5">
                <el-form-item label="Discount %" class="narrow">
                  <!-- <el-input v-model="quote.discount" @change="updateTotal"
                />-->
                  <el-input-number
                    v-model="quote.discount"
                    @change="updateTotal"
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
                  <!-- <el-input v-model="quote.vat" @change="updateTotal" /> -->
                  <el-input-number v-model="quote.vat" @change="updateTotal" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-row>
            <el-col :span="10">
              <el-form-item label="Delivery" class="narrow">
                <el-input v-model="quote.delivery" />
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="5">
              <hr style="margin-bottom: 0; margin-top: 0" />
              <el-form-item label="Total" class="narrow">
                <!-- <el-input 
                v-model="quote.total" 
                :disabled="true" 
                /> -->
                <el-input-number
                  :controls="false"
                  v-model="quote.total"
                  :precision="2"
                  :disabled="true"
                />
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
      <el-row>
        <el-col :span="10">
          <el-form-item label="Payment Term" class="narrow">
            <el-input v-model="quote.payment" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="Validity" class="narrow">
            <el-input v-model="quote.validity" />
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="3">
          <el-form-item label="Category" class="narrow" prop="category">
            <el-radio-group
              v-model="quote.category"
              @change="handleCategoryChange"
            >
              <el-radio
                :label="item.value"
                :key="item.value"
                v-for="item in CategoryList"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="Warranty" class="narrow">
            <el-input v-model="quote.warranty" />
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="3">
          <el-checkbox-group
            v-if="productList != null"
            v-model="checkedProducts"
            @change="handleCheckedProductChange"
          >
            <el-checkbox
              v-for="product in productList"
              :label="product"
              :key="product"
              >{{ product }}</el-checkbox
            >
          </el-checkbox-group>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-col
            :span="12"
            class="hidden-sm-and-down"
            :md="6"
            :lg="6"
            :xl="6"
            style="min-height: 1px"
          ></el-col>
        </el-col>

        <!-- <el-col :span="7" :offset="4">
          <el-button type="success" @click="isEdit ? editQuote() : addQuote()"
            >Save</el-button
          >
        </el-col> -->
      </el-row>
      <el-row>
        <el-col
          :span="12"
          class="hidden-sm-and-down"
          :md="6"
          :lg="6"
          :xl="6"
          style="min-height: 100px"
        ></el-col>
      </el-row>
    </el-form>
  </div>
</template>
  
  <script>
import ComplexTable from "./quoteItems.vue";
import {
  fetchQuoteItems,
  createQuote,
  updateQuote,
  getLatestQuoteNumber,
  checkQuoteNumber,
  checkContext,
} from "@/api/quote";
import { remoteSearch as remoteSearchUser } from "@/api/user";
import { remoteSearchCompany, remoteSearchContact } from "@/api/customer";
const CurrencyType = [
  { key: "USD", value: "USD" },
  { key: "GBP", value: "GBP" },
  { key: "Euro", value: "Euro" },
];
const CategoryList = [
  {
    key: "CFL",
    value: "CFL",
    label: "CFL",
    children: ["T-3xx", "T-5XX", "T-9XX", "T-P2X", "Other"],
  },
  { key: "PU", value: "PU", label: "PU", children: ["TWFL", "FTR", "GPS"] },
  { key: "DA", value: "DA", label: "DA",children:["PZG"] },
  { key: "MOTOR", value: "MOTOR", label: "MOTOR", children: ["SRM", "SyRM"] },
];
const stageList =[
  {label:"Quotation sent"},
  {label:"Closed won"},
  {label:"Closed lost"}
]
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
      //product & category
      checkedProducts: [],
      productList: null,
      //tip for previous/next quote number
      previousQuote: "",
      nextQuote: "",
      //flag if got data from database
      gotList: false,
      //postForm: Object.assign({}, defaultForm),
      CategoryList,
      stageList,
      ownerList: [],
      contactOptionList: [],
      companyOptionList: [],
      quote: {
        quoteNumber: "",
        currency: "",
        vat: "",
        discountDirect: "",
        discount: "",
        total: "",
        company: "",
        companyId: "",
        contact: "",
        contactId: "",
        greeting: "",
        owner: "",
        dateQuote: "",
        ending: "",
        price: "",
        tradeTerm: "",
        delivery: "",
        payment: "",
        validity: "",
        warranty: "",
        category: "",
        product: [],
      },
      initQuoteVo: {},
      CurrencyType,
      items: [],
      rules: {
        quoteNumber: [
          { required: true, message: "This is mandatory", trigger: "blur" },
        ],
        stage: [
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
        category: [
          { required: true, message: "This is mandatory", trigger: "blur" },
        ],
        // contact: [
        //   { required: true, message: "This is mandatory", trigger: "blur" },
        // ],
        currency: [
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
      tempQuoteItemQueryVO: "",
    };
  },
  created() {
    console.log("created");
    remoteSearchUser("").then((response) => {
      if (!response.data) return;
      this.ownerList = response.data.map((v) => v.name);
      //console.log(this.ownerList);
    });
    if (this.isEdit) {
      this.fetchDate(this.$route.params.id);
      this.remoteCheckContext(this.$route.params.id);
    } else {
      //this.quote.quoteNumber = 'KI'+ new Date((new Date).getTime() + 8*60*60*1000);
      let date = new Date(new Date().getTime() + 8 * 60 * 60 * 1000);
      this.quote.dateQuote = date
        .toJSON()
        .split("T")
        .join(" ")
        .substring(0, 10);
      this.latestQuoteNumber();
      this.quote.currency = "USD";
      this.quote.stage = "Quotation sent"
      console.log(this.quote);
    }
    this.initQuoteVo = Object.assign({}, this.tempQuoteItemQueryVO);
  },
  mounted() {},
  beforeDestroy() {},
  updated() {},
  watch: {
    quote: function (val) {
      console.log(val);
    },
    deep: true,
  },
  methods: {
    async latestQuoteNumber() {
      let res = await getLatestQuoteNumber();
      this.quote.quoteNumber = res.data;
      console.log(this.quote.dateQuote);
      if (this.quote.quoteNumber.length === 10) {
        let num = parseInt(this.quote.quoteNumber.substring(7, 10));
        num += 1;
        this.quote.quoteNumber =
          "KI" +
          this.quote.dateQuote.substring(2, 4) +
          this.quote.dateQuote.substring(5, 7) +
          "_" +
          num;
      } else {
        this.quote.quoteNumber = "";
      }
    },
    fetchDate(quotenumber) {
      console.log("fetch");
      console.log(quotenumber);
      this.quoteItem.quotenumber = quotenumber;
      fetchQuoteItems(this.quoteItem)
        .then((response) => {
          this.tempQuoteItemQueryVO = response.data;
          console.log(this.tempQuoteItemQueryVO);
          this.quote = response.data.quote;
          this.items = response.data.itemList;
          this.PassQuoteNumber = this.quote.quoteNumber;
          this.gotList = true;

          //initial productList
          debugger
          for (const item of CategoryList) {
            if (item.value === this.quote.category)
              this.productList = item.children;
              this.checkedProducts = this.quote.product.split(",")
          }


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
    async addQuote() {
      let res = await checkQuoteNumber({ quotenumber: this.quote.quoteNumber });
      let exist = res.data === "EXIST" ? true : false;
      console.log(exist);
      if (exist) {
        this.$message({
          type: "error",
          message: "Quote number already exists, please change",
          duration: 3000,
        });
      } else {
        this.$refs["quote"].validate((valid) => {
          console.log(valid);
          if (valid) {
            //check if quote number already exists

            this.quote.company = this.quote.companyId;
            this.quote.contact = this.quote.contactId;
            let quotedata = {
              quote: this.quote,
              itemList: this.items,
            };
            console.log("adddQuote");
            console.log(quotedata);
            createQuote(quotedata).then(
              //////////////////////////////////////////////////////////////////////////////////////////
              //router only direct to list when respose code = 200 or 20000
              //////////////////////////////////////////////////////////////
              this.$message({
                type: "success",
                message: "Quote successfully added",
              })
            );
            this.$router.push({ path: "/quote/list" });
          }
        });
      }
    },
    editQuote() {
      this.$refs["quote"].validate((valid) => {
        console.log(valid);
        if (valid) {
          console.log("editQuote");
          console.log(this.quote);
          this.quote.company = this.quote.companyId;
          this.quote.contact = this.quote.contactId;
          let quotedata = {
            quote: this.quote,
            itemList: this.items,
          };
          console.log(quotedata);
          updateQuote(quotedata).then(
            this.$message({
              type: "success",
              message: "Successfully saved",
            })
          );
          //this.$router.push({ path: "/quote/list" });
        }
      });
    },

    itemChange: function (itemchange) {
      console.log("parent->itemchange");
      //console.log(itemchange);
      if (itemchange.length > 0) {
        console.log(itemchange);
        let cal = 0;
        for (const item of itemchange) {
          cal += item.price * (item.quantity * 1);
        }
        ``;
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
    //functions related to remote search
    getUserList(query) {
      // console.log(typeof query);
      // this.loading = true;
      // remoteSearchUser(query)
      //   .then((response) => {
      //     if (!response.data) return;
      //     this.ownerList = response.data.map((v) => v.name);
      //     console.log(this.ownerList);
      //   })
      //   .then((this.loading = false));
    },
    getContactList(query) {
      this.loading = true;
      remoteSearchContact(query)
        .then((response) => {
          if (!response.data) return;
          this.contactOptionList = response.data.map((v) => ({
            contactId: v.id,
            contactName: v.firstname + " " + v.lastname,
          }));
          console.log(this.contactOptionList);
        })
        .then((this.loading = false));
    },
    getCompanyList(query) {
      this.loading = true;
      remoteSearchCompany(query)
        .then((response) => {
          if (!response.data) return;
          this.companyOptionList = response.data.map((v) => ({
            companyId: v.id,
            company: v.company,
          }));
          console.log(this.companyOptionList);
        })
        .then((this.loading = false));
    },
    quoteNumber(quoteNumber) {
      let query = { quotenumber: quoteNumber };
      checkQuoteNumber(query).then((response) => {
        console.log(response);
        if (response.data === "EXIST") {
          return true;
        } else {
          return false;
        }
      });
    },
    selectContact(e) {
      console.log(e);
      this.quote.contact = e.contactName;
      this.quote.contactId = e.contactId;
      console.log(this.quote);
    },
    selectCompany(e) {
      console.log(e);
      this.quote.company = e.company;
      this.quote.companyId = e.companyId;
      console.log(this.quote);
    },
    async remoteCheckContext(quotenumber) {
      let query = { quotenumber: quotenumber };
      let res = await checkContext(query);
      console.log(res);
      this.previousQuote = res.data.previousQuote ? res.data.previousQuote : "";
      this.nextQuote = res.data.nextQuote ? res.data.nextQuote : "";
      console.log(this.previousQuote);
      console.log(this.nextQuote);
    },
    jump(quote) {
      this.$router.push("/quote/list/edit/" + quote);
    },
    //Quote category
    handleCategoryChange() {
      for (const item of CategoryList) {
        if (item.value == this.quote.category) 
        this.productList = item.children;
      }
      console.log(this.CategoryList);
    },
    //Detailed product line
    handleCheckedProductChange() {
      console.log(this.checkedProducts)
      this.quote.product = this.checkedProducts.toString()
      console.log(this.quote.product)
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
.my-el-select /deep/ .el-input .el-input__inner {
  border-color: #dcdfe6 !important;
}

.float-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
}
</style>
  
  