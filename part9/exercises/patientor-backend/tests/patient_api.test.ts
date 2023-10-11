import supertest from "supertest";
import { v1 as uuid } from "uuid";
import patients from "../src/data/patients";
import { app } from "../src/index";
import { EntryWithoutId, NewPatient, Patient } from "../src/types";

const api = supertest(app);


test("showing patients works", async () => {
  const resp = await api
    .get("/api/patients")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(resp.text).toEqual(JSON.stringify(patients.map(p => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {ssn, ...rest} = p;
    return rest
  })));
})

test("adding patients works", async () => {
  const newPatient: NewPatient = {
    name: "John Smith",
    dateOfBirth: "01-01-2001",
    ssn: "048-13-9362",
    gender: "Male",
    occupation: "pimp",
  };

  const resp = await api
    .post("/api/patients")
    .send(newPatient)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {id, ...expected} = JSON.parse(resp.text) as Patient;
  expect(expected).toEqual({...newPatient, entries: []});
})

describe("correct entries work like expected", () => {
  test("adding hospital entry", async () => {
    const hospitalEntry: EntryWithoutId = {
      date: '2018-12-25',
      type: 'Hospital',
      specialist: 'Espresso House',
      diagnosisCodes: ['F43.2'],
      description:
        "Healing time appr. 4 weeks. patient is schizophrenic.",
      discharge: {
        date: '2015-01-16',
        criteria: 'Thumb has healed.',
      }
    };

    const patient = patients[Math.floor(Math.random()*patients.length)];

    const resp = await api.post(`/api/patients/${patient.id}/entries`).send(hospitalEntry)

    expect(JSON.parse(resp.text) as Patient).toEqual(patient);
  })

  test("adding occupational healthcare entry with sickleave", async () => {
    const occupationalHealthcareEntry: EntryWithoutId = {
      date: '2010-10-10',
      type: 'OccupationalHealthcare',
      specialist: 'Espresso House',
      employerName: 'Gloogloo',
      diagnosisCodes: ["S62.5"],
      description:
        'Patient mistakenly found himself in a nuclear plant during vlog.',
      sickLeave: {
        startDate: '2023-08-05',
        endDate: '2023-08-28',
      }
    };

    const patient = patients[Math.floor(Math.random()*patients.length)];

    const resp = await api.post(`/api/patients/${patient.id}/entries`).send(occupationalHealthcareEntry)

    expect(JSON.parse(resp.text) as Patient).toEqual(patient);
  })

  test("adding occupational healthcare entry without sickleave", async () => {
    const occupationalHealthcareEntry: EntryWithoutId = {
      date: '2010-10-10',
      type: 'OccupationalHealthcare',
      specialist: 'Espresso House',
      employerName: 'Gloogloo',
      diagnosisCodes: ["S62.5"],
      description:
        'Patient mistakenly found himself in a nuclear plant during vlog.',
    };

    const patient = patients[Math.floor(Math.random()*patients.length)];

    const resp = await api.post(`/api/patients/${patient.id}/entries`).send(occupationalHealthcareEntry)

    expect(JSON.parse(resp.text) as Patient).toEqual(patient);
  })

  test("adding healthcheck entry", async () => {
    const healthCheckEntry: EntryWithoutId = {
      date: '1999-10-20',
      specialist: 'Espresso House',
      type: 'HealthCheck',
      description: 'Yearly control visit. Cholesterol levels too high. Stop eating junk food fatty.',
      healthCheckRating: 2,
    };


    const patient = patients[Math.floor(Math.random()*patients.length)];

    const resp = await api.post(`/api/patients/${patient.id}/entries`).send(healthCheckEntry)
    console.log(resp.text)

    expect(JSON.parse(resp.text) as Patient).toEqual(patient);
  })
})

describe("incorrect entries are rejected", () => {
  test("entry with wrong patient id", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    const random = uuid();

    const emptyEntry = {};

    const resp = await api.post(`/api/patients/${random}/entries`).send(emptyEntry)

    expect(resp.status).toEqual(404);
  })

  test("adding occupational healthcare entry with unknown diagnosis code", async () => {
    const occupationalHealthcareEntry: EntryWithoutId = {
      date: '2010-10-10',
      type: 'OccupationalHealthcare',
      specialist: 'Espresso House',
      employerName: 'Gloogloo',
      diagnosisCodes: ["S62.0"],
      description:
        'Patient mistakenly found himself in a nuclear plant during vlog.',
      sickLeave: {
        startDate: '2023-08-05',
        endDate: '2023-08-28',
      }
    };

    const patient = patients[Math.floor(Math.random()*patients.length)];

    const resp = await api.post(`/api/patients/${patient.id}/entries`).send(occupationalHealthcareEntry).expect(400)

    expect(resp.text).toEqual("incorrect or missing diagnosis codes");
  })

  test("adding healthcheck entry with unknown healthcheck rating", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const healthCheckEntry: any = {
      date: '1999-10-20',
      specialist: 'Espresso House',
      type: 'HealthCheck',
      description: 'Yearly control visit. Cholesterol levels too high. Stop eating junk food fatty.',
      healthCheckRating: 5,
    };

    const patient = patients[Math.floor(Math.random()*patients.length)];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const resp = await api.post(`/api/patients/${patient.id}/entries`).send(healthCheckEntry).expect(400)

    expect(resp.text).toEqual("incorrect healthcheck entry");
  })

  test("adding hopsital entry with wrong discharge date", async () => {
    const hospitalEntry: EntryWithoutId = {
      date: '2018-12-25',
      type: 'Hospital',
      specialist: 'Espresso House',
      diagnosisCodes: ['F43.2'],
      description:
        "Healing time appr. 4 weeks. patient is schizophrenic.",
      discharge: {
        date: '2015-01-163',
        criteria: 'Thumb has healed.',
      }
    };

    const patient = patients[Math.floor(Math.random()*patients.length)];

    const resp = await api.post(`/api/patients/${patient.id}/entries`).send(hospitalEntry).expect(400)

    expect(resp.text).toEqual("incorrect or missing date");
  })
})
