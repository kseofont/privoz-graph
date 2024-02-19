// Sector.js
import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import addTrader from '../logic/addTrader';

function Sector({ sector, players, currentPlayer }) {
    const [showAddTraderModal, setShowAddTraderModal] = useState(false);
    const [showMaxTradersModal, setShowMaxTradersModal] = useState(false);
    console.log(sector);
    const numPlayers = players.length;

    const numColumns = Math.min(numPlayers, 6); // Ensure a maximum of 6 columns
    const columnClass = `col-md-${Math.floor(12 / numColumns)}`;

    // Count how many traders are currently in the sector
    const currentTradersCount = sector.traders.length;

    const handleCloseModal = () => {
        setShowAddTraderModal(false);
    };

    // Function to handle adding a trader
    const handleAddTrader = () => {
        if (currentTradersCount >= numPlayers) {
            setShowMaxTradersModal(true);
        } else {
            setShowAddTraderModal(true);
        }
    };

    const handleConfirmAddTrader = () => {
        let sectorId = sector.id;
        let playerId = currentPlayer;
        addTrader(sectorId, playerId);
        console.log('sectorId', sectorId);
        console.log('currentPlayer', playerId);
        setShowAddTraderModal(false);
    };

    return (
        <div className="col mb-3">
            <div className={`sector border p-3 mb-3 h-100 ${sector.name.toLowerCase()}`}>
                <h4>{sector.name}</h4>

                <div className="row gap-1">
                    <div className={`d-flex flex-column gap-1 ${columnClass}`}>


                        <ul>
                            {sector.traders.map(trader => (
                                <li key={trader.id}>{trader.player.id}</li>
                            ))}
                        </ul>


                    </div>
                </div>
                <button onClick={handleAddTrader}>Add Trader</button>
            </div>
            {/* Modal for maximum traders reached */}
            <Modal show={showMaxTradersModal} onHide={() => setShowMaxTradersModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Maximum Traders Reached</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Maximum number of traders ({numPlayers}) reached in this sector. You
                    cannot add another trader.
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={() => setShowMaxTradersModal(false)}
                    >
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Modal for adding a new trader */}
            <Modal show={showAddTraderModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Trader Addition</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to add a trader to {sector.name} sector?
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
        </div>
    );
}

export default Sector;
