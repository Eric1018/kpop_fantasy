'use client'
import { motion } from "framer-motion";
import Image from 'next/image';
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center text-white overflow-hidden font-[Poppins]">
      {/* 背景圖片 (用 next/image) */}
      <div className="absolute inset-0 bg-black/30 z-[-1]">
        <Image
          src="/background.jpg"
          alt="Background"
          layout="fill"
          objectFit="cover"
          priority
          className="opacity-60"
        />
      </div>

      {/* 黑色透明層 */}
      <div className="absolute inset-0 bg-black/10 z-[-1]"></div>

      {/* 標題區域 */}
      <motion.h1 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-7xl font-extrabold drop-shadow-lg text-center text-white"
      >
        KPOP FANTASY
      </motion.h1>

      {/* 遊戲介紹文字 */}
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="mt-6 max-w-3xl text-center text-lg font-medium opacity-70 text-white bg-black/50 px-6 py-3 rounded-lg"
      >
        Step into the world of KPOP FANTASY, where YOU are the mastermind behind the next global sensation. 
        Build your dream girl group, define each member's role, predict their success, and navigate through the thrilling journey of fame. 
        Every choice you make shapes their destiny.<br/>The stage is yours. Are you ready?
      </motion.p>

      {/* 開始按鈕 (確保 z-index 讓它可點擊) */}
      <motion.button
        onClick={() => router.push("/login")}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="mt-10 px-8 py-3 text-lg font-semibold bg-pink-500 text-white rounded-full shadow-md hover:bg-pink-600 transition border-2 border-white relative z-10"
      >
        Start Your Journey
      </motion.button>
    </div>
  );
}
