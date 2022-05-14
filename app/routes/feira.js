const express = require('express');
let router = express.Router();
const authorize = require('../../authorization-middleware');
const Stand = require('../domain/feira/Stand');

router
    .route("/:id")
    .get(authorize(), async (req, res) => {
        const id = req.params.id;
        try {
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                const stand = await Stand.findById({_id: id});
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
    .patch(authorize(), async (req, res) => {
        const id = req.params.id;
        const { scheduleHour, feiranteId, condominioId } = req.body;
        const stand = { scheduleHour, feiranteId, condominioId };
        try {
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                const updatedstand = await Stand.updateOne({_id: id}, stand);
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
    .delete(authorize(), async (req, res) => {
        const id = req.params.id;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const stand = await Stand.findOne({_id: id});
            if (!stand) {
                res.status(404).json({ error: "Feira não encontrada!"});
                return;
            }            
            try {
                await Stand.deleteOne({_id: id});
                res.status(200).json({ message: "A feira foi deletada com sucesso!" });
            } catch (error) {
                console.log(error);
            }
        } else {
            res.status(404).json({ error: "Id da feira inválido!"});
            return;
        }
    });

router
    .route("/")
    .get(authorize(), async (req, res) => {
        try {
            const stands = await Stand.find();
            res.status(200).json(stands);
        } catch (error) {
            console.log(error);
        }
    })
    .post(authorize(), async (req, res) => {
        const { scheduleHour, feiranteId, condominioId } = req.body;
        const stand = { scheduleHour, feiranteId, condominioId };
        try {
            const newStand = await Stand.create(stand);
            res.status(201).json({message: "A feira foi inserida com sucesso!", stand: newStand});
        } catch (error) {
            console.log(error);
        }
    });

module.exports = router;