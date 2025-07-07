import React from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Processando...' }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full py-10 text-gray-700 dark:text-gray-300">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="p-4 rounded-full border-4 border-green-500 border-t-transparent"
        role="status"
        aria-label="Carregando"
      >
        <Loader className="w-6 h-6" />
      </motion.div>
      <p className="mt-4 text-sm font-medium">{message}</p>
    </div>
  );
};

export default Loading;
