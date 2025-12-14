import React, { useState } from 'react';
import { Table, Button, Space, Modal, message, Tag, Segmented, Tooltip } from 'antd';
import { Plus, Edit, Trash2, Eye, Heart, Archive, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useNoticias, useDeleteNoticia, useUpdateNoticia } from '@/hooks/use-noticias';

export const NewsDashboard = () => {
    const [modal, contextHolder] = Modal.useModal();
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'>('ALL');
    const navigate = useNavigate();
    const { data, isLoading } = useNoticias({ limit: 100, admin: true }); // Admin views all
    const deleteMutation = useDeleteNoticia();
    const updateMutation = useUpdateNoticia();

    const allNews = data?.data || [];
    const loading = isLoading || deleteMutation.isPending;

    // Filter News
    const news = allNews.filter(item => {
        const isPublished = item.publicado;
        const hasDate = !!item.data_publicacao;

        if (filterStatus === 'ALL') return true;
        if (filterStatus === 'PUBLISHED') return isPublished;
        if (filterStatus === 'DRAFT') return !isPublished && !hasDate;
        if (filterStatus === 'ARCHIVED') return !isPublished && hasDate;
        return true;
    });

    // Metrics Calculation
    const totalNews = allNews.length;
    const totalViews = allNews.reduce((acc, curr) => acc + (curr.visualizacoes || 0), 0);
    const totalLikes = allNews.reduce((acc, curr) => acc + (curr.curtidas || 0), 0);
    const totalPublished = allNews.filter(n => n.publicado).length;

    const handleDelete = (uuid: string) => {
        modal.confirm({
            title: 'Tem certeza que deseja excluir?',
            content: 'Esta ação não pode ser desfeita.',
            okText: 'Sim, Excluir',
            cancelText: 'Cancelar',
            okButtonProps: { danger: true },
            onOk: async () => {
                try {
                    await deleteMutation.mutateAsync(uuid);
                    message.success('Notícia excluída com sucesso');
                } catch (error) {
                    message.error('Erro ao excluir notícia');
                }
            }
        });
    };

    const handleStatusToggle = async (record: any) => {
        const newStatus = !record.publicado;
        try {
            await updateMutation.mutateAsync({ uuid: record.uuid, data: { publicado: newStatus } });
            message.success(`Notícia ${newStatus ? 'publicada' : 'arquivada'} com sucesso`);
        } catch (error) {
            message.error('Erro ao atualizar status');
        }
    };

    const columns = [
        {
            title: 'Título',
            dataIndex: 'titulo',
            key: 'titulo',
            width: '35%',
            render: (text: string) => (
                <span className="font-semibold text-gray-900 dark:text-white text-base">
                    {text}
                </span>
            )
        },
        {
            title: 'Categoria',
            dataIndex: 'categoria',
            key: 'categoria',
            width: '12%',
            render: (text: string) => {
                let color = 'default';
                switch (text) {
                    case 'INOVACAO': color = 'purple'; break;
                    case 'EVENTO': color = 'orange'; break;
                    case 'EDUCACAO': color = 'blue'; break;
                    case 'TECNOLOGIA': color = 'cyan'; break;
                    default: color = 'default';
                }
                return (
                    <Tag color={color} className="px-3 py-1 rounded-full text-xs font-bold border-0 capitalize">
                        {text?.toLowerCase() || 'geral'}
                    </Tag>
                );
            }
        },
        {
            title: 'Visualizações',
            dataIndex: 'visualizacoes',
            key: 'visualizacoes',
            width: '10%',
            render: (views: number) => (
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 font-medium">
                    <Eye size={16} />
                    {views || 0}
                </div>
            )
        },
        {
            title: 'Curtidas',
            dataIndex: 'curtidas',
            key: 'curtidas',
            width: '10%',
            render: (likes: number) => (
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 font-medium">
                    <Heart size={16} className="text-red-500" />
                    {likes || 0}
                </div>
            )
        },
        {
            title: 'Data Publicação',
            dataIndex: 'data_publicacao',
            key: 'data',
            width: '15%',
            render: (date: string) => (
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                    {date ? format(new Date(date), 'dd/MM/yyyy HH:mm') : '-'}
                </span>
            )
        },
        {
            title: 'Status',
            key: 'status',
            width: '10%',
            render: (_: any, record: any) => {
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
            title: 'Ações',
            key: 'actions',
            align: 'right' as const,
            render: (_: any, record: any) => (
                <Space size="small">
                    <Tooltip title={record.publicado ? 'Arquivar (Retirar do ar)' : 'Publicar agora'}>
                        <Button
                            type="text"
                            icon={record.publicado ? <Archive size={18} className="text-gray-500 hover:text-orange-500" /> : <Globe size={18} className="text-gray-500 hover:text-green-500" />}
                            onClick={() => handleStatusToggle(record)}
                        />
                    </Tooltip>
                    <Button
                        type="text"
                        icon={<Eye size={18} className="text-gray-500 hover:text-blue-500" />}
                        onClick={() => navigate(`/noticias/${record.uuid}`)}
                        title="Ver no site"
                    />
                    <Button
                        type="text"
                        icon={<Edit size={18} className="text-blue-600 hover:text-blue-700" />}
                        onClick={() => navigate(`/admin/noticias/editar/${record.uuid}`)}
                        title="Editar"
                    />
                    <Button
                        type="text"
                        danger
                        icon={<Trash2 size={18} />}
                        onClick={() => handleDelete(record.uuid)}
                        title="Excluir"
                    />
                </Space>
            )
        }
    ];

    return (
        <div className="space-y-8 p-6 md:p-8 max-w-[1600px] mx-auto">
            {/* Header Banner - Profile Style */}
            <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-fuchsia-900 text-white overflow-hidden relative transition-colors duration-500 shadow-xl">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10 p-8 md:p-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-3 flex items-center gap-4">
                                <span className="text-purple-400 bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                                    <span className="text-2xl">📰</span>
                                </span>
                                Gerenciar Notícias
                            </h1>
                            <p className="text-purple-100 text-lg max-w-2xl font-light">
                                Administre as publicações e eventos do portal.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/admin/noticias/nova')}
                            className="group flex items-center gap-2 px-6 py-3 bg-white text-purple-900 hover:bg-purple-50 font-bold rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95"
                        >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            Nova Notícia
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="px-4 md:px-0">
                <Segmented
                    options={[
                        { label: 'Todas as Notícias', value: 'ALL', icon: <Eye size={14} /> },
                        { label: 'Publicadas', value: 'PUBLISHED', icon: <div className="w-2 h-2 rounded-full bg-green-500" /> },
                        { label: 'Arquivadas', value: 'ARCHIVED', icon: <div className="w-2 h-2 rounded-full bg-gray-500" /> },
                        { label: 'Rascunhos', value: 'DRAFT', icon: <div className="w-2 h-2 rounded-full bg-yellow-500" /> },
                    ]}
                    value={filterStatus}
                    onChange={(value) => setFilterStatus(value as any)}
                    className="p-1 bg-gray-100 rounded-lg"
                    size="large"
                />
            </div>

            {/* Content Area */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden relative z-20 mx-4 md:mx-0">
                <Table
                    columns={columns}
                    dataSource={news}
                    rowKey="uuid"
                    loading={loading}
                    pagination={{
                        pageSize: 8,
                        showTotal: (total) => `Total ${total} notícias`,
                        className: 'p-4'
                    }}
                    className="custom-table"
                    rowClassName="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                />
            </div>
        </div>
    );
};
