// 'use client'

// import type { Table } from '@tanstack/react-table'
// import type { DataTableInputFilterField } from './types'
// import { InputWithAddons } from '@/components/custom/input-with-addons'
// import { Label } from '@/components/ui/label'
// import { Search } from 'lucide-react'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import * as React from 'react'

// type DataTableFilterInputProps<TData> = DataTableInputFilterField<TData> & {
//   table: Table<TData>
// }

// export function DataTableFilterInput<TData>({ table, value: _value }: DataTableFilterInputProps<TData>) {
//   const value = _value as string
//   const column = table.getColumn(value)
//   const filterValue = column?.getFilterValue()
//   console.log('asdf', value, column, filterValue)
//   const filters = typeof filterValue === 'string' ? filterValue : ''
//   const [operator, setOperator] = React.useState('lte')

//   return (
//     <div className="grid w-full gap-1.5">
//       <Label htmlFor={value} className="sr-only px-2 text-muted-foreground">
//         {value}
//       </Label>
//       <div className="flex gap-2">
//         <Select value={operator} onValueChange={setOperator}>
//           <SelectTrigger className="w-[130px]">
//             <SelectValue placeholder="Select operator" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="lte">Less than or equal</SelectItem>
//             <SelectItem value="gte">Greater than or equal</SelectItem>
//             <SelectItem value="equal">Equal</SelectItem>
//             <SelectItem value="notequal">Not Equal</SelectItem>
//           </SelectContent>
//         </Select>
//         <InputWithAddons
//           placeholder="Search"
//           leading={<Search className="mt-0.5 h-4 w-4" />}
//           containerClassName="h-9 rounded-lg flex-1"
//           name={value}
//           id={value}
//           value={filters}
//           onChange={(e) => {
//             const val = e.target.value
//             const newValue = val.trim() === '' ? null : val
//             console.log(operator,value, 'operator')
//             column?.setFilterValue(JSON.stringify({ operator, value: newValue }))
//           }}
//         />
//       </div>
//     </div>
//   )
// }
'use client'

import type { Table } from '@tanstack/react-table'
import type { DataTableInputFilterField } from './types'
import { InputWithAddons } from '@/components/custom/input-with-addons'
import { Label } from '@/components/ui/label'
import { Search } from 'lucide-react'

type DataTableFilterInputProps<TData> = DataTableInputFilterField<TData> & {
  table: Table<TData>
}

export function DataTableFilterInput<TData>({ table, value: _value }: DataTableFilterInputProps<TData>) {
  const value = _value as string
  const column = table.getColumn(value)
  const filterValue = column?.getFilterValue()

  const filters = typeof filterValue === 'string' ? filterValue : ''

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor={value} className="sr-only px-2 text-muted-foreground">
        {value}
      </Label>
      <InputWithAddons
        placeholder="Search"
        leading={<Search className="mt-0.5 h-4 w-4" />}
        containerClassName="h-9 rounded-lg"
        name={value}
        id={value}
        value={filters}
        onChange={(e) => {
          const val = e.target.value
          const newValue = val.trim() === '' ? null : val
          column?.setFilterValue(newValue)
        }}
      />
    </div>
  )
}
