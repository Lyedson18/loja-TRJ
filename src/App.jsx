import React from 'react';
import { supabase } from "./utils/supabase";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Categories from './Categories';
import ProductsList from './ProductsList';
import ProductDetail from './ProductDetail';
import Checkout from './Checkout';
import { CartProvider } from './CartContext';
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
import ManageProducts from './ManageProducts';
import Product2vList from './Product2vList';

function App() {
  return (
    <CartProvider>
      <Router>
        <div>
          <Routes>
            {/* Login */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Home */}
            <Route path="/home" element={<Home />} />

            {/* Manage Products */}
            <Route path="/manage-products" element={<ManageProducts />} />

            {/* Categories */}
            <Route path="/categories" element={<Categories />} />

            {/* Laptops */}
            <Route path="/shop" element={<ProductsList />} />
            <Route path="/product/:productId" element={<ProductDetail />} />

            {/* Checkout */}
            <Route path="/checkout" element={<Checkout />} />

            {/* Fragrances */}
            <Route path="/fragrances" element={<Fragrances />} />
            <Route path="/fragrances/product/:productId" element={<FragrancesDetail />} />

            {/* MensShirts */}
            <Route path="/mens-shirts" element={<MensShirts />} />
            <Route path="/mens-shirts/product/:productId" element={<MensShirtsDetail />} />

            {/* Motorcycle */}
            <Route path="/motorcycle" element={<Motorcycle />} />
            <Route path="/motorcycle/product/:productId" element={<ProductDetailMotorcycle />} />

            {/* Sunglasses */}
            <Route path="/sunglasses" element={<Sunglasses />} />
            <Route path="/sunglasses/product/:productId" element={<SunglassesDetail />} />

            {/* Beauty */}
            <Route path="/beauty" element={<Beauty />} />
            <Route path="/beauty/product/:productId" element={<BeautyDetail />} />

            {/* Furniture */}
            <Route path="/furniture" element={<Furniture />} />
            <Route path="/furniture/product/:productId" element={<FurnitureDetail />} />

            {/* MensShoes */}
            <Route path="/mens-shoes" element={<MensShoes />} />
            <Route path="/mens-shoes/product/:productId" element={<MensShoesDetail />} />

            {/* Nova rota para product_2v */}
            <Route path="/product-2v" element={<Product2vList />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}
export default App;