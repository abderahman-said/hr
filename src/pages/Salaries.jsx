import React, { useState } from 'react';

const Salaries = ({ employees, loans, deductions, incentives }) => {
  const [selectedMonth, setSelectedMonth] = useState('سبتمبر 2026');
  const [search, setSearch] = useState('');

  const calcSalary = (emp) => {
    const empLoans = loans.filter(l => l.employeeCode === emp.code).reduce((s, l) => s + l.amount, 0);
    const empDed = deductions.filter(d => d.employeeCode === emp.code).reduce((s, d) => s + d.amount, 0);
    const empInc = incentives.filter(i => i.employeeCode === emp.code).reduce((s, i) => s + i.total, 0);
    const gross = emp.salary + empInc;
    const totalDed = empLoans + empDed;
    const net = gross - totalDed;
    return { gross, empLoans, empDed, empInc, totalDed, net };
  };

  const filtered = employees.filter(e => e.name.includes(search) || e.code.includes(search));
  const totalNet = filtered.reduce((s, e) => s + calcSalary(e).net, 0);
  const totalGross = filtered.reduce((s, e) => s + calcSalary(e).gross, 0);
  const totalDeductionsSum = filtered.reduce((s, e) => s + calcSalary(e).totalDed, 0);

  return (
    <div className="p-6 space-y-5 fade-in">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">الرواتب والمستحقات</h1>
          <p className="text-gray-500 text-sm">مسير رواتب {selectedMonth}</p>
        </div>
        <div className="flex gap-3">
          <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
            <option>سبتمبر 2026</option>
            <option>أغسطس 2026</option>
            <option>يوليو 2026</option>
          </select>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition">
            📥 تصدير PDF
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{totalGross.toLocaleString()} ج</div>
          <div className="text-green-600 text-sm font-medium mt-1">إجمالي المستحقات</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{totalDeductionsSum.toLocaleString()} ج</div>
          <div className="text-red-500 text-sm font-medium mt-1">إجمالي الخصومات</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{totalNet.toLocaleString()} ج</div>
          <div className="text-blue-600 text-sm font-medium mt-1">الصافي للصرف</div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <input type="text" placeholder="🔍 بحث..." value={search} onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-300" />
      </div>

      {/* Salary Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-3 py-3 text-right font-semibold text-gray-600">الموظف</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">الراتب الأساسي</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">حوافز</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">إجمالي مستحق</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">سلف</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">خصومات</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">إجمالي خصم</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600 bg-blue-50">صافي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(emp => {
                const { gross, empLoans, empDed, empInc, totalDed, net } = calcSalary(emp);
                return (
                  <tr key={emp.id} className="hover:bg-gray-50 transition">
                    <td className="px-3 py-3">
                      <div className="font-medium text-gray-800">{emp.name}</div>
                      <div className="text-xs text-gray-400">{emp.code} • {emp.department}</div>
                    </td>
                    <td className="px-3 py-3 text-gray-700">{Number(emp.salary).toLocaleString()} ج</td>
                    <td className="px-3 py-3 text-green-600 font-medium">{empInc > 0 ? `+${empInc.toLocaleString()} ج` : '-'}</td>
                    <td className="px-3 py-3 text-gray-800 font-semibold">{gross.toLocaleString()} ج</td>
                    <td className="px-3 py-3 text-red-500">{empLoans > 0 ? `${empLoans.toLocaleString()} ج` : '-'}</td>
                    <td className="px-3 py-3 text-orange-500">{empDed > 0 ? `${empDed.toLocaleString()} ج` : '-'}</td>
                    <td className="px-3 py-3 text-red-600 font-medium">{totalDed > 0 ? `${totalDed.toLocaleString()} ج` : '-'}</td>
                    <td className="px-3 py-3 bg-blue-50">
                      <span className={`font-bold text-base ${net >= 0 ? 'text-blue-700' : 'text-red-600'}`}>
                        {net.toLocaleString()} ج
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 border-t-2 border-gray-200 font-bold">
                <td className="px-3 py-3 text-gray-700">الإجمالي</td>
                <td className="px-3 py-3">{filtered.reduce((s,e)=>s+e.salary,0).toLocaleString()} ج</td>
                <td className="px-3 py-3 text-green-600">{filtered.reduce((s,e)=>s+calcSalary(e).empInc,0).toLocaleString()} ج</td>
                <td className="px-3 py-3">{totalGross.toLocaleString()} ج</td>
                <td className="px-3 py-3 text-red-500">{filtered.reduce((s,e)=>s+calcSalary(e).empLoans,0).toLocaleString()} ج</td>
                <td className="px-3 py-3 text-orange-500">{filtered.reduce((s,e)=>s+calcSalary(e).empDed,0).toLocaleString()} ج</td>
                <td className="px-3 py-3 text-red-600">{totalDeductionsSum.toLocaleString()} ج</td>
                <td className="px-3 py-3 bg-blue-100 text-blue-800 text-lg">{totalNet.toLocaleString()} ج</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Salaries;
