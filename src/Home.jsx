import React from 'react';
import { Link } from 'react-router-dom';
export default function Home() {
  return (
    <div className="home">
      <h1>Bem-vindo ao <span className="highlight">Laptops Shop (TRJ)</span></h1>
      <p className="lead">Encontre os melhores laptops para todos os gostos e seu bolso!</p>
      <p className="sublead">Qualidade, tecnologia e preços incríveis para você!</p>
      <Link to="/shop" className="button-link">Ir para a Loja</Link>
    </div>
  );
}