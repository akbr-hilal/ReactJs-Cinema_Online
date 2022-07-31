const { user, profile, film, transaction } = require('../../models')
const rupiahFormat = require('rupiah-format')
const midTransClient = require('midtrans-client')
const nodemailer = require('nodemailer')

exports.getTransactionsByBuyer = async (req, res) => {
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
                        exclude: ['createdAt', 'updatedAt', 'idUser']
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
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });

        data = JSON.parse(JSON.stringify(data))

        data = data.map((item) => {
            return {
                ...item,
                film: {
                    ...item.film,
                    img: item.film.img ? process.env.PATH_FILE + item.film.img : null,
                },
            };
        });

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

exports.getTransactionsBySeller = async (req, res) => {
    try {
        const idSeller =  req.user.id;
        let data = await transaction.findAll({
            where: {idSeller},
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: film,
                    as: 'film',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'idUser']
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
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });

        data = JSON.parse(JSON.stringify(data))

        data = data.map((item) => {
            return {
                ...item,
                film: {
                    ...item.film,
                    img: item.film.img ? process.env.PATH_FILE + item.film.img : null,
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
            id: parseInt(data.id + Math.random().toString().slice(3, 8)),
            ...data,
            idBuyer: req.user.id,
            status: 'pending',
        }


        const newData = await transaction.create(data)

        const buyerData = await user.findOne({
            where: {id: newData.idBuyer},
            include:[
                {
                    model: profile,
                    as: 'profile',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'idUser']
                    }
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            }
        })

        // create snap api
        let snap = new midTransClient.Snap({
            // Set to true if you want Production Environment (accept real transaction).
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY
        })

        let parameter = {
            transaction_details: {
                order_id: newData.id,
                gross_amount: newData.price,
            },
            credit_card: {
                secure: true,
            },
            customer_details: {
                full_name: buyerData?.name,
                email: buyerData?.email,
                phone: buyerData?.profile?.phone
            }
        }

        const payment = await snap.createTransaction(parameter)

        res.status(200).send({
            status: 'pending',
            message: 'Pending transaction payment gateway',
            payment,
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

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY

const core = new midTransClient.CoreApi()

core.apiConfig.set({
    isProduction: false,
    serverKey: MIDTRANS_SERVER_KEY,
    clientKey: MIDTRANS_CLIENT_KEY,
})

exports.notification = async (req, res) => {
    try {
        const statusResponse = await core.transaction.notification(req.body);
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;

        if (transactionStatus === 'capture') {
            if (fraudStatus === 'challenge') {
                sendEmail('pending', orderId)
                handleTransaction('pending', orderId)
                res.status(200)
            } else if(fraudStatus === 'accept') {
                sendEmail('success', orderId); //sendEmail with status success and order id
                // updateFilm(orderId);
                handleTransaction('success', orderId);
                res.status(200);
            }
        } else if(transactionStatus === 'settlement') {
            sendEmail('success', orderId); //sendEmail with status success and order id
            // updateFilm(orderId);
            handleTransaction('success', orderId);
            res.status(200);
        } else if (
            transactionStatus === 'cancel' ||
            transactionStatus === 'deny' ||
            transactionStatus === 'expire'
        ) {
            sendEmail('failed', orderId); //sendEmail with status failed and order id
            handleTransaction('failed', orderId);
            res.status(200);
        } else if (transactionStatus === 'pending') {
            sendEmail('pending', orderId); //sendEmail with status failed and order id
            handleTransaction('pending', orderId);
            res.status(200);
        }
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}

const handleTransaction = async (status, transactionId) => {
    await transaction.update(
        {
            status,
        },
        {
            where: {
                id: transactionId
            }
        }
    )
}

// const updateFilm = async (orderId) => {
//     const transactionData = await transaction.findOne({
//         where: {
//             id: orderId,
//         }
//     })
//     const filmData = await film.findOne({
//         where: {
//             id: transactionData.idFilm
//         }
//     })
//     await film.update({
//         where: {
//             id: filmData.id
//         }
//     })
// }

const sendEmail = async (status, transactionId) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SYSTEM_EMAIL,
            pass: process.env.SYSTEM_PASSWORD,
        }
    })

    let data = await transaction.findOne({
        where: {
            id: transactionId,
        },
        include: [
            {
                model: film,
                as: 'film',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'idUser']
                }
            },
            {
                model: user,
                as: 'buyer',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'password', 'status']
                }
            },
        ],
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    })

    data = JSON.parse(JSON.stringify(data))

    const mailOptions = {
        from: process.env.SYSTEM_EMAIL,
        to: data.buyer.email,
        subject: 'Payment Status | Cinema Online',
        text: 'Your payment is ' + status,
        html: `<!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Document</title>
                <style>
                h1 {
                    color: brown;
                }
                </style>
            </head>
            <body>
                <h2>Product payment :</h2>
                <ul style="list-style-type:none;">
                <li>Name : ${data.film.title}</li>
                <li>Total payment: ${rupiahFormat.convert(data.price)}</li>
                <li>Status : <b>${status}</b></li>
                </ul>  
            </body>
        </html>
        `,
    };

    if (data.status !== status){
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) throw err
            console.log('Email sent: ' + info.response);

            return res.status(200).send({
                status: 'success',
                message: info.response,
            })
        })
    }
}