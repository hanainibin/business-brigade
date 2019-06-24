<template>
  <div class="mask" v-show="showMap">
    <div class="tenzont-map-box">
      <div class="map-head">
        地图详情
        <i class="el-icon-close" v-on:click="closeMap"/>
      </div>
      <div id="tenzont-map"/>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapGetters(['showMap'])
  },
  methods: {
    ...mapMutations(['setState']),
    closeMap () {
      this.setState({
        key: 'showMap',
        module: 'common',
        value: false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.mask {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 19;
}
.tenzont-map-box {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -350px;
  margin-top: -262.5px;
  width: 700px;
  height: 525px;
  border-radius: 3px;
  overflow: hidden;
}
#tenzont-map {
  width: 700px;
  height: 482px;
}
.map-head {
  height: 42px;
  border-bottom: 0.5px solid #eee;
  padding: 0 20px;
  background-color: #F8F8F8;
  line-height: 42px;
  i {
    cursor: pointer;
    float: right;
    margin-top: 13px;
  }
}
</style>
