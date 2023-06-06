<template>
  <div class="app-container">
    <div class="float-button">
      <el-button
        type="primary"
        icon="el-icon-edit"
        @click="isEdit ? editQuote() : addQuote()"
        :disabled="!dataChanged"
        >Save</el-button
      >
      <el-button
        v-if="isEdit"
        type="success"
        icon="el-icon-printer"
        :disabled="dataChanged"
        @click="jumpToPrint"
        >Print</el-button
      >
      <br />
      <br />
      <el-tooltip content="Back to list" placement="top-end">
        <el-button type="" @click="jumpToList()">Back</el-button>
      </el-tooltip>
      <el-tooltip
        v-if="isEdit && previousQuote != ''"
        :content="previousQuote"
        placement="top-end"
      >
        <el-button
          icon="el-icon-arrow-left"
          type=""
          @click="jump(previousQuote)"
          >Previous</el-button
        >
      </el-tooltip>
      <el-tooltip
        v-if="isEdit && nextQuote != ''"
        :content="nextQuote"
        placement="top-end"
      >
        <el-button icon="el-icon-arrow-right" type="" @click="jump(nextQuote)"
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
        <el-col :span="8">
          <el-form-item label="Owner" prop="owner">
            <el-select
              v-model="quote.owner"
              filterable
              remote
              loading-text="loading from HubSpot"
              :remote-method="getUserList"
              placeholder="Please select"
              @change="updateOwner"
              automatic-dropdown
            >
              <el-option
                v-for="item in ownerList"
                :key="item.id"
                :label="item.firstName + ' ' + item.lastName"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <!-- <el-form-item label="Contact" prop="contact">
            <el-input v-model="quote.contact" />
          </el-form-item> -->
          <el-form-item label="Contact" prop="contact">
            <el-select
              :clearable="true"
              v-model="quote.contact"
              @change="selectContact"
              value-key="id"
              filterable
              remote
              :loading="loading"
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

        <el-col :span="6">
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
        <el-col :span="6">
          <el-form-item label="Stage" prop="stage">
            <el-select
              v-model="quote.stage"
              placeholder="Please select"
              automatic-dropdown
            >
              <el-option
                v-for="(item, index) in stageList"
                :key="item + index"
                :label="item.label"
                :value="item.label"
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
          <el-form-item label="Product" prop="product">
            <el-select
              multiple
              collapse-tags
              filterable
              clearable
              v-model="checkedProduct"
              placeholder=""
              @focus="fetchCatalog"
              @change="handleSelectProduct"
            >
              <el-checkbox-group v-model="checkedProduct">
                <el-option
                  v-for="item in HS_Products"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                >
                  <el-checkbox
                    style="pointer-events: none"
                    :label="item.value"
                  ></el-checkbox>
                </el-option>
              </el-checkbox-group> </el-select
          ></el-form-item>

          <!-- <el-form-item label="Category" class="narrow" prop="category">
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
          </el-form-item> -->
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="Warranty" class="narrow">
            <el-input v-model="quote.warranty" />
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="3">
          <el-form-item label="Group" class="narrow" prop="category">
            <el-select
              multiple
              collapse-tags
              filterable
              clearable
              v-model="checkedGroup"
              placeholder=""
              @focus="fetchCatalog"
              @change="handleSelectGroup"
            >
              <el-checkbox-group v-model="checkedGroup">
                <el-option
                  v-for="item in HS_Product_Group"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label"
                >
                  <el-checkbox
                    style="pointer-events: none"
                    :label="item.value"
                  ></el-checkbox>
                </el-option>
              </el-checkbox-group> </el-select
          ></el-form-item>
          <!-- <el-checkbox-group
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
          </el-checkbox-group> -->
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
          >
            <el-form-item
              label="Deal in HubSpot?"
              label-width="200px"
              v-if="isEdit"
            >
              <el-button
                v-if="quote.inHubSpotDeal != 0"
                type="primary"
                :disabled="true"
                >Yes, HubSpot id {{ quote.inHubSpotDeal }}</el-button
              >
              <el-button
                v-if="quote.inHubSpotDeal == 0"
                type="success"
                :disabled="dataChanged"
                @click="uploadDeal"
              >
                Not yet, click to upload</el-button
              >
            </el-form-item></el-col
          >
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
import {
  remoteSearchCompany,
  remoteSearchContact,
  productCatalog,
  getHSOwnerList,
  checkExisting,
  postDeal,
  
} from "@/api/hubspot";

import getContent from "../../print/2Html";

const CurrencyType = [
  { key: "USD", value: "USD" },
  { key: "GBP", value: "GBP" },
  { key: "Euro", value: "Euro" },
];

// const CategoryList = [
//   {
//     key: "CFL",
//     value: "CFL",
//     label: "CFL",
//     children: ["T-3xx", "T-5XX", "T-9XX", "T-P2X", "Other"],
//   },
//   { key: "PU", value: "PU", label: "PU", children: ["TWFL", "FTR", "GPS"] },
//   { key: "DA", value: "DA", label: "DA", children: ["PZG"] },
//   { key: "MOTOR", value: "MOTOR", label: "MOTOR", children: ["SRM", "SyRM"] },
// ];
const stageList = [
  { label: "Quotation sent" },
  // { label: "Closed won" },
  // { label: "Closed lost" },
];
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
      //data changed
      dataChanged: false,
      savedQuote: {},
      savedQuoteItem: [],

      //product & category
      //checkedProducts: [],
      productList: null,
      HS_Product_Group: [],
      checkedGroup: [],
      HS_Products: [],
      checkedProduct: [],

      //tip for previous/next quote number
      previousQuote: "",
      nextQuote: "",
      //flag if got data from database
      gotList: false,
      //CategoryList,
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
        greeting:
          "Thank you for your enquiry. Please find below our quotation as requested.",
        owner: "",
        ownerId: "",
        dateQuote: "",
        ending:
          "Thank you for the opportunity to submit a quotation to you. If you have any queries or require further information please do not hesitate to contact us.",
        price: "",
        tradeTerm: "Ex Works",
        delivery: "5-6 weeks from formal purchase order",
        payment: "",
        validity: "90 days",
        warranty: "18 months from delivery ",
        category: "",
        product: "",
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
      contact: {},
      company: {},
      PassQuoteNumber: "",
      subtotal: 0,
      tempQuoteItemQueryVO: "",
      loading: false,
    };
  },
  created() {
    console.log("created");

    // Initial ownerlist local
    // remoteSearchUser("").then((response) => {
    //   if (!response.data) return;
    //   this.ownerList = response.data.map((v) => v.name);
    //   //console.log(this.ownerList);
    // });

    //Initial ownerlist HubSpot
    getHSOwnerList().then((res) => {
      if (!res.data) return;
      this.ownerList = res.data.results.map((v) => v);
    });

    if (this.isEdit) {
      this.fetchData(this.$route.params.id);
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
      this.quote.stage = "Quotation sent";
      console.log(this.quote);
    }
    this.initQuoteVo = Object.assign({}, this.tempQuoteItemQueryVO);
  },
  mounted() {},
  beforeDestroy() {},
  updated() {},
  watch: {
    dynamicQuote: {
      handler(newVal, oldVal) {
        console.log("++++++++++++++++++++watch Quote+++++++++++++++++++++++++");
        if (JSON.stringify(newVal) === JSON.stringify(this.savedQuote)) {
          this.dataChanged = false;
        } else {
          this.dataChanged = true;
        }
      },
    },
    dynamicQuoteItems: {
      handler(newVal, oldVal) {
        console.log("++++++++++++++++++++watch QuoteItems++++++++++++++++++++");
        if (this.savedQuoteItem.length == newVal.length) {
          for (let i = 0; i < this.savedQuoteItem.length; i++) {
            //console.log(newVal[i], this.savedQuoteItem[i]);
            newVal[i].quantity = newVal[i].quantity.toString();
            // console.log(
            //   JSON.stringify(newVal[i]) ===
            //     JSON.stringify(this.savedQuoteItem[i])
            // );
            if (
              JSON.stringify(newVal[i]) !==
              JSON.stringify(this.savedQuoteItem[i])
            ) {
              this.dataChanged = true;
              break;
            }
          }
        }
        if (JSON.stringify(newVal) === JSON.stringify(this.savedQuoteItem)) {
          this.dataChanged = false;
        } else {
          this.dataChanged = true;
        }
      },
    },
    //deep: true,
    //immediate: true
  },
  computed: {
    dynamicQuote() {
      return JSON.parse(JSON.stringify(this.quote));
    },
    dynamicQuoteItems() {
      return JSON.parse(JSON.stringify(this.items));
    },
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
    fetchData(quotenumber) {
      console.log("fetch");
      console.log(quotenumber);
      this.quoteItem.quotenumber = quotenumber;
      fetchQuoteItems(this.quoteItem)
        .then((response) => {
          this.tempQuoteItemQueryVO = response.data;
          //console.log(this.tempQuoteItemQueryVO);
          this.quote = response.data.quote;
          this.items = response.data.itemList;
          this.PassQuoteNumber = this.quote.quoteNumber;
          this.gotList = true;

          this.savedQuote = JSON.parse(JSON.stringify(this.quote));
          this.savedQuoteItem = JSON.parse(JSON.stringify(this.items));

          //initial productList local
          // for (const item of CategoryList) {
          //   if (item.value === this.quote.category)
          //     this.productList = item.children;
          //   this.checkedProducts = this.quote.product.split(",");
          // }

          //initial productList remote

          this.fetchCatalog();
          // debugger
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
      //check if quote number already exists
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
        if (this.items.length === 0) {
          this.$message({
            type: "error",
            message: "No items added",
          });
        } else {
          this.$refs["quote"].validate((valid) => {
            console.log(valid);
            if (valid) {
              //debugger;
              this.checkCustomerIfExisting();
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
      }
    },
    editQuote() {
      if (this.items.length === 0) {
        this.$message({
          type: "error",
          message: "No items added",
        });
      } else {
        this.$refs["quote"].validate((valid) => {
          console.log(valid);
          if (valid) {
            //console.log("editQuote");
            //console.log(this.quote);
            this.checkCustomerIfExisting();
            this.quote.company = this.quote.companyId;
            this.quote.contact = this.quote.contactId;
            let quotedata = {
              quote: this.quote,
              itemList: this.items,
            };
            console.log(quotedata);
            updateQuote(quotedata)
              .then(
                this.$message({
                  type: "success",
                  message: "Successfully saved",
                })
              )
              .then(location.reload());
            //this.$router.push({ path: "/quote/"+this.$route.params });
            //location.reload();
            //this.dataChanged = false;
          }
        });
      }
    },

    itemChange: function (itemchange) {
      console.log("parent->itemchange");
      //console.log(itemchange);
      if (itemchange.length > 0) {
        console.log(itemchange);
        let cal = 0;
        for (const item of itemchange) {
          cal += item.price * (item.quantity * 1);
          item.quantity = item.quantity.toString();
        }
        //console.log(cal);
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
          //local research
          //if (!response.data) return;
          // this.contactOptionList = response.data.map((v) => ({
          //   contactId: v.id,
          //   contactName: v.firstname + " " + v.lastname,
          // }));

          //remote Search
          if (!response.data) return;
          this.contactOptionList = response.data.results.map((v) => ({
            contactId: v.id,
            contactName:
              v.properties.firstname +
              " " +
              v.properties.lastname +
              " " +
              v.properties.email,
            contactItem: v.properties,
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

          // local database
          // this.companyOptionList = response.data.map((v) => ({
          //   companyId: v.id,
          //   company: v.company,
          // }));

          //Remote from HubSpot
          this.companyOptionList = response.data.results.map((v) => ({
            companyId: v.id,
            company: v.properties.name,
            companyItem: v.properties,
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
      //console.log(e);
      this.quote.contact = e.contactName;
      this.quote.contactId = e.contactId;
      this.contact = e.contactItem;
      //console.log(this.quote);
    },
    selectCompany(e) {
      //console.log(e);
      this.quote.company = e.company;
      this.quote.companyId = e.companyId;
      this.company = e.companyItem;
      //console.log(this.quote);
    },
    async remoteCheckContext(quotenumber) {
      let query = { quotenumber: quotenumber };
      let res = await checkContext(query);
      //console.log(res);
      this.previousQuote = res.data.previousQuote ? res.data.previousQuote : "";
      this.nextQuote = res.data.nextQuote ? res.data.nextQuote : "";
      //console.log(this.previousQuote);
      //console.log(this.nextQuote);
    },
    jump(quote) {
      this.$router.push("/quote/list/edit/" + quote);
    },
    jumpToList() {
      this.$router.push("/quote/list/");
    },
    jumpToPrint() {
      this.$router.push("/quote/print/" + this.$route.params.id);
    },
    //Quote category
    handleCategoryChange() {
      for (const item of CategoryList) {
        if (item.value == this.quote.category) this.productList = item.children;
      }
      //console.log(this.CategoryList);
    },
    //Detailed product line
    handleCheckedProductChange() {
      //console.log(this.checkedProducts);
      this.quote.product = this.checkedProducts.toString();
      //console.log(this.quote.product);
    },
    //check if customer information is already instored in Local DB
    checkCustomerIfExisting() {
      //debugger;
      let query = {
        company: this.company,
        contact: this.contact,
      };
      //console.log(query);
      const res = checkExisting(query);
    },
    // Category select
    fetchCatalog() {
      console.log("fetchCatalog");
      if (this.HS_Product_Group.length !== 0 && this.HS_Products.length !== 0) {
      } else {
        productCatalog().then((response) => {
          this.HS_Product_Group = response.data[1].options;
          this.HS_Products = response.data[0].options;
        });
      }
      //debugger
      if (this.quote.category.length !== 0) {
        this.checkedGroup = this.quote.category.split(",");
      }
      if (this.quote.product.length !== 0) {
        this.checkedProduct = this.quote.product.split(",");
      }
    },
    handleSelectGroup(value) {
      console.log(this.checkedGroup);
      this.quote.category = this.checkedGroup.toString();
      console.log(this.quote.category);
    },
    handleSelectProduct(value) {
      this.quote.product = this.checkedProduct.toString();
      console.log(this.quote.product);
    },
    updateOwner(val) {
      console.log(val);
      this.quote.owner = val.firstName + " " + val.lastName;
      this.quote.ownerId = val.id;
    },
    uploadDeal() {
      let richtext =
        `<p style="text-align: right;"><span style="font-family: arial, helvetica, sans-serif;"><img
            src="https://kehui.wpenginepowered.com/wp-content/uploads/2018/08/kehuilogo2.svg" width="130" /></span></p>
            <hr />` +
        getContent(this.tempQuoteItemQueryVO) +
        `<hr />
            <div style="text-align: center;"><span style="font-family: arial, helvetica, sans-serif; font-size: 10px;"><strong>Kehui
                        International Ltd</strong></span></div>
            <div style="text-align: center;"><span style="font-family: arial, helvetica, sans-serif; font-size: 10px;">2 Centrus,
                    Mead
                    Lane, Hertford, Hertfordshire, SG13 7GX, UK</span></div>
            <div style="text-align: center;"><span style="font-family: arial, helvetica, sans-serif; font-size: 10px;">Tel: +44 (0)
                    1920 358990&nbsp;&nbsp;&nbsp; Email: <a style ="color: #0000ff;" href="mailto:info@kehui.com">info@kehui.com</a>&nbsp;&nbsp;&nbsp;&nbsp;
                    <a style ="color: #0000ff;" href="http://www.kehui.com">www.kehui.com</a></span></div>
            <div style="text-align: center"><span style="font-family: arial, helvetica, sans-serif ;font-size: 10px;">Company Reg
                    No.
                    10283200&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                    &nbsp; &nbsp; &nbsp; VAT No. 287095855</span>
            </div>`;
      let closedate = new Date(
        Date.parse(this.quote.dateQuote) + 90 * 1000 * 60 * 60 * 24
      )
        .toJSON()
        .split("T")
        .join(" ")
        .substring(0, 10);

      let deal = {
        properties: {
          amount: this.quote.total,
          closedate: closedate,
          dealname:
            "APItest " +
            this.quote.category +
            " " +
            this.quote.product +
            " " +
            this.quote.company,
          dealstage: "contractsent",
          hubspot_owner_id: this.quote.ownerId,
          pipeline: "default",
          product: this.quote.product.replaceAll(",", ";"),
          product_group: this.quote.category.replace(",", ";"),
          quote_richtext: richtext,
        },
        associations: [],
      };
      //debugger;
      if (this.quote.companyId > 1000) {
        deal.associations.push({
          to: {
            id: this.quote.companyId,
          },
          types: [
            {
              associationCategory: "HUBSPOT_DEFINED",
              associationTypeId: 5,
            },
          ],
        });
      }
      if (this.quote.contactId != null) {
        deal.associations.push({
          to: {
            id: this.quote.contactId,
          },
          types: [
            {
              associationCategory: "HUBSPOT_DEFINED",
              associationTypeId: 3,
            },
          ],
        });
      }
      postDeal(deal)
        .then((res) => {
          this.quote.inHubSpotDeal = res.data.id;
        })
        .then(() => {
          this.quote.company = this.quote.companyId;
          this.quote.contact = this.quote.contactId;
          let quotedata = {
            quote: this.quote,
            itemList: this.items,
          };
          updateQuote(quotedata).then(location.reload());
        });
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
  
  