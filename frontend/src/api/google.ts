import { objValidator } from "../Components/utils"

export const getMapsApi = async () => {
  return await fetch('/api/key')
  .then(res => res.json())
  .then(data => objValidator(data, "key") ? (data as {key : string}) : null)
  .catch((err: unknown) => {
    throw new Error(`Something went wrong while trying to fetch key", ${(err as Error).message})`)
  })
}