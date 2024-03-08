import { gql } from '@apollo/client';

const GET_PLAYERS_DATA = gql`
query GetPlayers {
  game {
      players {
      coins
      id
      productCards {
        product {
          id
          buyPrice
          description
          name
          sector {
            id
          }
          image
          isLegal
        }
        id
      }
      hero {
        name
        id
        color
        image
        premiumSector {
          id
          name
        }
      }
      traders {
        id
      }
    }
  }
}
`;

async function GetPlayers(client) {
  try {
    const { data } = await client.query({ query: GET_PLAYERS_DATA });
    console.log(data)
    const players = data.game.players;
    return players;
  } catch (error) {
    // Handle error
    console.error('Error while fetching players:', error);
    return [];
  }
}

export default GetPlayers;
