import React, { useState } from 'react';
import { Plus, X, Trash2, CreditCard, CheckCircle, Clock } from 'lucide-react';

const Loans = ({ loans, setLoans, employees }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ employeeCode: '', employeeName: '', amount: '', month: 'سبتمبر 2026', status: 'معلق' });

  const handleAdd = () => {
    if (!form.employeeCode || !form.amount) return alert('يرجى إدخال البيانات المطلوبة');
    const emp = employees.find(e => e.code === form.employeeCode);
    setLoans(prev => [...prev, { ...form, id: Date.now(), employeeName: emp ? emp.name : form.employeeName, amount: Number(form.amount) }]);
    setForm({ employeeCode: '', employeeName: '', amount: '', month: 'سبتمبر 2026', status: 'معلق' });
    setShowModal(false);
  };

  const toggleStatus = (id) => {
    setLoans(prev => prev.map(l => l.id === id ? { ...l, status: l.status === 'مخصوم' ? 'معلق' : 'مخصوم' } : l));
  };

  const handleDelete = (id) => {
    if (window.confirm('حذف السلفة؟')) setLoans(prev => prev.filter(l => l.id !== id));
  };

  const totalLoans = loans.reduce((s, l) => s + l.amount, 0);
  const deducted = loans.filter(l => l.status === 'مخصوم').reduce((s, l) => s + l.amount, 0);
  const pending = loans.filter(l => l.status === 'معلق').reduce((s, l) => s + l.amount, 0);

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172B45]">السلف الشهرية</h1>
          <p className="text-[#718096] text-sm">{loans.length} سلفة</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-gradient-to-r from-[#163A63] to-[#214B78] hover:from-[#214B78] hover:to-[#3974B8] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-md transition text-sm">
          <Plus size={16} sm:size={18} strokeWidth={2} /> إضافة سلفة
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-[#163A63]/5 border border-[#163A63]/20 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-[#163A63]">{totalLoans.toLocaleString()} ج</div>
          <div className="text-[#163A63] text-sm mt-1">إجمالي السلف</div>
        </div>
        <div className="bg-[#10B981]/5 border border-[#10B981]/20 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-[#10B981]">{deducted.toLocaleString()} ج</div>
          <div className="text-[#10B981] text-sm mt-1">تم خصمها</div>
        </div>
        <div className="bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-[#F59E0B]">{pending.toLocaleString()} ج</div>
          <div className="text-[#F59E0B] text-sm mt-1">معلقة</div>
        </div>
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
                <th className="px-4 py-3 text-right font-semibold text-[#718096]">القيمة</th>
                <th className="px-4 py-3 text-right font-semibold text-[#718096]">الشهر</th>
                <th className="px-4 py-3 text-right font-semibold text-[#718096]">الحالة</th>
                <th className="px-4 py-3 text-right font-semibold text-[#718096]">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {loans.map((loan, i) => (
                <tr key={loan.id} className="hover:bg-[#F5F7FA] transition">
                  <td className="px-4 py-3 text-[#718096]">{i + 1}</td>
                  <td className="px-4 py-3 font-mono text-[#163A63]">{loan.employeeCode}</td>
                  <td className="px-4 py-3 font-medium text-[#172B45]">{loan.employeeName}</td>
                  <td className="px-4 py-3 font-bold text-[#F59E0B]">{loan.amount.toLocaleString()} ج</td>
                  <td className="px-4 py-3 text-[#718096]">{loan.month}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(loan.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition flex items-center gap-1.5 ${loan.status === 'مخصوم' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20 hover:bg-[#10B981]/20' : 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20 hover:bg-[#F59E0B]/20'}`}>
                      {loan.status === 'مخصوم' ? <CheckCircle size={12} strokeWidth={2} /> : <Clock size={12} strokeWidth={2} />}
                      {loan.status}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(loan.id)} className="text-[#EF4444]/60 hover:text-[#EF4444] hover:bg-[#EF4444]/10 p-1.5 rounded-lg transition">
                      <Trash2 size={18} strokeWidth={2} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loans.length === 0 && <div className="text-center py-10 text-[#718096]">لا توجد سلف مسجلة</div>}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4 sm:mb-5">
              <h2 className="text-base sm:text-lg font-bold text-[#172B45]">إضافة سلفة جديدة</h2>
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
                <label className="block text-sm font-medium text-[#718096] mb-1">قيمة السلفة (ج)</label>
                <input type="number" value={form.amount} onChange={e => setForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10" placeholder="أدخل القيمة" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#718096] mb-1">الشهر</label>
                <input type="text" value={form.month} onChange={e => setForm(prev => ({ ...prev, month: e.target.value }))}
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10" />
              </div>
            </div>
            <div className="flex gap-3 mt-4 sm:mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 sm:py-2.5 border border-[#E2E8F0] rounded-xl text-[#718096] hover:bg-[#F5F7FA] transition text-sm">إلغاء</button>
              <button onClick={handleAdd} className="flex-1 py-2 sm:py-2.5 bg-gradient-to-r from-[#163A63] to-[#214B78] hover:from-[#214B78] hover:to-[#3974B8] text-white rounded-xl font-medium shadow-md transition text-sm">حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loans;
