import React, { useState } from 'react';

const Transportation = ({ employees }) => {
  const [records, setRecords] = useState([
    { id: 1, employeeCode: '202096', employeeName: 'بوسي فارس يوسف شحاته', department: 'تغليف', address: 'القاهرة', attendanceDays: 22, allowancePerDay: 10 },
    { id: 2, employeeCode: '203025', employeeName: 'عزيزه موسي البكري', department: 'تغليف', address: 'الجيزة', attendanceDays: 20, allowancePerDay: 15 },
    { id: 3, employeeCode: '202043', employeeName: 'سلوي منجود محمد', department: 'تغليف', address: 'القاهرة', attendanceDays: 24, allowancePerDay: 10 },
    { id: 4, employeeCode: '203012', employeeName: 'حنان عادل محمد', department: 'تغليف', address: 'القليوبية', attendanceDays: 21, allowancePerDay: 12 },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ employeeCode: '', employeeName: '', department: '', address: '', attendanceDays: 26, allowancePerDay: 10 });
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState('سبتمبر 2026');

  const calcTotal = (days, rate) => Number(days) * Number(rate);

  const handleAdd = () => {
    if (!form.employeeCode) return alert('يرجى اختيار الموظف');
    const emp = employees.find(e => e.code === form.employeeCode);
    setRecords(prev => [...prev, {
      ...form, id: Date.now(),
      employeeName: emp?.name || form.employeeName,
      department: emp?.department || form.department,
      attendanceDays: Number(form.attendanceDays),
      allowancePerDay: Number(form.allowancePerDay),
    }]);
    setForm({ employeeCode: '', employeeName: '', department: '', address: '', attendanceDays: 26, allowancePerDay: 10 });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('حذف هذا السجل؟')) setRecords(prev => prev.filter(r => r.id !== id));
  };

  const updateRecord = (id, field, value) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const filtered = records.filter(r => r.employeeName.includes(search) || r.employeeCode.includes(search));
  const totalAllowance = filtered.reduce((s, r) => s + calcTotal(r.attendanceDays, r.allowancePerDay), 0);

  return (
    <div className="p-6 space-y-5 fade-in">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">بدل المواصلات</h1>
          <p className="text-gray-500 text-sm">{filtered.length} موظف • إجمالي {totalAllowance.toLocaleString()} ج</p>
        </div>
        <div className="flex gap-3">
          <select value={month} onChange={e => setMonth(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300">
            <option>سبتمبر 2026</option>
            <option>أكتوبر 2026</option>
          </select>
          <button onClick={() => setShowModal(true)} className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition">
            + إضافة موظف
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-cyan-700">{filtered.length}</div>
          <div className="text-cyan-500 text-sm mt-1">عدد الموظفين</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{filtered.length > 0 ? Math.round(filtered.reduce((s,r)=>s+Number(r.attendanceDays),0)/filtered.length) : 0}</div>
          <div className="text-blue-500 text-sm mt-1">متوسط أيام الحضور</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{totalAllowance.toLocaleString()} ج</div>
          <div className="text-green-500 text-sm mt-1">إجمالي بدل المواصلات</div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <input type="text" placeholder="🔍 بحث..." value={search} onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-cyan-300" />
      </div>

      {/* Table - Editable */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-cyan-50 p-3 border-b border-cyan-100 text-sm text-cyan-700 font-medium">
          💡 يمكن تعديل أيام الحضور والبدل مباشرة في الجدول
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-3 py-3 text-right font-semibold text-gray-600">#</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">الموظف</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">القسم</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">العنوان</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">أيام الحضور</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">البدل/يوم (ج)</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600 bg-cyan-50">الإجمالي</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((rec, i) => (
                <tr key={rec.id} className="hover:bg-gray-50 transition">
                  <td className="px-3 py-2.5 text-gray-400">{i + 1}</td>
                  <td className="px-3 py-2.5">
                    <div className="font-medium text-gray-800">{rec.employeeName}</div>
                    <div className="text-xs text-gray-400">{rec.employeeCode}</div>
                  </td>
                  <td className="px-3 py-2.5 text-gray-600">{rec.department}</td>
                  <td className="px-3 py-2.5 text-gray-500">{rec.address}</td>
                  <td className="px-3 py-2.5">
                    <input type="number" value={rec.attendanceDays} min="0" max="31"
                      onChange={e => updateRecord(rec.id, 'attendanceDays', Number(e.target.value))}
                      className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-center text-sm focus:outline-none focus:ring-1 focus:ring-cyan-300" />
                  </td>
                  <td className="px-3 py-2.5">
                    <input type="number" value={rec.allowancePerDay} min="0"
                      onChange={e => updateRecord(rec.id, 'allowancePerDay', Number(e.target.value))}
                      className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-center text-sm focus:outline-none focus:ring-1 focus:ring-cyan-300" />
                  </td>
                  <td className="px-3 py-2.5 bg-cyan-50">
                    <span className="font-bold text-cyan-700">{calcTotal(rec.attendanceDays, rec.allowancePerDay).toLocaleString()} ج</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <button onClick={() => handleDelete(rec.id)} className="text-red-400 hover:bg-red-50 p-1.5 rounded-lg transition">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-cyan-50 border-t border-cyan-100 font-bold">
                <td colSpan="6" className="px-3 py-3 text-cyan-700">الإجمالي</td>
                <td className="px-3 py-3 text-cyan-700 text-lg">{totalAllowance.toLocaleString()} ج</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-10 text-gray-400">لا توجد سجلات مواصلات</div>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-800">إضافة بدل مواصلات</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الموظف</label>
                <select value={form.employeeCode} onChange={e => {
                  const emp = employees.find(emp => emp.code === e.target.value);
                  setForm(prev => ({ ...prev, employeeCode: e.target.value, employeeName: emp?.name || '', department: emp?.department || '' }));
                }} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300">
                  <option value="">اختر الموظف</option>
                  {employees.filter(e => e.type === 'انتاج').map(e => <option key={e.id} value={e.code}>{e.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                <input type="text" value={form.address} onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300" placeholder="القاهرة، الجيزة..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">أيام الحضور</label>
                  <input type="number" value={form.attendanceDays} min="0" max="31"
                    onChange={e => setForm(prev => ({ ...prev, attendanceDays: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">البدل/يوم (ج)</label>
                  <input type="number" value={form.allowancePerDay} min="0"
                    onChange={e => setForm(prev => ({ ...prev, allowancePerDay: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300" />
                </div>
              </div>
              <div className="bg-cyan-50 rounded-xl p-3 text-center text-sm">
                <span className="text-cyan-600">الإجمالي المستحق: </span>
                <strong className="text-cyan-700">{calcTotal(form.attendanceDays, form.allowancePerDay).toLocaleString()} ج</strong>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">إلغاء</button>
              <button onClick={handleAdd} className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-medium shadow-sm transition">حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transportation;
