import React, {useState} from 'react'
import { Alert, Container, Form } from 'react-bootstrap'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import NavAdmin from '../../components/navbar/NavAdmin'
import { API } from '../../config/api'

function AddFilm() {
    const title = "Add Film"
    document.title = "Cinema Online | " + title

    let navigate = useNavigate()

    const [preview, setPreview] = useState(null);
    const [errorMessage, setErrorMessage]  = useState(null)
    const [form, setForm] = useState({
        title: "",
        desc: "",
        price: "",
        category: "",
        embedId : "",
        img: ""
    })
    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value
        })

        if(e.target.type === "file"){
            let url = URL.createObjectURL(e.target.files[0])
            setPreview(url)
        }
    }

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault()
            
            const config = {
                headers: {
                    Authorization: "Basic " + localStorage.token,
                },
            }

            const formData = new FormData()
            formData.set("title", form.title)
            formData.set("desc", form.desc)
            formData.set("price", form.price)
            formData.set("category", form.category)
            formData.set("embedId", form.embedId)
            formData.set("img", form?.img[0], form?.img[0]?.name)
            // Alert
            const alert = (
                <Alert variant="success" className="py-1">
                    Add film success
                </Alert>
            )
            setErrorMessage(alert)
            // Insert
            const response = await API.post("/film", formData, config)
            console.log(response)
            navigate("/dashboard")
        } catch (error) {
            console.log(error)
            const alert = (
                <Alert variant="danger" className="py-1">
                    Add film failed
                </Alert>
            )
            setErrorMessage(alert)
        }
    })
    return (
        <div>
        <NavAdmin />
        <Container>
            <h2 className="fw-bold text-center">Add Film</h2>
            {errorMessage && errorMessage}
            <div className="d-flex justify-content-center">
                <Form
                    style={{ width: "600px" }}
                    onSubmit={e => handleSubmit.mutate(e)}
                >
                    <Form.Group className="mb-2">
                        <Form.Label htmlFor="title">Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Title"
                            id="title"
                            name="title"
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label htmlFor="name">
                            Description
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            placeholder="Enter Description"
                            rows={3}
                            id="desc"
                            name="desc"
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label htmlFor="price">
                            Price
                        </Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter Price (Rp.)"
                            id="price"
                            name="price"
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label htmlFor="category">Category</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Category"
                            id="category"
                            name="category"
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label htmlFor="embedId">Embed Id</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Embed Id"
                            id="embedId"
                            name="embedId"
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-5">
                        {preview && (
                            <div>
                                <img
                                    src={preview}
                                    style={{
                                        maxWidth: "150px",
                                        objectFit: "cover",
                                    }}
                                    alt={preview}
                                />
                            </div>
                        )}
                        <Form.Label htmlFor='upload'>Upload Thumbnail</Form.Label>
                        <Form.Control
                            type="file"
                            id="upload"
                            name="img"
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <div className="text-end">
                        <button
                            type="submit"
                            className="btn btn-success col-5 mb-3"
                        >
                            Add Film
                        </button>
                    </div>
                </Form>
            </div>
        </Container>
        </div>
    )
}

export default AddFilm