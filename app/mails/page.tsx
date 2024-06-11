"use client"
import { getEmails } from '@/actions/mail'
import { classifyMail } from '@/actions/openai'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { authOptions } from '@/lib/auth'
import { clasifyMerge } from '@/lib/helper'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { getServerSession } from 'next-auth'
import React, { useEffect,useState } from 'react'

const page = () => {
   const [mails,setMails] = useState<any>([])
   const [timeline,setTimeline] = useState("mont")
   const [loading,setLoading] = useState(false)
   const fetchEmails = async () => {
    setLoading(true);
   
    try {

      const res = await getEmails("10");
  
      setMails(res);
      // toast("fetched emails...")
    } catch (err) {
      // setError('Failed to fetch emails');
      // toast('Failed to fetch emails')
    } finally {
      setLoading(false);
    }
  };
   useEffect(()=>{
 fetchEmails()
   },[timeline])

   const handleClassify = async () => {
  
    try {
      setLoading(true);
      
      if(mails ==null )  return;
      const newMails = mails.map((email:any) => email.subject);
      const response = await classifyMail(newMails);
      
      
      const res = clasifyMerge(mails, JSON.parse(response));
      console.log(res)
      setMails(res);
      // toast("emails! classified")
    } catch (error) {
      console.error("Error classifying emails:", error);
      // toast("Failed to classify check api key")
    } finally {
      setLoading(false);
    }
  };


   
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 flex-1">
        
    <div className="container px-4 md:px-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Your Emails</h2>
          <p className="text-gray-500 dark:text-gray-400">View and classify your emails.</p>
        </div>
        <Button onClick={handleClassify} className="inline-flex h-10 items-center justify-center rounded-md px-6 text-sm font-medium">
          {loading ? 'Loading...' :'Classify mails..'}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="gap-1 rounded-xl px-3 h-10 data-[state=open]:bg-neutral-100 text-lg"
              variant="outline"
            >
              Last 30 days
              <ChevronDownIcon className="w-4 h-4 text-neutral-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Last 7 days</DropdownMenuItem>
            <DropdownMenuItem>Last 30 days</DropdownMenuItem>
            <DropdownMenuItem>Last 60 days</DropdownMenuItem>
            <DropdownMenuItem>Last 90 days</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>


      {
        loading ? (<>loading</>) : null
      }
      <div className="grid gap-4">

        {
          mails.length>0 &&  mails.map((email,index)=>(





            <Drawer>
            <DrawerTrigger className="font-bold">
            <div className="grid grid-cols-[40px_1fr_100px] items-center gap-4 bg-gray-100 dark:bg-gray-800 rounded-md p-4">
          {/* <Avatar className="h-8 w-8">
            <AvatarImage alt="John Doe" src="/placeholder-user.jpg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar> */}
          <div className="grid col-span-2  text-start  gap-2">
            <div className="font-medium flex gap-4">
            {email.subject}
            { email.classification && (
                        <Badge>
                          {email.classification}
                        </Badge>
                      )}
            </div>
            <div className="text-gray-500 lex dark:text-gray-400 text-sm">
            {email.from}
            </div>
          </div>
        
          <div className="text-sm text-gray-500 dark:text-gray-400 justify-self-end">{email.date}</div>
        </div>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>
                  <div className="flex-col items-start border-b text-start p-2 justify-start gap-2">
                    <div className="flex  gap-4">
                      {email.subject}
                      { email.classification && (
                        <Badge>
                          {email.classification}
                        </Badge>
                      )}
                    </div>
                    <div className="font-extralight text-sm">{email.date}</div>
                  </div>
                </DrawerTitle>
                <DrawerDescription>
                  <div style={{ overflowY: "scroll", maxHeight: "400px" }}>
                    <div dangerouslySetInnerHTML={{ __html: email.emailBody }}></div>
                  </div>
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <DrawerClose>
                  <Button variant="outline">Close viewer</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
               
            ))
        }
        </div>
          

      <div className="flex justify-end">
        
      </div>
    </div>
  </section>
  )
}

export default page