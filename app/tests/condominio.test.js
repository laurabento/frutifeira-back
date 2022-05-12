const supertest = require("supertest");
console.log("supertest");
const app = require("../../main");
console.log("app");

describe("GET Condominium", () => {
  test("Should return users", async () => {
    const res = await supertest(app)
      .get("/api/v1.0/condominium/")
      .set({
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVtYWlsMTIzQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiZnJ1dGlmZWlyYTEyMyIsImlhdCI6MTY1MjMxODc4MX0.pcsLB-P35CsRLCTquwNPuZnF8c-a7jR-rrwwNqaHfvg",
      })
      .send();
    expect(res.statusCode).toEqual(200);
  }, 10000);
});

describe("GET Post", () => {
  test("Should return users", async () => {
    const res = await supertest(app)
      .post("/api/v1.0/condominium")
      .set({
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVtYWlsMTIzQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiZnJ1dGlmZWlyYTEyMyIsImlhdCI6MTY1MjMxODc4MX0.pcsLB-P35CsRLCTquwNPuZnF8c-a7jR-rrwwNqaHfvg",
      })
      .send({
        name: "",
        email: "",
        password: "",
        address: "",
        city: "",
        state: "",
        contact: "",
      });
    expect(res.statusCode).toEqual(200);
  }, 10000);
});

describe("GET Login", () => {
  test("Should return users", async () => {
    const res = await supertest(app).post("/api/v1.0/condominium/login").send({
      email: "email123@gmail.com",
      password: "$2a$10$ywZxpYDt.IcCudREPjTJMemxhugYF2jlIIquTQCDo7BC7R3IZRff.",
    });
    expect(res.statusCode).toEqual(200);
  }, 10000);
});

describe("GET Condominium by name", () => {
  test("Should return users", async () => {
    const res = await supertest(app)
      .get("/api/v1.0/condominium/nome/teste")
      .set({
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVtYWlsMTIzQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiZnJ1dGlmZWlyYTEyMyIsImlhdCI6MTY1MjMxODc4MX0.pcsLB-P35CsRLCTquwNPuZnF8c-a7jR-rrwwNqaHfvg",
      })
      .send();
    expect(res.statusCode).toEqual(200);
  }, 10000);
});

describe("GET Condominium by address", () => {
  test("Should return users", async () => {
    const res = await supertest(app)
      .get("/api/v1.0/condominium/endereco/Aldino")
      .set({
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVtYWlsMTIzQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiZnJ1dGlmZWlyYTEyMyIsImlhdCI6MTY1MjMxODc4MX0.pcsLB-P35CsRLCTquwNPuZnF8c-a7jR-rrwwNqaHfvg",
      })
      .send();
    expect(res.statusCode).toEqual(200);
  }, 10000);
});
