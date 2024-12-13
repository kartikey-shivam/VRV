'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Offer, OfferStatus } from '@/types/offer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface OfferDetailsDialogProps {
  offer: Offer | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  userRole?: string
}

export function OfferDetailsDialog({ offer, open, onOpenChange, onSuccess, userRole }: OfferDetailsDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<OfferStatus>(offer?.status || OfferStatus.PENDING)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<OfferStatus | null>(null)

  useEffect(() => {
    if (offer) {
      setStatus(offer.status)
    }
  }, [offer])

  if (!offer) return null

  const handleStatusChange = async (newStatus: string) => {
    setPendingStatus(newStatus as OfferStatus)
    setShowConfirmDialog(true)
  }

  const confirmStatusChange = async () => {
    if (!pendingStatus) return

    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      const endpoint = pendingStatus === OfferStatus.ACCEPTED ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/offer/accept/${offer._id}` : `${process.env.NEXT_PUBLIC_BASE_URL}/api/offer/reject/${offer._id}`

      await axios.post(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      setStatus(pendingStatus)
      toast.success(`Offer ${pendingStatus.toLowerCase()} successfully`)
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${pendingStatus.toLowerCase()} offer`)
    } finally {
      setIsLoading(false)
      setShowConfirmDialog(false)
      setPendingStatus(null)
    }
  }

  const handleESign = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/offer/e-sign/${offer._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      toast.success('Offer signed successfully')
      onSuccess?.()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to sign offer')
    } finally {
      setIsLoading(false)
    }
  }

  const canSign = (userRole === 'CANDIDATE' && offer.status === OfferStatus.ACCEPTED && !offer.eSignByCandidate) || (userRole === 'RECRUITER' && !offer.eSignByRecruiter)

  const isCandidate = userRole === 'CANDIDATE'

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Offer Details</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="font-medium">Name:</span>
              <span className="col-span-2">{offer.name}</span>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="font-medium">Position:</span>
              <span className="col-span-2">{offer.position}</span>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="font-medium">Salary:</span>
              <span className="col-span-2">{offer.salary}</span>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="font-medium">Status:</span>
              <span className="col-span-2">
                {isCandidate && !offer.eSignByCandidate ? (
                  <Select value={status} onValueChange={handleStatusChange} disabled={isLoading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(OfferStatus)
                        .filter((s) => s !== OfferStatus.PENDING)
                        .map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant={status === 'ACCEPTED' ? 'secondary' : status === 'REJECTED' ? 'destructive' : 'default'}>{status}</Badge>
                )}
              </span>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="font-medium">Recruiter:</span>
              <span className="col-span-2">{`${offer.recruiter.firstName} ${offer.recruiter.lastName}`}</span>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="font-medium">Candidate:</span>
              <span className="col-span-2">{`${offer.candidate.firstName} ${offer.candidate.lastName}`}</span>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="font-medium">Signatures:</span>
              <div className="col-span-2">
                <div>Recruiter: {offer.eSignByRecruiter ? '✓ Signed' : '✗ Not signed'}</div>
                <div>Candidate: {offer.eSignByCandidate ? '✓ Signed' : '✗ Not signed'}</div>
              </div>
            </div>
            {canSign && (
              <div className="col-span-2 flex justify-end">
                <Button onClick={handleESign} disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {userRole === 'RECRUITER' ? 'Sign as Recruiter' : 'Sign Offer'}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to {pendingStatus?.toLowerCase()} this offer? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isLoading} onClick={confirmStatusChange}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
