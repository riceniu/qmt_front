const Mock = require('mockjs')

const List = []
const count = 50
const Mocked = require('./mocked_data')
const TempItemList = []
const ProductList=Mocked.product_list
const LIMIT = ProductList.length
const FinalItemList = []
const ItemList=[]


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
}}
*/

//constant quote
List.push(...Mocked.quote_list)


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
FinalItemList.push(...Mocked.quote_items)

module.exports = [
  {
    url: '/vue-element-admin/quote/list',
    type: 'get',
    response: config => {
    console.log('mock.js/quote.js->quote/list')

      const { importance, type, title, page = 1, limit = 20, sort } = config.query
     let mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      //console.log(List)
      //console.log(contact_list)
      //console.log(product_list)
      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/vue-element-admin/quote/detail',
    type: 'get',
    response: config => {
      const { qn } = config.query
      //console.log('mock/quote.js->quote/detail')
      //console.log(config.query)
      for (const quote of List) {
        if (quote.quotenumber === qn) {
          console.log('mock/quote.js->quote/detail')
          //console.log(quote)
          return {
            code: 20000,
            data: quote
          }
        }
      }
    }
  },

  {
    url: '/vue-element-admin/quote/pv',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },

  {
    url: '/vue-element-admin/quote/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/quote/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/quote/items/list',
    type: 'get',
    response: config => {
      console.log('mock/quote.js->quote/items/list')
      //console.log(config.query)
      //console.log(FinalItemList)
      return {
        code: 20000,
        data: FinalItemList
      }
    }
  },
  {
    url: '/vue-element-admin/quote/items',
    type: 'get',
    response: config => {
      console.log(config.query)
      console.log('mock/quote.js->quote/items')
      const requestedNumber = config.query.quote_number
      ItemList.length = 0
      console.log(requestedNumber)
      for(let i=0;i<FinalItemList.length;i++){
        console.log(FinalItemList[i])
        if(FinalItemList[i].quote_number === requestedNumber)
          {
            ItemList.push(FinalItemList[i])
          }
      }
      console.log(ItemList)
      return {
        code: 20000,
        data: ItemList
      }
    }
  },

]

