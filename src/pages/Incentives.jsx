import React, { useState } from 'react';

const Incentives = ({ incentives, setIncentives, employees }) => {
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ employeeCode: '', employeeName: '', excellentDays: 0, goodDays: 0, excellentValue: 0, goodValue: 0, total: 0 });
  const [search, setSearch] = useState('');

  const calcTotal = (f) => {
    const exc = Number(f.excellentDays) * 150;
    const good = Number(f.goodDays) * 75;
    return exc + good;
  };

  const openAdd = () => {
    setEditId(null);
    setForm({ employeeCode: '', employeeName: '', excellentDays: 0, goodDays: 0, excellentValue: 150, goodValue: 75, total: 0 });
    setShowModal(true);
  };

  const openEdit = (inc) => {
    setEditId(inc.id);
    setForm({ ...inc });
    setShowModal(true);
  };

  const handleSave = () => {
    const total = calcTotal(form);
    const emp = employees.find(e => e.code === form.employeeCode);
    const finalForm = { ...form, total, employeeName: emp ? emp.name : form.employeeName, excellentValue: Number(form.excellentDays) * 150, goodValue: Number(form.goodDays) * 75 };
    if (editId) {
      setIncentives(prev => prev.map(i => i.id === editId ? { ...finalForm, id: editId } : i));
    } else {
      setIncentives(prev => [...prev, { ...finalForm, id: Date.now() }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('حذف الحافز؟')) setIncentives(prev => prev.filter(i => i.id !== id));
  };

  const filtered = incentives.filter(i => i.employeeName.includes(search) || i.employeeCode.includes(search));
  const totalIncentives = filtered.reduce((s, i) => s + i.total, 0);

  const getRating = (exc, good) => {
    if (exc >= 6) return { label: 'ممتاز', color: 'bg-green-100 text-green-700' };
    if (exc >= 3) return { label: 'جيد جداً', color: 'bg-blue-100 text-blue-700' };
    if (good > 0) return { label: 'جيد', color: 'bg-yellow-100 text-yellow-700' };
    return { label: 'عادي', color: 'bg-gray-100 text-gray-600' };
  };

  return (
    <div className="p-6 space-y-5 fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">الحوافز والمكافآت</h1>
          <p className="text-gray-500 text-sm">إجمالي {totalIncentives.toLocaleString()} جنيه • {filtered.length} موظف</p>
        </div>
        <button onClick={openAdd} className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition">
          🏆 إضافة حافز
        </button>
      </div>

      {/* Top Performers */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-5 border border-purple-100">
        <h2 className="font-bold text-gray-800 mb-4">🌟 أفضل الموظفين أداءً</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[...incentives].sort((a,b) => b.total - a.total).slice(0, 3).map((inc, i) => {
            const medals = ['🥇', '🥈', '🥉'];
            return (
              <div key={inc.id} className="bg-white rounded-xl p-4 shadow-sm text-center">
                <div className="text-3xl mb-2">{medals[i]}</div>
                <div className="font-semibold text-gray-800 text-sm">{inc.employeeName}</div>
                <div className="text-purple-600 font-bold mt-1">{inc.total.toLocaleString()} ج</div>
                <div className="text-xs text-gray-400 mt-1">{inc.excellentDays} ممتاز • {inc.goodDays} جيد جداً</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <input type="text" placeholder="🔍 بحث..." value={search} onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-purple-300" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-right font-semibold text-gray-600">#</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">الموظف</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">أيام ممتاز</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">قيمة ممتاز</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">أيام جيد جداً</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">قيمة جيد جداً</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">التقييم</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 bg-purple-50">الإجمالي</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">إجراء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((inc, i) => {
              const rating = getRating(inc.excellentDays, inc.goodDays);
              return (
                <tr key={inc.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{inc.employeeName}</div>
                    <div className="text-xs text-gray-400">{inc.employeeCode}</div>
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-green-600">{inc.excellentDays}</td>
                  <td className="px-4 py-3 text-green-600">{inc.excellentValue > 0 ? `${inc.excellentValue} ج` : '-'}</td>
                  <td className="px-4 py-3 text-center font-semibold text-blue-600">{inc.goodDays}</td>
                  <td className="px-4 py-3 text-blue-600">{inc.goodValue > 0 ? `${inc.goodValue} ج` : '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${rating.color}`}>{rating.label}</span>
                  </td>
                  <td className="px-4 py-3 bg-purple-50">
                    <span className="font-bold text-purple-700">{inc.total.toLocaleString()} ج</span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => openEdit(inc)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition">✏️</button>
                    <button onClick={() => handleDelete(inc.id)} className="text-red-400 hover:bg-red-50 p-1.5 rounded-lg transition">🗑️</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-purple-50 border-t border-purple-100">
              <td colSpan="7" className="px-4 py-3 font-bold text-purple-700">الإجمالي</td>
              <td className="px-4 py-3 font-bold text-purple-700 text-lg">{totalIncentives.toLocaleString()} ج</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-800">{editId ? 'تعديل حافز' : 'إضافة حافز جديد'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الموظف</label>
                <select value={form.employeeCode} onChange={e => {
                  const emp = employees.find(emp => emp.code === e.target.value);
                  setForm(prev => ({ ...prev, employeeCode: e.target.value, employeeName: emp?.name || '' }));
                }} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300">
                  <option value="">اختر الموظف</option>
                  {employees.filter(e => e.type === 'انتاج').map(e => <option key={e.id} value={e.code}>{e.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">أيام ممتاز</label>
                  <input type="number" min="0" max="30" value={form.excellentDays}
                    onChange={e => setForm(prev => ({ ...prev, excellentDays: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
                  <div className="text-xs text-gray-400 mt-1">× 150 ج = {Number(form.excellentDays) * 150} ج</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">أيام جيد جداً</label>
                  <input type="number" min="0" max="30" value={form.goodDays}
                    onChange={e => setForm(prev => ({ ...prev, goodDays: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
                  <div className="text-xs text-gray-400 mt-1">× 75 ج = {Number(form.goodDays) * 75} ج</div>
                </div>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <div className="text-xs text-purple-600 font-medium">الإجمالي المستحق</div>
                <div className="text-2xl font-bold text-purple-700">{calcTotal(form).toLocaleString()} جنيه</div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">إلغاء</button>
              <button onClick={handleSave} className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium shadow-sm transition">حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Incentives;
