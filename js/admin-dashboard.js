/**
 * Admin Dashboard - Operations tab controller
 * Handles tab switching and fetching Leads/Users from Supabase
 */
class AdminDashboard {
    constructor() {
        this.supabase = null;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupSupabase();
            this.setupTabs();
            this.setupEvents();
        });
    }

    setupSupabase() {
        if (window.WebKMT && window.WebKMT.supabase) {
            this.supabase = window.WebKMT.supabase;
        } else if (window.supabaseManager) {
            this.supabase = window.supabaseManager.getClient();
        }
        if (!this.supabase) {
            console.warn('AdminDashboard: Supabase not ready yet, will retry on demand.');
        }
    }

    getSupabase() {
        if (!this.supabase) this.setupSupabase();
        return this.supabase;
    }

    setupTabs() {
        const tabs = document.querySelectorAll('.admin-tab');
        const contents = document.querySelectorAll('.admin-tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => {
                    t.classList.remove('active');
                    t.style.borderBottom = 'none';
                    t.style.color = 'rgba(255, 255, 255, 0.7)';
                });
                tab.classList.add('active');
                tab.style.borderBottom = '2px solid var(--color-primary)';
                tab.style.color = 'white';

                contents.forEach(c => {
                    c.style.display = 'none';
                    c.classList.remove('active');
                });

                const target = document.getElementById('tab-' + tab.dataset.tab);
                if (target) {
                    target.style.display = 'block';
                    target.classList.add('active');
                }

                if (tab.dataset.tab === 'leads') this.loadLeads();
                else if (tab.dataset.tab === 'users') this.loadUsers();
            });
        });
    }

    setupEvents() {
        const refreshLeads = document.getElementById('refreshLeadsBtn');
        if (refreshLeads) refreshLeads.addEventListener('click', () => this.loadLeads());

        const refreshUsers = document.getElementById('refreshUsersBtn');
        if (refreshUsers) refreshUsers.addEventListener('click', () => this.loadUsers());
    }

    async loadLeads() {
        const tbody = document.getElementById('leadsTableBody');
        if (!tbody) return;

        const sb = this.getSupabase();
        if (!sb) {
            tbody.innerHTML = '<tr><td colspan="5" style="padding:1rem;color:rgba(255,255,255,0.5)">Supabase not connected.</td></tr>';
            return;
        }

        tbody.innerHTML = '<tr><td colspan="5" style="padding:1rem;color:rgba(255,255,255,0.5)">Loading...</td></tr>';

        try {
            const { data, error } = await sb
                .from('contacts')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;

            if (!data || data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="padding:1rem;color:rgba(255,255,255,0.5)">No leads yet.</td></tr>';
                return;
            }

            tbody.innerHTML = data.map(lead => `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                    <td style="padding:0.75rem;">${new Date(lead.created_at).toLocaleDateString()}</td>
                    <td style="padding:0.75rem;">${this.esc(lead.name)}</td>
                    <td style="padding:0.75rem;">${this.esc(lead.email)}</td>
                    <td style="padding:0.75rem;">
                        <span style="background:rgba(124,58,237,0.2);color:#c4b5fd;padding:0.2rem 0.5rem;border-radius:4px;font-size:0.75rem;">
                            ${this.esc(lead.source || 'Website')}
                        </span>
                    </td>
                    <td style="padding:0.75rem;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${this.esc(lead.message)}">
                        ${this.esc(lead.message)}
                    </td>
                </tr>`).join('');
        } catch (err) {
            console.error('AdminDashboard loadLeads error:', err);
            tbody.innerHTML = '<tr><td colspan="5" style="padding:1rem;color:#ef4444;">Failed to load leads.</td></tr>';
        }
    }

    async loadUsers() {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        const sb = this.getSupabase();
        if (!sb) {
            tbody.innerHTML = '<tr><td colspan="3" style="padding:1rem;color:rgba(255,255,255,0.5)">Supabase not connected.</td></tr>';
            return;
        }

        tbody.innerHTML = '<tr><td colspan="3" style="padding:1rem;color:rgba(255,255,255,0.5)">Loading...</td></tr>';

        try {
            const { data, error } = await sb
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;

            if (!data || data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" style="padding:1rem;color:rgba(255,255,255,0.5)">No users yet.</td></tr>';
                return;
            }

            tbody.innerHTML = data.map(u => `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                    <td style="padding:0.75rem;">${new Date(u.created_at).toLocaleDateString()}</td>
                    <td style="padding:0.75rem;">${this.esc(u.email)}</td>
                    <td style="padding:0.75rem;font-family:monospace;font-size:0.8rem;color:rgba(255,255,255,0.4);">${u.id}</td>
                </tr>`).join('');
        } catch (err) {
            console.error('AdminDashboard loadUsers error:', err);
            tbody.innerHTML = '<tr><td colspan="3" style="padding:1rem;color:#ef4444;">Failed to load users.</td></tr>';
        }
    }

    esc(str) {
        if (!str) return '-';
        return String(str).replace(/[&<>'"]/g, t => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[t]));
    }
}

window.adminDashboard = new AdminDashboard();
