const express = require('express');
let router = express.Router();

const feiras = [
    {
        "scheduleHour":"18-21",
        "feiranteId":"1",        
        "condominioId":"1"
    },
    {
        "scheduleHour":"8-11",
        "feiranteId":"2",        
        "condominioId":"2"
    },
    {
        "scheduleHour":"14-17",
        "feiranteId":"3",        
        "condominioId":"3"
    }
];

router
    .route("/:index")
    .get((req, res) => {
        const { index } = req.params;
        return res.json(feiras[index]);
    })
    .put((req, res) => {
        const { index } = req.params;
        feiras[index] = req.body;
        return res.json(feiras);
    })
    .delete((req, res) => {
        const { index } = req.params;    
        feiras.splice(index, 1);
        return res.json({ message: "A feira foi deletada" });
    });

router
    .route("")
    .get((req, res) => {
        return res.json(feiras); 
    })
    .post((req, res) => {
        feiras.push(req.body);
        return res.json(feiras);
    });

module.exports = router;