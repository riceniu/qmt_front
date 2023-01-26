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

```js
// user.js
// 不开启命名空间
const actions = {
    login(){}
}
export default { actions };

this.$store.dispatch('login');

// user.js
// 开启命名空间
const actions = {
    login(){}
}
export default { actions, namespaced: true }; // 注意！开启命名空间

this.$store.dispatch('user/login'); // 模块名user + 方法名 login

```

上面所说的`user/login`，则就是`user`模块中的`login`方法，核心代码就如下：

```js
//store/module/user.js
login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response // 解构出data
        commit('SET_TOKEN', data.token) // 更新store里面的token
        setToken(data.token) // token保存到cookie
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
 }
```

一句话来概括：**登陆验证，登陆成功之后，分别保存`token`到`vuex`、`cookie`中。**

这里完成之后就会回到之前的`view/login/index.vue`，当`user/login`调用完成之后，则会进行`.then(...)`方法，就是一个路由跳转的过程（`this.$router.push(...)`）。

### Permission.js

这个文件就如同前面介绍所说，路由的全局钩子，**动态路由**的实现这里相当于是一个入口。

```js
router.beforeEach(async(to, from, next) => {
  // 从cookie中取得token
  const hasToken = getToken()
  
  // 如果有token 也就是已经登陆的情况下
  if (hasToken) {
    // 并且要前往的路径是'/login'  则返回 '/' 
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // 从store中取得用户的 roles, 也就是用户的权限 并且用户的权限数组必须有一个以上
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      // 有权限则直接进入
      if (hasRoles) {
        next()
      } else {
        // 没有权限的话
        try {
          // 获取用户信息
          const { roles } = await store.dispatch('user/getInfo')
		  // 生成可访问路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', 			  														roles)
          // 将可访问路由添加到路由上
          router.addRoutes(accessRoutes)
          // 进入路由
          next({ ...to, replace: true })
        } catch (error) {
          // 如果出现异常  清空路由 
          await store.dispatch('user/resetToken')
          // Message提示错误
          Message.error(error || 'Has Error')
          // 跳到login页面重新登陆
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    // 没有token 也就是没有登陆的情况下  
    // 判断是否是白名单(也就是说不需要登陆就可以访问的路由)
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // 其他的一路给我跳到login页面 老老实实的进行登陆
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})
```

注释已经写的明明白白了，这个思路其实使用的特别多，就是利用全局钩子进行访问的拦截，如果没有登陆的话，跳转到登陆页面进行登陆。

但是花裤衩大佬的这个有一点点不同，可以看到他将登陆和获取用户信息分成了两步，原因就是保证用户信息是最新的。第二个是在获取用户信息之后返回的`roles`生成可访问的路由，也就是这两步实现了动态路由。

用一句话来概括：**是否登陆？没有就给我老老实实登陆。是否有用户信息？没有就给我获取用户信息，并且生成可访问路由然后利用`addRoutes`进行添加。**

这两步都是actions：`user/getInfo`，`permission/generateRoutes`。

可以看到这是`vuex`中的`actions`提交，可能有些小伙伴会有点困惑，为什么有的请求直接写在`api`文件夹，有些就放在`actions`里面？这个问题：我的理解就是，如果返回的数据要保存在`vuex`中的话，可以直接使用`actions`，原因是`action`里面可以提交`mutation`改变`store`的状态，可以少写一些代码，同时思路更加清晰，如果返回的数据只需要在当前页面使用的话，并不需要保存到`vuex`中，那就直接用写在`api`文件夹中引用即可。当然这个是我的个人理解，如有错误请望指出。

### user / getInfo

首先我们看第一个`user/getInfo`。

如上面所说，这是`user`模块中的`getInfo`方法，来看核心代码。

```scss
getInfo({ commit , state }) {
  return new Promise((resolve, reject) => {
    // 调用getInfo接口
    getInfo(state.token).then(response => {
      const { data } = response // 解构出data
      if (!data) { // 进行数据校验
        reject('Verification failed, please Login again.')
      }
      // 解构出需要保存的值  
      const { roles, name, avatar, introduction } = data
      // roles权限数组至少有一个权限
      if (!roles || roles.length <= 0) {
        reject('getInfo: roles must be a non-null array!')
      }
      // 保存到vuex
      commit('SET_ROLES', roles)
      commit('SET_NAME', name)
      commit('SET_AVATAR', avatar)
      commit('SET_INTRODUCTION', introduction)
      // 将 data 返回
      resolve(data)
    }).catch(error => {
      reject(error)
    })
  })
}
复制代码
```

这个就是调用`getInfo`接口获取用户信息并且保存到`vuex`中，为了严谨性，进行相对应的数据校验，然后把`data`返回。

用一句话来概括：**获取用户信息，并保存用户信息。**

### permission/generateRoutes

我们来看第二个actions，这个是动态路由中的重要一步，生成可访问路由，根据当前用户的权限数组，和路由中可访问的权限数组，进行匹配生成。

```javascript
// 判断是否有权限
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    // roles.some => Array.some 相当于是只要有一个满足就为true 
      
    // 判断用户的权限于当前路由访问所需要的权限是否有一个满足
    // 比如说用户权限为 ['one','two']  当前路由访问所需要权限为 ['two','three']  那么就说明当前用户可以访问这个路由
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    // 默认是可访问的
    return true
  }
}
// 生成可访问路由
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    // 判断当前路由是否可以访问
    if (hasPermission(roles, tmp)) {
      // 如果当前路由还有子路由
      if (tmp.children) {
        // 进行递归处理
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      // 将可访问路由放入数组中
      res.push(tmp)
    }
  })  
  // 返回
  return res
}

// 为什么要写这里呢，因为后面的Sidebar组件与这个环环相扣
const mutations = {
  SET_ROUTES: (state, routes) => {
    // 添加的路由
    state.addRoutes = routes
    // 将vuex中的路由进行更新
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      // 如果roles包含 'admin' 直接可以全部访问
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        // 利用 filterAsyncRoutes 过滤出可访问的路由
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      // 保存可访问的路由到store中
      commit('SET_ROUTES', accessedRoutes)
      // 将可访问路由返回
      resolve(accessedRoutes)
    })
  }
}
复制代码
```

欧克，注释已经全部写好了，这个就是动态路由中重要一步，慢慢品味发现也不难，越看越觉得666。

用一句话来概括：**根据得到的用户权限生成可以访问的路由。**

## 动态路由的实现

```scss
router.addRoutes(accessRoutes)

复制代码
```

？？？，没呢？

对的！动态路由的核心代码就这一句话，短小精悍，其他的都是为了完成动态路由做的一些 "准备工作" ，`user/getInfo`获取用户信息得到用户的`roles`权限数组，返回`user/generateRoutes`生成可访问路由，就是这么神奇的一步，实现了动态路由。

写到这里基本流程就走完了，但是还有两个注意点。

## 注意

#### 为什么项目开启默认就是登陆页面

想必通过之前的讲解也应该知道了`permission.js`的作用了，全局路由钩子，每次路由跳转都要调用全局路由钩子（谁让它是全局的呢），原因就是当页面加载首页时也会经过全局路由钩子，而`permission.js`判断当前用户有没有登陆，没有登陆就直接跳转到`/login`页面进行登陆把，就是这么任性，啦啦啦。

#### 动态路由显示不出来

有些小伙伴可能会改这个框架的代码，但是发现显示不出来？这也是我遇到过的一个坑，需要注意的是`permission.js`里面有两个条件：第一个是否登陆？第二个是否获取用户信息（判断是否获取用户信息是根据`roles`）？有些小伙伴可能是登陆的时候就把用户信息获取了，但是！！**没有更新用户`roles`权限数组**，所以就一直会获取用户信息，从而导致显示不出来。

## 完结，撒花

其实到这里整个登陆流程就已经结束了，可以看到花裤衩大佬想的很多，用户信息的获取和用户登陆的分离，根据用户权限生成可以访问的路由并添加，这些思路我觉得很厉害，还有这么多组件可以用，哈哈哈哈。

好的，我们来总结一下：

1. `Login/index.vue`点击登陆 提交`user/login`的actions。
2. `user/login`进行登陆验证，登陆成功之后保存`token`到`vuex`和`cookie`中。
3. 回到`Login/index.vue`跳转路由，这时就到了`permission.js`
4. `permission.js`进行判断是否登陆，是否有用户信息？没有用户信息就获取用户信息，并且保存到`vuex`，然后根据用户信息中的`roles`生成可访问路由，并通过`addRoutes`进行添加。

看到这里，相信你对这个框架的登陆流程已经有一定的了解了，自己再去理一遍把，啦啦啦啦，那下面这一张流程图相信你也可以看懂。

![](E:\GoogleDrive_win10\前端学习\vue-element-admin\Z_Notes\Capture.JPG)

