import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html }) {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use App Password for Gmail
      },
    });

    // Email details
    const mailOptions = {
      from: `"Inkverse Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully to:", to);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Failed to send email");
  }
}
