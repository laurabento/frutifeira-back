const express = require('express');
let router = express.Router();

const produtos = [
    {
        "name":"Banana",
        "description":"",
        "img":"",
        "price": 0.4,
        "type": "fruta",
        "stand": "1"
    },
    {
        "name":"Melancia",
        "description":"",
        "img":"",
        "price": 8.5,
        "type": "fruta",
        "stand": "2"
    },
    {
        "name":"Uva",
        "description":"",
        "img":"",
        "price": 12.5,
        "type": "fruta",
        "stand": "3"
    },
    {
        "name":"Alface",
        "description":"",
        "img":"",
        "price": 1.0,
        "type": "verdura",
        "stand": "2"
    }
];

router
    .route("/:index")
    .get((req, res) => {
        const { index } = req.params;
        return res.json(produtos[index]);
    })
    .put((req, res) => {
        const { index } = req.params;
        produtos[index] = req.body;
        return res.json(produtos);
    })
    .delete((req, res) => {
        const { index } = req.params;    
        produtos.splice(index, 1);
        return res.json({ message: "O produto foi deletado" });
    });

router
    .route("")
    .get((req, res) => {
        return res.json(produtos); 
    })
    .post((req, res) => {
        produtos.push(req.body);
        return res.json(produtos);
    });

router
    .route("/nome/:search")
    .get((req, res) => {
        const { search } = req.params;
        var retProducts = [];
        produtos.forEach(prod => {
            if (prod.name.toLowerCase().includes(search.toLowerCase())) {
                retProducts.push(prod);
            }
        });
        return res.json(retProducts);
    });

router
    .route("/tipo/:search")
    .get((req, res) => {
        const { search } = req.params;
        var retProducts = [];
        produtos.forEach(prod => {
            if (prod.type.toLowerCase().includes(search.toLowerCase())) {
                retProducts.push(prod);
            }
        });
        return res.json(retProducts);
    });

module.exports = router;