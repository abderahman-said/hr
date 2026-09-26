import React, { useState } from 'react';

const Loans = ({ loans, setLoans, employees }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ employeeCode: '', employeeName: '', amount: '', month: 'سبتمبر 2026', status: 'معلق' });

  const handleAdd = () => {
    if (!form.employeeCode || !form.amount) return alert('يرجى إدخال البيانات المطلوبة');
    const emp = employees.find(e => e.code === form.employeeCode);
    setLoans(prev => [...prev, { ...form, id: Date.now(), employeeName: emp ? emp.name : form.employeeName, amount: Number(form.amount) }]);
    setForm({ employeeCode: '', employeeName: '', amount: '', month: 'سبتمبر 2026', status: 'معلق' });
    setShowModal(false);
  };

  const toggleStatus = (id) => {
    setLoans(prev => prev.map(l => l.id === id ? { ...l, status: l.status === 'مخصوم' ? 'معلق' : 'مخصوم' } : l));
  };

  const handleDelete = (id) => {
    if (window.confirm('حذف السلفة؟')) setLoans(prev => prev.filter(l => l.id !== id));
  };

  const totalLoans = loans.reduce((s, l) => s + l.amount, 0);
  const deducted = loans.filter(l => l.status === 'مخصوم').reduce((s, l) => s + l.amount, 0);
  const pending = loans.filter(l => l.status === 'معلق').reduce((s, l) => s + l.amount, 0);

  return (
    <div className="p-6 space-y-5 fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">السلف الشهرية</h1>
          <p className="text-gray-500 text-sm">{loans.length} سلفة</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition">
          + إضافة سلفة
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{totalLoans.toLocaleString()} ج</div>
          <div className="text-blue-500 text-sm mt-1">إجمالي السلف</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{deducted.toLocaleString()} ج</div>
          <div className="text-green-500 text-sm mt-1">تم خصمها</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{pending.toLocaleString()} ج</div>
          <div className="text-orange-500 text-sm mt-1">معلقة</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-right font-semibold text-gray-600">#</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">الكود</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">الموظف</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">القيمة</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">الشهر</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">الحالة</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">إجراء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loans.map((loan, i) => (
              <tr key={loan.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                <td className="px-4 py-3 font-mono text-blue-600">{loan.employeeCode}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{loan.employeeName}</td>
                <td className="px-4 py-3 font-bold text-orange-600">{loan.amount.toLocaleString()} ج</td>
                <td className="px-4 py-3 text-gray-500">{loan.month}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleStatus(loan.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition ${loan.status === 'مخصوم' ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' : 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200'}`}>
                    {loan.status}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(loan.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loans.length === 0 && <div className="text-center py-10 text-gray-400">لا توجد سلف مسجلة</div>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-800">إضافة سلفة جديدة</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الموظف</label>
                <select value={form.employeeCode} onChange={e => {
                  const emp = employees.find(emp => emp.code === e.target.value);
                  setForm(prev => ({ ...prev, employeeCode: e.target.value, employeeName: emp?.name || '' }));
                }} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                  <option value="">اختر الموظف</option>
                  {employees.map(e => <option key={e.id} value={e.code}>{e.name} ({e.code})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">قيمة السلفة (ج)</label>
                <input type="number" value={form.amount} onChange={e => setForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="أدخل القيمة" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الشهر</label>
                <input type="text" value={form.month} onChange={e => setForm(prev => ({ ...prev, month: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">إلغاء</button>
              <button onClick={handleAdd} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm transition">حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loans;
