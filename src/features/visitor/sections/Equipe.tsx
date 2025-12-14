import React from 'react'
import SectionLayout from '../layout/SectionLayout'
import FadeIn from '@/components/ui/FadeIn'
import StaggerContainer, { StaggerItem } from '@/components/ui/StaggerContainer'
import { Linkedin, Github, User } from 'lucide-react'
import { teamMembers } from '../../../data/team-members'

const highlights = teamMembers.filter(m => m.highlight)
const contributors = teamMembers.filter(m => !m.highlight)

const Equipe: React.FC = () => {
    return (
        <SectionLayout>
            <div className="min-h-screen bg-gray-50/30">
                <style>{`
          html body { background: rgb(249, 250, 251); }
        `}</style>

                {/* Hero Section - Matches Sobre/Noticias */}
                <FadeIn>
                    <section className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-[#003B71]">
                        {/* Background Image */}
                        <div className="absolute inset-0 w-full h-full">
                            <img
                                src="/equipe.png"
                                alt="Equipe SENAI"
                                className="w-full h-full object-cover opacity-60"
                            />
                        </div>
                        {/* Background Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#003B71]/90 to-[#003B71]/60 mix-blend-multiply" />

                        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 md:px-12 pt-16">
                            <div className="mb-6 inline-block">
                                <span className="py-2 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-[0.2em] uppercase text-white shadow-lg">
                                    Quem Faz Acontecer
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
                                Nossa <span className="text-[#00aceb]">Equipe</span>
                            </h1>
                            <p className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                                Conheça as mentes brilhantes, professores dedicados e alunos talentosos que transformaram a visão da Vitrine Tecnológica em realidade.
                            </p>
                        </div>
                    </section>
                </FadeIn>

                {/* Highlights Section */}
                <section className="py-20 px-6 max-w-7xl mx-auto -mt-16 relative z-20">
                    <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                        {highlights.map((member, idx) => (
                            <StaggerItem key={idx}>
                                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 flex flex-col items-center text-center transform hover:-translate-y-2 transition-all duration-300">
                                    <div className="w-32 h-32 rounded-full bg-gray-200 mb-6 flex items-center justify-center overflow-hidden border-4 border-[#00aceb]/20 shadow-inner">
                                        {member.photoUrl ? (
                                            <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={48} className="text-gray-400" />
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#003B71] mb-2">{member.name}</h3>
                                    <span className="inline-block px-3 py-1 bg-blue-50 text-[#00aceb] text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                                        {member.role}
                                    </span>
                                    <p className="text-gray-600 leading-relaxed text-sm mb-6">
                                        {member.description}
                                    </p>

                                    <div className="flex gap-4 mt-auto">
                                        {member.linkedin && <Linkedin size={20} className="text-gray-400 hover:text-[#0077b5] cursor-pointer transition-colors" />}
                                        {member.github && <Github size={20} className="text-gray-400 hover:text-black cursor-pointer transition-colors" />}
                                    </div>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>

                    {/* Contributors Grid */}
                    <FadeIn>
                        <div className="bg-white rounded-[2.5rem] p-10 md:p-16 shadow-lg border border-gray-100/50">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl font-bold text-[#003B71] mb-4">Colaboradores & Parceiros</h2>
                                <div className="h-1 w-24 bg-[#00aceb] mx-auto rounded-full"></div>
                                <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
                                    Professores, mentores, alunos e apoiadores que contribuíram com código, design, ideias ou gestão durante a jornada do projeto.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {contributors.map((member, idx) => (
                                    <div key={idx} className="group bg-gray-50 hover:bg-white p-6 rounded-xl transition-all duration-300 border border-transparent hover:border-gray-100 hover:shadow-md flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-[#003B71]/10 flex items-center justify-center text-[#003B71] group-hover:bg-[#00aceb] group-hover:text-white transition-colors">
                                            <span className="font-bold text-lg">{member.name.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-sm group-hover:text-[#003B71] transition-colors">{member.name}</h4>
                                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{member.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                </section>
            </div>
        </SectionLayout>
    )
}

export default Equipe
