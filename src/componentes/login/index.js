import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  font-family: "Arial", sans-serif;
`;

const LoginBox = styled.div`
  background: #fff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  text-align: left;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;

  &:focus {
    border-color: #6a11cb;
    box-shadow: 0 0 5px rgba(106, 17, 203, 0.5);
  }
`;

const ErrorMessage = styled.div`
  color: #ff4d4d;
  font-size: 14px;
  margin-bottom: 15px;
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #6a11cb;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #2575fc;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const CreateAccountLink = styled.div`
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #6a11cb;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #2575fc;
    text-decoration: underline;
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      if (response.data.success) {
        console.log("Login efetuado");
        navigate("/mapa");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    navigate("/Registro"); // rota que vamos criar
  };

  return (
    <LoginContainer>
      <LoginBox>
        <Title>Login</Title>
        <form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">Email:</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Digite seu email"
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="password">Senha:</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Digite sua senha"
            />
          </InputGroup>

          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <ButtonContainer>
            <Button type="submit" disabled={loading}>
              {loading ? "Carregando..." : "Entrar"}
            </Button>
          </ButtonContainer>
        </form>
        {/* Link para criar conta */}

        <CreateAccountLink onClick={handleCreateAccount}>
          Não tem uma conta? Criar login
        </CreateAccountLink>
      </LoginBox>
    </LoginContainer>
  );
};

export default Login;
