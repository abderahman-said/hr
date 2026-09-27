import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit, CheckCircle, XCircle, Clock, Trash } from 'lucide-react';

const initialRequests = [
  { id: 1, requestNumber: 'تو-2026/001', department: 'الحقن', jobTitle: 'عامل حقن', count: 3, currentCount: 12, targetCount: 15, requestedBy: 'محمد علي السيد', requestDate: '2026-09-01', deadline: '2026-10-01', status: 'قيد الدراسة', managerDecision: '' },
  { id: 2, requestNumber: 'تو-2026/002', department: 'التغليف', jobTitle: 'عاملة إنتاج', count: 5, currentCount: 25, targetCount: 30, requestedBy: 'أحمد محمود', requestDate: '2026-09-05', deadline: '2026-10-15', status: 'موافق', managerDecision: 'موافق بشرط التدريب' },
];

const RecruitmentRequests = ({ recruitmentRequests, setRecruitmentRequests, departments }) => {
  const departmentNames = departments.map(d => d.name);
  const [requests, setRequests] = useState(recruitmentRequests?.length ? recruitmentRequests : initialRequests);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  
  const [form, setForm] = useState({
    id: null,
    department: '',
    jobTitle: '',
    count: '',
    currentCount: '',
    targetCount: '',
    requestedBy: '',
    deadline: '',
    managerDecision: ''
  });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = () => {
    if (!form.department || !form.jobTitle || !form.count) {
      showToast('يرجى إدخال الحقول الأساسية', 'error');
      return;
    }

    if (form.id) {
      const updated = requests.map(r => r.id === form.id ? { ...r, ...form } : r);
      setRequests(updated);
      if (setRecruitmentRequests) setRecruitmentRequests(updated);
      showToast('تم تعديل الطلب بنجاح');
    } else {
      const newRequest = {
        ...form,
        id: Date.now(),
        requestNumber: `تو-2026/${String(requests.length + 1).padStart(3, '0')}`,
        requestDate: new Date().toISOString().split('T')[0],
        status: 'قيد الدراسة'
      };
      const newRequests = [...requests, newRequest];
      setRequests(newRequests);
      if (setRecruitmentRequests) setRecruitmentRequests(newRequests);
      showToast('تم إضافة الطلب بنجاح');
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    const newRequests = requests.filter(r => r.id !== deleteConfirm);
    setRequests(newRequests);
    if (setRecruitmentRequests) setRecruitmentRequests(newRequests);
    setDeleteConfirm(null);
    showToast('تم حذف الطلب بنجاح', 'error');
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = requests.map(r => r.id === id ? { ...r, status: newStatus } : r);
    setRequests(updated);
    if (setRecruitmentRequests) setRecruitmentRequests(updated);
    showToast(`تم تغيير الحالة إلى ${newStatus}`);
  };

  const filtered = requests.filter(r => 
    r.department.includes(search) || 
    r.jobTitle.includes(search) || 
    r.requestNumber.includes(search)
  );

  const getStatusBadge = (status) => {
    if (status === 'موافق') return 'bg-green-100 text-green-700';
    if (status === 'مرفوض') return 'bg-red-100 text-red-700';
    return 'bg-amber-100 text-amber-700';
  };

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

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#163A63]">طلبات التوظيف</h1>
          <p className="text-[#718096] text-sm mt-1">إدارة طلبات الأقسام للاحتياجات الوظيفية</p>
        </div>
        <button onClick={() => {
          setForm({ id: null, department: '', jobTitle: '', count: '', currentCount: '', targetCount: '', requestedBy: '', deadline: '', managerDecision: '' });
          setShowModal(true);
        }} className="bg-gradient-to-r from-[#163A63] to-[#214B78] hover:opacity-90 text-white px-5 py-2.5 rounded-2xl font-medium flex items-center gap-2 shadow-sm transition-all">
          <Plus size={20} />
          إضافة طلب
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-[#3974B8] rounded-xl flex items-center justify-center">
            <Search size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#172B45]">{requests.length}</div>
            <div className="text-[#718096] text-sm">إجمالي الطلبات</div>
          </div>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#172B45]">{requests.filter(r => r.status === 'قيد الدراسة').length}</div>
            <div className="text-[#718096] text-sm">قيد الدراسة</div>
          </div>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#172B45]">{requests.filter(r => r.status === 'موافق' || r.status === 'مرفوض').length}</div>
            <div className="text-[#718096] text-sm">موافق / مرفوض</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-[#F5F7FA] text-[#718096]">
              <tr>
                <th className="px-4 py-4 font-semibold">رقم الطلب</th>
                <th className="px-4 py-4 font-semibold">القسم</th>
                <th className="px-4 py-4 font-semibold">المسمى المطلوب</th>
                <th className="px-4 py-4 font-semibold">العدد</th>
                <th className="px-4 py-4 font-semibold">الحالي/المستهدف</th>
                <th className="px-4 py-4 font-semibold">مقدم الطلب</th>
                <th className="px-4 py-4 font-semibold">تاريخ الطلب</th>
                <th className="px-4 py-4 font-semibold">الموعد</th>
                <th className="px-4 py-4 font-semibold text-center">الحالة</th>
                <th className="px-4 py-4 font-semibold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filtered.map(req => (
                <tr key={req.id} className="hover:bg-[#F5F7FA] transition-colors">
                  <td className="px-4 py-3 font-medium text-[#163A63]">{req.requestNumber}</td>
                  <td className="px-4 py-3">{req.department}</td>
                  <td className="px-4 py-3">{req.jobTitle}</td>
                  <td className="px-4 py-3 font-bold text-[#3974B8]">{req.count}</td>
                  <td className="px-4 py-3">
                    <span className="text-gray-500 text-xs">الحالي: {req.currentCount} | هدف: {req.targetCount}</span>
                  </td>
                  <td className="px-4 py-3 text-[#172B45]">{req.requestedBy}</td>
                  <td className="px-4 py-3 text-gray-500">{req.requestDate}</td>
                  <td className="px-4 py-3 text-gray-500">{req.deadline}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {req.status === 'قيد الدراسة' && (
                        <>
                          <button onClick={() => handleStatusChange(req.id, 'موافق')} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="موافقة">
                            <CheckCircle size={18} />
                          </button>
                          <button onClick={() => handleStatusChange(req.id, 'مرفوض')} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="رفض">
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                      <button onClick={() => { setForm(req); setShowModal(true); }} className="p-1.5 text-[#3974B8] hover:bg-blue-50 rounded-lg transition-colors" title="تعديل">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => setDeleteConfirm(req.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="حذف">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="10" className="text-center py-8 text-[#718096]">لا توجد طلبات توظيف</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden fade-in">
            <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F5F7FA]">
              <h2 className="text-lg font-bold text-[#163A63]">{form.id ? 'تعديل طلب' : 'إضافة طلب توظيف جديد'}</h2>
              <button onClick={() => setShowModal(false)} className="text-[#718096] hover:text-red-500 transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#172B45] mb-1">القسم</label>
                  <select value={form.department} onChange={e => setForm({...form, department: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#3974B8]">
                    <option value="">اختر القسم</option>
                    {departmentNames.map((d, idx) => <option key={idx}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#172B45] mb-1">المسمى المطلوب</label>
                  <input type="text" value={form.jobTitle} onChange={e => setForm({...form, jobTitle: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#3974B8]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#172B45] mb-1">العدد المطلوب</label>
                  <input type="number" value={form.count} onChange={e => setForm({...form, count: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#3974B8]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#172B45] mb-1">العدد الحالي بالقسم</label>
                  <input type="number" value={form.currentCount} onChange={e => setForm({...form, currentCount: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#3974B8]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#172B45] mb-1">القوة الافتراضية (المستهدف)</label>
                  <input type="number" value={form.targetCount} onChange={e => setForm({...form, targetCount: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#3974B8]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#172B45] mb-1">مقدم الطلب (مدير القسم)</label>
                  <input type="text" value={form.requestedBy} onChange={e => setForm({...form, requestedBy: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#3974B8]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#172B45] mb-1">الموعد المطلوب</label>
                  <input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#3974B8]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#172B45] mb-1">قرار المدير / ملاحظات</label>
                  <input type="text" value={form.managerDecision} onChange={e => setForm({...form, managerDecision: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#3974B8]" />
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-[#E2E8F0] flex gap-3 bg-[#F5F7FA]">
              <button onClick={handleSave} className="flex-1 bg-gradient-to-r from-[#163A63] to-[#214B78] text-white py-2.5 rounded-xl font-medium shadow-sm hover:opacity-90 transition-all">
                حفظ الطلب
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
            <p className="text-[#718096] mb-6">هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.</p>
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

export default RecruitmentRequests;
