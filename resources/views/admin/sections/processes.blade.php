<!-- Processes Management Section -->
<div class="space-y-6">
    <!-- Enhanced Header with Creative Search -->
    <div class="bg-gradient-to-r from-white via-green-50 to-blue-50 rounded-2xl shadow-lg border border-gray-200 p-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div class="text-center lg:text-left">
                <div class="flex items-center justify-center lg:justify-start gap-3 mb-2">
                    <div class="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-7l2 2-2 2m-14 4h14m-14 4h14"></path>
                        </svg>
                    </div>
                    <h2 class="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Gestion des Processus
                    </h2>
                </div>
                <p class="text-gray-600 text-sm lg:text-base">Gérez et organisez les processus avec leurs catégories associées</p>
            </div>
            
            <!-- Advanced Search Controls -->
            <div class="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                <div class="flex flex-col sm:flex-row gap-3">
                    <!-- Smart Search Input -->
                    <div class="relative group">
                        <input type="text" 
                               id="process-smart-search" 
                               placeholder="Recherche intelligente..." 
                               class="w-full sm:w-80 pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 text-sm group-hover:border-green-300">
                        <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <svg class="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>
                    
                    <!-- Filter Buttons -->
                    <div class="flex gap-2">
                        <button id="process-filter-toggle" class="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                            </svg>
                            Filtres
                        </button>
                        
                        <button onclick="openProcessModal()" class="px-4 py-3 bg-aptiv-orange-600 hover:bg-aptiv-orange-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Ajouter
                        </button>
                    </div>
                </div>
                
                <!-- Advanced Filters Panel -->
                <div id="process-filters-panel" class="hidden mt-4 pt-4 border-t border-gray-200">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-xs font-medium text-gray-700 mb-1">Catégories</label>
                            <select id="process-categories-filter" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm">
                                <option value="">Tous les processus</option>
                                <option value="0">Sans catégories</option>
                                <option value="1+">Avec catégories</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-xs font-medium text-gray-700 mb-1">Période</label>
                            <select id="process-period-filter" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm">
                                <option value="">Toutes les périodes</option>
                                <option value="today">Aujourd'hui</option>
                                <option value="week">Cette semaine</option>
                                <option value="month">Ce mois</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-xs font-medium text-gray-700 mb-1">Tri</label>
                            <select id="process-sort-filter" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm">
                                <option value="date_desc">Plus récents</option>
                                <option value="date_asc">Plus anciens</option>
                                <option value="title_asc">Titre A-Z</option>
                                <option value="title_desc">Titre Z-A</option>
                                <option value="categories_desc">Plus de catégories</option>
                                <option value="categories_asc">Moins de catégories</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-end mt-4">
                        <button onclick="clearProcessFilters()" class="text-sm text-gray-500 hover:text-gray-700">Effacer les filtres</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-green-100 text-sm font-medium">Total Processus</p>
                    <p class="text-2xl font-bold" id="total-processes">-</p>
                </div>
                <div class="p-3 bg-white/20 rounded-lg">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
            </div>
        </div>
        
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-blue-100 text-sm font-medium">Total Catégories</p>
                    <p class="text-2xl font-bold" id="total-categories">-</p>
                </div>
                <div class="p-3 bg-white/20 rounded-lg">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                    </svg>
                </div>
            </div>
        </div>
        
        <div class="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-6 text-white shadow-lg">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-yellow-100 text-sm font-medium">Ajoutés Aujourd'hui</p>
                    <p class="text-2xl font-bold" id="today-processes">-</p>
                </div>
                <div class="p-3 bg-white/20 rounded-lg">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                    </svg>
                </div>
            </div>
        </div>
        
        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-purple-100 text-sm font-medium">Moyenne Catégories</p>
                    <p class="text-2xl font-bold" id="average-categories">-</p>
                </div>
                <div class="p-3 bg-white/20 rounded-lg">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                </div>
            </div>
        </div>
    </div>    <!-- Loading State -->
    <div id="processes-loading" class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div class="spinner mx-auto mb-4"></div>
        <p class="text-gray-600">Chargement des processus...</p>
    </div>
    
    <!-- Empty State -->
    <div id="processes-empty" class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center hidden">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-7l2 2-2 2m-14 4h14m-14 4h14"></path>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun processus trouvé</h3>
        <p class="text-gray-500">Il n'y a pas de processus dans le système.</p>
    </div>

    <!-- Processes Table Container -->
    <div id="processes-container" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hidden">
        <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900">Liste des Processus</h3>
                <div class="flex items-center gap-4">
                    <span class="text-sm text-gray-500" id="processes-results-count">0 résultat(s)</span>
                    <div class="flex items-center gap-2">
                        <label class="text-sm text-gray-600">Afficher:</label>
                        <select id="processes-per-page" class="text-sm border border-gray-300 rounded px-2 py-1">
                            <option value="10">10</option>
                            <option value="25" selected>25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onclick="sortProcessTable('title')">
                            Titre
                            <svg class="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                            </svg>
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onclick="sortProcessTable('description')">
                            Description
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onclick="sortProcessTable('categories')">
                            Catégories
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onclick="sortProcessTable('date')">
                            Date de création
                        </th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody id="processes-table-body" class="bg-white divide-y divide-gray-200">
                    <!-- Processes will be populated here -->
                </tbody>
            </table>
        </div>
        
        <!-- Pagination -->
        <div class="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div class="flex items-center justify-between">
                <div class="text-sm text-gray-700">
                    Affichage <span id="processes-showing-from">1</span> à <span id="processes-showing-to">25</span> sur <span id="processes-total-results">0</span> résultats
                </div>
                <div class="flex items-center gap-2" id="processes-pagination-controls">
                    <!-- Pagination buttons will be generated here -->
                </div>
            </div>
        </div>
    </div>

    <!-- Mobile Cards View -->
    <div id="processes-mobile" class="mobile-view space-y-4 hidden">
        <!-- Mobile cards will be populated by JavaScript -->
    </div>
</div>

<!-- Process Modal -->
<div id="process-modal" class="modal fixed inset-0 bg-black bg-opacity-50 z-modal items-center justify-center hidden">
    <div class="modal-body bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-screen overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
                <h3 id="process-modal-title" class="text-lg font-semibold text-gray-900">Ajouter un processus</h3>
                <button onclick="closeProcessModal()" class="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        </div>
        
        <form id="process-form" class="p-6 space-y-4">
            <input type="hidden" id="process-id">
            
            <div>
                <label for="process-title" class="block text-sm font-medium text-gray-700 mb-2">Titre <span class="text-red-500">*</span></label>
                <input type="text" id="process-title" name="title" required 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aptiv-orange-500 focus:border-transparent text-sm">
            </div>
            
            <div>
                <label for="process-description" class="block text-sm font-medium text-gray-700 mb-2">Description <span class="text-red-500">*</span></label>
                <textarea id="process-description" name="description" rows="4" required 
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aptiv-orange-500 focus:border-transparent text-sm resize-none"></textarea>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button type="button" onclick="closeProcessModal()" 
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    Annuler
                </button>
                <button type="submit" 
                        class="px-4 py-2 text-sm font-medium text-white bg-aptiv-orange-600 hover:bg-aptiv-orange-700 rounded-lg transition-colors">
                    Enregistrer
                </button>
            </div>
        </form>
    </div>
</div>

<style>
.spinner {
    border: 2px solid #f3f4f6;
    border-top: 2px solid #3b82f6;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.mobile-view {
    display: none;
}

@media (max-width: 768px) {
    .desktop-table {
        display: none !important;
    }
    .mobile-view {
        display: block;
    }
}
</style>

<script>
// Processes Management JavaScript
let currentProcessPage = 1;
let processPerPage = 25;
let currentProcessSort = { field: 'date', direction: 'desc' };
let allProcesses = [];
let filteredProcesses = [];

// Initialize the processes section
document.addEventListener('DOMContentLoaded', function() {
    initializeProcessesSection();
    setupProcessEventListeners();
});

// Make functions globally available
window.loadProcessesData = loadProcessesData;
window.initializeProcessesSection = initializeProcessesSection;

function initializeProcessesSection() {
    console.log('Initializing Enhanced Processes Management Section...');
    // Load immediately if processes section is visible
    const processesSection = document.getElementById('processes-section');
    if (processesSection && !processesSection.classList.contains('hidden')) {
        loadProcessesData();
    }
}

function setupProcessEventListeners() {
    // Smart search
    const smartSearch = document.getElementById('process-smart-search');
    if (smartSearch) {
        smartSearch.addEventListener('input', debounce(handleProcessSmartSearch, 300));
    }
    
    // Filter toggle
    const filterToggle = document.getElementById('process-filter-toggle');
    if (filterToggle) {
        filterToggle.addEventListener('click', toggleProcessFiltersPanel);
    }
    
    // Filter controls
    ['process-categories-filter', 'process-period-filter', 'process-sort-filter'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', applyProcessFilters);
        }
    });
    
    // Per page selector
    const perPageSelect = document.getElementById('processes-per-page');
    if (perPageSelect) {
        perPageSelect.addEventListener('change', function() {
            processPerPage = parseInt(this.value);
            currentProcessPage = 1;
            renderProcessesTable();
        });
    }
}

function toggleProcessFiltersPanel() {
    const panel = document.getElementById('process-filters-panel');
    if (panel) {
        panel.classList.toggle('hidden');
    }
}

function loadProcessesData() {
    showProcessLoading();
    
    // Use the existing API endpoint
    fetch('/admin/api/processes')
        .then(response => response.json())
        .then(data => {
            console.log('Processes API Response:', data);
            if (data.success) {
                allProcesses = data.data || [];
                filteredProcesses = [...allProcesses];
                
                // Update stats based on loaded data
                updateProcessStatsFromData();
                renderProcessesTable();
            } else {
                console.log('Processes API Error:', data.message);
                showProcessError(data.message || 'Erreur lors du chargement des processus');
            }
        })
        .catch(error => {
            console.error('Error loading processes:', error);
            showProcessError('Erreur de connexion au serveur');
        })
        .finally(() => {
            hideProcessLoading();
        });
}

function updateProcessStatsFromData() {
    const totalProcesses = allProcesses.length;
    const todayProcesses = allProcesses.filter(process => {
        const processDate = new Date(process.created_at);
        const today = new Date();
        return processDate.toDateString() === today.toDateString();
    }).length;
    
    const totalCategories = allProcesses.reduce((sum, process) => sum + (process.categories_count || 0), 0);
    const averageCategories = totalProcesses > 0 ? (totalCategories / totalProcesses).toFixed(1) : 0;
    
    document.getElementById('total-processes').textContent = totalProcesses;
    document.getElementById('total-categories').textContent = totalCategories;
    document.getElementById('today-processes').textContent = todayProcesses;
    document.getElementById('average-categories').textContent = averageCategories;
}

function handleProcessSmartSearch() {
    const query = document.getElementById('process-smart-search').value.toLowerCase().trim();
    
    if (!query) {
        filteredProcesses = [...allProcesses];
    } else {
        filteredProcesses = allProcesses.filter(process => {
            const searchFields = [
                process.title || '',
                process.description || ''
            ];
            
            return searchFields.some(field => 
                field.toString().toLowerCase().includes(query)
            );
        });
    }
    
    currentProcessPage = 1;
    renderProcessesTable();
}

function applyProcessFilters() {
    const categoriesFilter = document.getElementById('process-categories-filter').value;
    const periodFilter = document.getElementById('process-period-filter').value;
    const sortFilter = document.getElementById('process-sort-filter').value;
    
    filteredProcesses = allProcesses.filter(process => {
        // Categories filter
        if (categoriesFilter) {
            const categoriesCount = process.categories_count || 0;
            switch(categoriesFilter) {
                case '0':
                    if (categoriesCount > 0) return false;
                    break;
                case '1+':
                    if (categoriesCount === 0) return false;
                    break;
            }
        }
        
        // Period filter
        if (periodFilter) {
            const processDate = new Date(process.created_at);
            const today = new Date();
            
            switch(periodFilter) {
                case 'today':
                    if (processDate.toDateString() !== today.toDateString()) return false;
                    break;
                case 'week':
                    const weekAgo = new Date(today);
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    if (processDate < weekAgo) return false;
                    break;
                case 'month':
                    const monthAgo = new Date(today);
                    monthAgo.setMonth(monthAgo.getMonth() - 1);
                    if (processDate < monthAgo) return false;
                    break;
            }
        }
        
        return true;
    });
    
    // Apply sorting
    if (sortFilter) {
        const [field, direction] = sortFilter.split('_');
        currentProcessSort = { field, direction };
    }
    
    currentProcessPage = 1;
    renderProcessesTable();
}

function clearProcessFilters() {
    document.getElementById('process-smart-search').value = '';
    document.getElementById('process-categories-filter').value = '';
    document.getElementById('process-period-filter').value = '';
    document.getElementById('process-sort-filter').value = 'date_desc';
    
    filteredProcesses = [...allProcesses];
    currentProcessSort = { field: 'date', direction: 'desc' };
    currentProcessPage = 1;
    renderProcessesTable();
}

function renderProcessesTable() {
    if (filteredProcesses.length === 0) {
        showProcessEmptyState();
        return;
    }
    
    showProcessesTable();
    
    // Sort processes
    const sortedProcesses = [...filteredProcesses].sort((a, b) => {
        let aVal, bVal;
        
        switch(currentProcessSort.field) {
            case 'title':
                aVal = a.title || '';
                bVal = b.title || '';
                break;
            case 'description':
                aVal = a.description || '';
                bVal = b.description || '';
                break;
            case 'categories':
                aVal = a.categories_count || 0;
                bVal = b.categories_count || 0;
                break;
            case 'date':
                aVal = new Date(a.created_at);
                bVal = new Date(b.created_at);
                break;
            default:
                aVal = a.id;
                bVal = b.id;
        }
        
        if (currentProcessSort.direction === 'asc') {
            return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        } else {
            return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
    });
    
    // Pagination
    const totalPages = Math.ceil(sortedProcesses.length / processPerPage);
    const startIndex = (currentProcessPage - 1) * processPerPage;
    const endIndex = startIndex + processPerPage;
    const paginatedProcesses = sortedProcesses.slice(startIndex, endIndex);
    
    // Update results count
    document.getElementById('processes-results-count').textContent = `${sortedProcesses.length} résultat(s)`;
    document.getElementById('processes-showing-from').textContent = startIndex + 1;
    document.getElementById('processes-showing-to').textContent = Math.min(endIndex, sortedProcesses.length);
    document.getElementById('processes-total-results').textContent = sortedProcesses.length;
    
    // Render table rows
    const tbody = document.getElementById('processes-table-body');
    if (tbody) {
        tbody.innerHTML = paginatedProcesses.map(process => createProcessTableRow(process)).join('');
    }
    
    // Render mobile cards
    const mobileContainer = document.getElementById('processes-mobile');
    if (mobileContainer) {
        mobileContainer.innerHTML = paginatedProcesses.map(process => createProcessMobileCard(process)).join('');
    }
    
    // Update pagination
    updateProcessPagination(totalPages);
}

function createProcessTableRow(process) {
    const categoriesCount = process.categories_count || 0;
    const formattedDate = formatDate(process.created_at);
    
    return `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${process.title}</div>
            </td>
            <td class="px-6 py-4">
                <div class="text-sm text-gray-900 max-w-xs truncate" title="${process.description}">${process.description}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoriesCount > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                    ${categoriesCount} catégorie${categoriesCount !== 1 ? 's' : ''}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${formattedDate}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">

                <button onclick="editProcess(${process.id})" class="text-aptiv-orange-600 hover:text-aptiv-orange-900 mr-3" title="Modifier">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                </button>
                <button onclick="deleteProcess(${process.id})" class="text-red-600 hover:text-red-900" title="Supprimer">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </td>
        </tr>
    `;
}

function createProcessMobileCard(process) {
    const categoriesCount = process.categories_count || 0;
    const formattedDate = formatDate(process.created_at);
    
    return `
        <div class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start mb-3">
                <h3 class="font-semibold text-gray-900 text-base">${process.title}</h3>
                <span class="ml-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${categoriesCount > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                    ${categoriesCount} cat.
                </span>
            </div>
            <p class="text-sm text-gray-600 mb-4 line-clamp-2">${process.description}</p>
            <div class="flex justify-between items-center pt-2 border-t border-gray-100">
                <span class="text-xs text-gray-500">${formattedDate}</span>
                <div class="flex space-x-3">
                    <button onclick="viewProcessDetails(${process.id})" class="text-blue-600 hover:text-blue-700 text-sm">Voir</button>
                    <button onclick="editProcess(${process.id})" class="text-aptiv-orange-600 hover:text-aptiv-orange-700 text-sm">Modifier</button>
                    <button onclick="deleteProcess(${process.id})" class="text-red-600 hover:text-red-700 text-sm">Supprimer</button>
                </div>
            </div>
        </div>
    `;
}

function updateProcessPagination(totalPages) {
    const controls = document.getElementById('processes-pagination-controls');
    if (!controls) return;
    
    controls.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = `px-3 py-1 rounded-md text-sm ${currentProcessPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`;
    prevBtn.textContent = 'Précédent';
    prevBtn.disabled = currentProcessPage === 1;
    prevBtn.onclick = () => {
        if (currentProcessPage > 1) {
            currentProcessPage--;
            renderProcessesTable();
        }
    };
    controls.appendChild(prevBtn);
    
    // Page numbers
    const startPage = Math.max(1, currentProcessPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `px-3 py-1 rounded-md text-sm ${i === currentProcessPage ? 'bg-aptiv-orange-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => {
            currentProcessPage = i;
            renderProcessesTable();
        };
        controls.appendChild(pageBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = `px-3 py-1 rounded-md text-sm ${currentProcessPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`;
    nextBtn.textContent = 'Suivant';
    nextBtn.disabled = currentProcessPage === totalPages;
    nextBtn.onclick = () => {
        if (currentProcessPage < totalPages) {
            currentProcessPage++;
            renderProcessesTable();
        }
    };
    controls.appendChild(nextBtn);
}

function sortProcessTable(field) {
    if (currentProcessSort.field === field) {
        currentProcessSort.direction = currentProcessSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentProcessSort.field = field;
        currentProcessSort.direction = 'asc';
    }
    
    renderProcessesTable();
}

function showProcessLoading() {
    document.getElementById('processes-loading').classList.remove('hidden');
    document.getElementById('processes-container').classList.add('hidden');
    document.getElementById('processes-empty').classList.add('hidden');
    document.getElementById('processes-mobile').classList.add('hidden');
}

function hideProcessLoading() {
    document.getElementById('processes-loading').classList.add('hidden');
}

function showProcessesTable() {
    document.getElementById('processes-container').classList.remove('hidden');
    document.getElementById('processes-empty').classList.add('hidden');
    document.getElementById('processes-mobile').classList.remove('hidden');
}

function showProcessEmptyState() {
    document.getElementById('processes-container').classList.add('hidden');
    document.getElementById('processes-empty').classList.remove('hidden');
    document.getElementById('processes-mobile').classList.add('hidden');
}

function showProcessError(message) {
    console.error('Process Error:', message);
    // You can add a notification system here
}

// Utility functions
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Action functions (these integrate with existing modal functions)
// function viewProcessDetails(processId) {
//     console.log('View process details:', processId);
//     // You can implement a details modal here
// }

function editProcess(processId) {
    console.log('Edit process:', processId);
    // Use existing admin dashboard function
    if (typeof adminDashboard !== 'undefined' && adminDashboard.openProcessModal) {
        adminDashboard.openProcessModal(processId);
    } else if (typeof openProcessModal === 'function') {
        openProcessModal(processId);
    }
}

function deleteProcess(processId) {
    console.log('Delete process:', processId);
    if (confirm('Êtes-vous sûr de vouloir supprimer ce processus ?')) {
        // Use existing admin dashboard function
        if (typeof adminDashboard !== 'undefined' && adminDashboard.deleteProcess) {
            adminDashboard.deleteProcess(processId);
        } else {
            // Implement direct API call
            deleteProcessDirect(processId);
        }
    }
}

async function deleteProcessDirect(processId) {
    try {
        const response = await fetch(`/admin/api/processes/${processId}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'Content-Type': 'application/json',
            }
        });
        
        const result = await response.json();
        if (result.success) {
            // Reload the processes data
            loadProcessesData();
            console.log('Process deleted successfully');
        } else {
            console.error('Error deleting process:', result.message);
        }
    } catch (error) {
        console.error('Error deleting process:', error);
    }
}

// Make functions available globally
window.sortProcessTable = sortProcessTable;
window.clearProcessFilters = clearProcessFilters;
window.viewProcessDetails = viewProcessDetails;
window.editProcess = editProcess;
window.deleteProcess = deleteProcess;
window.loadProcessesData = loadProcessesData;
window.initializeProcessesSection = initializeProcessesSection;

// Also make openProcessModal and closeProcessModal globally available
window.openProcessModal = function(processId = null) {
    if (typeof adminDashboard !== 'undefined' && adminDashboard.openProcessModal) {
        return adminDashboard.openProcessModal(processId);
    }
    
    // Fallback implementation
    const modal = document.getElementById('process-modal');
    const title = document.getElementById('process-modal-title');
    const form = document.getElementById('process-form');
    
    if (processId) {
        // Edit mode
        title.textContent = 'Modifier le processus';
        // Load process data for edit
        loadProcessForEdit(processId);
    } else {
        // Add mode
        title.textContent = 'Ajouter un processus';
        form.reset();
        document.getElementById('process-id').value = '';
    }
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
};

window.closeProcessModal = function() {
    if (typeof adminDashboard !== 'undefined' && adminDashboard.closeProcessModal) {
        return adminDashboard.closeProcessModal();
    }
    
    // Fallback implementation
    const modal = document.getElementById('process-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
};

async function loadProcessForEdit(processId) {
    try {
        const response = await fetch(`/admin/api/processes/${processId}`);
        const result = await response.json();
        
        if (result.success) {
            const process = result.data;
            document.getElementById('process-id').value = process.id;
            document.getElementById('process-title').value = process.title;
            document.getElementById('process-description').value = process.description;
        }
    } catch (error) {
        console.error('Error loading process for edit:', error);
    }
}

// Load data when processes section becomes visible
document.addEventListener('sectionChanged', function(e) {
    if (e.detail.section === 'processes') {
        loadProcessesData();
    }
});

// Also listen for the section being shown via the navigation
document.addEventListener('click', function(e) {
    if (e.target.closest('[onclick*="showSection(\'processes\')"]')) {
        setTimeout(() => {
            loadProcessesData();
        }, 100);
    }
});

// Trigger initialization when section becomes visible
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const processesSection = document.getElementById('processes-section');
            if (processesSection && !processesSection.classList.contains('hidden')) {
                loadProcessesData();
            }
        }
    });
});

const processesSection = document.getElementById('processes-section');
if (processesSection) {
    observer.observe(processesSection, { attributes: true });
}
</script>
