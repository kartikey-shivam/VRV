'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/custom/table'
import { DataTableFilterCommand } from '@/components/data-table/data-table-filter-command'
import { DataTableFilterControls } from '@/components/data-table/data-table-filter-controls'
import { DataTablePagination } from '@/components/data-table/data-table-pagination'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import type { DataTableFilterField } from '@/components/data-table/types'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
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
import { TransactionDialog } from '@/components/custom/transaction-dialog'
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
  navigator.clipboard.writeText(text).catch(console.error);
};

const getValueForCopy = (value: any): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if ('value' in value) {
      return String(value.value);
    }
    return JSON.stringify(value);
  }
  return String(value);
};

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

export function DataTable<TData, TValue>({ columns, data, metadata, isLoading = false, defaultColumnFilters = [], filterFields = [], onPaginationChange, onFilterChange, onSortingChange, pagination, setPagination, columnFilters, setColumnFilters, sorting, setSorting, fetchData }: DataTableProps<TData, TValue>) {

  const [columnVisibility, setColumnVisibility] = useLocalStorage<VisibilityState>('data-table-visibility', {})
  const [controlsOpen, setControlsOpen] = useLocalStorage('data-table-controls', true)
  const [_, setSearch] = useQueryStates(searchParamsParser)
  const [isCronLoading, setIsCronLoading] = React.useState(false)
  const [cronStatus, setCronStatus] = React.useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = React.useState(false)
  const [isDownloadingCSV, setIsDownloadingCSV] = React.useState(false)

  const table = useReactTable({
    data,
    columns,
    pageCount: metadata.totalPages,
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


  React.useEffect(() => {
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

  React.useEffect(() => {
    const fetchCronStatus = async () => {
      try {
        setIsCronLoading(true)
        const { data: { success, message, data } } = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/transaction/cron/status`,
          { withCredentials: true }
        )
        if (success) {
          setCronStatus(data.status)
        }
      } catch (error) {
        console.error('Error fetching cron status:', error)
      } finally {
        setIsCronLoading(false)
      }
    }

    fetchCronStatus()
  }, [])
  const downloadCSV = async () => {
    try {
      setIsDownloadingCSV(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/transaction/download-csv`, {
        method: 'POST',
        credentials: 'include'
      })
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'transactions.csv'
      a.click()
      toast.success('CSV Downloaded')
    } catch (error) {
      toast.error('Failed to download CSV')
      console.error('Failed to download CSV:', error)
    } finally {
      setIsDownloadingCSV(false)
    }
  }

  const generateReport = async () => {
    try {
      setIsGeneratingReport(true)
      const { data: { success, message } } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/transaction/report/get`,
        { withCredentials: true }
      )
      if (success) toast.success(message)
    } catch (error) {
      toast.error('Failed to generate report')
      console.error('Failed to generate report:', error)
    } finally {
      setIsGeneratingReport(false)
    }
  }

  const toggleCronJob = async () => {
    setIsCronLoading(true)
    try {
      const { data: { success, message, data } } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/transaction/cron/toggle`,
        {},
        { withCredentials: true }
      )
      if (success) {
        toast.success(message)
        setCronStatus(data.status)
      }
    } catch (error) {
      toast.error('Failed to toggle cron job')
      console.error('Error toggling cron job:', error)
    } finally {
      setIsCronLoading(false)
    }
  }

  const refreshData = () => {
    fetchData()
  }

  return (
    <div className="flex w-full h-full flex-col gap-3 sm:flex-row">
      <div className={cn('w-full p-1 sm:min-w-52 sm:max-w-52 sm:self-start md:min-w-64 md:max-w-64', !controlsOpen && 'hidden')}>
        <div className="-m-1 h-full p-1">
          <DataTableFilterControls table={table} columns={columns} filterFields={filterFields} />
        </div>
      </div>
      <div className="flex max-w-full flex-1 flex-col gap-4 overflow-hidden p-1">
        <DataTableFilterCommand table={table} schema={columnFilterSchema} filterFields={filterFields} />
        <DataTableToolbar table={table} controlsOpen={controlsOpen} setControlsOpen={setControlsOpen} />
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={generateReport} disabled={isGeneratingReport}>
              {isGeneratingReport ? "Generating..." : "Generate Report"}
            </Button>
            <Button variant="outline" onClick={downloadCSV} disabled={isDownloadingCSV}>
              {isDownloadingCSV ? "Downloading..." : "Download CSV"}
            </Button>
            {/* <TransactionDialog /> */}
            <TransactionDialog onSuccess={refreshData} />
          </div>
          <div className="flex items-center gap-2 mr-4">
            <Switch id="cron-job" disabled={isCronLoading} checked={cronStatus} onClick={toggleCronJob} />
            <Label htmlFor="cron-job">Cron Job</Label>
          </div>
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
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        onClick={() => {
                          const value = cell.getValue();
                          if (value !== null && value !== undefined) {
                            const textToCopy = getValueForCopy(value);
                            copyToClipboard(textToCopy);
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
    </div>
  )
}
