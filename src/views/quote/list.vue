<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fift
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        prop="quote_number"
        label="Quote No."
        align="center"
        width="90"
      />
      <el-table-column
        prop="quote_date"
        label="Date"
        align="center"
        width="100"
      />
      <el-table-column
        prop="currency"
        label="Currency"
        align="center"
        width="85"
      />
      <el-table-column prop="vat" label="VAT" align="center" width="50" />
      <el-table-column
        prop="discount_direct"
        label="Disc."
        align="center"
        width="60"
      />
      <el-table-column
        prop="discount"
        label="Disc.%"
        align="center"
        width="70"
      />
      <el-table-column prop="total" label="Total" align="center" width="100" />
      <el-table-column
        prop="contact"
        label="Contact"
        align="center"
        width="150"
      />
      <el-table-column
        prop="company"
        label="Company"
        align="center"
        width="100"
      />
      <el-table-column prop="owner" label="Owner" align="center" width="100" />

      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="scope">
          <router-link :to="'/quote/list/edit/' + scope.row.quote_number">
            <el-button type="primary" icon="el-icon-edit" size="mini" />
          </router-link>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="handleDelete(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <br />

    <div>
      <el-button type="success" @click="handleAdd">Add</el-button>
    </div>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>
  
  <script>
import { fetchList, deleteQuote } from "@/api/quote";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "ProductList",
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.list = response.data.items;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    handleAdd() {
      this.resetTemp();
      this.dialogStatus = "Create";
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
    resetTemp() {
      this.temp = {
        name: "",
        username: "",
        password: "",
      };
    },
    resetPw() {
      if (this.resetPassword == false) {
        this.resetPassword = true;
        this.tempPw = this.temp.password;
        this.temp.password = "";
      } else {
        this.resetPassword = false;
        this.temp.password = this.tempPw;
        this.tempPw = "";
      }
    },
    closeDialog() {
      this.dialogFormVisible = false;
      if (this.tempPw) {
        this.temp.password = this.tempPw;
        this.resetPassword = false;
      }
    },
    handleDelete(row) {
      console.log(row);
      this.$confirm("Delete this contact?", "Warning", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          deleteQuote(row).then(
            this.$message({
              type: "success",
              message: "Deleted!",
            })
          );
          this.getList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Canceled",
          });
        });
    },
  },
};
</script>
  


  