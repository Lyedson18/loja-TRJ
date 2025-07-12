import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';

export default function Beauty() {
  const [products, setProducts] = useState([]);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const category = 'beauty';

  useEffect(() => {
    fetch(`https://dummyjson.com/products/category/${category}`)
      .then(res => res.json())
      .then(data => setProducts(data.products));
  }, [category]);

  return (
    <div className="products-list" style={{ position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <h2 style={{ color: '#cbd5e1', margin: 0 }}>
          Produtos de Beleza disponíveis:
        </h2>
        <button
          onClick={() => navigate('/checkout')}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#3b82f6',
            fontSize: '1.8rem',
            position: 'relative',
          }}
          aria-label="Ir para checkout"
        >
          🛒
          {cartItems.length > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-5px',
                right: '-10px',
                background: 'red',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 7px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
              }}
            >
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </button>
      </div>
      <ul className="products-ul">
        {products.map(prod => (
          <li key={prod.id} className="product-item">
            <Link to={`/beauty/product/${prod.id}`} className="product-link">
              <img
                src={prod.thumbnail}
                alt={prod.title}
                className="product-image"
              />
              <div className="product-info">{prod.title}</div>
              <div className="product-price">${prod.price}</div>
            </Link>
          </li>
        ))}
      </ul>
      <button
        className="back-home-button"
        onClick={() => navigate('/categories')}
      >
        Voltar para Categorias
      </button>
    </div>
  );
}
