import { useState } from 'react';
import { supabase } from '../lib/supabase';
import BuddyMascot from './BuddyMascot';
import { Mail, Lock, Sparkles } from 'lucide-react';

interface AuthProps {
  onAuthSuccess: () => void;
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
      }
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BuddyMascot mood="excited" size="large" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-2">
            Marketing Buddy
          </h1>
          <p className="text-gray-600 flex items-center justify-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>Your friendly email marketing companion</span>
            <Sparkles className="w-4 h-4" />
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                isLogin
                  ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                !isLogin
                  ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-start space-x-3">
              <BuddyMascot size="small" mood="happy" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  {isLogin
                    ? "Welcome back! I'm excited to help you create amazing email campaigns."
                    : "Let's get started! I'll help you create campaigns that your subscribers will love."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Built with care for marketers who love results
        </p>
      </div>
    </div>
  );
}
