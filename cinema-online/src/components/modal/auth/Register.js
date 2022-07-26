import React from "react";
import {Modal} from "react-bootstrap"

export default function Register({show, handleClose}) {
    return(
        <Modal className="modal-auth" show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <div className="fs-2">Register</div>
                </Modal.Title>
             </Modal.Header>
            <Modal.Body>
                <div className="text-center">Please register to continue</div>
                <div>
                    <form>
                        <div className="form text-center">
                            <div className="text-start mt-3">Fullname</div>
                            <input type="text" placeholder="Fullname" name="fullname" className="px-3 py-2 col-12"/>
                            <div className="text-start mt-2">Email</div>
                            <input type="email" placeholder="Email" name="email" className="px-3 py-2 col-12"/>
                            <div className="text-start mt-2">Password</div>
                            <input type="password" placeholder="Password" name="password" className="px-3 py-2 col-12" />
                        </div>
                        <div className="mt-3 text-end">
                            <button className="btn btn-danger col-12">Register</button>
                        </div>
                        <div className="mt-2 text-center">
                            <p>Already have an account? <span className="fw-bold">Login Now</span> </p>
                        </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    )
}