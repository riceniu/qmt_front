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
        prop="gender"
        label=""
        align="center"
        width="50"
        show-overflow-tooltip
      /><el-table-column
        prop="firstname"
        label="First name"
        align="center"
        width="100"
        show-overflow-tooltip
      />
      <el-table-column
        prop="lastname"
        label="Last name"
        align="center"
        width="100"
        show-overflow-tooltip
      />
      <el-table-column prop="email" label="Email" align="center" width="200" show-overflow-tooltip/>
      <el-table-column prop="tel" label="Tel" align="center" width="130" show-overflow-tooltip/>
      <el-table-column
        prop="mobile"
        label="Mobile"
        align="center"
        width="130"
        show-overflow-tooltip
      />
      <el-table-column
        prop="company"
        label="Company"
        align="center"
        width="250"
        show-overflow-tooltip
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
          <el-input v-model="temp.email" :disabled="true" />
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
  fetchList,
  deleteContact,
  updateContact,
  createContact,
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
        firstname: "",
        lastname: "",
        id: "",
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
          { required: true, message: "This is mandatory", trigger: "blur" },
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
      this.temp.id = "";
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
      this.temp = {};
    },

    closeDialog() {
      this.dialogFormVisible = false;
      if (this.tempPw) {
        this.temp.password = this.tempPw;
        this.resetPassword = false;
      }
    },

    handleDelete(row) {
      this.$confirm("Delete this company?", "Warning", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          this.delContact(row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Canceled",
          });
        });
    },

    async delContact(row) {
      try {
        let res = await deleteContact(row);
        console.log(res);
        if (res.code === 200) {
          this.$message({
            type: "success",
            message:
              "id " +
              row.id +
              " " +
              row.firstname +
              " " +
              row.lastname +
              " is deleted",
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

    updateData() {
      this.updContact();
    },
    async updContact() {
      try {
        let res = await updateContact(this.temp);
        console.log(res);
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "Saved",
          });
          this.getList();
          this.closeDialog();
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

    createData() {
      //console.log(this.temp)
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.creContact();
        }
      });
    },
    async creContact() {
      try {
        let res = await createContact(this.temp);
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "Added",
          });
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
      this.getList();
      this.closeDialog();
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
  