import { Lightbulb, FileText, Wrench, Rocket } from 'lucide-react'

interface PhaseStatsCardsProps {
  projetosIdeacao: number
  projetosModelagem: number
  projetosPrototipagem: number
  projetosImplementacao: number
}

export function PhaseStatsCards({
  projetosIdeacao,
  projetosModelagem,
  projetosPrototipagem,
  projetosImplementacao,
}: PhaseStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Ideação */}
      <div className="group relative bg-yellow-50 dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border border-yellow-200 dark:border-yellow-700 flex flex-col">
        {/* Barra colorida no topo */}
        <div className="h-1.5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 flex-shrink-0"></div>

        <div className="p-6 flex-1 flex flex-col">
          {/* Número e ícone */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg flex-shrink-0">
              <Lightbulb className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-5xl font-black text-gray-900 dark:text-white group-hover:text-yellow-600 transition-colors duration-300">
              {projetosIdeacao}
            </h3>
          </div>

          {/* Nome e descrição */}
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">Ideação</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Fase inicial de concepção do projeto
            </p>
          </div>
        </div>

        {/* Footer do card */}
        <div className="px-6 py-2.5 bg-yellow-100 dark:bg-gray-700/50 border-t border-yellow-200 dark:border-yellow-800/50 flex-shrink-0">
          <div className="flex items-center justify-start">
            <span className="text-xs text-yellow-700 dark:text-yellow-400 font-semibold">Fase 1</span>
          </div>
        </div>
      </div>

      {/* Modelagem */}
      <div className="group relative bg-blue-50 dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border border-blue-200 dark:border-blue-700 flex flex-col">
        {/* Barra colorida no topo */}
        <div className="h-1.5 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 flex-shrink-0"></div>

        <div className="p-6 flex-1 flex flex-col">
          {/* Número e ícone */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex-shrink-0">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-5xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300">
              {projetosModelagem}
            </h3>
          </div>

          {/* Nome e descrição */}
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">Modelagem</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Definição de processos, recursos e documentação
            </p>
          </div>
        </div>

        {/* Footer do card */}
        <div className="px-6 py-2.5 bg-blue-100 dark:bg-gray-700/50 border-t border-blue-200 dark:border-blue-800/50 flex-shrink-0">
          <div className="flex items-center justify-start">
            <span className="text-xs text-blue-700 dark:text-blue-400 font-semibold">Fase 2</span>
          </div>
        </div>
      </div>

      {/* Prototipagem */}
      <div className="group relative bg-purple-50 dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border border-purple-200 dark:border-purple-700 flex flex-col">
        {/* Barra colorida no topo */}
        <div className="h-1.5 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 flex-shrink-0"></div>

        <div className="p-6 flex-1 flex flex-col">
          {/* Número e ícone */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex-shrink-0">
              <Wrench className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-5xl font-black text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors duration-300">
              {projetosPrototipagem}
            </h3>
          </div>

          {/* Nome e descrição */}
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">Prototipagem</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Desenvolvimento e testes do protótipo funcional
            </p>
          </div>
        </div>

        {/* Footer do card */}
        <div className="px-6 py-2.5 bg-purple-100 dark:bg-gray-700/50 border-t border-purple-200 dark:border-purple-800/50 flex-shrink-0">
          <div className="flex items-center justify-start">
            <span className="text-xs text-purple-700 dark:text-purple-400 font-semibold">Fase 3</span>
          </div>
        </div>
      </div>

      {/* Implementação */}
      <div className="group relative bg-green-50 dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border border-green-200 dark:border-green-700 flex flex-col">
        {/* Barra colorida no topo */}
        <div className="h-1.5 bg-gradient-to-r from-green-400 via-green-500 to-green-600 flex-shrink-0"></div>

        <div className="p-6 flex-1 flex flex-col">
          {/* Número e ícone */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-lg flex-shrink-0">
              <Rocket className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-5xl font-black text-gray-900 dark:text-white group-hover:text-green-600 transition-colors duration-300">
              {projetosImplementacao}
            </h3>
          </div>

          {/* Nome e descrição */}
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">Implementação</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Aplicação da solução em contexto real ou simulado
            </p>
          </div>
        </div>

        {/* Footer do card */}
        <div className="px-6 py-2.5 bg-green-100 dark:bg-gray-700/50 border-t border-green-200 dark:border-green-800/50 flex-shrink-0">
          <div className="flex items-center justify-start">
            <span className="text-xs text-green-700 dark:text-green-400 font-semibold">Fase 4</span>
          </div>
        </div>
      </div>
    </div>
  )
}
