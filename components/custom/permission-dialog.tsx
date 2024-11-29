"use client"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from 'react'
import { useFormik } from "formik"
import axios from "axios"
import { toast } from "sonner"
import * as Yup from 'yup'
import { Label } from "../ui/label"
import { Input } from "../ui/input"

// Validation Schema
const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
 
    description: Yup.string().nullable(),
   
})
export function PermissionDialog() {
    const [open, setOpen] = useState(false)

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const submitValues = {
                    ...values,
                };
                const { data: { success, message } } = await axios.post(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/permission/add`,
                    submitValues,
                    { withCredentials: true }
                )

                if (success) {
                    toast.success(message)
                    setOpen(false)
                    resetForm()
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
                <Button variant="outline">Add new permission</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="top-0 bg-background z-10 pb-4">
                    <DialogTitle className="mb-4">Add New Permission</DialogTitle>
                </DialogHeader>
                <form onSubmit={formik.handleSubmit} className="grid gap-6">
                    <div className="grid gap-4">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            {...formik.getFieldProps('name')}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <div className="text-sm text-red-500">{formik.errors.name}</div>
                        )}
                    </div>

                  

                  

                   
                    {/* Description */}
                    <div className="grid gap-4">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            {...formik.getFieldProps('description')}
                        />
                    </div>


                    <Button
                        type="submit"
                        disabled={formik.isSubmitting}
                        className="mt-4"
                    >
                        {formik.isSubmitting ? 'Creating...' : 'Create Permission'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
