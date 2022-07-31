import React, { useState } from "react";
import {Alert, Modal} from "react-bootstrap"
import { useMutation } from "@tanstack/react-query";
import { API } from "../../../config/api";

export default function Register({show, handleClose}) {

    const [errorMessage, setErrorMessage] = useState("")
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    })

    const { name, email, password } = form

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault()

            
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const body = JSON.stringify(form)

            const response = await API.post("/register", body, config)

            if(response?.status === 200){
                const alert = (
                    <Alert variant="success" className="p-2">
                        Success
                    </Alert>
                )
                setErrorMessage(alert)
                setForm({
                    name: "",
                    email: "",
                    password: "",
                })
            } 
        } catch (error) {
            console.log(error)
            console.log(error.response.data.message)
            console.log(error.response.data.error.message)
            const alert = (
                <Alert variant="danger" className="p-2">
                    {error.response.data.message || error.response.data.error.message}
                </Alert>
            )
            setErrorMessage(alert)
        }
    })

    return(
        <Modal className="modal-auth" show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <div className="fs-2">Register</div>
                </Modal.Title>
             </Modal.Header>
            <Modal.Body>
                <div className="text-center">Please register to continue</div>
                {errorMessage && errorMessage}
                <div>
                    <form onSubmit={(e) => handleSubmit.mutate(e)}>
                        <div className="form text-center">
                            <div className="text-start mt-3">Name</div>
                            <input type="text" placeholder="Name" name="name" className="px-3 py-2 col-12" value={name} onChange={handleChange}/>
                            <div className="text-start mt-2">Email</div>
                            <input type="email" placeholder="Email" name="email" className="px-3 py-2 col-12" value={email} onChange={handleChange}/>
                            <div className="text-start mt-2">Password</div>
                            <input type="password" placeholder="Password" name="password" className="px-3 py-2 col-12" value={password} onChange={handleChange}/>
                        </div>
                        <div className="mt-3 text-end">
                            <button type="submit" className="btn btn-danger col-12">Register</button>
                        </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    )
}