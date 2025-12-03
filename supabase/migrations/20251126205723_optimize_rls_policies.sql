/*
  # Optimize RLS Policies for Performance

  ## Overview
  This migration optimizes all Row Level Security (RLS) policies to improve query performance
  at scale by replacing `auth.uid()` with `(select auth.uid())` to prevent re-evaluation
  for each row.

  ## Changes Made

  ### 1. Audiences Table - RLS Policy Optimization
  - Drop and recreate all 4 policies (SELECT, INSERT, UPDATE, DELETE)
  - Replace `auth.uid()` with `(select auth.uid())`

  ### 2. Campaigns Table - RLS Policy Optimization
  - Drop and recreate all 4 policies (SELECT, INSERT, UPDATE, DELETE)
  - Replace `auth.uid()` with `(select auth.uid())`

  ### 3. Campaign Analytics Table - RLS Policy Optimization
  - Drop and recreate all 4 policies (SELECT, INSERT, UPDATE, DELETE)
  - Replace `auth.uid()` with `(select auth.uid())`

  ### 4. Subscribers Table - RLS Policy Optimization
  - Drop and recreate all 4 policies (SELECT, INSERT, UPDATE, DELETE)
  - Replace `auth.uid()` with `(select auth.uid())`

  ### 5. Revenue Predictions Table - RLS Policy Optimization
  - Drop and recreate all 4 policies (SELECT, INSERT, UPDATE, DELETE)
  - Replace `auth.uid()` with `(select auth.uid())`

  ## Performance Impact
  - Eliminates redundant function calls per row
  - `auth.uid()` is now evaluated once per query instead of once per row
  - Significant performance improvement for queries on large datasets

  ## Security
  - No change to security model - policies still enforce the same restrictions
  - Users can still only access their own data
  - RLS remains enabled on all tables

  ## Reference
  See: https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select
*/

-- ============================================================================
-- AUDIENCES TABLE - Optimize RLS Policies
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own audiences" ON audiences;
DROP POLICY IF EXISTS "Users can insert own audiences" ON audiences;
DROP POLICY IF EXISTS "Users can update own audiences" ON audiences;
DROP POLICY IF EXISTS "Users can delete own audiences" ON audiences;

-- Recreate optimized policies
CREATE POLICY "Users can view own audiences"
  ON audiences FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own audiences"
  ON audiences FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own audiences"
  ON audiences FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own audiences"
  ON audiences FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- CAMPAIGNS TABLE - Optimize RLS Policies
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can insert own campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can update own campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can delete own campaigns" ON campaigns;

-- Recreate optimized policies
CREATE POLICY "Users can view own campaigns"
  ON campaigns FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own campaigns"
  ON campaigns FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own campaigns"
  ON campaigns FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own campaigns"
  ON campaigns FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- CAMPAIGN ANALYTICS TABLE - Optimize RLS Policies
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own campaign analytics" ON campaign_analytics;
DROP POLICY IF EXISTS "Users can insert own campaign analytics" ON campaign_analytics;
DROP POLICY IF EXISTS "Users can update own campaign analytics" ON campaign_analytics;
DROP POLICY IF EXISTS "Users can delete own campaign analytics" ON campaign_analytics;

-- Recreate optimized policies
CREATE POLICY "Users can view own campaign analytics"
  ON campaign_analytics FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own campaign analytics"
  ON campaign_analytics FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own campaign analytics"
  ON campaign_analytics FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own campaign analytics"
  ON campaign_analytics FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- SUBSCRIBERS TABLE - Optimize RLS Policies
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own subscribers" ON subscribers;
DROP POLICY IF EXISTS "Users can insert own subscribers" ON subscribers;
DROP POLICY IF EXISTS "Users can update own subscribers" ON subscribers;
DROP POLICY IF EXISTS "Users can delete own subscribers" ON subscribers;

-- Recreate optimized policies
CREATE POLICY "Users can view own subscribers"
  ON subscribers FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own subscribers"
  ON subscribers FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own subscribers"
  ON subscribers FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own subscribers"
  ON subscribers FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- REVENUE PREDICTIONS TABLE - Optimize RLS Policies
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own revenue predictions" ON revenue_predictions;
DROP POLICY IF EXISTS "Users can insert own revenue predictions" ON revenue_predictions;
DROP POLICY IF EXISTS "Users can update own revenue predictions" ON revenue_predictions;
DROP POLICY IF EXISTS "Users can delete own revenue predictions" ON revenue_predictions;

-- Recreate optimized policies
CREATE POLICY "Users can view own revenue predictions"
  ON revenue_predictions FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own revenue predictions"
  ON revenue_predictions FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own revenue predictions"
  ON revenue_predictions FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own revenue predictions"
  ON revenue_predictions FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);
