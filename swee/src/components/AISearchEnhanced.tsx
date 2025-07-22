'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
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
  Minimize2,
  Shield,
  Award,
  Loader2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';

interface AIMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  loading?: boolean;
}

interface UserContext {
  name: string;
  points: number;
  level: string;
}

interface AISearchEnhancedProps {
  onClose: () => void;
}

export default function AISearchEnhanced({ onClose }: AISearchEnhancedProps) {
  const { data: session } = useSession();
  const { darkMode } = useTheme();
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [proactiveSuggestions, setProactiveSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load initial context and proactive suggestions
  useEffect(() => {
    if (session?.user) {
      loadInitialData();
    }
  }, [session]);

  const loadInitialData = async () => {
    try {
      // Load proactive suggestions
      const suggestionsResponse = await fetch('/api/ai/chat');
      if (suggestionsResponse.ok) {
        const data = await suggestionsResponse.json();
        if (data.success) {
          setProactiveSuggestions(data.suggestions);
          setUserContext(data.userContext);
          
          // Create initial greeting
          const greeting = data.suggestions.length > 0 
            ? `Hi ${data.userContext.name}! 👋 I've been thinking about your beauty routine. ${data.suggestions[0]}`
            : `Hi ${data.userContext.name}! 👋 I'm your personal beauty booking assistant. I know all about your preferences and booking history. How can I help you today?`;
            
          setMessages([{
            id: '1',
            type: 'ai',
            content: greeting,
            timestamp: new Date(),
            suggestions: data.suggestions.length > 1 ? data.suggestions.slice(1) : [
              "Show me my booking history",
              "Find services matching my preferences", 
              "Check my points and rewards",
              "Recommend something new"
            ]
          }]);
        }
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      setMessages([{
        id: '1',
        type: 'ai',
        content: "Hi! I'm Swee's AI assistant. I'm having trouble accessing your profile right now, but I can still help you find great beauty services. What are you looking for today?",
        timestamp: new Date(),
        suggestions: [
          "Help me find a hair salon",
          "I need a facial treatment",
          "Show me nail services",
          "Find something within my budget"
        ]
      }]);
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          conversationHistory: messages.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      if (data.success) {
        // Update user context if provided
        if (data.userContext) {
          setUserContext(data.userContext);
        }

        const aiMessage: AIMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: data.response,
          timestamp: new Date(),
          suggestions: generateContextualSuggestions(data.response, data.suggestedActions)
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm having trouble connecting right now. Let me try to help you based on what I know. What type of service are you looking for?",
        timestamp: new Date(),
        suggestions: [
          "Find a hair salon near me",
          "Book a facial appointment",
          "Show me highly rated providers",
          "Help me with something else"
        ]
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateContextualSuggestions = (response: string, suggestedActions?: any[]): string[] => {
    const suggestions: string[] = [];
    
    if (response.toLowerCase().includes('trust score')) {
      suggestions.push("Tell me more about trust scores");
    }
    
    if (response.toLowerCase().includes('book') || response.toLowerCase().includes('appointment')) {
      suggestions.push("Check availability");
      suggestions.push("Compare other options");
    }
    
    if (response.toLowerCase().includes('points') || response.toLowerCase().includes('reward')) {
      suggestions.push("How can I earn more points?");
    }
    
    // Default suggestions if none generated
    if (suggestions.length === 0) {
      suggestions.push("Tell me more", "Find similar services", "What else can you help with?");
    }
    
    return suggestions;
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleSendMessage = () => {
    if (currentInput.trim()) {
      sendMessage(currentInput);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
              <div className="flex items-center gap-2">
                {userContext && (
                  <>
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {userContext.name}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      <Award className="h-3 w-3 mr-1" />
                      {userContext.points}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {userContext.level}
                    </Badge>
                  </>
                )}
              </div>
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
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 h-[440px] ${
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
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                        
                        {/* Suggestions */}
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className={`w-full justify-start text-left text-xs h-8 ${
                                  darkMode 
                                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-orange-500' 
                                    : 'hover:bg-orange-50 hover:border-orange-200'
                                }`}
                              >
                                {suggestion}
                              </Button>
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
                      <div className="flex gap-1 items-center">
                        <Loader2 className="h-3 w-3 animate-spin text-orange-500" />
                        <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`p-4 border-t ${
              darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
            } rounded-b-2xl`}>
              <div className="flex gap-2">
                <Input
                  placeholder="Ask me about bookings, recommendations, or your preferences..."
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={`flex-1 text-sm h-9 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                  disabled={isTyping}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!currentInput.trim() || isTyping}
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