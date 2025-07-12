import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Home';
import Categories from './Categories';
import ProductsList from './ProductsList';
import ProductDetail from './ProductDetail';
import Checkout from './Checkout';
import { CartProvider } from './CartContext';

import Fragrances from './Fragrances';
import FragrancesDetail from './FragrancesDetail';
import Motorcycle from './Motorcycle';
import ProductDetailMotorcycle from './ProductDetailMotorcycle';

import Sunglasses from './Sunglasses';
import SunglassesDetail from './SunglassesDetail';

import Beauty from './Beauty';
import BeautyDetail from './BeautyDetail';

// Import dos novos componentes para Furniture
import Furniture from './Furniture';
import FurnitureDetail from './FurnitureDetail';

function App() {
  return (
    <CartProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />

            {/* Laptops */}
            <Route path="/shop" element={<ProductsList />} />
            <Route path="/product/:productId" element={<ProductDetail />} />

            {/* Checkout */}
            <Route path="/checkout" element={<Checkout />} />

            {/* Fragrances */}
            <Route path="/fragrances" element={<Fragrances />} />
            <Route path="/fragrances/product/:productId" element={<FragrancesDetail />} />

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
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
