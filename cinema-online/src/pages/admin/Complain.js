import React, { useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client';


import Contact from '../../components/message/Contact';
import Chat from '../../components/message/Chat';
import NavAdmin from '../../components/navbar/NavAdmin';
import { UserContext } from '../../context/userContext';
import { Col, Container, Row } from 'react-bootstrap';

let socket
function Complain() {
  const title = "Complain"
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
      console.log(err.message)
    })

    return () => {
      socket.disconnect()
    }
  }, [messages])

  const loadContact = () => {
    socket.emit("load customer contacts")

    socket.on("customer contacts", async(data) => {
      let dataContacts = data.filter((item) => (item.status !== "admin") && (item.recipientMessage.length > 0 || item.senderMessage.length > 0))

      dataContacts = dataContacts.map((item) => ({
        ...item,
        message: item.senderMessage.length > 0 ? item.senderMessage[item.senderMessage.length - 1].message : "Click here to start message"
      }))

      console.log(dataContacts)

      setContacts(dataContacts)
    })
  }

  const loadMessages = (value) => {
    socket.on("messages", (data) => {
      if(data.length > 0) {
        const dataMessages = data.map((item) => ({
          idSender: item.sender.id,
          message: item.message,
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

  const onSendMessage = (e) => {
    if(e.key === "Enter"){
      const data = {
        idRecipient: contact.id,
        message: e.target.value,
      }

      socket.emit("send message", data)
      e.target.value = ""
    }
  }


  return (
    <div>
      <NavAdmin />
      <Container fluid style={{height: '89.5vh'}}>
        <Row>
          <Col md={3} style={{height: '89.5vh'}} className="px-3 border-end border-dark overflow-auto">
            <Contact dataContact={contacts} clickContact={onClickContact} contact={contact}/>
          </Col>
          <Col md={9} style={{maxHeight: '89.5vh'}} className="px-0">
            <Chat contact={contact} messages={messages} user={state.user} sendMessage={onSendMessage}/>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Complain