<template>
  <div class="not-found-component">
    <div>
      <span>正在制作...</span>
      <button class="not-found-back" @click="goBack">返回</button>
    </div>
    <div>
      也可能页面连接更改了，请按 F5 键刷新整个页面看看，特别是菜单 ！
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFoundComponent',
  methods: {
    goBack() {
      history.back()
    }
  }
}
</script>

<style lang="less" scoped>
  .not-found-component{
    padding: 10px;
    .not-found-back{
      border: none;
      background-color: #fff;
      color: blue;
      font-size: 15px;
      outline: none;
      cursor: pointer;
    }
  }
</style>
