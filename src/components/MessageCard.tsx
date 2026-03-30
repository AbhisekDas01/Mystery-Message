import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Message } from "@/model/User"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner"

type MessageCardProp = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProp) => {

    console.log("Message : ", message);

    const handleDeleteConfirm = async () => {

        try {

            onMessageDelete(message._id.toString());

            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);

            toast.success(response.data.message);



        } catch (error) {

        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">{message.content}</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild >
                            <Button className="p-5 w-10 cursor-pointer" variant="destructive"><X className="w-5 h-5" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will delete the message
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                </div>

                <CardDescription>Message At: {new Date(message.createdAt).toLocaleString()}</CardDescription>
            </CardHeader>

        </Card>
    )
}

export default MessageCard