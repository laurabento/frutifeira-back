const express = require('express');
let router = express.Router();
const Order = require('../domain/pedido/Order');

const pedidos = [
    {
        "userId":"1",
        "totalPrice":2.6,
        "qrcode":"",
        "payment":"credit-card",
        "scheduling":"2022-04-01 18:00:00",
        "items": [
            {
                "productId":"1",
                "unitprice": 1.5,
                "amount": 1
            },
            {
                "productId":"2",
                "unitprice": 1.1,
                "amount": 1
            }
        ]
    },
    {
        "userId":"3",
        "totalPrice":5.2,
        "qrcode":"32345698778",
        "payment":"credit-card",
        "scheduling":"2022-03-21 14:00:00",
        "items": [
            {
                "productId":"1",
                "unitprice": 1.5,
                "amount": 2
            },
            {
                "productId":"2",
                "unitprice": 1.1,
                "amount": 2
            }
        ]
    },
    {
        "userId":"2",
        "totalPrice":11.9,
        "qrcode":"",
        "payment":"credit-card",
        "scheduling":"2022-03-25 10:00:00",
        "items": [
            {
                "productId":"1",
                "unitprice": 1.5,
                "amount": 5
            },
            {
                "productId":"2",
                "unitprice": 1.1,
                "amount": 4
            }
        ]
    }
];

router
    .route("/:id")
    .get( async (req, res) => {
        const id = req.params.id;
        try {
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                const order = await Order.findOne({_id: id});
                if (!order) {
                    res.status(404).json({ error: "Pedido não encontrado!"});
                    return;
                }
                res.status(200).json(order);
            } else {
                res.status(404).json({ error: "Id do pedido inválido!"});
                return;
            }       
        } catch (error) {
            console.log(error);
        }
    })
    .patch( async (req, res) => {
        const id = req.params.id;
        const { userId, totalPrice, qrcode, payment, scheduling, items } = req.body;
        const order = { userId, totalPrice, qrcode, payment, scheduling, items };
        try {
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                const updatedOrder = await Order.updatedOne({_id: id}, order);
                if (updatedOrder.matchedCount === 0) {
                    res.status(422).json({ error: "Pedido não encontrado!" });
                    return;
                }
                res.status(200).json(order);
            } else {
                res.status(404).json({ error: "Id do pedido inválido!" });
                return;
            }       
        } catch (error) {
            console.log(error);
        }
    })
    .delete( async (req, res) => {
        const id = req.params.id;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const order = await Order.findOne({_id: id});
            if (!order) {
                res.status(404).json({ error: "Pedido não encontrado!"});
                return;
            }            
            try {
                await Order.deleteOne({_id: id});
                res.status(200).json({ message: "O pedido foi deletado com sucesso!" });
            } catch (error) {
                console.log(error);
            }
        } else {
            res.status(404).json({ error: "Id do pedido inválido!"});
            return;
        }
    });

router
    .route("")
    .get( async (req, res) => {
        try {
            const orders = await Order.find();
            res.status(200).json(orders);
        } catch (error) {
            console.log(error);
        }
    })
    .post( async (req, res) => {
        const { name, email, password, cpf, phone, card, condoId } = req.body;
        const order = { name, email, password, cpf, phone, card, condoId };
        try {
            await Order.create(order);
            res.status(201).json({message: "O pedido foi inserido com sucesso!"});
        } catch (error) {
            console.log(error);
        }
    });

router
    .route("/pagamento/:search")
    .get( async (req, res) => {
        const payment = req.params.search;
        try {
            const orders = await Order.find({card: { $regex: '.*' + payment + '.*' } }).limit(5);
            if (!orders || orders.length === 0) {
                res.status(404).json({ error: "Nenhum usuário encontrado com esse nome!"});
                return;
            } else
            res.status(200).json(orders);
        } catch (error) {
            console.log(error);
        }
    });

module.exports = router;