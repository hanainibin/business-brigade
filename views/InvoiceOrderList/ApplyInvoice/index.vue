<template>
  <div class="apply-invoice-wrapper">
    <div class="apply-invoice-content">
      <div class="apply-type-cover">
        <span class="apply-type">类型</span>
        <el-radio v-model="applyData" label="PersonalInvoice">个人</el-radio>
        <el-radio v-model="applyData" label="CompanyInvoice">公司</el-radio>
      </div>
      <component :is="applyData" :invoiceMoney="parseInt($route.query.invoiceMoney)"
                 :orderIds="$route.query.orderIds" :initialInvoiceInfo="initialInvoiceInfo"></component>
    </div>
  </div>
</template>

<script>
import PersonalInvoice from './PersonalInvoice'
import CompanyInvoice from './CompanyInvoice'
import { autoQueryInvoiceInfo } from '@/api/invoice.js'
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'ApplyInvoice',
  components: {
    PersonalInvoice,
    CompanyInvoice
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      applyData: 'PersonalInvoice',
      initialInvoiceInfo: {
        dutyNo: '',
        invoiceRecivePhone: '',
        invoiceTitle: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'accountId'
    ])
  },
  watch: {
    accountId(value) {
      if(value) {//退出登录时不请求接口
        this.getInvoiceInfo()
      } else {
        this.$router.push('/')
      }
    }
  },
  created() {
    if(!this.userInfo.status){
      this.setState({
        key: 'dialogLoginVisible',
        value: true,
        module: 'user'
      })
    } else if(this.accountId.length > 0) {
      this.getInvoiceInfo()
    }
  },
  methods: {
    ...mapMutations([ 'setState' ]),
    getInvoiceInfo() {
      autoQueryInvoiceInfo({
        userId: this.accountId
      }).then(res => {
        if(res.data.code === 0){
          this.initialInvoiceInfo.invoiceTitle = res.data.data.invoiceTitle
          this.initialInvoiceInfo.invoiceRecivePhone = res.data.data.invoiceRecivePhone
          this.initialInvoiceInfo.dutyNo = res.data.data.dutyNo
        }else{
          if (res.data.msg) {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .apply-invoice-wrapper{
    width: 100%;
    .apply-invoice-content{
      width: 1180px;
      margin: 0 auto;
      padding: 30px 0;
      font-size: 14px;
      .apply-type-cover{
        margin-bottom: 22px;
        .apply-type{
          display: inline-block;
          width: 80px;
          padding: 13px 15px;
        }
      }
    }
  }
</style>
