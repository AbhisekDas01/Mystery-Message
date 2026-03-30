# Mystery Message (True Feedback) 

A full-stack anonymous messaging application built with Next.js, allowing users to receive anonymous feedback and messages securely. 

This project is based on the comprehensive Next.js full-stack tutorial by **Hitesh Choudhary** ([Watch the tutorial here](https://youtu.be/zLJoVRleOuc?si=SKPnIj1NttrH93q2)).

## 🚀 Features

- **User Authentication**: Secure signup and login using NextAuth.js.
- **Email Verification**: OTP-based email verification upon signup using Resend.
- **Anonymous Messaging**: A public profile link for users to receive anonymous messages.
- **Dashboard**: A private dashboard to view, accept, or delete incoming messages.
- **AI Message Suggestions**: Generate suggested messages using AI (OpenAI API).
- **Unique Usernames**: Real-time username availability checking.
- **Responsive Design**: Beautiful and responsive UI using Tailwind CSS and shadcn/ui.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) with Mongoose
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Email Service**: [Resend](https://resend.com/) & React Email
- **Schema Validation**: [Zod](https://zod.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)

## ⚙️ Getting Started

### Prerequisites

Make sure you have Node.js installed. You will also need:
1. A MongoDB database URI.
2. A Resend API key for sending emails.
3. An OpenAI API key (for message suggestions).
4. NextAuth Secret.

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory and add the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
RESEND_API_KEY=your_resend_api_key
NEXTAUTH_SECRET=your_nextauth_secret
OPENAI_API_KEY=your_openai_api_key
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🙏 Acknowledgements

- Massive thanks to **Hitesh Choudhary** for the amazing [Next.js Full Stack Tutorial](https://youtu.be/zLJoVRleOuc?si=SKPnIj1NttrH93q2).
