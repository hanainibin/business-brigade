<template>
  <div class="switch-cover" @click="toggleClassName" :class="switchOn ? '' : 'switch-disabled'">
    <span class="switch-text">{{btnText}}</span>
    <span class="switch-icon" :class="iconPositon"></span>
  </div>
</template>

<script>
export default {
  props: {
    btnText: {
      type: String,
      required: true
    },
    switchOn: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      switchBoolean: true,
      iconPositonArr: [
        '',
        'icon-position-1',
        '',
        'icon-position-3',
        'icon-position-4'
      ],
      iconPositon: ''
    }
  },
  created() {
    this.iconPositon = this.iconPositonArr[this.btnText.length]
    this.switchBoolean = this.switchOn
  },
  methods: {
    toggleClassName() {
      this.switchBoolean = !this.switchBoolean
      this.$emit('switchBoolean', this.switchBoolean)
    }
  }
}
</script>

<style lang="less" scoped>
  .switch-cover{
    display: inline-block;
    position: relative;
    padding: 3px 22px 3px 11px;
    background-color: #009ced;
    color: #fff;
    border-radius: 20px;
    line-height: 1;
    box-sizing: border-box;
    cursor: pointer;
    transition: all .3s;
    margin-right: 20px;
    -moz-user-select: none; 
    -o-user-select:none; 
    -khtml-user-select:none; 
    -webkit-user-select:none; 
    -ms-user-select:none; 
    user-select:none;
    outline: none;
    .switch-text{
      font-size: 15px;
    }
    .switch-icon{
      position: absolute;
      display: inline-block;
      width: 14px;
      height: 14px;
      background-color: #fff;
      top: 48%;
      transform: translateY(-50%);
      right: 5px;
      left: 71%;
      border-radius: 50%;
      transition: all .3s;
    }
    .icon-position-1{
      left: 63%;
    }
    .icon-position-3{
      left: 79%;
    }
    .icon-position-4{
      left: 81%;
    }
  }
  .switch-disabled{
    background-color: #ddd;
    padding: 3px 11px 3px 22px;
    .switch-icon{
      right: 0;
      left: 5px;
    }
    .icon-position-1{
      left: 5px;
    }
    .icon-position-3{
      left: 5px;
    }
    .icon-position-4{
      left: 5px;
    }
  }
</style>

