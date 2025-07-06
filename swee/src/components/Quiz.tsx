'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, Sun, Moon, Home } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';

interface QuizQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple';
  options: string[];
  condition?: string; // e.g., "service_type:Hair Services,Multiple Services"
}

interface QuizAnswers {
  [questionId: string]: string | string[];
}

export default function Quiz() {
  const router = useRouter();
  const [allQuestions, setAllQuestions] = useState<QuizQuestion[]>([]);
  const [visibleQuestions, setVisibleQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(-1); // Start with email step
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');
  const { darkMode, toggleDarkMode } = useTheme();

  // Load quiz questions on component mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/api/quiz');
        const data = await response.json();
        
        if (data.success) {
          setAllQuestions(data.questions);
          setVisibleQuestions(data.questions); // Initially show all questions
        } else {
          setError('Failed to load quiz questions');
        }
      } catch (err) {
        setError('Network error loading quiz');
        console.error('Quiz loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  // Update visible questions based on current answers
  useEffect(() => {
    if (allQuestions.length === 0) return;

    const filterQuestions = () => {
      return allQuestions.filter(question => {
        if (!question.condition) return true;
        
        // Parse condition (e.g., "service_type:Hair Services,Multiple Services")
        const [conditionKey, conditionValues] = question.condition.split(':');
        const allowedValues = conditionValues.split(',').map(v => v.trim());
        
        const userAnswer = answers[conditionKey];
        if (!userAnswer) return false;
        
        // Check if user's answer matches any of the allowed values
        if (Array.isArray(userAnswer)) {
          return userAnswer.some(answer => allowedValues.includes(answer));
        } else {
          return allowedValues.includes(userAnswer);
        }
      });
    };

    setVisibleQuestions(filterQuestions());
  }, [answers, allQuestions]);

  const currentQuestionData = visibleQuestions[currentQuestion];
  const isEmailStep = currentQuestion === -1;
  const progress = isEmailStep ? 10 : ((currentQuestion + 1) / visibleQuestions.length) * 90 + 10; // Email step = 10%, questions = 90%
  const isLastQuestion = currentQuestion === visibleQuestions.length - 1;

  // Handle answer changes
  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Handle single choice answers
  const handleSingleChoice = (value: string) => {
    if (currentQuestionData) {
      handleAnswerChange(currentQuestionData.id, value);
    }
  };

  // Handle multiple choice answers
  const handleMultipleChoice = (option: string, checked: boolean) => {
    if (!currentQuestionData) return;
    
    const currentAnswers = answers[currentQuestionData.id] as string[] || [];
    let newAnswers: string[];
    
    if (checked) {
      newAnswers = [...currentAnswers, option];
    } else {
      newAnswers = currentAnswers.filter(answer => answer !== option);
    }
    
    handleAnswerChange(currentQuestionData.id, newAnswers);
  };

  // Check if current step can proceed
  const canProceed = () => {
    if (isEmailStep) {
      return email.trim() !== '' && email.includes('@');
    }
    
    if (currentQuestionData) {
      const answer = answers[currentQuestionData.id];
      if (currentQuestionData.type === 'multiple') {
        return Array.isArray(answer) && answer.length > 0;
      } else {
        return answer !== undefined && answer !== '';
      }
    }
    
    return false;
  };

  // Navigate to next question
  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  // Navigate to previous question
  const handlePrevious = () => {
    setCurrentQuestion(prev => prev - 1);
  };

  // Submit quiz answers
  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      console.log('Submitting quiz with:', { email, answers });
      
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          answers
        })
      });

      const data = await response.json();
      console.log('Quiz submission response:', data);

      if (data.success) {
        setCompleted(true);
        // Redirect to main app after a short delay
        setTimeout(() => {
          router.push('/?onboarded=true');
        }, 3000);
      } else {
        console.error('Quiz submission failed:', data);
        setError(data.error || 'Failed to submit quiz');
        if (data.details) {
          console.error('Validation errors:', data.details);
        }
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
      setError('Network error submitting quiz');
    } finally {
      setSubmitting(false);
    }
  };

  // Start quiz (from email step)
  const startQuiz = () => {
    setCurrentQuestion(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-orange-600 dark:text-orange-400" />
              <span className="text-gray-900 dark:text-white">Loading quiz...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Thank you!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Your preferences have been saved. We'll personalize your Swee experience based on your answers.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Redirecting you to the app...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Back to Home</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to Swee</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {isEmailStep ? 'Let\'s get started' : `${currentQuestion + 1} of ${visibleQuestions.length}`}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
              >
                {darkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-300">{error}</p>
            </div>
          )}

          {isEmailStep ? (
            // Email collection step
            <div className="space-y-4">
              <CardTitle className="text-gray-900 dark:text-white">Let's personalize your experience</CardTitle>
              <p className="text-gray-600 dark:text-gray-300">
                First, we'd like to know a bit about your service preferences to help us recommend the best providers for you.
              </p>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-900 dark:text-white">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                We'll use this to save your preferences and send you relevant updates.
              </p>
            </div>
          ) : currentQuestionData ? (
            // Quiz question step
            <div className="space-y-6">
              <CardTitle className="text-gray-900 dark:text-white">{currentQuestionData.question}</CardTitle>
              
              {currentQuestionData.type === 'single' ? (
                <RadioGroup
                  value={answers[currentQuestionData.id] as string || ''}
                  onValueChange={handleSingleChoice}
                  className="space-y-3"
                >
                  {currentQuestionData.options.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer text-gray-900 dark:text-white">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="space-y-3">
                  {currentQuestionData.options.map((option) => {
                    const currentAnswers = answers[currentQuestionData.id] as string[] || [];
                    const isChecked = currentAnswers.includes(option);
                    
                    return (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={isChecked}
                          onCheckedChange={(checked: boolean) => 
                            handleMultipleChoice(option, checked)
                          }
                        />
                        <Label htmlFor={option} className="cursor-pointer text-gray-900 dark:text-white">
                          {option}
                        </Label>
                      </div>
                    );
                  })}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Select all that apply
                  </p>
                </div>
              )}
            </div>
          ) : null}

          {/* Navigation buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={isEmailStep ? () => router.push('/') : handlePrevious}
              disabled={submitting}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isEmailStep ? 'Back to Home' : 'Previous'}
            </Button>

            <Button
              onClick={isEmailStep ? startQuiz : handleNext}
              disabled={!canProceed() || submitting}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : isEmailStep ? (
                <>
                  Start Quiz
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              ) : isLastQuestion ? (
                'Complete Quiz'
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
