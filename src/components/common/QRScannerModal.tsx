import React, { useState } from 'react';
import { usePark } from '../../context/ParkContext';
import { encodeQRPayload, generateNonce } from '../../utils/crypto';
import { 
  X, 
  ScanLine, 
  CheckCircle2, 
  AlertOctagon, 
  ArrowRight, 
  KeyRound,
  Zap,
  Ticket as TicketIcon
} from 'lucide-react';

export const QRScannerModal: React.FC = () => {
  const { scannerModal, closeScannerModal, visitor, tickets, attractions, isOnline } = usePark();
  const [manualCode, setManualCode] = useState('');
  const [scanResult, setScanResult] = useState<{
    show: boolean;
    success: boolean;
    title: string;
    message: string;
    details?: any;
  } | null>(null);

  if (!scannerModal.isOpen) return null;

  const handleProcessScan = (codeToProcess: string) => {
    try {
      const res = scannerModal.onScanSuccess(codeToProcess) as any;
      if (res && typeof res === 'object') {
        setScanResult({
          show: true,
          success: res.success,
          title: res.title,
          message: res.message,
          details: res.details
        });
      } else {
        setScanResult({
          show: true,
          success: true,
          title: 'تمت العملية بنجاح',
          message: 'تمت معالجة رمز الاستجابة بنجاح.'
        });
      }
    } catch (err: any) {
      setScanResult({
        show: true,
        success: false,
        title: 'فشلت المعالجة',
        message: err.message || 'حدث خطأ أثناء معالجة الرمز'
      });
    }
  };

  // Quick 1-Click test shortcuts
  const handleQuickPayload = (scenario: 'ahmed_ticket' | 'entry_family' | 'direct_units' | 'purchase_20' | 'fake_replay') => {
    if (scenario === 'ahmed_ticket') {
      const payload = encodeQRPayload({
        qrType: 'USAGE_QR',
        visitorId: visitor.id,
        ticketId: 'T-000182',
        familyMemberId: 'mem-3',
        timestamp: Date.now(),
        nonce: generateNonce()
      });
      handleProcessScan(payload);
    } else if (scenario === 'entry_family') {
      const payload = encodeQRPayload({
        qrType: 'ENTRY_QR',
        visitorId: visitor.id,
        ticketId: 'T-000180',
        familyMemberId: 'mem-1',
        timestamp: Date.now(),
        nonce: generateNonce()
      });
      handleProcessScan(payload);
    } else if (scenario === 'direct_units') {
      const payload = encodeQRPayload({
        qrType: 'USAGE_QR',
        visitorId: visitor.id,
        attractionId: scannerModal.targetAttractionId || 'attr-2',
        timestamp: Date.now(),
        nonce: generateNonce()
      });
      handleProcessScan(payload);
    } else if (scenario === 'purchase_20') {
      const payload = encodeQRPayload({
        qrType: 'PURCHASE_QR',
        visitorId: visitor.id,
        ticketsCount: 20,
        unitsAmount: 500,
        timestamp: Date.now(),
        nonce: generateNonce()
      });
      handleProcessScan(payload);
    } else if (scenario === 'fake_replay') {
      // Intentionally forged or replay token
      handleProcessScan(JSON.stringify({
        qrType: 'USAGE_QR',
        visitorId: 'V-HACKER-99',
        ticketId: 'T-000182',
        timestamp: Date.now() - 600000, // expired 10 mins ago
        nonce: 'STOLEN-NONCE',
        signature: 'INVALID_FORGED_SIGNATURE'
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{scannerModal.title}</h3>
              <p className="text-xs text-slate-400 font-mono">
                {isOnline ? '🟢 وضع التحقق المباشر (Online)' : '🟠 وضع التحقق المحلي (Offline)'}
              </p>
            </div>
          </div>
          <button
            onClick={closeScannerModal}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Scanner Simulation */}
        <div className="relative my-4 aspect-square max-h-56 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center">
          {/* Animated Laser Scanning Line */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-bounce" />

          {/* Viewfinder Target Reticle */}
          <div className="w-36 h-36 border-2 border-dashed border-emerald-500/60 rounded-2xl flex items-center justify-center">
            <ScanLine className="w-12 h-12 text-emerald-500/40 animate-pulse" />
          </div>

          <span className="mt-3 text-xs text-slate-400 font-medium">
            وجّه كاميرا الهاتف نحو رمز QR الزائر
          </span>
        </div>

        {/* Scan Result Overlay (if evaluated) */}
        {scanResult?.show && (
          <div
            className={`p-4 rounded-2xl mb-4 border transition-all ${
              scanResult.success
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                : 'bg-rose-950/80 border-rose-500/50 text-rose-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {scanResult.success ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertOctagon className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h4 className="font-bold text-sm text-white">{scanResult.title}</h4>
                <p className="text-xs mt-1 leading-relaxed">{scanResult.message}</p>

                {scanResult.details && (
                  <div className="mt-2 pt-2 border-t border-slate-700/60 text-[11px] grid grid-cols-2 gap-1 font-mono">
                    {scanResult.details.ticketId && <div>التذكرة: {scanResult.details.ticketId}</div>}
                    {scanResult.details.familyMemberName && <div>الفرد: {scanResult.details.familyMemberName}</div>}
                    {scanResult.details.mode && <div>الوضع: {scanResult.details.mode}</div>}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick 1-Click Simulation Buttons (To test without multiple physical devices) */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-slate-400">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>محاكاة مسح سيناريوهات فورية (اختبار سريع):</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickPayload('ahmed_ticket')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-right flex items-center justify-between"
            >
              <span>🎟️ تذكرة أحمد (T-000182)</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
            <button
              onClick={() => handleQuickPayload('entry_family')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-right flex items-center justify-between"
            >
              <span>🚪 دخول الأب (T-000180)</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
            <button
              onClick={() => handleQuickPayload('direct_units')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-right flex items-center justify-between"
            >
              <span>🪙 خصم وحدات مباشر</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
            <button
              onClick={() => handleQuickPayload('fake_replay')}
              className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 border border-rose-800/40 text-right flex items-center justify-between"
            >
              <span>⛔ اختبار رمز مزيف / مكرر</span>
              <ArrowRight className="w-3 h-3 text-rose-400" />
            </button>
          </div>
        </div>

        {/* Manual Code / Barcode Input */}
        <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="أو أدخل رقم التذكرة يدوياً (مثال: T-000182)"
              className="w-full pl-3 pr-8 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
            <TicketIcon className="w-4 h-4 text-slate-500 absolute right-2.5 top-2.5" />
          </div>
          <button
            onClick={() => {
              if (manualCode.trim()) {
                handleProcessScan(manualCode.trim());
              }
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shrink-0"
          >
            تحقق
          </button>
        </div>
      </div>
    </div>
  );
};
