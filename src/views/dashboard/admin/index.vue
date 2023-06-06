<template>
  <div class="dashboard-editor-container">
    <!-- <github-corner class="github-corner" /> -->

    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <!-- <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row> -->

    <!-- <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import GithubCorner from "@/components/GithubCorner";
import PanelGroup from "./components/PanelGroup";
import LineChart from "./components/LineChart";
import RaddarChart from "./components/RaddarChart";
import PieChart from "./components/PieChart";
import BarChart from "./components/BarChart";
import TransactionTable from "./components/TransactionTable";
//import TodoList from './components/TodoList'
import BoxCard from "./components/BoxCard";

import { getReportData } from "@/api/quote";

const lineChartData = {

  quote: {
    Y2021: [15, 11, 16, 10, 7, 19, 15, 23, 13, 8, 23, 10],
    Y2022: [8, 7, 16, 12, 11, 18, 15, 17, 12, 20, 14, 9],
    Y2023: [null, null, null, null, 5, 13],
  },
  amount: {
    Y2021: [
      404374, 205549, 3649923, 3366388, 233306, 44236464, 1722861, 552459,
      638100, 172625, 476644.40002441406, 350843,
    ],
    Y2022: [
      149136, 80747, 496018.3984375, 202932, 198404, 265667, 203616, 1855309,
      174063, 461151, 127444, 63275,
    ],
    Y2023: [null, null, null, null, 28410, 144635],
  },
  upload: {
    Y2023: [null, null, null, null, 0, 2],
  },
};

export default {
  name: "DashboardAdmin",
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    // TodoList,
    BoxCard,
  },
  data() {
    return {
      lineChartData: lineChartData.quote,
      dataReceivor: {},
    };
  },
  created() {
    getReportData().then((res) => {
      console.log(res.data);
      this.lineChartData.quote = {};
      this.lineChartData.amount = {};
      this.lineChartData.upload = {};
      let myset = new Set();
      for (const item of res.data[0]) {
        myset.add(item.year);
      }
      for (const abc of myset) {
        this.lineChartData.quote["Y" + abc] = [];
      }
      for (const item of res.data[0]) {
        this.lineChartData.quote["Y" + item.year][item.month - 1] = item.quotes;
      }
      myset = new Set();
      for (const item of res.data[1]) {
        myset.add(item.year);
      }
      for (const abc of myset) {
        this.lineChartData.amount["Y" + abc] = [];
      }
      for (const item of res.data[1]) {
        this.lineChartData.amount["Y" + item.year][item.month - 1] = item.quote;
      }
      myset = new Set();
      for (const item of res.data[2]) {
        myset.add(item.year);
      }
      for (const abc of myset) {
        this.lineChartData.upload["Y" + abc] = [];
      }
      for (const item of res.data[2]) {
        this.lineChartData.upload["Y" + item.year][item.month - 1] =
          item.hubspot;
      }

      console.log(this.lineChartData);
    });
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type];
    },
    initialData(data, dest) {
      const myset = new Set();
      for (const item of res.data[0]) {
        myset.add(item.year);
      }
      for (const prop of myset) {
        dest.myset = [];
      }

      for (const item of data) {
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
