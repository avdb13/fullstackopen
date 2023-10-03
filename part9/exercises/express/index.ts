import express, { Request, Response } from "express";
import { calculator } from "./bmiCalculator";
import { exerciseCalculator } from "./exerciseCalculator";

const app = express();

app.get("/hello", (_req: Request, resp: Response) => {
  resp.send("Hello Full Stack!");
});

app.get("/bmi", express.json(), (req: Request, resp: Response) => {
  const weight = req.query.weight;
  const height = req.query.height;
  if (!isNaN(Number(weight)) && !isNaN(Number(height))) {
    const result = calculator(Number(weight), Number(height));
    resp.json({ weight: Number(weight), height: Number(height), result });
  } else {
    resp.send({ error: "weight and height must be numbers" });
  }
});

app.post("/exercises", express.json(), (req: Request, resp: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (req.body.daily_exercises && req.body.target) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { daily_exercises, target } = req.body;

    if (
      daily_exercises instanceof Array &&
      !daily_exercises.map((n) => Number(n)).includes(NaN) &&
      !isNaN(Number(target))
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const result = exerciseCalculator(daily_exercises, target);
      resp.json(result);
    } else {
      resp.send({
        error: "daily_exercises must be array and target must be number",
      });
    }
  } else {
    resp.send({
      error: "usage: { daily_exercises: [Array<number>], target: number }",
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
