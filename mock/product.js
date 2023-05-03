const Mock = require("mockjs");
const Mocked = require("./mocked_data");
const List = [];
const count = 30;

const baseContent =
  '<p>Product test data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>';
const image_uri =
  "";

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

List.push(...Mocked.product_list);

//product price optimization
/*const correction=[]
{
  const productList = Mocked.product_list
  for(const product of productList){
    product.price = (Math.floor(Math.random()*20 )+ 1) *100
    correction.push(product)
  }
  //console.log(correction)
}*/

const categoryOptionList = [];
let optionList = [];

function updateCategoryOptions() {
  categoryOptionList.length = 0;
  optionList = [];
  let temptype = [];
  for (const product of List) {
    if (temptype.indexOf(product.category) < 0) {
      temptype.push(product.category);
      categoryOptionList.push({
        value: product.category,
        label: product.category,
        children: [
          {
            value: product.productname,
            label: product.productname,
            ...product,
          },
        ],
      });
    } else {
      categoryOptionList[temptype.indexOf(product.category)].children.push({
        value: product.productname,
        label: product.productname,
        ...product,
      });
    }
  }

  optionList = categoryOptionList.sort((a, b) =>
    a.value.localeCompare(b.value)
  );
}
//console.log(optionList)

module.exports = [
  //useless
  {
    // {
    //   url: '/vue-element-admin/product/detail',
    //   type: 'get',
    //   response: config => {
    //     const { id } = config.query
    //     for (const product of List) {
    //       if (product.id === +id) {
    //         return {
    //           code: 20000,
    //           data: product
    //         }
    //       }
    //     }
    //   }
    // },
    // {
    //   url: '/vue-element-admin/product/pv',
    //   type: 'get',
    //   response: _ => {
    //     return {
    //       code: 20000,
    //       data: {
    //         pvData: [
    //           { key: 'PC', pv: 1024 },
    //           { key: 'mobile', pv: 1024 },
    //           { key: 'ios', pv: 1024 },
    //           { key: 'android', pv: 1024 }
    //         ]
    //       }
    //     }
    //   }
    // },
    // {
    //   url: '/vue-element-admin/product/create',
    //   type: 'post',
    //   response: _ => {
    //     return {
    //       code: 20000,
    //       data: 'success'
    //     }
    //   }
    // },
    // {
    //   url: '/vue-element-admin/product/update',
    //   type: 'post',
    //   response: _ => {
    //     return {
    //       code: 20000,
    //       data: 'success'
    //     }
    //   }
    // },
  },
  {
    url: "/vue-element-admin/product/list",
    type: "get",
    response: (config) => {
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

      console.log("mock/product.js->product/list");
      console.log(`return
      pageList:`);
      console.log(pageList);
      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList,
        },
      };
    },
  },
  // return last id of product
  {
    url: "/vue-element-admin/product/lastid",
    type: "get",
    response: (config) => {
      let lastId = List[List.length - 1].id;
      console.log(`return:
      data:`)
      console.log(lastId)
      return {
        code: 20000,
        data: lastId,
      };
    },
  },

  {
    url: "/vue-element-admin/product/add",
    type: "post",
    response: (config) => {
      console.log("mock/product.js->add");
      console.log(`received: config.body`)
      console.log(config.body)
      List.push(config.body);
      return {
        code: 20000,
        data: "success",
      };
    },
  },

  {
    url: "/vue-element-admin/product/edit",
    type: "post",
    response: (config) => {
      console.log("mock/product.js->edit");
      console.log(`received config.body`)
      console.log(config.body)
      const changed = config.body;
      for (const product of List) {
        if (product.id === changed.id) {
          List[List.indexOf(product)] = changed;
          //console.log(List)
          return {
            code: 20000,
            data: "success",
          };
        }
      }
      // console.log(List)
      return {
        code: 20000,
        data: "Name not found",
      };
    },
  },

  {
    url: "/vue-element-admin/product/delete",
    type: "delete",
    response: (config) => {
      console.log("mock/product.js->delete");
      console.log(`received config.body`)
      console.log(config.body);
      let index;
      for (const product of List) {
        if (product.id === config.body.id) {
          index = List.indexOf(product);
          //console.log("index " + index);
          List.splice(index, 1);
          break;
        }
      }
      return {
        code: 20000,
        data: "Product deleted",
      };
    },
  },

  {
    url: "/vue-element-admin/product/category",
    type: "get",
    response: (config) => {
      console.log(
        "mock/product.js->category -----get product list with category"
      );
      updateCategoryOptions();
      //console.log(optionList)
      return {
        code: 20000,
        data: optionList,
      };
    },
  },
];
