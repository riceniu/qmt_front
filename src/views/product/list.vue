<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="55">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="Category" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.category }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="Product">
        <template slot-scope="scope">
          <span>{{ scope.row.productname }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="Price">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="Currency">
        <template slot-scope="scope">
          <span>{{ scope.row.currency }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column class-name="status-col" label="Status" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column> -->

      <el-table-column min-width="300px" label="Quote text">
        <template slot-scope="{row}">
          <router-link :to="'/product/edit/'+row.id" class="link-type">
            <span>{{ row.quote_text }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="scope">
          <router-link :to="'/product/edit/'+scope.row.id">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(row)"/>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleUpdate(row)"/>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
  
</template>

<script>
import { fetchList } from '@/api/product'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ProductList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    }
  }
}
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
