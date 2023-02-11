
const userList = []
userList.push({ name:'Administrater', username:'admin', password:'111111'})
userList.push({ name:'Normal Editor', username:'editor', password:'111111'})
userList.push({ name:'Niu Zhan', username:'nz', password:'111111'})
userList.push({ name:'Diane Gale', username:'diane', password:'111111'})

const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  },
  nz:{
    token: 'nz-token'
  },
  Diane:{
    token: 'diane-token'
  },
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  },
  'nz-token':{
    roles:['editor'],
    introduction:'Mocked user for coding',
    avatar:'https://avatars.githubusercontent.com/u/61968632?v=4',
    name:'nz'
  },
  'diane-token':{
    roles:['editor'],
    introduction:'Mocked user for coding',
    avatar:'data:image/png;base64,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',
    name:'Diane'
  }
}



module.exports = [
  // user login
  {
    url: '/vue-element-admin/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]
      
      console.log('-----------------------------------------------------------')
      console.log(username)
      console.log(token)
      console.log("mock/user.js")


      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/vue-element-admin/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]
      console.log("mock/user.js->user info")
      console.log(info)
      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/vue-element-admin/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  //user list
  {
    url: '/vue-element-admin/user/list',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, limit = 20, sort } = config.query
      //console.log('mock.js->user/list')
      //console.log(userList)
      return{
        code: 20000,
        data: userList
      }
    },
  },

  //create user
  {
    url: '/vue-element-admin/user/create',
    type: 'post',
    response: config => {
      //console.log('mock/user.js->create')
      //console.log(config.body)
      userList.push(config.body)
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  //udpate user(reset pw)
  {
    url: '/vue-element-admin/user/update',
    type: 'post',
    response: config => {
      console.log('mock/user.js->update')
      console.log(config.body)
      const name = config.body
      for (const user of userList) {
        if (user.name === name.name) {
          userList[userList.indexOf(user)].password = name.password
          console.log(userList)
          return {
            code: 20000,
            data: name
          }
        }
      }
      console.log(userList)
      return {
        code: 20000,
        data: 'Name not found'
      }
    }
  }
]
