import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';

export default function Categories() {
  const navigate = useNavigate();
  const { cartItems } = useContext(CartContext);
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div
      className="products-list"
      style={{
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        minHeight: '80vh',
        paddingTop: 40,
        paddingBottom: 40,
        textAlign: 'center',
        color: '#cbd5e1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '25px',
        position: 'relative',
      }}
    >
      <h2 style={{ marginBottom: 30, fontWeight: '900' }}>
        Categorias Disponíveis⏬
      </h2>

      <button
        onClick={() => navigate('/checkout')}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#3b82f6',
          fontSize: '2.4rem',
          userSelect: 'none',
        }}
        aria-label="Ir para checkout"
      >
        🛒
        {totalQuantity > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-10px',
              right: '-12px',
              background: 'red',
              color: 'white',
              borderRadius: '50%',
              padding: '3px 8px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
            }}
          >
            {totalQuantity}
          </span>
        )}
      </button>

      <button
        onClick={() => navigate('/shop?category=laptops')}
        style={buttonStyle}
        onMouseEnter={hoverIn}
        onMouseLeave={hoverOut}
      >
        Notebooks
      </button>

      <button
        onClick={() => navigate('/fragrances')}
        style={buttonStyle}
        onMouseEnter={hoverIn}
        onMouseLeave={hoverOut}
      >
        Fragrances
      </button>

      <button
        onClick={() => navigate('/motorcycle')}
        style={buttonStyle}
        onMouseEnter={hoverIn}
        onMouseLeave={hoverOut}
      >
        Motorcycle
      </button>

      <button
        onClick={() => navigate('/sunglasses')}
        style={buttonStyle}
        onMouseEnter={hoverIn}
        onMouseLeave={hoverOut}
      >
        Sunglasses
      </button>

      <button
        onClick={() => navigate('/beauty')}
        style={buttonStyle}
        onMouseEnter={hoverIn}
        onMouseLeave={hoverOut}
      >
        Beauty
      </button>

      {/* Botão novo para Furniture */}
      <button
        onClick={() => navigate('/furniture')}
        style={buttonStyle}
        onMouseEnter={hoverIn}
        onMouseLeave={hoverOut}
      >
        Furniture
      </button>
    </div>
  );
}

const buttonStyle = {
  padding: '18px 50px',
  fontWeight: '700',
  fontSize: '1.3rem',
  borderRadius: 12,
  cursor: 'pointer',
  background: 'linear-gradient(90deg, #2563eb, #3b82f6)',
  color: 'white',
  border: 'none',
  boxShadow: '0 6px 20px rgba(37, 99, 235, 0.85)',
  transition: 'background 0.3s ease, box-shadow 0.3s ease',
  userSelect: 'none',
  width: '250px',
};

function hoverIn(e) {
  e.currentTarget.style.background = 'linear-gradient(90deg, #3b82f6, #2563eb)';
  e.currentTarget.style.boxShadow = '0 8px 28px rgba(37, 99, 235, 1)';
}

function hoverOut(e) {
  e.currentTarget.style.background = 'linear-gradient(90deg, #2563eb, #3b82f6)';
  e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.85)';
}
