// 首页轮播图
const imgSrcs = [{
    src: require('@/assets/card1.png')
  },
  {
    src: require('@/assets/card2.jpg')
  }
]
// 首页广告展示
const tenzontAds = [{
    src: require('@/assets/ads_icon1.png'),
    title: '急速订房',
    desc: '闪电订房 订房无忧'
  },
  {
    src: require('@/assets/ads_icon2.png'),
    title: '发票管理',
    desc: '每月开票 效率极高'
  },
  {
    src: require('@/assets/ads_icon3.png'),
    title: '超低价订热门房',
    desc: '资源丰富 价格优惠'
  }
]
// 首页酒店预订星级选择
const starOptions = [{
    value: '',
    label: '不限级别'
  },
  {
    value: '4',
    label: '豪华五星'
  },
  {
    value: '3',
    label: '高档精品'
  },
  {
    value: '2',
    label: '舒适快捷'
  },
  {
    value: '1',
    label: '经济连锁'
  }
]
// 首页酒店标题
const hotelShowHead = [{
    title: '特惠酒店',
    desc: '超低价酒店限时消费'
  },
  {
    title: '精品酒店',
    desc: '精心推荐品质保障'
  }
]


export {
  imgSrcs,
  starOptions,
  tenzontAds,
  hotelShowHead
}