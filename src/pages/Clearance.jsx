import React, { useState, useRef, useCallback } from 'react';

// ===================================================
// التصفية — مستحقات نهاية الخدمة
// وفق قانون العمل المصري رقم 12 لسنة 2003
// ===================================================

// ===== قانون العمل المصري =====
// مكافأة نهاية الخدمة:
//   - أول 5 سنوات: نصف شهر عن كل سنة
//   - بعد 5 سنوات: شهر كامل عن كل سنة
// بدل الإخطار:
//   - أقل من 10 سنوات خدمة: شهر واحد
//   - 10 سنوات فأكثر: شهران
// نسبة الاستحقاق عند الاستقالة:
//   - أقل من 5 سنوات: لا يستحق مكافأة
//   - 5 إلى أقل من 10 سنوات: ثلث المكافأة
//   - 10 إلى أقل من 15 سنة: ثلثان المكافأة
//   - 15 سنة فأكثر: المكافأة كاملة
// إذا كان الفصل من صاحب العمل: المكافأة كاملة

const SEPARATION_REASONS = [
  { id: 'resigned',    label: 'استقالة (بإرادة الموظف)',     icon: '🚪', color: 'orange' },
  { id: 'terminated',  label: 'إنهاء الخدمة (بقرار الشركة)', icon: '📋', color: 'red'    },
  { id: 'mutual',      label: 'اتفاق متبادل',                 icon: '🤝', color: 'blue'   },
  { id: 'retired',     label: 'إحالة إلى التقاعد',            icon: '🏖️', color: 'green'  },
  { id: 'contract_end',label: 'انتهاء العقد المحدد المدة',     icon: '📅', color: 'purple' },
];

const numberToArabicWords = (num) => {
  const ones = ['صفر','واحد','اثنان','ثلاثة','أربعة','خمسة','ستة','سبعة','ثمانية','تسعة'];
  const tens = ['','عشرة','عشرون','ثلاثون','أربعون','خمسون','ستون','سبعون','ثمانون','تسعون'];
  const hundreds = ['','مائة','مائتان','ثلاثمائة','أربعمائة','خمسمائة','ستمائة','سبعمائة','ثمانمائة','تسعمائة'];
  if (num === 0) return 'صفر جنيهًا';
  if (num > 99999) return num.toLocaleString() + ' جنيه';
  let result = '';
  const h = Math.floor(num / 1000);
  const rest = num % 1000;
  const hh = Math.floor(rest / 100);
  const t = Math.floor((rest % 100) / 10);
  const o = rest % 10;
  if (h > 0) result += (h === 1 ? 'ألف' : h === 2 ? 'ألفان' : h + ' آلاف') + (rest > 0 ? ' و' : '');
  if (hh > 0) result += hundreds[hh] + (t > 0 || o > 0 ? ' و' : '');
  if (t === 1) result += (o === 0 ? 'عشرة' : ['','إحدى عشرة','اثنتا عشرة','ثلاثة عشرة','أربعة عشرة','خمسة عشرة','ستة عشرة','سبعة عشرة','ثمانية عشرة','تسعة عشرة'][o]);
  else { if (t > 0) result += tens[t] + (o > 0 ? ' و' : ''); if (o > 0) result += ones[o]; }
  return result + ' فقط لا غير';
};

const calcServiceDuration = (hireDate, lastDate) => {
  if (!hireDate || !lastDate) return null;
  const start = new Date(hireDate);
  const end   = new Date(lastDate);
  if (isNaN(start) || isNaN(end) || end < start) return null;

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) { months--; days += new Date(end.getFullYear(), end.getMonth(), 0).getDate(); }
  if (months < 0) { years--; months += 12; }

  const totalYears = years + months / 12 + days / 365;
  return { years, months, days, totalYears };
};

const calcGratuity = (salary, totalYears, reason) => {
  if (totalYears <= 0) return 0;
  const monthlySal = Number(salary);

  // حساب المكافأة الكاملة (بغض النظر عن نسبة الاستحقاق)
  let full = 0;
  if (totalYears <= 5) {
    full = (monthlySal / 2) * totalYears; // نصف شهر / سنة
  } else {
    full = (monthlySal / 2) * 5 + monthlySal * (totalYears - 5); // أول 5 بنصف + الباقي كامل
  }

  // نسبة الاستحقاق حسب سبب الإنهاء
  let ratio = 1;
  if (reason === 'resigned') {
    if (totalYears < 5)       ratio = 0;
    else if (totalYears < 10) ratio = 1/3;
    else if (totalYears < 15) ratio = 2/3;
    else                      ratio = 1;
  }
  // terminated, retired, mutual, contract_end = ratio 1

  return Math.round(full * ratio);
};

const calcNoticePay = (salary, totalYears, reason) => {
  if (reason === 'contract_end') return 0; // عقد محدد المدة لا يستحق بدل إخطار
  const months = totalYears >= 10 ? 2 : 1;
  return Math.round(Number(salary) * months);
};

const Clearance = ({
  employees = [],
  loans = [],
  leaveBalance = [],
  deductions = [],
  delays = [],
  absences = [],
}) => {
  const printRef = useRef();

  const [selectedEmpCode, setSelectedEmpCode] = useState('');
  const [reason, setReason] = useState('');
  const [lastWorkingDay, setLastWorkingDay] = useState('');
  const [unusedLeaveDays, setUnusedLeaveDays] = useState(0);
  const [pendingSalaryDays, setPendingSalaryDays] = useState(0);
  const [custody, setCustody] = useState(0);
  const [extraAdditions, setExtraAdditions] = useState([{ label: '', amount: 0 }]);
  const [extraDeductions, setExtraDeductions] = useState([{ label: '', amount: 0 }]);
  const [companyName, setCompanyName] = useState('شركة ـــــــ للصناعات');
  const [showResult, setShowResult] = useState(false);
  const [savedRecords, setSavedRecords] = useState([]);

  const emp = employees.find(e => e.code === selectedEmpCode);
  const salary = Number(emp?.salary || 0);

  // احسب مدة الخدمة
  const duration = emp ? calcServiceDuration(emp.hireDate, lastWorkingDay) : null;

  // المكافأة
  const gratuity = (emp && duration && reason)
    ? calcGratuity(salary, duration.totalYears, reason)
    : 0;

  // بدل الإخطار
  const noticePay = (emp && duration && reason)
    ? calcNoticePay(salary, duration.totalYears, reason)
    : 0;

  // رصيد الإجازات (أيام × اليومي)
  const dailyRate = salary / 26;
  const hourlyRate = dailyRate / 8;
  const leaveValue = Math.round(unusedLeaveDays * dailyRate);

  // راتب الأيام المتبقية من الشهر
  const pendingSalaryValue = Math.round(pendingSalaryDays * dailyRate);

  // السلف المستحقة على الموظف
  const pendingLoans = loans
    .filter(l => l.employeeCode === selectedEmpCode)
    .reduce((s, l) => s + Number(l.amount || 0), 0);

  // التأخيرات
  const delayMins = delays.filter(d => d.employeeCode === selectedEmpCode).reduce((s,d)=>s+Number(d.delayMinutes||0),0);
  const delayDed = Math.round((hourlyRate / 60) * delayMins);

  // إجماليات إضافية
  const totalExtraAdd = extraAdditions.reduce((s,i)=>s+Number(i.amount||0),0);
  const totalExtraDed = extraDeductions.reduce((s,i)=>s+Number(i.amount||0),0);

  // الإجمالي
  const totalAdditions = gratuity + noticePay + leaveValue + pendingSalaryValue + totalExtraAdd;
  const totalDeductions = pendingLoans + delayDed + totalExtraDed + custody;
  const netAmount = totalAdditions - totalDeductions;

  const addExtraRow = (type) => {
    if (type === 'add') setExtraAdditions(p => [...p, { label: '', amount: 0 }]);
    else setExtraDeductions(p => [...p, { label: '', amount: 0 }]);
  };
  const removeExtraRow = (type, idx) => {
    if (type === 'add') setExtraAdditions(p => p.filter((_,i)=>i!==idx));
    else setExtraDeductions(p => p.filter((_,i)=>i!==idx));
  };

  const handleSave = () => {
    if (!emp || !reason || !lastWorkingDay || !duration) return;
    const record = {
      id: Date.now(),
      empCode: selectedEmpCode,
      empName: emp.name,
      department: emp.department,
      reason,
      reasonLabel: SEPARATION_REASONS.find(r=>r.id===reason)?.label,
      hireDate: emp.hireDate,
      lastDay: lastWorkingDay,
      duration,
      salary,
      gratuity, noticePay, leaveValue, pendingSalaryValue,
      totalAdditions, totalDeductions, netAmount,
      date: new Date().toLocaleDateString('ar-EG'),
    };
    setSavedRecords(p => [record, ...p]);
    setShowResult(true);
  };

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open('', '_blank', 'width=900,height=700');
    win.document.write(`
      <html dir="rtl">
        <head><title>شهادة تصفية</title><meta charset="utf-8">
        <style>
          * { box-sizing: border-box; margin:0; padding:0; font-family: Arial, sans-serif; direction: rtl; }
          body { padding: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 7px 12px; }
          th { background: #1e3a5f; color: white; }
          @media print { @page { margin: 10mm; size: A4; } }
        </style></head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    setTimeout(() => { win.print(); }, 500);
  };

  const today = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  const reasonObj = SEPARATION_REASONS.find(r => r.id === reason);

  // نسبة الاستحقاق للعرض
  const getRatioLabel = (reason, years) => {
    if (reason !== 'resigned') return '100%';
    if (years < 5)  return '0% (أقل من 5 سنوات)';
    if (years < 10) return '33.3% (استقالة 5-10 سنوات)';
    if (years < 15) return '66.7% (استقالة 10-15 سنة)';
    return '100%';
  };

  return (
    <div className="p-6 space-y-5 fade-in" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🏁 التصفية — مستحقات نهاية الخدمة</h1>
          <p className="text-gray-500 text-sm">حساب وفق قانون العمل المصري رقم 12 لسنة 2003</p>
        </div>
        <input
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-56"
          placeholder="اسم الشركة..."
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* ===== يسار: النموذج ===== */}
        <div className="xl:col-span-3 space-y-4">

          {/* الموظف */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center font-bold">1</span>
              بيانات الموظف
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">الموظف *</label>
                <select
                  value={selectedEmpCode}
                  onChange={e => {
                    setSelectedEmpCode(e.target.value);
                    setShowResult(false);
                    // ملء أيام الإجازة من سجلات رصيد الإجازات
                    const empLeave = leaveBalance.filter(l => l.employeeCode === e.target.value);
                    const balance = empLeave.filter(l => l.leaveType === 'رصيد').reduce((s,l)=>s+Number(l.value||0),0);
                    const used = empLeave.filter(l => ['غياب باذن','بدون اذن','إجازة سنوية'].includes(l.leaveType)).reduce((s,l)=>s+Number(l.value||0),0);
                    setUnusedLeaveDays(Math.max(0, balance - used));
                  }}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">— اختر الموظف —</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.code}>{e.name} — {e.department} ({e.type})</option>
                  ))}
                </select>
              </div>

              {emp && (
                <>
                  {[
                    ['كود الموظف', emp.code],
                    ['القسم', emp.department],
                    ['المسمى الوظيفي', emp.jobTitle || '—'],
                    ['نوع العمالة', emp.type],
                    ['الراتب الأساسي', `${Number(emp.salary).toLocaleString('ar-EG')} جنيه`],
                    ['أجر اليوم', `${dailyRate.toFixed(2)} جنيه`],
                    ['أجر الساعة', `${hourlyRate.toFixed(2)} جنيه`],
                    ['تاريخ التعيين', emp.hireDate],
                    ['رقم الهوية', emp.nationalId],
                  ].map(([label, val]) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-3">
                      <div className="text-xs text-gray-400 mb-0.5">{label}</div>
                      <div className="font-semibold text-gray-800 text-sm">{val}</div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* سبب الإنهاء وآخر يوم */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center font-bold">2</span>
              بيانات الإنهاء
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">سبب إنهاء الخدمة *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {SEPARATION_REASONS.map(r => (
                    <button
                      key={r.id}
                      onClick={() => { setReason(r.id); setShowResult(false); }}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm text-right transition-all ${
                        reason === r.id
                          ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <span>{r.icon}</span>
                      <span className="text-xs">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">آخر يوم عمل *</label>
                  <input
                    type="date"
                    value={lastWorkingDay}
                    onChange={e => { setLastWorkingDay(e.target.value); setShowResult(false); }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                {/* مدة الخدمة */}
                {duration && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex flex-col justify-center">
                    <div className="text-xs text-blue-500 mb-1">مدة الخدمة</div>
                    <div className="font-bold text-blue-800">
                      {duration.years > 0 && `${duration.years} سنة `}
                      {duration.months > 0 && `${duration.months} شهر `}
                      {duration.days > 0 && `${duration.days} يوم`}
                    </div>
                    <div className="text-xs text-blue-400 mt-0.5">{duration.totalYears.toFixed(2)} سنة إجمالاً</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* تفاصيل المستحقات */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center font-bold">3</span>
              تفاصيل المستحقات والخصومات
            </h2>

            {/* إضافات ثابتة */}
            <div className="mb-4">
              <div className="text-xs font-semibold text-green-700 mb-2 flex items-center gap-1">✅ الإضافات</div>
              <div className="space-y-2">
                {[
                  {
                    label: 'مكافأة نهاية الخدمة',
                    value: gratuity,
                    sub: duration && reason
                      ? `نسبة الاستحقاق: ${getRatioLabel(reason, duration.totalYears)}`
                      : 'حدد الموظف والسبب',
                    editable: false,
                  },
                  {
                    label: 'بدل الإخطار (فترة الإشعار)',
                    value: noticePay,
                    sub: duration && reason
                      ? `${duration.totalYears >= 10 ? 'شهران' : 'شهر واحد'} ${reason === 'contract_end' ? '(غير مستحق لعقد محدد المدة)' : ''}`
                      : 'حدد الموظف والسبب',
                    editable: false,
                  },
                ].map(({ label, value, sub }) => (
                  <div key={label} className="flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-4 py-2.5">
                    <div>
                      <div className="text-sm font-medium text-gray-700">{label}</div>
                      <div className="text-xs text-gray-400">{sub}</div>
                    </div>
                    <div className="font-bold text-green-700 text-base">{value.toLocaleString('ar-EG')} ج</div>
                  </div>
                ))}

                {/* رصيد الإجازات */}
                <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-4 py-2.5">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700">رصيد الإجازات غير المستخدم</div>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number" min="0" max="365"
                        value={unusedLeaveDays}
                        onChange={e => { setUnusedLeaveDays(Number(e.target.value)); setShowResult(false); }}
                        className="w-20 border border-green-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-green-400"
                      />
                      <span className="text-xs text-gray-500">يوم × {dailyRate.toFixed(1)} ج/يوم</span>
                    </div>
                  </div>
                  <div className="font-bold text-green-700 text-base">{leaveValue.toLocaleString('ar-EG')} ج</div>
                </div>

                {/* راتب الأيام المتبقية */}
                <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-4 py-2.5">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700">راتب الأيام المتبقية من الشهر</div>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number" min="0" max="31"
                        value={pendingSalaryDays}
                        onChange={e => { setPendingSalaryDays(Number(e.target.value)); setShowResult(false); }}
                        className="w-20 border border-green-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-green-400"
                      />
                      <span className="text-xs text-gray-500">يوم × {dailyRate.toFixed(1)} ج/يوم</span>
                    </div>
                  </div>
                  <div className="font-bold text-green-700 text-base">{pendingSalaryValue.toLocaleString('ar-EG')} ج</div>
                </div>

                {/* إضافات إضافية */}
                {extraAdditions.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                    <input
                      type="text" placeholder="وصف الإضافة..."
                      value={item.label}
                      onChange={e => setExtraAdditions(p => p.map((x,i) => i===idx ? {...x,label:e.target.value} : x))}
                      className="flex-1 border border-green-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
                    />
                    <input
                      type="number" min="0" placeholder="المبلغ"
                      value={item.amount || ''}
                      onChange={e => { setExtraAdditions(p => p.map((x,i)=>i===idx?{...x,amount:Number(e.target.value)}:x)); setShowResult(false); }}
                      className="w-28 border border-green-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-1 focus:ring-green-400"
                    />
                    <span className="text-xs text-gray-400">ج</span>
                    <button onClick={() => removeExtraRow('add', idx)} className="text-red-400 hover:text-red-600 p-1 rounded">×</button>
                  </div>
                ))}
                <button onClick={() => addExtraRow('add')} className="w-full py-2 border border-dashed border-green-300 text-green-600 rounded-xl text-sm hover:bg-green-50 transition">
                  + إضافة بند إضافي
                </button>
              </div>
            </div>

            {/* خصومات */}
            <div>
              <div className="text-xs font-semibold text-red-600 mb-2 flex items-center gap-1">❌ الخصومات</div>
              <div className="space-y-2">
                {/* سلف */}
                <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                  <div>
                    <div className="text-sm font-medium text-gray-700">السلف المستحقة</div>
                    <div className="text-xs text-gray-400">من سجلات السلف</div>
                  </div>
                  <div className="font-bold text-red-600 text-base">({pendingLoans.toLocaleString('ar-EG')} ج)</div>
                </div>

                {/* العهدة */}
                <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700">العهدة المستردة / خصم عهدة</div>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number" min="0"
                        value={custody}
                        onChange={e => { setCustody(Number(e.target.value)); setShowResult(false); }}
                        className="w-24 border border-red-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-red-300"
                        placeholder="مبلغ العهدة"
                      />
                      <span className="text-xs text-gray-500">ج</span>
                    </div>
                  </div>
                  <div className="font-bold text-red-600 text-base">({custody.toLocaleString('ar-EG')} ج)</div>
                </div>

                {/* تأخيرات */}
                {delayDed > 0 && (
                  <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                    <div>
                      <div className="text-sm font-medium text-gray-700">خصم التأخيرات</div>
                      <div className="text-xs text-gray-400">{delayMins} دقيقة × أجر الدقيقة</div>
                    </div>
                    <div className="font-bold text-red-600 text-base">({delayDed.toLocaleString('ar-EG')} ج)</div>
                  </div>
                )}

                {/* خصومات إضافية */}
                {extraDeductions.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                    <input
                      type="text" placeholder="وصف الخصم..."
                      value={item.label}
                      onChange={e => setExtraDeductions(p => p.map((x,i)=>i===idx?{...x,label:e.target.value}:x))}
                      className="flex-1 border border-red-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-red-300"
                    />
                    <input
                      type="number" min="0" placeholder="المبلغ"
                      value={item.amount || ''}
                      onChange={e => { setExtraDeductions(p => p.map((x,i)=>i===idx?{...x,amount:Number(e.target.value)}:x)); setShowResult(false); }}
                      className="w-28 border border-red-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-1 focus:ring-red-300"
                    />
                    <span className="text-xs text-gray-400">ج</span>
                    <button onClick={() => removeExtraRow('ded', idx)} className="text-red-400 hover:text-red-600 p-1 rounded">×</button>
                  </div>
                ))}
                <button onClick={() => addExtraRow('ded')} className="w-full py-2 border border-dashed border-red-300 text-red-500 rounded-xl text-sm hover:bg-red-50 transition">
                  + إضافة بند خصم
                </button>
              </div>
            </div>
          </div>

          {/* زر الحساب */}
          <button
            onClick={handleSave}
            disabled={!emp || !reason || !lastWorkingDay || !duration}
            className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-40 text-white rounded-2xl font-bold text-base shadow-lg transition flex items-center justify-center gap-3"
          >
            🧮 احسب مستحقات نهاية الخدمة
          </button>
        </div>

        {/* ===== يمين: النتيجة ===== */}
        <div className="xl:col-span-2 space-y-4">

          {/* ملخص الحساب */}
          <div className={`bg-white rounded-2xl shadow-sm border p-5 transition-all ${showResult ? 'border-blue-200' : 'border-gray-100'}`}>
            <h2 className="font-bold text-gray-700 mb-4">📊 ملخص المستحقات</h2>

            {!showResult ? (
              <div className="text-center py-10 text-gray-400">
                <div className="text-4xl mb-3">🧮</div>
                <div className="text-sm">أكمل البيانات واضغط "احسب"</div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* الإضافات */}
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-green-700 mb-1">الإضافات</div>
                  {[
                    { label: 'مكافأة نهاية الخدمة', value: gratuity },
                    { label: 'بدل الإخطار', value: noticePay },
                    { label: 'رصيد الإجازات', value: leaveValue },
                    { label: 'راتب الأيام المتبقية', value: pendingSalaryValue },
                    ...extraAdditions.filter(i=>i.amount>0).map(i=>({label:i.label||'إضافة',value:i.amount})),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-gray-600">{label}</span>
                      <span className="font-medium text-green-700">{value.toLocaleString('ar-EG')} ج</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-sm border-t border-gray-100 pt-1 mt-1">
                    <span className="text-gray-700">إجمالي الإضافات</span>
                    <span className="text-green-700">{totalAdditions.toLocaleString('ar-EG')} ج</span>
                  </div>
                </div>

                {/* الخصومات */}
                {totalDeductions > 0 && (
                  <div className="space-y-1.5 border-t border-gray-100 pt-3">
                    <div className="text-xs font-bold text-red-600 mb-1">الخصومات</div>
                    {[
                      pendingLoans > 0 && { label: 'السلف المستحقة', value: pendingLoans },
                      delayDed > 0 && { label: 'خصم التأخيرات', value: delayDed },
                      ...extraDeductions.filter(i=>i.amount>0).map(i=>({label:i.label||'خصم',value:i.amount})),
                    ].filter(Boolean).map(({ label, value }) => (
                      <div key={label} className="flex justify-between text-sm">
                        <span className="text-gray-600">{label}</span>
                        <span className="font-medium text-red-600">({value.toLocaleString('ar-EG')} ج)</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold text-sm border-t border-gray-100 pt-1 mt-1">
                      <span className="text-gray-700">إجمالي الخصومات</span>
                      <span className="text-red-600">({totalDeductions.toLocaleString('ar-EG')} ج)</span>
                    </div>
                  </div>
                )}

                {/* الصافي */}
                <div className={`rounded-2xl p-4 text-center ${netAmount >= 0 ? 'bg-green-600' : 'bg-red-600'}`}>
                  <div className="text-white text-sm mb-1">الصافي المستحق للصرف</div>
                  <div className="text-white text-3xl font-black">{netAmount.toLocaleString('ar-EG')} ج</div>
                  <div className="text-white/80 text-xs mt-1">{numberToArabicWords(Math.abs(netAmount))} فقط لا غير</div>
                </div>

                <button
                  onClick={handlePrint}
                  className="w-full py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-medium transition flex items-center justify-center gap-2"
                >
                  🖨️ طباعة شهادة التصفية
                </button>
              </div>
            )}
          </div>

          {/* مرجع قانوني */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <h3 className="font-bold text-amber-800 mb-3 text-sm flex items-center gap-2">
              ⚖️ قانون العمل المصري — المرجع
            </h3>
            <div className="space-y-2 text-xs text-amber-700">
              <div className="bg-white rounded-lg p-2.5">
                <div className="font-bold mb-1">مكافأة نهاية الخدمة</div>
                <div>• أول 5 سنوات: نصف شهر / سنة</div>
                <div>• بعد 5 سنوات: شهر كامل / سنة</div>
              </div>
              <div className="bg-white rounded-lg p-2.5">
                <div className="font-bold mb-1">نسبة الاستقالة</div>
                <div>• أقل من 5 سنوات: لا يستحق</div>
                <div>• 5-10 سنوات: الثلث</div>
                <div>• 10-15 سنة: الثلثان</div>
                <div>• 15 سنة فأكثر: كاملة</div>
              </div>
              <div className="bg-white rounded-lg p-2.5">
                <div className="font-bold mb-1">بدل الإخطار</div>
                <div>• أقل من 10 سنوات: شهر</div>
                <div>• 10 سنوات فأكثر: شهران</div>
              </div>
            </div>
          </div>

          {/* سجل التصفيات */}
          {savedRecords.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-bold text-gray-700 mb-3 text-sm">📋 سجل التصفيات</h3>
              <div className="space-y-2">
                {savedRecords.map(rec => (
                  <div key={rec.id} className="bg-gray-50 rounded-xl p-3 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-gray-800">{rec.empName}</div>
                        <div className="text-gray-500">{rec.department} • {rec.reasonLabel}</div>
                        <div className="text-gray-400">{rec.hireDate} ← {rec.lastDay}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-700">{rec.netAmount.toLocaleString('ar-EG')} ج</div>
                        <div className="text-gray-400">{rec.date}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== نموذج الطباعة (مخفي) ===== */}
      <div className="hidden">
        <div ref={printRef}>
          {showResult && emp && duration && (
            <div style={{ fontFamily: 'Arial', direction: 'rtl', padding: '20px', maxWidth: '750px', margin: '0 auto' }}>
              {/* Header */}
              <div style={{ borderBottom: '3px double #1e3a5f', paddingBottom: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#1e3a5f' }}>{companyName}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>إدارة الموارد البشرية</div>
                </div>
                <div style={{ textAlign: 'left', fontSize: '11px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e3a5f' }}>شهادة تصفية نهاية خدمة</div>
                  <div>التاريخ: {today}</div>
                </div>
              </div>
              {/* Employee */}
              <div style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '12px', marginBottom: '14px', backgroundColor: '#f8fafc' }}>
                <div style={{ fontWeight: 'bold', color: '#1e3a5f', marginBottom: '10px', borderBottom: '1px solid #ddd', paddingBottom: '6px' }}>بيانات الموظف</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                  {[['الاسم',emp.name],['كود',emp.code],['القسم',emp.department],['الراتب',`${salary.toLocaleString()} ج`],['تاريخ التعيين',emp.hireDate],['آخر يوم',lastWorkingDay],['مدة الخدمة',`${duration.years} سنة ${duration.months} شهر ${duration.days} يوم`],['سبب الإنهاء',reasonObj?.label]].map(([l,v])=>(
                    <div key={l} style={{ display:'flex',gap:'6px' }}>
                      <span style={{ color:'#666',minWidth:'100px' }}>{l}:</span>
                      <span style={{ fontWeight:'bold' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Table */}
              <table style={{ width:'100%', borderCollapse:'collapse', marginBottom:'14px', fontSize:'13px' }}>
                <thead>
                  <tr style={{ backgroundColor:'#1e3a5f', color:'white' }}>
                    <th style={{ padding:'8px 12px', textAlign:'right', border:'1px solid #1e3a5f' }}>البيان</th>
                    <th style={{ padding:'8px 12px', textAlign:'center', border:'1px solid #1e3a5f', width:'130px' }}>المبلغ (ج)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { l:'مكافأة نهاية الخدمة', v:gratuity, add:true },
                    { l:'بدل الإخطار', v:noticePay, add:true },
                    { l:`رصيد الإجازات (${unusedLeaveDays} يوم)`, v:leaveValue, add:true },
                    { l:`راتب الأيام المتبقية (${pendingSalaryDays} يوم)`, v:pendingSalaryValue, add:true },
                    ...extraAdditions.filter(i=>i.amount>0).map(i=>({l:i.label||'إضافة',v:i.amount,add:true})),
                    { l:'إجمالي الإضافات', v:totalAdditions, bold:true, bg:'#f0fdf4' },
                    ...(pendingLoans>0?[{ l:'السلف المستحقة', v:-pendingLoans, add:false }]:[]),
                    ...(delayDed>0?[{ l:`خصم التأخيرات (${delayMins} د)`, v:-delayDed, add:false }]:[]),
                    ...extraDeductions.filter(i=>i.amount>0).map(i=>({l:i.label||'خصم',v:-i.amount,add:false})),
                    ...(totalDeductions>0?[{ l:'إجمالي الخصومات', v:-totalDeductions, bold:true, bg:'#fff1f2' }]:[]),
                    { l:'الصافي المستحق للصرف', v:netAmount, bold:true, bg:'#eff6ff', big:true },
                  ].map((row,i) => (
                    <tr key={i} style={{ backgroundColor: row.bg || (i%2?'#f9fafb':'#fff') }}>
                      <td style={{ padding:'6px 12px', border:'1px solid #e5e7eb', fontWeight:row.bold?'bold':'normal' }}>{row.l}</td>
                      <td style={{ padding:'6px 12px', border:'1px solid #e5e7eb', textAlign:'center', fontWeight:row.bold?'bold':'normal', fontSize:row.big?'16px':'13px', color: row.v<0?'#dc2626':row.v===netAmount&&netAmount>0?'#166534':'#111' }}>
                        {row.v<0?`(${Math.abs(row.v).toLocaleString()})`:`${row.v.toLocaleString()}`} ج
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* In words */}
              <div style={{ border:'2px solid #1e3a5f', borderRadius:'6px', padding:'10px 14px', marginBottom:'14px', backgroundColor:'#f0f7ff' }}>
                <span style={{ fontWeight:'bold', color:'#1e3a5f' }}>المبلغ بالكتابة: </span>
                <span style={{ fontSize:'14px', fontWeight:'bold' }}>{numberToArabicWords(Math.abs(netAmount))} فقط لا غير</span>
              </div>
              {/* Signatures */}
              <div style={{ border:'1px solid #ddd', borderRadius:'6px', padding:'16px' }}>
                <div style={{ fontWeight:'bold', color:'#1e3a5f', marginBottom:'24px', fontSize:'12px' }}>التوقيعات:</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:'12px', textAlign:'center', fontSize:'11px' }}>
                  {['المدير العام','مدير HR','المحاسب','الموظف (استلمت المستحقات)'].map(sig=>(
                    <div key={sig}>
                      <div style={{ color:'#666', marginBottom:'28px' }}>{sig}</div>
                      <div style={{ borderTop:'1px solid #999', paddingTop:'3px', color:'#aaa' }}>التوقيع / الختم</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Footer */}
              <div style={{ borderTop:'1px dashed #ccc', marginTop:'12px', paddingTop:'8px', display:'flex', justifyContent:'space-between', fontSize:'10px', color:'#999' }}>
                <span>وفق قانون العمل المصري رقم 12 لسنة 2003</span>
                <span>طُبع بتاريخ: {today}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Clearance;
