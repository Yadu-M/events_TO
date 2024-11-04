import { objValidator } from "../Components/utils"

export const getEventsIcons = async () => {
  return await fetch('api/image/get')
    .then(res => res.json())
    .then(data => objValidator(data, ["alt_text", "id", "thumbNail_url", "url"]) ? (data as {key : string}) : null)
    .catch((err: unknown) => {
      throw new Error(`Something went wrong while trying to fetch key", ${(err as Error).message})`)
    })
}