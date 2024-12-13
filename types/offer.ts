import { Schema } from 'mongoose'

export enum OfferStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  // Add other status values as needed
}

export interface Offer {
  _id: string
  name: string
  recruiter: {
    firstName: string
    lastName: string
    email: string
  }
  candidate: {
    firstName: string
    lastName: string
    email: string
  }
  position: string
  salary: string
  status: OfferStatus
  eSignByRecruiter: boolean
  eSignByCandidate: boolean
  createdAt?: Date
  updatedAt?: Date
}
