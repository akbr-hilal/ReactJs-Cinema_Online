import React from 'react'
import NavUser from '../../components/navbar/NavUser'
import { Link } from 'react-router-dom'

import {listFilm} from '../../dataDummy/listFilm'


function ListFilm() {
    const title = "List Film"
    document.title="Cinema Online | " + title
    
    return (
        <div>
            <NavUser />
            <div className="container my-5">
                <h1 className="text-center">List Film</h1>
                <div className="row d-flex justify-content-center justify-content-lg-start">
                    {listFilm.map((item) => (
                        <div className="card text-bg-dark col-md-2 col-lg-6 me-2 mt-2" key={item.id}>
                            <img src={item.img} alt={item.title} className="card-img" />
                            <div className="card-img-overlay d-flex align-items-end">
                                <div>
                                    <h4 className="card-title shadow-lg fw-bold">{item.title}</h4>
                                    <Link to={`detail-film/` + item.id}>
                                        <button className='btn btn-danger'>Watch Now</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ListFilm