import { dateFormat, dataFormatWeek } from "@/util/lobal.js";
import collapse from "@/util/collapse.js";
import AirCityList from "@/components/AirCityList.vue";
import { flyList, searchFlightInfo, loadList } from "@/api/wxResign";
import { mapGetters, mapMutations } from "vuex";
import TablePagination from "@/components/TablePagination.vue";
import { increaseMonth } from "@/util/util.js";
import { setStore, getStore } from "@/util/store";
import { Message } from 'element-ui'

export default {
  name: "FlyList",
  components: {
    AirCityList,
    TablePagination,
    collapse
  },
  data () {
    return {
      Date: Date.now() + this.timeOffset,
      today: new Date(Date.now()),
      pickerToday: {
        disabledDate: time => {
          return (
            time.getTime() < this.referentialDate - 8.64e7 ||
            time.getTime() > increaseMonth(this.today, 6) + this.timeOffset
          );
        }
      },
      pickerTomorrow: {
        disabledDate: time => {
          return (
            time <= this.startDate ||
            time.getTime() >
            increaseMonth(this.today, 2) + this.timeOffset + 8.64e7
          );
        }
      },
      priceLabels: [
        { text: "￥150以下", label: "0-15000" },
        { text: "￥150-￥300", label: "15000-30000" },
        { text: "￥300-￥450", label: "30000-45000" },
        { text: "￥450-￥600", label: "45000-60000" },
        { text: "￥600以上", label: "60000" }
      ],
      priceArr: [],
      starLabels: [
        { text: "特价舱", label: "0" },
        { text: "经济舱", label: "1" },
        { text: "商务舱", label: "2" },
        { text: "头等舱", label: "3" },
        { text: "包机", label: "4" }
      ],
      isShow11: false,
      isShow1: false,
      isActive: [],
      detailLoading: [],
      activeDown: "&#xe664;",
      activeUp: "&#xe663;",
      starArr: [],
      priceInputStart: "",
      priceInputEnd: "",
      hotelData: [],
      // inputValue: {},
      airCount: 0,
      op: "",
      detailShow: [],
      classTop: "classTop",
      airData: [],
      airDetailData: [],
      inputValue: {},
      chineseName: {},
      startDate: "",
      isDefaultClicked: true,
      isPriceClicked: false,
      // isAsc: 0,
      // sort: "",
      matched: false,
      noShow: true,
      noSale: [],
      isShow: false,
      loading: false,
      searchButton: false,
      pageIndex: 1,
      isSearchFixed: false,
      isSortFixed: false,
      headerHeight: 0,
      sortTopHeight: 0
    };
  },
  computed: {
    ...mapGetters(["accountId", "timeOffset", "airCityList"]),
    handleSelected () {
      if (
        this.priceArr.length === 0 &&
        this.priceInputStart === "" &&
        this.priceInputEnd === ""
      ) {
        return "selected";
      } else {
        return "";
      }
    }
  },
  watch: {
    timeOffset (value) {
      this.referentialDate = Date.now() + value;
    }
  },
  created () {
    // axios.get('/fly/mock/18740/fly/flyList', function (res){
    //   console.log(res)
    // })
    let HomeAirQuery = getStore({ name: "HomeAirQuery" });
    let chineseName = getStore({ name: "chineseName" });
    // let airCityList = getStore({ name: "airCityList" });
    this.chineseName = { ...chineseName };
    this.inputValue = { ...HomeAirQuery };
    this.inputValue.cityFrom = this.chineseName.chineseFrom + '(' + this.inputValue.from + ')';
    // this.chineseName.chineseFrom + this.inputValue.from;
    // this.chineseName.chineseTo = this.chineseName.chineseTo
    this.inputValue.cityTo = this.chineseName.chineseTo + '(' + this.inputValue.to + ')';
  },
  mounted () {
    this.loading = true;
    this.startDate = this.inputValue.departureDate;
    // this.inputValue.departureDate = dateFormat(this.inputValue.departureDate, "yyyy-MM-dd");
    flyList({
      ...this.inputValue
      // 传参
    }).then(res => {
      if (this.accountId.length < 0) {
        this.setState({
          key: "dialogLoginVisible",
          value: true,
          module: "user"
        });
      } else {
        this.loading = false;
        if (res.data) {
          this.airData = { ...res.data.data };
          this.airCount = res.data.data.length;
          if (this.airCount == 0) {
            this.matched = true;
          }
        } else {
          if (res.data.msg) {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        }
      }
    });
    this.hotelList();
    // unionSearch({
    //   keyWord: this.keywordName,
    //   totolSize: 10,
    //   cityId: this.inputValue.toId
    // }).then(res=>{
    //   console.log(res)
    // })
    // this.headerHeight = document.getElementsByClassName(
    //   "tenzont-header-bg"
    // )[0].scrollHeight;
    // this.sortTopHeight =
    //   this.headerHeight +
    //   document.getElementsByClassName("hotel-search-sub-wrapper")[0]
    //     .scrollHeight +
    //   document.getElementsByClassName("list-length-wrapper")[0].scrollHeight;
    // window.addEventListener("scroll", this.handleScroll);
  },
  destroyed () {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    dateFormat: dateFormat,
    dataFormatWeek: dataFormatWeek,
    gethhmm (from, to) {
      let minus = (new Date(to).getTime() - new Date(from).getTime()) / (1000 * 60)
      let hh = Math.floor(minus / 60)
      let mm = minus - hh * 60
      if (mm > 0) {
        return `${hh}h${mm}m`
      } else {
        return `${hh}h`
      }
    },
    switchCity () {
      setStore({
        name: 'arrCity1',
        content: {
          name: this.inputValue.cityFrom,
          code: this.inputValue.from
        }
      })
      setStore({
        name: 'depCity1',
        content: {
          name: this.inputValue.cityTo,
          code: this.inputValue.to
        }
      })
      this.inputValue.cityFrom = getStore({ name: 'depCity1' }).name
      console.log(this.inputValue.cityFrom, ' this.inputValue.airCityFrom')
      this.inputValue.cityTo = getStore({ name: 'arrCity1' }).name
      console.log(this.inputValue.cityTo, 'this.inputValue.from')
      this.inputValue.from = getStore({ name: 'depCity1' }).code
      this.inputValue.to = getStore({ name: 'arrCity1' }).code
      this.$refs.c1.switchChildCity1(this.inputValue.cityFrom)
      this.$refs.c2.switchChildCity2(this.inputValue.cityTo)
    },
    chooseCity1 () {
      this.$refs.c1.chooseChildCity1()
    },
    chooseCity2 () {
      this.$refs.c2.chooseChildCity2()
    },
    // airTo (airTo) {
    //   this.inputValue.to = airTo
    //   console.log(this.inputValue.to, 'test')
    // },
    hotelList () {
      loadList({
        city: this.chineseName.chineseTo,
        cityId: this.inputValue.toId,
        limit: 4,
        page: 1,
        sortField: "commentCount",
        sortType: "desc"
      }).then(res => {
        if (res.data.code == 0) {
          this.hotelData = [...res.data.data.results];
        }
      });
    },
    toId (toId) {
      if (toId.length > 0) {
        this.inputValue.toId = toId;
      }
      console.log(this.inputValue.toId, 'emit')
    },
    fomatImg (src) {
      if (!src) {
        return require("@/assets/default_hotel.jpg");
      }
      return (
        "https://hotelpic-1254071088.file.myqcloud.com/hotel_pic/" +
        src +
        ".jpeg"
      );
    },
    formatImg (src) {
      if (!src) {
        let img = require(`@/assets/logo/noImg.png`)
        return img
      }
      let img
      if (src) {
        try {
          img = require(`@/assets/logo/${src}.png`)
        }
        catch {
          img = require(`@/assets/logo/noImg.png`)
        }
        return img
      }
    },
    handleScroll () {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      if (scrollTop >= this.headerHeight) {
        this.isSearchFixed = true;
      } else {
        this.isSearchFixed = false;
      }
      if (scrollTop >= this.sortTopHeight) {
        this.isSortFixed = true;
      } else {
        this.isSortFixed = false;
      }
    },
    toHotelDetail (hotelItem) {
      setStore({
        name: "HotelDetail",
        content: {
          startDate: dateFormat(new Date(this.inputValue.departureDate)),
          endDate: dateFormat(
            this.getTomorrowDay(this.inputValue.departureDate)
          ),
          hotelId: hotelItem.id
        }
      });
      setTimeout(() => {
        window.open("/#/HotelDetail");
      }, 100);
    },
    getTomorrowDay (day) {
      let date = new Date(day);
      return new Date(date.getTime() + 24 * 60 * 60 * 1000);
    },
    forId (index) {
      return index + "";
    },
    handleDetailOpen (index, detailLoading) {
      // console.log(index);
      this.$set(this.isActive, index, true);
      this.$set(this.detailLoading, index, true);
      searchFlightInfo({
        from: this.inputValue.from,
        to: this.inputValue.to,
        departureDate: this.inputValue.departureDate,
        routeType: "OW",
        flightNo: this.airData[index].flightNo
      }).then(res => {
        if (res.data.code === 0) {
          this.noShow = false;
          let seatList = [[], []]
          if (res.data.data.seats) {
            //区分经济舱与商务舱
            for (let i = 0; i < res.data.data.seats.length; i++) {
              if (res.data.data.seats[i].seatClassType ==='Y') {
                seatList[0].push(res.data.data.seats[i])
              } else {
                seatList[1].push(res.data.data.seats[i])
              }
            }
            if (seatList[0].length > 0) {
              res.data.data.seatType = 0
            } else {
              res.data.data.seatType = 1
            }
          }
          res.data.data.seatList = seatList
          this.$set(this.airDetailData, index, { ...res.data.data });
          let airDetailData = this.airDetailData;
          if (typeof airDetailData[index] == "undefined") {
            this.$set(detailLoading, index, true);
            this.checked = 0;
            if (this.checked == 0) {
              this.noSale[index] = true;
            } else {
              this.noSale[index] = false;
            }
          } else {
            this.$set(detailLoading, index, false);
            this.checked = res.data.data.seats.length;
            console.log(this.checked, 'checked')
            if (this.checked == 0) {
              this.noSale[index] = true;
            } else {
              this.noSale[index] = false;
            }
          }
        } else {
          if (res.data.msg) {
            Message(res.data.msg)
          }
        }
      });
    },
    handleSale (airDetailData) {
      let airDetailItem = [];
      for (let index = 0; index < airDetailData.length; index++) {
        airDetailItem = airDetailData[index].seats;
      }
      return airDetailItem.length;
    },
    handleDetailClose (index) {
      this.$set(this.isActive, index, false)
      this.noShow = true;
    },
    // changeEndDate(value) {
    //   if (value.getTime() >= this.inputValue.endDate.getTime()) {
    //     this.inputValue.endDate = new Date(value.getTime() + 86400000);
    //   }
    // },
    // ...mapMutations(["setState"]),
    // mapCity() {
    //   let isCityMap = false;
    //   for (let i = 0; i < this.cityList.list.citys.length; i++) {
    //     if (
    //       this.cityList.list.citys[i].indexOf(
    //         this.inputValue.city.toLocaleLowerCase()
    //       ) > -1
    //     ) {
    //       isCityMap = true;
    //     }
    //   }
    //   return isCityMap;
    // },
    getFlyList () {
      this.matched = false;
      if (this.inputValue.cityFrom === "" || !this.mapCity()) {
        this.isShow = !this.isShow;
        this.$message({
          message: "请选择城市！",
          type: "warning"
        });
      } else {
        if (this.inputValue.cityFrom == this.inputValue.cityTo) {
          this.isShow1 = !this.isShow1;
          this.$message({
            message: "请选择不同城市！",
            type: "warning"
          });
        } else {
          this.loading = true;
          this.searchButton = true;
          flyList({
            departureDate: this.startDate,
            from: this.inputValue.cityFrom.slice(
              this.inputValue.cityTo.length - 4,
              this.inputValue.cityTo.length - 1
            ),
            to: this.inputValue.cityTo.slice(
              this.inputValue.cityTo.length - 4,
              this.inputValue.cityTo.length - 1
            ),
            routeType: "OW"
          }).then(res => {
            let chineseFrom = "chineseFrom";
            let chineseTo = "chineseTo";
            let value1 = this.inputValue.cityFrom.slice(
              0,
              this.inputValue.cityFrom.length - 5
            );
            let value2 = this.inputValue.cityTo.slice(
              0,
              this.inputValue.cityTo.length - 5
            );
            this.$set(this.chineseName, chineseFrom, value1);
            this.$set(this.chineseName, chineseTo, value2);
            this.inputValue.from = this.inputValue.cityFrom.slice(
              this.inputValue.cityFrom.length - 4,
              this.inputValue.cityFrom.length - 1
            );
            (this.inputValue.to = this.inputValue.cityTo.slice(
              this.inputValue.cityTo.length - 4,
              this.inputValue.cityTo.length - 1
            )),
              (this.inputValue.departureDate = this.startDate);
            this.loading = false;
            this.searchButton = false;
            if (res.data.code == 0) {
              // if (res.data.data.count === 0) {
              //   this.$message(
              //     "很抱歉，该搜索条件下没找到符合您要求的酒店，试试其他搜索条件吧。"
              //   );
              //   this.airData = { ...res.data };
              // }
              this.airData = { ...res.data.data };
              this.airCount = res.data.data.length;
              this.hotelList();
              if (this.airCount == 0) {
                this.matched = true;
              }
            } else {
              this.matched = false;
              if (res.data.msg) {
                this.$message({
                  message: res.data.msg,
                  type: "warning"
                });
              }
            }
          });
        }
      }
    },
    mapCity () {
      let isCityMap = false;
      for (let i = 0; i < this.airCityList.list.length; i++) {
        let cityFrom = this.inputValue.cityFrom.slice(-1, 3);
        let cityTo = this.inputValue.cityTo.slice(-1, 3);
        if (
          this.airCityList.list[i].indexOf(cityFrom.toLocaleLowerCase()) > -1
        ) {
          isCityMap = true;
        }
        if (this.airCityList.list[i].indexOf(cityTo.toLocaleLowerCase()) > -1) {
          isCityMap = true;
        }
      }
      return isCityMap;
    },
    priceGroupCheck (item) {
      if (this.priceArr[0] === item) {
        this.priceArr = [];
      } else {
        this.priceArr = [item];
      }
      this.priceInputStart = "";
      this.priceInputEnd = "";
      this.getFlyList();
    },
    starGroupCheck (item) {
      if (this.starArr[0] === item) {
        this.starArr = [];
      } else {
        this.starArr = [item];
      }
      this.getFlyList();
    },
    clearPrice () {
      this.priceArr = [];
      this.priceInputStart = "";
      this.priceInputEnd = "";
      this.getFlyList();
    },
    clearStar () {
      this.starArr = [];
      this.getFlyList();
    },
    handleSearch () {
      this.isActive = [];
      // this.noShow = !this.noShow;
      this.getFlyList();
    },
    defaultSort () {
      this.isPriceClicked = false;
      this.isAsc = 0;
      this.op = "";
      this.sort = "";
      this.isDefaultClicked = true;
      this.getFlyList();
    },
    ...mapMutations(["setState"]),
    showMap (x, y, hotelName) {
      this.setState({
        key: "showMap",
        module: "common",
        value: true
      });
      setTimeout(() => {
        let BMap = window.BMap;
        let map = window.map;
        let point = new BMap.Point(x, y);
        let size = new BMap.Size(20);
        let marker = new BMap.Marker(point);
        let label = new BMap.Label(hotelName, {
          offset: size
        });
        label.setStyle({ fontSize: "14px" });
        map = new BMap.Map("tenzont-map");
        map.centerAndZoom(point, 20);
        marker.setLabel(label);
        map.addOverlay(marker);
        marker.setAnimation(window.BMAP_ANIMATION_BOUNCE);
        marker.addEventListener("click", () => {
          map.centerAndZoom(point, 20);
        });
        map.addControl(
          new BMap.NavigationControl({
            anchor: window.BMAP_ANCHOR_TOP_RIGHT
          })
        );
        map.enableScrollWheelZoom(true);
      }, 100);
    },
    toOrderFly (item, detailItem) {
      console.log(this.inputValue.toId, 'this.toId')
      setStore({
        name: "flyOrderQuery",
        content: {
          arrivalAirportCode: this.inputValue.to,
          carrierName: item.carrierName,
          carrierCode: item.carrierCode,
          departureAirportCode: this.inputValue.from,
          departureDate: item.departureTime,
          arrivalTime: item.arrivalTime,
          flightNo: item.flightNo,
          flightTripType: "DEPARTURE",
          seatClass: detailItem,
          toId: this.inputValue.toId,
          passengerType: detailItem.passengerType,
          saleType: detailItem.saleType,
          discount: detailItem.discount,
          seatIndex: detailItem.index,
          itemIndex: item
        }
      });
      setTimeout(() => {
        window.open("/#/OrderFly");
      }, 100);
    }
  }
};