import React, { useState } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Salaries from './pages/Salaries';
import Loans from './pages/Loans';
import LoansAdvanced from './pages/LoansAdvanced';
import Deductions from './pages/Deductions';
import Incentives from './pages/Incentives';
import FixedIncentives from './pages/FixedIncentives';
import Overtime from './pages/Overtime';
import Delays from './pages/Delays';
import AbsenceReport from './pages/AbsenceReport';
import LeaveBalance from './pages/LeaveBalance';
import Transportation from './pages/Transportation';
import EarlyDeparture from './pages/EarlyDeparture';
import MedicalCases from './pages/MedicalCases';
import Interviews from './pages/Interviews';
import Tasks from './pages/Tasks';
import Reports from './pages/Reports';
import MonthlyReport from './pages/MonthlyReport';
import FingerprintImport from './pages/FingerprintImport';
import PaymentForms from './pages/PaymentForms';
import Clearance from './pages/Clearance';
import {
  initialEmployees, initialTasks, initialLoans,
  initialDeductions, initialIncentives,
  initialDelays, initialOvertime, initialTransportation,
  initialFixedIncentives, initialAbsences, initialLeaveBalance,
  initialMedicalCases,
} from './data/initialData';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // ===== بيانات مشتركة بين كل الوحدات =====
  const [employees, setEmployees] = useState(initialEmployees);
  const [tasks, setTasks] = useState(initialTasks);
  const [loans, setLoans] = useState(initialLoans);
  const [deductions, setDeductions] = useState(initialDeductions);
  const [incentives, setIncentives] = useState(initialIncentives);
  const [delays, setDelays] = useState(initialDelays);
  const [overtime, setOvertime] = useState(initialOvertime);
  const [transportation, setTransportation] = useState(initialTransportation);
  const [fixedIncentives, setFixedIncentives] = useState(initialFixedIncentives);
  const [absences, setAbsences] = useState(initialAbsences);
  const [leaveBalance, setLeaveBalance] = useState(initialLeaveBalance);
  const [medicalCases, setMedicalCases] = useState(initialMedicalCases);

  // Props موحدة تُمرر لكل الصفحات
  const sharedProps = {
    employees, setEmployees,
    tasks, setTasks,
    loans, setLoans,
    deductions, setDeductions,
    incentives, setIncentives,
    delays, setDelays,
    overtime, setOvertime,
    transportation, setTransportation,
    fixedIncentives, setFixedIncentives,
    absences, setAbsences,
    leaveBalance, setLeaveBalance,
    medicalCases, setMedicalCases,
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':       return <Dashboard {...sharedProps} />;
      case 'employees':       return <Employees {...sharedProps} />;
      case 'attendance':      return <Attendance {...sharedProps} />;
      case 'absenceReport':   return <AbsenceReport absences={absences} setAbsences={setAbsences} employees={employees} />;
      case 'delays':          return <Delays delays={delays} setDelays={setDelays} employees={employees} />;
      case 'leaveBalance':    return <LeaveBalance leaveBalance={leaveBalance} setLeaveBalance={setLeaveBalance} employees={employees} />;
      case 'earlyDeparture':  return <EarlyDeparture {...sharedProps} />;
      case 'salaries':        return <Salaries {...sharedProps} />;
      case 'loans':           return <Loans loans={loans} setLoans={setLoans} employees={employees} />;
      case 'loansAdvanced':   return <LoansAdvanced {...sharedProps} />;
      case 'deductions':      return <Deductions deductions={deductions} setDeductions={setDeductions} employees={employees} />;
      case 'transportation':  return <Transportation transportation={transportation} setTransportation={setTransportation} employees={employees} />;
      case 'overtime':        return <Overtime overtime={overtime} setOvertime={setOvertime} employees={employees} />;
      case 'incentives':      return <Incentives incentives={incentives} setIncentives={setIncentives} employees={employees} />;
      case 'fixedIncentives': return <FixedIncentives fixedIncentives={fixedIncentives} setFixedIncentives={setFixedIncentives} employees={employees} />;
      case 'medicalCases':    return <MedicalCases medicalCases={medicalCases} setMedicalCases={setMedicalCases} employees={employees} />;
      case 'interviews':      return <Interviews {...sharedProps} />;
      case 'tasks':           return <Tasks tasks={tasks} setTasks={setTasks} />;
      case 'reports':         return <Reports {...sharedProps} />;
      case 'monthlyReport':   return <MonthlyReport {...sharedProps} />;
      case 'fingerprintImport': return <FingerprintImport employees={employees} delays={delays} setDelays={setDelays} />;
      case 'paymentForms':    return <PaymentForms {...sharedProps} />;
      case 'clearance':       return <Clearance employees={employees} loans={loans} leaveBalance={leaveBalance} deductions={deductions} delays={delays} absences={absences} />;
      default:                return <Dashboard {...sharedProps} />;
    }
  };

  const pageTitle = {
    dashboard: 'لوحة التحكم',
    employees: 'بيانات الموظفين',
    attendance: 'الحضور والغياب',
    absenceReport: 'تقرير الغائبين',
    delays: 'التأخيرات',
    leaveBalance: 'رصيد الإجازات',
    earlyDeparture: 'انصراف نصف يوم',
    salaries: 'الرواتب والمستحقات',
    loans: 'السلف الشهرية',
    loansAdvanced: 'السلف العادية والاستثنائية',
    deductions: 'الخصومات (انتاج)',
    transportation: 'بدل المواصلات',
    overtime: 'الإضافي',
    incentives: 'حوافز الانتاج',
    fixedIncentives: 'حوافز العمالة الثابتة',
    medicalCases: 'الحالات المرضية وبدل العلاج',
    interviews: 'المقابلات والتوظيف',
    tasks: 'المهام الشهرية',
    reports: 'التقارير',
    monthlyReport: 'الشيت الشهري للمدير',
    fingerprintImport: 'استيراد ملف البصمة',
    paymentForms: 'نماذج الصرف',
    clearance: 'التصفية — مستحقات نهاية الخدمة',
  };

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]" dir="rtl">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 flex flex-col overflow-hidden mr-0 lg:mr-72 transition-all duration-300">
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#E2E8F0] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 text-[#718096]">
            <span className="text-[#718096] text-xs sm:text-sm">نظام HR</span>
            <span className="text-[#E2E8F0] hidden sm:inline">/</span>
            <span className="font-semibold text-[#172B45] text-sm sm:text-base">{pageTitle[activeTab]}</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-xs sm:text-sm text-[#718096] hidden sm:block">
              {employees.length} موظف • {tasks.filter(t => !t.done).length} مهام معلقة
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#163A63] to-[#214B78] rounded-xl flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-md">
              HR
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-2 sm:p-6">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;
