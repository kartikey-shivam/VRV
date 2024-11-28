import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Register | VRV',
  description: 'Login to access your account',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 