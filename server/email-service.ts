import nodemailer from 'nodemailer';

/**
 * Email Service - Node.js based email handling for order notifications
 */

interface OrderData {
    orderId: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    total: number;
    paymentStatus: string;
    paymentMethod?: string;
    transactionId?: string;
    shippingAddress?: string;
    orderItems?: Array<{
        productName: string;
        quantity: number;
        price: number;
    }>;
}

interface CancellationData {
    orderId: string;
    customerName: string;
    customerEmail: string;
    reason: string;
    details?: string;
    orderTotal?: number;
}

// Create SMTP transporter
function createEmailTransporter() {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
    });
}

// Generate order success email HTML template
function generateOrderSuccessEmailHTML(orderData: OrderData): string {
    const itemsHtml = orderData.orderItems?.map((item: any) => `
    <div style="padding:10px;border-bottom:1px solid #eee;">
      <strong>${item.productName}</strong><br>
      Qty: ${item.quantity} | Price: ₹${item.price} | Subtotal: <b>₹${item.quantity * item.price}</b>
    </div>
  `).join('') || '';

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body{font-family:'Segoe UI',Arial,sans-serif;background:#ffffff;margin:0;padding:0;color:#3d3d3d;}
  .wrapper{max-width:620px;margin:auto;background:#fafafa;border-radius:10px;overflow:hidden;}
  .header{background:linear-gradient(120deg,#ec4899,#d946ef);color:#fff;text-align:center;padding:35px 20px;}
  .header h1{margin:0;font-size:32px;letter-spacing:1px;}
  .header p{margin-top:8px;font-size:15px;opacity:.9;}
  .section{background:#fff;padding:28px;margin:18px;border-radius:10px;box-shadow:0 2px 7px rgba(0,0,0,.05);}
  h3{margin-bottom:10px;color:#d946ef;}
  .order-box{background:#fff0f9;padding:18px;border-radius:8px;border-left:4px solid #d946ef;margin-top:15px;}
  .items{background:#f8f8f8;padding:15px;margin-top:20px;border-radius:10px;}
  .total-amount{background:#d946ef;color:white;padding:14px;margin-top:18px;text-align:center;border-radius:8px;font-size:20px;font-weight:bold;letter-spacing:.5px;}
  .footer{background:#f0f0f0;text-align:center;padding:20px;font-size:12px;color:#666;}
</style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>✨ Order Confirmed!</h1>
      <p>Thank you for choosing Liminara Cosmetics</p>
    </div>
    
    <div class="section">
      <h3>Hello ${orderData.customerName}! 👋</h3>
      <p>Your order has been successfully placed. We're thrilled to get your beauty products to you!</p>
      
      <div class="order-box">
        <strong>Order ID:</strong> #${orderData.orderId}<br>
        <strong>Payment Status:</strong> ${orderData.paymentStatus.toUpperCase()}<br>
        <strong>Payment Method:</strong> ${orderData.paymentMethod || 'N/A'}<br>
        ${orderData.transactionId ? `<strong>Transaction ID:</strong> ${orderData.transactionId}<br>` : ''}
      </div>
      
      <h3>📦 Order Items</h3>
      <div class="items">
        ${itemsHtml}
      </div>
      
      <div class="total-amount">
        Total Amount: ₹${orderData.total}
      </div>
      
      ${orderData.shippingAddress ? `
        <h3>🚚 Shipping Address</h3>
        <div class="order-box">
          ${orderData.shippingAddress}
        </div>
      ` : ''}
    </div>
    
    <div class="footer">
      <p>Liminara Cosmetics | Premium Beauty Products</p>
      <p>For support, contact us at support@liminara.com</p>
    </div>
  </div>
</body>
</html>
  `;
}

// Generate order cancellation email HTML template
function generateCancellationEmailHTML(cancellationData: CancellationData): string {
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body{font-family:'Segoe UI',Arial,sans-serif;background:#ffffff;margin:0;padding:0;color:#3d3d3d;}
  .wrapper{max-width:620px;margin:auto;background:#fafafa;border-radius:10px;overflow:hidden;}
  .header{background:linear-gradient(120deg,#ef4444,#dc2626);color:#fff;text-align:center;padding:35px 20px;}
  .header h1{margin:0;font-size:32px;letter-spacing:1px;}
  .section{background:#fff;padding:28px;margin:18px;border-radius:10px;box-shadow:0 2px 7px rgba(0,0,0,.05);}
  .info-box{background:#fef2f2;padding:15px;border-radius:8px;border-left:4px solid #ef4444;margin-top:15px;}
  .footer{background:#f0f0f0;text-align:center;padding:20px;font-size:12px;color:#666;}
</style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Order Cancelled</h1>
      <p>Order #${cancellationData.orderId}</p>
    </div>
    
    <div class="section">
      <h3>Hi ${cancellationData.customerName},</h3>
      <p>Your order has been cancelled as requested.</p>
      
      <div class="info-box">
        <strong>Order ID:</strong> #${cancellationData.orderId}<br>
        <strong>Cancellation Reason:</strong> ${cancellationData.reason}<br>
        ${cancellationData.details ? `<strong>Details:</strong> ${cancellationData.details}<br>` : ''}
        ${cancellationData.orderTotal ? `<strong>Refund Amount:</strong> ₹${cancellationData.orderTotal}` : ''}
      </div>
      
      <p style="margin-top:20px;">If you have any questions about this cancellation, please don't hesitate to contact our support team.</p>
    </div>
    
    <div class="footer">
      <p>Liminara Cosmetics | Premium Beauty Products</p>
      <p>For support, contact us at support@liminara.com</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Send order success email
 */
export async function sendOrderSuccessEmail(orderData: OrderData): Promise<{ success: boolean; message: string; emailIds?: any }> {
    try {
        console.log('📧 Sending order success email via Node.js email service...');

        const transporter = createEmailTransporter();

        // Email to customer
        const customerEmailResult = await transporter.sendMail({
            from: `"Liminara Cosmetics" <${process.env.SMTP_USERNAME}>`,
            to: orderData.customerEmail,
            subject: `💖 Order Confirmed - Liminara Cosmetics - #${orderData.orderId}`,
            html: generateOrderSuccessEmailHTML(orderData),
            replyTo: process.env.SMTP_USERNAME
        });

        // Email to admin
        const adminEmailResult = await transporter.sendMail({
            from: `"Liminara Cosmetics" <${process.env.SMTP_USERNAME}>`,
            to: process.env.ADMIN_EMAIL || process.env.SMTP_USERNAME,
            subject: `🛍 New Order Placed | #${orderData.orderId} | Total ₹${orderData.total} | Liminara Cosmetics`,
            html: generateOrderSuccessEmailHTML(orderData)
        });

        console.log('📧 Order success emails sent successfully');
        return {
            success: true,
            message: 'Order success emails sent',
            emailIds: {
                customer: customerEmailResult.messageId,
                admin: adminEmailResult.messageId
            }
        };
    } catch (error: any) {
        console.error('📧 Error sending order success email:', error);
        return {
            success: false,
            message: `Email service error: ${error.message}`
        };
    }
}

/**
 * Send order cancellation email
 */
export async function sendOrderCancellationEmail(cancellationData: CancellationData): Promise<{ success: boolean; message: string; emailIds?: any }> {
    try {
        console.log('📧 Sending order cancellation email via Node.js email service...');

        const transporter = createEmailTransporter();

        // Email to customer
        const customerEmailResult = await transporter.sendMail({
            from: `"Liminara Cosmetics" <${process.env.SMTP_USERNAME}>`,
            to: cancellationData.customerEmail,
            subject: `Order Cancelled - Liminara Cosmetics - #${cancellationData.orderId}`,
            html: generateCancellationEmailHTML(cancellationData),
            replyTo: process.env.SMTP_USERNAME
        });

        // Email to admin
        const adminEmailResult = await transporter.sendMail({
            from: `"Liminara Cosmetics" <${process.env.SMTP_USERNAME}>`,
            to: process.env.ADMIN_EMAIL || process.env.SMTP_USERNAME,
            subject: `Order Cancelled | #${cancellationData.orderId} | Liminara Cosmetics`,
            html: generateCancellationEmailHTML(cancellationData)
        });

        console.log('📧 Order cancellation emails sent successfully');
        return {
            success: true,
            message: 'Order cancellation emails sent',
            emailIds: {
                customer: customerEmailResult.messageId,
                admin: adminEmailResult.messageId
            }
        };
    } catch (error: any) {
        console.error('📧 Error sending order cancellation email:', error);
        return {
            success: false,
            message: `Email service error: ${error.message}`
        };
    }
}

/**
 * Log email activity
 */
export function logEmailActivity(type: 'success' | 'cancellation', orderId: string, result: any) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${type.toUpperCase()} - Order ${orderId} - ${result.success ? 'SUCCESS' : 'FAILED'}: ${result.message}`;
    console.log(`📧 Email Log: ${logMessage}`);
}
