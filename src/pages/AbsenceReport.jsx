import React, { useState } from 'react';

const AbsenceReport = ({ employees }) => {
  const [records, setRecords] = useState([
    { id: 1, employeeCode: '202043', employeeName: 'سلوي منجود محمد', department: 'الإنتاج', date: '2026-09-02', type: 'غياب باذن', reason: 'ظرف شخصي', permissionMethod: 'واتس قبل العمل', type_category: 'انتاج' },
    { id: 2, employeeCode: '203012', employeeName: 'حنان عادل محمد', department: 'الإنتاج', date: '2026-09-05', type: 'غياب باذن', reason: 'مرضي', permissionMethod: 'واتس قبل العمل', type_category: 'انتاج' },
    { id: 3, employeeCode: '203147', employeeName: 'محمد مجدي', department: 'الإنتاج', date: '2026-09-07', type: 'بدون اذن', reason: '', permissionMethod: '', type_category: 'انتاج' },
    { id: 4, employeeCode: '106014', employeeName: 'محمد علي السيد', department: 'الحقن', date: '2026-09-10', type: 'غياب باذن', reason: 'إجازة سنوية', permissionMethod: 'طلب رسمي', type_category: 'ثابت' },
    { id: 5, employeeCode: '107011', employeeName: 'أحمد محمود إبراهيم', department: 'الحقن', date: '2026-09-15', type: 'بدون اذن', reason: '', permissionMethod: '', type_category: 'ثابت' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ employeeCode: '', employeeName: '', department: '', date: '', type: 'غياب باذن', reason: '', permissionMethod: '', type_category: 'انتاج' });
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const absenceTypes = ['غياب باذن', 'بدون اذن', 'إجازة مرضية', 'إجازة سنوية', 'انصراف مبكر'];
  const permissionMethods = ['واتس قبل العمل', 'طلب رسمي', 'اتصال هاتفي', 'بدون إذن', ''];

  const typeColors = {
    'غياب باذن': 'bg-blue-100 text-blue-700',
    'بدون اذن': 'bg-red-100 text-red-700',
    'إجازة مرضية': 'bg-green-100 text-green-700',
    'إجازة سنوية': 'bg-purple-100 text-purple-700',
    'انصراف مبكر': 'bg-orange-100 text-orange-700',
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
    setForm({ employeeCode: '', employeeName: '', department: '', date: '', type: 'غياب باذن', reason: '', permissionMethod: '', type_category: 'انتاج' });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('حذف هذا السجل؟')) setRecords(prev => prev.filter(r => r.id !== id));
  };

  const filtered = records.filter(r => {
    const matchSearch = r.employeeName.includes(search) || r.employeeCode.includes(search);
    const matchType = !filterType || r.type === filterType;
    const matchCat = !filterCategory || r.type_category === filterCategory;
    return matchSearch && matchType && matchCat;
  });

  const withPermission = filtered.filter(r => r.type === 'غياب باذن' || r.type === 'إجازة مرضية' || r.type === 'إجازة سنوية').length;
  const withoutPermission = filtered.filter(r => r.type === 'بدون اذن').length;

  // Employee summary
  const empSummary = {};
  filtered.forEach(r => {
    if (!empSummary[r.employeeCode]) empSummary[r.employeeCode] = { name: r.employeeName, code: r.employeeCode, withPermission: 0, withoutPermission: 0 };
    if (r.type === 'بدون اذن') empSummary[r.employeeCode].withoutPermission++;
    else empSummary[r.employeeCode].withPermission++;
  });

  return (
    <div className="p-6 space-y-5 fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">تقرير الغائبين</h1>
          <p className="text-gray-500 text-sm">{filtered.length} غياب</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition">
          + تسجيل غياب
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-700">{filtered.length}</div>
          <div className="text-gray-500 text-sm mt-1">إجمالي الغياب</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{withPermission}</div>
          <div className="text-blue-500 text-sm mt-1">غياب باذن</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-red-700">{withoutPermission}</div>
          <div className="text-red-500 text-sm mt-1">بدون اذن</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-700">{Object.keys(empSummary).length}</div>
          <div className="text-orange-500 text-sm mt-1">موظف غائب</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3">
        <input type="text" placeholder="🔍 بحث..." value={search} onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm flex-1 min-w-40 focus:outline-none focus:ring-2 focus:ring-red-300" />
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300">
          <option value="">انتاج + ثابت</option>
          <option value="انتاج">الانتاج فقط</option>
          <option value="ثابت">الثابت فقط</option>
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300">
          <option value="">كل الأنواع</option>
          {absenceTypes.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Employee Summary */}
      {Object.keys(empSummary).length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-gray-700 mb-3">📊 ملخص الغياب لكل موظف</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.values(empSummary).map(emp => (
              <div key={emp.code} className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium text-gray-800">{emp.name}</div>
                  <div className="text-xs text-gray-400">{emp.code}</div>
                </div>
                <div className="flex gap-2">
                  {emp.withPermission > 0 && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold">{emp.withPermission}باذن</span>}
                  {emp.withoutPermission > 0 && <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold">{emp.withoutPermission}بدون</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                <th className="px-3 py-3 text-right font-semibold text-gray-600">تاريخ الغياب</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">نوع الغياب</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">السبب</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">طلب الإذن</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((rec, i) => (
                <tr key={rec.id} className={`hover:bg-gray-50 transition ${rec.type === 'بدون اذن' ? 'bg-red-50' : ''}`}>
                  <td className="px-3 py-2.5 text-gray-400">{i + 1}</td>
                  <td className="px-3 py-2.5">
                    <div className="font-medium text-gray-800">{rec.employeeName}</div>
                    <div className="text-xs text-gray-400">{rec.employeeCode}</div>
                  </td>
                  <td className="px-3 py-2.5 text-gray-600">{rec.department}</td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${rec.type_category === 'انتاج' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                      {rec.type_category}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-gray-600">{rec.date}</td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[rec.type] || 'bg-gray-100 text-gray-600'}`}>{rec.type}</span>
                  </td>
                  <td className="px-3 py-2.5 text-gray-500 text-xs">{rec.reason || '—'}</td>
                  <td className="px-3 py-2.5 text-gray-500 text-xs">{rec.permissionMethod || '—'}</td>
                  <td className="px-3 py-2.5">
                    <button onClick={() => handleDelete(rec.id)} className="text-red-400 hover:bg-red-50 p-1.5 rounded-lg transition">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-10 text-gray-400">لا توجد سجلات غياب</div>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-800">تسجيل غياب</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الموظف</label>
                <select value={form.employeeCode} onChange={e => {
                  const emp = employees.find(emp => emp.code === e.target.value);
                  setForm(prev => ({ ...prev, employeeCode: e.target.value, employeeName: emp?.name || '', department: emp?.department || '', type_category: emp?.type || 'انتاج' }));
                }} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300">
                  <option value="">اختر الموظف</option>
                  {employees.map(e => <option key={e.id} value={e.code}>{e.name} ({e.type})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الغياب</label>
                  <input type="date" value={form.date} onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نوع الغياب</label>
                  <select value={form.type} onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300">
                    {absenceTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">السبب</label>
                <input type="text" value={form.reason} onChange={e => setForm(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" placeholder="سبب الغياب..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">طريقة طلب الإذن</label>
                <select value={form.permissionMethod} onChange={e => setForm(prev => ({ ...prev, permissionMethod: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300">
                  {permissionMethods.map(m => <option key={m} value={m}>{m || 'لا يوجد'}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">إلغاء</button>
              <button onClick={handleAdd} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium shadow-sm transition">حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AbsenceReport;
