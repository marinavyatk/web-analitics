export const format = (date: Date) => {
  const day = date.getUTCDate().toString().padStart(2, '0')
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')

  const year = date.getUTCFullYear()

  return `${year}-${month}-${day}`
}

export const getCurrentMonthDates = () => {
  const now = new Date()
  const currentYear = now.getUTCFullYear()
  const currentMonth = now.getUTCMonth()

  const startOfMonth = new Date(currentYear, currentMonth, 1)

  const endOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const endDate = now < endOfMonth ? now : endOfMonth

  return {
    start: format(startOfMonth),
    end: format(endDate),
  }
}

export const perPage = 100
export const limit = 100
export const emptyField = 'Не указано'
