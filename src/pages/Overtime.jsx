import React, { useState } from 'react';

const Overtime = ({ employees, setEmployees }) => {
  const [records, setRecords] = useState([
    { id: 1, employeeCode: '202043', employeeName: 'سلوي منجود محمد', department: 'تغليف', salary: 918, hoursPerDay: 8, overtimeHours: 2, date: '2026-09-05', reason: 'الاجتهاد في العمل' },
    { id: 2, employeeCode: '203081', employeeName: 'حسام حمدان', department: 'المخازن', salary: 3000, hoursPerDay: 8, overtimeHours: 1, date: '2026-09-10', reason: 'عمل إضافي' },
    { id: 3, employeeCode: '202105', employeeName: 'أحمد محمود', department: 'الحقن', salary: 3500, hoursPerDay: 8, overtimeHours: 3, date: '2026-09-12', reason: 'ضغط العمل' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ employeeCode: '', employeeName: '', department: '', salary: 0, hoursPerDay: 8, overtimeHours: 0, date: '', reason: '' });
  const [search, setSearch] = useState('');

  const calcHourlyRate = (salary, daysPerMonth = 26) => {
    const dailyRate = salary / daysPerMonth;
    return dailyRate / 8;
  };

  const calcOvertimeValue = (rec) => {
    const hourlyRate = calcHourlyRate(Number(rec.salary));
    return Math.round(hourlyRate * Number(rec.overtimeHours));
  };

  const handleAdd = () => {
    if (!form.employeeCode || !form.overtimeHours) return alert('يرجى إدخال البيانات المطلوبة');
    const emp = employees.find(e => e.code === form.employeeCode);
    const newRecord = {
      ...form,
      id: Date.now(),
      salary: emp ? Number(emp.salary) : Number(form.salary),
      employeeName: emp ? emp.name : form.employeeName,
      department: emp ? emp.department : form.department,
      overtimeHours: Number(form.overtimeHours),
    };
    setRecords(prev => [...prev, newRecord]);
    setForm({ employeeCode: '', employeeName: '', department: '', salary: 0, hoursPerDay: 8, overtimeHours: 0, date: '', reason: '' });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('حذف هذا السجل؟')) setRecords(prev => prev.filter(r => r.id !== id));
  };

  const filtered = records.filter(r => r.employeeName.includes(search) || r.employeeCode.includes(search));
  const totalOvertime = filtered.reduce((s, r) => s + calcOvertimeValue(r), 0);
  const totalHours = filtered.reduce((s, r) => s + Number(r.overtimeHours), 0);

  return (
    <div className="p-6 space-y-5 fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">الإضافي (Overtime)</h1>
          <p className="text-gray-500 text-sm">{filtered.length} سجل • {totalHours} ساعة • إجمالي {totalOvertime.toLocaleString()} ج</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition">
          + إضافة إضافي
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-indigo-700">{totalHours}</div>
          <div className="text-indigo-500 text-sm mt-1">إجمالي الساعات</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{filtered.length}</div>
          <div className="text-green-500 text-sm mt-1">عدد السجلات</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{totalOvertime.toLocaleString()} ج</div>
          <div className="text-blue-500 text-sm mt-1">إجمالي قيمة الإضافي</div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <input type="text" placeholder="🔍 بحث بالاسم أو الكود..." value={search} onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-300" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-3 py-3 text-right font-semibold text-gray-600">#</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">الموظف</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">القسم</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">الراتب</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">الأجر/ساعة</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">ساعات الإضافي</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600 bg-indigo-50">قيمة الإضافي</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">التاريخ</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">السبب</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((rec, i) => {
                const hourlyRate = calcHourlyRate(Number(rec.salary));
                const value = calcOvertimeValue(rec);
                return (
                  <tr key={rec.id} className="hover:bg-gray-50 transition">
                    <td className="px-3 py-3 text-gray-400">{i + 1}</td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-gray-800">{rec.employeeName}</div>
                      <div className="text-xs text-gray-400">{rec.employeeCode}</div>
                    </td>
                    <td className="px-3 py-3 text-gray-600">{rec.department}</td>
                    <td className="px-3 py-3 text-gray-600">{Number(rec.salary).toLocaleString()} ج</td>
                    <td className="px-3 py-3 text-gray-500">{hourlyRate.toFixed(2)} ج</td>
                    <td className="px-3 py-3">
                      <span className="font-bold text-indigo-600">{rec.overtimeHours} ساعة</span>
                    </td>
                    <td className="px-3 py-3 bg-indigo-50">
                      <span className="font-bold text-indigo-700">{value.toLocaleString()} ج</span>
                    </td>
                    <td className="px-3 py-3 text-gray-500 text-xs">{rec.date}</td>
                    <td className="px-3 py-3 text-gray-500 text-xs max-w-32 truncate">{rec.reason}</td>
                    <td className="px-3 py-3">
                      <button onClick={() => handleDelete(rec.id)} className="text-red-400 hover:bg-red-50 p-1.5 rounded-lg transition">🗑️</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-indigo-50 border-t border-indigo-100 font-bold">
                <td colSpan="5" className="px-3 py-3 text-indigo-700">الإجمالي</td>
                <td className="px-3 py-3 text-indigo-700">{totalHours} ساعة</td>
                <td className="px-3 py-3 text-indigo-700 text-lg">{totalOvertime.toLocaleString()} ج</td>
                <td colSpan="3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-10 text-gray-400">لا توجد سجلات إضافي</div>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-800">إضافة سجل إضافي</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الموظف</label>
                <select value={form.employeeCode} onChange={e => {
                  const emp = employees.find(emp => emp.code === e.target.value);
                  setForm(prev => ({ ...prev, employeeCode: e.target.value, employeeName: emp?.name || '', department: emp?.department || '', salary: emp?.salary || 0 }));
                }} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                  <option value="">اختر الموظف</option>
                  {employees.map(e => <option key={e.id} value={e.code}>{e.name} ({e.code})</option>)}
                </select>
              </div>
              {form.salary > 0 && (
                <div className="bg-indigo-50 rounded-xl p-3 text-sm text-indigo-700">
                  الأجر/ساعة: <strong>{calcHourlyRate(Number(form.salary)).toFixed(2)} ج</strong>
                  {form.overtimeHours > 0 && <span className="mr-3">• القيمة: <strong>{Math.round(calcHourlyRate(Number(form.salary)) * Number(form.overtimeHours))} ج</strong></span>}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ساعات الإضافي</label>
                  <input type="number" min="0.5" step="0.5" value={form.overtimeHours}
                    onChange={e => setForm(prev => ({ ...prev, overtimeHours: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
                  <input type="date" value={form.date} onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">السبب</label>
                <input type="text" value={form.reason} onChange={e => setForm(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="سبب الإضافي..." />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">إلغاء</button>
              <button onClick={handleAdd} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-sm transition">حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overtime;
