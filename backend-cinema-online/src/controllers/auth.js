// Import models
const {user, profile} = require('../../models')

// Import joi validation
const Joi = require('joi')

// Import bcrypt password hidden
const bcrypt = require('bcrypt')

// Import JWT for token user
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().min(5).required(),
        password: Joi.string().min(4).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).send({
            error: {
                message: error.details[0].message,
            },
        });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const findEmail = await user.findOne({
            where: {
                email: req.body.email,
            },
        });

        if (findEmail) {
            return res.status(400).send({
                status: "failed",
                message: "Email Already",
            });
        } else {
            const newUser = await user.create({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                status: "costumer",
            });

            await profile.create({
                idUser: newUser.id,
            });

            const token = jwt.sign({ id: user.id }, process.env.TOKEN_KEY);

            res.status(200).send({
                status: "success",
                message: "Register Success",
                data: {
                    name: newUser.name,
                    email: newUser.email,
                    status: newUser.status,
                    token,
                },
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.login = async (req, res) => {
    const schema = Joi.object({
        email: Joi.string().email().min(5).required(),
        password: Joi.string().min(4).required(),
    })

    const { error } = schema.validate(req.body)

    if(error){
        return res.status(500).send({
            error: {
                message: error.details[0].message
            }
        })
    }

    try {
        let findUser = await user.findOne({
            where: {
                email: req.body.email
            },
            include: [
                {
                    model: profile,
                    as: 'profile',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    },
                }
            ]
        })
       

        if (!findUser) {
            return res.status(400).send({
                status: 'failed',
                message: 'Email not found',
            })
        } else {
            const isValid = await bcrypt.compare(req.body.password, findUser.password)

            if (!isValid) {
                return res.status(400).send({
                    status: 'failed',
                    message: 'Password wrong!'
                })
            } else {
                const token = jwt.sign({ id: findUser.id }, process.env.TOKEN_KEY)
                findUser = JSON.parse(JSON.stringify(findUser))

                res.status(200).send({
                    status: 'success',
                    data: {
                        name: findUser.name,
                        email: findUser.email,
                        status: findUser.status,
                        img: findUser?.profile?.img ? process.env.PATH_FILE + findUser.profile.img : null,
                        token,
                    }
                })
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 'failed',
            message: 'server error'
        })
    }
}


exports.checkAuth = async (req, res) => {
    try {
        const id = req.user.id

        let dataUser = await user.findOne({
            where: {
                id,
            },
            include: [
                {
                    model: profile,
                    as: 'profile',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    },
                }
            ]
        })

        if (!dataUser) {
            return res.status(404).send({
                status: 'failed'
            })
        } else {
            dataUser = JSON.parse(JSON.stringify(dataUser))

            return res.status(200).send({
                status: "success",
                data: {
                    user: {
                        id: dataUser.id,
                        name: dataUser.name,
                        email: dataUser.email,
                        status: dataUser.status,
                        img: dataUser?.profile?.img ? process.env.PATH_FILE + dataUser.profile.img : null
                    },
                }
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 'failed',
            message: 'server error'
        })
    }
}