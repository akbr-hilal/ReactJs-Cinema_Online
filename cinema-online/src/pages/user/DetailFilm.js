import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import {useMutation } from "@tanstack/react-query"
import rupiahFormat from 'rupiah-format';
import { Container } from 'react-bootstrap'


import NavUser from '../../components/navbar/NavUser'
import { API } from '../../config/api';
import { UserContext } from '../../context/userContext';

function DetailFilm() {
  const title = "Detail"
  document.title = "Cinema Online | " + title

  let navigate = useNavigate()

  let { id } = useParams()

  const [state, dispatch] = useContext(UserContext)

  console.log(state)
  
  const [isLoading, setIsLoading] = useState(false)
  const [statusTransaction, setStatusTransaction] = useState()
  const [film, setFilm] = useState()

  const getFilm = async() => {
    try {
      setIsLoading(true)
      const response = await API.get('/film/' + id)
      setFilm(response.data.data)
      setStatusTransaction(response.data.statusTransaction)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
    }
  }
  console.log(film)
  console.log(statusTransaction)
  // console.log(film.transactions)


  useEffect(() => {
    getFilm()
  }, [])

  // let { data: film } = useQuery(['filmsCache'], async() => {
  //   setIsLoading(true)
  //   const response = await API.get('/film/' + id)
  //   setIsLoading(false)
  //   return response.data.data
  // })

  useEffect(() => {
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const myMidtransClientKey = "SB-Mid-client-R1bcjtDE-GWjLVLw";

    let scriptTag = document.createElement("script")
    scriptTag.src = midtransScriptUrl;

    scriptTag.setAttribute("data-client-key", myMidtransClientKey)

    document.body.appendChild(scriptTag)
    return () => {
      document.body.removeChild(scriptTag)
    }
  }, [])

  const handleBuy = useMutation(async () => {
    try {
      const config = {
        headers: {
            Authorization: "Basic " + localStorage.token,
            'Content-type': 'application/json'
        },
      }

      const data = {
        idFilm: film.id,
        idSeller: film.idUser,
        price: film.price
      }

      const body = JSON.stringify(data)

      const response = await API.post('/transaction', body, config)
      console.log(response)
      console.log(response.data.payment.token)

      const token = response.data.payment.token

      window.snap.pay(token, {
        onSuccess: function (result) {
          console.log(result)
          navigate('/profile-user')
        },
        onPending: function (result) {
          console.log(result)
          navigate('/profile-user')
        },
        onError: function (result) {
          console.log(result)
        },
        onClose: function () {
          alert('You closed the popup without finishing the payment')
        }
      })
    } catch (error) {
      console.log(error)
    }
  })

  return (
    <div>
      <NavUser />
      <Container className='mt-3' >
        {isLoading ? (
          <div className='text-center'>
            Loading, please wait...
          </div>
        ) : (
          <div className='row'>
            <div className='col'>
                <img src={film?.img} alt={film?.title} className="img-detail" />
            </div>    
            <div className='col'>
                <h2>{film?.title}</h2>
                <div style={{ height: 400, width: 780 }}>
                  {!statusTransaction || statusTransaction === "failed" ? (
                    <div className="d-flex align-items-center justify-content-center" style={{ height: 400 }}> 
                      <button className="btn btn-danger" onClick={() => handleBuy.mutate()}>Buy for watching film</button>
                    </div>
                  ) : ""}
                  {statusTransaction === "success" ? ( 
                  <iframe width="780" height="400" src={`https://www.youtube.com/embed/${film?.embedId}`} frameBorder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Embedded youtube"></iframe>
                  ) : (
                    statusTransaction === "pending" ? (
                      <div className="d-flex align-items-center justify-content-center" style={{ height: 400 }}> 
                        <button className="btn btn-warning">Finish payment to watch film</button>
                      </div>
                    ) : ("")
                  )}
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
        )}
      </Container>
    </div>
  )
}

export default DetailFilm