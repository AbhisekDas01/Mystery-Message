'use client';

import { messageSchema } from '@/schemas/messageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import React, { useState, useEffect, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { ApiResponse } from '@/types/ApiResponse';

import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter , usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

const page = () => {

  const router = useRouter();
  const pathname = usePathname();

  const [sendingMessage, setSendingMessage] = useState(false);
  const params = useParams();
  const username = params.username as string;
  const [newUsername , setNewUsername] = useState(username);


  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema)
  })

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setSendingMessage(true);

    try {

      const response = await axios.post<ApiResponse>(`/api/send-message`, {
        username,
        content: data.content
      });

      toast("Success", {
        description: response.data.message
      })

    } catch (error) {

      console.error("Error in sigbup : ", error);

      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message

      toast.error("Error Sending message", {
        description: errorMessage,
      })


    } finally {
      setSendingMessage(false);
    }
  }





  return (
    <div className='text-center p-3 min-h-screen bg-gray-100'>
      <h1 className='text-2xl md:text-4xl font-extrabold mt-5 text-center'>Public Profile URL</h1>
      <form className='flex w-full justify-center' onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name='content'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className='text-xl font-bold mt-4' htmlFor='message-field'>Send Message to 
                                      <Input
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        type='text'
                                        className='py-5 w-50 border-amber-300'
                                        value={newUsername}
                                        onKeyDown={(e) => {
                                          if(e.key === 'Enter') {
                                            router.replace(`/u/${newUsername}`)
                                          }
                                        }}

                                    /></FieldLabel>
                <FieldDescription>Enter your message below. Send anonymously!</FieldDescription>
                <Textarea
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="Type your message here." />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                <Button disabled={sendingMessage}>
                  {
                    sendingMessage ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Sending Message
                      </>

                    ) : ("Send message")
                  }

                </Button>
              </Field>
            )}
          />
        </FieldGroup>
      </form>

      <Separator className='mt-3' />
    </div>
  )
}

export default page