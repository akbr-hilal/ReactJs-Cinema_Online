import React, { useContext, useState } from "react";
import {Modal, Alert} from "react-bootstrap"
import {useMutation} from '@tanstack/react-query'
import { useNavigate } from "react-router-dom";
import { API } from "../../../config/api";
import { UserContext } from "../../../context/userContext";

import Register from "./Register";

export default function Login({show, handleClose}) {
    let navigate = useNavigate()

    const [state, dispatch] = useContext(UserContext)
    const [errorMessage, setErrorMessage] = useState("")
    const [form, setForm] = useState({
        email: "",
        password: "",
    })
    console.log(state)
    const {email, password} = form;

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault()

            const config = {
                headers: {
                    "Content-type": "application/json"
                },
            }
            const body = JSON.stringify(form)

            const response = await API.post("/login", body, config)
            console.log(response)
            console.log(response.data.message);

            if (response?.status === 200) {
                // Send data to useContext
                dispatch({
                    type: "LOGIN_SUCCESS",
                    payload: response.data.data,
                });
        
                // Status check
                if (response.data.data.status === "admin") {
                    navigate("/data-film");
                } else {
                    navigate("/film");
                }
        
                const alert = (
                    <Alert variant="success" className="py-1">
                        Login success
                    </Alert>
                );
                setErrorMessage(alert);
            } 
        } catch (error) {
            console.log(error)
            console.log(error.response.data.message)
            const alert = (
                <Alert variant="danger" className="py-1">
                    {error.response.data.message || error.response.data.error.message}
                </Alert>
            );
            setErrorMessage(alert);
        }
    })
    const [showRegister, setShowRegister] = useState(false)
    const handleShowRegister = () => setShowRegister(true)

    const handleRegister = () => {
        handleShowRegister()
    }
    const handleCloseRegister = () => setShowRegister(false)

    return(
        <Modal className="modal-auth" show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <div className="fs-2">Login</div>
                </Modal.Title>
             </Modal.Header>
            <Modal.Body>
                <div className="text-center">Please login to continue</div>
                {errorMessage && errorMessage}
                <div>
                    <form onSubmit={(e) => handleSubmit.mutate(e)}>
                        <div className="form text-center">
                            <div className="text-start mt-3">Email</div>
                            <input type="email" placeholder="Email" name="email" className="px-3 py-2 col-12" value={email} onChange={handleChange}/>
                            <div className="text-start mt-2">Password</div>
                            <input type="password" placeholder="Password" name="password" className="px-3 py-2 col-12" value={password} onChange={handleChange}/>
                        </div>
                        <div className="mt-3 text-end">
                            <button className="btn btn-danger col-12">Login</button>
                        </div>
                        <div className="mt-2 text-center">
                            <p>Dont'have an account? <span className="fw-bold" onClick={handleRegister}>Register Now</span> </p>
                        </div>
                    </form>
                </div>
            </Modal.Body>
            <Register show={showRegister} handleClose={handleCloseRegister}/>
        </Modal>
    )
}