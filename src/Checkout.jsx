import React, { useState, useContext } from 'react';
import { CartContext } from './CartContext';
import { useNavigate } from 'react-router-dom';
export default function Checkout() {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState({
    nome: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    formaPagamento: 'cartao',
    frete: 'normal',
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({ ...prev, [name]: value }));
  };
  const fretePreco = customerData.frete === 'normal' ? 20 : 50;
  const totalProdutos = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalFinal = totalProdutos + fretePreco;
  const handleFinalizar = () => {
    alert(`Compra finalizada!\nTotal a pagar: R$ ${totalFinal.toFixed(2)}`);
    clearCart();   // limpa o carrinho
    navigate('/'); // volta pra home
  };
  const handleVoltarLoja = () => {
    navigate('/shop');
  };
  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 20, background: '#1e293b', color: '#cbd5e1', borderRadius: 12 }}>
      <h2>Confirmação de Dados e Pagamento</h2>
      <section style={{ marginBottom: 30 }}>
        <h3>Dados do Cliente</h3>
        <form>
          <label>
            Nome Completo:
            <input
              type="text"
              name="nome"
              value={customerData.nome}
              onChange={handleChange}
              style={{ width: '100%', padding: 8, marginTop: 4, marginBottom: 12 }}
            />
          </label>
          <label>
            Endereço:
            <input
              type="text"
              name="endereco"
              value={customerData.endereco}
              onChange={handleChange}
              style={{ width: '100%', padding: 8, marginTop: 4, marginBottom: 12 }}
            />
          </label>
          <label>
            Cidade:
            <input
              type="text"
              name="cidade"
              value={customerData.cidade}
              onChange={handleChange}
              style={{ width: '100%', padding: 8, marginTop: 4, marginBottom: 12 }}
            />
          </label>
          <label>
            Estado:
            <input
              type="text"
              name="estado"
              value={customerData.estado}
              onChange={handleChange}
              style={{ width: '100%', padding: 8, marginTop: 4, marginBottom: 12 }}
            />
          </label>
          <label>
            CEP:
            <input
              type="text"
              name="cep"
              value={customerData.cep}
              onChange={handleChange}
              style={{ width: '100%', padding: 8, marginTop: 4, marginBottom: 12 }}
            />
          </label>
        </form>
      </section>
      <section style={{ marginBottom: 30 }}>
        <h3>Frete</h3>
        <label>
          <input
            type="radio"
            name="frete"
            value="normal"
            checked={customerData.frete === 'normal'}
            onChange={handleChange}
          />
          Frete Normal (5-7 dias) - R$ 20,00
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="frete"
            value="expresso"
            checked={customerData.frete === 'expresso'}
            onChange={handleChange}
          />
          Frete Expresso (1-2 dias) - R$ 50,00
        </label>
      </section>
      <section style={{ marginBottom: 30 }}>
        <h3>Forma de Pagamento</h3>
        <label>
          <input
            type="radio"
            name="formaPagamento"
            value="cartao"
            checked={customerData.formaPagamento === 'cartao'}
            onChange={handleChange}
          />
          Cartão de Crédito
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="formaPagamento"
            value="boleto"
            checked={customerData.formaPagamento === 'boleto'}
            onChange={handleChange}
          />
          Boleto Bancário
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="formaPagamento"
            value="pix"
            checked={customerData.formaPagamento === 'pix'}
            onChange={handleChange}
          />
          Pix
        </label>
      </section>
      <section>
        <h3>Resumo do Pedido</h3>
        {cartItems.length === 0 ? (
          <p>Carrinho vazio.</p>
        ) : (
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {cartItems.map(item => (
              <li key={item.id} style={{ marginBottom: 8 }}>
                {item.title} (x{item.quantity}) - R$ {(item.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
        )}
        <div style={{ fontWeight: '700', fontSize: '1.2rem', marginTop: '15px', textAlign: 'right' }}>
          Subtotal: R$ {totalProdutos.toFixed(2)}
        </div>
        <div style={{ fontWeight: '700', fontSize: '1.2rem', marginTop: '5px', textAlign: 'right' }}>
          Frete: R$ {fretePreco.toFixed(2)}
        </div>
        <div style={{ fontWeight: '900', fontSize: '1.4rem', marginTop: '10px', textAlign: 'right' }}>
          Total a Pagar: R$ {totalFinal.toFixed(2)}
        </div>
      </section>
      <button
        style={{
          marginTop: 30,
          padding: '15px 40px',
          fontSize: '1.2rem',
          fontWeight: '700',
          borderRadius: 12,
          background: '#2563eb',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          width: '100%',
        }}
        onClick={handleFinalizar}
        disabled={cartItems.length === 0}
        title={cartItems.length === 0 ? 'Carrinho vazio' : 'Finalizar compra'}
      >
        Finalizar Compra
      </button>
      <button
        onClick={handleVoltarLoja}
        style={{
          marginTop: 15,
          padding: '15px 40px',
          fontSize: '1.2rem',
          fontWeight: '700',
          borderRadius: 12,
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          width: '100%',
        }}
      >
        Voltar para a Loja
      </button>
    </div>
  );
}