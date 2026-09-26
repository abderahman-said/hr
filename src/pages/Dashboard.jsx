import React from 'react';

const StatCard = ({ title, value, subtitle, icon, color, trend }) => {
  const colorMap = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
    teal: 'from-teal-500 to-teal-600',
  };

  return (
    <div className={`stat-card bg-gradient-to-br ${colorMap[color] || colorMap.blue} text-white rounded-2xl p-5 shadow-lg`}>
      <div className="flex justify-between items-start mb-3">
        <div className="text-3xl">{icon}</div>
        {trend && (
          <span className={`text-xs px-2 py-1 rounded-full ${trend > 0 ? 'bg-white/20' : 'bg-white/20'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="font-semibold text-sm opacity-90">{title}</div>
      {subtitle && <div className="text-xs opacity-70 mt-1">{subtitle}</div>}
    </div>
  );
};

const Dashboard = ({ employees, tasks, loans, deductions, incentives }) => {
  const totalEmployees = employees.length;
  const productionEmployees = employees.filter(e => e.type === 'انتاج').length;
  const fixedEmployees = employees.filter(e => e.type === 'ثابت').length;
  const pendingTasks = tasks.filter(t => !t.done).length;
  const doneTasks = tasks.filter(t => t.done).length;
  const totalLoans = loans.reduce((s, l) => s + l.amount, 0);
  const totalDeductions = deductions.reduce((s, d) => s + d.amount, 0);
  const totalIncentives = incentives.reduce((s, i) => s + i.total, 0);
  const totalSalaries = employees.reduce((s, e) => s + e.salary, 0);

  const recentTasks = tasks.filter(t => !t.done).slice(0, 5);

  return (
    <div className="p-6 space-y-6 fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم الرئيسية</h1>
          <p className="text-gray-500 text-sm mt-1">إجمالي سبتمبر 2026</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 text-blue-700 text-sm font-medium">
          📅 سبتمبر 2026
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="إجمالي الموظفين" value={totalEmployees} subtitle={`${productionEmployees} إنتاج | ${fixedEmployees} ثابت`} icon="👥" color="blue" />
        <StatCard title="إجمالي الرواتب" value={`${totalSalaries.toLocaleString()} ج`} subtitle="هذا الشهر" icon="💰" color="green" />
        <StatCard title="إجمالي السلف" value={`${totalLoans.toLocaleString()} ج`} subtitle={`${loans.length} سلفة`} icon="💳" color="orange" />
        <StatCard title="الخصومات" value={`${totalDeductions.toLocaleString()} ج`} subtitle={`${deductions.length} خصم`} icon="✂️" color="red" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="الحوافز المستحقة" value={`${totalIncentives.toLocaleString()} ج`} subtitle={`${incentives.length} موظف`} icon="🏆" color="purple" />
        <StatCard title="المهام المنجزة" value={doneTasks} subtitle={`من أصل ${tasks.length} مهمة`} icon="✅" color="teal" />
        <StatCard title="مهام معلقة" value={pendingTasks} subtitle="تحتاج متابعة" icon="⏳" color="orange" />
        <StatCard title="الصافي المتوقع" value={`${(totalSalaries + totalIncentives - totalDeductions - totalLoans).toLocaleString()} ج`} subtitle="بعد الخصومات" icon="📊" color="blue" />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>⏳</span> المهام المعلقة
          </h2>
          {recentTasks.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">لا توجد مهام معلقة 🎉</p>
          ) : (
            <div className="space-y-3">
              {recentTasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className={`w-2 h-2 rounded-full ${
                    task.type === 'رواتب' ? 'bg-green-500' :
                    task.type === 'مالي' ? 'bg-orange-500' :
                    task.type === 'غياب' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">{task.task}</div>
                    <div className="text-xs text-gray-400">{task.date} • {task.type}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Department Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🏭</span> توزيع الموظفين بالأقسام
          </h2>
          {(() => {
            const deptMap = {};
            employees.forEach(e => {
              deptMap[e.department] = (deptMap[e.department] || 0) + 1;
            });
            return Object.entries(deptMap).map(([dept, count]) => (
              <div key={dept} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{dept}</span>
                  <span className="font-semibold text-gray-800">{count} موظف</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${(count / totalEmployees) * 100}%` }}
                  ></div>
                </div>
              </div>
            ));
          })()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
