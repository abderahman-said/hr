import React, { useState } from 'react';
import { taskTypes } from '../data/initialData';
import { Plus, Check, X, Calendar, Trash2, Clock, CheckCircle2 } from 'lucide-react';

const Tasks = ({ tasks, setTasks }) => {
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'done'
  const [filterType, setFilterType] = useState('');
  const [form, setForm] = useState({ task: '', date: '', type: 'رواتب', note: '', done: false });

  const handleAdd = () => {
    if (!form.task) return alert('يرجى إدخال المهمة');
    setTasks(prev => [{ ...form, id: Date.now() }, ...prev]);
    setForm({ task: '', date: '', type: 'رواتب', note: '', done: false });
    setShowModal(false);
  };

  const toggleDone = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const handleDelete = (id) => setTasks(prev => prev.filter(t => t.id !== id));

  const filtered = tasks.filter(t => {
    const matchFilter = filter === 'all' || (filter === 'pending' && !t.done) || (filter === 'done' && t.done);
    const matchType = !filterType || t.type === filterType;
    return matchFilter && matchType;
  });

  const done = tasks.filter(t => t.done).length;
  const pending = tasks.filter(t => !t.done).length;
  const progress = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;

  const typeColors = {
    'رواتب': 'bg-[#10B981]/10 text-[#10B981]',
    'مالي': 'bg-[#F59E0B]/10 text-[#F59E0B]',
    'غياب': 'bg-[#EF4444]/10 text-[#EF4444]',
    'حوافز': 'bg-[#8B5CF6]/10 text-[#8B5CF6]',
    'حضور': 'bg-[#163A63]/10 text-[#163A63]',
    'أخري': 'bg-[#718096]/10 text-[#718096]',
  };

  const isOverdue = (dateStr) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date() && true;
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172B45]">المهام الشهرية</h1>
          <p className="text-[#718096] text-sm">{done} منجزة من {tasks.length}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-gradient-to-r from-[#163A63] to-[#214B78] hover:from-[#214B78] hover:to-[#3974B8] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-md transition text-sm">
          <Plus size={16} sm:size={18} strokeWidth={2} /> إضافة مهمة
        </button>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#E2E8F0]">
        <div className="flex justify-between items-center mb-2 sm:mb-3">
          <span className="font-semibold text-[#718096] text-sm">تقدم إنجاز المهام</span>
          <span className="font-bold text-[#163A63] text-base sm:text-lg">{progress}%</span>
        </div>
        <div className="w-full bg-[#F5F7FA] rounded-full h-2 sm:h-3">
          <div className="bg-gradient-to-r from-[#163A63] to-[#3974B8] h-2 sm:h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex gap-3 sm:gap-4 mt-2 sm:mt-3 text-xs sm:text-sm">
          <span className="text-[#10B981] flex items-center gap-1.5"><CheckCircle2 size={12} sm:size={14} strokeWidth={2} /> {done} منجزة</span>
          <span className="text-[#F59E0B] flex items-center gap-1.5"><Clock size={12} sm:size={14} strokeWidth={2} /> {pending} معلقة</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-[#E2E8F0] flex flex-col sm:flex-wrap gap-3">
        <div className="flex gap-2 w-full sm:w-auto">
          {[['all', 'الكل'], ['pending', 'معلقة'], ['done', 'منجزة']].map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)} className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition ${filter === v ? 'bg-[#163A63] text-white' : 'bg-[#F5F7FA] text-[#718096] hover:bg-[#E2E8F0]'}`}>{l}</button>
          ))}
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border border-[#E2E8F0] rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10">
          <option value="">كل الأنواع</option>
          {taskTypes.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filtered.map(task => (
          <div key={task.id} className={`bg-white rounded-2xl p-4 shadow-sm border transition ${task.done ? 'border-[#10B981]/30 opacity-75' : !task.date || isOverdue(task.date) ? 'border-[#F59E0B]/30' : 'border-[#E2E8F0]'} hover:shadow-md`}>
            <div className="flex items-start gap-4">
              <button onClick={() => toggleDone(task.id)} className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${task.done ? 'bg-[#10B981] border-[#10B981] text-white' : 'border-[#E2E8F0] hover:border-[#3974B8]'}`}>
                {task.done && <Check size={12} strokeWidth={3} />}
              </button>
              <div className="flex-1">
                <div className={`font-medium ${task.done ? 'line-through text-[#718096]' : 'text-[#172B45]'}`}>{task.task}</div>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {task.date && (
                    <span className={`text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 ${!task.done && isOverdue(task.date) ? 'bg-[#EF4444]/10 text-[#EF4444]' : 'bg-[#F5F7FA] text-[#718096]'}`}>
                      <Calendar size={12} strokeWidth={2} /> {task.date}
                    </span>
                  )}
                  <span className={`text-xs px-2.5 py-0.5 rounded-full ${typeColors[task.type] || 'bg-[#F5F7FA] text-[#718096]'}`}>{task.type}</span>
                  {task.note && <span className="text-xs text-[#718096] bg-[#F5F7FA] px-2.5 py-0.5 rounded-full">💬 {task.note}</span>}
                </div>
              </div>
              <button onClick={() => handleDelete(task.id)} className="text-[#EF4444]/60 hover:text-[#EF4444] hover:bg-[#EF4444]/10 p-1.5 rounded-lg transition flex-shrink-0">
                <Trash2 size={18} strokeWidth={2} />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center text-[#718096] shadow-sm border border-[#E2E8F0]">
            {filter === 'done' ? 'لا توجد مهام منجزة بعد' : 'لا توجد مهام معلقة'}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4 sm:mb-5">
              <h2 className="text-base sm:text-lg font-bold text-[#172B45]">إضافة مهمة جديدة</h2>
              <button onClick={() => setShowModal(false)} className="text-[#718096] hover:text-[#172B45] transition">
                <X size={20} sm:size={24} strokeWidth={2} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#718096] mb-1">المهمة *</label>
                <input type="text" value={form.task} onChange={e => setForm(prev => ({ ...prev, task: e.target.value }))}
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10" placeholder="اكتب المهمة..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#718096] mb-1">التاريخ</label>
                  <input type="date" value={form.date} onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#718096] mb-1">النوع</label>
                  <select value={form.type} onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10">
                    {taskTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#718096] mb-1">ملاحظة</label>
                <textarea value={form.note} onChange={e => setForm(prev => ({ ...prev, note: e.target.value }))} rows={2}
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3974B8] focus:ring-2 focus:ring-[#3974B8]/10 resize-none" placeholder="أي ملاحظات إضافية..." />
              </div>
            </div>
            <div className="flex gap-3 mt-4 sm:mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 sm:py-2.5 border border-[#E2E8F0] rounded-xl text-[#718096] hover:bg-[#F5F7FA] transition text-sm">إلغاء</button>
              <button onClick={handleAdd} className="flex-1 py-2 sm:py-2.5 bg-gradient-to-r from-[#163A63] to-[#214B78] hover:from-[#214B78] hover:to-[#3974B8] text-white rounded-xl font-medium shadow-md transition text-sm">حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
