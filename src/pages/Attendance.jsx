import React, { useState } from 'react';

const Attendance = ({ employees }) => {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [attendance, setAttendance] = useState(() => {
    const init = {};
    employees.forEach(e => {
      init[e.id] = { status: 'حاضر', arrivalTime: '08:00', leaveTime: '17:00', note: '' };
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
    <div className="p-6 space-y-5 fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">الحضور والغياب</h1>
          <p className="text-gray-500 text-sm">{filtered.length} موظف</p>
        </div>
        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {statusOptions.map(s => (
          <div key={s} className={`rounded-xl p-3 text-center border ${statusColors[s] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
            <div className="text-2xl font-bold">{summary[s] || 0}</div>
            <div className="text-xs font-medium mt-1">{s}</div>
          </div>
        ))}
      </div>

      {/* Filters & Quick Actions */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center">
        <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
          <option value="">كل الأقسام</option>
          {departments.map(d => <option key={d}>{d}</option>)}
        </select>
        <div className="flex gap-2 mr-auto">
          <span className="text-sm text-gray-500 self-center">تحديد الكل:</span>
          {['حاضر', 'غائب'].map(s => (
            <button key={s} onClick={() => markAll(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${statusColors[s]}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-right font-semibold text-gray-600">#</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">الموظف</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">القسم</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">الحالة</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">وقت الحضور</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">وقت الانصراف</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">ملاحظة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((emp, i) => {
                const rec = attendance[emp.id] || {};
                return (
                  <tr key={emp.id} className={`hover:bg-gray-50 transition ${rec.status === 'غائب' ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-2.5 text-gray-500 text-xs">{i + 1}</td>
                    <td className="px-4 py-2.5">
                      <div className="font-medium text-gray-800">{emp.name}</div>
                      <div className="text-xs text-gray-400">{emp.code}</div>
                    </td>
                    <td className="px-4 py-2.5 text-gray-500">{emp.department}</td>
                    <td className="px-4 py-2.5">
                      <select
                        value={rec.status || 'حاضر'}
                        onChange={e => updateStatus(emp.id, 'status', e.target.value)}
                        className={`text-xs px-2 py-1.5 rounded-lg border font-medium focus:outline-none ${statusColors[rec.status] || ''}`}
                      >
                        {statusOptions.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-2.5">
                      <input type="time" value={rec.arrivalTime || '08:00'}
                        disabled={rec.status === 'غائب' || rec.status === 'إجازة'}
                        onChange={e => updateStatus(emp.id, 'arrivalTime', e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-300 disabled:bg-gray-100 disabled:text-gray-400" />
                    </td>
                    <td className="px-4 py-2.5">
                      <input type="time" value={rec.leaveTime || '17:00'}
                        disabled={rec.status === 'غائب' || rec.status === 'إجازة'}
                        onChange={e => updateStatus(emp.id, 'leaveTime', e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-300 disabled:bg-gray-100 disabled:text-gray-400" />
                    </td>
                    <td className="px-4 py-2.5">
                      <input type="text" value={rec.note || ''} placeholder="ملاحظة..."
                        onChange={e => updateStatus(emp.id, 'note', e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1 text-xs w-28 focus:outline-none focus:ring-1 focus:ring-blue-300" />
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
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm transition flex items-center gap-2">
          💾 حفظ سجل الحضور
        </button>
      </div>
    </div>
  );
};

export default Attendance;
