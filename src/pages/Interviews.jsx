import React, { useState } from 'react';

const Interviews = ({ employees, setEmployees }) => {
  const [interviews, setInterviews] = useState([
    { id: 1, name: 'ساميه محمد عويس', department: 'الإنتاج', gender: 'أنثى', address: 'كفر حسان', maritalStatus: 'متزوجة', age: 45, nationalId: '28209192201308', education: 'بدون', phone: '01012345678', previousWork: '', interviewDate: '2026-03-01', result: 'مقبول', notes: '' },
    { id: 2, name: 'عبد الرحمن علي إبراهيم', department: 'المخازن', gender: 'ذكر', address: 'ميت الكرما', maritalStatus: 'أعزب', age: 24, nationalId: '30201010123456', education: 'ثانوية عامة', phone: '01123456789', previousWork: '', interviewDate: '2026-03-05', result: 'معلق', notes: '' },
    { id: 3, name: 'هدير السيد أحمد خليل', department: 'الإنتاج', gender: 'أنثى', address: 'كفر العرب', maritalStatus: 'مطلقة', age: 30, nationalId: '29609011224885', education: 'بدون', phone: '01234567890', previousWork: '', interviewDate: '2026-03-10', result: 'مرفوض', notes: 'لا تنطبق عليها الشروط' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', department: '', gender: 'ذكر', address: '', maritalStatus: 'أعزب', age: '', nationalId: '', education: '', phone: '', previousWork: '', interviewDate: '', result: 'معلق', notes: '' });
  const [search, setSearch] = useState('');
  const [filterResult, setFilterResult] = useState('');

  const departments = ['الحقن', 'التغليف', 'المخازن', 'الحسابات', 'الجودة', 'المبيعات', 'الإنتاج', 'الإدارة'];

  const resultColors = {
    'مقبول': 'bg-green-100 text-green-700 border-green-200',
    'مرفوض': 'bg-red-100 text-red-700 border-red-200',
    'معلق': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'تم التوظيف': 'bg-blue-100 text-blue-700 border-blue-200',
  };

  const handleAdd = () => {
    if (!form.name) return alert('يرجى إدخال اسم المتقدم');
    setInterviews(prev => [...prev, { ...form, id: Date.now(), age: Number(form.age) }]);
    setForm({ name: '', department: '', gender: 'ذكر', address: '', maritalStatus: 'أعزب', age: '', nationalId: '', education: '', phone: '', previousWork: '', interviewDate: '', result: 'معلق', notes: '' });
    setShowModal(false);
  };

  const updateResult = (id, result) => setInterviews(prev => prev.map(i => i.id === id ? { ...i, result } : i));
  const handleDelete = (id) => { if (window.confirm('حذف هذا السجل؟')) setInterviews(prev => prev.filter(i => i.id !== id)); };

  const handleHire = (interview) => {
    if (!window.confirm(`توظيف ${interview.name} في قسم ${interview.department}؟`)) return;
    updateResult(interview.id, 'تم التوظيف');
  };

  const filtered = interviews.filter(i => {
    const matchSearch = i.name.includes(search) || i.department.includes(search);
    const matchResult = !filterResult || i.result === filterResult;
    return matchSearch && matchResult;
  });

  const accepted = interviews.filter(i => i.result === 'مقبول').length;
  const rejected = interviews.filter(i => i.result === 'مرفوض').length;
  const pending = interviews.filter(i => i.result === 'معلق').length;
  const hired = interviews.filter(i => i.result === 'تم التوظيف').length;

  return (
    <div className="p-6 space-y-5 fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">المقابلات والتوظيف</h1>
          <p className="text-gray-500 text-sm">{interviews.length} متقدم</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition">
          + إضافة مقابلة
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-700">{pending}</div>
          <div className="text-yellow-500 text-sm mt-1">معلقة</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{accepted}</div>
          <div className="text-green-500 text-sm mt-1">مقبول</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{hired}</div>
          <div className="text-blue-500 text-sm mt-1">تم التوظيف</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-red-700">{rejected}</div>
          <div className="text-red-500 text-sm mt-1">مرفوض</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3">
        <input type="text" placeholder="🔍 بحث بالاسم أو القسم..." value={search} onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm flex-1 min-w-40 focus:outline-none focus:ring-2 focus:ring-violet-300" />
        <select value={filterResult} onChange={e => setFilterResult(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300">
          <option value="">كل النتائج</option>
          {['معلق', 'مقبول', 'مرفوض', 'تم التوظيف'].map(r => <option key={r}>{r}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-3 py-3 text-right font-semibold text-gray-600">#</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">الاسم</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">القسم</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">النوع</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">العمر</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">المؤهل</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">الهاتف</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">تاريخ المقابلة</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">النتيجة</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((interview, i) => (
                <tr key={interview.id} className="hover:bg-gray-50 transition">
                  <td className="px-3 py-2.5 text-gray-400">{i + 1}</td>
                  <td className="px-3 py-2.5">
                    <div className="font-medium text-gray-800">{interview.name}</div>
                    <div className="text-xs text-gray-400">{interview.address} • {interview.maritalStatus}</div>
                  </td>
                  <td className="px-3 py-2.5 text-gray-600">{interview.department}</td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${interview.gender === 'ذكر' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>{interview.gender}</span>
                  </td>
                  <td className="px-3 py-2.5 text-gray-600">{interview.age}</td>
                  <td className="px-3 py-2.5 text-gray-500 text-xs">{interview.education}</td>
                  <td className="px-3 py-2.5 text-gray-500 text-xs">{interview.phone}</td>
                  <td className="px-3 py-2.5 text-gray-500 text-xs">{interview.interviewDate}</td>
                  <td className="px-3 py-2.5">
                    <select value={interview.result} onChange={e => updateResult(interview.id, e.target.value)}
                      className={`text-xs px-2 py-1.5 rounded-lg border font-medium focus:outline-none cursor-pointer ${resultColors[interview.result] || ''}`}>
                      {['معلق', 'مقبول', 'مرفوض', 'تم التوظيف'].map(r => <option key={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2.5 flex gap-1">
                    {interview.result === 'مقبول' && (
                      <button onClick={() => handleHire(interview)} className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded-lg transition">توظيف</button>
                    )}
                    <button onClick={() => handleDelete(interview.id)} className="text-red-400 hover:bg-red-50 p-1.5 rounded-lg transition">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-10 text-gray-400">لا توجد مقابلات مسجلة</div>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">تسجيل مقابلة جديدة</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                { label: 'الاسم الكامل *', key: 'name', type: 'text', colSpan: true },
                { label: 'رقم الهاتف', key: 'phone', type: 'text' },
                { label: 'العمر', key: 'age', type: 'number' },
                { label: 'العنوان', key: 'address', type: 'text' },
                { label: 'رقم البطاقة', key: 'nationalId', type: 'text' },
                { label: 'المؤهل', key: 'education', type: 'text' },
                { label: 'العمل السابق', key: 'previousWork', type: 'text' },
                { label: 'تاريخ المقابلة', key: 'interviewDate', type: 'date' },
              ].map(f => (
                <div key={f.key} className={f.colSpan ? 'col-span-2' : ''}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  <input type={f.type} value={form[f.key] || ''} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
                </div>
              ))}
              {[
                { label: 'القسم', key: 'department', options: departments },
                { label: 'النوع', key: 'gender', options: ['ذكر', 'أنثى'] },
                { label: 'الحالة الاجتماعية', key: 'maritalStatus', options: ['أعزب', 'متزوج', 'متزوجة', 'مطلق', 'مطلقة', 'أرمل'] },
                { label: 'النتيجة', key: 'result', options: ['معلق', 'مقبول', 'مرفوض'] },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  <select value={form[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300">
                    {f.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
                <textarea value={form.notes} onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))} rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none" />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">إلغاء</button>
              <button onClick={handleAdd} className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium shadow-sm transition">حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Interviews;
