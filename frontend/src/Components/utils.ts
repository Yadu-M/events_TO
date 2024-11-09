export const objValidator = (obj: unknown, args: string[]) => {
  if (typeof obj === "object" && obj !== null) {
    for (const arg of args) {
      if (!(arg in obj)) throw Error()
    }
    return
  }
  throw Error()
}