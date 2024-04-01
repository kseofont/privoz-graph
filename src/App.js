import React, { useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { Modal, Button } from 'react-bootstrap';
import Sector from './components/Sector';
import Player from './components/Player';
import CurrentPlayer from './components/CurrentPlayer';
import checkMyTurn, { GET_GAME_DATA } from './logic/checkMyTurn';
import getSectors from './logic/getSectors';
import getPlayers from './logic/getPlayers';
//import addTrader from './logic/addTrader'; // Import addTrader function
import GraphError from './modals/GraphError';
import { useSearchParams } from "react-router-dom";
import getTrader from './logic/getTrader';
import AddProducts from './modals/AddProducts'; 

export const client = new ApolloClient({
  uri: 'https://privoz.lavron.dev/graphql/',
  cache: new InMemoryCache()
});

function App() {
  const [sectors, setSectors] = useState([{ id: 1, name: "Fruits", traders: [] },
    { id: 2, name: "Dairy", traders: [] },
    { id: 3, name: "Fish", traders: [] },
    { id: 4, name: "Vegetables", traders: [] },
    { id: 5, name: "Meat", traders: [] }, 
    { id: 6, name: "Household", traders: [] }, ]);

  const [players, setPlayers] = useState([]);
  const [product, setProduct] = useState([]);
  const [showAddTraderModal, setShowAddTraderModal] = useState(false);
  const [showMaxTradersModal, setShowMaxTradersModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [selectedSectorId, setSelectedSectorId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPlayer = searchParams.get("player"); // Set initial current player
  const [activeUserId, setActiveUserId] = useState(null);
  const [error, setError] = useState(null);
  console.log('sectors', sectors)
  console.log('activeUserId first', activeUserId)

  useEffect(() => {
    async function fetchData() {
      try {
        const sectorsData = await getSectors(client) || []; // Ensure an array, even if null is returned
        const playersData = await getPlayers(client) || []; // Ensure an array, even if null is returned
        if (Array.isArray(sectorsData)) {
          const sectorOrder = ["Fruits", "Dairy", "Fish", "Vegetables", "Meat", "Household", "Illegal"];
          const myMaxValue = 6; // Use this for sectors not found in sectorOrder

          // Sort sectorsData based on the sectorOrder
          sectorsData.sort((a, b) => {
            let indexA = sectorOrder.indexOf(a.name);
            let indexB = sectorOrder.indexOf(b.name);

            if (indexA === -1) indexA = myMaxValue;
            if (indexB === -1) indexB = myMaxValue;

            return indexA - indexB;
          });
          setSectors(sectorsData);
        } else {
          console.error('Fetched sectors data is not an array:', sectorsData);
          // Handle the error appropriately
        }

        // Decide on whether you want the filtered or the unfiltered list here
        const filteredSectors = sectorsData.filter(sector => !sector.illegal);
        setSectors(filteredSectors); // Use either filteredSectors or sectorsData

        setPlayers(playersData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        // Set defaults in case of error
        setSectors([]);
        setPlayers([]);
      }
    }
    fetchData();
  }, [currentPlayer]); // Dependencies array

  useEffect(() => {
    async function fetchActiveUserId() {
      try {
        const { data } = await client.query({ query: GET_GAME_DATA ,
          fetchPolicy: 'network-only'});
        console.log('Fetched data:', data);
        setActiveUserId(data.game.queue.activePlayerId);
      } catch (error) {
        console.error('Error fetching active user id:', error);
      }
    }

    if (activeUserId === null) {
      // If activeUserId is null, try fetching it immediately.
      fetchActiveUserId();
    } else {
      // If activeUserId is already set, start the interval for periodic fetching.
      const intervalId = setInterval(fetchActiveUserId, 3000);

      // Cleanup on component unmount or when activeUserId changes.
      return () => clearInterval(intervalId);
    }
  }, [activeUserId]); // Depend on activeUserId to restart the interval when it changes.
  console.log('activeUserId out', activeUserId);

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
  const handleAddProducts = (sectorId) => {
    console.log(sectorId);
    setSelectedSectorId(sectorId);
    setShowProductsModal(true);

  };
  const player = players.find(player => player.id === currentPlayer) || null;

  const handleConfirmGetTrader = async () => {
    try {
      if (selectedSectorId && currentPlayer) {
        const currentPlayerObject = players.find(player => player.id === currentPlayer);
        if (currentPlayerObject) {

          // console.log('sectors', sectors)
          // console.log('currentPlayerObject', currentPlayerObject)
          // Filter product cards of the currentPlayerObject that have the same sector ID as the selected sector
          const filteredProductCards = currentPlayerObject.productCards.filter(card => card.sector.id === selectedSectorId);

          // Update the product state with the filtered product cards
          setProduct([...product, ...filteredProductCards]);
          console.log('filteredProductCards', filteredProductCards)

          // Example call to getTrader
          await getTrader(client, currentPlayerObject.id, selectedSectorId, filteredProductCards.map(card => card.id), setError, updateSectorsWithNewTrader, setSectors, sectors, setProduct, product, );

          //   await getTrader(selectedSectorId, currentPlayerObject, setError, setSectors, sectors, setProduct, product);
        }
        setShowAddTraderModal(false);
      }
    } catch (error) {
      setShowAddTraderModal(false);
      setError(error.message);
    }
  };





  useEffect(() => {
    console.log("Updated sectors state:", sectors);
  }, [sectors]);

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <div className="container-fluid">
          <div className="row">
            <div className="col p-0">
              <h2>Privoz Bazar</h2>
              <div className="game-phase mb-2 border border-green px-3 py-2">

                <div className="game-info d-flex flex-column flex-sm-row  gap-2 justify-content-between">
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
                  <div className="d-flex flex-column flex-sm-row gap-2 p-2">
                    {players.map(player => (
                      <Player key={player.id} player={player} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="row row-cols-1 row-cols-md-3 px-2">
                {sectors.map(sector => (
                  <Sector
                    key={sector.id}
                    sector={sector}
                    players={players}
                    currentPlayer={currentPlayer}
                    handleAddTrader={handleAddTrader}
                    handleAddProducts={handleAddProducts}
                 //   updateSectorsWithNewTrader={updateSectorsWithNewTrader}
                  />
                ))}
              </div>
              <div className="current-player-info">
                {players.filter(player => player.id === currentPlayer).map(player => (
                  <CurrentPlayer key={player.id} player={player} />
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
          <Button variant="primary" onClick={handleConfirmGetTrader}>
            Get Trader
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
      {player && <AddProducts
        show={showProductsModal}
        onHide={handleCloseProductsModal}
        player={player}
        sectorId={selectedSectorId}
        setError={setError}
        client={client}
        sectors={sectors}
        setSectors={setSectors}
      //  updateSectorsWithNewTrader={updateSectorsWithNewTrader}
      />}
      {error && <GraphError show={true} onClose={() => setError(null)} errorMessage={error} originalError={error} />}

    </ApolloProvider>
  );
}

export default App;
