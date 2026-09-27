import React, { useState } from 'react';
import { Plus, Search, Trash2, CheckCircle, XCircle, Trash } from 'lucide-react';

const EarlyDeparture = ({ employees }) => {
  const [records, setRecords] = useState([
    { id: 1, employeeCode: '106014', employeeName: 'محمد علي السيد', department: 'الحقن', type_category: 'ثابت', departureType: 'انصراف نهائي نصف يوم', date: '2026-07-01', duration: 'نصف يوم', reason: 'ظرف شخصي' },
    { id: 2, employeeCode: '107011', employeeName: 'أحمد محمود إبراهيم', department: 'الحقن', type_category: 'ثابت', departureType: 'انصراف وعودة', date: '2026-07-03', duration: 'ساعتان', reason: 'ظرف شخصي' },
    { id: 3, employeeCode: '202043', employeeName: 'سلوي منجود محمد', department: 'تغليف', type_category: 'انتاج', departureType: 'انصراف نهائي نصف يوم', date: '2026-09-10', duration: 'نصف يوم', reason: 'أمور عائلية' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  
  const [form, setForm] = useState({ 
    employeeCode: '', 
    employeeName: '', 
    department: '', 
    type_category: 'ثابت', 
    departureType: 'انصراف وعودة', 
    date: '', 
    duration: '', 
    reason: '' 
  });
  
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDepartureType, setFilterDepartureType] = useState('');

  const departureTypes = ['انصراف نهائي نصف يوم', 'انصراف وعودة'];
  const durationOptions = ['ربع يوم', 'نصف يوم', 'ساعة واحدة', 'ساعتان', '3 ساعات', '4 ساعات'];

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const calcDeduction = (empCode, durationText) => {
    const emp = employees.find(e => e.code === empCode);
    if (!emp) return 0;
    const dailyRate = Number(emp.salary) / 26;
    
    let durationVal = 0;
    if (durationText === 'ربع يوم') durationVal = 0.25;
    else if (durationText === 'نصف يوم') durationVal = 0.5;
    else if (durationText === 'ساعة واحدة') durationVal = 1;
    else if (durationText === 'ساعتان') durationVal = 2;
    else if (durationText === '3 ساعات') durationVal = 3;
    else if (durationText === '4 ساعات') durationVal = 4;

    if (durationVal <= 0.5) return Math.round(dailyRate * durationVal * 2);
    const hourlyRate = dailyRate / 8;
    return Math.round(hourlyRate * durationVal);
  };

  const handleAdd = () => {
    if (!form.employeeCode || !form.date || !form.duration) {
      showToast('يرجى إدخال البيانات المطلوبة', 'error');
      return;
    }
    const emp = employees.find(e => e.code === form.employeeCode);
    setRecords(prev => [...prev, {
      ...form, id: Date.now(),
      employeeName: emp?.name || form.employeeName,
      department: emp?.department || form.department,
      type_category: emp?.type || form.type_category,
    }]);
    setForm({ employeeCode: '', employeeName: '', department: '', type_category: 'ثابت', departureType: 'انصراف وعودة', date: '', duration: '', reason: '' });
    setShowModal(false);
    showToast('تم تسجيل الانصراف بنجاح');
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    setRecords(prev => prev.filter(r => r.id !== deleteConfirm));
    setDeleteConfirm(null);
    showToast('تم حذف السجل بنجاح', 'error');
  };

  const filtered = records.filter(r => {
    const matchSearch = r.employeeName.includes(search) || r.employeeCode.includes(search);
    const matchCat = !filterCategory || r.type_category === filterCategory;
    const matchDepType = !filterDepartureType || r.departureType === filterDepartureType;
    return matchSearch && matchCat && matchDepType;
  });

  const totalFinalDep = filtered.filter(r => r.departureType === 'انصراف نهائي نصف يوم').length;
  const totalWithReturn = filtered.filter(r => r.departureType === 'انصراف وعودة').length;

  // Calculate Report Data
  const reportData = [];
  records.forEach(rec => {
    let rep = reportData.find(x => x.employeeCode === rec.employeeCode);
    if (!rep) {
      rep = { employeeCode: rec.employeeCode, employeeName: rec.employeeName, finalCount: 0, returnCount: 0 };
      reportData.push(rep);
    }
    if (rec.departureType === 'انصراف نهائي نصف يوم') rep.finalCount++;
    if (rec.departureType === 'انصراف وعودة') rep.returnCount++;
  });

  return (
    <div className="p-6 space-y-5 fade-in relative">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-lg font-medium border flex items-center gap-3 transition-all ${
          toast.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'
        }`}>
          {toast.type === 'error' ? <XCircle size={20} /> : <CheckCircle size={20} />}
          {toast.msg}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#163A63]">الانصراف المبكر</h1>
          <p className="text-[#718096] text-sm mt-1">{filtered.length} سجل</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-gradient-to-r from-[#163A63] to-[#214B78] hover:opacity-90 text-white px-5 py-2.5 rounded-2xl font-medium flex items-center gap-2 shadow-sm transition-all">
          <Plus size={20} />
          تسجيل انصراف
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm text-center">
          <div className="text-2xl font-bold text-[#172B45]">{filtered.length}</div>
          <div className="text-[#718096] text-sm mt-1">إجمالي السجلات</div>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 shadow-sm text-center">
          <div className="text-2xl font-bold text-red-600">{totalFinalDep}</div>
          <div className="text-red-500 text-sm mt-1">انصراف نهائي</div>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 shadow-sm text-center">
          <div className="text-2xl font-bold text-amber-600">{totalWithReturn}</div>
          <div className="text-amber-500 text-sm mt-1">انصراف وعودة</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E2E8F0] flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#718096]" />
          <input type="text" placeholder="بحث بالاسم أو الكود..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:border-[#3974B8] focus:ring-1 focus:ring-[#3974B8]" />
        </div>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          className="border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-1 focus:ring-[#3974B8]">
          <option value="">نوع العمالة (الكل)</option>
          <option value="انتاج">إنتاج</option>
          <option value="ثابت">ثابت</option>
        </select>
        <select value={filterDepartureType} onChange={e => setFilterDepartureType(e.target.value)}
          className="border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-1 focus:ring-[#3974B8]">
          <option value="">نوع الانصراف (الكل)</option>
          <option value="انصراف نهائي نصف يوم">انصراف نهائي نصف يوم</option>
          <option value="انصراف وعودة">انصراف وعودة</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-[#F5F7FA] text-[#718096]">
              <tr>
                <th className="px-4 py-4 font-semibold">#</th>
                <th className="px-4 py-4 font-semibold">الموظف</th>
                <th className="px-4 py-4 font-semibold">القسم</th>
                <th className="px-4 py-4 font-semibold">نوع العمالة</th>
                <th className="px-4 py-4 font-semibold">نوع الانصراف</th>
                <th className="px-4 py-4 font-semibold">التاريخ</th>
                <th className="px-4 py-4 font-semibold">المدة</th>
                <th className="px-4 py-4 font-semibold">السبب</th>
                <th className="px-4 py-4 font-semibold bg-red-50 text-red-600">الخصم المقترح</th>
                <th className="px-4 py-4 font-semibold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filtered.map((rec, i) => {
                const deduction = calcDeduction(rec.employeeCode, rec.duration);
                return (
                  <tr key={rec.id} className="hover:bg-[#F5F7FA] transition-colors">
                    <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#163A63]">{rec.employeeName}</div>
                      <div className="text-xs text-gray-500">{rec.employeeCode}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{rec.department}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${rec.type_category === 'انتاج' ? 'bg-blue-50 text-[#3974B8]' : 'bg-purple-50 text-purple-700'}`}>
                        {rec.type_category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${rec.departureType === 'انصراف نهائي نصف يوم' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                        {rec.departureType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{rec.date}</td>
                    <td className="px-4 py-3 font-semibold text-[#3974B8]">{rec.duration}</td>
                    <td className="px-4 py-3 text-gray-600">{rec.reason}</td>
                    <td className="px-4 py-3 bg-red-50/50">
                      {deduction > 0 ? <span className="font-bold text-red-600">{deduction} ج</span> : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => setDeleteConfirm(rec.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="حذف">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="10" className="text-center py-8 text-[#718096]">لا توجد سجلات انصراف</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0]">
        <h2 className="text-lg font-bold text-[#163A63] mb-4">تقرير عدد مرات الانصراف للموظفين</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right border border-[#E2E8F0] rounded-xl overflow-hidden">
            <thead className="bg-[#F5F7FA] text-[#718096]">
              <tr>
                <th className="px-4 py-3 font-semibold border-b border-[#E2E8F0]">الموظف</th>
                <th className="px-4 py-3 font-semibold border-b border-[#E2E8F0] text-center text-red-600">انصراف نهائي (مرات)</th>
                <th className="px-4 py-3 font-semibold border-b border-[#E2E8F0] text-center text-amber-600">انصراف وعودة (مرات)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {reportData.map((rep, idx) => (
                <tr key={idx} className="hover:bg-[#F5F7FA]">
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#172B45]">{rep.employeeName}</div>
                    <div className="text-xs text-gray-500">{rep.employeeCode}</div>
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-red-600">{rep.finalCount}</td>
                  <td className="px-4 py-3 text-center font-bold text-amber-600">{rep.returnCount}</td>
                </tr>
              ))}
              {reportData.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-[#718096]">لا توجد بيانات للعرض</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden fade-in">
            <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F5F7FA]">
              <h2 className="text-lg font-bold text-[#163A63]">تسجيل انصراف مبكر</h2>
              <button onClick={() => setShowModal(false)} className="text-[#718096] hover:text-red-500 transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#172B45] mb-1">الموظف</label>
                <select value={form.employeeCode} onChange={e => {
                  const emp = employees.find(emp => emp.code === e.target.value);
                  setForm(prev => ({ ...prev, employeeCode: e.target.value, employeeName: emp?.name || '', department: emp?.department || '', type_category: emp?.type || 'ثابت' }));
                }} className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#3974B8] focus:ring-1 focus:ring-[#3974B8]">
                  <option value="">اختر الموظف</option>
                  {employees.map(e => <option key={e.id} value={e.code}>{e.name} ({e.type})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#172B45] mb-1">نوع الانصراف</label>
                  <select value={form.departureType} onChange={e => setForm(prev => ({ ...prev, departureType: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#3974B8] focus:ring-1 focus:ring-[#3974B8]">
                    {departureTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#172B45] mb-1">التاريخ</label>
                  <input type="date" value={form.date} onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#3974B8] focus:ring-1 focus:ring-[#3974B8]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#172B45] mb-1">المدة</label>
                <select value={form.duration} onChange={e => setForm(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#3974B8] focus:ring-1 focus:ring-[#3974B8]">
                  <option value="">اختر المدة...</option>
                  {durationOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              {form.employeeCode && form.duration && (
                <div className="bg-red-50 rounded-xl p-3 text-sm text-red-700 font-medium flex justify-between items-center">
                  <span>الخصم المقترح:</span>
                  <span className="text-lg">{calcDeduction(form.employeeCode, form.duration)} ج</span>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-[#172B45] mb-1">السبب</label>
                <input type="text" value={form.reason} onChange={e => setForm(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#3974B8] focus:ring-1 focus:ring-[#3974B8]" placeholder="اكتب سبب الانصراف..." />
              </div>
            </div>
            <div className="p-5 border-t border-[#E2E8F0] flex gap-3 bg-[#F5F7FA]">
              <button onClick={handleAdd} className="flex-1 bg-gradient-to-r from-[#163A63] to-[#214B78] hover:opacity-90 text-white py-2.5 rounded-xl font-medium shadow-sm transition-all">
                حفظ السجل
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-white border border-[#E2E8F0] text-[#172B45] py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center fade-in">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#172B45] mb-2">تأكيد الحذف</h3>
            <p className="text-[#718096] mb-6">هل أنت متأكد من حذف هذا السجل؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-medium hover:bg-red-700 transition-colors">
                نعم، احذف
              </button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-gray-100 text-[#172B45] py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarlyDeparture;
