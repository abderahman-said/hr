import React from 'react';

const Reports = ({ employees, loans, deductions, incentives, tasks }) => {
  const productionEmps = employees.filter(e => e.type === 'انتاج');
  const fixedEmps = employees.filter(e => e.type === 'ثابت');

  const deptMap = {};
  employees.forEach(e => {
    if (!deptMap[e.department]) deptMap[e.department] = { count: 0, totalSalary: 0 };
    deptMap[e.department].count++;
    deptMap[e.department].totalSalary += Number(e.salary);
  });

  const totalSalaries = employees.reduce((s, e) => s + Number(e.salary), 0);
  const totalIncentives = incentives.reduce((s, i) => s + i.total, 0);
  const totalLoans = loans.reduce((s, l) => s + l.amount, 0);
  const totalDeductions = deductions.reduce((s, d) => s + d.amount, 0);
  const netPayroll = totalSalaries + totalIncentives - totalLoans - totalDeductions;

  return (
    <div className="p-6 space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">التقارير</h1>
          <p className="text-gray-500 text-sm">ملخص شهر سبتمبر 2026</p>
        </div>
        <button className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition">
          🖨️ طباعة التقرير
        </button>
      </div>

      {/* Payroll Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-gray-800 mb-5 text-lg flex items-center gap-2">💰 ملخص مسير الرواتب</h2>
        <div className="space-y-3">
          {[
            { label: 'إجمالي الرواتب الأساسية', value: totalSalaries, color: 'text-gray-800' },
            { label: 'إجمالي الحوافز والمكافآت', value: totalIncentives, color: 'text-green-600', prefix: '+' },
            { label: 'إجمالي السلف المخصومة', value: totalLoans, color: 'text-red-500', prefix: '-' },
            { label: 'إجمالي الخصومات والجزاءات', value: totalDeductions, color: 'text-orange-500', prefix: '-' },
          ].map(row => (
            <div key={row.label} className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-gray-600">{row.label}</span>
              <span className={`font-semibold ${row.color}`}>{row.prefix}{row.value.toLocaleString()} ج</span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-3 border-t-2 border-blue-200">
            <span className="font-bold text-gray-800 text-lg">صافي الصرف</span>
            <span className="font-bold text-blue-700 text-2xl">{netPayroll.toLocaleString()} ج</span>
          </div>
        </div>
      </div>

      {/* Department Report */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-gray-800 mb-5 text-lg flex items-center gap-2">🏭 تقرير الأقسام</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-2 text-right text-gray-600">القسم</th>
                <th className="px-4 py-2 text-right text-gray-600">عدد الموظفين</th>
                <th className="px-4 py-2 text-right text-gray-600">إجمالي الرواتب</th>
                <th className="px-4 py-2 text-right text-gray-600">متوسط الراتب</th>
                <th className="px-4 py-2 text-right text-gray-600">النسبة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {Object.entries(deptMap).map(([dept, data]) => (
                <tr key={dept} className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 font-medium text-gray-800">{dept}</td>
                  <td className="px-4 py-2.5 text-center font-semibold text-blue-600">{data.count}</td>
                  <td className="px-4 py-2.5 text-green-600 font-medium">{data.totalSalary.toLocaleString()} ج</td>
                  <td className="px-4 py-2.5 text-gray-600">{Math.round(data.totalSalary / data.count).toLocaleString()} ج</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(data.count / employees.length) * 100}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-500">{Math.round((data.count / employees.length) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Type Summary */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <h3 className="font-bold text-blue-800 mb-4">👷 عمالة الانتاج</h3>
          <div className="text-3xl font-bold text-blue-700 mb-2">{productionEmps.length}</div>
          <div className="text-blue-600 text-sm">موظف</div>
          <div className="mt-3 pt-3 border-t border-blue-200 text-sm text-blue-600">
            إجمالي رواتبهم: <strong>{productionEmps.reduce((s,e)=>s+Number(e.salary),0).toLocaleString()} ج</strong>
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5">
          <h3 className="font-bold text-purple-800 mb-4">👔 العمالة الثابتة</h3>
          <div className="text-3xl font-bold text-purple-700 mb-2">{fixedEmps.length}</div>
          <div className="text-purple-600 text-sm">موظف</div>
          <div className="mt-3 pt-3 border-t border-purple-200 text-sm text-purple-600">
            إجمالي رواتبهم: <strong>{fixedEmps.reduce((s,e)=>s+Number(e.salary),0).toLocaleString()} ج</strong>
          </div>
        </div>
      </div>

      {/* Tasks Report */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">✅ تقرير المهام الشهرية</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">{tasks.length}</div>
            <div className="text-gray-500 text-sm mt-1">إجمالي المهام</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{tasks.filter(t=>t.done).length}</div>
            <div className="text-gray-500 text-sm mt-1">منجزة</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500">{tasks.filter(t=>!t.done).length}</div>
            <div className="text-gray-500 text-sm mt-1">معلقة</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all"
              style={{ width: `${tasks.length > 0 ? (tasks.filter(t=>t.done).length / tasks.length) * 100 : 0}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
