const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const connectDB = require('./config/db');

const authRoutes = require('./routes/AuthRoutes');
const cartRoutes = require('./routes/CartRoutes');
const categoryRoutes = require('./routes/CategoryRoutes');
const couponRoutes = require('./routes/CouponRoutes');
const discountRoutes = require('./routes/DiscountRoutes');
const feedbackRoutes = require('./routes/FeedbackRoutes');
const orderRoutes = require('./routes/OrderRoutes');
const paymentRoutes = require('./routes/PaymentRoutes');
const productRoute = require('./routes/ProductRoutes');
const returnProductRoutes = require('./routes/ReturnProductRoutes');
const userRoute = require('./routes/UserRoutes');
const wishlistRoutes = require('./routes/WishlistRoutes');

const app = express();

app.use(cors());

app.use(bodyParser.json());

connectDB();

app.use('/authentication', authRoutes);
app.use('/cart', cartRoutes);
app.use('/category', categoryRoutes);
app.use('/coupon', couponRoutes);
app.use('/discount', discountRoutes);
app.use('/feedback', feedbackRoutes);
app.use('/order', orderRoutes);
app.use('/payment', paymentRoutes);
app.use('/product', productRoute);
app.use('/return', returnProductRoutes);
app.use('/user', userRoute);
app.use('/wishlist', wishlistRoutes);

app.listen(process.env.PORT, () => {
    console.log('Server started')
})