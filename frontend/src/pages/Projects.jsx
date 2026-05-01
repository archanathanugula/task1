import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Plus, ArrowRight } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProj, setNewProj] = useState({ name: '', description: '' });
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProj);
      setShowModal(false);
      setNewProj({ name: '', description: '' });
      fetchProjects();
    } catch (err) {
      alert('Failed to create project');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        {user?.role === 'Admin' && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center gap-2">
            <Plus size={20} /> New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <p className="text-slate-400">No projects found.</p>
        ) : (
          projects.map(p => (
            <div 
              key={p.id} 
              onClick={() => navigate(`/projects/${p.id}`)}
              className="card cursor-pointer hover:border-blue-500 transition-colors group"
            >
              <h3 className="text-xl font-bold mb-2 flex justify-between items-center">
                {p.name}
                <ArrowRight className="text-slate-600 group-hover:text-blue-500 transition-colors" size={20} />
              </h3>
              <p className="text-slate-400 text-sm line-clamp-2">{p.description || 'No description'}</p>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="card w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Project</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Name</label>
                <input type="text" value={newProj.name} onChange={(e) => setNewProj({...newProj, name: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea rows="3" value={newProj.description} onChange={(e) => setNewProj({...newProj, description: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="btn bg-slate-700 hover:bg-slate-600">Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
