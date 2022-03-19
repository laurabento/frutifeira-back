const express = require('express');
let router = express.Router();

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
    .route("/:index")
    .get((req, res) => {
        const { index } = req.params;
        return res.json(pedidos[index]);
    })
    .put((req, res) => {
        const { index } = req.params;
        pedidos[index] = req.body;
        return res.json(pedidos);
    })
    .delete((req, res) => {
        const { index } = req.params;    
        pedidos.splice(index, 1);
        return res.json({ message: "O pedido foi deletado" });
    });

router
    .route("")
    .get((req, res) => {
        return res.json(pedidos); 
    })
    .post((req, res) => {
        pedidos.push(req.body);
        return res.json(pedidos);
    });

router
    .route("/pagamento/:search")
    .get((req, res) => {
        const { search } = req.params;
        var retOrders = [];
        pedidos.forEach(order => {
            if (order.payment.toLowerCase().includes(search.toLowerCase())) {
                retOrders.push(order);
            }
        });
        return res.json(retOrders);
    });

module.exports = router;