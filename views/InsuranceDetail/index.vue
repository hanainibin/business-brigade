<template>
  <ul>
    <li class="insurance"   v-for="item in this.insuranceQuery.insurance" :key="item.index" v-html="item.insuranceDesc">
    </li>
  </ul>
</template>

<script>
import { getStore } from "@/util/store";
  export default {
    beforeCreate () {
      this.insuranceQuery = getStore({
        name: "insuranceQuery"
      })
    }
  }
</script>

<style lang="less" scoped>
  .insurance{
    // 
    padding-left: 250px;
    padding-top: 20px;
    background: white;
    border-bottom: 0.5px solid gray;
    border-top: 0.5px solid gray;
  }
</style>
