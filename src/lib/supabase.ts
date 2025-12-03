import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Audience {
  id: string;
  name: string;
  description: string;
  criteria: Record<string, any>;
  subscriber_count: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  preview_text: string;
  status: 'draft' | 'scheduled' | 'sent' | 'paused';
  email_html: string;
  audience_id: string | null;
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface CampaignAnalytics {
  id: string;
  campaign_id: string;
  sent_count: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  bounced_count: number;
  unsubscribed_count: number;
  revenue_generated: number;
  updated_at: string;
  user_id: string;
}

export interface Subscriber {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  tags: string[];
  metadata: Record<string, any>;
  subscribed_at: string;
  user_id: string;
}

export interface RevenuePrediction {
  id: string;
  campaign_id: string;
  predicted_revenue: number;
  confidence_score: number;
  factors: Record<string, any>;
  created_at: string;
  user_id: string;
}
