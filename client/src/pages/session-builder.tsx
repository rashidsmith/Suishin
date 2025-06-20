import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, Trash2, Edit, Calendar, Clock, Save, BookOpen } from "lucide-react";
import { useCardStore } from '../lib/store';

interface SessionCard {
  id: string;
  card_id: string;
  order_index: number;
  card: {
    id: string;
    title: string;
    description?: string;
    target_duration: number;
    activities: any[];
  };
}

interface Session {
  id: string;
  title: string;
  description?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  created_at: string;
  session_cards: SessionCard[];
}

interface SessionFormData {
  title: string;
  description: string;
  cardIds: string[];
}

export default function SessionBuilder() {
  const { cards, loading: cardsLoading, loadCards } = useCardStore();
  
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<SessionFormData>({
    title: '',
    description: '',
    cardIds: []
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCards();
    loadSessions();
  }, [loadCards]);

  const loadSessions = async () => {
    setLoading(true);
    try {
      // Mock sessions for now - in real app, this would be an API call
      const mockSessions: Session[] = [
        {
          id: '1',
          title: 'Introduction to Learning',
          description: 'Basic concepts and principles',
          status: 'not_started',
          created_at: new Date().toISOString(),
          session_cards: []
        }
      ];
      setSessions(mockSessions);
    } catch (err) {
      setError('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

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

  const handleEdit = (session: Session) => {
    setFormData({
      title: session.title,
      description: session.description || '',
      cardIds: session.session_cards.map(sc => sc.card_id)
    });
    setEditingSession(session);
    setView('edit');
  };

  const handleSaveSession = async () => {
    if (!formData.title.trim()) {
      setError('Session title is required');
      return;
    }

    setSaving(true);
    try {
      const sessionData = {
        title: formData.title,
        description: formData.description,
        status: 'not_started' as const,
        session_cards: formData.cardIds.map((cardId, index) => ({
          id: `sc_${Date.now()}_${index}`,
          card_id: cardId,
          order_index: index,
          card: cards.find(c => c.id === cardId)!
        }))
      };

      if (view === 'create') {
        // Create new session
        const newSession: Session = {
          id: Date.now().toString(),
          ...sessionData,
          created_at: new Date().toISOString()
        };
        setSessions(prev => [newSession, ...prev]);
      } else if (editingSession) {
        // Update existing session
        setSessions(prev => prev.map(s => 
          s.id === editingSession.id 
            ? { ...editingSession, ...sessionData }
            : s
        ));
      }

      setView('list');
      resetForm();
      setError(null);
    } catch (err) {
      setError('Failed to save session');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSession = (session: Session) => {
    if (confirm('Are you sure you want to delete this session?')) {
      setSessions(prev => prev.filter(s => s.id !== session.id));
    }
  };

  const handleAddCard = (cardId: string) => {
    if (!formData.cardIds.includes(cardId)) {
      setFormData(prev => ({
        ...prev,
        cardIds: [...prev.cardIds, cardId]
      }));
    }
  };

  const handleRemoveCard = (cardId: string) => {
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

  const getSessionDuration = (session: Session) => {
    return session.session_cards.reduce((total, sc) => {
      return total + (sc.card?.target_duration || 0);
    }, 0);
  };

  // Render list view
  if (view === 'list') {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center mb-2">
              <Calendar className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Session Builder</h1>
            </div>
            <p className="text-lg text-gray-600">
              Create and manage learning sessions
            </p>
          </div>
          <Button onClick={handleCreateNew} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Session
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertDescription className="text-red-800">
              {error}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setError(null)}
                className="ml-2"
              >
                Clear
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading sessions...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 text-lg mb-2">No sessions created yet</p>
              <p className="text-gray-500">Create your first learning session to get started!</p>
            </div>
          ) : (
            sessions.map((session) => (
              <Card key={session.id} className="bg-white hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {session.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{session.description}</p>
                  <div className="flex items-center text-xs text-gray-500 mt-2">
                    <Clock className="w-3 h-3 mr-1" />
                    {getSessionDuration(session)} min
                    ({session.session_cards.length} cards)
                  </div>
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      session.status === 'completed' ? 'bg-green-100 text-green-800' :
                      session.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      session.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {session.status.replace('_', ' ')}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(session)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteSession(session)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  }

  // Render form view (create/edit)
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          onClick={() => setView('list')}
          className="mr-4"
        >
          ← Back to Sessions
        </Button>
        <div>
          <div className="flex items-center mb-2">
            <Calendar className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              {view === 'create' ? 'Create New Session' : 'Edit Session'}
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Design your learning session
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">
            {error}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setError(null)}
              className="ml-2"
            >
              Clear
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Form */}
      <div className="space-y-8">
        {/* Session Details */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Session Title*</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter session title"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Session Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the learning session"
                className="mt-1"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Cards Section */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Session Cards</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Total Duration: {getTotalDuration()} min ({formData.cardIds.length} cards)
                </p>
              </div>
              <div>
                <Label htmlFor="addCard">Add Card</Label>
                <Select onValueChange={handleAddCard}>
                  <SelectTrigger className="w-64 mt-1">
                    <SelectValue placeholder="Choose a card to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {cardsLoading ? (
                      <SelectItem value="loading" disabled>Loading cards...</SelectItem>
                    ) : cards.length === 0 ? (
                      <SelectItem value="empty" disabled>No cards available</SelectItem>
                    ) : (
                      cards
                        .filter(card => !formData.cardIds.includes(card.id))
                        .map((card) => (
                          <SelectItem key={card.id} value={card.id}>
                            {card.title} ({card.target_duration || 0} min)
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {formData.cardIds.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No cards added yet. Use the dropdown above to add cards to your session.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.cardIds.map((cardId, index) => {
                  const card = cards.find(c => c.id === cardId);
                  if (!card) return null;
                  
                  return (
                    <Card key={cardId} className="bg-gray-50 border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-gray-500">
                                #{index + 1}
                              </span>
                              <h4 className="font-medium text-gray-900">{card.title}</h4>
                              <span className="text-sm text-gray-500 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {card.target_duration || 0} min
                              </span>
                            </div>
                            {card.description && (
                              <p className="text-sm text-gray-600">{card.description}</p>
                            )}
                            <div className="text-xs text-gray-500 mt-1">
                              {card.activities?.length || 0} activities
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRemoveCard(cardId)}
                            className="ml-4"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => setView('list')}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveSession} 
            disabled={saving || !formData.title.trim()}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Session
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}