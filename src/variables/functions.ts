export function checkField(field) {
  return field !== null && field !== '';
}

export function convertDatetime(datetime_mysql: string) {
  let d = new Date((datetime_mysql.substring(0, 16)) + 'Z');
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} à ${d.getHours()}:${d.getMinutes()}`;
}
