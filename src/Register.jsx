import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css'; // CSS correto

export default function Register() {
  const navigate = useNavigate();

  const handleCadastro = (e) => {
    e.preventDefault(); // impede reload da página
    // Aqui você poderia salvar os dados do usuário antes de navegar
    navigate('/'); // volta para a página de login
  };

  return (
    <div className="home">
      <h1 className="highlight">Cadastro de Usuário</h1>
      <p className="lead">Preencha os campos abaixo para criar sua conta.</p>

      <form
        onSubmit={handleCadastro}
        className="form"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          width: '100%',
          maxWidth: '360px',
          marginTop: '20px'
        }}
      >
        <input
          type="text"
          placeholder="Nome"
          required
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #2563eb', fontSize: '1rem' }}
        />
        <input
          type="email"
          placeholder="E-mail"
          required
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #2563eb', fontSize: '1rem' }}
        />
        <input
          type="password"
          placeholder="Senha"
          required
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #2563eb', fontSize: '1rem' }}
        />

        <button
          type="submit"
          className="button-link small-btn"
          style={{ alignSelf: 'center', marginTop: '10px' }}
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}
