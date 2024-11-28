'use client'

import React from 'react'

import Authentication from '@/components/login'
export default async function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Authentication />
    </div>
  )
}
