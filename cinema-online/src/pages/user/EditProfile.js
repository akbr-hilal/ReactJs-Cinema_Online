import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { Alert, Container, Form } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import NavUser from '../../components/navbar/NavUser'
import { API } from '../../config/api'

function EditProfile() {
  const title = "Edit Profile"
  document.title = "Cinema Online | " + title

  let navigate = useNavigate()
  const { id } = useParams()

  const [errorMessage, setErrorMessage] = useState("")
  const [profile, setProfile] = useState({})
  const [preview, setPreview] = useState(null)

  const [form, setForm] = useState({
    phone: "",
    gender: "",
    address: "",
    img: ""
  })

  let getProfile = async () => {
    const response = await API.get("/profile")
    console.log(response)
    setProfile(response.data.data)
    setPreview(response.data.data.img)
    setForm({
      ...form,
      phone: response.data.data.phone,
      gender: response.data.data.gender,
      address: response.data.data.address,
    })
  }


  useEffect(() => {
      getProfile()
  }, [])

  const handleChange = (e) => {
    setForm({
        ...form,
        [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value,
    })
    if(e.target.type === "file"){
        let url = URL.createObjectURL(e.target.files[0])
        setPreview(url)
    }
  }

  const handleSubmit = useMutation(async (e) => {
      try {
        e.preventDefault()

        // set config
        const config = {
            headers: {
              Authorization: "Basic " + localStorage.token,
              "Content-type": "multipart/form-data",
            }
        }

        const formData = new FormData()
        formData.set("phone", form.phone);
        formData.set("gender", form.gender);
        formData.set("address", form.address);
        if(form.img){
            formData.set("img", form?.img[0], form?.img[0]?.name)
        }
        console.log(form)
        console.log(formData)


        const alert = (
          <Alert variant="success" style={{width: "400px"}}>
            Edit Profile Success
          </Alert>
        );
        setErrorMessage(alert);
        const response = await API.patch("/profile/" + profile.id, formData, config)
        console.log(response)
        console.log(response.data.data)
        navigate("/profile-user")
      } catch (error) {
          console.log(error)
          const alert = (
              <Alert variant="danger" style={{width: "400px"}}>
                  Edit Profile Error
              </Alert>
          );
          setErrorMessage(alert);
      }
  })

  return (
    <div>
      <NavUser />
      <Container>
        <h2 className="fw-bold text-center text-orange mb-2">
          Edit Your Profile
        </h2>
        <div className="d-flex justify-content-center">
          {errorMessage && errorMessage}
        </div>
        <div className="d-flex justify-content-center">
          <Form style={{ width: "600px" }} onSubmit={(e) => handleSubmit.mutate(e)}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="phone">Phone Number</Form.Label>
              <Form.Control type="number" placeholder="Enter Phone Number" id="phone" name="phone" onChange={handleChange} value={form?.phone} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="gender">Gender</Form.Label>
              <Form.Control type="text" placeholder="Enter Your Gender" id="gender" name="gender" onChange={handleChange} value={form?.gender} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="address">Product Price</Form.Label>
              <Form.Control as="textarea" placeholder="Enter Your Address" rows={3} id="address" name="address" onChange={handleChange} value={form?.address} />
            </Form.Group>
            <Form.Group className="mb-5">
              {preview && (
                  <div>
                      <img src={preview} style={{ maxWidth: "150px", objectFit: "cover", }} alt="preview" />
                  </div>
              )}
              <Form.Label htmlFor="upload">Upload Your Image</Form.Label>
              <Form.Control type="file" id="upload" name="img" onChange={handleChange} />
            </Form.Group>
            <div className="text-end">
              <button type="submit" className="btn btn-success col-5 mb-3">Save</button>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  )
}

export default EditProfile