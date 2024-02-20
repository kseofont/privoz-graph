// Sector.js
import React from 'react';

function Sector({ sector, players, handleAddTrader }) {
    const numPlayers = players.length;
    const numColumns = Math.min(numPlayers, 6);
    const columnClass = `col-md-${Math.floor(12 / numColumns)}`;
    const currentTradersCount = sector.traders.length;

    return (
        <div className="col mb-3">
            <div className={`sector border p-3 mb-3 h-100 ${sector.name.toLowerCase()}`}>
                <h4>{sector.name}</h4>
                <div className="row gap-1">
                    <div className={`d-flex flex-column gap-1 ${columnClass}`}>
                        <ul>
                            {sector.traders.length > 0 && sector.traders.map(trader => (
                                trader.player && (
                                    <li key={trader.id}>
                                        {trader.player.id}
                                    </li>
                                )
                            ))}

                        </ul>
                    </div>
                </div>
                <button onClick={() => handleAddTrader(sector.id)}>Add Trader</button>
            </div>
        </div>
    );
}

export default Sector;
