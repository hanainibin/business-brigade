<template>
  <el-form class="company-invoice" :model="companyData" :rules="ruleForm" ref="companyForm" v-loading="loading">
    <el-form-item label="开票金额">
      <span>￥{{invoiceMoney}}.00</span>
    </el-form-item>
    <el-form-item label="搜索企业">
      <div class="select-wrapper">
        <el-input @click.native="handleClick" class="input-value" placeholder="请输入关键字" v-model="inputValue"
                  ref="inputRef"/>
        <el-select class="selectbox" v-model="selectTitle" placeholder="请选择" @change="handleChange">
          <el-option
            v-for="(item,index) in selectOptions"
            :key="index"
            :label="item.invoiceTitle"
            :value="index">
          </el-option>
        </el-select>
      </div>
      <el-button class="company-search-btn" type="primary" @click="handleSearch">搜索</el-button>
    </el-form-item>
    <el-form-item label="发票抬头" prop="invoiceTitle">
      <el-input v-model="companyData.invoiceTitle"></el-input>
    </el-form-item>
    <el-form-item label="税号" prop="dutyNo">
      <el-input v-model="companyData.dutyNo" maxlength="20"></el-input>
    </el-form-item>
    <el-form-item label="手机号码" prop="revicePhone">
      <el-input v-model="companyData.revicePhone" type="tel" maxlength="11" @blur="handleBlur"
                onKeypress="if (event.key !== 'Backspace') { return (/[\d]/.test(String.fromCharCode(event.keyCode || event.charCode))) }"></el-input>
    </el-form-item>
    <p class="apply-phone-tip">*手机号码用于接收开票短信，请核对正确</p>
    <el-form-item class="company-btn-group">
      <el-button type="primary" @click="handleSubmit">立即提交</el-button>
      <el-button type="primary" @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { applyInvoice, queryEntInfo } from '@/api/invoice.js'
import { mapGetters } from 'vuex'
import { isPhoneAvailable } from '@/util/validate.js'

export default {
  props: {
    invoiceMoney: Number,
    orderIds: String,
    initialInvoiceInfo: Object
  },
  data() {
    return {
      companyData: {
        invoiceMoney: this.invoiceMoney,
        orderIds: this.orderIds,
        invoiceTitle: '',
        dutyNo: '',
        revicePhone: ''
      },
      ruleForm: {
        invoiceTitle: [
          { required: true, message: '请输入发票抬头', trigger: 'blur'}
        ],
        dutyNo: [
          { required: true, message: '请输入公司税号', trigger: 'blur'},
          { min: 15, max: 20, message: '请输入正确的税号', trigger: 'blur' }
        ],
        revicePhone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入正确的手机号码', trigger: 'blur' }
        ]
      },
      inputValue: '',
      selectOptions: [],
      selectTitle: '',
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'accountId', 'accountType'
    ])
  },
  mounted() {
    if(this.initialInvoiceInfo.dutyNo) {
      this.companyData.invoiceTitle = this.initialInvoiceInfo.invoiceTitle
      this.companyData.revicePhone = this.initialInvoiceInfo.invoiceRecivePhone
      this.companyData.dutyNo = this.initialInvoiceInfo.dutyNo
    }
  },
  methods: {
    handleBlur() {
      if(!isPhoneAvailable(this.companyData.revicePhone)){
        this.$message.error('请输入正确手机号码')
      }
    },
    handleChange(val) {
      this.companyData.invoiceTitle = this.selectOptions[val].invoiceTitle
      this.companyData.dutyNo = this.selectOptions[val].dutyNo
      this.inputValue = this.selectOptions[val].invoiceTitle
    },
    handleSearch() {
      if(!this.inputValue) return
      queryEntInfo({
        invoiceTitle: this.inputValue,
        userId: this.accountId
      }).then(res => {
        if(res.data.code === 0){
          this.selectOptions = res.data.data.data
          let selectbox = document.getElementsByClassName('selectbox')[0]
          if (selectbox.fireEvent){
            selectbox.fireEvent('onclick')
          }else{
            let ev = document.createEvent("HTMLEvents")
            ev.initEvent("click", false, true)
            selectbox.dispatchEvent(ev)
          }
        }else{
          if (res.data.msg) {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        }
      })
    },
    handleClick() {
      let selectbox = document.getElementsByClassName('selectbox')[0]
      if (selectbox.fireEvent){
        selectbox.fireEvent('onclick')
      }
      else{
        let ev = document.createEvent("HTMLEvents") 
        ev.initEvent("click", false, true)
        selectbox.dispatchEvent(ev)
      }
      this.$refs.inputRef.focus()
    },
    handleSubmit() {
      this.$refs.companyForm.validate((valid) => {
        if(valid) {
          this.loading = true
          applyInvoice({
            ...this.companyData,
            userId: this.accountId,
            userType: 0,
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
      this.$refs.companyForm.resetFields()
    }
  }
}
</script>

<style lang="less">
.company-invoice{
  .el-form-item{
    .select-wrapper{
      position: relative;
      width: 217px;
      float: left;
      height: 40px;
      .input-value{
        width: 217px;
        position: absolute;
        z-index: 1;
      }
      .el-select {
        width: 217px;
      }
    }
    .company-search-btn{
      margin-left: 15px;
    }
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
  .company-btn-group{
    padding: 20px 0 0 110px;
  }
}
</style>
