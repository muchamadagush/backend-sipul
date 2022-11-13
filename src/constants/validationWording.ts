export default {
  invalid: (name: string) => `${name} [wording.invalid]`,
  minLength: (min: number) => `[wording.minPassword] ${min} [wording.number]`,
  minArrLength: (name: string, min: number) =>
    `[wording.inputMinimum] ${min} ${name}`,
  positive: (name: string) => `${name} [wording.positiveNumber]`,
  required: (name: string) => `${name} [wording.notEmpty]`,
  notFound: (name: string) => `${name} [wording.notFound]`,
  incorrect: (name: string) => `${name} [wording.wrong]`,
  duplicate: (name: string, value: string) =>
    `${name} ${value} [wording.alreadyTaken]`,
  oneOf: (name: string, ...args: Array<string | number>) =>
    `${name} [wording.oneOf] ${args.map((v) => `'${v}'`).join(', ')}`,
}
