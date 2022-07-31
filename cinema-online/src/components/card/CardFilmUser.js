import React from 'react'
import { Link } from 'react-router-dom'

export default function CardFilm({ item }) {
  return (
    <div className="card text-bg-dark col-md-2 col-lg-6 me-2 mt-2">
        <Link to={`/film/` + item.id} style={{ textDecoration: "none"}}>
          <img src={item.img} alt={item.title} className="card-img" />
          <div className="card-img-overlay d-flex align-items-end">
              <div>
                <h4 className="card-title shadow-lg fw-bold text-light">{item.title}</h4>
                <button className='btn btn-danger'>View Film</button>
              </div>
          </div>
      </Link>
      </div>
  )
}

