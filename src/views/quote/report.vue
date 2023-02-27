<template>
  <el-form
    :model="formData"
    ref="vForm"
    :rules="rules"
    label-position="left"
    label-width="150px"
    size="medium"
    @submit.native.prevent
  >
    <el-row style="margin-bottom: 0">
      <el-col :span="4" :offset="20">
        <div class="block" :key="fit">
          <span class="demonstration">{{ fit }}</span>
          <el-image
            style="width: 100px; height: 100px; margin-bottom: 2px"
            :src="url"
            :fit="fill"
          ></el-image>
        </div>
      </el-col>
    </el-row>
    <el-divider
      direction="horizontal"
      style="margin-top: 2 px; margin-bottom: 2px"
    ></el-divider>
    <div class="static-content-item"></div>
    <el-row>
      <el-col :span="12">
        <el-form-item label="Quotation No.:" prop="quote_number">
          <span style="font-weight: bold">{{ quote.quote_number }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="4" :offset="6" align="right">
        <span align="right">Date: {{ quote.quote_date }}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" class="grid-cell">
        <el-form-item
          label="购买客户"
          prop="input95851"
          class="label-right-align"
        >
          <el-input
            v-model="formData.input95851"
            readonly="true"
            type="text"
            clearable
            ><template #append>
              <el-button class="el-icon-search"></el-button> </template
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="grid-cell">
        <el-form-item
          label="下单日期"
          prop="date75919"
          class="label-right-align"
        >
          <el-date-picker
            v-model="formData.date75919"
            type="date"
            class="full-width-input"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            clearable
          ></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" class="grid-cell">
        <el-form-item
          label="支付方式"
          prop="select71837"
          class="label-right-align"
        >
          <el-select
            v-model="formData.select71837"
            class="full-width-input"
            clearable
          >
            <el-option
              v-for="(item, index) in select71837Options"
              :key="index"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="grid-cell">
        <el-form-item
          label="是否需要发票"
          prop="switch35050"
          class="label-right-align"
        >
          <el-switch
            v-model="formData.switch35050"
            active-text="需要"
            inactive-text="不需要"
          ></el-switch>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" class="grid-cell">
        <el-form-item
          label="物流快递"
          prop="select78072"
          class="label-right-align"
        >
          <el-select
            v-model="formData.select78072"
            class="full-width-input"
            clearable
          >
            <el-option
              v-for="(item, index) in select78072Options"
              :key="index"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="grid-cell">
        <el-form-item
          label="收货地址"
          prop="input20247"
          class="label-right-align"
        >
          <el-input
            v-model="formData.input20247"
            type="text"
            clearable
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <div class="card-container">
      <el-card
      >
        <div slot="header" class="clear-fix">
          <span>订单明细</span>
          <el-form-item>
            <el-form>
              <el-form-item
                label="东西"
                prop="select27919"
                class="label-right-align"
              >
                <el-select
                  v-model="formData.select27919"
                  class="full-width-input"
                  clearable
                >
                  <el-option
                    v-for="(item, index) in select27919Options"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-form-item>
        </div>
      </el-card>
    </div>
    <el-row>
      <el-col :span="12" class="grid-cell">
        <el-form-item
          label="累计金额"
          prop="number97501"
          class="label-right-align"
        >
          <el-input-number
            v-model="formData.number97501"
            class="full-width-input"
            :disabled="true"
            controls-position="right"
            :min="-100000000000"
            :max="100000000000"
            :precision="2"
            :step="1"
          >
          </el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="grid-cell">
        <el-form-item
          label="优惠金额"
          prop="number88459"
          class="label-right-align"
        >
          <el-input-number
            v-model="formData.number88459"
            class="full-width-input"
            controls-position="right"
            :min="-100000000000"
            :max="100000000000"
            :precision="2"
            :step="1"
          ></el-input-number>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" class="grid-cell">
        <el-form-item
          label="实付金额"
          prop="number27788"
          class="label-right-align"
        >
          <el-input-number
            v-model="formData.number27788"
            class="full-width-input"
            controls-position="right"
            :min="-100000000000"
            :max="100000000000"
            :precision="2"
            :step="1"
          ></el-input-number>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
  
  <script>
export default {
  components: {},
  props: {},
  data() {
    return {
      fits: ["fill", "contain", "cover", "none", "scale-down"],
      url: "https://kehui.wpenginepowered.com/wp-content/uploads/2018/08/kehuilogo2.svg",
      formData: {
        input101987: "",
        input95851: "",
        date75919: null,
        select71837: "",
        switch35050: false,
        select78072: "",
        input20247: "",
        select27919: "",
        input37637: "",
        number36803: 0,
        number10017: 0,
        number9464: 0,
        number97501: 0,
        number88459: 0,
        number27788: 0,
      },
      quote: {
        quote_number: "KHI-2202158",
        quote_date: "2022-02-28",
        contact: "Mr CCD McDonalds",
        company: "JinGongMen",
        greeting:
          "Thank you for your enquiry. Please find below our quotation as requested.",
        items: [
          {
            index: "1",
            quote_text: `T-305E High Voltage Surge Generator 
T-305E High Voltage Surge Generator (with SIM Filter built in) including grounding nail, power cable, discharge rod and lead. 3 steps output voltage, 0-8kV, 0-16kV and 0-32kV, 2048 Joules for each step, built-in capacitor. 30M cable and reel.`,
            quantity: "1",
            price: "17500",
          },
          {
            index: "2",
            quote_text: `T-906 Automatic Power Cable Fault Location System
Cable Fault Location Equipment (Pre-location)
64km range, ICM/TDR/MIM modes, 8.4-inch (213mm) colour TFT LCD display, touch screen operation
`,
            quantity: "1",
            price: "7000",
          },
        ],
        subtotal: "24500",
        discount: "0.2",
        discount_direct: "0",
        vat: "0",
        currency: "USD",
        payment: "100% prepayment",
      },
      rules: {},
      select71837Options: [
        {
          value: "1",
          label: "微信",
        },
        {
          value: "2",
          label: "支付宝",
        },
        {
          value: "3",
          label: "其他",
        },
      ],
      select78072Options: [
        {
          value: "1",
          label: "中国邮政",
        },
        {
          value: "2",
          label: "顺丰",
        },
        {
          value: "3",
          label: "申通",
        },
        {
          value: "4",
          label: "中通",
        },
        {
          value: "5",
          label: "韵达",
        },
      ],
      select27919Options: [
        {
          value: "p1",
          label: "苹果",
        },
        {
          value: "p2",
          label: "菠萝",
        },
        {
          value: "p3",
          label: "荔枝",
        },
      ],
    };
  },
  computed: {},
  watch: {},
  created() {
    // ()=>{this.input101987 = window.location.href}
  },
  mounted() {},
  methods: {
    submitForm() {
      this.$refs["vForm"].validate((valid) => {
        if (!valid) return;
        //TODO: 提交表单
      });
    },
    resetForm() {
      this.$refs["vForm"].resetFields();
    },
  },
};
</script>
  
  <style lang="scss">
.el-input-number.full-width-input,
.el-cascader.full-width-input {
  width: 100% !important;
}

.el-form-item--medium {
  .el-radio {
    line-height: 36px !important;
  }

  .el-rate {
    margin-top: 8px;
  }
}

.el-form-item--small {
  .el-radio {
    line-height: 32px !important;
  }

  .el-rate {
    margin-top: 6px;
  }
}

.el-form-item--mini {
  .el-radio {
    line-height: 28px !important;
  }

  .el-rate {
    margin-top: 4px;
  }
}

.clear-fix:before,
.clear-fix:after {
  display: table;
  content: "";
}

.clear-fix:after {
  clear: both;
}

.float-right {
  float: right;
}
</style>
  
  <style lang="scss" scoped>
div.table-container {
  table.table-layout {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;

    td.table-cell {
      display: table-cell;
      height: 36px;
      border: 1px solid #e1e2e3;
    }
  }
}

div.tab-container {
}

.label-left-align ::v-deep .el-form-item__label {
  text-align: left;
}

.label-center-align ::v-deep .el-form-item__label {
  text-align: center;
}

.label-right-align ::v-deep .el-form-item__label {
  text-align: right;
}
.label-right-align.el-input__inner {
  border: 10;
}

.custom-label {
}
.borderless >>> el-input__inner {
  border: none;
}
.static-content-item {
  min-height: 20px;
  display: flex;
  align-items: center;

  ::v-deep .el-divider--horizontal {
    margin: 0;
  }
}
</style>