import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { usePark } from '../../context/ParkContext';
import { X, Printer, CheckCircle2, Ticket as TicketIcon } from 'lucide-react';

export const ThermalTicketModal: React.FC = () => {
  const { thermalModal, closeThermalModal } = usePark();

  if (!thermalModal.isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">معاينة الطباعة الحرارية للتذاكر</h3>
              <p className="text-xs text-slate-400">تذاكر ورقية مرتبطة رقمياً بالنظام (Digital-to-Paper)</p>
            </div>
          </div>
          <button
            onClick={closeThermalModal}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Receipt Area */}
        <div className="my-4 overflow-y-auto pr-1 flex flex-col items-center gap-4">
          {thermalModal.tickets.map((ticket, idx) => (
            <div
              key={ticket.id}
              className="w-full max-w-xs bg-amber-50 text-slate-900 rounded-xl p-5 shadow-lg border border-amber-200/80 font-mono text-xs flex flex-col relative overflow-hidden"
              style={{
                backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
                backgroundSize: '16px 16px'
              }}
            >
              {/* Top Serrated Edge Decoration */}
              <div className="absolute top-0 inset-x-0 h-2 bg-slate-900 flex justify-between">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-3 h-2 bg-amber-50 rounded-b-full -mt-1" />
                ))}
              </div>

              {/* Park Branding */}
              <div className="text-center pt-2 pb-3 border-b border-dashed border-slate-400">
                <h4 className="text-sm font-black tracking-tight font-sans text-slate-900">
                  حدائق وملاهي سيرافي
                </h4>
                <p className="text-[10px] text-slate-600 font-sans">SIRAFI THEME & ADVENTURE PARK</p>
                <div className="inline-block mt-1 px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-bold">
                  تذكرة دخول / ألعاب رسمية
                </div>
              </div>

              {/* Ticket Details */}
              <div className="py-3 space-y-1.5 border-b border-dashed border-slate-400 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-600 font-sans">رقم التذكرة:</span>
                  <span className="font-bold text-emerald-800 font-mono">{ticket.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-sans">هوية الزائر:</span>
                  <span className="font-bold font-mono">{thermalModal.buyerId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-sans">الاسم:</span>
                  <span className="font-bold font-sans">{thermalModal.buyerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-sans">وقت الإصدار:</span>
                  <span className="font-mono">{ticket.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-sans">الرقم التسلسلي الورقي:</span>
                  <span className="font-mono text-[9px]">{ticket.paperSerialNumber || `SRF-${ticket.id}`}</span>
                </div>
              </div>

              {/* QR and Barcode */}
              <div className="py-3 flex flex-col items-center justify-center">
                <div className="p-2 bg-white rounded border border-slate-300 shadow-sm mb-2">
                  <QRCodeSVG
                    value={JSON.stringify({
                      qrType: 'USAGE_OR_ENTRY',
                      ticketId: ticket.id,
                      visitorId: thermalModal.buyerId,
                      token: ticket.signatureToken
                    })}
                    size={110}
                    level="M"
                  />
                </div>
                <span className="text-[9px] font-mono tracking-widest text-slate-700">
                  *{ticket.id}*
                </span>
              </div>

              {/* Security Verification & Tear Line */}
              <div className="pt-2 border-t border-dashed border-slate-400 text-center text-[8px] text-slate-500 space-y-0.5">
                <p>تذكرة مؤمنة برمز تحقق رقمي مشفر</p>
                <p className="font-mono font-bold text-slate-800">AUTH: {ticket.signatureToken.substring(0, 16)}...</p>
                <p className="font-sans">صالحة للاستخدام لمرة واحدة فقط • يمنع تصويرها</p>
              </div>

              {/* Bottom Serrated Edge */}
              <div className="absolute bottom-0 inset-x-0 h-2 bg-slate-900 flex justify-between">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-3 h-2 bg-amber-50 rounded-t-full mt-1" />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-slate-800 flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20"
          >
            <Printer className="w-4 h-4" />
            طباعة عبر طابعة الكاشير السريعة ({thermalModal.tickets.length} تذكرة)
          </button>
          <button
            onClick={closeThermalModal}
            className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
