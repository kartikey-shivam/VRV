"use client'"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/custom/table'
import { DataTablePagination } from '@/components/data-table/data-table-pagination'
import type { DataTableFilterField } from '@/components/data-table/types'
import { Button } from '@/components/ui/button'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { cn } from '@/lib/utils'
import type { ColumnDef, ColumnFiltersState, PaginationState, SortingState, Table as TTable, VisibilityState } from '@tanstack/react-table'
import { flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { useQueryStates } from 'nuqs'
import * as React from 'react'
import { columnFilterSchema } from './schema'
import { searchParamsParser } from './search-params'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import axios from 'axios'
import { OfferDialog } from '@/components/custom/offer-dialog'
import { NextResponse } from 'next/server'
import { OfferStatus } from '@/types/offer'
import { OfferDetailsDialog } from '@/components/custom/offer-details-dialog'
import { Offer } from '@/types/offer'

interface Metadata {
  totalDocs: number
  limit: number
  page: number
  totalPages: number
  nextPage: number | null
  prevPage: number | null
  hasNextPage: boolean
  hasPrevPage: boolean
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).catch(console.error)
}

const getValueForCopy = (value: any): string => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return value.join(', ')
    }
    if ('value' in value) {
      return String(value.value)
    }
    return JSON.stringify(value)
  }
  return String(value)
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  metadata: Metadata
  isLoading?: boolean
  defaultColumnFilters?: ColumnFiltersState
  filterFields?: DataTableFilterField<TData>[]
  onPaginationChange?: (pagination: PaginationState) => void
  onFilterChange?: (filters: ColumnFiltersState) => void
  onSortingChange?: (sorting: SortingState) => void
  pagination: PaginationState
  setPagination: (pagination: PaginationState) => void
  columnFilters: ColumnFiltersState
  setColumnFilters: (filters: ColumnFiltersState) => void
  sorting: SortingState
  setSorting: (sorting: SortingState) => void
  fetchData: () => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  // metadata,
  isLoading = false,
  defaultColumnFilters = [],
  filterFields = [],
  onPaginationChange,
  onFilterChange,
  onSortingChange,
  pagination,
  setPagination,
  columnFilters,
  setColumnFilters,
  sorting,
  setSorting,
  fetchData,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = useLocalStorage<VisibilityState>('data-table-visibility', {})
  const [controlsOpen, setControlsOpen] = useLocalStorage('data-table-controls', true)
  const [_, setSearch] = useQueryStates(searchParamsParser)
  const [role, setRole] = React.useState('')
  let token: any
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token')
  }
  const [selectedOffer, setSelectedOffer] = React.useState<Offer | null>(null)
  const [detailsOpen, setDetailsOpen] = React.useState(false)
  const table = useReactTable({
    data,
    columns,
    // pageCount: metadata.totalPages,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    state: { columnFilters, sorting, columnVisibility, pagination },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: (updaterOrValue) => {
      setColumnFilters(typeof updaterOrValue === 'function' ? updaterOrValue(columnFilters) : updaterOrValue)
    },
    onSortingChange: (updaterOrValue) => {
      setSorting(typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue)
    },
    onPaginationChange: (updaterOrValue) => {
      setPagination(typeof updaterOrValue === 'function' ? updaterOrValue(pagination) : updaterOrValue)
    },
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedUniqueValues: (table: TTable<TData>, columnId: string) => () => {
      const map = getFacetedUniqueValues<TData>()(table, columnId)()
      // TODO: it would be great to do it dynamically, if we recognize the row to be Array.isArray
      if (['regions', 'tags'].includes(columnId)) {
        const rowValues = table.getGlobalFacetedRowModel().flatRows.map((row) => row.getValue(columnId) as string[])
        for (const values of rowValues) {
          for (const value of values) {
            const prevValue = map.get(value) || 0
            map.set(value, prevValue + 1)
          }
        }
      }
      return map
    },
  })

  const getUserRole = async () => {
    try {
      const {
        data: {
          data: { user },
        },
      } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      console.log(user)
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 401 })
      }
      setRole(user?.role)
    } catch (error) {
      console.log(error)
    }
  }
  React.useEffect(() => {
    getUserRole()
    const columnFiltersWithNullable = filterFields.map((field) => {
      const filterValue = columnFilters.find((filter) => filter.id === field.value)
      if (!filterValue) return { id: field.value, value: null }
      return { id: field.value, value: filterValue.value }
    })

    const search = columnFiltersWithNullable.reduce((prev, curr) => {
      prev[curr.id as string] = curr.value
      return prev
    }, {} as Record<string, unknown>)

    setSearch(search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnFilters])

  const refreshData = () => {
    fetchData()
  }

  return (
    <div className="flex w-full h-full flex-col gap-3 sm:flex-row">
      <div className="flex max-w-full flex-1 flex-col gap-4 overflow-hidden p-1">
        <div className="flex justify-between">
          <div className="flex gap-2">{role === 'RECRUITER' && <OfferDialog onSuccess={refreshData} />}</div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    onClick={() => {
                      setSelectedOffer(row.original as Offer)
                      setDetailsOpen(true)
                    }}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        onClick={() => {
                          const value = cell.getValue()
                          if (value !== null && value !== undefined) {
                            const textToCopy = getValueForCopy(value)
                            copyToClipboard(textToCopy)
                          }
                        }}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} />
      </div>
      <OfferDetailsDialog offer={selectedOffer} open={detailsOpen} onOpenChange={setDetailsOpen} onSuccess={fetchData} userRole={role} />
    </div>
  )
}
