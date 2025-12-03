import { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface BuddyMascotProps {
  mood?: 'happy' | 'excited' | 'thinking' | 'celebrating';
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function BuddyMascot({ mood = 'happy', message, size = 'medium' }: BuddyMascotProps) {
  const [bounce, setBounce] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    if (mood === 'excited' || mood === 'celebrating') {
      const interval = setInterval(() => {
        setBounce(true);
        setShowSparkles(true);
        setTimeout(() => {
          setBounce(false);
          setShowSparkles(false);
        }, 500);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [mood]);

  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-32 h-32'
  };

  const eyeSize = {
    small: 'w-1.5 h-1.5',
    medium: 'w-2 h-2',
    large: 'w-3 h-3'
  };

  return (
    <div className="relative inline-flex flex-col items-center">
      <div className={`relative ${bounce ? 'animate-bounce' : ''}`}>
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-amber-400 via-orange-400 to-pink-400 shadow-lg flex items-center justify-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>

          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="flex space-x-2 mb-1">
              <div className={`${eyeSize[size]} rounded-full bg-gray-800 ${mood === 'thinking' ? 'animate-pulse' : ''}`}>
                <div className="w-1 h-1 bg-white rounded-full mt-0.5 ml-0.5"></div>
              </div>
              <div className={`${eyeSize[size]} rounded-full bg-gray-800 ${mood === 'thinking' ? 'animate-pulse' : ''}`}>
                <div className="w-1 h-1 bg-white rounded-full mt-0.5 ml-0.5"></div>
              </div>
            </div>

            {mood === 'happy' || mood === 'excited' ? (
              <div className={`${size === 'small' ? 'w-3 h-1.5' : size === 'medium' ? 'w-4 h-2' : 'w-6 h-3'} border-b-2 border-gray-800 rounded-full`}></div>
            ) : mood === 'celebrating' ? (
              <div className="flex items-center">
                <Heart className={`${size === 'small' ? 'w-2 h-2' : size === 'medium' ? 'w-3 h-3' : 'w-4 h-4'} text-red-500`} fill="currentColor" />
              </div>
            ) : (
              <div className={`${size === 'small' ? 'w-3 h-1' : size === 'medium' ? 'w-4 h-1.5' : 'w-6 h-2'} bg-gray-800 rounded-full`}></div>
            )}
          </div>
        </div>

        {showSparkles && (
          <>
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-ping" />
            <Sparkles className="absolute -bottom-1 -left-1 w-3 h-3 text-pink-400 animate-ping" />
          </>
        )}
      </div>

      {message && (
        <div className="mt-2 bg-white rounded-lg shadow-md px-3 py-2 text-sm text-gray-700 max-w-xs relative">
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
          {message}
        </div>
      )}
    </div>
  );
}
