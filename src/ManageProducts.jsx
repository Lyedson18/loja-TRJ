import React from "react";
import Product2vList from "./Product2vList"; // importa seu componente que puxa do Supabase

export default function ManageProducts() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Gerenciar Produtos (product_2v)</h2>
      <Product2vList />
    </div>
  );
}
