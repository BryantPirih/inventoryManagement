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