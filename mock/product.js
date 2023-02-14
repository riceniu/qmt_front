const Mock = require('mockjs')
const Mocked = require('./mocked_data')
const List = []
const count = 30

const baseContent = '<p>Product test data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'C:\Users\zhan_\Pictures\wallpaper\big-ben-bridge-castle-460672.jpg'

//dyanamic productList
/*
{
for (let i = 0; i < count; i++) {
  List.push(Mock.mock(
    {
    id: '@increment',
    quote_text: '@title(5, 10)',
    'currency|1':['CNY', 'USD', 'GBP', 'EUR'],
    'category|1':['Type-A','Type-B','Type-C'],
    price: '@float(100, 50000, 0, 0)',
    productname:'@word(1)'+'-'+'@integer(1,1000)'
  }
  ))
}
}
*/
//constant productList
List.push(...Mocked.product_list)
module.exports = [
  {
    url: '/vue-element-admin/product/list',
    type: 'get',
    response: config => {
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
      
      console.log('mock/product.js->product/list')
      //console.log(List)
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
    url: '/vue-element-admin/product/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const product of List) {
        if (product.id === +id) {
          return {
            code: 20000,
            data: product
          }
        }
      }
    }
  },

  {
    url: '/vue-element-admin/product/pv',
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
    url: '/vue-element-admin/product/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/product/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

