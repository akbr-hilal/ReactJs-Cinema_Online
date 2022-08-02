import React, { useState, useEffect } from 'react'
import NavGuest from '../../components/navbar/NavGuest'
import { Carousel } from 'react-bootstrap'
import rupiahFormat from 'rupiah-format'
import { API } from '../../config/api'


// FakeData
import {dataCarousel} from '../../dataDummy/dataCarousel'
// import {dataFilms} from '../../dataDummy/dataFilms'

import CardFilm from '../../components/card/CardFilm'

function LandingPage() {
    const title = "Landing Page"
    document.title = "Cinema Online | " + title

    const [searchBar, setSearchBar] = useState("")
    const [film, setFilm] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    let getFilm = async () => { 
        setIsLoading(true)
        const response = await API.get('/film/non')
        console.log(response.data.data)
        setFilm(response.data.data)
        setIsLoading(false)
    }

    useEffect(() => {
        getFilm()
    }, [])
    
    return (
        <div>
            <NavGuest />
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
                <div className='row'>
                    <div className='col-8'>
                        <h1>List Film</h1>
                    </div>
                    <div className='col-4'>
                        <input type="text" placeholder="Search Film ..." className="form-control rounded" onChange={(e) => {setSearchBar(e.target.value)}}/>
                    </div>
                </div>
                <div className='ps-2'>
                    {film.length !== 0 ? (
                        <div>
                            {isLoading ? (
                            <div className='text-center fw-bold'>
                                Loading, please wait...
                            </div>
                            ) : (
                                <div  className="row d-flex justify-content-center justify-content-lg-start">
                                    {film?.filter((item) => {
                                        if(searchBar === ""){
                                            return item
                                        } else if(item.title.toLowerCase().includes(searchBar.toLowerCase())){
                                            return item
                                        }
                                    }).map((item, index) => (
                                        <CardFilm item={item} key={index}/>
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

export default LandingPage