const emptyValues = [null, undefined, '', 'null', 'undefined']
export default function removeEmpty(data: any) {
  const keys = Object.keys(data)
  const result: any = keys
    .filter((key: any) => {
      if (data[key] instanceof Date) {
        return true
      }
      return !emptyValues.includes(data[key])
    })
    .reduce((prev: any, next: any) => {
      const currentKey: any = next
      let nextData: any
      if (
        typeof data[currentKey] === 'object' &&
        data[currentKey] instanceof Date === false &&
        !Array.isArray(data[currentKey])
      ) {
        nextData = removeEmpty(data[currentKey])
      } else {
        nextData = data[currentKey]
      }
      if (
        typeof data[currentKey] === 'object' &&
        Object.keys(nextData).length === 0 &&
        data[currentKey] instanceof Date === false &&
        !Array.isArray(data[currentKey])
      ) {
        return prev
      }
      prev[currentKey] = nextData
      return prev
    }, {})
  return result
}
