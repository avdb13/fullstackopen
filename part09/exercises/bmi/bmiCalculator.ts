interface Bmi {
  mass: number,
  height: number,
}

interface Category {
  range: Array<number>,
  description: string
}

const categories: Array<Category> = [
  {range: [0,16.0], description: "Undermass (Severe thinness)"},
  {range: [16.0, 17.0], description: "Undermass (Moderate thinness)"},
  {range: [17.0, 18.5], description: "Undermass (Mild thinness)"},
  {range: [18.5, 25.0], description: "Normal range"},
  {range: [25.0, 30.0], description: "Overmass (Pre-obese)"},
  {range: [30.0, 35.0], description: "Obese (Class I)"},
  {range: [35.0, 40.0], description: "Obese (Class II)"},
  {range: [40.0, Infinity], description: "Obese (Class III)"},
]

const usage = <const>'usage: bmi [mass] [height]'
const parseArgs = (args: Array<string>): Bmi => {
  if (args.length != 4) throw new Error(usage)

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      mass: Number(args[2]),
      // in cm
      height: Number(args[3]),
    }
  } else {
    throw new Error(usage)
  }
}

const calculator = (mass: number, height: number) => mass/Math.pow(height/100, 2)

try {
  const { mass, height } = parseArgs(process.argv)
  const bmi = calculator(mass, height)
  console.log(bmi)

  console.log(categories.find(c => c.range[0] < bmi && bmi < c.range[1])?.description)
} catch(e: unknown) {
  if (e instanceof Error) {
    console.error(e.message)
  }
}
