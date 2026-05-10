import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import html_to_pdf from 'html-pdf-node';
import config from '../../config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.mail_sender,
    pass: config.smtp_pass,
  },
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('SMTP Server is ready to take our messages');
  }
});

/**
 * Generates a PDF buffer from the invoice EJS template
 */
const generateInvoicePDF = async (order: any): Promise<Buffer> => {
  const templatePath = path.join(process.cwd(), 'src', 'app', 'templates', 'invoice.template.ejs');

  // Render HTML from EJS
  const html = await ejs.renderFile(templatePath, { order });

  // PDF options
  const options = {
    format: 'A4',
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    printBackground: true
  };

  const file = { content: html };

  // Generate PDF buffer
  // Note: html-pdf-node returns a Promise that resolves to a Buffer, 
  // but the @types are outdated and return void. We cast to any to fix the type error.
  const pdfBuffer = await (html_to_pdf.generatePdf(file, options) as any);

  return pdfBuffer;
};

/**
 * Sends an invoice email with the PDF attached
 */
const sendInvoiceEmail = async (order: any, customerEmail: string) => {
  try {
    console.log(`Starting PDF generation for order ${order.orderNumber}...`);
    const pdfBuffer = await generateInvoicePDF(order);
    console.log(`PDF generated successfully for order ${order.orderNumber}`);

    const mailOptions = {
      from: `"SuperShop" <${config.mail_sender}>`,
      to: customerEmail,
      subject: `Invoice for your order #${order.orderNumber}`,
      text: `Thank you for your purchase! Please find your invoice attached for order #${order.orderNumber}.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #6366F1; text-align: center;">Thank You for Your Order!</h2>
          <p>Hi ${order.user?.name || 'Customer'},</p>
          <p>We've received your order <strong>#${order.orderNumber}</strong> and it's being processed.</p>
          <p>We have attached the official invoice to this email for your records.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666; text-align: center;">
            This is an automated message. Please do not reply directly to this email.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `invoice_${order.orderNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    console.log(`Sending email to ${customerEmail}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log('Invoice email sent successfully: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('CRITICAL: Error sending invoice email:', error);
    throw error; // Re-throw to catch it in the service
  }
};

export const EmailServices = {
  sendInvoiceEmail,
  generateInvoicePDF,
};
