import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

// FAQ Data Type
interface FAQItem {
    id: string
    number: string
    question: string
    answer: string
}

const faqData: FAQItem[] = [
    {
        id: '1',
        number: '01',
        question: 'O que é a Vitrine Tecnológica?',
        answer: 'A Vitrine Tecnológica é uma plataforma digital inovadora do SENAI que conecta a indústria aos projetos desenvolvidos por nossos alunos e docentes. Funciona como um portfólio vivo de soluções, fomentando parcerias e visibilidade para novos talentos.'
    },
    {
        id: '2',
        number: '02',
        question: 'Quem pode divulgar projetos?',
        answer: 'Alunos regularmente matriculados, ex-alunos e corpo docente do SENAI Feira de Santana podem submeter seus projetos. Todas as submissões passam por uma curadoria técnica para garantir a qualidade e viabilidade das soluções apresentadas.'
    },
    {
        id: '3',
        number: '03',
        question: 'Como as empresas podem participar?',
        answer: 'Empresas e investidores podem navegar livremente pela plataforma para conhecer as inovações. Caso haja interesse em algum projeto específico, podem utilizar os canais de contato direta na página do projeto para iniciar conversas sobre parcerias, mentoria ou investimento.'
    },
    {
        id: '4',
        number: '04',
        question: 'Existe algum custo para acessar?',
        answer: 'Não. O acesso à Vitrine Tecnológica é totalmente gratuito, tanto para os visitantes da indústria quanto para a comunidade acadêmica. Nosso objetivo é democratizar o acesso à inovação e criar pontes de oportunidade.'
    },
    {
        id: '5',
        number: '05',
        question: 'Como submeter um projeto?',
        answer: 'Se você é aluno ou docente SENAI, basta fazer login na plataforma utilizando suas credenciais institucionais. No painel do usuário, haverá a opção "Novo Projeto", onde você poderá detalhar sua solução, adicionar fotos, vídeos e documentos técnicos.'
    }
]

const FAQSection: React.FC = () => {
    const [openId, setOpenId] = useState<string | null>(null)

    const toggleFAQ = (id: string) => {
        setOpenId(openId === id ? null : id)
    }

    return (
        <section className="w-full bg-white py-24 relative overflow-hidden" id="faq">
            <div className="container mx-auto px-6 max-w-5xl">

                {/* Header / Tag */}
                <div className="flex flex-col mb-16">
                    <div className="inline-flex items-center gap-2 mb-6 self-start">
                        <div className="w-2 h-2 rounded-full bg-[#00aceb]"></div>
                        <span className="text-sm font-bold tracking-widest uppercase text-[#00aceb]">Perguntas Frequentes</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                        Tira suas dúvidas sobre<br />
                        <span className="text-[#00aceb]">nossa plataforma</span>
                    </h2>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {faqData.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="border-b border-gray-100 last:border-0"
                        >
                            <button
                                onClick={() => toggleFAQ(item.id)}
                                className="w-full py-8 flex items-start justify-between text-left group cursor-pointer"
                            >
                                <div className="flex gap-6 md:gap-12 items-baseline">
                                    <span className="text-lg md:text-xl font-medium text-gray-400 font-mono">
                                        {item.number}
                                    </span>
                                    <h3 className={`text-xl md:text-2xl font-medium transition-colors duration-300 ${openId === item.id ? 'text-[#00aceb]' : 'text-gray-800 group-hover:text-[#00aceb]'}`}>
                                        {item.question}
                                    </h3>
                                </div>

                                <div className={`flex-shrink-0 ml-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${openId === item.id ? 'bg-[#00aceb] text-white rotate-180' : 'bg-gray-100 text-gray-500 group-hover:bg-[#00aceb] group-hover:text-white'}`}>
                                    {openId === item.id ? <Minus size={20} /> : <Plus size={20} />}
                                </div>
                            </button>

                            <AnimatePresence>
                                {openId === item.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pl-12 md:pl-20 pb-8 pr-4">
                                            <p className="text-gray-600 leading-relaxed text-lg">
                                                {item.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    )
}

export default FAQSection
