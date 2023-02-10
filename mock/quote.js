const Mock = require('mockjs')

const List = []
const count = 50
const Mocked = require('./mocked_data')
const contact_list = []
const company_list = []
const product_list = []

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'
//********************************************************* */
for(let i = 0 ; i<Mocked.contact_list.length;i++){
  contact_list.push(Mocked.contact_list[i].email)
}
for(let i = 0 ; i<Mocked.company_list.length;i++){
  company_list.push(Mocked.company_list[i].company)
}
for(let i = 0; i<Mocked.product_list.length;i++){
  product_list.push(Mocked.product_list[i])
}
/************************************************************** */
 
//Create a List which contains all mocked artical data
for (let i = 0; i < count; i++) {
  List.push(Mock.mock(
    {
    quote_number: 'ABC-'+'@increment',
    quote_date: '@date',
    'currency|1':['GBP','USD','EURO'],
    vat:'@float(0,0.1,2,2)',
    discount:'@float(0,0.3,2,2)',
    discount_direct:'@float(0,500,0,0)',
    total:'@float(800,50000,0,0)',
    'contact|1':contact_list,
    'company|1':company_list,
    'owner|1':['Diane Gale','Zhan Niu'],
    item_quantity:'@integer(1,5)',  
    items:[]
  }
  ))
}

let temp
for(let i=0;i<List.length;i++){
  for(let j=0;j<List[i].item_quantity;j++){
  temp = Mock.mock({'items|1':product_list})
  List[i].items.push(temp.items)
}}



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
      console.log(pageList)
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
      const { id } = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 20000,
            data: article
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
  }
]

