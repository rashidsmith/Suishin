export interface FormattedIBOItem {
  type: 'business_objective' | 'wiifm' | 'performance_metric' | 'observable_behavior' | 'learning_objective';
  number?: string;
  title?: string;
  content?: string;
  level: number;
}

export const formatIBOsWithNumbering = (rawAIContent: string): FormattedIBOItem[] => {
  const lines = rawAIContent.split('\n').filter(line => line.trim());
  const formatted: FormattedIBOItem[] = [];
  let currentBO = 0;
  let currentPM = 0;
  let currentOB = 0;
  let currentLO = 0;
  
  lines.forEach(line => {
    const trimmed = line.trim();
    
    // Skip empty lines and very short lines
    if (trimmed.length < 3) return;
    
    // Business Objective - more flexible patterns
    if (trimmed.match(/^#{1,4}\s*(Business\s*Objective|IBO|Intended\s*Business\s*Outcome)/i) || 
        trimmed.match(/^#{1,4}\s*BO\d*/i) ||
        trimmed.match(/^#{1,4}\s*\d+\.\s*(Business|IBO)/i)) {
      currentBO++;
      currentPM = 0;
      currentOB = 0;
      currentLO = 0;
      formatted.push({
        type: 'business_objective',
        number: `BO${currentBO}`,
        title: extractTitle(trimmed),
        level: 1
      });
    }
    
    // WIIFM - more flexible patterns
    else if (trimmed.match(/^#{1,6}\s*WIIFM/i) || 
             trimmed.match(/What\'s\s*In\s*It\s*For\s*Me/i) ||
             trimmed.match(/^#{1,6}\s*Value\s*Proposition/i)) {
      formatted.push({
        type: 'wiifm',
        content: extractContent(trimmed),
        level: 2
      });
    }
    
    // Performance Metrics - enhanced patterns
    else if (trimmed.match(/^#{1,6}\s*Performance\s*Metric/i) ||
             trimmed.match(/^#{1,6}\s*Success\s*Metric/i) ||
             trimmed.match(/^#{1,6}\s*KPI/i) ||
             trimmed.match(/^\d+\.\s*\d+%/) ||
             trimmed.match(/^\d+\.\s*(Increase|Improvement|Reduction|Enhancement)/i) ||
             (trimmed.includes('%') && (trimmed.includes('increase') || trimmed.includes('improvement')))) {
      currentPM++;
      currentOB = 0;
      currentLO = 0;
      formatted.push({
        type: 'performance_metric',
        number: `${currentBO}.${currentPM}`,
        title: extractTitle(trimmed),
        level: 2
      });
    }
    
    // Observable Behaviors - enhanced patterns
    else if (trimmed.match(/^#{1,6}\s*Observable\s*Behavior/i) ||
             trimmed.match(/^[-*]\s*\*\*.*demonstrate/i) ||
             trimmed.match(/^[-*]\s*\*\*.*exhibit/i) ||
             trimmed.match(/^[-*]\s*\*\*.*show/i) ||
             (trimmed.startsWith('-') && trimmed.includes('**') && !trimmed.match(/Learning.*Objective/i))) {
      currentOB++;
      currentLO = 0;
      formatted.push({
        type: 'observable_behavior',
        number: `${currentBO}.${currentPM}.${currentOB}`,
        title: extractTitle(trimmed),
        level: 3
      });
    }
    
    // Learning Objectives - enhanced patterns
    else if (trimmed.match(/^#{1,6}\s*Learning\s*Objective/i) ||
             trimmed.match(/^[-*]\s*\*\*.*Learning.*Objective/i) ||
             trimmed.match(/^[-*]\s*\*\*.*learn/i) ||
             trimmed.match(/^[-*]\s*\*\*.*understand/i) ||
             trimmed.match(/^[-*]\s*\*\*.*apply/i)) {
      currentLO++;
      formatted.push({
        type: 'learning_objective',
        number: `${currentBO}.${currentPM}.${currentOB}.${currentLO}`,
        title: extractTitle(trimmed),
        level: 4
      });
    }
  });
  
  return formatted;
};

const extractTitle = (line: string): string => {
  return line
    .replace(/^#{1,6}\s*/, '')
    .replace(/^\d+\.\s*/, '')
    .replace(/^[-*]\s*/, '')
    .replace(/\*\*/g, '')
    .replace(/Observable\s*Behaviors?\*\*\s*/i, '')
    .replace(/Learning\s*Objectives?\*\*\s*/i, '')
    .trim();
};

const extractContent = (line: string): string => {
  return line
    .replace(/^#{1,6}\s*WIIFM:\s*/i, '')
    .replace(/^#{1,6}\s*What's In It For Me:\s*/i, '')
    .replace(/\*\*/g, '')
    .trim();
};