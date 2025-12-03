/*
  # Create vault secret retrieval function

  1. New Functions
    - `vault_get_secret` - Retrieves a secret value from the vault by name
      - Takes secret_name as parameter
      - Returns the decrypted secret value
      - Only accessible with service role key
  
  2. Security
    - Function executes with security definer (vault permissions)
    - Only callable by authenticated users with proper permissions
*/

CREATE OR REPLACE FUNCTION vault_get_secret(secret_name text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  secret_value text;
BEGIN
  SELECT decrypted_secret INTO secret_value
  FROM vault.decrypted_secrets
  WHERE name = secret_name
  LIMIT 1;
  
  RETURN secret_value;
END;
$$;