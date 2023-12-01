import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUser, setNewUser] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  const handleButtonClick = async (operation) => {
    try {
      let response;

      switch (operation) {
        case 'button1':
          response = await axios.post('http://localhost:8080/paciente', {
            historico: 'Histórico do paciente',
            numSeguroSaude: '1234567890',
            pessoa: {
              nome: 'Gabriel',
              email: 'paciente@example.com',
              softDelete: false,
              usuario: 'usuario_paciente',
              senha: 'senha123',
              dataNasc: '1990-01-01',
              cpf: '12345678901',
              genero: {
                genero: 'MASCULINO',
              },
            },
          });
          showAlert('Cadastro de paciente realizado com sucesso!');
          break;

        case 'button2':
          response = await axios.get('http://localhost:8080/paciente/pessoas');
          setShowModal(true);
          setModalTitle('Dados dos Pacientes');
          setModalContent(JSON.stringify(response.data, null, 2));
          break;

        case 'button3':
          setShowModal(true);
          setModalTitle('Atualizar Dados');
          setNewName('');
          setNewUser('');
          break;

        case 'button4':
          setShowModal(true);
          setModalTitle('Confirmação de Desativação de Conta');
          setNewName('');
          setNewUser('');
          break;

        default:
          console.error('Operação inválida');
          return;
      }

      console.log(response?.data);
    } catch (error) {
      console.error('Erro na solicitação:', error);
      showAlert('Erro na solicitação. Consulte o console para mais detalhes.');
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.post('http://localhost:8080/paciente', {
        cod_paciente: 1,
        pessoa: {
          nome: newName,
        },
      });
  
      showAlert('Atualização de dados do paciente realizada com sucesso!');
      setShowModal(false);
    } catch (error) {
      console.error('Erro na solicitação:', error);
      showAlert('Erro na atualização. Consulte o console para mais detalhes.');
    }
  }; 

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:8080/paciente/1`);
      showAlert('Conta do paciente desativada com sucesso!');
      setShowModal(false);
    } catch (error) {
      console.error('Erro na solicitação:', error);
      showAlert('Erro na desativação. Consulte o console para mais detalhes.');
    }
  };
  
  const showAlert = (message) => {
    alert(message);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <div className="button-container">
        <h1 className='title'>Bem Vindo!</h1>
        <button className="button" onClick={() => handleButtonClick('button1')}>
          Cadastro de paciente
        </button>
        <button className="button" onClick={() => handleButtonClick('button2')}>
          Visualizar dados do paciente
        </button>
        <button className="button" onClick={() => handleButtonClick('button3')}>
          Atualizar dados do paciente
        </button>
        <button className="button" onClick={() => handleButtonClick('button4')}>
          Desativar conta do paciente
        </button>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalTitle}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalTitle === 'Atualizar Dados' ? (
            <Form>
              <Form.Group controlId="formNome">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite seu nome"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </Form.Group>
            </Form>
          ) : modalTitle === 'Confirmação de Desativação de Conta' ? (
            <Form>
              <Form.Group controlId="formNome">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite seu nome"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formUsuario">
                <Form.Label>Usuário</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite seu usuário"
                  value={newUser}
                  onChange={(e) => setNewUser(e.target.value)}
                />
              </Form.Group>
            </Form>
          ) : (
            <pre>{modalContent}</pre>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fechar
          </Button>
          {modalTitle === 'Confirmação de Desativação de Conta' ? (
            <Button variant="danger" onClick={handleConfirmDelete}>
              Confirmar Desativação
            </Button>
          ) : null}
          {modalTitle === 'Atualizar Dados' ? (
            <Button variant="primary" onClick={handleSaveChanges}>
              Salvar Alterações
            </Button>
          ) : null}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
