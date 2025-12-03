/*
  # Add Campaign Type Column

  ## Overview
  Adds a campaign_type column to the campaigns table to support different types of marketing campaigns
  (general, high-value customers, new subscribers, re-engagement).

  ## Changes

  ### 1. Campaigns Table - Add campaign_type Column
  - Add `campaign_type` (text) column with default value 'general'
  - Supports values: 'general', 'high-value', 'new-subscribers', 're-engagement'
  - Used for campaign categorization and revenue prediction accuracy

  ## Migration Details
  - Uses conditional logic to avoid errors if column already exists
  - Safe to run multiple times (idempotent)
  - Default value ensures existing campaigns continue working

  ## Impact
  - Existing campaigns will have 'general' as their campaign type
  - No data loss or breaking changes
  - Application can now categorize campaigns by type
*/

-- Add campaign_type column to campaigns table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'campaigns' AND column_name = 'campaign_type'
  ) THEN
    ALTER TABLE campaigns ADD COLUMN campaign_type text DEFAULT 'general';
  END IF;
END $$;
