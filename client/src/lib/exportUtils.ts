// Export utilities for data validation and file generation
export const generateJSON = (data: any, type: string) => {
  try {
    const exportData = {
      type,
      exported_at: new Date().toISOString(),
      count: Array.isArray(data) ? data.length : 1,
      data
    };
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    throw new Error(`Failed to generate JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const generateCSV = (data: any[], type: string) => {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No data available for CSV export');
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...data.map(item => 
        headers.map(header => {
          const value = item[header];
          // Handle complex objects and arrays
          if (typeof value === 'object' && value !== null) {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }
          // Escape quotes in strings
          if (typeof value === 'string') {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    return csvContent;
  } catch (error) {
    throw new Error(`Failed to generate CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const downloadFile = (content: string, filename: string, mimeType: string) => {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error(`Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const validateExportData = (data: any, type: string) => {
  if (!data) {
    throw new Error(`No ${type} data available for export`);
  }

  if (Array.isArray(data) && data.length === 0) {
    throw new Error(`No ${type} records found to export`);
  }

  // Type-specific validation
  switch (type) {
    case 'IBOs':
      if (Array.isArray(data)) {
        data.forEach((item, index) => {
          if (!item.title || !item.id) {
            throw new Error(`Invalid IBO data at index ${index}: missing required fields`);
          }
        });
      }
      break;
    case 'Cards':
      if (Array.isArray(data)) {
        data.forEach((item, index) => {
          if (!item.title || !item.id || !item.target_duration) {
            throw new Error(`Invalid Card data at index ${index}: missing required fields`);
          }
        });
      }
      break;
    case 'Sessions':
      if (Array.isArray(data)) {
        data.forEach((item, index) => {
          if (!item.title || !item.id || !item.status) {
            throw new Error(`Invalid Session data at index ${index}: missing required fields`);
          }
        });
      }
      break;
  }

  return true;
};

export const formatTimestamp = () => {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
};

export const getExportFilename = (type: string, format: string) => {
  const timestamp = formatTimestamp();
  return `${type.toLowerCase()}_export_${timestamp}.${format.toLowerCase()}`;
};