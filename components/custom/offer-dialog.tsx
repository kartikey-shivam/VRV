'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { OfferStatus } from '@/types/offer'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const formSchema = z.object({
  name: z.string().min(1, 'Offer name is required'),
  candidate: z.object({
    email: z.string().email('Invalid email'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().optional(),
  }),
  position: z.string().min(1, 'Position is required'),
  salary: z.string().min(1, 'Salary is required'),
  status: z.nativeEnum(OfferStatus),
})

type FormData = z.infer<typeof formSchema>

interface OfferDialogProps {
  onSuccess?: () => void
}

export function OfferDialog({ onSuccess }: OfferDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/offer`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      toast.success('Offer created successfully')
      setOpen(false)
      reset()
      onSuccess?.()
    } catch (error) {
      console.error('Error creating offer:', error)
      toast.error('Failed to create offer')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Offer</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Create New Offer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Offer Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input id="position" {...register('position')} />
            {errors.position && <p className="text-sm text-red-500">{errors.position.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="candidate.email">Candidate Email</Label>
            <Input id="candidate.email" type="email" {...register('candidate.email')} />
            {errors.candidate?.email && <p className="text-sm text-red-500">{errors.candidate.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">Salary</Label>
            <Input id="salary" {...register('salary')} />
            {errors.salary && <p className="text-sm text-red-500">{errors.salary.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="candidate.firstName">Candidate First Name</Label>
            <Input id="candidate.firstName" {...register('candidate.firstName')} />
            {errors.candidate?.firstName && <p className="text-sm text-red-500">{errors.candidate.firstName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="candidate.lastName">Candidate Last Name</Label>
            <Input id="candidate.lastName" {...register('candidate.lastName')} />
            {errors.candidate?.lastName && <p className="text-sm text-red-500">{errors.candidate.lastName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={(value) => register('status').onChange({ target: { value } })}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(OfferStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
          </div>

          <DialogFooter className="col-span-2 sm:justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Offer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
