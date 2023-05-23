const Mock = require("mockjs");

const List = [];
const count = 120;
const Mocked = require("./mocked_data");
const TempitemList = [];
const ProductList = Mocked.product_list;
const LIMIT = ProductList.length;
const FinalitemList = [];
const itemList = [];

//dynamic quote
/*
const contact_list=[];
{
for(let i = 0 ; i< Mocked.contact_list.length;i++){
  contact_list.push({
    contact: Mocked.contact_list[i].firstname + ' '+ Mocked.contact_list[i].lastname,
    company: Mocked.company_list[i].company,
    id:i
  })
}
for (let i = 0; i < count; i++) {
  let mocked = Mock.mock(
    {
    quoteNumber: 'ABC-'+'@increment',
    dateQuote: '@date',
    'currency|1':['GBP','USD','Euro'],
    'vat|1':["15","20","","","",""],
    'discount|1':['','','','','','5','15','20','25'],
        discountDirect:'@float(0,500,0,0)',
    total:'@float(800,50000,0,0)',
    'contactid|1':'@integer(0,299)',
    'owner|1':['Diane','Niu'],
    item_quantity:'@integer(1,5)',  
    company:"",
    "category|1":["CFL","PU","DA","Motor"],
    contact:"",
    'price|1':["VAT exclusive",'VAT inclusive'],
    'trade_term|1':['EXW', 'CIF', 'FOB', 'CFR'],
    delivery:'@integer(10,180)'+' days after payment',
    payment:'@title(1,5)',
    'validity|1':['30 days','60 days','90 days'],
    'warranty|1':['1 year', '2 years','3 years']
  }
  )
  mocked['company']=contact_list[mocked.contactid].company
  mocked.contact=contact_list[mocked.contactid].contact
  List.push(mocked)
}
}*/


//constant quote
List.push(...Mocked.quote_list);

/*dynamic quote items*/
/*
{
for (let i = 25; i < count; i++) {
  let mocked = Mock.mock(
    {
      quoteNumber: Mocked.quote_list[i].quoteNumber,
    item_number:'@integer(1,5)'
  }
  )
  TempitemList.push(mocked)
}
for(let i = 0; i < TempitemList.length; i++){
  for(let j = 0; j< TempitemList[i].item_number; j++){
    let index = Math.floor(Math.random() * LIMIT)
    FinalitemList.push(
      {
        quoteNumber:TempitemList[i].quoteNumber,
        item:ProductList[index].productname,
        price:ProductList[index].price,
        quantity:Math.floor(Math.random() * 9) + 1
      }
    )
  }
}
}
*/

//constant quote items
FinalitemList.push(...Mocked.quote_items);

//modification of mocked data
/*
const correction=[]
const quoteitems=[]
{

let item_list=Mocked.quote_items
for(const quote of Mocked.quote_list){
  let qn = quote.quote_number
  quote.total = 0
  quote.vat = (Math.random()*10>5) ? 0.2:0
  quote.discount = (Math.random()*10 > 9)?0.1 :0
  quote.discount_direct = (Math.random()*10>8) ? 500: 0
  for(const item of item_list)
  {
    if(item.quote_number === qn){
      for(const product of Mocked.product_list){
        if(product.productname === item.item){
          item.price = product.price
        }
      }
      quoteitems.push(item)
      quote.total += item.price * item.quantity
    }
  }
  quote.total = (quote.total - quote.discount_direct)*(1-quote.discount)*(1+quote.vat)
  delete quote.item_quantity
  correction.push(quote)
}
for(let i = 0; i<50 ; i++){
  quoteitems.shift()
}
//console.log(correction)
console.log(quoteitems)
}
*/

module.exports = [
  /* comment
{
  //
  // {
  //   url: "/vue-element-admin/quote/pv",
  //   type: "get",
  //   response: (_) => {
  //     return {
  //       code: 200,
  //       data: {
  //         pvData: [
  //           { key: "PC", pv: 1024 },
  //           { key: "mobile", pv: 1024 },
  //           { key: "ios", pv: 1024 },
  //           { key: "android", pv: 1024 },
  //         ],
  //       },
  //     };
  //   },
  // },

  // {
  //   url: "/vue-element-admin/quote/items/list",
  //   type: "get",
  //   response: (config) => {
  //     console.log("mock/quote.js->quote/items/list");
  //     //console.log(config.query)
  //     //console.log(FinalitemList)
  //     return {
  //       code: 200,
  //       data: FinalitemList,
  //     };
  //   },
  // },
},
*/

  // quote list
  {
    url: "/vue-element-admin/quote/list",
    type: "get",
    response: (config) => {
      console.log("mock.js/quote.js->quote/list");

      const {
        importance,
        type,
        title,
        page = 1,
        limit = 20,
        sort,
      } = config.query;
      let mockList = List.filter((item) => {
        if (importance && item.importance !== +importance) return false;
        if (type && item.type !== type) return false;
        if (title && item.title.indexOf(title) < 0) return false;
        return true;
      });

      if (sort === "-id") {
        mockList = mockList.reverse();
      }

      const pageList = mockList.filter(
        (item, index) => index < limit * page && index >= limit * (page - 1)
      );
      //console.log(List)
      //console.log(contact_list)
      //console.log(product_list)
      return {
        code: 200,
        data: {
          total: mockList.length,
          items: pageList,
        },
      };
    },
  },

  //quote detail(edit page)
  {
    url: "/vue-element-admin/quote/detail",
    type: "get",
    response: (config) => {
      console.log("mock/quote.js->quote/detail");
      //console.log(config.query)
      //console.log(qn)
      for (const quote of List) {
        if (quote.quote_number === config.query.quote_number) {
          return {
            code: 200,
            data: quote,
          };
          break;
        }
      }
    },
  },

  // create quote
  {
    url: "/vue-element-admin/quote/create",
    type: "post",
    response: (config) => {
      // console.log('mock/quote.js->quote/create')
      // console.log('config.body.quote & items')
      // console.log(config.body.quote)
      // console.log(...config.body.items)
      List.push(config.body.quote);
      FinalitemList.push(...config.body.items);
      // for(const item of config.body.items){
      //   console.log(...config.body.items.i)
      // itemList.push(config.body.items.i)}
      return {
        code: 200,
        data: "success",
      };
    },
  },

  //update quote
  {
    url: "/vue-element-admin/quote/update",
    type: "post",
    response: (config) => {
      console.log("mock/quote.js->quote/update");
      const changed = config.body;
      for (const quote of List) {
        if (quote.quote_number === changed.quote.quote_number) {
         // console.log(changed.quote);
          List[List.indexOf(quote)] = changed.quote;
        }
      }
      let index = [];
      for (const item of FinalitemList) {
        if (item.quote_number === changed.quote.quote_number) {
          index.push(FinalitemList.indexOf(item));
        }
      }
      for (let i = index.length - 1; i >= 0; i--) {
        //console.log(index);
        //console.log(FinalitemList[index[i]]);
        FinalitemList.splice(index[i], 1);
      }

      //console.log(changed.items);
      FinalitemList.push(...changed.items);
      return {
        code: 200,
        data: "success",
      };
    },
  },

  // delete quote & related items
  {
    url: "/vue-element-admin/quote/delete",
    type: "delete",
    response: (config) => {
      console.log("mock/quote.js->delete");
      //console.log(config.body);
      let index;
      for (const quote of List) {
        if (quote.quote_number === config.body.quote_number) {
          index = List.indexOf(quote);
          List.splice(index, 1);
        }
      }
      index = [];
      for (const item of FinalitemList) {
        if (item.quote_number === config.body.quote_number) {
          index.push(FinalitemList.indexOf(item));
        }
      }
      for (let i = index.length - 1; i >= 0; i--) {
        console.log(index);
        console.log(FinalitemList[index[i]]);
        FinalitemList.splice(index[i], 1);
      }

      return {
        code: 200,
        data: "Product deleted",
      };
    },
  },

  // get quoted items => return itemList
  {
    url: "/vue-element-admin/quote/items",
    type: "get",
    response: (config) => {
      const returnMsg={quote:"",itemList:""}
      
      console.log("mock/quote.js->quote/items");
      console.log(config.query)
      const requestedNumber = config.query.quotenumber;
      for(item of List){
        if(item.quoteNumber === requestedNumber)
        returnMsg.quote = item

      }
      itemList.length = 0;
      //console.log(requestedNumber)
      for (let i = 0; i < FinalitemList.length; i++) {
        //console.log(FinalitemList[i])
        if (FinalitemList[i].quoteNumber === requestedNumber) {
          itemList.push(FinalitemList[i]);
        }
      }
      //console.log(correction)
      console.log(itemList);
      returnMsg.itemList = itemList
      return {
        code: 200,
        data: returnMsg,
      };
    },
  },
];
