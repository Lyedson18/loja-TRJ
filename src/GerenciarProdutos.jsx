import React from "react";
import Product2vList from "./Product2vList"; // caminho correto para seu componente que busca no Supabase

export default function GerenciarProdutos() {
  return (
    <div className="container">
      <h2>Gerenciar Produtos (product_2v)</h2>
      <Product2vList />
    </div>
  );
}
