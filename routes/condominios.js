const express = require('express');
let router = express.Router();

const condominios = [
    {
        "name":"Morada dos Clássicos",
        "address":"Rua Santo André, 55 - Centro",
        "city":"Santo Andre",
        "state":"Sao Paulo",
        "contact":"morada@gmail.com"
    }, 
    {   
        "name":"Le Boulevard Residence",
        "address":"Av. Portugal, 400 - V. Bastos",
        "city":"Santo Andre",
        "state":"Sao Paulo",
        "contact" : "boulevard@gmail.com"
    }, 
    {
        "name":"Panorama",
        "address":"Rua Joao Gallo, 241 - Centro",
        "city":"Ribeirao Pires",
        "state":"Sao Paulo",
        "contact" : "panorama@gmail.com"
    },
    {
        "name":"La Vita",
        "address":"Rua Carlos Saldanha, 260 - Jd. Maua",
        "city":"Sao Caetano",
        "state":"Sao Paulo",
        "contact" : "lavita@gmail.com"
    }, 
    {
        "name":"DOMO Life",
        "address":"Av. Aldino Pinotti, 500 - Centro",
        "city":"Sao Bernardo do Campo",
        "state":"Sao Paulo",
        "contact" : "domolife@gmail.com"
    }
];

router
    .route("/:index")
    .get((req, res) => {
        const { index } = req.params;
        return res.json(condominios[index]);
    })
    .put((req, res) => {
        const { index } = req.params;
        condominios[index] = req.body;
        return res.json(condominios);
    })
    .delete((req, res) => {
        const { index } = req.params;    
        condominios.splice(index, 1);
        return res.json({ message: "O condominio foi deletado" });
    });

router
    .route("")
    .get((req, res) => {
        return res.json(condominios); 
    })
    .post((req, res) => {
        condominios.push(req.body);
        return res.json(condominios);
    });

router
    .route("/nome/:search")
    .get((req, res) => {
        const { search } = req.params;
        var retCondos = [];
        condominios.forEach(condo => {
            if (condo.name.toLowerCase().includes(search.toLowerCase())) {
                retCondos.push(condo);
            }
        });
        return res.json(retCondos);
    });

router
    .route("/endereco/:search")
    .get((req, res) => {
        const { search } = req.params;
        var retCondos = [];
        condominios.forEach(condo => {
            if (condo.address.toLowerCase().includes(search.toLowerCase())) {
                retCondos.push(condo);
            }
        });
        return res.json(retCondos);
    });

router
    .route("/tudo/:search")
    .get((req, res) => {
        const { search } = req.params;
        var retCondos = [];
        condominios.forEach(condo => {
            if (condo.name.toLowerCase().includes(search.toLowerCase()) ||
                condo.address.toLowerCase().includes(search.toLowerCase()) ||
                condo.city.toLowerCase().includes(search.toLowerCase()) ||
                condo.state.toLowerCase().includes(search.toLowerCase()) ) {
                retCondos.push(condo);
            }
        });
        return res.json(retCondos);
    });

module.exports = router;