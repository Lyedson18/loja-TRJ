import React, { useState, useEffect } from 'react';
import { supabase } from "./utils/supabase";
import { useNavigate } from 'react-router-dom';

export default function AdminVendas() {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    console.log('🔐 Verificando usuário...');
    const { data: { user } } = await supabase.auth.getUser();
    console.log('👤 Usuário encontrado:', user);
    
    if (!user || !user.user_metadata?.admin) {
      console.log('❌ Usuário não é admin, redirecionando...');
      navigate('/home');
      return;
    }
    setUser(user);
    fetchVendas();
  };

  const fetchVendas = async () => {
    setLoading(true);
    console.log('🔄 Buscando vendas no Supabase...');
    
    try {
      const { data, error, count } = await supabase
        .from('vendas')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      console.log('📊 Resultado da query:', { data, error, count });

      if (error) {
        console.error('❌ Erro ao buscar vendas:', error);
        setDebugInfo(`Erro: ${error.message}`);
      } else {
        console.log('✅ Vendas carregadas com sucesso:', data);
        setVendas(data || []);
        setDebugInfo(`Numero de vendas: ${data?.length || 0} `);
      }
    } catch (error) {
      console.error('❌ Erro inesperado ao buscar vendas:', error);
      setDebugInfo(`Erro inesperado: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const calcularTotalGeral = () => {
    return vendas.reduce((total, venda) => total + parseFloat(venda.total || 0), 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não disponível';
    try {
      return new Date(dateString).toLocaleString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  const formatCurrency = (value) => {
    const numValue = parseFloat(value || 0);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue);
  };

  // Função para renderizar produtos de forma segura
  const renderProdutos = (produtos) => {
    if (!produtos || !Array.isArray(produtos)) {
      return <div style={{ color: '#ef4444', fontStyle: 'italic' }}>Nenhum produto encontrado</div>;
    }

    return produtos.map((produto, index) => {
      if (!produto) return null;
      
      return (
        <div key={index} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px',
          background: '#0f172a',
          borderRadius: '6px',
          marginBottom: '8px',
          fontSize: '0.9rem',
          border: '1px solid #334155'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', color: '#cbd5e1' }}>
              {produto.title || 'Produto sem nome'}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
              Quantidade: {produto.quantity || 1} • Preço unitário: {formatCurrency(produto.price)}
            </div>
            {produto.thumbnail && (
              <img 
                src={produto.thumbnail} 
                alt={produto.title}
                style={{
                  width: '40px',
                  height: '40px',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  marginTop: '5px',
                  border: '1px solid #334155'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
          </div>
          <div style={{ color: '#10b981', fontWeight: '600', minWidth: '80px', textAlign: 'right' }}>
            {formatCurrency((produto.price || 0) * (produto.quantity || 1))}
          </div>
        </div>
      );
    });
  };

  // Função para renderizar endereço de forma segura
  const renderEndereco = (endereco) => {
    if (!endereco) {
      return <div style={{ color: '#f59e0b', fontStyle: 'italic' }}>Endereço não informado</div>;
    }

    return (
      <div style={{
        padding: '12px',
        background: '#0f172a',
        borderRadius: '6px',
        fontSize: '0.9rem',
        border: '1px solid #334155',
        marginTop: '10px'
      }}>
        <div style={{ fontWeight: '600', color: '#cbd5e1', marginBottom: '5px' }}>
          🏠 Endereço de Entrega:
        </div>
        <div style={{ color: '#94a3b8' }}>
          <strong>Nome:</strong> {endereco.nome || 'Não informado'} <br/>
          <strong>Endereço:</strong> {endereco.rua || 'Não informado'} <br/>
          <strong>Cidade:</strong> {endereco.cidade || 'Não informado'} - {endereco.estado || 'Não informado'} <br/>
          <strong>CEP:</strong> {endereco.cep || 'Não informado'}
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: '#0f172a',
        color: '#cbd5e1'
      }}>
        Carregando...
      </div>
    );
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
        <h1 style={{ color: '#cbd5e1', margin: 0 }}>💰 Relatório de Vendas:</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Informações de Debug */}
          <div style={{
            padding: '8px 12px',
            background: '#1e293b',
            borderRadius: '6px',
            fontSize: '0.8rem',
            color: '#94a3b8',
            border: '1px solid #334155'
          }}>
            {debugInfo || 'Clique em atualizar'}
          </div>
          
          <button
            onClick={fetchVendas}
            style={{
              padding: '10px 20px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            🔄 Atualizar
          </button>
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
      </div>

      {/* Estatísticas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          border: '1px solid #334155',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📦</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#3b82f6' }}>
            {vendas.length}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Total de Vendas</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          border: '1px solid #334155',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💰</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#10b981' }}>
            {formatCurrency(calcularTotalGeral())}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Faturamento Total</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          border: '1px solid #334155',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>👥</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#8b5cf6' }}>
            {new Set(vendas.map(v => v.user_email)).size}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Clientes Únicos</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          border: '1px solid #334155',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📊</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#f59e0b' }}>
            {vendas.reduce((total, venda) => total + (venda.produtos?.length || 0), 0)}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Itens Vendidos</div>
        </div>
      </div>

      {/* Lista de Vendas */}
      {loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px', 
          color: '#94a3b8',
          background: '#1e293b',
          borderRadius: '12px',
          border: '1px solid #334155'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏳</div>
          <div style={{ fontSize: '1.2rem' }}>Carregando vendas...</div>
        </div>
      ) : (
        <div style={{
          background: '#1e293b',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #334155',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
          {vendas.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px', 
              color: '#94a3b8',
              background: '#1e293b'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🛒</div>
              <div style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Nenhuma venda encontrada</div>
              <div style={{ fontSize: '1rem', color: '#64748b', marginBottom: '20px' }}>
                As vendas aparecerão aqui quando os clientes finalizarem compras na loja online.
              </div>
              <div style={{ fontSize: '0.9rem', color: '#ef4444', background: '#1e293b', padding: '10px', borderRadius: '6px', border: '1px solid #334155' }}>
                <strong>Debug Info:</strong> {debugInfo}
              </div>
            </div>
          ) : (
            vendas.map((venda, index) => (
              <div
                key={venda.id || index}
                style={{
                  padding: '25px',
                  borderBottom: '1px solid #334155',
                  background: index % 2 === 0 ? '#1e293b' : '#1a2438',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#243047';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = index % 2 === 0 ? '#1e293b' : '#1a2438';
                }}
              >
                {/* Cabeçalho da Venda */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px', 
                      marginBottom: '8px' 
                    }}>
                      <div style={{ 
                        fontWeight: '900', 
                        color: '#cbd5e1', 
                        fontSize: '1.3rem',
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        padding: '8px 16px',
                        borderRadius: '8px'
                      }}>
                        Venda #{venda.id ? venda.id.slice(0, 8).toUpperCase() : 'N/A'}
                      </div>
                      <div style={{
                        padding: '4px 12px',
                        background: venda.forma_pagamento === 'pix' ? '#10b981' : 
                                   venda.forma_pagamento === 'boleto' ? '#f59e0b' : '#3b82f6',
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        {venda.forma_pagamento || 'cartao'}
                      </div>
                    </div>
                    
                    <div style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5' }}>
                      <strong>👤 Cliente:</strong> {venda.user_email || 'Email não disponível'} <br/>
                      <strong>📅 Data:</strong> {formatDate(venda.created_at)} <br/>
                      <strong>🚚 Frete:</strong> {venda.frete || 'Não especificado'}
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right', minWidth: '150px' }}>
                    <div style={{ 
                      fontSize: '1.8rem', 
                      fontWeight: '900', 
                      color: '#10b981',
                      background: 'linear-gradient(135deg, #059669, #047857)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      marginBottom: '5px'
                    }}>
                      {formatCurrency(venda.total)}
                    </div>
                    <div style={{ 
                      color: '#94a3b8', 
                      fontSize: '0.9rem',
                      background: '#0f172a',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid #334155'
                    }}>
                      {venda.produtos?.length || 0} itens
                    </div>
                  </div>
                </div>

                {/* Produtos */}
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ 
                    fontWeight: '700', 
                    color: '#cbd5e1', 
                    marginBottom: '12px',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    📦 Produtos Comprados
                  </div>
                  {renderProdutos(venda.produtos)}
                </div>

                {/* Endereço */}
                {renderEndereco(venda.endereco_entrega)}

                {/* Informações Adicionais */}
                <div style={{
                  display: 'flex',
                  gap: '15px',
                  marginTop: '15px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    padding: '8px 12px',
                    background: '#0f172a',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    color: '#94a3b8',
                    border: '1px solid #334155'
                  }}>
                    <strong>ID:</strong> {venda.id || 'N/A'}
                  </div>
                  <div style={{
                    padding: '8px 12px',
                    background: '#0f172a',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    color: '#94a3b8',
                    border: '1px solid #334155'
                  }}>
                    <strong>User ID:</strong> {venda.user_id ? venda.user_id.slice(0, 8) + '...' : 'N/A'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Botões de Debug */}
      <div style={{ textAlign: 'center', marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={() => {
            console.log('📊 Dados completos das vendas:', vendas);
            console.log('👤 Usuário atual:', user);
            alert('Dados das vendas logados no console! Verifique o console do navegador.');
          }}
          style={{
            padding: '8px 16px',
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          🔍 Ver Dados no Console
        </button>
        
        <button
          onClick={async () => {
            // Testar conexão direta com Supabase
            const { data, error } = await supabase
              .from('vendas')
              .select('count')
              .single();
            
            console.log('🧪 Teste de conexão Supabase:', { data, error });
            alert(`Teste de conexão: ${error ? 'Erro: ' + error.message : 'Sucesso! Count: ' + data?.count}`);
          }}
          style={{
            padding: '8px 16px',
            background: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          🧪 Testar Conexão
        </button>
      </div>
    </div>
  );
}