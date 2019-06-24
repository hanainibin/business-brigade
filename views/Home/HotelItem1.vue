<template>
  <li class="hotel-show-item">
    <div @click="handleClick" class="hotel-show-item-content">
      <div class="show-item-top">
        <p class="tag-list">
          <span class="item-top-tag tag0">{{hotelTag}}</span>
          <span class="item-top-tag tag1">劲省{{parseInt(item.saves)}}元</span>
        </p>
        <!-- <span class="item-top-tag">{{hotelTag}}</span> -->
        <div class="item-top-img-cover">
          <img class="item-top-img" :src="formatSrc(item.imgUrl)" alt="">
        </div>
        <div class="item-top-cityArea-bg">
          <div class="item-top-cityArea">
            <span>{{item.cityName}}</span>
            <span class="item-top-line"/>
            <span>{{item.busiZone || "测试数据"}}</span>
          </div>
        </div>
      </div>
      <div class="show-item-bottom">
        <div class="item-bottom-hotelinfo">
          <h2 class="item-bottom-hotelname">{{item.hotelName}}</h2>
          <p class="item-bottom-address">{{item.address}}</p>
        </div>
        <div class="item-bottom-priceArea">
          <div class="item-bottom-price">
            <span class="bottom-price-rmb">¥</span>
            <span class="bottom-price-num">{{item.price}}</span>
            <span class="bottom-price-start">起</span>
          </div>
          <p class="item-bottom-tag">
            ¥
            <span>{{item.originalPrice}}</span>
            起
          </p>
          <!-- <p>¥{{item.price}}起</p> -->
        </div>
      </div>
    </div>
  </li>
</template>

<script>
import { dateFormat } from '@/util/lobal'
import { mapMutations, mapGetters } from 'vuex'
import { setStore } from '@/util/store'

export default {
  name: 'HotelItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    hotelTag: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      startDate: '',
      endDate: ''
    }
  },
  computed: {
    ...mapGetters([ 'accountId', 'timeOffset', 'wechatId' ])
  },
  created () {
    // if (new Date(Date.now() + this.timeOffset).getHours() >= 17) {
    //   this.startDateValue = new Date(Date.now() + this.timeOffset + 24 * 60 * 60 * 1000)
    // } else {
      this.startDateValue = new Date(Date.now() + this.timeOffset)
    // }
    this.startDate = dateFormat(this.startDateValue, 'yyyy-MM-dd')
    this.endDateValue = new Date(this.startDateValue.getTime() + 24 * 60 * 60 * 1000)
    this.endDate = dateFormat(this.endDateValue, 'yyyy-MM-dd')
  },
  methods: {
    ...mapMutations([ 'setState' ]),
    formatSrc (imgSrc, val) {
      if (!imgSrc && val) { 
        return require("@/assets/roomType_default.jpg")
      } else if(!imgSrc) {
        return require('@/assets/detail_default_hotel.jpg')
      }
      return `https://hotelpic-1254071088.file.myqcloud.com/hotel_pic/${imgSrc}.jpeg`
    },
    handleClick() {
      if(this.accountId.length <= 0){
        if (this.wechatId && this.wechatId.length > 0 && window.location.pathname.includes('/wxlogin')) {
          this.$store.state.user.bindMobileDialogVisible = true
        } else {
          this.setState({
            key: 'dialogLoginVisible',
            value: true,
            module: 'user'
          })
        }
      }else{
        setStore({
          name: 'HotelDetail',
          content: {
            hotelId: this.item.hotelId,
            startDate: this.startDate,
            endDate: this.endDate
          }
        })
        setTimeout(() => {
          this.$router.push({
            name: 'HotelDetail'
          })
        }, 100)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.hotel-show-item{
  display: inline-block;
  width: 33.33%;
  box-sizing: border-box;
  padding: 0 10px 10px 0;
  position: relative;
  cursor: pointer;
  
  .hotel-show-item-content{
    &:hover {
      box-shadow: 0 1px 4px rgba(0,0,0,.25);
      .item-top-img{
        transform: scale(1.05);
      }
    }
    .show-item-top{
      position: relative;
      .tag-list{
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        .item-top-tag{
          display: inline-block;
          color: #fff;
          padding: 3px 10px;
          font-size: 14px;
        }
        .tag0{
          background: linear-gradient(to right, #58A2FF 0%,#1982FF 100%); 
          background: -moz-linear-gradient(left, #58A2FF 0%, #1982FF 100%); 
          background: -webkit-gradient(linear, left, right, color-stop(0%,#58A2FF), color-stop(100%,#1982FF)); 
          background: -webkit-linear-gradient(left, #58A2FF 0%,#1982FF 100%); 
          background: -o-linear-gradient(left, #58A2FF 0%,#1982FF 100%); 
          background: -ms-linear-gradient(left, #58A2FF 0%,#1982FF 100%); 
          filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#58A2FF', endColorstr='#1982FF',GradientType=1);
          border-radius: 6px 0 0 0;
        }
        .tag1{
          background-color: #454544;
          border-radius: 0 0 6px 0;
        }
      }
      .item-top-img-cover{
        width: 100%;
        height: 202px;
        overflow: hidden;
        .item-top-img{
          transition: transform 0.3s ease 0s;
          width: 100%;
          height: 100%;
          border-radius: 6px;
        }
      }
      .item-top-cityArea-bg{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(to right, rgba(0,0,0,0) 0%,rgba(0,0,0,0.8) 100%); 
        background: -moz-linear-gradient(left, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%); 
        background: -webkit-gradient(linear, left, right, color-stop(0%,rgba(0,0,0,0)), color-stop(100%,rgba(0,0,0,0.8))); 
        background: -webkit-linear-gradient(left, rgba(0,0,0,0) 0%,rgba(0,0,0,0.8) 100%); 
        background: -o-linear-gradient(left, rgba(0,0,0,0) 0%,rgba(0,0,0,0.8) 100%); 
        background: -ms-linear-gradient(left, rgba(0,0,0,0) 0%,rgba(0,0,0,0.8) 100%); 
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#000000', endColorstr='#5E000000',GradientType=1);
        color: #fff;
        border-radius: 0 0 6px 6px;
        .item-top-cityArea{
          padding: 5px 0 5px 22px;
          font-size: 15px;
          line-height: 1;
          font-weight: 400;
          border-radius: 0 0 6px 6px;
          .item-top-line{
            width: 1px;
            height: 12px;
            background-color: #fff;
            display: inline-block;
            margin: 0 10px;
          }
        }
      }
    }
    .show-item-bottom{
      overflow: hidden;
      padding: 13px 10px 15px 10px;
      margin-top: -4px;
      .item-bottom-hotelinfo{
        float: left;
        width: 260px;
        .item-bottom-hotelname{
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          font-size: 19px;
          font: 16px/26px "Microsoft YaHei",SimHei,SimSun,Tahoma,Verdana,Arial,sans-serif;
          color: #283b52;
        }
        .item-bottom-address{
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          color: #8999ad;
          font-family: "Microsoft yahei", arial, Simsun, sans-serif;
          font-size: 14px;
        }
      }
      .item-bottom-priceArea{
        float: right;
        .item-bottom-price{
          color: #1A83FF;
          font-family: "Helvetica Neue", Arial, "PingFang SC", "Microsoft Yahei", SimSun, sans-serif;
          font-weight: 700;
          .bottom-price-rmb{
            font-size: 20px;
          }
          .bottom-price-num{
            font-size: 23px;
            letter-spacing: -1px;
          }
          .bottom-price-start{
            font-size: 12px;
            font-weight: 400;
            position: relative;
            top: -1px;
          }
        }
        .item-bottom-tag{
          text-align: right;
          color: #92a2b6;
          font-size: 13px;
          text-decoration: line-through;
          letter-spacing: -1px;
          span{
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>