"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://btc-kalshi-bot.onrender.com";

export default function Dashboard() {
  const [signal, setSignal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSignal = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/signal`);
        setSignal(response.data);
      } catch (err) {
        setError("Failed to fetch signal");
      } finally {
        setLoading(false);
      }
    };

    fetchSignal();
    const interval = setInterval(fetchSignal, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Bitcoin Kalshi Trading Bot</h1>
        <p className="text-slate-400 mb-8">Real-time 15-minute prediction engine</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-700 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Current Signal</h2>
            {signal && (
              <div>
                <div className={`text-3xl font-bold mb-2 ${signal.direction === 'UP' ? 'text-green-500' : 'text-red-500'}`}>
                  {signal.direction}
                </div>
                <p className="text-slate-300">Confidence: {(signal.confidence * 100).toFixed(1)}%</p>
                <p className="text-slate-300">Price: ${signal.current_price}</p>
              </div>
            )}
          </div>
          
          <div className="bg-slate-700 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Indicators</h2>
            {signal && (
              <div className="space-y-2 text-sm">
                <p>RSI: {signal.rsi?.toFixed(2) || 'N/A'}</p>
                <p>EMA: {signal.ema?.toFixed(2) || 'N/A'}</p>
                <p>Momentum: {signal.momentum?.toFixed(2) || 'N/A'}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-slate-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <p className="text-green-500">✓ Bot is running</p>
          <p className="text-slate-300 mt-2 text-sm">Updates every 15 minutes</p>
        </div>
      </div>
    </div>
  );
}
