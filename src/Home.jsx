import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "./utils/supabase";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        navigate('/');
      }
    };
    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        navigate('/');
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  const getAccountType = () => {
    if (!user) return '';
    const meta = user.user_metadata || {};
    if (meta.admin) return 'Administrador';
    if (meta.vendedor) return 'Vendedor';
    return 'Cliente';
  };

  const isAdminOrVendedor = () => {
    if (!user) return false;
    const meta = user.user_metadata || {};
    return meta.admin || meta.vendedor;
  };

  const isAdmin = () => {
    if (!user) return false;
    const meta = user.user_metadata || {};
    return meta.admin;
  };

  const podeComprar = () => {
    if (!user) return false;
    const meta = user.user_metadata || {};
    // Só clientes normais podem comprar (não admin, não vendedor)
    return !meta.admin && !meta.vendedor;
  };

  return (
    <div className="home" style={{ position: 'relative', minHeight: '100vh' }}>
      {user && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <button
            onClick={() => navigate('/minha-conta')}
            style={{
              background: '#16a34a',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '20px',
              fontSize: '1rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.4)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              minWidth: '200px',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#15803d';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#16a34a';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            title="Clique para ver detalhes da conta"
          >
            <span>🙎‍♂️</span>
            <span style={{ whiteSpace: 'nowrap' }}>
              {getAccountType()} - {user.email}
            </span>
          </button>
        </div>
      )}
      <h1>
        Bem-vindo ao <span className="highlight">(TRJ) Shop!</span>
      </h1>
      <p className="lead">
        Encontre os melhores produtos para todas as suas necessidades!
      </p>
      <p className="sublead">
        Qualidade, tecnologia e preços incríveis para você Consumidor!
      </p>

      {/* LOJA FÍSICA E ONLINE - TODOS PODEM VER (MENOS COMPRAR SE FOR VENDEDOR/ADMIN) */}
      <Link to="/categories" className="button-link">
        Loja Física 🛒
      </Link>
      <Link to="/loja-online" className="button-link">
        Loja Online 🛒
      </Link>

      {/* MENSAGEM PARA VENDEDORES E ADMINS SOBRE COMPRAS */}
      {!podeComprar() && user && (
        <div style={{
          background: '#1e293b',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          border: '2px solid #334155',
          marginBottom: '15px',
          maxWidth: '500px',
          margin: '0 auto 15px auto'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
            {user.user_metadata?.admin ? '👑' : '📊'}
          </div>
          <p style={{ color: '#94a3b8', lineHeight: '1.5', fontSize: '0.9rem' }}>
            {user.user_metadata?.admin 
              ? 'Como administrador, você pode visualizar as lojas mas não realizar compras.' 
              : 'Como vendedor, você pode visualizar as lojas mas não realizar compras no Online!.'
            }
          </p>
        </div>
      )}
    
      {/* CADASTRAR PRODUTOS - PARA ADMINS E VENDEDORES */}
      {isAdminOrVendedor() && (
        <Link to="/add-product" className="button-link">
          Cadastrar Novos Produtos na Loja Online! 🛒
        </Link>
      )}

      {/* RELATÓRIO DE VENDAS - APENAS PARA ADMINS */}
      {isAdmin() && (
        <Link to="/admin-vendas" className="button-link" style={{
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          border: 'none'
        }}>
          💰 Relatório de Vendas (Admin)
        </Link>
      )}
    </div>
  );
}