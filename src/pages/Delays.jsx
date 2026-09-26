import React, { useState } from 'react';

const Delays = ({ employees }) => {
  const [records, setRecords] = useState([
    { id: 1, fingerprint: '101', employeeCode: '202043', employeeName: 'سلوي منجود محمد', scheduledTime: '08:00', actualTime: '08:45', date: '2026-09-03', delayMinutes: 45 },
    { id: 2, fingerprint: '102', employeeCode: '203012', employeeName: 'حنان عادل محمد', scheduledTime: '08:00', actualTime: '08:20', date: '2026-09-05', delayMinutes: 20 },
    { id: 3, fingerprint: '201', employeeCode: '106014', employeeName: 'محمد علي السيد', scheduledTime: '09:00', actualTime: '09:30', date: '2026-09-08', delayMinutes: 30 },
    { id: 4, fingerprint: '101', employeeCode: '202043', employeeName: 'سلوي منجود محمد', scheduledTime: '08:00', actualTime: '09:00', date: '2026-09-15', delayMinutes: 60 },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ fingerprint: '', employeeCode: '', employeeName: '', scheduledTime: '08:00', actualTime: '', date: '' });
  const [search, setSearch] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  const calcDelay = (scheduled, actual) => {
    if (!scheduled || !actual) return 0;
    const [sh, sm] = scheduled.split(':').map(Number);
    const [ah, am] = actual.split(':').map(Number);
    const diff = (ah * 60 + am) - (sh * 60 + sm);
    return Math.max(0, diff);
  };

  const calcDeductionFromDelay = (minutes, salary) => {
    const dailyRate = salary / 26;
    const hourlyRate = dailyRate / 8;
    const minuteRate = hourlyRate / 60;
    return Math.round(minuteRate * minutes);
  };

  const handleAdd = () => {
    if (!form.employeeCode || !form.actualTime) return alert('يرجى إدخال البيانات المطلوبة');
    const delay = calcDelay(form.scheduledTime, form.actualTime);
    if (delay <= 0) return alert('لا يوجد تأخير! وقت الحضور قبل أو يساوي الوقت المقرر');
    const emp = employees.find(e => e.code === form.employeeCode);
    setRecords(prev => [...prev, { ...form, id: Date.now(), delayMinutes: delay, employeeName: emp?.name || form.employeeName }]);
    setForm({ fingerprint: '', employeeCode: '', employeeName: '', scheduledTime: '08:00', actualTime: '', date: '' });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('حذف هذا السجل؟')) setRecords(prev => prev.filter(r => r.id !== id));
  };

  const filtered = records.filter(r => {
    const matchSearch = r.employeeName.includes(search) || r.employeeCode.includes(search);
    const matchMonth = !filterMonth || r.date.startsWith(filterMonth);
    return matchSearch && matchMonth;
  });

  // Summary per employee
  const employeeSummary = {};
  filtered.forEach(r => {
    if (!employeeSummary[r.employeeCode]) {
      employeeSummary[r.employeeCode] = { name: r.employeeName, code: r.employeeCode, totalMinutes: 0, count: 0 };
    }
    employeeSummary[r.employeeCode].totalMinutes += r.delayMinutes;
    employeeSummary[r.employeeCode].count++;
  });

  const totalMinutes = filtered.reduce((s, r) => s + r.delayMinutes, 0);
  const [viewMode, setViewMode] = useState('detail'); // 'detail' or 'summary'

  return (
    <div className="p-6 space-y-5 fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">حساب التأخيرات</h1>
          <p className="text-gray-500 text-sm">{filtered.length} سجل • إجمالي {totalMinutes} دقيقة تأخير</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition">
          + تسجيل تأخير
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-700">{filtered.length}</div>
          <div className="text-yellow-500 text-sm mt-1">سجلات التأخير</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-700">{totalMinutes}</div>
          <div className="text-orange-500 text-sm mt-1">دقيقة تأخير إجمالي</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-red-700">{Object.keys(employeeSummary).length}</div>
          <div className="text-red-500 text-sm mt-1">موظف متأخر</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-700">{filtered.length > 0 ? Math.round(totalMinutes / filtered.length) : 0}</div>
          <div className="text-gray-500 text-sm mt-1">متوسط دقائق التأخير</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3">
        <input type="text" placeholder="🔍 بحث..." value={search} onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm flex-1 min-w-40 focus:outline-none focus:ring-2 focus:ring-yellow-300" />
        <input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300" />
        <div className="flex gap-2">
          <button onClick={() => setViewMode('detail')} className={`px-3 py-2 rounded-xl text-sm ${viewMode === 'detail' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-600'}`}>تفصيلي</button>
          <button onClick={() => setViewMode('summary')} className={`px-3 py-2 rounded-xl text-sm ${viewMode === 'summary' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-600'}`}>ملخص</button>
        </div>
      </div>

      {/* Detail View */}
      {viewMode === 'detail' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-3 py-3 text-right font-semibold text-gray-600">#</th>
                  <th className="px-3 py-3 text-right font-semibold text-gray-600">البصمة</th>
                  <th className="px-3 py-3 text-right font-semibold text-gray-600">الموظف</th>
                  <th className="px-3 py-3 text-right font-semibold text-gray-600">التاريخ</th>
                  <th className="px-3 py-3 text-right font-semibold text-gray-600">الوقت المقرر</th>
                  <th className="px-3 py-3 text-right font-semibold text-gray-600">وقت الحضور</th>
                  <th className="px-3 py-3 text-right font-semibold text-gray-600 bg-yellow-50">التأخير</th>
                  <th className="px-3 py-3 text-right font-semibold text-gray-600">التصنيف</th>
                  <th className="px-3 py-3 text-right font-semibold text-gray-600">حذف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((rec, i) => {
                  const mins = rec.delayMinutes;
                  const label = mins <= 15 ? { text: 'خفيف', color: 'bg-green-100 text-green-700' }
                    : mins <= 30 ? { text: 'متوسط', color: 'bg-yellow-100 text-yellow-700' }
                    : mins <= 60 ? { text: 'كبير', color: 'bg-orange-100 text-orange-700' }
                    : { text: 'شديد', color: 'bg-red-100 text-red-700' };
                  return (
                    <tr key={rec.id} className="hover:bg-gray-50 transition">
                      <td className="px-3 py-2.5 text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2.5 font-mono text-blue-600">{rec.fingerprint}</td>
                      <td className="px-3 py-2.5">
                        <div className="font-medium text-gray-800">{rec.employeeName}</div>
                        <div className="text-xs text-gray-400">{rec.employeeCode}</div>
                      </td>
                      <td className="px-3 py-2.5 text-gray-500">{rec.date}</td>
                      <td className="px-3 py-2.5 text-gray-600">{rec.scheduledTime}</td>
                      <td className="px-3 py-2.5 text-red-500 font-medium">{rec.actualTime}</td>
                      <td className="px-3 py-2.5 bg-yellow-50">
                        <span className="font-bold text-yellow-700">{mins} دقيقة</span>
                        <div className="text-xs text-yellow-500">{Math.floor(mins/60)}:{String(mins%60).padStart(2,'0')} ساعة</div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${label.color}`}>{label.text}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <button onClick={() => handleDelete(rec.id)} className="text-red-400 hover:bg-red-50 p-1.5 rounded-lg transition">🗑️</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="text-center py-10 text-gray-400">لا توجد سجلات تأخير</div>}
        </div>
      )}

      {/* Summary View */}
      {viewMode === 'summary' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-right font-semibold text-gray-600">الموظف</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">مرات التأخير</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">إجمالي الدقائق</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">إجمالي الساعات</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">التصنيف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {Object.values(employeeSummary).sort((a,b) => b.totalMinutes - a.totalMinutes).map(emp => {
                const hrs = Math.floor(emp.totalMinutes / 60);
                const mins = emp.totalMinutes % 60;
                const emp_data = employees.find(e => e.code === emp.code);
                const deduction = emp_data ? calcDeductionFromDelay(emp.totalMinutes, Number(emp_data.salary)) : 0;
                return (
                  <tr key={emp.code} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{emp.name}</div>
                      <div className="text-xs text-gray-400">{emp.code}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-bold">{emp.count} مرة</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-yellow-700">{emp.totalMinutes} دقيقة</td>
                    <td className="px-4 py-3 text-gray-600">{hrs}:{String(mins).padStart(2,'0')}</td>
                    <td className="px-4 py-3">
                      {emp.totalMinutes >= 60 ? (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                          خصم مقترح: {deduction} ج
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">منتظم</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-800">تسجيل تأخير</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الموظف</label>
                <select value={form.employeeCode} onChange={e => {
                  const emp = employees.find(emp => emp.code === e.target.value);
                  setForm(prev => ({ ...prev, employeeCode: e.target.value, employeeName: emp?.name || '', scheduledTime: '08:00' }));
                }} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300">
                  <option value="">اختر الموظف</option>
                  {employees.map(e => <option key={e.id} value={e.code}>{e.name} ({e.code})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رقم البصمة</label>
                  <input type="text" value={form.fingerprint} onChange={e => setForm(prev => ({ ...prev, fingerprint: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
                  <input type="date" value={form.date} onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الوقت المقرر</label>
                  <input type="time" value={form.scheduledTime} onChange={e => setForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">وقت الحضور الفعلي</label>
                  <input type="time" value={form.actualTime} onChange={e => setForm(prev => ({ ...prev, actualTime: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300" />
                </div>
              </div>
              {form.scheduledTime && form.actualTime && (
                <div className={`rounded-xl p-3 text-center text-sm font-medium ${calcDelay(form.scheduledTime, form.actualTime) > 0 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                  {calcDelay(form.scheduledTime, form.actualTime) > 0
                    ? `⚠️ تأخير: ${calcDelay(form.scheduledTime, form.actualTime)} دقيقة`
                    : '✅ لا يوجد تأخير'}
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">إلغاء</button>
              <button onClick={handleAdd} className="flex-1 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-medium shadow-sm transition">حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Delays;
