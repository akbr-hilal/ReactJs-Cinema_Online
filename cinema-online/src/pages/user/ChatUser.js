import React, { useContext, useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import {io} from 'socket.io-client'

import NavUser from '../../components/navbar/NavUser'
import Contact from '../../components/message/Contact'
import Chat from '../../components/message/Chat'
import { UserContext } from '../../context/userContext'

let socket

export default function ChatUser () {
  const title = "Chat"
  document.title = "Cinema Online | " + title

  const [contact, setContact] = useState(null)
  const [contacts, setContacts] = useState([])

  const [messages, setMessages] = useState([])

  const [state] = useContext(UserContext)

  useEffect(() => {
    socket = io('http://localhost:8000', {
      auth: {
        token: localStorage.getItem("token")
      },
      query: {
        id: state.user.id
      }
    })

    socket.on("new message", () => {
      console.log("contact", contact)
      console.log("triggered", contact?.id)
      socket.emit("load messages", contact?.id)
    })

    loadContact()
    loadMessages()

    socket.on("connected_error", (err) => {
      console.error(err.message)
    })

    return () => {
      socket.disconnect()
    }
  }, [messages])

  const loadContact = () => {
    socket.emit("load admin contact")

    socket.on("admin contact", async (data) => {
      const dataContact = {
        ...data,
        message: messages.length > 0 ? messages[messages.length - 1].message : "Click here to start message"
      }
      console.log(dataContact)
      setContacts([dataContact])
    })
  }

  console.log(contacts)

  const loadMessages = (value) => {
    socket.on("messages", async(data) => {
      if(data.length > 0) {
        const dataMessages = data.map((item) => ({
          idSender: item.sender.id,
          message: item.message
        }))
        console.log(dataMessages)
        setMessages(dataMessages)
      }
      loadContact()
      const chatMessage = document.getElementById("chat-messages")
      chatMessage.scrollTop = chatMessage?.scrollHeight
    }) 
  }

  const onClickContact = (data) => {
    setContact(data)
    socket.emit("load messages", data.id)
  }

  const onSendMessages = (e) => {
    if(e.key === "Enter"){
      const data = {
        idRecipient: contact.id,
        message: e.target.value,
      }

      socket.emit("send message", data)
      e.target.value = ""
    }
  }
  console.log(messages)
  return (
    <div>
      <NavUser />
      <Container fluid style={{height: '89.5vh'}}>
        <Row>
          <Col md={3} style={{height: '89.5vh'}} className="px-3 border-end border-dark overflow-auto">
            <Contact dataContact={contacts} clickContact={onClickContact} contact={contact} />
          </Col>
          <Col md={9} style={{maxHeight: '89.5vh'}} className="px-0">
            <Chat contact={contact} messages={messages} user={state.user} sendMessage={onSendMessages} />
          </Col>
        </Row>
      </Container>
    </div>
  )
}
