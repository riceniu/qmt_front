<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row
        ><el-input
          v-model="listQuery.keyWords"
          placeholder="Search QuoteNumber/company/contact"
          style="width: 300px"
          @input="handleFilter"
        />
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="to"
          start-placeholder="Start"
          end-placeholder="End"
          :picker-options="pickerOptions"
          @change="dateSelection"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
        <el-cascader
          :options="optionsSales"
          :props="props"
          collapse-tags
          clearable
          placeholder="Sales"
          @change="handleSalesChange"
        ></el-cascader>
      </el-row>
      <el-row>
        <el-col :span="10">
          <div class="block">
            <el-cascader
              ref="regionOption"
              :options="optionsCountry"
              :props="props"
              collapse-tags
              clearable
              placeholder="Region & country"
              @focus="fetchOptionsCountry"
              @change="handelCountryChange"
            ></el-cascader>
            <el-cascader
              ref="catOption"
              :options="optionsCategory"
              :props="props"
              collapse-tags
              clearable
              placeholder="Category & product"
              @change="handelCategoryChange"
            ></el-cascader>
            <el-cascader
              :options="optionsStage"
              :props="props"
              collapse-tags
              clearable
              placeholder="Deal stage"
              @change="handelStageChange"
            ></el-cascader>
          </div>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">
            Search
          </el-button>
          <router-link :to="'/quote/new'">
            <el-button
              style="margin-left: 10px"
              type="primary"
              icon="el-icon-edit"
            >
              Add
            </el-button></router-link
          >
          <el-button
            style="margin-left: 10px"
            type="primary"
            @click="handleAll"
          >
            Clear filter
          </el-button></el-col
        >
      </el-row>
      <!-- <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select> -->
    </div>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
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
        ><template slot-scope="scope"
          ><router-link
            :to="'/quote/list/edit/' + scope.row.quoteNumber"
          >{{ scope.row.quoteNumber }}</router-link></template
      ></el-table-column>
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
        prop="stage"
        label="Stage"
        align="left"
        width="100"
        sortable
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
        prop="region"
        label="Region"
        align="left"
        width="120"
        sortable
        show-overflow-tooltip
      />
      <el-table-column
        prop="country"
        label="Country"
        align="left"
        width="120"
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

      <el-table-column align="center" label="Actions" width="180">
        <template slot-scope="scope">
          <!-- target="_blank" -->
          <router-link :to="'/quote/list/edit/' + scope.row.quoteNumber">
            <el-tooltip content="Edit" placement="top-end">
              <el-button type="primary" icon="el-icon-edit" size="mini" />
            </el-tooltip>
          </router-link>
          <router-link :to="'/quote/print/' + scope.row.quoteNumber">
            <el-tooltip content="Print" placement="top-end">
              <el-button type="success" icon="el-icon-printer" size="mini" />
            </el-tooltip>
          </router-link>
          <el-tooltip content="Delete" placement="top-end"
            ><el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="handleDelete(scope.row)"
          /></el-tooltip>
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
import { fetchList, deleteQuote, optionsCountry } from "@/api/quote";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "ProductList",
  components: { Pagination },
  data() {
    return {
      //filter related parameters
      props: { multiple: true },
      optionsCountry: [],
      optionsSales: [
        { value: "Diane", label: "Diane" },
        { value: "Bill", label: "Bill" },
        { value: "Rafik", label: "Rafik" },
        { value: "Tarek", label: "Tarek" },
        { value: "Syed", label: "Syed" },
      ],
      optionsCategory: [
        {
          value: "CFL",
          label: "CFL",
          children: [
            {
              value: "CFL-set",
              label: "CFL-set",
              children: [
                { value: "T-305E", label: "T-305E" },
                { value: "T-506", label: "T-506" },
                { value: "T-907", label: "T-907" },
              ],
            },
            {
              value: "T-P2x",
              label: "T-P2x",
              children: [
                { value: "T-P22", label: "T-P22" },
                { value: "T-P23", label: "T-P23" },
                { value: "Accesories", label: "Accesories" },
              ],
            },
          ],
        },
        {
          value: "PU",
          label: "PU",
          children: [
            { value: "TWFL", label: "TWFL" },
            { value: "FTR", label: "FTR" },
            { value: "GPS", label: "GPS" },
          ],
        },
        { value: "DA", label: "DA" },
        {
          value: "MOTOR",
          label: "MOTOR",
          children: [
            { value: "SRD", label: "SRD" },
            { value: "SyRM", label: "SyRM" },
          ],
        },
      ],
      optionsStage: [
        { value: "Win", label: "Win" },
        { value: "Lost", label: "Lost" },
        { value: "Quotation sent", label: "Quotation sent" },
      ],
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
        owner: "",
        stage: "",
        product: "",
        region: "",
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
        owner: "",
        stage: "",
        product: "",
        region: "",
      };
      this.dateRange = [];
      this.getList();
    },
    dateSelection() {
      if (this.dateRange) {
        this.listQuery.start = this.dateRange[0];
        this.listQuery.end = this.dateRange[1];
      } else {
        this.listQuery.start = "";
        this.listQuery.end = "";
      }
      this.getList();
      //console.log(this.dateRange);
    },
    //fetch filter options
    async fetchOptionsCountry() {
      const res = await optionsCountry();
      let area = res.data;

      for (let key in area) {
        //console.log(key,area[key])
        this.optionsCountry.push({ label: key, value: key, children: [] });
        let countries = [];
        for (let country of area[key]) {
          countries.push({
            label: country,
            value: country,
          });
        }
        this.optionsCountry[this.optionsCountry.length - 1].children = [
          ...countries,
        ];
      }
      console.log(this.optionsCountry);
      //console.log(res.data);
      //this.optionsCountry
    },
    //handle filter
    handelCountryChange(val) {
      this.listQuery.region = val.toString();
      this.getList();
      console.log(val);
    },
    handelCategoryChange() {
      //console.log(this.$refs.catOption.getCheckedNodes().map(v=>v.value));
      this.listQuery.product = this.$refs.catOption
        .getCheckedNodes()
        .map((v) => v.value)
        .toString();
      console.log(this.listQuery.product);
      this.getList();
    },
    handelStageChange(val) {
      this.listQuery.stage = val.toString();
      this.getList();
      console.log(val);
    },
    handleSalesChange(val) {
      this.listQuery.owner = val.toString();
      this.getList();
      console.log(val);
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
  