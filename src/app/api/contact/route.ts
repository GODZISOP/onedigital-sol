import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const adminEmail = process.env.ADMIN_EMAIL || 'appointmentstudio@gmail.com';

    if (!emailUser || !emailPass) {
      console.error("Missing email credentials in environment variables.");
      return NextResponse.json({ success: false, error: "Email service is not configured." }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 5px;">
        <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">New Contact Message</h2>
        <p><strong>From:</strong> ${name} (&lt;${email}&gt;)</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 15px; white-space: pre-wrap;">
          <strong>Message:</strong><br/>
          ${message}
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"${name}" <${emailUser}>`,
      to: adminEmail,
      subject: `New Contact Inquiry: ${subject}`,
      replyTo: email,
      html: mailHtml,
    });

    return NextResponse.json({ success: true, message: "Message sent successfully." });

  } catch (error) {
    console.error("Error sending contact email:", error);
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 });
  }
}
