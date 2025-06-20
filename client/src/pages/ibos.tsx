import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, Trash2, Edit, BookOpen } from "lucide-react";
import { useIBOStore } from '../lib/store';

export default function IBOs() {
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">IBO Builder</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Create and manage Intended Behavioral Outcomes (IBOs) for your learning experiences
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
      <Card className="mb-8 bg-white shadow-sm">
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
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Enter IBO description (optional)"
              className="mt-1"
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

      {/* IBOs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && ibos.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading IBOs...</p>
          </div>
        ) : ibos.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 text-lg mb-2">No IBOs found</p>
            <p className="text-gray-500">Create your first IBO to get started!</p>
          </div>
        ) : (
          ibos.map((ibo) => (
            <Card 
              key={ibo.id} 
              className={`cursor-pointer transition-all hover:shadow-md bg-white ${
                selectedIBO?.id === ibo.id ? 'ring-2 ring-blue-500 shadow-md' : ''
              }`}
              onClick={() => selectIBO(ibo)}
            >
              <CardHeader className="pb-3">
                {editMode === ibo.id ? (
                  <div className="space-y-3">
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
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {ibo.title}
                    </CardTitle>
                    {ibo.description && (
                      <p className="text-sm text-gray-600 mt-2">{ibo.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-3">
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
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Selected IBO</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-blue-800">Title:</p>
                <p className="text-blue-900">{selectedIBO.title}</p>
              </div>
              {selectedIBO.description && (
                <div>
                  <p className="text-sm font-medium text-blue-800">Description:</p>
                  <p className="text-blue-900">{selectedIBO.description}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-blue-800">Created:</p>
                <p className="text-blue-900">{new Date(selectedIBO.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">ID:</p>
                <p className="text-xs text-blue-700 font-mono">{selectedIBO.id}</p>
              </div>
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
    </div>
  );
}