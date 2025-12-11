import news1 from '@/assets/images/news/news-1.jpg'
import news2 from '@/assets/images/news/news-graduacao.png' // using valid existing file
import news3 from '@/assets/images/news/news-seminario.png'
import news4 from '@/assets/images/news/news-3.png' // using valid existing file
import news5 from '@/assets/images/news/news-2.png' // using valid existing file
// fallback for others or reuse

// Note: ID 2 uses an external URL, so we keep it as string.

export const mockNews = [
  {
    "id": 1,
    "title": "SENAI CIMATEC tem projeto vencedor do Prêmio ANP de Inovação",
    "date": "2025-12-10",
    "category": "Inovação",
    "imageUrl": news1,
    "summary": "SENAI CIMATEC conquista destaque no Prêmio ANP de Inovação Tecnológica com o programa BRAVE, em parceria com a Shell Brasil.",
    "content": "O SENAI CIMATEC foi destaque na edição 2025 do Prêmio ANP de Inovação Tecnológica, realizada em 5 de dezembro, no Rio de Janeiro. O BRAVE, Programa Brasileiro para o Desenvolvimento do Agave, conquistou a categoria dedicada à transição energética e às energias renováveis. A iniciativa é desenvolvida com investimentos oriundos da EMBRAPII e da cláusula de PD&I da ANP, em parceria com a Shell Brasil e a Unicamp."
  },
  {
    "id": 2,
    "title": "SENAI CIMATEC vence a 10ª edição do Programa Mãos Dadas",
    "date": "2025-12-01",
    "category": "Premiação",
    "imageUrl": "https://www.senaicimatec.com.br/wp-content/uploads/2025/12/WhatsApp-Image-2025-12-01-at-10.49.28.jpeg",
    "summary": "Projeto de reaproveitamento de materiais em PD&I é reconhecido na 10ª edição do Programa Mãos Dadas.",
    "content": "O SENAI CIMATEC foi vencedor da 10ª edição do Programa Mãos Dadas com um projeto inovador focado no reaproveitamento de materiais em Pesquisa, Desenvolvimento e Inovação (PD&I). A iniciativa reforça o compromisso da instituição com a sustentabilidade e a eficiência no uso de recursos."
  },
  {
    "id": 3,
    "title": "CIMATEC Startups realiza graduação das turmas de Validação e Operação",
    "date": "2025-11-25",
    "category": "Startups",
    "imageUrl": news2,
    "summary": "Ciclo de aceleração encerra com graduação das startups nas fases de Validação e Operação.",
    "content": "O SENAI CIMATEC realizou, na última terça-feira (25), a graduação das turmas 2025.2 da trilha de Validação e Operação do CIMATEC Startups, programa voltado ao desenvolvimento de negócios inovadores. Durante três meses, os participantes vivenciaram uma jornada intensa de mentorias especializadas, atividades práticas, acompanhamento contínuo e eventos de networking que contribuíram para a maturação de suas soluções e modelos de negócio.\n\nO encontro reuniu empreendedores, mentores e convidados em um momento de celebração e troca de experiências. O evento contou com rodadas de pitch, em que as startups apresentaram seus projetos, e com a palestra 'Inteligência Artificial no Marketing Digital', ministrada pela especialista Marta Souza.\n\nAlém da entrega dos certificados de conclusão, o CIMATEC Startups também reconheceu o desempenho de equipes que se destacaram ao longo da trilha. Foram premiadas:\n\n- Flyserv – Pitch Destaque\n- Violet Wound – Inovação Tecnológica\n- Regenerativa – Startup Destaque"
  },
  {
    "id": 4,
    "title": "XXIV Seminário das Indústrias Gráficas destaca tendências da Gráfica 5.0",
    "date": "2025-11-27",
    "category": "Indústria",
    "imageUrl": news3,
    "summary": "Evento realizado no SENAI CIMATEC discute o futuro do setor no Brasil com foco em inovação, sustentabilidade e criatividade.",
    "content": "Empresários, especialistas e profissionais do setor gráfico se reuniram na última quarta-feira (26) no SENAI CIMATEC para o XXIV Seminário das Indústrias Gráficas, evento que colocou em pauta inovação, sustentabilidade e criatividade como pilares da Gráfica 5.0. O seminário apresentou reflexões sobre os desafios e as oportunidades de uma indústria que vem passando por transformação acelerada nas últimas décadas.\n\nA mesa de abertura foi composta por Josair Bastos, presidente do Sindicato das Indústrias Gráficas; Franklin Santos, diretor técnico do Sebrae; Mariana Inah, coordenadora da Indústria Criativa do SENAI CIMATEC; e Carlos Henrique Passos, presidente da Federação das Indústrias do Estado da Bahia (FIEB).\n\nDurante sua fala, o presidente da FIEB, Carlos Henrique Passos, ressaltou o papel da criatividade e da qualificação profissional neste novo cenário. 'A palavra criatividade tem muito a ver com o desafio dos negócios, que exige tecnologia. Mas ela, sozinha, não resolve. Precisamos falar de pessoas', completou."
  },
  {
    "id": 5,
    "title": "Jornada Nacional de Inovação destaca potencial do Nordeste em energias renováveis",
    "date": "2025-11-27",
    "category": "Energia",
    "imageUrl": news4,
    "summary": "Encontro regional discute estratégias para impulsionar o setor energético na região.",
    "content": "A Jornada Nacional de Inovação reuniu especialistas e líderes do setor para discutir o papel estratégico do Nordeste na transição energética do Brasil. O evento destacou projetos de hidrogênio verde, energia eólica offshore e novas tecnologias para o setor de óleo e gás."
  },
  {
    "id": 6,
    "title": "QuIIN fortalece cooperação internacional durante missão técnica à Alemanha",
    "date": "2025-11-26",
    "category": "Internacional",
    "imageUrl": news1,
    "summary": "Missão técnica promovida pela EMBRAPII e Fraunhofer busca novas parcerias tecnológicas.",
    "content": "Representantes do SENAI CIMATEC integraram a comitiva brasileira na missão técnica à Alemanha, promovida pela EMBRAPII em parceria com o Instituto Fraunhofer. O objetivo foi fortalecer a cooperação internacional em pesquisa aplicada e inovação industrial, com foco em manufatura avançada e digitalização."
  },
  {
    "id": 7,
    "title": "SENAI abre inscrições para cursos técnicos com foco na Indústria 4.0",
    "date": "2025-11-20",
    "category": "Educação",
    "imageUrl": news5,
    "summary": "Novas turmas para cursos em automação, robótica e desenvolvimento de sistemas.",
    "content": "O SENAI está com inscrições abertas para o processo seletivo dos cursos técnicos 2026.1. São milhares de vagas em diversas áreas tecnológicas, com destaque para as formações voltadas à Indústria 4.0, como Automação Industrial, Mecatrônica e Desenvolvimento de Sistemas. Os cursos contam com aulas práticas em laboratórios de ponta."
  },
  {
    "id": 8,
    "title": "Novo laboratório de Inteligência Artificial é inaugurado no CIMATEC Park",
    "date": "2025-11-15",
    "category": "Tecnologia",
    "imageUrl": news4,
    "summary": "Infraestrutura de ponta impulsionará pesquisas em IA generativa e visão computacional.",
    "content": "O SENAI CIMATEC inaugurou seu mais novo laboratório dedicado à Inteligência Artificial no complexo CIMATEC Park. O espaço, equipado com supercomputadores e data center de última geração, será utilizado para o desenvolvimento de soluções em IA generativa, visão computacional e análise de grandes volumes de dados para a indústria."
  },
  {
    "id": 9,
    "title": "SENAI promove Hackathon Industrial com foco em soluções sustentáveis",
    "date": "2025-11-10",
    "category": "Evento",
    "imageUrl": news1,
    "summary": "Maratona de programação reúne estudantes e startups para resolver desafios reais da indústria.",
    "content": "Mais de 200 participantes se reuniram no SENAI para o Hackathon Industrial 2025. O desafio deste ano foi desenvolver soluções tecnológicas voltadas para a sustentabilidade e a economia circular nas linhas de produção. As equipes vencedoras receberão mentorias e apoio para transformar seus protótipos em negócios."
  },
  {
    "id": 10,
    "title": "Parceria entre SENAI e setor automotivo impulsiona mobilidade elétrica na Bahia",
    "date": "2025-11-05",
    "category": "Parceria",
    "imageUrl": news5,
    "summary": "Acordo visa capacitação profissional e desenvolvimento de novas tecnologias para veículos elétricos.",
    "content": "O SENAI firmou um acordo de cooperação técnica com grandes montadoras instaladas na Bahia para impulsionar a cadeia da mobilidade elétrica no estado. A parceria prevê a criação de cursos específicos para a manutenção de veículos elétricos e híbridos, além de projetos de P&D voltados para baterias e infraestrutura de recarga."
  }
]

export default mockNews
