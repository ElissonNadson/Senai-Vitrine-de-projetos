import React from 'react'
import { Check } from 'lucide-react'

interface Step {
    number: number
    title: string
    description: string
}

interface PanelStepsProps {
    steps: Step[]
    currentStep: number
    onStepClick: (step: number) => void
    allAccessible?: boolean
}

const PanelSteps: React.FC<PanelStepsProps> = ({ steps, currentStep, onStepClick, allAccessible = false }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <nav aria-label="Progress">
                <ol role="list" className="divide-y divide-gray-200 dark:divide-gray-700 md:flex md:divide-y-0">
                    {steps.map((step, stepIdx) => {
                        const isCompleted = allAccessible ? step.number < currentStep : step.number < currentStep
                        const isCurrent = step.number === currentStep
                        const isFutureAccessible = allAccessible && step.number > currentStep

                        return (
                            <li key={step.title} className="relative md:flex-1 md:flex">
                                {isCompleted ? (
                                    <button
                                        onClick={() => onStepClick(step.number)}
                                        className="group flex w-full items-center">
                                        <div className="flex items-center px-6 py-4 text-sm font-medium">
                                            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 group-hover:bg-blue-800 transition-colors">
                                                <Check className="h-6 w-6 text-white" aria-hidden="true" />
                                            </span>
                                            <div className="ml-4 flex min-w-0 flex-col items-start">
                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{step.title}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">{step.description}</span>
                                            </div>
                                        </div>
                                    </button>
                                ) : isCurrent ? (
                                    <button
                                        onClick={() => onStepClick(step.number)}
                                        className="flex items-center px-6 py-4 text-sm font-medium w-full"
                                        aria-current="step">
                                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-600">
                                            <span className="text-blue-600 dark:text-blue-400">{step.number.toString().padStart(2, '0')}</span>
                                        </span>
                                        <div className="ml-4 flex min-w-0 flex-col items-start">
                                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{step.title}</span>
                                            <span className="text-xs text-blue-500 dark:text-blue-300">{step.description}</span>
                                        </div>
                                    </button>
                                ) : isFutureAccessible ? (
                                    <button
                                        onClick={() => onStepClick(step.number)}
                                        className="group flex w-full items-center cursor-pointer">
                                        <div className="flex items-center px-6 py-4 text-sm font-medium">
                                            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-300 dark:border-blue-600 group-hover:border-blue-500 transition-colors">
                                                <span className="text-blue-500 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                                                    {step.number.toString().padStart(2, '0')}
                                                </span>
                                            </span>
                                            <div className="ml-4 flex min-w-0 flex-col items-start">
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{step.title}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">{step.description}</span>
                                            </div>
                                        </div>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => onStepClick(step.number)}
                                        className="group flex items-center px-6 py-4 text-sm font-medium w-full">
                                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600 group-hover:border-gray-400">
                                            <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-300 transition-colors">
                                                {step.number.toString().padStart(2, '0')}
                                            </span>
                                        </span>
                                        <div className="ml-4 flex min-w-0 flex-col items-start">
                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-300 transition-colors">
                                                {step.title}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{step.description}</span>
                                        </div>
                                    </button>
                                )}

                                {/* Separator for desktop */}
                                {stepIdx !== steps.length - 1 ? (
                                    <>
                                        <div className="absolute top-0 right-0 hidden h-full w-5 md:block" aria-hidden="true">
                                            <svg
                                                className="h-full w-full text-gray-300 dark:text-gray-700"
                                                viewBox="0 0 22 80"
                                                fill="none"
                                                preserveAspectRatio="none"
                                            >
                                                <path
                                                    d="M0 -2L20 40L0 82"
                                                    vectorEffect="non-scaling-stroke"
                                                    stroke="currentcolor"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                    </>
                                ) : null}

                                {/* Active border indicator for current step */}
                                {isCurrent && (
                                    <div 
                                        className={`absolute bottom-0 h-0.5 bg-blue-600 hidden md:block left-0 ${
                                            stepIdx === steps.length - 1 ? 'right-0' : 'right-5'
                                        }`} 
                                        aria-hidden="true" 
                                    />
                                )}
                            </li>
                        )
                    })}
                </ol>
            </nav>
        </div>
    )
}

export default PanelSteps
