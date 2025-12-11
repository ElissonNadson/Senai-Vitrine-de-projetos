import React, { useRef } from 'react'
import CountUp from 'react-countup'
import { motion, useInView } from 'framer-motion'
import Reveal from '@/components/Motion/Reveal'
import { Award, Briefcase, Cpu, Users } from 'lucide-react'

const stats = [
    {
        id: 1,
        number: 120,
        suffix: '+',
        label: 'Empresas Parceiras',
        icon: <Briefcase className="w-8 h-8 text-blue-400" />,
    },
    {
        id: 2,
        number: 500,
        suffix: '+',
        label: 'Projetos Desenvolvidos',
        icon: <Cpu className="w-8 h-8 text-indigo-400" />,
    },
    {
        id: 3,
        number: 15,
        suffix: '',
        label: 'Laboratórios Maker',
        icon: <Award className="w-8 h-8 text-purple-400" />,
    },
    {
        id: 4,
        number: 3000,
        suffix: '+',
        label: 'Alunos Impactados',
        icon: <Users className="w-8 h-8 text-cyan-400" />,
    },
]

const ImpactsSection: React.FC = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <section ref={ref} className="py-20 bg-slate-900 border-t border-slate-800 relative overflow-hidden">
            {/* Background Decorativo */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-600 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <Reveal width="100%" className="mb-16 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Nosso Impacto
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
                    <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                        Transformando o ecossistema industrial e educacional através da inovação aplicada.
                    </p>
                </Reveal>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat) => (
                        <motion.div
                            key={stat.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.1 * stat.id }}
                            className="group p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10 text-center"
                        >
                            <div className="mb-4 inline-flex p-3 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/5 group-hover:scale-110 transition-transform duration-300">
                                {stat.icon}
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
                                    {isInView && (
                                        <CountUp
                                            start={0}
                                            end={stat.number}
                                            duration={2.5}
                                            separator="."
                                            delay={0.2}
                                        />
                                    )}
                                    {stat.suffix}
                                </h3>
                                <p className="text-gray-400 font-medium tracking-wide text-sm uppercase">
                                    {stat.label}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ImpactsSection
