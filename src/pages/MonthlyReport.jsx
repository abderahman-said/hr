import React, { useState } from 'react';

// ===================================================
// الشيت الشهري للمدير — ملخص مالي شامل لكل موظف
// يجمع: الراتب + حوافز + إضافي + مواصلات - تأخيرات - غياب - سلف - خصومات
// ===================================================

const MonthlyReport = ({
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
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [selectedMonth] = useState('سبتمبر 2026');

  // ===== حسابات مشتركة =====
  const calcHourlyRate = (salary) => salary / 26 / 8;
  const calcMinuteDeduction = (salary) => salary / 26 / 8 / 60;

  const calcEmployeeRow = (emp) => {
    const code = emp.code;
    const salary = Number(emp.salary);

    // + حوافز الانتاج
    const empIncentives = incentives
      .filter(i => i.employeeCode === code)
      .reduce((s, i) => s + (Number(i.total) || 0), 0);

    // + إضافي
    const empOvertime = overtime
      .filter(o => o.employeeCode === code)
      .reduce((s, o) => s + Math.round(calcHourlyRate(salary) * Number(o.overtimeHours)), 0);

    // + مواصلات
    const empTransportation = transportation
      .filter(t => t.employeeCode === code)
      .reduce((s, t) => s + Number(t.attendanceDays) * Number(t.allowancePerDay), 0);

    // + حوافز الثابتة
    const empFixedIncentives = fixedIncentives
      .filter(f => f.employeeCode === code)
      .reduce((s, f) => s + Math.round(calcHourlyRate(Number(f.salary || salary)) * Number(f.incentiveHours)), 0);

    // - سلف
    const empLoans = loans
      .filter(l => l.employeeCode === code)
      .reduce((s, l) => s + Number(l.amount), 0);

    // - خصومات
    const empDeductions = deductions
      .filter(d => d.employeeCode === code)
      .reduce((s, d) => s + Number(d.amount), 0);

    // - تأخيرات (خصم بالدقيقة)
    const totalDelayMins = delays
      .filter(d => d.employeeCode === code)
      .reduce((s, d) => s + Number(d.delayMinutes), 0);
    const empDelayDeduction = Math.round(calcMinuteDeduction(salary) * totalDelayMins);

    // - غياب بدون إذن (يوم كامل = الراتب / 26)
    const unauthorizedAbsences = absences
      .filter(a => a.employeeCode === code && a.type === 'بدون اذن')
      .length;
    const empAbsenceDeduction = Math.round((salary / 26) * unauthorizedAbsences);

    // غياب باذن (خصم نصف يوم أو بدون حسب السياسة — هنا نخصمه كذلك)
    const authorizedAbsences = absences
      .filter(a => a.employeeCode === code && a.type === 'غياب باذن')
      .length;
    const empAuthorizedDeduction = Math.round((salary / 26) * authorizedAbsences);

    const grossAdditions = salary + empIncentives + empOvertime + empTransportation + empFixedIncentives;
    const totalDeductions = empLoans + empDeductions + empDelayDeduction + empAbsenceDeduction + empAuthorizedDeduction;
    const net = grossAdditions - totalDeductions;

    return {
      salary,
      empIncentives,
      empOvertime,
      empTransportation,
      empFixedIncentives,
      grossAdditions,
      empLoans,
      empDeductions,
      empDelayDeduction,
      totalDelayMins,
      empAbsenceDeduction,
      unauthorizedAbsences,
      empAuthorizedDeduction,
      authorizedAbsences,
      totalDeductions,
      net,
    };
  };

  const filtered = employees.filter(e => {
    const matchSearch = e.name.includes(search) || e.code.includes(search);
    const matchType = !filterType || e.type === filterType;
    return matchSearch && matchType;
  });

  const rows = filtered.map(emp => ({ emp, calc: calcEmployeeRow(emp) }));

  // إجماليات
  const totals = rows.reduce((acc, { calc }) => ({
    salary: acc.salary + calc.salary,
    incentives: acc.incentives + calc.empIncentives,
    overtime: acc.overtime + calc.empOvertime,
    transportation: acc.transportation + calc.empTransportation,
    fixedIncentives: acc.fixedIncentives + calc.empFixedIncentives,
    gross: acc.gross + calc.grossAdditions,
    loans: acc.loans + calc.empLoans,
    deductions: acc.deductions + calc.empDeductions,
    delays: acc.delays + calc.empDelayDeduction,
    absences: acc.absences + calc.empAbsenceDeduction + calc.empAuthorizedDeduction,
    totalDed: acc.totalDed + calc.totalDeductions,
    net: acc.net + calc.net,
  }), { salary: 0, incentives: 0, overtime: 0, transportation: 0, fixedIncentives: 0, gross: 0, loans: 0, deductions: 0, delays: 0, absences: 0, totalDed: 0, net: 0 });

  return (
    <div className="p-6 space-y-5 fade-in">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📊 الشيت الشهري للمدير</h1>
          <p className="text-gray-500 text-sm">ملخص مالي شامل • {selectedMonth} • {filtered.length} موظف</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition flex items-center gap-2">
            📥 تصدير
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition flex items-center gap-2">
            🖨️ طباعة
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-4 shadow-lg">
          <div className="text-sm opacity-80 mb-1">إجمالي المستحقات</div>
          <div className="text-2xl font-bold">{totals.gross.toLocaleString()} ج</div>
          <div className="text-xs opacity-70 mt-1">راتب + حوافز + إضافي + مواصلات</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl p-4 shadow-lg">
          <div className="text-sm opacity-80 mb-1">إجمالي الخصومات</div>
          <div className="text-2xl font-bold">{totals.totalDed.toLocaleString()} ج</div>
          <div className="text-xs opacity-70 mt-1">سلف + غياب + تأخيرات + خصومات</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-4 shadow-lg">
          <div className="text-sm opacity-80 mb-1">صافي للصرف</div>
          <div className="text-2xl font-bold">{totals.net.toLocaleString()} ج</div>
          <div className="text-xs opacity-70 mt-1">المستحق - الخصومات</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-4 shadow-lg">
          <div className="text-sm opacity-80 mb-1">إجمالي الحوافز</div>
          <div className="text-2xl font-bold">{(totals.incentives + totals.fixedIncentives).toLocaleString()} ج</div>
          <div className="text-xs opacity-70 mt-1">انتاج + ثابتة</div>
        </div>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {[
          { label: 'الرواتب الأساسية', value: totals.salary, color: 'bg-slate-100 text-slate-700' },
          { label: 'حوافز الانتاج', value: totals.incentives, color: 'bg-purple-50 text-purple-700' },
          { label: 'الإضافي', value: totals.overtime, color: 'bg-indigo-50 text-indigo-700' },
          { label: 'بدل المواصلات', value: totals.transportation, color: 'bg-cyan-50 text-cyan-700' },
          { label: 'خصم التأخيرات', value: totals.delays, color: 'bg-yellow-50 text-yellow-700' },
          { label: 'خصم الغياب', value: totals.absences, color: 'bg-orange-50 text-orange-700' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`${color} rounded-xl p-3 text-center border border-gray-100`}>
            <div className="text-lg font-bold">{value.toLocaleString()}</div>
            <div className="text-xs mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center">
        <input type="text" placeholder="🔍 بحث بالاسم أو الكود..." value={search} onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm flex-1 min-w-40 focus:outline-none focus:ring-2 focus:ring-blue-300" />
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
          <option value="">الكل (انتاج + ثابت)</option>
          <option value="انتاج">الانتاج فقط</option>
          <option value="ثابت">الثابت فقط</option>
        </select>
        <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-xl">
          {filtered.length} موظف
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="px-2 py-3 text-right font-semibold sticky right-0 bg-gray-800 z-10">#</th>
                <th className="px-2 py-3 text-right font-semibold sticky" style={{right:'28px', background:'#1f2937', zIndex:10}}>الموظف</th>
                <th className="px-2 py-3 text-right font-semibold">النوع</th>
                <th className="px-2 py-3 text-right font-semibold bg-slate-700">الراتب الأساسي</th>
                <th className="px-2 py-3 text-right font-semibold bg-purple-800">حوافز انتاج</th>
                <th className="px-2 py-3 text-right font-semibold bg-emerald-800">حوافز ثابتة</th>
                <th className="px-2 py-3 text-right font-semibold bg-indigo-800">إضافي</th>
                <th className="px-2 py-3 text-right font-semibold bg-cyan-800">مواصلات</th>
                <th className="px-2 py-3 text-right font-semibold bg-green-700">إجمالي مستحق</th>
                <th className="px-2 py-3 text-right font-semibold bg-blue-800">سلف</th>
                <th className="px-2 py-3 text-right font-semibold bg-orange-700">خصومات</th>
                <th className="px-2 py-3 text-right font-semibold bg-yellow-700">خصم تأخير</th>
                <th className="px-2 py-3 text-right font-semibold bg-red-800">خصم غياب</th>
                <th className="px-2 py-3 text-right font-semibold bg-red-900">إجمالي خصم</th>
                <th className="px-2 py-3 text-right font-semibold bg-green-900 text-lg">صافي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map(({ emp, calc }, i) => (
                <tr key={emp.id} className={`hover:bg-blue-50 transition ${emp.type === 'ثابت' ? 'bg-purple-50/30' : ''}`}>
                  <td className="px-2 py-2.5 text-gray-400 sticky right-0 bg-white">{i + 1}</td>
                  <td className="px-2 py-2.5 sticky bg-white" style={{right:'28px'}}>
                    <div className="font-semibold text-gray-800 whitespace-nowrap">{emp.name}</div>
                    <div className="text-gray-400">{emp.code} • {emp.department}</div>
                  </td>
                  <td className="px-2 py-2.5">
                    <span className={`px-1.5 py-0.5 rounded-full ${emp.type === 'انتاج' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                      {emp.type}
                    </span>
                  </td>
                  {/* مستحقات */}
                  <td className="px-2 py-2.5 text-gray-700 font-medium bg-slate-50">{calc.salary.toLocaleString()}</td>
                  <td className="px-2 py-2.5 text-purple-700 font-medium bg-purple-50">
                    {calc.empIncentives > 0 ? <span className="text-green-600">+{calc.empIncentives}</span> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-2 py-2.5 text-emerald-700 bg-emerald-50">
                    {calc.empFixedIncentives > 0 ? <span className="text-green-600">+{calc.empFixedIncentives}</span> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-2 py-2.5 text-indigo-700 bg-indigo-50">
                    {calc.empOvertime > 0 ? <span className="text-green-600">+{calc.empOvertime}</span> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-2 py-2.5 text-cyan-700 bg-cyan-50">
                    {calc.empTransportation > 0 ? <span className="text-green-600">+{calc.empTransportation}</span> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-2 py-2.5 bg-green-50">
                    <span className="font-bold text-green-800">{calc.grossAdditions.toLocaleString()}</span>
                  </td>
                  {/* خصومات */}
                  <td className="px-2 py-2.5 text-blue-600 bg-blue-50">
                    {calc.empLoans > 0 ? <span className="text-red-500">-{calc.empLoans}</span> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-2 py-2.5 text-orange-600 bg-orange-50">
                    {calc.empDeductions > 0 ? <span className="text-red-500">-{calc.empDeductions}</span> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-2 py-2.5 text-yellow-700 bg-yellow-50">
                    {calc.empDelayDeduction > 0 ? (
                      <span className="text-red-500">
                        -{calc.empDelayDeduction}
                        <span className="text-gray-400 text-xs mr-1">({calc.totalDelayMins}د)</span>
                      </span>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-2 py-2.5 bg-red-50">
                    {(calc.empAbsenceDeduction + calc.empAuthorizedDeduction) > 0 ? (
                      <div>
                        <span className="text-red-600">-{calc.empAbsenceDeduction + calc.empAuthorizedDeduction}</span>
                        <div className="text-gray-400">
                          {calc.unauthorizedAbsences > 0 && <span>{calc.unauthorizedAbsences} بدون</span>}
                          {calc.authorizedAbsences > 0 && <span className="mr-1">{calc.authorizedAbsences} باذن</span>}
                        </div>
                      </div>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-2 py-2.5 bg-red-100">
                    <span className="font-bold text-red-700">{calc.totalDeductions > 0 ? calc.totalDeductions.toLocaleString() : '—'}</span>
                  </td>
                  {/* صافي */}
                  <td className="px-2 py-2.5 bg-green-100">
                    <span className={`font-bold text-base ${calc.net >= 0 ? 'text-green-800' : 'text-red-700'}`}>
                      {calc.net.toLocaleString()} ج
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Footer إجماليات */}
            <tfoot>
              <tr className="bg-gray-900 text-white font-bold text-sm">
                <td colSpan="3" className="px-3 py-3 text-right sticky right-0 bg-gray-900">الإجمالي الكلي</td>
                <td className="px-2 py-3 bg-slate-800">{totals.salary.toLocaleString()}</td>
                <td className="px-2 py-3 bg-purple-900">{totals.incentives > 0 ? totals.incentives.toLocaleString() : '—'}</td>
                <td className="px-2 py-3 bg-emerald-900">{totals.fixedIncentives > 0 ? totals.fixedIncentives.toLocaleString() : '—'}</td>
                <td className="px-2 py-3 bg-indigo-900">{totals.overtime > 0 ? totals.overtime.toLocaleString() : '—'}</td>
                <td className="px-2 py-3 bg-cyan-900">{totals.transportation > 0 ? totals.transportation.toLocaleString() : '—'}</td>
                <td className="px-2 py-3 bg-green-800 text-green-200">{totals.gross.toLocaleString()}</td>
                <td className="px-2 py-3 bg-blue-900">{totals.loans > 0 ? totals.loans.toLocaleString() : '—'}</td>
                <td className="px-2 py-3 bg-orange-900">{totals.deductions > 0 ? totals.deductions.toLocaleString() : '—'}</td>
                <td className="px-2 py-3 bg-yellow-900">{totals.delays > 0 ? totals.delays.toLocaleString() : '—'}</td>
                <td className="px-2 py-3 bg-red-900">{totals.absences > 0 ? totals.absences.toLocaleString() : '—'}</td>
                <td className="px-2 py-3 bg-red-950 text-red-200">{totals.totalDed.toLocaleString()}</td>
                <td className="px-2 py-3 bg-green-900 text-green-200 text-lg">{totals.net.toLocaleString()} ج</td>
              </tr>
            </tfoot>
          </table>
        </div>
        {rows.length === 0 && <div className="text-center py-10 text-gray-400">لا توجد بيانات</div>}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-3 text-sm">📌 دليل الأعمدة</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-purple-200"></span>حوافز الانتاج — من صفحة الحوافز</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-200"></span>حوافز الثابتة — من صفحة الحوافز الثابتة</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-indigo-200"></span>الإضافي — ساعة × أجر الساعة</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-cyan-200"></span>المواصلات — أيام حضور × البدل/يوم</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-yellow-200"></span>خصم التأخيرات — بالدقيقة من الراتب</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-red-200"></span>خصم الغياب — يوم = الراتب ÷ 26</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-blue-200"></span>السلف — من صفحة السلف</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-orange-200"></span>الخصومات — من صفحة الخصومات</div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReport;
