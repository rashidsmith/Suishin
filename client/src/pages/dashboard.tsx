import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  CheckCircle, 
  Play, 
  Folder, 
  Package, 
  Settings, 
  Zap, 
  Server, 
  Shield, 
  Hammer, 
  ExternalLink,
  Check 
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900">Fullstack JS Setup</h1>
                <p className="text-sm text-gray-500">React + Express + TypeScript + Tailwind</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4 mr-1" />
                Setup Complete
              </div>
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Play className="w-4 h-4 mr-2" />
                Start Development
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Setup Progress */}
        <div className="mb-8">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Setup Progress</h2>
                <span className="text-sm text-gray-500">All tasks completed</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <Folder className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-green-700">Project Structure</p>
                    <p className="text-xs text-green-600">Created</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <Package className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-green-700">Dependencies</p>
                    <p className="text-xs text-green-600">Installed</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <Settings className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-green-700">Configuration</p>
                    <p className="text-xs text-green-600">Complete</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-green-700">Testing</p>
                    <p className="text-xs text-green-600">Verified</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Folder Structure */}
          <Card className="shadow-sm">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Project Structure</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Expand All
                </button>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-2 font-mono text-sm">
                <div className="flex items-center text-gray-700">
                  <Folder className="w-4 h-4 mr-2 text-blue-500" />
                  <span className="font-medium">project-root/</span>
                </div>
                <div className="ml-6 space-y-1">
                  <div className="flex items-center text-gray-600">
                    <Folder className="w-4 h-4 mr-2 text-blue-500" />
                    <span className="font-medium">client/</span>
                    <Badge variant="secondary" className="ml-2 text-xs bg-blue-100 text-blue-700">React Frontend</Badge>
                  </div>
                  <div className="ml-6 space-y-1">
                    <div className="flex items-center text-gray-500">
                      <Folder className="w-4 h-4 mr-2 text-blue-400" />
                      <span>src/components</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Folder className="w-4 h-4 mr-2 text-blue-400" />
                      <span>src/pages</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Folder className="w-4 h-4 mr-2 text-blue-400" />
                      <span>src/lib</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Folder className="w-4 h-4 mr-2 text-blue-400" />
                      <span>src/types</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Folder className="w-4 h-4 mr-2 text-green-500" />
                    <span className="font-medium">server/</span>
                    <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-700">Express Backend</Badge>
                  </div>
                  <div className="ml-6 space-y-1">
                    <div className="flex items-center text-gray-500">
                      <Folder className="w-4 h-4 mr-2 text-green-400" />
                      <span>routes</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Folder className="w-4 h-4 mr-2 text-green-400" />
                      <span>controllers</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Folder className="w-4 h-4 mr-2 text-purple-500" />
                    <span className="font-medium">shared/</span>
                    <Badge variant="secondary" className="ml-2 text-xs bg-purple-100 text-purple-700">Types</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dependencies Panel */}
          <div className="space-y-6">
            {/* Frontend Dependencies */}
            <Card className="shadow-sm">
              <div className="border-b border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900">Frontend Dependencies</h3>
                <p className="text-sm text-gray-500 mt-1">Client-side packages</p>
              </div>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-bold">R</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">React Ecosystem</p>
                        <p className="text-xs text-gray-500">react, react-dom, react-router-dom</p>
                      </div>
                    </div>
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-bold">S</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Supabase</p>
                        <p className="text-xs text-gray-500">@supabase/supabase-js</p>
                      </div>
                    </div>
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-bold">Z</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">State & Utils</p>
                        <p className="text-xs text-gray-500">zustand, lucide-react, clsx, axios</p>
                      </div>
                    </div>
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Backend Dependencies */}
            <Card className="shadow-sm">
              <div className="border-b border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900">Backend Dependencies</h3>
                <p className="text-sm text-gray-500 mt-1">Server-side packages</p>
              </div>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-bold">E</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Express Server</p>
                        <p className="text-xs text-gray-500">express, cors, dotenv</p>
                      </div>
                    </div>
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-bold">S</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Supabase</p>
                        <p className="text-xs text-gray-500">@supabase/supabase-js</p>
                      </div>
                    </div>
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Configuration Panel */}
        <Card className="mt-8 shadow-sm">
          <div className="border-b border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900">Configuration Details</h3>
            <p className="text-sm text-gray-500 mt-1">Build tools, server setup, and environment configuration</p>
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Vite Configuration */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Vite Build</h4>
                    <p className="text-xs text-gray-500">Fast development server</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs">
                  <div className="text-gray-600">✓ React + TypeScript</div>
                  <div className="text-gray-600">✓ Tailwind CSS</div>
                  <div className="text-gray-600">✓ HMR enabled</div>
                  <div className="text-gray-600">✓ Proxy to :5000</div>
                </div>
              </div>

              {/* Express Configuration */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                    <Server className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Express Server</h4>
                    <p className="text-xs text-gray-500">Backend API server</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs">
                  <div className="text-gray-600">✓ Port 5000</div>
                  <div className="text-gray-600">✓ CORS enabled</div>
                  <div className="text-gray-600">✓ Environment vars</div>
                  <div className="text-gray-600">✓ TypeScript support</div>
                </div>
              </div>

              {/* Environment Setup */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Environment</h4>
                    <p className="text-xs text-gray-500">Config & secrets</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs">
                  <div className="text-gray-600">✓ Client .env</div>
                  <div className="text-gray-600">✓ Server .env</div>
                  <div className="text-gray-600">✓ Database keys</div>
                  <div className="text-gray-600">✓ API endpoints</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-8 shadow-sm">
          <div className="border-b border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-500 mt-1">Development commands and utilities</p>
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 border-blue-200 transition-colors group h-auto">
                <Play className="w-5 h-5 text-blue-600 mr-2 group-hover:scale-110 transition-transform" />
                <span className="text-blue-700 font-medium">Start Dev Server</span>
              </Button>
              <Button variant="outline" className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 border-green-200 transition-colors group h-auto">
                <Package className="w-5 h-5 text-green-600 mr-2 group-hover:scale-110 transition-transform" />
                <span className="text-green-700 font-medium">Install Deps</span>
              </Button>
              <Button variant="outline" className="flex items-center justify-center p-4 bg-yellow-50 hover:bg-yellow-100 border-yellow-200 transition-colors group h-auto">
                <Hammer className="w-5 h-5 text-yellow-600 mr-2 group-hover:scale-110 transition-transform" />
                <span className="text-yellow-700 font-medium">Build Project</span>
              </Button>
              <Button variant="outline" className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 border-purple-200 transition-colors group h-auto">
                <ExternalLink className="w-5 h-5 text-purple-600 mr-2 group-hover:scale-110 transition-transform" />
                <span className="text-purple-700 font-medium">Open Browser</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-green-50 text-green-700 rounded-full border border-green-200">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">Your fullstack JavaScript application is ready for development!</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Frontend running on <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">localhost:5000</code> • 
            Backend running on <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">localhost:5000</code>
          </p>
        </div>
      </div>
    </div>
  );
}
