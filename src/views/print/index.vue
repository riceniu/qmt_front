<template>
  <div class="components-container">
    <!-- <div>
      <Editor v-model="content"></Editor>
    </div> -->
    <div class="float-button">
      <el-tooltip content="Back to Quote List" placement="top-end">
        <el-button icon="el-icon-arrow-left" type="primary" @click="jump()"
          >Back </el-button
        >
      </el-tooltip>
    </div>
    <div><APP v-model="content" :QN="QN"></APP></div>
    <div>
      <tinymce v-model="tinycontent" :height="300" />
    </div>
    <!-- <div class="editor-content" v-html="content"></div> -->
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import Editor from "@/components/canvas-editor";
import getContent from "../print/2Html";
import APP from "@/components/jsdocx";
import { fetchQuoteItems } from "@/api/quote";
import "./HtmlExportToWord";

export default {
  name: "PrintEditor",
  components: { Tinymce, Editor, APP },
  data() {
    return {
      content: "",
      tinycontent: "",
      QN: "",
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
      quoteItem: {
        quotenumber: "",
      },
      tempQuoteItemQueryVO: "",
    };
  },
  created() {
    this.QN = this.$route.params.id;
    this.fetchDate(this.QN);
    //console.log(this.content)
  },
  methods: {
    fetchDate(quotenumber) {
      console.log("fetch");
      console.log(quotenumber);
      this.quoteItem.quotenumber = quotenumber;
      fetchQuoteItems(this.quoteItem)
        .then((response) => {
          // this.tempQuoteItemQueryVO = response.data;
          // console.log(this.tempQuoteItemQueryVO);
          // this.quote = response.data.quote;
          // this.items = response.data.itemList;
          // this.PassQuoteNumber = this.quote.quoteNumber;
          // this.gotList = true;
          this.content = getContent(response.data);
          this.tinycontent =
            `<p style="text-align: right;"><span style="font-family: arial, helvetica, sans-serif;"><img
            src="https://kehui.wpenginepowered.com/wp-content/uploads/2018/08/kehuilogo2.svg" width="130" /></span></p>
            <hr />` +
            this.content +
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
          //initial productList

          // for (const item of CategoryList) {
          //   if (item.value === this.quote.category)
          //     this.productList = item.children;
          //     this.checkedProducts = this.quote.product.split(",")
          // }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    jump() {
    this.$router.push("/quote/list/");
  },
  },

};
</script>

<style scoped>
.float-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
}
.editor-content {
  margin-top: 20px;
}
</style>