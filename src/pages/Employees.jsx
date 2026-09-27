import React, { useState } from 'react';
import { contractTypes, workShifts, maritalStatuses } from '../data/initialData';
import { Search, Plus, LayoutGrid, Table, Pencil, Trash2, X, Building2, HardHat, Briefcase, Phone, DollarSign } from 'lucide-react';

const Employees = ({ employees, setEmployees, departments }) => {
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [modalTab, setModalTab] = useState(0);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const emptyForm = {
    code: '', fingerprint: '', name: '', department: '', type: 'انتاج',
    salary: '', status: 'يعمل', hireDate: '', phone: '', nationalId: '',
    jobTitle: '', contractType: 'دائم', maritalStatus: 'أعزب',
    workShift: 'صباحي', directManager: '',
    insurance: 'غير مُؤمَّن', insuranceDate: '', insuranceAmount: '',
    emergencyName: '', emergencyPhone: '',
  };
  const [form, setForm] = useState(emptyForm);

  const filtered = employees.filter(e =>
    (e.name.includes(search) || e.code.includes(search)) &&
    (filterDept ? e.department === filterDept : true) &&
    (filterType ? e.type === filterType : true)
  );

  const departmentNames = departments.map(d => d.name);

  const openAdd = () => { 
    setEditingEmp(null); 
    setForm(emptyForm); 
    setModalTab(0);
    setShowModal(true); 
  };
  
  const openEdit = (emp) => { 
    setEditingEmp(emp.id); 
    setForm({ ...emptyForm, ...emp }); 
    setModalTab(0);
    setShowModal(true); 
  };

  const handleSave = () => {
    if (!form.name || !form.code) {
      setToast('⚠️ يرجى إدخال الاسم والكود'); 
      setTimeout(() => setToast(null), 3000); 
      return;
    }
    if (editingEmp) {
      setEmployees(prev => prev.map(e => e.id === editingEmp ? { ...form, id: editingEmp } : e));
    } else {
      setEmployees(prev => [...prev, { ...form, id: Date.now() }]);
    }
    setShowModal(false);
    setToast('✅ تم الحفظ بنجاح'); 
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    setEmployees(prev => prev.filter(e => e.id !== deleteConfirm));
    setDeleteConfirm(null);
    setToast('🗑️ تم الحذف');
    setTimeout(() => setToast(null), 3000);
  };

  const getContractColor = (type) => {
    if (type === 'دائم') return 'bg-green-100 text-green-700';
    if (type === 'مؤقت') return 'bg-yellow-100 text-yellow-700';
    if (type === 'عقد') return 'bg-purple-100 text-purple-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 fade-in">
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-[#163A63] text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-medium flex items-center gap-2 animate-fade-in">
          {toast}
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[200]">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} className="text-red-500" />
            </div>
            <h3 className="font-bold text-[#172B45] text-lg mb-2">تأكيد الحذف</h3>
            <p className="text-[#718096] text-sm mb-5">هل أنت متأكد من حذف هذا الموظف؟</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-[#E2E8F0] rounded-xl text-[#718096] hover:bg-[#F5F7FA] transition">إلغاء</button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition">حذف</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#172B45]">بيانات الموظفين</h1>
          <p className="text-[#718096] text-sm sm:text-base mt-1">{filtered.length} موظف مسجل</p>
        </div>
        <button onClick={openAdd} className="bg-gradient-to-r from-[#163A63] to-[#214B78] hover:from-[#214B78] hover:to-[#3974B8] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg transition text-sm sm:text-base">
          <Plus size={18} sm:size={20} strokeWidth={2} /> إضافة موظف
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#E2E8F0] flex flex-wrap gap-4 items-start sm:items-center">
        <div className="relative flex-1 min-w-48 w-full sm:w-auto">
          <Search size={18} sm:size={20} strokeWidth={2} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#718096]" />
          <input
            type="text"
            placeholder="بحث بالاسم أو الكود..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-[#E2E8F0] rounded-xl px-11 py-2.5 sm:py-3 text-sm flex-1 min-w-48 focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10"
          />
        </div>
        <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="border border-[#E2E8F0] rounded-xl px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10">
          <option value="">كل الأقسام</option>
          {departmentNames.map((d, idx) => <option key={idx}>{d}</option>)}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border border-[#E2E8F0] rounded-xl px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10">
          <option value="">كل الأنواع</option>
          <option>انتاج</option>
          <option>ثابت</option>
        </select>
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={() => setViewMode('table')} className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-sm flex items-center justify-center gap-1.5 transition ${viewMode === 'table' ? 'bg-[#163A63] text-white shadow-md' : 'bg-[#F5F7FA] text-[#718096] hover:bg-[#E2E8F0]'}`}>
            <Table size={16} sm:size={18} strokeWidth={2} /> جدول
          </button>
          <button onClick={() => setViewMode('cards')} className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-sm flex items-center justify-center gap-1.5 transition ${viewMode === 'cards' ? 'bg-[#163A63] text-white shadow-md' : 'bg-[#F5F7FA] text-[#718096] hover:bg-[#E2E8F0]'}`}>
            <LayoutGrid size={16} sm:size={18} strokeWidth={2} /> بطاقات
          </button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5F7FA] border-b border-[#E2E8F0]">
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-[#718096] text-xs sm:text-sm">#</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-[#718096] text-xs sm:text-sm">الكود</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-[#718096] text-xs sm:text-sm">الاسم</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-[#718096] text-xs sm:text-sm">القسم</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-[#718096] text-xs sm:text-sm">المسمى الوظيفي</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-[#718096] text-xs sm:text-sm">النوع</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-[#718096] text-xs sm:text-sm">الراتب</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-[#718096] text-xs sm:text-sm">التأمين</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-[#718096] text-xs sm:text-sm">الحالة</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-[#718096] text-xs sm:text-sm">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filtered.map((emp, i) => (
                  <tr key={emp.id} className="hover:bg-[#F5F7FA] transition">
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-[#718096] text-xs sm:text-sm">{i + 1}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 font-mono text-[#163A63] font-semibold text-xs sm:text-sm">{emp.code}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-[#172B45] text-xs sm:text-sm">{emp.name}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-[#718096] text-xs sm:text-sm">{emp.department}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-[#718096] text-xs sm:text-sm">{emp.jobTitle}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium ${emp.type === 'انتاج' ? 'bg-[#163A63]/10 text-[#163A63]' : 'bg-[#8B5CF6]/10 text-[#8B5CF6]'}`}>
                        {emp.type}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-[#10B981] text-xs sm:text-sm">{Number(emp.salary).toLocaleString()} ج</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium ${emp.insurance === 'مُؤمَّن' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#EF4444]/10 text-[#EF4444]'}`}>
                        {emp.insurance}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium ${emp.status === 'يعمل' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#EF4444]/10 text-[#EF4444]'}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 flex gap-2">
                      <button onClick={() => openEdit(emp)} className="text-[#163A63] hover:bg-[#163A63]/10 p-1.5 sm:p-2 rounded-lg transition">
                        <Pencil size={16} sm:size={18} strokeWidth={2} />
                      </button>
                      <button onClick={() => handleDelete(emp.id)} className="text-[#EF4444] hover:bg-[#EF4444]/10 p-1.5 sm:p-2 rounded-lg transition">
                        <Trash2 size={16} sm:size={18} strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-10 sm:py-12 text-[#718096] text-sm sm:text-base">لا توجد نتائج</div>
          )}
        </div>
      )}

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filtered.map(emp => (
            <div key={emp.id} className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#E2E8F0] hover:shadow-md transition relative">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#163A63]/10 rounded-xl flex items-center justify-center text-[#163A63]">
                  {emp.type === 'انتاج' ? <HardHat size={24} sm:size={28} strokeWidth={2} /> : <Briefcase size={24} sm:size={28} strokeWidth={2} />}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium ${emp.status === 'يعمل' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#EF4444]/10 text-[#EF4444]'}`}>
                    {emp.status}
                  </span>
                  {emp.contractType && (
                    <span className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium ${getContractColor(emp.contractType)}`}>
                      {emp.contractType}
                    </span>
                  )}
                </div>
              </div>
              <h3 className="font-bold text-[#172B45] text-base sm:text-lg mb-1.5">{emp.name}</h3>
              <p className="text-[#163A63] text-sm font-mono mb-3">{emp.code}</p>
              <div className="text-sm text-[#718096] space-y-1.5">
                <div className="flex items-center gap-1.5"><Briefcase size={14} sm:size={16} strokeWidth={2} /> {emp.jobTitle || 'غير محدد'}</div>
                <div className="flex items-center gap-1.5"><Building2 size={14} sm:size={16} strokeWidth={2} /> {emp.department} • {emp.type}</div>
                <div className="flex items-center gap-1.5"><DollarSign size={14} sm:size={16} strokeWidth={2} /> {Number(emp.salary).toLocaleString()} جنيه</div>
                {emp.phone && <div className="flex items-center gap-1.5"><Phone size={14} sm:size={16} strokeWidth={2} /> {emp.phone}</div>}
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={() => openEdit(emp)} className="flex-1 text-center text-[#163A63] hover:bg-[#163A63]/10 py-2.5 rounded-lg text-sm border border-[#163A63]/20 transition flex items-center justify-center gap-1.5">
                  <Pencil size={14} sm:size={16} strokeWidth={2} /> تعديل
                </button>
                <button onClick={() => handleDelete(emp.id)} className="flex-1 text-center text-[#EF4444] hover:bg-[#EF4444]/10 py-2.5 rounded-lg text-sm border border-[#EF4444]/20 transition flex items-center justify-center gap-1.5">
                  <Trash2 size={14} sm:size={16} strokeWidth={2} /> حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-5 sm:p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-white shrink-0">
              <h2 className="text-lg sm:text-xl font-bold text-[#172B45]">{editingEmp ? 'تعديل بيانات موظف' : 'إضافة موظف جديد'}</h2>
              <button onClick={() => setShowModal(false)} className="text-[#718096] hover:text-[#172B45] transition">
                <X size={22} sm:size={24} strokeWidth={2} />
              </button>
            </div>
            
            <div className="flex border-b border-[#E2E8F0] shrink-0 bg-white">
              {['البيانات الأساسية','بيانات التوظيف','التأمين والطوارئ'].map((tab, i) => (
                <button key={i} onClick={() => setModalTab(i)}
                  className={`flex-1 py-3 text-sm font-medium transition ${
                    modalTab === i
                      ? 'border-b-2 border-[#163A63] text-[#163A63]'
                      : 'text-[#718096] hover:text-[#172B45]'
                  }`}>{tab}</button>
              ))}
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto grow">
              {modalTab === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {[
                    { label: 'الاسم الكامل *', key: 'name', type: 'text' },
                    { label: 'الكود *', key: 'code', type: 'text' },
                    { label: 'رقم البصمة', key: 'fingerprint', type: 'text' },
                    { label: 'رقم الهاتف', key: 'phone', type: 'text' },
                    { label: 'رقم البطاقة', key: 'nationalId', type: 'text' },
                    { label: 'الراتب', key: 'salary', type: 'number' },
                    { label: 'تاريخ التعيين', key: 'hireDate', type: 'date' },
                  ].map(f => (
                    <div key={f.key} className={f.key === 'name' ? 'col-span-2' : ''}>
                      <label className="block text-sm font-medium text-[#718096] mb-1">{f.label}</label>
                      <input
                        type={f.type}
                        value={form[f.key] || ''}
                        onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                        className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-[#718096] mb-1">القسم</label>
                    <select value={form.department} onChange={e => setForm(prev => ({ ...prev, department: e.target.value }))} className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10">
                      <option value="">اختر القسم</option>
                      {departments.map((d, idx) => <option key={idx}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#718096] mb-1">النوع</label>
                    <select value={form.type} onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))} className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10">
                      <option>انتاج</option>
                      <option>ثابت</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#718096] mb-1">الحالة</label>
                    <select value={form.status} onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))} className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10">
                      <option>يعمل</option>
                      <option>لا يعمل</option>
                      <option>تصفية</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#718096] mb-1">الحالة الاجتماعية</label>
                    <select value={form.maritalStatus} onChange={e => setForm(prev => ({ ...prev, maritalStatus: e.target.value }))} className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10">
                      {maritalStatuses.map((m, idx) => <option key={`${m}-${idx}`}>{m}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {modalTab === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#718096] mb-1">المسمى الوظيفي</label>
                    <input type="text" value={form.jobTitle || ''} onChange={e => setForm(prev => ({ ...prev, jobTitle: e.target.value }))} className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#718096] mb-1">نوع التعاقد</label>
                    <select value={form.contractType} onChange={e => setForm(prev => ({ ...prev, contractType: e.target.value }))} className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10">
                      {contractTypes.map((c, idx) => <option key={`${c}-${idx}`}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#718096] mb-1">شيفت العمل</label>
                    <select value={form.workShift} onChange={e => setForm(prev => ({ ...prev, workShift: e.target.value }))} className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10">
                      {workShifts.map((s, idx) => <option key={`${s}-${idx}`}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#718096] mb-1">المدير المباشر</label>
                    <input type="text" value={form.directManager || ''} onChange={e => setForm(prev => ({ ...prev, directManager: e.target.value }))} className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10" />
                  </div>
                </div>
              )}

              {modalTab === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#718096] mb-1">التأمين</label>
                    <select value={form.insurance} onChange={e => setForm(prev => ({ ...prev, insurance: e.target.value }))} className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10">
                      <option>مُؤمَّن</option>
                      <option>غير مُؤمَّن</option>
                    </select>
                  </div>
                  
                  {form.insurance === 'مُؤمَّن' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-[#718096] mb-1">تاريخ التأمين</label>
                        <input type="date" value={form.insuranceDate || ''} onChange={e => setForm(prev => ({ ...prev, insuranceDate: e.target.value }))} className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#718096] mb-1">قيمة الاشتراك</label>
                        <input type="number" value={form.insuranceAmount || ''} onChange={e => setForm(prev => ({ ...prev, insuranceAmount: e.target.value }))} className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10" />
                      </div>
                    </>
                  )}

                  <div className="col-span-1 sm:col-span-2 pt-4 border-t border-[#E2E8F0]">
                    <h3 className="text-[#172B45] font-semibold mb-4">بيانات الطوارئ</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#718096] mb-1">اسم شخص الطوارئ</label>
                    <input type="text" value={form.emergencyName || ''} onChange={e => setForm(prev => ({ ...prev, emergencyName: e.target.value }))} className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#718096] mb-1">هاتف الطوارئ</label>
                    <input type="text" value={form.emergencyPhone || ''} onChange={e => setForm(prev => ({ ...prev, emergencyPhone: e.target.value }))} className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 sm:p-6 border-t border-[#E2E8F0] flex gap-3 justify-end shrink-0 bg-white rounded-b-2xl">
              <button onClick={() => setShowModal(false)} className="px-5 sm:px-6 py-2.5 sm:py-3 border border-[#E2E8F0] rounded-xl text-[#718096] hover:bg-[#F5F7FA] transition text-sm sm:text-base">إلغاء</button>
              <button onClick={handleSave} className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#163A63] to-[#214B78] hover:from-[#214B78] hover:to-[#3974B8] text-white rounded-xl font-medium shadow-md transition text-sm sm:text-base">حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
