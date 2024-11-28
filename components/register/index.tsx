'use client'
import axios from 'axios'
import { useFormik } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as Yup from 'yup'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Define validation schema
const registerSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
})

export default function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      setIsLoading(true)
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/register`,
          {
            email: values.email,
            password: values.password,
            firstName: values.firstName,
            lastName: values.lastName,
          },
          {
            withCredentials: true,
          }
        )

        if (response.data) {
          toast.success(response.data.message || 'Registration successful')
          router.push('/login')
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Registration failed. Please try again.')
      } finally {
        setIsLoading(false)
      }
    },
  })

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>Enter your details below to create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" type="text" placeholder="Enter your first name" {...formik.getFieldProps('firstName')} disabled={isLoading} />
            {formik.touched.firstName && formik.errors.firstName && <div className="text-sm text-red-500">{formik.errors.firstName}</div>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" type="text" placeholder="Enter your last name" {...formik.getFieldProps('lastName')} disabled={isLoading} />
            {formik.touched.lastName && formik.errors.lastName && <div className="text-sm text-red-500">{formik.errors.lastName}</div>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email address" {...formik.getFieldProps('email')} disabled={isLoading} />
            {formik.touched.email && formik.errors.email && <div className="text-sm text-red-500">{formik.errors.email}</div>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Create a password" {...formik.getFieldProps('password')} disabled={isLoading} />
            {formik.touched.password && formik.errors.password && <div className="text-sm text-red-500">{formik.errors.password}</div>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" placeholder="Confirm your password" {...formik.getFieldProps('confirmPassword')} disabled={isLoading} />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && <div className="text-sm text-red-500">{formik.errors.confirmPassword}</div>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>

          <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/login?fallbackUrl=${process.env.NEXT_PUBLIC_APP_URL}`}>
            <Button variant="outline" className="w-full" disabled={isLoading}>
              Register with Google
            </Button>
          </Link>

          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
