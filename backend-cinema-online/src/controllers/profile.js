const {profile} = require('../../models')

exports.getProfile = async(req, res) => {
    try {
        const idUser = req.user.id;

        let data = await profile.findOne({
            where: {idUser},
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })

        data = JSON.parse(JSON.stringify(data))

        data = {
            ...data,
            img: data?.img ? process.env.PATH_FILE + data.img : null,
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

exports.updateProfile = async(req, res) => {
    try {
        let {id} = req.params;
        let idUser = req.user.id;

        let data = {
            phone: req?.body?.phone,
            gender: req?.body?.gender,
            address: req?.body?.address,
            img: req?.file?.filename,
        }

        await profile.update(data, {
            where: {id},
            attributes: {
                exclude: ["createdAt", "updatedAt", "idUser"],
            },
        })

        data = JSON.parse(JSON.stringify(data))

        data = {
            ...data,
            img: data ? process.env.PATH_FILE + data.img : null
        }

        res.status(200).send({
            status: 'success',
            message: `Update data profile id: ${id} finished`,
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