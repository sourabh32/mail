import { Mail } from '@/components/component/mail'
import { Button } from '@/components/ui/button'
import React from 'react'

const page = () => {
  return ( <section className="w-full py-12 md:py-24  lg:py-32 border-b">
    <div className="container px-4 md:px-6 space-y-6 text-center">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
          Effortless Email Classification
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          Streamline your inbox with our powerful email classifier. Easily sort and organize your emails for maximum
          productivity.
        </p>
      </div>
      <Button className="inline-flex h-10 items-center justify-center rounded-md px-6 text-sm font-medium">
        Get Started
      </Button>
    </div>
  </section>)
}

export default page