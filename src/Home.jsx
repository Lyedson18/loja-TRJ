import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Vai direto para a tela de Login
    navigate('/');
  };

  return (
    <div className="home">
      <h1>Bem-vindo ao <span className="highlight">(TRJ) Shopping!)</span></h1>
      <p className="lead">Encontre os melhores produtos para todas as suas necessidades!</p>
      <p className="sublead">Qualidade, tecnologia e preços incríveis para você!</p>

      <Link to="/categories" className="button-link">Ir para a Loja</Link>
      <Link to="/manage-products" className="button-link">Gerenciar Produtos</Link>

      {/* Botão de logout / trocar de conta */}
      <button
        onClick={handleLogout}
        className="button-link"
        style={{ marginTop: '30px', border: 'none' }}
      >
        Trocar de Conta
      </button>
    </div>
  );
}
