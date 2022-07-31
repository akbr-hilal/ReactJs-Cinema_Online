import React, { useEffect, useState } from 'react'
import rupiahFormat from 'rupiah-format'
import {Container, Table} from 'react-bootstrap'

// Component
import { API } from '../../config/api'
import NavAdmin from '../../components/navbar/NavAdmin'
import imgEmpty from '../../assets/emptyImg.png'

// Data dummy
import {dataFilms} from '../../dataDummy/dataFilms'
import { useQuery } from '@tanstack/react-query'

function ListTransactionAdmin() {
  const title = "List Transaction"
  document.title = "Cinema Online | " + title

  const [isLoading, setIsLoading] = useState(false)

  const {data: transactions} = useQuery(['transactionCache'], async () => {
    try {
      setIsLoading(true)
      const response = await API.get('/transaction/admin')
      console.log(response)
      console.log(response.data)
      setIsLoading(false)
      return response.data.data
    } catch (error) {
      console.log(error)
    }
  })

  return (
    <div>
      <NavAdmin />
      <Container>
        <h2 className="text-center my-3 fw-bold">List Transaction</h2>
        {transactions?.length !== 0 ? (
          <div>
            {isLoading ? (
              <div className="text-center fw-bold">
                Loading, please wait ...
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
                    <th width='140px' className='text-center'>Buyer</th>
                    <th width='100px' className='text-center'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions?.map((item, index) => (
                    <tr key={index}>
                      <td className="align-middle">{index + 1}</td>
                      <td className="align-middle"><img src={item.film.img} alt={item.film.title} style={{width:'80px', objectFit: 'cover'}} /></td>
                      <td className="align-middle">{item.film.title}</td>
                      <td className="align-middle">{rupiahFormat.convert(item.film.price)}</td>
                      <td>{item.film.desc}</td>
                      <td className="align-middle">{item.buyer.name}</td>
                      <td className={`status-transaction-${item.status} align-middle text-center`}>{item.status}</td>                  
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
            <div className="mt-3">No data transactions</div>
          </div>
        )}
      </Container>
    </div>
  )
}

export default ListTransactionAdmin