const request = require("supertest");
const express = require("express");
const passport = require("../../src/middlewares/auth");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(passport.initialize());

app.get(
  "/petani",
  passport.authenticate("jwt-petani", { session: false }),
  (req, res) => {
    res.status(200).send("Petani Authorized");
  }
);

app.get(
  "/pembeli",
  passport.authenticate("jwt-pembeli", { session: false }),
  (req, res) => {
    res.status(200).send("Pembeli Authorized");
  }
);

describe("Auth Middleware", () => {
  it("should block access without token for petani", async () => {
    const res = await request(app).get("/petani");
    expect(res.statusCode).toEqual(401);
  });

  it("should allow access with valid token for petani", async () => {
    const validToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzIxMjcyODgyLCJleHAiOjE3MjEyNzY0ODJ9.NoDiMij4OB_hM4li_zu1RB4sngzg9EgwSsXcBqouibk";
    const res = await request(app)
      .get("/petani")
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe("Petani Authorized");
  });

  it("should block access without token for pembeli", async () => {
    const res = await request(app).get("/pembeli");
    expect(res.statusCode).toEqual(401);
  });

  it("should allow access with valid token for pembeli", async () => {
    const validToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzIxMjcyODQxLCJleHAiOjE3MjEyNzY0NDF9.EWapSyzkIwqpF2h0qYzvG-VM9XHgywZbXjS1zayZrzo";
    const res = await request(app)
      .get("/pembeli")
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe("Pembeli Authorized");
  });

  it("should handle case when no petani found", async () => {
    const tokenWithNoPetani = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzIxMTExMzY0LCJleHAiOjE3MjExMTQ5NjR9.HsVxrhMbGngN1G5NAPsGPMa2rbHPrwrPgnQZtWUx6BI1"; // Use a valid token but with id that doesn't exist in petani table
    const res = await request(app)
      .get("/petani")
      .set("Authorization", `Bearer ${tokenWithNoPetani}`);
    expect(res.statusCode).toEqual(401);
  });

  it("should handle case when no pembeli found", async () => {
    const tokenWithNoPembeli = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzIxMTExMzg4LCJleHAiOjE3MjExMTQ5ODh9.fBB_SCvaQRBlzvKBQ2oy-GuLCiGYM1Ndcn0_tPpxf6A1"; // Use a valid token but with id that doesn't exist in pembeli table
    const res = await request(app)
      .get("/pembeli")
      .set("Authorization", `Bearer ${tokenWithNoPembeli}`);
    expect(res.statusCode).toEqual(401);
  });
});
