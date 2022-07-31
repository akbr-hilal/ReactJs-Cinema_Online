import React from 'react'
import rupiahFormat from 'rupiah-format'
import NavAdmin from '../../components/navbar/NavAdmin'
import {Container, Table} from 'react-bootstrap'
import {dataFilms} from '../../dataDummy/dataFilms'


function ListTransactionAdmin() {
  return (
    <div>
      <NavAdmin />
      <Container>
        <h2 className="text-center my-3 fw-bold">List Film</h2>
        {dataFilms.length !== 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th width='10px' className='text-center'>No</th>
                <th width='60px' className='text-center'>Thumbnail</th>
                <th width='200px' className='text-center'>Title</th>
                <th width='120px' className='text-center'>Price</th>
                <th width='300px' className='text-center'>Description</th>
                <th width='60px' className='text-center'>Embed Id</th>
                <th width='232px' className='text-center'>Action</th>
              </tr>
            </thead>
            <tbody>
              {dataFilms.map((item, index) => (
                <tr key={index}>
                  <td className="align-middle">{item.id}</td>
                  <td className="align-middle"><img src={item.img} alt={item.title} style={{width:'80px', objectFit: 'cover'}} /></td>
                  <td className="align-middle">{item.title}</td>
                  <td className="align-middle">{rupiahFormat.convert(item.price)}</td>
                  <td>{item.desc}</td>
                  <td className="align-middle">{item.embedId}</td>
                  <td className="align-middle text-center">
                    <button className="btn btn-success me-2" style={{ width: "100px" }}>Edit</button>
                    <button className="btn btn-danger" style={{ width: "100px" }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
         </Table>
        ) : (
          <div>
            No data films
          </div>
        )}
      </Container>
    </div>
  )
}

export default ListTransactionAdmin