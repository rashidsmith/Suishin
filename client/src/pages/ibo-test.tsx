import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, Trash2, Edit } from "lucide-react";
import { useIBOStore } from '../lib/store';
import { useState } from 'react';

export default function IBOTest() {
  const { 
    ibos, 
    selectedIBO, 
    loading, 
    error, 
    loadIBOs, 
    createIBO, 
    selectIBO, 
    updateIBO, 
    deleteIBO, 
    clearError 
  } = useIBOStore();

  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    loadIBOs();
  }, [loadIBOs]);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    
    await createIBO(newTitle, newDescription);
    setNewTitle('');
    setNewDescription('');
  };

  const handleEdit = (ibo: any) => {
    setEditMode(ibo.id);
    setEditTitle(ibo.title);
    setEditDescription(ibo.description || '');
  };

  const handleUpdate = async (id: string) => {
    await updateIBO(id, { 
      title: editTitle, 
      description: editDescription 
    });
    setEditMode(null);
  };

  const handleDelete = async (id: string) => {
    await deleteIBO(id);
    if (selectedIBO?.id === id) {
      selectIBO(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            IBO Store Test
          </h1>
          <p className="text-lg text-gray-600">
            Testing Zustand store with IBO CRUD operations
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertDescription className="text-red-800">
              {error}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearError}
                className="ml-2"
              >
                Clear
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Create New IBO */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New IBO
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter IBO title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Enter IBO description (optional)"
              />
            </div>
            <Button 
              onClick={handleCreate} 
              disabled={loading || !newTitle.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create IBO
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* IBOs List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading && ibos.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading IBOs...</p>
            </div>
          ) : ibos.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">No IBOs found. Create your first one above!</p>
            </div>
          ) : (
            ibos.map((ibo) => (
              <Card 
                key={ibo.id} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedIBO?.id === ibo.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => selectIBO(ibo)}
              >
                <CardHeader className="pb-3">
                  {editMode === ibo.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="IBO title"
                      />
                      <Input
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="IBO description"
                      />
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdate(ibo.id);
                          }}
                          disabled={loading}
                        >
                          Save
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditMode(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <CardTitle className="text-lg">{ibo.title}</CardTitle>
                      {ibo.description && (
                        <p className="text-sm text-gray-600">{ibo.description}</p>
                      )}
                      <p className="text-xs text-gray-400">
                        Created: {new Date(ibo.created_at).toLocaleDateString()}
                      </p>
                    </>
                  )}
                </CardHeader>
                
                {editMode !== ibo.id && (
                  <CardContent className="pt-0">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(ibo);
                        }}
                        disabled={loading}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(ibo.id);
                        }}
                        disabled={loading}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Selected IBO Details */}
        {selectedIBO && (
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Selected IBO</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>ID:</strong> {selectedIBO.id}</p>
                <p><strong>Title:</strong> {selectedIBO.title}</p>
                {selectedIBO.description && (
                  <p><strong>Description:</strong> {selectedIBO.description}</p>
                )}
                <p><strong>Created:</strong> {new Date(selectedIBO.created_at).toLocaleString()}</p>
                <p><strong>Updated:</strong> {new Date(selectedIBO.updated_at).toLocaleString()}</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => selectIBO(null)}
                className="mt-4"
              >
                Deselect
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Store State Debug */}
        <Card className="mt-6 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-sm text-gray-700">Store State Debug</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs space-y-1">
              <p><strong>Total IBOs:</strong> {ibos.length}</p>
              <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
              <p><strong>Error:</strong> {error || 'None'}</p>
              <p><strong>Selected:</strong> {selectedIBO ? selectedIBO.title : 'None'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}