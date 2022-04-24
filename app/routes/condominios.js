const express = require('express');
let router = express.Router();
const Condominium = require('../domain/condominio/Condominium');

router
    .route("/:id")
    .get( async (req, res) => {
        const id = req.params.id;
        try {
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                const condo = await Condominium.findOne({_id: id});
                if (!condo) {
                    res.status(404).json({ error: "Condomínio não encontrado!"});
                    return;
                }
                res.status(200).json(condo);
            } else {
                res.status(404).json({ error: "Id do condomínio inválido!"});
                return;
            }       
        } catch (error) {
            console.log(error);
        }
    })
    .patch( async (req, res) => {
        const id = req.params.id;
        const { name, address, city, state, contact } = req.body;
        const condo = { name, address, city, state, contact };
        try {
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                const updatedCondo = await Condominium.updatedOne({_id: id}, condo);
                if (updatedCondo.matchedCount === 0) {
                    res.status(422).json({ error: "Condomínio não encontrado!" });
                    return;
                }
                res.status(200).json(condo);
            } else {
                res.status(404).json({ error: "Id do condomínio inválido!" });
                return;
            }       
        } catch (error) {
            console.log(error);
        }
    })
    .delete( async (req, res) => {
        const id = req.params.id;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const condo = await Condominium.findOne({_id: id});
            if (!condo) {
                res.status(404).json({ error: "Condomínio não encontrado!"});
                return;
            }            
            try {
                await Condominium.deleteOne({_id: id});
                res.status(200).json({ message: "O condomínio foi deletado com sucesso!" });
            } catch (error) {
                console.log(error);
            }
        } else {
            res.status(404).json({ error: "Id do condomínio inválido!"});
            return;
        }
    });

router
    .route("")
    .get( async (req, res) => {
        try {
            const condos = await Condominium.find();
            res.status(200).json(condos);
        } catch (error) {
            console.log(error);
        }
    })
    .post( async (req, res) => {        
        const { name, address, city, state, contact } = req.body;
        const condo = { name, address, city, state, contact };
        try {
            await Condominium.create(condo);
            res.status(201).json({message: "O condomínio foi inserido com sucesso!"});
        } catch (error) {
            console.log(error);
        }
    });

router
    .route("/nome/:search")
    .get( async (req, res) => {
        const name = req.params.search;
        try {
            const condos = await Condominium.find({name: { $regex: '.*' + name + '.*' } }).limit(5);
            if (!condos || condos.length === 0) {
                res.status(404).json({ error: "Nenhum usuário encontrado com esse nome!"});
                return;
            } else
            res.status(200).json(condos);
        } catch (error) {
            console.log(error);
        }
    });

router
    .route("/endereco/:search")
    .get( async (req, res) => {
        const address = req.params.search;
        try {
            const condos = await Condominium.find({address: { $regex: '.*' + address + '.*' } }).limit(5);
            if (!condos || condos.length === 0) {
                res.status(404).json({ error: "Nenhum usuário encontrado com esse endereço!"});
                return;
            } else
            res.status(200).json(condos);
        } catch (error) {
            console.log(error);
        }
    });

router
    .route("/tudo/:search")
    .get( async (req, res) => {
        const search = req.params.search;
        const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
        const searchRgx = rgx(search);

        const condos = await Condominium.find({
            $or: [
            { name: { $regex: searchRgx, $options: "i" } },
            { email: { $regex: searchRgx, $options: "i" } },
            { city: { $regex: searchRgx, $options: "i" } },
            { state: { $regex: searchRgx, $options: "i" } },
            ],
        })
            .limit(5)
    });

module.exports = router;