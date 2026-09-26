// Initial HR Data - Based on the Excel structure
// This simulates the data from the Excel file

export const initialEmployees = [
  { id: 1, code: '202043', fingerprint: '101', name: 'سلوي منجود محمد', department: 'تغليف', type: 'انتاج', salary: 918, status: 'يعمل', hireDate: '2020-01-15', phone: '01012345678', nationalId: '29801010123456' },
  { id: 2, code: '203012', fingerprint: '102', name: 'حنان عادل محمد', department: 'تغليف', type: 'انتاج', salary: 950, status: 'يعمل', hireDate: '2020-03-10', phone: '01123456789', nationalId: '29901010234567' },
  { id: 3, code: '202116', fingerprint: '103', name: 'هاجر اسماعيل', department: 'تغليف', type: 'انتاج', salary: 900, status: 'يعمل', hireDate: '2020-06-20', phone: '01234567890', nationalId: '30001010345678' },
  { id: 4, code: '203259', fingerprint: '104', name: 'نجوي عاشور محمد الغريب', department: 'تغليف', type: 'انتاج', salary: 900, status: 'يعمل', hireDate: '2021-01-05', phone: '01012378901', nationalId: '30101010456789' },
  { id: 5, code: '203007', fingerprint: '105', name: 'رانيا سعد خطاب شروده', department: 'تغليف', type: 'انتاج', salary: 900, status: 'يعمل', hireDate: '2020-09-12', phone: '01098765432', nationalId: '30001010567890' },
  { id: 6, code: '203021', fingerprint: '106', name: 'زوبه السيد شلبي', department: 'تغليف', type: 'انتاج', salary: 900, status: 'يعمل', hireDate: '2021-03-01', phone: '01187654321', nationalId: '30101010678901' },
  { id: 7, code: '203008', fingerprint: '107', name: 'ياسمين صبحي حسن', department: 'تغليف', type: 'انتاج', salary: 950, status: 'يعمل', hireDate: '2020-11-20', phone: '01276543210', nationalId: '30001010789012' },
  { id: 8, code: '202096', fingerprint: '108', name: 'بوسي فارس يوسف شحاته', department: 'تغليف', type: 'انتاج', salary: 900, status: 'يعمل', hireDate: '2020-07-15', phone: '01365432109', nationalId: '29901010890123' },
  { id: 9, code: '202133', fingerprint: '109', name: 'ورده عبد السلام غازي روميه', department: 'تغليف', type: 'انتاج', salary: 900, status: 'يعمل', hireDate: '2020-05-08', phone: '01454321098', nationalId: '29901010901234' },
  { id: 10, code: '106014', fingerprint: '201', name: 'محمد علي السيد', department: 'الحقن', type: 'ثابت', salary: 3500, status: 'يعمل', hireDate: '2018-03-15', phone: '01543210987', nationalId: '29001010012345' },
  { id: 11, code: '107011', fingerprint: '202', name: 'أحمد محمود إبراهيم', department: 'الحقن', type: 'ثابت', salary: 4000, status: 'يعمل', hireDate: '2017-06-20', phone: '01632109876', nationalId: '28901010123456' },
  { id: 12, code: '106019', fingerprint: '203', name: 'خالد السعودي الشحات', department: 'الحقن', type: 'ثابت', salary: 3200, status: 'يعمل', hireDate: '2019-01-10', phone: '01721098765', nationalId: '29101010234567' },
  { id: 13, code: '107021', fingerprint: '204', name: 'رافت رأفت فتحي المتولي', department: 'المخازن', type: 'ثابت', salary: 3000, status: 'يعمل', hireDate: '2019-05-20', phone: '01810987654', nationalId: '29001010345678' },
  { id: 14, code: '102002', fingerprint: '205', name: 'محمد فايز العراقي', department: 'الحسابات', type: 'ثابت', salary: 6000, status: 'يعمل', hireDate: '2016-09-01', phone: '01909876543', nationalId: '28801010456789' },
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
