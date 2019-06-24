<template>
  <div class="select-date-wrapper">
    <div class="select-date">
      <div class="top-tip-fixed-cover">
        <div class="top-tip-fixed">
          <div class="select-date-tip">
            请选择入住离店日期
            <span class="close-modal" @click="closeSelectDate">×</span>
          </div>
          <ul class="weekday-cover">
            <li>一</li>
            <li>二</li>
            <li>三</li>
            <li>四</li>
            <li>五</li>
            <li class="weekend">六</li>
            <li class="weekend">日</li>
          </ul>
        </div>
      </div>
      <div class="month-cover" v-for="(item, index, key) in pullDate" :key="item.index">
        <div class="date-title-cover">
          <div class="date-title" :class="isFixed[key] ? `date-title-fixed${key}` : ''">{{item.title}}</div>
        </div>
        <ul>
          <li v-for="day in item.date" :key="day.index" :class="day.classname"
              @click="day.classname !== 'pass' ? dayClickEvent(day) : null">
            {{day.day}}
            <i v-for="tag in day.tags" :key="tag.index" :class="tag[0]">
              {{tag[1]}}<span v-show="tag[0]==='price'">元</span>
            </i>
            <i class="check-in">入住</i>
            <i class="check-out">离店</i>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import { dateFormat } from '@/util/lobal.js'
  import { mapGetters } from 'vuex'
  import { increaseMonth } from '@/util/util.js'

  export default {
    props: {
      selectModalData: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        startDate: dateFormat(this.getToDay(), 'yyyy-MM-dd'),
        endDate: dateFormat(new Date(increaseMonth(new Date(Date.now()), 3)), 'yyyy-MM-dd'),
        dateJson: this.selectModalData.selectDateJson,
        currentDate: [
          this.$route.query.startDate ? this.$route.query.startDate : dateFormat(new Date(Date.now()), 'yyyy-MM-dd'), 
          this.$route.query.endDate ? this.$route.query.endDate : dateFormat(new Date(Date.now() + 8.64e7), 'yyyy-MM-dd')
        ],
        departureDate: [dateFormat(new Date(Date.now() + 8.64e7), 'yyyy-MM-dd')],
        isFirstClick: this.selectModalData.isFirstClick,
        isFixed: [
          false, false, false
        ],
        montCoverHeight: 0
      }
    },
    computed: {
      ...mapGetters([ 'timeOffset' ]),
      pullDate() {
        return this.getAll(this.startDate, this.endDate)
      }
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll)
    },
    destroyed () {
      window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
      handleScroll() {
        this.montCoverHeight = document.getElementsByClassName('month-cover')[0].scrollHeight
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        let key = 0
        if(scrollTop === 0){
          this.isFixed = [false, false, false]
        }else if(scrollTop > this.montCoverHeight * key && scrollTop < this.montCoverHeight * (key + 1)){
          this.isFixed = [true, false, false]
        }else if(scrollTop < this.montCoverHeight * (key + 2)){
          this.isFixed = [false, true, false]
        }else if(scrollTop < this.montCoverHeight * (key + 3)){
          this.isFixed = [false, false, true]
        }
      },
      closeSelectDate() {
        this.$emit('update:isSelectDateShow', false)
      },
      getToDay() {
        let now = new Date(Date.now() + (this.timeOffset || 0))
        // if (now.getHours() >= 17) {
        //   now = new Date(now.getTime() + 24 * 60 * 60 * 1000)
        // }
        return new Date(now.toDateString())
      },
      dayClickEvent(data) {
        if (this.selectModalData.isBookHotel) {
          if (!this.isFirstClick) {
            this.isFirstClick = true
            this.currentDate = [`${data.year}-${data.month}-${data.day}`]
          } else {
            let day1Year = parseInt(this.currentDate[0].substring(0, 4))
            let day1Month = parseInt(this.currentDate[0].substring(5, 7))
            let day1Day = parseInt(this.currentDate[0].substring(8, 10))
            if (day1Year === parseInt(data.year) && day1Month === parseInt(data.month) && day1Day >= parseInt(data.day)) {
              this.currentDate = [`${data.year}-${data.month}-${data.day}`]
              return
            }
            if (day1Year === parseInt(data.year) && day1Month > parseInt(data.month)) {
              this.currentDate = [`${data.year}-${data.month}-${data.day}`]
              return
            }
            if (day1Year > parseInt(data.year)) {
              this.currentDate = [`${data.year}-${data.month}-${data.day}`]
              return
            }
            this.isFirstClick = false
            this.currentDate.push(`${data.year}-${data.month}-${data.day}`)
          }
          this.$emit('selectDate', this.currentDate)
        } else {
          // 机票预订时间
          console.log('机票时间选择', data)
          this.departureDate = [`${data.year}-${data.month}-${data.day}`]
          this.$emit('selectDate', data)
        }
      },
      pushTag(yearMonthDay) { // 添加 价格信息，是否休息等。。。
        let tags = []
        for (let i = 0; i < this.dateJson.length; i++) {
          if (moment(yearMonthDay).format('x') === moment(this.dateJson[i].date).format('x')) {
            for (let key in this.dateJson[i]) {
              tags.push([key, this.dateJson[i][key]])
            }
            break
          }
        }
        return tags
      },
      setClass(start, end, i) { //根据日期给div设置样式
        let className = ''
        if (i >= moment(start).format('x') && i <= moment(end)) { // 是否在开始和结束之间
          className = 'day'
          if (moment(i).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) { // 今天
            // className += ' today';
          }
          // 根据是否是酒店预订实现选中效果
          if (this.selectModalData.isBookHotel) {
            this.currentDate.forEach((item, index, arr) => { // currentDate
              if (moment(i).format('YYYY-MM-DD') === moment(item).format('YYYY-MM-DD')) {
                className += ` curday${index}`
              }
              if (arr[1] && new Date(arr[0].replace(/-/g, '/')).getTime() < i && i < new Date(arr[1].replace(/-/g, '/')).getTime()) {
                className += ' pickDay'
              }
            })
          } else {
            this.departureDate.forEach((item, index) => {
              if (moment(i).format('YYYY-MM-DD') === moment(item).format('YYYY-MM-DD')) {
                className += ` curday${index}`
              }
            })
          }
        } else {
          className = 'pass'
          if (moment(i).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
            // className += ' today';
          }
        }
        return className
      },
      getAll(start, end) { // 获取两个日期间的所有日期数据
        const sd = Number(moment(start).startOf('month').format('x')); // 本月第一天（毫秒）
        const ed = Number(moment(end).endOf('month').format('x')); // 本月最后一天（毫秒）

        let dataObject = {}

        dataObject[sd] = {title: moment(start).format('YYYY年MM月'), date: []} // 初始第一个月
        for (let w = 1; w < moment(sd).weekday(); w++) { // 对本月一号之前的周几补全。
          dataObject[sd].date.push({year: '', month: '', day: '', week: w})// 如果当前月份没有存储当前天数用的数组,就创建一个空数组，如果有，就向里面添加一个空对象; (空对象是用来占位置的，用来填充月份前面的空白)
        }

        for (let i = sd; i <= ed;) {
          const firstDay = Number(moment(i).startOf('month').format('x')) // 当月第一天（毫秒）;--作为每个月的唯一标示

          if (moment(i).format('x') === moment(moment(i).startOf('month').format('YYYY-MM-DD')).format('x') && i !== sd) { // 如果是当月的第一天,添加下个月的数据
            // console.log(i, sd)
            const op = {
              title: moment(i).add(1, 'days').format('YYYY年MM月'), // 下个月的第一天
              date: []
            }
            for (let w = 1; w < moment(i).weekday(); w++) { // 对本月一号之前的周几补全。
              op.date.push({year: '', month: '', day: '', week: w})// 如果当前月份没有存储当前天数用的数组,就创建一个空数组，如果有，就向里面添加一个空对象; (空对象是用来占位置的，用来填充月份前面的空白)
            }
            dataObject[i] = op
          }

          //根据日期给div设置样式
          let className = this.setClass(start, end, i)

          const tag = this.pushTag(moment(i).format('YYYY-MM-DD')) // 折扣，休息等信息

          const option = {
            year: moment(i).format('YYYY'),
            month: moment(i).format('MM'),
            day: moment(i).format('DD'),
            week: moment(i).weekday(),
            classname: className,
            tags: tag
          }
          dataObject[firstDay].date.push(option);
          i = Number(moment(i).add(1, 'days').format('x')) // 下次赋值
        }
        return dataObject
      }
    }
  }
</script>

<style lang="less">
@bili: 75rem;
.select-date-wrapper{
  position: absolute;
  top:0;
  bottom:0;
  left:0;
  z-index: 99;
}
  .select-date{
    background: #fafafa;
    color: #333;
    .top-tip-fixed-cover{
      height: 75*2/@bili;
      background-color: #fafafa;
      z-index: 1000;
      .top-tip-fixed{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        background-color: #fafafa;
        z-index: 1001;
        .select-date-tip{
          text-align: center;
          font-size: 18*2/@bili;
          padding: 5*2/@bili;
          .close-modal{
            float: right;
            font-size: 25*2/@bili;
            padding-right: 10*2/@bili;
            line-height: 1;
            color: #59A6EA;
          }
        }
        .weekday-cover{
          li{
            height: 40*2/@bili;
            line-height: 40*2/@bili;
          }
        }
      }
    }
    ul{
      overflow: hidden;
      li{
        position: relative;
        float: left;
        width: 52*2/@bili;
        height: 56*2/@bili;
        margin-bottom: -1px;
        border-bottom: 0.5px solid #e8e8e8;
        text-align: center;
        line-height: 58*2/@bili;
        font-size: 15*2/@bili;
        &.pass, &.future{
          color: #ccc;
          opacity: 0.5;
        }
        &.day{
          color: #333;
        }
        i{
          display: block;
          position: absolute;
          color: #333;
          font-style: normal;
          font-size: 12*2/@bili;
          &.date{
            display: none;
            font-style: none;
          }
          &.rest, &.discount{
            right: 0.1rem;
            top: 0.1rem;
            width: 0.3rem;
            height: 0.3rem;
            background: #4AC29A;
            line-height: 0.3rem;
            color: #fff;
          }
          &.discount{
            background: #ff6600;
            color: #fff;
          }
          &.price{
            bottom: 0;
            left: 0;
            width: 100%;
            color: #333;
            font-size: 12*2/@bili;
            line-height: 0.3rem;
          }
          &.check-in,&.check-out{
            bottom: 0;
            left: 0;
            width: 100%;
            color: #333;
            font-size: 12*2/@bili;
            line-height: 2;
            display: none;
            color: #fff;
          }
        }
        &.curday0{
          background-color: #59A6EA;
          color: #fff;
          line-height: 2;
          .check-in{
            display: block;
          }
        }
        &.curday1{
          background-color: #59A6EA;
          color: #fff;
          line-height: 2;
          .check-out{
            display: block;
          }
        }
        &.pickDay{
          background-color: #59A6EA;
        }
      }
      .weekend{
        color: #59A6EA;
      }
    }
    .month-cover{
      background-color: #fff;
      margin-bottom: 8*2/@bili;
      border-bottom: 0.5px solid #e8e8e8;
      .date-title-cover{
        height: 38*2/@bili;
        .date-title{
          width: 100%;
          background-color: #fff;
          color: #333;
          line-height: 37*2/@bili;
          font-weight: 400;
          text-align: center;
          letter-spacing: .025rem;
          font-size: 18*2/@bili;
          z-index: 9;
          border-top: 0.5px solid #e8e8e8;
        }
        .date-title-fixed0{
          position: fixed;
          top: 73*2/@bili;
          border-bottom: 0.5px solid #e8e8e8;
        }
        .date-title-fixed1{
          position: fixed;
          top: 73*2/@bili;
          border-bottom: 0.5px solid #e8e8e8;
        }
        .date-title-fixed2{
          position: fixed;
          top: 73*2/@bili;
          border-bottom: 0.5px solid #e8e8e8;
        }
      }
    }
  }
</style>
