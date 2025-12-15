export interface TeamMember {
    name: string
    role: string
    badge?: string
    description?: string
    photoUrl?: string
    linkedin?: string
    github?: string
    lattes?: string
    highlight?: boolean
}

// TEAM DATA - EASY TO EDIT LIST
export const teamMembers: TeamMember[] = [
    // HIGHLIGHTS (Destaques)
    {
        name: 'Ingrid Barreto de Almeida Passos',
        role: 'Professora',
        badge: 'Gestora de Projetos & Inovação',
        highlight: true,
        photoUrl: '/ingrid.png',
        linkedin: 'https://linkedin.com/in/ingridbarreto',
        lattes: 'http://lattes.cnpq.br/5563872068411505'
    },
    {
        name: 'Erik do Carmo Marques',
        role: 'Professor',
        badge: 'Líder Técnico',
        highlight: true,
        photoUrl: '/erik.png',
        linkedin: 'https://linkedin.com/in/erik-do-carmo-marques',
        lattes: 'http://lattes.cnpq.br/0687567480757853'
    },
    {
        name: 'Elisson Nadson Souza Marques',
        role: 'Ex-Aluno',
        badge: 'Desenvolvedor',
        highlight: true,
        photoUrl: '/elisson.png',
        linkedin: 'https://linkedin.com/in/elissonmarques',
        lattes: 'https://lattes.cnpq.br/8599308365464044'
    },

    // CONTRIBUTORS - SORTED IN COMPONENT OR HERE
    { name: 'Victor Moak da Silva Souza (Professor)', role: 'Colaborador', linkedin: 'https://www.linkedin.com/in/victormoak/', highlight: false },
    { name: 'Verônica Lobo de Santana (Técnica Maker)', role: 'Colaborador', linkedin: 'https://www.linkedin.com/in/veronicalobodesantana/', highlight: false },
    { name: 'Victor Wallace A. S. da Silva (Ex-Aluno)', role: 'Colaborador', linkedin: 'https://www.linkedin.com/in/victor-wallace-dev-br/', highlight: false },
    { name: 'Vinícius Moreira Silva Santos (Ex-Aluno)', role: 'Colaborador', linkedin: 'https://www.linkedin.com/in/vinicius-mss/', highlight: false },
    { name: 'Silas Silva Lima de Matos (Ex-Aluno)', role: 'Colaborador', linkedin: 'https://www.linkedin.com/in/silas-matos/', highlight: false },
    { name: 'João Henrique Neri de Sousa (Ex-Aluno)', role: 'Colaborador', linkedin: 'https://www.linkedin.com/in/jo%C3%A3o-henrique-neri/', highlight: false },
    { name: 'Jean da Silva Freitas (Ex-Aluno)', role: 'Colaborador', highlight: false },
    { name: 'Vanessa Araujo (Ex-Aluna)', role: 'Colaborador', linkedin: 'https://www.linkedin.com/in/vanessa--araujo/', highlight: false },
    { name: 'Adriel Henrique Oliveira Nunes (Ex-Aluno)', role: 'Colaborador', linkedin: 'https://www.linkedin.com/in/adriel-henrique-a20601225/', highlight: false },
    { name: 'Guilerme Souza (Ex-Aluno)', role: 'Colaborador', linkedin: 'https://www.linkedin.com/in/guilherme-souza-414472219/', highlight: false },
    { name: 'Romário Andrade Rodrigues (Professor)', role: 'Colaborador', linkedin: 'https://www.linkedin.com/in/rom%C3%A1rio-rodrigues-4a25568b/', highlight: false },
    { name: 'Micaelle Verissimo R. da Silva (Bibliotecária)', role: 'Colaborador', linkedin: 'https://www.linkedin.com/in/micaellevrs/', highlight: false },
    { name: 'Ana Valéria Santos de O. Santana (Estagiária)', role: 'Colaborador', linkedin: 'https://www.linkedin.com/in/ana-val%C3%A9ria-santana-8b1515293/', highlight: false },
    { name: 'Giulia dos Santos Cardoso (Estagiária)', role: 'Colaborador', linkedin: 'https://www.linkedin.com/in/giuliacardoso2981/', highlight: false },
    { name: 'Welber Lima de Brito Guimarães (Coordenador)', role: 'Colaborador', linkedin: 'https://www.linkedin.com/in/erik-do-carmo-marques-a11289145/', highlight: false },
    { name: 'Édfran de Almeida Pereira (Ex-Aluno)', role: 'Colaborador', linkedin: 'https://www.linkedin.com/in/%C3%A9dfran-almeida-37b225227/', highlight: false },
    { name: 'Tatiane Santiago Santana (Ex-Aluna)', role: 'Colaborador', linkedin: 'https://www.linkedin.com/in/tatiane-santiago-santana/', highlight: false },
]
