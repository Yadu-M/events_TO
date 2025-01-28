export const generateImageURL = async (
  eventId: number,
  imageT: "image" | "icon"
) => {
  try {
    const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/image/${eventId}/${imageT}`);
    if (!resp.ok) throw Error();

    const blob = await resp.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    return null;
  }
};
