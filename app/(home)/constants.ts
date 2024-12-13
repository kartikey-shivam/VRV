import { DataTableFilterField } from '@/components/data-table/types'
import { Offer, OfferStatus } from '@/types/offer'

export const filterFields: DataTableFilterField<Offer>[] = [
  {
    label: 'Name',
    value: 'name',
    type: 'input',
  },
  {
    label: 'Position',
    value: 'position',
    type: 'input',
  },
  {
    label: 'Salary',
    value: 'salary',
    type: 'input',
  },
  {
    label: 'Status',
    value: 'status',
    options: Object.values(OfferStatus).map((status) => ({
      label: status,
      value: status,
    })),
    type: 'checkbox',
  },
  {
    label: 'Recruiter Signature',
    value: 'eSignByRecruiter',
    options: [
      { label: 'Signed', value: 'true' },
      { label: 'Not Signed', value: 'false' },
    ],
    type: 'checkbox',
  },
  {
    label: 'Candidate Signature',
    value: 'eSignByCandidate',
    options: [
      { label: 'Signed', value: 'true' },
      { label: 'Not Signed', value: 'false' },
    ],
    type: 'checkbox',
  },
]
