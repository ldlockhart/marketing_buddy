export interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  html: string;
}

export const emailTemplates: EmailTemplate[] = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    category: 'Onboarding',
    description: 'Welcome new subscribers with a warm introduction',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <div style="text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #f97316 0%, #ec4899 100%); border-radius: 12px;">
          <h1 style="color: #ffffff; margin: 0; font-size: 32px;">Welcome to Our Community!</h1>
          <p style="color: #ffffff; margin-top: 10px; font-size: 18px;">We're excited to have you here</p>
        </div>
        <div style="padding: 30px 20px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi there,</p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">Thank you for joining us! We're thrilled to welcome you to our community. Get ready for exclusive content, special offers, and insider updates.</p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">Here's what you can expect:</p>
          <ul style="color: #374151; font-size: 16px; line-height: 1.8;">
            <li>Weekly tips and insights</li>
            <li>Exclusive member-only offers</li>
            <li>Early access to new features</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #f97316 0%, #ec4899 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Get Started</a>
          </div>
        </div>
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 14px;">
          <p>© 2024 Your Company. All rights reserved.</p>
        </div>
      </div>
    `
  },
  {
    id: 'promotional',
    name: 'Promotional Offer',
    category: 'Sales',
    description: 'Drive sales with compelling promotional offers',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <div style="text-align: center; padding: 20px; background-color: #fef3c7; border-radius: 12px; border: 2px dashed #f59e0b;">
          <h2 style="color: #92400e; margin: 0; font-size: 24px;">🎉 Special Offer Inside!</h2>
          <p style="color: #92400e; margin-top: 8px; font-size: 18px; font-weight: bold;">Limited Time: 25% OFF</p>
        </div>
        <div style="padding: 30px 20px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi there,</p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">Don't miss out on this exclusive offer! For a limited time, enjoy <strong>25% off</strong> on all our products.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin: 0 0 10px 0;">Use Code:</h3>
            <div style="background-color: #ffffff; padding: 12px; border-radius: 6px; text-align: center; font-size: 24px; font-weight: bold; color: #f97316; letter-spacing: 2px; border: 2px solid #f97316;">
              SAVE25
            </div>
          </div>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hurry! This offer expires in 48 hours.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #f97316 0%, #ec4899 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Shop Now</a>
          </div>
        </div>
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 14px;">
          <p>© 2024 Your Company. All rights reserved.</p>
        </div>
      </div>
    `
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    category: 'Content',
    description: 'Keep your audience engaged with regular updates',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <div style="text-align: center; padding: 20px; border-bottom: 3px solid #f97316;">
          <h1 style="color: #1f2937; margin: 0; font-size: 28px;">📰 Your Weekly Update</h1>
          <p style="color: #6b7280; margin-top: 8px; font-size: 14px;">December 2024 • Issue #42</p>
        </div>
        <div style="padding: 30px 20px;">
          <h2 style="color: #1f2937; font-size: 22px; margin: 0 0 15px 0;">What's New This Week</h2>
          <div style="margin-bottom: 25px; padding-bottom: 25px; border-bottom: 1px solid #e5e7eb;">
            <h3 style="color: #f97316; font-size: 18px; margin: 0 0 10px 0;">🚀 Feature Highlight</h3>
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;">Discover our new automation tools that save you hours every week. Set up workflows in minutes!</p>
            <a href="#" style="color: #f97316; text-decoration: none; font-weight: bold;">Learn More →</a>
          </div>
          <div style="margin-bottom: 25px; padding-bottom: 25px; border-bottom: 1px solid #e5e7eb;">
            <h3 style="color: #f97316; font-size: 18px; margin: 0 0 10px 0;">💡 Tips & Tricks</h3>
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;">5 proven strategies to boost your email open rates by 40%. Click to read our latest guide.</p>
            <a href="#" style="color: #f97316; text-decoration: none; font-weight: bold;">Read Article →</a>
          </div>
          <div style="margin-bottom: 25px;">
            <h3 style="color: #f97316; font-size: 18px; margin: 0 0 10px 0;">🎯 Success Story</h3>
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;">See how Company XYZ increased their revenue by 300% using our platform. An inspiring read!</p>
            <a href="#" style="color: #f97316; text-decoration: none; font-weight: bold;">View Case Study →</a>
          </div>
          <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #fef3c7; border-radius: 8px;">
            <p style="color: #92400e; margin: 0 0 15px 0; font-size: 16px; font-weight: bold;">Join our community of 10,000+ subscribers</p>
            <a href="#" style="display: inline-block; padding: 12px 28px; background-color: #f97316; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">Subscribe Now</a>
          </div>
        </div>
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 14px;">
          <p>© 2024 Your Company. All rights reserved.</p>
          <p style="margin-top: 10px;"><a href="#" style="color: #9ca3af; text-decoration: none;">Unsubscribe</a> | <a href="#" style="color: #9ca3af; text-decoration: none;">Update Preferences</a></p>
        </div>
      </div>
    `
  },
  {
    id: 'abandoned-cart',
    name: 'Abandoned Cart',
    category: 'E-commerce',
    description: 'Recover lost sales with cart reminder emails',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <div style="text-align: center; padding: 30px 20px;">
          <h1 style="color: #1f2937; margin: 0; font-size: 28px;">You Left Something Behind! 🛒</h1>
          <p style="color: #6b7280; margin-top: 10px; font-size: 16px;">Your items are waiting for you</p>
        </div>
        <div style="padding: 20px; background-color: #f9fafb; border-radius: 12px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">Items in Your Cart:</h3>
          <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; margin-bottom: 10px; display: flex; align-items: center;">
            <div style="width: 80px; height: 80px; background-color: #e5e7eb; border-radius: 6px; margin-right: 15px;"></div>
            <div>
              <p style="color: #1f2937; margin: 0; font-weight: bold; font-size: 16px;">Product Name</p>
              <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">Size: M • Color: Blue</p>
              <p style="color: #f97316; margin: 5px 0 0 0; font-weight: bold; font-size: 16px;">$49.99</p>
            </div>
          </div>
        </div>
        <div style="padding: 20px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi there,</p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">We noticed you left some items in your cart. Complete your purchase now and get <strong>free shipping</strong> on this order!</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #f97316 0%, #ec4899 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Complete Your Purchase</a>
          </div>
          <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 20px;">This cart will expire in 24 hours</p>
        </div>
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 14px;">
          <p>© 2024 Your Company. All rights reserved.</p>
        </div>
      </div>
    `
  },
  {
    id: 're-engagement',
    name: 'Re-engagement',
    category: 'Retention',
    description: 'Win back inactive customers',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <div style="text-align: center; padding: 40px 20px;">
          <h1 style="color: #1f2937; margin: 0; font-size: 32px;">We Miss You! 💙</h1>
          <p style="color: #6b7280; margin-top: 10px; font-size: 18px;">It's been a while since we last saw you</p>
        </div>
        <div style="padding: 20px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi there,</p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">We noticed you haven't been active recently, and we wanted to reach out. We've been working hard to improve and have some exciting updates to share!</p>
          <div style="background: linear-gradient(135deg, #f97316 0%, #ec4899 100%); padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
            <h2 style="color: #ffffff; margin: 0 0 10px 0; font-size: 24px;">Special Comeback Offer</h2>
            <p style="color: #ffffff; margin: 0 0 20px 0; font-size: 18px; font-weight: bold;">30% OFF Your Next Order</p>
            <div style="background-color: #ffffff; padding: 12px; border-radius: 6px; display: inline-block;">
              <span style="color: #f97316; font-size: 24px; font-weight: bold; letter-spacing: 2px;">WELCOME30</span>
            </div>
          </div>
          <h3 style="color: #1f2937; font-size: 20px; margin: 25px 0 15px 0;">What's New:</h3>
          <ul style="color: #374151; font-size: 16px; line-height: 1.8; padding-left: 20px;">
            <li>New products added weekly</li>
            <li>Faster checkout process</li>
            <li>Enhanced customer support</li>
            <li>Exclusive member rewards program</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #f97316 0%, #ec4899 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Claim Your Offer</a>
          </div>
          <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 20px;">Offer expires in 7 days</p>
        </div>
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 14px;">
          <p>© 2024 Your Company. All rights reserved.</p>
          <p style="margin-top: 10px;"><a href="#" style="color: #9ca3af; text-decoration: none;">Not interested? Unsubscribe</a></p>
        </div>
      </div>
    `
  }
];

export function generateEmailTemplate(templateId: string, customData?: Record<string, any>): string {
  const template = emailTemplates.find(t => t.id === templateId);
  if (!template) {
    return emailTemplates[0].html;
  }

  let html = template.html;

  if (customData) {
    Object.keys(customData).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, customData[key]);
    });
  }

  return html;
}

export function getTemplatesByCategory(category: string): EmailTemplate[] {
  return emailTemplates.filter(t => t.category === category);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(emailTemplates.map(t => t.category)));
}
