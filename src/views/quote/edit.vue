<template>
    <quoteDetail :is-edit="true" />
</template>
  
  <script>
  import QuoteDetail from './components/QuoteDetail'
  
  export default {
    name: 'EditForm',
    components: { QuoteDetail }
  }
  </script> 
  
  