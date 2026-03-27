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
import { Field, FieldError, FieldGroup, FieldLabel , FieldDescription } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';



const page = () => {

    const [username, setUsername] = useState("");
    const [usernameMessage, setUsernameMessage] = useState<{message: string, success: boolean} | null>(null);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const debounce = useDebouncedCallback((value) => { setUsername(value) }, 500);
    const router = useRouter();

    //zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        }
    });

    useEffect(() => {

        const checkUsernameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true);
                setUsernameMessage(null);

                try {

                    const response = await axios.get(`/api/check-username-unique?username=${username}`);
                    console.log("Check username : ", response);

                    setUsernameMessage({
                        message: response.data.message,
                        success: response.data.success ?? true
                    });

                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage({
                        message: axiosError.response?.data.message ?? "Error checking username",
                        success: false
                    });
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        }
        checkUsernameUnique();

    }, [username]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);

        try {

            const response = await axios.post<ApiResponse>('/api/sign-up', data);

            toast("Success", {
                description: response.data.message
            });
            router.replace(`/verify/${username}`);

        } catch (error) {

            console.error("Error in sigbup : ", error);

            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message

            toast("Signup failed", {
                description: errorMessage,
            })

        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">

            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Mystery Message
                    </h1>
                    <p className="mb-4">Sign up to start your anonymous adventure</p>
                </div>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    <FieldGroup>
                        <Controller
                            name="username"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-username">
                                        Username
                                    </FieldLabel>
                                    <div className="relative">

                                        <Input
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                debounce(e.target.value);
                                            }}
                                            className='py-5 pr-10'
                                            id="form-username"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Enter Username"
                                        />

                                        {isCheckingUsername && <Loader2 className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin' />}

                                    </div>

                                    {usernameMessage && (
                                        <p className={`text-sm ${usernameMessage.success ? 'text-green-500' : 'text-red-500'}`}>
                                            {usernameMessage.message}
                                        </p>
                                    )}

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name='email'
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor='form-email'>
                                        Email
                                    </FieldLabel>
                                    <Input
                                        type='email'
                                        className='py-5'
                                        {...field}
                                        id="form-email"
                                        aria-invalid={fieldState.invalid}
                                        placeholder='Email'
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
                                    'Sign Up'
                                )}
                            </Button>
                        </Field>
                    </FieldGroup>

                </form>
                <div className="text-center mt-4">
                    <p className='text-xs text-gray-700'>Already a member?{' '}
                        <Link href={'/sign-in'} className='text-blue-400 hover:text-blue-800'>
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default page