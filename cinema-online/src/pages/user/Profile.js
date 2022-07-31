import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import rupiahFormat from 'rupiah-format'

import NavUser from '../../components/navbar/NavUser'
import { API } from '../../config/api'
import { UserContext } from '../../context/userContext'
import imgEmpty from '../../assets/emptyImg.png'
import avatarBlack from '../../assets/Profile/AvatarBlank.jpg'


function Profile() {
    const title = "Profile"
    document.title = "Cinema Online | " + title

    let navigate = useNavigate()

    const [state, dispatch] = useContext(UserContext)
    console.log(state)

    const [profile, setProfile] = useState()
    const [transaction, setTransaction] = useState()

    // Fetch Profile
    let getProfile = async() => {
        const response = await API.get("/profile")
        // console.log(response.data.data)
        setProfile(response.data.data)
    }

    useEffect(() => {
        getProfile()
    }, [])

    // Fetch Transaction
    let getTransactions = async() => {
        const response = await API.get("/transaction")
        // console.log(response.data.data)
        setTransaction(response.data.data)
    }

    useEffect(() => {
        getTransactions()
    }, [])

    console.log(profile)
    console.log(transaction)

    const logout = () => {
        dispatch({
            type: "LOGOUT"
        })
        navigate("/")
    }
  return (
    <>
        <NavUser />
        <div className='container mt-3'>
            <div className='row'>
                <div className='col-12 col-lg-6'>
                    <h2 className='text-center fw-bold mb-2'>My Profile</h2>
                    <div className='row'>
                        <div className='col'>
                            <img src={profile?.img ? profile.img : avatarBlack } alt="Profile" className="card-img-top rounded"/>
                        </div>
                        <div className='col'>
                            <h5 className="fw-bold text-orange">Name</h5>
                            <p>{state.user.name}</p>

                            <h5 className="fw-bold text-orange">Email</h5>
                            <p>{state.user.email}</p>

                            <h5 className="fw-bold text-orange">Phone</h5>
                            <p>{profile?.phone ? profile.phone : "-"}</p>

                            <h5 className="fw-bold text-orange">Gender</h5>
                            <p>{profile?.gender ? profile.gender : '-'}</p>

                            <h5 className="fw-bold text-orange">Address</h5>
                            <p>{profile?.address ? profile.address : '-'}</p>
                        </div>
                        <div className='mt-3'>
                            <button className='btn btn-danger col-12 col-lg-5' onClick={logout}>Logout</button>
                        </div>
                    </div>
                </div>
                <div className='col-12 col-lg-6'>
                    <h2 className='text-center fw-bold mb-2'>My Transactions</h2>
                    {transaction?.length !== 0 ? (
                        <>
                        {transaction?.map((item, index) => (
                            <div className='d-flex p-3 shadow rounded mb-4' key={index}>
                                <div className='col-3'>
                                    <img src={item.film.img} alt="Img Film" className='card-img-top' style={{ width: "8rem" }}/>
                                </div>
                                <div className='ms-2 col-7'>
                                    <div>
                                        <small>Order Id: {item.id}</small>
                                    </div>
                                    <h3>{item.film.title}</h3>
                                    <div>Price: {rupiahFormat.convert(item.price)}</div>
                                </div>
                                <div className='col-2'>
                                    <div className='text-center'>Status: </div>
                                    <div className={`status-transaction-${item.status} d-flex h-75 rounded mt-3 align-items-center justify-content-center`}>{item.status}</div>
                                </div>
                            </div>
                        ))}
                        </>
                    ) : (
                        <div>
                            <img
                                src={imgEmpty}
                                className="img-fluid"
                                style={{ width: "180px" }}
                                alt="empty data"
                            />
                            No data transactions
                        </div>
                    )}
                </div>
            </div>
        </div>  
    </>
  )
}

export default Profile