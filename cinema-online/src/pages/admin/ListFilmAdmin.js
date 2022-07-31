import React, { useEffect, useState } from 'react'
import rupiahFormat from 'rupiah-format'
import {Alert, Container, Table} from 'react-bootstrap'
import {useMutation} from "@tanstack/react-query"
import { API } from '../../config/api'
import { useNavigate } from 'react-router-dom'

// dummy
// import {dataFilms} from '../../dataDummy/dataFilms'

// component & asset
import NavAdmin from '../../components/navbar/NavAdmin'
import imgEmpty from '../../assets/emptyImg.png'
import DeleteData from '../../components/modal/DeleteData'


function ListFilmAdmin() {
  const title = "List Film"
  document.title = "Cinema Online | " + title

  let navigate = useNavigate()

  const [idDelete, setIdDelete] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [errorMessage, setErrorMessage]  = useState("")
  const [show, setShow] = useState(false)
  const handleShow = () => setShow(true)
  const handleClose = () => setShow(false)

  const [film, setFilm] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  let getFilm = async () => { 
      setIsLoading(true)
      const response = await API.get('/film')
      console.log(response.data.data)
      setFilm(response.data.data)
      setIsLoading(false)
  }

  useEffect(() => {
    getFilm()
}, [])
  
  const handleEdit = (id) => {
    navigate("/edit-film/" + id)
  }

  const handleDelete = (id) => {
    setIdDelete(id)
    handleShow()
  }

  const deleteById = useMutation(async (id) => {
    try {
      const response = await API.delete(`/film/${id}`)
      console.log(response)
      // refetch()
      const alert = (
        <Alert variant='success' className='p-1'>
          {response.data.status}. Please wait a few minutes or refresh page
        </Alert>
      )
      setErrorMessage(alert)
      navigate("/dashboard")

    } catch (error) {
      console.log(error)
    }
  })

  useEffect(() => {
    if(confirmDelete){
      deleteById.mutate(idDelete)
      setConfirmDelete(null)
      handleClose()
    }
  }, [confirmDelete])

  return (
    <div>
      <NavAdmin />
      <Container>
        <h2 className="text-center my-3 fw-bold">List Film</h2>
        {errorMessage}
        {film.length !== 0 ? (
          <div>
            {isLoading ? (
              <div className='text-center fw-bold'>
                Loading, please wait...
              </div>
            ) : (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th width='10px' className='text-center'>No</th>
                    <th width='60px' className='text-center'>Thumbnail</th>
                    <th width='200px' className='text-center'>Title</th>
                    <th width='120px' className='text-center'>Price</th>
                    <th width='300px' className='text-center'>Description</th>
                    <th width='100px' className='text-center'>Embed Id</th>
                    <th width='232px' className='text-center'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {film && film.map((item, index) => (
                    <tr key={index}>
                      <td className="align-middle">{index + 1}</td>
                      <td className="align-middle"><img src={item.img} alt={item.title} style={{width:'60px', objectFit: 'cover'}} /></td>
                      <td className="align-middle">{item.title}</td>
                      <td className="align-middle">{rupiahFormat.convert(item.price)}</td>
                      <td>{item.desc}</td>
                      <td className="align-middle">{item.embedId}</td>
                      <td className="align-middle text-center">
                        <button className="btn btn-success me-2" style={{ width: "100px" }} onClick={() => {handleEdit(item.id)}}>Edit</button>
                        <button className="btn btn-danger" style={{ width: "100px" }} onClick={() => {handleDelete(item.id)}}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        ) : (
          <div className="text-center pt-5">
              <img
                  src={imgEmpty}
                  className="img-fluid"
                  style={{ width: "250px" }}
                  alt="empty"
              />
              <div className="mt-3">No data film</div>
          </div>
        )}
      </Container>
      <DeleteData
          setConfirmDelete={setConfirmDelete}
          show={show}
          handleClose={handleClose}
      />
    </div>
  )
}

export default ListFilmAdmin