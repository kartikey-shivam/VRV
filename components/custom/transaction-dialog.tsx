"use client"

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'sonner'
import axios from 'axios'
import { CurrencyCode } from '@/types/transaction/CurrencyCode'
import { TransactionType } from '@/types/transaction/TransactionType'
import { TransactionState } from '@/types/transaction/TransactionState'
import { CountryCode } from '@/types/transaction/CountryCode'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'

// Validation Schema
const validationSchema = Yup.object().shape({
    transactionId: Yup.string().required('Transaction ID is required'),
    type: Yup.string()
        .oneOf(Object.values(TransactionType))
        .required('Transaction type is required'),
    originUserId: Yup.string().required('Origin user ID is required'),
    destinationUserId: Yup.string().required('Destination user ID is required'),
    transactionState: Yup.string()
        .oneOf(Object.values(TransactionState))
        .required('Transaction state is required'),
    originAmountDetails: Yup.object().shape({
        transactionAmount: Yup.number().required('Amount is required'),
        transactionCurrency: Yup.string()
            .oneOf(Object.values(CurrencyCode))
            .required('Currency is required'),
        country: Yup.string()
            .oneOf(Object.values(CountryCode))
            .required('Country is required'),
    }),
    destinationAmountDetails: Yup.object().shape({
        transactionAmount: Yup.number().required('Amount is required'),
        transactionCurrency: Yup.string()
            .oneOf(Object.values(CurrencyCode))
            .required('Currency is required'),
        country: Yup.string()
            .oneOf(Object.values(CountryCode))
            .required('Country is required'),
    }),
    description: Yup.string().nullable(),
    tags: Yup.array().of(
        Yup.object().shape({
            key: Yup.string().nullable(),
            value: Yup.string().nullable(),
        })
    ).nullable(),
    timestamp: Yup.date()
        .required('Timestamp is required'),
})

export function TransactionDialog({ onSuccess }: { onSuccess?: () => void }) {
    const [open, setOpen] = useState(false)

    const formik = useFormik({
        initialValues: {
            transactionId: '',
            type: TransactionType.Transfer,
            originUserId: '',
            destinationUserId: '',
            transactionState: TransactionState.Created,
            originAmountDetails: {
                transactionAmount: 0,
                transactionCurrency: CurrencyCode.Inr,
                country: CountryCode.In,
            },
            destinationAmountDetails: {
                transactionAmount: 0,
                transactionCurrency: CurrencyCode.Inr,
                country: CountryCode.In,
            },
            description: '',
            tags: [{ key: '', value: '' }],
            timestamp: new Date().toISOString().slice(0, 16),
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const submitValues = {
                    ...values,
                    tags: values.tags?.filter(tag => tag.key || tag.value) || null
                };
                const { data: { success, message } } = await axios.post(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/transaction/create`,
                    submitValues,
                    { withCredentials: true }
                )

                if (success) {
                    toast.success(message)
                    setOpen(false)
                    resetForm()
                    onSuccess?.()
                }
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Failed to create transaction')
            } finally {
                setSubmitting(false)
            }
        },
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Create Transaction</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="top-0 bg-background z-10 pb-4">
                    <DialogTitle className="mb-4">Create New Transaction</DialogTitle>
                </DialogHeader>
                <form onSubmit={formik.handleSubmit} className="grid gap-6">
                    <div className="grid gap-4">
                        <Label htmlFor="transactionId">Transaction ID</Label>
                        <Input
                            id="transactionId"
                            {...formik.getFieldProps('transactionId')}
                        />
                        {formik.touched.transactionId && formik.errors.transactionId && (
                            <div className="text-sm text-red-500">{formik.errors.transactionId}</div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Transaction Type */}
                        <div className="grid gap-4">
                            <Label htmlFor="type">Transaction Type</Label>
                            <Select
                                name="type"
                                value={formik.values.type}
                                onValueChange={(value) => formik.setFieldValue('type', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(TransactionType).map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {formik.touched.type && formik.errors.type && (
                                <div className="text-sm text-red-500">{formik.errors.type}</div>
                            )}
                        </div>

                        {/* Transaction State */}
                        <div className="grid gap-4">
                            <Label htmlFor="transactionState">Status</Label>
                            <Select
                                name="transactionState"
                                value={formik.values.transactionState}
                                onValueChange={(value) => formik.setFieldValue('transactionState', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(TransactionState).map((state) => (
                                        <SelectItem key={state} value={state}>
                                            {state}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {formik.touched.transactionState && formik.errors.transactionState && (
                                <div className="text-sm text-red-500">{formik.errors.transactionState}</div>
                            )}
                        </div>
                    </div>

                    {/* Timestamp field */}
                    <div className="grid gap-4">
                        <Label htmlFor="timestamp">Timestamp</Label>
                        <Input
                            id="timestamp"
                            type="datetime-local"
                            {...formik.getFieldProps('timestamp')}
                        />
                        {formik.touched.timestamp && formik.errors.timestamp && (
                            <div className="text-sm text-red-500">{formik.errors.timestamp}</div>
                        )}
                    </div>

                    {/* User IDs */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="grid gap-4">
                            <Label htmlFor="originUserId">Origin User ID</Label>
                            <Input
                                id="originUserId"
                                {...formik.getFieldProps('originUserId')}
                            />
                            {formik.touched.originUserId && formik.errors.originUserId && (
                                <div className="text-sm text-red-500">{formik.errors.originUserId}</div>
                            )}
                        </div>

                        <div className="grid gap-4">
                            <Label htmlFor="destinationUserId">Destination User ID</Label>
                            <Input
                                id="destinationUserId"
                                {...formik.getFieldProps('destinationUserId')}
                            />
                            {formik.touched.destinationUserId && formik.errors.destinationUserId && (
                                <div className="text-sm text-red-500">{formik.errors.destinationUserId}</div>
                            )}
                        </div>
                    </div>

                    {/* Amount Details */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Origin Amount */}
                        <div className="grid gap-4">
                            <Label>Origin Amount Details</Label>
                            <Input
                                type="number"
                                placeholder="Amount"
                                {...formik.getFieldProps('originAmountDetails.transactionAmount')}
                            />
                            <Label>Select Currency</Label>
                            <div className="space-y-4">
                                <Select
                                    value={formik.values.originAmountDetails.transactionCurrency}
                                    onValueChange={(value) =>
                                        formik.setFieldValue('originAmountDetails.transactionCurrency', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {Object.values(CurrencyCode).map((currency) => (
                                                <SelectItem key={currency} value={currency}>
                                                    {currency}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                <Label>Select Country</Label>
                                <Select
                                    value={formik.values.originAmountDetails.country}
                                    onValueChange={(value) =>
                                        formik.setFieldValue('originAmountDetails.country', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {Object.values(CountryCode).map((country) => (
                                                <SelectItem key={country} value={country}>
                                                    {country}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Destination Amount */}
                        <div className="grid gap-4">
                            <Label>Destination Amount Details</Label>
                            <Input
                                type="number"
                                placeholder="Amount"
                                {...formik.getFieldProps('destinationAmountDetails.transactionAmount')}
                            />
                            <Label>Select Currency</Label>
                            <div className="space-y-4">
                                <Select
                                    value={formik.values.destinationAmountDetails.transactionCurrency}
                                    onValueChange={(value) =>
                                        formik.setFieldValue('destinationAmountDetails.transactionCurrency', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {Object.values(CurrencyCode).map((currency) => (
                                                <SelectItem key={currency} value={currency}>
                                                    {currency}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                <Label>Select Country</Label>
                                <Select
                                    value={formik.values.destinationAmountDetails.country}
                                    onValueChange={(value) =>
                                        formik.setFieldValue('destinationAmountDetails.country', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {Object.values(CountryCode).map((country) => (
                                                <SelectItem key={country} value={country}>
                                                    {country}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="grid gap-4">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            {...formik.getFieldProps('description')}
                        />
                    </div>

                    {/* Tags */}
                    <div className="grid gap-4">
                        <Label>Tags</Label>
                        {formik.values.tags.map((_, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    placeholder="Key"
                                    {...formik.getFieldProps(`tags.${index}.key`)}
                                />
                                <Input
                                    placeholder="Value"
                                    {...formik.getFieldProps(`tags.${index}.value`)}
                                />
                                {index > 0 && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => {
                                            const newTags = [...formik.values.tags]
                                            newTags.splice(index, 1)
                                            formik.setFieldValue('tags', newTags)
                                        }}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                formik.setFieldValue('tags', [
                                    ...formik.values.tags,
                                    { key: '', value: '' }
                                ])
                            }}
                        >
                            Add Tag
                        </Button>
                    </div>

                    <Button
                        type="submit"
                        disabled={formik.isSubmitting}
                        className="mt-4"
                    >
                        {formik.isSubmitting ? 'Creating...' : 'Create Transaction'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
