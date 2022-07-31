import React, {useEffect, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Alert, Container, Form } from 'react-bootstrap'
import { useMutation} from '@tanstack/react-query'
import NavAdmin from '../../components/navbar/NavAdmin'
import { API } from '../../config/api'


function EditFilm() {
  const title = "Edit Film"
  document.title = "Cinema Online | " + title

  let navigate = useNavigate()
  const { id } = useParams()

  const [preview, setPreview] = useState(null);
  const [errorMessage, setErrorMessage]  = useState("")
  const [film, setFilm] = useState({})
  const [form, setForm] = useState({
    title: "",
    desc: "",
    price: "",
    category: "",
    embedId : "",
    img: ""
  })
  
  let getFilm = async () => {
    const response = await API.get('/film/' + id)
    console.log(response)
    setFilm(response.data.data)
    setPreview(response.data.data.img)
    setForm({
      ...form,
      title: response.data.data.title,
      desc: response.data.data.desc,
      price: response.data.data.price,
      category: response.data.data.category,
      embedId: response.data.data.embedId,
    })
  }

  useEffect(() => {
    getFilm()
  }, [])

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
              'Content-type': 'multipart/form-data',
          },
      }

      const formData = new FormData()
      formData.set("title", form.title)
      formData.set("desc", form.desc)
      formData.set("price", form.price)
      formData.set("category", form.category)
      formData.set("embedId", form.embedId)
      if(form.img){
        formData.set("img", form?.img[0], form?.img[0]?.name)
      }

      // Alert
      const alert = (
          <Alert variant="success" className="p-1">
              Edit film success
          </Alert>
      )
      setErrorMessage(alert)
      
      // Patch data
      const response = await API.patch("/film/" + film.id, formData, config)
      console.log(response)
      console.log(response.data.status)

      navigate("/dashboard")
    } catch (error) {
        console.log(error)
        const alert = (
            <Alert variant="danger" className="p-1">
                Edit film failed
            </Alert>
        )
        setErrorMessage(alert)
    }
  })

  return (
    <div>
      <NavAdmin />
      <Container>
            <h2 className="fw-bold text-center">Edit Film</h2>
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
                            value={form?.title}
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
                            value={form?.desc}
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
                            value={form?.price}
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
                            value={form?.category}
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
                            value={form?.embedId}
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
                                    alt="preview"
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
                            Edit Data Film
                        </button>
                    </div>
                </Form>
            </div>
        </Container>
    </div>
  )
}

export default EditFilm