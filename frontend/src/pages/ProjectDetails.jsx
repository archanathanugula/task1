import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Plus, UserPlus, Trash2 } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', assigned_to: '', due_date: '' });
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const projRes = await api.get(`/projects/${id}`);
      const tasksRes = await api.get(`/tasks?projectId=${id}`);
      setProject(projRes.data);
      setTasks(tasksRes.data);
      if (user?.role === 'Admin') {
        const usersRes = await api.get('/auth/all-users');
        setUsers(usersRes.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...newTask, project_id: id });
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', assigned_to: '', due_date: '' });
      fetchData();
    } catch (err) {
      alert('Failed to create task');
    }
  };

  const handleAddMember = async (userId) => {
    try {
      await api.put(`/projects/${id}/add-member`, { userId });
      setShowMemberModal(false);
      fetchData();
    } catch (err) {
      alert('Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    try {
      await api.put(`/projects/${id}/remove-member`, { userId });
      fetchData();
    } catch (err) {
      alert('Failed to remove member');
    }
  };

  if (!project) return <div className="text-center py-20">Loading Project...</div>;

  return (
    <div className="animate-fade-in space-y-8">
      <header className="flex justify-between items-start">
        <div>
          <button onClick={() => navigate('/projects')} className="text-sm text-blue-600 hover:underline mb-2 flex items-center gap-1">
            &larr; Back to Projects
          </button>
          <h1 className="text-4xl font-bold text-slate-900">{project.name}</h1>
          <p className="text-slate-500 mt-2 text-lg">{project.description || 'No description provided.'}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Tasks</h2>
            {user?.role === 'Admin' && (
              <button onClick={() => setShowTaskModal(true)} className="btn btn-primary btn-sm flex items-center gap-2">
                <Plus size={18} /> Add Task
              </button>
            )}
          </div>
          <div className="task-list">
            {tasks.length === 0 ? (
              <div className="card text-center py-12 text-slate-400 border-dashed">No tasks assigned yet.</div>
            ) : (
              tasks.map(task => (
                <div key={task.id} className="task-item bg-white">
                  <div>
                    <h4 className="font-semibold text-slate-800">{task.title}</h4>
                    <p className="text-xs text-slate-500">Assigned to: {task.assigned_to_name}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase ${getStatusClass(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <aside>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Project Team</h2>
            {user?.role === 'Admin' && (
              <button onClick={() => setShowMemberModal(true)} className="text-blue-600 hover:text-blue-800 p-1">
                <UserPlus size={22} />
              </button>
            )}
          </div>
          <div className="card bg-white space-y-4">
            {project.members?.map(member => (
              <div key={member.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{member.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-medium">{member.role}</p>
                  </div>
                </div>
                {user?.role === 'Admin' && project.created_by !== member.id && (
                  <button 
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
                    title="Remove member"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>


      {showTaskModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="card w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input type="text" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Assign To</label>
                <select value={newTask.assigned_to} onChange={(e) => setNewTask({...newTask, assigned_to: e.target.value})} required>
                  <option value="">Select User</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input type="date" value={newTask.due_date} onChange={(e) => setNewTask({...newTask, due_date: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowTaskModal(false)} className="btn bg-slate-700">Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMemberModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="card w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Team Member</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {users.filter(u => !project.members.some(m => m.id === u.id)).map(u => (
                <div key={u.id} className="flex justify-between items-center p-3 hover:bg-slate-800 rounded cursor-pointer" onClick={() => handleAddMember(u.id)}>
                  <span>{u.name} ({u.role})</span>
                  <Plus size={16} />
                </div>
              ))}
            </div>
            <button onClick={() => setShowMemberModal(false)} className="btn bg-slate-700 w-full mt-6">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

const getStatusClass = (status) => {
  switch(status) {
    case 'Completed': return 'text-green-500';
    case 'In Progress': return 'text-blue-500';
    default: return 'text-yellow-500';
  }
};

export default ProjectDetails;
