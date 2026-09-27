import React, { useState } from 'react';
import { departments } from '../data/initialData';
import { Search, Plus, LayoutGrid, Table, Pencil, Trash2, X, Building2, HardHat, Briefcase, Phone, DollarSign, Calendar, UserCheck, UserX } from 'lucide-react';

const Employees = ({ employees, setEmployees }) => {
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  const emptyForm = {
    code: '', fingerprint: '', name: '', department: '', type: 'انتاج',
    salary: '', status: 'يعمل', hireDate: '', phone: '', nationalId: ''
  };
  const [form, setForm] = useState(emptyForm);

  const filtered = employees.filter(e =>
    (e.name.includes(search) || e.code.includes(search)) &&
    (filterDept ? e.department === filterDept : true) &&
    (filterType ? e.type === filterType : true)
  );

  const openAdd = () => { setEditingEmp(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (emp) => { setEditingEmp(emp.id); setForm({ ...emp }); setShowModal(true); };

  const handleSave = () => {
    if (!form.name || !form.code) return alert('يرجى إدخال الاسم والكود');
    if (editingEmp) {
      setEmployees(prev => prev.map(e => e.id === editingEmp ? { ...form, id: editingEmp } : e));
    } else {
      setEmployees(prev => [...prev, { ...form, id: Date.now() }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('هل تريد حذف هذا الموظف؟')) {
      setEmployees(prev => prev.filter(e => e.id !== id));
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 fade-in">
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
          {departments.map((d, idx) => <option key={`${d}-${idx}`}>{d}</option>)}
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
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-[#718096] text-xs sm:text-sm">النوع</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-[#718096] text-xs sm:text-sm">الراتب</th>
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
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium ${emp.type === 'انتاج' ? 'bg-[#163A63]/10 text-[#163A63]' : 'bg-[#8B5CF6]/10 text-[#8B5CF6]'}`}>
                        {emp.type}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-[#10B981] text-xs sm:text-sm">{Number(emp.salary).toLocaleString()} ج</td>
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
            <div key={emp.id} className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#E2E8F0] hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#163A63]/10 rounded-xl flex items-center justify-center text-[#163A63]">
                  {emp.type === 'انتاج' ? <HardHat size={24} sm:size={28} strokeWidth={2} /> : <Briefcase size={24} sm:size={28} strokeWidth={2} />}
                </div>
                <span className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium ${emp.status === 'يعمل' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#EF4444]/10 text-[#EF4444]'}`}>
                  {emp.status}
                </span>
              </div>
              <h3 className="font-bold text-[#172B45] text-base sm:text-lg mb-1.5">{emp.name}</h3>
              <p className="text-[#163A63] text-sm font-mono mb-3">{emp.code}</p>
              <div className="text-sm text-[#718096] space-y-1.5">
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 sm:p-6 border-b border-[#E2E8F0] flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-bold text-[#172B45]">{editingEmp ? 'تعديل بيانات موظف' : 'إضافة موظف جديد'}</h2>
              <button onClick={() => setShowModal(false)} className="text-[#718096] hover:text-[#172B45] transition">
                <X size={22} sm:size={24} strokeWidth={2} />
              </button>
            </div>
            <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
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
                  {departments.map((d, idx) => <option key={`${d}-${idx}`}>{d}</option>)}
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
            </div>
            <div className="p-5 sm:p-6 border-t border-[#E2E8F0] flex gap-3 justify-end">
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
