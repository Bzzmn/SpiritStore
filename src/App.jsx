import './App.css'
import ItemListContainer from './components/ItemListContainer'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import ItemDetailContainer from './components/ItemDetailContainer'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Error404 from './components/Error404'
import CartContextProvider from './components/context/CartContext'
import Cart from './components/Cart'
import Checkout from './components/Checkout'

function App() {

  const greeting = 'Bienvenidos a nuestra tienda'

  return (
    <CartContextProvider>
      <Router>
          <NavBar />
          <div className='flex-grow flex flex-col'>
            <Routes>
              
                <Route path="/" element={<ItemListContainer greeting={ greeting }/>} />
                <Route path="/category/:id" element={<ItemListContainer greeting={ greeting }/>} />
                <Route path="/category/:id/:subId" element={<ItemListContainer greeting={ greeting }/>} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/item/:id" element={<ItemDetailContainer />} />
                <Route path="*" element={<Error404 />} />
            </Routes>
          </div>
          <Footer />
      </Router>
    </CartContextProvider>
  )
}

export default App
