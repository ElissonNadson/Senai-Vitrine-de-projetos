import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Mail, Phone, MapPin, Briefcase, Calendar, Save } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

const ProfileTab: React.FC = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    telefone: '',
    curso: 'Técnico em Desenvolvimento de Sistemas',
    matricula: '000.000000',
    linkedin: '',
    github: '',
    bio: ''
  })

  const handleSave = () => {
    // TODO: Implementar salvar dados
    setIsEditing(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-3xl shadow-lg">
              {formData.nome.charAt(0).toUpperCase()}
            </div>
            <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center shadow-lg transition-colors">
              <Camera className="h-4 w-4" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {formData.nome}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {formData.curso}
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary-dark dark:text-primary-light rounded-full text-xs font-medium">
                Estudante
              </span>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                Ativo
              </span>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            {isEditing ? 'Cancelar' : 'Editar Perfil'}
          </button>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Informações Pessoais
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nome Completo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome Completo
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Mail className="inline h-4 w-4 mr-1" />
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Phone className="inline h-4 w-4 mr-1" />
              Telefone
            </label>
            <input
              type="tel"
              value={formData.telefone}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              disabled={!isEditing}
              placeholder="(00) 00000-0000"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Matrícula */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Briefcase className="inline h-4 w-4 mr-1" />
              Matrícula
            </label>
            <input
              type="text"
              value={formData.matricula}
              disabled
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Curso */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Curso
            </label>
            <input
              type="text"
              value={formData.curso}
              disabled
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              disabled={!isEditing}
              rows={3}
              placeholder="Conte um pouco sobre você..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors shadow-sm"
            >
              <Save className="h-4 w-4" />
              Salvar Alterações
            </button>
          </div>
        )}
      </div>

      {/* Social Links */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Redes Sociais
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              LinkedIn
            </label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              disabled={!isEditing}
              placeholder="https://linkedin.com/in/seu-perfil"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              GitHub
            </label>
            <input
              type="url"
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              disabled={!isEditing}
              placeholder="https://github.com/seu-usuario"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProfileTab
