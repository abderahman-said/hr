import React, { useState, useRef, useMemo } from 'react';

// ===================================================
// صفحة فرق القبض والتسويات النقدية
// تقارن بين صافي المستحق من مسير الرواتب وبين المنصرف فعلياً
// ===================================================

const SalaryDifferences = ({
  employees = [],
  loans = [],
  deductions = [],
  incentives = [],
  delays = [],
  overtime = [],
  transportation = [],
  fixedIncentives = [],
  absences = [],
  salaryDifferences: diffsProp = [],
  setSalaryDifferences: setDiffsProp,
}) => {
  const [localDiffs, setLocalDiffs] = useState(null);
  const data = localDiffs ?? diffsProp;
  const setData = (fn) => {
    const next = typeof fn === 'function' ? fn(data) : fn;
    if (setDiffsProp) setDiffsProp(next);
    setLocalDiffs(next);
  };

  const [selectedMonth, setSelectedMonth] = useState('سبتمبر 2026');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const printReportRef = useRef();

  // حساب صافي الراتب المستحق لكل موظف
  const calcEmployeeNet = (emp) => {
    const code = emp.code;
    const salary = Number(emp.salary || 0);
    const hourlyRate = salary / 26 / 8;
    const minuteRate = hourlyRate / 60;

    const empInc = incentives.filter(i => i.employeeCode === code).reduce((s, i) => s + (Number(i.total) || 0), 0);
    const empFixedInc = fixedIncentives.filter(f => f.employeeCode === code).reduce((s, f) => s + Math.round(hourlyRate * Number(f.incentiveHours || 0)), 0);
    const empOvt = overtime.filter(o => o.employeeCode === code).reduce((s, o) => s + Math.round(hourlyRate * Number(o.overtimeHours || 0)), 0);
    const empTrans = transportation.filter(t => t.employeeCode === code).reduce((s, t) => s + Number(t.attendanceDays || 0) * Number(t.allowancePerDay || 0), 0);

    const empLoans = loans.filter(l => l.employeeCode === code).reduce((s, l) => s + Number(l.amount || 0), 0);
    const empDed = deductions.filter(d => d.employeeCode === code).reduce((s, d) => s + Number(d.amount || 0), 0);

    const totalDelayMins = delays.filter(d => d.employeeCode === code).reduce((s, d) => s + Number(d.delayMinutes || 0), 0);
    const empDelayDed = Math.round(minuteRate * totalDelayMins);

    const unauth = absences.filter(a => a.employeeCode === code && a.type === 'بدون اذن').length;
    const auth = absences.filter(a => a.employeeCode === code && a.type === 'غياب باذن').length;
    const empAbsDed = Math.round((salary / 26) * (unauth + auth));

    const gross = salary + empInc + empFixedInc + empOvt + empTrans;
    const totalDed = empLoans + empDed + empDelayDed + empAbsDed;
    return Math.max(0, gross - totalDed);
  };

  // دمج بيانات الموظفين مع الفروق المسجلة
  const consolidatedList = useMemo(() => {
    return employees.map(emp => {
      const net = calcEmployeeNet(emp);
      const existing = data.find(d => d.employeeCode === emp.code && d.month === selectedMonth);
      if (existing) {
        return {
          ...existing,
          dueAmount: net,
          diff: (existing.paidAmount ?? net) - net,
        };
      }
      return {
        id: `temp-${emp.id}`,
        employeeCode: emp.code,
        employeeName: emp.name,
        department: emp.department,
        month: selectedMonth,
        dueAmount: net,
        paidAmount: net,
        diff: 0,
        reason: '',
        action: 'متطابق',
        isDefault: true,
      };
    });
  }, [employees, data, selectedMonth, incentives, fixedIncentives, overtime, transportation, loans, deductions, delays, absences]);

  const [form, setForm] = useState({
    employeeCode: '',
    employeeName: '',
    department: '',
    month: selectedMonth,
    dueAmount: 0,
    paidAmount: 0,
    reason: '',
    action: 'تمت التسوية',
  });

  const handleEdit = (item) => {
    setEditingItem(item);
    setForm({
      employeeCode: item.employeeCode,
      employeeName: item.employeeName,
      department: item.department,
      month: item.month || selectedMonth,
      dueAmount: item.dueAmount,
      paidAmount: item.paidAmount,
      reason: item.reason || '',
      action: item.action === 'متطابق' ? 'تمت التسوية' : (item.action || 'تمت التسوية'),
    });
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const paid = Number(form.paidAmount);
    const due = Number(form.dueAmount);
    const diff = paid - due;

    const newRecord = {
      ...form,
      id: editingItem && !String(editingItem.id).startsWith('temp') ? editingItem.id : Date.now(),
      paidAmount: paid,
      dueAmount: due,
      diff,
      action: diff === 0 ? 'متطابق' : form.action,
    };

    setData(prev => {
      const exists = prev.some(d => d.employeeCode === newRecord.employeeCode && d.month === newRecord.month);
      if (exists) {
        return prev.map(d => (d.employeeCode === newRecord.employeeCode && d.month === newRecord.month) ? newRecord : d);
      }
      return [newRecord, ...prev];
    });

    setShowModal(false);
    setEditingItem(null);
  };

  const handleAutoReconcile = () => {
    if (window.confirm('هل تريد مطابقة جميع الرواتب بالمنصرف تلقائياً؟')) {
      const updated = employees.map(emp => {
        const net = calcEmployeeNet(emp);
        return {
          id: Date.now() + emp.id,
          employeeCode: emp.code,
          employeeName: emp.name,
          department: emp.department,
          month: selectedMonth,
          dueAmount: net,
          paidAmount: net,
          diff: 0,
          reason: 'مطابقة تامة للمسير',
          action: 'متطابق',
        };
      });
      setData(updated);
    }
  };

  const filtered = consolidatedList.filter(item => {
    const matchSearch = item.employeeName.includes(search) || item.employeeCode.includes(search);
    let matchStatus = true;
    if (filterStatus === 'diff_only') matchStatus = item.diff !== 0;
    else if (filterStatus === 'matched') matchStatus = item.diff === 0;
    else if (filterStatus === 'shortage') matchStatus = item.diff < 0;
    else if (filterStatus === 'surplus') matchStatus = item.diff > 0;
    return matchSearch && matchStatus;
  });

  const totalDue = consolidatedList.reduce((s, r) => s + (r.dueAmount || 0), 0);
  const totalPaid = consolidatedList.reduce((s, r) => s + (r.paidAmount || 0), 0);
  const netDifference = totalPaid - totalDue;
  const discrepanciesCount = consolidatedList.filter(r => r.diff !== 0).length;

  const handlePrint = () => {
    const content = printReportRef.current?.innerHTML;
    if (!content) return;
    const win = window.open('', '_blank', 'width=900,height=650');
    win.document.write(`
      <html dir="rtl">
        <head>
          <title>كشف فروق وتسويات القبض - ${selectedMonth}</title>
          <meta charset="utf-8">
          <style>
            * { box-sizing: border-box; margin:0; padding:0; font-family: 'Segoe UI', Tahoma, Arial, sans-serif; direction: rtl; }
            body { padding: 30px; background: #fff; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 13px; }
            th, td { border: 1px solid #ddd; padding: 8px 10px; text-align: right; }
            th { background: #f1f5f9; color: #1e293b; font-weight: bold; }
            @media print { @page { size: A4 landscape; margin: 10mm; } }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    setTimeout(() => { win.print(); }, 500);
  };

  return (
    <div className="p-6 space-y-5 fade-in" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">⚖️ فرق القبض والتسويات النقدية</h1>
          <p className="text-gray-500 text-sm">مطابقة مسير الرواتب المستحق مع المبالغ المنصرفة فعلياً من الخزينة</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 font-semibold"
          >
            <option>سبتمبر 2026</option>
            <option>أغسطس 2026</option>
            <option>يوليو 2026</option>
          </select>
          <button
            onClick={handleAutoReconcile}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition"
            title="تعيين المنصرف مطابقاً للمستحق افتراضياً"
          >
            ⚡ تسوية تلقائية
          </button>
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 shadow-sm"
          >
            🖨️ طباعة التقرير
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="text-blue-600 text-xs font-semibold mb-1">إجمالي المستحق بالمسير</div>
          <div className="text-2xl font-bold text-blue-900">{totalDue.toLocaleString('ar-EG')} ج</div>
          <div className="text-xs text-blue-500 mt-1">صافي رواتب {employees.length} موظف</div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <div className="text-emerald-600 text-xs font-semibold mb-1">إجمالي المنصرف فعلياً</div>
          <div className="text-2xl font-bold text-emerald-900">{totalPaid.toLocaleString('ar-EG')} ج</div>
          <div className="text-xs text-emerald-500 mt-1">الخزينة والتحويلات</div>
        </div>
        <div className={`border rounded-2xl p-4 ${netDifference === 0 ? 'bg-gray-50 border-gray-200' : netDifference < 0 ? 'bg-red-50 border-red-200' : 'bg-purple-50 border-purple-200'}`}>
          <div className={`text-xs font-semibold mb-1 ${netDifference === 0 ? 'text-gray-600' : netDifference < 0 ? 'text-red-600' : 'text-purple-600'}`}>
            صافي الفروق الإجمالية
          </div>
          <div className={`text-2xl font-bold ${netDifference === 0 ? 'text-gray-800' : netDifference < 0 ? 'text-red-700' : 'text-purple-700'}`}>
            {netDifference > 0 ? `+${netDifference.toLocaleString('ar-EG')}` : `${netDifference.toLocaleString('ar-EG')}`} ج
          </div>
          <div className="text-xs mt-1 text-gray-500">
            {netDifference === 0 ? 'متطابق تماماً' : netDifference < 0 ? 'متبقي عجز صرف' : 'زيادة منصرفة'}
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="text-amber-600 text-xs font-semibold mb-1">حالات بها فروقات</div>
          <div className="text-2xl font-bold text-amber-900">{discrepanciesCount} حالة</div>
          <div className="text-xs text-amber-600 mt-1">بحاجة إلى ترحيل أو تسوية</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="🔍 بحث باسم الموظف أو الكود..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm flex-1 min-w-56 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="">جميع الحالات</option>
          <option value="diff_only">حالات بها فروق فقط</option>
          <option value="matched">حالات متطابقة</option>
          <option value="shortage">عجز في الصرف (-)</option>
          <option value="surplus">زيادة في الصرف (+)</option>
        </select>
        <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-xl">
          {filtered.length} موظف
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-right font-semibold text-gray-600">الكود</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">الموظف</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">القسم</th>
                <th className="px-4 py-3 text-right font-semibold text-blue-700 bg-blue-50/50">المستحق بالمسير</th>
                <th className="px-4 py-3 text-right font-semibold text-emerald-700 bg-emerald-50/50">المنصرف فعلياً</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">فرق القبض</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">سبب الفرق</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">إجراء التسوية</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">تعديل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/80 transition">
                  <td className="px-4 py-3 font-mono text-blue-700 font-bold text-xs">{item.employeeCode}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{item.employeeName}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{item.department}</td>
                  <td className="px-4 py-3 font-bold text-blue-800 bg-blue-50/30">
                    {Number(item.dueAmount).toLocaleString('ar-EG')} ج
                  </td>
                  <td className="px-4 py-3 font-bold text-emerald-800 bg-emerald-50/30">
                    {Number(item.paidAmount).toLocaleString('ar-EG')} ج
                  </td>
                  <td className="px-4 py-3 font-bold whitespace-nowrap">
                    {item.diff === 0 ? (
                      <span className="text-gray-400 font-normal">0 (متطابق)</span>
                    ) : item.diff < 0 ? (
                      <span className="text-red-600">
                        {item.diff.toLocaleString('ar-EG')} ج (عجز)
                      </span>
                    ) : (
                      <span className="text-purple-600">
                        +{item.diff.toLocaleString('ar-EG')} ج (زيادة)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 max-w-xs truncate" title={item.reason}>
                    {item.reason || '—'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      item.action === 'متطابق'
                        ? 'bg-gray-100 text-gray-600'
                        : item.action === 'تمت التسوية'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.action || 'قيد المراجعة'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-700 text-xs font-medium rounded-lg transition"
                    >
                      تسوية ✏️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 border-t-2 border-gray-200 font-bold text-sm">
                <td colSpan="3" className="px-4 py-3 text-gray-800">الإجمالي الكلي</td>
                <td className="px-4 py-3 text-blue-900">{totalDue.toLocaleString('ar-EG')} ج</td>
                <td className="px-4 py-3 text-emerald-900">{totalPaid.toLocaleString('ar-EG')} ج</td>
                <td className="px-4 py-3">
                  <span className={netDifference < 0 ? 'text-red-600' : netDifference > 0 ? 'text-purple-600' : 'text-gray-700'}>
                    {netDifference > 0 ? `+${netDifference.toLocaleString('ar-EG')}` : `${netDifference.toLocaleString('ar-EG')}`} ج
                  </span>
                </td>
                <td colSpan="3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Modal Edit / Reconcile */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-scaleIn">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">
                تسوية فرق قبض: {form.employeeName}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">كود الموظف:</span>
                  <span className="font-bold text-gray-800">{form.employeeCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">القسم:</span>
                  <span className="font-bold text-gray-800">{form.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">الشهر:</span>
                  <span className="font-bold text-gray-800">{form.month}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-blue-700 mb-1">المستحق بالمسير</label>
                  <input
                    type="number"
                    value={form.dueAmount}
                    readOnly
                    className="w-full border border-blue-200 bg-blue-50/50 rounded-xl px-3 py-2 text-sm font-bold text-blue-900 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-emerald-700 mb-1">المنصرف فعلياً *</label>
                  <input
                    type="number"
                    value={form.paidAmount}
                    onChange={e => setForm(prev => ({ ...prev, paidAmount: e.target.value }))}
                    required
                    className="w-full border border-emerald-300 rounded-xl px-3 py-2 text-sm font-bold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  />
                </div>
              </div>

              {/* Diff Preview */}
              <div className="p-3 rounded-xl border text-center font-bold text-sm bg-gray-50 border-gray-200">
                فرق القبض: {(Number(form.paidAmount) - Number(form.dueAmount)).toLocaleString('ar-EG')} ج
                <span className="text-xs font-normal text-gray-500 mr-1">
                  {Number(form.paidAmount) === Number(form.dueAmount) ? '(متطابق)' : Number(form.paidAmount) < Number(form.dueAmount) ? '(عجز صرف)' : '(زيادة منصرفة)'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">سبب الفرق أو الملاحظات</label>
                <input
                  type="text"
                  placeholder="مثال: كسور تقريب، تسوية سلفة بالخزينة، تأجيل جزء..."
                  value={form.reason}
                  onChange={e => setForm(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">إجراء التسوية</label>
                <select
                  value={form.action}
                  onChange={e => setForm(prev => ({ ...prev, action: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="تمت التسوية">تمت التسوية بالخزينة</option>
                  <option value="مرحل للشهر القادم">مرحل للشهر القادم</option>
                  <option value="معلق للمراجعة">معلق للمراجعة</option>
                </select>
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
                  حفظ التسوية
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hidden Printable Report */}
      <div className="hidden">
        <div ref={printReportRef}>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #1e3a5f', paddingBottom: '10px', marginBottom: '15px' }}>
              <div>
                <h2 style={{ fontSize: '18px', color: '#1e3a5f', margin: 0 }}>شركة ـــــــــ للصناعات</h2>
                <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0' }}>الإدارة المالية وشؤون الرواتب والخزينة</p>
              </div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ fontSize: '16px', margin: 0 }}>كشف فروق وتسويات القبض</h3>
                <p style={{ fontSize: '12px', color: '#888', margin: '4px 0 0' }}>الشهر: {selectedMonth}</p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>كود</th>
                  <th>اسم الموظف</th>
                  <th>القسم</th>
                  <th>المستحق بالمسير</th>
                  <th>المنصرف فعلياً</th>
                  <th>فرق القبض</th>
                  <th>السبب</th>
                  <th>الإجراء</th>
                </tr>
              </thead>
              <tbody>
                {consolidatedList.map(item => (
                  <tr key={item.employeeCode}>
                    <td>{item.employeeCode}</td>
                    <td>{item.employeeName}</td>
                    <td>{item.department}</td>
                    <td>{item.dueAmount.toLocaleString('ar-EG')} ج</td>
                    <td>{item.paidAmount.toLocaleString('ar-EG')} ج</td>
                    <td style={{ fontWeight: 'bold', color: item.diff < 0 ? '#dc2626' : item.diff > 0 ? '#7c3aed' : '#555' }}>
                      {item.diff === 0 ? '0' : `${item.diff.toLocaleString('ar-EG')} ج`}
                    </td>
                    <td>{item.reason || '—'}</td>
                    <td>{item.action || '—'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: '#f8fafc', fontWeight: 'bold' }}>
                  <td colSpan="3">الإجمالي</td>
                  <td>{totalDue.toLocaleString('ar-EG')} ج</td>
                  <td>{totalPaid.toLocaleString('ar-EG')} ج</td>
                  <td>{netDifference.toLocaleString('ar-EG')} ج</td>
                  <td colSpan="2"></td>
                </tr>
              </tfoot>
            </table>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', marginTop: '40px', textAlign: 'center', fontSize: '12px' }}>
              <div>
                <p style={{ marginBottom: '35px', color: '#555' }}>مسؤول المرتبات</p>
                <p style={{ borderTop: '1px dashed #999', paddingTop: '5px' }}>التوقيع: ..........................</p>
              </div>
              <div>
                <p style={{ marginBottom: '35px', color: '#555' }}>أمين الخزينة / الصراف</p>
                <p style={{ borderTop: '1px dashed #999', paddingTop: '5px' }}>التوقيع: ..........................</p>
              </div>
              <div>
                <p style={{ marginBottom: '35px', color: '#555' }}>مدير الشؤون المالية</p>
                <p style={{ borderTop: '1px dashed #999', paddingTop: '5px' }}>التوقيع: ..........................</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryDifferences;
