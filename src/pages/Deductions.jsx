import React, { useState } from 'react';
import { Plus, X, Trash2, Scissors, AlertTriangle } from 'lucide-react';

const Deductions = ({ deductions, setDeductions, employees }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ employeeCode: '', employeeName: '', absenceDate: '', type: 'غياب بدون إذن', amount: '' });

  const deductionTypes = ['غياب بدون إذن', 'غياب', 'تأخير', 'انصراف مبكر', 'جزاء', 'خصم آخر'];

  const handleAdd = () => {
    if (!form.employeeCode || !form.amount) return alert('يرجى إدخال البيانات المطلوبة');
    const emp = employees.find(e => e.code === form.employeeCode);
    setDeductions(prev => [...prev, { ...form, id: Date.now(), employeeName: emp ? emp.name : form.employeeName, amount: Number(form.amount) }]);
    setForm({ employeeCode: '', employeeName: '', absenceDate: '', type: 'غياب بدون إذن', amount: '' });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('حذف الخصم؟')) setDeductions(prev => prev.filter(d => d.id !== id));
  };

  const total = deductions.reduce((s, d) => s + d.amount, 0);

  const typeCounts = deductionTypes.reduce((acc, t) => {
    acc[t] = deductions.filter(d => d.type === t).length;
    return acc;
  }, {});

  const typeColors = {
    'غياب بدون إذن': 'bg-[#EF4444]/10 text-[#EF4444]',
    'غياب': 'bg-[#F97316]/10 text-[#F97316]',
    'تأخير': 'bg-[#F59E0B]/10 text-[#F59E0B]',
    'انصراف مبكر': 'bg-[#FBBF24]/10 text-[#FBBF24]',
    'جزاء': 'bg-[#DC2626]/10 text-[#DC2626]',
    'خصم آخر': 'bg-[#718096]/10 text-[#718096]',
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172B45]">الخصومات والجزاءات</h1>
          <p className="text-[#718096] text-sm">{deductions.length} خصم • إجمالي {total.toLocaleString()} ج</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-gradient-to-r from-[#EF4444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#B91C1C] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-md transition text-sm">
          <Scissors size={16} sm:size={18} strokeWidth={2} /> إضافة خصم
        </button>
      </div>

      {/* Type Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
        {deductionTypes.map(t => (
          <div key={t} className={`rounded-xl p-3 text-center ${typeColors[t] || 'bg-[#718096]/10 text-[#718096]'} border border-[#E2E8F0]`}>
            <div className="text-xl font-bold">{typeCounts[t] || 0}</div>
            <div className="text-xs mt-1 leading-tight">{t}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F5F7FA] border-b border-[#E2E8F0]">
                <th className="px-4 py-3 text-right font-semibold text-[#718096]">#</th>
                <th className="px-4 py-3 text-right font-semibold text-[#718096]">الكود</th>
                <th className="px-4 py-3 text-right font-semibold text-[#718096]">الموظف</th>
                <th className="px-4 py-3 text-right font-semibold text-[#718096]">تاريخ الغياب</th>
                <th className="px-4 py-3 text-right font-semibold text-[#718096]">نوع الخصم</th>
                <th className="px-4 py-3 text-right font-semibold text-[#718096]">القيمة</th>
                <th className="px-4 py-3 text-right font-semibold text-[#718096]">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {deductions.map((ded, i) => (
                <tr key={ded.id} className="hover:bg-[#F5F7FA] transition">
                  <td className="px-4 py-3 text-[#718096]">{i + 1}</td>
                  <td className="px-4 py-3 font-mono text-[#163A63]">{ded.employeeCode}</td>
                  <td className="px-4 py-3 font-medium text-[#172B45]">{ded.employeeName}</td>
                  <td className="px-4 py-3 text-[#718096]">{ded.absenceDate}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[ded.type] || 'bg-[#718096]/10 text-[#718096]'}`}>{ded.type}</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-[#EF4444]">{ded.amount.toLocaleString()} ج</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(ded.id)} className="text-[#EF4444]/60 hover:text-[#EF4444] hover:bg-[#EF4444]/10 p-1.5 rounded-lg transition">
                      <Trash2 size={18} strokeWidth={2} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            {deductions.length > 0 && (
              <tfoot>
                <tr className="bg-[#EF4444]/5 border-t border-[#EF4444]/20">
                  <td colSpan="5" className="px-4 py-3 font-bold text-[#EF4444]">الإجمالي</td>
                  <td className="px-4 py-3 font-bold text-[#EF4444] text-lg">{total.toLocaleString()} ج</td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
          {deductions.length === 0 && <div className="text-center py-10 text-[#718096]">لا توجد خصومات مسجلة</div>}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4 sm:mb-5">
              <h2 className="text-base sm:text-lg font-bold text-[#172B45]">إضافة خصم جديد</h2>
              <button onClick={() => setShowModal(false)} className="text-[#718096] hover:text-[#172B45] transition">
                <X size={20} sm:size={24} strokeWidth={2} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#718096] mb-1">الموظف</label>
                <select value={form.employeeCode} onChange={e => {
                  const emp = employees.find(emp => emp.code === e.target.value);
                  setForm(prev => ({ ...prev, employeeCode: e.target.value, employeeName: emp?.name || '' }));
                }} className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10">
                  <option value="">اختر الموظف</option>
                  {employees.map(e => <option key={e.id} value={e.code}>{e.name} ({e.code})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#718096] mb-1">تاريخ الغياب</label>
                <input type="date" value={form.absenceDate} onChange={e => setForm(prev => ({ ...prev, absenceDate: e.target.value }))}
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#718096] mb-1">نوع الخصم</label>
                <select value={form.type} onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10">
                  {deductionTypes.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#718096] mb-1">القيمة (ج)</label>
                <input type="number" value={form.amount} onChange={e => setForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10" placeholder="أدخل قيمة الخصم" />
              </div>
            </div>
            <div className="flex gap-3 mt-4 sm:mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 sm:py-2.5 border border-[#E2E8F0] rounded-xl text-[#718096] hover:bg-[#F5F7FA] transition text-sm">إلغاء</button>
              <button onClick={handleAdd} className="flex-1 py-2 sm:py-2.5 bg-gradient-to-r from-[#EF4444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#B91C1C] text-white rounded-xl font-medium shadow-md transition text-sm">حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deductions;
