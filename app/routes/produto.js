const express = require('express');
let router = express.Router();
const authorize = require('../../authorization-middleware');
const Product = require('../domain/produto/Product');
const MarketVendor = require('../domain/feirante/MarketVendor');
const OrderUtils = require('../domain/helper');

router
    .route("/:id")
    .get(authorize(), async(req, res) => {
        const id = req.params.id;
        try {
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                const prod = await Product.findById({ _id: id });
                if (!prod) {
                    res.status(404).json({ error: "Produto não encontrado!" });
                    return;
                }
                res.status(200).json(prod);
            } else {
                res.status(404).json({ error: "Id do produto inválido!" });
                return;
            }
        } catch (error) {
            console.log(error);
        }
    })
    .patch(authorize(), async(req, res) => {
        const id = req.params.id;
        const { name, description, img, price, type, unit, discount, oldPrice, quantity, originalDiscount, marketVendorId, stand } = req.body;
        const prod = { name, description, img, price, type, unit, discount, oldPrice, quantity, originalDiscount, marketVendorId, stand };
        try {
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                const updatedProd = await Product.updateOne({ _id: id }, prod);
                if (updatedProd.matchedCount === 0) {
                    res.status(422).json({ error: "Produto não encontrado!" });
                    return;
                }
                res.status(200).json(prod);
            } else {
                res.status(404).json({ error: "Id do produto inválido!" });
                return;
            }
        } catch (error) {
            console.log(error);
        }
    })
    .delete(authorize(), async(req, res) => {
        const id = req.params.id;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const prod = await Product.findOne({ _id: id });
            if (!prod) {
                res.status(404).json({ error: "Produto não encontrado!" });
                return;
            }
            try {
                await Product.deleteOne({ _id: id });
                res.status(200).json({ message: "O produto foi deletado com sucesso!" });
            } catch (error) {
                console.log(error);
            }
        } else {
            res.status(404).json({ error: "Id do produto inválido!" });
            return;
        }
    });

router
    .route("/")
    .get(async(req, res) => {
        try {
            const products = await Product.find();
            res.status(200).json(products);
        } catch (error) {
            console.log(error);
        }
    })
    .post(authorize(), async(req, res) => {
        const { name, description, img, price, product_type, unit, discount, finalPrice, quantity, marketVendorId, stand } = req.body;
        var prod = { name, description, img, price, product_type, unit, discount, finalPrice, quantity, marketVendorId, stand };
        try {
            prod = OrderUtils.calcOriginalDiscount(prod);
            const product = await Product.create(prod);
            res.status(201).json({ message: "O produto foi inserido com sucesso!", product: product });
        } catch (error) {
            console.log(error);
        }
    });

router
    .route("/feirante/:id")
    .get(async(req, res) => {
        try {
            const id = req.params.id;
            const market = await MarketVendor.findById({ _id: id });
            var products = await Product.find({ marketVendorId: id });

            products = JSON.parse(JSON.stringify(products));
            products.forEach(function(entry) {
                entry.marketVendorName = market.name;
            })

            res.status(200).json(products);
        } catch (error) {
            console.log(error);
        }
    })
    .post(authorize(), async(req, res) => {
        const { name, description, img, price, type, unit, discount, finalPrice, quantity, marketVendorId, stand } = req.body;
        var prod = { name, description, img, price, type, unit, discount, finalPrice, quantity, marketVendorId, stand };
        try {
            prod = OrderUtils.calcOriginalDiscount(prod);
            const product = await Product.create(prod);
            res.status(201).json({ message: "O produto foi inserido com sucesso!", product: product });
        } catch (error) {
            console.log(error);
        }
    });


router
    .route("/feirante/:id/nome")
    .get( async (req, res) => {
        try {
            const id = req.params.id;
            const market = await MarketVendor.findById({_id: id});

            var obj = {};
            obj.marketVendorName = market.marketVendorName;
            obj.product_type = market.product_type;
            res.status(200).json(obj);
        } catch (error) {
            console.log(error);
        }
    })

router
    .route("/nome/:search")
    .get(async(req, res) => {
        const name = req.params.search;
        try {
            const products = await Product.find({ name: name });
            if (!products || products.length === 0) {
                res.status(404).json({ error: "Nenhum produto encontrado com esse nome!" });
                return;
            } else
                res.status(200).json(products);
        } catch (error) {
            console.log(error);
        }
    });

router
    .route("/tipo/:search")
    .get(async(req, res) => {
        const type = req.params.search;
        try {
            const products = await Product.find({ type: type });
            if (!products || products.length === 0) {
                res.status(404).json({ error: "Nenhum produto encontrado com esse tipo!" });
                return;
            } else
                res.status(200).json(products);
        } catch (error) {
            console.log(error);
        }
    });

module.exports = router;