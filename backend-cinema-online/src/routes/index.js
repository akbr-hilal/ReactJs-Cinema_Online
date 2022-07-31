const express = require('express')


const router = express.Router()

// import controllers (users)
const {addUser, getUsers, getUser, updateUser, deleteUser} = require('../controllers/user')

// import controllers (film)
const { getFilms, getFilm, addFilm, updateFilm, deleteFilm, getFilmsNon, getFilmNon } = require('../controllers/film')

// import controllers (transaction)
const { getTransactionsByBuyer, addTransactions, getTransactionsBySeller, notification } = require('../controllers/transaction')

// import controllers (auth)
const {register, login, checkAuth} = require('../controllers/auth')

// import middlewares
const {auth} = require('../middlewares/auth')
const {uploadFile} = require('../middlewares/uploadFile')
const { getProfile, updateProfile } = require('../controllers/profile')

// ROUTER
    // Router user
router.post('/user', addUser)
router.get('/user', getUsers)
router.get('/user/:id', getUser)
router.patch('/user/:id', updateUser)
router.delete('/user/:id', deleteUser)

    // Routes profile
router.get('/profile', auth, getProfile)
router.patch('/profile/:id', auth, uploadFile('img'), updateProfile)

    // Router Films
router.get('/film/non', getFilmsNon)
router.get('/film/non/:id', getFilmNon)
router.get('/film', auth, getFilms)
router.get('/film/:id', auth, getFilm)
router.post('/film', auth, uploadFile('img'), addFilm)
router.patch('/film/:id', auth, uploadFile('img'), updateFilm)
router.delete('/film/:id', auth, deleteFilm)

    // Router Transactions
router.get('/transaction', auth, getTransactionsByBuyer)
router.get('/transaction/admin', auth, getTransactionsBySeller)
router.post('/transaction', auth, addTransactions)
router.post('/notification', notification)

    // Router Auth
router.post('/register', register)
router.post('/login', login)
router.get('/check-auth', auth ,checkAuth)

module.exports = router