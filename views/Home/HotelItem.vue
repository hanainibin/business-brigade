<template>
  <li class="hotel-show-item">
    <div @click="handleClick" class="hotel-show-item-content">
      <div class="show-item-top">
        <span class="item-top-tag">{{hotelTag}}</span>
        <div class="item-top-img-cover">
          <img class="item-top-img" :src="item.picAddress" alt="">
        </div>
        <div class="item-top-cityArea-bg">
          <div class="item-top-cityArea">
            <span>{{item.area}}</span>
            <span class="item-top-line"/>
            <span>{{item.busZone}}</span>
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
            <span class="bottom-price-num">{{item.price/100}}</span>
            <span class="bottom-price-start">起</span>
          </div>
          <p class="item-bottom-tag">
            <span>促销</span>
          </p>
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
    item: Object,
    hotelTag: String
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
      .item-top-tag{
        position: absolute;
        z-index: 1;
        top: 7px;
        left: 7px;
        background: linear-gradient(to right, #36b8fc,#009ced); 
        background: -moz-linear-gradient(left, #36b8fc, #009ced); 
        background: -webkit-gradient(linear, left, right, color-stop(#36b8fc), color-stop(#009ced)); 
        background: -webkit-linear-gradient(left, #36b8fc,#009ced); 
        background: -o-linear-gradient(left, #36b8fc,#009ced); 
        background: -ms-linear-gradient(left, #36b8fc,#009ced); 
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#36b8fc', endColorstr='#009ced',GradientType=1);
        color: #fff;
        border-radius: 0 0 5px 0;
        padding: 3px 10px;
        font-size: 14px;
      }
      .item-top-img-cover{
        width: 100%;
        height: 202px;
        overflow: hidden;
        .item-top-img{
          transition: transform 0.3s ease 0s;
          width: 100%;
          height: 100%;
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
        .item-top-cityArea{
          padding: 5px 0 5px 22px;
          font-size: 15px;
          line-height: 1;
          font-weight: 400;
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
      padding: 13px 20px 15px 20px;
      background-color: #fff;
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
        color: #009ced;
        .item-bottom-price{
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
          color: #fff;
          overflow: hidden;
          width: 34px;
          height: 20px;
          border-radius: 2px;
          font-family: "Microsoft yahei",arial,Simsun,sans-serif;
          font-weight: 100;
          font-size: 13px;
          float: right;
          line-height: 1;
          span{
            display: inline-block;
            background: linear-gradient(to right, #36b8fc,#009ced); 
            background: -moz-linear-gradient(left, #36b8fc, #009ced); 
            background: -webkit-gradient(linear, left, right, color-stop(#36b8fc), color-stop(#009ced)); 
            background: -webkit-linear-gradient(left, #36b8fc,#009ced); 
            background: -o-linear-gradient(left, #36b8fc,#009ced); 
            background: -ms-linear-gradient(left, #36b8fc,#009ced); 
            filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#36b8fc', endColorstr='#009ced',GradientType=1);
            width: 100%;
            height: 100%;
            padding: 3px;
          }
        }
      }
    }
  }
}
</style>