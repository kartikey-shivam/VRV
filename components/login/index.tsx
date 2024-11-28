'use client'
import axios from 'axios'
import { useFormik } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as Yup from 'yup'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { toast } from 'sonner'

// Define validation schema
const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
})

export default function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setIsLoading(true)
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`, values, {
          withCredentials: true,
        })

        if (response.data) {
          toast.success(response.data.message)
          router.push('/')
          router.refresh()
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Login failed. Please try again.')
      } finally {
        setIsLoading(false)
      }
    },
  })
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email address" {...formik.getFieldProps('email')} disabled={isLoading} />
            {formik.touched.email && formik.errors.email && <div className="text-sm text-red-500">{formik.errors.email}</div>}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input id="password" type="password" placeholder="Enter your password" {...formik.getFieldProps('password')} disabled={isLoading} />
            {formik.touched.password && formik.errors.password && <div className="text-sm text-red-500">{formik.errors.password}</div>}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
          <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/login?fallbackUrl=${process.env.NEXT_PUBLIC_APP_URL}`}>
            <Button variant="outline" className="w-full" disabled={isLoading}>
              Login with Google
            </Button>
          </Link>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
