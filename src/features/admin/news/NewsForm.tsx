import React, { useState, useEffect } from 'react';
import { message, Segmented } from 'antd';
import { UploadCloud, X, Layout, Type, Calendar, Globe, Trash2, ArrowLeft, Image as ImageIcon, Save, CheckCircle, FileText, Tag, Archive } from 'lucide-react';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';

Quill.register('modules/imageResize', ImageResize);
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateNoticia, useUpdateNoticia, useNoticia } from '@/hooks/use-noticias';
import { uploadBanner, formatarTamanho, validarArquivo } from '@/api/upload';
import { ModernBannerUploader } from '@/components/ui/ModernBannerUploader';

export const NewsForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        titulo: '',
        resumo: '',
        categoria: 'GERAL',
        data_evento: '',
        publicado: true,
        banner_url: '', // Holds URL from API or existing
        data_expiracao: ''
    });

    const [archiveOption, setArchiveOption] = useState<'NEVER' | '90_DAYS' | 'CUSTOM'>('NEVER');
    const [customArchiveDate, setCustomArchiveDate] = useState('');

    // Hooks
    const { data: existingNoticia, isLoading: isLoadingData } = useNoticia(id || '');
    const createMutation = useCreateNoticia();
    const updateMutation = useUpdateNoticia();

    useEffect(() => {
        if (isEdit && existingNoticia) {
            setFormData({
                titulo: existingNoticia.titulo,
                resumo: existingNoticia.resumo,
                categoria: existingNoticia.categoria || 'GERAL',
                data_evento: existingNoticia.data_evento ? existingNoticia.data_evento.slice(0, 16) : '', // format for input datetime-local
                publicado: existingNoticia.publicado,
                banner_url: existingNoticia.banner_url || '',
                data_expiracao: existingNoticia.data_expiracao || ''
            });
            setContent(existingNoticia.conteudo || '');
            if (existingNoticia.banner_url) {
                setBannerPreview(existingNoticia.banner_url);
            }

            // Set archive option state
            if (existingNoticia.data_expiracao) {
                const expDate = new Date(existingNoticia.data_expiracao);
                const pubDate = existingNoticia.data_publicacao ? new Date(existingNoticia.data_publicacao) : new Date();

                // Check if roughly 90 days (allow 1 day diff)
                const diffDays = Math.round((expDate.getTime() - pubDate.getTime()) / (1000 * 3600 * 24));

                if (diffDays >= 89 && diffDays <= 91) {
                    setArchiveOption('90_DAYS');
                } else {
                    setArchiveOption('CUSTOM');
                    setCustomArchiveDate(existingNoticia.data_expiracao.slice(0, 16));
                }
            } else {
                setArchiveOption('NEVER');
            }
        }
    }, [isEdit, existingNoticia]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validacao = validarArquivo(file, 'BANNER');
            if (!validacao.valido) {
                message.error(validacao.erro);
                return;
            }
            setBannerFile(file);
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent | null, shouldPublish: boolean) => {
        if (e) e.preventDefault();
        setLoading(true);

        try {
            let finalBannerUrl = formData.banner_url;

            // Upload banner if new file selected
            if (bannerFile) {
                try {
                    const uploadRes = await uploadBanner(bannerFile, 'news_banner');
                    finalBannerUrl = uploadRes.url;
                } catch (uploadError) {
                    message.error('Erro ao fazer upload da imagem. Tente novamente.');
                    setLoading(false);
                    return;
                }
            }

            const payload = {
                titulo: formData.titulo,
                resumo: formData.resumo,
                conteudo: content,
                categoria: formData.categoria,
                dataEvento: formData.data_evento || undefined, // Send as is (ISO ish)
                publicado: shouldPublish,
                bannerUrl: finalBannerUrl || undefined, // Optional if not changed and not strictly required (but usually is)
                // Add default banner if empty? Backend might handle or validate.
                // Add default banner if empty? Backend might handle or validate.
                dataExpiracao: undefined as string | null | undefined
            };

            // Calculate expiration date
            if (archiveOption === 'NEVER') {
                payload.dataExpiracao = null; // Send null to clear database field
            } else if (archiveOption === '90_DAYS') {
                const date = new Date();
                date.setDate(date.getDate() + 90);
                payload.dataExpiracao = date.toISOString();
            } else if (archiveOption === 'CUSTOM' && customArchiveDate) {
                payload.dataExpiracao = new Date(customArchiveDate).toISOString();
            }
            // If CUSTOM selected but no date, maybe warn or treat as never? 
            if (archiveOption === 'CUSTOM' && !customArchiveDate) {
                message.warning('Por favor, selecione uma data para arquivamento.');
                setLoading(false);
                return;
            }

            if (!payload.bannerUrl) {
                // If required
                message.warning('Por favor, adicione uma imagem de capa.');
                // return; // Let's allow saving without banner if logic permits, or enforce it. 
                // Assuming it might fail in backend if required.
            }

            if (isEdit) {
                await updateMutation.mutateAsync({ uuid: id!, data: payload });
                message.success(shouldPublish ? 'Notícia publicada com sucesso!' : 'Rascunho salvo com sucesso!');
            } else {
                await createMutation.mutateAsync(payload as any);
                message.success(shouldPublish ? 'Notícia publicada com sucesso!' : 'Rascunho criado com sucesso!');
            }

            navigate('/admin/noticias');
        } catch (error) {
            console.error(error);
            message.error('Erro ao salvar notícia. Verifique os dados.');
        } finally {
            setLoading(false);
        }
    };

    const quillRef = React.useRef<ReactQuill>(null);

    const modules = React.useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image', 'video'],
                ['clean']
            ],
            imageResize: {
                parchment: Quill.import('parchment'),
                modules: ['Resize', 'DisplaySize']
            },
            handlers: {
                image: () => {
                    const input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/*');
                    input.click();

                    input.onchange = async () => {
                        const file = input.files ? input.files[0] : null;
                        if (file) {
                            try {
                                const uploadRes = await uploadBanner(file, 'news_content');
                                const url = uploadRes.url;
                                const quill = quillRef.current?.getEditor();
                                const range = quill?.getSelection();
                                if (quill && range) {
                                    quill.insertEmbed(range.index, 'image', url);
                                } else if (quill) {
                                    // If no selection, append to end? Or just focus and insert.
                                    const length = quill.getLength();
                                    quill.insertEmbed(length, 'image', url);
                                }
                            } catch (e) {
                                message.error('Erro ao enviar imagem');
                            }
                        }
                    };
                }
            }
        },
    }), []);

    if (isEdit && isLoadingData) {
        return <div className="p-10 text-center">Carregando...</div>;
    }

    return (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto pb-20">
            {/* Header Simplified */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {isEdit ? 'Editar Notícia' : 'Nova Notícia'}
                    </h1>
                </div>
            </div>

            <form onSubmit={(e) => handleSubmit(e, true)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Content (2/3) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Title & Summary Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 space-y-6">
                        {/* ... (keeping content) ... */}
                        <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-4">
                            <FileText className="w-5 h-5 text-blue-600" />
                            Informações Básicas
                        </div>
                        {/* ... */}


                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Título da Notícia <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-lg font-medium placeholder-gray-400"
                                placeholder="Digite um título impactante..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Resumo <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="resumo"
                                value={formData.resumo}
                                onChange={handleInputChange}
                                required
                                rows={3}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                                placeholder="Breve descrição que aparecerá nos cards da home..."
                                maxLength={200}
                            />
                            <div className="text-right text-xs text-gray-400 mt-1">
                                {formData.resumo.length}/200
                            </div>
                        </div>
                    </div>

                    {/* Rich Content Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col min-h-[600px]">
                        <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-500" />
                            Corpo da Notícia
                        </label>
                        <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg overflow-hidden custom-quill-wrapper border border-gray-200 dark:border-gray-700">
                            <ReactQuill
                                ref={quillRef}
                                theme="snow"
                                value={content}
                                onChange={setContent}
                                modules={modules}
                                className="h-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Sidebar (1/3) */}
                <div className="space-y-6">

                    {/* Publish/Status Card - Sticky */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                        <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold mb-4">
                            Publicação
                        </h3>

                        <div className="flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={() => handleSubmit(null, true)}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/20 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Salvando...' : (
                                    <>
                                        <Globe className="w-5 h-5" />
                                        {isEdit && existingNoticia?.publicado ? 'Salvar Alterações' : 'Publicar Agora'}
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => handleSubmit(null, false)}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <Save className="w-5 h-5" />
                                {isEdit
                                    ? (existingNoticia?.publicado ? 'Despublicar (Arquivar)' : 'Salvar Alterações')
                                    : 'Salvar como Rascunho'
                                }
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/admin/noticias')}
                                className="w-full px-6 py-3 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-medium rounded-xl border border-gray-200 dark:border-gray-700 transition-all"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>

                    {/* Banner Media Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                        <div className="flex items-center gap-2 text-md font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3 mb-4">
                            <ImageIcon className="w-4 h-4 text-green-500" />
                            Imagem de Capa (Banner)
                        </div>

                        <ModernBannerUploader
                            currentBanner={bannerPreview}
                            onBannerChange={(file) => {
                                setBannerFile(file)
                                setBannerPreview(URL.createObjectURL(file))
                            }}
                            onRemove={() => {
                                setBannerFile(null)
                                setBannerPreview(null)
                            }}
                            aspect={16 / 9}
                        />
                    </div>

                    {/* Metadata Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 space-y-4">
                        <div className="flex items-center gap-2 text-md font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">
                            <Tag className="w-4 h-4 text-purple-500" />
                            Categorização
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Categoria
                            </label>
                            <select
                                name="categoria"
                                value={formData.categoria}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none"
                            >
                                <option value="GERAL">Geral</option>
                                <option value="INOVACAO">Inovação</option>
                                <option value="EVENTO">Evento</option>
                                <option value="EDUCACAO">Educação</option>
                                <option value="TECNOLOGIA">Tecnologia</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Data do Evento
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="datetime-local"
                                    name="data_evento"
                                    value={formData.data_evento}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Auto Archive Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 space-y-4">
                        <div className="flex items-center gap-2 text-md font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">
                            <Archive className="w-4 h-4 text-orange-500" />
                            Agendar Arquivamento
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Quando arquivar?
                            </label>
                            <Segmented
                                options={[
                                    { label: 'Nunca', value: 'NEVER' },
                                    { label: '90 Dias', value: '90_DAYS' },
                                    { label: 'Data', value: 'CUSTOM' }
                                ]}
                                value={archiveOption}
                                onChange={(val) => setArchiveOption(val as any)}
                                block
                                className="bg-gray-100 dark:bg-gray-900 p-1 mb-3"
                            />

                            {archiveOption === 'CUSTOM' && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                        Data e Hora do Arquivamento
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={customArchiveDate}
                                        onChange={(e) => setCustomArchiveDate(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
                                        min={new Date().toISOString().slice(0, 16)}
                                    />
                                </div>
                            )}

                            <p className="text-xs text-gray-400 mt-2">
                                {archiveOption === 'NEVER' && 'A notícia ficará pública indefinidamente.'}
                                {archiveOption === '90_DAYS' && 'Será arquivada automaticamente 90 dias após salvar.'}
                                {archiveOption === 'CUSTOM' && 'Será arquivada na data selecionada acima.'}
                            </p>
                        </div>
                    </div>

                </div>
            </form>
        </div>
    );
};
