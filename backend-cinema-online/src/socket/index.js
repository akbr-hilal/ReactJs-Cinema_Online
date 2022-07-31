const { chat, user, profile } = require('../../models');

const jwt = require('jsonwebtoken')

const { Op } = require('sequelize')

const connectedUser = {}

const socketIo = (io) => {
  io.use((socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      next()
    } else {
      next(new Error('Not Authorized'))
    }
  })

  io.on('connection', async(socket) => {
    console.log('client connected: ', socket.id)

    const userId = socket.handshake.query.id;

    connectedUser[userId] = socket.id
    
    // define listener on event load admin contact
    socket.on('load admin contact', async () => {
      try {
        let adminContact = await user.findOne({
          where: {
            status: "admin",
          },
          include: [
            {
              model: profile,
              as: 'profile',
              attributes: {
                exclude: ['createdAt', 'updatedAt']
              }
            }
          ],
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'password']
          }
        })

        socket.emit('admin contact', adminContact)
      } catch (error) {
        console.log(error)
      }
    })

    socket.on('load customer contacts', async () => {
      try {
        let customerContact = await user.findAll({
          include: [
            {
              model: profile,
              as: "profile",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
            {
              model: chat,
              as: "recipientMessage",
              attributes: {
                exclude: ["createdAt", "updatedAt", "idRecipient", "idSender"],
              },
            },
            {
              model: chat,
              as: "senderMessage",
              attributes: {
                exclude: ["createdAt", "updatedAt", "idRecipient", "idSender"],
              },
            },
          ],
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        })

        customerContact = JSON.parse(JSON.stringify(customerContact))

        customerContact = customerContact.map((item) => ({
          ...item,
          profile: {
            ...item.profile,
            img: item.profile?.img ? process.env.PATH_FILE + item.profile?.img : null
          }
        }))

        socket.emit('customer contacts', customerContact)
      } catch (error) {
        console.log(error)
      }
    })

    socket.on('load messages', async(payload) => {
      try {
        
      } catch (error) {
        
      }
    })
  })
}