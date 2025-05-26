const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const runReminderScheduler = require('./jobs/reminderScheduler');
require('dotenv').config();


// Middleware
app.use(cors({
  credentials : true,
  origin : ['http://localhost:3000' , 'http://localhost:8080' , 'https://bmp-inv-be.zenbytes.id' , 'https://inventory.zenbytes.id']
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cookieParser());

// Connect to MongoDB
const uri = process.env.MONGO_URI;
mongoose.connect(uri, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB Connected")
})
.catch(err=> console.log(err))

//routes
const WarehouseRoutes = require('./routes/Warehouse.js')
app.use('/warehouse/',WarehouseRoutes)

const WorkerRoutes = require('./routes/Worker.js')
app.use('/worker/',WorkerRoutes)

const ProductCategoriesRoutes = require('./routes/ProductCategories.js')
app.use('/productCategories/',ProductCategoriesRoutes)

const Users = require('./routes/User.js')
app.use('/user/',Users)

const Products = require('./routes/Product.js')
app.use('/product/',Products)

const Carts = require('./routes/Cart.js')
app.use('/cart/',Carts)

const Wishtlists = require('./routes/Wishlist.js')
app.use('/wishlist/',Wishtlists)

const Addresses = require('./routes/Address.js')
app.use('/address/',Addresses)

const Discounts = require('./routes/Discount.js')
app.use('/discount/',Discounts)

const Orders = require('./routes/Order.js')
app.use('/order/',Orders)

const Moves = require('./routes/Move.js')
app.use('/move/',Moves)

const MoveProduct = require('./routes/MoveProduct.js')
app.use('/moveProduct/',MoveProduct)

const Cities = require('./routes/Cities.js')
app.use('/cities/',Cities)

const Provinces = require('./routes/Provinces.js')
app.use('/province/',Provinces)

const Reminder = require('./routes/Reminder.js')
app.use('/reminder/',Reminder)

const Notification = require('./routes/Notification.js')
app.use('/notification/',Notification)

const rajaOngkir = require('./API/rajaongkir.js')
app.use('/rajaongkir/',rajaOngkir)

const midtrans = require('./API/midtrans.js')
app.use('/midtrans/',midtrans)

const banner = require('./routes/Banner.js')
app.use('/banner/',banner)

const returnRequest = require('./routes/ReturnRequest.js')
app.use('/returnRequest/',returnRequest)

const stockOpname = require('./routes/StockOpname.js')
app.use('/stockOpname/',stockOpname)

const delivery = require('./routes/Deliveries.js');
app.use('/delivery/', delivery);

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

runReminderScheduler();