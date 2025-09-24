import { useEffect, useState } from "react";
import { supabase } from "./utils/supabase";

export default function Product2vList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from("product_2v").select("*");
      if (error) {
        console.error("Erro ao buscar produtos:", error);
      } else {
        setProducts(data);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Produtos (product_2v)</h1>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            <h2>{p.title}</h2>
            <p>{p.description}</p>
            <p>Preço: ${p.price}</p>
            <img src={p.thumbnail} alt={p.title} />
          </li>
        ))}
      </ul>
    </div>
  );
}
