enum HEADER_KEY {
  "x-team-id" = "x-team-id",
  "X-Timezone" = "X-Timezone",
}

export class Header {
  data: {
    [key: string]: string
  } = {}
  headerKeys = HEADER_KEY

  constructor() {}
  get(headerKey: HEADER_KEY) {
    return this.data[headerKey]
  }

  remove(headerKey: HEADER_KEY) {
    delete this.data[headerKey]
  }

  add(headerKey: HEADER_KEY, value: string) {
    this.data[headerKey] = value
  }
}

export const header = new Header()
