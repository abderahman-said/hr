import React, { useState, useRef } from 'react';

// ===================================================
// القرارات الإدارية والجزاءات
// قرارات الجزاءات، الإنذارات، لفت النظر، الترقيات، والنقل
// ===================================================

const DECISION_TYPES = [
  { id: 'جزاء وخصم', label: 'جزاء وخصم من الراتب', icon: '⚖️', color: 'red' },
  { id: 'إنذار كتابي', label: 'إنذار كتابي رسمي', icon: '⚠️', color: 'amber' },
  { id: 'لفت نظر', label: 'لفت نظر وتنبيه', icon: '📝', color: 'blue' },
  { id: 'ترقية وتعديل مسمى', label: 'ترقية وتعديل مسمى وظيفي', icon: '🚀', color: 'emerald' },
  { id: 'نقل داخلي', label: 'نقل داخلي بين الأقسام', icon: '🔄', color: 'purple' },
  { id: 'مكافأة استثنائية', label: 'قرار صرف مكافأة استثنائية', icon: '🌟', color: 'indigo' },
];

const Decisions = ({ decisions: decisionsProp = [], setDecisions: setDecisionsProp, employees = [] }) => {
  const [localDecisions, setLocalDecisions] = useState(null);
  const data = localDecisions ?? decisionsProp;
  const setData = (fn) => {
    const next = typeof fn === 'function' ? fn(data) : fn;
    if (setDecisionsProp) setDecisionsProp(next);
    setLocalDecisions(next);
  };

  const [showModal, setShowModal] = useState(false);
  const [printItem, setPrintItem] = useState(null);
  const printDecisionRef = useRef();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const nextNumber = `ق-${new Date().getFullYear()}/${String(data.length + 11).padStart(3, '0')}`;

  const [form, setForm] = useState({
    number: nextNumber,
    employeeCode: '',
    employeeName: '',
    department: '',
    type: 'جزاء وخصم',
    date: new Date().toISOString().slice(0, 10),
    subject: '',
    details: '',
    impact: '',
    status: 'ساري',
  });

  const handleEmpSelect = (code) => {
    const emp = employees.find(e => e.code === code);
    setForm(prev => ({
      ...prev,
      employeeCode: code,
      employeeName: emp ? emp.name : '',
      department: emp ? emp.department : '',
    }));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.employeeCode || !form.subject) {
      alert('يرجى اختيار الموظف وكتابة موضوع القرار');
      return;
    }
    const newRecord = {
      ...form,
      id: Date.now(),
    };
    setData(prev => [newRecord, ...prev]);
    setShowModal(false);
    setForm({
      number: `ق-${new Date().getFullYear()}/${String(data.length + 12).padStart(3, '0')}`,
      employeeCode: '',
      employeeName: '',
      department: '',
      type: 'جزاء وخصم',
      date: new Date().toISOString().slice(0, 10),
      subject: '',
      details: '',
      impact: '',
      status: 'ساري',
    });
  };

  const toggleStatus = (id) => {
    setData(prev => prev.map(item => {
      if (item.id === id) {
        const cycle = { 'ساري': 'منفذ', 'منفذ': 'ملغى', 'ملغى': 'ساري' };
        return { ...item, status: cycle[item.status] || 'ساري' };
      }
      return item;
    }));
  };

  const handleDelete = (id) => {
    if (window.confirm('هل تريد حذف هذا القرار بالتأكيد؟')) {
      setData(prev => prev.filter(item => item.id !== id));
    }
  };

  const handlePrint = (item) => {
    setPrintItem(item);
    setTimeout(() => {
      const content = printDecisionRef.current?.innerHTML;
      if (!content) return;
      const win = window.open('', '_blank', 'width=850,height=700');
      win.document.write(`
        <html dir="rtl">
          <head>
            <title>قرار إداري رقم ${item.number}</title>
            <meta charset="utf-8">
            <style>
              * { box-sizing: border-box; margin:0; padding:0; font-family: 'Segoe UI', Tahoma, Arial, sans-serif; direction: rtl; }
              body { padding: 40px; background: #fff; line-height: 1.6; }
              table { width: 100%; border-collapse: collapse; margin: 15px 0; }
              th, td { border: 1px solid #ccc; padding: 10px; text-align: right; }
              th { background: #f8fafc; }
              @media print { @page { size: A4; margin: 15mm; } }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `);
      win.document.close();
      setTimeout(() => { win.print(); }, 500);
    }, 100);
  };

  const filtered = data.filter(r => {
    const matchSearch = (r.employeeName || '').includes(search) || (r.employeeCode || '').includes(search) || (r.subject || '').includes(search) || (r.number || '').includes(search);
    const matchType = !filterType || r.type === filterType;
    const matchStatus = !filterStatus || r.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const penaltyCount = data.filter(d => d.type.includes('جزاء') || d.type.includes('إنذار') || d.type.includes('لفت')).length;
  const promotionCount = data.filter(d => d.type.includes('ترقية') || d.type.includes('مكافأة')).length;
  const activeCount = data.filter(d => d.status === 'ساري').length;
  const executedCount = data.filter(d => d.status === 'منفذ').length;

  return (
    <div className="p-6 space-y-5 fade-in" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📋 القرارات الإدارية والجزاءات</h1>
          <p className="text-gray-500 text-sm">سجل الجزاءات، الإنذارات، الترقيات، والتعديلات الإدارية</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition"
        >
          <span>+</span> إصدار قرار إداري جديد
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="text-red-600 text-xs font-semibold mb-1">الجزاءات والإنذارات</div>
          <div className="text-2xl font-bold text-red-800">{penaltyCount} قرار</div>
          <div className="text-xs text-red-600 mt-1">تأديبية وتنظيمية</div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <div className="text-emerald-600 text-xs font-semibold mb-1">الترقيات والمكافآت</div>
          <div className="text-2xl font-bold text-emerald-800">{promotionCount} قرار</div>
          <div className="text-xs text-emerald-600 mt-1">تحفيزية وتطويرية</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="text-blue-600 text-xs font-semibold mb-1">قرارات سارية</div>
          <div className="text-2xl font-bold text-blue-800">{activeCount} قرار</div>
          <div className="text-xs text-blue-600 mt-1">قيد المتابعة والتنفيذ</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
          <div className="text-purple-600 text-xs font-semibold mb-1">قرارات تم تنفيذها</div>
          <div className="text-2xl font-bold text-purple-800">{executedCount} قرار</div>
          <div className="text-xs text-purple-600 mt-1">أثرت مالياً أو إدارياً</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="🔍 بحث برقم القرار أو اسم الموظف أو الموضوع..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm flex-1 min-w-56 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="">جميع أنواع القرارات</option>
          {DECISION_TYPES.map(t => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="">جميع الحالات</option>
          <option value="ساري">ساري</option>
          <option value="منفذ">منفذ</option>
          <option value="ملغى">ملغى</option>
        </select>
        <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-xl">
          {filtered.length} قرار
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-right font-semibold text-gray-600">رقم القرار</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">التاريخ</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">الموظف</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">القسم</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">النوع</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">الموضوع والأسباب</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">الأثر والمنطوق</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">الحالة</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(item => {
                const typeObj = DECISION_TYPES.find(t => t.id === item.type);
                return (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition">
                    <td className="px-4 py-3 font-mono font-bold text-blue-700 text-xs">{item.number}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{item.date}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-800">{item.employeeName}</div>
                      <div className="text-xs text-gray-400">{item.employeeCode}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{item.department || '—'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <span>{typeObj?.icon || '📄'}</span>
                        <span>{item.type}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="font-medium text-gray-800 text-xs truncate" title={item.subject}>{item.subject}</div>
                      {item.details && <div className="text-gray-400 text-[11px] truncate" title={item.details}>{item.details}</div>}
                    </td>
                    <td className="px-4 py-3 text-xs max-w-xs font-semibold text-gray-700">
                      {item.impact || '—'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => toggleStatus(item.id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition ${
                          item.status === 'منفذ'
                            ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                            : item.status === 'ساري'
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                        title="انقر لتغيير الحالة (ساري / منفذ / ملغى)"
                      >
                        {item.status}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handlePrint(item)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                          title="طباعة إخطار القرار الرسمي"
                        >
                          🖨️
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                          title="حذف"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-2">📋</div>
            <div>لا توجد قرارات مطابقة لمعايير البحث</div>
          </div>
        )}
      </div>

      {/* Modal Add Decision */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 animate-scaleIn">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span>📋</span> إصدار قرار إداري رسمي جديد
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">رقم القرار</label>
                  <input
                    type="text"
                    value={form.number}
                    onChange={e => setForm(prev => ({ ...prev, number: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">تاريخ القرار</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">الموظف المعني *</label>
                <select
                  value={form.employeeCode}
                  onChange={e => handleEmpSelect(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">— اختر الموظف —</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.code}>{e.name} ({e.code}) — {e.department}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">نوع القرار الإداري</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    {DECISION_TYPES.map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">حالة القرار</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="ساري">ساري (قيد المتابعة)</option>
                    <option value="منفذ">منفذ (تم التطبيق)</option>
                    <option value="ملغى">ملغى</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">موضوع القرار (عنوان مختصر) *</label>
                <input
                  type="text"
                  placeholder="مثال: خصم يومين لمخالفة تعليمات العمل / ترقية إلى مشرف خط"
                  value={form.subject}
                  onChange={e => setForm(prev => ({ ...prev, subject: e.target.value }))}
                  required
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">الأسباب والوقائع بالتفصيل</label>
                <textarea
                  rows="3"
                  placeholder="سرد المخالفة أو مبررات الترقية أو تفاصيل النقل الداخلي..."
                  value={form.details}
                  onChange={e => setForm(prev => ({ ...prev, details: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">الأثر والمنطوق (ما ترتب على القرار)</label>
                <input
                  type="text"
                  placeholder="مثال: خصم 200 ج من راتب سبتمبر / تعديل المسمى وزيادة الراتب 300 ج"
                  value={form.impact}
                  onChange={e => setForm(prev => ({ ...prev, impact: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm font-medium transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition"
                >
                  اعتماد وإصدار القرار
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hidden Printable Official Decision */}
      <div className="hidden">
        <div ref={printDecisionRef}>
          {printItem && (
            <div style={{ padding: '30px', border: '3px double #1e3a5f', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #1e3a5f', paddingBottom: '15px', marginBottom: '25px' }}>
                <div>
                  <h1 style={{ fontSize: '20px', color: '#1e3a5f', margin: 0 }}>شركة ـــــــــ للصناعات</h1>
                  <p style={{ fontSize: '13px', color: '#555', margin: '4px 0 0' }}>الإدارة العامة للموارد البشرية والشؤون القانونية</p>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ background: '#1e3a5f', color: '#fff', padding: '4px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px', display: 'inline-block' }}>
                    قرار إداري رقم: {printItem.number}
                  </div>
                  <p style={{ fontSize: '12px', color: '#666', margin: '6px 0 0' }}>التاريخ: {printItem.date}</p>
                </div>
              </div>

              <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <h2 style={{ fontSize: '18px', color: '#1e3a5f', textDecoration: 'underline' }}>
                  قرار إداري بشأن: {printItem.subject}
                </h2>
              </div>

              <div style={{ margin: '25px 0', fontSize: '14px', lineHeight: '2' }}>
                <p style={{ marginBottom: '10px' }}>
                  بعد الاطلاع على لائحة تنظيم العمل والجزاءات المعتمدة، وبناءً على مقتضيات العمل ومصلحته العامة:
                </p>

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '15px', margin: '15px 0' }}>
                  <p><strong>اسم الموظف المعني:</strong> {printItem.employeeName}</p>
                  <p><strong>كود الموظف:</strong> {printItem.employeeCode} &nbsp;&nbsp;|&nbsp;&nbsp; <strong>القسم:</strong> {printItem.department}</p>
                  <p><strong>تصنيف القرار:</strong> {printItem.type}</p>
                </div>

                <h3 style={{ fontSize: '15px', color: '#1e3a5f', marginTop: '15px' }}>أولاً - الوقائع والأسباب:</h3>
                <p style={{ padding: '8px 15px', background: '#fff', borderRight: '3px solid #1e3a5f', margin: '8px 0' }}>
                  {printItem.details || 'بناءً على التقرير المرفوع من رئيس القسم ومطالعة السجلات.'}
                </p>

                <h3 style={{ fontSize: '15px', color: '#1e3a5f', marginTop: '15px' }}>ثانياً - منطوق القرار والأثر:</h3>
                <p style={{ padding: '10px 15px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', margin: '8px 0', fontWeight: 'bold', color: '#1e40af' }}>
                  {printItem.impact || 'اعتماد القرار وسريانه اعتباراً من تاريخ صدوره.'}
                </p>

                <p style={{ marginTop: '15px' }}>
                  على جميع الإدارات والأقسام المعنية تنفيذ هذا القرار كل فيما يخصه، ويُحفظ أصل القرار بملف خدمة الموظف.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', marginTop: '50px', textAlign: 'center', fontSize: '13px' }}>
                <div>
                  <p style={{ marginBottom: '45px', fontWeight: 'bold', color: '#333' }}>المدير العام / المفوض</p>
                  <p style={{ borderTop: '1px solid #666', paddingTop: '6px' }}>التوقيع: ..........................</p>
                </div>
                <div>
                  <p style={{ marginBottom: '45px', fontWeight: 'bold', color: '#333' }}>مدير الموارد البشرية</p>
                  <p style={{ borderTop: '1px solid #666', paddingTop: '6px' }}>التوقيع: ..........................</p>
                </div>
                <div>
                  <p style={{ marginBottom: '45px', fontWeight: 'bold', color: '#333' }}>توقيع الموظف بالعلم والاستلام</p>
                  <p style={{ borderTop: '1px solid #666', paddingTop: '6px' }}>التوقيع: ..........................</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Decisions;
