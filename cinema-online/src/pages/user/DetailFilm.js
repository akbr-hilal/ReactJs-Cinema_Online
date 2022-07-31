import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import {useQuery} from "@tanstack/react-query"
import rupiahFormat from 'rupiah-format';
import { Container } from 'react-bootstrap'

import NavUser from '../../components/navbar/NavUser'
import { API } from '../../config/api';

function DetailFilm() {
  const title = "Detail"
  document.title = "Cinema Online | " + title
  
  let { id } = useParams()

  let {data: film} = useQuery(['filmsCache'], async () => {
    console.log(film)
    const response = await API.get('/film/' + id)
    console.log(response.data.data)
    return response.data.data
  })

  const [user, setUser] = useState(null)  
    const play = user ? user.token : null

  useEffect(() => {
      setUser()
  }, [])
  return (
    <div>
      <NavUser />
      <Container className='mt-3' >
      <div className='row'>
          <div className='col'>
              <img src={film?.img} alt={film?.title} className="img-detail" />
          </div>    
          <div className='col'>
              <h2>{film?.title}</h2>
              <div style={{ height: 400, width: 780}}>
                  {play ? <div className="d-flex align-items-center justify-content-center" style={{ height: 400}}>
                  <iframe width="780" height="400" src={`https://www.youtube.com/embed/${film?.embedId}`} frameBorder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Embedded youtube"></iframe></div> : <div className="d-flex align-items-center justify-content-center" style={{ height: 400}}> <button className="btn btn-danger">Login & buy for watching</button></div> }
              </div>
              <div>
                  <p className='m-0'>{film?.category}</p>
                  <p>{rupiahFormat.convert(film?.price)}</p>
                  <p>
                      {film?.desc}
                  </p>
              </div>
          </div>
      </div>
      </Container>
    </div>
  )
}

export default DetailFilm