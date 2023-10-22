interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const usage = <const>"usage: exercises [hours]";

export const exerciseCalculator = (total: Array<number>, target: number): Result => {
  const average = total.reduce((acc, next) => (acc += next)) / total.length;
  const [rating, ratingDescription] =
    target < average
      ? [3, "excellent!"]
      : target - average < 1
      ? [2, "not too bad but could be better"]
      : [1, "pathetic"];

  return {
    periodLength: total.length,
    trainingDays: total.filter((n) => n !== 0).length,
    success: average > target,
    rating,
    ratingDescription,
    target,
    average,
  }
}

const parseArgs = (args: Array<string>) => {
  if (args.length != 4) throw new Error(usage);

  const arr = args[2]
    .substring(1, args[2].length-1)
    .split(", ")
    .map((n) => Number(n));

  if (!arr.includes(NaN) && !isNaN(Number(args[3]))) {
    return { total: arr, hours: Number(args[3]) }
  } else {
    throw new Error(usage);
  }
}

if (2 < process.argv.length) {
  try {
    const { total, hours } = parseArgs(process.argv)
    const result = exerciseCalculator(total, hours)
    console.log(result)
  } catch(e: unknown) {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}

