import React, {useState, useEffect, useContext} from 'react'
import { Carousel } from 'react-bootstrap'
import rupiahFormat from 'rupiah-format'
// import { Link } from 'react-router-dom'
import { API } from '../../config/api'

import NavUser from '../../components/navbar/NavUser'
import CardFilmUser from '../../components/card/CardFilmUser'

// FakeData
import {dataCarousel} from '../../dataDummy/dataCarousel'
import { UserContext } from '../../context/userContext'
import { useQuery } from '@tanstack/react-query'
// import {dataFilms} from '../../dataDummy/dataFilms'


function LandingFilm() {
    const title = "Landing Page"
    document.title = "Cinema Online | " + title
    const [state, dispatch] = useContext(UserContext)
    console.log(state)

    // const [film, setFilm] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    // let getFilm = async () => { 
    //     setIsLoading(true)
    //     const response = await API.get('/film', config)
    //     console.log(response.data.data)
    //     // setFilm(response.data.data)
    //     setIsLoading(false)
    // }

    // useEffect(() => {
    //     getFilm()
    // }, [])

    let { data: film } = useQuery(['filmCache'], async() => {
        const response = await API.get('/film')
        console.log(response.data.data)
        return response.data.data
    })

    console.log(film)
    
    return (
    <div>
        <NavUser />
        <div className="d-flex justify-content-center mt-5">
            <Carousel>
                {dataCarousel.map((item) => (
                        <Carousel.Item interval={2000} key={item.id}>
                            <div className="d-flex justify-content-center">
                                <img
                                src={item.img}
                                alt={item.title}
                                className='rounded img-carousel'
                                />
                            </div>
                            <Carousel.Caption className="text-start">
                                <h1 className='fw-bold txt-title-carousel'>{item.title}</h1>
                                <p className='fw-bold txt-carousel'>{item.category}</p>
                                <p className='text-danger fw-bold txt-carousel'>{rupiahFormat.convert(item.price)}</p>
                                <p className="txt-carousel">{item.desc}</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                ))}
            </Carousel>
        </div>
            <div className="container my-5">
                <h1>List Film</h1>
                <div>
                    {film?.length !== 0 ? (
                        <div>
                            {isLoading ? (
                            <div className='text-center fw-bold'>
                                Loading, please wait...
                            </div>
                            ) : (
                                <div className="row d-flex justify-content-center justify-content-lg-start">
                                    {film?.map((item, index) => (
                                        <CardFilmUser item={item} key={index}/>
                                    ))}
                                </div>
                            )}
                        </div>
                    ):(
                        <div className="text-center">
                            No data Film
                        </div>
                    )}
                    
                </div>
            </div>
            <div className="container-fluid text-bg-dark">
                <footer className='container'>
                    <p className='m-0 text-center'>Copyright 2022 &#169; by Akbr</p>
                </footer>
            </div>
    </div>
  )
}

export default LandingFilm