import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetch('https://dummyjson.com/products/category/laptops')
      .then(res => res.json())
      .then(data => setProducts(data.products));
  }, []);
  return (
    <div className="products-list">
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#cbd5e1' }}>
        Laptops disponíveis:
      </h2>
      <ul className="products-ul">
        {products.map(prod => (
          <li key={prod.id} className="product-item">
            <Link to={`/product/${prod.id}`} className="product-link">
              <img src={prod.thumbnail} alt={prod.title} className="product-image" />
              <div className="product-info">{prod.title}</div>
              <div className="product-price">${prod.price}</div>
            </Link>
          </li>
        ))}
      </ul>
      <button 
        className="back-home-button"
        onClick={() => navigate('/')}
      >
        Voltar para página inicial
      </button>
    </div>
  );
}