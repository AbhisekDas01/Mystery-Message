'use client';

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { toast } from "sonner"
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios'
import { signUpSchema } from '@/schemas/signUpSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { Field, FieldError, FieldGroup, FieldLabel, FieldDescription } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signInSchema } from '@/schemas/signInSchema';
import { signIn } from 'next-auth/react';



const page = () => {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    }
  });


  const onSubmit = async (data: z.infer<typeof signInSchema>) => {

    setIsSubmitting(true);
    
    const result = await signIn('credentials' , {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })
    
    console.log(result);

    if(result?.error) {
      toast.error("Login Failed" , {
        description: "Incorrect username or password"
      })
    } 

    if(result?.url) {
      router.replace('/dashboard');
    }

    setIsSubmitting(false);
    
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign In to restart your anonymous adventure</p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FieldGroup>
            <Controller
              name='identifier'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='form-identifier'>
                    Email or Username
                  </FieldLabel>
                  <Input
                    type='text'
                    className='py-5'
                    {...field}
                    id="form-identifier"
                    aria-invalid={fieldState.invalid}
                    placeholder='Email/Username'
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name='password'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='form-password'>
                    Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      className='py-5 pr-10'
                      {...field}
                      id="form-password"
                      aria-invalid={fieldState.invalid}
                      placeholder='password'
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none "
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Field>
              <Button type='submit' disabled={isSubmitting} className='py-5'>
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Please wait
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </Field>
          </FieldGroup>

        </form>
        <div className="text-center mt-4">
          <p className='text-xs text-gray-700'>Don't have an account?{' '}
            <Link href={'/sign-up'} className='text-blue-400 hover:text-blue-800'>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page