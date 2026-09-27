import React, { useState } from 'react';
import {
  LayoutDashboard, Users, ClipboardList, Fingerprint, Ban, Clock,
  Umbrella, LogOut, DollarSign, CreditCard, FileText, Scissors,
  Bus, Timer, FileCheck, Award, Target, Pill, Handshake, Flag, Gift, Scale, ArrowLeftRight,
  CheckSquare, FileBarChart, BarChart3, ChevronDown,
  PanelLeftClose, PanelLeftOpen, X, Building2,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Data. Kept outside the component so it isn't rebuilt on every render.
// ---------------------------------------------------------------------------
const SECTIONS = [
  {
    key: 'main',
    label: null,
    items: [
      { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    ],
  },
  {
    key: 'employees',
    label: 'الموظفون',
    items: [
      { id: 'employees', label: 'بيانات الموظفين', icon: Users },
      { id: 'departments', label: 'إدارة الأقسام', icon: Building2 },
      { id: 'attendance', label: 'الحضور والغياب', icon: ClipboardList },
      { id: 'fingerprintImport', label: 'استيراد البصمة', icon: Fingerprint },
      { id: 'absenceReport', label: 'تقرير الغائبين', icon: Ban },
      { id: 'delays', label: 'التأخيرات', icon: Clock },
      { id: 'leaveBalance', label: 'رصيد الإجازات', icon: Umbrella },
      { id: 'earlyDeparture', label: 'انصراف نصف يوم', icon: LogOut },
    ],
  },
  {
    key: 'financial',
    label: 'المالية والرواتب',
    items: [
      { id: 'salaries', label: 'الرواتب والمستحقات', icon: DollarSign },
      { id: 'loans', label: 'السلف الشهرية', icon: CreditCard },
      { id: 'loansAdvanced', label: 'السلف العادية والاستثنائية', icon: FileText },
      { id: 'deductions', label: 'الخصومات (انتاج)', icon: Scissors },
      { id: 'transportation', label: 'بدل المواصلات', icon: Bus },
      { id: 'overtime', label: 'الإضافي', icon: Timer },
      { id: 'paymentForms', label: 'نماذج الصرف', icon: FileCheck },
      { id: 'salaryDifferences', label: 'فرق القبض والتسويات', icon: ArrowLeftRight },
    ],
  },
  {
    key: 'incentives',
    label: 'الحوافز والمكافآت',
    items: [
      { id: 'incentives', label: 'حوافز الانتاج', icon: Award },
      { id: 'fixedIncentives', label: 'حوافز الثابتة', icon: Target },
    ],
  },
  {
    key: 'welfare',
    label: 'شؤون الموظفين',
    items: [
      { id: 'medicalCases', label: 'الحالات المرضية', icon: Pill },
      { id: 'grants', label: 'المنح والإعانات', icon: Gift },
      { id: 'decisions', label: 'القرارات الإدارية', icon: Scale },
      { id: 'interviews', label: 'المقابلات والتوظيف', icon: Handshake },
      { id: 'recruitment', label: 'طلبات التوظيف', icon: ClipboardList },
      { id: 'clearance', label: 'التصفية (نهاية الخدمة)', icon: Flag },
    ],
  },
  {
    key: 'tasks',
    label: 'المتابعة والتقارير',
    items: [
      { id: 'tasks', label: 'المهام الشهرية', icon: CheckSquare },
      { id: 'monthlyReport', label: 'الشيت الشهري للمدير', icon: FileBarChart },
      { id: 'reports', label: 'التقارير', icon: BarChart3 },
    ],
  },
];

const sectionOf = (tabId) =>
  SECTIONS.find((s) => s.items.some((i) => i.id === tabId))?.key ?? 'main';

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------
const Sidebar = ({ activeTab, setActiveTab }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSection, setOpenSection] = useState(() => sectionOf(activeTab));

  const toggleSection = (key) =>
    setOpenSection((prev) => (prev === key ? '' : key));

  const handleSelect = (id) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  const width = collapsed ? 'w-[76px]' : 'w-72';

  const renderItem = (item) => {
    const active = activeTab === item.id;
    return (
      <button
        key={item.id}
        onClick={() => handleSelect(item.id)}
        title={collapsed ? item.label : undefined}
        aria-current={active ? 'page' : undefined}
        className={`
          group relative w-full flex items-center gap-3 rounded-xl
          text-sm transition-all duration-200
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F9DDE]
          ${collapsed ? 'justify-center px-0 py-3' : 'px-4 py-3'}
          ${
            active
              ? 'bg-white/15 text-white font-medium shadow-lg'
              : 'text-[#B9D3EC] hover:bg-white/10 hover:text-white'
          }
        `}
      >
        {active && (
          <span className="absolute right-0 top-2 bottom-2 w-[4px] rounded-full bg-[#4F9DDE] transition-all duration-200 shadow-lg shadow-[#4F9DDE]/50" />
        )}
        <item.icon
          size={collapsed ? 22 : 20}
          strokeWidth={2}
          className={`shrink-0 transition-colors duration-200 ${active ? 'text-[#7CC0F5]' : ''}`}
        />
        <span
          className={`truncate transition-all duration-200 ${
            collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
          }`}
        >
          {item.label}
        </span>

        {collapsed && (
          <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-[#0F2942] px-3 py-2 text-sm text-white opacity-0 translate-x-2 shadow-xl transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 z-10 border border-white/10">
            {item.label}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile scrim */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity duration-300 backdrop-blur-sm ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className={`fixed top-1.5 md:top-4 right-4  z-50 flex items-center justify-center md:w-12 md:h-12  w-11 h-11 rounded-xl bg-gradient-to-r from-[#163A63] to-[#214B78] text-white shadow-xl lg:hidden transition-all duration-200 hover:scale-105 active:scale-95 ${
          mobileOpen ? 'pointer-events-none opacity-0 scale-90' : 'opacity-100 scale-100'
        }`}
        aria-label="فتح القائمة الجانبية"
      >
        <PanelLeftOpen   strokeWidth={2.5} className="w-6 h-6" />
      </button>

      <aside
        dir="rtl"
        className={`
          ${width} shrink-0 min-h-screen flex flex-col
          bg-gradient-to-b from-[#0F2942] to-[#1B3D63] text-white
          shadow-2xl
          fixed inset-y-0 right-0 z-50
          transition-[width,transform] duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-white/10 overflow-hidden">
          <div className="w-12 h-12 shrink-0 bg-white rounded-xl flex items-center justify-center text-[#123256] font-bold shadow-lg">
            HR
          </div>
          <div
            className={`min-w-0 flex-1 transition-all duration-200 ${
              collapsed ? 'opacity-0 -translate-x-2 w-0' : 'opacity-100 translate-x-0 w-auto'
            }`}
          >
            <div className="font-semibold text-base leading-tight truncate">
              نظام الموارد البشرية
            </div>
            <div className="text-[#6FA8DC] text-xs mt-1 truncate">
              إدارة شاملة للعمالة
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-[#8FB8E0] hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="إغلاق"
          >
            <X size={24} strokeWidth={2} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto overflow-x-hidden space-y-1">
          {SECTIONS.map((section, idx) => {
            const isMain = section.key === 'main';
            const isOpen = isMain || openSection === section.key;

            return (
              <div key={section.key}>
                {!isMain && collapsed && idx > 1 && (
                  <div className="my-2 border-t border-white/10" />
                )}

                {!isMain && !collapsed && (
                  <button
                    onClick={() => toggleSection(section.key)}
                    className="w-full flex items-center justify-between px-3 py-3 mt-4 text-[#6FA8DC] hover:text-white text-xs font-semibold tracking-wide rounded-lg hover:bg-white/5 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span>{section.label}</span>
                    <ChevronDown
                      size={16}
                      strokeWidth={2.5}
                      className={`transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                )}

                {isMain || collapsed ? (
                  <div className="space-y-1">{section.items.map(renderItem)}</div>
                ) : (
                  // Grid-rows trick: animates 0fr -> 1fr so the group
                  // expands/collapses smoothly without a fixed max-height.
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="space-y-1 mt-2">{section.items.map(renderItem)}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-4 flex items-center justify-between overflow-hidden">
          <span
            className={`text-[#5C82A8] text-xs whitespace-nowrap transition-all duration-200 ${
              collapsed ? 'opacity-0 -translate-x-2 w-0' : 'opacity-100 translate-x-0 w-auto'
            }`}
          >
            سبتمبر 2026 · إصدار 2.0
          </span>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="hidden lg:flex items-center justify-center w-9 h-9 rounded-xl text-[#8FB8E0] hover:bg-white/10 hover:text-white transition-colors shrink-0"
            aria-label={collapsed ? 'توسيع القائمة' : 'طي القائمة'}
          >
            {collapsed ? <PanelLeftOpen size={20} strokeWidth={2} /> : <PanelLeftClose size={20} strokeWidth={2} />}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;