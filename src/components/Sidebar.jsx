import React, { useState } from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [openSection, setOpenSection] = useState('main');

  const sections = [
    {
      key: 'main',
      label: '',
      items: [
        { id: 'dashboard', label: 'لوحة التحكم', icon: '🏠' },
      ]
    },
    {
      key: 'employees',
      label: '👥 الموظفون',
      items: [
        { id: 'employees', label: 'بيانات الموظفين', icon: '👤' },
        { id: 'attendance', label: 'الحضور والغياب', icon: '📋' },
        { id: 'absenceReport', label: 'تقرير الغائبين', icon: '🚫' },
        { id: 'delays', label: 'التأخيرات', icon: '⏰' },
        { id: 'leaveBalance', label: 'رصيد الإجازات', icon: '🏖️' },
        { id: 'earlyDeparture', label: 'انصراف نصف يوم', icon: '🚪' },
      ]
    },
    {
      key: 'financial',
      label: '💰 المالية والرواتب',
      items: [
        { id: 'salaries', label: 'الرواتب والمستحقات', icon: '💰' },
        { id: 'loans', label: 'السلف الشهرية', icon: '💳' },
        { id: 'loansAdvanced', label: 'السلف العادية والاستثنائية', icon: '📑' },
        { id: 'deductions', label: 'الخصومات (انتاج)', icon: '✂️' },
        { id: 'transportation', label: 'بدل المواصلات', icon: '🚌' },
        { id: 'overtime', label: 'الإضافي', icon: '⌚' },
      ]
    },
    {
      key: 'incentives',
      label: '🏆 الحوافز والمكافآت',
      items: [
        { id: 'incentives', label: 'حوافز الانتاج', icon: '🏭' },
        { id: 'fixedIncentives', label: 'حوافز الثابتة', icon: '🎯' },
      ]
    },
    {
      key: 'welfare',
      label: '🏥 شؤون الموظفين',
      items: [
        { id: 'medicalCases', label: 'الحالات المرضية', icon: '💊' },
        { id: 'interviews', label: 'المقابلات والتوظيف', icon: '🤝' },
      ]
    },
    {
      key: 'tasks',
      label: '📊 المتابعة والتقارير',
      items: [
        { id: 'tasks', label: 'المهام الشهرية', icon: '✅' },
        { id: 'reports', label: 'التقارير', icon: '📊' },
      ]
    },
  ];

  const toggleSection = (key) => {
    setOpenSection(prev => prev === key ? '' : key);
  };

  return (
    <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col shadow-2xl min-h-screen">
      {/* Logo */}
      <div className="p-5 border-b border-blue-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-900 font-bold text-lg shadow">
            HR
          </div>
          <div>
            <div className="font-bold text-base leading-tight">نظام الموارد البشرية</div>
            <div className="text-blue-300 text-xs">إدارة شاملة للعمالة</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-0.5">
        {sections.map(section => (
          <div key={section.key}>
            {/* لوحة التحكم بدون header */}
            {section.key === 'main' ? (
              section.items.map(item => (
                <button key={item.id} onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-right transition-all duration-200 mb-1 ${
                    activeTab === item.id
                      ? 'bg-white text-blue-900 shadow-lg font-semibold'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}>
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </button>
              ))
            ) : (
              <>
                <button onClick={() => toggleSection(section.key)}
                  className="w-full flex items-center justify-between px-3 py-2 mt-1 text-blue-300 hover:text-white text-xs font-semibold tracking-wide transition rounded-lg hover:bg-blue-800">
                  <span>{section.label}</span>
                  <span>{openSection === section.key ? '▾' : '▸'}</span>
                </button>
                {openSection === section.key && (
                  <div className="space-y-0.5 mt-0.5">
                    {section.items.map(item => (
                      <button key={item.id} onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-right transition-all duration-200 ${
                          activeTab === item.id
                            ? 'bg-white text-blue-900 shadow-lg font-semibold'
                            : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                        }`}>
                        <span className="text-base">{item.icon}</span>
                        <span className="text-sm">{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-700 text-center">
        <div className="text-blue-300 text-xs">سبتمبر 2026</div>
        <div className="text-blue-400 text-xs mt-0.5">إصدار 2.0</div>
      </div>
    </div>
  );
};

export default Sidebar;
