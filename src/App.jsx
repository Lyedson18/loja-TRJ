import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './CartContext';

import Home from './Home';
import Categories from './Categories';
import ProductsList from './ProductsList';
import ProductDetail from './ProductDetail';
import Checkout from './Checkout';
import Fragrances from './Fragrances';
import FragrancesDetail from './FragrancesDetail';
import MensShirts from './MensShirts';
import MensShirtsDetail from './MensShirtsDetail';
import Motorcycle from './Motorcycle';
import ProductDetailMotorcycle from './ProductDetailMotorcycle';
import Sunglasses from './Sunglasses';
import SunglassesDetail from './SunglassesDetail';
import Beauty from './Beauty';
import BeautyDetail from './BeautyDetail';
import Furniture from './Furniture';
import FurnitureDetail from './FurnitureDetail';
import MensShoes from './MensShoes';
import MensShoesDetail from './MensShoesDetail';
import Login from './Login';
import Register from './Register';
import AdminVendas from './AdminVendas';

// NOVAS PÁGINAS
import LojaOnline from './LojaOnline';
import AddProduct from './AddProduct';
import UserLogado from './UserLogado';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/minha-conta" element={<UserLogado />} />

          {/* Loja Online */}
          <Route path="/loja-online" element={<LojaOnline />} />

          {/* Cadastro de produtos (só admin/vendedor) */}
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/admin-vendas" element={<AdminVendas />} />

          {/* Categorias e produtos existentes */}
          <Route path="/categories" element={<Categories />} />
          <Route path="/shop" element={<ProductsList />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Outras categorias */}
          <Route path="/fragrances" element={<Fragrances />} />
          <Route path="/fragrances/product/:productId" element={<FragrancesDetail />} />
          <Route path="/mens-shirts" element={<MensShirts />} />
          <Route path="/mens-shirts/product/:productId" element={<MensShirtsDetail />} />
          <Route path="/motorcycle" element={<Motorcycle />} />
          <Route path="/motorcycle/product/:productId" element={<ProductDetailMotorcycle />} />
          <Route path="/sunglasses" element={<Sunglasses />} />
          <Route path="/sunglasses/product/:productId" element={<SunglassesDetail />} />
          <Route path="/beauty" element={<Beauty />} />
          <Route path="/beauty/product/:productId" element={<BeautyDetail />} />
          <Route path="/furniture" element={<Furniture />} />
          <Route path="/furniture/product/:productId" element={<FurnitureDetail />} />
          <Route path="/mens-shoes" element={<MensShoes />} />
          <Route path="/mens-shoes/product/:productId" element={<MensShoesDetail />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;