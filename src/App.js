import React, { useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { Modal, Button } from 'react-bootstrap';
import Sector from './components/Sector';
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
        setActiveUserId(data.game.activePlayerId);
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
                <h3>Game info</h3>
                <p>current player id = {currentPlayer}</p>
                <p>active user id = {activeUserId}</p>
                <div>
                  <h4>players:</h4>
                  <div className='d-flex gap-2'>
                    {players.map(player => (
                      <div key={player.id} className='border p-2' style={{ backgroundColor: player.hero.color }}>
                        <i className='bi bi-person'></i> {/* Bootstrap's person icon */}
                        ID: {player.id}, Name: {player.hero.name}
                      </div>
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
      {error && <GraphError show={true} onClose={() => setError(null)} errorMessage={error} originalError={error} />}

    </ApolloProvider>
  );
}

export default App;
