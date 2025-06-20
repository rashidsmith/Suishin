import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Database, Server } from "lucide-react";
import { db } from '../lib/supabase';
import { apiClient } from '../lib/api';

export default function SupabaseTest() {
  const [clientConnectionStatus, setClientConnectionStatus] = useState<'testing' | 'connected' | 'failed'>('testing');
  const [serverConnectionStatus, setServerConnectionStatus] = useState<'testing' | 'connected' | 'failed'>('testing');
  const [clientError, setClientError] = useState<string>('');
  const [serverError, setServerError] = useState<string>('');
  const [tableVerification, setTableVerification] = useState<Record<string, any>>({});

  useEffect(() => {
    testConnections();
  }, []);

  const testConnections = async () => {
    // Test client-side Supabase connection
    try {
      const clientResult = await db.testConnection();
      if (clientResult.success) {
        setClientConnectionStatus('connected');
        // Also test table verification
        const tables = await db.getTables();
        setTableVerification(tables);
      } else {
        setClientConnectionStatus('failed');
        setClientError(clientResult.error || 'Unknown error');
      }
    } catch (error) {
      setClientConnectionStatus('failed');
      setClientError((error as Error).message);
    }

    // Test server-side health check
    try {
      const serverResult = await apiClient.get('/health');
      if (serverResult.status === 'ok' && serverResult.database === 'connected') {
        setServerConnectionStatus('connected');
      } else {
        setServerConnectionStatus('failed');
        setServerError(serverResult.error || 'Database not connected');
      }
    } catch (error) {
      setServerConnectionStatus('failed');
      setServerError((error as Error).message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-700">Connected</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700">Failed</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-700">Testing...</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Supabase Connection Test</h1>
          <p className="text-lg text-gray-600">Testing client and server-side database connections</p>
        </div>

        {/* Connection Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Client-side Connection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  {getStatusBadge(clientConnectionStatus)}
                </div>
                {clientConnectionStatus === 'connected' && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>Successfully connected to Supabase</span>
                  </div>
                )}
                {clientConnectionStatus === 'failed' && (
                  <div className="flex items-start text-red-600">
                    <AlertCircle className="w-4 h-4 mr-2 mt-0.5" />
                    <div>
                      <p>Connection failed</p>
                      <p className="text-sm mt-1">{clientError}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Server className="w-5 h-5 mr-2" />
                Server-side Connection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  {getStatusBadge(serverConnectionStatus)}
                </div>
                {serverConnectionStatus === 'connected' && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>Server health check passed</span>
                  </div>
                )}
                {serverConnectionStatus === 'failed' && (
                  <div className="flex items-start text-red-600">
                    <AlertCircle className="w-4 h-4 mr-2 mt-0.5" />
                    <div>
                      <p>Health check failed</p>
                      <p className="text-sm mt-1">{serverError}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Database Tables Verification */}
        {Object.keys(tableVerification).length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Database Tables Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(tableVerification).map(([tableName, status]) => (
                  <div key={tableName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{tableName}</span>
                    {status.success ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button onClick={testConnections}>
            Retest Connections
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}