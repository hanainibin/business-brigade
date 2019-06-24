<template>
  <div class="company-fair">
    <img src="@/assets/companyFair_bg.png" alt="" class="company-fair-bg">
    <div class="company-fair-wrapper">
      <img src="@/assets/companyFair_title.png" alt="" class="company-fair-title" @click="showForm()"/>
      <div class="company-fair-item">
        我们的优势
      </div>
      <div class="company-fair-qrcode">
        微信扫码下单
        <img src="@/assets/companyFair_qrcode.png" alt="" class="company-fair-code"/>
      </div>
    </div>
  </div>
</template>

<script>
	import { mapMutations } from 'vuex';

  export default {
    name: 'CompanyFair',
    methods: {
			...mapMutations(['setState']),
			showForm() {
				this.setState({
					key: 'showForm',
					module: 'common',
					value: true
				});
      }
    }
  }
</script>
<style lang="less">
  @import './style.less';
</style>