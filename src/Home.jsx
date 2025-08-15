import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home">
      <h1>Bem-vindo ao <span className="highlight"> (TRJ) Shopping! </span></h1>
      <p className="lead">Encontre os melhores produtos para todas as suas necessidades!</p>
      <p className="sublead">Qualidade, tecnologia e preços incríveis para você!</p>

      {/* Botão para ir à loja */}
      <Link to="/categories" className="button-link">Ir para a Loja</Link>

      {/* Botão para gerenciar produtos */}
      <Link to="/GerenciarProdutos" className="button-link">Gerenciar Produtos</Link>
    </div>
  );
}
