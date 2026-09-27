import React, { useState, useRef, useCallback } from 'react';

// ===================================================
// نماذج الصرف — صفحة شاملة لكل أنواع النماذج
// قابلة للطباعة بشكل رسمي
// ===================================================

const FORM_TYPES = [
  { id: 'salary',        label: 'صرف راتب شهري',         icon: '💰', color: 'blue' },
  { id: 'loan',          label: 'صرف سلفة',               icon: '💳', color: 'orange' },
  { id: 'incentive',     label: 'صرف حوافز',              icon: '🏆', color: 'purple' },
  { id: 'transport',     label: 'صرف بدل مواصلات',        icon: '🚌', color: 'cyan' },
  { id: 'overtime',      label: 'صرف إضافي',              icon: '⌚', color: 'indigo' },
  { id: 'medical',       label: 'صرف بدل علاج',           icon: '💊', color: 'rose' },
  { id: 'custom',        label: 'نموذج صرف عام',           icon: '📄', color: 'gray' },
];

const COLOR_MAP = {
  blue:   { btn: 'bg-blue-600 hover:bg-blue-700', badge: 'bg-blue-100 text-blue-700', border: 'border-blue-200', header: 'bg-blue-700' },
  orange: { btn: 'bg-orange-600 hover:bg-orange-700', badge: 'bg-orange-100 text-orange-700', border: 'border-orange-200', header: 'bg-orange-700' },
  purple: { btn: 'bg-purple-600 hover:bg-purple-700', badge: 'bg-purple-100 text-purple-700', border: 'border-purple-200', header: 'bg-purple-700' },
  cyan:   { btn: 'bg-cyan-600 hover:bg-cyan-700', badge: 'bg-cyan-100 text-cyan-700', border: 'border-cyan-200', header: 'bg-cyan-700' },
  indigo: { btn: 'bg-indigo-600 hover:bg-indigo-700', badge: 'bg-indigo-100 text-indigo-700', border: 'border-indigo-200', header: 'bg-indigo-700' },
  rose:   { btn: 'bg-rose-600 hover:bg-rose-700', badge: 'bg-rose-100 text-rose-700', border: 'border-rose-200', header: 'bg-rose-700' },
  gray:   { btn: 'bg-gray-600 hover:bg-gray-700', badge: 'bg-gray-100 text-gray-700', border: 'border-gray-200', header: 'bg-gray-700' },
};

// تحويل الرقم إلى نص عربي
const numberToArabicWords = (num) => {
  if (!num || isNaN(num)) return '';
  const n = Math.floor(Number(num));
  if (n === 0) return 'صفر';
  const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة',
    'عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر',
    'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
  const tens = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  const hundreds = ['', 'مئة', 'مئتان', 'ثلاثمئة', 'أربعمئة', 'خمسمئة', 'ستمئة', 'سبعمئة', 'ثمانمئة', 'تسعمئة'];

  const convert = (n) => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n/10)] + (n % 10 ? ' و' + ones[n%10] : '');
    const r = n % 100;
    return hundreds[Math.floor(n/100)] + (r ? ' و' + convert(r) : '');
  };

  if (n < 1000) return convert(n) + ' جنيهاً';
  if (n < 1000000) {
    const th = Math.floor(n / 1000);
    const r = n % 1000;
    const thStr = th === 1 ? 'ألف' : th === 2 ? 'ألفان' : th <= 10 ? convert(th) + ' آلاف' : convert(th) + ' ألفاً';
    return thStr + (r ? ' و' + convert(r) : '') + ' جنيهاً';
  }
  return n.toLocaleString('ar') + ' جنيهاً';
};

// ===== نموذج الصرف للطباعة =====
const PrintableForm = React.forwardRef(({ form, emp, companyName }, ref) => {
  const today = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  const formType = FORM_TYPES.find(t => t.id === form.type);
  const serial = `${form.type.toUpperCase()}-${new Date().getFullYear()}-${String(Math.floor(Math.random()*9000)+1000)}`;

  const rows = form.type === 'salary' ? [
    { label: 'الراتب الأساسي', value: form.baseSalary },
    { label: 'حوافز الانتاج', value: form.incentives || 0 },
    { label: 'بدل الإضافي', value: form.overtime || 0 },
    { label: 'بدل المواصلات', value: form.transport || 0 },
    { label: 'إجمالي المستحق', value: form.gross, bold: true, highlight: true },
    { label: 'خصم السلف', value: -(form.loanDeduction || 0), red: true },
    { label: 'خصم التأخيرات', value: -(form.delayDeduction || 0), red: true },
    { label: 'خصم الغياب', value: -(form.absenceDeduction || 0), red: true },
    { label: 'خصومات أخرى', value: -(form.otherDeductions || 0), red: true },
    { label: 'الصافي المستحق للصرف', value: form.amount, bold: true, highlight: true, big: true },
  ] : [
    { label: 'قيمة الصرف', value: form.amount, bold: true, highlight: true, big: true },
    ...(form.notes ? [{ label: 'البيان', value: form.notes, isText: true }] : []),
  ];

  return (
    <div ref={ref} className="bg-white" style={{ fontFamily: 'Arial, sans-serif', direction: 'rtl', padding: '20px', minHeight: '297mm', width: '210mm', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ borderBottom: '3px double #1e3a5f', paddingBottom: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#1e3a5f' }}>{companyName || 'شركة ـــــــــ للصناعات'}</div>
            <div style={{ fontSize: '12px', color: '#555', marginTop: '3px' }}>إدارة الموارد البشرية</div>
          </div>
          <div style={{ textAlign: 'left', fontSize: '11px', color: '#555' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '4px' }}>نموذج صرف</div>
            <div>رقم النموذج: <strong>{serial}</strong></div>
            <div>التاريخ: <strong>{today}</strong></div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '10px', backgroundColor: '#1e3a5f', color: 'white', padding: '6px', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold' }}>
          ✦ {formType?.label || 'نموذج صرف'} ✦
        </div>
      </div>

      {/* Employee Info */}
      <div style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '12px', marginBottom: '16px', backgroundColor: '#f8fafc' }}>
        <div style={{ fontWeight: 'bold', color: '#1e3a5f', marginBottom: '10px', fontSize: '13px', borderBottom: '1px solid #ddd', paddingBottom: '6px' }}>
          📋 بيانات الموظف
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
          {[
            ['الاسم', emp?.name || form.empName || '_______________'],
            ['كود الموظف', emp?.code || '___________'],
            ['القسم', emp?.department || '___________'],
            ['الوظيفة', form.jobTitle || emp?.type || '___________'],
            ['الشهر / الفترة', form.period || 'سبتمبر 2026'],
            ['رقم بطاقة الهوية', emp?.nationalId || '_______________'],
          ].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', gap: '6px' }}>
              <span style={{ color: '#666', minWidth: '110px' }}>{label}:</span>
              <span style={{ fontWeight: 'bold', borderBottom: '1px dashed #aaa', flex: 1, paddingBottom: '1px' }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Amount Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px', fontSize: '13px' }}>
        <thead>
          <tr style={{ backgroundColor: '#1e3a5f', color: 'white' }}>
            <th style={{ padding: '8px 12px', textAlign: 'right', border: '1px solid #1e3a5f' }}>البيان</th>
            <th style={{ padding: '8px 12px', textAlign: 'center', border: '1px solid #1e3a5f', width: '140px' }}>المبلغ (جنيه)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ backgroundColor: row.highlight ? '#eff6ff' : i % 2 === 0 ? '#fff' : '#f9fafb' }}>
              <td style={{ padding: '7px 12px', border: '1px solid #e5e7eb', fontWeight: row.bold ? 'bold' : 'normal', color: '#1e3a5f' }}>
                {row.label}
              </td>
              <td style={{ padding: '7px 12px', border: '1px solid #e5e7eb', textAlign: 'center', fontWeight: row.bold ? 'bold' : 'normal', fontSize: row.big ? '16px' : '13px', color: row.red ? '#dc2626' : row.big ? '#166534' : '#111' }}>
                {row.isText ? row.value : (
                  <>
                    {row.value !== undefined && row.value !== 0
                      ? (Number(row.value) < 0 ? `(${Math.abs(Number(row.value)).toLocaleString('ar-EG')})` : Number(row.value).toLocaleString('ar-EG'))
                      : row.value === 0 ? '—' : ''}
                    {!row.isText && row.value !== undefined && ' ج'}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Amount in words */}
      <div style={{ border: '2px solid #1e3a5f', borderRadius: '6px', padding: '10px 14px', marginBottom: '16px', backgroundColor: '#f0f7ff' }}>
        <span style={{ fontWeight: 'bold', color: '#1e3a5f' }}>المبلغ بالكتابة: </span>
        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{numberToArabicWords(form.amount)} فقط لا غير</span>
      </div>

      {/* Notes */}
      {form.notes && form.type !== 'salary' && (
        <div style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '8px 12px', marginBottom: '16px', fontSize: '12px' }}>
          <span style={{ fontWeight: 'bold', color: '#555' }}>ملاحظات: </span>
          <span>{form.notes}</span>
        </div>
      )}

      {/* Signatures */}
      <div style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '16px', marginBottom: '16px' }}>
        <div style={{ fontWeight: 'bold', color: '#1e3a5f', marginBottom: '24px', fontSize: '12px' }}>التوقيعات:</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', textAlign: 'center', fontSize: '11px' }}>
          {['المدير العام', 'مدير HR', 'المحاسب', 'المستلم / توقيع الموظف'].map(sig => (
            <div key={sig}>
              <div style={{ color: '#555', marginBottom: '30px' }}>{sig}</div>
              <div style={{ borderTop: '1px solid #999', paddingTop: '4px', color: '#888' }}>التوقيع</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px dashed #ccc', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#999' }}>
        <span>هذا النموذج وثيقة رسمية — يُحفظ في ملف الموظف</span>
        <span>طُبع بتاريخ: {today}</span>
        <span>رقم النموذج: {serial}</span>
      </div>
    </div>
  );
});

// ===== الصفحة الرئيسية =====
const PaymentForms = ({
  employees = [],
  loans = [],
  incentives = [],
  overtime = [],
  transportation = [],
  fixedIncentives = [],
  delays = [],
  absences = [],
  deductions = [],
  medicalCases = [],
}) => {
  const printRef = useRef();
  const [selectedType, setSelectedType] = useState(null);
  const [form, setForm] = useState({});
  const [selectedEmpCode, setSelectedEmpCode] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [companyName, setCompanyName] = useState('شركة ـــــــ للصناعات');
  const [history, setHistory] = useState([]);  // سجل النماذج المطبوعة

  const emp = employees.find(e => e.code === selectedEmpCode);

  // حساب القيم من البيانات المشتركة
  const calcHourlyRate = (sal) => sal / 26 / 8;

  const getCalcValues = useCallback((code, salary) => {
    const sal = Number(salary || 0);
    const empInc = incentives.filter(i => i.employeeCode === code).reduce((s, i) => s + (Number(i.total) || 0), 0);
    const empFixedInc = fixedIncentives.filter(f => f.employeeCode === code).reduce((s, f) => s + Math.round(calcHourlyRate(sal) * Number(f.incentiveHours)), 0);
    const empOvt = overtime.filter(o => o.employeeCode === code).reduce((s, o) => s + Math.round(calcHourlyRate(sal) * Number(o.overtimeHours)), 0);
    const empTrans = transportation.filter(t => t.employeeCode === code).reduce((s, t) => s + Number(t.attendanceDays) * Number(t.allowancePerDay), 0);
    const empLoans = loans.filter(l => l.employeeCode === code).reduce((s, l) => s + Number(l.amount), 0);
    const empDed = deductions.filter(d => d.employeeCode === code).reduce((s, d) => s + Number(d.amount), 0);
    const delayMins = delays.filter(d => d.employeeCode === code).reduce((s, d) => s + Number(d.delayMinutes), 0);
    const empDelayDed = Math.round((sal / 26 / 8 / 60) * delayMins);
    const unauth = absences.filter(a => a.employeeCode === code && a.type === 'بدون اذن').length;
    const auth = absences.filter(a => a.employeeCode === code && a.type === 'غياب باذن').length;
    const empAbsDed = Math.round((sal / 26) * (unauth + auth));
    const gross = sal + empInc + empFixedInc + empOvt + empTrans;
    const totalDed = empLoans + empDed + empDelayDed + empAbsDed;
    return { empInc: empInc + empFixedInc, empOvt, empTrans, empLoans, empDed, empDelayDed, empAbsDed, gross, totalDed, net: gross - totalDed };
  }, [incentives, fixedIncentives, overtime, transportation, loans, deductions, delays, absences]);

  // عند اختيار الموظف — ملء القيم تلقائياً
  const onEmpChange = (code) => {
    setSelectedEmpCode(code);
    const e = employees.find(x => x.code === code);
    if (!e || !selectedType) return;
    const sal = Number(e.salary);
    const calc = getCalcValues(code, sal);

    if (selectedType === 'salary') {
      setForm(prev => ({
        ...prev,
        empName: e.name, baseSalary: sal,
        incentives: calc.empInc, overtime: calc.empOvt,
        transport: calc.empTrans, gross: calc.gross,
        loanDeduction: calc.empLoans, delayDeduction: calc.empDelayDed,
        absenceDeduction: calc.empAbsDed, otherDeductions: calc.empDed,
        amount: calc.net,
      }));
    } else if (selectedType === 'loan') {
      const loanAmt = loans.filter(l => l.employeeCode === code).reduce((s, l) => s + Number(l.amount), 0);
      setForm(prev => ({ ...prev, empName: e.name, amount: loanAmt }));
    } else if (selectedType === 'incentive') {
      setForm(prev => ({ ...prev, empName: e.name, amount: calc.empInc }));
    } else if (selectedType === 'transport') {
      setForm(prev => ({ ...prev, empName: e.name, amount: calc.empTrans }));
    } else if (selectedType === 'overtime') {
      setForm(prev => ({ ...prev, empName: e.name, amount: calc.empOvt }));
    } else if (selectedType === 'medical') {
      const med = medicalCases.filter(m => m.employeeCode === code).reduce((s, m) => s + Number(m.amount || 0), 0);
      setForm(prev => ({ ...prev, empName: e.name, amount: med }));
    } else {
      setForm(prev => ({ ...prev, empName: e.name }));
    }
  };

  const onTypeSelect = (typeId) => {
    setSelectedType(typeId);
    setSelectedEmpCode('');
    setForm({ type: typeId, period: 'سبتمبر 2026' });
    setShowPreview(false);
  };

  const handlePrint = () => {
    const newEntry = {
      id: Date.now(),
      type: selectedType,
      typeName: FORM_TYPES.find(t => t.id === selectedType)?.label,
      empName: emp?.name || form.empName,
      amount: form.amount,
      date: new Date().toLocaleDateString('ar-EG'),
    };
    setHistory(prev => [newEntry, ...prev].slice(0, 20));

    const printContent = printRef.current?.innerHTML;
    if (!printContent) return;
    const win = window.open('', '_blank', 'width=900,height=700');
    win.document.write(`
      <html dir="rtl">
        <head>
          <title>نموذج صرف</title>
          <meta charset="utf-8">
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: Arial, sans-serif; direction: rtl; }
            @media print {
              body { margin: 0; }
              @page { margin: 10mm; size: A4; }
            }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 500);
  };

  const formTypeObj = FORM_TYPES.find(t => t.id === selectedType);
  const clr = formTypeObj ? COLOR_MAP[formTypeObj.color] : COLOR_MAP.gray;

  return (
    <div className="p-6 space-y-5 fade-in" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📄 نماذج الصرف</h1>
          <p className="text-gray-500 text-sm">إصدار نماذج صرف رسمية قابلة للطباعة</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-400 bg-gray-50 border rounded-xl px-3 py-2">
            🏢 اسم الشركة:
          </div>
          <input
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-52"
            placeholder="اسم الشركة..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ===== القائمة اليمنى ===== */}
        <div className="space-y-4">
          {/* نوع النموذج */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h2 className="font-bold text-gray-700 mb-3 text-sm">① اختر نوع النموذج</h2>
            <div className="space-y-2">
              {FORM_TYPES.map(ft => {
                const c = COLOR_MAP[ft.color];
                return (
                  <button
                    key={ft.id}
                    onClick={() => onTypeSelect(ft.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right transition-all border ${
                      selectedType === ft.id
                        ? `${c.badge} ${c.border} border font-semibold`
                        : 'bg-gray-50 border-transparent hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="text-xl">{ft.icon}</span>
                    <span className="text-sm flex-1">{ft.label}</span>
                    {selectedType === ft.id && <span className="text-xs">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* سجل الطباعة */}
          {history.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h2 className="font-bold text-gray-700 mb-3 text-sm">🕒 آخر النماذج المطبوعة</h2>
              <div className="space-y-2">
                {history.slice(0, 5).map(h => (
                  <div key={h.id} className="flex items-center justify-between text-xs bg-gray-50 rounded-xl px-3 py-2">
                    <div>
                      <div className="font-medium text-gray-700">{h.empName}</div>
                      <div className="text-gray-400">{h.typeName}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-700">{Number(h.amount || 0).toLocaleString()} ج</div>
                      <div className="text-gray-400">{h.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ===== المنتصف: النموذج ===== */}
        <div className="lg:col-span-2 space-y-4">
          {!selectedType ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center text-gray-400">
              <div className="text-6xl mb-4">📄</div>
              <div className="font-semibold text-gray-500">اختر نوع النموذج من القائمة</div>
            </div>
          ) : (
            <>
              {/* Form Fill */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-700">② بيانات النموذج</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${clr.badge}`}>
                    {formTypeObj?.icon} {formTypeObj?.label}
                  </span>
                </div>

                <div className="space-y-4">
                  {/* الموظف */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الموظف *</label>
                    <select
                      value={selectedEmpCode}
                      onChange={e => onEmpChange(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      <option value="">— اختر الموظف —</option>
                      {employees.map(e => (
                        <option key={e.id} value={e.code}>{e.name} — {e.department} ({e.type})</option>
                      ))}
                    </select>
                  </div>

                  {/* الشهر */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">الشهر / الفترة</label>
                      <input
                        value={form.period || ''}
                        onChange={e => setForm(p => ({ ...p, period: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                        placeholder="سبتمبر 2026"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">الوظيفة</label>
                      <input
                        value={form.jobTitle || emp?.type || ''}
                        onChange={e => setForm(p => ({ ...p, jobTitle: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                        placeholder="المسمى الوظيفي"
                      />
                    </div>
                  </div>

                  {/* حقول خاصة براتب */}
                  {selectedType === 'salary' && (
                    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 space-y-3">
                      <div className="text-xs font-semibold text-gray-600 mb-2">تفاصيل الراتب (يمكن التعديل)</div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { key: 'baseSalary',      label: 'الراتب الأساسي', type: 'مستحقات' },
                          { key: 'incentives',      label: 'الحوافز',        type: 'مستحقات' },
                          { key: 'overtime',        label: 'الإضافي',        type: 'مستحقات' },
                          { key: 'transport',       label: 'المواصلات',      type: 'مستحقات' },
                          { key: 'loanDeduction',   label: 'خصم السلف',      type: 'خصومات' },
                          { key: 'delayDeduction',  label: 'خصم التأخيرات', type: 'خصومات' },
                          { key: 'absenceDeduction',label: 'خصم الغياب',    type: 'خصومات' },
                          { key: 'otherDeductions', label: 'خصومات أخرى',   type: 'خصومات' },
                        ].map(({ key, label, type }) => (
                          <div key={key}>
                            <label className={`block text-xs font-medium mb-1 ${type === 'مستحقات' ? 'text-green-700' : 'text-red-600'}`}>{label}</label>
                            <input
                              type="number" min="0"
                              value={form[key] || 0}
                              onChange={e => {
                                const updated = { ...form, [key]: Number(e.target.value) };
                                const gross = (updated.baseSalary || 0) + (updated.incentives || 0) + (updated.overtime || 0) + (updated.transport || 0);
                                const totalDed = (updated.loanDeduction || 0) + (updated.delayDeduction || 0) + (updated.absenceDeduction || 0) + (updated.otherDeductions || 0);
                                updated.gross = gross;
                                updated.amount = gross - totalDed;
                                setForm(updated);
                              }}
                              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-1 focus:ring-blue-300"
                            />
                          </div>
                        ))}
                      </div>
                      {/* Gross & Net */}
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                        <div className="bg-green-50 rounded-xl p-3 text-center">
                          <div className="text-xs text-green-600 mb-1">إجمالي مستحق</div>
                          <div className="text-lg font-bold text-green-700">{(form.gross || 0).toLocaleString()} ج</div>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-3 text-center">
                          <div className="text-xs text-blue-600 mb-1">الصافي للصرف</div>
                          <div className="text-lg font-bold text-blue-700">{(form.amount || 0).toLocaleString()} ج</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* المبلغ لغير الراتب */}
                  {selectedType !== 'salary' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ (جنيه) *</label>
                      <input
                        type="number" min="0"
                        value={form.amount || ''}
                        onChange={e => setForm(p => ({ ...p, amount: Number(e.target.value) }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-center text-lg font-bold"
                        placeholder="0"
                      />
                      {form.amount > 0 && (
                        <div className="mt-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                          بالكتابة: <strong>{numberToArabicWords(form.amount)}</strong> فقط لا غير
                        </div>
                      )}
                    </div>
                  )}

                  {/* ملاحظات */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات / البيان</label>
                    <textarea
                      value={form.notes || ''}
                      onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                      rows={2}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                      placeholder="أي تفاصيل إضافية..."
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowPreview(true)}
                      disabled={!selectedEmpCode || !form.amount}
                      className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-800 disabled:opacity-40 text-white rounded-xl font-medium transition flex items-center justify-center gap-2"
                    >
                      👁️ معاينة النموذج
                    </button>
                    <button
                      onClick={handlePrint}
                      disabled={!selectedEmpCode || !form.amount}
                      className={`flex-1 py-2.5 ${clr.btn} disabled:opacity-40 text-white rounded-xl font-medium shadow-sm transition flex items-center justify-center gap-2`}
                    >
                      🖨️ طباعة النموذج
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ===== معاينة للطباعة (مخفية) ===== */}
      <div className="hidden">
        <PrintableForm
          ref={printRef}
          form={{ ...form, type: selectedType }}
          emp={emp}
          companyName={companyName}
        />
      </div>

      {/* ===== Modal معاينة ===== */}
      {showPreview && selectedEmpCode && form.amount && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowPreview(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="font-bold text-gray-800">معاينة قبل الطباعة</h2>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className={`px-5 py-2 ${clr.btn} text-white rounded-xl font-medium shadow-sm transition flex items-center gap-2`}
                >
                  🖨️ طباعة
                </button>
                <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none px-2">×</button>
              </div>
            </div>
            <div className="p-4 overflow-auto" style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
              <PrintableForm
                form={{ ...form, type: selectedType }}
                emp={emp}
                companyName={companyName}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentForms;
