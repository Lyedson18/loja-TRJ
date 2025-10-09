import { useState } from "react";
import { supabase } from "./utils/supabase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!email || !password) {
      setErro("Preencha todos os campos");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          admin: false,
          vendedor: true // ou false dependendo do caso
        }
      }
    });

    if (error) setErro(error.message);
    else setSucesso("Usuário registrado com sucesso!");
  };

  return (
    <form onSubmit={handleRegister}>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Registrar</button>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
      {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}
    </form>
  );
}
