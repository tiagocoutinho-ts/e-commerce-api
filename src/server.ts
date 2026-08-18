import express from 'express';
import cors from 'cors';
import { authRoutes } from './routers/auth.routes';
import { productRoutes } from './routers/product.routes';
import { cartRoutes } from './routers/cart.routes';
import { orderRoutes } from './routers/order.routes';


const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server rodando em http://localhost:${PORT}`);
});