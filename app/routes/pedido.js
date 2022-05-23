const express = require("express");
let router = express.Router();
const authorize = require("../../authorization-middleware");
const Order = require("../domain/pedido/Order");
const OrderUtils = require("../domain/helper");
var bcrypt = require("bcryptjs");
var lodash = require("lodash");
const Condominium = require("../domain/condominio/Condominium");

router
  .route("/:id")
  .get(authorize(), async (req, res) => {
    // #swagger.tags = ['Pedido']
    const id = req.params.id;
    try {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const order = await Order.findById({ _id: id });
        if (!order) {
          res.status(404).json({ error: "Pedido não encontrado!" });
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
  .patch(authorize(), async (req, res) => {
    // #swagger.tags = ['Pedido']
    const id = req.params.id;
    const {
      status,
    } = req.body;
    var order = {
      status,
    };
    // lodash.omit(payment.cardNumber, "payment.cardNumber");
    // order.payment.cardNumber = await bcrypt.hash(payment.cardNumber, 10);
    // lodash.omit(payment.cardSecrectyNumber, "payment.cardSecrectyNumber");
    // order.payment.cardSecrectyNumber = await bcrypt.hash(payment.cardSecrectyNumber, 10);
    try {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const updatedOrder = await Order.updateOne({ _id: id }, order);
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
  .delete(authorize(), async (req, res) => {
    // #swagger.tags = ['Pedido']
    const id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      const order = await Order.findOne({ _id: id });
      if (!order) {
        res.status(404).json({ error: "Pedido não encontrado!" });
        return;
      }
      try {
        await Order.deleteOne({ _id: id });
        res.status(200).json({ message: "O pedido foi deletado com sucesso!" });
      } catch (error) {
        console.log(error);
      }
    } else {
      res.status(404).json({ error: "Id do pedido inválido!" });
      return;
    }
  });

router
  .route("/")
  .get(authorize(), async (req, res) => {
    // #swagger.tags = ['Pedido']
    try {
      const orders = await Order.find();
      res.status(200).json(orders);
    } catch (error) {
      console.log(error);
    }
  })
  .post(authorize(), async (req, res) => {
    // #swagger.tags = ['Pedido']
    const { userId, totalPrice, payment, scheduling, items, condominiumId } =
      req.body;
    var order = {
      userId,
      totalPrice,
      payment,
      scheduling,
      items,
      condominiumId,
    };
    // lodash.omit(payment.cardNumber, "payment.cardNumber");
    // order.payment.cardNumber = await bcrypt.hash(payment.cardNumber, 10);
    // lodash.omit(payment.cardSecrectyNumber, "payment.cardSecrectyNumber");
    // order.payment.cardSecrectyNumber = await bcrypt.hash(payment.cardSecrectyNumber, 10);
    try {
      const orders = await Order.find({
        userId: { $regex: ".*" + userId + ".*" },
      }).limit(5);
      if (orders && orders.length !== 0) {
        order.totalPrice = OrderUtils.calcPriceFirstOrder(totalPrice);
      }
      console.log(Order.estimatedDocumentCount());
      const newOrder = await Order.create(
        OrderUtils.newOrder(order, Order.estimatedDocumentCount()),
      );
      res.status(201).json({
        message: "O pedido foi inserido com sucesso!",
        order: newOrder,
      });
    } catch (error) {
      console.log(error);
    }
  });

router.route("/pagamento/:search").get(authorize(), async (req, res) => {
  // #swagger.tags = ['Pedido']
  const payment = req.params.search;
  try {
    const orders = await Order.find({
      card: { $regex: ".*" + payment + ".*" },
    }).limit(5);
    if (!orders || orders.length === 0) {
      res
        .status(404)
        .json({ error: "Nenhum usuário encontrado com esse nome!" });
      return;
    } else res.status(200).json(orders);
  } catch (error) {
    console.log(error);
  }
});

router.route("/usuario/:id").get(authorize(), async (req, res) => {
  // #swagger.tags = ['Pedido']
  const id = req.params.id;
  try {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      var orders = await Order.find({ userId: id });
      orders = JSON.parse(JSON.stringify(orders));

      var condosIds = [];
      orders.forEach((element) =>
        condosIds.push(element.condominiumId)
      );

      var condos = await Condominium.find({ _id: { $in: condosIds }  });

      condos.forEach(function (condo) {
        orders.forEach(function (ord) {
          if (ord.condominiumId == condo._id.toString()) {
            ord.condominiumName = condo.name;
            ord.condominiumCity = condo.city;
            ord.condominiumState = condo.state;
            ord.condominiumAddress = condo.address;
            ord.condominiumNeighborhood = condo.neighborhood;
            ord.condominiumCep = condo.cep;
          }
        });
      });

      if (!orders || orders.length === 0) {
        res.status(404).json({ error: "Pedidos não encontrados!" });
        return;
      }
      res.status(200).json(orders);
    } else {
      res.status(404).json({ error: "Id do usuário inválido!" });
      return;
    }
  } catch (error) {
    console.log(error);
  }
});

router
  .route("/feirante/:marketid/condominio/:condominiumid")
  .get(authorize(), async (req, res) => {
    // #swagger.tags = ['Pedido']
    const marketid = req.params.marketid;
    const condominiumid = req.params.condominiumid;
    try {
      if (condominiumid.match(/^[0-9a-fA-F]{24}$/)) {
        const condo = await Condominium.findById({ _id: condominiumid });

        var orders = await Order.find({ condominiumId: condominiumid });
        orders = JSON.parse(JSON.stringify(orders));

        if (!orders || orders.length === 0) {
          res.status(404).json({ error: "Pedidos não encontrados!" });
          return;
        }
        var returnOrders = [];

        for (var i = 0; i < orders.length; i++) {
          var skip = false;
          for (var j = 0; j < orders[i].items.length; i++) {
            for (var k = 0; k < orders[i].items[j].products.length; i++) {
              if (orders[i].items[j].products[k].marketVendorId == marketid) {
                
                orders[i].condominiumName = condo.name,
                orders[i].condominiumCity = condo.city,
                orders[i].condominiumState = condo.state,
                orders[i].condominiumAddress = condo.address,
                orders[i].condominiumNeighborhood = condo.neighborhood,
                orders[i].condominiumCep = condo.cep,

                returnOrders.push(orders[i]);
                skip = true;
                break;
              }
            }
            if (skip) {
              break;
            }
          }
        }
        res.status(200).json(returnOrders);
      } else {
        res.status(404).json({ error: "Id do usuário inválido!" });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  });

module.exports = router;
