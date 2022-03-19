const express = require('express');
let router = express.Router();

const feirantes = [
    {
        "name":"Pastel da Linda",
        "product_type":"Pastel e Bebidas",
        "email":"lindaoliveira@gmail.com",
        "password":"X@N*_1290"
    },
    {
        "name":"Barraca do Tiao",
        "product_type":"Hortifruti",
        "email":"tiaobarros@gmail.com",
        "password":"fim*do_mundo00"
    },
    {
        "name":"Peixes Ademar",
        "product_type":"Frutos do Mar",
        "email":"peixesademarfeira@gmail.com",
        "password":"QWERTY_@123"
    },
    {
        "name":"Barraca da Nilda",
        "product_type":"Hortifruti",
        "email":"nildafeira@gmail.com",
        "password":"s3nh4_0987"
    },
];

router
    .route("/:index")
    //retorna um feirante
    .get((req, res) => {
        const { index } = req.params;
        return res.json(feirantes[index]);
    })
    //att um feirante
    .put((req, res) => {
        const { index } = req.params;
        feirantes[index] = req.body;
        return res.json(feirantes);
    })
    //exclui um feirante
    .delete((req, res) => {
        const { index } = req.params;    
        feirantes.splice(index, 1);
        return res.json({ message: "O feirante foi deletado" });
    });

router
    .route("")
    //retorna todos os feirantes
    .get((req, res) => {
        return res.json(feirantes); 
    })
    // criar um novo feirante
    .post((req, res) => {
        feirantes.push(req.body);
        return res.json(feirantes);
    });

router
    .route("/nome/:search")
    .get((req, res) => {
        const { search } = req.params;
        var retUsers = [];
        feirantes.forEach(user => {
            if (user.name.toLowerCase().includes(search.toLowerCase())) {
                retUsers.push(user);
            }
        });
        return res.json(retUsers);
    });

router
    .route("/email/:search")
    .get((req, res) => {
        const { search } = req.params;
        var retUsers = [];
        feirantes.forEach(user => {
            if (user.email.toLowerCase().includes(search.toLowerCase())) {
                retUsers.push(user);
            }
        });
        return res.json(retUsers);
    });

module.exports = router;