登录过程
### permission.js
在登陆这个流程中，permission.js这个是最重要的一环，其实这个文件就是路由的全局钩子（beforeEach和afterEach），全局钩子的意思就是每次跳转的时候可以根据情况进行拦截，不让它进行跳转。使用场景最常见的就是有些页面需要用户登陆之后才能访问，就可以在beforeEach中校验用户是否登陆来进行相对应的拦截处理。下面会详细的讲解permission.js的内容。
### util / auth.js
这个文件主要就是设置token到cookie中的操作封装。
### router
这个是路由中的一些设置，理解这个后面看组件Sidebar、TagViews将会事半功倍。
```js
//router/index.js
  hidden: true                      是否隐藏于Sidebar侧边栏       
  alwaysShow: true					是否显示在根菜单
  redirect: noRedirect				Breadcrumb中重定向的path
  name: 'router-name'				用于keep-alive的Name
  meta: {
	roles: ['admin', 'editor'],		当前路由的访问所需要权限
	title: 'title',					Sidebar和Breadcrumb的title
	icon: 'svg-name',				Sibebar的icon
	noCache: true					是否设置不缓存
	breadcrumb: true				是否显示在Breadcrumb上
	activeMenu: '/example/list'		Sidebar高亮时的显示path
  }
```

### view / login / index.vue
省略了一些的细枝末节，直接从点击登陆之后发生了一系列事情开始讲起，第一个就是handleLogin方法。
```js
//views/login/index.vue
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(
              
              () => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
```
复制代码可以看到这个方法很简单，就是利用validate方法进行表单验证，验证通过则使用this.$store.dispatch调用user/login方法并传递这个表单的数据，然后有一个.then()方法，方法里面有this.$router.push(...)，可能有同学就会有疑惑了，this.redirect和this.otherQuery是啥，用一句话来概括就是：
我从哪里跳到/login页面，登陆之后我就返回到哪里。
这个user/login是什么
### user / login
vuex中使用namespaced:true开启命名空间，调用mutations或者调用actions，则是模块名 + 相对应的方法名。

另外actions是异步的，action处理函数之后返回的Promise进行相对应的处理。

