import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { messageSchema } from "@/schemas/messageSchema";

import {Message} from '@/model/User';


export async function POST(request:Request) {

    await dbConnect();

    const {username , content} = await request.json();

    try {
        
        const user = await UserModel.findOne({username});

        if(!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {status: 404});
        }

        //check for user accepting messages
        if(!user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: "user is not accepting messages"
            }, {status: 403});
        }

        const newMessage = {content ,  createdAt: new Date()};

        user.messages.push(newMessage as Message);

        await user.save();

        return Response.json({
            success: true,
            message: "message sent successfully"
        }, {status : 200})

    } catch (error) {
        
        return Response.json({
            success: false,
            message: "Internal server error"
        }, {status: 500});
    }
    
}