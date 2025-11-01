import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "./utils/supabase";

export default function UserLogado() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        navigate('/');
      }
      setLoading(false);
    };
    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getAccountType = () => {
    if (!user) return '';
    const meta = user.user_metadata || {};
    if (meta.admin) return 'Administrador';
    if (meta.vendedor) return 'Vendedor';
    return 'Cliente';
  };

  const getAccountBadgeColor = () => {
    if (!user) return '#6b7280';
    const meta = user.user_metadata || {};
    if (meta.admin) return '#dc2626';
    if (meta.vendedor) return '#2563eb';
    return '#16a34a';
  };

  if (loading) {
    return (
      <div className="home" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: '#cbd5e1', fontSize: '1.2rem' }}>Carregando...</div>
      </div>
    );
  }

  return (
    <div className="home" style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      padding: '60px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h1 style={{ marginBottom: '2rem', fontWeight: '900', textAlign: 'center' }}>
        <span className="highlight">Minha Conta</span>
      </h1>
      {user && (
        <div style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          borderRadius: '20px',
          padding: '50px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          maxWidth: '600px',
          width: '100%',
          margin: '0 auto',
          border: '1px solid #334155',
          minHeight: '500px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 30px auto',
              fontSize: '2.5rem',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
            }}>
              {user.email ? user.email[0].toUpperCase() : 'U'}
            </div>

            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
              <div style={{
                background: getAccountBadgeColor(),
                color: 'white',
                padding: '10px 20px',
                borderRadius: '25px',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'inline-block',
                marginBottom: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}>
                {getAccountType()}
              </div>
              
              <h3 style={{ 
                color: '#cbd5e1', 
                marginBottom: '12px',
                fontSize: '1.6rem',
                fontWeight: '700'
              }}>
                {user.user_metadata?.nome || '⏬Usuário⏬'}
              </h3>
              
              <p style={{ 
                color: '#94a3b8', 
                fontSize: '1.2rem',
                margin: 0,
                wordBreak: 'break-all'
              }}>
                {user.email}
              </p>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: '15px',
              padding: '25px',
              marginBottom: '30px',
              border: '1px solid #334155'
            }}>
              <h4 style={{ 
                color: '#cbd5e1', 
                marginBottom: '20px',
                fontSize: '1.3rem',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                📋 Detalhes da Conta ⏬
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#94a3b8', fontWeight: '500' }}>ID do Usuário:</span>
                  <span style={{ 
                    color: '#cbd5e1', 
                    fontWeight: '500', 
                    fontSize: '0.85rem',
                    background: '#0f172a',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontFamily: 'monospace'
                  }}>
                    {user.id.substring(0, 12)}...
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#94a3b8', fontWeight: '500' }}>Email Verificado:</span>
                  <span style={{ 
                    color: user.email_confirmed_at ? '#16a34a' : '#dc2626', 
                    fontWeight: '600',
                    background: user.email_confirmed_at ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                    padding: '6px 12px',
                    borderRadius: '8px'
                  }}>
                    {user.email_confirmed_at ? '✅ Verificado' : '❌ Não Verificado'}
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#94a3b8', fontWeight: '500' }}>Data de Criação:</span>
                  <span style={{ 
                    color: '#cbd5e1', 
                    fontWeight: '500',
                    background: '#0f172a',
                    padding: '6px 12px',
                    borderRadius: '8px'
                  }}>
                    {new Date(user.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#94a3b8', fontWeight: '500' }}>Último Login:</span>
                  <span style={{ 
                    color: '#cbd5e1', 
                    fontWeight: '500',
                    background: '#0f172a',
                    padding: '6px 12px',
                    borderRadius: '8px'
                  }}>
                    {new Date(user.last_sign_in_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button
              onClick={() => navigate('/home')}
              className="button-link"
              style={{
                padding: '16px',
                fontSize: '1.1rem',
                fontWeight: '600',
                width: '100%',
                marginBottom: '10px'
              }}
            >
              🏠 Voltar para Página Inicial
            </button>
            
            <button
              onClick={handleLogout}
              style={{
                padding: '16px',
                fontSize: '1.1rem',
                fontWeight: '600',
                background: 'linear-gradient(90deg, #dc2626, #b91c1c)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
                transition: 'all 0.3s ease',
                width: '100%'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #b91c1c, #991b1b)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #dc2626, #b91c1c)'}
            >
              🔓 Trocar de Conta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
