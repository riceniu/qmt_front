const Mock = require('mockjs')

const List = []
const count = 30

const baseContent = '<p>Customer test data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'C:\Users\zhan_\Pictures\wallpaper\big-ben-bridge-castle-460672.jpg'

const Mocked = require('./mocked_data')

//Create a List which contains all mocked contact data
// for (let i = 0; i < count; i++) {
//   List.push(Mock.mock(
//     {
//     id: '@increment',
//     timestamp: +Mock.Random.date('T'),
//     firstname: '@first',
//     lastname: '@last',
//     email: '@email',
//     tel: '+'+'@integer(1,1000)'+' '+'@integer(100000,10000000)',
//     mobile:  '+'+'@integer(1,1000)'+' '+'@integer(1,999)'+' '+'@integer(10000,99999)',
//     'company|1': ['Google', 'Facebook', 'Apple', 'SAP', 'Amazon' , 'Zalando', 'Ebay', 'Lenovo'],
//   }
//   ))
// }
//Create a List which contains all mocked company data
let companyName = `Openlane
  Yearin
  Goodsilron
  Condax
  Opentech
  Golddex
  year-job
  Isdom
  Gogozoom
  Y-corporation
  Nam-zim
  Donquadtech
  Warephase
  Donware
  Faxquote
  Sunnamplex
  Lexiqvolax
  Sumace
  Treequote
  Iselectrics
  Zencorporation
  Plusstrip
  dambase
  Toughzap
  Codehow
  Zotware
  Statholdings
  Conecom
  Zathunicon
  Labdrill
  Ron-tech
  Green-Plus
  Groovestreet
  Zoomit
  Bioplex
  Zumgoity
  Scotfind
  Dalttechnology
  Kinnamplus
  Konex
  Stanredtax
  Cancity
  Finhigh
  Kan-code
  Blackzim
  Dontechi
  Xx-zobam
  Fasehatice
  Hatfan
  Streethex
  Inity
  Konmatfix
  Bioholding
  Hottechi
  Ganjaflex
  Betatech
  Domzoom
  Ontomedia
  Newex
  Betasoloin
  Mathtouch
  Rantouch
  Silis
  Plussunin
  Plexzap
  Finjob
  Xx-holding
  Scottech
  Funholding
  Sonron
  Singletechno
  Rangreen
  J-Texon
  Rundofase
  Doncon`
let countries = `Afghanistan
Albania
Algeria
Andorra
Angola
Antigua & Deps
Argentina
Armenia
Australia
Austria
Azerbaijan
Bahamas
Bahrain
Bangladesh
Barbados
Belarus
Belgium
Belize
Benin
Bhutan
Bolivia
Bosnia Herzegovina
Botswana
Brazil
Brunei
Bulgaria
Burkina
Burundi
Cambodia
Cameroon
Canada
Cape Verde
Central African Rep
Chad
Chile
China
Colombia
Comoros
Congo
Congo {Democratic Rep}
Costa Rica
Croatia
Cuba
Cyprus
Czech Republic
Denmark
Djibouti
Dominica
Dominican Republic
East Timor
Ecuador
Egypt
El Salvador
Equatorial Guinea
Eritrea
Estonia
Ethiopia
Fiji
Finland
France
Gabon
Gambia
Georgia
Germany
Ghana
Greece
Grenada
Guatemala
Guinea
Guinea-Bissau
Guyana
Haiti
Honduras
Hungary
Iceland
India
Indonesia
Iran
Iraq
Ireland {Republic}
Israel
Italy
Ivory Coast
Jamaica
Japan
Jordan
Kazakhstan
Kenya
Kiribati
Korea North
Korea South
Kosovo
Kuwait
Kyrgyzstan
Laos
Latvia
Lebanon
Lesotho
Liberia
Libya
Liechtenstein
Lithuania
Luxembourg
Macedonia
Madagascar
Malawi
Malaysia
Maldives
Mali
Malta
Marshall Islands
Mauritania
Mauritius
Mexico
Micronesia
Moldova
Monaco
Mongolia
Montenegro
Morocco
Mozambique
Myanmar, {Burma}
Namibia
Nauru
Nepal
Netherlands
New Zealand
Nicaragua
Niger
Nigeria
Norway
Oman
Pakistan
Palau
Panama
Papua New Guinea
Paraguay
Peru
Philippines
Poland
Portugal
Qatar
Romania
Russian Federation
Rwanda
St Kitts & Nevis
St Lucia
Saint Vincent & the Grenadines
Samoa
San Marino
Sao Tome & Principe
Saudi Arabia
Senegal
Serbia
Seychelles
Sierra Leone
Singapore
Slovakia
Slovenia
Solomon Islands
Somalia
South Africa
South Sudan
Spain
Sri Lanka
Sudan
Suriname
Swaziland
Sweden
Switzerland
Syria
Taiwan
Tajikistan
Tanzania
Thailand
Togo
Tonga
Trinidad & Tobago
Tunisia
Turkey
Turkmenistan
Tuvalu
Uganda
Ukraine
United Arab Emirates
United Kingdom
United States
Uruguay
Uzbekistan
Vanuatu
Vatican City
Venezuela
Vietnam
Yemen
Zambia
Zimbabwe`

for (let i = 0; i < count; i++) {
  List.push(Mock.mock(
    {
    id: '@increment',
    //'company|1': ['Google', 'Facebook', 'Apple', 'SAP', 'Amazon' , 'Zalando', 'Ebay', 'Lenovo'],
    'company|1': companyName.split('\n'),
    'country|1': countries.split('\n'),
    domain:'@domain'
  }
  ))
}
//List.length = 0
//List.push(...Mocked.contact_list)

module.exports = [
  {
    url: '/vue-element-admin/customer/list',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, limit = 20, sort } = config.query
      const customerList=[]
      customerList.push(...Mocked.contact_list)


      let mockList = customerList.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      
      console.log('mock/customer.js->customer/list')
      console.log(pageList)
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
    url: '/vue-element-admin/customer/company',
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
      
      console.log('mock/customer.js->customer/compmany')
      console.log(pageList)
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
    url: '/vue-element-admin/customer/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const customer of List) {
        if (customer.id === +id) {
          return {
            code: 20000,
            data: customer
          }
        }
      }
    }
  },

  {
    url: '/vue-element-admin/customer/pv',
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
    url: '/vue-element-admin/customer/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/customer/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
