const express = require('express');
let router = express.Router();
const MarketVendor = require('../domain/feirante/MarketVendor');

router
    .route("/:id")
    //retorna um feirante
    .get( async (req, res) => {
        const id = req.params.id;
        try {
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                const market = await MarketVendor.findOne({_id: id});
                if (!market) {
                    res.status(404).json({ error: "Feirante não encontrado!"});
                    return;
                }
                res.status(200).json(market);
            } else {
                res.status(404).json({ error: "Id do feirante inválido!"});
                return;
            }       
        } catch (error) {
            console.log(error);
        }
    })
    //att um feirante
    .patch( async (req, res) => {
        const id = req.params.id;
        const { name, product_type, email, password } = req.body;
        const market = { name, product_type, email, password };
        try {
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                const updatedMarket = await MarketVendor.updatedOne({_id: id}, market);
                if (updatedMarket.matchedCount === 0) {
                    res.status(422).json({ error: "Feirante não encontrado!" });
                    return;
                }
                res.status(200).json(market);
            } else {
                res.status(404).json({ error: "Id do feirante inválido!" });
                return;
            }       
        } catch (error) {
            console.log(error);
        }
    })
    //exclui um feirante
    .delete( async (req, res) => {
        const id = req.params.id;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const prod = await MarketVendor.findOne({_id: id});
            if (!prod) {
                res.status(404).json({ error: "Feirante não encontrado!"});
                return;
            }            
            try {
                await MarketVendor.deleteOne({_id: id});
                res.status(200).json({ message: "O feirante foi deletado com sucesso!" });
            } catch (error) {
                console.log(error);
            }
        } else {
            res.status(404).json({ error: "Id do feirante inválido!"});
            return;
        }
    });

router
    .route("/")
    //retorna todos os feirantes
    .get( async (req, res) => {
        try {
            const markets = await MarketVendor.find();
            res.status(200).json(markets);
        } catch (error) {
            console.log(error);
        }
    })
    .post( async (req, res) => {
        const { name, product_type, email, password } = req.body;
        const market = { name, product_type, email, password };
        try {
            await MarketVendor.create(market);
            res.status(201).json({message: "O feirante foi inserido com sucesso!"});
        } catch (error) {
            console.log(error);
        }
    });

router
    .route("/nome/:search")
    .get( async (req, res) => {
        const name = req.params.search;
        try {
            const markets = await MarketVendor.find({name: name});
            if (!markets || markets.length === 0) {
                res.status(404).json({ error: "Nenhum feirante encontrado com esse nome!"});
                return;
            } else
            res.status(200).json(markets);
        } catch (error) {
            console.log(error);
        }
    });

router
    .route("/email/:search")
    .get( async (req, res) => {
        const email = req.params.search;
        try {
            const markets = await MarketVendor.find({email: email});
            if (!markets || markets.length === 0) {
                res.status(404).json({ error: "Nenhum feirante encontrado com esse email!"});
                return;
            } else
            res.status(200).json(markets);
        } catch (error) {
            console.log(error);
        }
    });

module.exports = router;