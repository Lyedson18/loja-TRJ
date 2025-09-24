import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './utils/supabase';
import './index.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // Login para usuários já cadastrados
  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        setErro(error.message);
      } else {
        setSucesso("Login realizado com sucesso!");
        setTimeout(() => navigate('/home'), 500);
      }
    } catch (err) {
      setErro("Erro inesperado. Tente novamente.");
      console.error(err);
    }
  };

  // Cadastro de novos usuários com login automático
  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (senha.length < 6) {
      setErro("A senha precisa ter no mínimo 6 caracteres.");
      return;
    }

    try {
      // Cria usuário e evita "Email not confirmed"
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: { emailRedirectTo: window.location.origin }
      });

      if (error) {
        setErro(error.message);
      } else {
        setSucesso("Usuário cadastrado! Entrando automaticamente...");

        // Login automático
        const { session, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password: senha
        });

        if (loginError) {
          setErro(loginError.message);
        } else {
          navigate('/home');
        }
      }
    } catch (err) {
      setErro("Erro inesperado ao criar usuário.");
      console.error(err);
    }
  };

  return (
    <div className="home">
      <h1 className="highlight">Login / Cadastro</h1>
      <p className="lead">Preencha os campos abaixo para acessar ou criar sua conta.</p>

      <form
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #2563eb', fontSize: '1rem' }}
        />
        <input
          type="password"
          placeholder="Senha"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #2563eb', fontSize: '1rem' }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <button
            type="submit"
            onClick={handleLogin}
            className="button-link small-btn"
          >
            Entrar
          </button>

          <button
            type="submit"
            onClick={handleCadastro}
            className="button-link small-btn"
          >
            Cadastrar
          </button>
        </div>
      </form>

      {erro && <p style={{ color: "red", marginTop: "10px" }}>{erro}</p>}
      {sucesso && <p style={{ color: "lightgreen", marginTop: "10px" }}>{sucesso}</p>}
    </div>
  );
}
