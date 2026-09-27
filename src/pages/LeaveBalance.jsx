import React, { useState } from 'react';

const LeaveBalance = ({ leaveBalance: leaveProp = [], setLeaveBalance: setLeaveProp, employees = [] }) => {
  const [localRecords, setLocalRecords] = useState(null);
  const records = localRecords ?? leaveProp;
  const setRecords = (fn) => {
    const next = typeof fn === 'function' ? fn(records) : fn;
    setLeaveProp && setLeaveProp(next);
    setLocalRecords(next);
  };

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ employeeCode: '', employeeName: '', type: 'انتاج', leaveType: 'رصيد', date: '', value: '' });
  const [search, setSearch] = useState('');
  const [filterEmpType, setFilterEmpType] = useState('');
  const [filterLeaveType, setFilterLeaveType] = useState('');

  const leaveTypes = ['رصيد', 'رصيد _ض', 'غياب باذن', 'بدون اذن', 'إجازة مرضية', 'إجازة سنوية'];

  const leaveTypeColors = {
    'رصيد': 'bg-green-100 text-green-700',
    'رصيد _ض': 'bg-teal-100 text-teal-700',
    'غياب باذن': 'bg-blue-100 text-blue-700',
    'بدون اذن': 'bg-red-100 text-red-700',
    'إجازة مرضية': 'bg-orange-100 text-orange-700',
    'إجازة سنوية': 'bg-purple-100 text-purple-700',
  };

  const handleAdd = () => {
    if (!form.employeeCode || !form.value) return alert('يرجى إدخال البيانات المطلوبة');
    const emp = employees.find(e => e.code === form.employeeCode);
    setRecords(prev => [...prev, { ...form, id: Date.now(), employeeName: emp?.name || form.employeeName, type: emp?.type || form.type, value: Number(form.value) }]);
    setForm({ employeeCode: '', employeeName: '', type: 'انتاج', leaveType: 'رصيد', date: '', value: '' });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('حذف هذا السجل؟')) setRecords(prev => prev.filter(r => r.id !== id));
  };

  const filtered = records.filter(r => {
    const matchSearch = r.employeeName.includes(search) || r.employeeCode.includes(search);
    const matchEmpType = !filterEmpType || r.type === filterEmpType;
    const matchLeave = !filterLeaveType || r.leaveType === filterLeaveType;
    return matchSearch && matchEmpType && matchLeave;
  });

  // Balance per employee
  const balanceSummary = {};
  filtered.forEach(r => {
    if (!balanceSummary[r.employeeCode]) {
      balanceSummary[r.employeeCode] = { name: r.employeeName, code: r.employeeCode, type: r.type, balance: 0, usedPermission: 0, usedWithout: 0 };
    }
    if (r.leaveType === 'رصيد' || r.leaveType === 'رصيد _ض') {
      balanceSummary[r.employeeCode].balance += Number(r.value);
    } else if (r.leaveType === 'غياب باذن' || r.leaveType === 'إجازة سنوية') {
      balanceSummary[r.employeeCode].usedPermission += Number(r.value);
    } else if (r.leaveType === 'بدون اذن') {
      balanceSummary[r.employeeCode].usedWithout += Number(r.value);
    }
  });

  const totalBalance = Object.values(balanceSummary).reduce((s, e) => s + e.balance, 0);
  const totalUsed = Object.values(balanceSummary).reduce((s, e) => s + e.usedPermission + e.usedWithout, 0);

  return (
    <div className="p-6 space-y-5 fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">رصيد الإجازات</h1>
          <p className="text-gray-500 text-sm">{filtered.length} سجل • {Object.keys(balanceSummary).length} موظف</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition">
          + إضافة رصيد/غياب
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{totalBalance}</div>
          <div className="text-green-500 text-sm mt-1">إجمالي الرصيد المتاح</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{Object.values(balanceSummary).reduce((s,e)=>s+e.usedPermission,0)}</div>
          <div className="text-blue-500 text-sm mt-1">إجازات مستخدمة باذن</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-red-700">{Object.values(balanceSummary).reduce((s,e)=>s+e.usedWithout,0)}</div>
          <div className="text-red-500 text-sm mt-1">غياب بدون اذن</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3">
        <input type="text" placeholder="🔍 بحث..." value={search} onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm flex-1 min-w-40 focus:outline-none focus:ring-2 focus:ring-green-300" />
        <select value={filterEmpType} onChange={e => setFilterEmpType(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300">
          <option value="">انتاج + ثابت</option>
          <option value="انتاج">الانتاج</option>
          <option value="ثابت">الثابت</option>
        </select>
        <select value={filterLeaveType} onChange={e => setFilterLeaveType(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300">
          <option value="">كل الأنواع</option>
          {leaveTypes.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Balance Cards per Employee */}
      {Object.keys(balanceSummary).length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-gray-700 mb-4">📊 رصيد كل موظف</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.values(balanceSummary).map(emp => {
              const remaining = emp.balance - emp.usedPermission;
              return (
                <div key={emp.code} className="border border-gray-100 rounded-xl p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{emp.name}</div>
                      <div className="text-xs text-gray-400">{emp.code}</div>
                    </div>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${emp.type === 'انتاج' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{emp.type}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-center mt-2 text-xs">
                    <div className="bg-green-50 rounded p-1">
                      <div className="font-bold text-green-700">{emp.balance}</div>
                      <div className="text-green-500">رصيد</div>
                    </div>
                    <div className="bg-blue-50 rounded p-1">
                      <div className="font-bold text-blue-700">{emp.usedPermission}</div>
                      <div className="text-blue-500">مستخدم</div>
                    </div>
                    <div className={`rounded p-1 ${remaining < 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
                      <div className={`font-bold ${remaining < 0 ? 'text-red-600' : 'text-gray-700'}`}>{remaining}</div>
                      <div className="text-gray-500">متبقي</div>
                    </div>
                  </div>
                  {emp.usedWithout > 0 && (
                    <div className="mt-2 text-center">
                      <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">{emp.usedWithout} غياب بدون اذن</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detailed Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-3 py-3 text-right font-semibold text-gray-600">#</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">الموظف</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">نوع العمالة</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">نوع الإجازة</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">التاريخ</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">القيمة</th>
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
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${rec.type === 'انتاج' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{rec.type}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${leaveTypeColors[rec.leaveType] || 'bg-gray-100 text-gray-600'}`}>{rec.leaveType}</span>
                  </td>
                  <td className="px-3 py-2.5 text-gray-500">{rec.date}</td>
                  <td className="px-3 py-2.5 font-bold text-green-700">{rec.value} {rec.leaveType.includes('رصيد') ? 'جنيه' : 'يوم'}</td>
                  <td className="px-3 py-2.5">
                    <button onClick={() => handleDelete(rec.id)} className="text-red-400 hover:bg-red-50 p-1.5 rounded-lg transition">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-10 text-gray-400">لا توجد سجلات إجازات</div>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-800">إضافة رصيد / غياب</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الموظف</label>
                <select value={form.employeeCode} onChange={e => {
                  const emp = employees.find(emp => emp.code === e.target.value);
                  setForm(prev => ({ ...prev, employeeCode: e.target.value, employeeName: emp?.name || '', type: emp?.type || 'انتاج' }));
                }} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300">
                  <option value="">اختر الموظف</option>
                  {employees.map(e => <option key={e.id} value={e.code}>{e.name} ({e.type})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نوع الإجازة</label>
                  <select value={form.leaveType} onChange={e => setForm(prev => ({ ...prev, leaveType: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300">
                    {leaveTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
                  <input type="date" value={form.date} onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">القيمة (أيام / جنيه)</label>
                <input type="number" min="0.5" step="0.5" value={form.value} onChange={e => setForm(prev => ({ ...prev, value: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">إلغاء</button>
              <button onClick={handleAdd} className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium shadow-sm transition">حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveBalance;
