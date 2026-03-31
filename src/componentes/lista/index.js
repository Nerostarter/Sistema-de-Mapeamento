import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 70%;
  padding: 10px;
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

const Button = styled.button`
  padding: 10px 20px;
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

const ActionButton = styled(Button)`
  margin-left: 10px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const TableHeader = styled.th`
  padding: 12px;
  background: #6a11cb;
  color: #fff;
  text-align: left;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f9f9f9;
  }

  &:hover {
    background: #f1f1f1;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border: 1px solid #ddd;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 25px;
  border-radius: 8px;
  width: 500px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  margin-bottom: 20px;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;

  &:focus {
    border-color: #6a11cb;
    box-shadow: 0 0 5px rgba(106, 17, 203, 0.5);
  }
`;

const ModalLabel = styled.label`
  display: block;
  text-align: left;
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const TabelaPontos = () => {
  const [pontos, setPontos] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [etiqueta, setEtiqueta] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [tipo, setTipo] = useState("");
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPontos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/pontos");
        setPontos(response.data);
      } catch (err) {
        console.error("Erro ao buscar pontos:", err);
      }
    };

    fetchPontos();
  }, []);

  const filteredPontos = pontos.filter((ponto) =>
    ponto.etiqueta.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreate = async () => {
    if (
      !etiqueta.trim() ||
      !latitude.trim() ||
      !longitude.trim() ||
      !logradouro.trim() ||
      !tipo.trim()
    ) {
      alert("Por favor, preencha todos os campos antes de criar um ponto.");
      return;
    }

    try {
      const lat = parseFloat(latitude.replace(",", "."));
      const lng = parseFloat(longitude.replace(",", "."));

      if (
        isNaN(lat) ||
        isNaN(lng) ||
        lat < -90 ||
        lat > 90 ||
        lng < -180 ||
        lng > 180
      ) {
        alert("Coordenadas inválidas");
        return;
      }

      const newPonto = {
        etiqueta: etiqueta.trim(),
        latitude: lat,
        longitude: lng,
        logradouro: logradouro.trim(),
        tipo: tipo.trim(),
      };

      console.log("Dados enviados para criação:", newPonto);

      await axios.post("http://localhost:5000/pontos", newPonto, {
        headers: { "Content-Type": "application/json" },
      });

      setPontos((prevPontos) => [...prevPontos, newPonto]);
      setShowModal(false);
      setEtiqueta("");
      setLatitude("");
      setLongitude("");
      setLogradouro("");
      setTipo("");
    } catch (err) {
      console.error("Erro ao criar ponto:", err.response?.data || err);
    }
  };

  const handleEdit = (ponto) => {
    setEditId(ponto.id);
    setEtiqueta(ponto.etiqueta);
    setLatitude(String(ponto.latitude));
    setLongitude(String(ponto.longitude));
    setLogradouro(ponto.logradouro);
    setTipo(ponto.tipo);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    if (
      !etiqueta.trim() ||
      !latitude.trim() ||
      !longitude.trim() ||
      !logradouro.trim() ||
      !tipo.trim()
    ) {
      alert("Por favor, preencha todos os campos antes de atualizar.");
      return;
    }

    try {
      const updatedPonto = {
        etiqueta: etiqueta.trim(),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        logradouro: logradouro.trim(),
        tipo: tipo.trim(),
      };

      console.log("Dados enviados para atualização:", updatedPonto);

      await axios.put(`http://localhost:5000/pontos/${editId}`, updatedPonto, {
        headers: { "Content-Type": "application/json" },
      });

      setPontos((prevPontos) =>
        prevPontos.map((ponto) =>
          ponto.id === editId ? { ...ponto, ...updatedPonto } : ponto,
        ),
      );

      setShowModal(false);
      setEditId(null);
      setEtiqueta("");
      setLatitude("");
      setLongitude("");
      setLogradouro("");
      setTipo("");
    } catch (err) {
      console.error("Erro ao atualizar ponto:", err.response?.data || err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que quer deletar?");

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/pontos/${id}`);

      // remove da tela também
      setPontos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Erro ao deletar:", err);
    }
  };

  return (
    <div>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Buscar por etiqueta"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div>
          <Button
            onClick={() => {
              setShowModal(true);
              setEtiqueta("");
              setLatitude("");
              setLongitude("");
              setLogradouro("");
              setTipo("");
              setEditId(null);
            }}
          >
            Criar
          </Button>
          <ActionButton onClick={() => navigate("/mapa")}>
            Voltar para o Mapa
          </ActionButton>
        </div>
      </SearchContainer>

      <Table>
        <thead>
          <tr>
            <TableHeader>Etiqueta</TableHeader>
            <TableHeader>Latitude</TableHeader>
            <TableHeader>Longitude</TableHeader>
            <TableHeader>Logradouro</TableHeader>
            <TableHeader>Tipo</TableHeader>
            <TableHeader>Ações</TableHeader>
          </tr>
        </thead>
        <tbody>
          {filteredPontos.map((ponto) => (
            <TableRow key={ponto.id}>
              <TableCell>{ponto.etiqueta}</TableCell>
              <TableCell>{ponto.latitude}</TableCell>
              <TableCell>{ponto.longitude}</TableCell>
              <TableCell>{ponto.logradouro}</TableCell>
              <TableCell>{ponto.tipo}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(ponto)}>Editar</Button>
                <ActionButton onClick={() => handleDelete(ponto.id)}>
                  Deletar
                </ActionButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <h3>{editId ? "Editar Ponto" : "Criar Novo Ponto"}</h3>

            <div>
              <ModalLabel>Etiqueta:</ModalLabel>
              <ModalInput
                type="text"
                value={etiqueta}
                onChange={(e) => setEtiqueta(e.target.value)}
              />
            </div>

            <div>
              <ModalLabel>Latitude:</ModalLabel>
              <ModalInput
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </div>

            <div>
              <ModalLabel>Longitude:</ModalLabel>
              <ModalInput
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </div>

            <div>
              <ModalLabel>Logradouro:</ModalLabel>
              <ModalInput
                type="text"
                value={logradouro}
                onChange={(e) => setLogradouro(e.target.value)}
              />
            </div>

            <div>
              <ModalLabel>Tipo:</ModalLabel>
              <ModalInput
                type="text"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              />
            </div>

            <ButtonContainer>
              <Button onClick={editId ? handleUpdate : handleCreate}>
                {editId ? "Atualizar" : "Criar"}
              </Button>
              <ActionButton onClick={() => setShowModal(false)}>
                Cancelar
              </ActionButton>
            </ButtonContainer>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};

export default TabelaPontos;
