import { Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Home from './pages/home'
import Orders from './pages/orders'
import './config/fetch-interceptor'
import OrderDetails from './pages/order-details'

const App = () => {
  return (
    <Routes>
      <Route exact path="/login" element={<Login />} />
      <Route path="/:type" element={<OrderDetails />} />
      <Route path="/orders/:type" element={<Orders />} />
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default App
