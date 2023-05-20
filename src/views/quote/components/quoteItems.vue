<template>
  <div class="app-container">
    <div>
      <el-button type="primary" @click="handleAdd">Add</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        label="No."
        type="index"
        align="center"
        width="auto"
        min-width="10%"
      >
        <!-- <template slot-scope="{row}">
          <span>{{ row.No }}</span>
        </template> -->
      </el-table-column>

      <el-table-column
        label="Item"
        align="Left"
        width="auto"
        min-width="30%"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span style="text-align: left">{{ scope.row.item }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="Quantity"
        width="auto"
        align="center"
        min-width="15%"
      >
        <template slot-scope="{ row }">
          <el-input-number
            v-model="row.quantity"
            size="mini"
            @change="handleQuantityChange"
            :min="1"
          >
            {{ row.quantity }}
          </el-input-number>
        </template>
      </el-table-column>

      <el-table-column
        label="Unit price"
        width="auto"
        align="center"
        min-width="15%"
      >
        <template slot-scope="{ row }">
          <span class="decimal">{{ decFormat(row.price) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Sum" width="auto" align="center" min-width="15%">
        <template slot-scope="{ row }">
          <span class="decimal">{{ decFormat(row.price * row.quantity) }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="Actions"
        align="center"
        width="auto"
        class-name="small-padding fixed-width"
        min-width="15%"
      >
        <template slot-scope="{ row, $index }">
          <el-button-group>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="handleEdit(row, $index)"
            />
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(row, $index)"
            />
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <br />
    <el-col :span="6" :offset="15">
      <el-form-item label="Subtotal">
        <el-input-number
          type="text"
          v-model="subtotal"
          :precision="2"
          :disabled="true"
          :controls="false"
          style="width: 100px"
        />
      </el-form-item>
    </el-col>

    <br />

    <!-- Dialog -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :before-close="closeDialog"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-width="85px"
        style="margin-left: 20px; margin-right: 40px"
      >
        <el-form-item label="Product" prop="productname">
          <el-cascader
            :options="optionedItme"
            @change="handleOptionChange"
            v-model="tempOption"
            filterable=""
            style="width: 260px; margin-bottom: 20px"
            default-first-option
          ></el-cascader>
        </el-form-item>

        <el-form-item label="Item" prop="item">
          <el-input v-model="temp.item" />
        </el-form-item>

        <el-form-item label="Price" prop="price">
          <el-input-number
            :controls="false"
            :precision="2"
            v-model="temp.price"
          />
        </el-form-item>

        <!-- <el-form-item label="Quantity" prop="quantity">
          <el-input v-model="temp.quantity" :disabled="true" />
        </el-form-item> -->

        <!-- <el-form-item label="Currency" prop="currency">
          <el-input v-model="temp.currency"  />
        </el-form-item> -->

        <el-form-item label="Quote text" prop="text">
          <el-input
            type="textarea"
            placeholder="Quote text"
            v-model="temp.quotetext"
            rows="4"
          />
        </el-form-item>

        <el-form-item label="Comments" prop="comments">
          <el-input
            type="textarea"
            placeholder="Comments(optional)"
            v-model="temp.comments"
            rows="4"
          />
        </el-form-item>
        <!-- <el-form-item label="pic-to be finished soon" prop="pic">
          <el-upload
            ref="picUpload"
            :file-list="picList"
            action
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-change="handleChangePic"
            :auto-upload="false"
            :limit="2"
          >
            <i class="el-icon-plus"></i>
          </el-upload>

          <el-dialog :visible.sync="picDialogVisible">
            <img width="100%" :src="picDialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item> -->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog"> Close </el-button>
        <el-button
          type="primary"
          v-if="dialogStatus === 'Add'"
          @click="addItem()"
        >
          Add
        </el-button>
        <el-button
          type="primary"
          v-if="dialogStatus === 'Edit'"
          @click="editItem()"
        >
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
  
<script>
//import { fetchQuoteItems } from "@/api/quote";
import { getCategory, getProductbyName } from "@/api/product";
export default {
  name: "ComplexTable",
  props: ["quotenumber", "ListItems"],
  data() {
    return {
      picDialogImageUrl: "",
      picDialogVisible: false,
      picList: [],
      optionedItme: [],
      list: [],
      listLoading: true,
      QueryList: {
        quotenumber: "",
      },
      rules: {
        price: [
          { required: true, message: "This is mandatory", trigger: "blur" },
          {
            type: "number",
            transform(value) {
              return value === "" ? 0 : Number(value);
            },
            trigger: "blur",
          },
        ],
      },
      temp: {},
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create",
      },
      dialogPvVisible: false,
      pvData: [],
      textMap: {
        Edit: "Edit",
        Add: "Add a new item",
      },
      dialogStatus: "",
      downloadLoading: false,
      subtotal: 0,
      Items: [],
      uniqueKey: 584651274321768,
      dialogVisible: true,
      tempOption: "",
      editingRow: 0,
      tempQuoteVO: "",
    };
  },
  watch: {
    quotenumber(newnumber, oldnumber) {
      this.QueryList.quotenumber = this.quotenumber;
      this.getList();
    },
  },
  computed: {},
  created() {
    console.log("subform-created");
    this.resetTemp();
    this.listLoading = false;
    //console.log(this.quotenumber);
    //console.log(this.ListItems)
    this.list = this.ListItems;
    getCategory().then((response) => {
      this.optionedItme = [...response.data];
      //console.log(this.optionedItme)
    });
    this.updateSubtotal();
  },
  mounted() {
    //this.getList()
  },
  methods: {
    //picture related functions
    handleChangePic(file, picList) {
      console.log(file, picList);
      this.temp.pic = file;
      if (picList.length > 1) {
        picList.splice(0, 1);
      }
    },
    handleRemove(file, picList) {
      console.log(file, picList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    async getList() {
      this.listLoading = true;
      console.log("items=>getList()");
      //console.log(this.QueryList);
      // await fetchQuoteItems(this.QueryList).then((response) => {
      //   this.list = response.data.itemList;
      //   console.log(this.list);
      //   this.listLoading = false;
      // });
      //console.log(this.ListItems);
      this.list = this.ListItems;
      //console.log(this.list);
      this.listLoading = false;
      this.updateSubtotal();
    },

    handleAdd() {
      this.dialogFormVisible = true;
      this.dialogStatus = "Add";
    },

    handleItemChange(value) {
      console.log(value);
    },
    resetTemp() {
      this.temp = {
        item: "",
        price: "",
        quotetext: "",
        id: "",
        comments: "",
        pic: "",
      };
      this.picList = [];
      //this.$refs.picUpload.clearFiles();
    },

    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    async handleEdit(row, index) {
      console.log("handelEdit");
      this.editingRow = index;
      this.tempOption = [{}, {}];

      // console.log(this.editingRow);
      // for (const type of this.optionedItme) {
      //   for (const product of type.children) {
      //     if (product.productname === row.item) {
      //       this.temp = product;
      //       this.temp.quantity = row.quantity;
      //       this.tempOption[1] = product.productname;
      //       break;
      //     }
      //   }
      //   console.log(this.temp);
      //   if (this.temp.category) {
      //     this.tempOption[0] = type.value;
      //     console.log(this.tempOption);
      //     break;
      //   }
      // }

      //let res = await getProductbyName(row.item);
      console.log(row);
      //const product = res.data;
      //console.log(product);
      this.temp.item = row.item;
      this.temp.id = row.id;
      this.temp.quotetext = row.text;
      //this.temp.currency = row.currency;
      this.temp.quantity = row.quantity;
      this.temp.price = row.price;
      this.temp.comments = row.comments;
      if (row.pic) this.picList[0] = row.pic;
      this.tempOption[0] = "";
      this.tempOption[1] = "";
      //console.log(this.tempOption);
      this.dialogFormVisible = true;
      this.dialogStatus = "Edit";
      this.$forceUpdate();
    },

    handleDelete(row, index) {
      this.$notify({
        title: "Success",
        message: "Delete Successfully",
        type: "success",
        duration: 2000,
      });
      this.list.splice(index, 1);
      this.handleQuantityChange();
    },

    handleQuantityChange() {
      console.log("handelQuantityChange()");
      console.log(this.list);
      this.$emit("itemChange", this.list);
      this.updateSubtotal();
    },

    updateSubtotal() {
      this.subtotal = 0;
      if (this.list) {
        for (const item of this.list) {
          this.subtotal += item.price * item.quantity;
        }
      }
      this.$emit("itemChange", this.list);
    },

    handleOptionChange() {
      //mock mode
      // console.log('handleOptionChange')
      // console.log(this.tempOption[1])
      // let index = 0;
      // for (const type of this.optionedItme) {
      //   if (type.value.indexOf(this.tempOption[0]) >= 0) {
      //     break;
      //   }
      //   index += 1;
      // }
      // //console.log('index '+ index)
      // let tmpType = this.optionedItme[index].children;
      // let i = 0;
      // for (const product of tmpType) {
      //   i += 1;
      //   if (product.value === this.tempOption[1]) {
      //     this.temp = Object.assign({}, product);
      //     this.temp.quantity = 1;
      //     break;
      //   }
      // }
      // console.log("handoptionChange end+temp");
      // console.log(this.temp);

      //backend api mode
      console.log(this.tempOption[1]);
      getProductbyName(this.tempOption[1]).then((response) => {
        const product = response.data;
        console.log(product);
        this.temp.item = product.productname;
        this.temp.quotetext = product.quotetext;
        this.temp.currency = product.currency;
        this.temp.quantity = 1;
        this.temp.price = product.price;
        this.$forceUpdate();
      });
      console.log(this.tempOption);
    },

    closeDialog() {
      this.dialogFormVisible = false;
      this.resetTemp();
      this.tempOption = "";
    },

    addItem() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          console.log("children->addItem");
          this.saveItem(-1);
          this.$notify({
            title: "Success",
            message: "Item is successfully added",
            type: "success",
            duration: 2000,
          });
          this.dialogFormVisible = false;
          this.resetTemp();
          this.tempOption = "";
        }
      });
    },

    editItem() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let index = this.editingRow;
          this.saveItem(index);
          this.$notify({
            title: "Success",
            message: "Item is successfully added",
            type: "success",
            duration: 2000,
          });
          this.dialogFormVisible = false;
          this.resetTemp();
          //this.tempOption = "";
        }
      });
    },

    saveItem(index) {
      if (index < 0) {
        //add
        console.log("saveItem - add");
        let temp = {};
        console.log(this.temp);
        temp.item = this.temp.item;
        temp.comments = this.temp.comments;
        temp.quantity = 1;
        temp.price = this.temp.price ? this.temp.price : 0;
        temp.quoteNumber = this.quotenumber;
        temp.text = this.temp.quotetext;
        this.list.push(temp);
      } else {
        //edit
        console.log("saveItem - edit");
        console.log(this.list[index]);
        console.log(this.temp);
        this.list[index].id = this.temp.id;
        this.list[index].item = this.temp.item;
        this.list[index].quantity = this.temp.quantity;
        this.list[index].price = this.temp.price;
        this.list[index].quoteNumber = this.quotenumber;
        this.list[index].text = this.temp.quotetext;
        this.list[index].comments = this.temp.comments;
        //console.log(this.temp.pic);
        this.list[index].pic = this.temp.pic;
        console.log(this.list[index]);
      }
      this.updateSubtotal();
    },
    decFormat(cellValue) {
      //console.log('decFormat')
      cellValue = parseFloat(cellValue).toFixed(2);
      cellValue += "";
      if (!cellValue.includes(".")) cellValue += ".";

      return cellValue
        .replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
          return $1 + ",";
        })
        .replace(/\.$/, "");
    },
  },
};
</script>
<style>
.Item {
  text-align: center;
}
.decimal {
  margin-right: 50px;
  float: right;
}
</style>