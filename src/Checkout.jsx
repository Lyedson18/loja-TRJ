import React, { useState, useContext } from 'react';
import { CartContext } from './CartContext';
import { useNavigate } from 'react-router-dom';
export default function Checkout() {
  const { cartItems, clearCart, setCartItems } = useContext(CartContext); // ADICIONEI setCartItems
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState({
    nome: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    formaPagamento: 'cartao',
    parcelas: '1',
    frete: 'normal',
  });
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
    const newCart = cartItems.map(item =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(newCart);
  };
  const fretePreco = customerData.frete === 'economico' ? 10
                   : customerData.frete === 'normal' ? 20
                   : customerData.frete === 'expresso' ? 50
                   : customerData.frete === 'ultra' ? 100
                   : 0;
  const totalProdutos = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalFinal = totalProdutos + fretePreco;
  const handleFinalizar = () => {
    const valorParcela = (totalFinal / parseInt(customerData.parcelas)).toFixed(2);
    alert(`Compra finalizada!\nTotal a pagar: R$ ${totalFinal.toFixed(2)}\nParcelado em: ${customerData.parcelas}x de R$ ${valorParcela}`);
    clearCart();
    navigate('/');
  };
  const handleVoltarLoja = () => {
    navigate('/categories');
  };
  return (
    <div
      style={{
        maxWidth: 700,
        margin: '40px auto',
        padding: 20,
        background: '#1e293b',
        color: '#cbd5e1',
        borderRadius: 12,
        fontFamily: 'sans-serif'
      }}
    >
      <h2 style={{ marginBottom: 20, fontSize: '1.8rem', fontWeight: 700, textAlign: 'center' }}>
        Confirmação de Dados e Pagamento
      </h2>
      <section style={{ marginBottom: 30 }}>
        <h3 style={{ marginBottom: 10 }}>Dados do Cliente</h3>
        <form>
          {['nome', 'endereco', 'cidade', 'estado', 'cep'].map(field => (
            <label key={field} style={{ display: 'block', marginBottom: 12 }}>
              {field.charAt(0).toUpperCase() + field.slice(1)}:
              <input
                type="text"
                name={field}
                value={customerData[field]}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: 10,
                  marginTop: 4,
                  borderRadius: 6,
                  border: '1px solid #334155',
                  background: '#0f172a',
                  color: '#cbd5e1'
                }}
              />
            </label>
          ))}
        </form>
      </section>
      <section style={{ marginBottom: 30 }}>
        <h3 style={{ marginBottom: 10 }}>Frete</h3>
        {[  
          { value: 'economico', label: 'Econômico (7-10 dias) - R$ 10,00' },
          { value: 'normal', label: 'Normal (5-7 dias) - R$ 20,00' },
          { value: 'expresso', label: 'Expresso (1-2 dias) - R$ 50,00' },
          { value: 'ultra', label: 'Ultra Expresso (mesmo dia) - R$ 100,00' },
        ].map(option => (
          <label key={option.value} style={{ display: 'block', marginBottom: 8 }}>
            <input
              type="radio"
              name="frete"
              value={option.value}
              checked={customerData.frete === option.value}
              onChange={handleChange}
            />{' '}
            {option.label}
          </label>
        ))}
      </section>
      <section style={{ marginBottom: 30 }}>
        <h3 style={{ marginBottom: 10 }}>Forma de Pagamento</h3>
        {['cartao', 'boleto', 'pix'].map(metodo => (
          <label key={metodo} style={{ display: 'block', marginBottom: 8 }}>
            <input
              type="radio"
              name="formaPagamento"
              value={metodo}
              checked={customerData.formaPagamento === metodo}
              onChange={handleChange}
            />{' '}
            {metodo === 'cartao'
              ? 'Cartão de Crédito'
              : metodo === 'boleto'
              ? 'Boleto Bancário'
              : 'Pix'}
          </label>
        ))}
        {customerData.formaPagamento === 'cartao' && (
          <label style={{ display: 'block', marginTop: 12 }}>
            Parcelas:
            <select
              name="parcelas"
              value={customerData.parcelas}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: 10,
                marginTop: 4,
                borderRadius: 6,
                border: '1px solid #334155',
                background: '#0f172a',
                color: '#cbd5e1'
              }}
            >
              {[...Array(12).keys()].map(i => (
                <option key={i+1} value={i+1}>
                  {i+1}x de R$ {(totalFinal / (i+1)).toFixed(2)}
                </option>
              ))}
            </select>
          </label>
        )}
      </section>
      <section style={{ marginBottom: 30 }}>
        <h3 style={{ marginBottom: 10 }}>Resumo do Pedido</h3>
        {cartItems.length === 0 ? (
          <p>Carrinho vazio.</p>
        ) : (
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {cartItems.map(item => (
              <li key={item.id} style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>
                  {item.title} (x{item.quantity}) - R$ {(item.price * item.quantity).toFixed(2)}
                </span>
                <div>
                  <button
                    onClick={() => handleDecrease(item.id)}
                    style={{
                      padding: '2px 10px',
                      marginRight: 5,
                      background: '#334155',
                      color: '#cbd5e1',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer'
                    }}
                  >
                    -
                  </button>
                  <button
                    onClick={() => handleIncrease(item.id)}
                    style={{
                      padding: '2px 10px',
                      background: '#334155',
                      color: '#cbd5e1',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer'
                    }}
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div style={{ textAlign: 'right', marginTop: 15 }}>
          <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>
            Subtotal: R$ {totalProdutos.toFixed(2)}
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>
            Frete: R$ {fretePreco.toFixed(2)}
          </div>
          <div style={{ fontWeight: 900, fontSize: '1.4rem', marginTop: 10 }}>
            Total a Pagar: R$ {totalFinal.toFixed(2)}
            {customerData.formaPagamento === 'cartao' && ` em ${customerData.parcelas}x de R$ ${(totalFinal / parseInt(customerData.parcelas)).toFixed(2)}`}
          </div>
        </div>
      </section>
      <button
        onClick={handleFinalizar}
        disabled={cartItems.length === 0}
        title={cartItems.length === 0 ? 'Carrinho vazio' : 'Finalizar compra'}
        style={{
          marginTop: 30,
          padding: '15px 40px',
          fontSize: '1.2rem',
          fontWeight: 700,
          borderRadius: 12,
          background: '#2563eb',
          color: 'white',
          border: 'none',
          cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer',
          width: '100%'
        }}
      >
        Finalizar Compra(s)!
      </button>
      <button
        onClick={handleVoltarLoja}
        style={{
          marginTop: 15,
          padding: '15px 40px',
          fontSize: '1.2rem',
          fontWeight: 700,
          borderRadius: 12,
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        Voltar para Categorias!
      </button>
    </div>
  );
}