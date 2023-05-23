const Mock = require("mockjs");

const country = require("./countryList.json");

const count = 300;

const baseContent =
  '<p>Customer test data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>';
const image_uri =
  "C:Userszhan_Pictureswallpaper\big-ben-bridge-castle-460672.jpg";

const Mocked = require("./mocked_data");
let companies = `Openlane
  Yearin
  Goodsilron
  Condax
  Opentech
  Golddex
  year-job
  Isdom
  Gogozoom
  Y-corporation
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
  Domzoom
  Ontomedia
  Xx-holding
  Scottech
  Funholding
  Sonron
  Singletechno
  Rangreen
  J-Texon
  Rundofase
  Doncon`;
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
  Zimbabwe`;

let companyName = [];
companyName = companies.split("\n");
const companyList = [];
const contactList = [];

//dynamic companyList

/*
for (let i = 0; i < count; i++) {
  companyList.push(Mock.mock(
    {
    id: '@increment',
    'company|1': companyName,
    //'country|1': countries.split('\n'),
    'area|1':country,
    domain:'@domain'
  }
  )
  )
}
*/
//constant companyList
companyList.push(...Mocked.company_list);

//dynamic contactList
/*
{
let tempcompanyList = []
for(const v of companyList){
  tempcompanyList.push(v.company)
}
tempcompanyList.push(" ")
tempcompanyList.push(" ")
tempcompanyList.push(" ")
for (let i = 0; i < count; i++) {
  contactList.push(Mock.mock(
    {
    id: '@increment',
    'gender|1':["Mr","Ms",""],
    firstname: '@first',
    lastname: '@last',
    email: '@email',
    tel: '+'+'@integer(1,1000)'+' '+'@integer(100000,10000000)',
    mobile:  '+'+'@integer(1,1000)'+' '+'@integer(1,999)'+' '+'@integer(10000,99999)',
    'company|1': tempcompanyList,
  }
  ))
}
}*/

//constant contactList
contactList.push(...Mocked.contact_list);

//List.length = 0
//List.push(...Mocked.contact_list)

module.exports = [
  // useless
  {
    // {
    //   url: "/vue-element-admin/customer/pv",
    //   type: "get",
    //   response: (_) => {
    //     return {
    //       code: 200,
    //       data: {
    //         pvData: [
    //           { key: "PC", pv: 1024 },
    //           { key: "mobile", pv: 1024 },
    //           { key: "ios", pv: 1024 },
    //           { key: "android", pv: 1024 },
    //         ],
    //       },
    //     };
    //   },
    // },
    // {
    //   url: "/vue-element-admin/customer/create",
    //   type: "post",
    //   response: (_) => {
    //     return {
    //       code: 200,
    //       data: "success",
    //     };
    //   },
    // },
    // {
    //   url: "/vue-element-admin/customer/update",
    //   type: "post",
    //   response: (_) => {
    //     return {
    //       code: 200,
    //       data: "success",
    //     };
    //   },
    // },
  },

  {
    url: "/vue-element-admin/customer/contact",
    type: "get",
    response: (config) => {
      console.log("mock/customer.js->customer/contact");
      const {
        importance,
        type,
        title,
        page = 1,
        limit = 20,
        sort,
        keyWords,
      } = config.query;
      //const customerList=[]
      //customerList.push(...Mocked.contact_list)

      let mockList = contactList.filter((item) => {
        if (importance && item.importance !== +importance) return false;
        if (type && item.type !== type) return false;
        if (title && item.title.indexOf(title) < 0) return false;
        if (
          item.firstname.indexOf(keyWords) == -1 &&
          item.lastname.indexOf(keyWords) == -1 &&
          item.company.indexOf(keyWords) == -1 &&
          item.email.indexOf(keyWords) == -1 &&
          item.tel.indexOf(keyWords) == -1 &&
          item.mobile.indexOf(keyWords) == -1
        )
          return false;
        return true;
      });

      // if (sort === "-id") {
      if (true) {
        mockList = mockList.reverse();
      }

      const pageList = mockList.filter(
        (item, index) => index < limit * page && index >= limit * (page - 1)
      );
      //console.log(contactList)
      return {
        code: 200,
        data: {
          total: mockList.length,
          items: pageList,
        },
      };
    },
  },
  {
    url: "/vue-element-admin/customer/company",
    type: "get",
    response: (config) => {
      const {
        importance,
        type,
        title,
        page = 1,
        limit = 20,
        sort,
        keyWords,
      } = config.query;

      //add area
      /*for(item of companyList){
        item.country = item.area.country
        item.area = item.area.region
      }*/

      let mockList = companyList.filter((item) => {
        if (importance && item.importance !== +importance) return false;
        if (type && item.type !== type) return false;
        if (title && item.title.indexOf(title) < 0) return false;
        if (item.company.indexOf(keyWords) == -1) return false;
        return true;
      });

      //if (sort === "-id") {
      if (true) {
        mockList = mockList.reverse();
      }

      const pageList = mockList.filter(
        (item, index) => index < limit * page && index >= limit * (page - 1)
      );

      console.log("mock/customer.js->customer/compmany");
      //console.log(companyList)
      return {
        code: 200,
        data: {
          total: mockList.length,
          items: pageList,
        },
      };
    },
  },

  {
    url: "/vue-element-admin/customer/detail",
    type: "get",
    response: (config) => {
      const { id } = config.query;
      for (const customer of List) {
        if (customer.id === +id) {
          return {
            code: 200,
            data: customer,
          };
        }
      }
    },
  },

  {
    url: "/vue-element-admin/customer/company/delete",
    type: "delete",
    response: (config) => {
      console.log("mock/customer.js->company-delete");
      //console.log(config.body);
      let index;
      for (const company of companyList) {
        if (company.id === config.body.id) {
          index = companyList.indexOf(company);
          console.log("index " + index);
          companyList.splice(index, 1);
          break;
        }
      }
      return {
        code: 200,
        data: "Company deleted",
      };
    },
  },

  {
    url: "/vue-element-admin/customer/contact/delete",
    type: "delete",
    response: (config) => {
      console.log("mock/customer.js->contact-delete");
      //console.log(config.body);
      let index;
      for (const contact of contactList) {
        if (contact.id === config.body.id) {
          index = contactList.indexOf(contact);
          contactList.splice(index, 1);
          break;
        }
      }

      return {
        code: 200,
        data: "Product deleted",
      };
    },
  },

  {
    url: "/vue-element-admin/customer/company/update",
    type: "post",
    response: (config) => {
      console.log("mock/customer.js->update->company");
      //console.log(config.body);
      for (const company of companyList) {
        if (company.id === config.body.id) {
          companyList[companyList.indexOf(company)] = config.body;
        }
      }
      return {
        code: 200,
        data: "success",
      };
    },
  },

  {
    url: "/vue-element-admin/customer/company/create",
    type: "post",
    response: (config) => {
      console.log("mock/customer.js->create->company");
      //console.log(config.body);
      companyList.push(config.body);
      return {
        code: 200,
        data: "success",
      };
    },
  },

  {
    url: "/vue-element-admin/customer/contact/update",
    type: "post",
    response: (config) => {
      console.log("mock/customer.js->update->contact");
      //console.log(config.body);
      for (const contact of contactList) {
        if (contact.id === config.body.id) {
          contactList[contactList.indexOf(contact)] = config.body;
        }
      }
      return {
        code: 200,
        data: "success",
      };
    },
  },

  {
    url: "/vue-element-admin/customer/contact/create",
    type: "post",
    response: (config) => {
      console.log("mock/customer.js->create->contact");
      //console.log(config.body);
      contactList.push(config.body);
      return {
        code: 200,
        data: "success",
      };
    },
  },

  {
    url: "/vue-element-admin/customer/company/searchByName",
    type: "get",
    response: (config) => {
      const {
        importance,
        type,
        title,
        page = 1,
        limit = 20,
        sort,
        keyWords,
      } = config.query;

      let returnList = companyList.filter((item) => {
        if (item.company.indexOf(keyWords) == -1) return false;
        return true;
      });
      console.log(companyList)
      console.log("mock/customer.js->customer/compmany/searchByName");
      console.log(returnList)
      return {
        code: 200,
        data: {
          returnList
        },
      };
    },
  },
];
