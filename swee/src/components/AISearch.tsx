'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  MapPin, 
  Clock, 
  DollarSign,
  Star,
  X,
  Minimize2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'options';
  content: string;
  options?: string[];
  recommendations?: ServiceRecommendation[];
  timestamp: Date;
}

interface ServiceRecommendation {
  id: string;
  name: string;
  category: string;
  rating: number;
  price: string;
  distance: string;
  matchScore: number;
  reasons: string[];
  image: string;
  nextAvailable: string;
}

interface AISearchProps {
  onClose: () => void;
}

export default function AISearch({ onClose }: AISearchProps) {
  const { darkMode } = useTheme();
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm Swee's AI beauty assistant. I'll help you find the perfect beauty service tailored to your needs. What brings you here today?",
      options: [
        "I need a haircut",
        "Looking for a relaxing spa day",
        "Special occasion styling",
        "Something else"
      ],
      timestamp: new Date()
    }
  ]);
  
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStage, setConversationStage] = useState<'initial' | 'details' | 'preferences' | 'recommendations'>('initial');

  const mockRecommendations: ServiceRecommendation[] = [
    {
      id: '1',
      name: 'The Hair Lounge',
      category: 'Hair & Beauty',
      rating: 4.8,
      price: '$65 - $120',
      distance: '0.8 km away',
      matchScore: 95,
      reasons: ['Specializes in your hair type', 'Highly rated for cuts', 'Anti-hard-selling verified'],
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      nextAvailable: 'Today 3:00 PM'
    },
    {
      id: '2',
      name: 'Zen Wellness Spa',
      category: 'Massage & Spa',
      rating: 4.9,
      price: '$80 - $150',
      distance: '1.2 km away',
      matchScore: 92,
      reasons: ['Perfect for relaxation', 'Transparent pricing', 'Excellent reviews'],
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      nextAvailable: 'Tomorrow 10:00 AM'
    }
  ];

  const handleOptionClick = (option: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: option,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Simulate AI processing
    setTimeout(() => {
      let aiResponse: Message;
      
      if (conversationStage === 'initial') {
        if (option === "I need a haircut") {
          aiResponse = {
            id: Date.now().toString(),
            type: 'ai',
            content: "Great! I'll help you find the perfect haircut. What's your hair type and what kind of style are you looking for?",
            options: [
              "Short and professional",
              "Long layers and styling",
              "Trendy and modern",
              "Just a trim"
            ],
            timestamp: new Date()
          };
          setConversationStage('details');
        } else if (option === "Looking for a relaxing spa day") {
          aiResponse = {
            id: Date.now().toString(),
            type: 'ai',
            content: "Perfect! A spa day sounds wonderful. What type of relaxation are you most interested in?",
            options: [
              "Full body massage",
              "Facial treatments",
              "Couples spa package",
              "Quick stress relief"
            ],
            timestamp: new Date()
          };
          setConversationStage('details');
        } else {
          aiResponse = {
            id: Date.now().toString(),
            type: 'ai',
            content: "I'd love to help! Could you tell me more about what you're looking for? Feel free to describe your ideal beauty experience.",
            timestamp: new Date()
          };
          setConversationStage('details');
        }
      } else if (conversationStage === 'details') {
        aiResponse = {
          id: Date.now().toString(),
          type: 'ai',
          content: "Excellent choice! Now let me ask a few quick questions to find the perfect match for you. What's most important to you?",
          options: [
            "Transparent pricing (no surprise costs)",
            "Close to my location",
            "Highly rated professionals",
            "Available today"
          ],
          timestamp: new Date()
        };
        setConversationStage('preferences');
      } else if (conversationStage === 'preferences') {
        aiResponse = {
          id: Date.now().toString(),
          type: 'ai',
          content: "Perfect! Based on your preferences, I've found some excellent matches for you. Here are my top recommendations:",
          recommendations: mockRecommendations,
          timestamp: new Date()
        };
        setConversationStage('recommendations');
      } else {
        aiResponse = {
          id: Date.now().toString(),
          type: 'ai',
          content: "I'm here to help you find the perfect beauty service. What else would you like to know about these recommendations?",
          timestamp: new Date()
        };
      }
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentInput,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: "I understand! Let me help you find the perfect service based on what you've shared. Would you like me to show you some personalized recommendations?",
        options: ["Yes, show me recommendations", "Tell me more about your matching process"],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className={`fixed ${isMinimized ? 'bottom-4 right-4' : 'bottom-4 right-4'} z-50 transition-all duration-300`}>
      <div className={`${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } rounded-2xl shadow-2xl border transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        } rounded-t-2xl`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-400 rounded-full flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className={isMinimized ? 'hidden' : 'block'}>
              <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Swee AI Assistant
              </h2>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Find your perfect beauty service
              </p>
            </div>
            {isMinimized && (
              <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Swee AI Assistant
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className={`w-8 h-8 ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className={`w-8 h-8 ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages - Only show when not minimized */}
        {!isMinimized && (
          <>
            <div className={`flex-1 overflow-y-auto p-4 space-y-3 h-[440px] ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start gap-2 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'user' 
                          ? 'bg-orange-500 text-white' 
                          : darkMode 
                            ? 'bg-gray-700 text-orange-400' 
                            : 'bg-orange-100 text-orange-600'
                      }`}>
                        {message.type === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                      </div>
                      <div className="flex-1">
                        <div className={`rounded-2xl p-3 text-sm ${
                          message.type === 'user' 
                            ? 'bg-orange-500 text-white' 
                            : darkMode 
                              ? 'bg-gray-700 text-gray-100' 
                              : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p>{message.content}</p>
                        </div>
                        
                        {/* Options */}
                        {message.options && (
                          <div className="mt-2 space-y-1">
                            {message.options.map((option, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleOptionClick(option)}
                                className={`w-full justify-start text-left text-xs h-8 ${
                                  darkMode 
                                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-orange-500' 
                                    : 'hover:bg-orange-50 hover:border-orange-200'
                                }`}
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        )}
                        
                        {/* Recommendations */}
                        {message.recommendations && (
                          <div className="mt-3 space-y-2">
                            {message.recommendations.map((rec) => (
                              <Card key={rec.id} className={`overflow-hidden hover:shadow-lg transition-shadow ${
                                darkMode ? 'bg-gray-700 border-gray-600' : ''
                              }`}>
                                <div className="flex">
                                  <div className="w-16 h-16 overflow-hidden flex-shrink-0">
                                    <img 
                                      src={rec.image} 
                                      alt={rec.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 p-2">
                                    <div className="flex items-start justify-between mb-1">
                                      <h3 className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {rec.name}
                                      </h3>
                                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                        {rec.matchScore}%
                                      </Badge>
                                    </div>
                                    <div className={`flex items-center gap-2 text-xs mb-1 ${
                                      darkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                      <div className="flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        <span>{rec.rating}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        <span>{rec.distance}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <div className={`flex items-center gap-1 text-xs ${
                                        darkMode ? 'text-gray-400' : 'text-gray-600'
                                      }`}>
                                        <Clock className="h-3 w-3" />
                                        <span>{rec.nextAvailable}</span>
                                      </div>
                                      <Link href={`/providers/${rec.id}`}>
                                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-xs h-6 px-2">
                                          Book
                                        </Button>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      darkMode ? 'bg-gray-700 text-orange-400' : 'bg-orange-100 text-orange-600'
                    }`}>
                      <Bot className="h-3 w-3" />
                    </div>
                    <div className={`rounded-2xl p-3 ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <div className="flex gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${
                          darkMode ? 'bg-gray-400' : 'bg-gray-400'
                        }`}></div>
                        <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${
                          darkMode ? 'bg-gray-400' : 'bg-gray-400'
                        }`} style={{ animationDelay: '0.1s' }}></div>
                        <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${
                          darkMode ? 'bg-gray-400' : 'bg-gray-400'
                        }`} style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className={`p-4 border-t ${
              darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
            } rounded-b-2xl`}>
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className={`flex-1 text-sm h-9 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <Button 
                  onClick={handleSendMessage} 
                  className="bg-orange-500 hover:bg-orange-600 h-9 w-9 p-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
