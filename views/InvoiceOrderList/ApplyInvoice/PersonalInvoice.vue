<template>
  <el-form class="personal-invoice" :model="personalData" :rules="ruleForm" ref="personalForm" v-loading="loading">
    <el-form-item label="开票金额">
      <span>￥{{invoiceMoney}}.00</span>
    </el-form-item>
    <el-form-item label="发票抬头" prop="invoiceTitle">
      <el-input v-model="personalData.invoiceTitle" placeholder="请输入发票抬头"></el-input>
    </el-form-item>
    <el-form-item label="手机号码" prop="revicePhone">
      <el-input v-model="personalData.revicePhone" type="tel" maxlength="11" placeholder="请输入手机号码"
                onKeypress="if (event.key !== 'Backspace') { return (/[\d]/.test(String.fromCharCode(event.keyCode || event.charCode))) }"></el-input>
    </el-form-item>
    <p class="apply-phone-tip">*手机号码用于接收开票短信，请核对正确</p>
    <el-form-item class="personal-btn-group">
      <el-button type="primary" @click="handleSubmit">立即提交</el-button>
      <el-button type="primary" @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { applyInvoice } from '@/api/invoice.js'
import { mapGetters } from 'vuex'
// import { isPhoneAvailable } from '@/util/validate.js'

export default {
  props: {
    invoiceMoney: Number,
    orderIds: String,
    initialInvoiceInfo: Object
  },
  data() {
    return {
      personalData: {
        invoiceMoney: this.invoiceMoney,
        orderIds: this.orderIds,
        invoiceTitle: '',
        revicePhone: ''
      },
      ruleForm: {
        invoiceTitle: [
          { required: true, message: '请输入发票抬头', trigger: 'blur'}
        ],
        revicePhone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入正确的手机号码', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'accountId', 'accountType'
    ])
  },
  mounted() {
    if(!this.initialInvoiceInfo.dutyNo) {
      this.personalData.invoiceTitle = this.initialInvoiceInfo.invoiceTitle
      this.personalData.revicePhone = this.initialInvoiceInfo.invoiceRecivePhone
    }
  },
  methods: {
  //   handleBlur() {
  //     if(!isPhoneAvailable(this.personalData.revicePhone)){
  //       this.$message.error('请输入正确手机号码')
  //     }
  //   },
    handleSubmit() {
      this.$refs.personalForm.validate((valid) => {
        if(valid) {
          this.loading = true
          applyInvoice({
            ...this.personalData,
            userId: this.accountId,
            userType: 1,
            invoiceType: 0
          }).then(res => {
            this.loading = false
            if(res.data.code === 0){
              this.$router.push({ name: 'InvoiceRecords'})
            }else{
              if (res.data.msg) {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            }
          })
        }else{
          return false
        }
      })
    },
    resetForm() {
      this.$refs.personalForm.resetFields()
    }
  }
}
</script>

<style lang="less">
  .personal-invoice{
    .el-form-item{
      label{
        display: inline-block;
        width: 110px;
        padding: 13px 15px;
        text-align: left;
        height: 40px;
        line-height: 1;
      }
      .el-form-item__content{
        float: left;
        width: 400px;
      }
    }
    .el-form-item.is-required{
      label{
        padding: 13px 4px;
      }
    }
    .apply-phone-tip{
      padding-left: 110px;
      color: #f00;
    }
    .personal-btn-group{
      padding: 20px 0 0 110px;
    }
  }
</style>

