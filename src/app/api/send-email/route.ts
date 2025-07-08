import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: NextRequest) {
    try {
        const { name, email, subject, message } = await request.json();

        await resend.emails.send({
            from: "owner@bhaweshagrawal.com.np",
            to: "owner@bhaweshagrawal.com.np",
            subject: `New Contact Form Message: ${subject}`,
            html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong><br/>${message}</p>`,
        });

        return NextResponse.json({ status: "success" }, { status: 200 });
    } catch (error) {
        console.error("Email sending failed:", error);
        return NextResponse.json(
            { error: "Failed to send email" },
            { status: 500 }
        );
    }
}
