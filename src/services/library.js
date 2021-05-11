import requests from "./api"

export const getLibraries = async (id) => {
  const res = await requests(`/Users/${id}/Views`)
  return res
}
