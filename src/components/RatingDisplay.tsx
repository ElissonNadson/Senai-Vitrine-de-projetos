import React, { useEffect, useState } from 'react'
import lampOn from '@/assets/assert/lampada_acessa.svg'
import lampOff from '@/assets/assert/lampada_apagada.svg'

interface RatingDisplayProps {
  projectId: string
  size?: number
}

const AGG_KEY = (id: string) => `rating-aggregate:${id}`
const SELF_KEY = (id: string) => `rating-self:${id}`

const readAggregate = (id: string) => {
  try {
    const raw = localStorage.getItem(AGG_KEY(id))
    if (!raw) return { sum: 0, count: 0 }
    return JSON.parse(raw)
  } catch {
    return { sum: 0, count: 0 }
  }
}

const writeAggregate = (id: string, agg: { sum: number; count: number }) => {
  localStorage.setItem(AGG_KEY(id), JSON.stringify(agg))
}

const readSelf = (id: string) => {
  try {
    const raw = localStorage.getItem(SELF_KEY(id))
    if (!raw) return null
    return Number(raw)
  } catch {
    return null
  }
}

const writeSelf = (id: string, val: number) => {
  localStorage.setItem(SELF_KEY(id), String(val))
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({ projectId, size = 18 }) => {
  const [agg, setAgg] = useState<{ sum: number; count: number }>({ sum: 0, count: 0 })
  const [self, setSelf] = useState<number | null>(null)

  useEffect(() => {
    setAgg(readAggregate(projectId))
    setSelf(readSelf(projectId))
  }, [projectId])

  const average = agg.count === 0 ? 0 : agg.sum / agg.count

  const handleVote = (value: number) => {
    const prev = readSelf(projectId)
    const currentAgg = readAggregate(projectId)

    let newAgg = { ...currentAgg }
    if (prev) {
      newAgg.sum = newAgg.sum - prev + value
      // count stays the same
    } else {
      newAgg.sum = newAgg.sum + value
      newAgg.count = newAgg.count + 1
    }

    writeAggregate(projectId, newAgg)
    writeSelf(projectId, value)
    setAgg(newAgg)
    setSelf(value)
  }

  // Number of lamps to show as "on". If user has voted, show their vote. Else show rounded average.
  const onCount = self ?? Math.round(average)

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, idx) => {
          const val = idx + 1
          const isOn = val <= onCount
          return (
            <button
              key={val}
              onClick={(e) => { e.stopPropagation(); handleVote(val) }}
              title={`Dar ${val} lâmpada${val > 1 ? 's' : ''}`}
              className="p-0 m-0"
              aria-label={`Votar ${val}`}
            >
              <img src={isOn ? lampOn : lampOff} alt={isOn ? 'acessa' : 'apagada'} width={size} height={size} />
            </button>
          )
        })}
      </div>

      <div className="text-xs text-gray-600 dark:text-gray-300">
        <div className="font-semibold text-sm text-gray-800 dark:text-gray-100">{agg.count === 0 ? '—' : average.toFixed(1)}</div>
        <div className="text-[10px]">{agg.count} voto{agg.count !== 1 ? 's' : ''}</div>
      </div>
    </div>
  )
}

export default RatingDisplay
