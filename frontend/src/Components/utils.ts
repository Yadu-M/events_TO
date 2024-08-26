export const objValidator = (obj: unknown, ...args: string[]) => {
  if (typeof obj === "object" && obj !== null) {
    for (const arg of args) {
      if (!(arg in obj)) return false
    }
    return true
  }
  return false
}