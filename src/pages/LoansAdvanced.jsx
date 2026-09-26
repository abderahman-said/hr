import React, { useState } from 'react';

const LoansAdvanced = ({ employees }) => {
  const [activeTab, setActiveTab] = useState('regular');

  const [regularLoans, setRegularLoans] = useState([
    { id: 1, employeeCode: '106014', employeeName: 'محمد علي السيد', department: 'الحقن', jobTitle: 'عامل مخزن', hireDate: '2018-03-15', loanAmount: 1500, installment: 1500, startDate: '2026-06-01', endDate: '2026-06-01', remainingMonths: 0 },
    { id: 2, employeeCode: '107011', employeeName: 'أحمد محمود إبراهيم', department: 'الحقن', jobTitle: 'مشرف', hireDate: '2017-06-20', loanAmount: 1000, installment: 1000, startDate: '2026-06-01', endDate: '2026-06-01', remainingMonths: 0 },
    { id: 3, employeeCode: '106019', employeeName: 'خالد السعودي الشحات', department: 'الحقن', jobTitle: 'عامل حقن', hireDate: '2019-01-10', loanAmount: 1000, installment: 500, startDate: '2026-07-01', endDate: '2026-08-01', remainingMonths: 0 },
  ]);

  const [exceptionalLoans, setExceptionalLoans] = useState([
    { id: 1, employeeCode: '102002', employeeName: 'محمد فايز العراقي', department: 'الحسابات', jobTitle: 'مدير الحسابات', loanAmount: 5000, installment: 1000, startDate: '2026-06-01', endDate: '2026-10-01', note: 'سلفة استثنائية لظروف خاصة', remainingMonths: 2 },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ employeeCode: '', employeeName: '', department: '', jobTitle: '', hireDate: '', loanAmount: '', installment: '', startDate: '', endDate: '', note: '' });
  const [search, setSearch] = useState('');

  const calcRemainingMonths = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
    return Math.max(0, diff);
  };

  const handleAdd = () => {
    if (!form.employeeCode || !form.loanAmount) return alert('يرجى إدخال البيانات المطلوبة');
    const emp = employees.find(e => e.code === form.employeeCode);
    const newRecord = {
      ...form,
      id: Date.now(),
      employeeName: emp?.name || form.employeeName,
      department: emp?.department || form.department,
      loanAmount: Number(form.loanAmount),
      installment: Number(form.installment),
      remainingMonths: calcRemainingMonths(form.startDate, form.endDate),
    };
    if (activeTab === 'regular') setRegularLoans(prev => [...prev, newRecord]);
    else setExceptionalLoans(prev => [...prev, newRecord]);
    setForm({ employeeCode: '', employeeName: '', department: '', jobTitle: '', hireDate: '', loanAmount: '', installment: '', startDate: '', endDate: '', note: '' });
    setShowModal(false);
  };

  const handleDelete = (id, type) => {
    if (!window.confirm('حذف هذا السجل؟')) return;
    if (type === 'regular') setRegularLoans(prev => prev.filter(r => r.id !== id));
    else setExceptionalLoans(prev => prev.filter(r => r.id !== id));
  };

  const currentList = activeTab === 'regular' ? regularLoans : exceptionalLoans;
  const filtered = currentList.filter(r => r.employeeName.includes(search) || r.employeeCode.includes(search));
  const totalAmount = filtered.reduce((s, r) => s + r.loanAmount, 0);
  const totalInstallments = filtered.reduce((s, r) => s + r.installment, 0);

  return (
    <div className="p-6 space-y-5 fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">السلف العادية والاستثنائية</h1>
          <p className="text-gray-500 text-sm">{currentList.length} سلفة</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition">
          + إضافة سلفة
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[['regular', '💼 السلف العادية', regularLoans.length], ['exceptional', '⚡ السلف الاستثنائية', exceptionalLoans.length]].map(([key, label, count]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition ${activeTab === key ? 'bg-orange-600 text-white shadow' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {label} <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === key ? 'bg-white/20' : 'bg-gray-100'}`}>{count}</span>
          </button>
        ))}
      </div>

      {/* Info Banner */}
      {activeTab === 'exceptional' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-amber-800 text-sm">
          ⚡ السلف الاستثنائية تتطلب موافقة خاصة من الإدارة وتُسدَّد على أقساط شهرية
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-700">{totalAmount.toLocaleString()} ج</div>
          <div className="text-orange-500 text-sm mt-1">إجمالي السلف</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{totalInstallments.toLocaleString()} ج</div>
          <div className="text-blue-500 text-sm mt-1">القسط الشهري</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{filtered.length}</div>
          <div className="text-green-500 text-sm mt-1">عدد السلف</div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <input type="text" placeholder="🔍 بحث..." value={search} onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-300" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-3 py-3 text-right font-semibold text-gray-600">الموظف</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">القسم</th>
                {activeTab === 'regular' && <th className="px-3 py-3 text-right font-semibold text-gray-600">تاريخ التعيين</th>}
                <th className="px-3 py-3 text-right font-semibold text-gray-600">قيمة السلفة</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">قسط السداد</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">تاريخ البداية</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">تاريخ الانتهاء</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">الأقساط</th>
                {activeTab === 'exceptional' && <th className="px-3 py-3 text-right font-semibold text-gray-600">ملاحظة</th>}
                <th className="px-3 py-3 text-right font-semibold text-gray-600">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((rec) => {
                const months = calcRemainingMonths(rec.startDate, rec.endDate);
                return (
                  <tr key={rec.id} className="hover:bg-gray-50 transition">
                    <td className="px-3 py-3">
                      <div className="font-medium text-gray-800">{rec.employeeName}</div>
                      <div className="text-xs text-gray-400">{rec.employeeCode} • {rec.jobTitle}</div>
                    </td>
                    <td className="px-3 py-3 text-gray-600">{rec.department}</td>
                    {activeTab === 'regular' && <td className="px-3 py-3 text-gray-500 text-xs">{rec.hireDate}</td>}
                    <td className="px-3 py-3 font-bold text-orange-600">{rec.loanAmount.toLocaleString()} ج</td>
                    <td className="px-3 py-3 text-blue-600 font-semibold">{rec.installment.toLocaleString()} ج/شهر</td>
                    <td className="px-3 py-3 text-gray-500 text-xs">{rec.startDate}</td>
                    <td className="px-3 py-3 text-gray-500 text-xs">{rec.endDate}</td>
                    <td className="px-3 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${months === 0 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {months === 0 ? 'منتهية' : `${months} شهر`}
                      </span>
                    </td>
                    {activeTab === 'exceptional' && <td className="px-3 py-3 text-gray-500 text-xs max-w-32 truncate">{rec.note}</td>}
                    <td className="px-3 py-3">
                      <button onClick={() => handleDelete(rec.id, activeTab)} className="text-red-400 hover:bg-red-50 p-1.5 rounded-lg transition">🗑️</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-10 text-gray-400">لا توجد سلف مسجلة</div>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">إضافة {activeTab === 'regular' ? 'سلفة عادية' : 'سلفة استثنائية'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الموظف</label>
                <select value={form.employeeCode} onChange={e => {
                  const emp = employees.find(emp => emp.code === e.target.value);
                  setForm(prev => ({ ...prev, employeeCode: e.target.value, employeeName: emp?.name || '', department: emp?.department || '', hireDate: emp?.hireDate || '' }));
                }} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
                  <option value="">اختر الموظف</option>
                  {employees.map(e => <option key={e.id} value={e.code}>{e.name} ({e.code})</option>)}
                </select>
              </div>
              {form.hireDate && <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">تاريخ التعيين: {form.hireDate}</div>}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">قيمة السلفة (ج)</label>
                  <input type="number" value={form.loanAmount} onChange={e => setForm(prev => ({ ...prev, loanAmount: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">قسط السداد (ج/شهر)</label>
                  <input type="number" value={form.installment} onChange={e => setForm(prev => ({ ...prev, installment: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ البداية</label>
                  <input type="date" value={form.startDate} onChange={e => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الانتهاء</label>
                  <input type="date" value={form.endDate} onChange={e => setForm(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
              </div>
              {form.loanAmount && form.installment && (
                <div className="bg-orange-50 rounded-xl p-3 text-sm text-orange-700 grid grid-cols-2 gap-2">
                  <div>عدد الأقساط: <strong>{Math.ceil(form.loanAmount / form.installment)}</strong></div>
                  <div>مدة السداد: <strong>{calcRemainingMonths(form.startDate, form.endDate)} شهر</strong></div>
                </div>
              )}
              {activeTab === 'exceptional' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظة / سبب السلفة الاستثنائية</label>
                  <textarea value={form.note} onChange={e => setForm(prev => ({ ...prev, note: e.target.value }))} rows={2}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                    placeholder="مبلغ السلفة: رقماً وكتابةً..." />
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">إلغاء</button>
              <button onClick={handleAdd} className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium shadow-sm transition">حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoansAdvanced;
