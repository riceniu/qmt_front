<template>
  <div class="components-container">
    <div>
      <tinymce v-model="content" :height="300" />
    </div>
    <!-- <div class="editor-content" v-html="content"></div> -->
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import getContent from "../print/2Html"
import {
  fetchQuoteItems,
} from "@/api/quote";

export default {
  name: "TinymceDemo",
  components: { Tinymce },
  data() {
    return {
      content:"",
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
      tempQuoteItemQueryVO:""
    }
  },
  created(){
    this.fetchDate(this.$route.params.id)
    //console.log(this.content)
  },
  methods:{
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
          this.content=getContent(response.data)
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
  }
}
</script>

<style scoped>
.editor-content{
  margin-top: 20px;
}
</style>