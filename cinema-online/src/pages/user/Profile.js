import React from 'react'
import NavUser from '../../components/navbar/NavUser'

function Profile() {
  return (
    <>
        <NavUser />
        <div className='container'>
            <div className='row'>
                <div className='col-12 col-lg-6'>
                    <h2>My Profile</h2>
                </div>
                <div className='col-12 col-lg-6'>
                    <h2>My Transactions</h2>
                </div>
            </div>
        </div>  
    </>
  )
}

export default Profile