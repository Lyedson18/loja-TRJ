import React, { useState, useContext, useEffect } from 'react';
import { CartContext } from './CartContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from "./utils/supabase";
import pixQRCode from './pix.jpeg';

export default function Checkout() {
  const { cartItems, clearCart, setCartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState({
    nome: '',
    Rua: '',
    cidade: '',
    estado: '',
    cep: '',
    formaPagamento: 'cartao',
    parcelas: '1',
    frete: 'normal',
  });
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [redirecting, setRedirecting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({ ...prev, [name]: value }));
  };

  const handleIncrease = (id) => {
    const newCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(newCart);
  };

  const handleDecrease = (id) => {
    const newCart = cartItems
      .map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter(item => item.quantity > 0);
    setCartItems(newCart);
  };

  const fretePreco = customerData.frete === 'economico' ? 10
                   : customerData.frete === 'normal' ? 20
                   : customerData.frete === 'expresso' ? 50
                   : customerData.frete === 'ultra' ? 100
                   : 0;

  const totalProdutos = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalFinal = totalProdutos + fretePreco;

  // Efeito para o redirecionamento automático
  useEffect(() => {
    if (paymentConfirmed && countdown > 0 && !redirecting) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (paymentConfirmed && countdown === 0 && !redirecting) {
      setRedirecting(true);
      clearCart();
      navigate('/home');
    }
  }, [paymentConfirmed, countdown, redirecting, clearCart, navigate]);

  // FUNÇÃO PARA SALVAR VENDA NO SUPABASE
  const salvarVendaNoBanco = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const vendaData = {
        user_id: user?.id,
        user_email: user?.email || 'guest',
        produtos: cartItems,
        total: totalFinal,
        forma_pagamento: customerData.formaPagamento,
        frete: customerData.frete,
        endereco_entrega: {
          nome: customerData.nome,
          rua: customerData.Rua,
          cidade: customerData.cidade,
          estado: customerData.estado,
          cep: customerData.cep
        }
      };

      const { error } = await supabase
        .from('vendas')
        .insert(vendaData);

      if (error) {
        console.error('Erro ao salvar venda:', error);
      } else {
        console.log('✅ Venda salva no banco com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar venda:', error);
    }
  };

  const gerarDadosPix = () => {
    const chavePix = "(84)986204846";
    const nomeBeneficiario = "Lyedson Matheus dos Santos Silva";
    const cidadeBeneficiario = "Macau";
    
    return {
      chavePix,
      nomeBeneficiario,
      cidadeBeneficiario,
      valor: totalFinal.toFixed(2),
      transacaoId: `LEE${Date.now()}`,
    };
  };

  const gerarDadosBoleto = () => {
    const vencimento = new Date();
    vencimento.setDate(vencimento.getDate() + 3);
    
    const codigoBarras = "34191.79001 01043.510047 91020.150008 8 84410000015000";
    const linhaDigitavel = "34191.79001 01043.510047 91020.150008 8 84410000015000";
    
    return {
      codigoBarras,
      linhaDigitavel,
      vencimento: vencimento.toLocaleDateString('pt-BR'),
      valor: totalFinal.toFixed(2),
      numero: `001${Date.now().toString().slice(-9)}`,
      beneficiario: "Lyedson Matheus dos Santos Silva",
      documento: "09231023454"
    };
  };

  const handleFinalizar = async () => {
    if (customerData.formaPagamento === 'pix') {
      alert(`📱 Pagamento via PIX\n\n💳 Valor: R$ ${totalFinal.toFixed(2)}\n\nEscaneie o QR Code acima para pagar!\n\nApós o pagamento, seu pedido será processado.`);
      // Para PIX, vamos simular a confirmação após 2 segundos
      setTimeout(async () => {
        await salvarVendaNoBanco();
        setPaymentConfirmed(true);
        alert('✅ Pagamento PIX confirmado! Redirecionando para a página inicial...');
      }, 2000);
    } else if (customerData.formaPagamento === 'boleto') {
      alert(`📄 Boleto Gerado!\n\n💳 Valor: R$ ${totalFinal.toFixed(2)}\n\nUse o código de barras acima para pagar!\n\nApós a confirmação do pagamento, seu pedido será processado.`);
      // Para boleto, vamos simular a confirmação após 2 segundos
      setTimeout(async () => {
        await salvarVendaNoBanco();
        setPaymentConfirmed(true);
        alert('✅ Boleto confirmado! Redirecionando para a página inicial...');
      }, 2000);
    } else {
      const valorParcela = (totalFinal / parseInt(customerData.parcelas)).toFixed(2);
      alert(`🎉 Compra finalizada com sucesso!\n\n📦 Total a pagar: R$ ${totalFinal.toFixed(2)}\n💳 Parcelado em: ${customerData.parcelas}x de R$ ${valorParcela}\n\nObrigado pela compra!`);
      await salvarVendaNoBanco();
      setPaymentConfirmed(true);
    }
  };

  const handleVoltarLoja = () => {
    navigate('/categories');
  };

  const handleVoltarLojaOnline = () => {
    navigate('/loja-online');
  };

  // Função para redirecionar manualmente
  const handleRedirectToHome = () => {
    setRedirecting(true);
    clearCart();
    navigate('/home');
  };

  const dadosPix = gerarDadosPix();
  const dadosBoleto = gerarDadosBoleto();

  // Se o pagamento foi confirmado, mostrar tela de confirmação com contagem regressiva
  if (paymentConfirmed) {
    return (
      <div className="product-detail" style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', textAlign: 'center' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #10b981, #059669)', 
          padding: '40px', 
          borderRadius: '12px', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          color: 'white'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
          <h2 style={{ marginBottom: '15px', fontSize: '2rem', fontWeight: '900' }}>
            Compra Confirmada!
          </h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '10px', opacity: 0.9 }}>
            🎉 Obrigado pela sua compra!
          </p>
          <p style={{ fontSize: '1.1rem', marginBottom: '25px', opacity: 0.9 }}>
            Seu pedido foi processado com sucesso.
          </p>
          
          <div style={{ 
            background: 'rgba(255,255,255,0.2)', 
            padding: '20px', 
            borderRadius: '8px',
            marginBottom: '30px'
          }}>
            <h3 style={{ marginBottom: '15px', fontSize: '1.3rem' }}>📦 Resumo do Pedido</h3>
            <div style={{ textAlign: 'left', display: 'inline-block' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Total:</strong> R$ {totalFinal.toFixed(2)}
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Itens:</strong> {cartItems.length}
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Frete:</strong> {customerData.frete}
              </div>
              <div>
                <strong>Pagamento:</strong> {customerData.formaPagamento}
              </div>
            </div>
          </div>

          <div style={{ 
            fontSize: '1.3rem', 
            fontWeight: '700',
            background: 'rgba(255,255,255,0.3)',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            {redirecting ? (
              '🔄 Redirecionando...'
            ) : (
              `⏰ Redirecionando para Home em ${countdown} segundos...`
            )}
          </div>

          <button
            onClick={handleRedirectToHome}
            className="button-link"
            style={{
              padding: '15px 30px',
              fontSize: '1.1rem',
              fontWeight: '700',
              backgroundColor: 'white',
              color: '#10b981', // CORRIGIDO: era '#ffffffff'
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            🏠 Ir para Home Agora
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="product-detail" style={{ maxWidth: '800px', margin: '40px auto', padding: '30px' }}>
      <h2 style={{ textAlign: 'center', color: '#cbd5e1', marginBottom: '30px', fontWeight: '900' }}>
        🛒 Finalizar Compra
      </h2>

      <section style={{ marginBottom: '30px', background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
        <h3 style={{ marginBottom: '20px', color: '#cbd5e1', fontSize: '1.4rem', fontWeight: '700' }}>📋 Dados do Cliente</h3>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {['nome', 'Rua', 'cidade', 'estado', 'cep'].map(field => (
            <div key={field}>
              <label style={{ color: '#cbd5e1', marginBottom: '8px', display: 'block', fontWeight: '600' }}>
                {field.charAt(0).toUpperCase() + field.slice(1)}:
              </label>
              <input
                type="text"
                name={field}
                value={customerData[field]}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  background: '#0f172a',
                  color: '#cbd5e1',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#334155'}
              />
            </div>
          ))}
        </form>
      </section>

      <section style={{ marginBottom: '30px', background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
        <h3 style={{ marginBottom: '20px', color: '#cbd5e1', fontSize: '1.4rem', fontWeight: '700' }}>🚚 Opções de Frete</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[  
            { value: 'economico', label: '📦 Econômico (7-10 dias) - R$ 10,00', desc: 'Entrega padrão' },
            { value: 'normal', label: '🚛 Normal (5-7 dias) - R$ 20,00', desc: 'Entrega regular' },
            { value: 'expresso', label: '⚡ Expresso (1-2 dias) - R$ 50,00', desc: 'Entrega rápida' },
            { value: 'ultra', label: '🚀 Ultra Expresso (mesmo dia) - R$ 100,00', desc: 'Entrega imediata' },
          ].map(option => (
            <label key={option.value} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '15px',
              background: customerData.frete === option.value ? '#1e40af' : '#0f172a',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: customerData.frete === option.value ? '2px solid #3b82f6' : '1px solid #334155'
            }}>
              <input
                type="radio"
                name="frete"
                value={option.value}
                checked={customerData.frete === option.value}
                onChange={handleChange}
                style={{ marginRight: '12px', transform: 'scale(1.2)' }}
              />
              <div>
                <div style={{ color: '#cbd5e1', fontWeight: '600' }}>{option.label}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{option.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '30px', background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
        <h3 style={{ marginBottom: '20px', color: '#cbd5e1', fontSize: '1.4rem', fontWeight: '700' }}>💳 Forma de Pagamento</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {['cartao', 'boleto', 'pix'].map(metodo => (
            <label key={metodo} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '15px',
              background: customerData.formaPagamento === metodo ? '#1e40af' : '#0f172a',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: customerData.formaPagamento === metodo ? '2px solid #3b82f6' : '1px solid #334155'
            }}>
              <input
                type="radio"
                name="formaPagamento"
                value={metodo}
                checked={customerData.formaPagamento === metodo}
                onChange={handleChange}
                style={{ marginRight: '12px', transform: 'scale(1.2)' }}
              />
              <span style={{ color: '#cbd5e1', fontWeight: '600' }}>
                {metodo === 'cartao' ? '💳 Cartão de Crédito' : metodo === 'boleto' ? '📄 Boleto Bancário' : '📱 Pix'}
              </span>
            </label>
          ))}
        </div>
        
        {customerData.formaPagamento === 'cartao' && (
          <div style={{ marginTop: '20px' }}>
            <label style={{ color: '#cbd5e1', marginBottom: '8px', display: 'block', fontWeight: '600' }}>
              Parcelas:
            </label>
            <select
              name="parcelas"
              value={customerData.parcelas}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #334155',
                background: '#0f172a',
                color: '#cbd5e1',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              {[...Array(12).keys()].map(i => (
                <option key={i+1} value={i+1}>
                  {i+1}x de R$ {(totalFinal / (i+1)).toFixed(2)}
                </option>
              ))}
            </select>
          </div>
        )}

        {customerData.formaPagamento === 'pix' && (
          <div style={{ 
            marginTop: '25px', 
            padding: '20px', 
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            borderRadius: '12px',
            border: '2px solid #10b981'
          }}>
            <h4 style={{ color: '#10b981', marginBottom: '15px', textAlign: 'center', fontWeight: '700' }}>
              📱 Pagamento PIX para Lyedson
            </h4>
            
            <div style={{ 
              width: '250px', 
              height: '250px', 
              margin: '0 auto 20px auto',
              background: 'white',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '15px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}>
              <img 
                src={pixQRCode}
                alt="QR Code PIX"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '8px'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <div style="text-align: center; color: #666;">
                      <div style="font-size: 48px; margin-bottom: '10px';">📱</div>
                      <div>QR Code não carregou</div>
                      <div style="font-size: 12px; margin-top: 5px;">Verifique o arquivo pix.jpeg</div>
                    </div>
                  `;
                }}
              />
            </div>

            <div style={{ textAlign: 'center', color: '#cbd5e1', marginBottom: '15px' }}>
              <div style={{ fontWeight: '600', marginBottom: '5px', fontSize: '1.2rem' }}>
                Valor: R$ {totalFinal.toFixed(2)}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '10px' }}>
                Escaneie o QR Code com seu app bancário
              </div>
            </div>

            <div style={{ 
              background: '#0f172a', 
              padding: '15px', 
              borderRadius: '8px',
              marginTop: '15px'
            }}>
              <div style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '8px' }}>
                <strong>Chave PIX:</strong> {dadosPix.chavePix}
              </div>
              <div style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '8px' }}>
                <strong>Beneficiário:</strong> {dadosPix.nomeBeneficiario}
              </div>
              <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
                <strong>ID da Transação:</strong> {dadosPix.transacaoId}
              </div>
            </div>

            <div style={{ 
              marginTop: '15px', 
              padding: '12px',
              background: '#10b981',
              color: 'white',
              borderRadius: '6px',
              textAlign: 'center',
              fontWeight: '600'
            }}>
              💡 O pagamento será debitado para Lyedson Matheus
            </div>
          </div>
        )}

        {customerData.formaPagamento === 'boleto' && (
          <div style={{ 
            marginTop: '25px', 
            padding: '20px', 
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            borderRadius: '12px',
            border: '2px solid #f59e0b'
          }}>
            <h4 style={{ color: '#f59e0b', marginBottom: '15px', textAlign: 'center', fontWeight: '700' }}>
              📄 Boleto Bancário
            </h4>

            <div style={{ 
              background: 'white', 
              padding: '20px', 
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontFamily: 'monospace', 
                letterSpacing: '2px',
                color: 'black',
                fontWeight: 'bold',
                fontSize: '16px',
                marginBottom: '10px'
              }}>
                {dadosBoleto.codigoBarras}
              </div>
              <div style={{ 
                height: '60px',
                background: 'linear-gradient(90deg, #000 2px, transparent 2px)',
                backgroundSize: '4px 100%',
                margin: '10px 0'
              }}></div>
              <div style={{ 
                fontFamily: 'monospace', 
                letterSpacing: '1px',
                color: 'black',
                fontSize: '12px'
              }}>
                {dadosBoleto.linhaDigitavel}
              </div>
            </div>

            <div style={{ 
              background: '#0f172a', 
              padding: '15px', 
              borderRadius: '8px',
              marginTop: '15px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', color: '#cbd5e1', fontSize: '0.9rem' }}>
                <div><strong>Valor:</strong> R$ {dadosBoleto.valor}</div>
                <div><strong>Vencimento:</strong> {dadosBoleto.vencimento}</div>
                <div><strong>Número:</strong> {dadosBoleto.numero}</div>
                <div><strong>Beneficiário:</strong> {dadosBoleto.beneficiario}</div>
              </div>
            </div>

            <div style={{ 
              marginTop: '15px', 
              padding: '12px',
              background: '#f59e0b',
              color: '#0f172a',
              borderRadius: '6px',
              textAlign: 'center',
              fontWeight: '600'
            }}>
              ⚠️ O boleto vence em 3 dias úteis
            </div>
          </div>
        )}
      </section>

      <section style={{ marginBottom: '30px', background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
        <h3 style={{ marginBottom: '20px', color: '#cbd5e1', fontSize: '1.4rem', fontWeight: '700' }}>📦 Resumo do Pedido</h3>
        
        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>
            <p style={{ fontSize: '1.1rem' }}>🛒 Seu carrinho está vazio</p>
            <button
              onClick={() => navigate('/categories')}
              className="button-link"
              style={{ marginTop: '15px', padding: '12px 25px' }}
            >
              Continuar Comprando
            </button>
          </div>
        ) : (
          <>
            <ul style={{ listStyle: 'none', paddingLeft: 0, marginBottom: '20px' }}>
              {cartItems.map(item => (
                <li key={item.id} style={{ 
                  marginBottom: '15px', 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '15px',
                  padding: '15px',
                  background: '#0f172a',
                  borderRadius: '12px',
                  border: '1px solid #334155'
                }}>
                  {/* MINIATURA DO PRODUTO */}
                  <img
                    src={item.thumbnail || item.image}
                    alt={item.title}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      border: '1px solid #334155',
                      background: '#1e293b',
                      flexShrink: 0
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <div style="width: 60px; height: 60px; background: #1e293b; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 0.8rem; text-align: center; border: 1px solid #334155;">
                          📷
                        </div>
                      ` + e.target.parentElement.innerHTML;
                    }}
                  />

                  {/* INFORMAÇÕES DO PRODUTO */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '600', color: '#cbd5e1', marginBottom: '4px', fontSize: '1rem' }}>
                      {item.title}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '8px' }}>
                      R$ {item.price} × {item.quantity} = R$ {(item.price * item.quantity).toFixed(2)}
                    </div>
                    
                    {/* CONTROLES DE QUANTIDADE */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        onClick={() => handleDecrease(item.id)}
                        style={{
                          padding: '6px 10px',
                          background: '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          minWidth: '35px'
                        }}
                      >
                        -
                      </button>
                      <span style={{ 
                        color: '#cbd5e1', 
                        fontWeight: '600', 
                        minWidth: '20px', 
                        textAlign: 'center',
                        fontSize: '1rem'
                      }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncrease(item.id)}
                        style={{
                          padding: '6px 10px',
                          background: '#16a34a',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          minWidth: '35px'
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            <div style={{ 
              background: '#0f172a', 
              padding: '20px', 
              borderRadius: '8px',
              border: '1px solid #334155'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#cbd5e1' }}>Subtotal:</span>
                <span style={{ color: '#cbd5e1', fontWeight: '600' }}>R$ {totalProdutos.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#cbd5e1' }}>Frete:</span>
                <span style={{ color: '#cbd5e1', fontWeight: '600' }}>R$ {fretePreco.toFixed(2)}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginTop: '15px',
                paddingTop: '15px',
                borderTop: '2px solid #334155',
                fontSize: '1.2rem'
              }}>
                <span style={{ color: '#cbd5e1', fontWeight: '700' }}>Total:</span>
                <span style={{ color: '#3b82f6', fontWeight: '900', fontSize: '1.3rem' }}>
                  R$ {totalFinal.toFixed(2)}
                </span>
              </div>
              {customerData.formaPagamento === 'cartao' && (
                <div style={{ 
                  marginTop: '10px', 
                  padding: '10px',
                  background: '#1e40af',
                  borderRadius: '6px',
                  textAlign: 'center'
                }}>
                  <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
                    💳 Parcelado em {customerData.parcelas}x de R$ {(totalFinal / parseInt(customerData.parcelas)).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </section>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <button
          onClick={handleFinalizar}
          disabled={cartItems.length === 0}
          title={cartItems.length === 0 ? 'Carrinho vazio' : 'Finalizar compra'}
          className="button-link"
          style={{
            padding: '18px 40px',
            fontSize: '1.2rem',
            fontWeight: '700',
            opacity: cartItems.length === 0 ? 0.6 : 1,
            cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          {customerData.formaPagamento === 'pix' ? '📱 Confirmar Pagamento PIX' : 
           customerData.formaPagamento === 'boleto' ? '📄 Confirmar Boleto' : 
           '✅ Finalizar Compra'}
        </button>

        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button
            onClick={handleVoltarLoja}
            className="button-link"
            style={{
              padding: '15px 30px',
              fontSize: '1rem',
              fontWeight: '700',
              backgroundColor: '#3b82f6',
              flex: 1
            }}
          >
            🏪 Loja Física
          </button>

          <button
            onClick={handleVoltarLojaOnline}
            className="button-link"
            style={{
              padding: '15px 30px',
              fontSize: '1rem',
              fontWeight: '700',
              backgroundColor: '#10b981',
              flex: 1
            }}
          >
            🛒 Loja Online
          </button>
        </div>
      </div>
    </div>
  );
}