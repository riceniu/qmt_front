<template>
  <div class="app">
    <el-button type="success" @click="exportFile">Export Word file</el-button>
    <div class="box" ref="box">
      <!-- <div class="acticle">
        <h1>{{ article.title }}</h1>
        <div class="content">
          <template v-for="(i, idx) in article.content">
            <template v-if="i.type === 'content'">
              <p :key="idx" v-html="i.text"></p>
            </template>
            <template v-else-if="i.type === 'img'">
               通过测试，发现通过css设置img的大小无效，只能通过属性的方式 
              <img width="300" :src="i.text" alt="" :key="idx" />
            </template>
          </template> 
        </div>
      </div> -->
     <div class="editor-content" v-html="value" style="display:none" /> 
    </div>
    
    <!-- <textarea v-model="value"/> -->
    
  </div>
</template>
  
  <script>
import htmlDocx from "html-docx-js/dist/html-docx";
import saveAs from "file-saver";
export default {
  name: "APP",
  props: {
    value: {
      type: String,
      default: "",
    },
    QN:{
      type:String,
      default:""
    }
  },
  data() {
    return {
    };
  },
  methods: {
    exportFile() {
        //debugger
      // 内容样式
      const cssStyle = `
              <style>
                  .content p {
                      text-indent: 2em;
                  }
                  .content p .bold {
                      font-weight: bold;
                      color: red;
                  }
                  .content p .xiaoshi {
                      /* 小四字体样式 */
                      /* 由于px单位，是一个相对单位，在不同屏幕中大小会有差别，所以在设置字体样式采用固定单位*/
                      font-size: 12pt;
                  }
                  .content img {
                      border-radius: 5px;
                      margin-left: 2em;
                  }
              </style>
          `;
      // 获取内容的html结构
      const boxHtml = this.$refs["box"].innerHTML;
      //构建一个word文档
      const articleContent = `
          <!doctype html>
          <html>
              <head>${cssStyle}</head>
              <body>${boxHtml}</body>
          </html>
        `;
      //将html内容进行转码
      const converted = htmlDocx.asBlob(articleContent);
      console.log(converted);
      //导出html形成word文档
      saveAs(converted, `${this.QN}.docx`);
    },
  },
};
</script>
  
  //通过css设置标签样式，能够方便的在导出html内容时直接复制粘贴使用
  <style lang="css">
.content p {
  text-indent: 2em;
}
.content p .bold {
  font-weight: bold;
  color: red;
}
.content p .xiaoshi {
  /* 小四字体样式 */
  font-size: 12pt;
}
.content img {
  border-radius: 5px;
  margin-left: 2em;
}
</style>