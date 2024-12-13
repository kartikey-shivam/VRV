import { ColumnDef } from '@tanstack/react-table'
import { Offer, OfferStatus } from '@/types/offer'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

export const columns: ColumnDef<Offer>[] = [
  {
    id: 'select',
    header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected()} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Offer Name',
  },
  {
    accessorKey: 'recruiter',
    header: 'Recruiter',
    cell: ({ row }) => {
      const recruiter = row.original.recruiter
      return `${recruiter.firstName} ${recruiter.lastName}`
    },
  },
  {
    accessorKey: 'candidate',
    header: 'Candidate',
    cell: ({ row }) => {
      const candidate = row.original.candidate
      return `${candidate.firstName} ${candidate.lastName}`
    },
  },
  {
    accessorKey: 'position',
    header: 'Position',
  },
  {
    accessorKey: 'salary',
    header: 'Salary',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as OfferStatus
      return <Badge variant={status === OfferStatus.ACCEPTED ? 'success' : status === OfferStatus.REJECTED ? 'destructive' : 'secondary'}>{status}</Badge>
    },
  },
  {
    accessorKey: 'eSignByRecruiter',
    header: 'Recruiter Signed',
    cell: ({ row }) => (row.getValue('eSignByRecruiter') ? 'Yes' : 'No'),
  },
  {
    accessorKey: 'eSignByCandidate',
    header: 'Candidate Signed',
    cell: ({ row }) => (row.getValue('eSignByCandidate') ? 'Yes' : 'No'),
  },
]
