import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import path from 'path';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    const { 
      shippingDetails, 
      items, 
      paymentDetails, 
      finalPrice, 
      totalPrice,
      frontImage,
      backImage,
      leftImage,
      rightImage,
      shirtColor,
      quantities,
      frontColors,
      backColors,
      leftColors,
      rightColors,
      instructions
    } = data;

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!emailUser || !emailPass || !adminEmail) {
      console.warn("Email credentials not configured in environment variables.");
      return NextResponse.json({ success: true, message: "Order processed (email skipped due to missing config)" });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const hasCustomDesign = !!(
      frontImage || 
      backImage || 
      leftImage || 
      rightImage || 
      (quantities && Object.values(quantities as Record<string, any>).reduce((a: any, b: any) => a + (parseInt(b as string) || 0), 0) > 0)
    );
    const amountPaid = finalPrice || totalPrice || 0;

    // Construct Admin Email HTML
    let adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Order Received!</h2>
        <p>A new order has been placed by <strong>${shippingDetails?.firstName} ${shippingDetails?.lastName}</strong>.</p>
        
        <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Customer Details</h3>
        <p>
          <strong>Name:</strong> ${shippingDetails?.firstName} ${shippingDetails?.lastName}<br/>
          <strong>Email:</strong> ${shippingDetails?.email}<br/>
          <strong>Phone:</strong> ${shippingDetails?.phone}<br/>
          <strong>Order Type:</strong> In-Store Pickup
        </p>
        
        <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Order Summary</h3>
        <p>
          <strong>Total Paid:</strong> $${parseFloat(String(amountPaid)).toFixed(2)}<br/>
          <strong>Payment Method:</strong> ${paymentDetails?.method || 'PayPal'}<br/>
          <strong>Transaction ID:</strong> ${paymentDetails?.id || 'N/A'}
        </p>
    `;

    let origin = req.headers.get('origin') || 'https://onedigital-sol.vercel.app';
    if (origin.includes('localhost')) {
      origin = 'https://onedigital-sol.vercel.app';
    }
    const getAbsoluteUrl = (src: string) => src?.startsWith('/') ? `${origin}${src}` : src;

    if (items && items.length > 0) {
      adminHtml += `
        <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Standard Items</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="text-align: left; border-bottom: 1px solid #ddd; padding: 8px;">Image</th>
              <th style="text-align: left; border-bottom: 1px solid #ddd; padding: 8px;">Item</th>
              <th style="text-align: center; border-bottom: 1px solid #ddd; padding: 8px;">Qty</th>
              <th style="text-align: right; border-bottom: 1px solid #ddd; padding: 8px;">Price</th>
            </tr>
          </thead>
          <tbody>
      `;
      items.forEach((item: any) => {
        const itemImage = getAbsoluteUrl(item.image);
        adminHtml += `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">
                ${itemImage ? `<a href="${itemImage}" download="product.png" title="Click to download"><img src="${itemImage}" style="max-width: 60px; height: auto; border: 1px solid #ddd;" alt="${item.name}" /></a>` : ''}
              </td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">
                ${item.name}
              </td>
              <td style="text-align: center; padding: 8px; border-bottom: 1px solid #eee;">${item.totalQuantity}</td>
              <td style="text-align: right; padding: 8px; border-bottom: 1px solid #eee;">$${(item.price * item.totalQuantity).toFixed(2)}</td>
            </tr>
        `;
      });
      adminHtml += `</tbody></table>`;
    }

    const attachments: any[] = [];
    if (frontImage) {
      attachments.push({
        filename: 'front-design.png',
        content: frontImage.split('base64,')[1],
        encoding: 'base64',
        cid: 'frontDesign'
      });
    } else if (hasCustomDesign) {
      attachments.push({
        filename: 'blank-front.png',
        path: path.join(process.cwd(), 'public', 'templates', 'shirt-front.png'),
        cid: 'frontDesign'
      });
    }
    if (backImage) {
      attachments.push({
        filename: 'back-design.png',
        content: backImage.split('base64,')[1],
        encoding: 'base64',
        cid: 'backDesign'
      });
    } else if (hasCustomDesign) {
      attachments.push({
        filename: 'blank-back.png',
        path: path.join(process.cwd(), 'public', 'templates', 'shirt-back.png'),
        cid: 'backDesign'
      });
    }
    if (leftImage) {
      attachments.push({
        filename: 'left-design.png',
        content: leftImage.split('base64,')[1],
        encoding: 'base64',
        cid: 'leftDesign'
      });
    } else if (hasCustomDesign) {
      attachments.push({
        filename: 'blank-left.png',
        path: path.join(process.cwd(), 'public', 'templates', 'shirt-left.png'),
        cid: 'leftDesign'
      });
    }
    if (rightImage) {
      attachments.push({
        filename: 'right-design.png',
        content: rightImage.split('base64,')[1],
        encoding: 'base64',
        cid: 'rightDesign'
      });
    } else if (hasCustomDesign) {
      attachments.push({
        filename: 'blank-right.png',
        path: path.join(process.cwd(), 'public', 'templates', 'shirt-right.png'),
        cid: 'rightDesign'
      });
    }

    if (hasCustomDesign) {
      const customQty = Object.entries((quantities as Record<string, any>) || {}).map(([s, q]) => `${s}: ${q}`).join(', ');
      
      adminHtml += `
        <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 20px;">Custom Design Details</h3>
        <p><strong>Base Shirt Color:</strong> ${shirtColor || 'White'}</p>
        <p><strong>Quantities by Size:</strong> ${customQty || 'N/A'}</p>
        
        <p><strong>Front Print Colors:</strong> ${frontColors?.length ? frontColors.join(', ') : 'None'}</p>
        <p><strong>Back Print Colors:</strong> ${backColors?.length ? backColors.join(', ') : 'None'}</p>
        <p><strong>Left Print Colors:</strong> ${leftColors?.length ? leftColors.join(', ') : 'None'}</p>
        <p><strong>Right Print Colors:</strong> ${rightColors?.length ? rightColors.join(', ') : 'None'}</p>
        
        ${instructions ? `<p><strong>Special Instructions:</strong><br/>${instructions}</p>` : ''}
        
        <h4 style="margin-top: 20px;">Design Images (Click to Download)</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          <div style="margin-bottom: 15px;"><p><strong>Front:</strong></p><a href="cid:frontDesign" download="front-design.png"><img src="cid:frontDesign" style="max-width: 100%; height: auto; border: 1px solid #ddd;" alt="Front" /></a></div>
          <div style="margin-bottom: 15px;"><p><strong>Back:</strong></p><a href="cid:backDesign" download="back-design.png"><img src="cid:backDesign" style="max-width: 100%; height: auto; border: 1px solid #ddd;" alt="Back" /></a></div>
          <div style="margin-bottom: 15px;"><p><strong>Left Sleeve:</strong></p><a href="cid:leftDesign" download="left-design.png"><img src="cid:leftDesign" style="max-width: 100%; height: auto; border: 1px solid #ddd;" alt="Left Sleeve" /></a></div>
          <div style="margin-bottom: 15px;"><p><strong>Right Sleeve:</strong></p><a href="cid:rightDesign" download="right-design.png"><img src="cid:rightDesign" style="max-width: 100%; height: auto; border: 1px solid #ddd;" alt="Right Sleeve" /></a></div>
        </div>
      `;
    }

    adminHtml += `</div>`;

    // Construct Customer Email HTML
    let customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
        <h2 style="color: #4CAF50;">Thank You For Your Order!</h2>
        <p>Hi ${shippingDetails?.firstName},</p>
        <p>We have successfully received your order and payment of <strong>$${parseFloat(String(amountPaid)).toFixed(2)}</strong>.</p>
        
        <div style="background: #e8f5e9; border: 1px solid #c8e6c9; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: left; color: #2e7d32;">
          <h3 style="margin-top: 0; color: #2e7d32;">📍 Order Pickup Details</h3>
          <p style="margin-bottom: 5px;">Your order will be available for pickup at our location:</p>
          <p style="font-weight: bold; margin-bottom: 5px;"><a href="https://www.google.com/maps/search/?api=1&query=781+Tobermory+Rd,+Fayetteville,+NC+28306" style="color: #2e7d32; text-decoration: underline;" target="_blank">781 Tobermory Rd<br/>Fayetteville, NC 28306</a></p>
          <p style="margin-bottom: 0;"><strong>Phone:</strong> +1 910-865-1070</p>
        </div>
        
        <div style="text-align: left; background: #fafafa; padding: 15px; margin: 20px 0; border-radius: 5px; border: 1px solid #eee;">
          <h3 style="margin-top: 0;">Order Summary</h3>
    `;

    if (items && items.length > 0) {
      customerHtml += `
          <ul style="list-style: none; padding: 0;">
      `;
      items.forEach((item: any) => {
        const itemImage = getAbsoluteUrl(item.image);
        customerHtml += `
            <li style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
              ${itemImage ? `<img src="${itemImage}" style="width: 50px; height: 50px; object-fit: contain; border: 1px solid #ddd;" alt="${item.name}" />` : ''}
              <div>
                <strong>${item.name}</strong><br/>
                <span style="color: #666; font-size: 14px;">Qty: ${item.totalQuantity} | $${(item.price * item.totalQuantity).toFixed(2)}</span>
              </div>
            </li>
        `;
      });
      customerHtml += `</ul>`;
    }

    if (hasCustomDesign) {
      const customQty = Object.entries((quantities as Record<string, any>) || {}).map(([s, q]) => `${s}: ${q}`).join(', ');
      
      customerHtml += `
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee; text-align: left;">
          <h4 style="margin-top: 0; margin-bottom: 10px; color: #333;">Custom Design Details</h4>
          <p style="margin: 4px 0;"><strong>Base Shirt Color:</strong> ${shirtColor || 'White'}</p>
          <p style="margin: 4px 0;"><strong>Quantities by Size:</strong> ${customQty || 'N/A'}</p>
          ${instructions ? `<p style="margin: 4px 0;"><strong>Special Instructions:</strong><br/>${instructions}</p>` : ''}
          
          <h4 style="margin-top: 15px; margin-bottom: 10px; color: #333;">Your Custom Design Previews:</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
            <img src="cid:frontDesign" style="max-width: 120px; height: auto; border: 1px solid #ddd; border-radius: 4px;" alt="Front" />
            <img src="cid:backDesign" style="max-width: 120px; height: auto; border: 1px solid #ddd; border-radius: 4px;" alt="Back" />
            <img src="cid:leftDesign" style="max-width: 120px; height: auto; border: 1px solid #ddd; border-radius: 4px;" alt="Left Sleeve" />
            <img src="cid:rightDesign" style="max-width: 120px; height: auto; border: 1px solid #ddd; border-radius: 4px;" alt="Right Sleeve" />
          </div>
        </div>
      `;
    }

    customerHtml += `
        </div>
        <p>We are currently processing your items and will notify you once they are ready for pickup.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888;">If you have any questions, please reply to this email.</p>
      </div>
    `;

    console.log("==========================================");
    console.log("📦 NEW ORDER RECEIVED (CONSOLE LOG):");
    console.log("Customer:", shippingDetails?.firstName, shippingDetails?.lastName, "(", shippingDetails?.email, ")");
    console.log("Total Amount:", amountPaid);
    console.log("Payment Details:", paymentDetails);
    console.log("Items Count:", items?.length || 0);
    console.log("==========================================");

    if (process.env.SKIP_EMAIL === 'true') {
      console.log("🚫 SKIP_EMAIL is set to true. Real email sending skipped.");
      return NextResponse.json({ success: true, message: "Order logged to console (Emails skipped via SKIP_EMAIL)" });
    }

    // Send Admin Email
    await transporter.sendMail({
      from: `"One Digital Solutions" <${emailUser}>`,
      to: adminEmail,
      subject: `New Order Received - $${parseFloat(String(amountPaid)).toFixed(2)}`,
      html: adminHtml,
      attachments,
    });

    // Send Customer Email
    if (shippingDetails?.email) {
      await transporter.sendMail({
        from: `"One Digital Solutions" <${emailUser}>`,
        to: shippingDetails.email,
        subject: `Your Order Confirmation`,
        html: customerHtml,
        attachments,
      });
    }

    return NextResponse.json({ success: true, message: "Emails sent successfully." });
    
  } catch (error) {
    console.error("Error sending order emails:", error);
    return NextResponse.json({ success: false, error: "Failed to send emails" }, { status: 500 });
  }
}
