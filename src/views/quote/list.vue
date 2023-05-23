<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyWords"
        placeholder="Search QuoteNumber/company/contact"
        style="width: 300px"
        class="filter-item"
        @input="handleFilter"
      />
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        align="right"
        class="filter-item"
        unlink-panels
        range-separator="to"
        start-placeholder="Start"
        end-placeholder="End"
        :picker-options="pickerOptions"
        @change="dateSelection"
        value-format="yyyy-MM-dd"
      >
      </el-date-picker>

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
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        Search
      </el-button>
      <router-link :to="'/quote/new'">
        <el-button
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          icon="el-icon-edit"
        >
          Add
        </el-button></router-link
      >
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        @click="handleAll"
      >
        All
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fift
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        prop="quoteNumber"
        label="Quote No."
        align="center"
        width="120"
        sortable
        show-overflow-tooltip
      />
      <el-table-column
        prop="dateQuote"
        label="Date"
        align="center"
        width="120"
        sortable
      />
      <el-table-column
        prop="currency"
        label="Currency"
        align="center"
        width="85"
        sortable
      />

      <el-table-column
        prop="discountDirect"
        label="Disc."
        align="center"
        width="60"
      />
      <el-table-column
        prop="discount"
        label="Disc%"
        align="center"
        width="70"
      />
      <el-table-column prop="vat" label="VAT" align="center" width="50" />
      <el-table-column
        prop="total"
        label="Total"
        align="right"
        width="100"
        sortable
        :formatter="totalFormat"
        show-overflow-tooltip
      />
      <el-table-column
        prop="contact"
        label="Contact"
        align="left"
        width="175"
        sortable
        show-overflow-tooltip
      />
      <el-table-column
        prop="company"
        label="Company"
        align="left"
        width="175"
        sortable
        show-overflow-tooltip
      />
      <el-table-column
        prop="category"
        label="Cat."
        align="center"
        sortable
        width="80"
      />
      <el-table-column
        prop="owner"
        label="Owner"
        align="center"
        sortable
        width="100"
      />

      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="scope">
          <router-link
            target="_blank"
            :to="'/quote/list/edit/' + scope.row.quoteNumber"
          >
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
      <router-link :to="'/quote/new'">
        <el-button type="success">Add</el-button>
      </router-link>
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
      pickerOptions: {
        shortcuts: [
          {
            text: "Last 30 days",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "Last 6 months",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 6);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "Last 1 year",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 50,
        keyWords: "",
        orderBy: "",
        start: "",
        end: "",
      },
      dateRange: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.list = [];
      fetchList(this.listQuery).then((response) => {
        this.list = response.data.items;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    // handleAdd() {
    //   this.resetTemp();
    //   this.dialogStatus = "Create";
    //   this.dialogFormVisible = true;
    // },
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
          this.delQuote(row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Canceled",
          });
        });
    },
    async delQuote(row) {
      await deleteQuote(row);
      this.$message({
        type: "success",
        message: "Deleted!",
      });
      this.getList();
    },
    totalFormat(row, column, cellValue) {
      //console.log('totalFormat')
      cellValue = parseFloat(cellValue).toFixed(2);
      cellValue += "";
      if (!cellValue.includes(".")) cellValue += ".";

      return cellValue
        .replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
          return $1 + ",";
        })
        .replace(/\.$/, "");
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleAll() {
      this.listQuery = {
        page: 1,
        limit: 50,
        keyWords: "",
        orderBy: "",
        start: "",
        end: "",
      };
      this.dateRange=[];
      this.getList();
    },
    dateSelection() {
      this.listQuery.start = this.dateRange[0];
      this.listQuery.end = this.dateRange[1];
      this.getList();
      console.log(this.dateRange);
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
  