import { Link } from "react-router-dom"; // Import Link for SPA navigation
import { Cloud, Database, Lock, Share2, HardDrive } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300 animate-in fade-in pt-10">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center ">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 rotate-3 hover:rotate-6 transition-transform">
              <Cloud size={40} strokeWidth={3} />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
            VinnoDrive
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            The intelligent storage solution that respects your data and your
            disk space.
          </p>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1: Deduplication */}
          <div className="p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="h-14 w-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 mb-6">
              <Share2 size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3">Smart Deduplication</h3>
            <p className="text-gray-500 dark:text-zinc-400 leading-relaxed">
              Upload the same file a thousand times, and we store it only once.
              Our SHA-256 hashing algorithm detects duplicates instantly across
              the entire network, saving you massive amounts of space.
            </p>
          </div>

          {/* Feature 2: Security */}
          <div className="p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="h-14 w-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
              <Lock size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3">Secure Access</h3>
            <p className="text-gray-500 dark:text-zinc-400 leading-relaxed">
              Your files are strictly yours. While the physical data is
              deduplicated for efficiency, your personal file references and
              folder structures are private and protected by industry-standard
              JWT authentication.
            </p>
          </div>

          {/* Feature 3: Technology */}
          <div className="p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="h-14 w-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
              <Database size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3">Modern Stack</h3>
            <p className="text-gray-500 dark:text-zinc-400 leading-relaxed">
              Built for speed and reliability. VinnoDrive leverages the power of
              Django REST Framework for a robust backend and React with
              TypeScript for a lightning-fast, responsive frontend experience.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-y border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100 dark:divide-zinc-800">
            <div className="px-4">
              <div className="text-4xl font-black text-blue-600 dark:text-blue-500 mb-2">
                SHA-256
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Hashing Algo
              </div>
            </div>
            <div className="px-4">
              <div className="text-4xl font-black text-blue-600 dark:text-blue-500 mb-2">
                10 MB
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Free Quota
              </div>
            </div>
            <div className="px-4">
              <div className="text-4xl font-black text-blue-600 dark:text-blue-500 mb-2">
                100%
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Optimized
              </div>
            </div>
            <div className="px-4">
              <div className="text-4xl font-black text-blue-600 dark:text-blue-500 mb-2">
                Zero
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Redundancy
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Ready to optimize your storage?
        </h2>
        {/* Updated to Link for SPA navigation */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:opacity-80 transition-opacity shadow-lg"
        >
          <HardDrive size={20} />
          <span>Go to Dashboard</span>
        </Link>
        <p className="mt-8 text-sm text-gray-400">
          © {new Date().getFullYear()} VinnoDrive. All rights reserved.
        </p>
      </div>
    </div>
  );
}
