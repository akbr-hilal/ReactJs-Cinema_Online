import React from 'react'

import AvatarBlank from '../../assets/Profile/AvatarBlank.jpg'

function Chat({ contact, user, messages, sendMessage }) {
  return (
    <>
      {contact ? (
        <>
          <div id="chat-messages" style={{ height: "80vh" }} className="overflow-auto px-3 py-2">
            {messages.map((item, index) => (
              <div key={index}>
                <div className={`d-flex py-1 ${item.idSender === user.id ? "justify-content-end" : "justify-content-start"}`}>
                  {item.idSender !== user.id && (
                    <img src={contact.img || AvatarBlank} className="rounded-circle me-2 img" alt="Avatar" />
                  )}
                  <div className={ item.idSender === user.id ? "chat-me" : "chat-other"}>
                    {item.message}
                  </div>
                </div>
              </div>
            ))} 
        </div>
        <div style={{ height: '10vh' }}className="px-3">
          <input placeholder="Send Message" className="input-message px-4" onKeyPress={sendMessage} />
        </div>
        </>
      ) : (
        <div
          style={{ height: "89.5vh" }}
          className="fs-4 d-flex justify-content-center align-items-center"
        >
          No Message
        </div>
      )}
    </>
  )
}

export default Chat