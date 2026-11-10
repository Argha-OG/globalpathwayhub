'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  FaArrowRightArrowLeft,
  FaCoins,
  FaChevronDown,
  FaRotate,
  FaCheck,
  FaCircleDot,
} from 'react-icons/fa6';
import GlassCard from '@/components/GlassCard';

export interface CurrencyMeta {
  code: 'USD' | 'EUR' | 'MYR' | 'BDT';
  name: string;
  symbol: string;
  flag: string;
}

export const CURRENCIES: Record<string, CurrencyMeta> = {
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  MYR: { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
  BDT: { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', flag: '🇧🇩' },
};

const CODES = ['USD', 'EUR', 'MYR', 'BDT'] as const;
type CurrencyCode = typeof CODES[number];

export default function CurrencyConverterNav() {
  const [open, setOpen] = useState(false);
  const [rates, setRates] = useState<Record<string, number>>({
    USD: 1,
    EUR: 0.893,
    MYR: 4.059,
    BDT: 124.25,
  });
  const [baseCurrency, setBaseCurrency] = useState<CurrencyCode>('USD');
  const [targetCurrency, setTargetCurrency] = useState<CurrencyCode>('BDT');
  const [amount, setAmount] = useState<string>('1000');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch exchange rates from our internal Frankfurter-backed API
  const fetchRates = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/currency?base=USD');
      if (res.ok) {
        const data = await res.json();
        if (data.rates) {
          setRates(data.rates);
        }
        if (data.date) {
          setLastUpdated(data.date);
        }
      }
    } catch (e) {
      console.warn('Could not refresh currency rates:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Convert amount between baseCurrency and targetCurrency
  const numericAmount = parseFloat(amount.replace(/,/g, '')) || 0;

  // Since all rates are relative to USD:
  // 1 USD = rates[currency]
  const fromRateInUSD = rates[baseCurrency] || 1;
  const toRateInUSD = rates[targetCurrency] || 1;
  // (Amount in From) / fromRateInUSD = Amount in USD
  // (Amount in USD) * toRateInUSD = Amount in To
  const convertedValue = (numericAmount / fromRateInUSD) * toRateInUSD;

  const handleSwap = () => {
    const prevBase = baseCurrency;
    setBaseCurrency(targetCurrency);
    setTargetCurrency(prevBase);
  };

  const handleAmountPreset = (added: number) => {
    const current = parseFloat(amount.replace(/,/g, '')) || 0;
    setAmount(String(current + added));
  };

  const formatRate = (rate: number) => {
    if (rate >= 100) return rate.toFixed(1);
    if (rate >= 1) return rate.toFixed(3);
    return rate.toFixed(4);
  };

  const formatOutput = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button inside Navbar */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${
          open
            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
            : 'bg-white/80 hover:bg-white text-slate-700 border-slate-200/80 shadow-xs'
        }`}
        title="Live Currency Converter (USD, EUR, MYR, BDT via Frankfurter & ECB)"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-sm leading-none">{CURRENCIES[baseCurrency]?.flag}</span>
        <span className="font-extrabold tracking-tight">{baseCurrency}</span>
        <span className="text-slate-400 font-normal">/</span>
        <span className="text-slate-600 font-semibold">{CURRENCIES[targetCurrency]?.symbol}</span>
        <FaChevronDown
          className={`h-2.5 w-2.5 transition-transform duration-200 ${
            open ? 'rotate-180 text-white' : 'text-slate-400'
          }`}
        />
      </button>

      {/* Floating Currency Conversion Popover */}
      {open && (
        <div className="absolute right-0 mt-3 w-[340px] sm:w-[380px] z-50 animate-in fade-in zoom-in-95 duration-200">
          <GlassCard className="p-5 bg-white/95 backdrop-blur-2xl border border-blue-100 shadow-2xl rounded-3xl text-slate-800 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-blue-100 text-blue-700">
                  <FaCoins className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Currency Converter
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Frankfurter &bull; European Central Bank
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={fetchRates}
                disabled={loading}
                title="Refresh Live Rates"
                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <FaRotate className={`h-3 w-3 ${loading ? 'animate-spin text-blue-600' : ''}`} />
              </button>
            </div>

            {/* Live Exchange Rate Chips relative to USD */}
            <div className="grid grid-cols-4 gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
              {CODES.map((code) => {
                const isSelected = baseCurrency === code;
                const rateFromUsd = rates[code] || 1;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setBaseCurrency(code)}
                    className={`py-1.5 px-1 rounded-xl text-center transition-all ${
                      isSelected
                        ? 'bg-white shadow-xs border border-blue-200 text-blue-700 font-black'
                        : 'text-slate-600 hover:bg-white/60 font-semibold'
                    }`}
                  >
                    <div className="text-xs">{CURRENCIES[code].flag}</div>
                    <div className="text-[11px] leading-tight">{code}</div>
                    <div className="text-[9px] text-slate-400 font-mono">
                      {code === 'USD' ? '$1.00' : `${CURRENCIES[code].symbol}${formatRate(rateFromUsd)}`}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Interactive Calculator */}
            <div className="space-y-3 pt-1">
              {/* From Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex justify-between">
                  <span>You Convert</span>
                  <span>{CURRENCIES[baseCurrency]?.name}</span>
                </label>
                <div className="flex items-center gap-2 bg-slate-50 rounded-2xl border border-slate-200 p-2 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500">
                  <span className="text-slate-400 font-bold text-sm pl-1">
                    {CURRENCIES[baseCurrency]?.symbol}
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="1000"
                    min="0"
                    step="any"
                    className="w-full bg-transparent font-bold text-base text-slate-900 outline-none"
                  />
                  <select
                    value={baseCurrency}
                    onChange={(e) => setBaseCurrency(e.target.value as CurrencyCode)}
                    className="bg-white border border-slate-200 rounded-xl px-2 py-1 text-xs font-bold text-slate-800 outline-none cursor-pointer shadow-xs"
                  >
                    {CODES.map((c) => (
                      <option key={c} value={c}>
                        {CURRENCIES[c].flag} {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center -my-1 relative z-10">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="p-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 shadow-xs transition-transform hover:rotate-180 duration-300"
                  title="Swap currencies"
                >
                  <FaArrowRightArrowLeft className="h-3 w-3" />
                </button>
              </div>

              {/* To Result */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex justify-between">
                  <span>Estimated Total</span>
                  <span>{CURRENCIES[targetCurrency]?.name}</span>
                </label>
                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-2">
                  <span className="text-blue-700 font-bold text-sm pl-1">
                    {CURRENCIES[targetCurrency]?.symbol}
                  </span>
                  <div className="w-full font-black text-lg text-blue-900 truncate">
                    {formatOutput(convertedValue)}
                  </div>
                  <select
                    value={targetCurrency}
                    onChange={(e) => setTargetCurrency(e.target.value as CurrencyCode)}
                    className="bg-white border border-blue-200 rounded-xl px-2 py-1 text-xs font-bold text-blue-900 outline-none cursor-pointer shadow-xs"
                  >
                    {CODES.map((c) => (
                      <option key={c} value={c}>
                        {CURRENCIES[c].flag} {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 font-semibold mr-1">Quick:</span>
                {[100, 500, 1000, 5000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(String(preset))}
                    className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] transition-colors"
                  >
                    {CURRENCIES[baseCurrency]?.symbol}{preset.toLocaleString()}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setAmount('1000')}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 font-medium text-[10px] transition-colors ml-auto"
                >
                  Reset
                </button>
              </div>

              {/* Single Unit Exchange Rate footnote */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                <span>
                  1 {baseCurrency} ={' '}
                  <strong className="text-slate-800">
                    {CURRENCIES[targetCurrency]?.symbol}
                    {formatRate((1 / fromRateInUSD) * toRateInUSD)} {targetCurrency}
                  </strong>
                </span>
                <span className="text-slate-400">
                  {lastUpdated ? `Updated ${lastUpdated}` : 'Live'}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}

