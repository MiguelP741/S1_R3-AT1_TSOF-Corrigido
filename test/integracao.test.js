import app from "../src/app.js";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MontadoraFactory } from "./factories/MontadoraFactory.js";
import { clearDatabase } from "./utils/clearDatabase.js";
import axios from "axios";
import { ClienteFactory } from "./factories/ClienteFactory.js";
import { VeiculoFactory } from "./factories/VeiculoFactory.js";

vi.mock("axios");

describe("API de Montadoras", () => {
  beforeEach(async () => {
    await MontadoraFactory.create("Toyota", "Japão");

    vi.clearAllMocks();
  });

  afterEach(async () => {
    // Limpar o banco de dados após cada teste
    await clearDatabase();

    vi.resetAllMocks();
  });

  it("Deve criar uma nova montadora (POST)", async () => {
    const response = await request(app)
      .post("/montadoras")
      .send({ nome: "Hyundai", pais: "Coreia do Sul" });

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("insertId");
  });

  it("Deve buscar montadoras no banco de dados (GET)", async () => {
    const response = await request(app).get("/montadoras");

    expect(response.status).toBe(200);
  });

  it("Deve atualizar uma montadora (PUT)", async () => {
    const montadora = await MontadoraFactory.create("Koenigsegg", "Finlandia");
    const response = await request(app)
      .put(`/montadoras?id=${montadora.id}`)
      .send({ nome: "Koenigsegg", pais: "Suécia" });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("insertId");
  });

  it("Deve deletar uma montadora (DELETE)", async () => {
    const montadora = await MontadoraFactory.create("Volkswagen", "Alemanha");
    const response = await request(app).delete(`/montadoras/${montadora.id}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("insertId");
  });
});

describe("API de Veículos", () => {
  beforeEach(async () => {
    await MontadoraFactory.create("Honda", "Japão");
    await ClienteFactory.create("John Doe", "12345678901", "12345678", "Rua A", "Bairro B", "Cidade C", "SP", "123", "Apto 1");

    vi.clearAllMocks();
  });

  afterEach(async () => {
    // Limpar o banco de dados após cada teste
    await clearDatabase();

    vi.resetAllMocks();
  });

  it("Deve criar um novo veículo (POST)", async () => {
    const cliente =await ClienteFactory.create("John Doe", "12345678901", "12345678", "Rua A", "Bairro B", "Cidade C", "SP", "123", "Apto 1");
    const montadora = await MontadoraFactory.create("Honda", "Japão");
    const response = await request(app)
      .post("/veiculos")
      .send({ modelo: "Civic Type R", placa: "ABC1234", ano: 2023, cor: "Branco", valor: 400000, idCliente: `${cliente.id}`, idMontadora: `${montadora.id}` });

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("insertId");
  });

  it("Deve buscar veículos no banco de dados (GET)", async () => {
    const response = await request(app).get("/veiculos");

    expect(response.status).toBe(200);
  });

  it("Deve atualizar um veículo (PUT)", async () => {
    const cliente =await ClienteFactory.create("John Doe", "12345678901", "12345678", "Rua A", "Bairro B", "Cidade C", "SP", "123", "Apto 1");
    const montadora = await MontadoraFactory.create("Honda", "Japão");
    const veiculo = await VeiculoFactory.create("Prelude", "ABC1234", 2000, "Branco", 40000, `${cliente.id}`, `${montadora.id}`);
    const response = await request(app)
      .put(`/veiculos?id=${veiculo.id}`)
      .send({ 
        modelo: "Civic", 
        placa: "ABC1234", 
        ano: 2017, 
        cor: "Branco", 
        valor: 100000, 
        idCliente: cliente.id, 
        idMontadora: montadora.id 
      });

      console.log(response.body);
      

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("insertId");
  });

  it("Deve deletar um veículo (DELETE)", async () => {
    const cliente =await ClienteFactory.create("John Doe", "12345678901", "12345678", "Rua A", "Bairro B", "Cidade C", "SP", "123", "Apto 1");
    const montadora = await MontadoraFactory.create("Honda", "Japão");
    const veiculo = await VeiculoFactory.create("Prelude", "ABC1234", 2000, "Branco", 40000, `${cliente.id}`, `${montadora.id}`);
    const response = await request(app).delete(`/veiculos/${veiculo.id}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("insertId");
  });
});

describe("API de Clientes", () => {
  afterEach(async () => {
    // Limpar o banco de dados após cada teste
    await clearDatabase();

    vi.resetAllMocks();
  });

  it("Deve criar um novo cliente (POST)", async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: {
        cep: "01001-000",
        logradouro: "Praça da Sé",
        complemento: "lado ímpar",
        unidade: "",
        bairro: "Sé",
        localidade: "São Paulo",
        uf: "SP",
        estado: "São Paulo",
        regiao: "Sudeste",
        ibge: "3550308",
        gia: "1004",
        ddd: "11",
        siafi: "7107",
      },
    });

    const response = await request(app).post("/clientes").send({
      nome: "John Doe",
      cpf: "12345678901",
      cep: "12345678",
      numero: "123",
      complemento: "lado direito"
    });
    expect(response.status).toBe(201);
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  it("Deve buscar veículos no banco de dados (GET)", async () => {
    const response = await request(app).get("/clientes");

    expect(response.status).toBe(200);
  });

  it("Deve atualizar um cliente (PUT)", async () => {
    const cliente =await ClienteFactory.create("John Doe", "12345678901", "12345678", "Rua A", "Bairro B", "Cidade C", "SP", "123", "Apto 1");

    vi.mocked(axios.get).mockResolvedValue({
      data: {
        cep: "01001-000",
        logradouro: "Praça da Sé",
        complemento: "lado ímpar",
        unidade: "",
        bairro: "Sé",
        localidade: "São Paulo",
        uf: "SP",
        estado: "São Paulo",
        regiao: "Sudeste",
        ibge: "3550308",
        gia: "1004",
        ddd: "11",
        siafi: "7107",
      },
    });

    const response = await request(app).put(`/clientes?id=${cliente.id}`).send({
      nome: "Jane Doe",
      cpf: "12345678901",
      cep: "01001-000",
      numero: "321",
      complemento: "lado direito"
    });
    expect(response.status).toBe(200);
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  it("Deve deletar um cliente (DELETE)", async () => {
    const cliente =await ClienteFactory.create("John Doe", "12345678901", "12345678", "Rua A", "Bairro B", "Cidade C", "SP", "123", "Apto 1");
    const response = await request(app).delete(`/clientes/${cliente.id}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("insertId");
  });

});
