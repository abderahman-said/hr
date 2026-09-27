import React, { useEffect, useState } from 'react';
import {
  Users, DollarSign, CreditCard, Scissors, Award, CheckCircle,
  Clock, TrendingUp, TrendingDown, Calendar, ArrowLeft,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Shared tone system — an accent bar + tinted icon chip on a neutral white
// card, instead of a fully-coloured tile per stat. Keeps six different
// numbers legible at a glance instead of six competing blocks of colour.
// ---------------------------------------------------------------------------
const TONES = {
  blue: { bar: 'bg-[#1B3D63]', chipBg: 'bg-[#1B3D63]/10', chipText: 'text-[#1B3D63]' },
  green: { bar: 'bg-[#10B981]', chipBg: 'bg-[#10B981]/10', chipText: 'text-[#0E9F71]' },
  orange: { bar: 'bg-[#F59E0B]', chipBg: 'bg-[#F59E0B]/10', chipText: 'text-[#B87508]' },
  red: { bar: 'bg-[#E4574C]', chipBg: 'bg-[#E4574C]/10', chipText: 'text-[#C8443A]' },
  purple: { bar: 'bg-[#8B5CF6]', chipBg: 'bg-[#8B5CF6]/10', chipText: 'text-[#7141E0]' },
  teal: { bar: 'bg-[#14B8A6]', chipBg: 'bg-[#14B8A6]/10', chipText: 'text-[#0D9488]' },
};

const StatCard = ({ title, value, subtitle, icon: Icon, color, trend, delay = 0, visible }) => {
  const tone = TONES[color] || TONES.blue;
  const trendUp = typeof trend === 'number' && trend > 0;
  const trendDown = typeof trend === 'number' && trend < 0;

  return (
    <div
      style={{ transitionDelay: `${delay}ms` }}
      className={`
        relative overflow-hidden bg-white rounded-2xl border border-[#E4E9F1]
        shadow-sm p-3 sm:p-5 transition-all duration-300 ease-out
        motion-reduce:transition-none motion-reduce:transform-none
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
    >
      <span className={`absolute inset-x-0 top-0 h-1 ${tone.bar}`} aria-hidden="true" />

      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className={`p-2 sm:p-2.5 rounded-xl ${tone.chipBg} ${tone.chipText}`}>
          <Icon size={18} sm:size={20} strokeWidth={2} />
        </div>
        {typeof trend === 'number' && (
          <span
            className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${
              trendUp
                ? 'bg-[#10B981]/10 text-[#0E9F71]'
                : trendDown
                ? 'bg-[#E4574C]/10 text-[#C8443A]'
                : 'bg-[#F1F4F9] text-[#64748B]'
            }`}
          >
            {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>

      <div className="text-xl sm:text-2xl font-bold text-[#16283F] tabular-nums leading-tight">
        {value}
      </div>
      <div className="text-xs sm:text-sm text-[#3A4A63] font-medium mt-1">{title}</div>
      {subtitle && <div className="text-xs text-[#8493A8] mt-0.5">{subtitle}</div>}
    </div>
  );
};

const TASK_TAG = {
  'رواتب': { dot: 'bg-[#10B981]', chip: 'bg-[#10B981]/10 text-[#0E9F71]' },
  'مالي': { dot: 'bg-[#F59E0B]', chip: 'bg-[#F59E0B]/10 text-[#B87508]' },
  'غياب': { dot: 'bg-[#E4574C]', chip: 'bg-[#E4574C]/10 text-[#C8443A]' },
};
const defaultTag = { dot: 'bg-[#1B3D63]', chip: 'bg-[#1B3D63]/10 text-[#1B3D63]' };

const Dashboard = ({ employees, tasks, loans, deductions, incentives }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const totalEmployees = employees.length;
  const productionEmployees = employees.filter((e) => e.type === 'انتاج').length;
  const fixedEmployees = employees.filter((e) => e.type === 'ثابت').length;
  const pendingTasks = tasks.filter((t) => !t.done);
  const doneTasksCount = tasks.filter((t) => t.done).length;
  const totalLoans = loans.reduce((s, l) => s + l.amount, 0);
  const totalDeductions = deductions.reduce((s, d) => s + d.amount, 0);
  const totalIncentives = incentives.reduce((s, i) => s + i.total, 0);
  const totalSalaries = employees.reduce((s, e) => s + e.salary, 0);
  const netExpected = totalSalaries + totalIncentives - totalDeductions - totalLoans;

  const recentTasks = pendingTasks.slice(0, 5);
  const remainingTasksCount = Math.max(pendingTasks.length - recentTasks.length, 0);

  const deptEntries = (() => {
    const map = {};
    employees.forEach((e) => {
      map[e.department] = (map[e.department] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  })();

  const money = (n) => `${n.toLocaleString()} ج.م`;

  const stats = [
    { title: 'إجمالي الموظفين', value: totalEmployees, subtitle: `${productionEmployees} إنتاج · ${fixedEmployees} ثابت`, icon: Users, color: 'blue' },
    { title: 'إجمالي الرواتب', value: money(totalSalaries), subtitle: 'هذا الشهر', icon: DollarSign, color: 'green' },
    { title: 'إجمالي السلف', value: money(totalLoans), subtitle: `${loans.length} سلفة`, icon: CreditCard, color: 'orange' },
    { title: 'الخصومات', value: money(totalDeductions), subtitle: `${deductions.length} خصم`, icon: Scissors, color: 'red' },
    { title: 'الحوافز المستحقة', value: money(totalIncentives), subtitle: `${incentives.length} موظف`, icon: Award, color: 'purple' },
    { title: 'المهام المنجزة', value: doneTasksCount, subtitle: `من أصل ${tasks.length} مهمة`, icon: CheckCircle, color: 'teal' },
    { title: 'مهام معلقة', value: pendingTasks.length, subtitle: 'تحتاج متابعة', icon: Clock, color: 'orange' },
    { title: 'الصافي المتوقع', value: money(netExpected), subtitle: 'بعد الخصومات', icon: TrendingUp, color: 'blue' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#16283F]">لوحة التحكم الرئيسية</h1>
          <p className="text-[#8493A8] text-sm mt-1">إجمالي سبتمبر 2026</p>
        </div>
        <div className="bg-[#1B3D63]/5 border border-[#1B3D63]/15 rounded-xl px-3 sm:px-4 py-2 text-[#1B3D63] text-xs sm:text-sm font-medium flex items-center gap-2">
          <Calendar size={14} sm:size={16} strokeWidth={2} />
          سبتمبر 2026
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s, i) => (
          <StatCard key={s.title} {...s} visible={visible} delay={i * 40} />
        ))}
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Pending tasks */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-[#E4E9F1]">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="font-bold text-[#16283F] text-base sm:text-lg flex items-center gap-2">
              <Clock size={18} sm:size={20} strokeWidth={2} className="text-[#1B3D63]" />
              المهام المعلقة
            </h2>
            {pendingTasks.length > 0 && (
              <span className="text-xs text-[#8493A8]">{pendingTasks.length} إجمالاً</span>
            )}
          </div>

          {recentTasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle size={28} className="mx-auto text-[#10B981] mb-2" strokeWidth={1.5} />
              <p className="text-[#64748B] text-sm">لا توجد مهام معلقة</p>
            </div>
          ) : (
            <>
              <div className="space-y-2.5">
                {recentTasks.map((task) => {
                  const tag = TASK_TAG[task.type] || defaultTag;
                  return (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-3 bg-[#F7F9FC] hover:bg-[#F1F4F9] rounded-xl transition-colors"
                    >
                      <span className={`w-2 h-2 rounded-full shrink-0 ${tag.dot}`} aria-hidden="true" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[#16283F] truncate">{task.task}</div>
                        <div className="text-xs text-[#8493A8] mt-0.5">{task.date}</div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${tag.chip}`}>
                        {task.type}
                      </span>
                    </div>
                  );
                })}
              </div>
              {remainingTasksCount > 0 && (
                <button className="w-full flex items-center justify-center gap-1.5 mt-3 py-2 text-sm text-[#1B3D63] font-medium hover:bg-[#1B3D63]/5 rounded-lg transition-colors">
                  و{remainingTasksCount} مهمة أخرى
                  <ArrowLeft size={14} />
                </button>
              )}
            </>
          )}
        </div>

        {/* Department distribution */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-[#E4E9F1]">
          <h2 className="font-bold text-[#16283F] text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
            <Users size={18} sm:size={20} strokeWidth={2} className="text-[#1B3D63]" />
            توزيع الموظفين بالأقسام
          </h2>
          <div className="space-y-4">
            {deptEntries.map(([dept, count]) => {
              const pct = Math.round((count / totalEmployees) * 100);
              return (
                <div key={dept}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-[#3A4A63]">{dept}</span>
                    <span className="font-semibold text-[#16283F] tabular-nums">
                      {count} موظف <span className="text-[#8493A8] font-normal">· {pct}٪</span>
                    </span>
                  </div>
                  <div className="w-full bg-[#F1F4F9] rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-l from-[#1B3D63] to-[#4F9DDE] h-2 rounded-full transition-all duration-500 ease-out motion-reduce:transition-none"
                      style={{ width: visible ? `${pct}%` : '0%' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;