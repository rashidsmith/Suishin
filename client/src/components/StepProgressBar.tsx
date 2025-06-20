import { SESSION_STEPS } from '../../../shared/sessionSteps';
import { cn } from '../lib/utils';

interface StepProgressBarProps {
  currentStepIndex: number;
  completedSteps: string[];
  onStepClick: (stepId: string) => void;
  canAdvanceToStep: (stepId: string) => boolean;
  isStepComplete: (stepId: string) => boolean;
}

export function StepProgressBar({ 
  currentStepIndex, 
  completedSteps, 
  onStepClick, 
  canAdvanceToStep,
  isStepComplete 
}: StepProgressBarProps) {
  return (
    <div className="w-full bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {SESSION_STEPS.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = completedSteps.includes(step.id) || isStepComplete(step.id);
          const isClickable = canAdvanceToStep(step.id);
          const isPast = index < currentStepIndex;
          
          return (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => isClickable ? onStepClick(step.id) : null}
                  disabled={!isClickable}
                  className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-200",
                    isActive && "border-blue-500 bg-blue-500 text-white shadow-lg scale-110",
                    isCompleted && !isActive && "border-green-500 bg-green-500 text-white",
                    isPast && !isCompleted && "border-gray-300 bg-gray-100 text-gray-600",
                    !isPast && !isActive && !isCompleted && "border-gray-300 bg-white text-gray-400",
                    isClickable && !isActive && "hover:border-blue-300 hover:bg-blue-50 cursor-pointer",
                    !isClickable && "cursor-not-allowed opacity-50"
                  )}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span>{step.icon}</span>
                  )}
                </button>
                
                {/* Step Title */}
                <div className="mt-2 text-center">
                  <p className={cn(
                    "text-xs font-medium",
                    isActive && "text-blue-600",
                    isCompleted && "text-green-600",
                    !isActive && !isCompleted && "text-gray-500"
                  )}>
                    {step.title}
                  </p>
                </div>
              </div>
              
              {/* Connector Line */}
              {index < SESSION_STEPS.length - 1 && (
                <div 
                  className={cn(
                    "h-0.5 w-16 mx-4 transition-colors duration-200",
                    index < currentStepIndex ? "bg-green-500" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}