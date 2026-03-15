import mongoose , {Schema , Document} from "mongoose";

//interface defined for datatype
export interface Message extends Document{
    content: string;
    createdAt: Date;
}


const MessageSchema : Schema<Message> = new Schema({

    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});


//interface for data type user
export interface User extends Document {

    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[]; //message interface type array
}

const UserSchema : Schema<User> = new Schema({

    username: {
        type: String,
        required: [true , 'Username is required'],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true , "Email is required"],
        unique: true,
        match: [/.+\@.+\..+/, 'Invalid email address']
    },
    password: {
        type: String,
        required: [true , "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true , "verifyCode is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true , "verifyCodeExpiry is required"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages: [MessageSchema]

});


                    //check db if the model exists or create it 
const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>('User' , UserSchema);

export default UserModel;