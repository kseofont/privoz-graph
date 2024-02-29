import React, { useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { Modal, Button } from 'react-bootstrap';
import Sector from './components/Sector';
import Player from './components/Player';
import checkMyTurn, { GET_GAME_DATA } from './logic/checkMyTurn';
import getSectors from './logic/getSectors';
import getPlayers from './logic/getPlayers';
import addTrader from './logic/addTrader'; // Import addTrader function
import GraphError from './modals/GraphError';

const client = new ApolloClient({
  uri: 'https://privoz.lavron.dev/graphql/',
  cache: new InMemoryCache()
});

function App() {
  const [sectors, setSectors] = useState([]);
  const [players, setPlayers] = useState([]);
  const [showAddTraderModal, setShowAddTraderModal] = useState(false);
  const [showMaxTradersModal, setShowMaxTradersModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [selectedSectorId, setSelectedSectorId] = useState(null);
  const currentPlayer = '13'; // Set initial current player
  const [activeUserId, setActiveUserId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const sectorsData = await getSectors(client);
      const playersData = await getPlayers(client);

      setPlayers(playersData);
      const filteredSectors = sectorsData.filter(sector => !sector.illegal);
      setSectors(filteredSectors);

      setSectors(sectorsData); // Set sectors daa in state
      const isMyTurn = await checkMyTurn(client, currentPlayer);
      if (isMyTurn) {
        nextStep();
      }
    }
    fetchData();
  }, [currentPlayer]); // Add currentPlayer to the dependency array

  useEffect(() => {
    async function fetchActiveUserId() {
      try {
        const { data } = await client.query({ query: GET_GAME_DATA });
        //  console.log('data', data);
        setActiveUserId(data.game.moveOrder.activePlayerId);
      } catch (error) {
        console.error('Error fetching active user id:', error);
      }
    }
    fetchActiveUserId();
  }, []); // Run once on component mount

  const nextStep = () => {
    console.log('nextStep added');
  };

  const handleAddTrader = (sectorId) => {
    setSelectedSectorId(sectorId);
    const sector = sectors.find(sector => sector.id === sectorId);
    if (sector && sector.traders.length > players.length) {
      setShowMaxTradersModal(true);
    } else {
      setShowAddTraderModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowAddTraderModal(false);
    setShowMaxTradersModal(false);
  };

  const handleCloseRulesModal = () => {
    setShowRulesModal(false);

  };
  const handleCloseProductsModal = () => {
    setShowProductsModal(false);

  };

  const handleConfirmAddTrader = async () => {
    try {
      if (selectedSectorId) {
        await addTrader(selectedSectorId, currentPlayer, setError, setSectors);
        setShowAddTraderModal(false);
      }
    } catch (error) {
      setShowAddTraderModal(false);
      setError(error.message);
    }
  };


  return (
    <ApolloProvider client={client}>
      <div className="App">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <h2>Privoz Bazar</h2>
              <div className="game-phase mb-2 border border-green px-3 py-2">

                <div className="game-info d-flex gap-2 justify-content-between">
                  <div className="active-user-info">
                    <p>current player id = {currentPlayer}</p>

                    <p>active user id = {activeUserId}</p>

                  </div>
                  <div className="game-info">
                    <Button variant="info" onClick={() => setShowRulesModal(true)}>Show Rules</Button>
                    <Button variant="info" onClick={() => setShowProductsModal(true)}>Products</Button>
                  </div>



                </div>
                <div className='players-info'>
                  <h4>players:</h4>
                  <div className='d-flex gap-2 p-2 '>
                    {players.map(player => (
                      <Player key={player.id} player={player} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="row row-cols-1 row-cols-md-2">
                {sectors.map(sector => (
                  <Sector
                    key={sector.id}
                    sector={sector}
                    players={players}
                    currentPlayer={currentPlayer}
                    handleAddTrader={handleAddTrader}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for adding a new trader */}
      <Modal show={showAddTraderModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Trader Addition</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to add a trader to selected sector?
          <p>New Trader price is  coins</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmAddTrader}>
            Add Trader
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal for maximum traders reached */}
      <Modal show={showMaxTradersModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Maximum Traders Reached</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Maximum number of traders reached in this sector. You cannot add another trader.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showRulesModal} onHide={handleCloseRulesModal}>
        <Modal.Header closeButton>
          <Modal.Title>Rules</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Ход игры:

          1 Получение карт товаров - например - 7 карт на руку

          2 Определение положения на карте:

          Игроки по очереди выбирают места для своих продавцов в зонах.
          3 Продажа всех товаров
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseRulesModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showProductsModal} onHide={handleCloseProductsModal}>
        <Modal.Header closeButton>
          <Modal.Title>Products</Modal.Title>
        </Modal.Header>
        <Modal.Body>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseProductsModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
      {error && <GraphError show={true} onClose={() => setError(null)} errorMessage={error} originalError={error} />}

    </ApolloProvider>
  );
}

export default App;
