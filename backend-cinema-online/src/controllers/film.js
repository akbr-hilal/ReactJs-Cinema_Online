const { film, user, transaction } = require('../../models')

// Non Auth
exports.getFilmsNon = async (req, res) => {
    try {
        let data = await film.findAll({
            include: [
                {
                    model: user,
                    as: 'user',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password'],
                    },
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
        })

        data = JSON.parse(JSON.stringify(data))

        data = data.map((item) => {
            return {
                ...item,
                img: process.env.PATH_FILE + item.img
            }
        })

        res.status(200).send({
            status: 'success',
            data,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 'failed',
            message: 'server error'
        })
    }
}

exports.getFilmNon = async (req, res) => {
    try {
        const {id} = req.params;
        let data = await film.findOne({
            where: {id},
            include: [
                {
                    model: user,
                    as: 'user',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password'],
                    },
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
        })

        data = JSON.parse(JSON.stringify(data))

        data =  {
            ...data,
            img: process.env.PATH_FILE + data.img         
        }

        res.status(200).send({
            status: 'success',
            data,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 'failed',
            message: 'server error'
        })
    }
}

exports.getFilms = async (req, res) => {
    try {
        let data = await film.findAll({
            include: [
                {
                    model: user,
                    as: 'user',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password'],
                    },
                },
                // {
                //     model: transaction,
                //     as: 'transactions',
                //     attributes: {
                //         exclude: ['createdAt', 'updatedAt'],
                //     },
                // },
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
        })

        data = JSON.parse(JSON.stringify(data))

        data = data.map((item) => {
            return {
                ...item,
                img: process.env.PATH_FILE + item.img,
            }
        })

        const idBuyer = req.user.id;
        // const {id} = req.params;
        let readyWatch = await transaction.findAll({
            where: {
                status: "pending" === "success", 
                idBuyer: idBuyer
            },
            order: [['createdAt', 'DESC']],
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'idSeller', 'price']
            },
            include: [
                {
                    model: film,
                    as: 'film',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'idUser']
                    }
                },
            ]
        })

        readyWatch = JSON.parse(JSON.stringify(readyWatch))

        readyWatch = readyWatch.map((item) => {
            return{
                ...item,
                film: {
                    ...item.film,
                    img: process.env.PATH_FILE + item.film.img
                }
            }
        })

        res.status(200).send({
            status: 'success',
            data,
            readyWatch
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 'failed',
            message: 'server error'
        })
    }
}

exports.getFilm = async (req, res) => {
    try {
        const {id} = req.params;

        let data = await film.findOne({
            where: {id},
            include: [
                {
                    model: user,
                    as: 'user',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password'],
                    },
                },
                {
                    model: transaction,
                    as: 'transactions',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                },
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
        })

        

        data = JSON.parse(JSON.stringify(data))

        data =  {
            ...data,
            img: process.env.PATH_FILE + data.img,
        }

        const idBuyer = req.user.id;

        let transactionData = await transaction.findOne({
            where: {idBuyer, idFilm: id},
            order: [['createdAt', 'DESC']],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
        })

        transactionData = JSON.parse(JSON.stringify(transactionData))

        res.status(200).send({
            status: 'success',
            data,
            statusTransaction: transactionData?.length === 0 ? false :  transactionData?.status,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 'failed',
            message: 'server error'
        })
    }
}

exports.addFilm = async (req, res) => {
    try {
        const data = {
            title: req.body.title,
            price: req.body.price,
            desc: req.body.desc,
            category: req.body.category,
            embedId: req.body.embedId,
            img: req.file.filename,
            idUser: req.user.id
        }

        let newFilm = await film.create(data)

        let dataFilm = await film.findOne({
            where: {id: newFilm.id},
            include: [
                {
                    model: user,
                    as: 'user',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password'],
                    },
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
        })

        dataFilm = JSON.parse(JSON.stringify(dataFilm))

        res.status(200).send({
            status: 'succes',
            data : {
                ...dataFilm,
                img: process.env.PATH_FILE + dataFilm.img
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 'failed',
            message: 'server error'
        })
    }   
}

exports.updateFilm = async (req, res) => {
    try {
        const {id} = req.params;
        const data = {
            title: req?.body?.title,
            price: req?.body?.price,
            desc: req?.body?.desc,
            category: req?.body?.category,
            embedId: req?.body?.embedId,
            img: req?.file?.filename,
            idUser: req?.user?.id
        }

        await film.update(data, {
            where: {id}
        })

        res.status(200).send({
            status: 'success',
            data: {
                id,
                data,
                img: req?.file?.filename
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 'failed',
            message: 'server error'
        })
    }
}

exports.deleteFilm = async(req, res) => {
    try {
        const {id} = req.params;
        await film.destroy({
            where: {id}
        })

        res.status(200).send({
            status: 'success',
            message: `Delete film id: ${id} finished`
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 'failed',
            message: 'server error'
        })
    }
}