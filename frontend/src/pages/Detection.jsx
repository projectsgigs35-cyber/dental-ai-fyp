import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { FiUpload, FiActivity, FiImage } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Detection() {
  const [detectionType, setDetectionType] = useState('opg');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();
  const navigate = useNavigate();

  const [patient, setPatient] = useState({
    patientName: '', patientAge: '', patientGender: 'male', patientContact: '',
  });

  const update = (f, v) => setPatient((p) => ({ ...p, [f]: v }));

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!image) return toast.error('Upload a dental image first');
    if (!patient.patientName || !patient.patientAge || !patient.patientContact) {
      return toast.error('Fill in all patient details');
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append('image', image);
      form.append('detectionType', detectionType);
      Object.entries(patient).forEach(([k, v]) => form.append(k, v));
      const res = await api.post('/detections/run', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Detection complete!');
      navigate(`/reports/${res.data.report._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Detection failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'input-field';
  const labelClass = 'block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Detection</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Upload a dental image and run AI-powered analysis</p>
      </div>

      {/* Detection Type Selector */}
      <div className="card">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Select Detection Type</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'opg', label: 'OPG Detection', desc: 'Orthopantomogram analysis', color: 'blue' },
            { value: 'plaque', label: 'Plaque Detection', desc: 'Dental plaque & calculus', color: 'amber' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDetectionType(opt.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                detectionType === opt.value
                  ? opt.color === 'blue'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className={`text-xs font-bold uppercase tracking-wide mb-1 ${
                detectionType === opt.value
                  ? opt.color === 'blue' ? 'text-blue-600' : 'text-amber-600'
                  : 'text-gray-400'
              }`}>{opt.value}</div>
              <p className="font-semibold text-gray-800 dark:text-white text-sm">{opt.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Patient Details */}
      <div className="card">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Patient Information</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Patient Name *</label>
            <input className={inputClass} placeholder="Full name" value={patient.patientName} onChange={(e) => update('patientName', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Age *</label>
            <input type="number" className={inputClass} placeholder="Age" min={1} value={patient.patientAge} onChange={(e) => update('patientAge', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Gender *</label>
            <select className={inputClass} value={patient.patientGender} onChange={(e) => update('patientGender', e.target.value)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Contact *</label>
            <input className={inputClass} placeholder="+92 300 0000000" value={patient.patientContact} onChange={(e) => update('patientContact', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="card">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Upload Image</p>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !preview && fileRef.current.click()}
          className={`border-2 border-dashed rounded-xl transition-all cursor-pointer ${
            preview
              ? 'border-blue-300 dark:border-blue-700'
              : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600'
          }`}
        >
          {preview ? (
            <div className="relative">
              <img src={preview} alt="Preview" className="w-full max-h-64 object-contain rounded-xl" />
              <button
                className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg"
                onClick={(e) => { e.stopPropagation(); setImage(null); setPreview(null); }}
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="p-10 text-center">
              <FiImage className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Click or drag & drop image here</p>
              <p className="text-gray-400 text-xs mt-1">JPG, PNG, WEBP — max 10MB</p>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Running AI Analysis...
          </>
        ) : (
          <>
            <FiActivity className="w-5 h-5" />
            Run {detectionType.toUpperCase()} Detection
          </>
        )}
      </button>
    </div>
  );
}