const express = require('express');
let router = express.Router();
const authorize = require('../../authorization-middleware');
const Condominium = require('../domain/condominio/Condominium');
const MarketVendor = require('../domain/feirante/MarketVendor');
const Product = require('../domain/produto/Product');
const MarketCondominium = require('../domain/feiranteCondominio/MarketCondominium');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var lodash = require('lodash');
const { stringify } = require('nodemon/lib/utils');

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
            condos.forEach(element => marketVendorsIds.push(element.marketVendorId));
            var records = await MarketVendor.find({ '_id': { $in: marketVendorsIds } });
            const prods = await Product.find({ marketVendorId: { $in: marketVendorsIds } });
            records = JSON.parse(JSON.stringify(records));
            records.forEach(function(entry) {
                entry.products = [];
            })
            records.forEach(function(entry) {
                prods.forEach(function(prod) {
                    if (prod.marketVendorId == entry._id.toString()) {
                        var newProd = JSON.parse(JSON.stringify(prod));
                        entry.products.push(newProd);
                    }
                })
            })

            res.status(200).json(records);
        } catch (error) {
            console.log(error);
        }
    })
    .post(async(req, res) => {
        const { condominiumId, marketVendorId, status, approvalDate } = req.body;
        const condo = { condominiumId, marketVendorId, status, approvalDate };
        try {
            const newCondo = await MarketCondominium.create(condo);
            res.status(201).json({ message: "Solicitação enviada com sucesso!", condo: newCondo });
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
                marketCondos.forEach(element => marketVendorsIds.push(element.marketVendorId));
                var records = await MarketVendor.find({ '_id': { $in: marketVendorsIds } });
                const prods = await Product.find({ marketVendorId: { $in: marketVendorsIds } });
                records = JSON.parse(JSON.stringify(records));
                records.forEach(function(entry) {
                    entry.products = [];
                })
                records.forEach(function(entry) {
                    prods.forEach(function(prod) {
                        if (prod.marketVendorId == entry._id.toString()) {
                            var newProd = JSON.parse(JSON.stringify(prod));
                            entry.products.push(newProd);
                        }
                    })
                })
                res.status(200).json(records);
            }
        } catch (error) {
            console.log(error);
        }
    });

router
    .route("/feirante/:id")
    .get(authorize(), async(req, res) => {
        const id = req.params.id;
        try {
            const marketCondos = await MarketCondominium.find({ marketVendorId: id });

            var allCondos = await Condominium.find();
            allCondos = JSON.parse(JSON.stringify(allCondos));

            for (var i = 0; i < allCondos.length; i++) {
                if (marketCondos.some(e => e.condominiumId === allCondos[i]._id)) {
                    var market = marketCondos.filter(x => x.condominiumId === allCondos[i]._id);
                    allCondos[i].status = market[0].status;
                    allCondos[i].approvalDate = market[0].approvalDate;
                }
            }

            res.status(200).json(allCondos);

        } catch (error) {
            console.log(error);
        }
    });

router
    .route("/feirante/:id/aprovado")
    .get(authorize(), async(req, res) => {
        console.log("aprovados");
        const id = req.params.id;
        try {
            const marketCondos = await MarketCondominium.find({ marketVendorId: id, status: "Aprovado" });

            var condominiumIds = [];
            marketCondos.forEach(element => condominiumIds.push(element.condominiumId));

            var records = await Condominium.find({ '_id': { $in: condominiumIds } });
            records = JSON.parse(JSON.stringify(records));

            for (var i = 0; i < records.length; i++) {
                if (marketCondos.some(e => e.condominiumId === records[i]._id)) {
                    var market = marketCondos.filter(x => x.condominiumId === records[i]._id);
                    records[i].status = market[0].status;
                    records[i].approvalDate = market[0].approvalDate;
                }
            }

            res.status(200).json(records);

        } catch (error) {
            console.log(error);
        }
    });


module.exports = router;