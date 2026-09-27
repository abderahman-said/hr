import React, { useState } from 'react';
import { Download, Search, ChevronDown, ChevronUp, DollarSign, TrendingUp, TrendingDown, Info } from 'lucide-react';

// ===================================================
// مسير الرواتب الشامل — يجمع كل الوحدات
// ===================================================
const Salaries = ({
  employees = [],
  loans = [],
  deductions = [],
  incentives = [],
  delays = [],
  overtime = [],
  transportation = [],
  fixedIncentives = [],
  absences = [],
}) => {
  const [selectedMonth, setSelectedMonth] = useState('سبتمبر 2026');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);

  const calcHourlyRate = (salary) => salary / 26 / 8;
  const calcMinuteDeduction = (salary) => salary / 26 / 8 / 60;

  const calcSalary = (emp) => {
    const code = emp.code;
    const salary = Number(emp.salary);

    const empIncentives = incentives.filter(i => i.employeeCode === code).reduce((s, i) => s + (Number(i.total) || 0), 0);
    const empFixedInc = fixedIncentives.filter(f => f.employeeCode === code).reduce((s, f) => s + Math.round(calcHourlyRate(salary) * Number(f.incentiveHours)), 0);
    const empOvertime = overtime.filter(o => o.employeeCode === code).reduce((s, o) => s + Math.round(calcHourlyRate(salary) * Number(o.overtimeHours)), 0);
    const empTransport = transportation.filter(t => t.employeeCode === code).reduce((s, t) => s + Number(t.attendanceDays) * Number(t.allowancePerDay), 0);

    const empLoans = loans.filter(l => l.employeeCode === code).reduce((s, l) => s + Number(l.amount), 0);
    const empDed = deductions.filter(d => d.employeeCode === code).reduce((s, d) => s + Number(d.amount), 0);

    const totalDelayMins = delays.filter(d => d.employeeCode === code).reduce((s, d) => s + Number(d.delayMinutes), 0);
    const empDelayDed = Math.round(calcMinuteDeduction(salary) * totalDelayMins);

    const unauth = absences.filter(a => a.employeeCode === code && a.type === 'بدون اذن').length;
    const auth = absences.filter(a => a.employeeCode === code && a.type === 'غياب باذن').length;
    const empAbsenceDed = Math.round((salary / 26) * (unauth + auth));

    const gross = salary + empIncentives + empFixedInc + empOvertime + empTransport;
    const totalDed = empLoans + empDed + empDelayDed + empAbsenceDed;
    const net = gross - totalDed;

    return { salary, empIncentives, empFixedInc, empOvertime, empTransport, empLoans, empDed, empDelayDed, empAbsenceDed, gross, totalDed, net, totalDelayMins, unauth, auth };
  };

  const allEmps = employees.filter(e => {
    const matchSearch = e.name.includes(search) || e.code.includes(search);
    const matchType = !filterType || e.type === filterType;
    return matchSearch && matchType;
  });

  const totalNet = allEmps.reduce((s, e) => s + calcSalary(e).net, 0);
  const totalGross = allEmps.reduce((s, e) => s + calcSalary(e).gross, 0);
  const totalDedSum = allEmps.reduce((s, e) => s + calcSalary(e).totalDed, 0);

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172B45]">الرواتب والمستحقات</h1>
          <p className="text-[#718096] text-sm">مسير رواتب {selectedMonth} • {allEmps.length} موظف</p>
        </div>
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="border border-[#E2E8F0] rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10">
            <option>سبتمبر 2026</option>
            <option>أغسطس 2026</option>
            <option>يوليو 2026</option>
          </select>
          <button className="bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-sm font-medium shadow-md transition flex items-center gap-2">
            <Download size={14} sm:size={16} strokeWidth={2} /> تصدير
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-[#10B981]/5 border border-[#10B981]/20 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-[#10B981]">{totalGross.toLocaleString()} ج</div>
          <div className="text-[#10B981] text-sm font-medium mt-1">إجمالي المستحقات</div>
          <div className="text-[#10B981]/60 text-xs mt-0.5">راتب + حوافز + إضافي + مواصلات</div>
        </div>
        <div className="bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-[#EF4444]">{totalDedSum.toLocaleString()} ج</div>
          <div className="text-[#EF4444] text-sm font-medium mt-1">إجمالي الخصومات</div>
          <div className="text-[#EF4444]/60 text-xs mt-0.5">سلف + غياب + تأخيرات + خصومات</div>
        </div>
        <div className="bg-[#163A63]/5 border border-[#163A63]/20 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-[#163A63]">{totalNet.toLocaleString()} ج</div>
          <div className="text-[#163A63] text-sm font-medium mt-1">الصافي للصرف</div>
          <div className="text-[#163A63]/60 text-xs mt-0.5">المبلغ النهائي</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-[#E2E8F0] flex flex-col sm:flex-wrap gap-3">
        <div className="relative flex-1 min-w-40 w-full sm:w-auto">
          <Search size={16} sm:size={18} strokeWidth={2} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#718096]" />
          <input type="text" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)}
            className="border border-[#E2E8F0] rounded-xl px-10 py-2 sm:py-2.5 text-sm flex-1 min-w-40 focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10" />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          className="border border-[#E2E8F0] rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10">
          <option value="">الكل</option>
          <option value="انتاج">الانتاج</option>
          <option value="ثابت">الثابت</option>
        </select>
      </div>

      {/* Salary Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F5F7FA] border-b border-[#E2E8F0]">
                <th className="px-3 py-3 text-right font-semibold text-[#718096]">الموظف</th>
                <th className="px-3 py-3 text-right font-semibold text-[#718096]">الراتب الأساسي</th>
                <th className="px-3 py-3 text-right font-semibold text-[#718096] bg-[#8B5CF6]/10">حوافز</th>
                <th className="px-3 py-3 text-right font-semibold text-[#718096] bg-[#6366F1]/10">إضافي</th>
                <th className="px-3 py-3 text-right font-semibold text-[#718096] bg-[#06B6D4]/10">مواصلات</th>
                <th className="px-3 py-3 text-right font-semibold text-[#718096] bg-[#10B981]/10">إجمالي مستحق</th>
                <th className="px-3 py-3 text-right font-semibold text-[#718096] bg-[#F59E0B]/10">خصم تأخير</th>
                <th className="px-3 py-3 text-right font-semibold text-[#718096] bg-[#F97316]/10">خصم غياب</th>
                <th className="px-3 py-3 text-right font-semibold text-[#718096]">سلف</th>
                <th className="px-3 py-3 text-right font-semibold text-[#718096]">خصومات أخرى</th>
                <th className="px-3 py-3 text-right font-semibold text-[#718096] bg-[#EF4444]/10">إجمالي خصم</th>
                <th className="px-3 py-3 text-right font-semibold text-[#718096] bg-[#163A63]/10">صافي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {allEmps.map(emp => {
                const c = calcSalary(emp);
                const isExpanded = expandedRow === emp.id;
                return (
                  <>
                    <tr key={emp.id} className="hover:bg-[#F5F7FA] transition cursor-pointer" onClick={() => setExpandedRow(isExpanded ? null : emp.id)}>
                      <td className="px-3 py-3">
                        <div className="font-medium text-[#172B45]">{emp.name}</div>
                        <div className="text-xs text-[#718096]">{emp.code} • {emp.department}
                          <span className={`mr-2 px-1.5 py-0.5 rounded text-xs ${emp.type === 'انتاج' ? 'bg-[#163A63]/10 text-[#163A63]' : 'bg-[#8B5CF6]/10 text-[#8B5CF6]'}`}>{emp.type}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-[#718096]">{c.salary.toLocaleString()} ج</td>
                      <td className="px-3 py-3 bg-[#8B5CF6]/10">
                        {(c.empIncentives + c.empFixedInc) > 0
                          ? <span className="text-[#10B981] font-medium">+{(c.empIncentives + c.empFixedInc).toLocaleString()}</span>
                          : <span className="text-[#E2E8F0]">—</span>}
                      </td>
                      <td className="px-3 py-3 bg-[#6366F1]/10">
                        {c.empOvertime > 0 ? <span className="text-[#10B981] font-medium">+{c.empOvertime}</span> : <span className="text-[#E2E8F0]">—</span>}
                      </td>
                      <td className="px-3 py-3 bg-[#06B6D4]/10">
                        {c.empTransport > 0 ? <span className="text-[#10B981] font-medium">+{c.empTransport}</span> : <span className="text-[#E2E8F0]">—</span>}
                      </td>
                      <td className="px-3 py-3 bg-[#10B981]/10">
                        <span className="font-bold text-[#10B981]">{c.gross.toLocaleString()} ج</span>
                      </td>
                      <td className="px-3 py-3 bg-[#F59E0B]/10">
                        {c.empDelayDed > 0
                          ? <span className="text-[#EF4444]">-{c.empDelayDed} <span className="text-xs text-[#F59E0B]">({c.totalDelayMins}د)</span></span>
                          : <span className="text-[#E2E8F0]">—</span>}
                      </td>
                      <td className="px-3 py-3 bg-[#F97316]/10">
                        {c.empAbsenceDed > 0
                          ? <span className="text-[#EF4444]">-{c.empAbsenceDed} <span className="text-xs text-[#F97316]">({c.unauth}ب+{c.auth}ا)</span></span>
                          : <span className="text-[#E2E8F0]">—</span>}
                      </td>
                      <td className="px-3 py-3 text-[#EF4444]">{c.empLoans > 0 ? `-${c.empLoans}` : '—'}</td>
                      <td className="px-3 py-3 text-[#F97316]">{c.empDed > 0 ? `-${c.empDed}` : '—'}</td>
                      <td className="px-3 py-3 bg-[#EF4444]/10">
                        <span className="font-medium text-[#EF4444]">{c.totalDed > 0 ? c.totalDed.toLocaleString() : '—'}</span>
                      </td>
                      <td className="px-3 py-3 bg-[#163A63]/10">
                        <span className={`font-bold text-base ${c.net >= 0 ? 'text-[#163A63]' : 'text-[#EF4444]'}`}>
                          {c.net.toLocaleString()} ج
                        </span>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${emp.id}-detail`} className="bg-[#F5F7FA] border-b border-[#E2E8F0]">
                        <td className="px-3 py-3 col-span-2 sm:col-span-1">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="bg-[#10B981]/5 rounded-xl p-2.5">
                              <div className="font-bold text-[#10B981] mb-1 flex items-center gap-1.5"><TrendingUp size={14} strokeWidth={2} /> المستحقات</div>
                              <div>راتب أساسي: {c.salary.toLocaleString()} ج</div>
                              {c.empIncentives > 0 && <div>حوافز انتاج: +{c.empIncentives} ج</div>}
                              {c.empFixedInc > 0 && <div>حوافز ثابتة: +{c.empFixedInc} ج</div>}
                              {c.empOvertime > 0 && <div>إضافي: +{c.empOvertime} ج</div>}
                              {c.empTransport > 0 && <div>مواصلات: +{c.empTransport} ج</div>}
                            </div>
                            <div className="bg-[#EF4444]/5 rounded-xl p-2.5">
                              <div className="font-bold text-[#EF4444] mb-1 flex items-center gap-1.5"><TrendingDown size={14} strokeWidth={2} /> الخصومات</div>
                              {c.empLoans > 0 && <div>سلف: -{c.empLoans} ج</div>}
                              {c.empDed > 0 && <div>خصومات: -{c.empDed} ج</div>}
                              {c.empDelayDed > 0 && <div>تأخيرات ({c.totalDelayMins}د): -{c.empDelayDed} ج</div>}
                              {c.empAbsenceDed > 0 && <div>غياب: -{c.empAbsenceDed} ج</div>}
                              {c.totalDed === 0 && <div className="text-[#718096]">لا توجد خصومات</div>}
                            </div>
                            <div className="bg-[#163A63]/5 rounded-xl p-2.5 col-span-2 md:col-span-1">
                              <div className="font-bold text-[#163A63] mb-1 flex items-center gap-1.5"><DollarSign size={14} strokeWidth={2} /> الصافي</div>
                              <div className="text-2xl font-bold text-[#163A63]">{c.net.toLocaleString()} ج</div>
                              <div className="text-[#163A63]/60">{c.gross} - {c.totalDed}</div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-[#F5F7FA] border-t-2 border-[#E2E8F0] font-bold">
                <td className="px-3 py-3 text-[#718096]">الإجمالي الكلي</td>
                <td className="px-3 py-3">{allEmps.reduce((s,e)=>s+e.salary,0).toLocaleString()} ج</td>
                <td className="px-3 py-3 bg-[#8B5CF6]/10 text-[#8B5CF6]">{allEmps.reduce((s,e)=>s+calcSalary(e).empIncentives+calcSalary(e).empFixedInc,0).toLocaleString()} ج</td>
                <td className="px-3 py-3 bg-[#6366F1]/10 text-[#6366F1]">{allEmps.reduce((s,e)=>s+calcSalary(e).empOvertime,0).toLocaleString()} ج</td>
                <td className="px-3 py-3 bg-[#06B6D4]/10 text-[#06B6D4]">{allEmps.reduce((s,e)=>s+calcSalary(e).empTransport,0).toLocaleString()} ج</td>
                <td className="px-3 py-3 bg-[#10B981]/10 text-[#10B981]">{totalGross.toLocaleString()} ج</td>
                <td className="px-3 py-3 bg-[#F59E0B]/10 text-[#F59E0B]">{allEmps.reduce((s,e)=>s+calcSalary(e).empDelayDed,0).toLocaleString()} ج</td>
                <td className="px-3 py-3 bg-[#F97316]/10 text-[#F97316]">{allEmps.reduce((s,e)=>s+calcSalary(e).empAbsenceDed,0).toLocaleString()} ج</td>
                <td className="px-3 py-3 text-[#EF4444]">{allEmps.reduce((s,e)=>s+calcSalary(e).empLoans,0).toLocaleString()} ج</td>
                <td className="px-3 py-3 text-[#F97316]">{allEmps.reduce((s,e)=>s+calcSalary(e).empDed,0).toLocaleString()} ج</td>
                <td className="px-3 py-3 bg-[#EF4444]/10 text-[#EF4444]">{totalDedSum.toLocaleString()} ج</td>
                <td className="px-3 py-3 bg-[#163A63]/10 text-[#163A63] text-lg">{totalNet.toLocaleString()} ج</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="p-3 bg-[#F5F7FA] text-xs text-[#718096] border-t flex items-center gap-1.5">
          <Info size={14} strokeWidth={2} /> انقر على أي موظف لعرض تفاصيل الحساب
        </div>
      </div>
    </div>
  );
};

export default Salaries;
