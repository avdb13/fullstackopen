interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const usage = <const>"usage: exercises [hours: 7]";

const parseArgsAndCalculate = (args: Array<string>): Result => {
  if (args.length != 4) throw new Error(usage);

  const arr = args[2]
    .substring(1, args[2].length-1)
    .split(", ")
    .map((n) => Number(n));

  if (!arr.includes(NaN) && !isNaN(Number(args[3]))) {
    const average = arr.reduce((acc, next) => (acc += next)) / arr.length;
    const [rating, ratingDescription] =
      Number(args[3]) < average
        ? [3, "excellent!"]
        : average - Number(args[3]) < 1
        ? [2, "not too bad but could be better"]
        : [1, "pathetic"];

    return {
      periodLength: arr.length,
      trainingDays: arr.filter((n) => n !== 0).length,
      success: average > Number(args[3]),
      rating,
      ratingDescription,
      target: Number(args[3]),
      average,
    };
  } else {
    throw new Error(usage);
  }
};

try {
  const result = parseArgsAndCalculate(process.argv)
  console.log(result)
} catch(e: unknown) {
  if (e instanceof Error) {
    console.error(e.message)
  }
}
