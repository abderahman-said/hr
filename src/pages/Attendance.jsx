import React, { useState } from 'react';

const Attendance = ({ employees }) => {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [attendance, setAttendance] = useState(() => {
    const init = {};
    employees.forEach(e => {
      init[e.id] = { 
        status: 'حاضر', 
        arrivalTime: '08:00', 
        leaveTime: '17:00', 
        note: '',
        absenceReason: '',
        permissionMethod: '',
        departureType: 'نهائي',
        balanceValue: ''
      };
    });
    return init;
  });
  const [filterDept, setFilterDept] = useState('');

  const departments = [...new Set(employees.map(e => e.department))];
  const filtered = employees.filter(e => filterDept ? e.department === filterDept : true);

  const statusOptions = ['حاضر', 'غائب', 'إجازة', 'تأخير', 'انصراف مبكر', 'مأمورية'];
  const statusColors = {
    'حاضر': 'bg-green-100 text-green-700 border-green-200',
    'غائب': 'bg-red-100 text-red-700 border-red-200',
    'إجازة': 'bg-blue-100 text-blue-700 border-blue-200',
    'تأخير': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'انصراف مبكر': 'bg-orange-100 text-orange-700 border-orange-200',
    'مأمورية': 'bg-purple-100 text-purple-700 border-purple-200',
  };
  const absenceReasons = ['مرضي', 'عائلي', 'أخرى'];
  const permissionMethods = ['إذن شفهي', 'إذن مكتوب', 'إيميل'];
  const departureTypes = ['نهائي', 'وعودة'];

  const updateStatus = (empId, field, value) => {
    setAttendance(prev => ({ ...prev, [empId]: { ...prev[empId], [field]: value } }));
  };

  const summary = filtered.reduce((acc, emp) => {
    const s = attendance[emp.id]?.status;
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const markAll = (status) => {
    const updated = { ...attendance };
    filtered.forEach(e => { updated[e.id] = { ...updated[e.id], status }; });
    setAttendance(updated);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">الحضور والغياب</h1>
          <p className="text-gray-500 text-sm sm:text-base mt-1">{filtered.length} موظف</p>
        </div>
        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
        {statusOptions.map(s => (
          <div key={s} className={`rounded-xl p-4 text-center border ${statusColors[s] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
            <div className="text-2xl sm:text-3xl font-bold">{summary[s] || 0}</div>
            <div className="text-xs sm:text-sm font-medium mt-1.5">{s}</div>
          </div>
        ))}
      </div>

      {/* Filters & Quick Actions */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-wrap gap-4 items-start sm:items-center">
        <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
          <option value="">كل الأقسام</option>
          {departments.map((d, idx) => <option key={`${d}-${idx}`}>{d}</option>)}
        </select>
        <div className="flex gap-2 flex-wrap w-full sm:w-auto mr-0 sm:mr-auto">
          <span className="text-sm text-gray-500 self-center">تحديد الكل:</span>
          {['حاضر', 'غائب'].map(s => (
            <button key={s} onClick={() => markAll(s)} className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium border ${statusColors[s]}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-gray-600 text-xs sm:text-sm">#</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-gray-600 text-xs sm:text-sm">الموظف</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-gray-600 text-xs sm:text-sm">القسم</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-gray-600 text-xs sm:text-sm">الحالة</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-gray-600 text-xs sm:text-sm">وقت الحضور</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-gray-600 text-xs sm:text-sm">وقت الانصراف</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-gray-600 text-xs sm:text-sm">سبب الغياب</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-gray-600 text-xs sm:text-sm">طريقة الإذن</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-gray-600 text-xs sm:text-sm">نوع الانصراف</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-gray-600 text-xs sm:text-sm">الرصيد النقدي</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-gray-600 text-xs sm:text-sm">ملاحظة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((emp, i) => {
                const rec = attendance[emp.id] || {};
                return (
                  <tr key={emp.id} className={`hover:bg-gray-50 transition ${rec.status === 'غائب' ? 'bg-red-50' : ''}`}>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-500 text-xs sm:text-sm">{i + 1}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="font-medium text-gray-800 text-xs sm:text-sm">{emp.name}</div>
                      <div className="text-xs text-gray-400">{emp.code}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-500 text-xs sm:text-sm">{emp.department}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <select
                        value={rec.status || 'حاضر'}
                        onChange={e => updateStatus(emp.id, 'status', e.target.value)}
                        className={`text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border font-medium focus:outline-none ${statusColors[rec.status] || ''}`}
                      >
                        {statusOptions.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <input type="time" value={rec.arrivalTime || '08:00'}
                        disabled={rec.status === 'غائب' || rec.status === 'إجازة'}
                        onChange={e => updateStatus(emp.id, 'arrivalTime', e.target.value)}
                        className="border border-gray-200 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-300 disabled:bg-gray-100 disabled:text-gray-400" />
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <input type="time" value={rec.leaveTime || '17:00'}
                        disabled={rec.status === 'غائب' || rec.status === 'إجازة'}
                        onChange={e => updateStatus(emp.id, 'leaveTime', e.target.value)}
                        className="border border-gray-200 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-300 disabled:bg-gray-100 disabled:text-gray-400" />
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <select
                        value={rec.absenceReason || ''}
                        disabled={rec.status !== 'غائب'}
                        onChange={e => updateStatus(emp.id, 'absenceReason', e.target.value)}
                        className="border border-gray-200 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-300 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        <option value="">-</option>
                        {absenceReasons.map(r => <option key={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <select
                        value={rec.permissionMethod || ''}
                        disabled={rec.status === 'حاضر'}
                        onChange={e => updateStatus(emp.id, 'permissionMethod', e.target.value)}
                        className="border border-gray-200 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-300 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        <option value="">-</option>
                        {permissionMethods.map(m => <option key={m}>{m}</option>)}
                      </select>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <select
                        value={rec.departureType || 'نهائي'}
                        disabled={rec.status === 'غائب' || rec.status === 'إجازة'}
                        onChange={e => updateStatus(emp.id, 'departureType', e.target.value)}
                        className="border border-gray-200 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-300 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        {departureTypes.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <input type="number" value={rec.balanceValue || ''} placeholder="0"
                        onChange={e => updateStatus(emp.id, 'balanceValue', e.target.value)}
                        className="border border-gray-200 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm w-20 focus:outline-none focus:ring-1 focus:ring-blue-300" />
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <input type="text" value={rec.note || ''} placeholder="ملاحظة..."
                        onChange={e => updateStatus(emp.id, 'note', e.target.value)}
                        className="border border-gray-200 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm w-28 sm:w-32 focus:outline-none focus:ring-1 focus:ring-blue-300" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="bg-green-600 hover:bg-green-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium shadow-md transition flex items-center gap-2 text-sm sm:text-base">
          💾 حفظ سجل الحضور
        </button>
      </div>
    </div>
  );
};

export default Attendance;
