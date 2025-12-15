import React from 'react';

// Define as props para o componente EventCard
interface EventCardProps {
  imageUrl: string;
  isLarge: boolean;
  mainTitle?: string;
  dateText?: string;
  hashtag?: string;
  buttonLink: string;
}

const EventCard: React.FC<EventCardProps> = ({
  imageUrl,
  isLarge,
  mainTitle,
  dateText,
  buttonLink
}) => {
  return (
    <a
      href={buttonLink}
      className="group block h-full bg-[#F5F4F3] rounded-[20px] border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      {/* Container Interno para Padding do Frame */}
      <div className="p-3 pb-0">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[10px]">
          <img
            src={imageUrl}
            alt={mainTitle || "Evento SENAI"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Conteúdo Inferior */}
      <div className="p-6 flex flex-col gap-3">
        {/* Título */}
        <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-[#00aceb] transition-colors line-clamp-2 min-h-[3.5rem]">
          {mainTitle || "Startups do SUPERA Parque se destacam no ranking 100 Open Startups 2025"}
        </h3>

        {/* Data */}
        {dateText && (
          <p className="text-gray-500 font-medium text-sm">
            {dateText}
          </p>
        )}

        {/* Fallback para data se não vier na prop (apenas para visualização durante dev se precisar) */}
        {!dateText && (
          <p className="text-gray-500 font-medium text-sm">
            3 de dez. de 2025
          </p>
        )}
      </div>
    </a>
  );
};

export default EventCard;
