// Sector.js
import React from 'react';

function Sector({ sector, players, handleAddTrader, handleAddProducts, currentPlayer }) {
    const numPlayers = players.length;
    const numColumns = Math.min(numPlayers, 6);
    const columnClass = `col-md-${Math.floor(12 / numColumns)}`;
    const currentTradersCount = sector.traders.length;
    console.log(currentPlayer);
    const currentPlayerData = players.find(player => player.id === currentPlayer) || null;

    

    return (
        <div className="col mb-3">
            <div className={`sector  p-3 mb-3 h-100 ${sector.name.toLowerCase()}`}>
                <h4>{sector.name}</h4>
                <div className="">
                    <div className={`justify-content-between d-flex`}>

                        {sector.traders.length > 0 && sector.traders.map(trader => (
                            trader.player && (
                                <div key={trader.id} className={`trader d-flex flex-column ustify-content-center align-items-center gap-1 ${columnClass}`} >

                                    <i className='bi bi-person d-flex justify-content-center align-items-center'
                                        style={{ color: trader.player.hero?.color }}>
                                    </i>


                                    <p>{trader.player.id}</p>
                                    <p>{trader.player.hero.name}</p>
                                 

                                </div>
                            )
                        ))}
                        {/* {sector.traders.length > 0 && sector.traders.map(trader => (
                        trader.player && (
                            <li key={trader.id}>
                                {trader.player.id}
                            </li>
                        )
                    ))} */}



                    </div>
                </div>
                <button onClick={() => handleAddTrader(sector.id)}>Get Trader</button>
                <button onClick={() => handleAddProducts(sector.id)}>Add Products</button>
            </div>
        </div>
    );
}

export default Sector;
