import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus, Trash2, Edit, BookOpen, Save, X, ArrowLeft } from "lucide-react";
import { useIBOStore } from '../lib/store';
import { usePersonaStore } from '../lib/personaStore';
import { 
  createPerformanceMetric, 
  createObservableBehavior,
  fetchPerformanceMetricsByIBO,
  fetchObservableBehaviorsByPM,
  deletePerformanceMetric,
  deleteObservableBehavior 
} from '../lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PerformanceMetric {
  id: string;
  title: string;
  description: string;
  observableBehaviors: ObservableBehavior[];
}

interface ObservableBehavior {
  id: string;
  description: string;
  proficiencyLevel: number;
  learningObjectives: LearningObjective[];
}

interface LearningObjective {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
}

export default function IBOBuilder() {
  const { 
    ibos, 
    loading, 
    error, 
    loadIBOs, 
    createIBO, 
    updateIBO, 
    deleteIBO, 
    clearError 
  } = useIBOStore();

  const { personas, loadPersonas } = usePersonaStore();

  const [view, setView] = useState<'list' | 'edit' | 'create'>('list');
  const [editingIBO, setEditingIBO] = useState<any>(null);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('');
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    wiifmIndividual: '',
    wiifmOrganization: '',
    description: '',
    persona_id: '',
    topic: '',
    performanceMetrics: [] as PerformanceMetric[]
  });

  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadIBOs();
    loadPersonas();
  }, [loadIBOs, loadPersonas]);

  // Filter IBOs based on selected persona and topic
  const filteredIBOs = ibos.filter(ibo => {
    const personaMatch = selectedPersonaId === 'all' || 
                        (selectedPersonaId === 'generic' && !ibo.persona_id) ||
                        (ibo.persona_id === selectedPersonaId);
    const topicMatch = !topicFilter || ibo.topic?.toLowerCase().includes(topicFilter.toLowerCase());
    return personaMatch && topicMatch;
  });

  // Function to save Performance Metrics and Observable Behaviors to database
  const savePerformanceMetricsToDatabase = async (iboId: string, performanceMetrics: PerformanceMetric[]) => {
    try {
      for (let i = 0; i < performanceMetrics.length; i++) {
        const metric = performanceMetrics[i];
        if (metric.title.trim()) {
          // Create performance metric
          const savedMetric = await createPerformanceMetric({
            text: metric.title,
            ibo_id: iboId,
            sort_order: i
          });

          // Create observable behaviors for this metric
          for (let j = 0; j < metric.observableBehaviors.length; j++) {
            const behavior = metric.observableBehaviors[j];
            if (behavior.description.trim()) {
              await createObservableBehavior({
                text: behavior.description,
                pm_id: savedMetric.id,
                sort_order: j
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error saving performance metrics:', error);
      throw error;
    }
  };

  // Function to load Performance Metrics and Observable Behaviors from database
  const loadPerformanceMetricsFromDatabase = async (iboId: string) => {
    try {
      const metrics = await fetchPerformanceMetricsByIBO(iboId);
      const loadedMetrics: PerformanceMetric[] = [];

      for (const metric of metrics) {
        const behaviors = await fetchObservableBehaviorsByPM(metric.id);
        const observableBehaviors: ObservableBehavior[] = behaviors.map((behavior: any) => ({
          id: behavior.id,
          description: behavior.text,
          proficiencyLevel: 1,
          learningObjectives: []
        }));

        loadedMetrics.push({
          id: metric.id,
          title: metric.text,
          description: '',
          observableBehaviors
        });
      }

      setFormData(prev => ({
        ...prev,
        performanceMetrics: loadedMetrics
      }));
    } catch (error) {
      console.error('Error loading performance metrics:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      wiifmIndividual: '',
      wiifmOrganization: '',
      description: '',
      persona_id: '',
      topic: '',
      performanceMetrics: []
    });
    setEditingIBO(null);
  };

  const handleCreateNew = () => {
    resetForm();
    setView('create');
  };

  const handleEdit = async (ibo: any) => {
    setEditingIBO(ibo);
    setFormData({
      title: ibo.title || '',
      wiifmIndividual: ibo.wiifm_individual || '',
      wiifmOrganization: ibo.wiifm_org || '',
      description: ibo.description || '',
      persona_id: ibo.persona_id || '',
      topic: ibo.topic || '',
      performanceMetrics: []
    });
    
    // Load existing Performance Metrics and Observable Behaviors
    try {
      await loadPerformanceMetricsFromDatabase(ibo.id);
    } catch (error) {
      console.error('Error loading performance metrics:', error);
    }
    
    setView('edit');
  };

  const handleSave = async () => {
    if (!formData.title.trim()) return;
    
    setFormLoading(true);
    try {
      const iboData = {
        title: formData.title,
        description: formData.description,
        persona_id: formData.persona_id || undefined,
        topic: formData.topic
      };

      let savedIBO;
      if (view === 'create') {
        savedIBO = await createIBO(iboData);
      } else if (editingIBO) {
        savedIBO = await updateIBO(editingIBO.id, iboData);
      }

      // Save Performance Metrics and Observable Behaviors to database
      const iboId = savedIBO?.id || editingIBO?.id;
      if (iboId && formData.performanceMetrics.length > 0) {
        await savePerformanceMetricsToDatabase(iboId, formData.performanceMetrics);
      }
      
      setView('list');
      resetForm();
      loadIBOs(); // Refresh the list
    } catch (err) {
      console.error('Failed to save IBO:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this IBO?')) {
      await deleteIBO(id);
    }
  };

  // Performance Metrics handlers
  const addPerformanceMetric = () => {
    const newMetric: PerformanceMetric = {
      id: Date.now().toString(),
      title: '',
      description: '',
      observableBehaviors: []
    };
    setFormData(prev => ({
      ...prev,
      performanceMetrics: [...prev.performanceMetrics, newMetric]
    }));
  };

  const updatePerformanceMetric = (metricId: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      performanceMetrics: prev.performanceMetrics.map(metric =>
        metric.id === metricId ? { ...metric, [field]: value } : metric
      )
    }));
  };

  const deletePerformanceMetric = (metricId: string) => {
    setFormData(prev => ({
      ...prev,
      performanceMetrics: prev.performanceMetrics.filter(metric => metric.id !== metricId)
    }));
  };

  // Observable Behaviors handlers
  const addObservableBehavior = (metricId: string) => {
    const newBehavior: ObservableBehavior = {
      id: Date.now().toString(),
      description: '',
      proficiencyLevel: 1,
      learningObjectives: []
    };
    setFormData(prev => ({
      ...prev,
      performanceMetrics: prev.performanceMetrics.map(metric =>
        metric.id === metricId 
          ? { ...metric, observableBehaviors: [...metric.observableBehaviors, newBehavior] }
          : metric
      )
    }));
  };

  const updateObservableBehavior = (metricId: string, behaviorId: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      performanceMetrics: prev.performanceMetrics.map(metric =>
        metric.id === metricId 
          ? {
              ...metric,
              observableBehaviors: metric.observableBehaviors.map(behavior =>
                behavior.id === behaviorId ? { ...behavior, [field]: value } : behavior
              )
            }
          : metric
      )
    }));
  };

  const deleteObservableBehavior = (metricId: string, behaviorId: string) => {
    setFormData(prev => ({
      ...prev,
      performanceMetrics: prev.performanceMetrics.map(metric =>
        metric.id === metricId 
          ? {
              ...metric,
              observableBehaviors: metric.observableBehaviors.filter(behavior => behavior.id !== behaviorId)
            }
          : metric
      )
    }));
  };

  // Learning Objectives handlers
  const addLearningObjective = (metricId: string, behaviorId: string) => {
    const newObjective: LearningObjective = {
      id: Date.now().toString(),
      title: '',
      description: '',
      orderIndex: 0
    };
    setFormData(prev => ({
      ...prev,
      performanceMetrics: prev.performanceMetrics.map(metric =>
        metric.id === metricId 
          ? {
              ...metric,
              observableBehaviors: metric.observableBehaviors.map(behavior =>
                behavior.id === behaviorId
                  ? { ...behavior, learningObjectives: [...behavior.learningObjectives, newObjective] }
                  : behavior
              )
            }
          : metric
      )
    }));
  };

  const updateLearningObjective = (metricId: string, behaviorId: string, objectiveId: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      performanceMetrics: prev.performanceMetrics.map(metric =>
        metric.id === metricId 
          ? {
              ...metric,
              observableBehaviors: metric.observableBehaviors.map(behavior =>
                behavior.id === behaviorId
                  ? {
                      ...behavior,
                      learningObjectives: behavior.learningObjectives.map(objective =>
                        objective.id === objectiveId ? { ...objective, [field]: value } : objective
                      )
                    }
                  : behavior
              )
            }
          : metric
      )
    }));
  };

  const deleteLearningObjective = (metricId: string, behaviorId: string, objectiveId: string) => {
    setFormData(prev => ({
      ...prev,
      performanceMetrics: prev.performanceMetrics.map(metric =>
        metric.id === metricId 
          ? {
              ...metric,
              observableBehaviors: metric.observableBehaviors.map(behavior =>
                behavior.id === behaviorId
                  ? {
                      ...behavior,
                      learningObjectives: behavior.learningObjectives.filter(objective => objective.id !== objectiveId)
                    }
                  : behavior
              )
            }
          : metric
      )
    }));
  };

  // Render list view
  if (view === 'list') {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center mb-2">
              <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">IBO Builder</h1>
            </div>
            <p className="text-lg text-gray-600">
              Create and manage Intended Behavioral Outcomes (IBOs)
            </p>
          </div>
          <Button onClick={handleCreateNew} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New IBO
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="persona-filter">Filter by Persona</Label>
              <Select value={selectedPersonaId} onValueChange={setSelectedPersonaId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select persona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Personas</SelectItem>
                  <SelectItem value="generic">Generic (Reusable)</SelectItem>
                  {personas.map(persona => (
                    <SelectItem key={persona.id} value={persona.id}>
                      {persona.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="topic-filter">Filter by Topic</Label>
              <Input
                id="topic-filter"
                placeholder="Search topics..."
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
              />
            </div>
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
                onClick={clearError}
                className="ml-2"
              >
                Clear
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* IBOs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && filteredIBOs.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading IBOs...</p>
            </div>
          ) : filteredIBOs.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 text-lg mb-2">No IBOs found</p>
              <p className="text-gray-500">
                {selectedPersonaId !== 'all' || topicFilter ? 'Try adjusting your filters' : 'Create your first IBO to get started!'}
              </p>
            </div>
          ) : (
            filteredIBOs.map((ibo) => (
              <Card key={ibo.id} className="bg-white hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {ibo.title}
                  </CardTitle>
                  {ibo.description && (
                    <p className="text-sm text-gray-600 mt-2">{ibo.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-3">
                    Created: {new Date(ibo.created_at).toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(ibo)}
                      disabled={loading}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(ibo.id)}
                      disabled={loading}
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
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to List
        </Button>
        <div>
          <div className="flex items-center mb-2">
            <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              {view === 'create' ? 'Create New IBO' : 'Edit IBO'}
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Define behavioral outcomes and learning structure
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
              onClick={clearError}
              className="ml-2"
            >
              Clear
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Form */}
      <div className="space-y-8">
        {/* Basic Information */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title*</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter IBO title"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter IBO description"
                className="mt-1"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* WIIFM Section */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>What's In It For Me (WIIFM)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="wiifmIndividual">Individual WIIFM</Label>
              <Textarea
                id="wiifmIndividual"
                value={formData.wiifmIndividual}
                onChange={(e) => setFormData(prev => ({ ...prev, wiifmIndividual: e.target.value }))}
                placeholder="What benefits will individuals gain from this learning?"
                className="mt-1"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="wiifmOrganization">Organizational WIIFM</Label>
              <Textarea
                id="wiifmOrganization"
                value={formData.wiifmOrganization}
                onChange={(e) => setFormData(prev => ({ ...prev, wiifmOrganization: e.target.value }))}
                placeholder="What benefits will the organization gain from this learning?"
                className="mt-1"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Performance Metrics</CardTitle>
              <Button onClick={addPerformanceMetric} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Metric
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {formData.performanceMetrics.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No performance metrics added yet. Click "Add Metric" to get started.
              </p>
            ) : (
              <div className="space-y-6">
                {formData.performanceMetrics.map((metric) => (
                  <Card key={metric.id} className="bg-gray-50 border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-3">
                          <Input
                            value={metric.title}
                            onChange={(e) => updatePerformanceMetric(metric.id, 'title', e.target.value)}
                            placeholder="Performance Metric Title"
                          />
                          <Textarea
                            value={metric.description}
                            onChange={(e) => updatePerformanceMetric(metric.id, 'description', e.target.value)}
                            placeholder="Describe this performance metric"
                            rows={2}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deletePerformanceMetric(metric.id)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      {/* Observable Behaviors */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-gray-900">Observable Behaviors</h4>
                          <Button 
                            onClick={() => addObservableBehavior(metric.id)} 
                            size="sm" 
                            variant="outline"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Behavior
                          </Button>
                        </div>
                        
                        {metric.observableBehaviors.length === 0 ? (
                          <p className="text-gray-400 text-sm italic">No behaviors defined</p>
                        ) : (
                          <div className="space-y-4">
                            {metric.observableBehaviors.map((behavior) => (
                              <Card key={behavior.id} className="bg-white border-gray-200">
                                <CardContent className="p-4">
                                  <div className="space-y-3">
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1 space-y-3">
                                        <Textarea
                                          value={behavior.description}
                                          onChange={(e) => updateObservableBehavior(metric.id, behavior.id, 'description', e.target.value)}
                                          placeholder="Describe the observable behavior"
                                          rows={2}
                                        />
                                        <div>
                                          <Label>Proficiency Level (1-5)</Label>
                                          <Input
                                            type="number"
                                            min="1"
                                            max="5"
                                            value={behavior.proficiencyLevel}
                                            onChange={(e) => updateObservableBehavior(metric.id, behavior.id, 'proficiencyLevel', parseInt(e.target.value))}
                                            className="mt-1 w-24"
                                          />
                                        </div>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteObservableBehavior(metric.id, behavior.id)}
                                        className="ml-2 text-red-600 hover:text-red-800"
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </div>
                                    
                                    {/* Learning Objectives */}
                                    <Separator />
                                    <div className="space-y-3">
                                      <div className="flex justify-between items-center">
                                        <h5 className="text-sm font-medium text-gray-800">Learning Objectives</h5>
                                        <Button 
                                          onClick={() => addLearningObjective(metric.id, behavior.id)} 
                                          size="sm" 
                                          variant="outline"
                                        >
                                          <Plus className="w-3 h-3 mr-1" />
                                          Add Objective
                                        </Button>
                                      </div>
                                      
                                      {behavior.learningObjectives.length === 0 ? (
                                        <p className="text-gray-400 text-xs italic">No objectives defined</p>
                                      ) : (
                                        <div className="space-y-2">
                                          {behavior.learningObjectives.map((objective) => (
                                            <div key={objective.id} className="bg-gray-50 p-3 rounded border">
                                              <div className="flex justify-between items-start">
                                                <div className="flex-1 space-y-2">
                                                  <Input
                                                    value={objective.title}
                                                    onChange={(e) => updateLearningObjective(metric.id, behavior.id, objective.id, 'title', e.target.value)}
                                                    placeholder="Learning objective title"
                                                    className="text-sm"
                                                  />
                                                  <Textarea
                                                    value={objective.description}
                                                    onChange={(e) => updateLearningObjective(metric.id, behavior.id, objective.id, 'description', e.target.value)}
                                                    placeholder="Describe this learning objective"
                                                    rows={2}
                                                    className="text-sm"
                                                  />
                                                </div>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => deleteLearningObjective(metric.id, behavior.id, objective.id)}
                                                  className="ml-2 text-red-600 hover:text-red-800"
                                                >
                                                  <X className="w-3 h-3" />
                                                </Button>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
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
            onClick={handleSave} 
            disabled={formLoading || !formData.title.trim()}
          >
            {formLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save IBO
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}