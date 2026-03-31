import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  font-family: "Arial", sans-serif;
`;

const RegisterBox = styled.div`
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

const SuccessMessage = styled.div`
  color: #4caf50;
  font-size: 14px;
  margin-bottom: 15px;
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

const BackToLoginLink = styled.div`
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

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/register", {
        email,
        password,
      });

      if (response.data.success) {
        setSuccessMessage("Conta criada com sucesso! Redirecionando...");

        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/");
  };

  return (
    <RegisterContainer>
      <RegisterBox>
        <Title>Criar Conta</Title>
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

          <InputGroup>
            <Label htmlFor="confirmPassword">Confirmar Senha:</Label>
            <Input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirme sua senha"
            />
          </InputGroup>

          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

          <Button type="submit" disabled={loading}>
            {loading ? "Criando..." : "Criar Conta"}
          </Button>
        </form>

        <BackToLoginLink onClick={handleBackToLogin}>
          Já tem uma conta? Voltar para o login
        </BackToLoginLink>
      </RegisterBox>
    </RegisterContainer>
  );
};

export default Register;
