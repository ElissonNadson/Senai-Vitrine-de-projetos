export interface TeamMember {
    name: string
    role: string
    description?: string
    photoUrl?: string
    linkedin?: string
    github?: string
    highlight?: boolean
}

// TEAM DATA - EASY TO EDIT LIST
export const teamMembers: TeamMember[] = [
    // HIGHLIGHTS (Destaques)
    {
        name: 'Ingrid Passos',
        role: 'Gestora de Projetos & Inovação',
        description: 'Liderança visionária na estruturação do ecossistema de inovação e conexão com a indústria.',
        highlight: true,
        // photoUrl: '/team/ingrid.jpg' // Add photo later
    },
    {
        name: 'Erik',
        role: 'Líder Técnico & Fullstack Developer',
        description: 'Arquiteto principal da plataforma, responsável pelas decisões técnicas e implementação robusta.',
        highlight: true,
    },
    {
        name: 'Elisson',
        role: 'Desenvolvedor',
        description: 'Peça chave na evolução da plataforma, contribuindo com funcionalidades essenciais e design.',
        highlight: true,
    },

    // CONTRIBUTORS (Lista Geral)
    { name: 'Professor A', role: 'Orientador Técnico', highlight: false },
    { name: 'Professor B', role: 'Mentor de Design', highlight: false },
    { name: 'Aluno Colaborador 1', role: 'Desenvolvedor Frontend', highlight: false },
    { name: 'Aluno Colaborador 2', role: 'QA & Testes', highlight: false },
    { name: 'Ex-Aluno Contribuinte', role: 'Design UI/UX', highlight: false },
    { name: 'Colaborador Pontual', role: 'Apoio Infraestrutura', highlight: false },
]
