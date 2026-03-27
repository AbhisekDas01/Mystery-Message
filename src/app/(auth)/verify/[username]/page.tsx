'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { RefreshCwIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';


import { REGEXP_ONLY_DIGITS } from 'input-otp';

import { useState } from 'react';

const page = () => {

    const router = useRouter();
    const params = useParams<{ username: string }>();
    const [isResending, setIsResending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    })

    const resendOTP = async () => {
        setIsResending(true);
        try {
            
            const response = await axios.get(`/api/resend-code?username=${params.username}`);

            toast.success("Success" , {
                description: response.data.message
            });

        } catch (error) {
            console.error("Error resending OTP : ", error);

            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message;

            toast.error("Failed to resend code", {
                description: errorMessage || "An unexpected error occurred",
            });
        } finally {
            setIsResending(false);
        }
    }

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsVerifying(true);
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            });

            toast.success("Success", {
                description: response.data.message
            });

            router.replace(`/sign-in`);

        } catch (error) {
            console.error("Error in verify : ", error);

            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message

            toast.error("Verification failed", {
                description: errorMessage,
            })
        } finally {
            setIsVerifying(false);
        }
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className='text-center'>
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Verify Your Account</h1>
                    <p className='mb-4'>Enter the verification code sent to your email</p>
                </div>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name='code'
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className='px-7'>
                                    <div className='flex items-center justify-between'>
                                        <FieldLabel htmlFor="form-otp">
                                            Verification code
                                        </FieldLabel>
                                        <Button 
                                            variant="outline" 
                                            size="xs" 
                                            onClick={resendOTP}
                                            disabled={isResending}
                                            type="button"
                                        >
                                            <RefreshCwIcon className={isResending ? "animate-spin" : ""} />
                                            {isResending ? "Resending..." : "Resend Code"}
                                        </Button>
                                    </div>

                                    <div className="flex justify-center w-full mt-2">
                                        <InputOTP maxLength={6} id="form-otp" required pattern={REGEXP_ONLY_DIGITS} {...field}>
                                            <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-10 *:data-[slot=input-otp-slot]:text-xl sm:*:data-[slot=input-otp-slot]:w-12">
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator className="mx-2" />
                                            <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-10 *:data-[slot=input-otp-slot]:text-xl sm:*:data-[slot=input-otp-slot]:w-12">
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>


                            )}
                        />

                        <Field className='px-7'>
                            <Button type='submit' className='py-5 cursor-pointer' disabled={isVerifying}>
                                {isVerifying ? (
                                    <>
                                        <RefreshCwIcon className='mr-2 h-4 w-4 animate-spin' />
                                        Verifying...
                                    </>
                                ) : (
                                    "Verify Account"
                                )}
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </div>
        </div>
    )
}

export default page