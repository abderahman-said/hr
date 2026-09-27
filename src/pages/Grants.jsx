import React, { useState, useRef } from 'react';

// ===================================================
// صفحة المنح والإعانات الاجتماعية
// تغطي: منحة مولود، منحة زواج، إعانة وفاة، إعانات طارئة
// ===================================================

const GRANT_TYPES = [
  { id: 'منحة مولود', label: 'منحة مولود', icon: '👶', defaultAmount: 1000, color: 'bg-pink-100 text-pink-700' },
  { id: 'منحة زواج', label: 'منحة زواج', icon: '💍', defaultAmount: 2000, color: 'bg-rose-100 text-rose-700' },
  { id: 'منحة المولد النبوي', label: 'منحة المولد النبوي', icon: '🕌', defaultAmount: 500, color: 'bg-emerald-100 text-emerald-700' },
  { id: 'منحة رمضان', label: 'منحة رمضان', icon: '🌙', defaultAmount: 1000, color: 'bg-amber-100 text-amber-700' },
  { id: 'إعانة وفاة (درجة أولى)', label: 'إعانة وفاة (درجة أولى)', icon: '🖤', defaultAmount: 1500, color: 'bg-gray-100 text-gray-700' },
  { id: 'إعانة وفاة (درجة ثانية)', label: 'إعانة وفاة (درجة ثانية)', icon: '🥀', defaultAmount: 1000, color: 'bg-gray-100 text-gray-600' },
  { id: 'صرف إعانة طارئة', label: 'صرف إعانة طارئة', icon: '🆘', defaultAmount: 1000, color: 'bg-orange-100 text-orange-700' },
  { id: 'مكافأة تميز', label: 'مكافأة تميز', icon: '⭐', defaultAmount: 1000, color: 'bg-yellow-100 text-yellow-700' },
  { id: 'أخرى', label: 'أخرى', icon: '🎁', defaultAmount: 500, color: 'bg-slate-100 text-slate-700' },
];

const numberToArabicWords = (num) => {
  if (!num || isNaN(num) || num === 0) return 'صفر';
  const n = Math.abs(Math.floor(Number(num)));
  const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة',
    'عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر',
    'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
  const tens = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  const hundreds = ['', 'مئة', 'مئتان', 'ثلاثمئة', 'أربعمئة', 'خمسمئة', 'ستمئة', 'سبعمئة', 'ثمانمئة', 'تسعمئة'];
  const convert = (x) => {
    if (x < 20) return ones[x];
    if (x < 100) return tens[Math.floor(x/10)] + (x%10 ? ' و' + ones[x%10] : '');
    const r = x % 100;
    return hundreds[Math.floor(x/100)] + (r ? ' و' + convert(r) : '');
  };
  if (n < 1000) return convert(n) + ' جنيهاً';
  if (n < 1000000) {
    const th = Math.floor(n/1000), r = n%1000;
    const ts = th === 1 ? 'ألف' : th === 2 ? 'ألفان' : th <= 10 ? convert(th) + ' آلاف' : convert(th) + ' ألفاً';
    return ts + (r ? ' و' + convert(r) : '') + ' جنيهاً';
  }
  return n.toLocaleString('ar-EG') + ' جنيهاً';
};

const Grants = ({ grants: grantsProp = [], setGrants: setGrantsProp, employees = [] }) => {
  const [localGrants, setLocalGrants] = useState(null);
  const data = localGrants ?? grantsProp;
  const setData = (fn) => {
    const next = typeof fn === 'function' ? fn(data) : fn;
    if (setGrantsProp) setGrantsProp(next);
    setLocalGrants(next);
  };

  const [showModal, setShowModal] = useState(false);
  const [printItem, setPrintItem] = useState(null);
  const printReceiptRef = useRef();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [form, setForm] = useState({
    employeeCode: '',
    employeeName: '',
    department: '',
    type: 'منحة مولود',
    amount: 1000,
    date: new Date().toISOString().slice(0, 10),
    status: 'صُرف',
    document: '',
    notes: '',
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

  const handleTypeSelect = (type) => {
    const defaultObj = GRANT_TYPES.find(t => t.id === type);
    setForm(prev => ({
      ...prev,
      type,
      amount: defaultObj ? defaultObj.defaultAmount : prev.amount,
    }));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.employeeCode || !form.amount) {
      showToast('يرجى اختيار الموظف وتحديد المبلغ', 'error');
      return;
    }
    const newRecord = {
      ...form,
      id: Date.now(),
      amount: Number(form.amount),
    };
    setData(prev => [newRecord, ...prev]);
    showToast('تم تسجيل المنحة/الإعانة بنجاح');
    setShowModal(false);
    setForm({
      employeeCode: '',
      employeeName: '',
      department: '',
      type: 'منحة مولود',
      amount: 1000,
      date: new Date().toISOString().slice(0, 10),
      status: 'صُرف',
      document: '',
      notes: '',
    });
  };

  const toggleStatus = (id) => {
    setData(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'صُرف' ? 'معلق' : 'صُرف';
        return { ...item, status: nextStatus };
      }
      return item;
    }));
    showToast('تم تحديث الحالة بنجاح');
  };

  const confirmDelete = (id) => {
    setDeleteConfirm({ show: true, id });
  };

  const executeDelete = () => {
    if (deleteConfirm?.id) {
      setData(prev => prev.filter(item => item.id !== deleteConfirm.id));
      showToast('تم الحذف بنجاح');
    }
    setDeleteConfirm(null);
  };

  const handlePrint = (item) => {
    setPrintItem(item);
    setTimeout(() => {
      const content = printReceiptRef.current?.innerHTML;
      if (!content) return;
      const win = window.open('', '_blank', 'width=800,height=600');
      win.document.write(`
        <html dir="rtl">
          <head>
            <title>سند صرف منحة / إعانة</title>
            <meta charset="utf-8">
            <style>
              * { box-sizing: border-box; margin:0; padding:0; font-family: 'Segoe UI', Tahoma, Arial, sans-serif; direction: rtl; }
              body { padding: 30px; background: #fff; }
              table { width: 100%; border-collapse: collapse; margin: 15px 0; }
              th, td { border: 1px solid #ccc; padding: 10px; text-align: right; }
              th { background: #f0f4f8; }
              @media print { @page { size: A5 landscape; margin: 10mm; } }
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
    const matchSearch = (r.employeeName || '').includes(search) || (r.employeeCode || '').includes(search);
    const matchType = !filterType || r.type === filterType;
    const matchStatus = !filterStatus || r.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const totalDisbursed = data.filter(d => d.status === 'صُرف').reduce((s, r) => s + Number(r.amount || 0), 0);
  const totalPending = data.filter(d => d.status === 'معلق').reduce((s, r) => s + Number(r.amount || 0), 0);
  const newbornCount = data.filter(d => d.type === 'منحة مولود').length;
  const marriageCount = data.filter(d => d.type === 'منحة زواج').length;

  return (
    <div className="p-6 space-y-5 fade-in" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🎁 المنح والإعانات الاجتماعية</h1>
          <p className="text-gray-500 text-sm">منح المواليد، الزواج، الإعانات الطارئة والوفاة</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition"
        >
          <span>+</span> تسجيل منحة / إعانة جديدة
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <div className="text-emerald-600 text-xs font-semibold mb-1">إجمالي المنصرف فعلياً</div>
          <div className="text-2xl font-bold text-emerald-800">{totalDisbursed.toLocaleString('ar-EG')} ج</div>
          <div className="text-xs text-emerald-600 mt-1">حالات معتمدة ومصروفة</div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="text-amber-600 text-xs font-semibold mb-1">المبالغ المعلقة قيد الصرف</div>
          <div className="text-2xl font-bold text-amber-800">{totalPending.toLocaleString('ar-EG')} ج</div>
          <div className="text-xs text-amber-600 mt-1">بانتظار موافقة الإدارة</div>
        </div>
        {GRANT_TYPES.slice(0, 2).map((t, i) => {
          const count = data.filter(d => d.type === t.id).length;
          return (
            <div key={t.id} className={`${t.color.split(' ')[0]} border border-gray-200 rounded-2xl p-4`}>
              <div className={`${t.color.split(' ')[1]} text-xs font-semibold mb-1`}>{t.label} {t.icon}</div>
              <div className="text-2xl font-bold text-gray-800">{count} حالة</div>
              <div className="text-xs text-gray-500 mt-1">إجمالي الحالات المسجلة</div>
            </div>
          );
        })}
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="🔍 بحث باسم الموظف أو الكود..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-emerald-300"
        />
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
        >
          <option value="">جميع أنواع المنح</option>
          {GRANT_TYPES.map(t => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
        >
          <option value="">جميع الحالات</option>
          <option value="صُرف">صُرف</option>
          <option value="معلق">معلق</option>
        </select>
        <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-xl">
          {filtered.length} سجل
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-right font-semibold text-gray-600">#</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">الموظف</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">القسم</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">نوع المنحة / الإعانة</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">المبلغ</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">التاريخ</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">المستند الثبوتي</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">الحالة</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((item, index) => {
                const typeObj = GRANT_TYPES.find(t => t.id === item.type);
                return (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition">
                    <td className="px-4 py-3 text-gray-400">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-800">{item.employeeName}</div>
                      <div className="text-xs text-gray-400">{item.employeeCode}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{item.department || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${typeObj ? typeObj.color : 'bg-gray-100 text-gray-800'}`}>
                        <span>{typeObj?.icon || '🎁'}</span>
                        <span>{item.type}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-700">
                      {Number(item.amount).toLocaleString('ar-EG')} ج
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{item.date}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      <div>{item.document || 'بدون مستند'}</div>
                      {item.notes && <div className="text-gray-400 text-[11px] mt-0.5">{item.notes}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(item.id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition ${
                          item.status === 'صُرف'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                        title="انقر لتغيير الحالة"
                      >
                        {item.status === 'صُرف' ? '✓ تم الصرف' : '⏳ معلق'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handlePrint(item)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                          title="طباعة سند صرف"
                        >
                          🖨️
                        </button>
                        <button
                          onClick={() => confirmDelete(item.id)}
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
            <div className="text-4xl mb-2">🎁</div>
            <div>لا توجد منح أو إعانات مطابقة للبحث</div>
          </div>
        )}
      </div>

      {/* Modal Add */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-scaleIn">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span>🎁</span> تسجيل منحة / إعانة جديدة
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">الموظف *</label>
                <select
                  value={form.employeeCode}
                  onChange={e => handleEmpSelect(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                >
                  <option value="">— اختر الموظف —</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.code}>{e.name} ({e.code}) — {e.department}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">نوع المنحة / الإعانة</label>
                  <select
                    value={form.type}
                    onChange={e => handleTypeSelect(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  >
                    {GRANT_TYPES.map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">المبلغ (جنيه) *</label>
                  <input
                    type="number"
                    min="1"
                    value={form.amount}
                    onChange={e => setForm(prev => ({ ...prev, amount: e.target.value }))}
                    required
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 font-bold text-emerald-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">تاريخ الاستحقاق</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">حالة الصرف</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  >
                    <option value="صُرف">صُرف</option>
                    <option value="معلق">معلق</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">المستند الثبوتي (رقم الوثيقة / الشهادة)</label>
                <input
                  type="text"
                  placeholder="مثال: شهادة ميلاد رقم 987654 / وثيقة زواج"
                  value={form.document}
                  onChange={e => setForm(prev => ({ ...prev, document: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">ملاحظات إضافية</label>
                <textarea
                  rows="2"
                  placeholder="أي تفاصيل أو ملاحظات حول المنحة..."
                  value={form.notes}
                  onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none"
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
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition"
                >
                  حفظ وتسجيل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hidden Printable Receipt */}
      <div className="hidden">
        <div ref={printReceiptRef}>
          {printItem && (
            <div style={{ padding: '20px', border: '2px solid #10b981', borderRadius: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #10b981', paddingBottom: '10px', marginBottom: '15px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', color: '#047857', margin: 0 }}>شركة ـــــــــ للصناعات</h2>
                  <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0' }}>إدارة الموارد البشرية والخدمات الاجتماعية</p>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{ fontSize: '16px', margin: 0, color: '#111' }}>سند صرف منحة / إعانة</h3>
                  <p style={{ fontSize: '12px', color: '#888', margin: '4px 0 0' }}>التاريخ: {printItem.date}</p>
                </div>
              </div>

              <table>
                <tbody>
                  <tr>
                    <th style={{ width: '25%' }}>اسم الموظف</th>
                    <td style={{ fontWeight: 'bold' }}>{printItem.employeeName}</td>
                    <th style={{ width: '20%' }}>كود الموظف</th>
                    <td>{printItem.employeeCode}</td>
                  </tr>
                  <tr>
                    <th>القسم</th>
                    <td>{printItem.department}</td>
                    <th>نوع المنحة</th>
                    <td style={{ fontWeight: 'bold', color: '#047857' }}>{printItem.type}</td>
                  </tr>
                  <tr>
                    <th>المبلغ المستحق</th>
                    <td colSpan="3" style={{ fontSize: '16px', fontWeight: 'bold', color: '#047857' }}>
                      {Number(printItem.amount).toLocaleString('ar-EG')} جنيهاً مصرياً
                      <span style={{ fontSize: '12px', color: '#555', marginRight: '10px' }}>
                        ({numberToArabicWords(printItem.amount)} فقط لا غير)
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>المستند المرفق</th>
                    <td>{printItem.document || 'مرفق بالسند'}</td>
                    <th>حالة الصرف</th>
                    <td>{printItem.status}</td>
                  </tr>
                  {printItem.notes && (
                    <tr>
                      <th>ملاحظات</th>
                      <td colSpan="3">{printItem.notes}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', marginTop: '30px', textAlign: 'center', fontSize: '12px' }}>
                <div>
                  <p style={{ marginBottom: '35px', color: '#555' }}>مسؤول الموارد البشرية</p>
                  <p style={{ borderTop: '1px dashed #999', paddingTop: '5px' }}>التوقيع: ..........................</p>
                </div>
                <div>
                  <p style={{ marginBottom: '35px', color: '#555' }}>الحسابات / الصندوق</p>
                  <p style={{ borderTop: '1px dashed #999', paddingTop: '5px' }}>التوقيع: ..........................</p>
                </div>
                <div>
                  <p style={{ marginBottom: '35px', color: '#555' }}>توقيع المستلم (الموظف)</p>
                  <p style={{ borderTop: '1px dashed #999', paddingTop: '5px' }}>التوقيع: ..........................</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm?.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">تأكيد الحذف</h3>
            <p className="text-gray-600 text-sm mb-6">هل أنت متأكد من حذف هذا السجل؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition text-sm font-medium">إلغاء</button>
              <button onClick={executeDelete} className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm transition text-sm font-medium">نعم، احذف</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 left-4 z-[70] bg-white rounded-xl shadow-lg border border-gray-100 p-4 flex items-center gap-3 animate-slideIn`}>
          <span className={toast.type === 'error' ? 'text-red-500' : 'text-emerald-500'}>
            {toast.type === 'error' ? '❌' : '✅'}
          </span>
          <div className="text-sm font-medium text-gray-800">{toast.msg}</div>
          <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600 p-1">×</button>
        </div>
      )}
    </div>
  );
};

export default Grants;
