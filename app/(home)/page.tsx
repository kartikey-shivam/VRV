'use client'

import React, { useEffect, useState } from 'react'
import { Skeleton } from './skeleton'
import { columns } from './columns'
import { filterFields } from './constants'
import { DataTable } from './data-table'
import type { PaginationState, ColumnFiltersState, SortingState } from '@tanstack/react-table'
import { Offer } from '@/types/offer'
import axios from 'axios'

interface ApiResponse {
  data: {
    offers: Offer[]
    metadata: {
      totalDocs: number
      limit: number
      page: number
      totalPages: number
      nextPage: number | null
      prevPage: number | null
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }
}

export default function OffersPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const [data, setData] = useState<Offer[]>([])
  const [metadata, setMetadata] = useState<ApiResponse['data']['metadata']>({
    totalDocs: 0,
    limit: 10,
    page: 1,
    totalPages: 1,
    nextPage: null,
    prevPage: null,
    hasNextPage: false,
    hasPrevPage: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const search = searchParams
  let token: any
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token')
  }

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      fetchData()
    }, 300)

    return () => clearTimeout(debounceTimeout)
  }, [pagination, columnFilters, sorting])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      const queryParams = {
        page: (pagination.pageIndex + 1).toString(),
        limit: pagination.pageSize.toString(),
        ...convertFiltersToParams(columnFilters),
        ...convertSortingToParams(sorting),
      }

      // Get user role and ID first
      const { data: userData } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const role = userData.data.user.role
      const userId = userData.data.user._id
      let endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/offer`

      // Set endpoint based on role and include user ID
      if (role === 'RECRUITER') {
        endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/offer`
      } else if (role === 'CANDIDATE') {
        endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/offer`
      }

      const { data: result } = await axios.get<ApiResponse>(endpoint, {
        params: queryParams,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      setData(result.data.offers)
      setMetadata(result.data.metadata)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <React.Suspense fallback={<Skeleton />}>
      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        columns={columns}
        data={data}
        metadata={metadata}
        isLoading={isLoading}
        // @ts-ignore
        filterFields={filterFields}
        defaultColumnFilters={Object.entries(search)
          .map(([key, value]) => ({
            id: key,
            value,
          }))
          .filter(({ value }) => value ?? undefined)}
        onPaginationChange={(newPagination) => {
          setPagination(newPagination)
        }}
        onFilterChange={(filters) => {
          setColumnFilters(filters)
          // Reset to first page when filters change
          setPagination((prev) => ({ ...prev, pageIndex: 0 }))
        }}
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        fetchData={fetchData}
      />
    </React.Suspense>
  )
}

function convertFiltersToParams(filters: ColumnFiltersState) {
  const params: Record<string, string> = {}
  filters.forEach((filter) => {
    if (filter.value) {
      params[filter.id] = filter.value as string
    }
  })
  return params
}

function convertSortingToParams(sorting: SortingState) {
  if (!sorting.length) return {}

  // Map the column ID to the actual field name if needed
  const sortFieldMap: Record<string, string> = {
    originAmountDetails: 'originAmount',
    destinationAmountDetails: 'destinationAmount',
    // Add other field mappings as needed
  }

  const sortField = sortFieldMap[sorting[0].id] || sorting[0].id
  return {
    sortBy: sortField,
    sortOrder: sorting[0].desc ? 'desc' : 'asc',
  }
}
