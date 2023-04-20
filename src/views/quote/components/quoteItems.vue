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

      <el-table-column label="Item" align="Left" width="auto" min-width="40%">
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
          >
            {{ row.quantity }}
          </el-input-number>
        </template>
      </el-table-column>

      <el-table-column
        label="Unit price"
        width="auto"
        align="left"
        min-width="10%"
      >
        <template slot-scope="{ row }">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Sum" width="auto" align="left" min-width="10%">
        <template slot-scope="{ row }">
          <span>{{ row.price * row.quantity }}</span>
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

    <el-col :span="6" :offset="15">
      <el-form-item label="Subtotal">
        <el-input
          type="text"
          v-model="subtotal"
          :disabled="true"
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
        label-width="90px"
        style="margin-left: 20px; margin-right: 40px"
      >
        <el-form-item label="Product" prop="productname">
          <el-cascader
            :options="optionedItme"
            @change="handleOptionChange"
            v-model="tempOption"
            style="width: 260px; margin-bottom: 20px"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="Price" prop="price">
          <el-input v-model="temp.price" :disabled="true" />
        </el-form-item>

        <el-form-item label="Quantity" prop="quantity">
          <el-input v-model="temp.quantity" :disabled="true" />
        </el-form-item>

        <el-form-item label="Currency" prop="currency">
          <el-input v-model="temp.currency" :disabled="true" />
        </el-form-item>

        <el-form-item label="Quote text" prop="text">
          <el-input
            type="textarea"
            placeholder="Quote text"
            v-model="temp.quotetext"
            rows="4"
          />
        </el-form-item>
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
import { fetchQuoteItems } from "@/api/quote";
import { getCategory } from "@/api/product";
export default {
  name: "ComplexTable",
  props: ["quotenumber"],
  data() {
    return {
      optionedItme: [
        { key: "CFL", value: "CFL" },
        { key: "PU", value: "PU" },
        { key: "DA", value: "DA" },
        { key: "MOTOR", value: "MOTOR" },
      ],
      optionedItme: [],
      list: [],
      listLoading: true,
      QueryList: {
        quotenumber: "",
      },
      rules: {
        quantity: [
          { required: true, message: "This is mandatory", trigger: "blur" },
        ],
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
      temp: {
        item: "",
        quotetext: "",
        quantity: 0,
        price: 0,
        currency: "",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          { required: true, message: "type is required", trigger: "change" },
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change",
          },
        ],
        title: [
          { required: true, message: "title is required", trigger: "blur" },
        ],
      },
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
    };
  },
  watch: {
    quotenumber(newnumber, oldnumber) {
      this.QueryList.quotenumber = this.quotenumber;
      this.getList();
    },
  },
  created() {
    this.resetTemp();
    this.listLoading = false;
    console.log(this.quotenumber)
    getCategory().then((response) => {
    this.optionedItme = [...response.data];
    //console.log(this.optionedItme)
    });
    this.updateSubtotal();
  },
  mounted(){
    //this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true;
      console.log(this.QueryList)
      await fetchQuoteItems(this.QueryList).then((response) => {
        this.list = response.data.itemList;
        console.log(this.list)
        this.listLoading = false;
      });
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
      this.temp = {};
    },

    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    handleEdit(row, index) {
      this.editingRow = index;
      this.tempOption = [{}, {}];

      console.log(this.editingRow);
      for (const type of this.optionedItme) {
        for (const product of type.children) {
          if (product.productname === row.item) {
            this.temp = product;
            this.temp.quantity = row.quantity;
            this.tempOption[1] = product.productname;
            break;
          }
        }
        console.log(this.temp)
        if (this.temp.category) {
          this.tempOption[0] = type.value;
          console.log(this.tempOption)
          break;
        }
      }

      this.dialogFormVisible = true;
      this.dialogStatus = "Edit";
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
      //console.log('handleOptionChange')
      //console.log(this.tempOption)
      let index = 0;
      for (const type of this.optionedItme) {
        if (type.value.indexOf(this.tempOption[0]) >= 0) {
          break;
        }
        index += 1;
      }
      //console.log('index '+ index)
      let tmpType = this.optionedItme[index].children;
      let i = 0;
      for (const product of tmpType) {
        i += 1;
        if (product.value === this.tempOption[1]) {
          this.temp = Object.assign({}, product);
          this.temp.quantity = 1;
          break;
        }
      }
      console.log("handoptionChange end+temp");
      console.log(this.temp);
    },

    closeDialog() {
      this.dialogFormVisible = false;
      this.resetTemp();
      this.tempOption = "";
    },

    addItem() {
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
    },

    editItem() {
      let index = this.editingRow;
      this.saveItem(index);
      this.$notify({
        title: "Success",
        message: "Item is successfully edited",
        type: "success",
        duration: 2000,
      });
      this.dialogFormVisible = false;
      this.resetTemp();
      this.tempOption = "";
    },

    saveItem(index) {
      if (index < 0) {
        //add
        console.log("saveItem - add");
        let temp = {};
        temp.item = this.temp.productname;
        temp.quantity = this.temp.quantity;
        temp.price = this.temp.price;
        temp.quotenumber = this.quotenumber;
        this.list.push(temp);
      } else {
        //edit
        console.log("saveItem - edit");
        console.log(this.list[index]);
        console.log(this.temp);
        this.list[index].item = this.temp.productname;
        this.list[index].quantity = this.temp.quantity;
        this.list[index].price = this.temp.price;
        this.list[index].quotenumber = this.quotenumber;
        console.log(this.list[index]);
      }
      this.updateSubtotal();
    },
  },
};
</script>
<style>
.Item {
  text-align: center;
}
</style>