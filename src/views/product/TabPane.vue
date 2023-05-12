<template>
  <div>
    <!-- Table -->
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <!-- :default-sort = "{prop: 'category', order: 'ascending'}" -->
      <el-table-column align="center" label="ID" width="65" sortable prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="Category"
        width="110"
        sortable
        prop="category"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.category }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="left"
        label="Product"
        width="240px"
        height="10px"
        sortable
        prop="productname"
        show-overflow-tooltip
      >
        <!-- <template slot-scope="scope">
          <div style="max-height: 50px; overflow-x:scroll">
            <span>{{ scope.row.productname }}</span>
          </div>
        </template> -->
      </el-table-column>

      <el-table-column
        align="center"
        label="Price"
        width="80px"
        sortable
        prop="price"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="Currency"
        width="110px"
        sortable
        prop="currency"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.currency }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="250px" label="Reference text" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span>{{ row.quotetext }}</span>
          <!-- <router-link :to="'/product/edit/' + row.id" class="link-type">
            <span>{{ row.quotetext }}</span>
          </router-link> -->
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="{ row }">
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="handleDelete(row)"
          />
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="handleEdit(row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

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
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import {
  fetchList,
  fetchLastId,
  addProduct,
  editProduct,
  deleteProduct,
  getAllProducts,
} from "@/api/product";
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
  components: { Pagination },
  props: {
    type: {
      type: String,
      default: "CN",
    },
    refresh: { type: Number, default: 0 },
    default: [],
  },
  data() {
    return {
      CategoryType,
      CurrencyType,
      list: null,
      listQuery: {
        page: 1,
        limit: 20,
        type: "ALL",
      },
      total: 1,
      loading: false,
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
    };
  },
  watch: {
    refresh(newnumber, oldnumber) {
      console.log("refresh");
      console.log(newnumber + " " + oldnumber);
      if (newnumber === 1) {
        console.log("child refreshed");
        this.getList();
        this.$emit("listRefreshed");
      }
    },
  },
  created() {
    // console.log(this.type);
    // console.log(this.refresh);
    this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      this.listQuery.type = this.type;
      const response = await fetchList(this.listQuery);
      //console.log(response);
      this.list = response.data.items;
      this.total = response.data.total;
      this.listLoading = false;
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
    handleEdit(row) {
      this.temp = Object.assign({}, row);
      this.dialogStatus = "Edit";
      this.dialogFormVisible = true;
    },
    closeDialog() {
      this.dialogFormVisible = false;
      if (this.tempPw) {
        this.temp.password = this.tempPw;
        this.resetPassword = false;
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
      this.getList();
    },
  },
};
</script>

