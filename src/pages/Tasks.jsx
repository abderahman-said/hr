import React, { useState } from 'react';
import { taskTypes } from '../data/initialData';

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
    'رواتب': 'bg-green-100 text-green-700',
    'مالي': 'bg-orange-100 text-orange-700',
    'غياب': 'bg-red-100 text-red-700',
    'حوافز': 'bg-purple-100 text-purple-700',
    'حضور': 'bg-blue-100 text-blue-700',
    'أخري': 'bg-gray-100 text-gray-700',
  };

  const isOverdue = (dateStr) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date() && true;
  };

  return (
    <div className="p-6 space-y-5 fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">المهام الشهرية</h1>
          <p className="text-gray-500 text-sm">{done} منجزة من {tasks.length}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition">
          + إضافة مهمة
        </button>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold text-gray-700">تقدم إنجاز المهام</span>
          <span className="font-bold text-teal-600 text-lg">{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div className="bg-gradient-to-r from-teal-400 to-teal-600 h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex gap-4 mt-3 text-sm">
          <span className="text-green-600">✅ {done} منجزة</span>
          <span className="text-orange-500">⏳ {pending} معلقة</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3">
        <div className="flex gap-2">
          {[['all', 'الكل'], ['pending', 'معلقة'], ['done', 'منجزة']].map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filter === v ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{l}</button>
          ))}
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300">
          <option value="">كل الأنواع</option>
          {taskTypes.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filtered.map(task => (
          <div key={task.id} className={`bg-white rounded-2xl p-4 shadow-sm border transition ${task.done ? 'border-green-100 opacity-75' : !task.date || isOverdue(task.date) ? 'border-orange-200' : 'border-gray-100'} hover:shadow-md`}>
            <div className="flex items-start gap-4">
              <button onClick={() => toggleDone(task.id)} className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${task.done ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-teal-400'}`}>
                {task.done && <span className="text-xs">✓</span>}
              </button>
              <div className="flex-1">
                <div className={`font-medium ${task.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.task}</div>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {task.date && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${!task.done && isOverdue(task.date) ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                      📅 {task.date}
                    </span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[task.type] || 'bg-gray-100 text-gray-600'}`}>{task.type}</span>
                  {task.note && <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">💬 {task.note}</span>}
                </div>
              </div>
              <button onClick={() => handleDelete(task.id)} className="text-red-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition flex-shrink-0">🗑️</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center text-gray-400 shadow-sm border border-gray-100">
            {filter === 'done' ? '🎉 لا توجد مهام منجزة بعد' : '✅ لا توجد مهام معلقة'}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-800">إضافة مهمة جديدة</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المهمة *</label>
                <input type="text" value={form.task} onChange={e => setForm(prev => ({ ...prev, task: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" placeholder="اكتب المهمة..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
                  <input type="date" value={form.date} onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">النوع</label>
                  <select value={form.type} onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300">
                    {taskTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظة</label>
                <textarea value={form.note} onChange={e => setForm(prev => ({ ...prev, note: e.target.value }))} rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 resize-none" placeholder="أي ملاحظات إضافية..." />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">إلغاء</button>
              <button onClick={handleAdd} className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium shadow-sm transition">حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
