import React from 'react'
import { X, FileText, Shield, AlertTriangle, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAccept }) => {
  const handleAccept = () => {
    onAccept()
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Termos de Uso e Política de Privacidade
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  SENAI - Vitrine de Projetos Acadêmicos
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Area */}
          <div
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            
            {/* Alerta Importante */}
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border-2 border-yellow-500 dark:border-yellow-600 rounded-xl p-5">
              <div className="flex gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-700 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-yellow-900 dark:text-yellow-100 text-lg mb-2">
                    Leia Atentamente Antes de Prosseguir
                  </h3>
                  <p className="text-sm text-yellow-900 dark:text-yellow-100 leading-relaxed">
                    Ao aceitar estes termos, você estará concordando com a <strong>cessão de direitos autorais</strong> do 
                    seu projeto para o SENAI, permitindo sua continuação por outros alunos em semestres futuros caso não seja concluído. 
                    Leia todos os termos antes de aceitar.
                  </p>
                </div>
              </div>
            </div>

            {/* Seção 1: Termos de Uso */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  1. TERMOS DE USO DA PLATAFORMA
                </h3>
              </div>

              <div className="space-y-4 text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                <p>
                  <strong>1.1 Aceitação dos Termos:</strong> Ao utilizar a plataforma "Vitrine de Projetos" do 
                  SENAI - Serviço Nacional de Aprendizagem Industrial, inscrito no CNPJ nº 03.795.071/0001-16, 
                  com sede na Rua Edístio Pondé, nº 365, STIEP, Salvador/BA, você declara ter lido, compreendido 
                  e concordado integralmente com estes Termos de Uso e a Política de Privacidade.
                </p>

                <p>
                  <strong>1.2 Descrição da Plataforma:</strong> A "Vitrine de Projetos" é uma plataforma digital 
                  destinada ao cadastro, armazenamento, compartilhamento e divulgação de projetos acadêmicos 
                  desenvolvidos por alunos do SENAI durante seus cursos técnicos e de aprendizagem industrial.
                </p>

                <p>
                  <strong>1.3 Usuários Elegíveis:</strong> A plataforma é destinada exclusivamente a:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Alunos regularmente matriculados em cursos do SENAI</li>
                  <li>Orientadores e instrutores autorizados</li>
                  <li>Equipe administrativa e pedagógica do SENAI</li>
                  <li>Visitantes com acesso limitado para visualização pública</li>
                </ul>

                <p>
                  <strong>1.4 Obrigações do Usuário:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Fornecer informações verdadeiras, precisas e atualizadas</li>
                  <li>Manter a confidencialidade de suas credenciais de acesso</li>
                  <li>Utilizar a plataforma exclusivamente para fins educacionais</li>
                  <li>Respeitar os direitos de propriedade intelectual</li>
                  <li>Não publicar conteúdo ofensivo, discriminatório ou ilegal</li>
                  <li>Não utilizar a plataforma para fins comerciais sem autorização</li>
                </ul>
              </div>
            </section>

            {/* Seção 2: Cessão de Direitos */}
            <section className="space-y-4 bg-red-50 dark:bg-red-900/10 p-5 rounded-xl border-2 border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <h3 className="text-xl font-bold text-red-900 dark:text-red-100">
                  2. CESSÃO DE DIREITOS AUTORAIS E PROPRIEDADE INTELECTUAL
                </h3>
              </div>

              <div className="space-y-4 text-base text-red-900 dark:text-red-50 leading-relaxed font-medium">
                <p>
                  <strong>2.1 Titularidade dos Projetos:</strong> Ao publicar um projeto na plataforma, o aluno 
                  <strong> CEDE AO SENAI, DE FORMA GRATUITA, IRREVOGÁVEL E IRRETRATÁVEL</strong>, os direitos 
                  patrimoniais sobre o projeto desenvolvido, permanecendo o SENAI como titular dos direitos para 
                  todos os fins educacionais, institucionais e de pesquisa.
                </p>

                <p>
                  <strong>2.2 Direitos Morais:</strong> O aluno <strong>MANTÉM OS DIREITOS MORAIS</strong> sobre 
                  sua obra, incluindo o direito de ser reconhecido como autor original do projeto, conforme previsto 
                  na Lei nº 9.610/1998 (Lei de Direitos Autorais).
                </p>

                <p>
                  <strong>2.3 Continuidade de Projetos Não Concluídos:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2 bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <li>
                    <strong>Projetos Incompletos:</strong> Caso o projeto não seja concluído ao final do período letivo, 
                    o SENAI reserva-se o direito de disponibilizar o projeto para continuação por outros alunos em 
                    semestres subsequentes.
                  </li>
                  <li>
                    <strong>Reconhecimento de Autoria:</strong> Os alunos que derem continuidade ao projeto serão 
                    considerados coautores, e todos os autores (originais e subsequentes) serão devidamente creditados.
                  </li>
                  <li>
                    <strong>Notificação:</strong> O aluno original será notificado quando seu projeto for selecionado 
                    para continuação por outros estudantes.
                  </li>
                  <li>
                    <strong>Aprovação Pedagógica:</strong> A decisão de disponibilizar um projeto para continuação 
                    será tomada pela equipe pedagógica do SENAI, considerando critérios de relevância educacional, 
                    viabilidade técnica e impacto social.
                  </li>
                </ul>

                <p>
                  <strong>2.4 Uso Institucional:</strong> O SENAI poderá utilizar os projetos cadastrados para:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Divulgação institucional em eventos, feiras e exposições</li>
                  <li>Material didático e pedagógico para cursos futuros</li>
                  <li>Pesquisa e desenvolvimento de metodologias educacionais</li>
                  <li>Promoção da instituição em mídias digitais e impressas</li>
                  <li>Participação em competições e premiações acadêmicas</li>
                </ul>

                <p>
                  <strong>2.5 Responsabilidade sobre Conteúdo:</strong> O aluno declara que o projeto cadastrado 
                  é de sua autoria ou possui autorização para publicação, não violando direitos de terceiros, 
                  patentes, marcas registradas ou segredos industriais.
                </p>
              </div>
            </section>

            {/* Seção 3: Política de Privacidade */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  3. POLÍTICA DE PRIVACIDADE E PROTEÇÃO DE DADOS (LGPD)
                </h3>
              </div>

              <div className="space-y-4 text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                <p>
                  <strong>3.1 Conformidade Legal:</strong> Esta política está em conformidade com a 
                  <strong> Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)</strong> e demais 
                  normativos correlatos aplicáveis ao tratamento de dados pessoais no Brasil.
                </p>

                <p>
                  <strong>3.2 Controlador dos Dados:</strong> O SENAI - Serviço Nacional de Aprendizagem Industrial 
                  (CNPJ 03.795.071/0001-16) atua como <strong>CONTROLADOR</strong> dos dados pessoais coletados 
                  através da plataforma.
                </p>

                <p>
                  <strong>3.3 Dados Pessoais Coletados:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
                  <li><strong>Dados de Identificação:</strong> Nome completo, CPF, RG, data de nascimento</li>
                  <li><strong>Dados de Contato:</strong> E-mail institucional, telefone</li>
                  <li><strong>Dados Acadêmicos:</strong> Matrícula, curso, turma, unidade curricular, desempenho</li>
                  <li><strong>Dados do Projeto:</strong> Título, descrição, categoria, arquivos, código-fonte</li>
                  <li><strong>Dados de Equipe:</strong> Nomes dos coautores, orientador, membros do grupo</li>
                  <li><strong>Dados de Navegação:</strong> IP, logs de acesso, cookies, sessão</li>
                  <li><strong>Dados Sensíveis (quando aplicável):</strong> Necessidades especiais para acessibilidade</li>
                </ul>

                <p>
                  <strong>3.4 Finalidades do Tratamento:</strong> Os dados pessoais são coletados e tratados para:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Cadastro e autenticação de usuários na plataforma</li>
                  <li>Gestão de projetos acadêmicos e acompanhamento pedagógico</li>
                  <li>Comunicação institucional sobre projetos e eventos</li>
                  <li>Geração de relatórios estatísticos e indicadores educacionais</li>
                  <li>Divulgação de projetos em eventos e mídias institucionais</li>
                  <li>Cumprimento de obrigações legais e regulatórias</li>
                  <li>Melhoria contínua da plataforma e dos serviços educacionais</li>
                </ul>

                <p>
                  <strong>3.5 Base Legal do Tratamento (Art. 7º da LGPD):</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Consentimento:</strong> Mediante aceitação expressa destes termos</li>
                  <li><strong>Execução de Contrato:</strong> Cumprimento de obrigações educacionais</li>
                  <li><strong>Interesse Legítimo:</strong> Pesquisa educacional e melhoria de metodologias</li>
                  <li><strong>Obrigação Legal:</strong> Cumprimento de normas do MEC e legislação educacional</li>
                </ul>

                <p>
                  <strong>3.6 Compartilhamento de Dados:</strong> Os dados poderão ser compartilhados com:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Unidades do SENAI em todo território nacional</li>
                  <li>Confederação Nacional da Indústria (CNI)</li>
                  <li>Órgãos reguladores e fiscalizadores (MEC, MTE)</li>
                  <li>Empresas parceiras para estágios e inserção profissional</li>
                  <li>Terceiros autorizados mediante consentimento expresso</li>
                </ul>

                <p>
                  <strong>3.7 Armazenamento e Segurança:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Os dados são armazenados em servidores seguros com criptografia</li>
                  <li>Backups são realizados periodicamente</li>
                  <li>Acesso restrito mediante autenticação e controle de permissões</li>
                  <li>Monitoramento contínuo de segurança e prevenção de vazamentos</li>
                  <li>Conformidade com padrões ISO 27001 de segurança da informação</li>
                </ul>

                <p>
                  <strong>3.8 Retenção de Dados:</strong> Os dados pessoais serão mantidos pelo período necessário 
                  para cumprimento das finalidades descritas, respeitando os prazos legais de:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Dados Acadêmicos:</strong> Mínimo de 5 anos após conclusão do curso</li>
                  <li><strong>Dados de Projetos:</strong> Prazo indeterminado para fins educacionais e históricos</li>
                  <li><strong>Dados de Navegação:</strong> 6 meses a partir da coleta</li>
                </ul>
              </div>
            </section>

            {/* Seção 4: Direitos do Titular */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  4. DIREITOS DO TITULAR DOS DADOS (LGPD)
                </h3>
              </div>

              <div className="space-y-4 text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                <p>
                  Conforme o <strong>Art. 18 da LGPD</strong>, o titular dos dados possui os seguintes direitos:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2 bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
                  <li><strong>Confirmação e Acesso:</strong> Confirmar a existência e acessar seus dados pessoais</li>
                  <li><strong>Correção:</strong> Solicitar correção de dados incompletos, inexatos ou desatualizados</li>
                  <li><strong>Anonimização:</strong> Solicitar anonimização de dados desnecessários</li>
                  <li><strong>Eliminação:</strong> Solicitar eliminação de dados tratados com consentimento (exceto casos legais)</li>
                  <li><strong>Portabilidade:</strong> Solicitar portabilidade dos dados para outro fornecedor</li>
                  <li><strong>Informação:</strong> Obter informações sobre compartilhamento de dados</li>
                  <li><strong>Revogação:</strong> Revogar consentimento (ressalvadas obrigações legais)</li>
                  <li><strong>Oposição:</strong> Opor-se ao tratamento realizado sem consentimento</li>
                </ul>

                <p>
                  <strong>4.1 Canal de Atendimento:</strong> Para exercer seus direitos, entre em contato:
                </p>
                <ul className="list-none ml-4 space-y-1">
                  <li>📧 <strong>E-mail:</strong> lgpd@fieb.org.br</li>
                  <li>📞 <strong>Telefone:</strong> (71) 3343-1200</li>
                  <li>🏢 <strong>Endereço:</strong> Rua Edístio Pondé, nº 365, STIEP, Salvador/BA, CEP 41770-395</li>
                </ul>

                <p>
                  <strong>4.2 Prazo de Resposta:</strong> O SENAI responderá às solicitações em até 15 (quinze) dias úteis.
                </p>
              </div>
            </section>

            {/* Seção 5: Disposições Gerais */}
            <section className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                5. DISPOSIÇÕES GERAIS
              </h3>

              <div className="space-y-4 text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                <p>
                  <strong>5.1 Alterações:</strong> O SENAI reserva-se o direito de modificar estes Termos e a 
                  Política de Privacidade a qualquer momento. Alterações significativas serão notificadas por 
                  e-mail ou na plataforma com 30 dias de antecedência.
                </p>

                <p>
                  <strong>5.2 Rescisão:</strong> O SENAI pode suspender ou encerrar o acesso do usuário em caso 
                  de violação destes termos, sem aviso prévio.
                </p>

                <p>
                  <strong>5.3 Lei Aplicável:</strong> Estes termos são regidos pelas leis da República Federativa 
                  do Brasil. Fica eleito o Foro da Comarca de Salvador/BA para dirimir quaisquer controvérsias.
                </p>

                <p>
                  <strong>5.4 Contato:</strong> Dúvidas sobre estes termos podem ser enviadas para:
                </p>
                <ul className="list-none ml-4 space-y-1">
                  <li>📧 projetos@senai.ba.br</li>
                  <li>📧 lgpd@fieb.org.br</li>
                </ul>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <strong>Última atualização:</strong> 19 de outubro de 2025<br />
                  <strong>Versão:</strong> 1.0<br />
                  <strong>SENAI - Serviço Nacional de Aprendizagem Industrial</strong><br />
                  CNPJ: 03.795.071/0001-16
                </p>
              </div>
            </section>

          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 space-y-4">
            
            {/* Botões */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 px-6 py-3 rounded-xl font-bold transition-all bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
              >
                Aceitar Termos
              </button>
            </div>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Ao aceitar, você concorda com todos os termos e autoriza o tratamento de seus dados conforme descrito.
            </p>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default TermsModal
