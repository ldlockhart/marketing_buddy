/*
  # Marketing Buddy Platform Schema

  ## Overview
  This migration creates the complete database schema for the Marketing Buddy email marketing platform,
  including tables for campaigns, audiences, email templates, analytics, and revenue tracking.

  ## 1. New Tables
  
  ### `audiences`
  - `id` (uuid, primary key) - Unique identifier for the audience segment
  - `name` (text) - Name of the audience segment
  - `description` (text) - Description of the audience
  - `criteria` (jsonb) - Segmentation criteria (tags, behaviors, demographics)
  - `subscriber_count` (integer) - Number of subscribers in this segment
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `user_id` (uuid) - Owner of the audience segment

  ### `campaigns`
  - `id` (uuid, primary key) - Unique identifier for the campaign
  - `name` (text) - Campaign name
  - `subject` (text) - Email subject line
  - `preview_text` (text) - Email preview text
  - `status` (text) - Campaign status (draft, scheduled, sent, paused)
  - `email_html` (text) - HTML content of the email
  - `audience_id` (uuid, foreign key) - Target audience segment
  - `scheduled_at` (timestamptz) - When to send the campaign
  - `sent_at` (timestamptz) - When the campaign was sent
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `user_id` (uuid) - Owner of the campaign

  ### `campaign_analytics`
  - `id` (uuid, primary key) - Unique identifier for analytics record
  - `campaign_id` (uuid, foreign key) - Associated campaign
  - `sent_count` (integer) - Number of emails sent
  - `delivered_count` (integer) - Number of emails delivered
  - `opened_count` (integer) - Number of unique opens
  - `clicked_count` (integer) - Number of unique clicks
  - `bounced_count` (integer) - Number of bounces
  - `unsubscribed_count` (integer) - Number of unsubscribes
  - `revenue_generated` (decimal) - Revenue attributed to this campaign
  - `updated_at` (timestamptz) - Last update timestamp
  - `user_id` (uuid) - Owner reference

  ### `subscribers`
  - `id` (uuid, primary key) - Unique identifier for subscriber
  - `email` (text, unique) - Subscriber email address
  - `first_name` (text) - Subscriber first name
  - `last_name` (text) - Subscriber last name
  - `status` (text) - Subscription status (active, unsubscribed, bounced)
  - `tags` (text[]) - Array of tags for segmentation
  - `metadata` (jsonb) - Additional subscriber data
  - `subscribed_at` (timestamptz) - Subscription timestamp
  - `user_id` (uuid) - Owner reference

  ### `revenue_predictions`
  - `id` (uuid, primary key) - Unique identifier
  - `campaign_id` (uuid, foreign key) - Associated campaign
  - `predicted_revenue` (decimal) - Predicted revenue amount
  - `confidence_score` (decimal) - Prediction confidence (0-1)
  - `factors` (jsonb) - Factors influencing the prediction
  - `created_at` (timestamptz) - Prediction timestamp
  - `user_id` (uuid) - Owner reference

  ## 2. Security
  - Enable RLS on all tables
  - Add policies for authenticated users to manage their own data
  - Ensure users can only access their own campaigns, audiences, and analytics

  ## 3. Indexes
  - Add indexes on foreign keys for better query performance
  - Add indexes on frequently queried columns (status, user_id, email)

  ## Important Notes
  - All tables use `gen_random_uuid()` for ID generation
  - Timestamps use `now()` as default value
  - RLS policies enforce data isolation between users
  - Revenue fields use numeric type for precision
*/

-- Create audiences table
CREATE TABLE IF NOT EXISTS audiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  criteria jsonb DEFAULT '{}',
  subscriber_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text NOT NULL,
  preview_text text DEFAULT '',
  status text DEFAULT 'draft',
  email_html text DEFAULT '',
  audience_id uuid REFERENCES audiences(id) ON DELETE SET NULL,
  scheduled_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL
);

-- Create campaign analytics table
CREATE TABLE IF NOT EXISTS campaign_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  sent_count integer DEFAULT 0,
  delivered_count integer DEFAULT 0,
  opened_count integer DEFAULT 0,
  clicked_count integer DEFAULT 0,
  bounced_count integer DEFAULT 0,
  unsubscribed_count integer DEFAULT 0,
  revenue_generated numeric(10, 2) DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL,
  UNIQUE(campaign_id)
);

-- Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  first_name text DEFAULT '',
  last_name text DEFAULT '',
  status text DEFAULT 'active',
  tags text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  subscribed_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL,
  UNIQUE(email, user_id)
);

-- Create revenue predictions table
CREATE TABLE IF NOT EXISTS revenue_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  predicted_revenue numeric(10, 2) DEFAULT 0,
  confidence_score numeric(3, 2) DEFAULT 0,
  factors jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_audiences_user_id ON audiences(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_audience_id ON campaigns(audience_id);
CREATE INDEX IF NOT EXISTS idx_campaign_analytics_campaign_id ON campaign_analytics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_subscribers_user_id ON subscribers(user_id);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers(status);
CREATE INDEX IF NOT EXISTS idx_revenue_predictions_campaign_id ON revenue_predictions(campaign_id);

-- Enable Row Level Security
ALTER TABLE audiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_predictions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for audiences
CREATE POLICY "Users can view own audiences"
  ON audiences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own audiences"
  ON audiences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own audiences"
  ON audiences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own audiences"
  ON audiences FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for campaigns
CREATE POLICY "Users can view own campaigns"
  ON campaigns FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own campaigns"
  ON campaigns FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campaigns"
  ON campaigns FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own campaigns"
  ON campaigns FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for campaign_analytics
CREATE POLICY "Users can view own campaign analytics"
  ON campaign_analytics FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own campaign analytics"
  ON campaign_analytics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campaign analytics"
  ON campaign_analytics FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own campaign analytics"
  ON campaign_analytics FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for subscribers
CREATE POLICY "Users can view own subscribers"
  ON subscribers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscribers"
  ON subscribers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscribers"
  ON subscribers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own subscribers"
  ON subscribers FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for revenue_predictions
CREATE POLICY "Users can view own revenue predictions"
  ON revenue_predictions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own revenue predictions"
  ON revenue_predictions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own revenue predictions"
  ON revenue_predictions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own revenue predictions"
  ON revenue_predictions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);