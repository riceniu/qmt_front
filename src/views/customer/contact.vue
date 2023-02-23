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
        prop="firstname"
        label="First name"
        align="center"
        width="100"
      />
      <el-table-column
        prop="lastname"
        label="Last name"
        align="center"
        width="100"
      />
      <el-table-column prop="email" label="Email" align="center" width="200" />
      <el-table-column prop="tel" label="Tel" align="center" width="130" />
      <el-table-column
        prop="mobile"
        label="Mobile"
        align="center"
        width="130"
      />
      <el-table-column
        prop="company"
        label="Company"
        align="center"
        width="250"
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
        <el-form-item label="First name" prop="firstname" label-width="100px">
          <el-input v-model="temp.firstname" />
        </el-form-item>
        <el-form-item label="Last name" label-width="100px">
          <el-input v-model="temp.lastname" />
        </el-form-item>
        <el-form-item label="Email" prop="email" label-width="100px">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item label="Tel" label-width="100px">
          <el-input v-model="temp.tel" />
        </el-form-item>
        <el-form-item label="Mobile" label-width="100px">
          <el-input v-model="temp.mobile" />
        </el-form-item>
        <el-form-item label="Company" label-width="100px">
          <el-input type="textarea" v-model="temp.company" />
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
        <el-form-item label="First name" prop="firstname" label-width="100px">
          <el-input v-model="temp.firstname" />
        </el-form-item>
        <el-form-item label="Last name" label-width="100px">
          <el-input v-model="temp.lastname" />
        </el-form-item>
        <el-form-item label="Email" prop="email" label-width="100px">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item label="Tel" label-width="100px">
          <el-input v-model="temp.tel" />
        </el-form-item>
        <el-form-item label="Mobile" label-width="100px">
          <el-input v-model="temp.mobile" />
        </el-form-item>
        <el-form-item label="Company" label-width="100px">
          <el-input type="textarea" v-model="temp.company" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog"> Close </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
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
import { fetchList } from "@/api/customer";
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
        firstname: "",
        lastname: "",
        id: undefined,
        tel: "",
        mobile: "",
        company: "",
        email: "",
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
        email: [
          { required: true, message: "Email is required", trigger: "blur" },
        ],
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
    handleDelete() {
      this.$confirm("Delete this contact?", "Warning", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "Deleted!",
          });
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
  