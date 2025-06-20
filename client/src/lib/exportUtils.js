// Export utility functions for generating JSON and CSV files

export const generateJSON = (data, type) => {
  try {
    const exportData = {
      exportType: type,
      exportDate: new Date().toISOString(),
      data: data
    };
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    throw new Error(`Failed to generate JSON: ${error.message}`);
  }
};

export const generateCSV = (data, type) => {
  try {
    if (!data || data.length === 0) {
      return 'No data available for export';
    }

    let csvContent = '';
    
    switch (type) {
      case 'ibos':
        csvContent = generateIBOsCSV(data);
        break;
      case 'cards':
        csvContent = generateCardsCSV(data);
        break;
      case 'sessions':
        csvContent = generateSessionsCSV(data);
        break;
      default:
        throw new Error('Unknown export type');
    }
    
    return csvContent;
  } catch (error) {
    throw new Error(`Failed to generate CSV: ${error.message}`);
  }
};

const generateIBOsCSV = (ibos) => {
  const headers = ['ID', 'Title', 'Description', 'User ID', 'Created At', 'Updated At'];
  const csvRows = [headers.join(',')];
  
  ibos.forEach(ibo => {
    const row = [
      escapeCSVField(ibo.id || ''),
      escapeCSVField(ibo.title || ''),
      escapeCSVField(ibo.description || ''),
      escapeCSVField(ibo.user_id || ''),
      escapeCSVField(ibo.created_at || ''),
      escapeCSVField(ibo.updated_at || '')
    ];
    csvRows.push(row.join(','));
  });
  
  return csvRows.join('\n');
};

const generateCardsCSV = (cards) => {
  const headers = ['ID', 'Title', 'Description', 'IBO ID', 'Learning Objective ID', 'Target Duration', 'Activities Count', 'Created At'];
  const csvRows = [headers.join(',')];
  
  cards.forEach(card => {
    const row = [
      escapeCSVField(card.id || ''),
      escapeCSVField(card.title || ''),
      escapeCSVField(card.description || ''),
      escapeCSVField(card.ibo_id || ''),
      escapeCSVField(card.learning_objective_id || ''),
      escapeCSVField(card.target_duration?.toString() || '0'),
      escapeCSVField(card.activities?.length?.toString() || '0'),
      escapeCSVField(card.created_at || '')
    ];
    csvRows.push(row.join(','));
  });
  
  return csvRows.join('\n');
};

const generateSessionsCSV = (sessions) => {
  const headers = ['ID', 'Title', 'Description', 'Status', 'Cards Count', 'Total Duration', 'Created At'];
  const csvRows = [headers.join(',')];
  
  sessions.forEach(session => {
    const totalDuration = session.session_cards?.reduce((total, sc) => {
      return total + (sc.card?.target_duration || 0);
    }, 0) || 0;
    
    const row = [
      escapeCSVField(session.id || ''),
      escapeCSVField(session.title || ''),
      escapeCSVField(session.description || ''),
      escapeCSVField(session.status || ''),
      escapeCSVField(session.session_cards?.length?.toString() || '0'),
      escapeCSVField(totalDuration.toString()),
      escapeCSVField(session.created_at || '')
    ];
    csvRows.push(row.join(','));
  });
  
  return csvRows.join('\n');
};

const escapeCSVField = (field) => {
  if (field === null || field === undefined) return '';
  const stringField = String(field);
  if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  return stringField;
};

export const downloadFile = (content, filename, mimeType) => {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error(`Failed to download file: ${error.message}`);
  }
};

export const validateExportData = (data, type) => {
  const issues = [];
  
  if (!data || data.length === 0) {
    issues.push(`No ${type} data available to export`);
    return issues;
  }
  
  switch (type) {
    case 'ibos':
      data.forEach((ibo, index) => {
        if (!ibo.id) issues.push(`IBO ${index + 1}: Missing ID`);
        if (!ibo.title) issues.push(`IBO ${index + 1}: Missing title`);
      });
      break;
      
    case 'cards':
      data.forEach((card, index) => {
        if (!card.id) issues.push(`Card ${index + 1}: Missing ID`);
        if (!card.title) issues.push(`Card ${index + 1}: Missing title`);
        if (!card.ibo_id) issues.push(`Card ${index + 1}: Missing IBO ID`);
        if (!card.learning_objective_id) issues.push(`Card ${index + 1}: Missing learning objective ID`);
      });
      break;
      
    case 'sessions':
      data.forEach((session, index) => {
        if (!session.id) issues.push(`Session ${index + 1}: Missing ID`);
        if (!session.title) issues.push(`Session ${index + 1}: Missing title`);
        if (!session.status) issues.push(`Session ${index + 1}: Missing status`);
      });
      break;
      
    default:
      issues.push('Unknown data type for validation');
  }
  
  return issues;
};