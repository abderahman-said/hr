import React, { useState } from 'react';
import { Plus, X, Pencil, Trash2, Award, Search, TrendingUp, Medal, CheckCircle, AlertTriangle } from 'lucide-react';

const Incentives = ({ incentives, setIncentives, employees }) => {
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ employeeCode: '', employeeName: '', excellentDays: 0, goodDays: 0, excellentValue: 0, goodValue: 0, total: 0, reason: '', grantType: '', custody: '' });
  const grantTypes = ['منحة شهرية', 'منحة عيد', 'منحة أداء', 'منحة خاصة'];
  const custodyOptions = ['لا يوجد', 'موبايل', 'لابتوب', 'سيارة', 'أخرى'];
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const calcTotal = (f) => {
    const exc = Number(f.excellentDays) * 150;
    const good = Number(f.goodDays) * 75;
    return exc + good;
  };

  const openAdd = () => {
    setEditId(null);
    setForm({ employeeCode: '', employeeName: '', excellentDays: 0, goodDays: 0, excellentValue: 150, goodValue: 75, total: 0, reason: '', grantType: '', custody: '' });
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
      showToast('تم تعديل الحافز بنجاح');
    } else {
      setIncentives(prev => [...prev, { ...finalForm, id: Date.now() }]);
      showToast('تمت إضافة الحافز بنجاح');
    }
    setShowModal(false);
  };

  const confirmDelete = (id) => {
    setDeleteConfirm({ show: true, id });
  };

  const executeDelete = () => {
    if (deleteConfirm.id) {
      setIncentives(prev => prev.filter(i => i.id !== deleteConfirm.id));
      showToast('تم حذف الحافز بنجاح');
    }
    setDeleteConfirm(null);
  };

  const filtered = incentives.filter(i => i.employeeName.includes(search) || i.employeeCode.includes(search));
  const totalIncentives = filtered.reduce((s, i) => s + i.total, 0);

  const getRating = (exc, good) => {
    if (exc >= 6) return { label: 'ممتاز', color: 'bg-yellow-100 text-yellow-700 border border-yellow-300' };
    if (exc >= 3 || good >= 5) return { label: 'جيد جدا', color: 'bg-slate-100 text-slate-600 border border-slate-300' };
    return { label: 'جيد', color: 'bg-gray-100 text-gray-600' };
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172B45]">الحوافز والمكافآت</h1>
          <p className="text-[#718096] text-sm">إجمالي {totalIncentives.toLocaleString()} جنيه • {filtered.length} موظف</p>
        </div>
        <button onClick={openAdd} className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-md transition text-sm">
          <Award size={16} sm:size={18} strokeWidth={2} /> إضافة حافز
        </button>
      </div>

      {/* Top Performers */}
      <div className="bg-gradient-to-br from-[#8B5CF6]/5 to-[#163A63]/5 rounded-2xl p-4 sm:p-5 border border-[#8B5CF6]/20">
        <h2 className="font-bold text-[#172B45] mb-3 sm:mb-4 flex items-center gap-2"><TrendingUp size={18} sm:size={20} strokeWidth={2} className="text-[#8B5CF6]" /> أفضل الموظفين أداءً</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[...incentives].sort((a,b) => b.total - a.total).slice(0, 3).map((inc, i) => {
            const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
            const rating = getRating(inc.excellentDays, inc.goodDays);
            return (
              <div key={inc.id} className="bg-white rounded-xl p-4 shadow-sm text-center relative">
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${rating.color}`}>{rating.label}</span>
                </div>
                <div className="w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ backgroundColor: medalColors[i] }}>
                  <Medal size={20} strokeWidth={2} className="text-white" />
                </div>
                <div className="font-semibold text-[#172B45] text-sm">{inc.employeeName}</div>
                <div className="text-[#8B5CF6] font-bold mt-1">{inc.total.toLocaleString()} ج</div>
                <div className="text-xs text-[#718096] mt-1">{inc.excellentDays} ممتاز • {inc.goodDays} جيد جداً</div>
                {inc.reason && <div className="text-xs text-gray-500 mt-1 bg-gray-50 rounded px-2 py-1 inline-block">{inc.reason}</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-[#E2E8F0]">
        <div className="relative">
          <Search size={16} sm:size={18} strokeWidth={2} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#718096]" />
          <input type="text" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)}
            className="border border-[#E2E8F0] rounded-xl px-10 py-2 sm:py-2.5 text-sm w-full focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10" />
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
                <th className="px-4 py-3 text-right font-semibold text-[#718096]">الاسم</th>
                <th className="px-4 py-3 text-right font-semibold text-[#718096]">ممتاز (أيام/قيمة)</th>
                <th className="px-4 py-3 text-right font-semibold text-[#718096]">جيد جداً (أيام/قيمة)</th>
                <th className="px-4 py-3 text-right font-semibold text-[#718096]">التقييم</th>
                <th className="px-4 py-3 text-right font-semibold text-[#718096]">نوع المنحة</th>
                <th className="px-4 py-3 text-right font-semibold text-[#718096]">العهدة</th>
                <th className="px-4 py-3 text-right font-semibold text-[#718096] bg-[#8B5CF6]/10">الإجمالي</th>
                <th className="px-4 py-3 text-right font-semibold text-[#718096]">سبب الحافز</th>
                <th className="px-4 py-3 text-right font-semibold text-[#718096]">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filtered.map((inc, i) => {
                const rating = getRating(inc.excellentDays, inc.goodDays);
                return (
                  <tr key={inc.id} className="hover:bg-[#F5F7FA] transition">
                    <td className="px-4 py-3 text-[#718096]">{i + 1}</td>
                    <td className="px-4 py-3 text-[#718096] text-xs">{inc.employeeCode}</td>
                    <td className="px-4 py-3 font-medium text-[#172B45]">{inc.employeeName}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-[#10B981]">{inc.excellentDays}</span>
                      <span className="text-[#718096] text-xs mx-1">/</span>
                      <span className="text-[#10B981]">{inc.excellentValue > 0 ? `${inc.excellentValue} ج` : '-'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-[#163A63]">{inc.goodDays}</span>
                      <span className="text-[#718096] text-xs mx-1">/</span>
                      <span className="text-[#163A63]">{inc.goodValue > 0 ? `${inc.goodValue} ج` : '-'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${rating.color}`}>{rating.label}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{inc.grantType || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{inc.custody || '-'}</td>
                    <td className="px-4 py-3 bg-[#8B5CF6]/10">
                      <span className="font-bold text-[#8B5CF6]">{inc.total.toLocaleString()} ج</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{inc.reason || '-'}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => openEdit(inc)} className="text-[#163A63] hover:bg-[#163A63]/10 p-1.5 rounded-lg transition">
                        <Pencil size={16} strokeWidth={2} />
                      </button>
                      <button onClick={() => confirmDelete(inc.id)} className="text-[#EF4444]/60 hover:text-[#EF4444] hover:bg-[#EF4444]/10 p-1.5 rounded-lg transition">
                        <Trash2 size={16} strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-[#8B5CF6]/5 border-t border-[#8B5CF6]/20">
                <td colSpan="8" className="px-4 py-3 font-bold text-[#8B5CF6]">الإجمالي</td>
                <td className="px-4 py-3 font-bold text-[#8B5CF6] text-lg">{totalIncentives.toLocaleString()} ج</td>
                <td colSpan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4 sm:mb-5">
              <h2 className="text-base sm:text-lg font-bold text-[#172B45]">{editId ? 'تعديل حافز' : 'إضافة حافز جديد'}</h2>
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
                  {employees.filter(e => e.type === 'انتاج').map(e => <option key={e.id} value={e.code}>{e.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#718096] mb-1">أيام ممتاز</label>
                  <input type="number" min="0" max="30" value={form.excellentDays}
                    onChange={e => setForm(prev => ({ ...prev, excellentDays: Number(e.target.value) }))}
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10" />
                  <div className="text-xs text-[#718096] mt-1">× 150 ج = {Number(form.excellentDays) * 150} ج</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#718096] mb-1">أيام جيد جداً</label>
                  <input type="number" min="0" max="30" value={form.goodDays}
                    onChange={e => setForm(prev => ({ ...prev, goodDays: Number(e.target.value) }))}
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10" />
                  <div className="text-xs text-[#718096] mt-1">× 75 ج = {Number(form.goodDays) * 75} ج</div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#718096] mb-1">سبب الحافز</label>
                <select value={form.reason} onChange={e => setForm(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10">
                  <option value="">-- اختر سبب الحافز --</option>
                  <option value="الاجتهاد في العمل">الاجتهاد في العمل</option>
                  <option value="بيع خامة">بيع خامة</option>
                  <option value="عمل إضافي">عمل إضافي</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#718096] mb-1">نوع المنحة</label>
                <select value={form.grantType} onChange={e => setForm(prev => ({ ...prev, grantType: e.target.value }))}
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10">
                  <option value="">-- اختر نوع المنحة --</option>
                  {grantTypes.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#718096] mb-1">العهدة (المخالصة)</label>
                <select value={form.custody} onChange={e => setForm(prev => ({ ...prev, custody: e.target.value }))}
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10">
                  {custodyOptions.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="bg-[#8B5CF6]/5 rounded-xl p-3 text-center">
                <div className="text-xs text-[#8B5CF6] font-medium">الإجمالي المستحق</div>
                <div className="text-2xl font-bold text-[#8B5CF6]">{calcTotal(form).toLocaleString()} جنيه</div>
              </div>
            </div>
            <div className="flex gap-3 mt-4 sm:mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 sm:py-2.5 border border-[#E2E8F0] rounded-xl text-[#718096] hover:bg-[#F5F7FA] transition text-sm">إلغاء</button>
              <button onClick={handleSave} className="flex-1 py-2 sm:py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white rounded-xl font-medium shadow-md transition text-sm">حفظ</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm?.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">تأكيد الحذف</h3>
            <p className="text-gray-600 text-sm mb-6">هل أنت متأكد من حذف هذا الحافز؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition text-sm font-medium">إلغاء</button>
              <button onClick={executeDelete} className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm transition text-sm font-medium">نعم، احذف</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 left-4 z-[70] bg-white rounded-xl shadow-lg border border-gray-100 p-4 flex items-center gap-3 animate-slideIn">
          <CheckCircle className="text-emerald-500" size={20} />
          <div className="text-sm font-medium text-gray-800">{toast.msg}</div>
          <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600 p-1"><X size={16} /></button>
        </div>
      )}
    </div>
  );
};

export default Incentives;
