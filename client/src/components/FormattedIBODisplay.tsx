import { formatIBOsWithNumbering, FormattedIBOItem } from "../../../shared/iboFormatter";

interface FormattedIBODisplayProps {
  rawContent: string | null;
}

export const FormattedIBODisplay = ({ rawContent }: FormattedIBODisplayProps) => {
  if (!rawContent) {
    return (
      <div className="text-gray-500 dark:text-gray-400 italic">
        No content available to display
      </div>
    );
  }

  const formattedIBOs = formatIBOsWithNumbering(rawContent);
  
  // If no structured content was found, show raw content as fallback
  if (formattedIBOs.length === 0) {
    return (
      <div className="space-y-3">
        <div className="text-sm text-amber-600 dark:text-amber-400 mb-2">
          Content could not be parsed into structured format. Displaying raw content:
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded border text-sm">
          <pre className="whitespace-pre-wrap">{rawContent}</pre>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {formattedIBOs.map((item, index) => (
        <div key={index} className={getIndentationClass(item.level)}>
          {item.type === 'business_objective' && (
            <div className="border-l-4 border-blue-500 pl-4 mb-4">
              <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300">
                {item.number}: {item.title}
              </h3>
            </div>
          )}
          
          {item.type === 'wiifm' && (
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded ml-4 mb-2 border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-300">
                <strong>WIIFM:</strong> {item.content}
              </p>
            </div>
          )}
          
          {item.type === 'performance_metric' && (
            <div className="ml-4 mb-2">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">📊</span>
                PM {item.number}: {item.title}
              </h4>
            </div>
          )}
          
          {item.type === 'observable_behavior' && (
            <div className="ml-8 mb-1">
              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">👁️</span>
                OB {item.number}: {item.title}
              </p>
            </div>
          )}
          
          {item.type === 'learning_objective' && (
            <div className="ml-12 mb-1">
              <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center gap-2">
                <span className="text-purple-600 dark:text-purple-400">🎯</span>
                LO {item.number}: {item.title}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const getIndentationClass = (level: number): string => {
  switch (level) {
    case 1: return "";
    case 2: return "ml-2";
    case 3: return "ml-4";
    case 4: return "ml-6";
    default: return "";
  }
};