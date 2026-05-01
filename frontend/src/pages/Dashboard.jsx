import { useState, useEffect } from 'react';
import api from '../api';
import { CheckCircle2, Clock, ListTodo, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get('/dashboard');
        const tasksRes = await api.get('/tasks');
        setStats(statsRes.data);
        setTasks(tasksRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleStatusUpdate = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      const [statsRes, tasksRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/tasks')
      ]);
      setStats(statsRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      alert('Failed to update task');
    }
  };

  if (!stats) return <div className="text-center py-10">Loading Dashboard...</div>;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Overview</h1>
        <div className="text-sm text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>
      
      <div className="stats-grid">
        <StatCard 
          icon={<ListTodo size={24} className="text-blue-600" />} 
          bgColor="bg-blue-50"
          label="Total Tasks" 
          value={stats.total} 
        />
        <StatCard 
          icon={<CheckCircle2 size={24} className="text-green-600" />} 
          bgColor="bg-green-50"
          label="Completed" 
          value={stats.completed} 
        />
        <StatCard 
          icon={<Clock size={24} className="text-yellow-600" />} 
          bgColor="bg-yellow-50"
          label="Pending" 
          value={stats.pending} 
        />
        <StatCard 
          icon={<AlertTriangle size={24} className="text-red-600" />} 
          bgColor="bg-red-50"
          label="Overdue" 
          value={stats.overdueCount} 
        />
      </div>

      <section>
        <h2 className="text-xl font-bold mb-5">Assigned Tasks</h2>
        <div className="task-list">
          {tasks.length === 0 ? (
            <div className="card text-center py-10 text-slate-400">No tasks assigned yet.</div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className="task-item">
                <div>
                  <h3 className="font-semibold text-slate-800">{task.title}</h3>
                  <p className="text-xs text-slate-500">Project: {task.project_name}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Due Date</p>
                    <p className="text-xs font-medium text-slate-600">{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}</p>
                  </div>
                  <select 
                    value={task.status} 
                    onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
                    className={`text-xs font-bold py-1 px-3 rounded-full border-none cursor-pointer ${getStatusClass(task.status)}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ icon, label, value, bgColor }) => (
  <div className="stat-card">
    <div className={`stat-icon ${bgColor}`}>{icon}</div>
    <div className="stat-info">
      <p>{label}</p>
      <p>{value}</p>
    </div>
  </div>
);


const getStatusClass = (status) => {
  switch(status) {
    case 'Completed': return 'bg-green-500/20 text-green-500';
    case 'In Progress': return 'bg-blue-500/20 text-blue-500';
    default: return 'bg-yellow-500/20 text-yellow-500';
  }
};

export default Dashboard;
