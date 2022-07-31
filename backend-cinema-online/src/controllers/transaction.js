const { user, profile, film, transaction } = require('../../models')
const rupiahFormat = require('rupiah-format')

exports.getTransactions = async (req, res) => {
    try {
        const idBuyer =  req.user.id;
        let data = await transaction.findAll({
            where: {idBuyer},
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: film,
                    as: 'film',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'idUser', 'desc']
                    }
                },
                {
                    model: user,
                    as: 'buyer',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password', 'status']
                    }
                },
                {
                    model: user,
                    as: 'seller',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password', 'status']
                    }
                }
            ]
        });

        data = JSON.parse(JSON.stringify(data))

        data = data.map((item) => {
            return {
                ...item,
                product: {
                    ...item.product,
                    img: process.env.PATH_FILE + item.product.img
                }
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

exports.addTransactions = async (req, res) => {
    try {
        let data = req.body;

        data = {
            id: parseInt(data.idFilm + Math.random().toString().slice(3, 8)),
            ...data,
            idBuyer: req.user.id,
            status: 'pending',
        }

        const newData = await transaction.create(data)

        // const buyerData = await user.findOne({
        //     where: {id: newData.idBuyer},
        //     include:[
        //         {
        //             model: profile,
        //             as: 'profile',
        //             attributes: {
        //                 exclude: ['createdAt', 'updatedAt', 'idUser']
        //             }
        //         }
        //     ],
        //     attributes: {
        //         exclude: ['createdAt', 'updatedAt', 'password']
        //     }
        // })

        res.status(200).send({
            status: 'pending',
            message: 'Pending transaction payment gateway',
            newData
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 'failed',
            message: 'server error'
        })
    }
}