<template>
  <div class="company-long">
    <img src="@/assets/companyLong_bg.png" alt="" class="company-long-bg">
    <div class="company-long-wrapper">
      <img src="@/assets/companyLong_title.png" alt="" class="company-long-title" @click="showLongRoom()"/>
      <div class="company-long-item">
        我们的优势
      </div>
      <div class="company-long-qrcode">
        微信扫码下单
        <img src="@/assets/companyFair_qrcode.png" alt="" class="company-long-code"/>
      </div>
    </div>
  </div>
</template>

<script>
	import { mapMutations } from 'vuex';

  export default {
    name: 'CompanyLong',
    methods: {
			...mapMutations(['setState']),
			showLongRoom() {
				console.log('点击');
				this.setState({
					key: 'showLongRoom',
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