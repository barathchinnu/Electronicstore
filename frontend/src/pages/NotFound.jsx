import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdElectricBolt } from 'react-icons/md';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-24 px-4 text-center">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-8xl font-black font-display gradient-text mb-4">404</div>
        <div className="text-6xl mb-4">🔌</div>
        <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto">
          Oops! This page seems to be unplugged. Let's get you back on track.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary">Go Home</Link>
          <Link to="/products" className="btn-secondary">Shop Products</Link>
        </div>
      </motion.div>
    </div>
  );
}
