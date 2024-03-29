import { gql } from '@apollo/client';

export const GET_PLAYERS_DATA = gql`
query GetPlayers {
  game {
    sectors {
      id
      name
    }
    players {
      productCards {
        id
        product {
          name
          buyPrice
          description
          id
          image
          isLegal
          sellPrice
        }
        sector {
          id
          name
        }
      }
      id
      hero {
        premiumSector {
          id
          name
        }
        color
        id
        image
        name
      }
      coins
    }
  }
}
`;

async function GetPlayers(client) {
  try {
    const { data } = await client.query({ query: GET_PLAYERS_DATA });
    //  console.log(data)
    const players = data.game.players;
    return players;
  } catch (error) {
    // Handle error
    console.error('Error while fetching players:', error);
    return [];
  }
}

export default GetPlayers;
