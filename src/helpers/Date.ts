import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const TZ_ID = { locale: id } // Timezone Indonesia

const formatDate = (date: Date | number | string) => {
  return format(new Date(date), 'dd-MM-yyyy', TZ_ID)
}

const formatDateLL = (date: Date | number | string) => {
  return format(new Date(date), 'dd MMMM yyyy', TZ_ID)
}

const formatDateTime = (date: Date | number | string) => {
  return format(new Date(date), 'dd-MM-yyyy HH:mm:ss', TZ_ID)
}

const formatDateTimeFull = (date: Date | number | string) => {
  return format(new Date(date), 'dd MMMM yyyy HH:mm', TZ_ID)
}

const formatDateFull = (date: Date | number | string) => {
  return format(new Date(date), 'dd MMMM yyyy', TZ_ID)
}

const formatDateSystem = (date: Date | number | string) => {
  return format(new Date(date), 'yyyy-MM-dd', TZ_ID)
}

const formatDateTimeSystem = (date: Date | number | string) => {
  return format(new Date(date), 'yyyy-MM-dd HH:mm:ss', TZ_ID)
}

const formatDateGenerateFile = (date: Date | number | string) => {
  return format(new Date(date), 'yyyyMMddHHmmss', TZ_ID)
}

const formatMonth = (date: Date | number | string) => {
  return format(new Date(date), 'MMMM', TZ_ID)
}

const formatYear = (date: Date | number | string) => {
  return format(new Date(date), 'yyyy', TZ_ID)
}

const formatTime = (date: Date | number | string) => {
  return format(new Date(date), 'HH:mm:ss', TZ_ID)
}

const isCurrentInRangeTime = (start: string, end: string) => {
  const [hourFrom, minutesFrom] = start.split(':')
  const [hourTo, minutesTo] = end.split(':')

  const below = Number(minutesFrom) + Number(hourFrom) * 60
  const upper = Number(minutesTo) + Number(hourTo) * 60

  const currentHours = new Date().getHours()
  const currentMinute = new Date().getMinutes()

  const now = currentMinute + currentHours * 60
  return now >= below && now <= upper
}

export {
  formatDate,
  formatDateSystem,
  formatDateTime,
  formatDateFull,
  formatDateTimeFull,
  formatDateTimeSystem,
  formatDateGenerateFile,
  formatMonth,
  formatYear,
  formatTime,
  isCurrentInRangeTime,
  formatDateLL,
}
