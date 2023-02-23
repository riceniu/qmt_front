<template>
  <div class="components-container">
    <div>
      <tinymce v-model="content" :height="300" />
    </div>
    <div class="editor-content" v-html="content" />
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";

export default {
  name: "TinymceDemo",
  components: { Tinymce },
  data() {
    return {
      msg: "hope it works",
      content: `<hr />
<table style="border-collapse: collapse; width: 100%;" border="1">
<tbody>
<tr>
<td style="width: 50%;">
<h3>Quotation No. {{quote_number}}</h3>
</td>
<td style="width: 50%; text-align: right;">Date:{{quote_date}}</td>
</tr>
</tbody>
</table>
<p>{{quote.company}}</p>
<p>For:{{quote.contact}}</p>
<p>&nbsp;</p>
<p>{{quote.greeting}}</p>
<table style="border-collapse: collapse; width: 80.9989%; margin-left: auto; margin-right: auto;" border="1">
<tbody>
<tr>
<th style="width: 10%; text-align: center;">
<p>Item</p>
<p>No.</p>
</th>
<th style="width: 60%; text-align: left;">Description</th>
<th style="width: 10%;">Quantity</th>
<th style="width: 10%;">Unit Price</th>
<th style="width: 10%; text-align: center;">Total&nbsp; &nbsp;</th>
</tr>
<tr>
<td style="width: 10%; text-align: center;">
<p style="text-align: center;">{{quote.item.index}}</p>
</td>
<td style="width: 60%; text-align: left;">{{quote.item.quote_text}}</td>
<td style="width: 10%; text-align: center;">{{quote.item.quote_quantity}}</td>
<td style="width: 10%; text-align: right;">{{quote.item.quote_price}}</td>
<td style="width: 10%; text-align: right;">{{quote.item.quote_total}}</td>
</tr>
<tr>
<td style="width: 10%; text-align: center;">
<p>&nbsp;</p>
</td>
<td style="width: 60%; text-align: left;">&nbsp;</td>
<td style="width: 10%;">&nbsp;</td>
<td style="width: 10%; text-align: right;">Sub-total:</td>
<td style="width: 10%; text-align: right;">{{quote.subtotal}}</td>
</tr>
<tr>
<td style="width: 10%; text-align: center;">
<p>&nbsp;</p>
</td>
<td style="width: 60%; text-align: left;">&nbsp;</td>
<td style="width: 10%;">&nbsp;</td>
<td style="width: 10%; text-align: right;">Direct discount:</td>
<td style="width: 10%; text-align: center;">{{quote.discount_direct}}</td>
</tr>
<tr>
<td style="width: 10%; text-align: center;">
<p>&nbsp;</p>
</td>
<td style="width: 60%; text-align: left;">&nbsp;</td>
<td style="width: 10%;">&nbsp;</td>
<td style="width: 10%; text-align: right;">Discount %:</td>
<td style="width: 10%; text-align: center;">{{quote.discount}}</td>
</tr>
<tr>
<td style="width: 10%; text-align: center;">
<p>&nbsp;</p>
</td>
<td style="width: 60%; text-align: left;">&nbsp;</td>
<td style="width: 10%;">&nbsp;</td>
<td style="width: 10%; text-align: right;">VAT%:</td>
<td style="width: 10%; text-align: center;">{{quote.vat}}</td>
</tr>
<tr>
<td style="width: 10%; text-align: center;">
<p>&nbsp;</p>
</td>
<td style="width: 60%; text-align: left;">&nbsp;</td>
<td style="width: 10%;">&nbsp;</td>
<td style="width: 10%; text-align: right;"><hr />Total:</td>
<td style="width: 10%; text-align: center;"><hr />{{quote.total}}</td>
</tr>
</tbody>
</table>
<p>&nbsp;</p>
<h3 style="text-align: left;">Terms and Conditions:</h3>
<p>&nbsp;</p>
<table style="border-collapse: collapse; width: 100%; margin-left: auto; margin-right: auto;" border="1">
<tbody>
<tr>
<td style="width: 35%; border-style: groove;">Currency</td>
<td style="width: 35%;">{{quote.currency}}</td>
</tr>
<tr>
<td style="width: 50%;">Delivery term</td>
<td style="width: 50%;">{{quote.delivery}}</td>
</tr>
<tr>
<td style="width: 50%;">Trade term</td>
<td style="width: 50%;">{{quote.trade_term}}</td>
</tr>
<tr>
<td style="width: 50%;">Price</td>
<td style="width: 50%;">{{quote.price}}</td>
</tr>
<tr>
<td style="width: 50%;">Payment</td>
<td style="width: 50%;">{{quote.payment}}</td>
</tr>
<tr>
<td style="width: 50%;">
<div>
<div>Validity</div>
</div>
</td>
<td style="width: 50%;">{{quote.validity}}</td>
</tr>
<tr>
<td style="width: 50%;">
<div>
<div>Warranty</div>
</div>
</td>
<td style="width: 50%;">{{quote.warranty}}</td>
</tr>
</tbody>
</table>
<p>{{quote.ending}}</p>`,
    };
  },
};
</script>

<style scoped>
.editor-content {
  margin-top: 20px;
}
</style>

