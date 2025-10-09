import React, { useState, useEffect } from "react";
import { supabase } from "./utils/supabase";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [user, setUser] = useState(null);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
      else navigate("/"); // redireciona se não logado
    };
    fetchUser();
  }, [navigate]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!user || (!user.user_metadata?.admin && !user.user_metadata?.vendedor)) {
      setErro("Somente admin ou vendedor podem adicionar produtos.");
      return;
    }

    if (!title || !description || !price || !thumbnail) {
      setErro("Preencha todos os campos.");
      return;
    }

    const { data, error } = await supabase
      .from("product_2v")
      .insert([
        { title, description, price: parseFloat(price), thumbnail, user_id: user.id },
      ]);

    if (error) setErro("Erro ao adicionar produto: " + error.message);
    else {
      setSucesso("Produto adicionado com sucesso!");
      setTitle("");
      setDescription("");
      setPrice("");
      setThumbnail("");
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Adicionar Produto</h1>

      {erro && <p style={{ color: "red" }}>{erro}</p>}
      {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}

      <form onSubmit={handleAddProduct} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="text" placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" step="0.01" placeholder="Preço" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input type="text" placeholder="URL da Imagem" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} />
        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit" style={{ padding: "10px 15px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "5px" }}>
            Adicionar Produto
          </button>
          <button type="button" onClick={() => navigate("/home")} style={{ padding: "10px 15px", background: "#6b7280", color: "#fff", border: "none", borderRadius: "5px" }}>
            Voltar para Home
          </button>
        </div>
      </form>
    </div>
  );
}
