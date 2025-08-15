import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './index.css';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div className="home">
      <h1 className="highlight">Bem-vindo!</h1>
      <p className="lead">Faça login para acessar sua conta e produtos exclusivos.</p>

      <form
        onSubmit={handleLogin}
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
          Entrar
        </button>
      </form>

      <p className="sublead" style={{ textAlign: 'center', marginTop: '15px' }}>
        Não tem conta? <Link to="/register">Cadastrar-se</Link>
      </p>
    </div>
  );
}
