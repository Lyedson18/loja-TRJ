import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './utils/supabase';
import './App.css';

export default function CadastroUsuario() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (senha.length < 6) {
      setErro("A senha precisa ter no mínimo 6 caracteres.");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: { data: { nome } },
      });

      if (error) {
        setErro(error.message);
      } else {
        setSucesso("Usuário cadastrado com sucesso! Verifique seu email.");
        setTimeout(() => navigate('/home'), 2000);
      }
    } catch (err) {
      console.error("Erro inesperado:", err);
      setErro("Ocorreu um erro ao cadastrar. Tente novamente.");
    }
  };

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
        navigate('/home'); // redireciona para a home
      }
    } catch (err) {
      console.error("Erro inesperado no login:", err);
      setErro("Ocorreu um erro ao logar. Tente novamente.");
    }
  };

  return (
    <div className="home">
      <h1 className="highlight">Cadastro / Login de Usuário</h1>
      <p className="lead">Preencha os campos abaixo para criar sua conta ou entrar.</p>

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
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #2563eb', fontSize: '1rem' }}
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #2563eb', fontSize: '1rem' }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #2563eb', fontSize: '1rem' }}
        />

        <button
          type="submit"
          className="button-link small-btn"
          style={{ alignSelf: 'center', marginTop: '10px' }}
          onClick={handleCadastro}
        >
          Cadastrar
        </button>

        <button
          type="button"
          className="button-link small-btn"
          style={{ alignSelf: 'center', marginTop: '10px', background: '#3b82f6' }}
          onClick={handleLogin}
        >
          Login
        </button>
      </form>

      {erro && <p style={{ color: "red", marginTop: "10px" }}>{erro}</p>}
      {sucesso && <p style={{ color: "lightgreen", marginTop: "10px" }}>{sucesso}</p>}
    </div>
  );
}
