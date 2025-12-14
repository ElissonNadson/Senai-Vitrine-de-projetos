import React from 'react'
import { PageBanner } from '@/components/common/PageBanner'

interface DashboardLayoutProps {
    bannerTitle: string
    bannerSubtitle: string
    bannerIcon: React.ReactNode
    bannerAction?: React.ReactNode
    statsContent?: React.ReactNode
    extraTopContent?: React.ReactNode
    filtersContent: React.ReactNode
    mainContent: React.ReactNode
    paginationContent?: React.ReactNode
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    bannerTitle,
    bannerSubtitle,
    bannerIcon,
    bannerAction,
    statsContent,
    extraTopContent,
    filtersContent,
    mainContent,
    paginationContent
}) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            {/* Header com PageBanner */}
            <PageBanner
                title={bannerTitle}
                subtitle={bannerSubtitle}
                icon={bannerIcon}
                action={bannerAction}
            />

            <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
                {/* Conteúdo Extra Topo (ex: Stats do Professor) */}
                {extraTopContent && (
                    <div className="mb-8">
                        {extraTopContent}
                    </div>
                )}

                {/* Stats das Fases */}
                {statsContent}

                {/* Filtros */}
                <div className="mb-6">
                    {filtersContent}
                </div>

                {/* Grid Principal */}
                <div className="space-y-6">
                    {mainContent}

                    {/* Paginação */}
                    {paginationContent && (
                        <div className="mt-8 flex justify-center">
                            {paginationContent}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
