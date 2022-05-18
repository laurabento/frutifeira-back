const express = require('express');
let router = express.Router();
const authorize = require('../../authorization-middleware');
const Condominium = require('../domain/condominio/Condominium');
const MarketVendor = require('../domain/feirante/MarketVendor');
const MarketCondominium = require('../domain/feiranteCondominio/MarketCondominium');

router
    .route("/:id")
    .get(authorize(), async(req, res) => {
        const id = req.params.id;
        try {
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                const condo = await MarketCondominium.findById({ _id: id });
                if (!condo) {
                    res.status(404).json({ error: "Condomínio não encontrado!" });
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
    .patch(authorize(), async(req, res) => {
        const id = req.params.id;
        const { condominiumId, marketVendorId } = req.body;
        const condo = { condominiumId, marketVendorId };
        try {
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                const updatedCondo = await MarketCondominium.updateOne({ _id: id }, condo);
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
    .delete(authorize(), async(req, res) => {
        const id = req.params.id;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const condo = await MarketCondominium.findOne({ _id: id });
            if (!condo) {
                res.status(404).json({ error: "Condomínio não encontrado!" });
                return;
            }
            try {
                await Condominium.deleteOne({ _id: id });
                res.status(200).json({ message: "O condomínio foi deletado com sucesso!" });
            } catch (error) {
                console.log(error);
            }
        } else {
            res.status(404).json({ error: "Id do condomínio inválido!" });
            return;
        }
    });

router
    .route("/")
    .get(async(req, res) => {
        try {
            const condos = await MarketCondominium.find();
            var marketVendorsIds = [];
            condos.forEach( element => marketVendorsIds.push(element.marketVendorId));
            const records = await MarketVendor.find({ '_id': { $in: marketVendorsIds } });
            res.status(200).json(records);
        } catch (error) {
            console.log(error);
        }
    })
    .post(async(req, res) => {
        const { condominiumId, marketVendorId } = req.body;
        const condo = { condominiumId, marketVendorId };
        try {
            const newCondo = await MarketCondominium.create(condo);
            res.status(201).json({ message: "O condomínio foi inserido com sucesso!", condo: newCondo });
        } catch (error) {
            console.log(error);
        }
    });

router
    .route("/nome/:search")
    .get(authorize(), async(req, res) => {
        const name = req.params.search;
        try {
            const condos = await MarketCondominium.find({ name: { $regex: '.*' + name + '.*' } }).limit(5);
            if (!condos || condos.length === 0) {
                res.status(404).json({ error: "Nenhum condomínio encontrado com esse nome!" });
                return;
            } else
                res.status(200).json(condos);
        } catch (error) {
            console.log(error);
        }
    });

router
    .route("/condominio/:id")
    .get(authorize(), async(req, res) => {
        const id = req.params.id;
        try {
            console.log(id);
            const marketCondos = await MarketCondominium.find({ condominiumId: id });
            console.log(marketCondos);
            if (!marketCondos || marketCondos.length === 0) {
                res.status(404).json({ error: "Nenhum condomínio encontrado com esse Id!" });
                return;
            } else {
                var marketVendorsIds = [];
                marketCondos.forEach( element => marketVendorsIds.push(element.marketVendorId));
                const records = await MarketVendor.find({ '_id': { $in: marketVendorsIds } });
                res.status(200).json(records);
            }
        } catch (error) {
            console.log(error);
        }
    });

module.exports = router;