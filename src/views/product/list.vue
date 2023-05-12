<template>
  <div class="app-container">
    <div class="tab-container">
      <el-tabs v-model="activeName" style="margin-top: 15px" type="border-card">
        <el-tab-pane
          v-for="item in tabMapOptions"
          :key="item.key"
          :label="item.label"
          :name="item.key"
        >
          <!-- <keep-alive> -->
            <tab-pane
              v-if="activeName == item.key"
              v-on:listRefreshed="listRefreshed"
              :type="item.key"
              :refresh="refresh"
            />
          <!-- </keep-alive> -->
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- Add button -->
    <div>
      <el-button type="success" @click="handleAdd">Add</el-button>
    </div>

    <!--dialog-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-width="90px"
        style="margin-left: 20px; margin-right: 40px"
      >
        <el-form-item label="ID" prop="id">
          <el-input v-model="temp.id" :disabled="true" />
        </el-form-item>

        <el-form-item label="Category" prop="category">
          <el-select
            v-model="temp.category"
            class="filter-item"
            placeholder="Category"
          >
            <el-option
              v-for="item in CategoryType"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Product" prop="productname">
          <el-input v-model="temp.productname" placeholder="X-xxx" />
        </el-form-item>

        <el-form-item label="Price" prop="price">
          <el-input v-model="temp.price" />
        </el-form-item>

        <el-form-item label="Currency" prop="currency">
          <el-select v-model="temp.currency" class="filter-item">
            <el-option
              v-for="item in CurrencyType"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
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
          @click="dialogStatus === 'Add' ? createData() : updateData()"
        >
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TabPane from "./TabPane";
import {
  fetchList,
  fetchLastId,
  addProduct,
  editProduct,
  deleteProduct,
//  getAllProducts,
} from "@/api/product";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
const CategoryType = [
  { key: "CFL", value: "CFL" },
  { key: "PU", value: "PU" },
  { key: "DA", value: "DA" },
  { key: "MOTOR", value: "MOTOR" },
];
const CurrencyType = [
  { key: "USD", value: "USD" },
  { key: "GBP", value: "GBP" },
  { key: "EURO", value: "EURO" },
  { key: "CNY", value: "CNY" },
];
export default {
  name: "ProductList",
  components: { Pagination, TabPane },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      tabMapOptions: [
        { label: "ALL", key: "ALL" },
        { label: "CFL", key: "CFL" },
        { label: "PU", key: "PU" },
        { label: "DA", key: "DA" },
        { label: "MOTOR", key: "MOTOR" },
      ],
      activeName: "ALL",
      CategoryType,
      CurrencyType,
      textMap: {
        Edit: "Edit",
        Add: "Add new product",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      temp: {
        id: "",
        quotetext: "",
        currency: "",
        category: "",
        price: "",
        productname: "",
      },
      rules: {
        category: [
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
        currency: [
          { required: true, message: "This is mandatory", trigger: "blur" },
        ],
      },
      refresh:0,
    };
  },
  created() {
    //this.getList();
    //this.getAll();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      const response = await fetchList(this.listQuery);
      console.log(response)
      this.list = response.data.items;
      this.total = response.data.total;
      this.listLoading = false;
    },    
    // async getAll() {
    //   this.listLoading = true;
    //   const response = await getAllProducts()
    //   console.log(response)
    //   this.list = response.data;
    //   this.total = response.data.length;
    //   this.listLoading = false;
    // },
    handleEdit(row) {
      this.temp = Object.assign({}, row);
      this.dialogStatus = "Edit";
      this.dialogFormVisible = true;
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = "Edit";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleDelete(row) {
      this.temp = Object.assign({}, row);
      this.$confirm(
        "Confirm to delete " + this.temp.productname + " ID: " + this.temp.id,
        "Attention",
        {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          this.delProduct(row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Canceled",
          });
        });
    },
    async delProduct(row) {
      try {
        let res = await deleteProduct(row);
        console.log(res);
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "id " + row.id + " " + row.productname + " is deleted",
          });
          this.getList();
        } else {
          this.$message({
            type: "error",
            message: res.message,
          });
        }
      } catch (error) {
        this.$message({
          type: "error",
          message: error,
        });
      }
    },
    closeDialog() {
      this.dialogFormVisible = false;
      if (this.tempPw) {
        this.temp.password = this.tempPw;
        this.resetPassword = false;
      }
    },
    handleAdd() {
      this.dialogStatus = "Add";
      this.resetTemp();
      this.dialogFormVisible = true;
    },
    resetTemp() {
      this.temp = {
        id: "",
        quotetext: "",
        currency: "",
        category: "",
        price: "",
        productname: "",
      };
      if (this.dialogStatus === "Add") {
        fetchLastId().then((response) => {
          this.temp.id = response.data + 1;
        });
      }
    },

    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.updProduct();
        }
      });
    },
    async updProduct() {
      try {
        let res = await editProduct(this.temp);
        this.resMsg(res);
        this.getList();
      } catch (error) {
        this.$message({
          type: "error",
          message: error,
        });
      }
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.creProduct();
        }
      });
    },
    async creProduct() {
      try {
        let res = await addProduct(this.temp);
        this.resMsg(res);
      } catch (error) {
        this.$message({
          type: "error",
          message: error,
        });
      }
    },
    resMsg(res) {
      if (res.code === 200) {
        this.$notify({
          title: "Success",
          message: "Operation Successfully",
          type: "success",
          duration: 2000,
        });
      } else {
        this.$message({
          type: "error",
          message: res.message,
        });
      }
      this.dialogFormVisible = false;
      this.refresh = 1;
      console.log("add")
      console.log(this.refresh)
      //this.getList();
    },
    listRefreshed(){
      console.log('parent refresh')
      this.refresh = 0
    }
  },
};
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
