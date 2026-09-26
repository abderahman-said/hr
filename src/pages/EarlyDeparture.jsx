import React, { useState } from 'react';

const EarlyDeparture = ({ employees }) => {
  const [records, setRecords] = useState([
    { id: 1, employeeCode: '106014', employeeName: 'محمد علي السيد', department: 'الحقن', type_category: 'ثابت', departureType: 'انصراف نهائي "نصف يوم"', date: '2026-07-01', duration: 0.5, durationText: 'نصف يوم', reason: 'ظرف شخصي' },
    { id: 2, employeeCode: '107011', employeeName: 'أحمد محمود إبراهيم', department: 'الحقن', type_category: 'ثابت', departureType: 'انصراف وعودة', date: '2026-07-03', duration: 2, durationText: '2 ساعة', reason: 'ظرف شخصي' },
    { id: 3, employeeCode: '202043', employeeName: 'سلوي منجود محمد', department: 'تغليف', type_category: 'انتاج', departureType: 'انصراف نهائي "نصف يوم"', date: '2026-09-10', duration: 0.5, durationText: 'نصف يوم', reason: 'أمور عائلية' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ employeeCode: '', employeeName: '', department: '', type_category: 'ثابت', departureType: 'انصراف نهائي "نصف يوم"', date: '', duration: 0.5, durationText: 'نصف يوم', reason: '' });
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const departureTypes = ['انصراف نهائي "نصف يوم"', 'انصراف وعودة', 'انصراف مبكر'];
  const durationOptions = [
    { value: 0.25, text: 'ربع يوم' },
    { value: 0.5, text: 'نصف يوم' },
    { value: 1, text: 'ساعة' },
    { value: 2, text: '2 ساعة' },
    { value: 3, text: '3 ساعات' },
    { value: 4, text: '4 ساعات' },
  ];

  const calcDeduction = (empCode, duration) => {
    const emp = employees.find(e => e.code === empCode);
    if (!emp) return 0;
    const dailyRate = Number(emp.salary) / 26;
    if (duration <= 0.5) return Math.round(dailyRate * duration * 2);
    const hourlyRate = dailyRate / 8;
    return Math.round(hourlyRate * duration);
  };

  const handleAdd = () => {
    if (!form.employeeCode || !form.date) return alert('يرجى إدخال البيانات المطلوبة');
    const emp = employees.find(e => e.code === form.employeeCode);
    setRecords(prev => [...prev, {
      ...form, id: Date.now(),
      employeeName: emp?.name || form.employeeName,
      department: emp?.department || form.department,
      type_category: emp?.type || form.type_category,
    }]);
    setForm({ employeeCode: '', employeeName: '', department: '', type_category: 'ثابت', departureType: 'انصراف نهائي "نصف يوم"', date: '', duration: 0.5, durationText: 'نصف يوم', reason: '' });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('حذف هذا السجل؟')) setRecords(prev => prev.filter(r => r.id !== id));
  };

  const filtered = records.filter(r => {
    const matchSearch = r.employeeName.includes(search) || r.employeeCode.includes(search);
    const matchCat = !filterCategory || r.type_category === filterCategory;
    return matchSearch && matchCat;
  });

  const totalFinalDep = filtered.filter(r => r.departureType.includes('نهائي')).length;
  const totalWithReturn = filtered.filter(r => r.departureType.includes('وعودة')).length;

  return (
    <div className="p-6 space-y-5 fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">انصراف نصف يوم</h1>
          <p className="text-gray-500 text-sm">{filtered.length} سجل</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition">
          + تسجيل انصراف
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-700">{filtered.length}</div>
          <div className="text-amber-500 text-sm mt-1">إجمالي السجلات</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{totalFinalDep}</div>
          <div className="text-red-500 text-sm mt-1">انصراف نهائي</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{totalWithReturn}</div>
          <div className="text-blue-500 text-sm mt-1">انصراف وعودة</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3">
        <input type="text" placeholder="🔍 بحث..." value={search} onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm flex-1 min-w-40 focus:outline-none focus:ring-2 focus:ring-amber-300" />
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300">
          <option value="">انتاج + ثابت</option>
          <option value="انتاج">الانتاج</option>
          <option value="ثابت">الثابت</option>
        </select>
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
                <th className="px-3 py-3 text-right font-semibold text-gray-600">نوع العمالة</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">نوع الانصراف</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">التاريخ</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">المدة</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600 bg-red-50">الخصم المقترح</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">السبب</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((rec, i) => {
                const deduction = calcDeduction(rec.employeeCode, Number(rec.duration));
                return (
                  <tr key={rec.id} className="hover:bg-gray-50 transition">
                    <td className="px-3 py-2.5 text-gray-400">{i + 1}</td>
                    <td className="px-3 py-2.5">
                      <div className="font-medium text-gray-800">{rec.employeeName}</div>
                      <div className="text-xs text-gray-400">{rec.employeeCode}</div>
                    </td>
                    <td className="px-3 py-2.5 text-gray-600">{rec.department}</td>
                    <td className="px-3 py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${rec.type_category === 'انتاج' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{rec.type_category}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${rec.departureType.includes('نهائي') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {rec.departureType}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-gray-500">{rec.date}</td>
                    <td className="px-3 py-2.5 font-semibold text-amber-600">{rec.durationText}</td>
                    <td className="px-3 py-2.5 bg-red-50">
                      {deduction > 0 ? <span className="font-bold text-red-600">{deduction} ج</span> : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-3 py-2.5 text-gray-500 text-xs">{rec.reason}</td>
                    <td className="px-3 py-2.5">
                      <button onClick={() => handleDelete(rec.id)} className="text-red-400 hover:bg-red-50 p-1.5 rounded-lg transition">🗑️</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-10 text-gray-400">لا توجد سجلات انصراف</div>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-800">تسجيل انصراف</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الموظف</label>
                <select value={form.employeeCode} onChange={e => {
                  const emp = employees.find(emp => emp.code === e.target.value);
                  setForm(prev => ({ ...prev, employeeCode: e.target.value, employeeName: emp?.name || '', department: emp?.department || '', type_category: emp?.type || 'ثابت' }));
                }} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300">
                  <option value="">اختر الموظف</option>
                  {employees.map(e => <option key={e.id} value={e.code}>{e.name} ({e.type})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نوع الانصراف</label>
                  <select value={form.departureType} onChange={e => setForm(prev => ({ ...prev, departureType: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300">
                    {departureTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
                  <input type="date" value={form.date} onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المدة والعودة</label>
                <select value={form.duration} onChange={e => {
                  const opt = durationOptions.find(o => o.value === Number(e.target.value));
                  setForm(prev => ({ ...prev, duration: Number(e.target.value), durationText: opt?.text || e.target.value }));
                }} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300">
                  {durationOptions.map(o => <option key={o.value} value={o.value}>{o.text}</option>)}
                </select>
              </div>
              {form.employeeCode && (
                <div className="bg-amber-50 rounded-xl p-3 text-sm text-amber-700">
                  الخصم المقترح: <strong>{calcDeduction(form.employeeCode, form.duration)} ج</strong>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">السبب</label>
                <input type="text" value={form.reason} onChange={e => setForm(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" placeholder="ظرف شخصي..." />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">إلغاء</button>
              <button onClick={handleAdd} className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium shadow-sm transition">حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarlyDeparture;
