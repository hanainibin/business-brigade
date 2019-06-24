<template>
  <el-pagination
    class="table-pagination"
    :current-page="currentPage"
    layout="prev, pager, next, jumper"
    :total="tableCount"
    background
    @current-change="toThisPage"
    v-if="tableCount > 0"/>
</template>

<script>
export default {
  name: 'TablePagination',
  props: {
    tableCount: {
      type: Number,
      required: true
    },
    getList: {
      type: Function,
      required: true
    },
    pageIndex: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      currentPage: 1
    }
  },
  watch: {
    pageIndex (val) {
      this.currentPage = val
    }
  },
  methods: {
    toThisPage(val) {
      this.getList({
        page: val
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .table-pagination{
    padding: 10px 0;
    text-align: right;
  }
</style>

