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
import {
  initialEmployees, initialTasks, initialLoans,
  initialDeductions, initialIncentives
} from './data/initialData';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [employees, setEmployees] = useState(initialEmployees);
  const [tasks, setTasks] = useState(initialTasks);
  const [loans, setLoans] = useState(initialLoans);
  const [deductions, setDeductions] = useState(initialDeductions);
  const [incentives, setIncentives] = useState(initialIncentives);

  const renderPage = () => {
    const props = { employees, setEmployees, tasks, setTasks, loans, setLoans, deductions, setDeductions, incentives, setIncentives };
    switch (activeTab) {
      case 'dashboard':       return <Dashboard {...props} />;
      case 'employees':       return <Employees {...props} />;
      case 'attendance':      return <Attendance {...props} />;
      case 'absenceReport':   return <AbsenceReport {...props} />;
      case 'delays':          return <Delays {...props} />;
      case 'leaveBalance':    return <LeaveBalance {...props} />;
      case 'earlyDeparture':  return <EarlyDeparture {...props} />;
      case 'salaries':        return <Salaries {...props} />;
      case 'loans':           return <Loans {...props} />;
      case 'loansAdvanced':   return <LoansAdvanced {...props} />;
      case 'deductions':      return <Deductions {...props} />;
      case 'transportation':  return <Transportation {...props} />;
      case 'overtime':        return <Overtime {...props} />;
      case 'incentives':      return <Incentives {...props} />;
      case 'fixedIncentives': return <FixedIncentives {...props} />;
      case 'medicalCases':    return <MedicalCases {...props} />;
      case 'interviews':      return <Interviews {...props} />;
      case 'tasks':           return <Tasks {...props} />;
      case 'reports':         return <Reports {...props} />;
      default:                return <Dashboard {...props} />;
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
  };

  return (
    <div className="flex min-h-screen bg-slate-100" dir="rtl">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-gray-400 text-sm">نظام HR</span>
            <span className="text-gray-300">/</span>
            <span className="font-semibold text-gray-800">{pageTitle[activeTab]}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">
              {employees.length} موظف • {tasks.filter(t => !t.done).length} مهام معلقة
            </div>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              HR
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;
