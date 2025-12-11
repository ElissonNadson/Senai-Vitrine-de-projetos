import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Building2, Users, ArrowRight } from 'lucide-react'

const LocationSection: React.FC = () => {
    return (
        <section className="w-full bg-white py-24 relative overflow-hidden" id="localizacao">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16 items-center">

                    {/* Left Column: Content */}
                    <div className="lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Tag */}
                            <div className="inline-flex items-center gap-2 mb-6">
                                <div className="w-12 h-0.5 bg-gray-300"></div>
                                <span className="text-sm font-semibold tracking-widest uppercase text-gray-500">Localização</span>
                            </div>

                            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                                Visite o <span className="text-[#00aceb]">SENAI</span>
                            </h2>

                            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                                As portas do SENAI Feira de Santana estão abertas. Agende uma visita guiada e explore nossa estrutura de ponta e as oportunidades que nosso ecossistema de inovação pode oferecer.
                            </p>

                            {/* Points List Removed as per request */}

                            {/* Button */}
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLSeX3ZQER_D611d0rQBXKW41Hh72s7p_eoxfERjtQ5VTxFlDtA/viewform"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-900 px-8 py-4 rounded-full font-bold transition-all duration-300 group"
                            >
                                <span>Agende uma visita</span>
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    <ArrowRight size={16} className="text-[#00aceb]" />
                                </div>
                            </a>

                        </motion.div>
                    </div>

                    {/* Right Column: Map */}
                    <div className="lg:w-1/2 w-full h-[500px] bg-gray-100 rounded-[30px] overflow-hidden shadow-2xl relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="w-full h-full"
                        >
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3899.2548392291706!2d-38.969303499999995!3d-12.2310166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x71438165404b7db%3A0x82474a6ddb9068c0!2sSENAI%20Feira%20de%20Santana!5e0!3m2!1spt-BR!2sbr!4v1765416311518!5m2!1spt-BR!2sbr"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Mapa SENAI Feira de Santana"
                            />
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default LocationSection
