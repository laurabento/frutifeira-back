const express = require("express");
let router = express.Router();
const authorize = require("../../authorization-middleware");
const Order = require("../domain/pedido/Order");
const OrderUtils = require("../domain/helper");

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
    const { userId, totalPrice, payment, scheduling, items } = req.body;
    const order = { userId, totalPrice, payment, scheduling, items };
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
    const { userId, totalPrice, payment, scheduling, items } = req.body;
    const order = { userId, totalPrice, payment, scheduling, items };
    try {
      const orders = await Order.find({
        userId: { $regex: ".*" + userId + ".*" },
      }).limit(5);
      if (orders && orders.length !== 0) {
        order.totalPrice = OrderUtils.calcPriceFirstOrder(totalPrice);
      }
      const newOrder = await Order.create(order);
      res
        .status(201)
        .json({
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
      const orders = await Order.find({ userId: id });
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

module.exports = router;
