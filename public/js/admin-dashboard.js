// Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupCSRF();
        this.loadInitialData();
    }    setupEventListeners() {
        // Sidebar toggle for mobile
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');
        const sidebarClose = document.getElementById('sidebar-close');
        const overlay = document.getElementById('mobile-menu-overlay');

        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.add('open');
                overlay.classList.add('show');
            });
        }

        if (sidebarClose) {
            sidebarClose.addEventListener('click', () => {
                sidebar.classList.remove('open');
                overlay.classList.remove('show');
            });
        }

        if (overlay) {
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
                overlay.classList.remove('show');
            });
        }

        // Profile form
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => this.handleProfileUpdate(e));
        }

        // Process form
        const processForm = document.getElementById('process-form');
        if (processForm) {
            processForm.addEventListener('submit', (e) => this.handleProcessSubmit(e));
        }

        // Category form
        const categoryForm = document.getElementById('category-form');
        if (categoryForm) {
            categoryForm.addEventListener('submit', (e) => this.handleCategorySubmit(e));
        }

        // Formateur form
        const formateurForm = document.getElementById('formateur-form');
        if (formateurForm) {
            formateurForm.addEventListener('submit', (e) => this.handleFormateurSubmit(e));
        }

        // Test form
        const testForm = document.getElementById('test-form');
        if (testForm) {
            testForm.addEventListener('submit', (e) => this.handleTestSubmit(e));
        }

        // Role form
        const roleForm = document.getElementById('role-form');
        if (roleForm) {
            roleForm.addEventListener('submit', (e) => this.handleRoleSubmit(e));
        }

        // Search functionality
        const processSearch = document.getElementById('process-search');
        if (processSearch) {
            processSearch.addEventListener('input', () => this.filterProcesses());
        }        const categorySearch = document.getElementById('category-search');
        if (categorySearch) {
            categorySearch.addEventListener('input', () => this.filterCategories());
        }

        const processFilter = document.getElementById('process-filter');
        if (processFilter) {
            processFilter.addEventListener('change', () => this.filterCategories());
        }

        const formateurSearch = document.getElementById('formateur-search');
        if (formateurSearch) {
            formateurSearch.addEventListener('input', () => this.filterFormateurs());
        }

        const testSearch = document.getElementById('test-search');
        if (testSearch) {
            testSearch.addEventListener('input', () => this.filterTests());
        }

        // Test filters
        const testFormateurFilter = document.getElementById('test-formateur-filter');
        if (testFormateurFilter) {
            testFormateurFilter.addEventListener('change', () => this.filterTests());
        }

        const testProcessFilter = document.getElementById('test-process-filter');
        if (testProcessFilter) {
            testProcessFilter.addEventListener('change', () => this.filterTests());
        }

        const testCategoryFilter = document.getElementById('test-category-filter');
        if (testCategoryFilter) {
            testCategoryFilter.addEventListener('change', () => this.filterTests());
        }

        const testPercentageFilter = document.getElementById('test-percentage-filter');
        if (testPercentageFilter) {
            testPercentageFilter.addEventListener('change', () => this.filterTests());
        }

        const testDateSort = document.getElementById('test-date-sort');
        if (testDateSort) {
            testDateSort.addEventListener('change', () => this.filterTests());
        }

        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Escape key to close modals
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
            
            // Ctrl/Cmd + R to refresh current section
            if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
                e.preventDefault();
                this.refreshCurrentSection();
            }
        });        // Auto-refresh data every 30 seconds (except when filters are active in questions section)
        setInterval(() => {
            if (this.currentSection !== 'dashboard' && this.currentSection !== 'profile') {
                // Skip auto-refresh for questions section if filters are active
                if (this.currentSection === 'questions' && this.hasActiveFilters()) {
                    return;
                }
                this.refreshCurrentSection();
            }
        }, 30000);

        // Handle window resize for mobile sidebar
        window.addEventListener('resize', () => {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('mobile-menu-overlay');
            
            if (window.innerWidth >= 1024) {
                if (sidebar) sidebar.classList.remove('open');
                if (overlay) overlay.classList.remove('show');
            }
        });
    }

    // Close all modals
    closeAllModals() {
        const modals = ['process-modal', 'category-modal', 'formateur-modal', 'test-modal', 'role-modal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal && !modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        });
    }

    setupCSRF() {
        // Setup CSRF token for AJAX requests
        const token = document.querySelector('meta[name="csrf-token"]');
        if (token) {
            window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.getAttribute('content');
        }
    }

    loadInitialData() {
        // Load processes if on processes section
        if (this.currentSection === 'processes') {
            this.loadProcesses();
        }
    }

    // Section Management
    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('hidden');
        });

        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active', 'bg-aptiv-orange-50', 'text-aptiv-orange-600');
        });

        // Show selected section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }

        // Update page title
        const titles = {
            dashboard: 'Tableau de Bord',
            profile: 'Mon Profil',
            users: 'Gestion des Utilisateurs',
            processes: 'Gestion des Processus',
            categories: 'Gestion des Catégories',
            questions: 'Gestion des Questions',
            formateurs: 'Gestion des Formateurs',
            employees: 'Gestion des Employés',
            tests: 'Gestion des Tests'
        };

        const pageTitle = document.getElementById('page-title');
        if (pageTitle) {
            pageTitle.textContent = titles[sectionName] || 'Dashboard';
        }

        // Add active class to current nav link
        const activeLink = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
        if (activeLink) {
            activeLink.classList.add('active', 'bg-aptiv-orange-50', 'text-aptiv-orange-600');
        }

        this.currentSection = sectionName;

        // Load section-specific data
        switch (sectionName) {
            case 'users':
                this.loadUsers();
                break;
            case 'processes':
                this.loadProcesses();
                break;
            case 'categories':
                this.loadCategories();
                break;
            case 'questions':
                if (window.initQuestionsSection) {
                    window.initQuestionsSection();
                }
                break;
            case 'formateurs':
                this.loadFormateurs();
                break;
            case 'employees':
                this.loadEmployees();
                break;
            case 'tests':
                this.loadTests();
                break;        }

        // Update URL hash for bookmarkable sections
        if (sectionName !== 'dashboard') {
            window.history.replaceState(null, null, `#${sectionName}`);
        } else {
            window.history.replaceState(null, null, window.location.pathname);
        }

        // Close mobile sidebar
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('mobile-menu-overlay');
        if (sidebar && overlay) {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
        }
    }

    // Utility Functions
    showLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }    showMessage(message, type = 'success') {
        const container = document.getElementById('message-container');
        if (!container) return;

        const messageEl = document.createElement('div');
        messageEl.className = `p-4 rounded-lg mb-4 ${type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`;
        messageEl.innerHTML = `
            <div class="flex items-center">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-auto">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;

        container.appendChild(messageEl);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentElement) {
                messageEl.remove();
            }
        }, 5000);
    }

    // Clear all error messages
    clearMessages() {
        const container = document.getElementById('message-container');
        if (container) {
            container.innerHTML = '';
        }
    }

    // Refresh current section data
    refreshCurrentSection() {
        switch (this.currentSection) {
            case 'users':
                this.loadUsers();
                break;
            case 'processes':
                this.loadProcesses();
                break;
            case 'categories':
                this.loadCategories();
                break;
            case 'questions':
                if (window.initQuestionsSection) {
                    window.initQuestionsSection();
                }
                break;
            case 'formateurs':
                this.loadFormateurs();
                break;
            case 'tests':
                this.loadTests();
                break;
        }
    }

    // Check if there are active filters in questions section
    hasActiveFilters() {
        if (this.currentSection !== 'questions') return false;
        
        const searchInput = document.getElementById('question-search');
        const processFilter = document.getElementById('question-process-filter');
        const categoryFilter = document.getElementById('question-category-filter');
        
        return (searchInput?.value.trim() !== '') || 
               (processFilter?.value !== '') || 
               (categoryFilter?.value !== '');
    }

    // Profile Management
    async handleProfileUpdate(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        
        try {
            this.showLoading();
            
            const response = await fetch('/admin/profile', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Object.fromEntries(formData))
            });

            const result = await response.json();

            if (result.success) {
                this.showMessage(result.message);
                // Clear password fields
                document.getElementById('current_password').value = '';
                document.getElementById('password').value = '';
                document.getElementById('password_confirmation').value = '';
            } else {
                this.showMessage(result.message, 'error');
            }
        } catch (error) {
            this.showMessage('Une erreur est survenue', 'error');
            console.error('Error:', error);
        } finally {
            this.hideLoading();
        }
    }

    // Process Management
    async loadProcesses() {
        // Check if enhanced processes functionality is available
        if (typeof loadProcessesData === 'function') {
            loadProcessesData();
            return;
        }
        
        // Fallback to original functionality
        const loadingEl = document.getElementById('processes-loading');
        const tableEl = document.getElementById('processes-table');
        const mobileEl = document.getElementById('processes-mobile');
        const emptyEl = document.getElementById('processes-empty');

        if (loadingEl) loadingEl.classList.remove('hidden');
        if (tableEl) tableEl.classList.add('hidden');
        if (mobileEl) mobileEl.classList.add('hidden');
        if (emptyEl) emptyEl.classList.add('hidden');

        try {
            const response = await fetch('/admin/api/processes');
            const result = await response.json();

            if (result.success) {
                this.renderProcesses(result.data);
            } else {
                this.showMessage('Erreur lors du chargement des processus', 'error');
            }
        } catch (error) {
            this.showMessage('Une erreur est survenue', 'error');
            console.error('Error:', error);
        } finally {
            if (loadingEl) loadingEl.classList.add('hidden');
        }
    }

    renderProcesses(processes) {
        const tbody = document.getElementById('processes-tbody');
        const mobileContainer = document.getElementById('processes-mobile');
        const tableEl = document.getElementById('processes-table');
        const mobileEl = document.getElementById('processes-mobile');
        const emptyEl = document.getElementById('processes-empty');

        if (processes.length === 0) {
            if (emptyEl) emptyEl.classList.remove('hidden');
            return;
        }

        // Desktop table view
        if (tbody) {
            tbody.innerHTML = processes.map(process => `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">${process.title}</div>
                    </td>
                    <td class="px-6 py-4">
                        <div class="text-sm text-gray-900">${process.description}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            ${process.categories_count || 0} catégories
                        </span>
                    </td>                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${new Date(process.created_at || process.create_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">                        <button onclick="adminDashboard.editProcess(${process.id})" class="text-aptiv-orange-600 hover:text-aptiv-orange-900 mr-3">
                            Modifier
                        </button>
                        <button onclick="adminDashboard.deleteProcess(${process.id})" class="text-red-600 hover:text-red-900">
                            Supprimer
                        </button>
                    </td>
                </tr>
            `).join('');
            
            if (tableEl) tableEl.classList.remove('hidden');
        }        // Mobile card view
        if (mobileContainer) {
            mobileContainer.innerHTML = processes.map(process => `
                <div class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 card-hover">
                    <div class="flex justify-between items-start mb-3">
                        <h3 class="font-semibold text-gray-900 text-base leading-tight">${process.title}</h3>
                        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-aptiv-orange-100 text-aptiv-orange-800 ml-2 flex-shrink-0">
                            ${process.categories_count || 0} cat.
                        </span>
                    </div>
                    <p class="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2">${process.description}</p>
                    <div class="flex justify-between items-center pt-2 border-t border-gray-100">
                        <span class="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">${new Date(process.created_at || process.create_at).toLocaleDateString('fr-FR')}</span>
                        <div class="flex space-x-3">
                            <button onclick="adminDashboard.editProcess(${process.id})" class="text-aptiv-orange-600 hover:text-aptiv-orange-700 text-sm font-medium transition-colors btn-touch">
                                Modifier
                            </button>
                            <button onclick="adminDashboard.deleteProcess(${process.id})" class="text-red-600 hover:text-red-700 text-sm font-medium transition-colors btn-touch">
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
            
            if (mobileEl) mobileEl.classList.remove('hidden');
        }
    }

    openProcessModal(processId = null) {
        const modal = document.getElementById('process-modal');
        const title = document.getElementById('process-modal-title');
        const form = document.getElementById('process-form');
        
        if (processId) {
            // Edit mode
            title.textContent = 'Modifier le processus';
            this.loadProcessForEdit(processId);
        } else {
            // Add mode
            title.textContent = 'Ajouter un processus';
            form.reset();
            document.getElementById('process-id').value = '';
        }
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    closeProcessModal() {
        const modal = document.getElementById('process-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    async handleProcessSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const processId = document.getElementById('process-id').value;
        const isEdit = !!processId;
        
        const url = isEdit ? `/admin/api/processes/${processId}` : '/admin/api/processes';
        const method = isEdit ? 'PUT' : 'POST';
        
        try {
            this.showLoading();
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Object.fromEntries(formData))
            });            const result = await response.json();

            if (result.success) {
                this.showMessage(result.message);
                this.closeProcessModal();
                this.loadProcesses();
            } else {
                if (result.errors) {
                    // Handle validation errors
                    const errorMessages = Object.values(result.errors).flat().join('<br>');
                    this.showMessage(errorMessages, 'error');
                } else {
                    this.showMessage(result.message, 'error');
                }
            }
        } catch (error) {
            this.showMessage('Une erreur est survenue', 'error');
            console.error('Error:', error);
        } finally {
            this.hideLoading();
        }
    }

    async loadProcessForEdit(processId) {
        try {
            const response = await fetch(`/admin/api/processes`);
            const result = await response.json();
            
            if (result.success) {
                const process = result.data.find(p => p.id == processId);
                if (process) {
                    document.getElementById('process-id').value = process.id;
                    document.getElementById('process-title').value = process.title;
                    document.getElementById('process-description').value = process.description;
                }
            }
        } catch (error) {
            console.error('Error loading process:', error);
        }
    }

    async deleteProcess(processId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce processus ?')) {
            return;
        }

        try {
            this.showLoading();
            
            const response = await fetch(`/admin/api/processes/${processId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                }
            });

            const result = await response.json();

            if (result.success) {
                this.showMessage(result.message);
                this.loadProcesses();
            } else {
                this.showMessage(result.message, 'error');
            }
        } catch (error) {
            this.showMessage('Une erreur est survenue', 'error');
            console.error('Error:', error);
        } finally {
            this.hideLoading();        }
    }

    editProcess(processId) {
        this.openProcessModal(processId);
    }

    filterProcesses() {
        const searchTerm = document.getElementById('process-search').value.toLowerCase();
        const tableRows = document.querySelectorAll('#processes-tbody tr');
        const mobileCards = document.querySelectorAll('#processes-mobile > div');

        // Filter table rows
        tableRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });

        // Filter mobile cards
        mobileCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    }    // Placeholder methods for other sections
    async loadCategories() {
        const loadingEl = document.getElementById('categories-loading');
        const desktopEl = document.getElementById('categories-desktop');
        const mobileEl = document.getElementById('categories-mobile');
        const emptyEl = document.getElementById('categories-empty');

        if (loadingEl) loadingEl.classList.remove('hidden');
        if (desktopEl) desktopEl.classList.add('hidden');
        if (mobileEl) mobileEl.classList.add('hidden');
        if (emptyEl) emptyEl.classList.add('hidden');

        try {
            const response = await fetch('/admin/api/categories');
            const result = await response.json();            if (result.success) {
                this.renderCategories(result.data);
                await this.loadProcessesForFilter();
            } else {
                this.showMessage('Erreur lors du chargement des catégories', 'error');
            }
        } catch (error) {
            this.showMessage('Une erreur est survenue', 'error');
            console.error('Error:', error);
        } finally {
            if (loadingEl) loadingEl.classList.add('hidden');
        }
    }

    renderCategories(categories) {
        const desktopContainer = document.getElementById('categories-desktop');
        const mobileContainer = document.getElementById('categories-mobile');
        const emptyEl = document.getElementById('categories-empty');

        if (categories.length === 0) {
            if (emptyEl) emptyEl.classList.remove('hidden');
            return;
        }

        // Group categories by process
        const categoriesByProcess = this.groupCategoriesByProcess(categories);

        // Render category statistics
        this.renderCategoryStats(categoriesByProcess);

        // Render desktop process-based view
        if (desktopContainer) {
            desktopContainer.innerHTML = this.renderDesktopProcessGroups(categoriesByProcess);
            desktopContainer.classList.remove('hidden');
        }

        // Render mobile process-based view
        if (mobileContainer) {
            mobileContainer.innerHTML = this.renderMobileProcessGroups(categoriesByProcess);
            mobileContainer.classList.remove('hidden');
        }
    }

    groupCategoriesByProcess(categories) {
        const processGroups = {};

        categories.forEach(category => {
            const processTitle = category.process?.title || 'Sans Processus';
            const processId = category.process?.id || 'no_process';
            
            if (!processGroups[processId]) {
                processGroups[processId] = {
                    process: category.process || { title: 'Sans Processus', id: 'no_process' },
                    categories: []
                };
            }
            processGroups[processId].categories.push(category);
        });

        return processGroups;
    }

    renderCategoryStats(categoriesByProcess) {
        const statsContainer = document.getElementById('categories-stats');
        if (!statsContainer) return;

        const processColors = [
            { bg: 'bg-blue-50', iconBg: 'bg-blue-100', text: 'text-blue-800', icon: '🔄' },
            { bg: 'bg-green-50', iconBg: 'bg-green-100', text: 'text-green-800', icon: '⚡' },
            { bg: 'bg-purple-50', iconBg: 'bg-purple-100', text: 'text-purple-800', icon: '🎯' },
            { bg: 'bg-orange-50', iconBg: 'bg-orange-100', text: 'text-orange-800', icon: '🚀' },
            { bg: 'bg-gray-50', iconBg: 'bg-gray-100', text: 'text-gray-800', icon: '📋' }
        ];

        const totalCategories = Object.values(categoriesByProcess).reduce((sum, group) => sum + group.categories.length, 0);

        const statsHtml = Object.entries(categoriesByProcess)
            .map(([processId, group], index) => {
                const colorScheme = processColors[index % processColors.length];
                const percentage = totalCategories > 0 ? Math.round((group.categories.length / totalCategories) * 100) : 0;
                
                return `
                    <div class="stat-card ${colorScheme.bg} border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                        <div class="flex items-center justify-between mb-3">
                            <div class="${colorScheme.iconBg} w-10 h-10 rounded-lg flex items-center justify-center">
                                <span class="text-lg">${colorScheme.icon}</span>
                            </div>
                            <span class="text-xs ${colorScheme.text} font-medium">${percentage}%</span>
                        </div>
                        <div>
                            <p class="text-2xl font-bold text-gray-900 mb-1">${group.categories.length}</p>
                            <p class="text-sm ${colorScheme.text} font-medium truncate" title="${group.process.title}">
                                ${group.process.title}
                            </p>
                        </div>
                    </div>
                `;
            }).join('');

        statsContainer.innerHTML = statsHtml;
        statsContainer.classList.remove('hidden');
    }

    renderDesktopProcessGroups(categoriesByProcess) {
        const processColors = [
            { bg: 'bg-blue-50', border: 'border-blue-200', header: 'bg-blue-100', text: 'text-blue-800', icon: '🔄' },
            { bg: 'bg-green-50', border: 'border-green-200', header: 'bg-green-100', text: 'text-green-800', icon: '⚡' },
            { bg: 'bg-purple-50', border: 'border-purple-200', header: 'bg-purple-100', text: 'text-purple-800', icon: '🎯' },
            { bg: 'bg-orange-50', border: 'border-orange-200', header: 'bg-orange-100', text: 'text-orange-800', icon: '🚀' },
            { bg: 'bg-gray-50', border: 'border-gray-200', header: 'bg-gray-100', text: 'text-gray-800', icon: '📋' }
        ];

        return Object.entries(categoriesByProcess)
            .map(([processId, group], index) => {
                const colorScheme = processColors[index % processColors.length];
                return `
                    <div class="process-group ${colorScheme.bg} ${colorScheme.border} border rounded-xl overflow-hidden shadow-sm" data-process="${processId}">
                        <div class="${colorScheme.header} px-6 py-4 border-b ${colorScheme.border}">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-3">
                                    <span class="text-2xl">${colorScheme.icon}</span>
                                    <div>
                                        <h3 class="text-lg font-semibold ${colorScheme.text}">${group.process.title}</h3>
                                        <p class="text-sm ${colorScheme.text} opacity-75">${group.categories.length} catégorie${group.categories.length > 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                                <button onclick="adminDashboard.toggleProcessGroup('${processId}')" class="text-sm ${colorScheme.text} hover:opacity-75 transition-opacity">
                                    <span class="process-toggle-text">Réduire</span>
                                    <svg class="process-toggle-icon w-4 h-4 ml-1 inline-block transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="process-categories-content bg-white">
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de création</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-200">
                                        ${group.categories.map(category => `
                                            <tr class="category-row hover:bg-gray-50" data-category-id="${category.id}">
                                                <td class="px-6 py-4 whitespace-nowrap">
                                                    <div class="flex items-center">
                                                        <div class="w-8 h-8 bg-gradient-to-r from-aptiv-orange-500 to-aptiv-orange-600 rounded-lg flex items-center justify-center">
                                                            <span class="text-white font-bold text-xs">📂</span>
                                                        </div>
                                                        <div class="ml-4">
                                                            <div class="text-sm font-medium text-gray-900">${category.title}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    ${new Date(category.created_at || category.create_at).toLocaleDateString('fr-FR')}
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button onclick="adminDashboard.editCategory(${category.id})" 
                                                            class="text-aptiv-orange-600 hover:text-aptiv-orange-900 transition-colors mr-3">
                                                        Modifier
                                                    </button>
                                                    <button onclick="adminDashboard.deleteCategory(${category.id})" 
                                                            class="text-red-600 hover:text-red-900 transition-colors">
                                                        Supprimer
                                                    </button>
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
    }

    renderMobileProcessGroups(categoriesByProcess) {
        const processColors = [
            { bg: 'bg-blue-50', border: 'border-blue-200', header: 'bg-blue-100', text: 'text-blue-800', icon: '🔄' },
            { bg: 'bg-green-50', border: 'border-green-200', header: 'bg-green-100', text: 'text-green-800', icon: '⚡' },
            { bg: 'bg-purple-50', border: 'border-purple-200', header: 'bg-purple-100', text: 'text-purple-800', icon: '🎯' },
            { bg: 'bg-orange-50', border: 'border-orange-200', header: 'bg-orange-100', text: 'text-orange-800', icon: '🚀' },
            { bg: 'bg-gray-50', border: 'border-gray-200', header: 'bg-gray-100', text: 'text-gray-800', icon: '📋' }
        ];

        return Object.entries(categoriesByProcess)
            .map(([processId, group], index) => {
                const colorScheme = processColors[index % processColors.length];
                return `
                    <div class="process-group-mobile ${colorScheme.bg} ${colorScheme.border} border rounded-xl overflow-hidden shadow-sm" data-process="${processId}">
                        <div class="${colorScheme.header} px-4 py-3 border-b ${colorScheme.border}">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-2">
                                    <span class="text-lg">${colorScheme.icon}</span>
                                    <div>
                                        <h3 class="text-base font-semibold ${colorScheme.text}">${group.process.title}</h3>
                                        <p class="text-xs ${colorScheme.text} opacity-75">${group.categories.length} catégorie${group.categories.length > 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                                <button onclick="adminDashboard.toggleProcessGroupMobile('${processId}')" class="text-sm ${colorScheme.text} hover:opacity-75 transition-opacity btn-touch">
                                    <span class="process-toggle-text-mobile">Réduire</span>
                                    <svg class="process-toggle-icon-mobile w-4 h-4 ml-1 inline-block transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="process-categories-content-mobile bg-white p-4 space-y-3">
                            ${group.categories.map(category => `
                                <div class="category-card bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200" data-category-id="${category.id}">
                                    <div class="flex items-center justify-between mb-2">
                                        <div class="flex items-center">
                                            <div class="w-8 h-8 bg-gradient-to-r from-aptiv-orange-500 to-aptiv-orange-600 rounded-lg flex items-center justify-center">
                                                <span class="text-white font-bold text-xs">📂</span>
                                            </div>
                                            <div class="ml-3">
                                                <h4 class="font-semibold text-gray-900 text-sm">${category.title}</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex justify-between items-center pt-2 border-t border-gray-100">
                                        <span class="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                                            ${new Date(category.created_at || category.create_at).toLocaleDateString('fr-FR')}
                                        </span>
                                        <div class="flex space-x-2">
                                            <button onclick="adminDashboard.editCategory(${category.id})" 
                                                    class="text-aptiv-orange-600 hover:text-aptiv-orange-700 text-xs font-medium transition-colors btn-touch">
                                                Modifier
                                            </button>
                                            <button onclick="adminDashboard.deleteCategory(${category.id})" 
                                                    class="text-red-600 hover:text-red-700 text-xs font-medium transition-colors btn-touch">
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join('');
    }

    toggleProcessGroup(processId) {
        const processGroup = document.querySelector(`[data-process="${processId}"]`);
        const content = processGroup?.querySelector('.process-categories-content');
        const toggleText = processGroup?.querySelector('.process-toggle-text');
        const toggleIcon = processGroup?.querySelector('.process-toggle-icon');

        if (content && toggleText && toggleIcon) {
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'block' : 'none';
            toggleText.textContent = isHidden ? 'Réduire' : 'Développer';
            toggleIcon.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(-90deg)';
        }
    }

    toggleProcessGroupMobile(processId) {
        const processGroup = document.querySelector(`[data-process="${processId}"].process-group-mobile`);
        const content = processGroup?.querySelector('.process-categories-content-mobile');
        const toggleText = processGroup?.querySelector('.process-toggle-text-mobile');
        const toggleIcon = processGroup?.querySelector('.process-toggle-icon-mobile');

        if (content && toggleText && toggleIcon) {
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'block' : 'none';
            toggleText.textContent = isHidden ? 'Réduire' : 'Développer';
            toggleIcon.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(-90deg)';
        }
    }

    async loadFormateurs() {
        const loadingEl = document.getElementById('formateurs-loading');
        const tableEl = document.getElementById('formateurs-table');
        const mobileEl = document.getElementById('formateurs-mobile');
        const emptyEl = document.getElementById('formateurs-empty');

        if (loadingEl) loadingEl.classList.remove('hidden');
        if (tableEl) tableEl.classList.add('hidden');
        if (mobileEl) mobileEl.classList.add('hidden');
        if (emptyEl) emptyEl.classList.add('hidden');

        try {
            const response = await fetch('/admin/api/formateurs');
            const result = await response.json();            if (result.success) {
                // Sort formateurs by identification in ascending order
                const sortedFormateurs = result.data.sort((a, b) => a.identification - b.identification);
                this.renderFormateurs(sortedFormateurs);
            } else {
                this.showMessage('Erreur lors du chargement des formateurs', 'error');
            }
        } catch (error) {
            this.showMessage('Une erreur est survenue', 'error');
            console.error('Error:', error);
        } finally {
            if (loadingEl) loadingEl.classList.add('hidden');
        }
    }

    renderFormateurs(formateurs) {
        const tbody = document.getElementById('formateurs-tbody');
        const mobileContainer = document.getElementById('formateurs-mobile');
        const tableEl = document.getElementById('formateurs-table');
        const mobileEl = document.getElementById('formateurs-mobile');
        const emptyEl = document.getElementById('formateurs-empty');

        if (formateurs.length === 0) {
            if (emptyEl) emptyEl.classList.remove('hidden');
            return;
        }

        // Desktop table view
        if (tbody) {
            tbody.innerHTML = formateurs.map(formateur => `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">${formateur.last_name}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">${formateur.name}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">${formateur.identification}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${new Date(formateur.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onclick="adminDashboard.editFormateur(${formateur.id})" class="text-aptiv-orange-600 hover:text-aptiv-orange-900 mr-3">
                            Modifier
                        </button>
                        <button onclick="adminDashboard.deleteFormateur(${formateur.id})" class="text-red-600 hover:text-red-900">
                            Supprimer
                        </button>
                    </td>
                </tr>
            `).join('');
            
            if (tableEl) tableEl.classList.remove('hidden');
        }        // Mobile card view
        if (mobileContainer) {
            mobileContainer.innerHTML = formateurs.map(formateur => `
                <div class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 card-hover">
                    <div class="flex justify-between items-start mb-3">
                        <div class="flex-1">
                            <h3 class="font-semibold text-gray-900 text-base leading-tight">${formateur.name} ${formateur.last_name}</h3>
                            <p class="text-sm text-gray-600 mt-1 flex items-center">
                                <svg class="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-4 0v2m0 0l2 2 4-4"></path>
                                </svg>
                                ID: ${formateur.identification}
                            </p>
                        </div>
                    </div>
                    <div class="flex justify-between items-center pt-3 border-t border-gray-100">
                        <span class="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">${new Date(formateur.created_at).toLocaleDateString('fr-FR')}</span>
                        <div class="flex space-x-3">
                            <button onclick="adminDashboard.editFormateur(${formateur.id})" class="text-aptiv-orange-600 hover:text-aptiv-orange-700 text-sm font-medium transition-colors btn-touch">
                                Modifier
                            </button>
                            <button onclick="adminDashboard.deleteFormateur(${formateur.id})" class="text-red-600 hover:text-red-700 text-sm font-medium transition-colors btn-touch">
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
            
            if (mobileEl) mobileEl.classList.remove('hidden');
        }
    }

    async loadTests() {
        const loadingEl = document.getElementById('tests-loading');
        const tableEl = document.getElementById('tests-table');
        const mobileEl = document.getElementById('tests-mobile');
        const emptyEl = document.getElementById('tests-empty');

        if (loadingEl) loadingEl.classList.remove('hidden');
        if (tableEl) tableEl.classList.add('hidden');
        if (mobileEl) mobileEl.classList.add('hidden');
        if (emptyEl) emptyEl.classList.add('hidden');

        try {
            const response = await fetch('/admin/api/tests');
            const result = await response.json();

            if (result.success) {
                this.renderTests(result.data);
                await this.loadUsersAndFormateursForTest();
                await this.loadRetakeStatistics(); // Load retake statistics
            } else {
                this.showMessage('Erreur lors du chargement des tests', 'error');
            }
        } catch (error) {
            this.showMessage('Une erreur est survenue', 'error');
            console.error('Error:', error);
        } finally {
            if (loadingEl) loadingEl.classList.add('hidden');
        }
    }

    renderTests(tests) {
        // Store original data for filtering (only when loading all tests)
        if (!this.originalTestsData || tests.length >= (this.originalTestsData?.length || 0)) {
            this.originalTestsData = tests;
            this.populateTestFilters(tests);
        }
        
        // Apply date sorting
        const dateSortFilter = document.getElementById('test-date-sort');
        const sortValue = dateSortFilter?.value || 'newest'; // Default to newest first
        if (sortValue) {
            tests = this.sortTestsByDate(tests, sortValue);
        }
        
        const tbody = document.getElementById('tests-tbody');
        const mobileContainer = document.getElementById('tests-mobile');
        const tableEl = document.getElementById('tests-table');
        const mobileEl = document.getElementById('tests-mobile');
        const emptyEl = document.getElementById('tests-empty');

        if (tests.length === 0) {
            if (emptyEl) emptyEl.classList.remove('hidden');
            return;
        }

        // Desktop table view
        if (tbody) {
            tbody.innerHTML = tests.map(test => {
                // Format categories
                const categoriesText = test.categories && test.categories.length > 0 
                    ? test.categories.map(c => c.title || c.name).join(', ')
                    : 'Aucune catégorie';
                
                // Determine row styling based on percentage
                let rowClass, percentageClass;
                if (test.pourcentage === 100) {
                    // Special styling for perfect score - Purple/Violet
                    rowClass = 'bg-gradient-to-r from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 border-l-4 border-purple-400';
                    percentageClass = 'text-purple-700 font-bold';
                } else if (test.pourcentage > 75) {
                    // Green for high scores
                    rowClass = 'bg-green-50 hover:bg-green-100';
                    percentageClass = 'text-green-700 font-bold';
                } else if (test.pourcentage >= 50) {
                    // Yellow/Orange for medium scores
                    rowClass = 'bg-orange-50 hover:bg-orange-100';
                    percentageClass = 'text-orange-700 font-bold';
                } else {
                    // Red for low scores
                    rowClass = 'bg-red-50 hover:bg-red-100';
                    percentageClass = 'text-red-700 font-bold';
                }
                    
                return `
                <tr class="${rowClass}">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">
                            ${test.user ? `${test.user.name} ${test.user.last_name}` : 'N/A'}
                            <div class="text-xs text-gray-500">ID: ${test.user ? test.user.identification : 'N/A'}</div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">
                            ${test.formateur ? `${test.formateur.name} ${test.formateur.last_name}` : 'N/A'}
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <div class="text-sm text-gray-900">${categoriesText}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center space-x-2">
                            <div class="text-lg percentage-icon icon-bounce">
                                ${test.pourcentage === 100 ? '🏆' : 
                                  test.pourcentage >= 90 ? '🌟' :
                                  test.pourcentage >= 80 ? '⭐' :
                                  test.pourcentage >= 70 ? '🎯' :
                                  test.pourcentage >= 60 ? '👍' :
                                  test.pourcentage >= 50 ? '📈' :
                                  test.pourcentage >= 40 ? '⚠️' : '❌'}
                            </div>
                            <div class="flex-1">
                                <div class="text-sm ${percentageClass} font-bold mb-1">
                                    ${test.pourcentage}%
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div class="percentage-progress-bar h-2 rounded-full ${
                                        test.pourcentage === 100 ? 'bg-gradient-to-r from-purple-500 to-violet-600' :
                                        test.pourcentage >= 90 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                                        test.pourcentage >= 80 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                                        test.pourcentage >= 70 ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                                        test.pourcentage >= 60 ? 'bg-gradient-to-r from-indigo-400 to-indigo-500' :
                                        test.pourcentage >= 50 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                                        test.pourcentage >= 40 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                        'bg-gradient-to-r from-red-400 to-red-500'
                                    }" style="width: ${test.pourcentage}%; --progress-width: ${test.pourcentage}%"></div>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${new Date(test.created_at || test.create_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onclick="adminDashboard.viewTest(${test.id})" class="text-blue-600 hover:text-blue-900" title="Voir les détails">
                            <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                        </button>
                    </td>
                </tr>
                `;
            }).join('');
            
            if (tableEl) tableEl.classList.remove('hidden');
        }        // Mobile card view
        if (mobileContainer) {
            mobileContainer.innerHTML = tests.map(test => {
                // Format categories
                const categoriesText = test.categories && test.categories.length > 0 
                    ? test.categories.map(c => c.title || c.name).join(', ')
                    : 'Aucune catégorie';
                
                // Determine card styling based on percentage
                let cardClass, percentageClass, dateBadgeClass, borderClass;
                if (test.pourcentage === 100) {
                    // Special styling for perfect score - Purple/Violet
                    cardClass = 'bg-gradient-to-br from-purple-50 to-violet-50 border-purple-300 hover:from-purple-100 hover:to-violet-100 shadow-lg';
                    percentageClass = 'text-purple-700';
                    dateBadgeClass = 'bg-purple-100 text-purple-800';
                    borderClass = 'border-purple-200';
                } else if (test.pourcentage > 75) {
                    // Green for high scores
                    cardClass = 'bg-green-50 border-green-200 hover:bg-green-100';
                    percentageClass = 'text-green-700';
                    dateBadgeClass = 'bg-green-100 text-green-800';
                    borderClass = 'border-green-200';
                } else if (test.pourcentage >= 50) {
                    // Orange for medium scores
                    cardClass = 'bg-orange-50 border-orange-200 hover:bg-orange-100';
                    percentageClass = 'text-orange-700';
                    dateBadgeClass = 'bg-orange-100 text-orange-800';
                    borderClass = 'border-orange-200';
                } else {
                    // Red for low scores
                    cardClass = 'bg-red-50 border-red-200 hover:bg-red-100';
                    percentageClass = 'text-red-700';
                    dateBadgeClass = 'bg-red-100 text-red-800';
                    borderClass = 'border-red-200';
                }
                
                return `
                <div class="${cardClass} border rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 card-hover">
                    <div class="flex justify-between items-start mb-3">
                        <div class="flex-1">
                            <h3 class="font-semibold text-gray-900 text-base leading-tight">
                                ${test.user ? `${test.user.name} ${test.user.last_name}` : 'N/A'}
                            </h3>
                            <p class="text-sm text-gray-600 mt-1 flex items-center">
                                <svg class="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                                Formateur: ${test.formateur ? `${test.formateur.name} ${test.formateur.last_name}` : 'N/A'}
                            </p>
                        </div>
                        <div class="text-right flex-shrink-0 ml-3">
                            <div class="flex items-center justify-end space-x-2 mb-2">
                                <div class="text-2xl percentage-icon icon-bounce">
                                    ${test.pourcentage === 100 ? '🏆' : 
                                      test.pourcentage >= 90 ? '🌟' :
                                      test.pourcentage >= 80 ? '⭐' :
                                      test.pourcentage >= 70 ? '🎯' :
                                      test.pourcentage >= 60 ? '👍' :
                                      test.pourcentage >= 50 ? '📈' :
                                      test.pourcentage >= 40 ? '⚠️' : '❌'}
                                </div>
                                <div class="text-lg font-bold ${percentageClass}">
                                    ${test.pourcentage}%
                                </div>
                            </div>
                            <div class="w-20 bg-gray-200 rounded-full h-2 mb-1">
                                <div class="percentage-progress-bar h-2 rounded-full ${
                                    test.pourcentage === 100 ? 'bg-gradient-to-r from-purple-500 to-violet-600' :
                                    test.pourcentage >= 90 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                                    test.pourcentage >= 80 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                                    test.pourcentage >= 70 ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                                    test.pourcentage >= 60 ? 'bg-gradient-to-r from-indigo-400 to-indigo-500' :
                                    test.pourcentage >= 50 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                                    test.pourcentage >= 40 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                    'bg-gradient-to-r from-red-400 to-red-500'
                                }" style="width: ${test.pourcentage}%; --progress-width: ${test.pourcentage}%"></div>
                            </div>
                            <div class="text-xs text-gray-600 mt-1 performance-badge">
                                ${test.pourcentage === 100 ? 'Parfait!' : 
                                  test.pourcentage >= 90 ? 'Exceptionnel' :
                                  test.pourcentage >= 80 ? 'Excellent' : 
                                  test.pourcentage >= 70 ? 'Très bien' :
                                  test.pourcentage >= 60 ? 'Bien' :
                                  test.pourcentage >= 50 ? 'Moyen' : 
                                  test.pourcentage >= 40 ? 'Insuffisant' : 'Faible'}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Category Info -->
                    <div class="mb-3">
                        <div class="flex items-center text-sm text-gray-600">
                            <svg class="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                            </svg>
                            Catégorie: <span class="font-medium">${categoriesText}</span>
                        </div>
                    </div>
                    
                    <div class="flex justify-between items-center pt-3 border-t ${borderClass}">
                        <span class="text-xs font-medium ${dateBadgeClass} px-2 py-1 rounded-md">${new Date(test.created_at || test.create_at).toLocaleDateString('fr-FR')}</span>
                        <div class="flex space-x-3">
                            <button onclick="adminDashboard.viewTest(${test.id})" class="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors btn-touch" title="Voir les détails">
                                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                                Voir
                            </button>
                        </div>
                    </div>
                </div>
                `;
            }).join('');
            
            if (mobileEl) mobileEl.classList.remove('hidden');
        }    }

    sortTestsByDate(tests, sortOrder) {
        return [...tests].sort((a, b) => {
            const dateA = new Date(a.created_at || a.create_at);
            const dateB = new Date(b.created_at || b.create_at);
            
            if (sortOrder === 'newest') {
                return dateB - dateA; // Newest first (descending)
            } else if (sortOrder === 'oldest') {
                return dateA - dateB; // Oldest first (ascending)
            }
            return 0; // No sorting
        });
    }

    populateTestFilters(tests) {
        // Populate formateur filter
        const formateurFilter = document.getElementById('test-formateur-filter');
        if (formateurFilter) {
            const formateurs = [...new Map(tests.filter(t => t.formateur).map(t => [t.formateur.id, t.formateur])).values()];
            formateurFilter.innerHTML = '<option value="">Tous les formateurs</option>' +
                formateurs.map(f => `<option value="${f.id}">${f.name} ${f.last_name}</option>`).join('');
        }

        // Populate process filter
        const processFilter = document.getElementById('test-process-filter');
        if (processFilter) {
            const processes = [];
            tests.forEach(test => {
                if (test.processes) {
                    test.processes.forEach(process => {
                        if (!processes.find(p => p.id === process.id)) {
                            processes.push(process);
                        }
                    });
                }
            });
            processFilter.innerHTML = '<option value="">Tous les processus</option>' +
                processes.map(p => `<option value="${p.id}">${p.title}</option>`).join('');
        }

        // Populate category filter
        const categoryFilter = document.getElementById('test-category-filter');
        if (categoryFilter) {
            const categories = [];
            tests.forEach(test => {
                if (test.categories) {
                    test.categories.forEach(category => {
                        if (!categories.find(c => c.id === category.id)) {
                            categories.push(category);
                        }
                    });
                }
            });
            categoryFilter.innerHTML = '<option value="">Toutes les catégories</option>' +
                categories.map(c => `<option value="${c.id}">${c.title}</option>`).join('');
        }
    }

    // Categories Management
    openCategoryModal(categoryId = null) {
        const modal = document.getElementById('category-modal');
        const title = document.getElementById('category-modal-title');
        const form = document.getElementById('category-form');
        
        if (categoryId) {
            // Edit mode
            title.textContent = 'Modifier la catégorie';
            this.loadCategoryForEdit(categoryId);
        } else {
            // Add mode
            title.textContent = 'Ajouter une catégorie';
            form.reset();
            document.getElementById('category-id').value = '';
        }
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    closeCategoryModal() {
        const modal = document.getElementById('category-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    async handleCategorySubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const categoryId = document.getElementById('category-id').value;
        const isEdit = !!categoryId;
        
        const url = isEdit ? `/admin/api/categories/${categoryId}` : '/admin/api/categories';
        const method = isEdit ? 'PUT' : 'POST';
        
        try {
            this.showLoading();
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Object.fromEntries(formData))
            });

            const result = await response.json();            if (result.success) {
                this.showMessage(result.message);
                this.closeCategoryModal();
                this.loadCategories();
            } else {
                if (result.errors) {
                    // Handle validation errors
                    const errorMessages = Object.values(result.errors).flat().join('<br>');
                    this.showMessage(errorMessages, 'error');
                } else {
                    this.showMessage(result.message, 'error');
                }
            }
        } catch (error) {
            this.showMessage('Une erreur est survenue', 'error');
            console.error('Error:', error);
        } finally {
            this.hideLoading();
        }
    }

    async loadCategoryForEdit(categoryId) {
        try {
            const response = await fetch(`/admin/api/categories`);
            const result = await response.json();
            
            if (result.success) {
                const category = result.data.find(c => c.id == categoryId);                if (category) {
                    document.getElementById('category-id').value = category.id;
                    document.getElementById('category-title').value = category.title;
                    document.getElementById('category-process').value = category.process_id;
                }
            }
        } catch (error) {
            console.error('Error loading category:', error);
        }
    }

    async deleteCategory(categoryId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
            return;
        }

        try {
            this.showLoading();
            
            const response = await fetch(`/admin/api/categories/${categoryId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                }
            });

            const result = await response.json();

            if (result.success) {
                this.showMessage(result.message);
                this.loadCategories();
            } else {
                this.showMessage(result.message, 'error');
            }
        } catch (error) {
            this.showMessage('Une erreur est survenue', 'error');
            console.error('Error:', error);
        } finally {
            this.hideLoading();
        }
    }

    editCategory(categoryId) {
        this.openCategoryModal(categoryId);
    }    async loadProcessesForFilter() {
        try {
            const response = await fetch('/admin/api/processes');
            const result = await response.json();
              if (result.success) {
                // Populate the category modal dropdown
                const select = document.getElementById('category-process');
                if (select) {
                    select.innerHTML = '<option value="">Sélectionner un processus</option>' +
                        result.data.map(process => `<option value="${process.id}">${process.title}</option>`).join('');
                }
                  // Populate the filter dropdown
                const filterSelect = document.getElementById('process-filter');
                if (filterSelect) {
                    filterSelect.innerHTML = '<option value="">Tous les processus</option>' +
                        result.data.map(process => `<option value="${process.id}">${process.title}</option>`).join('');
                }
            }
        } catch (error) {
            console.error('Error loading processes:', error);
        }
    }

    // Formateurs Management
    openFormateurModal(formateurId = null) {
        const modal = document.getElementById('formateur-modal');
        const title = document.getElementById('formateur-modal-title');
        const form = document.getElementById('formateur-form');
        
        if (formateurId) {
            // Edit mode
            title.textContent = 'Modifier le formateur';
            this.loadFormateurForEdit(formateurId);
        } else {
            // Add mode
            title.textContent = 'Ajouter un formateur';
            form.reset();
            document.getElementById('formateur-id').value = '';
        }
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    closeFormateurModal() {
        const modal = document.getElementById('formateur-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    async handleFormateurSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const formateurId = document.getElementById('formateur-id').value;
        const isEdit = !!formateurId;
        
        const url = isEdit ? `/admin/api/formateurs/${formateurId}` : '/admin/api/formateurs';
        const method = isEdit ? 'PUT' : 'POST';
        
        try {
            this.showLoading();
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Object.fromEntries(formData))
            });

            const result = await response.json();            if (result.success) {
                this.showMessage(result.message);
                this.closeFormateurModal();
                this.loadFormateurs();
            } else {
                if (result.errors) {
                    // Handle validation errors
                    const errorMessages = Object.values(result.errors).flat().join('<br>');
                    this.showMessage(errorMessages, 'error');
                } else {
                    this.showMessage(result.message, 'error');
                }
            }
        } catch (error) {
            this.showMessage('Une erreur est survenue', 'error');
            console.error('Error:', error);
        } finally {
            this.hideLoading();
        }
    }

    async loadFormateurForEdit(formateurId) {
        try {
            const response = await fetch(`/admin/api/formateurs`);
            const result = await response.json();
            
            if (result.success) {
                const formateur = result.data.find(f => f.id == formateurId);
                if (formateur) {
                    document.getElementById('formateur-id').value = formateur.id;
                    document.getElementById('formateur-name').value = formateur.name;
                    document.getElementById('formateur-last-name').value = formateur.last_name;
                    document.getElementById('formateur-identification').value = formateur.identification;
                }
            }
        } catch (error) {
            console.error('Error loading formateur:', error);
        }
    }

    async deleteFormateur(formateurId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce formateur ?')) {
            return;
        }

        try {
            this.showLoading();
            
            const response = await fetch(`/admin/api/formateurs/${formateurId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                }
            });

            const result = await response.json();

            if (result.success) {
                this.showMessage(result.message);
                this.loadFormateurs();
            } else {
                this.showMessage(result.message, 'error');
            }
        } catch (error) {
            this.showMessage('Une erreur est survenue', 'error');
            console.error('Error:', error);
        } finally {
            this.hideLoading();
        }
    }

    editFormateur(formateurId) {
        this.openFormateurModal(formateurId);
    }

    // Tests Management
    openTestModal(testId = null) {
        const modal = document.getElementById('test-modal');
        const title = document.getElementById('test-modal-title');
        const form = document.getElementById('test-form');
        
        if (testId) {
            // Edit mode
            title.textContent = 'Modifier le test';
            this.loadTestForEdit(testId);
        } else {
            // Add mode
            title.textContent = 'Ajouter un test';
            form.reset();
            document.getElementById('test-id').value = '';
        }
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    closeTestModal() {
        const modal = document.getElementById('test-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    async handleTestSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const testId = document.getElementById('test-id').value;
        const isEdit = !!testId;
        
        const url = isEdit ? `/admin/api/tests/${testId}` : '/admin/api/tests';
        const method = isEdit ? 'PUT' : 'POST';
        
        try {
            this.showLoading();
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Object.fromEntries(formData))
            });

            const result = await response.json();            if (result.success) {
                this.showMessage(result.message);
                this.closeTestModal();
                this.loadTests();
            } else {
                if (result.errors) {
                    // Handle validation errors
                    const errorMessages = Object.values(result.errors).flat().join('<br>');
                    this.showMessage(errorMessages, 'error');
                } else {
                    this.showMessage(result.message, 'error');
                }
            }
        } catch (error) {
            this.showMessage('Une erreur est survenue', 'error');
            console.error('Error:', error);
        } finally {
            this.hideLoading();
        }
    }

    async loadTestForEdit(testId) {
        try {
            const response = await fetch(`/admin/api/tests`);
            const result = await response.json();
            
            if (result.success) {
                const test = result.data.find(t => t.id == testId);                if (test) {
                    document.getElementById('test-id').value = test.id;
                    document.getElementById('test-user').value = test.user_id;
                    document.getElementById('test-formateur').value = test.formateur_id;
                    document.getElementById('test-description').value = test.description || '';
                    document.getElementById('test-resultat').value = test.resultat;
                    document.getElementById('test-pourcentage').value = test.pourcentage;
                }
            }
        } catch (error) {
            console.error('Error loading test:', error);
        }
    }

    async deleteTest(testId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce test ?')) {
            return;
        }

        try {
            this.showLoading();
            
            const response = await fetch(`/admin/api/tests/${testId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                }
            });

            const result = await response.json();

            if (result.success) {
                this.showMessage(result.message);
                this.loadTests();
            } else {
                this.showMessage(result.message, 'error');
            }
        } catch (error) {
            this.showMessage('Une erreur est survenue', 'error');
            console.error('Error:', error);
        } finally {
            this.hideLoading();
        }
    }

    editTest(testId) {
        this.openTestModal(testId);
    }

    async viewTest(testId) {
        try {
            // Get test details
            const response = await fetch(`/admin/api/tests/${testId}`);
            const result = await response.json();
            
            if (result.success) {
                this.showTestDetailsModal(result.data);
            } else {
                this.showMessage('Erreur lors du chargement des détails du test', 'error');
            }
        } catch (error) {
            this.showMessage('Une erreur est survenue', 'error');
            console.error('Error:', error);
        }
    }

    showTestDetailsModal(test) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('test-details-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'test-details-modal';
            modal.className = 'modal fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50';
            modal.innerHTML = `
                <div class="modal-body bg-white rounded-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
                    <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 class="text-lg font-medium text-gray-900">Détails du Test</h3>
                        <button onclick="adminDashboard.closeTestDetailsModal()" class="text-gray-400 hover:text-gray-600">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <div id="test-details-content" class="p-6">
                        <!-- Content will be populated dynamically -->
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        // Populate content
        const content = document.getElementById('test-details-content');
        content.innerHTML = `
            <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
                            <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            Informations Utilisateur
                        </h4>
                        <div class="space-y-2">
                            <div>
                                <span class="text-sm font-medium text-gray-700">Nom:</span>
                                <span class="text-sm text-gray-900 ml-2">${test.user ? `${test.user.name} ${test.user.last_name}` : 'N/A'}</span>
                            </div>
                            ${test.user?.email ? `
                            <div>
                                <span class="text-sm font-medium text-gray-700">Email:</span>
                                <span class="text-sm text-gray-900 ml-2">${test.user.email}</span>
                            </div>
                            ` : ''}
                        </div>
                    </div>

                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
                            <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                            </svg>
                            Informations Formateur
                        </h4>
                        <div class="space-y-2">
                            <div>
                                <span class="text-sm font-medium text-gray-700">Nom:</span>
                                <span class="text-sm text-gray-900 ml-2">${test.formateur ? `${test.formateur.name} ${test.formateur.last_name}` : 'N/A'}</span>
                            </div>
                            ${test.formateur?.email ? `
                            <div>
                                <span class="text-sm font-medium text-gray-700">Email:</span>
                                <span class="text-sm text-gray-900 ml-2">${test.formateur.email}</span>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>

                <!-- Process and Category Information -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
                            <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                            </svg>
                            Processus
                        </h4>
                        <div class="space-y-2">
                            ${test.processes && test.processes.length > 0 ? 
                                test.processes.map(process => `
                                    <div class="bg-white p-3 rounded border-l-4 border-blue-500">
                                        <div class="font-medium text-gray-900">${process.title}</div>
                                        ${process.description ? `<div class="text-sm text-gray-600 mt-1">${process.description}</div>` : ''}
                                    </div>
                                `).join('') 
                                : '<div class="text-sm text-gray-500 italic">Aucun processus associé</div>'
                            }
                        </div>
                    </div>

                    <div class="bg-green-50 p-4 rounded-lg">
                        <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
                            <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                            </svg>
                            Catégories
                        </h4>
                        <div class="space-y-2">
                            ${test.categories && test.categories.length > 0 ? 
                                test.categories.map(category => `
                                    <div class="bg-white p-3 rounded border-l-4 border-green-500">
                                        <div class="font-medium text-gray-900">${category.title}</div>
                                        ${category.process ? `<div class="text-sm text-gray-600 mt-1">Processus: ${category.process.title}</div>` : ''}
                                    </div>
                                `).join('') 
                                : '<div class="text-sm text-gray-500 italic">Aucune catégorie associée</div>'
                            }
                        </div>
                    </div>
                </div>

                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
                        <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        Détails du Test
                    </h4>
                    <div class="space-y-3">
                        ${test.description ? `
                        <div>
                            <span class="text-sm font-medium text-gray-700">Description:</span>
                            <div class="text-sm text-gray-900 mt-1 p-3 bg-white rounded border">${test.description}</div>
                        </div>
                        ` : ''}
                        
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="text-center p-3 bg-white rounded border">
                                <div class="text-2xl font-bold ${test.resultat >= 70 ? 'text-green-600' : test.resultat >= 50 ? 'text-yellow-600' : 'text-red-600'}">${test.resultat}</div>
                                <div class="text-sm text-gray-600">Résultat</div>
                            </div>
                            <div class="text-center p-3 bg-white rounded border">
                                <div class="text-2xl font-bold text-blue-600">${test.pourcentage}%</div>
                                <div class="text-sm text-gray-600">Pourcentage</div>
                            </div>
                            <div class="text-center p-3 bg-white rounded border">
                                <div class="text-sm font-bold text-gray-900">${new Date(test.created_at || test.create_at).toLocaleDateString('fr-FR', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</div>
                                <div class="text-sm text-gray-600">Date du Test</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button onclick="adminDashboard.editTest(${test.id}); adminDashboard.closeTestDetailsModal();" 
                            class="bg-aptiv-orange-600 hover:bg-aptiv-orange-700 text-white px-4 py-2 rounded-md transition-colors">
                        Modifier ce Test
                    </button>
                    <button onclick="adminDashboard.closeTestDetailsModal()" 
                            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                        Fermer
                    </button>
                </div>
            </div>
        `;

        // Show modal
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    closeTestDetailsModal() {
        const modal = document.getElementById('test-details-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }

    async loadUsersAndFormateursForTest() {
        try {
            // Load users
            const usersResponse = await fetch('/admin/api/users');
            const usersResult = await usersResponse.json();
              if (usersResult.success) {
                const userSelect = document.getElementById('test-user');
                if (userSelect) {
                    userSelect.innerHTML = '<option value="">Sélectionner un utilisateur</option>' +
                        usersResult.data.map(user => `<option value="${user.id}">${user.name} ${user.last_name}</option>`).join('');
                }
            }

            // Load formateurs
            const formateursResponse = await fetch('/admin/api/formateurs');
            const formateursResult = await formateursResponse.json();
            
            if (formateursResult.success) {
                const formateurSelect = document.getElementById('test-formateur');
                if (formateurSelect) {
                    formateurSelect.innerHTML = '<option value="">Sélectionner un formateur</option>' +
                        formateursResult.data.map(formateur => `<option value="${formateur.id}">${formateur.name} ${formateur.last_name}</option>`).join('');
                }
            }
        } catch (error) {
            console.error('Error loading users and formateurs:', error);
        }
    }

    async loadRetakeStatistics() {
        try {
            const response = await fetch('/admin/dashboard-data');
            const result = await response.json();
            
            if (result.success && result.data.retakeStats) {
                const retakeStats = result.data.retakeStats;
                
                // Update the retake statistics in the UI
                const totalRetakesEl = document.getElementById('total-retakes');
                const usersWithRetakesEl = document.getElementById('users-with-retakes');
                const retakeRateEl = document.getElementById('retake-rate');
                
                if (totalRetakesEl) {
                    totalRetakesEl.textContent = retakeStats.total_retakes || 0;
                }
                
                if (usersWithRetakesEl) {
                    usersWithRetakesEl.textContent = retakeStats.users_with_retakes || 0;
                }
                
                if (retakeRateEl) {
                    retakeRateEl.textContent = `${retakeStats.retake_rate || 0}%`;
                }
            }
        } catch (error) {
            console.error('Error loading retake statistics:', error);
            // Set default values on error
            const totalRetakesEl = document.getElementById('total-retakes');
            const usersWithRetakesEl = document.getElementById('users-with-retakes');
            const retakeRateEl = document.getElementById('retake-rate');
            
            if (totalRetakesEl) totalRetakesEl.textContent = '-';
            if (usersWithRetakesEl) usersWithRetakesEl.textContent = '-';
            if (retakeRateEl) retakeRateEl.textContent = '-%';
        }
    }

    // Search and Filter Functions
    filterCategories() {
        const searchTerm = document.getElementById('category-search')?.value.toLowerCase() || '';
        const processFilter = document.getElementById('process-filter')?.value || '';
        
        // Get all process groups
        const processGroups = document.querySelectorAll('.process-group, .process-group-mobile');
        
        processGroups.forEach(group => {
            const groupProcessId = group.getAttribute('data-process');
            let groupHasVisibleCategories = false;
            
            // Check process filter
            let processMatch = true;
            if (processFilter) {
                processMatch = groupProcessId === processFilter;
            }
            
            if (processMatch) {
                // Filter categories within this process group
                const categoryRows = group.querySelectorAll('.category-row, .category-card');
                
                categoryRows.forEach(categoryElement => {
                    const text = categoryElement.textContent.toLowerCase();
                    const searchMatch = text.includes(searchTerm);
                    
                    categoryElement.style.display = searchMatch ? '' : 'none';
                    if (searchMatch) {
                        groupHasVisibleCategories = true;
                    }
                });
                
                // Show/hide the entire group based on whether it has visible categories
                group.style.display = groupHasVisibleCategories ? '' : 'none';
            } else {
                // Hide the entire group if process doesn't match
                group.style.display = 'none';
            }
        });
    }

    filterFormateurs() {
        const searchTerm = document.getElementById('formateur-search')?.value.toLowerCase() || '';
        const tableRows = document.querySelectorAll('#formateurs-tbody tr');
        const mobileCards = document.querySelectorAll('#formateurs-mobile > div');

        // Filter table rows
        tableRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });

        // Filter mobile cards
        mobileCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    }

    filterTests() {
        const searchTerm = document.getElementById('test-search')?.value.toLowerCase() || '';
        const formateurFilter = document.getElementById('test-formateur-filter')?.value || '';
        const processFilter = document.getElementById('test-process-filter')?.value || '';
        const categoryFilter = document.getElementById('test-category-filter')?.value || '';
        const percentageFilter = document.getElementById('test-percentage-filter')?.value || '';
        const dateSortFilter = document.getElementById('test-date-sort')?.value || '';
        
        console.log('Filtering tests with:', { searchTerm, formateurFilter, processFilter, categoryFilter, percentageFilter, dateSortFilter });
        
        // Store the original test data for filtering
        if (!this.originalTestsData) {
            console.log('No original test data available for filtering');
            return; // No data to filter
        }
        
        // Filter the original data
        const filteredTests = this.originalTestsData.filter(test => {
            // Search term filter
            const searchText = `${test.user?.name || ''} ${test.user?.last_name || ''} ${test.formateur?.name || ''} ${test.formateur?.last_name || ''} ${test.description || ''}`.toLowerCase();
            const matchesSearch = !searchTerm || searchText.includes(searchTerm);
            
            // Formateur filter
            const matchesFormateur = !formateurFilter || (test.formateur && test.formateur.id.toString() === formateurFilter);
            
            // Process filter
            const matchesProcess = !processFilter || (test.processes && test.processes.some(p => p.id.toString() === processFilter));
            
            // Category filter
            const matchesCategory = !categoryFilter || (test.categories && test.categories.some(c => c.id.toString() === categoryFilter));
            
            // Percentage filter
            let matchesPercentage = true;
            if (percentageFilter) {
                const percentage = test.pourcentage || 0;
                switch (percentageFilter) {
                    case '75-100':
                        matchesPercentage = percentage >= 75 && percentage <= 100;
                        break;
                    case '50-74':
                        matchesPercentage = percentage >= 50 && percentage <= 74;
                        break;
                    case '0-49':
                        matchesPercentage = percentage >= 0 && percentage <= 49;
                        break;
                }
            }
            
            return matchesSearch && matchesFormateur && matchesProcess && matchesCategory && matchesPercentage;
        });
        
        console.log(`Filtered ${filteredTests.length} tests from ${this.originalTestsData.length} total tests`);
        
        // Re-render the filtered data
        this.renderTests(filteredTests);
    }

    // Users Management (Super Admin only)
    async loadUsers() {
        const loadingEl = document.getElementById('users-loading');
        const desktopEl = document.getElementById('users-desktop');
        const mobileEl = document.getElementById('users-mobile');
        const emptyEl = document.getElementById('users-empty');

        if (loadingEl) loadingEl.classList.remove('hidden');
        if (desktopEl) desktopEl.classList.add('hidden');
        if (mobileEl) mobileEl.classList.add('hidden');
        if (emptyEl) emptyEl.classList.add('hidden');

        try {
            const response = await fetch('/admin/api/users/all');
            const result = await response.json();

            if (result.success) {
                this.renderUsers(result.data);
            } else {
                this.showMessage('Erreur lors du chargement des utilisateurs', 'error');
            }
        } catch (error) {
            this.showMessage('Une erreur est survenue', 'error');
            console.error('Error:', error);
        } finally {
            if (loadingEl) loadingEl.classList.add('hidden');
        }
    }

    renderUsers(users) {
        const desktopContainer = document.getElementById('users-desktop');
        const mobileContainer = document.getElementById('users-mobile');
        const emptyEl = document.getElementById('users-empty');

        if (users.length === 0) {
            if (emptyEl) emptyEl.classList.remove('hidden');
            return;
        }

        // Group users by role
        const usersByRole = this.groupUsersByRole(users);

        // Render user statistics
        this.renderUserStats(usersByRole);

        // Render desktop role-based view
        if (desktopContainer) {
            desktopContainer.innerHTML = this.renderDesktopRoleGroups(usersByRole);
            desktopContainer.classList.remove('hidden');
        }

        // Render mobile role-based view
        if (mobileContainer) {
            mobileContainer.innerHTML = this.renderMobileRoleGroups(usersByRole);
            mobileContainer.classList.remove('hidden');
        }
    }

    renderUserStats(usersByRole) {
        const statsContainer = document.getElementById('users-stats');
        if (!statsContainer) return;

        const roleConfig = {
            'super admin': {
                title: 'Super Admins',
                icon: '👑',
                bgColor: 'bg-purple-50',
                iconBg: 'bg-purple-100',
                textColor: 'text-purple-800'
            },
            'admin': {
                title: 'Administrateurs',
                icon: '🛡️',
                bgColor: 'bg-blue-50',
                iconBg: 'bg-blue-100',
                textColor: 'text-blue-800'
            },
            'employee': {
                title: 'Employés',
                icon: '👤',
                bgColor: 'bg-green-50',
                iconBg: 'bg-green-100',
                textColor: 'text-green-800'
            },
            'no_role': {
                title: 'Sans Rôle',
                icon: '❓',
                bgColor: 'bg-gray-50',
                iconBg: 'bg-gray-100',
                textColor: 'text-gray-800'
            }
        };

        const totalUsers = Object.values(usersByRole).reduce((sum, users) => sum + users.length, 0);

        const statsHtml = Object.entries(usersByRole)
            .filter(([role, users]) => users.length > 0)
            .map(([role, users]) => {
                const config = roleConfig[role];
                const percentage = totalUsers > 0 ? Math.round((users.length / totalUsers) * 100) : 0;
                
                return `
                    <div class="stat-card ${config.bgColor} border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                        <div class="flex items-center justify-between mb-3">
                            <div class="${config.iconBg} w-10 h-10 rounded-lg flex items-center justify-center">
                                <span class="text-lg">${config.icon}</span>
                            </div>
                            <span class="text-xs ${config.textColor} font-medium">${percentage}%</span>
                        </div>
                        <div>
                            <p class="text-2xl font-bold text-gray-900 mb-1">${users.length}</p>
                            <p class="text-sm ${config.textColor} font-medium">${config.title}</p>
                        </div>
                    </div>
                `;
            }).join('');

        statsContainer.innerHTML = statsHtml;
        statsContainer.classList.remove('hidden');
    }

    groupUsersByRole(users) {
        const roleGroups = {
            'super admin': [],
            'admin': [],
            'employee': [],
            'no_role': []
        };

        users.forEach(user => {
            const roleName = user.role?.name?.toLowerCase() || 'no_role';
            if (roleGroups[roleName]) {
                roleGroups[roleName].push(user);
            } else {
                roleGroups['no_role'].push(user);
            }
        });

        return roleGroups;
    }

    renderDesktopRoleGroups(usersByRole) {
        const roleConfig = {
            'super admin': {
                title: 'Super Administrateurs',
                icon: '👑',
                bgColor: 'bg-purple-50',
                borderColor: 'border-purple-200',
                headerColor: 'bg-purple-100',
                textColor: 'text-purple-800',
                badgeColor: 'bg-purple-100 text-purple-800'
            },
            'admin': {
                title: 'Administrateurs',
                icon: '🛡️',
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200',
                headerColor: 'bg-blue-100',
                textColor: 'text-blue-800',
                badgeColor: 'bg-blue-100 text-blue-800'
            },
            'employee': {
                title: 'Employés',
                icon: '👤',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200',
                headerColor: 'bg-green-100',
                textColor: 'text-green-800',
                badgeColor: 'bg-green-100 text-green-800'
            },
            'no_role': {
                title: 'Sans Rôle',
                icon: '❓',
                bgColor: 'bg-gray-50',
                borderColor: 'border-gray-200',
                headerColor: 'bg-gray-100',
                textColor: 'text-gray-800',
                badgeColor: 'bg-gray-100 text-gray-800'
            }
        };

        return Object.entries(usersByRole)
            .filter(([role, users]) => users.length > 0)
            .map(([role, users]) => {
                const config = roleConfig[role];
                return `
                    <div class="role-group ${config.bgColor} ${config.borderColor} border rounded-xl overflow-hidden shadow-sm" data-role="${role}">
                        <div class="${config.headerColor} px-6 py-6 border-b ${config.borderColor}">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-3">
                                    <span class="text-2xl">${config.icon}</span>
                                    <div>
                                        <h3 class="text-lg font-semibold ${config.textColor}">${config.title}</h3>
                                        <p class="text-sm ${config.textColor} opacity-75">${users.length} utilisateur${users.length > 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                                <button onclick="adminDashboard.toggleRoleGroup('${role}')" class="text-sm ${config.textColor} hover:opacity-75 transition-opacity">
                                    <span class="role-toggle-text">Réduire</span>
                                    <svg class="role-toggle-icon w-4 h-4 ml-1 inline-block transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="role-users-content bg-white">
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identification</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'inscription</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-200">
                                        ${users.map(user => `
                                            <tr class="user-row hover:bg-gray-50" data-user-id="${user.id}">
                                                <td class="px-6 py-4 whitespace-nowrap">
                                                    <div class="flex items-center">
                                                        <div class="w-10 h-10 bg-gradient-to-r from-aptiv-orange-500 to-aptiv-orange-600 rounded-full flex items-center justify-center">
                                                            <span class="text-white font-bold text-sm">${user.name.charAt(0)}</span>
                                                        </div>
                                                        <div class="ml-4">
                                                            <div class="text-sm font-medium text-gray-900">${user.name} ${user.last_name}</div>
                                                            ${user.email ? `<div class="text-xs text-gray-500">${user.email}</div>` : ''}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap">
                                                    <div class="text-sm text-gray-900 font-mono">${user.identification}</div>
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    ${new Date(user.created_at).toLocaleDateString('fr-FR')}
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button onclick="adminDashboard.changeUserRole(${user.id})" 
                                                            class="text-aptiv-orange-600 hover:text-aptiv-orange-900 transition-colors">
                                                        Modifier le rôle
                                                    </button>
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
    }

    renderMobileRoleGroups(usersByRole) {
        const roleConfig = {
            'super admin': {
                title: 'Super Administrateurs',
                icon: '👑',
                bgColor: 'bg-purple-50',
                borderColor: 'border-purple-200',
                headerColor: 'bg-purple-100',
                textColor: 'text-purple-800',
                badgeColor: 'bg-purple-100 text-purple-800'
            },
            'admin': {
                title: 'Administrateurs',
                icon: '🛡️',
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200',
                headerColor: 'bg-blue-100',
                textColor: 'text-blue-800',
                badgeColor: 'bg-blue-100 text-blue-800'
            },
            'employee': {
                title: 'Employés',
                icon: '👤',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200',
                headerColor: 'bg-green-100',
                textColor: 'text-green-800',
                badgeColor: 'bg-green-100 text-green-800'
            },
            'no_role': {
                title: 'Sans Rôle',
                icon: '❓',
                bgColor: 'bg-gray-50',
                borderColor: 'border-gray-200',
                headerColor: 'bg-gray-100',
                textColor: 'text-gray-800',
                badgeColor: 'bg-gray-100 text-gray-800'
            }
        };

        return Object.entries(usersByRole)
            .filter(([role, users]) => users.length > 0)
            .map(([role, users]) => {
                const config = roleConfig[role];
                return `
                    <div class="role-group-mobile ${config.bgColor} ${config.borderColor} border rounded-xl overflow-hidden shadow-sm" data-role="${role}">
                        <div class="${config.headerColor} px-4 py-3 border-b ${config.borderColor}">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-2">
                                    <span class="text-lg">${config.icon}</span>
                                    <div>
                                        <h3 class="text-base font-semibold ${config.textColor}">${config.title}</h3>
                                        <p class="text-xs ${config.textColor} opacity-75">${users.length} utilisateur${users.length > 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                                <button onclick="adminDashboard.toggleRoleGroupMobile('${role}')" class="text-sm ${config.textColor} hover:opacity-75 transition-opacity btn-touch">
                                    <span class="role-toggle-text-mobile">Réduire</span>
                                    <svg class="role-toggle-icon-mobile w-4 h-4 ml-1 inline-block transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="role-users-content-mobile bg-white p-4 space-y-3">
                            ${users.map(user => `
                                <div class="user-card bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200" data-user-id="${user.id}">
                                    <div class="flex items-center justify-between mb-2">
                                        <div class="flex items-center">
                                            <div class="w-8 h-8 bg-gradient-to-r from-aptiv-orange-500 to-aptiv-orange-600 rounded-full flex items-center justify-center">
                                                <span class="text-white font-bold text-xs">${user.name.charAt(0)}</span>
                                            </div>
                                            <div class="ml-3">
                                                <h4 class="font-semibold text-gray-900 text-sm">${user.name} ${user.last_name}</h4>
                                                <p class="text-xs text-gray-600 font-mono">ID: ${user.identification}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex justify-between items-center pt-2 border-t border-gray-100">
                                        <span class="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                                            ${new Date(user.created_at).toLocaleDateString('fr-FR')}
                                        </span>
                                        <button onclick="adminDashboard.changeUserRole(${user.id})" 
                                                class="text-aptiv-orange-600 hover:text-aptiv-orange-700 text-xs font-medium transition-colors btn-touch">
                                            Modifier le rôle
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join('');
    }

    toggleRoleGroup(role) {
        const roleGroup = document.querySelector(`[data-role="${role}"]`);
        const content = roleGroup?.querySelector('.role-users-content');
        const toggleText = roleGroup?.querySelector('.role-toggle-text');
        const toggleIcon = roleGroup?.querySelector('.role-toggle-icon');

        if (content && toggleText && toggleIcon) {
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'block' : 'none';
            toggleText.textContent = isHidden ? 'Réduire' : 'Développer';
            toggleIcon.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(-90deg)';
        }
    }

    toggleRoleGroupMobile(role) {
        const roleGroup = document.querySelector(`[data-role="${role}"].role-group-mobile`);
        const content = roleGroup?.querySelector('.role-users-content-mobile');
        const toggleText = roleGroup?.querySelector('.role-toggle-text-mobile');
        const toggleIcon = roleGroup?.querySelector('.role-toggle-icon-mobile');

        if (content && toggleText && toggleIcon) {
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'block' : 'none';
            toggleText.textContent = isHidden ? 'Réduire' : 'Développer';
            toggleIcon.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(-90deg)';
        }
    }

    changeUserRole(userId) {
        this.openRoleModal(userId);
    }

    async openRoleModal(userId) {
        const modal = document.getElementById('role-modal');
        const title = document.getElementById('role-modal-title');
        const userInfo = document.getElementById('user-info');
        const deleteBtn = document.getElementById('delete-user-btn');
        
        try {
            // Fetch current user data
            const response = await fetch('/admin/api/users/all');
            const result = await response.json();
            
            if (result.success) {
                const user = result.data.find(u => u.id == userId);
                if (user) {
                    document.getElementById('user-id').value = user.id;
                    document.getElementById('new-role').value = user.role_id;
                    userInfo.textContent = `${user.name} ${user.last_name} (ID: ${user.identification})`;
                    
                    // Show/hide delete button based on user role
                    // Only show for Admin (role 2) and Employee (role 3)
                    if (deleteBtn) {
                        if (user.role_id == 2 || user.role_id == 3) {
                            deleteBtn.classList.remove('hidden');
                        } else {
                            deleteBtn.classList.add('hidden');
                        }
                    }
                    
                    title.textContent = 'Modifier le Rôle Utilisateur';
                    modal.classList.remove('hidden');
                    modal.classList.add('flex');
                }
            }
        } catch (error) {
            this.showMessage('Erreur lors du chargement des données utilisateur', 'error');
            console.error('Error:', error);
        }
    }

    closeRoleModal() {
        const modal = document.getElementById('role-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    confirmDeleteUser() {
        const userId = document.getElementById('user-id').value;
        const userInfo = document.getElementById('user-info').textContent;
        
        if (userId && userInfo) {
            this.currentUserForDeletion = { id: userId, info: userInfo };
            
            const deleteUserName = document.getElementById('delete-user-name');
            if (deleteUserName) {
                deleteUserName.textContent = userInfo;
            }
            
            const deleteModal = document.getElementById('delete-user-modal');
            if (deleteModal) {
                deleteModal.classList.remove('hidden');
                deleteModal.classList.add('flex');
            }
        }
    }

    closeDeleteUserModal() {
        const deleteModal = document.getElementById('delete-user-modal');
        if (deleteModal) {
            deleteModal.classList.add('hidden');
            deleteModal.classList.remove('flex');
        }
        this.currentUserForDeletion = null;
    }

    async deleteUser() {
        if (!this.currentUserForDeletion) return;
        
        const userId = this.currentUserForDeletion.id;
        
        try {
            this.showLoading();
            
            const response = await fetch(`/admin/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (result.success) {
                this.showMessage('Utilisateur supprimé avec succès', 'success');
                this.closeDeleteUserModal();
                this.closeRoleModal();
                this.loadUsers();
            } else {
                this.showMessage(result.message || 'Erreur lors de la suppression', 'error');
            }
        } catch (error) {
            console.error('Delete user error:', error);
            this.showMessage('Erreur lors de la suppression de l\'utilisateur', 'error');
        } finally {
            this.hideLoading();
        }
    }

    openAddUserModal() {
        const modal = document.getElementById('add-user-modal');
        const form = document.getElementById('add-user-form');
        
        if (!modal) {
            console.error('Add user modal not found!');
            return;
        }
        
        if (!form) {
            console.error('Add user form not found!');
            return;
        }
        
        // Reset form
        form.reset();
        
        // Show modal
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        // Setup form submission handler
        if (!form.hasEventListener) {
            form.addEventListener('submit', (e) => this.handleAddUserSubmit(e));
            form.hasEventListener = true;
        }
    }

    closeAddUserModal() {
        const modal = document.getElementById('add-user-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    async handleAddUserSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const identification = formData.get('identification');
        
        // Set password to identification number
        formData.set('password', identification);
        
        try {
            this.showLoading();
            
            const response = await fetch('/admin/api/users', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Object.fromEntries(formData))
            });

            const result = await response.json();

            if (result.success) {
                this.showMessage(result.message || 'Utilisateur ajouté avec succès');
                this.closeAddUserModal();
                this.loadUsers();
            } else {
                this.showMessage(result.message || 'Erreur lors de l\'ajout de l\'utilisateur', 'error');
            }
        } catch (error) {
            this.showMessage('Une erreur est survenue', 'error');
            console.error('Error:', error);
        } finally {
            this.hideLoading();
        }
    }

    async handleRoleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const userId = document.getElementById('user-id').value;
        
        try {
            this.showLoading();
            
            const response = await fetch(`/admin/api/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Object.fromEntries(formData))
            });

            const result = await response.json();

            if (result.success) {
                this.showMessage(result.message);
                this.closeRoleModal();
                this.loadUsers();
            } else {
                this.showMessage(result.message, 'error');
            }
        } catch (error) {
            this.showMessage('Une erreur est survenue', 'error');
            console.error('Error:', error);
        } finally {
            this.hideLoading();
        }
    }

    filterUsers() {
        const searchTerm = document.getElementById('user-search')?.value.toLowerCase() || '';
        const roleFilter = document.getElementById('role-filter')?.value || '';
        
        // Get all role groups
        const roleGroups = document.querySelectorAll('.role-group, .role-group-mobile');
        
        roleGroups.forEach(group => {
            const groupRole = group.getAttribute('data-role');
            let groupHasVisibleUsers = false;
            
            // Check role filter
            let roleMatch = true;
            if (roleFilter) {
                const roleNames = { '1': 'super admin', '2': 'admin', '3': 'employee' };
                roleMatch = groupRole === roleNames[roleFilter];
            }
            
            if (roleMatch) {
                // Filter users within this role group
                const userRows = group.querySelectorAll('.user-row, .user-card');
                
                userRows.forEach(userElement => {
                    const text = userElement.textContent.toLowerCase();
                    const searchMatch = text.includes(searchTerm);
                    
                    userElement.style.display = searchMatch ? '' : 'none';
                    if (searchMatch) {
                        groupHasVisibleUsers = true;
                    }
                });
                
                // Show/hide the entire group based on whether it has visible users
                group.style.display = groupHasVisibleUsers ? '' : 'none';
            } else {
                // Hide the entire group if role doesn't match
                group.style.display = 'none';
            }
        });
    }

    // Employees Management
    async loadEmployees() {
        const loadingEl = document.getElementById('employees-loading');
        const desktopEl = document.getElementById('employees-desktop');
        const mobileEl = document.getElementById('employees-mobile');
        const emptyEl = document.getElementById('employees-empty');

        if (loadingEl) loadingEl.classList.remove('hidden');
        if (desktopEl) desktopEl.classList.add('hidden');
        if (mobileEl) mobileEl.classList.add('hidden');
        if (emptyEl) emptyEl.classList.add('hidden');

        try {
            const response = await fetch('/admin/api/employees/all');
            const result = await response.json();

            if (result.success) {
                this.renderEmployees(result.data);
                this.setupEmployeeSearch();
            } else {
                this.showMessage('Erreur lors du chargement des employés', 'error');
            }
        } catch (error) {
            this.showMessage('Une erreur est survenue', 'error');
            console.error('Error:', error);
        } finally {
            if (loadingEl) loadingEl.classList.add('hidden');
        }
    }

    renderEmployees(employees) {
        const desktopContainer = document.getElementById('employees-desktop');
        const mobileContainer = document.getElementById('employees-mobile');
        const emptyEl = document.getElementById('employees-empty');

        if (employees.length === 0) {
            if (emptyEl) emptyEl.classList.remove('hidden');
            return;
        }

        // Group employees by role
        const employeesByRole = this.groupEmployeesByRole(employees);

        // Render employee statistics
        this.renderEmployeeStats(employeesByRole);

        // Render desktop role-based view
        if (desktopContainer) {
            desktopContainer.innerHTML = this.renderDesktopEmployeeRoleGroups(employeesByRole);
            desktopContainer.classList.remove('hidden');
        }

        // Render mobile role-based view
        if (mobileContainer) {
            mobileContainer.innerHTML = this.renderMobileEmployeeRoleGroups(employeesByRole);
            mobileContainer.classList.remove('hidden');
        }
    }

    renderEmployeeStats(employeesByRole) {
        const statsContainer = document.getElementById('employees-stats');
        if (!statsContainer) return;

        const roleConfig = {
            'super admin': {
                title: 'Super Admins',
                icon: '👑',
                bgColor: 'bg-purple-50',
                iconBg: 'bg-purple-100',
                textColor: 'text-purple-800'
            },
            'admin': {
                title: 'Administrateurs',
                icon: '🛡️',
                bgColor: 'bg-blue-50',
                iconBg: 'bg-blue-100',
                textColor: 'text-blue-800'
            },
            'employee': {
                title: 'Employés',
                icon: '👤',
                bgColor: 'bg-green-50',
                iconBg: 'bg-green-100',
                textColor: 'text-green-800'
            },
            'no_role': {
                title: 'Sans Rôle',
                icon: '❓',
                bgColor: 'bg-gray-50',
                iconBg: 'bg-gray-100',
                textColor: 'text-gray-800'
            }
        };

        const totalEmployees = Object.values(employeesByRole).reduce((sum, employees) => sum + employees.length, 0);

        const statsHtml = Object.entries(employeesByRole)
            .filter(([role, employees]) => employees.length > 0)
            .map(([role, employees]) => {
                const config = roleConfig[role];
                const percentage = totalEmployees > 0 ? Math.round((employees.length / totalEmployees) * 100) : 0;
                
                return `
                    <div class="stat-card ${config.bgColor} border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                        <div class="flex items-center justify-between mb-3">
                            <div class="${config.iconBg} w-10 h-10 rounded-lg flex items-center justify-center">
                                <span class="text-lg">${config.icon}</span>
                            </div>
                            <span class="text-xs ${config.textColor} font-medium">${percentage}%</span>
                        </div>
                        <div>
                            <p class="text-2xl font-bold text-gray-900 mb-1">${employees.length}</p>
                            <p class="text-sm ${config.textColor} font-medium">${config.title}</p>
                        </div>
                    </div>
                `;
            }).join('');

        statsContainer.innerHTML = statsHtml;
        statsContainer.classList.remove('hidden');
    }

    groupEmployeesByRole(employees) {
        const roleGroups = {
            'super admin': [],
            'admin': [],
            'employee': [],
            'no_role': []
        };

        employees.forEach(employee => {
            const roleName = employee.role?.name?.toLowerCase() || 'no_role';
            if (roleGroups[roleName]) {
                roleGroups[roleName].push(employee);
            } else {
                roleGroups['no_role'].push(employee);
            }
        });

        return roleGroups;
    }

    renderDesktopEmployeeRoleGroups(employeesByRole) {
        const roleConfig = {
            'super admin': {
                title: 'Super Administrateurs',
                icon: '👑',
                bgColor: 'bg-purple-50',
                borderColor: 'border-purple-200',
                headerColor: 'bg-purple-100',
                textColor: 'text-purple-800',
                badgeColor: 'bg-purple-100 text-purple-800'
            },
            'admin': {
                title: 'Administrateurs',
                icon: '🛡️',
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200',
                headerColor: 'bg-blue-100',
                textColor: 'text-blue-800',
                badgeColor: 'bg-blue-100 text-blue-800'
            },
            'employee': {
                title: 'Employés',
                icon: '👤',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200',
                headerColor: 'bg-green-100',
                textColor: 'text-green-800',
                badgeColor: 'bg-green-100 text-green-800'
            },
            'no_role': {
                title: 'Sans Rôle',
                icon: '❓',
                bgColor: 'bg-gray-50',
                borderColor: 'border-gray-200',
                headerColor: 'bg-gray-100',
                textColor: 'text-gray-800',
                badgeColor: 'bg-gray-100 text-gray-800'
            }
        };

        return Object.entries(employeesByRole)
            .filter(([role, employees]) => employees.length > 0)
            .map(([role, employees]) => {
                const config = roleConfig[role];
                
                return `
                    <div class="role-group ${config.bgColor} ${config.borderColor} border rounded-xl overflow-hidden" data-role="${role}">
                        <div class="${config.headerColor} px-6 py-4 border-b ${config.borderColor}">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center ${config.textColor}">
                                    <span class="text-xl mr-3">${config.icon}</span>
                                    <h3 class="text-lg font-semibold">${config.title} (${employees.length})</h3>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white">
                            <div class="overflow-x-auto">
                                <table class="w-full">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identification</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tests Effectués</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière Activité</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        ${employees.map(employee => `
                                            <tr class="employee-row hover:bg-gray-50 transition-colors" 
                                                data-employee-name="${employee.name.toLowerCase()} ${employee.last_name.toLowerCase()}" 
                                                data-employee-id="${employee.identification || ''}" 
                                                data-employee-email="${employee.email || ''}" 
                                                data-role="${role}">
                                                <td class="px-6 py-4 whitespace-nowrap">
                                                    <div class="flex items-center">
                                                        <div class="w-10 h-10 bg-gradient-to-r from-aptiv-orange-500 to-aptiv-orange-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                                                            ${employee.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div class="ml-4">
                                                            <div class="text-sm font-medium text-gray-900">${employee.name} ${employee.last_name}</div>
                                                            <div class="text-sm text-gray-500">
                                                                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.badgeColor}">
                                                                    ${config.title.replace('s', '')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${employee.identification}</td>
                                                <td class="px-6 py-4 whitespace-nowrap">
                                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${(employee.tests_count || 0) > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                                                        ${employee.tests_count || 0} test${(employee.tests_count || 0) !== 1 ? 's' : ''}
                                                    </span>
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${employee.last_test_date ? new Date(employee.last_test_date).toLocaleDateString('fr-FR') : 'Aucune'}</td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button onclick="adminDashboard.showEmployeeDetails(${employee.id})" 
                                                            class="text-aptiv-orange-600 hover:text-aptiv-orange-900 mr-3 transition-colors">
                                                        Voir détails
                                                    </button>
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
    }

    renderMobileEmployeeRoleGroups(employeesByRole) {
        const roleConfig = {
            'super admin': {
                title: 'Super Administrateurs',
                icon: '👑',
                bgColor: 'bg-purple-50',
                borderColor: 'border-purple-200',
                headerColor: 'bg-purple-100',
                textColor: 'text-purple-800',
                badgeColor: 'bg-purple-100 text-purple-800'
            },
            'admin': {
                title: 'Administrateurs',
                icon: '🛡️',
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200',
                headerColor: 'bg-blue-100',
                textColor: 'text-blue-800',
                badgeColor: 'bg-blue-100 text-blue-800'
            },
            'employee': {
                title: 'Employés',
                icon: '👤',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200',
                headerColor: 'bg-green-100',
                textColor: 'text-green-800',
                badgeColor: 'bg-green-100 text-green-800'
            },
            'no_role': {
                title: 'Sans Rôle',
                icon: '❓',
                bgColor: 'bg-gray-50',
                borderColor: 'border-gray-200',
                headerColor: 'bg-gray-100',
                textColor: 'text-gray-800',
                badgeColor: 'bg-gray-100 text-gray-800'
            }
        };

        return Object.entries(employeesByRole)
            .filter(([role, employees]) => employees.length > 0)
            .map(([role, employees]) => {
                const config = roleConfig[role];
                
                return `
                    <div class="role-group ${config.bgColor} ${config.borderColor} border rounded-xl overflow-hidden" data-role="${role}">
                        <div class="${config.headerColor} px-4 py-3 border-b ${config.borderColor}">
                            <div class="flex items-center ${config.textColor}">
                                <span class="text-lg mr-2">${config.icon}</span>
                                <h3 class="font-semibold">${config.title} (${employees.length})</h3>
                            </div>
                        </div>
                        <div class="bg-white p-4 space-y-4">
                            ${employees.map(employee => `
                                <div class="employee-card border border-gray-200 rounded-lg p-4" 
                                     data-employee-name="${employee.name.toLowerCase()} ${employee.last_name.toLowerCase()}" 
                                     data-employee-id="${employee.identification || ''}" 
                                     data-employee-email="${employee.email || ''}" 
                                     data-role="${role}">
                                    <div class="flex items-start justify-between">
                                        <div class="flex items-center space-x-3">
                                            <div class="w-10 h-10 bg-gradient-to-r from-aptiv-orange-500 to-aptiv-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                ${employee.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 class="font-semibold text-gray-900">${employee.name} ${employee.last_name}</h4>
                                                <p class="text-sm text-gray-500">ID: ${employee.identification}</p>
                                                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.badgeColor} mt-1">
                                                    ${config.title.replace('s', '')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mt-3 flex justify-between items-center">
                                        <div class="text-sm text-gray-600">
                                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${(employee.tests_count || 0) > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                                                ${employee.tests_count || 0} test${(employee.tests_count || 0) !== 1 ? 's' : ''}
                                            </span>
                                            <span class="ml-2">Dernière activité: ${employee.last_test_date ? new Date(employee.last_test_date).toLocaleDateString('fr-FR') : 'Aucune'}</span>
                                        </div>
                                        <button onclick="adminDashboard.showEmployeeDetails(${employee.id})" 
                                                class="text-aptiv-orange-600 hover:text-aptiv-orange-900 text-sm font-medium transition-colors">
                                            Voir détails
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join('');
    }

    setupEmployeeSearch() {
        const searchInput = document.getElementById('employee-search');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.filterEmployees());
        }
    }

    filterEmployees() {
        const searchQuery = document.getElementById('employee-search')?.value.toLowerCase() || '';
        const roleFilter = document.getElementById('employee-role-filter')?.value || '';
        
        // Filter employee rows in desktop view
        const desktopRows = document.querySelectorAll('#employees-desktop .employee-row');
        desktopRows.forEach(row => {
            const name = row.getAttribute('data-employee-name') || '';
            const identification = row.getAttribute('data-employee-id') || '';
            const email = row.getAttribute('data-employee-email') || '';
            const role = row.getAttribute('data-role') || '';
            
            // Search in name, identification, and email
            const searchText = `${name} ${identification} ${email}`.toLowerCase();
            const matchesSearch = !searchQuery || searchText.includes(searchQuery);
            const matchesRole = !roleFilter || this.getRoleId(role) === roleFilter;
            
            const shouldShow = matchesSearch && matchesRole;
            row.style.display = shouldShow ? '' : 'none';
        });
        
        // Filter employee cards in mobile view
        const mobileCards = document.querySelectorAll('#employees-mobile .employee-card');
        mobileCards.forEach(card => {
            const name = card.getAttribute('data-employee-name') || '';
            const identification = card.getAttribute('data-employee-id') || '';
            const email = card.getAttribute('data-employee-email') || '';
            const role = card.getAttribute('data-role') || '';
            
            // Search in name, identification, and email
            const searchText = `${name} ${identification} ${email}`.toLowerCase();
            const matchesSearch = !searchQuery || searchText.includes(searchQuery);
            const matchesRole = !roleFilter || this.getRoleId(role) === roleFilter;
            
            const shouldShow = matchesSearch && matchesRole;
            card.style.display = shouldShow ? '' : 'none';
        });

        // Hide/show role groups if all employees in that group are hidden
        const roleGroups = document.querySelectorAll('#employees-desktop .role-group, #employees-mobile .role-group');
        roleGroups.forEach(group => {
            const visibleEmployees = group.querySelectorAll('.employee-row:not([style*="display: none"]), .employee-card:not([style*="display: none"])');
            group.style.display = visibleEmployees.length > 0 ? '' : 'none';
        });
    }

    getRoleId(roleName) {
        const roleIds = {
            'super admin': '1',
            'admin': '2',
            'employee': '3'
        };
        return roleIds[roleName] || '';
    }

    getRoleName(roleId) {
        const roleNames = {
            '1': 'super admin',
            '2': 'admin',
            '3': 'employee'
        };
        return roleNames[roleId] || '';
    }

    async showEmployeeDetails(employeeId) {
        try {
            const response = await fetch(`/admin/api/employees/${employeeId}/details`);
            const result = await response.json();

            if (result.success) {
                this.openEmployeeDetailsModal(result.data);
            } else {
                this.showMessage('Erreur lors du chargement des détails', 'error');
            }
        } catch (error) {
            this.showMessage('Une erreur est survenue', 'error');
            console.error('Error:', error);
        }
    }

    openEmployeeDetailsModal(employeeData) {
        const modal = document.getElementById('employee-details-modal');
        const title = document.getElementById('employee-details-title');
        const info = document.getElementById('employee-info');
        const history = document.getElementById('employee-test-history');

        if (!modal || !title || !info || !history) return;

        // Set title
        title.textContent = `Détails de ${employeeData.employee.name} ${employeeData.employee.last_name}`;

        // Set employee info
        info.innerHTML = `
            <div class="flex items-center space-x-4">
                <div class="w-16 h-16 bg-gradient-to-r from-aptiv-orange-500 to-aptiv-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    ${employeeData.employee.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h3 class="text-xl font-bold text-gray-900">${employeeData.employee.name} ${employeeData.employee.last_name}</h3>
                    <p class="text-gray-600">ID: ${employeeData.employee.identification}</p>
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mt-1">
                        ${employeeData.employee.role ? employeeData.employee.role.name : 'N/A'}
                    </span>
                </div>
            </div>
            <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="text-center p-3 bg-white rounded-lg border">
                    <div class="text-2xl font-bold text-green-600">${employeeData.tests.length}</div>
                    <div class="text-sm text-gray-600">Tests Effectués</div>
                </div>
                <div class="text-center p-3 bg-white rounded-lg border">
                    <div class="text-2xl font-bold text-blue-600">${employeeData.statistics.average_score || 0}%</div>
                    <div class="text-sm text-gray-600">Score Moyen</div>
                </div>
                <div class="text-center p-3 bg-white rounded-lg border">
                    <div class="text-2xl font-bold text-purple-600">${employeeData.statistics.categories_tested || 0}</div>
                    <div class="text-sm text-gray-600">Catégories Testées</div>
                </div>
            </div>
        `;

        // Set test history
        if (employeeData.tests.length === 0) {
            history.innerHTML = `
                <div class="text-center py-8">
                    <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900">Aucun test effectué</h3>
                    <p class="text-gray-500 mt-1">Cet employé n'a pas encore passé de tests.</p>
                </div>
            `;
        } else {
            let historyHtml = '';
            employeeData.tests.forEach(test => {
                const date = new Date(test.created_at).toLocaleDateString('fr-FR');
                const time = new Date(test.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                const scoreColor = test.pourcentage >= 80 ? 'green' : test.pourcentage >= 60 ? 'yellow' : 'red';
                
                historyHtml += `
                    <div class="bg-white border border-gray-200 rounded-lg p-4">
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <h5 class="font-semibold text-gray-900">${test.category_name || 'Catégorie inconnue'}</h5>
                                <p class="text-sm text-gray-600 mt-1">${test.process_name || 'Processus inconnu'}</p>
                                <p class="text-sm text-gray-500 mt-1">Formateur: ${test.formateur ? test.formateur.name + ' ' + test.formateur.last_name : 'N/A'}</p>
                                <p class="text-xs text-gray-400 mt-2">${date} à ${time}</p>
                            </div>
                            <div class="text-right">
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${scoreColor}-100 text-${scoreColor}-800">
                                    ${test.pourcentage}%
                                </span>
                                <p class="text-xs text-gray-500 mt-1">${test.resultat}/${test.quzs ? test.quzs.length : 0} correct${test.resultat !== 1 ? 's' : ''}</p>
                            </div>
                        </div>
                    </div>
                `;
            });
            history.innerHTML = historyHtml;
        }

        // Show modal
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    closeEmployeeDetailsModal() {
        const modal = document.getElementById('employee-details-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }

    refreshEmployees() {
        this.loadEmployees();
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.adminDashboard = new AdminDashboard();
});

// Global functions for onclick handlers
function showSection(sectionName) {
    if (window.adminDashboard) {
        window.adminDashboard.showSection(sectionName);
    }
}

// Process functions
function openProcessModal(processId = null) {
    if (window.adminDashboard) {
        window.adminDashboard.openProcessModal(processId);
    }
}

function closeProcessModal() {
    if (window.adminDashboard) {
        window.adminDashboard.closeProcessModal();
    }
}

function loadProcesses() {
    if (window.adminDashboard) {
        window.adminDashboard.loadProcesses();
    }
}

// Category functions
function openCategoryModal(categoryId = null) {
    if (window.adminDashboard) {
        window.adminDashboard.openCategoryModal(categoryId);
    }
}

function closeCategoryModal() {
    if (window.adminDashboard) {
        window.adminDashboard.closeCategoryModal();
    }
}

function loadCategories() {
    if (window.adminDashboard) {
        window.adminDashboard.loadCategories();
    }
}

// Formateur functions
function openFormateurModal(formateurId = null) {
    if (window.adminDashboard) {
        window.adminDashboard.openFormateurModal(formateurId);
    }
}

function closeFormateurModal() {
    if (window.adminDashboard) {
        window.adminDashboard.closeFormateurModal();
    }
}

function loadFormateurs() {
    if (window.adminDashboard) {
        window.adminDashboard.loadFormateurs();
    }
}

// User Management functions (Super Admin only)
function loadUsers() {
    if (window.adminDashboard) {
        window.adminDashboard.loadUsers();
    }
}

function changeUserRole(userId) {
    if (window.adminDashboard) {
        window.adminDashboard.changeUserRole(userId);
    }
}

function closeRoleModal() {
    if (window.adminDashboard) {
        window.adminDashboard.closeRoleModal();
    }
}

function openAddUserModal() {
    if (window.adminDashboard) {
        window.adminDashboard.openAddUserModal();
    }
}

function closeAddUserModal() {
    if (window.adminDashboard) {
        window.adminDashboard.closeAddUserModal();
    }
}

function confirmDeleteUser() {
    if (window.adminDashboard) {
        window.adminDashboard.confirmDeleteUser();
    }
}

function closeDeleteUserModal() {
    if (window.adminDashboard) {
        window.adminDashboard.closeDeleteUserModal();
    }
}

function deleteUser() {
    if (window.adminDashboard) {
        window.adminDashboard.deleteUser();
    }
}

// Test functions
function openTestModal(testId = null) {
    if (window.adminDashboard) {
        window.adminDashboard.openTestModal(testId);
    }
}

function closeTestModal() {
    if (window.adminDashboard) {
        window.adminDashboard.closeTestModal();
    }
}

function loadTests() {
    if (window.adminDashboard) {
        window.adminDashboard.loadTests();
    }
}

// Employee functions
function loadEmployees() {
    if (window.adminDashboard) {
        window.adminDashboard.loadEmployees();
    }
}

function showEmployeeDetails(employeeId) {
    if (window.adminDashboard) {
        window.adminDashboard.showEmployeeDetails(employeeId);
    }
}

function closeEmployeeDetailsModal() {
    if (window.adminDashboard) {
        window.adminDashboard.closeEmployeeDetailsModal();
    }
}

function refreshEmployees() {
    if (window.adminDashboard) {
        window.adminDashboard.refreshEmployees();
    }
}
