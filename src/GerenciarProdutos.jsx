import React, { useState } from 'react';
import './App.jsx';

export default function GerenciarProdutos() {
  const [produtos, setProdutos] = useState([
    { id: 1, nome: 'Produto 1', preco: 'R$ 100,00' },
    { id: 2, nome: 'Produto 2', preco: 'R$ 200,00' },
  ]);

  const handleAddProduto = (e) => {
    e.preventDefault();
    alert('Produto adicionado (simulação)');
  };

  const handleEditar = (id) => {
    alert(`Editar produto ID: ${id}`);
  };

  const handleRemover = (id) => {
    setProdutos(produtos.filter(p => p.id !== id));
  };

  return (
    <div className="container">
      <h2>Gerenciar Produtos</h2>
      <form onSubmit={handleAddProduto} className="form">
        <input type="text" placeholder="Nome do Produto" required />
        <input type="text" placeholder="Preço" required />
        <button type="submit" className="btn">Adicionar Produto</button>
      </form>

      <ul>
        {produtos.map((p) => (
          <li key={p.id}>
            {p.nome} - {p.preco}
            <button className="btn" onClick={() => handleEditar(p.id)}>Editar</button>
            <button className="btn" onClick={() => handleRemover(p.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
