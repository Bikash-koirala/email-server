export const truncateString = (str, num = 25) => {
    if (str.length <= num) {
      return str
    }
    return str.slice(0, num) + '...'
  }