import Vue from 'vue'
import Router from 'vue-router'
const Home = () => import('@/views/Home/index.vue')
const CompanyRegister = () => import('@/views/CompanyRegister/index.vue')
const AgreementFile = () => import('@/views/CompanyRegister/AgreementFile.vue')
const Developing = () => import('@/views/Developing.vue')
const HotelDetail = () => import('@/views/HotelDetail')
const NotFoundComponent = () => import('@/views/NotFoundComponent.vue')
const ForgotPassword = () => import('@/views/ForgotPassword.vue')
const HotelList = () => import('@/views/HotelList/index.vue')
const FlyList = () => import('@/views/FlyList/index.vue')
const MyAccount = () => import('@/views/MyAccount/index.vue')
const OrderList = () => import('@/views/OrderList/index.vue')
const FlyOrderList = () => import('@/views/FlyOrderList/index.vue')
const InvoiceOrderList = () => import('@/views/InvoiceOrderList/')
const ApprovalSet = () => import('@/views/ApprovalSet/')
const ApplyInvoice = () => import('@/views/InvoiceOrderList/ApplyInvoice/index')
const InvoiceRecords = () => import('@/views/InvoiceOrderList/InvoiceRecords')
const OrderListByInvoiceId = () => import('@/views/InvoiceOrderList/OrderListByInvoiceId')
const OrderDetails = () => import('@/views/OrderDetails')
const OrderPay = () => import('@/views/OrderPay')
const FlyOrderPay = () => import('@/views/FlyOrderPay')
const OrderFly = () => import('@/views/OrderFly')
const InsuranceDetail = () => import('@/views/InsuranceDetail')
const openConsole = () => import('@/views/openConsole')
const CompanyFair = () => import('@/views/CompanyFair/index.vue')
const CompanyLong = () => import('@/views/CompanyLong/index.vue')
const TravelStandard = () => import('@/views/TravelStandard/index')
const StandardType = () => import('@/views/TravelStandard/StandardType/')
const TravelSet = () => import('@/views/TravelSet/index.vue')
const Settlement = () => import('@/views/Settlement/index.vue')
const SettlementList = () => import('@/views/Settlement/SettlementList.vue')

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'home',
      component: Home,
      alias: ['/content0', '/content1']
    },
    {
      path: '/CompanyRegister',
      name: 'CompanyRegister',
      component: CompanyRegister
    },
    {
      path: '/AgreementFile',
      name: 'AgreementFile',
      component: AgreementFile
    },
    {
      path: '/Developing',
      name: 'Developing',
      component: Developing
    },
    {
      path: '/HotelDetail',
      name: 'HotelDetail',
      component: HotelDetail
    },
    {
      path: '/ForgotPassword',
      name: 'ForgotPassword',
      component: ForgotPassword
    },
    {
      path: '/HotelList',
      name: 'HotelList',
      component: HotelList
    },
    {
      path: '/FlyList',
      name: 'FlyList',
      component: FlyList,
    },
    {
      path: '/OrderDetails',
      name: 'OrderDetails',
      component: OrderDetails
    },
    {
      path: '/OrderFly',
      name: 'OrderFly',
      component: OrderFly
    },
    {
      path: '/OrderPay',
      name: 'OrderPay',
      component: OrderPay
    },
    {
      path: '/FlyOrderPay',
      name: 'FlyOrderPay',
      component: FlyOrderPay
    },
    {
      path: '/MyAccount',
      name: 'MyAccount',
      component: MyAccount
    },
    {
      path: '/InvoiceOrderList',
      name: 'InvoiceOrderList',
      component: InvoiceOrderList
    },
    {
      path: '/ApprovalSet',
      name: 'ApprovalSet',
      component: ApprovalSet
    },
    {
      path: '/ApplyInvoice',
      name: 'ApplyInvoice',
      component: ApplyInvoice
    },
    {
      path: '/InvoiceRecords',
      name: 'InvoiceRecords',
      component: InvoiceRecords
    },
    {
      path: '/OrderListByInvoiceId',
      name: 'OrderListByInvoiceId',
      component: OrderListByInvoiceId
    },
    {
      path: '/OrderList',
      name: 'OrderList',
      component: OrderList
    },
    {
      path: '/FlyOrderList',
      name: 'FlyOrderList',
      component: FlyOrderList
    },
    {
      path: '/InsuranceDetail',
      name: 'InsuranceDetail',
      component: InsuranceDetail
    },
    {
      path: '/openConsoleTAOYAO',
      component: openConsole
    },
    {
      path: '*',
      name: 'NotFoundComponent',
      component: NotFoundComponent
    },
    {
      path: '/CompanyFair',
      component: CompanyFair
    },
    {
      path: '/CompanyLong',
      component: CompanyLong
    },
    {
      path: '/TravelStandard',
      name: 'TravelStandard',
      component: TravelStandard
    },
    {
      path: '/StandardType',
      name: 'StandardType',
      component: StandardType
    },
		{
			path: '/TravelSet',
			name: 'TravelSet',
			component: TravelSet
		},
		{
			path: '/Settlement',
			name: 'Settlement',
			component: Settlement
		},
		{
			path: '/SettlementList',
			name: 'SettlementList',
			component: SettlementList
		}
  ]
})