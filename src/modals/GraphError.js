import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function GraphError({ show, onClose, errorMessage, originalError }) {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>{errorMessage}
                <h3>Something is wrong. i think it is not yout turn</h3>
            </Modal.Body>
            {originalError && (
                <Modal.Body>
                    Original Error: {originalError}
                </Modal.Body>
            )}
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default GraphError;
