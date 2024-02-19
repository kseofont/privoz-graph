// App.js
import React, { useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
//import GameData from './components/GameData';
import Sector from './components/Sector';
import checkMyTurn from './logic/checkMyTurn';
import getSectors from './logic/getSectors';
import getPlayers from './logic/getPlayers';

const client = new ApolloClient({
  uri: 'https://privoz.lavron.dev/graphql/',
  cache: new InMemoryCache()
});


let turnChecked = false; // Boolean flag to track whether trader has been added

function nextStep() {
  console.log('nextStep added');
}

function App() {
  const [sectors, setSectors] = useState([]); // Use state to store sectors data
  const [players, setPlayers] = useState([]); // Use state to store players data

  const currentPlayer = '11';

  useEffect(() => {
    async function fetchData() {
      const sectorsData = await getSectors(client);
      const playersData = await getPlayers(client);

      setPlayers(playersData);
      console.log('playersData ', playersData);
      setSectors(sectorsData); // Set sectors data in state
      const isMyTurn = await checkMyTurn(client, currentPlayer);
      if (isMyTurn && !turnChecked) { // Check if it's the player's turn and trader hasn't been added yet
        nextStep();
        turnChecked = true; // Set the flag to true to prevent subsequent calls to addTrader
      }
    }
    fetchData();
  }, []);

  console.log('sectors', sectors)

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-9">
              <h2>Privoz Bazar</h2>
              <div className="game-phase  mb-2 border border-green px-3 py-2">
                <h3>Game Phase</h3>
                {/* <GameData /> */}

              </div>
              <div className="row row-cols-1 row-cols-md-2">
                {/* Display sectors */}
                {sectors.map(sector => (
                  <Sector key={sector.id} sector={sector} players={players} currentPlayer={currentPlayer} client={client} />
                ))}
              </div>
            </div>
            <div className="col-md-3">
              {/* Display menu and sidebar */}
            </div>
          </div>
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;
