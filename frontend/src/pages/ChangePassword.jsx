import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { KeyRound, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      return setError('New passwords do not match');
    }

    if (newPassword.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    setLoading(true);
    try {
      await axios.put('http://localhost:5000/api/auth/change-password', {
        oldPassword,
        newPassword
      });
      setSuccess('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-md mx-auto">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-6 text-sm font-medium"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <KeyRound size={24} />
          </div>
          <h2 className="text-2xl font-bold">Change Password</h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
            <CheckCircle2 size={16} /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label>Current Password</label>
            <input 
              type="password" 
              value={oldPassword} 
              onChange={(e) => setOldPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary w-full mt-4"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
