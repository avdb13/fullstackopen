import supertest from "supertest";
import { app } from "../src/index";

import initialPatients from "./helpers";
const api = supertest(app);

test("showing patients works", async () => {
  const resp = await api.get("/api/patients").expect(200).expect("Content-Type", /application\/json/)
  console.log(resp.data)
  console.log(initialPatients)
})
