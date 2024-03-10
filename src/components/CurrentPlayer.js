// /components/CurrentPlayer.js
import React from 'react';
import ProductCard from './ProductCard';

function CurrentPlayer({ player }) {
    let traderCount = player.traders ? player.traders.length : 0; // Check if player.traders is defined
    console.log('player', player)

    return (
        <div key={player.id} className={'p-2'} style={{ color: player.hero.color }}>
            <div className="d-flex flex-column">


                <div className={'player ' + player.hero.name.replace(/\s+/g, '-').toLowerCase()}>
                    {traderCount > 0 && (
                        <div className='trader-count'>
                            <p>{traderCount} trader{traderCount !== 1 ? 's' : ''} in sector {player.sector}</p>


                        </div>

                    )}
                </div>
                <div className="d-flex flex-column align-items-center justify-content-center" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h3>{player.hero.name}</h3>
                    <div className="player-info d-flex justify-content-between w-100">

                        <div className='d-flex align-items-center flex-column '>
                            <img src={`${process.env.PUBLIC_URL}/img/coin.webp`} alt="Coins" className='coins' /> {player.coins}
                        </div>
                        <div className='d-flex align-items-center flex-column '>
                            <img src={`${process.env.PUBLIC_URL}/img/trader-img.webp`} alt="Trader" className='trader-img' />
                            {Number.isInteger(player.traders?.length) ? player.traders.length : 0}
                        </div>
                        <div className='d-flex align-items-center flex-column '>
                            <img src={`${process.env.PUBLIC_URL}/img/event-card-img.webp`} alt="Product Card" className='event-card-img product-card-img' />
                            {Number.isInteger(player.productCards?.length) ? player.productCards.length : 0}
                        </div>

                        {player.hero.image && (
                            <div className='d-flex align-items-center flex-column'>
                                <img src={player.hero.image} alt={player.hero.name} style={{ width: '50px', height: '50px' }} />
                            </div>
                        )}
                    </div>
                </div>

            </div>

            <div className="d-flex flex-column ">

                <div className="cards-info d-flex justify-content-between flex-column flex-sm-row ">

                    {player.productCards.map(productCard => (
                        console.log('productCard', productCard),

                        <ProductCard key={productCard.id} productCard={productCard} />
                    ))}

                </div>
                <div className="player-info-dev">
                    <div>CurrentPlayer ID: {player.id}</div>
                    <div>Hero ID: {player.hero.id}</div>


                    {player.hero.image && <div>Hero Image: <img src={player.hero.image} alt={player.hero.name} style={{ width: '50px', height: '50px' }} /></div>}
                </div>

            </div>
        </div>
    );
}

export default CurrentPlayer;
