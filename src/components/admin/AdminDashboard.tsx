import React, { useState } from 'react';
import { usePark } from '../../context/ParkContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  BarChart3, 
  Coins, 
  Ticket as TicketIcon, 
  Users, 
  Gamepad2, 
  ShieldCheck, 
  RefreshCw, 
  Layers, 
  Database, 
  Search, 
  FileText, 
  Lock, 
  CheckCircle2, 
  Clock, 
  Flame,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    events, 
    attractions, 
    visitor, 
    tickets, 
    employees, 
    offlineSyncQueue, 
    syncOfflineQueueManually,
    isOnline,
    testReplayAttack 
  } = usePark();

  const [auditFilter, setAuditFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLedgerTab, setActiveLedgerTab] = useState<'all' | 'payment' | 'unit' | 'ticket'>('all');

  // Prepare chart data for attraction usage (Section 25)
  const attractionChartData = (attractions || []).map(attr => ({
    name: attr.nameAr,
    rides: attr.totalRidesToday,
    queue: attr.currentQueue,
    units: attr.priceUnits
  }));

  // Hourly peak congestion mock data (Section 25)
  const hourlyPeakData = [
    { hour: '17:00', visitors: 120, rides: 210 },
    { hour: '18:00', visitors: 280, rides: 450 },
    { hour: '19:00', visitors: 490, rides: 820 },
    { hour: '20:00', visitors: 680, rides: 1240 },
    { hour: '21:00', visitors: 850, rides: 1590 },
    { hour: '22:00', visitors: 790, rides: 1410 },
    { hour: '23:00', visitors: 510, rides: 890 },
  ];

  // Financial Ledger calculations (Section 28)
  const totalRevenueSAR = (events || [])
    .filter(e => e.amountSAR && e.amountSAR > 0)
    .reduce((sum, e) => sum + (e.amountSAR || 0), 0) + 14500;

  const totalUnitsMinted = (events || [])
    .filter(e => e.eventType === 'UNIT_PURCHASE' && e.unitsAmount)
    .reduce((sum, e) => sum + (e.unitsAmount || 0), 0) + 72500;

  const totalUnitsConsumed = (events || [])
    .filter(e => (e.eventType === 'RIDE_USAGE' || e.eventType === 'TICKET_PURCHASE') && e.unitsAmount)
    .reduce((sum, e) => sum + (e.unitsAmount || 0), 0) + 48200;

  const filteredEvents = (events || []).filter(e => {
    if (auditFilter !== 'ALL' && e.eventType !== auditFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const text = `${e.visitorId} ${e.visitorName} ${e.ticketId || ''} ${e.notes} ${e.id}`.toLowerCase();
      return text.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Executive Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Revenue Card */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                إيرادات المبيعات (SAR)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Payment</span>
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {totalRevenueSAR.toLocaleString()} <span className="text-xs text-slate-400">ر.س</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
            <span>مبيعات الكاشير والتطبيق</span>
            <span className="text-emerald-400 font-bold">100% مدققة</span>
          </div>
        </div>

        {/* Units Minted vs Consumed */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" />
                وحدات الحديقة النشطة 🪙
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Unit Ledger</span>
            </div>
            <div className="text-2xl font-black text-amber-300 font-mono">
              {totalUnitsMinted.toLocaleString()} <span className="text-xs text-amber-500">وحدة</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
            <span>المستهلك في الألعاب:</span>
            <span className="text-white font-mono">{totalUnitsConsumed.toLocaleString()}</span>
          </div>
        </div>

        {/* Total Tickets Managed */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
                <TicketIcon className="w-3.5 h-3.5" />
                إجمالي التذاكر الصادرة
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Ticket Ledger</span>
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {tickets.length + 1840} <span className="text-xs text-slate-400">تذكرة</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
            <span>النموذج الهجين:</span>
            <span className="text-blue-300 font-bold">رقمية + ورقية</span>
          </div>
        </div>

        {/* Offline Sync State */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-400 flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" />
                مزامنة البيانات (Sync Queue)
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-400">
                {isOnline ? '🟢 Online' : '🟠 Offline'}
              </span>
            </div>
            <div className="text-2xl font-black text-white font-mono flex items-center gap-2">
              {offlineSyncQueue.length}
              <span className="text-xs text-slate-400">عمليات معلقة</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">خوارزمية Idempotent</span>
            {offlineSyncQueue.length > 0 && (
              <button
                onClick={syncOfflineQueueManually}
                className="text-[10px] px-2 py-0.5 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold"
              >
                مزامنة فورية 🔄
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Analytics & Crowding Charts Section (Section 25) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Attraction Usage Chart */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-black text-white">
                تحليل ازدحام واستخدام الألعاب (Attraction Throughput)
              </h3>
            </div>
            <span className="text-[10px] text-slate-400">بيانات لحظية</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attractionChartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#94a3b8', fontSize: 10 }} 
                  interval={0} 
                  angle={-15} 
                  textAnchor="end" 
                />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} 
                  labelStyle={{ color: '#ffffff', fontWeight: 'bold' }} 
                />
                <Bar dataKey="rides" name="عدد الجولات اليوم" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="queue" name="طابور الانتظار الحالي" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Peak Flow Chart */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-black text-white">
                ساعات الذروة والتدفق الزمني (Hourly Peak Distribution)
              </h3>
            </div>
            <span className="text-[10px] text-slate-400">ساعة بساعة</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyPeakData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <defs>
                  <linearGradient id="colorRides" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="hour" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} 
                  labelStyle={{ color: '#ffffff', fontWeight: 'bold' }} 
                />
                <Area type="monotone" dataKey="rides" name="استخدام الألعاب" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorRides)" />
                <Area type="monotone" dataKey="visitors" name="دخول الزوار" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVisitors)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Triple Financial Accounting Architecture (Section 28) */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-black text-white">
                هندسة المحاسبة الثلاثية المفصولة (Triple Ledger Separation - Section 28)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              فصل صارم بين سجل المدفوعات المالية وسجل الوحدات وسجل التذاكر لضمان التدقيق المالي الكامل
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveLedgerTab('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeLedgerTab === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setActiveLedgerTab('payment')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeLedgerTab === 'payment' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60' : 'text-slate-400'
              }`}
            >
              1. سجل الدفع (Payment)
            </button>
            <button
              onClick={() => setActiveLedgerTab('unit')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeLedgerTab === 'unit' ? 'bg-amber-950 text-amber-300 border border-amber-800/60' : 'text-slate-400'
              }`}
            >
              2. سجل الوحدات (Units)
            </button>
            <button
              onClick={() => setActiveLedgerTab('ticket')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeLedgerTab === 'ticket' ? 'bg-blue-950 text-blue-300 border border-blue-800/60' : 'text-slate-400'
              }`}
            >
              3. سجل التذاكر (Tickets)
            </button>
          </div>
        </div>

        {/* Three Ledgers Visual Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>1. Payment Ledger (المال الحقيقي)</span>
              <span className="font-mono">SAR</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              يسجل الأموال النقدية والبطاقات (مدى / Apple Pay). لا يتعامل مع التذاكر مباشرة.
            </p>
            <div className="pt-2 border-t border-slate-900 flex justify-between text-xs font-mono">
              <span className="text-slate-400">الرصيد المالي:</span>
              <strong className="text-white">+{totalRevenueSAR.toLocaleString()} ر.س</strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-amber-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-amber-400">
              <span>2. Unit Ledger (رصيد الحديقة الداخلي)</span>
              <span className="font-mono">🪙 UNITS</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              يسجل توليد الوحدات (+500 وحدة) وخصمها عند شراء التذاكر أو الألعاب.
            </p>
            <div className="pt-2 border-t border-slate-900 flex justify-between text-xs font-mono">
              <span className="text-slate-400">صافي الرصيد:</span>
              <strong className="text-amber-300 font-bold">+{(totalUnitsMinted - totalUnitsConsumed).toLocaleString()} وحدة</strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-blue-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-blue-400">
              <span>3. Ticket Ledger (حالات التذاكر)</span>
              <span className="font-mono">🎟️ TICKETS</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              يسجل إصدار التذاكر الفردية، والتحقق عند البوابة (Validated)، واستهلاكها في الألعاب (Consumed).
            </p>
            <div className="pt-2 border-t border-slate-900 flex justify-between text-xs font-mono">
              <span className="text-slate-400">التذاكر النشطة:</span>
              <strong className="text-blue-300 font-bold">{tickets.filter(t => t.status !== 'CONSUMED').length} تذكرة</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Staff & Offline Quota Inventory Table (Section 27) */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-xs font-bold text-slate-300">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>إدارة الموظفين والمخزون المخصص للوضع غير المتصل (Employee Offline Quota):</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">المعرف</th>
                <th className="py-2.5 px-3">الاسم</th>
                <th className="py-2.5 px-3">الدور الوظيفي</th>
                <th className="py-2.5 px-3">المحطة</th>
                <th className="py-2.5 px-3">مخزون الأوفلاين المتبقي</th>
                <th className="py-2.5 px-3">عمليات اليوم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {employees.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-950/60">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-300">{emp.id}</td>
                  <td className="py-2.5 px-3 font-bold text-white">{emp.name}</td>
                  <td className="py-2.5 px-3 text-slate-400">{emp.roleTitleAr}</td>
                  <td className="py-2.5 px-3 text-slate-300">{emp.assignedStation}</td>
                  <td className="py-2.5 px-3 font-mono">
                    {emp.offlineInventoryAllocated > 0 ? (
                      <span className="font-bold text-blue-400">
                        {emp.offlineInventoryRemaining} / {emp.offlineInventoryAllocated}
                      </span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">
                    {emp.todayTransactionsCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Immutable Event Audit Ledger (Section 19 & 29) */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-black text-white">
                سجل التدقيق الرقمي للأحداث (Immutable Event Ledger - Section 19 & 29)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              كل استخدام أو تحويل يولد حدثاً لا يمكن تعديله مع التوقيع الرقمي لمنع التلاعب
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث في السجل..."
                className="pl-3 pr-8 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5" />
            </div>

            <select
              value={auditFilter}
              onChange={(e) => setAuditFilter(e.target.value)}
              className="p-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none"
            >
              <option value="ALL">جميع الأحداث</option>
              <option value="UNIT_PURCHASE">شراء وحدات</option>
              <option value="TICKET_PURCHASE">شراء تذاكر</option>
              <option value="GATE_ENTRY">دخول البوابة</option>
              <option value="RIDE_USAGE">استخدام الألعاب</option>
              <option value="ANONYMOUS_SALE">بيع نقدي مجهول</option>
              <option value="PREPRINTED_LINK">ربط تذاكر مطبوعة</option>
              <option value="MISSING_CHILD_ALERT">طوارئ السلامة</option>
              <option value="DOUBLE_SPEND_BLOCKED">محاولات محجوبة</option>
            </select>
          </div>
        </div>

        {/* Ledger Event List */}
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {filteredEvents.map(evt => {
            const isBlocked = evt.status === 'BLOCKED' || evt.status === 'FLAGGED';
            return (
              <div
                key={evt.id}
                className={`p-3 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all ${
                  isBlocked
                    ? 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                    : 'bg-slate-950 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">{evt.id}</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 font-mono text-[10px] text-slate-400 font-bold">
                      {evt.eventType}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">{evt.timestamp}</span>
                  </div>
                  <div className="text-white font-medium">{evt.notes}</div>
                  <div className="text-[10px] text-slate-500 font-mono flex gap-3">
                    <span>الزائر: {evt.visitorId}</span>
                    {evt.ticketId && <span>التذكرة: {evt.ticketId}</span>}
                    {evt.employeeName && <span>الموظف: {evt.employeeName}</span>}
                    <span className="text-slate-600 truncate">SIG: {evt.signatureHash}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      evt.validationMode === 'ONLINE'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                        : 'bg-amber-950 text-amber-300 border border-amber-800/40'
                    }`}
                  >
                    {evt.validationMode}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isBlocked ? 'bg-rose-900 text-white' : 'bg-slate-800 text-emerald-400'
                    }`}
                  >
                    {evt.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
