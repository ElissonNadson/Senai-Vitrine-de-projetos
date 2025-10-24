import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { motion } from 'framer-motion'
import mockProjectsData from '@/data/mockProjects.json'

interface RatingDisplayProps {
  projectId: string
  readOnly?: boolean
}

interface RatingData {
  totalRating: number
  voteCount: number
}

export default function RatingDisplay({ projectId, readOnly = false }: RatingDisplayProps) {
  const [ratingData, setRatingData] = useState<RatingData>({ totalRating: 0, voteCount: 0 })
  const [userVote, setUserVote] = useState<number | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    // Tentar carregar dados do mock primeiro
    const project = mockProjectsData.projects.find(p => p.id === projectId)
    
    if (project && 'mediaAvaliacoes' in project && 'totalAvaliacoes' in project) {
      // Usar dados do mock se disponível
      const totalRating = project.mediaAvaliacoes * project.totalAvaliacoes
      setRatingData({
        totalRating,
        voteCount: project.totalAvaliacoes
      })
    } else {
      // Fallback para localStorage se mock não tiver dados
      const storedRatings = localStorage.getItem('projectRatings')
      if (storedRatings) {
        const ratings = JSON.parse(storedRatings)
        if (ratings[projectId]) {
          setRatingData(ratings[projectId])
        }
      }
    }

    // Verificar se o usuário já votou neste projeto
    const storedVotes = localStorage.getItem('userVotes')
    if (storedVotes) {
      const votes = JSON.parse(storedVotes)
      if (votes[projectId]) {
        setUserVote(votes[projectId])
        setHasVoted(true)
      }
    }
  }, [projectId])

  const handleRating = (newRating: number, isHalf: boolean = false) => {
    if (readOnly) return

    const finalRating = isHalf ? newRating - 0.5 : newRating

    // Atualizar rating no localStorage
    const storedRatings = localStorage.getItem('projectRatings')
    const ratings = storedRatings ? JSON.parse(storedRatings) : {}
    
    const currentData = ratings[projectId] || { totalRating: 0, voteCount: 0 }
    
    let updatedData
    if (hasVoted && userVote) {
      // Editando voto existente: remove voto anterior e adiciona novo
      updatedData = {
        totalRating: currentData.totalRating - userVote + finalRating,
        voteCount: currentData.voteCount
      }
    } else {
      // Novo voto
      updatedData = {
        totalRating: currentData.totalRating + finalRating,
        voteCount: currentData.voteCount + 1
      }
    }

    ratings[projectId] = updatedData
    localStorage.setItem('projectRatings', JSON.stringify(ratings))

    // Salvar voto do usuário
    const storedVotes = localStorage.getItem('userVotes')
    const votes = storedVotes ? JSON.parse(storedVotes) : {}
    votes[projectId] = finalRating
    localStorage.setItem('userVotes', JSON.stringify(votes))

    setRatingData(updatedData)
    setUserVote(finalRating)
    setHasVoted(true)
    setIsEditing(false)
  }

  const handleEditRating = () => {
    setIsEditing(true)
  }

  const averageRating = ratingData.voteCount > 0 
    ? ratingData.totalRating / ratingData.voteCount 
    : 0

  const displayRating = hasVoted && userVote ? userVote : averageRating
  const isEditable = !readOnly // Sempre editável se não for readOnly

  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      const ratingValue = hoveredRating || displayRating
      const isFilled = i <= Math.floor(ratingValue)
      const isHalfFilled = i === Math.ceil(ratingValue) && ratingValue % 1 !== 0

      stars.push(
        <div
          key={i}
          className="relative"
          onMouseLeave={() => isEditable && setHoveredRating(0)}
        >
          {/* Metade esquerda da estrela (meia estrela) */}
          <button
            type="button"
            disabled={!isEditable}
            onClick={() => isEditable && handleRating(i, true)}
            onMouseEnter={() => isEditable && setHoveredRating(i - 0.5)}
            className={`absolute inset-0 w-1/2 z-10 ${
              isEditable ? 'cursor-pointer' : 'cursor-default'
            }`}
            style={{ clipPath: 'inset(0 50% 0 0)' }}
          />
          
          {/* Metade direita da estrela (estrela inteira) */}
          <button
            type="button"
            disabled={!isEditable}
            onClick={() => isEditable && handleRating(i, false)}
            onMouseEnter={() => isEditable && setHoveredRating(i)}
            className={`relative transition-transform duration-200 ${
              isEditable ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            }`}
          >
            {isHalfFilled && Math.ceil(ratingValue) === i ? (
              <div className="relative">
                <Star
                  className="w-7 h-7 text-gray-300 dark:text-gray-600"
                  fill="currentColor"
                />
                <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                  <Star
                    className="w-7 h-7 text-yellow-400"
                    fill="currentColor"
                  />
                </div>
              </div>
            ) : (
              <Star
                className={`w-7 h-7 transition-colors duration-200 ${
                  isFilled
                    ? 'text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
                fill={isFilled ? 'currentColor' : 'none'}
                strokeWidth={isFilled ? 0 : 2}
              />
            )}
          </button>
        </div>
      )
    }
    return stars
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <motion.div 
          className="flex items-center gap-0.5"
          animate={isEditing ? {
            scale: [1, 1.05, 1],
            rotate: [0, -2, 2, -2, 0]
          } : {}}
          transition={{ duration: 0.5 }}
        >
          {renderStars()}
        </motion.div>
        {ratingData.voteCount > 0 && (
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            ({averageRating.toFixed(1)})
          </span>
        )}
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        {!hasVoted && ratingData.voteCount === 0 && 'Seja o primeiro a avaliar'}
        {!hasVoted && ratingData.voteCount > 0 && `${ratingData.voteCount} ${ratingData.voteCount === 1 ? 'avaliação' : 'avaliações'}`}
        {hasVoted && (
          <span className="text-green-600 dark:text-green-400 font-medium">
            Sua avaliação: {userVote?.toFixed(1)} {userVote === 1 ? 'estrela' : 'estrelas'}
          </span>
        )}
      </div>

      {isEditable && !readOnly && !hasVoted && (
        <div className="text-[10px] text-gray-400 dark:text-gray-500 italic text-center">
          Clique na metade da estrela para meia nota
        </div>
      )}

      {readOnly && (
        <div className="text-xs text-gray-500 dark:text-gray-400 italic">
        </div>
      )}

      {isEditing && (
        <div className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 animate-pulse">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          <span>Clique nas estrelas para alterar sua avaliação</span>
        </div>
      )}
    </div>
  )
}
