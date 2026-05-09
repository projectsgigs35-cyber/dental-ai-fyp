import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { FiActivity, FiFileText, FiUser, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="card flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { doctor } = useAuth();
  const [stats, setStats] = useState({ total: 0, opg: 0, plaque: 0 });
  const [recentReports, setRecentReports] = useState([]);

  useEffect(() => {
    api.get('/doctors/stats').then((r) => setStats(r.data)).catch(() => {});
    api.get('/reports').then((r) => setRecentReports(r.data.slice(0, 5))).catch(() => {});
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Good morning, {doctor?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{doctor?.clinicName}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={FiFileText} label="Total Cases" value={stats.total} color="bg-blue-600" />
        <StatCard icon={FiActivity} label="OPG Detections" value={stats.opg} color="bg-violet-600" />
        <StatCard icon={FiActivity} label="Plaque Detections" value={stats.plaque} color="bg-amber-500" />
      </div>

      {/* Doctor info card */}
      <div className="card">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-4">Your Profile</h2>
        <div className="flex items-start gap-5">
          {doctor?.picture ? (
            <img src={`http://localhost:5000${doctor.picture}`} alt="Profile" className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-100 dark:border-gray-700" />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-2xl">
              {doctor?.name?.charAt(0)}
            </div>
          )}
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm flex-1">
            {[
              ['Name', doctor?.name],
              ['Degrees', doctor?.degrees],
              ['CNIC', doctor?.cnic],
              ['Contact', doctor?.contactNo],
              ['Clinic', doctor?.clinicName],
              ['Experience', `${doctor?.yearsOfExperience} years`],
              ['Email', doctor?.email],
              ['Address', doctor?.clinicAddress],
            ].map(([label, value]) => (
              <div key={label}>
                <span className="text-gray-400 text-xs">{label}</span>
                <p className="font-medium text-gray-800 dark:text-gray-200 text-sm truncate">{value || '—'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link to="/detection" className="card flex items-center gap-3 hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer transition-colors border border-gray-100 dark:border-gray-700 no-underline">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <FiActivity className="text-blue-600 dark:text-blue-400 w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 dark:text-white text-sm">New Detection</p>
              <p className="text-xs text-gray-400">Run OPG or Plaque AI</p>
            </div>
          </Link>
          <Link to="/reports" className="card flex items-center gap-3 hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer transition-colors border border-gray-100 dark:border-gray-700 no-underline">
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
              <FiFileText className="text-violet-600 dark:text-violet-400 w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 dark:text-white text-sm">View Reports</p>
              <p className="text-xs text-gray-400">Browse past detections</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent reports */}
      {recentReports.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-3">Recent Reports</h2>
          <div className="card overflow-hidden p-0">
            {recentReports.map((r, i) => (
              <Link
                key={r._id}
                to={`/reports/${r._id}`}
                className={`flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${i !== 0 ? 'border-t border-gray-100 dark:border-gray-700' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.detectionType === 'opg' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'}`}>
                    {r.detectionType.toUpperCase()}
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{r.patientName}</span>
                </div>
                <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}