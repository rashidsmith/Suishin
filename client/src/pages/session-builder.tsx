import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, Trash2, Edit, Clock, Save, BookOpen } from "lucide-react";
import { useCardStore, useIBOStore } from '../lib/store';
import { useSessionStore } from '../lib/sessionStore';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface SessionFormData {
  title: string;
  description: string;
  cardIds: string[];
}

export default function SessionBuilder() {
  const { cards, loading: cardsLoading, loadCards } = useCardStore();
  const { ibos, loadIBOs } = useIBOStore();
  const { 
    sessions, 
    loading: sessionsLoading, 
    error: sessionsError, 
    loadSessions, 
    createSession, 
    updateSession, 
    deleteSession,
    clearError 
  } = useSessionStore();
  const { toast } = useToast();
  
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [editingSession, setEditingSession] = useState<any>(null);
  
  // Form state
  const [formData, setFormData] = useState<SessionFormData>({
    title: '',
    description: '',
    cardIds: []
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCards();
    loadIBOs();
    loadSessions();
  }, [loadCards, loadIBOs, loadSessions]);

  useEffect(() => {
    if (sessionsError) {
      toast({
        title: "Error",
        description: sessionsError,
        variant: "destructive",
      });
      clearError();
    }
  }, [sessionsError, toast, clearError]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      cardIds: []
    });
    setEditingSession(null);
  };

  const handleCreateNew = () => {
    resetForm();
    setView('create');
  };

  const handleEdit = (session: any) => {
    setFormData({
      title: session.title,
      description: session.description || '',
      cardIds: [] // In real app, would load session cards
    });
    setEditingSession(session);
    setView('edit');
  };

  const handleSaveSession = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Session title is required",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      if (view === 'create') {
        await createSession({
          user_id: 'user-1', // In real app, this would come from auth
          learning_objective_id: ibos[0]?.id || 'default-lo-id',
          title: formData.title,
          description: formData.description,
          card_ids: formData.cardIds
        });
      } else if (editingSession) {
        await updateSession(editingSession.id, {
          title: formData.title,
          description: formData.description,
          card_ids: formData.cardIds
        });
      }

      toast({
        title: "Success",
        description: view === 'create' ? "Session created successfully" : "Session updated successfully",
      });

      resetForm();
      setView('list');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save session",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId);
      toast({
        title: "Success",
        description: "Session deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete session",
        variant: "destructive",
      });
    }
  };

  const addCardToSession = (cardId: string) => {
    if (!formData.cardIds.includes(cardId)) {
      setFormData(prev => ({
        ...prev,
        cardIds: [...prev.cardIds, cardId]
      }));
    }
  };

  const removeCardFromSession = (cardId: string) => {
    setFormData(prev => ({
      ...prev,
      cardIds: prev.cardIds.filter(id => id !== cardId)
    }));
  };

  const getTotalDuration = () => {
    return formData.cardIds.reduce((total, cardId) => {
      const card = cards.find(c => c.id === cardId);
      return total + (card?.target_duration || 0);
    }, 0);
  };

  if (cardsLoading || sessionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Session Builder</h1>
          <p className="text-muted-foreground">Create and manage learning sessions</p>
        </div>
        {view === 'list' && (
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Create Session
          </Button>
        )}
        {view !== 'list' && (
          <Button variant="outline" onClick={() => setView('list')}>
            Back to Sessions
          </Button>
        )}
      </div>

      {view === 'list' && (
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No sessions yet</h3>
                <p className="text-muted-foreground mb-4">Create your first learning session to get started.</p>
                <Button onClick={handleCreateNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Session
                </Button>
              </CardContent>
            </Card>
          ) : (
            sessions.map((session) => (
              <Card key={session.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{session.title}</h3>
                      {session.description && (
                        <p className="text-muted-foreground mt-1">{session.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-3">
                        <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                          {session.status.replace('_', ' ')}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Created {new Date(session.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(session)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteSession(session.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {(view === 'create' || view === 'edit') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Session Form */}
          <Card>
            <CardHeader>
              <CardTitle>
                {view === 'create' ? 'Create Session' : 'Edit Session'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Session Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter session title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter session description"
                  rows={3}
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Cards Selected: {formData.cardIds.length}
                </span>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{getTotalDuration()} min</span>
                </div>
              </div>

              <Button 
                onClick={handleSaveSession} 
                disabled={saving}
                className="w-full"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {view === 'create' ? 'Create Session' : 'Update Session'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Available Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Available Cards</CardTitle>
            </CardHeader>
            <CardContent>
              {cards.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No cards available</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create some cards first to add them to sessions
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {cards.map((card) => (
                    <div key={card.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{card.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs text-muted-foreground">
                            {card.target_duration} min
                          </span>
                        </div>
                      </div>
                      {formData.cardIds.includes(card.id) ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeCardFromSession(card.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addCardToSession(card.id)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}