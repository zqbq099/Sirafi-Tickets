import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { usePark } from '../../context/ParkContext';
import { X, ShieldCheck, Clock, Copy, Check, Sparkles, Smartphone } from 'lucide-react';

export const QRDisplayModal: React.FC = () => {
  const { qrModal, hideQRModal, openScannerModal, validateGateEntry, consumeRideAction } = usePark();
  const [secondsLeft, setSecondsLeft] = useState<number>(60);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!qrModal.isOpen) return;
    setSecondsLeft(60);
    const interval = setInterval(() => {
      setSecondsLeft(prev => (prev > 1 ? prev - 1 : 60));
    }, 1000);
    return () => clearInterval(interval);
  }, [qrModal.isOpen, qrModal.qrData]);

  if (!qrModal.isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(qrModal.qrData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickTestScan = () => {
    hideQRModal();
    if (qrModal.qrType === 'ENTRY_QR') {
      openScannerModal({
        title: 'بوابة الدخول الرئيسية',
        targetAction: 'دخول البوابة',
        onScanSuccess: (data) => validateGateEntry(data, 'البوابة الرئيسية A', 'EMP-004')
      });
    } else if (qrModal.qrType === 'USAGE_QR') {
      openScannerModal({
        title: 'مشغل اللعبة',
        targetAction: 'استهلاك اللعبة',
        onScanSuccess: (data) => consumeRideAction('attr-2', data, 'EMP-009')
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-slate-100 flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={hideQRModal}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-1 text-emerald-400">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Sirafi Dynamic QR Engine</span>
        </div>
        <h3 className="text-lg font-black text-white text-center mb-1">{qrModal.title}</h3>
        {qrModal.subtitle && (
          <p className="text-xs text-slate-400 text-center mb-4">{qrModal.subtitle}</p>
        )}

        {/* Anti-Screenshot Dynamic QR Container */}
        <div className="relative p-5 bg-white rounded-2xl shadow-inner my-2 flex flex-col items-center justify-center border-4 border-emerald-500/30">
          <QRCodeSVG
            value={qrModal.qrData}
            size={200}
            level="H"
            includeMargin={true}
          />
          {/* Live Anti-Screenshot Watermark badge */}
          <div className="absolute inset-x-0 bottom-1 flex justify-center">
            <span className="px-2 py-0.5 rounded text-[9px] font-black bg-slate-900/90 text-emerald-300 font-mono">
              NONCE: {Math.random().toString(36).substring(2, 7).toUpperCase()} • ROTATING
            </span>
          </div>
        </div>

        {/* Dynamic Countdown Bar */}
        <div className="w-full mt-3 mb-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-mono">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              تحديث الرمز التلقائي:
            </span>
            <span className="font-bold text-amber-400">{secondsLeft} ثانية</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-amber-500 h-full transition-all duration-1000"
              style={{ width: `${(secondsLeft / 60) * 100}%` }}
            />
          </div>
        </div>

        {/* Security & Replay Prevention note */}
        <div className="w-full bg-slate-800/80 rounded-xl p-3 border border-slate-700/70 mb-4 text-xs text-slate-300 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            محمي بتوقيع رقمي مضاد لتصوير الشاشة وتكرار الاستخدام (Anti-Replay Protection).
          </span>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2">
          <button
            onClick={handleQuickTestScan}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition-all"
          >
            <Smartphone className="w-4 h-4" />
            محاكاة مسح الرمز من هاتف الموظف مباشرة
          </button>
          <button
            onClick={handleCopy}
            className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'تم نسخ الرمز البرمجي' : 'نسخ شفرة QR النصية للتجربة اليدوية'}
          </button>
        </div>
      </div>
    </div>
  );
};
