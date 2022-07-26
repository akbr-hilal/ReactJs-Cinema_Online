import React from 'react'
import NavGuest from '../../components/navbar/NavGuest'
import { Carousel } from 'react-bootstrap'
import rupiahFormat from 'rupiah-format'
import { Link } from 'react-router-dom'

// FakeData
import {dataCarousel} from '../../dataDummy/dataCarousel'
import {dataFilms} from '../../dataDummy/dataFilms'

function LandingPage() {
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
                <h1>List Film</h1>
                <div className="row d-flex justify-content-center justify-content-lg-start">
                    {dataFilms.map((item) => (
                        <div className="card text-bg-dark col-md-2 col-lg-6 me-2 mt-2" key={item.id}>
                            <img src={item.img} alt={item.title} className="card-img" />
                            <div className="card-img-overlay d-flex align-items-end">
                                <div>
                                    <h4 className="card-title shadow-lg fw-bold">{item.title}</h4>
                                    <Link to={`detail-film/` + item.id}>
                                    <button className='btn btn-danger'>View Film</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
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