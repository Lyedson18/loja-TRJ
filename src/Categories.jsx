import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';

export default function Categories() {
  const navigate = useNavigate();
  const { cartItems } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState('');
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const categories = [
    {
      label: 'Notebooks',
      path: '/shop?category=laptops',
      products: [
        'Apple MacBook Pro 14 Inch Space Grey',
        'Asus Zenbook Pro Dual Screen Laptop',
        'Huawei Matebook X Pro',
        'Lenovo Yoga 920',
        'New DELL XPS 13 9300 Laptop',
      ],
    },
    {
      label: 'Perfumes',
      path: '/fragrances',
      products: [
        'Calvin Klein CK One',
        'Chanel Coco Noir Eau De',
        "Dior J'adore",
        'Dolce Shine Eau de',
        'Gucci Bloom Eau de',
      ],
    },
    {
      label: 'Motos',
      path: '/motorcycle',
      products: [
        'Generic Motorcycle',
        'Kawasaki Z800',
        'MotoGP CI.H1',
        'Scooter Motorcycle',
        'Sportbike Motorcycle',
      ],
    },
    {
      label: 'Óculos',
      path: '/sunglasses',
      products: [
        'Black Sun Glasses',
        'Classic Sun Glasses',
        'Green and Black Glasses',
        'Party Glasses',
        'Sunglasses',
      ],
    },
    {
      label: "Maquiagem",
      path: '/beauty',
      products: [
        'Essence Mascara Lash Princess',
        'Eyeshadow Palette with Mirror',
        'Powder Canister',
        'Red Lipstick',
        'Red Nail Polish',
      ],
    },
    {
      label: 'Tênis para Homens',
      path: '/mens-shoes',
      products: [
        'Nike Air Jordan 1 Red And Black',
        'Nike Baseball Cleats',
        'Puma Future Rider Trainers',
        'Sports Sneakers Off White & Red',
        'Sports Sneakers Off White Red',
      ],
    },
    {
      label: 'Camisa para Homens',
      path: '/mens-shirts',
      products: [
        'Blue & Black Check Shirt',
        'Gigabyte Aorus Men Tshirt',
        'Man Plaid Shirt',
        'Man Short Sleeve Shirt',
        'Men Check Shirt',
      ],
    },
    {
      label: 'Móveis',
      path: '/furniture',
      products: [
        'Annibale Colombo Bed',
        'Annibale Colombo Sofa',
        'Bedside Table African Cherry',
        'Knoll Saarinen Executive Conference Chair',
        'Wooden Bathroom Sink With Mirror',
      ],
    },
  ];

  const lowerSearch = searchTerm.toLowerCase();
  const filteredCategories = categories.filter((cat) => {
    const categoryMatch = cat.label.toLowerCase().includes(lowerSearch);
    const productMatch = cat.products.some((prod) =>
      prod.toLowerCase().includes(lowerSearch)
    );
    return categoryMatch || productMatch;
  });

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
      {/* Botão voltar para Home */}
      <div
        onClick={() => navigate('/home')}
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          background: '#ef4444',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '12px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 0 10px rgba(239, 68, 68, 0.7)',
          userSelect: 'none',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#dc2626')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#ef4444')}
      >
        ⬅ Voltar para Página Inicial
      </div>

      <div
        onClick={() => navigate('/loja-online')}
        style={{
          position: 'absolute',
          top: 60, // Colocado 40px abaixo do botão Home
          left: 20,
          background: '#10b981',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '12px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 0 10px rgba(16, 185, 129, 0.7)',
          userSelect: 'none',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#059669')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#10b981')}
      >
        🛒ㅤㅤㅤLoja Onlineㅤㅤㅤ
      </div>

      <h2 style={{ marginBottom: 30, fontWeight: '900' }}>
        Produtos Disponíveis ⏬
      </h2>
      
      <input
        type="text"
        placeholder="Pesquisar categoria ou produto..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: '12px 20px',
          borderRadius: '10px',
          border: 'none',
          width: '250px',
          fontSize: '1rem',
          marginBottom: '20px',
        }}
      />

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

      {/**/}
      {filteredCategories.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            width: '100%',
            maxWidth: '900px',
            justifyItems: 'center',
          }}
        >
          {filteredCategories.map((cat) => {
            const matchingProducts = cat.products.filter((prod) =>
              prod.toLowerCase().includes(lowerSearch)
            );
            return (
              <div key={cat.label} style={{ textAlign: 'center' }}>
                <button
                  onClick={() => navigate(cat.path)}
                  style={buttonStyle}
                  onMouseEnter={hoverIn}
                  onMouseLeave={hoverOut}
                >
                  {cat.label}
                </button>
                {matchingProducts.length > 0 && (
                  <ul
                    style={{
                      color: '#94a3b8',
                      marginTop: 5,
                      paddingLeft: 0,
                      listStyle: 'none',
                    }}
                  >
                    {matchingProducts.map((prod) => (
                      <li key={prod} style={{ fontSize: '0.9rem' }}>
                        <strong>{prod}</strong>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ color: '#94a3b8' }}>Nenhuma categoria ou produto encontrado.</p>
      )}
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