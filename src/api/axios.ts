// import { default as hookNotification } from "@/hook/notification"
// import { useAuthenticateStore } from "@/stores/authenticate"
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"

interface ErrorResponse {
  title?: string
  errors?: Record<string, any>
}

export const baseURL = import.meta.env.VITE_BASE_URL
// const notification = hookNotification()

const errorHandle = (title: string, err: React.ReactNode) =>
  console.error({
    title: title,
    message: err,
  })

const buildErrorMessages = (error: AxiosError): string => {
  let errorMessages = ""

  if (error.response) {
    const data = error.response.data as ErrorResponse
    if (data.errors) {
      for (const [key, values] of Object.entries(data.errors)) {
        errorMessages += `<h4>${key}</h4><ul class="error-list">`
        for (const value of values) {
          errorMessages += `<li>${value}</li>`
        }
        errorMessages += "</ul>"
      }
    }
  }

  return errorMessages
}

export const instance = axios.create({
  baseURL: baseURL + "/iam",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    // encoding: "json",
    // message: "%7B%7D",
  },
})

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const { data, status } = error.response!
    if (status === 401) {
      return Promise.reject(error)
    }

    switch (status) {
      case 400:
        console.error(data)
        break
      case 401:
        console.error("unauthorised")
        break

      case 404:
        console.error("/not-found")
        break

      case 500:
        console.error("/server-error")
        break
    }
    if (!status.toString().match(/^(401|[2][0-9]{2})$/)) {
      const errorMessages = buildErrorMessages(error)
      errorHandle(
        (data as ErrorResponse).title ?? "Something went wrong",
        errorMessages ?? "",
      )
    }
    return Promise.reject(error)
  },
)
const TIMEOUT = import.meta.env.VITE_TIMEOUT_NUMBER || 10000
const makeRequest = {
  get: async <T = any>(
    url: string,
    config?: AxiosRequestConfig,
    baseUrl?: string,
  ): Promise<AxiosResponse<T>> => {
    try {
      if (baseUrl) {
        instance.defaults.baseURL = baseUrl
      }
      const response: AxiosResponse<T> = await instance.get(url, {
        ...config,
        timeout: TIMEOUT,
      })
      return response
    } catch (error: any) {
      console.error(error)
      throw error
    }
  },

  post: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    baseUrl?: string,
  ): Promise<AxiosResponse<T>> => {
    try {
      if (baseUrl) {
        instance.defaults.baseURL = baseUrl
      }
      const response: AxiosResponse<T> = await instance.post(url, data, config)
      return response
    } catch (error: any) {
      console.error(error)
      throw error
    }
  },

  put: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    try {
      const response: AxiosResponse<T> = await instance.put(url, data, config)
      return response
    } catch (error: any) {
      console.error(error)
      throw error
    }
  },

  delete: async <T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    try {
      const response: AxiosResponse<T> = await instance.delete(url, config)
      return response
    } catch (error: any) {
      console.error(error)
      throw error
    }
  },
}

export default makeRequest
