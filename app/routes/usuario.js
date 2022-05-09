const express = require('express');
let router = express.Router();
const User = require('../domain/usuario/User');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var lodash = require('lodash');

router
    .route("/:id")
    .get( async (req, res) => {
        const id = req.params.id;
        try {
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                const user = await User.findOne({_id: id});
                if (!user) {
                    res.status(404).json({ error: "Usuário não encontrado!"});
                    return;
                }
                res.status(200).json(user);
            } else {
                res.status(404).json({ error: "Id do usuário inválido!"});
                return;
            }       
        } catch (error) {
            console.log(error);
        }
    })
    .patch( async (req, res) => {
        const id = req.params.id;
        const { name, email, password, cpf, phone, card, condoId } = req.body;
        const user = { name, email, password, cpf, phone, card, condoId };
        try {
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                const updatedUser = await User.updatedOne({_id: id}, user);
                if (updatedUser.matchedCount === 0) {
                    res.status(422).json({ error: "Usuário não encontrado!" });
                    return;
                }
                res.status(200).json(user);
            } else {
                res.status(404).json({ error: "Id do usuário inválido!" });
                return;
            }       
        } catch (error) {
            console.log(error);
        }
    })
    .delete( async (req, res) => {
        const id = req.params.id;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const user = await User.findOne({_id: id});
            if (!user) {
                res.status(404).json({ error: "Usuário não encontrado!"});
                return;
            }            
            try {
                await User.deleteOne({_id: id});
                res.status(200).json({ message: "O usuário foi deletado com sucesso!" });
            } catch (error) {
                console.log(error);
            }
        } else {
            res.status(404).json({ error: "Id do usuário inválido!"});
            return;
        }
    });

router
    .route("/")
    .get( async (req, res) => {
        try {
            console.log('ué');
            const users = await User.find();
            res.status(200).json(users);
        } catch (error) {
            console.log(error);
        }
    })
    .post( async (req, res) => {
        const { name, email, password, cpf, phone, card, condoId } = req.body;
        const user = { name, email, password, cpf, phone, card, condoId };
        try {
            lodash.omit(user, 'password');
            user.password = await bcrypt.hash(password, 10);
            const existingUser = await User.findOne({email: email});
            if (existingUser) {
                res.status(422).json({ error: "Email já cadastrado!" });
                return;
            }
            await User.create(user);
            res.status(201).json({message: "O usuário foi inserido com sucesso!"});
        } catch (error) {
            console.log(error);
        }
    });

router
    .route("/login")
    .post( async (req, res) => {
        const { email, password } = req.body;
        const authentication = { email, password };
        try {
            const existingUser = await User.findOne({email: email});
            if (!existingUser) {
                res.status(422).json({ error: "Usuário não encontrado!" });
                return;
            }
            if (existingUser && await bcrypt.compare(password, existingUser.password)) {
                const accessToken = jwt.sign(authentication, process.env.ACCESS_TOKEN);
                res.status(200).json({message: "Login realizado com sucesso!", accessToken: accessToken});
            } else {
                res.status(422).json({message: "Senha incorreta!"});
            }
        } catch (error) {
            console.log(error); 
        }
    });

router
    .route("/nome/:search")
    .get( async (req, res) => {
        const name = req.params.search;
        try {
            const users = await User.find({name: { $regex: '.*' + name + '.*' } }).limit(5);
            if (!users || users.length === 0) {
                res.status(404).json({ error: "Nenhum usuário encontrado com esse nome!"});
                return;
            } else
            res.status(200).json(users);
        } catch (error) {
            console.log(error);
        }
    });

router
    .route("/email/:search")
    .get( async (req, res) => {
        const email = req.params.search;
        try {
            const users = await User.find({email: { $regex: '.*' + email + '.*' } }).limit(5);
            if (!users || users.length === 0) {
                res.status(404).json({ error: "Nenhum usuário encontrado com esse email!"});
                return;
            } else
            res.status(200).json(users);
        } catch (error) {
            console.log(error);
        }
    });

module.exports = router;