import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Download, FileText, Database, AlertTriangle } from "lucide-react";
import { useIBOStore, useCardStore } from '../lib/store';
import { generateJSON, generateCSV, downloadFile, validateExportData, getExportFilename } from '../lib/exportUtils';

export default function Export() {
  const { ibos, loading: ibosLoading, loadIBOs } = useIBOStore();
  const { cards, loading: cardsLoading, loadCards } = useCardStore();
  
  const [exportFormat, setExportFormat] = useState('');
  const [exportType, setExportType] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [validationIssues, setValidationIssues] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Mock sessions data - in real app, this would come from sessions store
  const [sessions] = useState([
    {
      id: '1',
      title: 'Introduction to Learning',
      description: 'Basic concepts and principles',
      status: 'not_started',
      created_at: new Date().toISOString(),
      session_cards: []
    }
  ]);

  useEffect(() => {
    loadIBOs();
    loadCards();
  }, [loadIBOs, loadCards]);

  const getDataForExport = () => {
    switch (exportType) {
      case 'ibos':
        return ibos;
      case 'cards':
        return cards;
      case 'sessions':
        return sessions;
      default:
        return [];
    }
  };

  const getDataCount = () => {
    const data = getDataForExport();
    return data ? data.length : 0;
  };

  const handleValidate = () => {
    if (!exportType) {
      setValidationIssues(['Please select what to export']);
      return;
    }

    const data = getDataForExport();
    const issues = validateExportData(data, exportType);
    setValidationIssues(issues);
    
    if (issues.length === 0) {
      setSuccessMessage('Data validation passed - ready to export!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleExport = async () => {
    if (!exportFormat || !exportType) {
      setError('Please select both format and data type to export');
      return;
    }

    setIsExporting(true);
    setError(null);
    setValidationIssues([]);

    try {
      const data = getDataForExport();
      
      // Validate data before export
      const issues = validateExportData(data, exportType);
      if (issues.length > 0) {
        setValidationIssues(issues);
        setIsExporting(false);
        return;
      }

      let content;
      let filename;
      let mimeType;

      if (exportFormat === 'json') {
        content = generateJSON(data, exportType);
        filename = `${exportType}_export_${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      } else if (exportFormat === 'csv') {
        content = generateCSV(data, exportType);
        filename = `${exportType}_export_${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      }

      downloadFile(content, filename, mimeType);
      setSuccessMessage(`Successfully exported ${data.length} ${exportType} records as ${exportFormat.toUpperCase()}`);
      setTimeout(() => setSuccessMessage(''), 5000);

    } catch (err) {
      setError(`Export failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage('');
    setValidationIssues([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <div>
          <div className="flex items-center mb-2">
            <Download className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Export Data</h1>
          </div>
          <p className="text-lg text-gray-600">
            Export your learning data in JSON or CSV format
          </p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            {successMessage}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearMessages}
              className="ml-2"
            >
              Clear
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">
            {error}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearMessages}
              className="ml-2"
            >
              Clear
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Validation Issues */}
      {validationIssues.length > 0 && (
        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-yellow-800">
            <div className="font-medium mb-2">Data Validation Issues:</div>
            <ul className="list-disc list-inside space-y-1">
              {validationIssues.map((issue, index) => (
                <li key={index} className="text-sm">{issue}</li>
              ))}
            </ul>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearMessages}
              className="ml-2 mt-2"
            >
              Clear
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Export Configuration */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Export Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Data Type Selection */}
            <div>
              <Label htmlFor="exportType">What to Export*</Label>
              <Select value={exportType} onValueChange={setExportType}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ibos">
                    IBOs ({ibosLoading ? 'Loading...' : ibos.length})
                  </SelectItem>
                  <SelectItem value="cards">
                    Cards ({cardsLoading ? 'Loading...' : cards.length})
                  </SelectItem>
                  <SelectItem value="sessions">
                    Sessions ({sessions.length})
                  </SelectItem>
                </SelectContent>
              </Select>
              {exportType && (
                <p className="text-sm text-gray-600 mt-1">
                  {getDataCount()} records available for export
                </p>
              )}
            </div>

            {/* Format Selection */}
            <div>
              <Label htmlFor="exportFormat">Export Format*</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON - Structured data format</SelectItem>
                  <SelectItem value="csv">CSV - Spreadsheet compatible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <Button
                onClick={handleValidate}
                variant="outline"
                disabled={!exportType || ibosLoading || cardsLoading}
                className="w-full"
              >
                {ibosLoading || cardsLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading Data...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Validate Data
                  </>
                )}
              </Button>

              <Button
                onClick={handleExport}
                disabled={!exportFormat || !exportType || isExporting || ibosLoading || cardsLoading}
                className="w-full"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Preview */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Data Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* IBOs Summary */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-blue-900">IBOs</h4>
                  <span className="text-blue-700 font-semibold">
                    {ibosLoading ? 'Loading...' : ibos.length}
                  </span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Intended Business Outcomes and learning objectives
                </p>
              </div>

              {/* Cards Summary */}
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-green-900">Cards</h4>
                  <span className="text-green-700 font-semibold">
                    {cardsLoading ? 'Loading...' : cards.length}
                  </span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Learning cards with structured activities
                </p>
              </div>

              {/* Sessions Summary */}
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-purple-900">Sessions</h4>
                  <span className="text-purple-700 font-semibold">
                    {sessions.length}
                  </span>
                </div>
                <p className="text-sm text-purple-700 mt-1">
                  Learning sessions with organized cards
                </p>
              </div>

              {/* Export Info */}
              {exportType && exportFormat && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Export Preview</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Type:</strong> {exportType}</p>
                    <p><strong>Format:</strong> {exportFormat.toUpperCase()}</p>
                    <p><strong>Records:</strong> {getDataCount()}</p>
                    <p><strong>Filename:</strong> {exportType}_export_{new Date().toISOString().split('T')[0]}.{exportFormat}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}