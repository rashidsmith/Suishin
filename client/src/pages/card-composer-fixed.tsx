import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Plus, Trash2, Edit, CreditCard, Save, Clock } from "lucide-react";
import { useIBOStore, useCardStore } from '../lib/store';

interface Activity {
  id: string;
  title: string;
  description: string;
  type: 'C1' | 'C2' | 'C3' | 'C4';
  duration: number;
}

interface CardFormData {
  title: string;
  description: string;
  iboId: string;
  learningObjectiveId: string;
  targetDuration: number;
  activities: Activity[];
}

const activityTypes = [
  { value: 'C1', label: 'C1 - Connection', description: 'Connect to prior knowledge and experience' },
  { value: 'C2', label: 'C2 - Concept', description: 'Introduce new concepts and information' },
  { value: 'C3', label: 'C3 - Concrete Practice', description: 'Apply knowledge through practice' },
  { value: 'C4', label: 'C4 - Conclusion', description: 'Summarize and reflect on learning' }
];

export default function CardComposer() {
  const { ibos, loading: ibosLoading, loadIBOs } = useIBOStore();
  const { 
    cards, 
    loading: cardsLoading, 
    error: cardsError, 
    loadCards, 
    createCard: createCardStore, 
    updateCard: updateCardStore, 
    deleteCard: deleteCardStore, 
    clearError: clearCardsError 
  } = useCardStore();
  
  const [editingCard, setEditingCard] = useState<any>(null);
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  
  // Form state
  const [formData, setFormData] = useState<CardFormData>({
    title: '',
    description: '',
    iboId: '',
    learningObjectiveId: '',
    targetDuration: 30,
    activities: []
  });

  // Activity form state
  const [activityForm, setActivityForm] = useState<Partial<Activity>>({
    title: '',
    description: '',
    type: 'C1',
    duration: 5
  });
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [editingActivityIndex, setEditingActivityIndex] = useState<number | null>(null);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadIBOs();
    loadCards();
  }, [loadIBOs, loadCards]);

  // Mock learning objectives - in real app, these would come from API
  const learningObjectives = [
    { id: '11111111-1111-1111-1111-111111111111', title: 'Understand basic concepts', iboId: formData.iboId },
    { id: '22222222-2222-2222-2222-222222222222', title: 'Apply knowledge practically', iboId: formData.iboId },
    { id: '33333333-3333-3333-3333-333333333333', title: 'Analyze complex scenarios', iboId: formData.iboId }
  ];

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      iboId: '',
      learningObjectiveId: '',
      targetDuration: 30,
      activities: []
    });
    setEditingCard(null);
  };

  const resetActivityForm = () => {
    setActivityForm({
      title: '',
      description: '',
      type: 'C1',
      duration: 5
    });
    setEditingActivityIndex(null);
  };

  const handleCreateNew = () => {
    resetForm();
    setView('create');
  };

  const handleEdit = (card: any) => {
    setFormData({
      title: card.title || '',
      description: card.description || '',
      iboId: card.ibo_id || '',
      learningObjectiveId: card.learning_objective_id || '',
      targetDuration: card.target_duration || 30,
      activities: card.activities || []
    });
    setEditingCard(card);
    setView('edit');
  };

  const handleSaveCard = async () => {
    if (!formData.title.trim() || !formData.iboId || !formData.learningObjectiveId) {
      return;
    }

    setSaving(true);
    try {
      const cardData = {
        title: formData.title,
        description: formData.description,
        ibo_id: formData.iboId,
        learning_objective_id: formData.learningObjectiveId,
        target_duration: formData.targetDuration,
        activities: formData.activities.map(activity => ({
          title: activity.title,
          description: activity.description,
          type: activity.type,
          duration: activity.duration
        }))
      };

      if (view === 'create') {
        await createCardStore(cardData);
      } else if (editingCard) {
        await updateCardStore(editingCard.id, cardData);
      }
      
      setView('list');
      resetForm();
    } catch (err) {
      console.error('Failed to save card:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCard = (card: any) => {
    if (confirm('Are you sure you want to delete this card?')) {
      deleteCardStore(card.id);
    }
  };

  const handleAddActivity = () => {
    resetActivityForm();
    setActivityDialogOpen(true);
  };

  const handleEditActivity = (index: number) => {
    const activity = formData.activities[index];
    setActivityForm(activity);
    setEditingActivityIndex(index);
    setActivityDialogOpen(true);
  };

  const handleSaveActivity = () => {
    if (!activityForm.title?.trim()) {
      return;
    }

    const activity: Activity = {
      id: editingActivityIndex !== null ? formData.activities[editingActivityIndex].id : Date.now().toString(),
      title: activityForm.title || '',
      description: activityForm.description || '',
      type: activityForm.type || 'C1',
      duration: activityForm.duration || 5
    };

    if (editingActivityIndex !== null) {
      // Edit existing activity
      const updatedActivities = [...formData.activities];
      updatedActivities[editingActivityIndex] = activity;
      setFormData(prev => ({ ...prev, activities: updatedActivities }));
    } else {
      // Add new activity
      setFormData(prev => ({
        ...prev,
        activities: [...prev.activities, activity]
      }));
    }

    setActivityDialogOpen(false);
    resetActivityForm();
  };

  const handleDeleteActivity = (index: number) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      const updatedActivities = formData.activities.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, activities: updatedActivities }));
    }
  };

  const getTotalDuration = () => {
    return formData.activities.reduce((total, activity) => total + activity.duration, 0);
  };

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'C1': return 'bg-blue-100 text-blue-800';
      case 'C2': return 'bg-green-100 text-green-800';
      case 'C3': return 'bg-yellow-100 text-yellow-800';
      case 'C4': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Render list view
  if (view === 'list') {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center mb-2">
              <CreditCard className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Card Composer</h1>
            </div>
            <p className="text-lg text-gray-600">
              Create learning cards with structured activities
            </p>
          </div>
          <Button onClick={handleCreateNew} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Card
          </Button>
        </div>

        {/* Error Alert */}
        {cardsError && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertDescription className="text-red-800">
              {cardsError}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearCardsError}
                className="ml-2"
              >
                Clear
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardsLoading && cards.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading cards...</p>
            </div>
          ) : cards.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 text-lg mb-2">No cards created yet</p>
              <p className="text-gray-500">Create your first learning card to get started!</p>
            </div>
          ) : (
            cards.map((card) => (
              <Card key={card.id} className="bg-white hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {card.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{card.description}</p>
                  <div className="flex items-center text-xs text-gray-500 mt-2">
                    <Clock className="w-3 h-3 mr-1" />
                    {card.activities?.reduce((total: number, activity: any) => total + activity.duration, 0) || 0} min
                    ({card.activities?.length || 0} activities)
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(card)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteCard(card)}
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
          ← Back to Cards
        </Button>
        <div>
          <div className="flex items-center mb-2">
            <CreditCard className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              {view === 'create' ? 'Create New Card' : 'Edit Card'}
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Design structured learning activities
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {cardsError && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">
            {cardsError}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearCardsError}
              className="ml-2"
            >
              Clear
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Form */}
      <div className="space-y-8">
        {/* Card Setup */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Card Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ibo">Select IBO*</Label>
                <Select 
                  value={formData.iboId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, iboId: value, learningObjectiveId: '' }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose an IBO" />
                  </SelectTrigger>
                  <SelectContent>
                    {ibosLoading ? (
                      <SelectItem value="loading" disabled>Loading IBOs...</SelectItem>
                    ) : ibos.length === 0 ? (
                      <SelectItem value="empty" disabled>No IBOs available</SelectItem>
                    ) : (
                      ibos.map((ibo) => (
                        <SelectItem key={ibo.id} value={ibo.id}>
                          {ibo.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="learningObjective">Learning Objective*</Label>
                <Select 
                  value={formData.learningObjectiveId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, learningObjectiveId: value }))}
                  disabled={!formData.iboId}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose a learning objective" />
                  </SelectTrigger>
                  <SelectContent>
                    {learningObjectives.map((obj) => (
                      <SelectItem key={obj.id} value={obj.id}>
                        {obj.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="title">Card Title*</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter card title"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Card Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the learning card"
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="targetDuration">Target Duration (minutes)</Label>
              <Input
                id="targetDuration"
                type="number"
                min="1"
                value={formData.targetDuration}
                onChange={(e) => setFormData(prev => ({ ...prev, targetDuration: parseInt(e.target.value) || 30 }))}
                className="mt-1 w-32"
              />
            </div>
          </CardContent>
        </Card>

        {/* Activities Section */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Activities</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Total: {getTotalDuration()} min / Target: {formData.targetDuration} min
                  {getTotalDuration() > formData.targetDuration && (
                    <span className="text-red-600 ml-2">
                      ({getTotalDuration() - formData.targetDuration} min over)
                    </span>
                  )}
                </p>
              </div>
              <Button onClick={handleAddActivity} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Activity
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {formData.activities.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No activities added yet. Click "Add Activity" to get started.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.activities.map((activity, index) => (
                  <Card key={activity.id} className="bg-gray-50 border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getActivityTypeColor(activity.type)}`}>
                              {activity.type}
                            </span>
                            <h4 className="font-medium text-gray-900">{activity.title}</h4>
                            <span className="text-sm text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {activity.duration} min
                            </span>
                          </div>
                          {activity.description && (
                            <p className="text-sm text-gray-600">{activity.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditActivity(index)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteActivity(index)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
            onClick={handleSaveCard} 
            disabled={saving || !formData.title.trim() || !formData.iboId || !formData.learningObjectiveId}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Card
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Activity Dialog */}
      <Dialog open={activityDialogOpen} onOpenChange={setActivityDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingActivityIndex !== null ? 'Edit Activity' : 'Add New Activity'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Activity Type</Label>
              <RadioGroup 
                value={activityForm.type} 
                onValueChange={(value) => setActivityForm(prev => ({ ...prev, type: value as any }))}
                className="mt-2"
              >
                {activityTypes.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={type.value} id={type.value} />
                    <Label htmlFor={type.value} className="flex-1">
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-gray-600">{type.description}</div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="activityTitle">Title*</Label>
              <Input
                id="activityTitle"
                value={activityForm.title}
                onChange={(e) => setActivityForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter activity title"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="activityDescription">Description</Label>
              <Textarea
                id="activityDescription"
                value={activityForm.description}
                onChange={(e) => setActivityForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the activity"
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="activityDuration">Duration (minutes)*</Label>
              <Input
                id="activityDuration"
                type="number"
                min="1"
                value={activityForm.duration}
                onChange={(e) => setActivityForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 5 }))}
                className="mt-1 w-32"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setActivityDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveActivity} disabled={!activityForm.title?.trim()}>
                {editingActivityIndex !== null ? 'Update' : 'Add'} Activity
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}