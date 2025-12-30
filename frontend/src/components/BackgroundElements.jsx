import { motion } from 'framer-motion';

export default function BackgroundElements() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050608] pointer-events-none">
      {/* Optimized Blobs - Lower blur, better performance */}
      <motion.div
        animate={{ x: [-20, 20, -20], y: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{ willChange: "transform" }}
        className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[80px]"
      />
      <motion.div
        animate={{ x: [20, -20, 20], y: [0, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ willChange: "transform" }}
        className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[70px]"
      />

      {/* Static Grid - Much faster than animated ones */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    </div>
  );
}