import React from 'react'
import { Modal, Button } from "react-bootstrap";

function DeleteData({ show, handleClose, setConfirmDelete }) {
    const handleDelete = () => {
        setConfirmDelete(true);
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Body>
                <div className="fs-2 fw-bold text-orange text-center">Delete Data</div>
                <div className="text-center">Are you sure to delete this data ?</div>
                <div className="mt-3 text-center">
                    <Button
                        onClick={handleDelete}
                        size="sm"
                        className="btn-success me-2"
                        style={{ width: "132px" }}
                    >
                        Yes
                    </Button>
                    <Button
                        onClick={handleClose}
                        size="sm"
                        className="btn-danger"
                        style={{ width: "132px" }}
                    >
                        No
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default DeleteData