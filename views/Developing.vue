<template>
  <div class="tenzont-developing-box">
    <div class="tenzont-developing">
      <img src="@/assets/developing.png" alt="">
      <p>产品正在披星戴月开发中，敬请期待</p>
      <ButtonNext :button-text="buttonText" :clickEvent="goHome"/>
    </div>
  </div>
</template>

<script>
import ButtonNext from '@/components/ButtonNext.vue'

export default {
  name: 'Developing',
  components: {
    ButtonNext
  },
  data() {
    return {
      buttonText: '返回首页'
    }
  },
  methods: {
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="less" scoped>
.tenzont-developing-box{
  height: 419px;
  .tenzont-developing{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    p{
      color: #58565d;
      font-size: 15px;
      margin: 8px 0 15px 0;
    }
    button{
      width: 180px;
    }
  }
}

</style>
