import React, { useEffect, useState, useContext } from "react";
import { supabase } from "./utils/supabase";
import { useNavigate } from "react-router-dom";
import { CartContext } from "./CartContext";

export default function LojaOnline() {
  const navigate = useNavigate();
  const { cartItems, setCartItems } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("product_2v")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) setErro("Erro ao buscar produtos");
      else setProducts(data);
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Confirma a exclusão do produto?");
    if (!confirm) return;

    const { error } = await supabase.from("product_2v").delete().eq("id", id);
    if (error) setErro("Erro ao deletar produto");
    else setSucesso("Produto deletado com sucesso!");
  };

  const handleAddToCart = (product) => {
    const itemExists = cartItems.find((item) => item.id === product.id);
    if (itemExists) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
    setSucesso(`Produto "${product.title}" adicionado ao carrinho!`);
    setTimeout(() => setSucesso(""), 2000);
  };

  const filteredProducts = products.filter(prod =>
    prod.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prod.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="products-list" style={{ position: 'relative', minHeight: '100vh', paddingTop: '40px' }}>
      {/* Botão do Carrinho */}
      <button
        onClick={() => navigate('/checkout')}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
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
        {cartItems.length > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-10px',
              right: '-12px',
              background: 'red',
              color: 'white',
              borderRadius: '50%',
              padding: '3px 8px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
            }}
          >
            {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        )}
      </button>

      <h2 style={{ textAlign: 'center', color: '#cbd5e1', marginBottom: '30px', fontWeight: '900' }}>
        Loja Online 🛒
      </h2>

      {/* BARRA DE PESQUISA CENTRALIZADA */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Pesquisar produto na loja online..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '12px 20px',
            fontSize: '16px',
            borderRadius: '10px',
            border: 'none',
            background: '#0f172a',
            color: '#cbd5e1',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            textAlign: 'center'
          }}
        />
      </div>

      {/* Botões de Navegação */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate('/home')}
          className="button-link"
          style={{ padding: '12px 25px', fontSize: '1rem' }}
        >
          Voltar para Página Inicial
        </button>
        <button
          onClick={() => navigate('/categories')}
          className="button-link"
          style={{ padding: '12px 25px', fontSize: '1rem', backgroundColor: '#3b82f6' }}
        >
          Loja Física
        </button>
      </div>

      {erro && (
        <div style={{
          color: 'red',
          textAlign: 'center',
          marginBottom: '20px',
          padding: '10px',
          background: 'rgba(220, 38, 38, 0.1)',
          borderRadius: '8px'
        }}>
          {erro}
        </div>
      )}
      
      {sucesso && (
        <div style={{
          color: 'green',
          textAlign: 'center',
          marginBottom: '20px',
          padding: '10px',
          background: 'rgba(34, 197, 94, 0.1)',
          borderRadius: '8px'
        }}>
          {sucesso}
        </div>
      )}

      {/* Lista de Produtos */}
      <ul className="products-ul">
        {filteredProducts.map((p) => (
          <li key={p.id} className="product-item">
            <div className="product-link">
              <img
                src={p.thumbnail}
                alt={p.title}
                className="product-image"
              />
              <div className="product-info">{p.title}</div>
              <div className="product-price">${p.price}</div>
              <p style={{ 
                color: '#94a3b8', 
                fontSize: '0.9rem', 
                margin: '8px 0',
                textAlign: 'center'
              }}>
                {p.description}
              </p>

              {user && (
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px' }}>
                  {(user.user_metadata?.admin || p.user_id === user.id) && (
                    <button
                      onClick={() => handleDelete(p.id)}
                      style={{
                        padding: '8px 16px',
                        background: '#dc2626',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#b91c1c'}
                      onMouseOut={(e) => e.currentTarget.style.background = '#dc2626'}
                    >
                      Deletar
                    </button>
                  )}

                  {(!user.user_metadata?.vendedor) && (
                    <button
                      onClick={() => handleAddToCart(p)}
                      style={{
                        padding: '8px 16px',
                        background: '#16a34a',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#15803d'}
                      onMouseOut={(e) => e.currentTarget.style.background = '#16a34a'}
                    >
                      Adicionar ao Carrinho
                    </button>
                  )}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      {products.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          color: '#94a3b8', 
          marginTop: '50px',
          fontSize: '1.1rem'
        }}>
          Nenhum produto cadastrado na loja online.
        </div>
      )}

      {products.length > 0 && filteredProducts.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          color: '#94a3b8', 
          marginTop: '50px',
          fontSize: '1.1rem'
        }}>
          Nenhum produto encontrado para "{searchTerm}".
        </div>
      )}
    </div>
  );
}