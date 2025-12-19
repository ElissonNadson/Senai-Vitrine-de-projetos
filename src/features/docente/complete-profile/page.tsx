import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Phone,
  Building2,
  FileText,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { getDepartamentos, Departamento } from '@/api/departamentos'
import { completarPerfilDocente } from '@/api/perfil'
import senaiLogo from '@/assets/images/Imagens/022-Senai.png'

interface FormData {
  telefone: string
  bio: string
  departamento_uuid: string
}

const CompleteProfileDocentePage = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingDepartamentos, setIsLoadingDepartamentos] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [departamentos, setDepartamentos] = useState<Departamento[]>([])

  const [formData, setFormData] = useState<FormData>({
    telefone: '',
    bio: '',
    departamento_uuid: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Redirecionar se não autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { replace: true })
    }
  }, [authLoading, isAuthenticated, navigate])

  // Carregar departamentos
  useEffect(() => {
    const loadDepartamentos = async () => {
      try {
        setIsLoadingDepartamentos(true)
        const data = await getDepartamentos()
        setDepartamentos(data || [])
      } catch (err) {
        console.error('Erro ao carregar departamentos:', err)
        setError('Erro ao carregar departamentos. Tente novamente.')
      } finally {
        setIsLoadingDepartamentos(false)
      }
    }

    loadDepartamentos()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const formatTelefone = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')

    // Aplica a máscara
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
    }
  }

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTelefone(e.target.value)
    setFormData(prev => ({ ...prev, telefone: formatted }))

    if (errors.telefone) {
      setErrors(prev => ({ ...prev, telefone: '' }))
    }
  }

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (currentStep) {
      case 1:
        if (!formData.telefone.trim()) {
          newErrors.telefone = 'Telefone é obrigatório'
        } else if (formData.telefone.replace(/\D/g, '').length < 10) {
          newErrors.telefone = 'Telefone inválido'
        }
        break

      case 2:
        if (!formData.departamento_uuid) {
          newErrors.departamento_uuid = 'Selecione um departamento'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    setStep(prev => prev - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(step)) return

    setIsLoading(true)
    setError('')

    try {
      await completarPerfilDocente({
        telefone: formData.telefone,
        bio: formData.bio || undefined,
        departamento_uuid: formData.departamento_uuid
      })

      setSuccess(true)

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/docente', { replace: true })
      }, 2000)

    } catch (err: any) {
      console.error('Erro ao completar perfil:', err)
      // Extrai mensagens de erro da API (validação ou mensagem geral)
      const responseData = err?.response?.data
      let errorMessage = 'Erro ao salvar perfil. Tente novamente.'

      if (responseData?.message) {
        // Erros de validação do class-validator vêm como array
        if (Array.isArray(responseData.message)) {
          errorMessage = responseData.message.join('. ')
        } else {
          errorMessage = responseData.message
        }
      } else if (responseData?.mensagem) {
        errorMessage = responseData.mensagem
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const steps = [
    { number: 1, title: 'Dados Pessoais', icon: User },
    { number: 2, title: 'Departamento', icon: Building2 },
    { number: 3, title: 'Confirmação', icon: CheckCircle }
  ]

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Perfil Completo! 🎉
          </h2>
          <p className="text-gray-600 mb-4">
            Seu cadastro foi finalizado com sucesso. Você será redirecionado para o dashboard.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Redirecionando...
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <img src={senaiLogo} alt="SENAI" className="h-8" />
          <div className="text-sm text-gray-600">
            Olá, <span className="font-semibold text-gray-900">{user?.nome || 'Docente'}</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete seu Perfil
          </h1>
          <p className="text-gray-600">
            Precisamos de mais algumas informações para finalizar seu cadastro como docente
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((s, index) => (
            <React.Fragment key={s.number}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${step >= s.number
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-500'
                    }`}
                >
                  <s.icon className="w-5 h-5" />
                </div>
                <span className={`mt-2 text-sm font-medium ${step >= s.number ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                  {s.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 md:w-24 h-1 mx-2 rounded transition-all ${step > s.number ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <AnimatePresence mode="wait">
            {/* Step 1: Dados Pessoais */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="p-6 md:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Dados Pessoais</h2>
                    <p className="text-sm text-gray-600">Informe seu telefone de contato</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Telefone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Telefone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleTelefoneChange}
                        placeholder="(71) 99999-9999"
                        maxLength={15}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.telefone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                      />
                    </div>
                    {errors.telefone && (
                      <p className="mt-1 text-sm text-red-600">{errors.telefone}</p>
                    )}
                  </div>

                  {/* Bio (opcional) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bio <span className="text-gray-400 font-normal">(opcional)</span>
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Conte um pouco sobre você, sua experiência e áreas de atuação..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Departamento */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="p-6 md:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Departamento</h2>
                    <p className="text-sm text-gray-600">Selecione seu departamento de atuação</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Departamento */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Departamento <span className="text-red-500">*</span>
                    </label>
                    {isLoadingDepartamentos ? (
                      <div className="flex items-center gap-2 py-3 text-gray-500">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Carregando departamentos...
                      </div>
                    ) : (
                      <select
                        name="departamento_uuid"
                        value={formData.departamento_uuid}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.departamento_uuid ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                      >
                        <option value="">Selecione um departamento</option>
                        {departamentos.map(dept => (
                          <option key={dept.uuid} value={dept.uuid}>
                            {dept.sigla} - {dept.nome}
                          </option>
                        ))}
                      </select>
                    )}
                    {errors.departamento_uuid && (
                      <p className="mt-1 text-sm text-red-600">{errors.departamento_uuid}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirmação */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="p-6 md:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Confirme seus Dados</h2>
                    <p className="text-sm text-gray-600">Revise as informações antes de salvar</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Resumo dos dados */}
                  <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Nome</p>
                        <p className="font-medium text-gray-900">{user?.nome}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Telefone</p>
                        <p className="font-medium text-gray-900">{formData.telefone}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Departamento</p>
                        <p className="font-medium text-gray-900">
                          {departamentos.find(d => d.uuid === formData.departamento_uuid)?.nome || '-'}
                        </p>
                      </div>
                    </div>

                    {formData.bio && (
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Bio</p>
                          <p className="font-medium text-gray-900">{formData.bio}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Aviso */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-700">
                      Ao confirmar, seus dados serão salvos e você poderá acessar todas as funcionalidades da plataforma.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer com botões */}
          <div className="px-6 md:px-8 py-4 bg-gray-50 border-t flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${step === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-200'
                }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
              >
                Continuar
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Confirmar e Salvar
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Link para pular */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/docente')}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Pular por agora e completar depois
          </button>
        </div>
      </div>
    </div>
  )
}

export default CompleteProfileDocentePage
