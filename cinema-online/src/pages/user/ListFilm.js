import React, { useContext, useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'

// Component
import NavUser from '../../components/navbar/NavUser'
import { API } from '../../config/api'
import { UserContext } from '../../context/userContext'
import CardFilmUser from '../../components/card/CardFilmUser'

// Data dummy
// import {listFilm} from '../../dataDummy/listFilm' 


function ListFilm() {
    const title = "List Film"
    document.title="Cinema Online | " + title

    const [
        state, 
        // dispatch
    ] = useContext(UserContext)

    console.log(state)

    const [isLoading, setIsLoading] = useState(false)
    
    const [film, setFilm] = useState([])

    let getFilm = async() => {
        try {
            setIsLoading(true)
            const response = await API.get('/film')
            setFilm(response.data.readyWatch)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
        }
    }
    console.log(film)
    console.log(Array.isArray(film))

    // let filterStatus = Array.isArray(film) ? film.filter(status => status.transactions === "success" || status.transactions === "pending") : []

    // console.log(filterStatus)

    useEffect(() => {
        getFilm()
    }, [])
    
    return (
        <div>
            <NavUser />
            <Container>
                <h1 className="text-center my-3 fw-bold">List Film</h1>
                <div className="row d-flex justify-content-center justify-content-lg-start">
                    {film?.length !== 0 ? (
                        <div>
                            {isLoading ? (
                                <div className='text-center fw-bold'>
                                    Loading, please wait...
                                </div>
                            ) : (
                                <div className="row d-flex justify-content-center justify-content-lg-start">
                                    {film?.map((item, index) => (
                                        <CardFilmUser item={item.film} key={index}/>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center">
                            Please buy film
                        </div>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default ListFilm