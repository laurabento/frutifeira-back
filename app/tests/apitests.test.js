const supertest = require('supertest');
const app = require('../../main');

var authToken;

describe('GET Users', () => {
  it('Should return users', async () => {
    const res = await supertest(app)
      .get('/api/v1.0/users/')
      .send()
    expect(res.statusCode).toEqual(200)
  })

  it('Should return user login', async () => {
    const res = await supertest(app)
      .post('/api/v1.0/users/login')
      .send({email:'raphaelkonichi@gmail.com', password:'fruti123'})
    expect(res.statusCode).toEqual(200)
    authToken = res._body.accessToken;
  })

  it('Should return users by name', async () => {
    const res = await supertest(app)
      .get('/api/v1.0/users/nome/Rapha')
      .send()
    expect(res.statusCode).toEqual(200)
  })

  it('Should return users by email', async () => {
    const res = await supertest(app)
      .get('/api/v1.0/users/email/rapha')
      .send()
    expect(res.statusCode).toEqual(200)
  })
})

var userId;

describe('POST Users', () => {
  it('Should create user', async () => {
    var randomNum = Math.random() * (1000 - 1 + 1) + 1;
    const res = await supertest(app)
      .post('/api/v1.0/users/')
      .send({
        name:"Test"+randomNum,
        email:"test"+randomNum+"@gmail.com",
        password:"fruti123",
        cpf:"123456789",
        phone:"11999999999",
        card:"",
        condoId:""
    })
    expect(res.statusCode).toEqual(201)
    expect(res._body.user.name).toEqual('Test'+randomNum)
    userId = res._body.user._id;
  })
})

describe('PATCH Users', () => {
  it('Should update user', async () => {
    const res = await supertest(app)
      .patch('/api/v1.0/users/' + userId)
      .send({
        name:"updated Test",
        email:"updatedtest@gmail.com",
        password:"fruti123",
        cpf:"123456789",
        phone:"11999999999",
        card:"",
        condoId:""
    })
    expect(res.statusCode).toEqual(200)
    expect(res._body.name).toEqual('updated Test')
  })

  it('Should not update user', async () => {
    const res = await supertest(app)
      .patch('/api/v1.0/users/' + '1684864684688')
      .send({
        name:"updated Test",
        email:"updatedtest@gmail.com",
        password:"fruti123",
        cpf:"123456789",
        phone:"11999999999",
        card:"",
        condoId:""
    })
    expect(res.statusCode).toEqual(404)
  })

  it('Should not update user', async () => {
    const res = await supertest(app)
      .patch('/api/v1.0/users/' + '627c5a889c661d5880541cb5')
      .send({
        name:"updated Test",
        email:"updatedtest@gmail.com",
        password:"fruti123",
        cpf:"123456789",
        phone:"11999999999",
        card:"",
        condoId:""
    })
    expect(res.statusCode).toEqual(422)
  })
})

describe('DELETE Users', () => {
  it('Should delete user', async () => {
    const res = await supertest(app)
      .delete('/api/v1.0/users/' + userId)
      .send()
    expect(res.statusCode).toEqual(200)
    console.log(res._body);
    expect(res._body.message).toEqual('O usuário foi deletado com sucesso!')
  })
})

describe("GET Condominium", () => {
  it("Should return condos", async () => {
    const res = await supertest(app)
      .get("/api/v1.0/condominium/")
      .set({
        authorization:
          "Bearer "+ authToken,
      })
      .send();
    expect(res.statusCode).toEqual(200);
  });

  it("Should return condos login", async () => {
    const res = await supertest(app).post("/api/v1.0/condominium/login").send({
      email: "email123@gmail.com",
      password: "frutifeira123",
    });
    expect(res.statusCode).toEqual(200);
  });

  it("Should return condos by name", async () => {
    const res = await supertest(app)
      .get("/api/v1.0/condominium/nome/teste")
      .set({
        authorization:
          "Bearer "+ authToken,
      })
      .send();
    expect(res.statusCode).toEqual(200);
  });

  it("Should return condos by address", async () => {
    const res = await supertest(app)
      .get("/api/v1.0/condominium/endereco/Aldino")
      .set({
        authorization:
          "Bearer "+ authToken,
      })
      .send();
    expect(res.statusCode).toEqual(200);
  });

  it("Should return condos by all", async () => {
    const res = await supertest(app)
      .get("/api/v1.0/condominium/tudo/email123@gmail.com")
      .set({
        authorization:
          "Bearer "+ authToken,
      })
      .send();
    expect(res.statusCode).toEqual(200);
  });
});

var condoId;

describe('POST Condominium', () => {
  it('Should create condo', async () => {
    var randomNum = Math.random() * (1000 - 1 + 1) + 1;
    const res = await supertest(app)
      .post('/api/v1.0/condominium/')
      .send({
        name:"teste"+randomNum,
        address:"Av. Aldino Pinotti, 999 - Centro",
        city:"Sao Paulo",
        state:"Sao Paulo",
        contact : "teste@gmail.com",
        email: "test"+randomNum+"@gmail.com",
        password: "frutifeira123"
    })
    expect(res.statusCode).toEqual(201)
    expect(res._body.condo.name).toEqual('teste'+randomNum)
    condoId = res._body.condo._id;
  })
})

describe('PATCH Condominium', () => {
  it('Should update condo', async () => {
    const res = await supertest(app)
      .patch('/api/v1.0/condominium/' + condoId)
      .set({
        authorization:
          "Bearer "+ authToken,
      })      
      .send({
        name:"updated Test",
        address:"Av. Aldino Pinotti, 999 - Centro",
        city:"Sao Paulo",
        state:"Sao Paulo",
        contact : "teste123@gmail.com"
    })
    expect(res.statusCode).toEqual(200)
    expect(res._body.name).toEqual('updated Test')
  })
})

describe('DELETE Condominium', () => {
  it('Should delete condo', async () => {
    const res = await supertest(app)
      .delete('/api/v1.0/condominium/' + condoId)
      .set({
        authorization:
          "Bearer "+ authToken,
      })
      .send()
    expect(res.statusCode).toEqual(200)
    console.log(res._body);
    expect(res._body.message).toEqual('O condomínio foi deletado com sucesso!')
  })
})

describe('GET Products', () => {
  it('Should return product by id', async () => {
    const res = await supertest(app)
      .get('/api/v1.0/products/62783cadb9438edbbd11386d')
      .set({
        authorization:
          "Bearer "+ authToken,
      })
      .send()
    expect(res.statusCode).toEqual(200)
  })

  it('Should return products', async () => {
    const res = await supertest(app)
      .get('/api/v1.0/products/')
      .send()
    expect(res.statusCode).toEqual(200)
  })

  it('Should return products by name', async () => {
    const res = await supertest(app)
      .get('/api/v1.0/products/nome/Laranja')
      .send()
    expect(res.statusCode).toEqual(200)
  })
  it('Should return products by type', async () => {
    const res = await supertest(app)
      .get('/api/v1.0/products/tipo/Fruta')
      .send()
    expect(res.statusCode).toEqual(200)
  })
})

var prodId;

describe('POST Products', () => {
  it('Should create product', async () => {
    var randomNum = Math.random() * (1000 - 1 + 1) + 1;
    const res = await supertest(app)
      .post('/api/v1.0/products/')
      .set({
        authorization:
          "Bearer "+ authToken,
      })
      .send({
        name: "Morango"+randomNum,
        description: "fruta vermelha",
        img: "",
        price: 8,
        type: "Fruta",
        stand: "1"
    })
    expect(res.statusCode).toEqual(201)
    console.log(res._body);
    expect(res._body.product.name).toEqual('Morango'+randomNum)
    prodId = res._body.product._id;
    console.log(prodId)
  })
})

describe('PATCH Products', () => {
  it('Should update product', async () => {
    const res = await supertest(app)
      .patch('/api/v1.0/products/' + prodId)
      .set({
        authorization:
          "Bearer "+ authToken,
      })      
      .send({
        name: "Morango update",
        description: "fruta vermelha",
        img: "",
        price: 80,
        type: "Fruta",
        stand: "1"
    })
    expect(res.statusCode).toEqual(200)
    console.log(res._body);
    expect(res._body.name).toEqual('Morango update')
  })
})

describe('DELETE Products', () => {
  it('Should delete product', async () => {
    const res = await supertest(app)
      .delete('/api/v1.0/products/' + prodId)
      .set({
        authorization:
          "Bearer "+ authToken,
      })
      .send()
    expect(res.statusCode).toEqual(200)
    console.log(res._body);
    expect(res._body.message).toEqual('O produto foi deletado com sucesso!')
  })
})

describe("GET Stands", () => {
  it('Should return stand by id', async () => {
    const res = await supertest(app)
      .get('/api/v1.0/stands/627fa4343722af24ff2c3b19')
      .set({
        authorization:
          "Bearer "+ authToken,
      })
      .send()
    expect(res.statusCode).toEqual(200)
  })

  it("Should return stands", async () => {
    const res = await supertest(app)
      .get("/api/v1.0/stands/")
      .set({
        authorization:
          "Bearer "+ authToken,
      })
      .send();
    expect(res.statusCode).toEqual(200);
  });
})

var standId;

describe('POST Stands', () => {
  it('Should create stand', async () => {
    const res = await supertest(app)
      .post('/api/v1.0/stands/')
      .set({
        authorization:
          "Bearer "+ authToken,
      })
      .send({
        scheduleHour:"2001-08-14T03:00:00.000Z",
        feiranteId:"2",
        condominioId:"1"
    })
    expect(res.statusCode).toEqual(201)
    expect(res._body.stand.feiranteId).toEqual("2")
    standId = res._body.stand._id;
  })
})

describe('PATCH Stands', () => {
  it('Should update stand', async () => {
    const res = await supertest(app)
      .patch('/api/v1.0/stands/' + standId)
      .set({
        authorization:
          "Bearer "+ authToken,
      })      
      .send({
        scheduleHour:"2001-08-15T03:00:00.000Z",
        feiranteId:"1",
        condominioId:"1"
    })
    expect(res.statusCode).toEqual(200)
    expect(res._body.feiranteId).toEqual('1')
  })
})

describe('DELETE Stands', () => {
  it('Should delete stand', async () => {
    const res = await supertest(app)
      .delete('/api/v1.0/stands/' + standId)
      .set({
        authorization:
          "Bearer "+ authToken,
      })
      .send()
    expect(res.statusCode).toEqual(200)
    console.log(res._body);
    expect(res._body.message).toEqual('A feira foi deletada com sucesso!')
  })
})

describe('GET Market Vendors', () => {
  it('Should return marketvendor by id', async () => {
    const res = await supertest(app)
      .get('/api/v1.0/marketvendors/627c56467a482bec986df6a1')
      .set({
        authorization:
          "Bearer "+ authToken,
      })
      .send()
    expect(res.statusCode).toEqual(200)
  })

  it('Should return marketvendors', async () => {
    const res = await supertest(app)
      .get('/api/v1.0/marketvendors/')
      .set({
        authorization:
          "Bearer "+ authToken,
      })
      .send()
    expect(res.statusCode).toEqual(200)
  })

  it("Should return marketvendors login", async () => {
    const res = await supertest(app).post("/api/v1.0/marketvendors/login").send({
      email: "feirante001@gmail.com",
      password: "frutifeira123",
    });
    expect(res.statusCode).toEqual(200);
  });

  it('Should return marketvendors by name', async () => {
    const res = await supertest(app)
      .get('/api/v1.0/marketvendors/nome/Feirante 2')
      .set({
        authorization:
          "Bearer "+ authToken,
      })
      .send()
    expect(res.statusCode).toEqual(200)
  })

  it('Should return marketvendors by email', async () => {
    const res = await supertest(app)
      .get('/api/v1.0/marketvendors/email/feirante1@gmail.com')
      .set({
        authorization:
          "Bearer "+ authToken,
      })
      .send()
    expect(res.statusCode).toEqual(200)
  })
})

var marketId;

describe('POST Market Vendors', () => {
  it('Should create marketvendor', async () => {
    var randomNum = Math.random() * (1000 - 1 + 1) + 1;
    const res = await supertest(app)
      .post('/api/v1.0/marketvendors/')
      .set({
        authorization:
          "Bearer "+ authToken,
      })
      .send({
        name:"Test"+randomNum,
        product_type:"Pastel e Bebidas",
        email:"test"+randomNum+"@gmail.com",
        password:"portugal@123"
    })
    expect(res.statusCode).toEqual(201)
    console.log(res._body);
    expect(res._body.market.name).toEqual("Test"+randomNum)
    marketId = res._body.market._id;
    console.log(marketId)
  })
})

describe('PATCH Market Vendors', () => {
  it('Should update marketvendor', async () => {
    const res = await supertest(app)
      .patch('/api/v1.0/marketvendors/' + marketId)
      .set({
        authorization:
          "Bearer "+ authToken,
      })      
      .send({
        name:"Test update",
        product_type:"Pastel e Bebidas"
    })
    expect(res.statusCode).toEqual(200)
    console.log(res._body);
    expect(res._body.name).toEqual('Test update')
  })
})

describe('DELETE Market Vendors', () => {
  it('Should delete marketvendor', async () => {
    const res = await supertest(app)
      .delete('/api/v1.0/marketvendors/' + marketId)
      .set({
        authorization:
          "Bearer "+ authToken,
      })
      .send()
    expect(res.statusCode).toEqual(200)
    console.log(res._body);
    expect(res._body.message).toEqual('O feirante foi deletado com sucesso!')
  })
})

describe('GET Orders', () => {
  it('Should return order by id', async () => {
    const res = await supertest(app)
      .get('/api/v1.0/orders/627fb966d6b622be8952a120')
      .set({
        authorization:
          "Bearer "+ authToken,
      })
      .send()
    expect(res.statusCode).toEqual(200)
  })

  it('Should return orders', async () => {
    const res = await supertest(app)
      .get('/api/v1.0/orders/')
      .set({
        authorization:
          "Bearer "+ authToken,
      })
      .send()
    expect(res.statusCode).toEqual(200)
  })

  it('Should return orders by payment', async () => {
    const res = await supertest(app)
      .get('/api/v1.0/orders/pagamento/credit-card')
      .set({
        authorization:
          "Bearer "+ authToken,
      })
      .send()
    expect(res.statusCode).toEqual(200)
  })
})

var orderId;

describe('POST Orders', () => {
  it('Should create order', async () => {
    const res = await supertest(app)
      .post('/api/v1.0/orders/')
      .set({
        authorization:
          "Bearer "+ authToken,
      })
      .send({
        userId:"626ef7f8ecce8191d98b45fc",
        totalPrice: 30,
        qrcode:"",
        payment:"credit-card",
        scheduling:"2022-03-25 10:00:00",
        items: [
            {
                productId:"1",
                unitprice: 1.5,
                amount: 20
            }
        ]
    })
    expect(res.statusCode).toEqual(201)
    expect(res._body.order.totalPrice).toEqual(27)
    orderId = res._body.order._id;
  })
})

describe('PATCH Orders', () => {
  it('Should update order', async () => {
    const res = await supertest(app)
      .patch('/api/v1.0/orders/' + orderId)
      .set({
        authorization:
          "Bearer "+ authToken,
      })      
      .send({
        totalPrice: 28
    })
    expect(res.statusCode).toEqual(200)
    expect(res._body.totalPrice).toEqual(28)
  })
})

describe('DELETE Orders', () => {
  it('Should delete order', async () => {
    const res = await supertest(app)
      .delete('/api/v1.0/orders/' + orderId)
      .set({
        authorization:
          "Bearer "+ authToken,
      })
      .send()
    expect(res.statusCode).toEqual(200)
    expect(res._body.message).toEqual('O pedido foi deletado com sucesso!')
  })
})
