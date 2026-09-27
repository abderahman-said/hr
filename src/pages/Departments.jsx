import React, { useState } from 'react';
import { Plus, X, Pencil, Trash2, Building2, Search, CheckCircle, AlertTriangle, Users } from 'lucide-react';

const Departments = ({ departments, setDepartments, employees }) => {
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', manager: '' });
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openAdd = () => {
    setEditId(null);
    setForm({ name: '', description: '', manager: '' });
    setShowModal(true);
  };

  const openEdit = (dept, index) => {
    setEditId(index);
    setForm({ name: dept.name, description: dept.description || '', manager: dept.manager || '' });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name) {
      showToast('يرجى إدخال اسم القسم', 'error');
      return;
    }
    if (editId !== null) {
      const updated = [...departments];
      updated[editId] = { ...updated[editId], name: form.name, description: form.description, manager: form.manager };
      setDepartments(updated);
      showToast('تم تعديل القسم بنجاح');
    } else {
      setDepartments([...departments, { name: form.name, description: form.description, manager: form.manager }]);
      showToast('تمت إضافة القسم بنجاح');
    }
    setShowModal(false);
  };

  const confirmDelete = (index) => {
    const deptEmployees = employees.filter(e => e.department === departments[index].name);
    if (deptEmployees.length > 0) {
      showToast(`لا يمكن حذف القسم لأن به ${deptEmployees.length} موظف`, 'error');
      return;
    }
    setDeleteConfirm(index);
  };

  const executeDelete = () => {
    if (deleteConfirm !== null) {
      const updated = departments.filter((_, i) => i !== deleteConfirm);
      setDepartments(updated);
      showToast('تم حذف القسم بنجاح');
    }
    setDeleteConfirm(null);
  };

  const filtered = departments.filter(d => d.name.includes(search));

  const getEmployeeCount = (deptName) => {
    return employees.filter(e => e.department === deptName).length;
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172B45]">إدارة الأقسام</h1>
          <p className="text-[#718096] text-sm">إجمالي {filtered.length} قسم • {employees.length} موظف</p>
        </div>
        <button onClick={openAdd} className="bg-gradient-to-r from-[#163A63] to-[#214B78] hover:from-[#214B78] hover:to-[#3974B8] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-md transition text-sm">
          <Building2 size={16} sm:size={18} strokeWidth={2} /> إضافة قسم
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-[#E2E8F0]">
        <div className="relative">
          <Search size={16} sm:size={18} strokeWidth={2} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#718096]" />
          <input type="text" placeholder="بحث بالاسم..." value={search} onChange={e => setSearch(e.target.value)}
            className="border border-[#E2E8F0] rounded-xl px-10 py-2 sm:py-2.5 text-sm w-full focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10" />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filtered.map((dept, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#E2E8F0] hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#163A63]/10 rounded-xl flex items-center justify-center text-[#163A63]">
                <Building2 size={24} sm:size={28} strokeWidth={2} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(dept, i)} className="text-[#163A63] hover:bg-[#163A63]/10 p-1.5 sm:p-2 rounded-lg transition">
                  <Pencil size={16} sm:size={18} strokeWidth={2} />
                </button>
                <button onClick={() => confirmDelete(i)} className="text-[#EF4444] hover:bg-[#EF4444]/10 p-1.5 sm:p-2 rounded-lg transition">
                  <Trash2 size={16} sm:size={18} strokeWidth={2} />
                </button>
              </div>
            </div>
            <h3 className="font-bold text-[#172B45] text-base sm:text-lg mb-2">{dept.name}</h3>
            {dept.description && <p className="text-[#718096] text-sm mb-3">{dept.description}</p>}
            {dept.manager && (
              <div className="flex items-center gap-2 text-sm text-[#718096] mb-3">
                <Users size={14} strokeWidth={2} />
                <span>المدير: {dept.manager}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-[#163A63] font-semibold">
              <Users size={14} strokeWidth={2} />
              <span>{getEmployeeCount(dept.name)} موظف</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10 sm:py-12 text-[#718096] text-sm sm:text-base">لا توجد أقسام</div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4 sm:mb-5">
              <h2 className="text-base sm:text-lg font-bold text-[#172B45]">{editId !== null ? 'تعديل قسم' : 'إضافة قسم جديد'}</h2>
              <button onClick={() => setShowModal(false)} className="text-[#718096] hover:text-[#172B45] transition">
                <X size={20} sm:size={24} strokeWidth={2} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#718096] mb-1">اسم القسم *</label>
                <input type="text" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#718096] mb-1">الوصف</label>
                <textarea value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  rows="3" className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#718096] mb-1">مدير القسم</label>
                <select value={form.manager} onChange={e => setForm(prev => ({ ...prev, manager: e.target.value }))}
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10">
                  <option value="">اختر الموظف</option>
                  {employees.map(emp => <option key={emp.id} value={emp.name}>{emp.name} - {emp.jobTitle}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-4 sm:mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 sm:py-2.5 border border-[#E2E8F0] rounded-xl text-[#718096] hover:bg-[#F5F7FA] transition text-sm">إلغاء</button>
              <button onClick={handleSave} className="flex-1 py-2 sm:py-2.5 bg-gradient-to-r from-[#163A63] to-[#214B78] hover:from-[#214B78] hover:to-[#3974B8] text-white rounded-xl font-medium shadow-md transition text-sm">حفظ</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">تأكيد الحذف</h3>
            <p className="text-gray-600 text-sm mb-6">هل أنت متأكد من حذف هذا القسم؟</p>
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
          <CheckCircle className={toast.type === 'error' ? 'text-red-500' : 'text-emerald-500'} size={20} />
          <div className="text-sm font-medium text-gray-800">{toast.msg}</div>
          <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600 p-1"><X size={16} /></button>
        </div>
      )}
    </div>
  );
};

export default Departments;
