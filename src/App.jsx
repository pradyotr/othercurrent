import { Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Home from './pages/home'
import Orders from './pages/orders'
import './config/fetch-interceptor'
import OrderDetails from './pages/order-details'
import SubmitPage from './pages/final-submit'

const App = () => {
  return (
    <Routes>
      <Route exact path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/orders/:type" element={<Orders />} />
      <Route path="/:type" element={<OrderDetails />} />
      <Route path="/submit" element={<SubmitPage />} /> 
    </Routes>
  )
}

export default App
