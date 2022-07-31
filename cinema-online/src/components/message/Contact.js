import React from 'react'

import AvatarBlank from '../../assets/Profile/AvatarBlank.jpg'

function Contact({ dataContact, clickContact, contact }) {
  return (
    <>
    {dataContact.length > 0 && (
      <>
        {dataContact.map((item) => (
          <div key={item.id} className={`contact mt-3 px-2 ${contact?.id === item?.id && "contact-active"}`} onClick={() => {clickContact(item)}}>
            <img src={item?.img || AvatarBlank}  alt="user avatar" className='ms-3 img' />
            <div className="pt-2">
              <ul>
                <li className='fs-5 fw-bold'>{item.name}</li>
                <li className='mt-1'>{item.message}</li>
              </ul>
            </div>
          </div>
        ))}
      </>
    )}
    </>
  )
}

export default Contact