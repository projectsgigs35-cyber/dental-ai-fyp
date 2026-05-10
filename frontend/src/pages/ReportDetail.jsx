import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiDownload, FiArrowLeft, FiUser, FiCalendar, FiPhone } from 'react-icons/fi';

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/reports/${id}`)
      .then((r) => setReport(r.data))
      .catch(() => toast.error('Report not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = async () => {
    try {
      const res = await api.get(`/reports/${id}/download`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${report.patientName.replace(/\s/g, '_')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('PDF downloaded!');
    } catch {
      toast.error('PDF not ready yet');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!report) return (
    <div className="text-center py-20 text-gray-400">Report not found</div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button onClick={() => navigate('/reports')} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white text-sm font-medium transition-colors">
          <FiArrowLeft className="w-4 h-4" /> Back to Reports
        </button>
        <button onClick={handleDownload} className="btn-primary flex items-center gap-2 text-sm">
          <FiDownload className="w-4 h-4" /> Download PDF
        </button>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Detection Report</h1>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${report.detectionType === 'opg' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'}`}>
            {report.detectionType.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-6">
          <div><p className="text-xs text-gray-400">Patient</p><p className="font-medium text-gray-800 dark:text-gray-200">{report.patientName}</p></div>
          <div><p className="text-xs text-gray-400">Age</p><p className="font-medium text-gray-800 dark:text-gray-200">{report.patientAge} years</p></div>
          <div><p className="text-xs text-gray-400">Gender</p><p className="font-medium text-gray-800 dark:text-gray-200 capitalize">{report.patientGender}</p></div>
          <div><p className="text-xs text-gray-400">Contact</p><p className="font-medium text-gray-800 dark:text-gray-200">{report.patientContact}</p></div>
          <div><p className="text-xs text-gray-400">Date</p><p className="font-medium text-gray-800 dark:text-gray-200">{new Date(report.createdAt).toLocaleString()}</p></div>
        </div>

        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">AI Summary</p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
            {report.summary}
          </div>
        </div>

        {report.detections.length > 0 ? (
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Findings ({report.detections.length})</p>
            <div className="space-y-2">
              {report.detections.map((d, i) => (
                <div key={i} className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl px-4 py-2.5">
                  <span className="text-sm font-medium text-red-700 dark:text-red-400 capitalize">{d.class}</span>
                  <span className="text-xs font-bold text-white bg-red-500 px-2.5 py-0.5 rounded-full">{(d.confidence * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-6 flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl px-4 py-3">
            <span className="text-green-600 text-lg">✓</span>
            <span className="text-sm font-medium text-green-700 dark:text-green-400">No pathologies detected</span>
          </div>
        )}

        {report.annotatedImage && (
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Annotated Image</p>
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <img src={`${API_HOST}${report.annotatedImage}`} alt="Annotated" className="w-full object-contain max-h-96" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}