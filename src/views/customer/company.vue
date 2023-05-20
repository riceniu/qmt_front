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
        align="left"
        width="400"
        show-overflow-tooltip
      />
      <el-table-column
        prop="country"
        label="Country"
        align="left"
        width="200"
      />
      <!-- <el-table-column prop="city" label="City" align="center" width="100"/> -->
      <el-table-column prop="domain" label="Domain" align="left" width="200" />

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
          <!-- <el-input v-model="temp.country" /> -->
          <el-select
            v-model="temp.country"
            filterable
            remote
            :remote-method="searchList"
            placeholder="Please select"
            default-first-option
            no-data-text="Wrong country name"
            @focus="getCountryList"
          >
            <el-option
              v-for="item in countryList"
              :key="item.country"
              :label="item.country"
              :value="item.country"
            />
          </el-select>
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
          <!-- <el-input v-model="temp.country" /> -->
          <el-select
            v-model="temp.country"
            filterable
            remote
            :remote-method="searchList"
            placeholder="Please select"
            default-first-option
            no-data-text="Wrong country name"
            @focus="getCountryList"
          >
            <el-option
              v-for="item in countryList"
              :key="item.country"
              :label="item.country"
              :value="item.country"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Domain" prop="domain" label-width="100px">
          <el-input v-model="temp.domain" :disabled="true" />
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
import country from "./countryList.json";

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
      countryList: [],
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
      //this.temp.id = Math.floor(Math.random() * 100000) + 1;
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
          this.delCompany(row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Canceled",
          });
        })
        .then(this.getList());
    },
    async delCompany(row) {
      try {
        let res = await deleteCompany(row);
        console.log(res);
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "id " + row.id + " " + row.company + " is deleted",
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
      this.updCompany();
    },
    async updCompany() {
      try {
        let res = await updateCompany(this.temp);
        console.log(res);
        this.resMsg(res);
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
          this.creCompany();
        }
      });
    },
    async creCompany() {
      try {
        let res = await createCompany(this.temp);
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
        this.$message({
          type: "success",
          message: "Saved",
        });
      } else {
        this.$message({
          type: "error",
          message: res.message,
        });
      }
      this.getList();
      this.closeDialog();
    },
    getCountryList() {
      // this.countryList = Object.values(country.all).map((v) => ({
      //       country: v.name,
      //       region: v.region,
      //       key:v.iso3
      //     }))
      //this.countryList = country.sort((b,a)=>(a.country < b.country) ? 1 : (a.country > b.country) ? -1 : 0);
      //console.log(country)
      this.countryList = country.map(v=>v)
      //console.log( this.countryList)
    },
    searchList(query) {
      console.log(query);
      //console.log(country);
      this.countryList.length = 0;
      for (const item of country) {
        //console.log(item);
        if (item.country.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          this.countryList.push(item);
        }
      }
      if(this.countryList.length===0){this.countryList = []}
      //console.log(this.countryList);
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
