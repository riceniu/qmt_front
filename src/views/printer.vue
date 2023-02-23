<template>
  <div id="spos">
    <!-- 左边菜单栏小控件区域 -->
    <div class="spos_left">
      <!-- 热敏纸尺寸控件 -->
      <div class="spos_panel">
        <div class="spos_metas">
          <span>热敏纸</span>
          <div>
            <span class="spos_tag_size">{{ paperSize }}</span
            >mm
            <!-- 弹出层：热敏纸修改 -->
            <el-popover placement="right">
              <paper-menu :width="paperSize" @change="changePaper" />
              <i slot="reference" class="iconfont icon-bianji" />
            </el-popover>
          </div>
        </div>
      </div>
      <!-- 本地属于源或接口后存放的后台提供字段控件区 -->
      <div class="spos_panel">
        <p class="spos_metas">数据源</p>
        <ol class="spos_tag_wrap">
          <li
            class="spos_tag"
            v-for="(tag, tagIndex) in sourceTags"
            :key="tagIndex"
            @click="selectTag(tag)"
          >
            {{ tag.sqlDesc }}
          </li>
        </ol>
      </div>
      <!-- 小控件区：直线、虚线、点线、**线、##线、增高垫、上传图片、条形码、二维码、标题 -->
      <div class="spos_panel">
        <p class="spos_metas">更多图样</p>
        <ol class="spos_tag_wrap">
          <li
            class="spos_tag"
            v-for="(tag, tagIndex) in chartTags"
            :key="tagIndex"
            @click="selectTag(tag)"
          >
            {{ tag.desc }}
          </li>
        </ol>
      </div>
    </div>
    <!-- 绘制区，可以是空白，也可以是接口获取上级分发给下级的大致模板 -->
    <div
      class="spos_right"
      v-loading="basicLoading"
      element-loading-text="基础模板获取中"
      element-loading-background="rgba(0, 0, 0, 0.5)"
    >
      <!-- 热敏纸绘制大小与尺寸实时对应 -->
      <div class="spos_canvas" :style="{ width: paperSize + 'mm' }">
        <!-- 开启绘制控件拖拽更换位置服务 -->
        <draggable
          v-model="selectTags"
          :options="{ direction: 'vertical', ghostClass: 'spos_draging' }"
          @choose="setCurrentTag"
          @end="focusedTag = -1"
        >
          <!-- 绘制区域已选择的控件集合 -->
          <div
            class="spos_canvas_meta"
            v-for="(tag, tagIndex) in selectTags"
            :key="tagIndex"
            :class="{ focused: focusedTag === tagIndex }"
          >
            <!-- 控件样式组件 -->
            <source-tag :tag="tag" />
            <!-- 专属于控件的在线可二次利用的编辑 -->
            <div class="spos_operator">
              <el-popover v-if="popoverOF.includes(tag.of)" trigger="click">
                <component :is="`${tag.of}-menu`" :tag="tag" />
                <i slot="reference" class="iconfont icon-xianshimima" />
              </el-popover>
              <i
                v-if="tag.of === 'field'"
                class="iconfont icon-shuaxin"
                @click.stop="reverseTag(tag)"
              />
              <!-- 删除当前控件 -->
              <i
                class="iconfont icon-shanchurijie"
                @click.stop="deleteTag(tagIndex)"
              />
            </div>
          </div>
        </draggable>
      </div>
      <!-- 测试按钮 -->
      <div class="spos_btns">
        <div class="spos_btn_button" @click="clearSPos">清空模板</div>
        <div class="spos_btn_button" @click="getSPosBaisic">基础模板</div>
        <div class="spos_btn_button" @click="previewSPos">预览</div>
        <div class="spos_btn_button" @click="ajaxPrint">
          基础模板<br />真实数据<br />假装预览
        </div>
      </div>
    </div>
    <!-- 本地图片库 -->
    <el-drawer
      class="spos_drawer"
      :visible.sync="imagesHouse"
      :size="waterfallOptions.containerSize + 'px'"
      :show-close="false"
      append-to-body
      :wrapperClosable="false"
    >
      <div slot="title" class="spos_drawer_title">
        <span>图片库</span>
        <div style="font-size: 0">
          <el-button type="primary" size="mini" @click="birthImages"
            >生成</el-button
          >
          <el-button size="mini" @click="closeImageHouse">关闭</el-button>
        </div>
      </div>
      <div class="spos_drawer_content">
        <!-- 上传图片按钮 -->
        <label class="spos_upload_wrapper" for="imageToUpload">
          <i class="el-icon-upload" />&nbsp;上传图片
          <div style="font-size: 12px; margin-top: 3px">
            支持绝大多数图片格式，图片最大支持2M
          </div>
          <input
            id="imageToUpload"
            class="spos_drawer_file"
            type="file"
            accept="image/*"
            @change="changeImageFile($event)"
          />
        </label>
        <!-- 图片放置容器 -->
        <div class="spos_images_wrapper">
          <div class="spos_images_list">
            <!-- 采用瀑布流形式更佳观赏 -->
            <ul v-show="sourceImages.length" ref="waterfallContainer">
              <li
                class="spos_images_item"
                v-for="(item, imIndex) in sourceImages"
                :key="imIndex"
                ref="waterfallItem"
                @click="setImage(item.id)"
              >
                <img :src="item.src" width="100%" />
                <p class="spos_images_label">
                  <span>{{ item.label }}</span>
                  <i
                    class="iconfont icon-shanchurijie spos_images_delete"
                    @click.stop="deleteImage(imIndex)"
                  />
                </p>
                <div
                  v-show="selectImages.includes(item.id)"
                  class="spos_images_right"
                >
                  {{ setImage(item.id, "badge") }}
                </div>
              </li>
            </ul>
            <div v-if="!sourceImages.length" class="spos_images_empty">
              暂无本地图片
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
    <!-- 裁剪图片插件弹窗 -->
    <el-dialog
      title="上传前剪裁"
      class="spos_cropper_dialog"
      width="500px"
      :visible.sync="cropperDialog"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="spos_cropper_content">
        <div class="spos_cropper_descript">
          <span>图片描述：</span>
          <el-input
            v-model="cropperDescript"
            clearable
            size="small"
            placeholder="更好表达这是张怎么样的图片"
            style="flex: 1"
          />
        </div>
        <!-- 裁剪容器 -->
        <div class="cropper">
          <vueCropper
            ref="cropper"
            :img="cropperOptions.img"
            :info="cropperOptions.info"
            :outputSize="cropperOptions.outputSize"
            :autoCrop="cropperOptions.autoCrop"
            :canMoveBox="cropperOptions.canMoveBox"
            :original="cropperOptions.original"
            :centerBox="cropperOptions.centerBox"
            :infoTrue="cropperOptions.infoTrue"
          />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeCropperDialog">取消</el-button>
        <el-button size="small" type="primary" @click="finishCropper"
          >确认</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
  
  <script>
import PaperMenu from "./menu/PaperMenu";
import Draggable from "vuedraggable";
import sPosPrint from "@/utils/print/sPosPrint"; // 调用打印机function
import SourceTag from "./handle/SourceTag";
import { SALE, CHARTLET } from "./handle/dataSource"; // 本地数据源，图样库
import { SALE_IMAGES, SALE_TEMPLATE, SALE_TEST } from "./handle/testAjax"; // 测试远程数据

const WATERFALL_OPTIONS = {
  // 瀑布流配置项
  containerSize: 320, // 瀑布流容器
  size: 143, // 每块石头的大小
  space: 10, //每块石头左右间距
  blank: 10, // 每块石头上下间距
};

const CROPPER_OPTIONS = {
  // 裁剪配置项
  img: "", // 裁剪图片的地址
  info: true, // 裁剪框的大小信息
  outputSize: 1, // 裁剪生成图片的质量
  autoCrop: true, // 是否默认生成截图框
  canMoveBox: true, // 截图框能否拖动
  original: false, // 上传图片按照原始比例渲染
  centerBox: true, // 截图框是否被限制在图片里面
  infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
};

export default {
  name: "spos",
  components: {
    PaperMenu, // 热敏纸弹出层可二次编辑内容
    Draggable, // 拖拽插件
    SourceTag, // 绘制区控件样式编辑组件
    TableMenu: () => import("./menu/TableMenu"), // 表格即集合弹窗层可二次编辑内容
    TitleMenu: () => import("./menu/titleMenu"), // 图样标题弹出层可二次编辑内容
    BarcodeMenu: () => import("./menu/barcodeMenu"), // 图样条形码弹出层可二次编辑内容
    QrcodeMenu: () => import("./menu/qrcodeMenu"), // 图样二维码弹出层可二次编辑内容
  },
  data() {
    return {
      popoverOF: ["table", "title", "barcode", "qrcode"], // 允许拥有二次编辑权限的控件
      paperSize: 85, // 默认热敏纸初始大小85mm
      imagesHouse: false, // 图片库默认不打开
      waterfallOptions: WATERFALL_OPTIONS, // 瀑布流相关初始化配置
      cropperDialog: false, // 裁剪区域默认不打开
      cropperOptions: CROPPER_OPTIONS, // 裁剪区域相关初始化配置
      cropperDescript: "", // 裁剪区域的关于图片描述的数据绑定
      chartTags: CHARTLET, // 本地图样库
      sourceTags: SALE, // 本地属于源库，也可通过接口获取
      selectTags: [], // 已选择的控件集合
      sourceImages: [], // 服务器上的存储的图片，通过接口获取
      selectImages: [], // 在图片库中已选中的图片们
      codeMaps: [], // 表格可自定义要绑定的字段
      focusedTag: -1, // 绘制区选中的某一个控件，用于编辑或删减目标
      basicLoading: false, // 拉取服务器上的上级分发模板的视觉化loading
    };
  },
  created() {
    this.sourceTags.forEach((item) => {
      if (item.ofcode === true) {
        // 查找数据源中拥有表格可自定义标识的字段并初始化它，为了可以重复调用，而不每次循环数据源
        this.codeMaps.push({
          sql: item.sql,
          sqlDesc: item.sqlDesc,
          sqlValue: item.ofake,
        });
      }
    });
    this.sourceImages = SALE_IMAGES; // 假装数据库上的数据已经拉取完毕
  },
  methods: {
    changePaper(nw) {
      // 更改热敏纸尺寸
      this.paperSize = nw;
    },
    reverseTag(tag) {
      // 调整相邻格式的'单行文本:数据' => '单行文本：   数据'为左右格式
      if (tag.reverse) {
        tag.reverse = !tag.reverse;
      } else {
        this.$set(tag, "reverse", true);
      }
    },
    setCurrentTag(evt) {
      // 绘制区选中某一控件后，定位它的索引，后续方便操作
      this.focusedTag = evt.oldIndex;
    },
    selectTag(tag) {
      // 选择控件库中的某一控件
      this.focusedTag = -1; // 清除绘制区内处于选中的控件，懒得做重复性的工作了，直接清了更好
      if (tag.of === "barcode" || tag.of === "qrcode") {
        // 如果选择的控件是二维码或者条形码
        this.selectTags.push({
          // 需要插入他们可以关联生成的属性，目前codeMaps是可按‘会员编号’‘手工单号’‘核销单号’生成图形
          ...tag,
          codeMaps: this.codeMaps,
        });
      } else if (tag.of === "images") {
        // 如果选择的控件是上传图片
        this.imagesHouse = true; // 打开图片库
        this._caltureWaterFall(); // 重置图片库里的瀑布流格式，以免万一布局错乱不美观
      } else {
        // 其他控制直接复制添加，复制是为了让vue双向绑定的好处不影响左边菜单栏的数据环境，最好这样做
        this.selectTags.push(JSON.parse(JSON.stringify(tag)));
      }
    },
    deleteTag(tagIndex) {
      // 删除绘制区的某一控件
      this.selectTags.splice(tagIndex, 1);
      this.focusedTag = -1; // 重置高亮，没有这个也行，有了比较严谨
    },
    setImage(imageId, badge) {
      // 图片库中选中某些图片，准备生成
      let index = this.selectImages.indexOf(imageId);
      if (badge) {
        // 记住选中的图片顺序，为了按照鼠标操作顺序上传
        return index + 1;
      }
      if (index === -1) {
        this.selectImages.push(imageId);
      } else {
        this.selectImages.splice(index, 1);
      }
    },
    deleteImage(imIndex) {
      // 删除本地图片库中的图片，后续会调接口，也要去服务器删除
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        type: "warning",
      })
        .then((_) => {
          this.sourceImages.splice(imIndex, 1);
          this.$nextTick(() => {
            // 删除成功后要重新计算更新瀑布流位置
            this._renderWaterFall();
          });
        })
        .catch((_) => {});
    },
    closeCropperDialog() {
      // 关闭裁剪弹窗
      this.cropperDialog = false;
      this.cropperDescript = ""; // 清空裁剪的图片备注，更好的客户体验
      document.getElementById("imageToUpload").value = ""; // 为了input-file可以不停的上传同一张图片，不受change的影响
    },
    finishCropper() {
      // 完成裁剪，确认当前裁剪后
      if (!this.cropperDescript) {
        return this.$message.error("请填写相关的图片描述，以便更好的管理图库");
      }
      this.$refs.cropper.getCropBlob((data) => {
        // 裁剪后的图片流
        let cropImage = new Image(); // 瀑布流的格式布局必须满足图片类型加载完成后，得到图片的宽高size才能画得更好
        cropImage.src = this._getFileURL(data);
        cropImage.onload = () => {
          this.sourceImages.unshift({
            // 瀑布流向前追加新图，倒序排列原则，否则push的话，最新的永远在最底下还得滚动条拉底看到
            id: new Date().getTime(),
            label: this.cropperDescript,
            src: cropImage.src,
          });
          this.$nextTick(() => {
            this._renderWaterFall(); // 重新对瀑布流布局
            this.closeCropperDialog(); // 关闭裁剪框
          });
        };
      });
    },
    changeImageFile(e) {
      // 上传图片时
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        return this.$message.error(
          "图片类型必须是.gif,jpeg,jpg,png,bmp中的一种"
        );
      }
      const files = e.target.files[0];
      if (files.size / 1024 / 1024 > 2) {
        // lodop虚拟打印机若想打印出图片，那么图片大小不能超越700k，超过都打不出来了
        return this.$message.error("图片不能大于2M");
      }
      this.$nextTick(() => {
        this.cropperOptions.img = this._getFileURL(files); // 赋值给裁剪框，准备裁剪
        this.cropperDialog = true; // 打开裁剪框
      });
    },
    closeImageHouse() {
      // 关闭图片库
      this.imagesHouse = false;
      this.selectImages = []; // 关闭后将选中的图片清空，因为可以不停的重复上传，这样比较好看
    },
    birthImages() {
      // 图片库中“生成”按钮，将选择的图片上传到绘制区
      if (!this.selectImages.length) {
        return this.$message.warning("您还没有选择任何的图片，无法生成");
      }
      let _tag = CHARTLET.find((chart) => {
        // 查找图样中有关上传图片的其他相关属性，绘制区控件组件可能有用
        return chart.of === "images";
      });
      this.selectTags.push({
        // 绘制区控件追加新一个图片控件
        images: this.selectImages.map((id) => {
          // 可能一个控件里生成多张图片，因此数组
          return this.sourceImages.find((data) => {
            return data.id === id;
          }).src;
        }),
        ..._tag,
      });
      this.closeImageHouse(); // 关闭图片库
    },
    clearSPos() {
      // 清除当前绘制区，变成白纸
      this.selectTags = [];
    },
    getSPosBaisic() {
      // 获取远程的基础模板，可能是上级分发的
      this.clearSPos(); // 先清除可能绘制区内已经绘制过的控件，为了给基础模板腾位置
      this.basicLoading = true; // 开启接口加载loading，异步
      setTimeout(() => {
        this.selectTags = SALE_TEMPLATE; // 生成新控件数组
        this.basicLoading = false;
      }, 500);
    },
    previewSPos() {
      // 预览当前模板
      if (!this.selectTags.length) {
        return this.$message.warning("当前模板无内容");
      }
      // console.log(JSON.stringify(this.selectTags))
      sPosPrint({
        // 调取封装好的打印机方法
        data: null, // 预览过程中不需要传数据，data是为了重打印，或者直接打印存在的，数据与模板相结合时才有值
        selectTags: JSON.parse(JSON.stringify(this.selectTags)), // 控件数组传送
        preview: 1, // 是否预览 1是 0否 默认否
      });
    },
    ajaxPrint() {
      // 假数据直接打印，因为没有传preview
      sPosPrint({
        data: SALE_TEST, // 模拟假的后台数据
        selectTags: JSON.parse(JSON.stringify(SALE_TEMPLATE)),
      });
    },
    _caltureWaterFall() {
      // 瀑布流的美观性必须满足所有图片都加载完毕，这儿数据量少，不用懒加载了
      if (!this.sourceImages.length) return true;
      let load_image_length = 0;
      this.sourceImages.forEach((item) => {
        // 每张图片循环
        let waterfallImage = new Image();
        waterfallImage.src = item.src;
        waterfallImage.onload = () => {
          //当所有图片加载成功后,才开始构建瀑布流
          load_image_length++;
          if (load_image_length === SALE_IMAGES.length) {
            // 所有图片都加载完毕后
            this._renderWaterFall(); // 计算瀑布流高度与渲染图片绝对位置
          }
        };
      });
    },
    _renderWaterFall() {
      // 绘制瀑布流
      const distance = this.waterfallOptions.size + this.waterfallOptions.space; // 每颗石头尺寸至少是它本身宽度+相邻间距大小
      const count = Math.floor(this.waterfallOptions.containerSize / distance); // 一行能容纳多少颗石头,并向下取整
      if (count <= 0) return true; // 一块都容不下去了
      let array = this.$refs.waterfallItem; // 所有的石子
      let arrayHeights = []; // 每一行的高度集合
      for (let i = 0; i < array.length; i++) {
        let j = i % count;
        array[i].style.width = this.waterfallOptions.size + "px";
        if (arrayHeights.length === count) {
          // 一行排满后，自动切换至下一行
          let minIndex = this._findWaterFallMinIndex(arrayHeights);
          array[i].style.left = distance * minIndex + "px";
          array[i].style.top =
            arrayHeights[minIndex] + this.waterfallOptions.blank + "px";
          arrayHeights[minIndex] +=
            array[i].offsetHeight + this.waterfallOptions.blank;
        } else {
          arrayHeights[j] = array[i].offsetHeight;
          array[i].style.left = distance * j + "px";
          array[i].style.top = 0;
        }
      }
      this._resetWaterFallHeight(count, arrayHeights); // 重置这个瀑布容器的高度
    },
    _findWaterFallMinIndex(heights) {
      // 寻找在当前所有瀑布中,高度最小的那条索引
      let m = 0;
      for (let z = 0; z < heights.length; z++) {
        m = Math.min(heights[m], heights[z]) === heights[m] ? m : z; // 取最矮的那个高度索引
      }
      return m;
    },
    _resetWaterFallHeight(count, arrayHeights) {
      // 瀑布流中每颗石头都是绝对定位，要重置容器高度，才有滚动条可以操作
      let a = 0;
      if (arrayHeights.length > 1) {
        for (let b = 0; b < Math.min(count, arrayHeights.length); b++) {
          a =
            Math.max(arrayHeights[a], arrayHeights[b]) === arrayHeights[a]
              ? a
              : b; // 取最高的那个高度索引
        }
      }
      this.$refs.waterfallContainer.style.height = arrayHeights[a] + "px";
    },
    _getFileURL(file) {
      // 将input-file转化成本地流文件路径，获取上传图片的尺寸大小或其他
      let url = null;
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      }
      return url;
    },
  },
};
</script>
  
  <style scoped>
#spos {
  height: 100%;
  display: flex;
  flex-direction: row;
  background-color: #eee;
  overflow: hidden;
}
.spos_left {
  width: 235px;
  overflow: auto;
  background-color: #fff;
}
.spos_panel {
  padding: 8px 12px;
}
.spos_metas {
  color: #666;
  font-size: 15px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.spos_tag_wrap {
  font-size: 0;
}
.spos_tag {
  width: 48%;
  display: inline-block;
  vertical-align: top;
  list-style-type: none;
  padding: 6px 10px;
  background-color: #d8d8d8;
  border: 1px solid #bda5a5;
  margin-top: 10px;
  font-size: 12px;
  box-sizing: border-box;
}
.spos_tag:nth-child(2n) {
  margin-left: 4%;
}
.spos_tag_size {
  font-size: 20px;
  color: orange;
}
.spos_metas .icon-bianji {
  color: orange;
  font-size: 20px;
  vertical-align: bottom;
  cursor: pointer;
}
.spos_right {
  flex: 1;
  position: relative;
}
.spos_btns {
  position: absolute;
  right: 0;
  top: 0;
}
.spos_btn_button {
  margin-top: 12px;
  background-color: orange;
  color: #fff;
  min-width: 60px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  padding: 10px;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
}
.spos_canvas {
  background-color: #fff;
  margin: 0 auto;
  overflow: auto;
  box-sizing: border-box;
  padding: 10px 6px;
  height: 100%;
}
.spos_canvas_meta {
  position: relative;
  box-sizing: border-box;
}
.spos_canvas_meta .spos_operator {
  display: none;
  color: #fff;
  position: absolute;
  right: 0;
  bottom: 0;
  cursor: pointer;
  background-color: rgba(56, 42, 16, 0.45);
  padding: 1px 6px;
}
.spos_canvas_meta.focused {
  border: 2px dotted orange;
}
.spos_canvas_meta.focused .spos_operator {
  display: block;
}
.spos_draging {
  border: 2px dotted orange;
  cursor: move;
}
.spos_draging .spos_operator {
  background-color: #fff !important;
  display: none !important;
}
.spos_drawer /deep/ .el-drawer__header {
  margin-bottom: 0;
  padding: 0;
}
.spos_drawer_title {
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.spos_drawer_content {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.spos_upload_wrapper {
  background-color: lightcyan;
  padding: 10px;
  text-align: center;
  color: #666;
  position: relative;
  cursor: pointer;
}
.spos_upload_wrapper .el-icon-upload {
  font-size: 30px;
  margin-top: -5px;
  vertical-align: middle;
}
.spos_drawer_file {
  position: absolute;
  top: 0;
  left: 0;
  display: none;
}
.spos_images_wrapper {
  flex: 1;
  position: relative;
}
.spos_images_empty {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  color: #999;
  font-size: 14px;
}
.spos_images_list {
  position: absolute;
  top: 10px;
  left: 12px;
  right: 12px;
  bottom: 10px;
  overflow: auto;
}
.spos_images_item {
  position: absolute;
  font-size: 12px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
.spos_images_right {
  position: absolute;
  right: 5px;
  top: 5px;
  background-color: #409eff;
  color: #fff;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  padding: 0 5px;
  text-align: center;
  white-space: nowrap;
  border-radius: 10px;
}
.spos_images_label {
  padding: 6px 8px;
  display: flex;
  justify-content: space-between;
}
.spos_images_delete {
  color: orange;
  font-size: 14px;
}
.spos_cropper_dialog /deep/ .el-dialog__body {
  padding: 0 12px;
}
.spos_cropper_descript {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  margin-top: 5px;
}
.spos_cropper_content .cropper {
  width: auto;
  height: 300px;
  text-align: center;
}
</style>
  
  <!-- main.js配置
  
  import Vue from 'vue'
  import App from './App'
  // 注册elementUI
  import Element from 'element-ui'
  import 'element-ui/lib/theme-chalk/index.css'
  Vue.use(Element)
  // 注册阿里巴巴iconfont
  import './styles/icon/iconfont.css'
  import './styles/normalize.css'
  // 注册裁剪插件
  import VueCropper from 'vue-cropper'
  Vue.use(VueCropper)
  
  Vue.config.productionTip = false
  
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    render: h => h(App)
  }) -->