import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, Briefcase, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useNavigate } from 'react-router-dom';

interface ViewModeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ViewModeModal: React.FC<ViewModeModalProps> = ({ isOpen, onClose }) => {
    const { setViewMode, viewMode } = useAuth();
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleSelectMode = (mode: 'ALUNO' | 'DOCENTE' | 'ADMIN' | null) => {
        setViewMode(mode);
        onClose();

        // Força o redirecionamento imediato para a visualização selecionada
        if (mode === 'ALUNO') {
            navigate('/aluno/dashboard');
        } else if (mode === 'DOCENTE') {
            navigate('/docente/dashboard');
        } else {
            navigate('/admin');
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Modo de Visualização (Máscara)
                            </h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Escolha a plataforma de acesso.
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <button
                                onClick={() => handleSelectMode('ALUNO')}
                                className={`group flex flex-col items-center justify-center gap-3 rounded-xl border-2 p-6 transition-all ${viewMode === 'ALUNO'
                                        ? 'border-indigo-600 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-900/20'
                                        : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-500/50 dark:hover:bg-gray-700/50'
                                    }`}
                            >
                                <div className={`rounded-full p-4 transition-colors ${viewMode === 'ALUNO'
                                        ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
                                        : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:bg-gray-700 dark:text-gray-400 dark:group-hover:bg-indigo-900/50 dark:group-hover:text-indigo-400'
                                    }`}>
                                    <GraduationCap className="h-8 w-8" />
                                </div>
                                <div className="text-center">
                                    <h3 className={`font-semibold ${viewMode === 'ALUNO' ? 'text-indigo-900 dark:text-indigo-300' : 'text-gray-900 dark:text-white'
                                        }`}>Aluno</h3>
                                </div>
                            </button>

                            <button
                                onClick={() => handleSelectMode('DOCENTE')}
                                className={`group flex flex-col items-center justify-center gap-3 rounded-xl border-2 p-6 transition-all ${viewMode === 'DOCENTE'
                                        ? 'border-indigo-600 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-900/20'
                                        : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-500/50 dark:hover:bg-gray-700/50'
                                    }`}
                            >
                                <div className={`rounded-full p-4 transition-colors ${viewMode === 'DOCENTE'
                                        ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
                                        : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:bg-gray-700 dark:text-gray-400 dark:group-hover:bg-indigo-900/50 dark:group-hover:text-indigo-400'
                                    }`}>
                                    <Briefcase className="h-8 w-8" />
                                </div>
                                <div className="text-center">
                                    <h3 className={`font-semibold ${viewMode === 'DOCENTE' ? 'text-indigo-900 dark:text-indigo-300' : 'text-gray-900 dark:text-white'
                                        }`}>Docente</h3>
                                </div>
                            </button>
                        </div>

                        <div className="mt-4">
                            <button
                                onClick={() => handleSelectMode(null)}
                                className={`group w-full flex items-center justify-center gap-3 rounded-xl border-2 p-4 transition-all ${!viewMode
                                        ? 'border-purple-600 bg-purple-50 dark:border-purple-500 dark:bg-purple-900/20'
                                        : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-purple-500/50 dark:hover:bg-gray-700/50'
                                    }`}
                            >
                                <ShieldAlert className={`h-6 w-6 ${!viewMode ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 group-hover:text-purple-600 dark:text-gray-400 dark:group-hover:text-purple-400'}`} />
                                <span className={`font-semibold ${!viewMode ? 'text-purple-900 dark:text-purple-300' : 'text-gray-900 dark:text-white'}`}>
                                    Retornar ao Painel de Administrador
                                </span>
                            </button>
                        </div>

                        <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
                            Sua conta real continuará inalterada. Apenas a visualização da tela será simulada.
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ViewModeModal;
