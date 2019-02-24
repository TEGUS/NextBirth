export function checkField(field) {
  return field !== null && field !== '';
}

export function convertDatetimeToDateAndTime(datetime_mysql: string) {
  let d = new Date((datetime_mysql.substring(0, 16)) + 'Z');
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} à ${d.getHours()}:${d.getMinutes()}`;
}

export function convertDatetimeToDate(datetime_mysql: string) {
  let d = new Date((datetime_mysql.substring(0, 16)) + 'Z');
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}


export function formatDate(date: string) {
  if (date === null) {
    return null;
  } else {
    const d = new Date((`${date}`).substring(0, 16) + 'Z');
    return {
      day: formatNumberOfDate(d.getDate()),
      month: formatNumberOfDate(d.getMonth() + 1),
      year: d.getFullYear(),
      date: d
    };
  }
}

export function getDate(date: string): Date {
  return new Date(('' + date).substring(0, 16) + 'Z')
}

export function formatNumberOfDate(val) {
  val = Number(val);
  return (val < 10) ? `0${val}` : val;
}

/**
 * DateStart + NB Jours
 * @param dateStart
 * @param nbJour
 */
export function getCurrentDateWith(dateStart: Date, nbJour: number): Date {
  return new Date((dateStart.getTime()) + (nbJour * 24 * 60 * 60 * 1000))
}

/**
 * DateStart - NB Jours
 * @param dateStart
 * @param nbJour
 */
export function getCurrentDateWithout(dateStart: Date, nbJour: number): Date {
  return new Date((dateStart.getTime()) + (nbJour * 24 * 60 * 60 * 1000))
}
