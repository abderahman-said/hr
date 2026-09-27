import React, { useState, useRef, useCallback } from 'react';
import * as XLSX from 'xlsx';

// ===================================================
// صفحة استيراد ملف البصمة
// يدعم: Excel (.xlsx/.xls) + CSV
// يحسب التأخير تلقائياً ويضيف للسجلات
// ===================================================

// أنواع شيفت عمل مختلفة
const SHIFTS = [
  { id: 'morning', label: 'صباحي', start: '08:00', end: '16:00' },
  { id: 'afternoon', label: 'مسائي', start: '14:00', end: '22:00' },
  { id: 'night', label: 'ليلي', start: '22:00', end: '06:00' },
  { id: 'admin', label: 'إداري', start: '09:00', end: '17:00' },
];

const toMinutes = (timeStr) => {
  if (!timeStr) return null;
  const clean = String(timeStr).trim();
  // HH:MM أو HH:MM:SS
  const parts = clean.split(':').map(Number);
  if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return null;
  return parts[0] * 60 + parts[1];
};

const minsToTime = (mins) => {
  if (mins == null) return '--:--';
  const h = Math.floor(((mins % 1440) + 1440) % 1440 / 60);
  const m = ((mins % 1440) + 1440) % 1440 % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
};

const calcDelayMins = (scheduledStart, actualIn) => {
  const s = toMinutes(scheduledStart);
  const a = toMinutes(actualIn);
  if (s == null || a == null) return 0;
  return Math.max(0, a - s);
};

const formatDate = (raw) => {
  if (!raw) return '';
  // إذا كان Excel serial number
  if (typeof raw === 'number') {
    const date = XLSX.SSF.parse_date_code(raw);
    if (date) {
      return `${date.y}-${String(date.m).padStart(2,'0')}-${String(date.d).padStart(2,'0')}`;
    }
  }
  // إذا كان string
  const s = String(raw).trim();
  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  // DD/MM/YYYY
  const dmy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (dmy) return `${dmy[3]}-${dmy[2].padStart(2,'0')}-${dmy[1].padStart(2,'0')}`;
  return s;
};

const formatTime = (raw) => {
  if (!raw) return '';
  if (typeof raw === 'number') {
    // Excel time fraction: 0.5 = 12:00
    const totalMins = Math.round(raw * 24 * 60);
    return minsToTime(totalMins);
  }
  const s = String(raw).trim();
  // HH:MM or HH:MM:SS
  const m = s.match(/^(\d{1,2}):(\d{2})/);
  if (m) return `${m[1].padStart(2,'0')}:${m[2]}`;
  return s;
};

// محاولة تخمين أسماء الأعمدة تلقائياً
const guessColumns = (headers) => {
  const h = headers.map(x => String(x || '').toLowerCase().replace(/\s/g, ''));
  const find = (...keys) => {
    const idx = h.findIndex(col => keys.some(k => col.includes(k)));
    return idx >= 0 ? headers[idx] : null;
  };
  return {
    fingerprint: find('بصمة', 'كود', 'رقم', 'id', 'empid', 'badgeno', 'userid', 'no'),
    date:        find('تاريخ', 'date', 'يوم', 'day'),
    timeIn:      find('دخول', 'حضور', 'in', 'checkin', 'timein', 'وقت_الحضور', 'أول'),
    timeOut:     find('خروج', 'انصراف', 'out', 'checkout', 'timeout', 'وقت_الانصراف', 'آخر'),
    name:        find('اسم', 'name', 'موظف'),
  };
};

const FingerprintImport = ({ employees = [], delays = [], setDelays }) => {
  const fileRef = useRef();
  const [step, setStep] = useState(1); // 1=رفع, 2=ضبط أعمدة, 3=معاينة, 4=نتيجة
  const [rawData, setRawData]     = useState([]);   // كل الصفوف الخام
  const [headers, setHeaders]     = useState([]);
  const [colMap, setColMap]       = useState({});    // خريطة الأعمدة
  const [shift, setShift]         = useState('morning');
  const [customStart, setCustomStart] = useState('08:00');
  const [useCustomShift, setUseCustomShift] = useState(false);
  const [preview, setPreview]     = useState([]);   // صفوف معالجة
  const [selected, setSelected]   = useState({});   // checkbox
  const [importedCount, setImportedCount] = useState(0);
  const [fileName, setFileName]   = useState('');
  const [dragging, setDragging]   = useState(false);
  const [error, setError]         = useState('');
  const [tolerance, setTolerance] = useState(5);    // دقائق تسامح

  // ========== قراءة الملف ==========
  const processFile = useCallback((file) => {
    setError('');
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let rows = [];
        let hdrs = [];

        if (ext === 'csv' || ext === 'txt') {
          const text = e.target.result;
          const lines = text.split(/\r?\n/).filter(l => l.trim());
          if (lines.length === 0) throw new Error('الملف فارغ');
          // كشف الفاصل تلقائياً
          const sep = lines[0].includes('\t') ? '\t' : lines[0].includes(';') ? ';' : ',';
          hdrs = lines[0].split(sep).map(h => h.trim().replace(/^"|"$/g, ''));
          rows = lines.slice(1).map(l =>
            l.split(sep).map(c => c.trim().replace(/^"|"$/g, ''))
          ).filter(r => r.some(c => c));
          setRawData(rows.map(r => Object.fromEntries(hdrs.map((h, i) => [h, r[i] ?? '']))));
        } else {
          // Excel
          const wb = XLSX.read(e.target.result, { type: 'binary', cellDates: false });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
          if (json.length === 0) throw new Error('الشيت فارغ');
          // إيجاد أول صف فيه بيانات حقيقية كـ header
          let headerRow = 0;
          for (let i = 0; i < Math.min(10, json.length); i++) {
            if (json[i].filter(c => c !== '').length >= 2) { headerRow = i; break; }
          }
          hdrs = json[headerRow].map(h => String(h || '').trim());
          const dataRows = json.slice(headerRow + 1).filter(r => r.some(c => c !== ''));
          setRawData(dataRows.map(r => Object.fromEntries(hdrs.map((h, i) => [h, r[i] ?? '']))));
        }

        setHeaders(hdrs);
        setColMap(guessColumns(hdrs));
        setStep(2);
      } catch (err) {
        setError(`خطأ في قراءة الملف: ${err.message}`);
      }
    };

    if (ext === 'csv' || ext === 'txt') {
      reader.readAsText(file, 'UTF-8');
    } else {
      reader.readAsBinaryString(file);
    }
  }, []);

  const onFileChange = (e) => processFile(e.target.files[0]);
  const onDrop = (e) => {
    e.preventDefault(); setDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  // ========== معالجة البيانات ==========
  const processPreview = () => {
    const scheduledStart = useCustomShift
      ? customStart
      : SHIFTS.find(s => s.id === shift)?.start || '08:00';

    const rows = rawData.map((row, idx) => {
      const fpRaw  = row[colMap.fingerprint] ?? '';
      const dateRaw = row[colMap.date] ?? '';
      const inRaw  = row[colMap.timeIn] ?? '';
      const outRaw = row[colMap.timeOut] ?? '';
      const nameRaw = colMap.name ? (row[colMap.name] ?? '') : '';

      const fp   = String(fpRaw).trim();
      const date = formatDate(dateRaw);
      const timeIn  = formatTime(inRaw);
      const timeOut = formatTime(outRaw);

      // مطابقة الموظف
      const emp = employees.find(e =>
        e.fingerprint === fp || e.code === fp || String(e.fingerprint) === fp
      );

      const delayMins = calcDelayMins(scheduledStart, timeIn);
      const isLate = delayMins > tolerance;

      // التحقق من تسجيل مسبق
      const alreadyExists = delays.some(d =>
        d.employeeCode === (emp?.code || fp) && d.date === date
      );

      return {
        _idx: idx,
        fp,
        date,
        timeIn,
        timeOut,
        nameRaw,
        empName: emp?.name || nameRaw || `بصمة ${fp}`,
        empCode: emp?.code || fp,
        empFound: !!emp,
        salary: Number(emp?.salary || 0),
        scheduledStart,
        delayMins,
        isLate,
        alreadyExists,
        include: isLate && !alreadyExists && !!emp,
      };
    }).filter(r => r.fp && r.date && r.timeIn);

    setPreview(rows);
    const sel = {};
    rows.forEach(r => { sel[r._idx] = r.include; });
    setSelected(sel);
    setStep(3);
  };

  const toggleAll = (val) => {
    const s = {};
    preview.forEach(r => { if (!r.alreadyExists) s[r._idx] = val; });
    setSelected(s);
  };

  // ========== الاستيراد ==========
  const doImport = () => {
    const toImport = preview.filter(r => selected[r._idx]);
    const newRecords = toImport.map(r => ({
      id: Date.now() + r._idx,
      fingerprint: r.fp,
      employeeCode: r.empCode,
      employeeName: r.empName,
      scheduledTime: r.scheduledStart,
      actualTime: r.timeIn,
      date: r.date,
      delayMinutes: r.delayMins,
      _source: 'fingerprint_import',
    }));
    setDelays && setDelays(prev => [...prev, ...newRecords]);
    setImportedCount(newRecords.length);
    setStep(4);
  };

  const reset = () => {
    setStep(1); setRawData([]); setHeaders([]); setColMap({});
    setPreview([]); setSelected({}); setFileName(''); setError('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const lateCount    = preview.filter(r => r.isLate).length;
  const existCount   = preview.filter(r => r.alreadyExists).length;
  const noEmpCount   = preview.filter(r => !r.empFound).length;
  const selectedCount = Object.values(selected).filter(Boolean).length;

  return (
    <div className="p-6 space-y-5 fade-in" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🖨️ استيراد ملف البصمة</h1>
          <p className="text-gray-500 text-sm">رفع ملف Excel أو CSV من جهاز البصمة وحساب التأخيرات تلقائياً</p>
        </div>
        {step > 1 && (
          <button onClick={reset} className="text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition">
            ↩ ابدأ من جديد
          </button>
        )}
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-0">
          {[
            { n: 1, label: 'رفع الملف' },
            { n: 2, label: 'ضبط الأعمدة' },
            { n: 3, label: 'المعاينة' },
            { n: 4, label: 'تم الاستيراد' },
          ].map(({ n, label }, i, arr) => (
            <React.Fragment key={n}>
              <div className="flex flex-col items-center flex-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                  step > n ? 'bg-green-500 border-green-500 text-white'
                  : step === n ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-200 text-gray-400'
                }`}>
                  {step > n ? '✓' : n}
                </div>
                <span className={`text-xs mt-1 font-medium ${step >= n ? 'text-gray-700' : 'text-gray-400'}`}>{label}</span>
              </div>
              {i < arr.length - 1 && (
                <div className={`flex-1 h-0.5 -mt-5 ${step > n ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* ===== STEP 1: رفع الملف ===== */}
      {step === 1 && (
        <div className="space-y-4">
          {/* Drop Zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all ${
              dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
            }`}
          >
            <div className="text-6xl mb-4">📂</div>
            <div className="text-gray-700 font-semibold text-lg mb-2">اسحب ملف البصمة هنا</div>
            <div className="text-gray-400 text-sm mb-4">أو انقر للاختيار</div>
            <div className="flex justify-center gap-3">
              {['.xlsx', '.xls', '.csv', '.txt'].map(ext => (
                <span key={ext} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-mono">{ext}</span>
              ))}
            </div>
            <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv,.txt" onChange={onFileChange} className="hidden" />
          </div>

          {/* Formats Guide */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <h3 className="font-bold text-blue-800 mb-3 text-sm">📋 الصيغ المدعومة</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-white rounded-xl p-3 border border-blue-100">
                <div className="font-bold text-blue-700 mb-2">📊 Excel (.xlsx)</div>
                <div className="font-mono text-gray-600 space-y-1">
                  <div className="bg-gray-50 p-1.5 rounded">رقم البصمة | التاريخ | وقت الدخول | وقت الخروج</div>
                  <div className="bg-gray-50 p-1.5 rounded">101 | 2026-09-01 | 08:12 | 16:05</div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-3 border border-blue-100">
                <div className="font-bold text-green-700 mb-2">📄 CSV</div>
                <div className="font-mono text-gray-600 space-y-1">
                  <div className="bg-gray-50 p-1.5 rounded text-xs">id,date,in,out</div>
                  <div className="bg-gray-50 p-1.5 rounded text-xs">101,2026-09-01,08:12,16:05</div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-3 border border-blue-100">
                <div className="font-bold text-orange-700 mb-2">🔤 أسماء الأعمدة</div>
                <div className="text-gray-600 space-y-1">
                  <div>• بصمة / رقم / ID / EmpID</div>
                  <div>• تاريخ / Date</div>
                  <div>• دخول / In / CheckIn</div>
                  <div>• خروج / Out / CheckOut</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sample download */}
          <div className="text-center">
            <button
              onClick={() => {
                const sampleData = [
                  ['رقم البصمة', 'التاريخ', 'وقت الدخول', 'وقت الخروج', 'اسم الموظف'],
                  ['101', '2026-09-01', '08:12', '16:05', 'سلوي منجود محمد'],
                  ['102', '2026-09-01', '08:25', '16:10', 'حنان عادل محمد'],
                  ['201', '2026-09-01', '09:05', '17:00', 'محمد علي السيد'],
                  ['101', '2026-09-02', '07:58', '16:00', 'سلوي منجود محمد'],
                  ['103', '2026-09-02', '08:45', '16:30', 'هاجر اسماعيل'],
                ];
                const ws = XLSX.utils.aoa_to_sheet(sampleData);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'بيانات البصمة');
                XLSX.writeFile(wb, 'نموذج_البصمة.xlsx');
              }}
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              ⬇️ تحميل ملف نموذج فارغ
            </button>
          </div>
        </div>
      )}

      {/* ===== STEP 2: ضبط الأعمدة ===== */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">📁 الملف: {fileName}</h2>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">{rawData.length} صف</span>
            </div>

            {/* Column Mapping */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">🗂️ ربط الأعمدة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'fingerprint', label: '🔑 رقم البصمة / كود الموظف', required: true },
                  { key: 'date',        label: '📅 التاريخ', required: true },
                  { key: 'timeIn',      label: '🟢 وقت الدخول (الحضور)', required: true },
                  { key: 'timeOut',     label: '🔴 وقت الخروج (الانصراف)', required: false },
                  { key: 'name',        label: '👤 اسم الموظف (اختياري)', required: false },
                ].map(({ key, label, required }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      {label} {required && <span className="text-red-500">*</span>}
                    </label>
                    <select
                      value={colMap[key] || ''}
                      onChange={e => setColMap(prev => ({ ...prev, [key]: e.target.value }))}
                      className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                        required && !colMap[key] ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                    >
                      <option value="">— اختر العمود —</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview raw data */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">👁️ معاينة أول 3 صفوف</h3>
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50">
                      {headers.map(h => <th key={h} className="px-3 py-2 text-right text-gray-600 font-semibold border-b">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {rawData.slice(0, 3).map((row, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                        {headers.map(h => <td key={h} className="px-3 py-2 text-gray-600">{String(row[h] ?? '')}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Shift Settings */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">⏰ وقت الشيفت (للمقارنة)</h3>
              <div className="flex flex-wrap gap-3 items-center">
                {!useCustomShift && SHIFTS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setShift(s.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
                      shift === s.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {s.label} ({s.start})
                  </button>
                ))}
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={useCustomShift} onChange={e => setUseCustomShift(e.target.checked)} className="w-4 h-4 accent-blue-600" />
                  وقت مخصص
                </label>
                {useCustomShift && (
                  <input type="time" value={customStart} onChange={e => setCustomStart(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                )}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <label className="text-sm text-gray-600">هامش التسامح:</label>
                <input type="number" min="0" max="30" value={tolerance}
                  onChange={e => setTolerance(Number(e.target.value))}
                  className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-300" />
                <span className="text-sm text-gray-500">دقيقة (لا يُعدّ تأخيراً)</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={() => setStep(1)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">السابق</button>
            <button
              onClick={processPreview}
              disabled={!colMap.fingerprint || !colMap.date || !colMap.timeIn}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl font-medium shadow-sm transition"
            >
              معاينة النتائج ←
            </button>
          </div>
        </div>
      )}

      {/* ===== STEP 3: المعاينة ===== */}
      {step === 3 && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'إجمالي الصفوف', value: preview.length, color: 'bg-gray-50 text-gray-700 border-gray-200' },
              { label: 'حالات تأخير', value: lateCount, color: 'bg-red-50 text-red-700 border-red-200' },
              { label: 'موظف غير موجود', value: noEmpCount, color: 'bg-orange-50 text-orange-700 border-orange-200' },
              { label: 'موجود مسبقاً', value: existCount, color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
              { label: 'سيُستورد', value: selectedCount, color: 'bg-green-50 text-green-700 border-green-200' },
            ].map(({ label, value, color }) => (
              <div key={label} className={`${color} border rounded-2xl p-3 text-center`}>
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Bulk actions */}
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-gray-600">تحديد:</span>
            <button onClick={() => toggleAll(true)} className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition">الكل</button>
            <button onClick={() => toggleAll(false)} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition">لا شيء</button>
            <button onClick={() => {
              const s = {};
              preview.forEach(r => { if (r.isLate && !r.alreadyExists && r.empFound) s[r._idx] = true; else s[r._idx] = false; });
              setSelected(s);
            }} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition">التأخيرات فقط</button>
            <span className="text-xs text-gray-400 mr-auto">شيفت: {useCustomShift ? customStart : SHIFTS.find(s=>s.id===shift)?.start} • تسامح: {tolerance} دقيقة</span>
          </div>

          {/* Preview Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-3 py-3 text-right">
                      <input type="checkbox"
                        checked={preview.filter(r=>!r.alreadyExists&&r.empFound).every(r=>selected[r._idx])}
                        onChange={e => toggleAll(e.target.checked)}
                        className="w-4 h-4 accent-blue-600" />
                    </th>
                    <th className="px-3 py-3 text-right font-semibold text-gray-600">البصمة</th>
                    <th className="px-3 py-3 text-right font-semibold text-gray-600">الموظف</th>
                    <th className="px-3 py-3 text-right font-semibold text-gray-600">التاريخ</th>
                    <th className="px-3 py-3 text-right font-semibold text-gray-600">وقت الدخول</th>
                    <th className="px-3 py-3 text-right font-semibold text-gray-600">وقت الخروج</th>
                    <th className="px-3 py-3 text-right font-semibold text-gray-600 bg-yellow-50">التأخير</th>
                    <th className="px-3 py-3 text-right font-semibold text-gray-600">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {preview.map(row => {
                    const isChecked = !!selected[row._idx];
                    const rowBg = row.alreadyExists ? 'bg-yellow-50/60'
                      : !row.empFound ? 'bg-orange-50/40'
                      : row.isLate ? 'bg-red-50/30'
                      : '';
                    return (
                      <tr key={row._idx} className={`${rowBg} hover:bg-blue-50/20 transition`}>
                        <td className="px-3 py-2.5">
                          <input type="checkbox"
                            checked={isChecked}
                            disabled={row.alreadyExists}
                            onChange={e => setSelected(prev => ({ ...prev, [row._idx]: e.target.checked }))}
                            className="w-4 h-4 accent-blue-600" />
                        </td>
                        <td className="px-3 py-2.5 font-mono text-blue-600 font-bold">{row.fp}</td>
                        <td className="px-3 py-2.5">
                          <div className={`font-medium ${row.empFound ? 'text-gray-800' : 'text-orange-600'}`}>{row.empName}</div>
                          {!row.empFound && <div className="text-xs text-orange-500">لم يُعثر على الموظف</div>}
                          {row.empFound && <div className="text-xs text-gray-400">{row.empCode}</div>}
                        </td>
                        <td className="px-3 py-2.5 text-gray-600">{row.date}</td>
                        <td className="px-3 py-2.5">
                          <span className={`font-medium ${row.isLate ? 'text-red-600' : 'text-green-600'}`}>
                            {row.timeIn}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-gray-400">{row.timeOut || '—'}</td>
                        <td className="px-3 py-2.5 bg-yellow-50">
                          {row.isLate ? (
                            <span className="font-bold text-red-600">{row.delayMins} د</span>
                          ) : (
                            <span className="text-green-600 text-xs">✓ منتظم</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          {row.alreadyExists ? (
                            <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs">موجود مسبقاً</span>
                          ) : !row.empFound ? (
                            <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs">غير مُعرَّف</span>
                          ) : row.isLate ? (
                            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs">تأخير</span>
                          ) : (
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">في الوقت</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {preview.length === 0 && (
              <div className="text-center py-10 text-gray-400">لا توجد بيانات صالحة للاستيراد</div>
            )}
          </div>

          <div className="flex justify-between gap-3">
            <button onClick={() => setStep(2)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">← السابق</button>
            <button
              onClick={doImport}
              disabled={selectedCount === 0}
              className="px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white rounded-xl font-bold shadow-sm transition flex items-center gap-2"
            >
              ✅ استيراد {selectedCount} سجل تأخير
            </button>
          </div>
        </div>
      )}

      {/* ===== STEP 4: تم ===== */}
      {step === 4 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-7xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">تم الاستيراد بنجاح!</h2>
          <p className="text-gray-500 mb-6">تم إضافة <strong className="text-green-700 text-lg">{importedCount}</strong> سجل تأخير إلى قاعدة البيانات</p>
          <div className="flex justify-center gap-3">
            <button onClick={reset} className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">
              استيراد ملف آخر
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'delays' }))}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm transition"
            >
              عرض سجلات التأخير ←
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FingerprintImport;
