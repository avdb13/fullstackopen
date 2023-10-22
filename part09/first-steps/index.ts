interface MultiplyValues {
  op: Operation;
  left: number;
  right: number;
}


const operations = <const>["multiply", "add", "divide", undefined]
type Operation = typeof operations[number];

const parseArgs = (args: string[]): MultiplyValues => {
  if (args.length != 5) throw new Error('invalid amount of arguments')

  if (!isNaN(Number(args[3])) && !isNaN(Number(args[4]))) {
    return {
      op: operations.find(op => op === args[2]),
      left: Number(args[3]),
      right: Number(args[4])
    }
  } else {
    throw new Error('usage: [operation] [number] [number]')
  }
}

const calculator = (a: number, b: number, op: Operation): number => {
  switch (op) {
    case "multiply":
      return a * b;
    case "add":
      return a + b;
    case "divide":
      if (b === 0) throw new Error('can\'t divide by zero!')
      return a / b;
    default:
      throw new Error('unknown operation')
  }
};

try {
  const { left, right, op } = parseArgs(process.argv)
  const result = calculator(left, right, op)
  console.log(result)
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error(error.message)
  }
  console.error(error)
}

