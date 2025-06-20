import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useCardStore } from '../lib/store';
import { useIBOStore } from '../lib/store';
import { usePersonaStore } from '../lib/personaStore';
import { useSessionStore } from '../lib/sessionStore';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, BookOpen, Trash2, Users, Target, Settings, CreditCard, Check, ArrowLeft, ArrowRight, Save, Loader2, Wand2, Brain, Lightbulb } from "lucide-react";
import { GenerateIBOsStep } from '../components/GenerateIBOsStep';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { generateSessionContent, type AIGenerationRequest, type AIGenerationResponse } from "../lib/aiGeneration";
import { StepProgressBar } from '../components/StepProgressBar';
import { useSessionSteps } from '../hooks/useSessionSteps';
import { SESSION_STEPS } from '../../../shared/sessionSteps';

interface SessionFormData {
  title: string;
  persona_id: string;
  topic: string;
  modality: 'onsite' | 'virtual' | 'hybrid';
  business_goals: string;
  cardIds: string[];
}

type BuilderStep = 'persona' | 'topic' | 'generate-ibos' | 'choose-modality' | 'build-4c' | 'review';

export default function SessionBuilder() {
  const { cards, loading: cardsLoading, error: cardsError, loadCards } = useCardStore();
  const { ibos, loading: ibosLoading, error: ibosError, loadIBOs } = useIBOStore();
  const { 
    personas, 
    loading: personasLoading, 
    error: personasError, 
    loadPersonas 
  } = usePersonaStore();
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
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  // Step navigation system
  const stepNavigation = useSessionSteps(sessionId);
  const currentStep = stepNavigation.session?.current_step || 'persona';

  const [formData, setFormData] = useState<SessionFormData>({
    title: '',
    persona_id: '',
    topic: '',
    modality: 'virtual',
    business_goals: '',
    cardIds: []
  });

  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [filteredIBOs, setFilteredIBOs] = useState<any[]>([]);
  const [generatedContent, setGeneratedContent] = useState<AIGenerationResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const steps: { id: BuilderStep; title: string; description: string; icon: any }[] = [
    { id: 'persona', title: 'Select Persona', description: 'Choose target audience', icon: Users },
    { id: 'topic-goals', title: 'Topic & Goals', description: 'Define focus and outcomes', icon: Target },
    { id: 'modality', title: 'Delivery Mode', description: 'Choose format', icon: Settings },
    { id: 'ai-generation', title: 'AI Generation', description: 'Generate content', icon: Wand2 },
    { id: 'cards', title: '4C Structure', description: 'Design learning flow', icon: CreditCard },
    { id: 'review', title: 'Review & Create', description: 'Finalize session', icon: Check },
  ];

  const getStepIndex = (step: BuilderStep) => steps.findIndex(s => s.id === step);
  const getCurrentStepIndex = () => getStepIndex(currentStep);
  const getProgressPercentage = () => ((getCurrentStepIndex() + 1) / steps.length) * 100;

  useEffect(() => {
    const loadData = async () => {
      try {
        await loadPersonas();
        await Promise.all([loadCards(), loadIBOs(), loadSessions()]);
      } catch (error) {
        toast({
          title: "Error Loading Data",
          description: "Failed to load application data. Please refresh the page.",
          variant: "destructive",
        });
      }
    };
    loadData();
  }, [loadCards, loadIBOs, loadSessions]);

  useEffect(() => {
    if (sessionsError) {
      toast({
        title: "Session Error",
        description: sessionsError,
        variant: "destructive",
      });
      clearError();
    }
  }, [sessionsError, toast, clearError]);

  useEffect(() => {
    if (cardsError) {
      toast({
        title: "Cards Error",
        description: cardsError,
        variant: "destructive",
      });
    }
  }, [cardsError, toast]);

  useEffect(() => {
    if (ibosError) {
      toast({
        title: "IBOs Error",
        description: ibosError,
        variant: "destructive",
      });
    }
  }, [ibosError, toast]);

  // Filter IBOs based on selected persona and topic
  useEffect(() => {
    if (formData.persona_id && formData.topic) {
      const filtered = ibos.filter(ibo => {
        const matchesPersona = ibo.persona_id === formData.persona_id || !ibo.persona_id; // Include generic IBOs
        const matchesTopic = ibo.topic?.toLowerCase().includes(formData.topic.toLowerCase());
        return matchesPersona && matchesTopic;
      });
      setFilteredIBOs(filtered);
    } else {
      setFilteredIBOs([]);
    }
  }, [formData.persona_id, formData.topic, ibos]);

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Session title is required';
    }
    if (!formData.persona_id) {
      errors.persona_id = 'Persona selection is required';
    }
    if (!formData.topic.trim()) {
      errors.topic = 'Topic is required';
    }
    if (!formData.business_goals.trim()) {
      errors.business_goals = 'Business goals are required';
    }
    if (!formData.modality) {
      errors.modality = 'Delivery modality is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      title: '',
      persona_id: '',
      topic: '',
      modality: 'virtual',
      business_goals: '',
      cardIds: []
    });
    setEditingSession(null);
    setFormErrors({});
    setCurrentStep('persona');
  };

  const handleCreateNew = () => {
    resetForm();
    setView('create');
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 'persona':
        return formData.persona_id !== '';
      case 'topic-goals':
        return formData.topic.trim() !== '' && formData.business_goals.trim() !== '';
      case 'modality':
        return formData.modality !== '';
      case 'ai-generation':
        return generatedContent !== null;
      case 'cards':
        return formData.cardIds.length > 0;
      case 'review':
        return formData.title.trim() !== '';
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handlePrevStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const generateSessionStructure = async () => {
    const selectedPersona = personas.find(p => p.id === formData.persona_id);
    if (!selectedPersona) {
      toast({
        title: "Error",
        description: "Please select a persona first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const request: AIGenerationRequest = {
        persona: {
          name: selectedPersona.name,
          description: selectedPersona.description,
          context: selectedPersona.context,
          experience: selectedPersona.experience,
          motivations: selectedPersona.motivations,
          constraints: selectedPersona.constraints,
        },
        topic: formData.topic,
        modality: formData.modality,
        businessGoals: formData.business_goals,
      };

      const generated = await generateSessionContent(request);
      setGeneratedContent(generated);
      
      toast({
        title: "Success",
        description: "Session structure generated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate session structure",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveSession = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const sessionData = {
        title: formData.title,
        persona_id: formData.persona_id,
        topic: formData.topic,
        modality: formData.modality,
        business_goals: formData.business_goals,
        user_id: 'default-user',
        learning_objective_id: '',
        cardIds: formData.cardIds
      };

      if (view === 'edit' && editingSession) {
        await updateSession(editingSession.id, sessionData);
        toast({
          title: "Success",
          description: "Session updated successfully",
        });
      } else {
        await createSession(sessionData);
        toast({
          title: "Success",
          description: "Session created successfully",
        });
      }
      
      resetForm();
      setView('list');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save session",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (session: any) => {
    setFormData({
      title: session.title,
      persona_id: session.persona_id || '',
      topic: session.topic || '',
      modality: session.modality || 'virtual',
      business_goals: session.business_goals || '',
      cardIds: []
    });
    setEditingSession(session);
    setCurrentStep('persona');
    setView('edit');
  };

  const handleDelete = async (sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await deleteSession(sessionId);
        toast({
          title: "Success",
          description: "Session deleted successfully",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete session",
          variant: "destructive",
        });
      }
    }
  };

  if (personasLoading || cardsLoading || ibosLoading || sessionsLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
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
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-blue-600 font-medium">
                          Topic: {session.topic}
                        </p>
                        <p className="text-sm text-green-600 font-medium">
                          Persona: {(session as any).personas?.name || 'Unknown'}
                        </p>
                        <p className="text-sm text-purple-600 font-medium">
                          Modality: {session.modality}
                        </p>
                        <p className="text-sm text-gray-600">
                          Goals: {session.business_goals}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEdit(session)}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDelete(session.id)}
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
        <div className="space-y-6">
          {/* Progress Bar */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Step {getCurrentStepIndex() + 1} of {steps.length}</h2>
                  <span className="text-sm text-muted-foreground">{Math.round(getProgressPercentage())}% Complete</span>
                </div>
                <Progress value={getProgressPercentage()} className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = step.id === currentStep;
                    const isCompleted = getStepIndex(step.id) < getCurrentStepIndex();
                    return (
                      <div key={step.id} className={`flex flex-col items-center space-y-1 ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:block">{step.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step Content */}
          {currentStep === 'persona' && renderPersonaStep()}
          {currentStep === 'topic' && renderTopicGoalsStep()}
          {currentStep === 'generate-ibos' && renderAIGenerationStep()}
          {currentStep === 'choose-modality' && renderModalityStep()}
          {currentStep === 'build-4c' && renderCardsStep()}
          {currentStep === 'review' && renderReviewStep()}

          {/* Navigation */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={getCurrentStepIndex() === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                <div className="space-x-2">
                  {getCurrentStepIndex() === steps.length - 1 ? (
                    <Button
                      onClick={handleSaveSession}
                      disabled={!canProceedToNextStep() || saving}
                    >
                      {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Create Session
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextStep}
                      disabled={!canProceedToNextStep()}
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  // Step 1: Persona Selection
  function renderPersonaStep() {
    const selectedPersona = personas.find(p => p.id === formData.persona_id);
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Select Target Persona
          </CardTitle>
          <p className="text-muted-foreground">Choose who this session is designed for</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="persona">Target Persona*</Label>
            <Select value={formData.persona_id} onValueChange={(value) => {
              setFormData(prev => ({ ...prev, persona_id: value }));
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select target persona" />
              </SelectTrigger>
              <SelectContent>
                {personas.map(persona => (
                  <SelectItem key={persona.id} value={persona.id}>
                    {persona.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPersona && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">{selectedPersona.name}</h4>
              <p className="text-blue-800 text-sm mb-2">{selectedPersona.description}</p>
              <div className="space-y-2 text-sm">
                <div><strong>Context:</strong> {selectedPersona.context}</div>
                <div><strong>Experience:</strong> {selectedPersona.experience}</div>
                <div><strong>Motivations:</strong> {selectedPersona.motivations}</div>
                <div><strong>Constraints:</strong> {selectedPersona.constraints}</div>
              </div>
            </div>
          )}

          <Button variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Create New Persona
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Step 2: Topic & Goals
  function renderTopicGoalsStep() {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Define Topic & Business Goals
          </CardTitle>
          <p className="text-muted-foreground">Set the focus and desired outcomes</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="topic">Topic*</Label>
            <Input
              id="topic"
              value={formData.topic}
              onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
              placeholder="Enter subject matter focus"
            />
          </div>

          <div>
            <Label htmlFor="business_goals">Business Goals*</Label>
            <Textarea
              id="business_goals"
              value={formData.business_goals}
              onChange={(e) => setFormData(prev => ({ ...prev, business_goals: e.target.value }))}
              placeholder="Enter session-specific business outcomes"
              rows={4}
            />
          </div>

          {filteredIBOs.length > 0 && (
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Related IBOs Found</h4>
              <p className="text-green-800 text-sm mb-3">These existing IBOs match your persona and topic:</p>
              <div className="space-y-2">
                {filteredIBOs.map(ibo => (
                  <div key={ibo.id} className="p-2 bg-white rounded border text-sm">
                    <div className="font-medium">{ibo.title}</div>
                    <div className="text-gray-600">{ibo.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Step 3: Modality Selection
  function renderModalityStep() {
    const modalityInfo = {
      onsite: {
        title: "Onsite",
        description: "In-person classroom or workshop setting",
        considerations: ["Face-to-face interaction", "Physical materials", "Venue requirements", "Travel logistics"],
        constraints: ["Limited to physical location", "Scheduling challenges", "Higher costs"]
      },
      virtual: {
        title: "Virtual",
        description: "Online delivery via video conferencing",
        considerations: ["Digital tools and platforms", "Internet connectivity", "Screen sharing", "Breakout rooms"],
        constraints: ["Technology dependencies", "Engagement challenges", "Time zone differences"]
      },
      hybrid: {
        title: "Hybrid",
        description: "Combination of onsite and virtual elements",
        considerations: ["Blended experience design", "Technology integration", "Multiple delivery modes"],
        constraints: ["Complex logistics", "Dual preparation required", "Coordination challenges"]
      }
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Choose Delivery Modality
          </CardTitle>
          <p className="text-muted-foreground">Select how the session will be delivered</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={formData.modality}
            onValueChange={(value: 'onsite' | 'virtual' | 'hybrid') => 
              setFormData(prev => ({ ...prev, modality: value }))
            }
          >
            {Object.entries(modalityInfo).map(([key, info]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={key} id={key} />
                  <Label htmlFor={key} className="font-medium">{info.title}</Label>
                </div>
                <div className="ml-6 text-sm text-muted-foreground">
                  <p className="mb-2">{info.description}</p>
                  {formData.modality === key && (
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="mb-2">
                        <strong>Considerations:</strong>
                        <ul className="list-disc list-inside mt-1">
                          {info.considerations.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <strong>Constraints:</strong>
                        <ul className="list-disc list-inside mt-1 text-red-600">
                          {info.constraints.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    );
  }

  // Step 5: 4C Structure (Cards)
  function renderCardsStep() {
    const availableCards = cards.filter(card => {
      // Filter out already selected cards
      if (formData.cardIds.includes(card.id)) return false;
      
      // Filter by modality compatibility if card has modality preferences
      if (card.recommended_modalities && card.recommended_modalities.length > 0) {
        try {
          const modalities = typeof card.recommended_modalities === 'string' 
            ? JSON.parse(card.recommended_modalities)
            : card.recommended_modalities;
          return modalities.includes(formData.modality);
        } catch (e) {
          return true; // Include if parsing fails
        }
      }
      
      return true; // Include cards without modality restrictions
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Design 4C Learning Flow
          </CardTitle>
          <p className="text-muted-foreground">Select cards to build your session structure</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Available Cards</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableCards.map(card => {
                  let modalityTags = [];
                  try {
                    modalityTags = card.recommended_modalities 
                      ? (typeof card.recommended_modalities === 'string' 
                          ? JSON.parse(card.recommended_modalities) 
                          : card.recommended_modalities)
                      : [];
                  } catch (e) {
                    modalityTags = [];
                  }
                  
                  return (
                    <div key={card.id} className="p-2 border rounded cursor-pointer hover:bg-gray-50"
                         onClick={() => setFormData(prev => ({ ...prev, cardIds: [...prev.cardIds, card.id] }))}>
                      <div className="font-medium">{card.title}</div>
                      <div className="text-sm text-gray-600">{card.description || card.content}</div>
                      {modalityTags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {modalityTags.map((modality: string) => (
                            <span key={modality} className={`text-xs px-2 py-1 rounded ${
                              modality === formData.modality 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {modality}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Selected Cards ({formData.cardIds.length})</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {formData.cardIds.map((cardId, index) => {
                  const card = cards.find(c => c.id === cardId);
                  if (!card) return null;
                  return (
                    <div key={cardId} className="p-2 border rounded bg-blue-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium">{card.title}</div>
                          <div className="text-sm text-gray-600">{card.content}</div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setFormData(prev => ({ 
                            ...prev, 
                            cardIds: prev.cardIds.filter(id => id !== cardId) 
                          }))}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Step 4: AI Generation
  function renderAIGenerationStep() {
    return (
      <GenerateIBOsStep 
        sessionId={editingSession?.id || null}
        onStepComplete={stepNavigation.updateStep}
      />
    );
  }

  // Step 6: Review & Create
  function renderReviewStep() {
    const selectedPersona = personas.find(p => p.id === formData.persona_id);
    const selectedCards = cards.filter(c => formData.cardIds.includes(c.id));

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            Review & Create Session
          </CardTitle>
          <p className="text-muted-foreground">Finalize your session details</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="session-title">Session Title*</Label>
            <Input
              id="session-title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter session title"
            />
          </div>

          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
            <div><strong>Persona:</strong> {selectedPersona?.name}</div>
            <div><strong>Topic:</strong> {formData.topic}</div>
            <div><strong>Modality:</strong> {formData.modality}</div>
            <div><strong>Business Goals:</strong> {formData.business_goals}</div>
            <div><strong>Generated Content:</strong> {generatedContent ? 'Yes' : 'No'}</div>
            <div><strong>Cards:</strong> {selectedCards.length} selected</div>
          </div>
        </CardContent>
      </Card>
    );
  }
}