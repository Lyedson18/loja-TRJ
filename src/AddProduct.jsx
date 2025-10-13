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
      else navigate("/");
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
    <div className="product-detail" style={{ maxWidth: '600px', margin: '40px auto' }}>
      <h2 style={{ textAlign: 'center', color: '#cbd5e1', marginBottom: '30px' }}>
        Cadastrar Novo Produto
      </h2>

      {/* Botões de Navegação */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate('/home')}
          className="button-link"
          style={{ padding: '12px 25px', fontSize: '1rem' }}
        >
          Voltar para Home
        </button>
        <button
          onClick={() => navigate('/loja-online')}
          className="button-link"
          style={{ padding: '12px 25px', fontSize: '1rem', backgroundColor: '#3b82f6' }}
        >
          Ver na Loja Online
        </button>
      </div>

      {erro && (
        <div style={{
          color: 'red',
          textAlign: 'center',
          marginBottom: '20px',
          padding: '10px',
          background: 'rgba(220, 38, 38, 0.1)',
          borderRadius: '8px'
        }}>
          {erro}
        </div>
      )}
      
      {sucesso && (
        <div style={{
          color: 'green',
          textAlign: 'center',
          marginBottom: '20px',
          padding: '10px',
          background: 'rgba(34, 197, 94, 0.1)',
          borderRadius: '8px'
        }}>
          {sucesso}
        </div>
      )}

      <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ color: '#cbd5e1', marginBottom: '8px', display: 'block', fontWeight: '600' }}>
            Título do Produto:
          </label>
          <input
            type="text"
            placeholder="Digite o título do produto"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #334155',
              background: '#0f172a',
              color: '#cbd5e1',
              fontSize: '1rem'
            }}
          />
        </div>

        <div>
          <label style={{ color: '#cbd5e1', marginBottom: '8px', display: 'block', fontWeight: '600' }}>
            Descrição:
          </label>
          <textarea
            placeholder="Digite a descrição do produto"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #334155',
              background: '#0f172a',
              color: '#cbd5e1',
              fontSize: '1rem',
              resize: 'vertical'
            }}
          />
        </div>

        <div>
          <label style={{ color: '#cbd5e1', marginBottom: '8px', display: 'block', fontWeight: '600' }}>
            Preço (USD):
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #334155',
              background: '#0f172a',
              color: '#cbd5e1',
              fontSize: '1rem'
            }}
          />
        </div>

        <div>
          <label style={{ color: '#cbd5e1', marginBottom: '8px', display: 'block', fontWeight: '600' }}>
            URL da Imagem:
          </label>
          <input
            type="text"
            placeholder="https://exemplo.com/imagem.jpg"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #334155',
              background: '#0f172a',
              color: '#cbd5e1',
              fontSize: '1rem'
            }}
          />
        </div>

        <button
          type="submit"
          className="button-link"
          style={{
            padding: '15px 40px',
            fontSize: '1.2rem',
            fontWeight: '700',
            marginTop: '20px',
            width: '100%'
          }}
        >
          Cadastrar Produto
        </button>
      </form>

      {/* Preview da Imagem */}
      {thumbnail && (
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <h3 style={{ color: '#cbd5e1', marginBottom: '15px' }}>Preview da Imagem:</h3>
          <img
            src={thumbnail}
            alt="Preview"
            style={{
              maxWidth: '100%',
              maxHeight: '200px',
              borderRadius: '8px',
              border: '2px solid #334155'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
}