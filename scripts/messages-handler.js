the// Message handling class
class MessagesHandler {
    constructor() {
        this.currentUser = null;
        this.conversations = [];
        this.currentConversation = null;
        this.messageListeners = new Set();
        this.initializeUI();
    }

    // Initialize UI elements and event listeners
    initializeUI() {
        // UI Elements
        this.conversationsList = document.querySelector('.conversations-list');
        this.chatMessages = document.querySelector('.chat-messages');
        this.messageInput = document.querySelector('.chat-input input');
        this.sendButton = document.querySelector('.chat-input .send');
        this.searchInput = document.querySelector('.messages-search input');
        this.newMessageButton = document.querySelector('.btn-new-message');

        // Event Listeners
        this.sendButton?.addEventListener('click', () => this.sendMessage());
        this.messageInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        this.searchInput?.addEventListener('input', (e) => this.searchConversations(e.target.value));
        this.newMessageButton?.addEventListener('click', () => this.showNewMessageDialog());
    }

    // Set current user data
    setCurrentUser(userData) {
        this.currentUser = userData;
        // Update UI with user data
        this.updateUserUI();
    }

    // Load conversations from database (to be implemented)
    async loadConversations() {
        try {
            // TODO: Replace with actual API call
            const response = await this.mockFetchConversations();
            this.conversations = response;
            this.renderConversations();
        } catch (error) {
            console.error('Error loading conversations:', error);
            this.showError('Failed to load conversations');
        }
    }

    // Render conversations in the sidebar
    renderConversations() {
        if (!this.conversationsList) return;
        
        this.conversationsList.innerHTML = this.conversations
            .map(conv => this.createConversationHTML(conv))
            .join('');

        // Add click listeners to conversation items
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', () => {
                const convId = item.dataset.conversationId;
                this.loadConversation(convId);
            });
        });
    }

    // Create HTML for a conversation item
    createConversationHTML(conversation) {
        const lastMessage = conversation.lastMessage || {};
        const time = this.formatTime(lastMessage.timestamp);
        
        return `
            <div class="conversation-item" data-conversation-id="${conversation.id}">
                <div class="conversation-avatar">
                    <img src="${conversation.avatar || 'image/default-avatar.jpg'}" 
                         alt="${conversation.name}">
                    <span class="status-dot ${conversation.online ? 'online' : ''}"></span>
                </div>
                <div class="conversation-content">
                    <div class="conversation-info">
                        <h4>${conversation.name}</h4>
                        <span class="time">${time}</span>
                    </div>
                    <p class="last-message">${lastMessage.content || 'No messages yet'}</p>
                </div>
            </div>
        `;
    }

    // Load and display a specific conversation
    async loadConversation(conversationId) {
        try {
            // TODO: Replace with actual API call
            const messages = await this.mockFetchMessages(conversationId);
            this.currentConversation = conversationId;
            this.renderMessages(messages);
            this.updateConversationUI(conversationId);
        } catch (error) {
            console.error('Error loading conversation:', error);
            this.showError('Failed to load messages');
        }
    }

    // Render messages in the chat area
    renderMessages(messages) {
        if (!this.chatMessages) return;

        let currentDate = '';
        let messageHTML = '';

        messages.forEach(message => {
            const messageDate = this.formatDate(message.timestamp);
            
            if (messageDate !== currentDate) {
                messageHTML += this.createDateSeparator(messageDate);
                currentDate = messageDate;
            }

            messageHTML += this.createMessageHTML(message);
        });

        this.chatMessages.innerHTML = messageHTML;
        this.scrollToBottom();
    }

    // Create HTML for a message
    createMessageHTML(message) {
        const isSent = message.senderId === this.currentUser?.id;
        const time = this.formatMessageTime(message.timestamp);

        return `
            <div class="message-group ${isSent ? 'sent' : 'received'}">
                <div class="message">
                    <p>${message.content}</p>
                    <span class="time">${time}</span>
                </div>
            </div>
        `;
    }

    // Send a new message
    async sendMessage() {
        if (!this.messageInput || !this.currentConversation) return;

        const content = this.messageInput.value.trim();
        if (!content) return;

        try {
            // TODO: Replace with actual API call
            const message = {
                id: Date.now().toString(),
                content,
                senderId: this.currentUser?.id,
                timestamp: new Date().toISOString(),
                conversationId: this.currentConversation
            };

            // Optimistic UI update
            this.addMessageToUI(message);
            this.messageInput.value = '';

            // TODO: Send to backend
            await this.mockSendMessage(message);
        } catch (error) {
            console.error('Error sending message:', error);
            this.showError('Failed to send message');
        }
    }

    // Add a new message to the UI
    addMessageToUI(message) {
        if (!this.chatMessages) return;

        const messageDate = this.formatDate(message.timestamp);
        const lastDateSeparator = this.chatMessages.querySelector('.date-separator:last-child');
        
        if (!lastDateSeparator || lastDateSeparator.textContent !== messageDate) {
            this.chatMessages.insertAdjacentHTML('beforeend', this.createDateSeparator(messageDate));
        }

        this.chatMessages.insertAdjacentHTML('beforeend', this.createMessageHTML(message));
        this.scrollToBottom();
        this.updateLastMessage(message);
    }

    // Update the last message in conversation list
    updateLastMessage(message) {
        const conversationItem = document.querySelector(`[data-conversation-id="${message.conversationId}"]`);
        if (!conversationItem) return;

        const lastMessageEl = conversationItem.querySelector('.last-message');
        const timeEl = conversationItem.querySelector('.time');

        if (lastMessageEl) lastMessageEl.textContent = message.content;
        if (timeEl) timeEl.textContent = this.formatTime(message.timestamp);
    }

    // Search conversations
    searchConversations(query) {
        const normalizedQuery = query.toLowerCase();
        const items = document.querySelectorAll('.conversation-item');

        items.forEach(item => {
            const name = item.querySelector('h4').textContent.toLowerCase();
            const lastMessage = item.querySelector('.last-message').textContent.toLowerCase();
            const matches = name.includes(normalizedQuery) || lastMessage.includes(normalizedQuery);
            item.style.display = matches ? 'flex' : 'none';
        });
    }

    // Utility functions
    formatDate(timestamp) {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    formatMessageTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return this.formatMessageTime(timestamp);
        } else if (days === 1) {
            return 'Yesterday';
        } else if (days < 7) {
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    }

    scrollToBottom() {
        if (this.chatMessages) {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }

    showError(message) {
        // TODO: Implement proper error handling UI
        console.error(message);
    }

    // Mock API calls (to be replaced with real API calls)
    async mockFetchConversations() {
        return [
            {
                id: '1',
                name: 'Sarah Johnson',
                avatar: 'image/default-avatar.jpg',
                online: true,
                lastMessage: {
                    content: 'Thanks for the feedback on my project!',
                    timestamp: new Date().toISOString()
                }
            },
            {
                id: '2',
                name: 'Mike Chen',
                avatar: 'image/default-avatar.jpg',
                online: false,
                lastMessage: {
                    content: 'When can we schedule our next session?',
                    timestamp: new Date(Date.now() - 3600000).toISOString()
                }
            }
        ];
    }

    async mockFetchMessages(conversationId) {
        return [
            {
                id: '1',
                content: 'Hi! Thanks for reviewing my project proposal!',
                senderId: '2',
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                conversationId
            },
            {
                id: '2',
                content: "You're welcome! Your proposal was well-structured.",
                senderId: this.currentUser?.id,
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                conversationId
            }
        ];
    }

    async mockSendMessage(message) {
        return new Promise(resolve => setTimeout(() => resolve(message), 500));
    }
}

// Initialize messages handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.messagesHandler = new MessagesHandler();
    
    // Set mock current user (replace with actual user data later)
    window.messagesHandler.setCurrentUser({
        id: 'current-user',
        name: 'Alumni User',
        avatar: 'image/default-avatar.jpg'
    });
    
    // Load initial conversations
    window.messagesHandler.loadConversations();
});
