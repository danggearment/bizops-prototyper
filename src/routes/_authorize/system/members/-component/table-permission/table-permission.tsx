import { CheckboxField, DataTable, useTable } from "@gearment/ui3"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useEffect, useState } from "react"

interface Permission {
  permissionId: string
  permissionName: string
}

interface PermissionGroup {
  groupId: string
  groupName: string
  permissions: Permission[]
}

interface User {
  userId: string
  username: string
  permissions: Permission[]
}

const fetchPermissionGroups = (): Promise<PermissionGroup[]> => {
  return new Promise((resolve) => {
    resolve([
      {
        groupId: "group1",
        groupName: "Role",
        permissions: [
          { permissionId: "1011", permissionName: "View Role" },
          { permissionId: "1012", permissionName: "Search Role" },
          { permissionId: "1013", permissionName: "Create Role" },
          { permissionId: "1014", permissionName: "Edit Role" },
          { permissionId: "1015", permissionName: "Delete Role" },
        ],
      },
      {
        groupId: "group2",
        groupName: "Staff",
        permissions: [
          { permissionId: "1021", permissionName: "View Staff" },
          { permissionId: "1022", permissionName: "Search Staff" },
          { permissionId: "1023", permissionName: "Invite New Staff" },
          { permissionId: "1024", permissionName: "Edit Staff Account" },
          { permissionId: "1025", permissionName: "Delete Staff" },
        ],
      },
      {
        groupId: "group3",
        groupName: "Seller's Profile",
        permissions: [
          { permissionId: "1031", permissionName: "View Seller's Profile" },
          { permissionId: "1032", permissionName: "Search Seller's Profile" },
          { permissionId: "1033", permissionName: "Edit Seller's Profile" },
          { permissionId: "1034", permissionName: "Block/Unblock Seller" },
        ],
      },
      {
        groupId: "group4",
        groupName: "Team",
        permissions: [
          { permissionId: "1041", permissionName: "View Team" },
          { permissionId: "1042", permissionName: "Search Team" },
          { permissionId: "1043", permissionName: "Create Team" },
          { permissionId: "1044", permissionName: "Edit Team" },
          { permissionId: "1045", permissionName: "Block/Unblock Team" },
          {
            permissionId: "1046",
            permissionName: "Transfer Team for Other Sellers",
          },
        ],
      },
      {
        groupId: "group5",
        groupName: "Tier",
        permissions: [
          { permissionId: "1051", permissionName: "View Tier" },
          { permissionId: "1052", permissionName: "Update Pricing" },
          { permissionId: "1053", permissionName: "Assign Tier for Team" },
        ],
      },
      {
        groupId: "group6",
        groupName: "Log",
        permissions: [
          { permissionId: "1061", permissionName: "View Log" },
          { permissionId: "1062", permissionName: "Search Log" },
        ],
      },
      {
        groupId: "group7",
        groupName: "Order",
        permissions: [
          { permissionId: "1071", permissionName: "View Order" },
          { permissionId: "1072", permissionName: "Search Order" },
          { permissionId: "1073", permissionName: "Edit Sale Order" },
          { permissionId: "1074", permissionName: "Buy Shipping Label" },
          { permissionId: "1075", permissionName: "Remove Shipping Label" },
          { permissionId: "1076", permissionName: "Cancel Order" },
          { permissionId: "1077", permissionName: "On-hold Order" },
          { permissionId: "1078", permissionName: "Refund Order" },
          { permissionId: "1079", permissionName: "Duplicate Order" },
          { permissionId: "1080", permissionName: "Replace Order" },
          { permissionId: "1081", permissionName: "Export Order" },
        ],
      },
      {
        groupId: "group8",
        groupName: "Ticket",
        permissions: [
          { permissionId: "1082", permissionName: "View Ticket" },
          { permissionId: "1083", permissionName: "Search Ticket" },
          { permissionId: "1084", permissionName: "Create Ticket" },
          { permissionId: "1085", permissionName: "Edit Ticket" },
          { permissionId: "1086", permissionName: "Export Ticket" },
        ],
      },
      {
        groupId: "group9",
        groupName: "Product",
        permissions: [
          { permissionId: "1091", permissionName: "View Product" },
          { permissionId: "1092", permissionName: "Search Product" },
          { permissionId: "1093", permissionName: "Create Product" },
          { permissionId: "1094", permissionName: "Edit Product" },
          { permissionId: "1095", permissionName: "Export Product" },
          { permissionId: "1096", permissionName: "Import Product" },
        ],
      },
      {
        groupId: "group10",
        groupName: "Category",
        permissions: [
          { permissionId: "1101", permissionName: "View Category" },
          { permissionId: "1102", permissionName: "Create Category" },
          { permissionId: "1103", permissionName: "Edit Category" },
        ],
      },
      {
        groupId: "group11",
        groupName: "Email",
        permissions: [
          { permissionId: "1111", permissionName: "View Email" },
          { permissionId: "1112", permissionName: "Search Email" },
          { permissionId: "1113", permissionName: "Compose Email" },
        ],
      },
      {
        groupId: "group12",
        groupName: "Email Template",
        permissions: [
          { permissionId: "1121", permissionName: "View Email Template" },
          { permissionId: "1122", permissionName: "Search Email Template" },
          { permissionId: "1123", permissionName: "Create Email Template" },
          { permissionId: "1124", permissionName: "Edit Email Template" },
        ],
      },
      {
        groupId: "group13",
        groupName: "General Settings",
        permissions: [
          { permissionId: "1131", permissionName: "View General Settings" },
          { permissionId: "1132", permissionName: "Create General Settings" },
          { permissionId: "1133", permissionName: "Edit General Settings" },
        ],
      },
    ])
  })
}

const fetchUsers = async (): Promise<User[]> => {
  const permissionGroups = await fetchPermissionGroups()

  const allPermissions = permissionGroups.flatMap((group) => group.permissions)

  return new Promise((resolve) => {
    resolve([
      {
        userId: "1",
        username: "minhnh",
        permissions: allPermissions,
      },
    ])
  })
}

export default function TablePermission() {
  const [users, setUsers] = useState<User[]>([])
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>(
    [],
  )

  useEffect(() => {
    async function fetchData() {
      const [fetchedUsers, fetchedPermissionGroups] = await Promise.all([
        fetchUsers(),
        fetchPermissionGroups(),
      ])
      setUsers(fetchedUsers)
      setPermissionGroups(fetchedPermissionGroups)
    }

    fetchData()
  }, [])

  const columnHelper = createColumnHelper<User>()

  const columns: ColumnDef<User, any>[] = [
    columnHelper.accessor("username", {
      header: () => (
        <span className={"text-center whitespace-nowrap pr-4"}>User name</span>
      ),
      cell: (info) => <span className={"text-center"}>{info.getValue()}</span>,
    }),
    ...permissionGroups.map((group) =>
      columnHelper.group({
        id: group.groupId,
        header: () => <span className="text-center">{group.groupName}</span>,
        columns: group.permissions.map((permission) =>
          columnHelper.accessor(
            (user) => {
              const userPermission = user.permissions.find(
                (p) => p.permissionId === permission.permissionId,
              )
              return userPermission ? true : false
            },
            {
              id: permission.permissionId,
              header: () => (
                <span className="text-center whitespace-nowrap p-8">
                  {permission.permissionName}
                </span>
              ),
              cell: () => (
                <div className="flex justify-center">
                  <CheckboxField />
                </div>
              ),
            },
          ),
        ),
      }),
    ),
  ]

  const table = useTable({
    columns,
    data: users,
  })

  return (
    <>
      <DataTable table={table} theaderClassName="border  text-center" />
    </>
  )
}
