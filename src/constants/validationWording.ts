export default {
  invalid: (name: string) => `${name} tidak valid`,
  minLength: (min: number) => `password minimal ${min} karakter`,
  minArrLength: (name: string, min: number) =>
    `[wording.inputMinimum] ${min} ${name}`,
  positive: (name: string) => `${name} harus angka positif`,
  required: (name: string) => `${name} tidak boleh kosong`,
  notFound: (name: string) => `${name} tidak ditemukan`,
  incorrect: (name: string) => `${name} salah`,
  duplicate: (name: string, value: string) =>
    `${name} ${value} sudah dipakai`,
  oneOf: (name: string, ...args: Array<string | number>) =>
    `${name} salah satu dari ${args.map((v) => `'${v}'`).join(', ')}`,
}
