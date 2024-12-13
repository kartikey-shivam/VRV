'use client'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Check, PlusCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Table } from '@tanstack/react-table'
import type { DataTableFilterField } from './types'
import { z } from 'zod'
import { OfferStatus } from '@/types/offer'

interface DataTableFilterCommandProps<TData> {
  table: Table<TData>
  filterFields: DataTableFilterField<TData>[]
  schema: z.ZodType<any, any>
}

export function DataTableFilterCommand<TData>({ table, filterFields, schema }: DataTableFilterCommandProps<TData>) {
  const [open, setOpen] = useState(false)
  const [selectedField, setSelectedField] = useState<DataTableFilterField<TData>>()
  const [filterValue, setFilterValue] = useState<string>('')

  useEffect(() => {
    if (!open) {
      setSelectedField(undefined)
      setFilterValue('')
    }
  }, [open])

  const filters = {
    name: 'Offer Name',
    recruiter: 'Recruiter',
    candidate: 'Candidate',
    position: 'Position',
    status: Object.values(OfferStatus),
    eSignByRecruiter: ['Yes', 'No'],
    eSignByCandidate: ['Yes', 'No'],
    createdAt: 'date',
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search field..." />
          <CommandList>
            <CommandEmpty>No fields found.</CommandEmpty>
            <CommandGroup>
              {filterFields.map((field) => (
                <CommandItem
                  key={String(field.value)}
                  onSelect={() => {
                    setSelectedField(field)
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', selectedField?.value === field.value ? 'opacity-100' : 'opacity-0')} />
                  {field.label}
                </CommandItem>
              ))}
            </CommandGroup>
            {selectedField && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  {selectedField.type === 'checkbox' && selectedField.options
                    ? selectedField.options.map((option) => (
                        <CommandItem
                          key={String(option.value)}
                          onSelect={() => {
                            const columnFilterValue = table.getColumn(String(selectedField.value))?.getFilterValue()
                            const values = Array.isArray(columnFilterValue) ? columnFilterValue : []
                            const newValues = values.includes(option.value) ? values.filter((value) => value !== option.value) : [...values, option.value]
                            table.getColumn(String(selectedField.value))?.setFilterValue(newValues.length ? newValues : undefined)
                            setOpen(false)
                          }}
                        >
                          <Check className={cn('mr-2 h-4 w-4', Array.isArray(table.getColumn(String(selectedField.value))?.getFilterValue()) && (table.getColumn(String(selectedField.value))?.getFilterValue() as string[])?.includes(option.value) ? 'opacity-100' : 'opacity-0')} />
                          {option.label}
                        </CommandItem>
                      ))
                    : null}
                  {selectedField.type === 'input' && (
                    <div className="p-2">
                      <input
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            table.getColumn(String(selectedField.value))?.setFilterValue(filterValue)
                            setOpen(false)
                          }
                        }}
                        placeholder="Enter value..."
                      />
                    </div>
                  )}
                  {selectedField.type === 'timerange' && (
                    <div className="p-2">
                      <input
                        type="date"
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        onChange={(e) => {
                          table.getColumn(String(selectedField.value))?.setFilterValue(e.target.value)
                          setOpen(false)
                        }}
                      />
                    </div>
                  )}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
