import React from 'react';
import { Link } from 'react-router-dom';
export default function Home() {
  return (
    <div className="home">
      <h1>Bem-vindo ao <span className="highlight"> (TRJ) Shopping! </span></h1>
      <p className="lead">Encontre os melhores produtos para todas as suas necessidades!</p>
      <p className="sublead">Qualidade, tecnologia e preços incríveis para você!</p>
      <Link to="/categories" className="button-link">Ir para a Loja</Link>
    </div>
  );
}