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
      <el-table-column prop="id" label="ID" align="center" width="60" />
      <el-table-column
        prop="company"
        label="Company Name"
        align="center"
        width="200"
      />
      <el-table-column
        prop="country"
        label="Country"
        align="center"
        width="200"
      />
      <!-- <el-table-column prop="city" label="City" align="center" width="100"/> -->
      <el-table-column
        prop="domain"
        label="Domain"
        align="center"
        width="200"
      />

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
            @click="handleUpdate(row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <br />

    <div>
      <el-button type="success" @click="handleAdd">Add</el-button>
    </div>

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        v-if="dialogStatus === 'Create'"
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        :inline="true"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="ID" prop="id" label-width="100px">
          <el-input v-model="temp.id" :disabled="true" />
        </el-form-item>
        <el-form-item label="Company" prop="company" label-width="100px">
          <el-input v-model="temp.company" />
        </el-form-item>
        <el-form-item label="Country" prop="country" label-width="100px">
          <el-input v-model="temp.country" />
        </el-form-item>
        <el-form-item label="Domain" prop="domain" label-width="100px">
          <el-input v-model="temp.domain" />
        </el-form-item>
      </el-form>

      <el-form
        v-if="dialogStatus === 'Edit'"
        ref="dataForm"
        :rules="rules"
        :model="temp"
        :inline="true"
        label-position="left"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="ID" prop="id" label-width="100px">
          <el-input v-model="temp.id" :disabled="true" />
        </el-form-item>
        <el-form-item label="Company" prop="company" label-width="100px">
          <el-input v-model="temp.company" />
        </el-form-item>
        <el-form-item label="Country" prop="country" label-width="100px">
          <el-input v-model="temp.country" />
        </el-form-item>
        <el-form-item label="Domain" prop="domain" label-width="100px">
          <el-input v-model="temp.domain" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog"> Close </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'Create' ? createData() : updateData()"
        >
          Confirm
        </el-button>
      </div>
    </el-dialog>
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
import {
  fetchCompanyList,
  deleteCompany,
  updateCompany,
  createCompany,
} from "@/api/customer";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "ProductList",
  components: { Pagination },
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
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
      },
      temp: {
        company: "",
        country: "",
        id: undefined,
        domain: "",
      },
      tempPw: "",
      dialogFormVisible: false,
      dialogStatus: "Edit",
      textMap: {
        update: "Edit",
        create: "Create",
      },
      resetPassword: false,
      rules: {
        country: [
          { required: true, message: "This is mandatory", trigger: "blur" },
        ],
        company: [
          { required: true, message: "This is mandatory", trigger: "blur" },
        ],
      },
    };
  },
  watch() {},
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchCompanyList(this.listQuery).then((response) => {
        this.list = response.data.items;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },

    handleAdd() {
      this.resetTemp();
      this.temp.id = Math.floor(Math.random() * 100000) + 1;
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
    },

    handleDelete(row) {
      this.$confirm("Delete this company?", "Warning", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          deleteCompany(row).then(
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

    updateData() {
      //console.log(this.temp)
      updateCompany(this.temp).then(
        this.$message({
          type: "success",
          message: "Saved",
        })
      );
      this.closeDialog();
      this.getList();
    },

    createData() {
      createCompany(this.temp).then(
        this.$message({
          type: "success",
          message: "Added",
        })
      );
      this.closeDialog();
      this.getList();
    },
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
