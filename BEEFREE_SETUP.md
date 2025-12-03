# Beefree SDK Integration Setup

This guide explains how to set up and use the Beefree SDK email editor integration in Marketing Buddy.

## Prerequisites

1. **Beefree SDK Account**: Create an account at [Beefree SDK](https://beefree.io)
2. **Application Setup**: Create an application in the [Beefree Developer Console](https://developers.beefree.io)
3. **Credentials**: Your credentials have already been configured in the Supabase Edge Function

## Installation

All required dependencies are already installed:
- `@beefree.io/sdk` - Official Beefree SDK package

## Quick Start

The Beefree SDK is now fully integrated with Supabase Edge Functions. Simply start your application:

```bash
npm run dev
```

The application will start on `http://localhost:5173`

**That's it!** No proxy server needed. The authentication is handled automatically through Supabase Edge Functions.

## Using the Email Editor

### Option 1: Start with a Template

1. Log in to Marketing Buddy
2. Navigate to **Campaigns**
3. Click **New Campaign**
4. Enter a campaign name (required)
5. Click **Use Template** button
6. Choose from pre-built templates:
   - **High Value Customers**: Premium design for VIP offers
   - **New Subscribers Welcome**: Warm welcome for new subscribers
   - **Re-engagement Campaign**: Win back inactive customers
7. The template will automatically convert to Beefree format and open the full-screen editor
8. Customize the template in the editor
9. Click **Save** in Beefree to save your changes
10. Click **Exit Editor** to return to campaigns

### Option 2: Launch Editor Directly

1. Log in to Marketing Buddy
2. Navigate to **Campaigns**
3. Click **New Campaign** or edit an existing campaign
4. Fill in the campaign details (name, subject, audience)
5. Click **Launch Email Editor** for full-screen editing
6. Design your email using the drag-and-drop interface
7. Click **Save** in the Beefree editor
8. The email design will be automatically saved to your campaign
9. Click **Exit Editor** to return to campaigns

### Option 3: Quick Inline Editor

1. From the campaign builder, click **Quick Editor**
2. Design your email in the embedded editor
3. Click **Save** to save changes
4. Continue editing campaign details

## How It Works

### Authentication Flow

1. **Frontend** → Requests a token from the Supabase Edge Function
2. **Edge Function** → Retrieves credentials from Supabase Vault and sends them to Beefree's authentication endpoint
3. **Beefree** → Returns an authentication token
4. **Frontend** → Uses the token to initialize the Beefree SDK

### Template System

1. **Pre-built Templates**: Marketing Buddy includes three professional email templates
2. **HTML-to-JSON Conversion**: When you select a template, it's automatically converted to Beefree JSON format using the Beefree API
3. **Seamless Integration**: Converted templates open directly in the full-screen editor
4. **Fallback Mode**: If API key is not configured, templates use a simplified format

### Data Storage

- Email designs are stored as JSON in the `campaigns` table
- The JSON format preserves all design elements and allows re-editing
- When campaigns are sent, the HTML is generated from the JSON

### Security

- Client ID and Client Secret are securely stored in Supabase Vault
- Credentials are never exposed to the browser
- Edge Functions handle all authentication server-side
- Each user gets a unique session with Beefree

## Troubleshooting

### "Failed to Load Editor" Error

**Possible Causes:**
- Invalid Beefree credentials
- Network connectivity issues
- Edge Function not properly deployed

**Solutions:**
1. Verify your Beefree credentials are correct in the Supabase project
2. Check the browser console for error messages
3. Ensure your internet connection is stable

### Editor Appears Blank

**Solutions:**
- Refresh the page
- Clear browser cache
- Check browser console for errors
- Verify Beefree account is active

### Save Not Working

**Solutions:**
- Click the Save button inside the Beefree editor first
- Then click "Save Campaign" in Marketing Buddy
- Check network tab for failed requests

## Customization

### Beefree Configuration

You can customize the editor in `src/components/BeefreeEditor.tsx`:

```typescript
const beeConfig = {
  container: 'beefree-container',
  language: 'en-US',
  // Add custom options here:
  // defaultModulesOrder: ['Button', 'Html', 'Icons', 'Video'],
  // sidebarPosition: 'right',
  // translations: { ... }
};
```

### Available Customizations

- **Language**: Change `language` to your locale (e.g., 'es-ES', 'fr-FR')
- **Module Order**: Customize content tile ordering with `defaultModulesOrder`
- **Module Groups**: Group content tiles with `modulesGroups`
- **Sidebar Position**: Set to 'left' or 'right'
- **Custom Text**: Override default labels with `translations`

See [Beefree SDK Documentation](https://docs.beefree.io/beefree-sdk) for all options.

## Next Steps

- Experiment with different email templates
- Customize the editor configuration
- Add custom content modules
- Integrate with your email sending service

## Support

- **Beefree Documentation**: https://docs.beefree.io/beefree-sdk
- **Beefree Support**: https://beefree.io/support
- **Marketing Buddy Issues**: Check the application logs and browser console
