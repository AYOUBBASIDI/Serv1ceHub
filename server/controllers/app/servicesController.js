const Service = require('../../model/servicesModel');

const insert = async (req, res) => {
    const service = new Service({
        title: req.body.title,
        description: req.body.description,
        color1: req.body.color1,
        color2: req.body.color2,
        icon: req.body.icon,
        iconAlt: req.body.iconAlt,
        link: req.body.link,
    });
    try {
        const newService = await service.save();
        res.status(201).json(newService);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}


const show = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    insert,
    show,
};