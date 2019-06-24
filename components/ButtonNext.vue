<template>
  <button v-on:click="clickEvent" class="button-next">{{buttonText}}</button>
</template>

<script>
export default {
  name:'ButtonNext',
  props: {
    buttonText: String,
    clickEvent: Function
  }
}
</script>

<style lang="less" scoped>
.button-next{
  width: 200px;
  height: 40px;
  line-height: 40px;
  background-color: #4a90e2;
  color: #fff;
  text-align: center;
  border: none;
  font-size: 14px;
  border-radius: 2px;
  cursor: pointer;
  opacity: 0.9;
  padding: 0 18px;
  &:hover{
    opacity: 0.8;
  }
}
</style>
