import { createRouter, createWebHistory } from 'vue-router'
import  loginView from '../views/loginView.vue'
import  registerView from '../views/registerView.vue'
import  overviewWorkerView from '../views/overviewWorkerView.vue'
import  productsWorkerView from '../views/productsWorkerView.vue'
import  newProductsWorkerView from '../views/newProductsWorkerView.vue'
import  workerView from '../views/workerView.vue'
import  newWorkerView from '../views/newWorkerView.vue'
import  warehouseWorkerView from '../views/warehouseWorkerView.vue'
import  newWarehouseView from '../views/newWarehouseView.vue'
import  productCategoriesWorkerView from '../views/productCategoriesWorkerView.vue'
import  newProductCategoriesWorkerView from '../views/newProductCategoriesWorkerView.vue'
import  homeUser from '../views/homeUser.vue'
import  detailProduct from '../views/detailProduct.vue'
import  detailOrder from '../views/detailOrder.vue'
import  detailMove from '../views/detailMove.vue'
import  editProduct from '../views/editProduct.vue'
import  cartUser from '../views/cartUser.vue'
import  wishlistUser from '../views/wishlistUser.vue'
import  addressLocation from '../views/addressLocation.vue'
import  newAddressLocation from '../views/newAddressLocation.vue'
import  checkoutUser from '../views/checkoutUser.vue'
import  discountView from '../views/discountView.vue'
import  newDiscount from '../views/newDiscount.vue'
import  discountPageUser from '../views/discountPageUser.vue'
import  historyTransaksi from '../views/historyTransaksi.vue'
import  stockOpname from '../views/stockOpname.vue'
import  detailedProductWorker from '../views/detailedProductWorker.vue'
import  moveProduct from '../views/moveProduct.vue'
import  newMove from '../views/newMove.vue'
import  reminder from '../views/reminder.vue'
import  newReminder from '../views/newReminder.vue'
import  checkoutCartUser from '../views/checkoutCartUser.vue'
import  paymentSuccess from '../views/paymentSuccess.vue'
import  checkoutWishlistUser from '../views/checkoutWishlist.vue'
import  userSettings from '../views/userSettings.vue'
import  searchResults from '../views/searchResults.vue'
import  selectedCategory from '../views/selectedCategory.vue'
import  uploadImageProduct from '../views/uploadImageProductAdmin.vue'
import  uploadImageProductCategories from '../views/uploadImageProductCategoriesAdmin.vue'
import  uploadBanner from '../views/uploadBannerAdmin.vue'
import  returnOrder from '../views/returnOrder.vue'
import  detailReturnRequest from '../views/detailReturnRequest.vue'
import  returnRequestList from '../views/returnRequestList.vue'
import  returnStatus from '../views/returnStatus.vue'
import moveHistory from '../views/moveHistoryWorkerView.vue'
import reportProduct from '../views/reportProduct.vue'
import reportPerformance from '../views/reportPerformance.vue'
import reportStockOpname from '../views/reportStockOpname.vue'
import historySales from '../views/historySales.vue'
import editAddressLoctaion from '@/views/editAddressLoctaion.vue'

const routes = [
  {
    path: '/register',
    name: 'register',
    component: registerView
  },
  {
    path: '/login',
    name: 'login',
    component: loginView
  },
  {
    path: '/productsWorker',
    name: 'productsWorker',
    component: productsWorkerView
  },
  {
    path: '/newProductsWorker',
    name: 'newProductsWorker',
    component: newProductsWorkerView
  },
  {
    path: '/worker',
    name: 'workerView',
    component: workerView
  },
  {
    path: '/newWorker',
    name: 'newWorkerView',
    component: newWorkerView
  },
  {
    path: '/warehouse',
    name: 'warehouseWorkerView',
    component: warehouseWorkerView
  },
  {
    path: '/newWarehouse',
    name: 'newWarehouseView',
    component: newWarehouseView
  },
  {
    path: '/productCategoriesWorker',
    name: 'productCategoriesWorkerView',
    component: productCategoriesWorkerView
  },
  {
    path: '/newProductCategories',
    name: 'newProductCategoriesWorkerView',
    component: newProductCategoriesWorkerView
  },
  {
    path: '/home',
    name: 'homeUser',
    component: homeUser
  },
  {
    path: '/product/:id',
    name: 'detailProduct',
    component: detailProduct
  },
  {
    path: '/order/:id',
    name: 'detailOrder',
    component: detailOrder
  },{
    path: '/move/:id',
    name: 'detailMove',
    component: detailMove
  },
  {
    path: '/detailedProduct/:id',
    name: 'editProduct',
    component: editProduct
  },
  {
    path: '/cart',
    name: 'cartUser',
    component: cartUser
  },
  {
    path: '/wishlist',
    name: 'wishlistUser',
    component: wishlistUser
  },
  {
    path: '/addressLocation',
    name: 'addressLocation',
    component: addressLocation
  },
  {
    path: '/newAddressLocation',
    name: 'newAddressLocation',
    component: newAddressLocation
  },
  {
    path: '/checkoutUser',
    name: 'checkoutUser',
    component: checkoutUser
  },
  {
    path: '/discountOverview',
    name: 'discountOverview',
    component: discountView
  },
  {
    path: '/newDiscount',
    name: 'newDiscount',
    component: newDiscount
  },
  {
    path: '/discountPage',
    name: 'discountPageUser',
    component: discountPageUser
  },
  {
    path: '/history',
    name: 'historyTransaksi',
    component: historyTransaksi
  },
  {
    path: '/stockOpname',
    name: 'stockOpname',
    component: stockOpname
  },
  {
    path: '/detailedProduct',
    name: 'detailedProductWorker',
    component: detailedProductWorker
  },
  {
    path: '/move',
    name: 'move',
    component: moveProduct
  },
  {
    path: '/newMove',
    name: 'newMove',
    component: newMove
  },
  {
    path: '/reminder',
    name: 'reminderView',
    component: reminder
  },
  {
    path: '/newReminder',
    name: 'newReminderView',
    component: newReminder
  },
  {
    path: '/checkoutCart',
    name: 'checkoutCartUserView',
    component: checkoutCartUser
  },
  {
    path: '/checkoutWishlist',
    name: 'checkoutWishlistUser',
    component: checkoutWishlistUser
  },
  {
    path: '/paymentSuccess',
    name: 'paymentSuccessView',
    component: paymentSuccess
  },
  {
    path: '/userSettings',
    name: 'userSettingsView',
    component: userSettings
  },
  {
    path: '/search',
    name: 'searchResults',
    component: searchResults
  },
  {
    path: '/category/:id',
    name: 'selectedCategory',
    component: selectedCategory
  },
  {
    path: '/uploadImageProduct',
    name: 'UploadImageProductAdmin',
    component: uploadImageProduct
  },
  {
    path: '/uploadImageProductCategories',
    name: 'uploadImageProductCategoriesAdmin',
    component: uploadImageProductCategories
  },
  {
    path: '/uploadBanner',
    name: 'uploadBannerAdmin',
    component: uploadBanner
  },
  {
    path: '/returnOrder/:id',
    name: 'returnOrder',
    component: returnOrder
  },
  {
    path: '/returnRequestList',
    name: 'returnRequestList',
    component: returnRequestList
  },
  {
    path: '/returnRequest/:id',
    name: 'detailReturnRequest',
    component: detailReturnRequest
  },
  {
    path: '/returnStatus',
    name: 'returnStatus',
    component: returnStatus
  },
  {
    path: '/moveHistory',
    name: 'moveHistory',
    component: moveHistory
  },
  {
    path: '/reportProduct',
    name: 'reportProduct',
    component: reportProduct
  },
  {
    path: '/reportPerformance',
    name: 'reportPerformance',
    component: reportPerformance
  },
  {
    path: '/reportStockOpname',
    name: 'reportStockOpname',
    component: reportStockOpname
  },
  {
    path: '/historySales',
    name: 'historySales',
    component: historySales
  },
  {
    path: '/editAddress/:id',
    name: 'editAddress',
    component: editAddressLoctaion
  },
  {
    path: '/overviewWorker',
    name: 'overviewWorker',
    component: overviewWorkerView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router