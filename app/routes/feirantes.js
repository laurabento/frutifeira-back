const express = require('express');
let router = express.Router();
const authorize = require('../../authorization-middleware');
const MarketVendor = require('../domain/feirante/MarketVendor');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var lodash = require('lodash');

router
    .route("/:id")
    //retorna um feirante
    .get(authorize(), async(req, res) => {
        const id = req.params.id;
        try {
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                const market = await MarketVendor.findById({ _id: id });
                if (!market) {
                    res.status(404).json({ error: "Feirante não encontrado!" });
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
    //att um feirante
    .patch(authorize(), async(req, res) => {
        const id = req.params.id;
        const { name, product_type, email, password } = req.body;
        const market = { name, product_type, email, password };
        try {
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                const updatedMarket = await MarketVendor.updateOne({ _id: id }, market);
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
    .delete(authorize(), async(req, res) => {
        const id = req.params.id;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const prod = await MarketVendor.findOne({ _id: id });
            if (!prod) {
                res.status(404).json({ error: "Feirante não encontrado!" });
                return;
            }
            try {
                await MarketVendor.deleteOne({ _id: id });
                res.status(200).json({ message: "O feirante foi deletado com sucesso!" });
            } catch (error) {
                console.log(error);
            }
        } else {
            res.status(404).json({ error: "Id do feirante inválido!" });
            return;
        }
    });

router
    .route("/")
    //retorna todos os feirantes
    .get(authorize(), async(req, res) => {
        try {
            const markets = await MarketVendor.find();
            res.status(200).json(markets);
        } catch (error) {
            console.log(error);
        }
    })
    .post(async(req, res) => {
        const { name, product_type, email, password } = req.body;
        const market = { name, product_type, email, password };

        try {
            lodash.omit(market, 'password');
            market.password = await bcrypt.hash(password, 10);
            const existingMarket = await MarketVendor.findOne({ email: email });
            if (existingMarket) {
                res.status(422).json({ error: "Email já cadastrado!" });
                return;
            }
            const newMarket = await MarketVendor.create(market);
            res.status(201).json({ message: "O usuário foi inserido com sucesso!", market: newMarket });
        } catch (error) {
            console.log(error);
        }
    });

router
    .route("/login")
    .post(async(req, res) => {
        const { email, password } = req.body;
        const authentication = { email, password };
        try {
            const existingMarket = await MarketVendor.findOne({ email: email });
            if (existingMarket === null || !existingMarket) {
                res.status(422).json({ error: "Feirante não encontrado!", status: "422" });
                return false;
            }
            if (existingMarket && await bcrypt.compare(password, existingMarket.password)) {
                const accessToken = jwt.sign(authentication, process.env.ACCESS_TOKEN);
                res.status(200).json({ message: "Login realizado com sucesso!", accessToken: accessToken, userType: '2', status: "200" });
            } else {
                res.status(422).json({ message: "Senha incorreta!", status: "422" });
            }
        } catch (error) {
            console.log(error);
        }
    });

router
    .route("/nome/:search")
    .get(authorize(), async(req, res) => {
        const name = req.params.search;
        try {
            const markets = await MarketVendor.find({ name: { $regex: '.*' + name + '.*' } }).limit(5);
            if (!markets || markets.length === 0) {
                res.status(404).json({ error: "Nenhum feirante encontrado com esse nome!" });
                return;
            } else
                res.status(200).json(markets);
        } catch (error) {
            console.log(error);
        }
    });


// router
//     .route("/login")
//     .post(async(req, res) => {
//         const { email, password } = req.body;
//         const authentication = { email, password };
//         try {
//             const existingUser = await MarketVendor.findOne({ email: email });
//             if (!existingUser) {
//                 console.log(existingUser);
//                 console.log('nao achou');
//                 res.status(422).json({ error: "Usuário não encontrado!" });
//                 return;
//             }
//             if (existingUser && await bcrypt.compare(password, existingUser.password)) {
//                 const accessToken = jwt.sign(authentication, process.env.ACCESS_TOKEN);
//                 console.log('login')
//                 res.status(200).json({ message: "Login realizado com sucesso!", accessToken: accessToken });
//             } else {
//                 console.log(existingUser);
//                 console.log('nao achou');
//                 res.status(422).json({ message: "Senha incorreta!" });
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     });

router
    .route("/email/:search")
    .get(authorize(), async(req, res) => {
        const email = req.params.search;
        try {
            const markets = await MarketVendor.find({ email: { $regex: '.*' + email + '.*' } }).limit(5);
            if (!markets || markets.length === 0) {
                res.status(404).json({ error: "Nenhum feirante encontrado com esse email!" });
                return;
            } else
                res.status(200).json(markets);
        } catch (error) {
            console.log(error);
        }
    });

module.exports = router;