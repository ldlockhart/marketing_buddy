import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { uid } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: clientIdData, error: clientIdError } = await supabase
      .rpc('vault_get_secret', { secret_name: 'BEE_CLIENT_ID' });

    const { data: clientSecretData, error: clientSecretError } = await supabase
      .rpc('vault_get_secret', { secret_name: 'BEE_CLIENT_SECRET' });

    if (clientIdError || clientSecretError || !clientIdData || !clientSecretData) {
      console.error('Failed to retrieve secrets from vault:', { clientIdError, clientSecretError });
      return new Response(
        JSON.stringify({ 
          error: 'Beefree credentials not configured in Supabase Vault.' 
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const clientId = clientIdData;
    const clientSecret = clientSecretData;

    const response = await fetch('https://auth.getbee.io/apiauth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'password',
        client_id: clientId,
        client_secret: clientSecret,
        username: uid || 'marketing-buddy-user',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Beefree auth failed:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to authenticate with Beefree', details: errorText }),
        {
          status: response.status,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const token = await response.json();

    return new Response(
      JSON.stringify(token),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in beefree-auth function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});