import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './utils/supabase';
import './index.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [isVendedor, setIsVendedor] = useState(false);
  
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
        options: { 
          emailRedirectTo: window.location.origin,
          data: {
            admin: false,
            vendedor: isVendedor
          }
        }
      });

      if (error) {
        setErro(error.message);
      } else {
        setSucesso("Usuário cadastrado! Entrando automaticamente...");

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
      <h1 className="highlight">Bem Vindo a Loja TRJ Shop!</h1>
      <p className="lead">Preencha os campos abaixo para acessar ou criar sua conta!</p>

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
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #2563eb',
            fontSize: '1rem'
          }}
        />
        <div style={{ position: 'relative' }}>
          <input
            type={mostrarSenha ? "text" : "password"}
            placeholder="Senha"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #2563eb',
              fontSize: '1rem',
              width: '100%',
              boxSizing: 'border-box'
            }}
          />
          <button
            type="button"
            onClick={() => setMostrarSenha(!mostrarSenha)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#2563eb',
              fontSize: '1rem'
            }}
            title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
          >
            {mostrarSenha ? '👁️‍🗨️' : '👁️'}
          </button>
        </div>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#cbd5e1',
            fontWeight: 500
          }}
        >
          <input
            type="checkbox"
            checked={isVendedor}
            onChange={(e) => setIsVendedor(e.target.checked)}
          />
          Cadastrar como vendedor
        </label>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <button
            type="submit"
            onClick={handleLogin}
            className="button-link small-btn"
          >
            Fazer Login 🔓
          </button>
          <button
            type="submit"
            onClick={handleCadastro}
            className="button-link small-btn"
          >
            Cadastrar Nova Conta🔒
          </button>
        </div>
      </form>
    
      {erro && <p style={{ color: "red", marginTop: "10px" }}>{erro}</p>}
      {sucesso && <p style={{ color: "lightgreen", marginTop: "10px" }}>{sucesso}</p>}
    </div>
  );
}
