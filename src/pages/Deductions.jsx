import React, { useState, useRef } from 'react';
import { Plus, X, Trash2, Scissors, AlertTriangle, Printer, CheckCircle2, Clock } from 'lucide-react';

const Deductions = ({ deductions, setDeductions, employees = [] }) => {
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSignature, setFilterSignature] = useState('');
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    employeeCode: '',
    employeeName: '',
    absenceDate: new Date().toISOString().slice(0, 10),
    type: 'غياب بدون إذن',
    amount: '',
    reason: '',
    signed: false,
    signatureDate: '',
  });

  const [printItem, setPrintItem] = useState(null);
  const printSlipRef = useRef();

  const deductionTypes = ['غياب بدون إذن', 'غياب', 'تأخير', 'انصراف مبكر', 'جزاء', 'خصم آخر'];

  const handleAdd = () => {
    if (!form.employeeCode || !form.amount) return alert('يرجى إدخال البيانات المطلوبة');
    const emp = employees.find(e => e.code === form.employeeCode);
    const newRecord = {
      ...form,
      id: Date.now(),
      employeeName: emp ? emp.name : form.employeeName,
      department: emp ? emp.department : '',
      empType: emp ? emp.type : 'انتاج',
      amount: Number(form.amount),
      signed: form.signed,
      signatureDate: form.signed ? new Date().toISOString().slice(0, 10) : '',
    };
    setDeductions(prev => [newRecord, ...prev]);
    setForm({
      employeeCode: '',
      employeeName: '',
      absenceDate: new Date().toISOString().slice(0, 10),
      type: 'غياب بدون إذن',
      amount: '',
      reason: '',
      signed: false,
      signatureDate: '',
    });
    setShowModal(false);
  };

  const toggleSignature = (id) => {
    setDeductions(prev => prev.map(d => {
      if (d.id === id) {
        const nextSigned = !d.signed;
        return {
          ...d,
          signed: nextSigned,
          signatureDate: nextSigned ? new Date().toISOString().slice(0, 10) : '',
        };
      }
      return d;
    }));
  };

  const handleDelete = (id) => {
    if (window.confirm('حذف الخصم؟')) setDeductions(prev => prev.filter(d => d.id !== id));
  };

  const handlePrintSlip = (item) => {
    setPrintItem(item);
    setTimeout(() => {
      const content = printSlipRef.current?.innerHTML;
      if (!content) return;
      const win = window.open('', '_blank', 'width=750,height=550');
      win.document.write(`
        <html dir="rtl">
          <head>
            <title>إشعار وإقرار خصم من الراتب</title>
            <meta charset="utf-8">
            <style>
              * { box-sizing: border-box; margin:0; padding:0; font-family: 'Segoe UI', Tahoma, Arial, sans-serif; direction: rtl; }
              body { padding: 30px; background: #fff; }
              table { width: 100%; border-collapse: collapse; margin: 15px 0; }
              th, td { border: 1px solid #ddd; padding: 9px; text-align: right; }
              th { background: #fef2f2; color: #991b1b; }
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

  // Enhance data with empType if not present
  const enriched = deductions.map(d => {
    if (d.empType) return d;
    const emp = employees.find(e => e.code === d.employeeCode);
    return {
      ...d,
      empType: emp ? emp.type : 'انتاج',
      department: emp ? emp.department : (d.department || ''),
    };
  });

  const filtered = enriched.filter(d => {
    const matchSearch = (d.employeeName || '').includes(search) || (d.employeeCode || '').includes(search);
    const matchType = !filterType || d.type === filterType;
    const matchCat = !filterCategory || d.empType === filterCategory;
    const matchSig = filterSignature === '' ? true : filterSignature === 'signed' ? !!d.signed : !d.signed;
    return matchSearch && matchType && matchCat && matchSig;
  });

  const total = filtered.reduce((s, d) => s + Number(d.amount || 0), 0);
  const signedTotal = filtered.filter(d => d.signed).length;
  const pendingTotal = filtered.filter(d => !d.signed).length;

  const typeCounts = deductionTypes.reduce((acc, t) => {
    acc[t] = filtered.filter(d => d.type === t).length;
    return acc;
  }, {});

  const typeColors = {
    'غياب بدون إذن': 'bg-[#EF4444]/10 text-[#EF4444]',
    'غياب': 'bg-[#F97316]/10 text-[#F97316]',
    'تأخير': 'bg-[#F59E0B]/10 text-[#F59E0B]',
    'انصراف مبكر': 'bg-[#FBBF24]/10 text-[#FBBF24]',
    'جزاء': 'bg-[#DC2626]/10 text-[#DC2626]',
    'خصم آخر': 'bg-[#718096]/10 text-[#718096]',
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172B45]">الخصومات والجزاءات (مع توقيع الموظف)</h1>
          <p className="text-[#718096] text-sm">{filtered.length} خصم • إجمالي {total.toLocaleString()} ج • {signedTotal} موقع بالعلم • {pendingTotal} بانتظار التوقيع</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-gradient-to-r from-[#EF4444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#B91C1C] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-md transition text-sm">
          <Scissors size={18} strokeWidth={2} /> إضافة خصم / جزاء
        </button>
      </div>

      {/* Type Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
        {deductionTypes.map(t => (
          <div key={t} className={`rounded-xl p-3 text-center ${typeColors[t] || 'bg-[#718096]/10 text-[#718096]'} border border-[#E2E8F0]`}>
            <div className="text-xl font-bold">{typeCounts[t] || 0}</div>
            <div className="text-xs mt-1 leading-tight">{t}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E2E8F0] flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="🔍 بحث باسم الموظف أو الكود..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/10"
        />
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none"
        >
          <option value="">جميع فئات الموظفين</option>
          <option value="ثابت">عمالة ثابتة</option>
          <option value="انتاج">عمالة إنتاج</option>
        </select>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none"
        >
          <option value="">جميع أنواع الخصم</option>
          {deductionTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
          value={filterSignature}
          onChange={e => setFilterSignature(e.target.value)}
          className="border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none"
        >
          <option value="">جميع حالات التوقيع</option>
          <option value="signed">موقّع بالعلم فقط</option>
          <option value="pending">بانتظار التوقيع</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F5F7FA] border-b border-[#E2E8F0]">
                <th className="px-4 py-3 text-right font-semibold text-[#718096]">#</th>
                <th className="px-4 py-3 text-right font-semibold text-[#718096]">الكود</th>
                <th className="px-4 py-3 text-right font-semibold text-[#718096]">الموظف</th>
                <th className="px-4 py-3 text-right font-semibold text-[#718096]">الفئة</th>
                <th className="px-4 py-3 text-right font-semibold text-[#718096]">تاريخ الخصم</th>
                <th className="px-4 py-3 text-right font-semibold text-[#718096]">نوع الخصم</th>
                <th className="px-4 py-3 text-right font-semibold text-[#718096]">القيمة</th>
                <th className="px-4 py-3 text-right font-semibold text-[#718096]">توقيع الموظف بالعلم</th>
                <th className="px-4 py-3 text-center font-semibold text-[#718096]">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filtered.map((ded, i) => (
                <tr key={ded.id} className="hover:bg-[#F5F7FA] transition">
                  <td className="px-4 py-3 text-[#718096]">{i + 1}</td>
                  <td className="px-4 py-3 font-mono text-[#163A63]">{ded.employeeCode}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[#172B45]">{ded.employeeName}</div>
                    {ded.reason && <div className="text-xs text-[#718096]">{ded.reason}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${ded.empType === 'ثابت' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {ded.empType === 'ثابت' ? 'ثابتة' : 'إنتاج'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#718096] text-xs">{ded.absenceDate}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[ded.type] || 'bg-[#718096]/10 text-[#718096]'}`}>{ded.type}</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-[#EF4444]">{Number(ded.amount).toLocaleString()} ج</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleSignature(ded.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition ${
                        ded.signed
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      }`}
                      title="انقر لتعديل حالة التوقيع"
                    >
                      {ded.signed ? (
                        <>
                          <CheckCircle2 size={14} className="text-emerald-600" />
                          <span>موقّع بالعلم ({ded.signatureDate || 'معتمد'})</span>
                        </>
                      ) : (
                        <>
                          <Clock size={14} className="text-amber-600" />
                          <span>في انتظار التوقيع</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handlePrintSlip(ded)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="طباعة إقرار توقيع الخصم"
                      >
                        <Printer size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(ded.id)}
                        className="text-[#EF4444]/60 hover:text-[#EF4444] hover:bg-[#EF4444]/10 p-1.5 rounded-lg transition"
                        title="حذف"
                      >
                        <Trash2 size={16} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr className="bg-[#EF4444]/5 border-t border-[#EF4444]/20">
                  <td colSpan="6" className="px-4 py-3 font-bold text-[#EF4444]">الإجمالي المعروض</td>
                  <td className="px-4 py-3 font-bold text-[#EF4444] text-lg">{total.toLocaleString()} ج</td>
                  <td colSpan="2"></td>
                </tr>
              </tfoot>
            )}
          </table>
          {filtered.length === 0 && <div className="text-center py-10 text-[#718096]">لا توجد خصومات مسجلة</div>}
        </div>
      </div>

      {/* Modal Add */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6 animate-scaleIn">
            <div className="flex justify-between items-center mb-4 sm:mb-5 pb-3 border-b border-[#E2E8F0]">
              <h2 className="text-base sm:text-lg font-bold text-[#172B45]">إضافة خصم / جزاء مع إقرار</h2>
              <button onClick={() => setShowModal(false)} className="text-[#718096] hover:text-[#172B45] transition">
                <X size={20} strokeWidth={2} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#718096] mb-1">الموظف *</label>
                <select value={form.employeeCode} onChange={e => {
                  const emp = employees.find(emp => emp.code === e.target.value);
                  setForm(prev => ({ ...prev, employeeCode: e.target.value, employeeName: emp?.name || '' }));
                }} className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/10">
                  <option value="">اختر الموظف</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.code}>{e.name} ({e.code}) — {e.type === 'ثابت' ? 'ثابت' : 'إنتاج'}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#718096] mb-1">تاريخ الخصم</label>
                  <input type="date" value={form.absenceDate} onChange={e => setForm(prev => ({ ...prev, absenceDate: e.target.value }))}
                    className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/10" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#718096] mb-1">نوع الخصم</label>
                  <select value={form.type} onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/10">
                    {deductionTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#718096] mb-1">القيمة (جنيه) *</label>
                <input type="number" min="1" value={form.amount} onChange={e => setForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/10 font-bold text-[#EF4444]" placeholder="أدخل قيمة الخصم" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#718096] mb-1">سبب أو تفاصيل المخالفة</label>
                <input type="text" value={form.reason} onChange={e => setForm(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/10" placeholder="مثال: غياب يوم السبت بدون إذن مسبق" />
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.signed}
                    onChange={e => setForm(prev => ({ ...prev, signed: e.target.checked }))}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span>تم توقيع الموظف بالعلم رسمياً</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-5 pt-3 border-t border-[#E2E8F0]">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 border border-[#E2E8F0] rounded-xl text-[#718096] hover:bg-[#F5F7FA] transition text-sm">إلغاء</button>
              <button onClick={handleAdd} className="flex-1 py-2 bg-gradient-to-r from-[#EF4444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#B91C1C] text-white rounded-xl font-medium shadow-md transition text-sm">حفظ الخصم</button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Printable Deduction Slip */}
      <div className="hidden">
        <div ref={printSlipRef}>
          {printItem && (
            <div style={{ padding: '20px', border: '2px dashed #dc2626', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #dc2626', paddingBottom: '10px', marginBottom: '15px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', color: '#991b1b', margin: 0 }}>شركة ـــــــــ للصناعات</h2>
                  <p style={{ fontSize: '12px', color: '#666', margin: '3px 0 0' }}>إدارة الموارد البشرية والشؤون الإدارية</p>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{ fontSize: '16px', margin: 0, color: '#dc2626' }}>إشعار وإقرار خصم / جزاء</h3>
                  <p style={{ fontSize: '12px', color: '#777', margin: '3px 0 0' }}>التاريخ: {printItem.absenceDate}</p>
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
                    <th>القسم / الفئة</th>
                    <td>{printItem.department || '—'} ({printItem.empType === 'ثابت' ? 'عمالة ثابتة' : 'عمالة إنتاج'})</td>
                    <th>نوع الخصم</th>
                    <td style={{ fontWeight: 'bold', color: '#dc2626' }}>{printItem.type}</td>
                  </tr>
                  <tr>
                    <th>قيمة الخصم</th>
                    <td colSpan="3" style={{ fontSize: '16px', fontWeight: 'bold', color: '#dc2626' }}>
                      {Number(printItem.amount).toLocaleString('ar-EG')} جنيهاً مصرياً
                    </td>
                  </tr>
                  <tr>
                    <th>سبب الخصم والمخالفة</th>
                    <td colSpan="3">{printItem.reason || 'مخالفة لائحة الحضور والغياب وتنظيم العمل'}</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ marginTop: '20px', padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '12px', lineHeight: '1.8' }}>
                <p><strong>إقرار وتعهد الموظف:</strong></p>
                <p>أقر أنا الموقع أدناه بأنني أُخطرت رسمياً بقرار الخصم الموضح أعلاه وبالأسباب الموجبة له، وأتعهد بالالتزام التام بتعليمات ولوائح الشركة مستقبلاً تفادياً لتشديد الجزاء.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', marginTop: '30px', textAlign: 'center', fontSize: '12px' }}>
                <div>
                  <p style={{ marginBottom: '35px', color: '#555' }}>مسؤول الموارد البشرية</p>
                  <p style={{ borderTop: '1px dotted #888', paddingTop: '4px' }}>التوقيع: ..........................</p>
                </div>
                <div>
                  <p style={{ marginBottom: '35px', color: '#555' }}>رئيس القسم المباشر</p>
                  <p style={{ borderTop: '1px dotted #888', paddingTop: '4px' }}>التوقيع: ..........................</p>
                </div>
                <div>
                  <p style={{ marginBottom: '35px', color: '#555', fontWeight: 'bold' }}>توقيع الموظف بالعلم</p>
                  <p style={{ borderTop: '1px dotted #888', paddingTop: '4px' }}>التوقيع: ..........................</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Deductions;
