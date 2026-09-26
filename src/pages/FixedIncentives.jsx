import React, { useState } from 'react';

const FixedIncentives = ({ employees }) => {
  const [records, setRecords] = useState([
    { id: 1, employeeCode: '203060', employeeName: 'أحمد سامي', department: 'المبيعات', jobTitle: 'مندوب مبيعات', salary: 4000, incentiveHours: 8, date: '2026-09-01', reason: 'الاجتهاد في العمل' },
    { id: 2, employeeCode: '107011', employeeName: 'أحمد محمود إبراهيم', department: 'الحقن', jobTitle: 'مشرف', salary: 4000, incentiveHours: 8, date: '2026-09-01', reason: 'الاجتهاد في العمل' },
    { id: 3, employeeCode: '106014', employeeName: 'محمد علي السيد', department: 'الحقن', jobTitle: 'عامل حقن', salary: 3500, incentiveHours: 4, date: '2026-09-15', reason: 'عمل إضافي' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ employeeCode: '', employeeName: '', department: '', jobTitle: '', salary: 0, incentiveHours: 0, date: '', reason: '' });
  const [search, setSearch] = useState('');

  const calcHourlyRate = (salary) => salary / 26 / 8;
  const calcIncentiveValue = (salary, hours) => Math.round(calcHourlyRate(salary) * hours);

  const handleAdd = () => {
    if (!form.employeeCode || !form.incentiveHours) return alert('يرجى إدخال البيانات المطلوبة');
    const emp = employees.find(e => e.code === form.employeeCode);
    setRecords(prev => [...prev, {
      ...form, id: Date.now(),
      employeeName: emp?.name || form.employeeName,
      department: emp?.department || form.department,
      salary: emp ? Number(emp.salary) : Number(form.salary),
      incentiveHours: Number(form.incentiveHours),
    }]);
    setForm({ employeeCode: '', employeeName: '', department: '', jobTitle: '', salary: 0, incentiveHours: 0, date: '', reason: '' });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('حذف هذا السجل؟')) setRecords(prev => prev.filter(r => r.id !== id));
  };

  const filtered = records.filter(r => r.employeeName.includes(search) || r.employeeCode.includes(search));
  const totalValue = filtered.reduce((s, r) => s + calcIncentiveValue(r.salary, r.incentiveHours), 0);
  const totalHours = filtered.reduce((s, r) => s + Number(r.incentiveHours), 0);

  return (
    <div className="p-6 space-y-5 fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">حوافز ومكافآت العمالة الثابتة</h1>
          <p className="text-gray-500 text-sm">{filtered.length} سجل • {totalHours} ساعة • إجمالي {totalValue.toLocaleString()} ج</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition">
          🏆 إضافة حافز
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-amber-800 text-sm">
        ⚠️ هذا قسم حوافز العمالة <strong>الثابتة</strong> — يُحسب بالساعة بناءً على الراتب (مختلف عن حوافز الانتاج)
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-emerald-700">{totalHours}</div>
          <div className="text-emerald-500 text-sm mt-1">إجمالي الساعات</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{filtered.length}</div>
          <div className="text-green-500 text-sm mt-1">سجل</div>
        </div>
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-teal-700">{totalValue.toLocaleString()} ج</div>
          <div className="text-teal-500 text-sm mt-1">إجمالي قيمة الحوافز</div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <input type="text" placeholder="🔍 بحث..." value={search} onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-300" />
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
                <th className="px-3 py-3 text-right font-semibold text-gray-600">أجر/ساعة</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">ساعات الحافز</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600 bg-emerald-50">قيمة الحافز</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">التاريخ</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">السبب</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((rec, i) => {
                const hourlyRate = calcHourlyRate(Number(rec.salary));
                const value = calcIncentiveValue(Number(rec.salary), Number(rec.incentiveHours));
                return (
                  <tr key={rec.id} className="hover:bg-gray-50 transition">
                    <td className="px-3 py-2.5 text-gray-400">{i + 1}</td>
                    <td className="px-3 py-2.5">
                      <div className="font-medium text-gray-800">{rec.employeeName}</div>
                      <div className="text-xs text-gray-400">{rec.employeeCode} • {rec.jobTitle}</div>
                    </td>
                    <td className="px-3 py-2.5 text-gray-600">{rec.department}</td>
                    <td className="px-3 py-2.5 text-gray-600">{Number(rec.salary).toLocaleString()} ج</td>
                    <td className="px-3 py-2.5 text-gray-500">{hourlyRate.toFixed(2)} ج</td>
                    <td className="px-3 py-2.5 font-bold text-emerald-600">{rec.incentiveHours} ساعة</td>
                    <td className="px-3 py-2.5 bg-emerald-50">
                      <span className="font-bold text-emerald-700">{value.toLocaleString()} ج</span>
                    </td>
                    <td className="px-3 py-2.5 text-gray-500 text-xs">{rec.date}</td>
                    <td className="px-3 py-2.5 text-gray-500 text-xs max-w-28 truncate">{rec.reason}</td>
                    <td className="px-3 py-2.5">
                      <button onClick={() => handleDelete(rec.id)} className="text-red-400 hover:bg-red-50 p-1.5 rounded-lg transition">🗑️</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-emerald-50 border-t border-emerald-100 font-bold">
                <td colSpan="5" className="px-3 py-3 text-emerald-700">الإجمالي</td>
                <td className="px-3 py-3 text-emerald-700">{totalHours} ساعة</td>
                <td className="px-3 py-3 text-emerald-700 text-lg">{totalValue.toLocaleString()} ج</td>
                <td colSpan="3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-10 text-gray-400">لا توجد سجلات حوافز</div>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-800">إضافة حافز (عمالة ثابتة)</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الموظف (عمالة ثابتة)</label>
                <select value={form.employeeCode} onChange={e => {
                  const emp = employees.find(emp => emp.code === e.target.value);
                  setForm(prev => ({ ...prev, employeeCode: e.target.value, employeeName: emp?.name || '', department: emp?.department || '', salary: emp?.salary || 0 }));
                }} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300">
                  <option value="">اختر الموظف</option>
                  {employees.filter(e => e.type === 'ثابت').map(e => <option key={e.id} value={e.code}>{e.name}</option>)}
                </select>
              </div>
              {form.salary > 0 && (
                <div className="bg-emerald-50 rounded-xl p-3 text-sm text-emerald-700">
                  أجر/ساعة: <strong>{calcHourlyRate(Number(form.salary)).toFixed(2)} ج</strong>
                  {form.incentiveHours > 0 && <span className="mr-3">• الحافز: <strong>{calcIncentiveValue(Number(form.salary), Number(form.incentiveHours))} ج</strong></span>}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ساعات الحافز</label>
                  <input type="number" min="0.5" step="0.5" value={form.incentiveHours}
                    onChange={e => setForm(prev => ({ ...prev, incentiveHours: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
                  <input type="date" value={form.date} onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">السبب</label>
                <input type="text" value={form.reason} onChange={e => setForm(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="الاجتهاد في العمل..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">إلغاء</button>
              <button onClick={handleAdd} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-sm transition">حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FixedIncentives;
