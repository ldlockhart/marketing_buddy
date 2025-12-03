const BEEFREE_API_KEY = import.meta.env.VITE_BEEFREE_API_KEY;
const BEEFREE_API_URL = 'https://api.getbee.io/v1/conversion/html-to-json';

export interface BeefreeConversionResponse {
  message: string;
  page?: any;
}

export async function convertHtmlToBeefreeJson(html: string): Promise<any> {
  try {
    if (!BEEFREE_API_KEY) {
      console.warn('Beefree API key not configured, using fallback template');
      return getFallbackTemplate();
    }

    const response = await fetch(BEEFREE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BEEFREE_API_KEY}`,
        'Content-Type': 'text/html',
        'Accept': 'application/json',
      },
      body: html,
    });

    if (!response.ok) {
      console.error('Beefree API error:', response.status, response.statusText);
      return getFallbackTemplate();
    }

    const data: BeefreeConversionResponse = await response.json();

    if (data.page) {
      return { page: data.page };
    }

    return getFallbackTemplate();
  } catch (error) {
    console.error('Error converting HTML to Beefree JSON:', error);
    return getFallbackTemplate();
  }
}

function getFallbackTemplate(): any {
  return {
    page: {
      body: {
        rows: [
          {
            columns: [
              {
                "grid-columns": 12,
                modules: [
                  {
                    type: 'mailup-bee-newsletter-modules-heading',
                    descriptor: {
                      heading: {
                        html: '<h1 style="text-align: center; color: #667eea;">Template Loaded Successfully</h1>'
                      }
                    }
                  },
                  {
                    type: 'mailup-bee-newsletter-modules-text',
                    descriptor: {
                      text: {
                        html: '<p style="font-size: 16px; line-height: 1.6; text-align: center;">Your template has been loaded. You can now customize it using the email editor.</p><p style="font-size: 14px; color: #999; text-align: center; margin-top: 16px;">Note: For full template conversion, configure your Beefree API key.</p>'
                      }
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  };
}

export async function generateTemplatePreview(html: string): Promise<string> {
  const lines = html.split('\n');
  const bodyStart = lines.findIndex(line => line.includes('<body'));
  const bodyEnd = lines.findIndex(line => line.includes('</body>'));

  if (bodyStart !== -1 && bodyEnd !== -1) {
    return lines.slice(bodyStart + 1, bodyEnd).join('\n').substring(0, 500) + '...';
  }

  return html.substring(0, 500) + '...';
}
