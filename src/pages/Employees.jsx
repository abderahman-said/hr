import React, { useState } from 'react';
import { departments } from '../data/initialData';

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
    <div className="p-6 space-y-5 fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">بيانات الموظفين</h1>
          <p className="text-gray-500 text-sm">{filtered.length} موظف</p>
        </div>
        <button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition">
          <span>+</span> إضافة موظف
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="🔍 بحث بالاسم أو الكود..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
          <option value="">كل الأقسام</option>
          {departments.map(d => <option key={d}>{d}</option>)}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
          <option value="">كل الأنواع</option>
          <option>انتاج</option>
          <option>ثابت</option>
        </select>
        <div className="flex gap-2">
          <button onClick={() => setViewMode('table')} className={`px-3 py-2 rounded-xl text-sm ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>جدول</button>
          <button onClick={() => setViewMode('cards')} className={`px-3 py-2 rounded-xl text-sm ${viewMode === 'cards' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>بطاقات</button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">#</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">الكود</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">الاسم</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">القسم</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">النوع</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">الراتب</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">الحالة</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((emp, i) => (
                  <tr key={emp.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3 font-mono text-blue-600 font-semibold">{emp.code}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{emp.name}</td>
                    <td className="px-4 py-3 text-gray-600">{emp.department}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${emp.type === 'انتاج' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {emp.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-green-600">{Number(emp.salary).toLocaleString()} ج</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${emp.status === 'يعمل' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => openEdit(emp)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition">✏️</button>
                      <button onClick={() => handleDelete(emp.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400">لا توجد نتائج</div>
          )}
        </div>
      )}

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(emp => (
            <div key={emp.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                  {emp.type === 'انتاج' ? '👷' : '👔'}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${emp.status === 'يعمل' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {emp.status}
                </span>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{emp.name}</h3>
              <p className="text-blue-600 text-sm font-mono mb-2">{emp.code}</p>
              <div className="text-sm text-gray-500 space-y-1">
                <div>🏭 {emp.department} • {emp.type}</div>
                <div>💰 {Number(emp.salary).toLocaleString()} جنيه</div>
                {emp.phone && <div>📱 {emp.phone}</div>}
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => openEdit(emp)} className="flex-1 text-center text-blue-600 hover:bg-blue-50 py-1.5 rounded-lg text-sm border border-blue-200 transition">تعديل</button>
                <button onClick={() => handleDelete(emp.id)} className="flex-1 text-center text-red-500 hover:bg-red-50 py-1.5 rounded-lg text-sm border border-red-200 transition">حذف</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">{editingEmp ? 'تعديل بيانات موظف' : 'إضافة موظف جديد'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.key] || ''}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">القسم</label>
                <select value={form.department} onChange={e => setForm(prev => ({ ...prev, department: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                  <option value="">اختر القسم</option>
                  {departments.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">النوع</label>
                <select value={form.type} onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                  <option>انتاج</option>
                  <option>ثابت</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                <select value={form.status} onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                  <option>يعمل</option>
                  <option>لا يعمل</option>
                  <option>تصفية</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="px-5 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">إلغاء</button>
              <button onClick={handleSave} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm transition">حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
