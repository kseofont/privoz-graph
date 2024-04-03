import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import getTrader from '../logic/getTrader';

const AddProducts = ({ show, onHide, player, sectorId, setError, client, setSectors, sectors, updateSectorsWithNewTrader, setPlayers }) => {
    const [activeCards, setActiveCards] = useState([]);

    const toggleActiveCard = (cardId) => {
        setActiveCards(currentActiveCards =>
            currentActiveCards.includes(cardId)
                ? currentActiveCards.filter(id => id !== cardId)
                : [...currentActiveCards, cardId]
        );
    };

    const productCardsIds = activeCards


    const handleOkClick = async () => {
        try {
            console.log('sectors in addproduct', sectors)
            await getTrader(
                // Assuming `client` and other parameters are available in your scope
                client,
                player.id,
                sectorId,
                
                productCardsIds,
                sectors,
               
                setError,
                setSectors,
                setPlayers
                // Ensure other parameters expected by getTrader are correctly passed
            );
            // Additional logic after successful getTrader call
            onHide();
        } catch (error) {
            console.error(error);
            // Use setError here if it's within scope and correctly passed
            setError && setError(error.toString());
        }
    };

    const matchingCards = player.productCards.filter(card =>
        card.sector.id === sectorId || card.sector.name === 'Illegal'
    );

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Products</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-column">
                    <div className={'player ' + player.hero.name.replace(/\s+/g, '-').toLowerCase()}>

                    </div>
                    <div className="d-flex flex-column align-items-center justify-content-center" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <h3>{player.hero.name}</h3>           <div className='d-flex align-items-center flex-column '>
                            <img src={`${process.env.PUBLIC_URL}/img/coin.webp`} alt="Coins" className='coins' /> {player.coins}
                        </div>

                    </div>
                </div>
                Sector ID: {sectorId}
                <div>Cards to Add:</div>
                <div className='d-flex gap-2 scroll-row'>
                    {matchingCards.map(card => (
                        <div key={card.id} onClick={() => toggleActiveCard(card.id)}
                            className={`product-card-wrap ${activeCards.includes(card.id) ? 'active' : ''}`}>
                            <ProductCard productCard={card} />
                        </div>
                    ))}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleOkClick}>
                    OK
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddProducts;

// Ensure getTrader is defined somewhere in your code and does what's required with the passed data.
