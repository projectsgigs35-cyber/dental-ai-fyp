import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiEye, FiEyeOff, FiUpload } from 'react-icons/fi';
import { motion } from 'framer-motion';

const steps = ['Email Verify', 'Personal Info', 'Clinic Info'];

export default function Register() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [preview, setPreview] = useState(null);
  const pictureRef = useRef();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', dob: '', degrees: '', cnic: '', clinicName: '',
    clinicAddress: '', contactNo: '', yearsOfExperience: '',
    email: '', password: '', picture: null,
  });

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handleSendOTP = async () => {
    if (!form.email) return toast.error('Enter your email first');
    setLoading(true);
    try {
      await api.post('/auth/send-otp', { email: form.email });
      toast.success('OTP sent! Check your inbox.');
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) return toast.error('Enter the 6-digit OTP');
    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { email: form.email, otp });
      toast.success('Email verified!');
      setEmailVerified(true);
      setStep(1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const required = ['name', 'dob', 'degrees', 'cnic', 'clinicName', 'clinicAddress', 'contactNo', 'yearsOfExperience', 'password'];
    for (const f of required) {
      if (!form[f]) return toast.error(`Please fill in ${f}`);
    }
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== undefined) data.append(k, v);
      });
      const res = await api.post('/auth/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      login(res.data.token, res.data.doctor);
      toast.success('Registration successful! Welcome.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "input-field";
  const labelClass = "block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 mb-4">
            <span className="text-white font-bold text-xl">DA</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Doctor Registration</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Dental AI Portal — Verified Professionals Only</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                {i + 1}
              </div>
              {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < step ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`} />}
            </div>
          ))}
        </div>

        <div className="card">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-5">{steps[step]}</h2>

          {/* STEP 0: Email + OTP */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Gmail Address *</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    className={inputClass}
                    placeholder="doctor@gmail.com"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    disabled={emailVerified}
                  />
                  <button
                    onClick={handleSendOTP}
                    disabled={loading || emailVerified}
                    className="btn-primary whitespace-nowrap text-sm"
                  >
                    {loading && !otpSent ? '...' : 'Send OTP'}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Must be a real, existing Gmail address</p>
              </div>
              {otpSent && !emailVerified && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <div>
                    <label className={labelClass}>Enter OTP *</label>
                    <input
                      type="text"
                      maxLength={6}
                      className={`${inputClass} text-center text-2xl tracking-widest font-bold`}
                      placeholder="______"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    />
                    <p className="text-xs text-gray-400 mt-1">OTP expires in 5 minutes</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleVerifyOTP} disabled={loading} className="btn-primary flex-1">
                      {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                    <button onClick={handleSendOTP} disabled={loading} className="btn-secondary text-sm">
                      Resend
                    </button>
                  </div>
                </motion.div>
              )}
              {emailVerified && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 px-4 py-2.5 rounded-xl">
                  <span className="text-lg">✓</span>
                  <span className="text-sm font-medium">Email verified successfully</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input className={inputClass} placeholder="Dr. Ahmed Khan" value={form.name} onChange={(e) => update('name', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Date of Birth *</label>
                  <input type="date" className={inputClass} value={form.dob} onChange={(e) => update('dob', e.target.value)} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Degrees / Qualifications *</label>
                <input className={inputClass} placeholder="BDS, FCPS" value={form.degrees} onChange={(e) => update('degrees', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>CNIC *</label>
                  <input className={inputClass} placeholder="35201-XXXXXXX-X" value={form.cnic} onChange={(e) => update('cnic', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Contact Number *</label>
                  <input className={inputClass} placeholder="+92 300 0000000" value={form.contactNo} onChange={(e) => update('contactNo', e.target.value)} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Years of Experience *</label>
                <input type="number" min={0} className={inputClass} placeholder="e.g. 5" value={form.yearsOfExperience} onChange={(e) => update('yearsOfExperience', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Password *</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    className={inputClass}
                    placeholder="Min 8 characters"
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              {/* Profile Picture */}
              <div>
                <label className={labelClass}>Profile Picture</label>
                <div
                  className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
                  onClick={() => pictureRef.current.click()}
                >
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-20 h-20 rounded-full object-cover mx-auto" />
                  ) : (
                    <div className="text-gray-400">
                      <FiUpload className="mx-auto mb-2 w-6 h-6" />
                      <p className="text-xs">Click to upload photo</p>
                    </div>
                  )}
                </div>
                <input
                  ref={pictureRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      update('picture', file);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>
              <button onClick={() => setStep(2)} className="btn-primary w-full mt-2">
                Continue →
              </button>
            </div>
          )}

          {/* STEP 2: Clinic Info */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Clinic Name *</label>
                <input className={inputClass} placeholder="Bright Smiles Dental Clinic" value={form.clinicName} onChange={(e) => update('clinicName', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Clinic Address *</label>
                <textarea
                  rows={3}
                  className={inputClass}
                  placeholder="Street, City, Country"
                  value={form.clinicAddress}
                  onChange={(e) => update('clinicAddress', e.target.value)}
                />
              </div>
              <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full">
                {loading ? 'Registering...' : 'Complete Registration'}
              </button>
              <button onClick={() => setStep(1)} className="btn-secondary w-full">
                ← Back
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Already registered?{' '}
          <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">Sign in</Link>
        </p>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-center gap-6">
          <Link to="/about" className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            About Us
          </Link>
          <Link to="/feedback" className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Send Feedback
          </Link>
        </div>
      </motion.div>
    </div>
  );
}