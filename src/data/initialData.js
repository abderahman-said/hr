// Initial HR Data - Based on the Excel structure
// This simulates the data from the Excel file

export const initialEmployees = [
  { id: 1, code: '202043', fingerprint: '101', name: 'سلوي منجود محمد', department: 'تغليف', type: 'انتاج', salary: 918, status: 'يعمل', hireDate: '2020-01-15', phone: '01012345678', nationalId: '29801010123456', jobTitle: 'عاملة إنتاج', contractType: 'مؤقت', maritalStatus: 'متزوج', workShift: 'صباحي', directManager: 'مشرف التغليف', insurance: 'غير مُؤمَّن', insuranceDate: '', insuranceAmount: '', emergencyName: 'أحمد', emergencyPhone: '01000000000' },
  { id: 2, code: '203012', fingerprint: '102', name: 'حنان عادل محمد', department: 'تغليف', type: 'انتاج', salary: 950, status: 'يعمل', hireDate: '2020-03-10', phone: '01123456789', nationalId: '29901010234567', jobTitle: 'عاملة إنتاج', contractType: 'مؤقت', maritalStatus: 'أعزب', workShift: 'صباحي', directManager: 'مشرف التغليف', insurance: 'مُؤمَّن', insuranceDate: '2020-04-01', insuranceAmount: 200, emergencyName: 'عادل', emergencyPhone: '01111111111' },
  { id: 3, code: '202116', fingerprint: '103', name: 'هاجر اسماعيل', department: 'تغليف', type: 'انتاج', salary: 900, status: 'يعمل', hireDate: '2020-06-20', phone: '01234567890', nationalId: '30001010345678', jobTitle: 'عاملة إنتاج', contractType: 'مؤقت', maritalStatus: 'أعزب', workShift: 'صباحي', directManager: 'مشرف التغليف', insurance: 'غير مُؤمَّن', insuranceDate: '', insuranceAmount: '', emergencyName: 'اسماعيل', emergencyPhone: '01222222222' },
  { id: 4, code: '203259', fingerprint: '104', name: 'نجوي عاشور محمد الغريب', department: 'تغليف', type: 'انتاج', salary: 900, status: 'يعمل', hireDate: '2021-01-05', phone: '01012378901', nationalId: '30101010456789', jobTitle: 'عاملة إنتاج', contractType: 'مؤقت', maritalStatus: 'متزوج', workShift: 'صباحي', directManager: 'مشرف التغليف', insurance: 'مُؤمَّن', insuranceDate: '2021-02-01', insuranceAmount: 200, emergencyName: 'عاشور', emergencyPhone: '01033333333' },
  { id: 5, code: '203007', fingerprint: '105', name: 'رانيا سعد خطاب شروده', department: 'تغليف', type: 'انتاج', salary: 900, status: 'يعمل', hireDate: '2020-09-12', phone: '01098765432', nationalId: '30001010567890', jobTitle: 'عاملة إنتاج', contractType: 'مؤقت', maritalStatus: 'مطلق', workShift: 'صباحي', directManager: 'مشرف التغليف', insurance: 'غير مُؤمَّن', insuranceDate: '', insuranceAmount: '', emergencyName: 'سعد', emergencyPhone: '01044444444' },
  { id: 6, code: '203021', fingerprint: '106', name: 'زوبه السيد شلبي', department: 'تغليف', type: 'انتاج', salary: 900, status: 'يعمل', hireDate: '2021-03-01', phone: '01187654321', nationalId: '30101010678901', jobTitle: 'عاملة إنتاج', contractType: 'مؤقت', maritalStatus: 'أرمل', workShift: 'صباحي', directManager: 'مشرف التغليف', insurance: 'غير مُؤمَّن', insuranceDate: '', insuranceAmount: '', emergencyName: 'السيد', emergencyPhone: '01155555555' },
  { id: 7, code: '203008', fingerprint: '107', name: 'ياسمين صبحي حسن', department: 'تغليف', type: 'انتاج', salary: 950, status: 'يعمل', hireDate: '2020-11-20', phone: '01276543210', nationalId: '30001010789012', jobTitle: 'عاملة إنتاج', contractType: 'مؤقت', maritalStatus: 'أعزب', workShift: 'صباحي', directManager: 'مشرف التغليف', insurance: 'مُؤمَّن', insuranceDate: '2020-12-01', insuranceAmount: 200, emergencyName: 'صبحي', emergencyPhone: '01266666666' },
  { id: 8, code: '202096', fingerprint: '108', name: 'بوسي فارس يوسف شحاته', department: 'تغليف', type: 'انتاج', salary: 900, status: 'يعمل', hireDate: '2020-07-15', phone: '01365432109', nationalId: '29901010890123', jobTitle: 'عاملة إنتاج', contractType: 'مؤقت', maritalStatus: 'أعزب', workShift: 'صباحي', directManager: 'مشرف التغليف', insurance: 'غير مُؤمَّن', insuranceDate: '', insuranceAmount: '', emergencyName: 'فارس', emergencyPhone: '01377777777' },
  { id: 9, code: '202133', fingerprint: '109', name: 'ورده عبد السلام غازي روميه', department: 'تغليف', type: 'انتاج', salary: 900, status: 'يعمل', hireDate: '2020-05-08', phone: '01454321098', nationalId: '29901010901234', jobTitle: 'عاملة إنتاج', contractType: 'مؤقت', maritalStatus: 'متزوج', workShift: 'صباحي', directManager: 'مشرف التغليف', insurance: 'غير مُؤمَّن', insuranceDate: '', insuranceAmount: '', emergencyName: 'عبد السلام', emergencyPhone: '01488888888' },
  { id: 10, code: '106014', fingerprint: '201', name: 'محمد علي السيد', department: 'الحقن', type: 'ثابت', salary: 3500, status: 'يعمل', hireDate: '2018-03-15', phone: '01543210987', nationalId: '29001010012345', jobTitle: 'مشرف حقن', contractType: 'دائم', maritalStatus: 'متزوج', workShift: 'صباحي', directManager: 'مدير المصنع', insurance: 'مُؤمَّن', insuranceDate: '2018-04-01', insuranceAmount: 500, emergencyName: 'علي', emergencyPhone: '01599999999' },
  { id: 11, code: '107011', fingerprint: '202', name: 'أحمد محمود إبراهيم', department: 'الحقن', type: 'ثابت', salary: 4000, status: 'يعمل', hireDate: '2017-06-20', phone: '01632109876', nationalId: '28901010123456', jobTitle: 'مدير إنتاج', contractType: 'دائم', maritalStatus: 'متزوج', workShift: 'صباحي', directManager: 'مدير المصنع', insurance: 'مُؤمَّن', insuranceDate: '2017-07-01', insuranceAmount: 600, emergencyName: 'محمود', emergencyPhone: '01600000000' },
  { id: 12, code: '106019', fingerprint: '203', name: 'خالد السعودي الشحات', department: 'الحقن', type: 'ثابت', salary: 3200, status: 'يعمل', hireDate: '2019-01-10', phone: '01721098765', nationalId: '29101010234567', jobTitle: 'فني صيانة', contractType: 'دائم', maritalStatus: 'متزوج', workShift: 'مسائي', directManager: 'مدير الصيانة', insurance: 'مُؤمَّن', insuranceDate: '2019-02-01', insuranceAmount: 450, emergencyName: 'السعودي', emergencyPhone: '01711111111' },
  { id: 13, code: '107021', fingerprint: '204', name: 'رافت رأفت فتحي المتولي', department: 'المخازن', type: 'ثابت', salary: 3000, status: 'يعمل', hireDate: '2019-05-20', phone: '01810987654', nationalId: '29001010345678', jobTitle: 'أمين مخزن', contractType: 'دائم', maritalStatus: 'متزوج', workShift: 'صباحي', directManager: 'مدير المصنع', insurance: 'مُؤمَّن', insuranceDate: '2019-06-01', insuranceAmount: 400, emergencyName: 'رأفت', emergencyPhone: '01822222222' },
  { id: 14, code: '102002', fingerprint: '205', name: 'محمد فايز العراقي', department: 'الحسابات', type: 'ثابت', salary: 6000, status: 'يعمل', hireDate: '2016-09-01', phone: '01909876543', nationalId: '28801010456789', jobTitle: 'مدير حسابات', contractType: 'دائم', maritalStatus: 'متزوج', workShift: 'صباحي', directManager: 'المدير العام', insurance: 'مُؤمَّن', insuranceDate: '2016-10-01', insuranceAmount: 800, emergencyName: 'فايز', emergencyPhone: '01933333333' },
];

// ===== بيانات التأخيرات =====
export const initialDelays = [
  { id: 1, fingerprint: '101', employeeCode: '202043', employeeName: 'سلوي منجود محمد', scheduledTime: '08:00', actualTime: '08:45', date: '2026-09-03', delayMinutes: 45 },
  { id: 2, fingerprint: '102', employeeCode: '203012', employeeName: 'حنان عادل محمد', scheduledTime: '08:00', actualTime: '08:20', date: '2026-09-05', delayMinutes: 20 },
  { id: 3, fingerprint: '201', employeeCode: '106014', employeeName: 'محمد علي السيد', scheduledTime: '09:00', actualTime: '09:30', date: '2026-09-08', delayMinutes: 30 },
  { id: 4, fingerprint: '101', employeeCode: '202043', employeeName: 'سلوي منجود محمد', scheduledTime: '08:00', actualTime: '09:00', date: '2026-09-15', delayMinutes: 60 },
];

// ===== بيانات الإضافي =====
export const initialOvertime = [
  { id: 1, employeeCode: '202043', employeeName: 'سلوي منجود محمد', department: 'تغليف', salary: 918, hoursPerDay: 8, overtimeHours: 2, date: '2026-09-05', reason: 'الاجتهاد في العمل' },
  { id: 2, employeeCode: '107011', employeeName: 'أحمد محمود إبراهيم', department: 'الحقن', salary: 4000, hoursPerDay: 8, overtimeHours: 1, date: '2026-09-10', reason: 'عمل إضافي' },
  { id: 3, employeeCode: '106014', employeeName: 'محمد علي السيد', department: 'الحقن', salary: 3500, hoursPerDay: 8, overtimeHours: 3, date: '2026-09-12', reason: 'ضغط العمل' },
];

// ===== بيانات المواصلات =====
export const initialTransportation = [
  { id: 1, employeeCode: '202096', employeeName: 'بوسي فارس يوسف شحاته', department: 'تغليف', address: 'القاهرة', attendanceDays: 22, allowancePerDay: 10 },
  { id: 2, employeeCode: '202043', employeeName: 'سلوي منجود محمد', department: 'تغليف', address: 'القاهرة', attendanceDays: 24, allowancePerDay: 10 },
  { id: 3, employeeCode: '203012', employeeName: 'حنان عادل محمد', department: 'تغليف', address: 'القليوبية', attendanceDays: 21, allowancePerDay: 12 },
];

// ===== بيانات حوافز الثابتة =====
export const initialFixedIncentives = [
  { id: 1, employeeCode: '107011', employeeName: 'أحمد محمود إبراهيم', department: 'الحقن', jobTitle: 'مشرف', salary: 4000, incentiveHours: 8, date: '2026-09-01', reason: 'الاجتهاد في العمل' },
  { id: 2, employeeCode: '106014', employeeName: 'محمد علي السيد', department: 'الحقن', jobTitle: 'عامل حقن', salary: 3500, incentiveHours: 4, date: '2026-09-15', reason: 'عمل إضافي' },
];

// ===== بيانات الغياب =====
export const initialAbsences = [
  { id: 1, employeeCode: '202043', employeeName: 'سلوي منجود محمد', department: 'التغليف', date: '2026-09-02', type: 'غياب باذن', reason: 'ظرف شخصي', permissionMethod: 'واتس قبل العمل', type_category: 'انتاج' },
  { id: 2, employeeCode: '203012', employeeName: 'حنان عادل محمد', department: 'التغليف', date: '2026-09-05', type: 'غياب باذن', reason: 'مرضي', permissionMethod: 'واتس قبل العمل', type_category: 'انتاج' },
  { id: 3, employeeCode: '106014', employeeName: 'محمد علي السيد', department: 'الحقن', date: '2026-09-10', type: 'بدون اذن', reason: '', permissionMethod: '', type_category: 'ثابت' },
];

// ===== بيانات رصيد الإجازات =====
export const initialLeaveBalance = [
  { id: 1, employeeCode: '202043', employeeName: 'سلوي منجود محمد', type: 'انتاج', leaveType: 'رصيد', date: '2026-01-01', value: 150 },
  { id: 2, employeeCode: '106014', employeeName: 'محمد علي السيد', type: 'ثابت', leaveType: 'رصيد _ض', date: '2026-01-01', value: 4 },
  { id: 3, employeeCode: '202043', employeeName: 'سلوي منجود محمد', type: 'انتاج', leaveType: 'غياب باذن', date: '2026-09-02', value: 1 },
  { id: 4, employeeCode: '203012', employeeName: 'حنان عادل محمد', type: 'انتاج', leaveType: 'غياب باذن', date: '2026-09-05', value: 1 },
  { id: 5, employeeCode: '106014', employeeName: 'محمد علي السيد', type: 'ثابت', leaveType: 'بدون اذن', date: '2026-09-10', value: 1 },
];

// ===== بيانات الحالات المرضية =====
export const initialMedicalCases = [
  { id: 1, employeeCode: '203012', employeeName: 'حنان عادل محمد', department: 'التغليف', condition: 'كسر في اليد', treatmentDate: '2026-02-10', amount: 2000, note: 'تم صرف ألفين جنيه', status: 'صُرف' },
  { id: 2, employeeCode: '106014', employeeName: 'محمد علي السيد', department: 'الحقن', condition: 'التهاب', treatmentDate: '2026-02-15', amount: 500, note: 'تقرير مرضي مقدَّم', status: 'معلق' },
];

// ===== بيانات المنح والإعانات =====
export const initialGrants = [
  { id: 1, employeeCode: '202043', employeeName: 'سلوي منجود محمد', department: 'تغليف', type: 'منحة مولود', amount: 1000, date: '2026-08-15', status: 'صُرف', document: 'شهادة ميلاد رقم 123456', notes: 'رزقت بمولود جديد (أحمد)' },
  { id: 2, employeeCode: '107011', employeeName: 'أحمد محمود إبراهيم', department: 'الحقن', type: 'منحة زواج', amount: 2000, date: '2026-09-01', status: 'صُرف', document: 'وثيقة زواج رسمية', notes: 'مبروك الزواج السعيد' },
  { id: 3, employeeCode: '106019', employeeName: 'خالد السعودي الشحات', department: 'الحقن', type: 'إعانة وفاة (درجة أولى)', amount: 1500, date: '2026-09-12', status: 'معلق', document: 'شهادة وفاة الوالد', notes: 'موافقة الإدارة المبدئية' },
];

// ===== بيانات القرارات الإدارية =====
export const initialDecisions = [
  { id: 1, number: 'ق-2026/011', employeeCode: '106014', employeeName: 'محمد علي السيد', department: 'الحقن', type: 'جزاء وخصم', date: '2026-09-05', subject: 'مخالفة تعليمات السلامة والصحة المهنية', details: 'عدم ارتداء واقي الرأس والقفازات أثناء تشغيل الماكينة رغم التنبيه المتكرر', impact: 'خصم يومين من راتب شهر سبتمبر', status: 'منفذ' },
  { id: 2, number: 'ق-2026/012', employeeCode: '203012', employeeName: 'حنان عادل محمد', department: 'تغليف', type: 'ترقية وتعديل مسمى', date: '2026-09-01', subject: 'ترقية إلى مسؤولة خط تغليف', details: 'نظراً لكفاءتها العالية والتزامها المتميز خلال العام الحالي', impact: 'زيادة الراتب الأساسي بمقدار 250 ج وتعديل المسمى', status: 'ساري' },
  { id: 3, number: 'ق-2026/013', employeeCode: '202096', employeeName: 'بوسي فارس يوسف شحاته', department: 'تغليف', type: 'لفت نظر', date: '2026-09-14', subject: 'تكرار التأخير الصباحي بدون عذر', details: 'تأخر أكثر من 3 مرات خلال الأسبوع الأول من سبتمبر', impact: 'لفت نظر وتنبيه بعدم التكرار لتفادي توقيع الجزاء', status: 'ساري' },
];

// ===== بيانات فرق القبض (تسويات الرواتب) =====
export const initialSalaryDifferences = [
  { id: 1, employeeCode: '202043', employeeName: 'سلوي منجود محمد', department: 'تغليف', month: 'سبتمبر 2026', dueAmount: 768, paidAmount: 750, diff: -18, reason: 'فروق تقريب كسور النقدية بالخزينة', action: 'مرحل للشهر القادم' },
  { id: 2, employeeCode: '203012', employeeName: 'حنان عادل محمد', department: 'تغليف', month: 'سبتمبر 2026', dueAmount: 1202, paidAmount: 1200, diff: -2, reason: 'كسور فكة نقدية', action: 'تمت التسوية' },
  { id: 3, employeeCode: '106014', employeeName: 'محمد علي السيد', department: 'الحقن', month: 'سبتمبر 2026', dueAmount: 1728, paidAmount: 1800, diff: 72, reason: 'صرف بدل انتقال إضافي نقداً بالخزينة', action: 'تمت التسوية' },
];

export const initialTasks = [
  { id: 1, task: 'استخراج مسير رواتب شهر سبتمبر', date: '2026-09-25', type: 'رواتب', note: 'ينتهي آخر الشهر', done: false },
  { id: 2, task: 'متابعة سلف الشهر', date: '2026-09-20', type: 'مالي', note: '', done: true },
  { id: 3, task: 'تحديث بيانات الغائبين', date: '2026-09-28', type: 'غياب', note: 'من البصمة', done: false },
  { id: 4, task: 'إعداد تقرير الحوافز', date: '2026-09-30', type: 'حوافز', note: 'ممتاز وجيد جداً', done: false },
  { id: 5, task: 'مراجعة التأخيرات', date: '2026-09-29', type: 'حضور', note: '', done: false },
  { id: 6, task: 'صرف بدل مواصلات الانتاج', date: '2026-09-30', type: 'مالي', note: '', done: false },
];

export const initialLoans = [
  { id: 1, employeeCode: '202043', employeeName: 'سلوي منجود محمد', amount: 500, month: 'سبتمبر 2026', status: 'مخصوم' },
  { id: 2, employeeCode: '106014', employeeName: 'محمد علي السيد', amount: 1500, month: 'سبتمبر 2026', status: 'مخصوم' },
  { id: 3, employeeCode: '107011', employeeName: 'أحمد محمود إبراهيم', amount: 1000, month: 'سبتمبر 2026', status: 'معلق' },
  { id: 4, employeeCode: '106019', employeeName: 'خالد السعودي الشحات', amount: 1000, month: 'سبتمبر 2026', status: 'مخصوم' },
];

export const initialDeductions = [
  { id: 1, employeeCode: '202043', employeeName: 'سلوي منجود محمد', absenceDate: '2026-09-05', type: 'غياب بدون إذن', amount: 150 },
  { id: 2, employeeCode: '203012', employeeName: 'حنان عادل محمد', absenceDate: '2026-09-10', type: 'غياب', amount: 100 },
  { id: 3, employeeCode: '202096', employeeName: 'بوسي فارس يوسف شحاته', absenceDate: '2026-09-15', type: 'تأخير', amount: 50 },
];

export const initialIncentives = [
  { id: 1, employeeCode: '202043', employeeName: 'سلوي منجود محمد', excellentDays: 7, goodDays: 1, excellentValue: 150, goodValue: 0, total: 150 },
  { id: 2, employeeCode: '203012', employeeName: 'حنان عادل محمد', excellentDays: 6, goodDays: 0, excellentValue: 150, goodValue: 0, total: 150 },
  { id: 3, employeeCode: '202116', employeeName: 'هاجر اسماعيل', excellentDays: 6, goodDays: 1, excellentValue: 150, goodValue: 0, total: 150 },
  { id: 4, employeeCode: '203007', employeeName: 'رانيا سعد خطاب شروده', excellentDays: 5, goodDays: 2, excellentValue: 75, goodValue: 0, total: 75 },
  { id: 5, employeeCode: '203008', employeeName: 'ياسمين صبحي حسن', excellentDays: 6, goodDays: 1, excellentValue: 150, goodValue: 0, total: 150 },
];

export const departments = ['الحقن', 'التغليف', 'المخازن', 'الحسابات', 'الجوده', 'المبيعات', 'الإنتاج'];
export const taskTypes = ['رواتب', 'مالي', 'غياب', 'حوافز', 'حضور', 'أخري'];

export const contractTypes = ['دائم', 'مؤقت', 'عقد'];
export const workShifts = ['صباحي', 'مسائي', 'ليلي'];
export const maritalStatuses = ['أعزب', 'متزوج', 'مطلق', 'أرمل'];

