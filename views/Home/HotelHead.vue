<template>
  <div class="hotel-show-head">
    <span class="hotel-show-title">{{hotelHead.title}}</span>
    <span class="hotel-show-desc">{{hotelHead.desc}}</span>
  </div>
</template>

<script>
export default {
    name: 'HotelHead',
    props: {
        hotelHead: Object
    }
}
</script>

<style lang="less" scoped>
    .hotel-show-head{
        padding-bottom: 20px;
        .hotel-show-title{
            font-size: 30px;
            font-weight: 700;
            color: #283c53;
        }
        .hotel-show-desc{
            font-size: 20px;
            color: #70889b;
            font-weight: 500;
            padding-left: 20px;
        }
    }
</style>
