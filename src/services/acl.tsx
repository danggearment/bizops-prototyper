import { PureAbility, defineAbility } from "@casl/ability"

export enum Actions {
  Create = "c",
  Read = "r",
  Update = "u",
  Delete = "d",
}

export enum Subjects {
  Dashboard = "Dashboard",
  Catalog = "Catalog",
  Product = "Product",
  Order = "Order",
  Store = "Store",
  Billing = "Billing",
  User = "User",
  Studio = "Studio",
}

export type AppAbility = PureAbility<[string, string]>

export const AllSubjects = Object.keys(Subjects).map(
  (key) => Subjects[key as keyof typeof Subjects],
)
export const AllActions = Object.keys(Actions).map(
  (key) => Actions[key as keyof typeof Actions],
)
const ability = defineAbility((_, cannot) => {
  cannot(AllActions, AllSubjects)
})

export default ability
