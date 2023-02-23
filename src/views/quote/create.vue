<template>
  <quoteDetail :is-edit="false" />
</template>

<script>
import QuoteDetail from "./components/QuoteDetail";

export default {
  name: "CreateQuote",
  components: { QuoteDetail },
};
</script> 

