/**
 * AI Color Palette Generator - Inline App Module
 * Generate beautiful color palettes with AI suggestions and accessibility features
 */

class ColorPaletteGenerator {
    constructor(containerId) {
        this.containerId = containerId;
        this.currentPalette = [];
        this.paletteHistory = [];
        this.favoritesPalettes = this.loadFavorites();
        this.colorHarmonyRules = {
            monochromatic: 'Variations of a single hue',
            analogous: 'Adjacent colors on the color wheel',
            complementary: 'Opposite colors on the color wheel', 
            triadic: 'Three evenly spaced colors',
            tetradic: 'Four colors forming a rectangle',
            splitComplementary: 'Base color plus two adjacent to its complement'
        };
        
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
        this.generateRandomPalette();
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="color-palette-app">
                <div class="app-header">
                    <h3 class="app-title">
                        <span class="app-icon">🎨</span>
                        AI Color Palette Generator
                    </h3>
                    <p class="app-subtitle">Generate beautiful, accessible color palettes with AI assistance</p>
                </div>

                <div class="palette-layout">
                    <!-- Generation Controls -->
                    <div class="generation-panel">
                        <div class="generation-controls">
                            <div class="control-group">
                                <label class="control-label">Generation Method</label>
                                <div class="method-tabs">
                                    <button class="method-tab active" data-method="ai">
                                        <span class="tab-icon">🤖</span>
                                        AI Powered
                                    </button>
                                    <button class="method-tab" data-method="harmony">
                                        <span class="tab-icon">🎯</span>
                                        Color Harmony
                                    </button>
                                    <button class="method-tab" data-method="image">
                                        <span class="tab-icon">🖼️</span>
                                        From Image
                                    </button>
                                </div>
                            </div>

                            <!-- AI Generation -->
                            <div class="generation-method active" id="aiMethod">
                                <div class="control-group">
                                    <label class="control-label">Describe your palette</label>
                                    <div class="ai-input-container">
                                        <input type="text" id="aiPrompt" class="ai-input" 
                                               placeholder="e.g., sunset over ocean, modern tech startup, cozy coffee shop">
                                        <button class="ai-generate-btn" id="aiGenerateBtn">
                                            <span class="btn-icon">✨</span>
                                            Generate
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="ai-suggestions">
                                    <label class="control-label">Quick prompts</label>
                                    <div class="suggestion-tags">
                                        <button class="suggestion-tag" data-prompt="professional business website">Professional</button>
                                        <button class="suggestion-tag" data-prompt="vibrant summer festival">Vibrant</button>
                                        <button class="suggestion-tag" data-prompt="minimalist design">Minimalist</button>
                                        <button class="suggestion-tag" data-prompt="warm autumn colors">Autumn</button>
                                        <button class="suggestion-tag" data-prompt="ocean and beach theme">Ocean</button>
                                        <button class="suggestion-tag" data-prompt="forest and nature">Nature</button>
                                    </div>
                                </div>
                            </div>

                            <!-- Harmony Generation -->
                            <div class="generation-method" id="harmonyMethod">
                                <div class="control-group">
                                    <label class="control-label">Base Color</label>
                                    <div class="color-input-container">
                                        <input type="color" id="baseColor" class="color-picker" value="#3b82f6">
                                        <input type="text" id="baseColorHex" class="hex-input" placeholder="#3b82f6">
                                    </div>
                                </div>
                                
                                <div class="control-group">
                                    <label class="control-label">Harmony Rule</label>
                                    <select id="harmonyRule" class="harmony-select">
                                        <option value="monochromatic">Monochromatic</option>
                                        <option value="analogous">Analogous</option>
                                        <option value="complementary">Complementary</option>
                                        <option value="triadic">Triadic</option>
                                        <option value="tetradic">Tetradic</option>
                                        <option value="splitComplementary">Split Complementary</option>
                                    </select>
                                    <div class="harmony-description" id="harmonyDescription">
                                        Variations of a single hue
                                    </div>
                                </div>
                                
                                <button class="generate-btn" id="harmonyGenerateBtn">
                                    <span class="btn-icon">🎯</span>
                                    Generate Harmony
                                </button>
                            </div>

                            <!-- Image Generation -->
                            <div class="generation-method" id="imageMethod">
                                <div class="control-group">
                                    <label class="control-label">Upload Image</label>
                                    <div class="image-upload-container">
                                        <input type="file" id="imageUpload" accept="image/*" class="image-input">
                                        <div class="upload-area" id="uploadArea">
                                            <span class="upload-icon">📁</span>
                                            <span class="upload-text">Click to upload or drag image here</span>
                                        </div>
                                        <canvas id="imageCanvas" class="image-canvas"></canvas>
                                    </div>
                                </div>
                                
                                <button class="generate-btn" id="imageGenerateBtn" disabled>
                                    <span class="btn-icon">🖼️</span>
                                    Extract Colors
                                </button>
                            </div>
                        </div>

                        <!-- Quick Actions -->
                        <div class="quick-actions">
                            <button class="action-btn" id="randomBtn">
                                <span class="btn-icon">🎲</span>
                                Random
                            </button>
                            <button class="action-btn" id="trendsBtn">
                                <span class="btn-icon">📈</span>
                                Trending
                            </button>
                            <button class="action-btn" id="historyBtn">
                                <span class="btn-icon">⏰</span>
                                History
                            </button>
                        </div>
                    </div>

                    <!-- Palette Display -->
                    <div class="palette-display">
                        <div class="palette-header">
                            <h4 class="palette-title">Generated Palette</h4>
                            <div class="palette-actions">
                                <button class="action-btn" id="favoriteBtn">
                                    <span class="btn-icon">❤️</span>
                                    Save
                                </button>
                                <button class="action-btn" id="shuffleBtn">
                                    <span class="btn-icon">🔄</span>
                                    Shuffle
                                </button>
                            </div>
                        </div>

                        <div class="color-swatches" id="colorSwatches">
                            <!-- Color swatches will be generated here -->
                        </div>

                        <!-- Accessibility Checker -->
                        <div class="accessibility-section">
                            <h5 class="section-title">
                                <span class="section-icon">♿</span>
                                Accessibility Check
                            </h5>
                            <div class="contrast-grid" id="contrastGrid">
                                <!-- Contrast ratios will be displayed here -->
                            </div>
                        </div>

                        <!-- Export Options -->
                        <div class="export-section">
                            <h5 class="section-title">
                                <span class="section-icon">📤</span>
                                Export Palette
                            </h5>
                            <div class="export-buttons">
                                <button class="export-btn" id="exportCss">
                                    <span class="btn-icon">📄</span>
                                    CSS
                                </button>
                                <button class="export-btn" id="exportScss">
                                    <span class="btn-icon">📄</span>
                                    SCSS
                                </button>
                                <button class="export-btn" id="exportJson">
                                    <span class="btn-icon">📄</span>
                                    JSON
                                </button>
                                <button class="export-btn" id="exportAse">
                                    <span class="btn-icon">🎨</span>
                                    ASE
                                </button>
                                <button class="export-btn" id="copyHex">
                                    <span class="btn-icon">📋</span>
                                    Copy HEX
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Favorites Panel -->
                <div class="favorites-panel" id="favoritesPanel">
                    <div class="favorites-header">
                        <h4 class="favorites-title">
                            <span class="section-icon">❤️</span>
                            Saved Palettes
                        </h4>
                        <button class="close-favorites-btn" id="closeFavoritesBtn">×</button>
                    </div>
                    <div class="favorites-grid" id="favoritesGrid">
                        <!-- Saved palettes will be displayed here -->
                    </div>
                </div>

                <!-- History Panel -->
                <div class="history-panel" id="historyPanel">
                    <div class="history-header">
                        <h4 class="history-title">
                            <span class="section-icon">⏰</span>
                            Palette History
                        </h4>
                        <button class="close-history-btn" id="closeHistoryBtn">×</button>
                    </div>
                    <div class="history-grid" id="historyGrid">
                        <!-- Palette history will be displayed here -->
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Method switching
        document.querySelectorAll('.method-tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchMethod(tab.dataset.method));
        });

        // AI generation
        const aiGenerateBtn = document.getElementById('aiGenerateBtn');
        const aiPrompt = document.getElementById('aiPrompt');
        
        if (aiGenerateBtn) {
            aiGenerateBtn.addEventListener('click', () => this.generateFromAI());
        }
        
        if (aiPrompt) {
            aiPrompt.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.generateFromAI();
            });
        }

        // Suggestion tags
        document.querySelectorAll('.suggestion-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                document.getElementById('aiPrompt').value = tag.dataset.prompt;
                this.generateFromAI();
            });
        });

        // Harmony generation
        const harmonyGenerateBtn = document.getElementById('harmonyGenerateBtn');
        const baseColor = document.getElementById('baseColor');
        const baseColorHex = document.getElementById('baseColorHex');
        const harmonyRule = document.getElementById('harmonyRule');

        if (harmonyGenerateBtn) {
            harmonyGenerateBtn.addEventListener('click', () => this.generateFromHarmony());
        }

        if (baseColor) {
            baseColor.addEventListener('input', (e) => {
                document.getElementById('baseColorHex').value = e.target.value;
            });
        }

        if (baseColorHex) {
            baseColorHex.addEventListener('input', (e) => {
                if (this.isValidHex(e.target.value)) {
                    document.getElementById('baseColor').value = e.target.value;
                }
            });
        }

        if (harmonyRule) {
            harmonyRule.addEventListener('change', (e) => {
                document.getElementById('harmonyDescription').textContent = 
                    this.colorHarmonyRules[e.target.value];
            });
        }

        // Image upload
        const imageUpload = document.getElementById('imageUpload');
        const uploadArea = document.getElementById('uploadArea');
        const imageGenerateBtn = document.getElementById('imageGenerateBtn');

        if (imageUpload) {
            imageUpload.addEventListener('change', (e) => this.handleImageUpload(e));
        }

        if (uploadArea) {
            uploadArea.addEventListener('click', () => imageUpload.click());
            uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
            uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        }

        if (imageGenerateBtn) {
            imageGenerateBtn.addEventListener('click', () => this.generateFromImage());
        }

        // Quick actions
        document.getElementById('randomBtn')?.addEventListener('click', () => this.generateRandomPalette());
        document.getElementById('trendsBtn')?.addEventListener('click', () => this.generateTrendingPalette());
        document.getElementById('historyBtn')?.addEventListener('click', () => this.showHistory());

        // Palette actions
        document.getElementById('favoriteBtn')?.addEventListener('click', () => this.savePalette());
        document.getElementById('shuffleBtn')?.addEventListener('click', () => this.shufflePalette());

        // Export actions
        document.getElementById('exportCss')?.addEventListener('click', () => this.exportCSS());
        document.getElementById('exportScss')?.addEventListener('click', () => this.exportSCSS());
        document.getElementById('exportJson')?.addEventListener('click', () => this.exportJSON());
        document.getElementById('exportAse')?.addEventListener('click', () => this.exportASE());
        document.getElementById('copyHex')?.addEventListener('click', () => this.copyHex());

        // Panel controls
        document.getElementById('closeFavoritesBtn')?.addEventListener('click', () => this.hideFavorites());
        document.getElementById('closeHistoryBtn')?.addEventListener('click', () => this.hideHistory());
    }

    switchMethod(method) {
        // Update tabs
        document.querySelectorAll('.method-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.method === method);
        });

        // Update method panels
        document.querySelectorAll('.generation-method').forEach(panel => {
            panel.classList.toggle('active', panel.id === `${method}Method`);
        });
    }

    async generateFromAI() {
        const prompt = document.getElementById('aiPrompt').value.trim();
        if (!prompt) return;

        this.showLoading('Generating palette with AI...');

        try {
            // Try Colormind API first for real AI generation
            const palette = await this.generateFromColormindAPI(prompt);
            if (palette) {
                this.updatePalette(palette, `AI: ${prompt}`);
            } else {
                // If API unavailable, show error instead of fallback
                this.showError('AI color generation service is currently unavailable. Please try again later or use Color Harmony mode.');
            }
        } catch (error) {
            console.error('AI generation error:', error);
            this.showError('Failed to generate palette. Please try again.');
        }
    }

    async simulateAIGeneration(prompt) {
        try {
            // Try Colormind API first
            const apiPalette = await this.generateFromColormindAPI(prompt);
            if (apiPalette) {
                return apiPalette;
            }
        } catch (error) {
            console.log('Colormind API unavailable, falling back to local generation');
        }

        // Fallback to local generation with improved logic
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simple AI simulation based on keywords
        const keywords = prompt.toLowerCase();
        
        if (keywords.includes('ocean') || keywords.includes('sea') || keywords.includes('water')) {
            return this.generateOceanPalette();
        } else if (keywords.includes('sunset') || keywords.includes('warm')) {
            return this.generateSunsetPalette();
        } else if (keywords.includes('forest') || keywords.includes('nature') || keywords.includes('green')) {
            return this.generateNaturePalette();
        } else if (keywords.includes('professional') || keywords.includes('business') || keywords.includes('corporate')) {
            return this.generateProfessionalPalette();
        } else if (keywords.includes('minimalist') || keywords.includes('clean')) {
            return this.generateMinimalistPalette();
        } else {
            return this.generateRandomPalette(false);
        }
    }

    async generateFromColormindAPI(prompt) {
        try {
            // Generate a base color from the prompt
            const baseColor = this.getBaseColorFromPrompt(prompt);
            
            // Use HTTPS endpoint for better CORS support
            const response = await fetch('https://colormind.io/api/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'default',
                    input: baseColor ? [baseColor, "N", "N", "N", "N"] : ["N", "N", "N", "N", "N"]
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed with status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.result && Array.isArray(data.result)) {
                console.log('✅ Colormind API successful:', data.result);
                return data.result.map((rgb, index) => ({
                    hex: this.rgbToHex(rgb[0], rgb[1], rgb[2]),
                    name: `AI Color ${index + 1}`
                }));
            }
        } catch (error) {
            console.log('⚠️ Colormind API unavailable, using local generation:', error.message);
            return null;
        }
    }

    getBaseColorFromPrompt(prompt) {
        const keywords = prompt.toLowerCase();
        
        // Return RGB arrays for different prompt themes
        if (keywords.includes('ocean') || keywords.includes('blue')) {
            return [0, 63, 92]; // Ocean blue
        } else if (keywords.includes('sunset') || keywords.includes('orange')) {
            return [255, 107, 53]; // Sunset orange
        } else if (keywords.includes('forest') || keywords.includes('green')) {
            return [45, 80, 22]; // Forest green
        } else if (keywords.includes('professional') || keywords.includes('business')) {
            return [38, 70, 83]; // Professional navy
        } else if (keywords.includes('warm')) {
            return [244, 162, 97]; // Warm orange
        } else if (keywords.includes('cool')) {
            return [42, 157, 143]; // Cool teal
        }
        
        return null; // Let API choose completely random
    }

    generateOceanPalette() {
        return [
            { hex: '#003f5c', name: 'Deep Ocean' },
            { hex: '#2f5f8f', name: 'Ocean Blue' },
            { hex: '#4a90a4', name: 'Sea Blue' },
            { hex: '#74a9bd', name: 'Light Blue' },
            { hex: '#9bb7d4', name: 'Foam' }
        ];
    }

    generateSunsetPalette() {
        return [
            { hex: '#ff6b35', name: 'Sunset Orange' },
            { hex: '#ff8e53', name: 'Warm Orange' },
            { hex: '#ff477e', name: 'Pink' },
            { hex: '#c44569', name: 'Deep Pink' },
            { hex: '#786fa6', name: 'Twilight' }
        ];
    }

    generateNaturePalette() {
        return [
            { hex: '#2d5016', name: 'Forest Green' },
            { hex: '#4a7c59', name: 'Pine' },
            { hex: '#6a994e', name: 'Leaf Green' },
            { hex: '#a7c957', name: 'Fresh Green' },
            { hex: '#bc6c25', name: 'Earth Brown' }
        ];
    }

    generateProfessionalPalette() {
        return [
            { hex: '#264653', name: 'Professional Navy' },
            { hex: '#2a9d8f', name: 'Teal' },
            { hex: '#e9c46a', name: 'Gold' },
            { hex: '#f4a261', name: 'Orange' },
            { hex: '#e76f51', name: 'Coral' }
        ];
    }

    generateMinimalistPalette() {
        return [
            { hex: '#ffffff', name: 'Pure White' },
            { hex: '#f8f9fa', name: 'Off White' },
            { hex: '#e9ecef', name: 'Light Gray' },
            { hex: '#6c757d', name: 'Medium Gray' },
            { hex: '#343a40', name: 'Dark Gray' }
        ];
    }

    generateFromHarmony() {
        const baseColor = document.getElementById('baseColor').value;
        const rule = document.getElementById('harmonyRule').value;
        
        const palette = this.generateHarmonyPalette(baseColor, rule);
        this.updatePalette(palette, `Harmony: ${rule}`);
    }

    generateHarmonyPalette(baseColor, rule) {
        const hsl = this.hexToHsl(baseColor);
        const colors = [];

        switch (rule) {
            case 'monochromatic':
                for (let i = 0; i < 5; i++) {
                    colors.push({
                        hex: this.hslToHex(hsl.h, hsl.s, Math.max(10, Math.min(90, hsl.l + (i - 2) * 20))),
                        name: `Mono ${i + 1}`
                    });
                }
                break;
                
            case 'analogous':
                for (let i = -2; i <= 2; i++) {
                    colors.push({
                        hex: this.hslToHex((hsl.h + i * 30 + 360) % 360, hsl.s, hsl.l),
                        name: `Analogous ${i + 3}`
                    });
                }
                break;
                
            case 'complementary':
                colors.push(
                    { hex: baseColor, name: 'Base' },
                    { hex: this.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l), name: 'Complement' },
                    { hex: this.hslToHex(hsl.h, hsl.s, Math.max(10, hsl.l - 20)), name: 'Base Dark' },
                    { hex: this.hslToHex((hsl.h + 180) % 360, hsl.s, Math.max(10, hsl.l - 20)), name: 'Complement Dark' },
                    { hex: this.hslToHex(hsl.h, Math.max(10, hsl.s - 30), Math.min(90, hsl.l + 20)), name: 'Base Light' }
                );
                break;
                
            case 'triadic':
                for (let i = 0; i < 3; i++) {
                    colors.push({
                        hex: this.hslToHex((hsl.h + i * 120) % 360, hsl.s, hsl.l),
                        name: `Triadic ${i + 1}`
                    });
                }
                colors.push(
                    { hex: this.hslToHex(hsl.h, Math.max(10, hsl.s - 20), Math.min(90, hsl.l + 15)), name: 'Light' },
                    { hex: this.hslToHex(hsl.h, hsl.s, Math.max(10, hsl.l - 15)), name: 'Dark' }
                );
                break;
                
            default:
                return this.generateRandomPalette(false);
        }

        return colors;
    }

    generateFromImage() {
        const canvas = document.getElementById('imageCanvas');
        if (!canvas.width) return;

        const palette = this.extractColorsFromCanvas(canvas);
        this.updatePalette(palette, 'From Image');
    }

    extractColorsFromCanvas(canvas) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Extract dominant colors using color quantization
        const colorMap = new Map();
        
        // Sample every 10th pixel for performance
        for (let i = 0; i < data.length; i += 40) {
            const r = Math.round(data[i] / 32) * 32;
            const g = Math.round(data[i + 1] / 32) * 32;
            const b = Math.round(data[i + 2] / 32) * 32;
            
            // Skip near-white and near-black colors
            if (r + g + b > 720 || r + g + b < 96) continue;
            
            const hex = this.rgbToHex(r, g, b);
            colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
        }
        
        // Get top 5 colors by frequency
        const sortedColors = Array.from(colorMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
            
        return sortedColors.map((color, index) => ({
            hex: color[0],
            name: `Color ${index + 1}`
        }));
    }

    generateRandomPalette(update = true) {
        const colors = [];
        const baseHue = Math.random() * 360;
        
        for (let i = 0; i < 5; i++) {
            const hue = (baseHue + i * 72) % 360;
            const saturation = 40 + Math.random() * 50;
            const lightness = 30 + Math.random() * 40;
            
            colors.push({
                hex: this.hslToHex(hue, saturation, lightness),
                name: `Color ${i + 1}`
            });
        }
        
        if (update) {
            this.updatePalette(colors, 'Random Generation');
        }
        
        return colors;
    }

    generateTrendingPalette() {
        const trendingPalettes = [
            [
                { hex: '#ff6b6b', name: 'Coral Red' },
                { hex: '#4ecdc4', name: 'Turquoise' },
                { hex: '#45b7d1', name: 'Sky Blue' },
                { hex: '#f9ca24', name: 'Golden' },
                { hex: '#6c5ce7', name: 'Purple' }
            ],
            [
                { hex: '#2d3436', name: 'Dark Gray' },
                { hex: '#636e72', name: 'Gray' },
                { hex: '#74b9ff', name: 'Blue' },
                { hex: '#0984e3', name: 'Dark Blue' },
                { hex: '#00cec9', name: 'Cyan' }
            ],
            [
                { hex: '#fd79a8', name: 'Pink' },
                { hex: '#fdcb6e', name: 'Orange' },
                { hex: '#6c5ce7', name: 'Purple' },
                { hex: '#a29bfe', name: 'Light Purple' },
                { hex: '#fd79a8', name: 'Rose' }
            ]
        ];
        
        const randomPalette = trendingPalettes[Math.floor(Math.random() * trendingPalettes.length)];
        this.updatePalette(randomPalette, 'Trending Colors');
    }

    updatePalette(colors, source = '') {
        this.currentPalette = colors;
        this.addToHistory(colors, source);
        this.renderPalette();
        this.checkAccessibility();
    }

    renderPalette() {
        const swatches = document.getElementById('colorSwatches');
        if (!swatches || !this.currentPalette.length) return;

        swatches.innerHTML = this.currentPalette.map((color, index) => `
            <div class="color-swatch" data-color="${color.hex}">
                <div class="swatch-color" style="background-color: ${color.hex}"></div>
                <div class="swatch-info">
                    <div class="swatch-name" contenteditable="true">${color.name}</div>
                    <div class="swatch-hex">${color.hex.toUpperCase()}</div>
                    <div class="swatch-rgb">${this.hexToRgb(color.hex)}</div>
                    <div class="swatch-hsl">${this.hexToHslString(color.hex)}</div>
                </div>
                <div class="swatch-actions">
                    <button class="swatch-btn copy-color" title="Copy HEX">📋</button>
                    <button class="swatch-btn lock-color" title="Lock Color">🔒</button>
                    <button class="swatch-btn edit-color" title="Edit Color">✏️</button>
                </div>
            </div>
        `).join('');

        // Add event listeners to swatch actions
        swatches.querySelectorAll('.copy-color').forEach((btn, index) => {
            btn.addEventListener('click', () => this.copyColorToClipboard(this.currentPalette[index].hex));
        });

        swatches.querySelectorAll('.swatch-name').forEach((name, index) => {
            name.addEventListener('blur', () => {
                this.currentPalette[index].name = name.textContent;
            });
        });
    }

    checkAccessibility() {
        const contrastGrid = document.getElementById('contrastGrid');
        if (!contrastGrid || !this.currentPalette.length) return;

        let contrastHTML = '<div class="contrast-header">Contrast Ratios (AA/AAA compliance)</div>';
        
        for (let i = 0; i < this.currentPalette.length; i++) {
            for (let j = i + 1; j < this.currentPalette.length; j++) {
                const color1 = this.currentPalette[i];
                const color2 = this.currentPalette[j];
                const ratio = this.calculateContrastRatio(color1.hex, color2.hex);
                
                const aaPass = ratio >= 4.5;
                const aaaPass = ratio >= 7;
                
                contrastHTML += `
                    <div class="contrast-item ${aaPass ? 'aa-pass' : 'aa-fail'} ${aaaPass ? 'aaa-pass' : 'aaa-fail'}">
                        <div class="contrast-colors">
                            <div class="contrast-color" style="background: ${color1.hex}"></div>
                            <div class="contrast-color" style="background: ${color2.hex}"></div>
                        </div>
                        <div class="contrast-info">
                            <div class="contrast-ratio">${ratio.toFixed(2)}:1</div>
                            <div class="contrast-status">
                                <span class="aa-status ${aaPass ? 'pass' : 'fail'}">${aaPass ? '✓' : '✗'} AA</span>
                                <span class="aaa-status ${aaaPass ? 'pass' : 'fail'}">${aaaPass ? '✓' : '✗'} AAA</span>
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        contrastGrid.innerHTML = contrastHTML;
    }

    calculateContrastRatio(hex1, hex2) {
        const rgb1 = this.hexToRgbValues(hex1);
        const rgb2 = this.hexToRgbValues(hex2);
        
        const l1 = this.getLuminance(rgb1);
        const l2 = this.getLuminance(rgb2);
        
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        
        return (lighter + 0.05) / (darker + 0.05);
    }

    getLuminance(rgb) {
        const srgb = rgb.map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        
        return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
    }

    // Export functions
    exportCSS() {
        if (!this.currentPalette.length) return;

        const css = `:root {
${this.currentPalette.map((color, index) => 
    `  --color-${color.name.toLowerCase().replace(/\s+/g, '-')}: ${color.hex};`
).join('\n')}
}

/* Color classes */
${this.currentPalette.map((color, index) => `
.bg-${color.name.toLowerCase().replace(/\s+/g, '-')} {
  background-color: var(--color-${color.name.toLowerCase().replace(/\s+/g, '-')});
}

.text-${color.name.toLowerCase().replace(/\s+/g, '-')} {
  color: var(--color-${color.name.toLowerCase().replace(/\s+/g, '-')});
}`).join('\n')}`;

        this.downloadFile('palette.css', css, 'text/css');
    }

    exportSCSS() {
        if (!this.currentPalette.length) return;

        const scss = `// Color Variables
${this.currentPalette.map((color, index) => 
    `$color-${color.name.toLowerCase().replace(/\s+/g, '-')}: ${color.hex};`
).join('\n')}

// Color Map
$colors: (
${this.currentPalette.map((color, index) => 
    `  "${color.name.toLowerCase().replace(/\s+/g, '-')}": $color-${color.name.toLowerCase().replace(/\s+/g, '-')}`
).join(',\n')}
);

// Mixins
@mixin color-classes($colors) {
  @each $name, $color in $colors {
    .bg-#{$name} {
      background-color: $color;
    }
    
    .text-#{$name} {
      color: $color;
    }
  }
}

@include color-classes($colors);`;

        this.downloadFile('palette.scss', scss, 'text/scss');
    }

    exportJSON() {
        if (!this.currentPalette.length) return;

        const data = {
            name: 'Generated Palette',
            timestamp: new Date().toISOString(),
            colors: this.currentPalette.map(color => ({
                name: color.name,
                hex: color.hex,
                rgb: this.hexToRgbValues(color.hex),
                hsl: this.hexToHsl(color.hex)
            }))
        };

        this.downloadFile('palette.json', JSON.stringify(data, null, 2), 'application/json');
    }

    async copyHex() {
        if (!this.currentPalette.length) return;

        const hexValues = this.currentPalette.map(color => color.hex).join(', ');
        
        try {
            await navigator.clipboard.writeText(hexValues);
            this.showSuccess('HEX values copied to clipboard!');
        } catch (err) {
            console.error('Copy failed:', err);
        }
    }

    async copyColorToClipboard(hex) {
        try {
            await navigator.clipboard.writeText(hex);
            this.showSuccess(`Color ${hex} copied!`);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    }

    downloadFile(filename, content, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Utility functions
    hexToRgb(hex) {
        const values = this.hexToRgbValues(hex);
        return `rgb(${values.join(', ')})`;
    }

    hexToRgbValues(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : [0, 0, 0];
    }

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    hexToHsl(hex) {
        const [r, g, b] = this.hexToRgbValues(hex).map(x => x / 255);
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    hexToHslString(hex) {
        const hsl = this.hexToHsl(hex);
        return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }

    hslToHex(h, s, l) {
        s /= 100;
        l /= 100;

        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        let r = 0, g = 0, b = 0;

        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }

        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        return this.rgbToHex(r, g, b);
    }

    isValidHex(hex) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    }

    // Image handling
    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.processImage(file);
        }
    }

    handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.add('drag-over');
    }

    handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.remove('drag-over');
        
        const files = event.dataTransfer.files;
        if (files[0]) {
            this.processImage(files[0]);
        }
    }

    processImage(file) {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.getElementById('imageCanvas');
                const ctx = canvas.getContext('2d');
                
                // Resize image for processing
                const maxSize = 200;
                const ratio = Math.min(maxSize / img.width, maxSize / img.height);
                canvas.width = img.width * ratio;
                canvas.height = img.height * ratio;
                
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                canvas.style.display = 'block';
                
                document.getElementById('imageGenerateBtn').disabled = false;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // History and favorites
    addToHistory(colors, source) {
        this.paletteHistory.unshift({
            colors: [...colors],
            source,
            timestamp: new Date()
        });
        
        // Keep only last 20 palettes
        if (this.paletteHistory.length > 20) {
            this.paletteHistory = this.paletteHistory.slice(0, 20);
        }
    }

    savePalette() {
        if (!this.currentPalette.length) return;

        const palette = {
            colors: [...this.currentPalette],
            timestamp: new Date(),
            name: `Palette ${this.favoritesPalettes.length + 1}`
        };

        this.favoritesPalettes.push(palette);
        this.saveFavorites();
        this.showSuccess('Palette saved to favorites!');
    }

    loadFavorites() {
        try {
            return JSON.parse(localStorage.getItem('colorPaletteFavorites') || '[]');
        } catch {
            return [];
        }
    }

    saveFavorites() {
        localStorage.setItem('colorPaletteFavorites', JSON.stringify(this.favoritesPalettes));
    }

    showHistory() {
        const historyPanel = document.getElementById('historyPanel');
        const historyGrid = document.getElementById('historyGrid');
        
        if (!historyPanel || !historyGrid) return;

        historyGrid.innerHTML = this.paletteHistory.map((entry, index) => `
            <div class="history-item" onclick="colorPaletteGenerator.loadHistoryPalette(${index})">
                <div class="history-colors">
                    ${entry.colors.slice(0, 5).map(color => 
                        `<div class="history-color" style="background: ${color.hex}"></div>`
                    ).join('')}
                </div>
                <div class="history-info">
                    <div class="history-source">${entry.source}</div>
                    <div class="history-time">${entry.timestamp.toLocaleDateString()}</div>
                </div>
            </div>
        `).join('');

        historyPanel.classList.add('visible');
    }

    hideHistory() {
        document.getElementById('historyPanel')?.classList.remove('visible');
    }

    loadHistoryPalette(index) {
        const entry = this.paletteHistory[index];
        if (entry) {
            this.updatePalette(entry.colors, entry.source);
            this.hideHistory();
        }
    }

    shufflePalette() {
        if (!this.currentPalette.length) return;
        
        // Shuffle the existing colors
        for (let i = this.currentPalette.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.currentPalette[i], this.currentPalette[j]] = [this.currentPalette[j], this.currentPalette[i]];
        }
        
        this.renderPalette();
        this.checkAccessibility();
    }

    showLoading(message) {
        console.log(message);
        // Could add a loading overlay if needed
    }

    showError(message) {
        console.error(message);
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    showSuccess(message) {
        console.log(message);
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

// Make class available globally
window.ColorPaletteGenerator = ColorPaletteGenerator;

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('colorPaletteApp');
    if (container) {
        window.colorPaletteGenerator = new ColorPaletteGenerator('colorPaletteApp');
    }
});

// Export for manual initialization
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ColorPaletteGenerator;
}