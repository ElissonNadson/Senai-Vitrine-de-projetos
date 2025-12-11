import React from 'react'

// Exemplo de equipe SENAI Feira de Santana
const equipeSenaiFeira = [
  { nome: 'Ana Paula Oliveira', cargo: 'Coordenadora Pedagógica' },
  { nome: 'Carlos Souza', cargo: 'Instrutor de Automação' },
  { nome: 'Fernanda Lima', cargo: 'Instrutora de Robótica' },
  { nome: 'João Santos', cargo: 'Instrutor de TI' },
  { nome: 'Mariana Costa', cargo: 'Gestora de Projetos' },
  { nome: 'Rafael Almeida', cargo: 'Instrutor de Eletrotécnica' },
]

const SenaiTeamList: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12">
    {equipeSenaiFeira.map((membro) => (
      <div key={membro.nome} className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
          <span className="text-2xl font-bold text-blue-600">
            {membro.nome.split(' ')[0][0]}
          </span>
        </div>
        <div className="text-lg font-semibold text-gray-900 mb-1">{membro.nome}</div>
        <div className="text-sm text-gray-500">{membro.cargo}</div>
      </div>
    ))}
  </div>
)

export default SenaiTeamList
