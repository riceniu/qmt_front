<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyWords"
        placeholder="Search name/email/phone/company"
        style="width: 300px"
        class="filter-item"
        @input="handleFilter"
      />
      <!-- <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select> -->
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        Search
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleAdd"
      >
        Add
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        @click="handleAll"
      >
        All
      </el-button>
      <!-- <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        Export
      </el-button> -->
      <!-- <el-checkbox
        v-model="showReviewer"
        class="filter-item"
        style="margin-left: 15px"
        @change="tableKey = tableKey + 1"
      >
        reviewer
      </el-checkbox> -->
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fift
      highlight-current-row
      style="width: 100%"
    >
      <!-- <el-table-column prop="id" label="ID" align="center" width="60" /> -->
      <el-table-column
        prop="gender"
        label=""
        align="center"
        width="50"
        show-overflow-tooltip
        sortable
      /><el-table-column
        prop="firstname"
        label="First name"
        align="left"
        width="120"
        sortable
        show-overflow-tooltip
      />
      <el-table-column
        prop="lastname"
        label="Last name"
        align="left"
        width="120"
        sortable
        show-overflow-tooltip
      />
      <el-table-column
        prop="email"
        label="Email"
        align="left"
        width="200"
        sortable
        show-overflow-tooltip
      />
      <el-table-column
        prop="tel"
        label="Tel"
        align="left"
        width="130"
        sortable
        show-overflow-tooltip
      />
      <el-table-column
        prop="mobile"
        label="Mobile"
        align="left"
        width="130"
        sortable
        show-overflow-tooltip
      />
      <el-table-column
        prop="company"
        label="Company"
        align="left"
        width="250"
        sortable
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
      <el-button
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleAdd"
        >Add</el-button
      >
    </div>

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        :inline="true"
        label-position="left"
        style="width: 400px; margin-left: 50px"
      >
        <!-- <el-form-item label="ID" prop="id" label-width="100px">
          <el-input v-model="temp.id" :disabled="true" />
        </el-form-item> -->
        <el-form-item label="Gender" prop="gender" label-width="100px">
          <el-select v-model="temp.gender">
            <el-option
              v-for="item in GenderList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option
          ></el-select>
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
        <!-- <el-form-item label="Company" label-width="100px">
          <el-input type="textarea" v-model="temp.company" />
        </el-form-item> -->
        <el-form-item label="Company" prop="company" label-width="100px">
          <el-select
            v-model="temp.company"
            @change="selectCompany"
            value-key="id"
            filterable
            remote
            default-first-option
            :remote-method="getCompanyList"
            placeholder="Please select"
            no-data-text="No such company, please add"
          >
            <el-option
              v-for="item in companyOptionList"
              :key="item.companyId"
              :label="item.company"
              :value="item"
            />
          </el-select>
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
  remoteSearchCompany,
} from "@/api/customer";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import waves from "@/directive/waves";

export default {
  name: "ProductList",
  components: { Pagination },
  directives: { waves },
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
      isEdit: false,
      companyOptionList: [],
      listQuery: {
        page: 1,
        limit: 50,
        keyWords: "",
        orderBy: "",
      },
      GenderList: [
        { value: "Mr", label: "Mr" },
        { value: "Ms", label: "Ms" },
        { value: "x", label: "x" },
      ],
      list: null,
      total: 0,
      listLoading: true,
      temp: {
        firstname: "",
        lastname: "",
        id: "",
        tel: "",
        mobile: "",
        company: "",
        email: "",
        companyId: "",
      },
      dialogFormVisible: false,
      dialogStatus: "Edit",
      textMap: {
        Edit: "Edit",
        Add: "Add",
      },
      resetPassword: false,
      rules: {
        email: [
          { required: true, message: "This is mandatory", trigger: "blur" },
        ],
        company: [
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
      this.dialogStatus = "Add";
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
        firstname: "",
        lastname: "",
        id: "",
        tel: "",
        mobile: "",
        company: "",
        email: "",
        companyId: "",
      };
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
        this.temp.company = this.temp.companyId;
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
        this.temp.company = this.temp.companyId;
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
    getCompanyList(query) {
      remoteSearchCompany(query)
        .then((response) => {
          if (!response.data) return;
          this.companyOptionList = response.data.map((v) => ({
            companyId: v.id,
            company: v.company,
          }));
          console.log(this.companyOptionList);
        })
        .then((this.loading = false));
    },
    selectCompany(e) {
      console.log(e);
      this.temp.company = e.company;
      this.temp.companyId = e.companyId;
      console.log(this.temp);
    },
    handleFilter(query) {
      this.listQuery.page = 1;
      this.getList();
    },
    handleAll() {
      this.listQuery.page = 1;
      this.listQuery.keyWords = "";
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
  