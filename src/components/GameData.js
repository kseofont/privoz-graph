import React, { useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_SECTOR_DATA = gql`
  query checkPhase {
    game {
      currentPhase
      currentTurnIndex
      players {
        id
        hero {
          id
          name
        }
        traders {
          id
          sector {
            traders {
              id
            }
            name
            id
          }
        }
      }
    }
  }
`;

function GameData() {
    const currentPlayerId = '11'; // Define currentPlayerId
    const { loading, error, data } = useQuery(GET_SECTOR_DATA);

    useEffect(() => {
        //   console.log('Component rendered');
        //  console.log('Data:', data);
        return () => {
            //    console.log('Component unmounted');
        };
    }, [data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    // Check if player with currentPlayerId and same currentTurnIndex exists
    const playerExists = data.game.players.some(player => player.id === currentPlayerId);

    const currentPlayer = data.game.players.find(player => player.id === currentPlayerId);
    const currentPlayerIndex = data.game.players.findIndex(player => player.id === currentPlayerId);

    const myTurn = currentPlayerIndex !== -1 && currentPlayerIndex === data.game.currentTurnIndex;
    // console.log(currentPlayerIndex);

    return (
        <div>
            <h3>Game Data</h3>
            <p>Current Turn Index: {data.game.currentTurnIndex}</p>
            <p>Current Phase: {data.game.currentPhase}</p>
            {playerExists && <p>Player with ID {currentPlayerId} exists in the game.</p>}
            {myTurn ? <p>It's my turn!</p> : <p>It's not my turn.</p>}
            {/* Render other data as needed */}
        </div>
    );
}

export default GameData;
