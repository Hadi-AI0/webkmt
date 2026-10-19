/**
 * Simple Chatbot Widget
 * Glassmorphism-themed chat assistant for customer support
 */

class ChatBot {
  constructor() {
    this.isOpen = false;
    this.isTyping = false;
    this.conversation = [];
    this.currentLanguage = 'en';
    this.contextWindow = 10;
    this.authManager = null;
    
    this.companyContext = this.getCompanyContext();
    
    this.init();
  }

  /**
   * Get API key from environment or config
   */
  // API key is no longer needed on client-side - using secure server proxy
  getApiKey() {
    return null; // Not needed - using server proxy
  }

  /**
   * Get comprehensive company context for AI
   */
  getCompanyContext() {
    return {
      company: {
        name: "WebKMT",
        tagline: "We Build the Software Your Business Runs On",
        description: "We are a software solutions agency focused on providing companies with scalable and robust solutions: Web & Mobile Apps, Custom AI Tools, CRM/ERP (like Odoo alternatives), POS systems, Automation Pipelines, and internal tools.",
        location: "Global Remote",
        phone: "+90 501 361 77 95",
        whatsapp: "+90 501 361 77 95",
        email: "hello@webkmt.com",
        website: "https://webkmt.com",
      },
      services: {
        web_and_mobile_apps: {
          name: "Web & Mobile Apps",
          description: "High-performance applications tailored to your business operations."
        },
        custom_ai_tools: {
          name: "Custom AI Tools",
          description: "Dedicated custom AI tools designed to streamline your workflows."
        },
        crm_erp: {
          name: "CRM & ERP Systems",
          description: "Custom built alternatives to bloated systems like Odoo, tailored exactly to what you need."
        },
        pos_systems: {
          name: "POS Systems",
          description: "Point of sale software designed for retail and hospitality."
        },
        automation: {
          name: "Automation Pipelines",
          description: "Connecting your existing tools to eliminate manual data entry and save hours daily."
        },
        internal_tools: {
          name: "Internal Tools",
          description: "Custom dashboards and admin panels for your team."
        },
        optimization: {
          name: "System Optimization",
          description: "Refactoring and accelerating your existing software systems."
        },
        consulting: {
          name: "Tech Consulting",
          description: "Guiding your technology choices and digital strategy."
        }
      },
      pricing: "All projects are custom-scoped based on your exact requirements. We focus on ROI and efficiency. Users should be directed to discuss their project for an accurate quote.",
      process: "We focus on software engineering delivery: Discovery -> Architecture -> Development -> Deployment -> Support."
    };
  }

  /**
   * Initialize chatbot
   */
  async init() {
    console.log('🤖 Initializing ChatBot...');
    
    this.createChatbotHTML();
    this.bindEvents();
    this.setupLanguageDetection();
    this.loadConversationHistory();
    
    // Wait for auth manager to be available
    await this.waitForAuthManager();
    
    console.log('🤖 Chatbot initialized with secure AI capabilities');
    
    console.log('✅ ChatBot initialization complete');
  }

  /**
   * Wait for authentication manager to be available
   */
  async waitForAuthManager() {
    let attempts = 0;
    const maxAttempts = 50;
    
    while (!window.authManager && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    if (window.authManager) {
      this.authManager = window.authManager;
      console.log('🔐 Chatbot connected to auth manager');
    } else {
      console.warn('⚠️ Auth manager not available for chatbot');
    }
  }

  /**
   * Create chatbot HTML structure
   */
  createChatbotHTML() {
    const chatbotHTML = `
      <div class="chatbot-container">
        <!-- Floating Action Button -->
        <button class="chatbot-fab" aria-label="Open chat">
          <i data-lucide="message-circle" class="chatbot-fab-icon"></i>
          <div class="chatbot-notification">1</div>
        </button>

        <!-- Chat Window -->
        <div class="chatbot-window glass-card" style="position: absolute; bottom: 4rem; right: 0; width: 380px; height: 480px; background: var(--bg-glass-card); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 16px; box-shadow: 0 16px 64px rgba(0, 0, 0, 0.2); display: none; flex-direction: column; overflow: hidden; transform: scale(0.95) translateY(10px); opacity: 0; transition: all 300ms ease;">
          <!-- Header -->
          <div class="chatbot-header" style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div class="chatbot-avatar" style="width: 32px; height: 32px; background: var(--color-primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600;">AI</div>
              <div class="chatbot-info">
                <h3 class="chatbot-title" style="margin: 0; font-size: 1rem; font-weight: 600; color: var(--text-primary);">Kemet</h3>
                <div class="chatbot-status" style="display: flex; align-items: center; gap: 0.5rem;">
                  <div class="status-indicator" style="width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></div>
                  <span style="font-size: 0.75rem; color: #10b981;">Online</span>
                </div>
              </div>
            </div>
            <button class="chatbot-close" aria-label="Close chat" style="padding: 0.5rem; background: rgba(255, 255, 255, 0.1); border: none; border-radius: 6px; color: var(--text-secondary); cursor: pointer; transition: all 200ms ease;">
              <i data-lucide="x" width="16" height="16"></i>
            </button>
          </div>

          <!-- Messages Area -->
          <div class="chatbot-messages" style="flex: 1; padding: 1rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem;">
            <div class="welcome-message" style="text-align: center; padding: 2rem 1rem; color: var(--text-secondary);">
              <h4 class="welcome-title" style="margin: 0 0 0.5rem 0; font-size: 1.1rem; color: var(--text-primary);">Welcome to WebKMT!</h4>
              <p class="welcome-subtitle" style="margin: 0; font-size: 0.875rem;">How can I help you today?</p>
            </div>
          </div>

          <!-- Input Area -->
          <div class="chatbot-input-area" style="padding: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.1);">
            <div class="chatbot-input-group" style="display: flex; gap: 0.5rem;">
              <input 
                type="text"
                class="chatbot-input" 
                placeholder="Type your message..." 
                style="flex: 1; padding: 0.75rem 1rem; background: var(--bg-glass-subtle); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 20px; color: var(--text-primary); font-size: 0.875rem;"
              />
              <button class="chatbot-send-btn" disabled style="padding: 0.75rem; background: var(--color-primary); border: none; border-radius: 50%; color: white; cursor: pointer; transition: all 200ms ease; opacity: 0.5;">
                <i data-lucide="send" class="chatbot-send-icon" width="20" height="20"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    console.log('🎨 Chatbot HTML added to page');
    
    // Initialize Lucide icons for chatbot
    if (window.lucide) {
      window.lucide.createIcons();
    }
    
    // Get DOM elements
    this.fab = document.querySelector('.chatbot-trigger');
    this.window = document.querySelector('.chatbot-widget');
    this.closeBtn = document.querySelector('.chatbot-close');
    this.messagesArea = document.querySelector('.chatbot-messages');
    this.input = document.querySelector('.chatbot-input');
    this.sendBtn = document.querySelector('.chatbot-send-btn');
    this.quickActions = document.querySelectorAll('.quick-action-btn');
    this.notification = document.querySelector('.chatbot-notification');

    // Verify elements found
    if (!this.fab) console.warn('⚠️ Chatbot trigger not found');
    if (!this.window) console.warn('⚠️ Chatbot widget not found');
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    console.log('🔗 Binding chatbot events...', {
      fab: !!this.fab,
      closeBtn: !!this.closeBtn,
      sendBtn: !!this.sendBtn,
      input: !!this.input
    });
    
    // FAB click
    if (this.fab) {
      this.fab.addEventListener('click', (e) => {
        console.log('🤖 ChatBot opened');
        e.preventDefault();
        this.toggleChat();
      });
    }
    
    // Close button click
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => {
        console.log('🤖 ChatBot close clicked');
        this.closeChat();
      });
    }
    
    // Send button click  
    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('🤖 ChatBot send clicked');
        this.sendMessage();
      });
    }
    
    // Input events
    if (this.input) {
      this.input.addEventListener('input', () => this.handleInputChange());
      this.input.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }
    
    // Quick action buttons
    this.quickActions?.forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        this.handleQuickAction(action);
      });
    });
    
    // Click outside to close
    document.addEventListener('click', (e) => {
      if (this.isOpen && !e.target.closest('.chatbot-container')) {
        this.closeChat();
      }
    });
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeChat();
      }
    });
  }

  /**
   * Setup language detection
   */
  setupLanguageDetection() {
    // Get current language from language manager
    this.updateLanguage();
    
    // Listen for language changes
    document.addEventListener('languageChanged', (e) => {
      this.currentLanguage = e.detail.language;
      this.updateLanguage();
    });
  }

  /**
   * Update chatbot language
   */
  updateLanguage() {
    if (window.languageManager) {
      this.currentLanguage = window.languageManager.getCurrentLanguage();
    }
  }

  /**
   * Toggle chat window
   */
  toggleChat() {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  /**
   * Open chat window
   */
  openChat() {
    this.isOpen = true;
    this.notification?.style.setProperty('display', 'none');

    if (this.window) {
      this.window.classList.add('active');
    }
    
    // Focus input
    setTimeout(() => {
      this.input?.focus();
    }, 300);
    
    // Show welcome message if no conversation
    if (this.conversation.length === 0) {
      this.showWelcomeMessage();
    }
  }

  /**
   * Close chat window
   */
  closeChat() {
    this.isOpen = false;

    if (this.window) {
      this.window.classList.remove('active');
    }
    
    this.input?.blur();
  }

  /**
   * Handle input change
   */
  handleInputChange() {
    const value = this.input?.value?.trim();
    if (this.sendBtn) {
      this.sendBtn.disabled = !value;
      this.sendBtn.style.opacity = value ? '1' : '0.5';
    }
  }

  /**
   * Handle key down in input
   */
  handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.sendMessage();
    }
  }

  /**
   * Send message
   */
  async sendMessage() {
    const message = this.input?.value?.trim();
    if (!message || this.isTyping) return;

    // Clear input
    this.input.value = '';
    this.sendBtn.disabled = true;

    // Add user message
    this.addMessage(message, 'user');
    
    // Show typing indicator
    this.showTypingIndicator();
    
    try {
      // Check for lead capture (email)
      this.extractAndSaveLead(message);

      // Get AI response
      const response = await this.getAIResponse(message);
      this.hideTypingIndicator();
      this.addMessage(response, 'bot');
    } catch (error) {
      console.error('Chat error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      this.hideTypingIndicator();
      this.addMessage(this.getFallbackResponse(), 'bot');
    }
  }

  /**
   * Extract email and save lead
   */
  async extractAndSaveLead(message) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const match = message.match(emailRegex);
    
    if (match && !this.leadCaptured) {
      const email = match[0];
      this.leadCaptured = true; // Prevent duplicate submissions in same session
      
      try {
        const contextStr = this.buildContext();
        await fetch('/api/contact/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Chatbot Lead',
            email: email,
            message: `Lead captured via Chatbot. Conversation context:\n\n${contextStr}`,
            subject: 'Chatbot Inquiry',
            service: 'general'
          })
        });
        console.log('✅ Chatbot lead captured and saved to Supabase');
      } catch (error) {
        console.error('Failed to save chatbot lead:', error);
      }
    }
  }

  /**
   * Handle quick action buttons
   */
  handleQuickAction(action) {
    let message = '';
    
    switch (action) {
      case 'schedule_call':
        message = this.getTranslation('chatbot.quick_actions.schedule_call') || 
                 'I would like to schedule a call to discuss my project.';
        break;
      case 'get_quote':
        message = this.getTranslation('chatbot.quick_actions.get_quote') || 
                 'I would like to get a quote for my project.';
        break;
      case 'view_portfolio':
        message = this.getTranslation('chatbot.quick_actions.view_portfolio') || 
                 'Can you show me some examples of your work?';
        break;
    }
    
    if (message) {
      this.input.value = message;
      this.sendMessage();
    }
  }

  /**
   * Add message to chat
   */
  addMessage(text, sender, timestamp = new Date()) {
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const isBot = sender === 'bot';
    const messageHTML = `
      <div class="message ${sender}" data-message-id="${messageId}" style="display: flex; gap: 0.75rem; align-items: flex-start; ${!isBot ? 'flex-direction: row-reverse;' : ''}">
        <div class="message-avatar" style="width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.875rem; flex-shrink: 0; ${isBot ? 'background: var(--bg-glass-subtle);' : 'background: var(--color-primary); color: white;'}">
          ${isBot ? 'AI' : (this.currentLanguage === 'ar' ? 'أ' : 'U')}
        </div>
        <div class="message-content" style="flex: 1; max-width: 280px;">
          <div class="message-bubble" style="padding: 0.75rem 1rem; border-radius: 16px; font-size: 0.875rem; line-height: 1.4; color: var(--text-primary); ${isBot ? 'background: var(--bg-glass-subtle); border-radius: 4px 16px 16px 16px;' : 'background: var(--color-primary); color: white; border-radius: 16px 4px 16px 16px;'}">${this.formatMessage(text)}</div>
          <div class="message-time" style="font-size: 0.75rem; color: var(--text-tertiary); margin-top: 0.25rem; ${!isBot ? 'text-align: left;' : 'text-align: right;'}">${this.formatTime(timestamp)}</div>
        </div>
      </div>
    `;
    
    // Remove welcome message if it exists
    const welcomeMessage = this.messagesArea?.querySelector('.welcome-message');
    if (welcomeMessage) {
      welcomeMessage.remove();
    }
    
    this.messagesArea?.insertAdjacentHTML('beforeend', messageHTML);
    this.scrollToBottom();
    
    // Add to conversation history
    this.conversation.push({
      id: messageId,
      text,
      sender,
      timestamp: timestamp.toISOString()
    });
    
    // Limit conversation history
    if (this.conversation.length > this.contextWindow * 2) {
      this.conversation = this.conversation.slice(-this.contextWindow * 2);
    }
    
    // Save to localStorage
    this.saveConversationHistory();
  }

  /**
   * Format message text
   */
  formatMessage(text) {
    // Convert line breaks to <br>
    return text.replace(/\n/g, '<br>');
  }

  /**
   * Format timestamp
   */
  formatTime(timestamp) {
    return timestamp.toLocaleTimeString(this.currentLanguage === 'ar' ? 'ar-EG' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Show typing indicator
   */
  showTypingIndicator() {
    if (this.isTyping) return;
    
    this.isTyping = true;
    const typingHTML = `
      <div class="message bot typing-message">
        <div class="message-avatar">AI</div>
        <div class="message-content">
          <div class="typing-indicator">
            <span>${this.getTranslation('chatbot.typing') || 'AI is typing'}</span>
            <div class="typing-dots">
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.messagesArea?.insertAdjacentHTML('beforeend', typingHTML);
    this.scrollToBottom();
  }

  /**
   * Hide typing indicator
   */
  hideTypingIndicator() {
    this.isTyping = false;
    const typingMessage = this.messagesArea?.querySelector('.typing-message');
    if (typingMessage) {
      typingMessage.remove();
    }
  }

  /**
   * Scroll to bottom of messages
   */
  scrollToBottom() {
    if (this.messagesArea) {
      this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
    }
  }

  /**
   * Get AI response from Gemini API
   */
  async getAIResponse(userMessage) {
    try {
      const context = this.buildContext();
      const prompt = this.buildPrompt(userMessage, context);
      
      // Use secure server-side proxy endpoint
      const response = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          options: {
            temperature: 0.7,
            maxTokens: 500,
            topP: 0.8,
            topK: 40
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.text) {
        return data.text;
      } else {
        throw new Error(data.error || 'Invalid response format');
      }
    } catch (error) {
      console.error('AI Chat error:', error);
      throw error; // Let the calling function handle the fallback
    }
  }

  /**
   * Build conversation context
   */
  buildContext() {
    return this.conversation
      .slice(-this.contextWindow)
      .map(msg => `${msg.sender}: ${msg.text}`)
      .join('\n');
  }

  /**
   * Build prompt for AI
   */
  buildPrompt(userMessage, context) {
    const language = this.currentLanguage === 'ar' ? 'Arabic' : 'English';
    const userInfo = this.getUserInfo();
    const companyData = JSON.stringify(this.companyContext, null, 2);
    
    return `You are Kemet, WebKMT's AI sales assistant. Your job is:
1. Understand what the visitor's business actually needs
2. Map their needs to WebKMT's services
3. Qualify them (what they want to build, their timeline, budget range)
4. Collect their name and email before going deep into any quote
5. End every meaningful conversation with a clear next step (WhatsApp / quote form)

COMPANY DATA (Use this information to answer questions):
${companyData}

USER CONTEXT:
${userInfo}

CONVERSATION HISTORY:
${context}

INSTRUCTIONS:
1. Respond in ${language} language
2. Be conversational but professional - act like an expert consultant
3. Never invent case studies or results — only speak from company context provided
4. If a visitor describes a need, ask a follow-up before proposing a solution
5. Collect: name → what they want to build → timeline → budget range → email
6. Once email is collected, confirm you'll pass it to the team
7. Keep replies under 150 words
8. Never say you are ChatGPT or any other AI — you are Kemet

Current user message: ${userMessage}

Please provide a helpful, intelligent response that demonstrates your expertise and moves the conversation toward qualifying the lead:`;
  }

  /**
   * Get user information for context
   */
  getUserInfo() {
    if (this.authManager && this.authManager.isLoggedIn()) {
      const user = this.authManager.getUser();
      return `User is authenticated as: ${user.displayName || user.email || 'User'}`;
    }
    return 'User is not authenticated (anonymous visitor)';
  }

  /**
   * Get company information for AI context
   */
  getCompanyInfo() {
    return `WebKMT is a software solutions agency that delivers robust digital solutions for modern businesses. 

Services offered:
- Web & Mobile Apps: Custom high-performance applications
- Custom AI Tools: Dedicated custom AI tools to streamline workflows
- CRM & ERP Systems: Custom built alternatives to bloated systems like Odoo
- POS Systems: Point of sale software designed for retail and hospitality
- Automation Pipelines: Connecting tools to eliminate manual data entry
- Internal Tools: Custom dashboards and admin panels
- System Optimization: Refactoring and accelerating existing systems
- Tech Consulting: Guiding technology choices and digital strategy

Contact Information:
- WhatsApp/Phone: +90 501 361 77 95
- Email: hello@webkmt.com
- Location: Global Remote

For project quotes, scheduling calls, or detailed consultations, users should be directed to discuss their project for an accurate quote.`;
  }

  /**
   * Get fallback responses when API fails
   */
  getFallbackResponse() {
    const fallbacks = {
      en: [
        "I'm sorry, I'm having trouble connecting right now. Please try contacting our team directly at info@webkmt.com or WhatsApp +90 501 361 77 95.",
        "Thanks for your message! While I'm experiencing some technical difficulties, our team would be happy to help you. Please reach out to us at info@webkmt.com.",
        "I apologize for the inconvenience. For immediate assistance, please contact our team via WhatsApp at +90 501 361 77 95 or visit our contact page.",
        "Our team is ready to help you with your project! Please contact us directly at info@webkmt.com for personalized assistance."
      ],
      ar: [
        "أعتذر، أواجه صعوبة في الاتصال الآن. يرجى التواصل مع فريقنا مباشرة على info@webkmt.com أو واتساب +90 501 361 77 95.",
        "شكراً لرسالتك! بينما أواجه بعض الصعوبات التقنية، فريقنا سيكون سعيداً لمساعدتك. يرجى التواصل معنا على info@webkmt.com.",
        "أعتذر عن الإزعاج. للحصول على مساعدة فورية، يرجى الاتصال بفريقنا عبر واتساب +90 501 361 77 95 أو زيارة صفحة اتصل بنا.",
        "فريقنا جاهز لمساعدتك في مشروعك! يرجى الاتصال بنا مباشرة على info@webkmt.com للحصول على مساعدة شخصية."
      ]
    };

    const responses = fallbacks[this.currentLanguage] || fallbacks.en;
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Show welcome message
   */
  showWelcomeMessage() {
    const welcomeMessages = {
      en: "Hi! I'm Kemet, WebKMT's assistant. Are you looking to build something new, improve an existing system, or just exploring what's possible?",
      ar: "مرحباً! أنا كيميت، مساعد ويب كيميت. هل تبحث عن بناء نظام جديد، أو تحسين نظام حالي، أم أنك فقط تستكشف ما يمكننا تقديمه؟"
    };
    
    const message = welcomeMessages[this.currentLanguage] || welcomeMessages.en;
    
    setTimeout(() => {
      this.addMessage(message, 'bot');
    }, 1000);
  }

  /**
   * Get translation helper
   */
  getTranslation(key) {
    if (window.languageManager) {
      return window.languageManager.getTranslation(key);
    }
    return null;
  }

  /**
   * Save conversation history
   */
  saveConversationHistory() {
    try {
      const history = {
        conversation: this.conversation.slice(-20),
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('chatbot_history', JSON.stringify(history));
    } catch (error) {
      console.warn('Failed to save conversation history:', error);
    }
  }

  /**
   * Load conversation history
   */
  loadConversationHistory() {
    try {
      const historyData = localStorage.getItem('chatbot_history');
      if (historyData) {
        const history = JSON.parse(historyData);
        
        const historyDate = new Date(history.timestamp);
        const today = new Date();
        const isToday = historyDate.toDateString() === today.toDateString();
        
        if (isToday && history.conversation) {
          this.conversation = history.conversation;
          
          if (this.conversation.length > 0) {
            this.recreateMessages();
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load conversation history:', error);
    }
  }

  /**
   * Recreate messages from history
   */
  recreateMessages() {
    const welcomeMessage = this.messagesArea?.querySelector('.welcome-message');
    if (welcomeMessage) {
      welcomeMessage.remove();
    }
    
    this.conversation.forEach(msg => {
      const timestamp = new Date(msg.timestamp);
      this.addMessageToUI(msg.text, msg.sender, timestamp);
    });
  }

  /**
   * Add message to UI only
   */
  addMessageToUI(text, sender, timestamp) {
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const messageHTML = `
      <div class="message ${sender}" data-message-id="${messageId}">
        <div class="message-avatar">
          ${sender === 'bot' ? 'AI' : (this.currentLanguage === 'ar' ? 'أ' : 'U')}
        </div>
        <div class="message-content">
          <div class="message-bubble">${this.formatMessage(text)}</div>
          <div class="message-time">${this.formatTime(timestamp)}</div>
        </div>
      </div>
    `;
    
    this.messagesArea?.insertAdjacentHTML('beforeend', messageHTML);
  }

  clearConversation() {
    this.conversation = [];
    this.messagesArea.innerHTML = '';
    this.showWelcomeMessage();
    localStorage.removeItem('chatbot_history');
  }

  // API key management no longer needed - using secure server proxy
  isReady() {
    return true; // Always ready with secure server proxy
  }

  getStatus() {
    return {
      isOpen: this.isOpen,
      isTyping: this.isTyping,
      isReady: true,
      conversationLength: this.conversation.length,
      currentLanguage: this.currentLanguage
    };
  }

  destroy() {
    const container = document.querySelector('.chatbot-container');
    if (container) {
      container.remove();
    }
    this.conversation = [];
  }
}

/**
 * Initialize chatbot
 */
function initChatbot() {
  console.log('🚀 Starting chatbot initialization...');
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('📄 DOM loaded, creating ChatBot...');
      window.chatbot = new ChatBot();
    });
  } else {
    console.log('📄 DOM already loaded, creating ChatBot...');
    window.chatbot = new ChatBot();
  }
}

// Auto-initialize
initChatbot();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChatBot;
}
