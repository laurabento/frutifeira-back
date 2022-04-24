const express = require('express');
let router = express.Router();
const Stand = require('../domain/feira/Stand');

router
    .route("/:id")
    .get( async (req, res) => {
        const id = req.params.id;
        try {
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                const stand = await Stand.findOne({_id: id});
                if (!stand) {
                    res.status(404).json({ error: "Feira não encontrada!"});
                    return;
                }
                res.status(200).json(stand);
            } else {
                res.status(404).json({ error: "Id da feira inválido!"});
                return;
            }       
        } catch (error) {
            console.log(error);
        }
    })
    .patch( async (req, res) => {
        const id = req.params.id;
        const { scheduleHour, feiranteId, condominioId } = req.body;
        const stand = { scheduleHour, feiranteId, condominioId };
        try {
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                const updatedstand = await Stand.updatedOne({_id: id}, stand);
                if (updatedstand.matchedCount === 0) {
                    res.status(422).json({ error: "Feira não encontrada!" });
                    return;
                }
                res.status(200).json(stand);
            } else {
                res.status(404).json({ error: "Id da feira inválido!" });
                return;
            }       
        } catch (error) {
            console.log(error);
        }
    })
    .delete( async (req, res) => {
        const id = req.params.id;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const stand = await Stand.findOne({_id: id});
            if (!stand) {
                res.status(404).json({ error: "Feira não encontrada!"});
                return;
            }            
            try {
                await Stand.deleteOne({_id: id});
                res.status(200).json({ message: "A feira foi deletado com sucesso!" });
            } catch (error) {
                console.log(error);
            }
        } else {
            res.status(404).json({ error: "Id da feira inválido!"});
            return;
        }
    });

router
    .route("")
    .get( async (req, res) => {
        try {
            const stands = await Stand.find();
            res.status(200).json(stands);
        } catch (error) {
            console.log(error);
        }
    })
    .post( async (req, res) => {
        const { scheduleHour, feiranteId, condominioId } = req.body;
        const stand = { scheduleHour, feiranteId, condominioId };
        try {
            await Stand.create(stand);
            res.status(201).json({message: "A feira foi inserida com sucesso!"});
        } catch (error) {
            console.log(error);
        }
    });

module.exports = router;