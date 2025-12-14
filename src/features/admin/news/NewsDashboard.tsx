import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Edit, Trash2, Eye, Heart, Archive, Globe, Search, LayoutGrid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useNoticias, useDeleteNoticia, useUpdateNoticia } from '@/hooks/use-noticias';
import { Noticia } from '@/api/noticias';
import { DataTable } from '@/components/ui/data-table';
import ValidationModal from '@/components/ui/ValidationModal';
import { useTheme } from '@/contexts/theme-context';

export const NewsDashboard = () => {
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'>('ALL');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [newsToDelete, setNewsToDelete] = useState<string | null>(null);

    const navigate = useNavigate();
    const { data, isLoading } = useNoticias({ limit: 100, admin: true });
    const deleteMutation = useDeleteNoticia();
    const updateMutation = useUpdateNoticia();

    const allNews = data?.data || [];
    const loading = isLoading || deleteMutation.isPending;

    // Filter Logic
    const news = allNews.filter((item: Noticia) => {
        const isPublished = item.publicado;
        const hasDate = !!item.data_publicacao;

        if (filterStatus === 'ALL') return true;
        if (filterStatus === 'PUBLISHED') return isPublished;
        if (filterStatus === 'DRAFT') return !isPublished && !hasDate;
        if (filterStatus === 'ARCHIVED') return !isPublished && hasDate;
        return true;
    });

    const confirmDelete = (uuid: string) => {
        setNewsToDelete(uuid);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (newsToDelete) {
            try {
                await deleteMutation.mutateAsync(newsToDelete);
            } catch (error) {
                console.error("Failed to delete", error);
            }
            setDeleteModalOpen(false);
            setNewsToDelete(null);
        }
    };

    const handleStatusToggle = async (record: Noticia) => {
        const newStatus = !record.publicado;
        try {
            await updateMutation.mutateAsync({ uuid: record.uuid, data: { publicado: newStatus } });
        } catch (error) {
            console.error('Erro ao atualizar status', error);
        }
    };

    const columns: ColumnDef<Noticia>[] = [
        {
            accessorKey: 'titulo',
            header: 'Título',
            cell: ({ row }) => (
                <span className="font-semibold text-gray-900 dark:text-white text-base">
                    {row.original.titulo}
                </span>
            )
        },
        {
            accessorKey: 'categoria',
            header: 'Categoria',
            cell: ({ row }) => {
                const text = row.original.categoria;
                let colorClass = 'bg-gray-100 text-gray-800';
                switch (text) {
                    case 'INOVACAO': colorClass = 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'; break;
                    case 'EVENTO': colorClass = 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'; break;
                    case 'EDUCACAO': colorClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'; break;
                    case 'TECNOLOGIA': colorClass = 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300'; break;
                }
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${colorClass}`}>
                        {text?.toLowerCase() || 'geral'}
                    </span>
                );
            }
        },
        {
            accessorKey: 'visualizacoes',
            header: 'Visualizações',
            cell: ({ row }) => (
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 font-medium">
                    <Eye size={16} />
                    {row.original.visualizacoes || 0}
                </div>
            )
        },
        {
            accessorKey: 'curtidas',
            header: 'Curtidas',
            cell: ({ row }) => (
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 font-medium">
                    <Heart size={16} className="text-red-500" />
                    {row.original.curtidas || 0}
                </div>
            )
        },
        {
            accessorKey: 'data_publicacao',
            header: 'Data Publicação',
            cell: ({ row }) => (
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                    {row.original.data_publicacao ? format(new Date(row.original.data_publicacao), 'dd/MM/yyyy HH:mm') : '-'}
                </span>
            )
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const record = row.original;
                const isPub = record.publicado;
                const isArchived = !isPub && !!record.data_publicacao;

                let text = 'RASCUNHO';
                let style = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
                let dot = 'bg-yellow-500';

                if (isPub) {
                    text = 'PUBLICADO';
                    style = 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
                    dot = 'bg-green-500';
                } else if (isArchived) {
                    text = 'ARQUIVADA';
                    style = 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
                    dot = 'bg-gray-500';
                }

                return (
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold w-fit ${style}`}>
                        <div className={`w-2 h-2 rounded-full ${dot}`} />
                        {text}
                    </div>
                )
            }
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Ações</div>,
            cell: ({ row }) => {
                const record = row.original;
                return (
                    <div className="flex justify-end gap-2">
                        <button
                            className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                            onClick={() => handleStatusToggle(record)}
                            title={record.publicado ? 'Arquivar' : 'Publicar agora'}
                        >
                            {record.publicado ? <Archive size={18} /> : <Globe size={18} />}
                        </button>
                        <button
                            className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            onClick={() => navigate(`/noticias/${record.uuid}`)}
                            title="Ver no site"
                        >
                            <Eye size={18} />
                        </button>
                        <button
                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            onClick={() => navigate(`/admin/noticias/editar/${record.uuid}`)}
                            title="Editar"
                        >
                            <Edit size={18} />
                        </button>
                        <button
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            onClick={() => confirmDelete(record.uuid)}
                            title="Excluir"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                );
            }
        }
    ];

    const { accentColor } = useTheme();

    const getBannerGradient = (color: string) => {
        const gradients: Record<string, string> = {
            indigo: 'from-indigo-900 via-indigo-800 to-indigo-900',
            blue: 'from-blue-900 via-blue-800 to-blue-900',
            purple: 'from-purple-900 via-purple-800 to-purple-900',
            pink: 'from-pink-900 via-pink-800 to-pink-900',
            green: 'from-green-900 via-green-800 to-green-900',
            orange: 'from-orange-900 via-orange-800 to-orange-900',
        };
        return gradients[color] || gradients.indigo;
    };

    const getIconBg = (color: string) => {
        const bgs: Record<string, string> = {
            indigo: 'bg-indigo-500/20 text-indigo-200',
            blue: 'bg-blue-500/20 text-blue-200',
            purple: 'bg-purple-500/20 text-purple-200',
            pink: 'bg-pink-500/20 text-pink-200',
            green: 'bg-green-500/20 text-green-200',
            orange: 'bg-orange-500/20 text-orange-200',
        };
        return bgs[color] || bgs.indigo;
    };

    // Button dynamic style
    const getButtonStyle = (color: string) => {
        const styles: Record<string, string> = {
            indigo: 'bg-white text-indigo-900 hover:bg-indigo-50',
            blue: 'bg-white text-blue-900 hover:bg-blue-50',
            purple: 'bg-white text-purple-900 hover:bg-purple-50',
            pink: 'bg-white text-pink-900 hover:bg-pink-50',
            green: 'bg-white text-green-900 hover:bg-green-50',
            orange: 'bg-white text-orange-900 hover:bg-orange-50',
        };
        return styles[color] || styles.indigo;
    };

    return (
        <div className="space-y-8">
            {/* Header Banner - Dynamic Theme */}
            <div className={`bg-gradient-to-r ${getBannerGradient(accentColor)} text-white overflow-hidden relative transition-colors duration-500 shadow-xl`}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10 p-8 md:p-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-3xl md:text-3xl font-bold mb-3 flex items-center gap-4">
                                <span className={`p-2 rounded-lg backdrop-blur-sm ${getIconBg(accentColor)}`}>
                                    <span className="text-2xl">📰</span>
                                </span>
                                Gerenciar Notícias
                            </h1>
                            <p className="text-white/80 text-lg max-w-2xl font-light">
                                Administre as publicações e eventos do portal.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/admin/noticias/nova')}
                            className={`group flex items-center gap-2 px-6 py-3 font-bold rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 ${getButtonStyle(accentColor)}`}
                        >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            Nova Notícia
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Wrapper */}
            <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8">
                {/* Custom Filter Tabs */}
                <div className="flex flex-wrap gap-2 p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl w-fit">
                    {[
                        { label: 'Todas', value: 'ALL', icon: Eye },
                        { label: 'Publicadas', value: 'PUBLISHED', icon: Globe },
                        { label: 'Arquivadas', value: 'ARCHIVED', icon: Archive },
                        { label: 'Rascunhos', value: 'DRAFT', icon: Edit },
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setFilterStatus(tab.value as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterStatus === tab.value
                                ? 'bg-white dark:bg-gray-700 text-purple-700 dark:text-purple-400 shadow-sm scale-105'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Data Table */}
                <DataTable
                    columns={columns}
                    data={news}
                    isLoading={loading}
                    searchKey="titulo"
                    searchPlaceholder="Buscar por título..."
                />
            </div>

            {/* Delete Confirmation Modal */}
            <ValidationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Excluir Notícia"
                message="Tem certeza que deseja excluir esta notícia? Esta ação não pode ser desfeita."
                type="error"
                confirmText="Sim, Excluir"
                showCancel
                onConfirm={handleDelete}
            />
        </div>
    );
};
