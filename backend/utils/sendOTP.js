const nodemailer = require('nodemailer');
const dns = require('dns').promises;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify email domain actually exists via DNS MX lookup
async function verifyEmailDomain(email) {
  const domain = email.split('@')[1];
  if (!domain) return false;
  try {
    const addresses = await dns.resolveMx(domain);
    return addresses && addresses.length > 0;
  } catch {
    return false;
  }
}

async function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: `"Dental AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Dental AI Verification OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #2563eb; margin-bottom: 8px;">Dental AI Portal</h2>
        <p style="color: #444;">Use the OTP below to verify your email address. It expires in <strong>5 minutes</strong>.</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 10px; text-align: center; padding: 20px; background: #f0f4ff; border-radius: 8px; color: #1d4ed8; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #888; font-size: 13px;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendOTPEmail, verifyEmailDomain };