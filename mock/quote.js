const Mock = require("mockjs");

const List = [];
const count = 50;
const Mocked = require("./mocked_data");
const TempItemList = [];
const ProductList = Mocked.product_list;
const LIMIT = ProductList.length;
const FinalItemList = [];
const ItemList = [];

//dynamic quote
/*
{
for(let i = 0 ; i<Mocked.contact_list.length;i++){
  contact_list.push({
    contact: Mocked.contact_list[i].firstname + ' '+ Mocked.contact_list[i].lastname,
    company: Mocked.company_list[i].company,
    id:i
  })
}
for (let i = 0; i < count; i++) {
  let mocked = Mock.mock(
    {
    quote_number: 'ABC-'+'@increment',
    quote_date: '@date',
    'currency|1':['GBP','USD','EURO'],
    vat:'@float(0,0.1,2,2)',
    discount:'@float(0,0.3,2,2)',
    discount_direct:'@float(0,500,0,0)',
    total:'@float(800,50000,0,0)',
    'contactid|1':'@integer(0,29)',
    'owner|1':['Diane Gale','Zhan Niu'],
    item_quantity:'@integer(1,5)',  
    company:"",
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
}
*/

//constant quote
List.push(...Mocked.quote_list);

/*dynamic quote items*/
/*
{
for (let i = 25; i < 50; i++) {
  let mocked = Mock.mock(
    {
    quote_number: Mocked.quote_list[i].quote_number,
    item_number:'@integer(1,5)'
  }
  )
  TempItemList.push(mocked)
}
for(let i = 0; i < TempItemList.length; i++){
  for(let j = 0; j< TempItemList[i].item_number; j++){
    let index = Math.floor(Math.random() * LIMIT)
    FinalItemList.push(
      {
        quote_number:TempItemList[i].quote_number,
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
FinalItemList.push(...Mocked.quote_items);

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
  //       code: 20000,
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
  //     //console.log(FinalItemList)
  //     return {
  //       code: 20000,
  //       data: FinalItemList,
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
        code: 20000,
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
            code: 20000,
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
      FinalItemList.push(...config.body.items);
      // for(const item of config.body.items){
      //   console.log(...config.body.items.i)
      // ItemList.push(config.body.items.i)}
      return {
        code: 20000,
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
      for (const item of FinalItemList) {
        if (item.quote_number === changed.quote.quote_number) {
          index.push(FinalItemList.indexOf(item));
        }
      }
      for (let i = index.length - 1; i >= 0; i--) {
        //console.log(index);
        //console.log(FinalItemList[index[i]]);
        FinalItemList.splice(index[i], 1);
      }

      //console.log(changed.items);
      FinalItemList.push(...changed.items);
      return {
        code: 20000,
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
      for (const item of FinalItemList) {
        if (item.quote_number === config.body.quote_number) {
          index.push(FinalItemList.indexOf(item));
        }
      }
      for (let i = index.length - 1; i >= 0; i--) {
        console.log(index);
        console.log(FinalItemList[index[i]]);
        FinalItemList.splice(index[i], 1);
      }

      return {
        code: 20000,
        data: "Product deleted",
      };
    },
  },

  // get quoted items => return itemList
  {
    url: "/vue-element-admin/quote/items",
    type: "get",
    response: (config) => {
      console.log("mock/quote.js->quote/items");
      //console.log(config.query)
      const requestedNumber = config.query.quote_number;
      ItemList.length = 0;
      //console.log(requestedNumber)
      for (let i = 0; i < FinalItemList.length; i++) {
        //console.log(FinalItemList[i])
        if (FinalItemList[i].quote_number === requestedNumber) {
          ItemList.push(FinalItemList[i]);
        }
      }
      //console.log(correction)
      //console.log(ItemList);

      return {
        code: 20000,
        data: ItemList,
      };
    },
  },
];
