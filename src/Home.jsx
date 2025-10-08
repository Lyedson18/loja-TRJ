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
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };
  return (
    <div className="home" style={{ position: 'relative', minHeight: '100vh' }}>
      {/**/}
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
          <div
            style={{
              background: '#16a34a',
              color: 'white',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: '500',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              whiteSpace: 'nowrap',
            }}
          >
            Conta logada - {user.user_metadata?.name || user.email}
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: '#dc2626',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              transition: 'background 0.2s ease-in-out',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#b91c1c')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#dc2626')}
          >
            Trocar de Conta
          </button>
        </div>
      )}
      <h1>
        Bem-vindo ao <span className="highlight">(TRJ) Shopping!)</span>
      </h1>
      <p className="lead">
        Encontre os melhores produtos para todas as suas necessidades!
      </p>
      <p className="sublead">
        Qualidade, tecnologia e preços incríveis para você!
      </p>
      <Link to="/categories" className="button-link">
        Produtos da Loja Física 🛒
      </Link>
      <Link to="/manage-products" className="button-link">
        Produtos Loja Online 🛒
      </Link>
    </div>
  );
}