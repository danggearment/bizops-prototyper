import { BaseUrl } from "@gearment/utils"

const viteBaseUrl = import.meta.env.VITE_BASE_URL
export const baseUrl = new BaseUrl({ baseUrl: viteBaseUrl })
