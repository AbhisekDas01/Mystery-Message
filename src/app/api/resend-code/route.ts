import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import crypto from "crypto";

export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username");

        if (!username) {
            return Response.json(
                {
                    success: false,
                    message: "Username is required",
                },
                { status: 400 },
            );
        }

        const user = await UserModel.findOne({ username: username });

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found! please signup again",
                },
                { status: 404 },
            );
        }

        if(user.isVerified) {
            return Response.json({
                success: false,
                message: "Account already Verified"
            }, {status: 400});
        }

        //check is existing code expired or not
        const codeExpiry = new Date(user.verifyCodeExpiry);

        if (codeExpiry.getTime() > Date.now()) {
            const remainingTime = codeExpiry.getTime() - Date.now();

            const totalSeconds = Math.floor(remainingTime / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60; // no need for Math.floor here

            const message = minutes > 0
                    ? `You can resend OTP after ${minutes}m ${seconds}s`
                    : `You can resend OTP after ${seconds}s`;

            return Response.json(
                {
                    success: false,
                    message: message,
                },
                { status: 400 },
            );
        }

        //generate new otp
        const verifyCode = crypto.randomInt(100000, 1000000).toString();
        const verificationCodeExpiry = new Date(Date.now() + 300000);

        //send the otp to the user
        const emailResponse = await sendVerificationEmail(
            user.email,
            username,
            verifyCode,
        );

        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 },
            );
        }

        user.verifyCode = verifyCode;
        user.verifyCodeExpiry = verificationCodeExpiry;

        await user.save();

        return Response.json({
            success: true,
            message: "Verification Code sent Successfully",
        });
    } catch (error) {
        console.log("Error resending messages : ", error);
        return Response.json(
            {
                success: false,
                message: "Error sending OTP",
            },
            { status: 500 },
        );
    }
}
