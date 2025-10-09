import React, { useEffect, useState, useContext } from "react";
import { supabase } from "./utils/supabase";
import { useNavigate } from "react-router-dom";
import { CartContext } from "./CartContext";

export default function LojaOnline() {
  const navigate = useNavigate();
  const { cartItems, setCartItems } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("product_2v").select("*").order("created_at", { ascending: false });
      if (error) setErro("Erro ao buscar produtos");
      else setProducts(data);
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Confirma a exclusão do produto?");
    if (!confirm) return;

    const { error } = await supabase.from("product_2v").delete().eq("id", id);
    if (error) setErro("Erro ao deletar produto");
    else setSucesso("Produto deletado com sucesso!");
  };

  const handleAddToCart = (product) => {
    const itemExists = cartItems.find((item) => item.id === product.id);
    if (itemExists) {
      setCartItems(cartItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
    setSucesso(`Produto "${product.title}" adicionado ao carrinho!`);
    setTimeout(() => setSucesso(""), 2000);
  };

  return (
    <div style={{ padding: "40px", color: "#cbd5e1", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Loja Online</h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={() => navigate("/home")}
          style={{ padding: "8px 12px", background: "#6b7280", color: "#fff", border: "none", borderRadius: "5px" }}
        >
          Voltar para Home
        </button>
        <button
          onClick={() => navigate("/checkout")}
          style={{ padding: "8px 12px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "5px" }}
        >
          🛒 ({cartItems.length})
        </button>
      </div>

      {erro && <p style={{ color: "red" }}>{erro}</p>}
      {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {products.map((p) => (
          <li key={p.id} style={{ marginBottom: "30px", borderBottom: "1px solid #3b82f6", paddingBottom: "15px" }}>
            <div style={{ display: "flex", gap: "15px" }}>
              <img src={p.thumbnail} alt={p.title} style={{ width: "180px", height: "120px", objectFit: "contain" }} />
              <div>
                <h2>{p.title}</h2>
                <p>{p.description}</p>
                <p>Preço: ${p.price}</p>
                {user && (user.user_metadata?.admin || p.user_id === user.id) && (
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    <button
                      onClick={() => handleDelete(p.id)}
                      style={{ padding: "6px 10px", background: "#dc2626", color: "#fff", border: "none", borderRadius: "5px" }}
                    >
                      Deletar
                    </button>
                    <button
                      onClick={() => handleAddToCart(p)}
                      style={{ padding: "6px 10px", background: "#16a34a", color: "#fff", border: "none", borderRadius: "5px" }}
                    >
                      Adicionar ao Carrinho
                    </button>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
