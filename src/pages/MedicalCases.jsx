import React, { useState } from 'react';

const MedicalCases = ({ employees }) => {
  const [cases, setCases] = useState([
    { id: 1, employeeCode: '203012', employeeName: 'حنان عادل محمد', department: 'التغليف', condition: 'كسر في اليد', treatmentDate: '2026-02-10', amount: 2000, note: 'تم صرف ألفين جنيه', status: 'صُرف' },
    { id: 2, employeeCode: '203222', employeeName: 'سالي بدر أحمد', department: 'الإنتاج', condition: 'إجراء عملية', treatmentDate: '2026-02-12', amount: 300, note: 'علاج وذهاب للمستشفى', status: 'صُرف' },
    { id: 3, employeeCode: '106014', employeeName: 'محمد علي السيد', department: 'الحقن', condition: 'التهاب', treatmentDate: '2026-02-15', amount: 500, note: 'تقرير مرضي مقدَّم', status: 'معلق' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ employeeCode: '', employeeName: '', department: '', condition: '', treatmentDate: '', amount: '', note: '', status: 'معلق' });
  const [search, setSearch] = useState('');

  const handleAdd = () => {
    if (!form.employeeCode || !form.condition) return alert('يرجى إدخال البيانات المطلوبة');
    const emp = employees.find(e => e.code === form.employeeCode);
    setCases(prev => [...prev, { ...form, id: Date.now(), employeeName: emp?.name || form.employeeName, department: emp?.department || form.department, amount: Number(form.amount) }]);
    setForm({ employeeCode: '', employeeName: '', department: '', condition: '', treatmentDate: '', amount: '', note: '', status: 'معلق' });
    setShowModal(false);
  };

  const toggleStatus = (id) => setCases(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'صُرف' ? 'معلق' : 'صُرف' } : c));
  const handleDelete = (id) => { if (window.confirm('حذف هذا السجل؟')) setCases(prev => prev.filter(c => c.id !== id)); };

  const filtered = cases.filter(c => c.employeeName.includes(search) || c.employeeCode.includes(search));
  const totalPaid = filtered.filter(c => c.status === 'صُرف').reduce((s, c) => s + c.amount, 0);
  const totalPending = filtered.filter(c => c.status === 'معلق').reduce((s, c) => s + c.amount, 0);

  return (
    <div className="p-6 space-y-5 fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">الحالات المرضية وبدل العلاج</h1>
          <p className="text-gray-500 text-sm">{filtered.length} حالة</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition">
          + إضافة حالة
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-rose-700">{filtered.length}</div>
          <div className="text-rose-500 text-sm mt-1">إجمالي الحالات</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{totalPaid.toLocaleString()} ج</div>
          <div className="text-green-500 text-sm mt-1">تم صرفه</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-700">{totalPending.toLocaleString()} ج</div>
          <div className="text-orange-500 text-sm mt-1">معلق</div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <input type="text" placeholder="🔍 بحث..." value={search} onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-rose-300" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(c => (
          <div key={c.id} className={`bg-white rounded-2xl shadow-sm border p-5 ${c.status === 'صُرف' ? 'border-green-100' : 'border-orange-100'}`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-bold text-gray-800">{c.employeeName}</div>
                <div className="text-xs text-gray-400">{c.employeeCode} • {c.department}</div>
              </div>
              <button onClick={() => toggleStatus(c.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition ${c.status === 'صُرف' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-orange-100 text-orange-700 border-orange-200'}`}>
                {c.status}
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <span>🏥</span><span>{c.condition}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span>📅</span><span>{c.treatmentDate}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span>💰</span><span className="font-bold text-rose-600">{c.amount.toLocaleString()} ج</span>
              </div>
              {c.note && <div className="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">💬 {c.note}</div>}
            </div>
            <div className="mt-3 flex justify-end">
              <button onClick={() => handleDelete(c.id)} className="text-red-400 hover:bg-red-50 p-1.5 rounded-lg transition text-xs">🗑️ حذف</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="col-span-2 text-center py-10 text-gray-400 bg-white rounded-2xl">لا توجد حالات مرضية</div>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-800">إضافة حالة مرضية</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الموظف</label>
                <select value={form.employeeCode} onChange={e => {
                  const emp = employees.find(emp => emp.code === e.target.value);
                  setForm(prev => ({ ...prev, employeeCode: e.target.value, employeeName: emp?.name || '', department: emp?.department || '' }));
                }} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300">
                  <option value="">اختر الموظف</option>
                  {employees.map(e => <option key={e.id} value={e.code}>{e.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الحالة المرضية</label>
                <input type="text" value={form.condition} onChange={e => setForm(prev => ({ ...prev, condition: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" placeholder="كسر، التهاب، عملية..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الصرف</label>
                  <input type="date" value={form.treatmentDate} onChange={e => setForm(prev => ({ ...prev, treatmentDate: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ (ج)</label>
                  <input type="number" value={form.amount} onChange={e => setForm(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظة</label>
                <textarea value={form.note} onChange={e => setForm(prev => ({ ...prev, note: e.target.value }))} rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none" placeholder="تفاصيل إضافية..." />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">إلغاء</button>
              <button onClick={handleAdd} className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium shadow-sm transition">حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalCases;
