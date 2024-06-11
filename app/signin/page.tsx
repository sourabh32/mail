"use client"
import { Button } from '@/components/ui/button'

import React from 'react'
import { SunIcon } from '@radix-ui/react-icons'

import Image from 'next/image'
import { signIn } from 'next-auth/react'
const page = () => {
  return (
    <div className="grid md:grid-cols-2 min-h-screen w-full">
    <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="max-w-md w-full space-y-6 px-4 sm:px-6 md:px-8">
        <div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            To{" "}
            see your classified mails
            
          </p>
        </div>
        
        <Button variant="outline" onClick={async () => {
                    await signIn("google",{callbackUrl:"/mails"});
                    
                }} className="w-full">
          <SunIcon className="mr-2 h-5 w-5" />
          Sign in with Google
        </Button>
      </div>
    </div>
    <div className="hidden md:block">
      <Image src={"./next.svg"} width={400} height={400} alt="Sign in" className="h-full w-full object-cover" />
    </div>
  </div>
  )
}

export default page