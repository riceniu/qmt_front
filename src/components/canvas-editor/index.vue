<template>
  <div class="canvas-editor"></div>
</template>

<script>
import Editor, {
  BlockType,
  Command,
  ControlType,
  EditorMode,
  ElementType,
  IBlock,
  ICatalogItem,
  IElement,
  KeyMap,
  ListStyle,
  ListType,
  PageMode,
  PaperDirection,
  RowFlex,
  TitleLevel,
} from "@hufe921/canvas-editor";
// import { Dialog } from './components/dialog/Dialog'
// import { formatPrismToken } from './utils/prism'
// import { Signature } from './components/signature/Signature'
// import { debounce } from './utils'

export default {
  name: "canvas-editor",
  components: {},
  props: {
    id: {
      type: String,
      default: function () {
        return (
          "vue-tinymce-" +
          +new Date() +
          ((Math.random() * 1000).toFixed(0) + "")
        );
      },
    },
    value: {
      type: String,
      default: "",
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    menubar: {
      type: String,
      default: "file edit insert view format table",
    },
    height: {
      type: [Number, String],
      required: false,
      default: 1200,
    },
    width: {
      type: [Number, String],
      required: false,
      default: "auto",
    },
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      languageTypeList: {
        en: "en",
        zh: "zh_CN",
        es: "es_MX",
        ja: "ja",
      },
    };
  },
  computed: {
    containerWidth() {
      const width = this.width;
      if (/^[\d]+(\.[\d]+)?$/.test(width)) {
        // matches `100`, `'100'`
        return `${width}px`;
      }
      return width;
    },
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val || "")
        );
      }
    },
  },
  mounted() {
    this.init();
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce();
    }
  },
  deactivated() {},
  destroyed() {},
  methods: {
    init() {
      console.log(document.querySelector(".canvas-editor"));
      new Editor(
        document.querySelector(".canvas-editor"),
        {
          header: [
            {
              value: "Header",
              rowFlex: RowFlex.CENTER,
            },
          ],
          main: [
            {
              value: this.value,
            },
          ],
          footer: [
            {
              value: "canvas-editor",
              size: 12,
            },
          ],
        },
        {}
      );
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
