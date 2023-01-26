[toc]

# router/index.js
## constantRoutes
### hidden
#### /redirect with children
```js
path: '/redirect/:path(.*)',        
component: () => import('@/views/redirect/index')
```

#### /login
#### /auth-redirect
#### /404
#### /401
### displayed
#### / with children (dashboard)
#### /documentation with children
#### /guide with children
#### /profile with children (hidden)

## asyncRoutes

### /permission ['admin','editor']

#### page ['admin']

#### directive [no roles set, no permission required]

#### role ['admin']

### /icon

### sub routers

#### componentsRouter

#### chartsRouter

#### nestedRouter

#### tableRouter

### /example

#### create

#### edit/:id(\\d+) *(hidden)*

#### list

### /tab

#### index

### /error

#### 401

#### 404

### tools



## router



## restRouter
## default
