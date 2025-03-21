import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Home'
import Layout from "./Layout"
import LoginForm from './Login'
import RegistrationForm from './Registration'
import AllProduct from './components/AllProduct'
import Cart from './components/Cart'
import OrderDetail from './components/OrderDetail'
import OrderHistory from './components/OrderHistory'
import ProductDetail from './components/ProductDetail'
import Wishlist from './components/Wishlist'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='/product' element={<AllProduct/>} />
            <Route path='/product/:id' element={<ProductDetail/>} />
            <Route path='/category/:id' element={<AllProduct/>} />
            <Route path='/cart' element={<Cart/>} />
            <Route path='/wishlist' element={<Wishlist/>} />
            <Route path='/order-history' element={<OrderHistory/>} />
            <Route path='/order-detail/:id' element={<OrderDetail/>} />
          </Route>
          <Route path='/register' element={<RegistrationForm />}></Route>
          <Route path='/login' element={<LoginForm />}></Route>
          <Route path='*' element={<h1 className='text-secondary'>404 Not Found</h1>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App