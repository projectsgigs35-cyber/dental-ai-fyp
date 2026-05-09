import { FiUsers, FiArrowRight, FiCheckCircle, FiHome } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();

  const developers = [
    { name: 'Saad Ahmed', id: '22K-4801' },
    { name: 'Abdur Rafay', id: '21K-3856' },
    { name: 'M. Arham', id: '21K-3925' },
  ];

  const features = [
    'AI-powered dental disease detection',
    'Advanced image analysis for oral health assessment',
    'Secure patient data management',
    'Comprehensive report generation',
    'Doctor-patient collaboration tools',
    'Real-time consultation support',
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation Header */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">DA</span>
            </div>
            <p className="font-bold text-gray-900 dark:text-white text-sm">Dental AI</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/feedback')}
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Feedback
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About Dental AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Revolutionizing dental healthcare through artificial intelligence
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              Welcome to our Final Year Project, an AI-powered dental healthcare platform developed
              with the aim of improving early dental disease detection and assisting both doctors
              and patients through modern technology.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              Our system combines Artificial Intelligence, Machine Learning, and a user-friendly web
              application to provide fast, accurate, and accessible dental analysis solutions. The
              primary focus of this project is to detect dental problems such as plaque, cavities, and
              other oral health issues using image-based analysis and intelligent prediction models.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Our Motivation
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              The motivation behind this project is to address the growing need for affordable and
              efficient dental healthcare systems. In many areas, patients face difficulties in
              getting quick dental consultations due to limited resources and high medical costs.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Our platform helps bridge this gap by providing automated analysis that can support
              dentists in diagnosis and assist users in understanding their oral health condition.
              The system is designed with a modern frontend and backend architecture to ensure smooth
              performance, security, and scalability.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-10 text-center">
            Platform Features
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <FiCheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-200">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Section */}
        <div className="mb-20 bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Technology Stack
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Frontend</h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>React with Vite</li>
                <li>Tailwind CSS for styling</li>
                <li>React Router for navigation</li>
                <li>Axios for API communication</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Backend</h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>Node.js and Express.js</li>
                <li>MongoDB for database</li>
                <li>Nodemailer for email services</li>
                <li>Roboflow API for AI models</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Developers Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-10 text-center">
            Development Team
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-10">
            Together, we worked collaboratively on system design, AI model development, frontend and
            backend implementation, database management, and project testing.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {developers.map((dev, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-8 text-center border border-blue-200 dark:border-blue-800"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                  {dev.name.charAt(0)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {dev.name}
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">{dev.id}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-10 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Have Questions or Feedback?</h2>
          <p className="text-blue-100 mb-6">
            We'd love to hear from you. Send us your feedback or inquiries.
          </p>
          <button
            onClick={() => navigate('/feedback')}
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Send Feedback <FiArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Project Philosophy */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            This project reflects our dedication to applying innovative technologies in the
            healthcare sector and solving real-world problems through intelligent systems. Throughout
            the development process, we focused on research, model training, testing, and system
            optimization to achieve reliable performance and usability.
          </p>
        </div>
      </div>
    </div>
  );
}
