<template>
  <div class="standard-type-wrapper">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="酒店标准" name="first">
        <HotelStandard/>
      </el-tab-pane>
      <el-tab-pane label="机票标准" name="second">
        <TicketStandard/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import HotelStandard from './HotelStandard'
import TicketStandard from './TicketStandard'

export default {
  name: 'StandardType',
  components: {
    HotelStandard,
    TicketStandard
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  beforeRouteLeave(to, from, next) {
    const answer = window.confirm('请确保本页面所有修改已保存，否则将丢失修改，是否继续？')
    if (answer) {
      next()
    } else {
      next(false)
    }
  },
  created() {
    if (this.$route.query.activeName === 'second') {
      this.activeName = 'second'
    }
  }
}
</script>

<style lang="less">
.standard-type-wrapper{
  width: 1180px;
  margin: 0 auto;
  padding-top: 40px;
  border-top: 0.5px solid #e6e6e6;
}
</style>
