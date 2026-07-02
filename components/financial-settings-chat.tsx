"use client"

import type React from "react"

import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area" // Added ScrollBar
import { Send, Bot, User, Settings, Zap, FileQuestion, AlertTriangleIcon } from "lucide-react" // Added user management icons
import { cn } from "@/lib/utils"

interface SuggestedPrompt {
  id: string
  text: string
  icon: React.ElementType
  action?: () => void // For direct actions like scrolling
  sectionId?: string // To link to a settings section
}

interface FinancialSettingsChatProps {
  scrollToSection?: (sectionId: string) => void
  title?: string
  customSuggestedPrompts?: SuggestedPrompt[]
}

export function FinancialSettingsChat({
  scrollToSection,
  title = "Policy AI Assistant", // Default title
  customSuggestedPrompts,
}: FinancialSettingsChatProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: "/api/chat",
  })

  const suggestedPrompts: SuggestedPrompt[] = [
    {
      id: "sp1",
      text: "What are Advance Rates?",
      icon: Settings,
      sectionId: "advanceRates",
    },
    {
      id: "sp2",
      text: "How to add a High-Risk Industry?",
      icon: AlertTriangleIcon,
      sectionId: "highRiskIndustries",
    },
    {
      id: "sp3",
      text: "What are Product Settings?",
      icon: Zap,
      sectionId: "productSettings",
    },
    {
      id: "sp4",
      text: "Summarize Document Requirements",
      icon: FileQuestion, // Keep this icon or choose another generic one
      sectionId: "documentRequirements",
    },
  ]

  const handleSuggestedPromptClick = (prompt: SuggestedPrompt) => {
    setInput(prompt.text) // Set the input field with the prompt text
    // Optionally, immediately submit or let user edit then submit
    // handleSubmit(); // Uncomment to auto-submit

    if (prompt.sectionId && scrollToSection) {
      scrollToSection(prompt.sectionId)
    }
  }

  const displayPrompts = customSuggestedPrompts || suggestedPrompts

  return (
    <div className="flex flex-col h-full bg-gray-50 border-r">
      <div className="p-4 border-b bg-white">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500">Ask about settings or request guidance.</p>
      </div>
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={cn("flex items-start space-x-3", m.role === "user" ? "justify-end" : "")}>
              {m.role === "assistant" && (
                <div className="p-2 bg-primary text-primary-foreground rounded-full shadow">
                  <Bot className="h-5 w-5" />
                </div>
              )}
              <div
                className={cn(
                  "p-3 rounded-lg max-w-xs lg:max-w-md shadow-sm",
                  m.role === "user" ? "bg-primary text-primary-foreground self-end" : "bg-white text-foreground border",
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{m.content}</p>
              </div>
              {m.role === "user" && (
                <div className="p-2 bg-gray-200 text-gray-700 rounded-full shadow">
                  <User className="h-5 w-5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-white space-y-3">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-2 pb-2">
            {displayPrompts.map((prompt) => (
              <Button
                key={prompt.id}
                variant="outline"
                size="sm"
                className="text-xs justify-start h-auto py-1.5 px-2 bg-gray-100 hover:bg-gray-200 text-gray-700 flex-shrink-0"
                onClick={() => handleSuggestedPromptClick(prompt)}
              >
                <prompt.icon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                {prompt.text}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Message Policy AI Assistant..."
            className="flex-grow focus:ring-primary focus:border-primary"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading} className="bg-primary hover:bg-primary/90">
            <Send className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
