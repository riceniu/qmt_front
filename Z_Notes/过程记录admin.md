## 1. clone项目
`git clone https://github.com/PanJiaChen/vue-element-admin.git`
## 1.0 启动项目后发现`ERR_OSSL_EVP_UNSUPPORTED`的问题
将package.json中
```json
"dev": "vue-cli-service serve",
```
改为：
```json
"dev": "SET NODE_OPTIONS=--openssl-legacy-provider && vue-cli-service serve",
```
## 2. 修改基础参数
项目文件夹名称
pacakge.json 项目信息
vue.config.js 端口号
src/setting.js 浏览器地址栏标题
public/favicon.ico 浏览器地址栏图标
src/main.js 国际化
src/views/login/index.vue c登录页面相关
src/router/index.js 首页标题
src/layout/components/Navbar.vue 首页用户下拉列表

## 3. push至github
删除原有git，创建新git，push至github
删除原有readme.md

## 4. 建立Tag, Branch

初始化完成后，建立Project_Initialization的Tag

建立Branches

## 4. views中建立qh
分别在quote/user/customer/product等建立相应index页面 
## 5. 编辑路由	

1. dashboard
2. Quote
3. Customer
   1. Company
   2. Contact
4. User
```javascript
// router/index.js
{
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/quote',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Quote',
        component: () => import('@/views/qh/quote/index'),
        meta: { title: 'Quote', icon: 'el-icon-document' }
      }
    ]
  },

  {
    path: '/customer',
    component: Layout,
    name: 'Customer',
    meta: { title: 'Customer', icon: 'el-icon-connection' },
    children: [
      {
        path: 'customer',
        name: 'Customer',
        component: () => import('@/views/qh/customer/index'),
        meta: { title: 'Customer', icon: 'el-icon-connection' },
        hidden: true
      },
      {
        path: 'company',
        name: 'Company',
        component: () => import('@/views/qh/customer/company/index'),
        meta: { title: 'Company', icon: 'el-icon-office-building' }
      },
      {
        path: 'contact',
        name: 'Contact',
        component: () => import('@/views/qh/customer/contact/index'),
        meta: { title: 'Contact', icon: 'el-icon-user' }
      }
    ]
  },

  {
    path: '',
    component: Layout,
    children: [{
      path: 'user',
      name: 'User',
      component: () => import('@/views/qh/user/index'),
      meta: { title: 'User Management', icon: 'el-icon-service' }
    }]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'product',
        name: 'Product',
        component: () => import('@/views/qh/product/index'),
        meta: { title: 'Product Management', icon: 'el-icon-collection' }
      }
    ]
  },
```
