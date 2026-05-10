import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiSun, FiMoon, FiSave, FiLock, FiUpload } from 'react-icons/fi';
import { API_HOST } from '../api/config';

export default function Settings() {
  const { doctor, updateDoctor } = useAuth();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const pictureRef = useRef();

  const [form, setForm] = useState({
    name: doctor?.name || '',
    degrees: doctor?.degrees || '',
    clinicName: doctor?.clinicName || '',
    clinicAddress: doctor?.clinicAddress || '',
    contactNo: doctor?.contactNo || '',
    yearsOfExperience: doctor?.yearsOfExperience || '',
    picture: null,
  });

  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const update = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== null && v !== undefined && v !== '') data.append(k, v); });
      const res = await api.put('/doctors/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateDoctor(res.data.doctor);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  const handlePassword = async () => {
    if (!passwords.currentPassword) return toast.error('Enter current password');
    if (passwords.newPassword !== passwords.confirm) return toast.error('Passwords do not match');
    if (passwords.newPassword.length < 6) return toast.error('Password too short');
    setLoading(true);
    try {
      await api.put('/doctors/change-password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password changed!');
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  };

  const inputClass = 'input-field';
  const labelClass = 'block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your profile and preferences</p>
      </div>

      <div className="card">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Appearance</p>
        <div className="flex gap-3">
          {[{ val: 'light', label: 'Light Mode', Icon: FiSun }, { val: 'dark', label: 'Dark Mode', Icon: FiMoon }].map(({ val, label, Icon }) => (
            <button key={val} onClick={() => setTheme(val)} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-medium transition-all ${theme === val ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Edit Profile</p>
        <div className="flex items-center gap-4 mb-5">
          {preview ? <img src={preview} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-blue-200" />
            : doctor?.picture ? <img src={`${API_HOST}${doctor.picture}`} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
            : <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">{doctor?.name?.charAt(0)}</div>}
          <button onClick={() => pictureRef.current.click()} className="btn-secondary text-sm flex items-center gap-2">
            <FiUpload className="w-4 h-4" /> Change Photo
          </button>
          <input ref={pictureRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files[0]; if (f) { update('picture', f); setPreview(URL.createObjectURL(f)); } }} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelClass}>Full Name</label><input className={inputClass} value={form.name} onChange={(e) => update('name', e.target.value)} /></div>
          <div><label className={labelClass}>Degrees</label><input className={inputClass} value={form.degrees} onChange={(e) => update('degrees', e.target.value)} /></div>
          <div><label className={labelClass}>Clinic Name</label><input className={inputClass} value={form.clinicName} onChange={(e) => update('clinicName', e.target.value)} /></div>
          <div><label className={labelClass}>Contact</label><input className={inputClass} value={form.contactNo} onChange={(e) => update('contactNo', e.target.value)} /></div>
          <div><label className={labelClass}>Experience (years)</label><input type="number" className={inputClass} value={form.yearsOfExperience} onChange={(e) => update('yearsOfExperience', e.target.value)} /></div>
          <div className="col-span-2"><label className={labelClass}>Clinic Address</label><textarea rows={2} className={inputClass} value={form.clinicAddress} onChange={(e) => update('clinicAddress', e.target.value)} /></div>
        </div>
        <button onClick={handleSave} disabled={loading} className="btn-primary flex items-center gap-2 mt-4">
          <FiSave className="w-4 h-4" />{loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="card">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2"><FiLock className="w-4 h-4" /> Change Password</p>
        <div className="space-y-3">
          <div><label className={labelClass}>Current Password</label><input type="password" className={inputClass} value={passwords.currentPassword} onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))} /></div>
          <div><label className={labelClass}>New Password</label><input type="password" className={inputClass} value={passwords.newPassword} onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))} /></div>
          <div><label className={labelClass}>Confirm Password</label><input type="password" className={inputClass} value={passwords.confirm} onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))} /></div>
        </div>
        <button onClick={handlePassword} disabled={loading} className="btn-primary flex items-center gap-2 mt-4">
          <FiLock className="w-4 h-4" />{loading ? 'Updating...' : 'Update Password'}
        </button>
      </div>

      <div className="card">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Account Information</p>
        <div className="space-y-2 text-sm">
          {[['Email', doctor?.email], ['CNIC', doctor?.cnic], ['Member Since', new Date(doctor?.createdAt).toLocaleDateString()]].map(([label, value]) => (
            <div key={label} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
              <span className="text-gray-400">{label}</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">{value || '—'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}