import { resend } from "@/lib/resend";
import VerificationEmail from "../../email/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Verify Your Account",
            react: VerificationEmail({username , otp: verifyCode}),
        });

        return { success: true, message: "Verification Email Sent" };
  } catch (error) {
        console.error("Error sending verification Email: ", error);
        return { success: false, message: "Failed to Send verification Email" };
  }
}
