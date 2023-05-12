<template>
  <div>
    <!-- Table -->
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <!-- :default-sort = "{prop: 'category', order: 'ascending'}" -->
      <el-table-column align="center" label="ID" width="65" sortable prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="Category"
        width="110"
        sortable
        prop="category"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.category }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="Product"
        width="120px"
        sortable
        prop="productname"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.productname }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="Price"
        width="80px"
        sortable
        prop="price"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="Currency"
        width="110px"
        sortable
        prop="currency"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.currency }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="250px" label="Quote text">
        <template slot-scope="{ row }">
          <span>{{ row.quotetext }}</span>
          <!-- <router-link :to="'/product/edit/' + row.id" class="link-type">
            <span>{{ row.quotetext }}</span>
          </router-link> -->
        </template>
      </el-table-column>

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
            @click="handleEdit(row)"
          />
        </template>
      </el-table-column>
    </el-table>

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
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import {
  fetchList,
  fetchLastId,
  addProduct,
  editProduct,
  deleteProduct,
  getAllProducts,
} from "@/api/product";

export default {
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
  components: { Pagination },
  props: {
    type: {
      type: String,
      default: "CN",
    },
    default:[]
  },
  data() {
    return {
      list: null,
      listQuery: {
        page: 1,
        limit: 20,
        type: "ALL"
      },
      total: 1,
      loading: false,
    };
  },
  watch: {
    allProduct(newnumber, oldnumber) {
      this.list = this.allProduct;
    },
  },
  created() {
    //this.getList();
    //console.log(this.allProduct)
    //this.list = this.allProduct
    console.log(this.type)
    this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      this.listQuery.type = this.type;
      const response = await fetchList(this.listQuery);
      console.log(response)
      this.list = response.data.items;
      this.total = response.data.total;
      this.listLoading = false;
    },    
  },
};
</script>