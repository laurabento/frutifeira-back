const express = require('express');
let router = express.Router();

const usuarios = [
    {
        "name":"Raphael",
        "email":"rkm@gmail.com",
        "password":"012345",
        "cpf":"12345698778",
        "phone":"11982922331",
        "card":"1234432156788765",
        "condoId":"1",
    },
    {
        "name":"Isabelle",
        "email":"ioo@gmail.com",
        "password":"543210",
        "cpf":"32345698778",
        "phone":"11988215481",
        "card":"",
        "condoId":"2"
    },
    {
        "name":"Laura",
        "email":"lgb@gmail.com",
        "password":"987654",
        "cpf":"45345698778",
        "phone":"11995124528",
        "card":"",
        "condoId":"3"
    }
];

router
    .route("/:index")
    .get((req, res) => {
        const { index } = req.params;
        return res.json(usuarios[index]);
    })
    .put((req, res) => {
        const { index } = req.params;
        usuarios[index] = req.body;
        return res.json(usuarios);
    })
    .delete((req, res) => {
        const { index } = req.params;    
        usuarios.splice(index, 1);
        return res.json({ message: "O usuário foi deletado" });
    });

router
    .route("")
    .get((req, res) => {
        return res.json(usuarios); 
    })
    .post((req, res) => {
        usuarios.push(req.body);
        return res.json(usuarios);
    });

router
    .route("/nome/:search")
    .get((req, res) => {
        const { search } = req.params;
        var retUsers = [];
        usuarios.forEach(user => {
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
        usuarios.forEach(user => {
            if (user.email.toLowerCase().includes(search.toLowerCase())) {
                retUsers.push(user);
            }
        });
        return res.json(retUsers);
    });

module.exports = router;