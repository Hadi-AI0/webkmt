/**
 * Dynamic Blog Management System
 * Integrates with Supabase for CMS functionality
 */

class BlogManager {
    constructor() {
        this.supabase = null;
        this.posts = [];
        this.isAdmin = false;
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Initializing Blog Manager...');

            // Subscribe to auth state changes to update admin UI when user logs in/out
            if (window.authManager) {
                window.authManager.subscribe((authData) => {
                    console.log('🔄 Auth state changed in BlogManager:', authData.event);
                    if (authData.event === 'login' || authData.event === 'profile_updated') {
                        this.checkAdminStatus();
                    } else if (authData.event === 'logout') {
                        this.isAdmin = false;
                        this.removeAdminInterface();
                    }
                });
            }

            // Get Supabase client from the global manager
            try {
                this.supabase = window.WebKMT?.supabase || window.supabaseManager?.getClient();
                console.log('✅ Supabase client loaded:', !!this.supabase);
            } catch (error) {
                console.warn('⚠️ Could not load Supabase client:', error);
            }

            // Check admin status
            this.checkAdminStatus();

            // Load blog posts
            if (this.supabase) {
                await this.loadBlogPosts();
                console.log('✅ Blog Manager initialized successfully');
            } else {
                console.warn('⚠️ Supabase not available, using fallback content');
                this.fallbackToStaticContent();
            }
        } catch (error) {
            console.error('❌ Blog Manager initialization failed:', error);
            this.fallbackToStaticContent();
        }
    }

    async loadBlogPosts() {
        try {
            const { data, error } = await this.supabase
                .from('blogs')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            this.posts = (data || []).map(post => ({
                ...post,
                // Map snake_case DB columns back to camelCase for UI compatibility
                id:        post.id,
                title:     post.title,
                excerpt:   post.excerpt,
                content:   post.content,
                category:  post.category,
                author:    post.author_email || 'WebKMT Team',
                date:      post.created_at,
                image:     post.featured_image || 'assets/blog/default.jpg',
                readTime:  post.read_time || '5 min read',
                tags:      post.tags || [],
                published: post.published,
                slug:      post.slug
            }));

            if (this.posts.length === 0) {
                console.log('No blog posts found in Supabase, creating initial posts...');
                await this.createInitialPosts();
            } else {
                this.renderBlogPosts();
            }
        } catch (error) {
            console.error('Error loading blog posts:', error);
            this.fallbackToStaticContent();
        }
    }

    async createInitialPosts() {
        const initialPosts = [
            {
                title: "The Future of Web Development: Trends to Watch in 2024",
                excerpt: "Explore the emerging technologies and frameworks that are shaping the future of web development in 2024 and beyond.",
                content: "Web development continues to evolve at a rapid pace. From AI integration to progressive web apps, discover the key trends that will define the industry this year.",
                category: "Web Development",
                date: "2024-01-15",
                image: "assets/blog/post-1.jpg",
                slug: "future-web-development-2024",
                author: "WebKMT Team",
                published: true,
                tags: ["web development", "trends", "2024", "technology"],
                readTime: "5 min read"
            },
            {
                title: "Optimizing Mobile App Performance: Best Practices",
                excerpt: "Learn essential techniques to improve your mobile application's performance and deliver exceptional user experiences.",
                content: "Mobile app performance is crucial for user retention. Learn proven strategies to optimize your app's speed, memory usage, and overall performance.",
                category: "Mobile Development",
                date: "2024-01-10",
                image: "assets/blog/post-2.jpg",
                slug: "mobile-app-performance-optimization",
                author: "WebKMT Team",
                published: true,
                tags: ["mobile development", "performance", "optimization", "best practices"],
                readTime: "7 min read"
            },
            {
                title: "Building a Comprehensive Digital Marketing Strategy",
                excerpt: "A step-by-step guide to creating an effective digital marketing strategy that drives results and grows your business.",
                content: "Digital marketing success requires a well-planned strategy. Discover how to build a comprehensive approach that combines SEO, content marketing, and social media.",
                category: "Digital Marketing",
                date: "2024-01-05",
                image: "assets/blog/post-3.jpg",
                slug: "digital-marketing-strategy-guide",
                author: "WebKMT Team",
                published: true,
                tags: ["digital marketing", "strategy", "SEO", "content marketing"],
                readTime: "6 min read"
            }
        ];

        for (const post of initialPosts) {
            await this.addBlogPost(post);
        }

        console.log('✅ Initial blog posts created');
        await this.loadBlogPosts();
    }

    renderBlogPosts() {
        const container = document.querySelector('.insights__grid');
        if (!container) return;

        const publishedPosts = this.posts.filter(post => post.published !== false);

        container.innerHTML = publishedPosts.slice(0, 3).map(post => `
            <article class="insight-card" data-post-id="${post.id}">
                <div class="insight-card__image">
                    <img src="${post.image}" alt="${post.title}" loading="lazy">
                </div>
                <div class="insight-card__content">
                    <div class="insight-card__meta">
                        <time datetime="${post.date}" class="insight-card__date">
                            ${new Date(post.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </time>
                        <span class="insight-card__category">${post.category}</span>
                        ${post.readTime ? `<span class="insight-card__read-time">${post.readTime}</span>` : ''}
                    </div>
                    <h3 class="insight-card__title">
                        <a href="#" class="insight-card__link" onclick="blogManager.openBlogPost('${post.id}')">${post.title}</a>
                    </h3>
                    <p class="insight-card__excerpt">${post.excerpt}</p>
                    <div class="insight-card__actions">
                        <a href="#" class="insight-card__read-more" onclick="blogManager.openBlogPost('${post.id}')">Read More →</a>
                        ${this.isAdmin ? `
                            <div class="admin-actions">
                                <button onclick="blogManager.editPost('${post.id}')" class="admin-btn edit">Edit</button>
                                <button onclick="blogManager.deletePost('${post.id}')" class="admin-btn delete">Delete</button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </article>
        `).join('');

        console.log(`✅ Rendered ${publishedPosts.length} blog posts`);
    }

    fallbackToStaticContent() {
        console.log('📄 Using static blog content as fallback');
        // Keep existing static HTML content
    }

    async checkAdminStatus() {
        console.log('🔍 Checking admin authentication status...');

        try {
            // Wait for auth manager to be available
            if (!window.authManager) {
                console.log('⏳ Waiting for auth manager...');
                setTimeout(() => this.checkAdminStatus(), 500);
                return;
            }

            const user = window.authManager.getUser();
            console.log('👤 Current user:', user?.email || 'Not authenticated');

            // Check if user is authenticated and is the designated admin
            const ADMIN_EMAIL = 'info@webkmt.com'; // Single admin email

            if (user && user.email === ADMIN_EMAIL) {
                console.log('🛡️ Admin user authenticated, verifying admin role...');

                // Verify admin role in Supabase user document
                const isValidAdmin = await this.verifyAdminRole(user.uid);

                if (isValidAdmin) {
                    this.isAdmin = true;
                    console.log('✅ Admin access granted');
                    this.addAdminInterface();
                } else {
                    this.isAdmin = false;
                    console.log('❌ Admin role verification failed');
                }
            } else {
                this.isAdmin = false;
                console.log('👤 Regular user or not authenticated');

                // Show admin login prompt if user clicks admin button
                this.addAdminLoginPrompt();
            }
        } catch (error) {
            console.error('❌ Admin status check failed:', error);
            this.isAdmin = false;
        }
    }

    async verifyAdminRole(uid) {
        try {
            if (!this.supabase) {
                console.warn('⚠️ Supabase not available for role verification');
                return false;
            }

            console.log('🔍 Checking profile for uid:', uid);
            const { data, error } = await this.supabase
                .from('profiles')
                .select('role, email')
                .eq('id', uid)
                .single();

            if (error || !data) {
                console.warn('⚠️ Profile not found for uid:', uid);
                return false;
            }

            console.log('📋 Profile found:', { role: data.role, email: data.email });

            if (data.role === 'admin') {
                console.log('✅ Admin role confirmed in Supabase profiles');
                return true;
            }

            console.warn('⚠️ Profile exists but role is not admin:', data.role);
            return false;
        } catch (error) {
            console.error('❌ Role verification failed:', error);
            return false;
        }
    }

    addAdminLoginPrompt() {
        // Only show if admin button exists and no admin panel is shown
        const adminBtn = document.getElementById('adminToggleBtn');
        if (adminBtn && !document.querySelector('.blog-admin-panel')) {
            adminBtn.onclick = () => this.showAdminLoginModal();
        }
    }

    addAdminInterface() {
        console.log('🔧 Adding admin interface...');

        // Enable the admin panel button in user dropdown
        const adminPanelBtn = document.getElementById('adminPanelBtn');
        if (adminPanelBtn) {
            adminPanelBtn.style.display = 'flex';
            adminPanelBtn.onclick = () => this.showAdminPanel();
        }

        // Add body class for admin users
        document.body.classList.add('is-admin');
        console.log('✅ Admin interface enabled');
    }

    removeAdminInterface() {
        console.log('🔧 Removing admin interface...');

        // Hide the admin panel button
        const adminPanelBtn = document.getElementById('adminPanelBtn');
        if (adminPanelBtn) {
            adminPanelBtn.style.display = 'none';
            adminPanelBtn.onclick = null;
        }

        // Remove admin panel if visible
        const adminPanel = document.querySelector('.blog-admin-panel');
        if (adminPanel) {
            adminPanel.remove();
        }

        // Remove body class for admin users
        document.body.classList.remove('is-admin');
        console.log('✅ Admin interface removed');
    }

    addAdminStyles() {
        if (document.querySelector('#blog-admin-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'blog-admin-styles';
        styles.textContent = `
            .blog-admin-panel {
                background: var(--bg-secondary);
                border: 2px solid var(--color-primary);
                border-radius: 12px;
                padding: 1.5rem;
                margin-bottom: 2rem;
            }
            
            .admin-controls h4 {
                margin: 0 0 1rem 0;
                color: var(--color-primary);
            }
            
            .admin-btn {
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                margin-right: 0.5rem;
                font-weight: 500;
                transition: all 0.3s ease;
            }
            
            .admin-btn.primary {
                background: var(--color-primary);
                color: white;
            }
            
            .admin-btn.secondary {
                background: var(--bg-primary);
                color: var(--text-primary);
                border: 1px solid var(--border-color);
            }
            
            .admin-btn.edit {
                background: #10b981;
                color: white;
                font-size: 0.8rem;
                padding: 0.25rem 0.5rem;
            }
            
            .admin-btn.delete {
                background: #ef4444;
                color: white;
                font-size: 0.8rem;
                padding: 0.25rem 0.5rem;
            }
            
            .admin-actions {
                display: flex;
                gap: 0.5rem;
                margin-top: 0.5rem;
            }
            
            .insight-card__actions {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .blog-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .blog-modal-content {
                background: var(--bg-secondary);
                border-radius: 12px;
                padding: 2rem;
                max-width: 800px;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
            }
            
            .blog-modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--text-secondary);
            }
        `;
        
        document.head.appendChild(styles);
    }

    showAdminLoginModal() {
        // Use existing auth modal but with admin-specific messaging
        if (window.authUI) {
            window.authUI.showAuthModal();

            // Update modal title to indicate admin login
            const modalTitle = document.getElementById('authModalTitle');
            const modalMessages = document.getElementById('authMessages');

            if (modalTitle) {
                modalTitle.textContent = 'Admin Login';
            }

            if (modalMessages) {
                modalMessages.innerHTML = `
                    <div class="auth-message info">
                        Please sign in with your admin credentials (info@webkmt.com)
                    </div>
                `;
            }
        } else {
            alert('Please sign in with admin credentials: info@webkmt.com');
        }
    }

    // Enhanced toggle method that properly handles auth state
    async toggleAdminMode() {
        console.log('🔄 Toggling admin mode...');

        if (this.isAdmin) {
            // Admin is logged in, just hide/show the interface
            const adminPanel = document.querySelector('.blog-admin-panel');
            if (adminPanel) {
                adminPanel.style.display = adminPanel.style.display === 'none' ? 'block' : 'none';
                console.log('🎛️ Admin panel toggled');
            }
        } else {
            // Not admin, show login
            this.showAdminLoginModal();
        }
    }

    // Blog Post Management Methods
    async addBlogPost(postData) {
        try {
            const user = window.authManager?.getUser();
            const dbRow = {
                title:          postData.title,
                content:        postData.content,
                excerpt:        postData.excerpt || '',
                author_id:      user?.uid || null,
                author_email:   user?.email || 'info@webkmt.com',
                published:      postData.published ?? false,
                featured:       postData.featured ?? false,
                slug:           postData.slug || this.generateSlug(postData.title),
                category:       postData.category || 'General',
                tags:           postData.tags || [],
                meta_description: postData.metaDescription || postData.excerpt || '',
                featured_image: postData.image || null,
                read_time:      postData.readTime || '5 min read',
                published_at:   postData.published ? new Date().toISOString() : null
            };

            const { data, error } = await this.supabase
                .from('blogs')
                .insert([dbRow])
                .select();

            if (error) throw error;
            console.log('✅ Blog post added with ID:', data[0]?.id);
            await this.loadBlogPosts();
            return data[0]?.id;
        } catch (error) {
            console.error('❌ Error adding blog post:', error);
            throw error;
        }
    }

    async updateBlogPost(postId, postData) {
        try {
            const updateRow = {
                updated_at: new Date().toISOString()
            };
            if (postData.title !== undefined)     updateRow.title           = postData.title;
            if (postData.content !== undefined)   updateRow.content         = postData.content;
            if (postData.excerpt !== undefined)   updateRow.excerpt         = postData.excerpt;
            if (postData.category !== undefined)  updateRow.category        = postData.category;
            if (postData.tags !== undefined)      updateRow.tags            = postData.tags;
            if (postData.published !== undefined) updateRow.published       = postData.published;
            if (postData.slug !== undefined)      updateRow.slug            = postData.slug;
            if (postData.image !== undefined)     updateRow.featured_image  = postData.image;
            if (postData.readTime !== undefined)  updateRow.read_time       = postData.readTime;
            if (postData.published)               updateRow.published_at    = new Date().toISOString();

            const { error } = await this.supabase
                .from('blogs')
                .update(updateRow)
                .eq('id', postId);

            if (error) throw error;
            console.log('✅ Blog post updated:', postId);
            await this.loadBlogPosts();
        } catch (error) {
            console.error('❌ Error updating blog post:', error);
            throw error;
        }
    }

    async deletePost(postId) {
        if (!confirm('Are you sure you want to delete this blog post?')) return;

        try {
            const { error } = await this.supabase
                .from('blogs')
                .delete()
                .eq('id', postId);

            if (error) throw error;
            console.log('✅ Blog post deleted:', postId);
            await this.loadBlogPosts();
        } catch (error) {
            console.error('❌ Error deleting blog post:', error);
            alert('Error deleting post. Please try again.');
        }
    }

    openBlogPost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        this.showBlogModal(post);
    }

    showBlogModal(post) {
        const modal = document.createElement('div');
        modal.className = 'blog-modal';
        modal.innerHTML = `
            <div class="blog-modal-content">
                <button class="blog-modal-close" onclick="this.closest('.blog-modal').remove()">&times;</button>
                <article class="blog-post">
                    <header class="blog-post-header">
                        <h1>${post.title}</h1>
                        <div class="blog-post-meta">
                            <time datetime="${post.date}">
                                ${new Date(post.date).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </time>
                            <span class="blog-post-category">${post.category}</span>
                            <span class="blog-post-author">By ${post.author}</span>
                            ${post.readTime ? `<span class="blog-post-read-time">${post.readTime}</span>` : ''}
                        </div>
                    </header>
                    
                    <div class="blog-post-image">
                        <img src="${post.image}" alt="${post.title}">
                    </div>
                    
                    <div class="blog-post-content">
                        ${post.content.replace(/\n/g, '</p><p>')}
                    </div>
                    
                    ${post.tags ? `
                        <div class="blog-post-tags">
                            <strong>Tags:</strong>
                            ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </article>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    showAddPostForm() {
        const modal = document.createElement('div');
        modal.className = 'blog-modal';
        modal.innerHTML = `
            <div class="blog-modal-content">
                <button class="blog-modal-close" onclick="this.closest('.blog-modal').remove()">&times;</button>
                <h2>Add New Blog Post</h2>
                <form id="addPostForm" class="blog-form">
                    <div class="form-group">
                        <label>Title:</label>
                        <input type="text" name="title" required>
                    </div>
                    <div class="form-group">
                        <label>Excerpt:</label>
                        <textarea name="excerpt" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Content:</label>
                        <textarea name="content" rows="10" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Category:</label>
                        <input type="text" name="category" required>
                    </div>
                    <div class="form-group">
                        <label>Date:</label>
                        <input type="date" name="date" required>
                    </div>
                    <div class="form-group">
                        <label>Image URL:</label>
                        <input type="text" name="image" placeholder="assets/blog/post-name.jpg">
                    </div>
                    <div class="form-group">
                        <label>Author:</label>
                        <input type="text" name="author" value="WebKMT Team">
                    </div>
                    <div class="form-group">
                        <label>Tags (comma-separated):</label>
                        <input type="text" name="tags">
                    </div>
                    <div class="form-group">
                        <label>Read Time:</label>
                        <input type="text" name="readTime" placeholder="5 min read">
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="admin-btn primary">Add Post</button>
                        <button type="button" class="admin-btn secondary" onclick="this.closest('.blog-modal').remove()">Cancel</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle form submission
        document.getElementById('addPostForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const postData = {};
            
            for (let [key, value] of formData.entries()) {
                if (key === 'tags') {
                    postData[key] = value.split(',').map(tag => tag.trim()).filter(tag => tag);
                } else {
                    postData[key] = value;
                }
            }

            // Generate slug from title
            postData.slug = postData.title.toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
            
            postData.published = true;

            try {
                await this.addBlogPost(postData);
                modal.remove();
                alert('Blog post added successfully!');
            } catch (error) {
                alert('Error adding post. Please try again.');
            }
        });
    }

    toggleAdminMode() {
        const current = localStorage.getItem('blog-admin-mode') === 'true';
        localStorage.setItem('blog-admin-mode', (!current).toString());
        location.reload();
    }

    // Enhanced Admin Panel Methods
    showAdminPanel() {
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) {
            adminPanel.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.loadAdminBlogList();
        }
    }

    hideAdminPanel() {
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) {
            adminPanel.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    async loadAdminBlogList() {
        const blogList = document.getElementById('blogList');
        const blogListLoading = document.getElementById('blogListLoading');

        if (blogListLoading) blogListLoading.style.display = 'flex';
        if (blogList) blogList.style.display = 'none';

        try {
            // Reload posts to get latest data
            await this.loadBlogPosts();
            this.renderAdminBlogList();
        } catch (error) {
            console.error('Error loading admin blog list:', error);
        } finally {
            if (blogListLoading) blogListLoading.style.display = 'none';
            if (blogList) blogList.style.display = 'block';
        }
    }

    renderAdminBlogList() {
        const blogList = document.getElementById('blogList');
        if (!blogList) return;

        if (this.posts.length === 0) {
            blogList.innerHTML = `
                <div class="blog-list-empty" style="text-align: center; padding: 2rem;">
                    <p>No blog posts found.</p>
                    <button class="btn-primary" onclick="blogManager.showBlogEditor()">
                        Create Your First Blog Post
                    </button>
                </div>
            `;
            return;
        }

        blogList.innerHTML = this.posts.map(post => `
            <div class="blog-item" data-blog-id="${post.id}">
                <div class="blog-item__content">
                    <h3 class="blog-item__title">${this.escapeHtml(post.title || 'Untitled')}</h3>
                    <div class="blog-item__meta">
                        <span class="blog-item__status blog-item__status--${post.published ? 'published' : 'draft'}">
                            ${post.published ? 'Published' : 'Draft'}
                        </span>
                        <span>Category: ${post.category || 'General'}</span>
                        <span>${this.formatDate(post.date || post.createdAt)}</span>
                    </div>
                </div>
                <div class="blog-item__actions">
                    <button class="btn-sm btn-secondary" onclick="blogManager.editPost('${post.id}')">
                        Edit
                    </button>
                    <button class="btn-sm btn-outline" onclick="blogManager.duplicatePost('${post.id}')">
                        Duplicate
                    </button>
                    <button class="btn-sm btn-danger" onclick="blogManager.deletePost('${post.id}')">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    showBlogEditor(post = null) {
        const blogListView = document.getElementById('blogListView');
        const blogEditorView = document.getElementById('blogEditorView');

        if (blogListView) blogListView.style.display = 'none';
        if (blogEditorView) blogEditorView.style.display = 'flex';

        if (post) {
            this.populateEditor(post);
        } else {
            this.clearEditor();
        }

        // Set up editor event listeners
        this.setupEditor();
    }

    showBlogList() {
        const blogListView = document.getElementById('blogListView');
        const blogEditorView = document.getElementById('blogEditorView');

        if (blogListView) blogListView.style.display = 'flex';
        if (blogEditorView) blogEditorView.style.display = 'none';
    }

    setupEditor() {
        // Back to list button
        const backBtn = document.getElementById('backToBlogList');
        if (backBtn) {
            backBtn.onclick = () => this.showBlogList();
        }

        // Save buttons
        const saveDraftBtn = document.getElementById('saveDraftBtn');
        const publishBtn = document.getElementById('publishBtn');

        if (saveDraftBtn) {
            saveDraftBtn.onclick = () => this.saveBlogPost(false);
        }

        if (publishBtn) {
            publishBtn.onclick = () => this.saveBlogPost(true);
        }

        // Auto-generate slug from title
        const titleInput = document.getElementById('blogTitle');
        const slugInput = document.getElementById('blogSlug');

        if (titleInput && slugInput) {
            titleInput.addEventListener('input', () => {
                if (!this.isEditingExisting) {
                    slugInput.value = this.generateSlug(titleInput.value);
                }
            });
        }

        // Close panel handlers
        const closeBtn = document.getElementById('adminPanelClose');
        const backdrop = document.getElementById('adminPanelBackdrop');

        if (closeBtn) closeBtn.onclick = () => this.hideAdminPanel();
        if (backdrop) backdrop.onclick = () => this.hideAdminPanel();

        // New blog button
        const newBlogBtn = document.getElementById('newBlogBtn');
        if (newBlogBtn) {
            newBlogBtn.onclick = () => this.showBlogEditor();
        }
    }

    async saveBlogPost(publish = false) {
        const title = document.getElementById('blogTitle')?.value.trim();
        const slug = document.getElementById('blogSlug')?.value.trim();
        const excerpt = document.getElementById('blogExcerpt')?.value.trim();
        const content = document.getElementById('blogContent')?.innerHTML;
        const category = document.getElementById('blogCategory')?.value;
        const tags = document.getElementById('blogTags')?.value;

        if (!title || !content) {
            alert('Please fill in title and content');
            return;
        }

        const postData = {
            title,
            slug: slug || this.generateSlug(title),
            excerpt,
            content,
            category,
            tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
            published: publish,
            author: 'WebKMT Team',
            date: new Date().toISOString().split('T')[0]
        };

        try {
            if (this.currentEditingPost) {
                await this.updateBlogPost(this.currentEditingPost.id, postData);
                this.showMessage(`Blog ${publish ? 'published' : 'saved as draft'} successfully!`, 'success');
            } else {
                await this.addBlogPost(postData);
                this.showMessage(`Blog ${publish ? 'published' : 'created as draft'} successfully!`, 'success');
            }

            this.showBlogList();
            this.loadAdminBlogList();
        } catch (error) {
            console.error('Error saving blog:', error);
            this.showMessage('Error saving blog post', 'error');
        }
    }

    editPost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        this.currentEditingPost = post;
        this.isEditingExisting = true;
        this.showBlogEditor(post);
    }

    duplicatePost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        const duplicatedPost = {
            ...post,
            title: `${post.title} (Copy)`,
            slug: `${post.slug}-copy`,
            published: false
        };

        this.currentEditingPost = null;
        this.isEditingExisting = false;
        this.showBlogEditor(duplicatedPost);
    }

    populateEditor(post) {
        if (document.getElementById('blogTitle')) document.getElementById('blogTitle').value = post.title || '';
        if (document.getElementById('blogSlug')) document.getElementById('blogSlug').value = post.slug || '';
        if (document.getElementById('blogExcerpt')) document.getElementById('blogExcerpt').value = post.excerpt || '';
        if (document.getElementById('blogContent')) document.getElementById('blogContent').innerHTML = post.content || '';
        if (document.getElementById('blogCategory')) document.getElementById('blogCategory').value = post.category || 'general';
        if (document.getElementById('blogTags')) document.getElementById('blogTags').value = (post.tags || []).join(', ');
    }

    clearEditor() {
        this.currentEditingPost = null;
        this.isEditingExisting = false;

        if (document.getElementById('blogTitle')) document.getElementById('blogTitle').value = '';
        if (document.getElementById('blogSlug')) document.getElementById('blogSlug').value = '';
        if (document.getElementById('blogExcerpt')) document.getElementById('blogExcerpt').value = '';
        if (document.getElementById('blogContent')) document.getElementById('blogContent').innerHTML = '';
        if (document.getElementById('blogCategory')) document.getElementById('blogCategory').value = 'general';
        if (document.getElementById('blogTags')) document.getElementById('blogTags').value = '';
    }

    generateSlug(title) {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10001;
            opacity: 0;
            transform: translateX(100%);
            transition: all 300ms ease;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        `;
        messageEl.textContent = message;

        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.style.opacity = '1';
            messageEl.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => messageEl.remove(), 300);
        }, 3000);
    }

    formatDate(dateInput) {
        if (!dateInput) return 'Unknown';

        let date;
        if (dateInput.toDate) {
            date = dateInput.toDate();
        } else if (typeof dateInput === 'string') {
            date = new Date(dateInput);
        } else {
            date = dateInput;
        }

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize blog manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.blogManager = new BlogManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogManager;
}