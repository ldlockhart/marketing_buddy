export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  category: 'high-value' | 'new-subscriber' | 're-engagement';
  html: string;
}

export const emailTemplates: EmailTemplate[] = [
  {
    id: 'high-value-customers',
    name: 'High Value Customers',
    description: 'Premium template for VIP customers with exclusive offers',
    category: 'high-value',
    html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exclusive Offer Just for You</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
      }
    </style>
  </head>
  <body>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
            <tr>
              <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 32px; margin: 0; font-weight: bold;">You're a VIP Member!</h1>
                <p style="color: #ffffff; font-size: 18px; margin: 16px 0 0 0; opacity: 0.9;">Exclusive benefits just for you</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px;">
                <h2 style="color: #333333; font-size: 24px; margin: 0 0 16px 0;">Dear Valued Customer,</h2>
                <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                  As one of our most valued customers, we're excited to offer you exclusive access to our premium benefits program.
                  Your loyalty means everything to us, and we want to show our appreciation.
                </p>
                <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 24px 0;">
                  <h3 style="color: #333333; font-size: 18px; margin: 0 0 12px 0;">Your VIP Benefits:</h3>
                  <ul style="color: #666666; font-size: 16px; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li>30% off your next purchase</li>
                    <li>Early access to new products</li>
                    <li>Priority customer support</li>
                    <li>Free shipping on all orders</li>
                  </ul>
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0;">
                  <tr>
                    <td align="center">
                      <a href="https://example.com/vip-offer" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 6px; font-size: 16px; font-weight: bold;">Claim Your Offer</a>
                    </td>
                  </tr>
                </table>
                <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 24px 0 0 0;">
                  This exclusive offer is valid for 7 days. Don't miss out on these premium benefits!
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f8f9fa; padding: 24px; text-align: center; border-top: 1px solid #e9ecef;">
                <p style="color: #999999; font-size: 14px; margin: 0;">
                  &copy; 2024 Marketing Buddy. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
  },
  {
    id: 'new-subscribers',
    name: 'New Subscribers Welcome',
    description: 'Warm welcome template for new subscribers',
    category: 'new-subscriber',
    html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Our Community!</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
      }
    </style>
  </head>
  <body>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
            <tr>
              <td style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 50px 40px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 36px; margin: 0; font-weight: bold;">Welcome Aboard! 🎉</h1>
                <p style="color: #ffffff; font-size: 18px; margin: 16px 0 0 0; opacity: 0.95;">We're thrilled to have you here</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px;">
                <h2 style="color: #333333; font-size: 24px; margin: 0 0 16px 0;">Hello and Welcome!</h2>
                <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                  Thank you for joining our community! We're excited to have you on board and can't wait to share
                  amazing content, exclusive offers, and updates with you.
                </p>
                <div style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); border-radius: 8px; padding: 24px; margin: 24px 0;">
                  <h3 style="color: #333333; font-size: 20px; margin: 0 0 12px 0; text-align: center;">Get Started in 3 Easy Steps</h3>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 16px;">
                    <tr>
                      <td width="80" align="center" valign="top" style="padding: 8px;">
                        <div style="background-color: #ffffff; width: 50px; height: 50px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; color: #f5576c;">1</div>
                      </td>
                      <td valign="top" style="padding: 8px;">
                        <h4 style="color: #333333; font-size: 16px; margin: 0 0 4px 0;">Complete Your Profile</h4>
                        <p style="color: #666666; font-size: 14px; margin: 0; line-height: 1.5;">Tell us a bit about yourself to personalize your experience</p>
                      </td>
                    </tr>
                    <tr>
                      <td width="80" align="center" valign="top" style="padding: 8px;">
                        <div style="background-color: #ffffff; width: 50px; height: 50px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; color: #f5576c;">2</div>
                      </td>
                      <td valign="top" style="padding: 8px;">
                        <h4 style="color: #333333; font-size: 16px; margin: 0 0 4px 0;">Explore Our Products</h4>
                        <p style="color: #666666; font-size: 14px; margin: 0; line-height: 1.5;">Browse our collection and find what you love</p>
                      </td>
                    </tr>
                    <tr>
                      <td width="80" align="center" valign="top" style="padding: 8px;">
                        <div style="background-color: #ffffff; width: 50px; height: 50px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; color: #f5576c;">3</div>
                      </td>
                      <td valign="top" style="padding: 8px;">
                        <h4 style="color: #333333; font-size: 16px; margin: 0 0 4px 0;">Enjoy Your Welcome Gift</h4>
                        <p style="color: #666666; font-size: 14px; margin: 0; line-height: 1.5;">Use code WELCOME20 for 20% off your first order</p>
                      </td>
                    </tr>
                  </table>
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0;">
                  <tr>
                    <td align="center">
                      <a href="https://example.com/get-started" style="display: inline-block; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 6px; font-size: 16px; font-weight: bold;">Get Started Now</a>
                    </td>
                  </tr>
                </table>
                <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 24px 0 0 0; text-align: center;">
                  Have questions? We're here to help! Reply to this email anytime.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f8f9fa; padding: 24px; text-align: center; border-top: 1px solid #e9ecef;">
                <p style="color: #999999; font-size: 14px; margin: 0;">
                  &copy; 2024 Marketing Buddy. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
  },
  {
    id: 're-engagement',
    name: 'Re-engagement Campaign',
    description: 'Win back inactive subscribers with compelling offers',
    category: 're-engagement',
    html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>We Miss You!</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
      }
    </style>
  </head>
  <body>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
            <tr>
              <td style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 50px 40px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 36px; margin: 0; font-weight: bold;">We Miss You! 💙</h1>
                <p style="color: #ffffff; font-size: 18px; margin: 16px 0 0 0; opacity: 0.95;">Come back and see what's new</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px;">
                <h2 style="color: #333333; font-size: 24px; margin: 0 0 16px 0;">It's Been a While...</h2>
                <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                  We noticed you haven't visited us in a while, and we wanted to reach out. A lot has changed since
                  your last visit, and we'd love to have you back!
                </p>
                <div style="background-color: #e3f2fd; border-radius: 8px; padding: 24px; margin: 24px 0;">
                  <h3 style="color: #333333; font-size: 20px; margin: 0 0 16px 0; text-align: center;">What You've Been Missing</h3>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="padding: 12px 0;">
                        <p style="color: #666666; font-size: 16px; margin: 0; line-height: 1.6;">
                          ✨ <strong>New Products:</strong> We've added 50+ new items to our collection
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0;">
                        <p style="color: #666666; font-size: 16px; margin: 0; line-height: 1.6;">
                          🎁 <strong>Improved Experience:</strong> Our website is faster and easier to use
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0;">
                        <p style="color: #666666; font-size: 16px; margin: 0; line-height: 1.6;">
                          🚀 <strong>Better Prices:</strong> Lower prices on your favorite items
                        </p>
                      </td>
                    </tr>
                  </table>
                </div>
                <div style="background: linear-gradient(135deg, #fff6b7 0%, #f6c77b 100%); border-radius: 8px; padding: 24px; margin: 24px 0; text-align: center;">
                  <h3 style="color: #333333; font-size: 22px; margin: 0 0 8px 0;">Special Welcome Back Offer</h3>
                  <p style="color: #666666; font-size: 32px; font-weight: bold; margin: 8px 0;">25% OFF</p>
                  <p style="color: #666666; font-size: 16px; margin: 8px 0 0 0;">Use code: <strong>COMEBACK25</strong></p>
                  <p style="color: #999999; font-size: 14px; margin: 12px 0 0 0;">Valid for the next 48 hours</p>
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0;">
                  <tr>
                    <td align="center">
                      <a href="https://example.com/welcome-back" style="display: inline-block; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 6px; font-size: 16px; font-weight: bold;">Welcome Me Back</a>
                    </td>
                  </tr>
                </table>
                <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 24px 0 0 0; text-align: center;">
                  Not interested anymore? We understand. <a href="https://example.com/unsubscribe" style="color: #4facfe; text-decoration: underline;">Unsubscribe here</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f8f9fa; padding: 24px; text-align: center; border-top: 1px solid #e9ecef;">
                <p style="color: #999999; font-size: 14px; margin: 0;">
                  &copy; 2024 Marketing Buddy. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
  }
];

export function getTemplateById(id: string): EmailTemplate | undefined {
  return emailTemplates.find(template => template.id === id);
}

export function getTemplatesByCategory(category: string): EmailTemplate[] {
  return emailTemplates.filter(template => template.category === category);
}
