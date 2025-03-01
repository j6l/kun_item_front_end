export function objectToQueryString(obj: { [key: string]: string | number }): string {
  const queryParams: string[] = []
  // 遍历对象的键值对
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // 将键和值用 = 连接，并添加到数组中
      queryParams.push(`${key}=${obj[key]}`)
    }
  }
  console.log(queryParams)
  // 将数组元素用 & 连接成字符串
  return queryParams.join('&')
}
