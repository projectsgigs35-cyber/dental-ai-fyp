const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendFeedback(req, res) {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Email to admin
    const adminMailOptions = {
      from: `"Dental AI Feedback" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Feedback: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #2563eb; margin-bottom: 20px;">New Feedback Received</h2>
          
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 8px 0;"><strong>From:</strong> ${name}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 8px 0;"><strong>Subject:</strong> ${subject}</p>
          </div>

          <h3 style="color: #374151; margin: 20px 0 10px 0;">Message:</h3>
          <div style="background: #ffffff; padding: 15px; border-left: 4px solid #2563eb; white-space: pre-wrap; word-wrap: break-word;">
            ${message}
          </div>

          <p style="color: #888; font-size: 12px; margin-top: 20px; border-top: 1px solid #e0e0e0; padding-top: 15px;">
            This is an automated message from Dental AI Feedback System
          </p>
        </div>
      `,
    };

    // Confirmation email to user
    const userMailOptions = {
      from: `"Dental AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'We received your feedback - Dental AI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #2563eb; margin-bottom: 8px;">Thank You for Your Feedback!</h2>
          
          <p style="color: #444; margin-bottom: 15px;">
            Dear ${name},
          </p>

          <p style="color: #444; margin-bottom: 15px;">
            We have successfully received your feedback regarding "<strong>${subject}</strong>". 
            Our team will review your message and respond as soon as possible.
          </p>

          <div style="background: #f0fdf4; padding: 15px; border-left: 4px solid #10b981; border-radius: 8px; margin: 20px 0;">
            <p style="color: #065f46; margin: 0;">
              <strong>✓</strong> Expected response time: 24-48 hours
            </p>
          </div>

          <p style="color: #444; margin-bottom: 15px;">
            If you have any urgent concerns, please feel free to reach out to us directly.
          </p>

          <p style="color: #444; margin-bottom: 0;">
            Best regards,<br/>
            <strong>Dental AI Team</strong>
          </p>

          <p style="color: #888; font-size: 12px; margin-top: 20px; border-top: 1px solid #e0e0e0; padding-top: 15px;">
            This is an automated response. Please do not reply to this email.
          </p>
        </div>
      `,
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    res.status(200).json({
      message: 'Feedback sent successfully. A confirmation email has been sent to your address.',
    });
  } catch (error) {
    console.error('Error sending feedback:', error);
    res.status(500).json({
      message: 'Failed to send feedback. Please try again later.',
    });
  }
}

module.exports = { sendFeedback };
