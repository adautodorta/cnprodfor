"use client"

import * as React from "react"
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type User = {
  id: string
  name: string
  email: string
  role: "USER" | "ADMIN"
}

export function UsersTable() {
  const [users, setUsers] = React.useState<User[]>([])
  const [editedRoles, setEditedRoles] = React.useState<Record<string, "USER" | "ADMIN">>({})
  const [loading, setLoading] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    setLoading(true);
    fetch("/api/users")
      .then(res => res.json())
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = (id: string, newRole: "USER" | "ADMIN") => {
    setEditedRoles(prev => ({ ...prev, [id]: newRole }))
  }

  const handleSave = async () => {
    setSaving(true)
    const updates = Object.entries(editedRoles)
    for (const [id, role] of updates) {
      await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role }),
      })
    }
    setUsers(users =>
      users.map(u =>
        editedRoles[u.id] ? { ...u, role: editedRoles[u.id] } : u
      )
    )
    setEditedRoles({})
    setSaving(false)
  }

  const columns: ColumnDef<User>[] = [
    { accessorKey: "name", header: "Nome" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <div className="flex">
          <Select
            value={editedRoles[row.original.id] ?? row.original.role}
            onValueChange={value => handleRoleChange(row.original.id, value as "USER" | "ADMIN")}
          >
            <SelectTrigger className="min-w-[90px] max-w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USER">USER</SelectItem>
              <SelectItem value="ADMIN">ADMIN</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ),
    }
  ]

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="w-full max-w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Usuários</h2>
        <Button
          onClick={handleSave}
          disabled={Object.keys(editedRoles).length === 0 || saving}
        >
          {saving ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
      <div className="overflow-x-auto w-full">
        <Table className="min-w-[400px] w-full">
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <TableRow key={idx}>
                  {columns.map((col, i) => (
                    <TableCell key={i}>
                      <div className="h-4 w-full bg-muted animate-pulse rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}