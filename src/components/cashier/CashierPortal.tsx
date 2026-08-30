import React, { useState } from 'react';
import { usePark } from '../../context/ParkContext';
import { decodeAndVerifyQR, encodeQRPayload, generateNonce } from '../../utils/crypto';
import { 
  Ticket as TicketIcon, 
  QrCode, 
  Coins, 
  Banknote, 
  Printer, 
  Link as LinkIcon, 
  CheckCircle2, 
  AlertCircle, 
  Box, 
  Clock, 
  UserCheck, 
  ScanLine,
  Layers
} from 'lucide-react';

export const CashierPortal: React.FC = () => {
  const { 
    visitor, 
    employees, 
    isOnline, 
    openScannerModal, 
    buyTicketsWithUnits, 
    anonymousCashSale, 
    bindPreprintedRange, 
    showThermalTickets,
    events
  } = usePark();

  const cashier = employees.find(e => e.role === 'cashier') || employees[0];

  const [activeTab, setActiveTab] = useState<'scan_qr' | 'anonymous_cash' | 'preprinted_range'>('scan_qr');
  const [anonCount, setAnonCount] = useState<number>(5);
  const [anonPaymentMethod, setAnonPaymentMethod] = useState<string>('Cash (نقدي)');

  // Pre-printed roll state (Section 8)
  const [preStartSeq, setPreStartSeq] = useState<number>(101);
  const [preEndSeq, setPreEndSeq] = useState<number>(120);
  const [preVisitorId, setPreVisitorId] = useState<string>(visitor.id);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Scan Visitor Purchase QR (Section 7)
  const handleScanPurchaseQR = () => {
    openScannerModal({
      title: 'مسح رمز شراء التذاكر للزائر (Purchase QR)',
      targetAction: 'مسح رمز الشراء',
      onScanSuccess: (data) => {
        const decoded = decodeAndVerifyQR(data);
        if (!decoded.valid || !decoded.payload) {
          return { success: false, title: 'رمز غير صالح', message: decoded.reason || 'فشل التحقق' };
        }
        if (decoded.payload.qrType !== 'PURCHASE_QR') {
          return { success: false, title: 'نوع الرمز غير مطابق', message: 'هذا الرمز ليس رمز شراء تذاكر (Purchase QR)' };
        }

        const count = decoded.payload.ticketsCount || 1;
        try {
          const newTickets = buyTicketsWithUnits(count, true);
          showThermalTickets({
            tickets: newTickets,
            buyerName: visitor.name,
            buyerId: decoded.payload.visitorId,
            totalUnits: count * 25
          });

          setNotification({
            type: 'success',
            message: `تم خصم ${count * 25} وحدة وإصدار ${count} تذكرة ورقية بنجاح للحساب ${decoded.payload.visitorId}`
          });
          return {
            success: true,
            title: 'تم إصدار التذاكر بنجاح',
            message: `تم خصم ${count * 25} وحدة وإصدار ${count} تذكرة للزائر ${visitor.name}`,
            details: {
              mode: isOnline ? 'ONLINE' : 'OFFLINE',
              visitorName: visitor.name,
              remainingUnits: visitor.unitsBalance
            }
          };
        } catch (err: any) {
          return { success: false, title: 'تعذر الشراء', message: err.message };
        }
      }
    });
  };

  // Process Anonymous Cash Sale (Section 9)
  const handleProcessAnonymousSale = (e: React.FormEvent) => {
    e.preventDefault();
    const amountSAR = anonCount * 10; // e.g. 10 SAR per paper ticket
    const issuedTickets = anonymousCashSale(anonCount, amountSAR, cashier.id);

    showThermalTickets({
      tickets: issuedTickets,
      buyerName: 'زائر نقدي (غير مسجل)',
      buyerId: 'ANONYMOUS',
      totalUnits: 0
    });

    setNotification({
      type: 'success',
      message: `تم بيع ${anonCount} تذكرة ورقية نقداً بمبلغ ${amountSAR} ريال وطباعتها بنجاح.`
    });
  };

  // Bind Pre-Printed Batch Range (Section 8)
  const handleBindPreprinted = (e: React.FormEvent) => {
    e.preventDefault();
    const res = bindPreprintedRange(preStartSeq, preEndSeq, preVisitorId, cashier.id);
    if (res.success) {
      setNotification({ type: 'success', message: res.message });
    } else {
      setNotification({ type: 'error', message: res.message });
    }
  };

  const recentCashierEvents = events
    .filter(e => e.eventType === 'UNIT_PURCHASE' || e.eventType === 'TICKET_PURCHASE' || e.eventType === 'ANONYMOUS_SALE' || e.eventType === 'PREPRINTED_LINK')
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between shadow-xl ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/50 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-3 text-xs font-bold">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs opacity-75 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Cashier Station Info & Offline Inventory (Section 13) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400">نقطة الكاشير 🎟️</span>
              <span className="text-xs font-mono text-slate-400">{cashier.id}</span>
            </div>
            <h3 className="text-lg font-black text-white">{cashier.name}</h3>
            <p className="text-xs text-slate-400">{cashier.assignedStation}</p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs flex justify-between text-slate-400">
            <span>عمليات اليوم:</span>
            <strong className="text-white font-mono">{cashier.todayTransactionsCount} عملية</strong>
          </div>
        </div>

        {/* Offline Ticket Inventory (Section 13) */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                <Box className="w-4 h-4 text-blue-400" />
                مخزون التذاكر المخصص (Offline Inventory)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {isOnline ? '🟢 متزامن' : '🟠 معتمد محلياً'}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-white font-mono">
                {cashier.offlineInventoryRemaining}
              </span>
              <span className="text-xs text-slate-400">من {cashier.offlineInventoryAllocated} تذكرة</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full"
                style={{ width: `${(cashier.offlineInventoryRemaining / cashier.offlineInventoryAllocated) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Rapid Print & Hardware Status (Section 0) */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-emerald-400" />
                طابعة التذاكر الحرارية
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                جاهزة 🖨️
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-200">طابعة كاشير سريعة مدمجة</h4>
            <p className="text-xs text-slate-400 mt-1">
              🚫 لا أجهزة خاصة إضافية (تطبع التذاكر المادية المتصلة بالنظام مباشرة)
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-400">
            <span>الورق الحراري:</span>
            <span className="text-emerald-400 font-bold">رول ممتلئ (98%)</span>
          </div>
        </div>
      </div>

      {/* Cashier Operation Tabs */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('scan_qr')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'scan_qr'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" />
            1. مسح رمز الزائر والشراء بالوحدات (Purchase QR)
          </button>

          <button
            onClick={() => setActiveTab('anonymous_cash')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'anonymous_cash'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Banknote className="w-4 h-4" />
            2. البيع النقدي التقليدي لزائر غير مسجل (Anonymous)
          </button>

          <button
            onClick={() => setActiveTab('preprinted_range')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'preprinted_range'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            3. ربط نطاق تذاكر مطبوعة مسبقاً (001–020)
          </button>
        </div>

        {/* Tab 1: Scan Purchase QR (Section 7) */}
        {activeTab === 'scan_qr' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs leading-relaxed text-slate-300">
              <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                <ScanLine className="w-4 h-4 text-emerald-400" />
                آلية شراء التذاكر وطباعتها للزائر المسجل:
              </div>
              يعرض رب الأسرة (V-123765) رمز <strong>Purchase QR</strong> من هاتفه ➔ يقوم الكاشير بمسح الرمز ➔ يتم خصم الوحدات آلياً وإصدار التذاكر وطباعتها على الورق الحراري فوراً.
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleScanPurchaseQR}
                className="w-full sm:w-auto py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition-all"
              >
                <ScanLine className="w-5 h-5" />
                فتح الكاميرا لمسح Purchase QR الخاص بالزائر 📱
              </button>

              <span className="text-xs text-slate-400">أو يمكنك النقر لاختبار المحاكاة الفورية</span>
            </div>
          </div>
        )}

        {/* Tab 2: Anonymous Cash Sale (Section 9) */}
        {activeTab === 'anonymous_cash' && (
          <form onSubmit={handleProcessAnonymousSale} className="space-y-4 max-w-lg">
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
              <strong>نموذج الزائر غير المسجل:</strong> شخص لا يريد استخدام التطبيق أو التسجيل. يصدر الكاشير التذاكر المادية المطبوعة مباشرة تحت حساب <code>Anonymous</code> دون كسر قواعد النظام.
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">عدد التذاكر:</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={anonCount}
                  onChange={(e) => setAnonCount(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">طريقة الدفع:</label>
                <select
                  value={anonPaymentMethod}
                  onChange={(e) => setAnonPaymentMethod(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Cash (نقدي)">نقداً (Cash)</option>
                  <option value="Mada (مدى)">بطاقة مدى (POS)</option>
                  <option value="Apple Pay">Apple Pay</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">الإجمالي المستحق:</span>
              <strong className="text-base text-amber-400 font-black">{anonCount * 10} ر.س</strong>
            </div>

            <button
              type="submit"
              className="py-3 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Printer className="w-4 h-4" />
              تأكيد البيع النقدي وطباعة التذاكر الورقية 🖨️
            </button>
          </form>
        )}

        {/* Tab 3: Pre-Printed Range Binding (Section 8) */}
        {activeTab === 'preprinted_range' && (
          <form onSubmit={handleBindPreprinted} className="space-y-4 max-w-lg">
            <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-200 leading-relaxed">
              <strong>ربط التذاكر المطبوعة مسبقاً (Section 8):</strong> إذا كانت التذاكر الورقية مطبوعة سلفاً في كشك الكاشير، يقوم الموظف بربط النطاق التسلسلي (مثال: من 001 إلى 020) بحساب الزائر الرقمي دون إعادة الطباعة.
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">من رقم التسلسل:</label>
                <input
                  type="number"
                  value={preStartSeq}
                  onChange={(e) => setPreStartSeq(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">إلى رقم التسلسل:</label>
                <input
                  type="number"
                  value={preEndSeq}
                  onChange={(e) => setPreEndSeq(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">هوية الزائر المستلم (Visitor ID):</label>
              <input
                type="text"
                value={preVisitorId}
                onChange={(e) => setPreVisitorId(e.target.value)}
                placeholder="V-123765"
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 transition-all"
            >
              <LinkIcon className="w-4 h-4" />
              ربط نطاق التذاكر المطبوعة بالحساب ({preEndSeq - preStartSeq + 1} تذكرة) 🔗
            </button>
          </form>
        )}
      </div>

      {/* Recent Cashier Events */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-3 text-slate-300 text-xs font-bold">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>آخر عمليات البيع والتحويل المنفذة في هذه النقطة:</span>
        </div>

        <div className="space-y-2">
          {recentCashierEvents.map(evt => (
            <div
              key={evt.id}
              className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-bold text-white">{evt.notes}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {evt.timestamp} • {evt.validationMode === 'ONLINE' ? '🟢 Online' : '🟠 Offline'} • {evt.id}
                </div>
              </div>
              <span className="px-2 py-0.5 bg-slate-800 text-emerald-300 rounded font-bold font-mono text-[10px]">
                {evt.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
