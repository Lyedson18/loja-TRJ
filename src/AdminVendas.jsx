import React, { useState, useEffect } from 'react';
import { supabase } from "./utils/supabase";
import { useNavigate } from 'react-router-dom';

export default function AdminVendas() {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.user_metadata?.admin) {
      navigate('/home');
      return;
    }
    setUser(user);
    fetchVendas();
  };

  const fetchVendas = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('vendas')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setVendas(data || []);
    } else {
      console.error('Erro ao buscar vendas:', error);
    }
    setLoading(false);
  };

  const calcularTotalGeral = () => {
    return vendas.reduce((total, venda) => total + parseFloat(venda.total), 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px',
      background: '#0f172a',
      minHeight: '100vh',
      color: '#cbd5e1'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '2px solid #334155'
      }}>
        <h1 style={{ color: '#cbd5e1', margin: 0 }}>💰 Relatório de Vendas</h1>
        <button
          onClick={() => navigate('/home')}
          style={{
            padding: '10px 20px',
            background: '#334155',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          ← Voltar
        </button>
      </div>

      {/* Estatísticas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: '#1e293b',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #334155'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📦</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
            {vendas.length}
          </div>
          <div style={{ color: '#94a3b8' }}>Total de Vendas</div>
        </div>

        <div style={{
          background: '#1e293b',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #334155'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💰</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
            {formatCurrency(calcularTotalGeral())}
          </div>
          <div style={{ color: '#94a3b8' }}>Faturamento Total</div>
        </div>

        <div style={{
          background: '#1e293b',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #334155'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>👥</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>
            {new Set(vendas.map(v => v.user_email)).size}
          </div>
          <div style={{ color: '#94a3b8' }}>Clientes Únicos</div>
        </div>
      </div>

      {/* Lista de Vendas */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
          Carregando vendas...
        </div>
      ) : (
        <div style={{
          background: '#1e293b',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #334155'
        }}>
          {vendas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              Nenhuma venda encontrada
            </div>
          ) : (
            vendas.map((venda) => (
              <div
                key={venda.id}
                style={{
                  padding: '20px',
                  borderBottom: '1px solid #334155'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#cbd5e1', fontSize: '1.1rem' }}>
                      Venda #{venda.id.slice(0, 8)}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                      <strong>Cliente:</strong> {venda.user_email} • 
                      <strong> Data:</strong> {formatDate(venda.created_at)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#10b981' }}>
                      {formatCurrency(venda.total)}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                      {venda.forma_pagamento} • {venda.frete}
                    </div>
                  </div>
                </div>

                {/* Produtos */}
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>
                    📦 Produtos:
                  </div>
                  {venda.produtos.map((produto, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px',
                      background: '#0f172a',
                      borderRadius: '6px',
                      marginBottom: '5px',
                      fontSize: '0.9rem'
                    }}>
                      <span>{produto.title} × {produto.quantity}</span>
                      <span>{formatCurrency(produto.price * produto.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Endereço */}
                {venda.endereco_entrega && (
                  <div style={{
                    padding: '10px',
                    background: '#0f172a',
                    borderRadius: '6px',
                    fontSize: '0.9rem'
                  }}>
                    <strong>🏠 Endereço de Entrega:</strong> {venda.endereco_entrega.nome}, {venda.endereco_entrega.rua}, {venda.endereco_entrega.cidade} - {venda.endereco_entrega.estado}, {venda.endereco_entrega.cep}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}