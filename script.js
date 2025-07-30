// 🔐 AZURE CONFIGURATION - Your credentials are embedded here
const AZURE_CONFIG = {
    openai: {
        endpoint: [ADD_YOUR_ENDPOINT],
        apiKey: [ADD_YOUR_KEY],
        deployment: [ADD_DEPLOYMENT_NAME]
    },
    speech: {
        key: [ADD_YOUR_KEY],
        region: [ADD_REGION]
    }
};

// User persona interface application
class UserPersonaApp {
    constructor() {
        console.log('UserPersonaApp constructor called');
        this.azureVoices = [];
        this.persona = {
            type: '',
            name: '',
            age: 28,
            gender: 'Female',
            occupation: '',
            techLevel: 5,
            country: 'US',
            language: 'en',
            voiceGender: 'Female',
            accent: 'Neural',
            customTraits: '',
            characteristics: {},
            voice: null
        };
        this.currentConversation = [];
        this.isRecording = false;
        this.speechRecognition = null;
        this.currentSpeech = null; // For speech synthesis
        this.voiceSystemReady = false; // Flag to track voice system readiness
        this.isVoiceEnabled = true; // Flag to control voice on/off
        this.currentStep = 1;
        this.totalSteps = 5;
        this.selectedImage = null;
        this.interviewStartTime = null;
        this.messageCount = 0;
        
        this.personalityTypes = {
            analysts: {
                title: 'Analysts',
                color: '#9c27b0',
                types: [
                    { 
                        code: 'INTJ', 
                        name: 'Architect', 
                        desc: 'Imaginative and strategic thinkers',
                        occupations: ['Software Architect', 'Systems Analyst', 'Research Scientist', 'Strategic Planner', 'Investment Banker', 'Management Consultant', 'Data Scientist', 'Product Manager']
                    },
                    { 
                        code: 'INTP', 
                        name: 'Thinker', 
                        desc: 'Innovative inventors with unquenchable thirst for knowledge',
                        occupations: ['Software Developer', 'Research Scientist', 'University Professor', 'Theoretical Physicist', 'Philosopher', 'Technical Writer', 'Game Designer', 'AI Researcher']
                    },
                    { 
                        code: 'ENTJ', 
                        name: 'Commander', 
                        desc: 'Bold, imaginative and strong-willed leaders',
                        occupations: ['CEO', 'Executive Director', 'Management Consultant', 'Corporate Lawyer', 'Investment Banker', 'Business Analyst', 'Operations Manager', 'Entrepreneur']
                    },
                    { 
                        code: 'ENTP', 
                        name: 'Debater', 
                        desc: 'Smart and curious thinkers who cannot resist an intellectual challenge',
                        occupations: ['Innovation Manager', 'Marketing Director', 'Journalist', 'Startup Founder', 'Creative Director', 'Business Development Manager', 'Consultant', 'Inventor']
                    }
                ]
            },
            diplomats: {
                title: 'Diplomats',
                color: '#4caf50',
                types: [
                    { 
                        code: 'INFJ', 
                        name: 'Advocate', 
                        desc: 'Creative and insightful, inspired and independent',
                        occupations: ['UX Designer', 'Counselor', 'Writer', 'Psychologist', 'Human Resources Manager', 'Non-profit Director', 'Life Coach', 'Social Worker']
                    },
                    { 
                        code: 'INFP', 
                        name: 'Mediator', 
                        desc: 'Poetic, kind and altruistic people, always eager to help',
                        occupations: ['Graphic Designer', 'Writer', 'Artist', 'Therapist', 'Teacher', 'Museum Curator', 'Content Creator', 'Non-profit Worker']
                    },
                    { 
                        code: 'ENFJ', 
                        name: 'Protagonist', 
                        desc: 'Charismatic and inspiring leaders, able to mesmerize',
                        occupations: ['Teacher', 'HR Director', 'Public Relations Manager', 'Training Manager', 'Social Worker', 'Event Planner', 'Team Lead', 'Motivational Speaker']
                    },
                    { 
                        code: 'ENFP', 
                        name: 'Campaigner', 
                        desc: 'Enthusiastic, creative and sociable free spirits',
                        occupations: ['Marketing Manager', 'Creative Director', 'Journalist', 'Event Coordinator', 'Sales Representative', 'Social Media Manager', 'Public Speaker', 'Campaign Manager']
                    }
                ]
            },
            sentinels: {
                title: 'Sentinels',
                color: '#2196f3',
                types: [
                    { 
                        code: 'ISTJ', 
                        name: 'Logistician', 
                        desc: 'Practical and fact-minded, reliable and responsible',
                        occupations: ['Accountant', 'Project Manager', 'Operations Manager', 'Financial Analyst', 'Quality Assurance', 'Database Administrator', 'Auditor', 'Administrative Assistant']
                    },
                    { 
                        code: 'ISFJ', 
                        name: 'Protector', 
                        desc: 'Warm-hearted and dedicated, always ready to protect',
                        occupations: ['Nurse', 'Teacher', 'Customer Service Manager', 'Office Manager', 'Social Worker', 'Librarian', 'Human Resources Specialist', 'Healthcare Administrator']
                    },
                    { 
                        code: 'ESTJ', 
                        name: 'Executive', 
                        desc: 'Excellent administrators, unsurpassed at managing',
                        occupations: ['General Manager', 'Operations Director', 'Sales Manager', 'Business Analyst', 'Financial Manager', 'Team Leader', 'Executive Assistant', 'Retail Manager']
                    },
                    { 
                        code: 'ESFJ', 
                        name: 'Consul', 
                        desc: 'Extraordinarily caring, social and popular people',
                        occupations: ['Customer Success Manager', 'Event Planner', 'Teacher', 'Healthcare Administrator', 'Office Manager', 'Public Relations Specialist', 'Sales Representative', 'Community Manager']
                    }
                ]
            },
            explorers: {
                title: 'Explorers',
                color: '#ff9800',
                types: [
                    { 
                        code: 'ISTP', 
                        name: 'Virtuoso', 
                        desc: 'Bold and practical experimenters, masters of tools',
                        occupations: ['Software Engineer', 'Mechanic', 'IT Specialist', 'Forensic Analyst', 'Engineer', 'Pilot', 'Technician', 'System Administrator']
                    },
                    { 
                        code: 'ISFP', 
                        name: 'Adventurer', 
                        desc: 'Flexible and charming artists, always ready to explore',
                        occupations: ['Graphic Designer', 'Photographer', 'Artist', 'Interior Designer', 'Fashion Designer', 'Musician', 'Chef', 'Veterinarian']
                    },
                    { 
                        code: 'ESTP', 
                        name: 'Entrepreneur', 
                        desc: 'Smart, energetic and perceptive people, truly enjoy living',
                        occupations: ['Sales Manager', 'Real Estate Agent', 'Marketing Specialist', 'Paramedic', 'Police Officer', 'Athletic Coach', 'Event Coordinator', 'Restaurant Manager']
                    },
                    { 
                        code: 'ESFP', 
                        name: 'Entertainer', 
                        desc: 'Spontaneous, energetic and enthusiastic entertainers',
                        occupations: ['Social Media Manager', 'Event Planner', 'Teacher', 'Actor', 'Tour Guide', 'Recreation Worker', 'Customer Service Representative', 'Retail Associate']
                    }
                ]
            }
        };
        
        this.initializeApp();
    }

    async initializeApp() {
        console.log('Initializing app...');
        
        // Load personality types first
        console.log('Loading personality types...');
        this.loadPersonalityTypes();
        console.log('Personality types loaded:', this.personalityTypes);
        console.log('Total personality types:', Object.keys(this.personalityTypes).length);
        
        await this.loadAzureVoices();
        console.log('Azure voices loaded:', this.azureVoices.length);
        
        this.setupEventListeners();
        this.initializeSpeechRecognition();
        this.initializeNavigation();
        this.showStep(1);
        console.log('App initialization complete');
    }

    // Load personality types (data is already defined in constructor)
    loadPersonalityTypes() {
        console.log('loadPersonalityTypes called - personality types already initialized in constructor');
        // Data is already loaded in constructor, so this function just needs to exist
        return Promise.resolve();
    }

    // Load Azure voices (using embedded data for reliability)
    async loadAzureVoices() {
        console.log('Loading Azure voices from embedded data...');
        
        // Use comprehensive embedded voices for reliable local development
        this.azureVoices = [
            // English voices
            { locale: 'en-US', displayName: 'Microsoft Aria Online (Natural) - English (United States)', shortName: 'en-US-AriaNeural', gender: 'Female', voiceType: 'Neural', status: 'GA', country: 'US' },
            { locale: 'en-US', displayName: 'Microsoft Guy Online (Natural) - English (United States)', shortName: 'en-US-GuyNeural', gender: 'Male', voiceType: 'Neural', status: 'GA', country: 'US' },
            { locale: 'en-US', displayName: 'Microsoft Jenny Online (Natural) - English (United States)', shortName: 'en-US-JennyNeural', gender: 'Female', voiceType: 'Neural', status: 'GA', country: 'US' },
            { locale: 'en-US', displayName: 'Microsoft Tony Online (Natural) - English (United States)', shortName: 'en-US-TonyNeural', gender: 'Male', voiceType: 'Neural', status: 'GA', country: 'US' },
            { locale: 'en-GB', displayName: 'Microsoft Libby Online (Natural) - English (United Kingdom)', shortName: 'en-GB-LibbyNeural', gender: 'Female', voiceType: 'Neural', status: 'GA', country: 'GB' },
            { locale: 'en-GB', displayName: 'Microsoft Ryan Online (Natural) - English (United Kingdom)', shortName: 'en-GB-RyanNeural', gender: 'Male', voiceType: 'Neural', status: 'GA', country: 'GB' },
            { locale: 'en-AU', displayName: 'Microsoft Natasha Online (Natural) - English (Australia)', shortName: 'en-AU-NatashaNeural', gender: 'Female', voiceType: 'Neural', status: 'GA', country: 'AU' },
            { locale: 'en-AU', displayName: 'Microsoft William Online (Natural) - English (Australia)', shortName: 'en-AU-WilliamNeural', gender: 'Male', voiceType: 'Neural', status: 'GA', country: 'AU' },
            { locale: 'en-CA', displayName: 'Microsoft Clara Online (Natural) - English (Canada)', shortName: 'en-CA-ClaraNeural', gender: 'Female', voiceType: 'Neural', status: 'GA', country: 'CA' },
            { locale: 'en-CA', displayName: 'Microsoft Liam Online (Natural) - English (Canada)', shortName: 'en-CA-LiamNeural', gender: 'Male', voiceType: 'Neural', status: 'GA', country: 'CA' },
            { locale: 'en-IN', displayName: 'Microsoft Neerja Online (Natural) - English (India)', shortName: 'en-IN-NeerjaNeural', gender: 'Female', voiceType: 'Neural', status: 'GA', country: 'IN' },
            { locale: 'en-IN', displayName: 'Microsoft Prabhat Online (Natural) - English (India)', shortName: 'en-IN-PrabhatNeural', gender: 'Male', voiceType: 'Neural', status: 'GA', country: 'IN' },
            
            // Spanish voices
            { locale: 'es-ES', displayName: 'Microsoft Elvira Online (Natural) - Spanish (Spain)', shortName: 'es-ES-ElviraNeural', gender: 'Female', voiceType: 'Neural', status: 'GA', country: 'ES' },
            { locale: 'es-ES', displayName: 'Microsoft Alvaro Online (Natural) - Spanish (Spain)', shortName: 'es-ES-AlvaroNeural', gender: 'Male', voiceType: 'Neural', status: 'GA', country: 'ES' },
            { locale: 'es-MX', displayName: 'Microsoft Dalia Online (Natural) - Spanish (Mexico)', shortName: 'es-MX-DaliaNeural', gender: 'Female', voiceType: 'Neural', status: 'GA', country: 'MX' },
            { locale: 'es-MX', displayName: 'Microsoft Jorge Online (Natural) - Spanish (Mexico)', shortName: 'es-MX-JorgeNeural', gender: 'Male', voiceType: 'Neural', status: 'GA', country: 'MX' },
            
            // French voices
            { locale: 'fr-FR', displayName: 'Microsoft Denise Online (Natural) - French (France)', shortName: 'fr-FR-DeniseNeural', gender: 'Female', voiceType: 'Neural', status: 'GA', country: 'FR' },
            { locale: 'fr-FR', displayName: 'Microsoft Henri Online (Natural) - French (France)', shortName: 'fr-FR-HenriNeural', gender: 'Male', voiceType: 'Neural', status: 'GA', country: 'FR' },
            { locale: 'fr-CA', displayName: 'Microsoft Sylvie Online (Natural) - French (Canada)', shortName: 'fr-CA-SylvieNeural', gender: 'Female', voiceType: 'Neural', status: 'GA', country: 'CA' },
            { locale: 'fr-CA', displayName: 'Microsoft Jean Online (Natural) - French (Canada)', shortName: 'fr-CA-JeanNeural', gender: 'Male', voiceType: 'Neural', status: 'GA', country: 'CA' },
            
            // German voices
            { locale: 'de-DE', displayName: 'Microsoft Katja Online (Natural) - German (Germany)', shortName: 'de-DE-KatjaNeural', gender: 'Female', voiceType: 'Neural', status: 'GA', country: 'DE' },
            { locale: 'de-DE', displayName: 'Microsoft Conrad Online (Natural) - German (Germany)', shortName: 'de-DE-ConradNeural', gender: 'Male', voiceType: 'Neural', status: 'GA', country: 'DE' },
            
            // Italian voices
            { locale: 'it-IT', displayName: 'Microsoft Elsa Online (Natural) - Italian (Italy)', shortName: 'it-IT-ElsaNeural', gender: 'Female', voiceType: 'Neural', status: 'GA', country: 'IT' },
            { locale: 'it-IT', displayName: 'Microsoft Diego Online (Natural) - Italian (Italy)', shortName: 'it-IT-DiegoNeural', gender: 'Male', voiceType: 'Neural', status: 'GA', country: 'IT' },
            
            // Japanese voices
            { locale: 'ja-JP', displayName: 'Microsoft Nanami Online (Natural) - Japanese (Japan)', shortName: 'ja-JP-NanamiNeural', gender: 'Female', voiceType: 'Neural', status: 'GA', country: 'JP' },
            { locale: 'ja-JP', displayName: 'Microsoft Keita Online (Natural) - Japanese (Japan)', shortName: 'ja-JP-KeitaNeural', gender: 'Male', voiceType: 'Neural', status: 'GA', country: 'JP' },
            
            // Chinese voices
            { locale: 'zh-CN', displayName: 'Microsoft Xiaoxiao Online (Natural) - Chinese (Mainland)', shortName: 'zh-CN-XiaoxiaoNeural', gender: 'Female', voiceType: 'Neural', status: 'GA', country: 'CN' },
            { locale: 'zh-CN', displayName: 'Microsoft Yunyang Online (Natural) - Chinese (Mainland)', shortName: 'zh-CN-YunyangNeural', gender: 'Male', voiceType: 'Neural', status: 'GA', country: 'CN' },
            
            // Korean voices
            { locale: 'ko-KR', displayName: 'Microsoft Sun-Hi Online (Natural) - Korean (Korea)', shortName: 'ko-KR-SunHiNeural', gender: 'Female', voiceType: 'Neural', status: 'GA', country: 'KR' },
            { locale: 'ko-KR', displayName: 'Microsoft InJoon Online (Natural) - Korean (Korea)', shortName: 'ko-KR-InJoonNeural', gender: 'Male', voiceType: 'Neural', status: 'GA', country: 'KR' },
            
            // Hindi voices
            { locale: 'hi-IN', displayName: 'Microsoft Swara Online (Natural) - Hindi (India)', shortName: 'hi-IN-SwaraNeural', gender: 'Female', voiceType: 'Neural', status: 'GA', country: 'IN' },
            { locale: 'hi-IN', displayName: 'Microsoft Madhur Online (Natural) - Hindi (India)', shortName: 'hi-IN-MadhurNeural', gender: 'Male', voiceType: 'Neural', status: 'GA', country: 'IN' }
        ];
        
        console.log(`Loaded ${this.azureVoices.length} embedded Azure voices`);
        
        // Initialize browser speech synthesis and wait for voices to be ready
        this.initializeVoiceSystem();
    }

    async initializeVoiceSystem() {
        // Wait for browser voices to be loaded
        return new Promise((resolve) => {
            const checkVoices = () => {
                const voices = speechSynthesis.getVoices();
                if (voices.length > 0) {
                    console.log(`Browser voices loaded: ${voices.length} available`);
                    this.voiceSystemReady = true;
                    resolve();
                } else {
                    // Wait a bit more for voices to load
                    setTimeout(checkVoices, 100);
                }
            };

            // Handle the voiceschanged event (fires when voices are loaded)
            speechSynthesis.onvoiceschanged = () => {
                checkVoices();
            };

            // Also check immediately in case voices are already loaded
            checkVoices();
        });
    }

    // Navigation and step management
    initializeNavigation() {
        // Navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const stepNumber = parseInt(item.dataset.step);
                if (stepNumber <= this.currentStep || this.isStepAccessible(stepNumber)) {
                    this.showStep(stepNumber);
                }
            });
        });

        // Step action buttons - handle all next buttons
        const nextButtons = ['nextStep', 'nextStep2', 'nextStep3', 'nextStep4', 'nextStep5'];
        const prevBtn = document.getElementById('prevStep');
        
        nextButtons.forEach(buttonId => {
            const nextBtn = document.getElementById(buttonId);
            if (nextBtn) {
                nextBtn.addEventListener('click', async () => {
                    console.log('Next button clicked, current step:', this.currentStep);
                    if (this.currentStep === 4 && this.canProceedToNextStep()) {
                        console.log('Starting interview...');
                        await this.startInterview();
                    } else {
                        console.log('Moving to next step...');
                        this.nextStep();
                    }
                });
            }
        });
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevStep());
        }
    }

    isStepAccessible(stepNumber) {
        switch (stepNumber) {
            case 1: return true; // Home page - always accessible
            case 2: return true; // Personality selection - always accessible
            case 3: return this.persona.type !== ''; // Customization - requires personality type
            case 4: return this.persona.type !== '' && this.persona.name !== ''; // Review - requires type and name
            case 5: return this.persona.type !== '' && this.persona.name !== ''; // Interview - requires type and name
            default: return false;
        }
    }

    showStep(stepNumber) {
        console.log('showStep called with stepNumber:', stepNumber);
        
        // Hide all steps
        document.querySelectorAll('.step-content').forEach(step => {
            step.classList.remove('active');
            step.style.display = 'none'; // Explicitly hide
        });

        // Show current step
        const currentStepElement = document.getElementById(`step${stepNumber}`);
        console.log('Current step element:', currentStepElement);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
            currentStepElement.style.display = 'block'; // Explicitly show
            console.log('Added active class and set display:block for step', stepNumber);
        } else {
            console.error('Step element not found:', `step${stepNumber}`);
        }

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-step="${stepNumber}"]`)?.classList.add('active');

        // Update progress bar
        this.updateProgressBar(stepNumber);

        this.currentStep = stepNumber;
        this.updateStepButtons();

        // Load step-specific content
        switch (stepNumber) {
            case 1:
                console.log('Setting up home page');
                this.setupHomePage();
                break;
            case 2:
                console.log('Loading step 2 - personality selection');
                // Add small delay to ensure DOM is ready
                setTimeout(() => {
                    console.log('Timeout executed, calling setupPersonalitySelection');
                    this.setupPersonalitySelection();
                }, 50);
                break;
            case 3:
                console.log('Loading step 3 - customization');
                setTimeout(() => {
                    this.loadCustomizationStep();
                }, 50);
                break;
            case 4:
                console.log('Loading step 4 - review');
                setTimeout(() => {
                    this.loadReviewStep();
                }, 50);
                break;
            case 5:
                console.log('Loading step 5 - interview');
                setTimeout(() => {
                    this.loadInterviewStep();
                }, 50);
                break;
        }
    }

    setupHomePage() {
        // Home page is static, no specific setup needed
    }

    setupPersonalitySelection() {
        console.log('Setting up personality selection...');
        console.log('Personality types available:', Object.keys(this.personalityTypes));
        this.renderPersonalityTypes();
        this.setupFormEventListeners();
        this.updateCurrentSelection();
        console.log('Personality selection setup completed');
    }

    loadCustomizationStep() {
        this.setupFormEventListeners();
        this.updatePersonaPreview();
    }

    updateProgressBar(currentStep) {
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber < currentStep) {
                step.classList.add('completed');
            } else if (stepNumber === currentStep) {
                step.classList.add('active');
            }
        });
    }

    updateStepButtons() {
        const prevBtn = document.getElementById('prevStep');
        let nextBtn;
        
        // Get the correct next button for current step
        switch(this.currentStep) {
            case 1: nextBtn = document.getElementById('nextStep'); break;
            case 2: nextBtn = document.getElementById('nextStep2'); break;
            case 3: nextBtn = document.getElementById('nextStep3'); break;
            case 4: nextBtn = document.getElementById('nextStep4'); break;
            case 5: nextBtn = document.getElementById('nextStep5'); break;
            default: nextBtn = document.getElementById('nextStep'); break;
        }
        
        console.log('updateStepButtons called - currentStep:', this.currentStep);
        console.log('canProceedToNextStep():', this.canProceedToNextStep());
        console.log('nextBtn element:', nextBtn);
        
        if (prevBtn) {
            prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        }
        
        if (nextBtn) {
            if (this.currentStep < this.totalSteps) {
                nextBtn.style.display = 'block';
                const canProceed = this.canProceedToNextStep();
                console.log('Setting nextBtn.disabled to:', !canProceed);
                
                if (canProceed) {
                    // Aggressively enable the button
                    nextBtn.disabled = false;
                    nextBtn.removeAttribute('disabled');
                    nextBtn.classList.remove('disabled');
                    nextBtn.style.opacity = '1';
                    nextBtn.style.cursor = 'pointer';
                    nextBtn.style.pointerEvents = 'auto';
                    console.log('Button enabled successfully');
                } else {
                    nextBtn.disabled = true;
                    nextBtn.style.opacity = '0.6';
                    nextBtn.style.cursor = 'not-allowed';
                }
                
                // Update button text based on current step
                switch (this.currentStep) {
                    case 1:
                        nextBtn.textContent = 'Get Started →';
                        break;
                    case 2:
                        nextBtn.textContent = 'Customize Persona →';
                        break;
                    case 3:
                        nextBtn.textContent = 'Review Persona →';
                        break;
                    case 4:
                        nextBtn.textContent = 'Start Interview →';
                        break;
                    default:
                        nextBtn.textContent = 'Next Step →';
                }
            } else {
                nextBtn.style.display = 'none';
            }
        }
    }

    canProceedToNextStep() {
        switch (this.currentStep) {
            case 1: return true; // Home page - can always proceed
            case 2: return this.persona.type !== ''; // Personality selection - requires type
            case 3: return this.persona.name !== '' && this.persona.occupation !== ''; // Customization - requires name and occupation
            case 4: return true; // Review - can always proceed to interview
            default: return false;
        }
    }

    nextStep() {
        console.log('nextStep called, current step:', this.currentStep, 'can proceed:', this.canProceedToNextStep());
        if (this.currentStep < this.totalSteps && this.canProceedToNextStep()) {
            console.log('Proceeding to step:', this.currentStep + 1);
            this.showStep(this.currentStep + 1);
        } else {
            console.log('Cannot proceed to next step');
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.showStep(this.currentStep - 1);
        }
    }

    // Personality selection
    renderPersonalityTypes() {
        console.log('Starting renderPersonalityTypes...');
        const container = document.getElementById('personalityGrid');
        if (!container) {
            console.error('personalityGrid container not found!');
            return;
        }

        console.log('Container found, clearing and populating...');
        container.innerHTML = '';

        Object.entries(this.personalityTypes).forEach(([key, category]) => {
            console.log(`Processing category: ${key}`, category);
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'personality-category';
            
            categoryDiv.innerHTML = `
                <h3 style="color: ${category.color}">👑 ${category.title} (${key.toUpperCase().slice(0,2)})</h3>
                <div class="personality-types">
                    ${category.types.map(type => `
                        <div class="personality-card" data-type="${type.code}">
                            <h4>${type.code}</h4>
                            <p>${type.name}</p>
                            <div class="type-desc">${type.desc}</div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            container.appendChild(categoryDiv);
        });

        console.log('Personality types rendered, adding click listeners...');
        // Add click listeners
        document.querySelectorAll('.personality-card').forEach(card => {
            card.addEventListener('click', () => {
                console.log('Personality card clicked:', card.dataset.type);
                document.querySelectorAll('.personality-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.persona.type = card.dataset.type;
                console.log('Persona type set to:', this.persona.type);
                
                // Populate occupations for the selected personality type
                this.populateOccupations();
                
                this.updateCurrentSelection();
                this.updateStepButtons();
                console.log('Can proceed to next step:', this.canProceedToNextStep());
                
                // Force enable the next button as backup
                const nextBtn = document.getElementById('nextStep2'); // Step 2 specific button
                if (nextBtn && this.canProceedToNextStep()) {
                    console.log('Force enabling next button');
                    nextBtn.disabled = false;
                    nextBtn.style.opacity = '1';
                    nextBtn.style.cursor = 'pointer';
                    nextBtn.style.pointerEvents = 'auto';
                    nextBtn.classList.remove('disabled');
                    nextBtn.removeAttribute('disabled');
                    console.log('Button after force enable:', nextBtn.outerHTML);
                }
            });
        });
        
        console.log('renderPersonalityTypes completed successfully');
    }

    setupFormEventListeners() {
        // Tech level slider
        const techSlider = document.getElementById('techLevel');
        const techValue = document.getElementById('techValue');
        
        if (techSlider && techValue) {
            techSlider.value = this.persona.techLevel;
            techValue.textContent = this.persona.techLevel;
            
            techSlider.addEventListener('input', (e) => {
                this.persona.techLevel = parseInt(e.target.value);
                techValue.textContent = this.persona.techLevel;
                this.updateCurrentSelection();
            });
        }

        // Populate occupations when personality type changes
        this.populateOccupations();

        // Form inputs
        ['personaName', 'personaAge', 'personaGender', 'personaOccupation', 'personaCountry', 'personaLanguage', 'customTraits'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', (e) => {
                    const field = id.replace('persona', '').toLowerCase();
                    if (field === 'customtraits') {
                        this.persona.customTraits = e.target.value;
                    } else {
                        this.persona[field] = e.target.value;
                        
                        // Update voice gender based on gender selection
                        if (field === 'gender') {
                            this.persona.voiceGender = e.target.value === 'Non-binary' ? 'Female' : e.target.value;
                        }
                    }
                    this.updateCurrentSelection();
                    this.updateStepButtons();
                });
                
                element.addEventListener('change', (e) => {
                    // Handle change events for dropdowns
                    const field = id.replace('persona', '').toLowerCase();
                    if (field === 'customtraits') {
                        this.persona.customTraits = e.target.value;
                    } else {
                        this.persona[field] = e.target.value;
                        
                        // Update voice gender based on gender selection
                        if (field === 'gender') {
                            this.persona.voiceGender = e.target.value === 'Non-binary' ? 'Female' : e.target.value;
                        }
                    }
                    this.updateCurrentSelection();
                    this.updateStepButtons();
                });
            }
        });

        // Save/Cancel buttons
        const saveBtn = document.getElementById('savePersona');
        const cancelBtn = document.getElementById('cancelPersona');
        
        if (saveBtn) {
            saveBtn.addEventListener('click', async () => {
                if (this.canProceedToNextStep()) {
                    await this.startInterview();
                }
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.resetPersona();
            });
        }
    }

    populateOccupations() {
        const occupationSelect = document.getElementById('personaOccupation');
        if (!occupationSelect || !this.persona.type) return;

        // Find the selected personality type
        let selectedType = null;
        Object.values(this.personalityTypes).forEach(category => {
            const found = category.types.find(type => type.code === this.persona.type);
            if (found) selectedType = found;
        });

        if (!selectedType) return;

        // Clear existing options except the first one
        occupationSelect.innerHTML = '<option value="">Select an occupation...</option>';

        // Add occupations for this personality type
        selectedType.occupations.forEach(occupation => {
            const option = document.createElement('option');
            option.value = occupation;
            option.textContent = occupation;
            occupationSelect.appendChild(option);
        });

        // Set default value if persona already has an occupation
        if (this.persona.occupation) {
            occupationSelect.value = this.persona.occupation;
        } else {
            // Set a default occupation
            this.persona.occupation = selectedType.occupations[0];
            occupationSelect.value = this.persona.occupation;
        }
    }

    updatePersonalityCardSelection() {
        document.querySelectorAll('.personality-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.type === this.persona.type);
        });
    }

    resetPersona() {
        this.persona = {
            type: '',
            name: 'Sarah Johnson',
            age: 28,
            gender: 'Female',
            occupation: 'UX Designer',
            techLevel: 7,
            country: 'US',
            language: 'en',
            voiceGender: 'Female',
            accent: 'Neural',
            characteristics: {},
            voice: null
        };
        
        // Reset form
        document.getElementById('personaName').value = this.persona.name;
        document.getElementById('personaAge').value = this.persona.age;
        document.getElementById('personaOccupation').value = this.persona.occupation;
        document.getElementById('techLevel').value = this.persona.techLevel;
        document.getElementById('techValue').textContent = this.persona.techLevel;
        
        // Clear selections
        document.querySelectorAll('.personality-card').forEach(c => c.classList.remove('selected'));
        this.updateMBTISelect();
        this.updateCurrentSelection();
        this.updateStepButtons();
    }

    updateCurrentSelection() {
        const selectedTypeText = document.getElementById('selectedTypeText');
        if (!selectedTypeText) return;

        const selectedType = this.getPersonalityTypeDetails(this.persona.type);
        
        if (this.persona.type && selectedType) {
            selectedTypeText.innerHTML = `${this.persona.type} - ${selectedType.name}<br><small>${selectedType.desc}</small>`;
        } else {
            selectedTypeText.textContent = 'Not selected';
        }
    }

    getPersonalityTypeDetails(typeCode) {
        for (let category of Object.values(this.personalityTypes)) {
            const type = category.types.find(t => t.code === typeCode);
            if (type) return type;
        }
        return null;
    }

    // Customization step
    loadCustomizationStep() {
        this.setupCustomizationForm();
        this.updateCurrentSelection();
    }

    setupCustomizationForm() {
        // Basic information
        document.getElementById('personaName').value = this.persona.name;
        document.getElementById('personaAge').value = this.persona.age;
        document.getElementById('personaGender').value = this.persona.gender;
        document.getElementById('personaOccupation').value = this.persona.occupation;
        document.getElementById('personaCountry').value = this.persona.country;
        document.getElementById('personaLanguage').value = this.persona.language;

        // Tech level slider
        const techSlider = document.getElementById('techLevel');
        const techValue = document.getElementById('techValue');
        
        techSlider.value = this.persona.techLevel;
        techValue.textContent = this.persona.techLevel;
        
        techSlider.addEventListener('input', (e) => {
            this.persona.techLevel = parseInt(e.target.value);
            techValue.textContent = this.persona.techLevel;
            this.updateCurrentSelection();
        });

        // Form inputs
        ['personaName', 'personaAge', 'personaGender', 'personaOccupation', 'personaCountry', 'personaLanguage'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', (e) => {
                    const field = id.replace('persona', '').toLowerCase();
                    this.persona[field] = e.target.value;
                    this.updateCurrentSelection();
                    this.updateStepButtons();
                });
            }
        });

        // Personality sliders
        this.setupPersonalitySliders();
    }

    setupPersonalitySliders() {
        const sliders = ['extraversion', 'sensing', 'thinking', 'judging'];
        
        sliders.forEach(trait => {
            const slider = document.getElementById(trait);
            if (slider) {
                slider.value = this.persona.characteristics[trait] || 50;
                slider.addEventListener('input', (e) => {
                    this.persona.characteristics[trait] = parseInt(e.target.value);
                });
            }
        });
    }

    // Review step
    loadReviewStep() {
        this.displayPersonaReview();
        this.updatePersonaSummary();
        this.updateFinalReview();
    }

    displayPersonaReview() {
        const reviewContainer = document.querySelector('.persona-card');
        if (!reviewContainer) return;

        const selectedType = this.getPersonalityTypeDetails(this.persona.type);
        const voiceInfo = this.selectVoiceFromCSV(this.persona);

        reviewContainer.innerHTML = `
            <div class="persona-header">
                <div class="persona-avatar">👤</div>
                <h2>${this.persona.name}</h2>
                <p>${this.persona.type} - ${selectedType?.name || ''}</p>
            </div>
            
            <div class="persona-section">
                <h3>Character Information</h3>
                <div class="character-info">
                    <p><strong>Age:</strong> ${this.persona.age} years old</p>
                    <p><strong>Gender:</strong> ${this.persona.gender}</p>
                    <p><strong>Occupation:</strong> ${this.persona.occupation}</p>
                    <p><strong>Location:</strong> ${this.persona.country}</p>
                    <p><strong>Primary Language:</strong> ${this.persona.language.toUpperCase()}</p>
                </div>
            </div>

            <div class="persona-section">
                <h3>Technology & Skills</h3>
                <div class="tech-info">
                    <p><strong>Tech Proficiency:</strong> ${this.persona.techLevel}/10</p>
                    <div class="tech-patterns">
                        <p><strong>Likely Technology Usage Patterns:</strong></p>
                        <ul>
                            ${this.getTechPatterns().map(pattern => `<li>${pattern}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>

            <div class="persona-section">
                <h3>Communication Style</h3>
                <div class="communication-style">
                    ${this.getCommunicationStyle()}
                </div>
            </div>

            <div class="persona-section">
                <h3>Voice Configuration</h3>
                <div class="voice-info">
                    <p><strong>Selected Voice:</strong> ${voiceInfo?.displayName || 'Default'}</p>
                    <p><strong>Language:</strong> ${voiceInfo?.locale || 'en-US'}</p>
                    <p><strong>Gender:</strong> ${voiceInfo?.gender || 'Female'}</p>
                </div>
            </div>
        `;
    }

    // Step 3: Update persona preview
    updatePersonaPreview() {
        document.getElementById('previewType').textContent = this.persona.type ? 
            `${this.persona.type} - ${this.getPersonalityTypeDetails(this.persona.type)?.name || ''}` : 
            'Not selected';
        document.getElementById('previewName').textContent = this.persona.name || 'Sarah Johnson';
        document.getElementById('previewAge').textContent = this.persona.age || '28';
        document.getElementById('previewRole').textContent = this.persona.occupation || 'UX Designer';
    }

    // Step 4: Update final review
    updateFinalReview() {
        const selectedType = this.getPersonalityTypeDetails(this.persona.type);
        
        // Update persona header
        document.getElementById('finalPersonaName').textContent = this.persona.name || 'Sarah Johnson';
        document.getElementById('finalPersonaType').textContent = this.persona.type ? 
            `${this.persona.type} - ${selectedType?.name || ''}` : 'Not selected';
        document.getElementById('finalPersonaRole').textContent = 
            `${this.persona.occupation || 'UX Designer'}, ${this.persona.age || 28} years old`;
        
        // Update personality description
        document.getElementById('personalityDescription').textContent = 
            selectedType?.description || 'Please select a personality type first.';
        
        // Update demographics
        document.getElementById('finalAge').textContent = this.persona.age || '28';
        document.getElementById('finalGender').textContent = this.persona.gender || 'Female';
        document.getElementById('finalCountry').textContent = this.getCountryName(this.persona.country) || 'United States';
        document.getElementById('finalLanguage').textContent = this.getLanguageName(this.persona.language) || 'English';
        
        // Update tech level
        const techLevel = this.persona.techLevel || 7;
        document.getElementById('finalTechLevel').style.width = `${techLevel * 10}%`;
        document.getElementById('finalTechText').textContent = `${techLevel}/10`;
        
        // Update voice settings
        const voiceInfo = this.selectVoiceFromCSV(this.persona);
        document.getElementById('finalVoice').textContent = 
            `${this.persona.voiceGender || 'Female'}, ${this.persona.accentRegion || 'Neural'} (General)`;
    }

    getCountryName(code) {
        const countries = {
            'US': 'United States', 'UK': 'United Kingdom', 'CA': 'Canada', 
            'AU': 'Australia', 'DE': 'Germany', 'FR': 'France', 'ES': 'Spain',
            'IT': 'Italy', 'JP': 'Japan', 'CN': 'China', 'IN': 'India'
        };
        return countries[code] || code;
    }

    getLanguageName(code) {
        const languages = {
            'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
            'it': 'Italian', 'pt': 'Portuguese', 'zh': 'Chinese', 'ja': 'Japanese',
            'ko': 'Korean', 'hi': 'Hindi'
        };
        return languages[code] || code;
    }

    getTechPatterns() {
        const level = this.persona.techLevel;
        if (level <= 3) {
            return [
                'Basic smartphone usage',
                'Simple web browsing',
                'Email and messaging apps',
                'Prefers familiar interfaces'
            ];
        } else if (level <= 6) {
            return [
                'Comfortable with common apps',
                'Social media usage',
                'Online shopping and banking',
                'Can troubleshoot basic issues'
            ];
        } else if (level <= 8) {
            return [
                'Power user of multiple platforms',
                'Adopts new technologies quickly',
                'Uses productivity tools effectively',
                'Helps others with tech issues'
            ];
        } else {
            return [
                'Early adopter of cutting-edge tech',
                'Deep technical understanding',
                'Customizes and optimizes systems',
                'Influences others\' tech choices'
            ];
        }
    }

    getCommunicationStyle() {
        const type = this.persona.type;
        const styles = {
            'INTJ': 'Direct and strategic, focuses on long-term implications and systematic approaches.',
            'INTP': 'Analytical and curious, enjoys exploring theoretical concepts and possibilities.',
            'ENTJ': 'Commanding and goal-oriented, emphasizes efficiency and results.',
            'ENTP': 'Enthusiastic and innovative, loves brainstorming and challenging assumptions.',
            'INFJ': 'Insightful and empathetic, considers the human impact of decisions.',
            'INFP': 'Authentic and values-driven, seeks meaning and personal connection.',
            'ENFJ': 'Inspiring and supportive, focuses on bringing out the best in others.',
            'ENFP': 'Energetic and optimistic, connects ideas and people enthusiastically.',
            'ISTJ': 'Practical and thorough, relies on proven methods and detailed planning.',
            'ISFJ': 'Caring and attentive, considers others\' needs and maintains harmony.',
            'ESTJ': 'Organized and decisive, implements structured solutions efficiently.',
            'ESFJ': 'Warm and collaborative, ensures everyone feels included and supported.',
            'ISTP': 'Logical and hands-on, focuses on practical solutions and immediate needs.',
            'ISFP': 'Gentle and adaptable, values personal expression and individual perspectives.',
            'ESTP': 'Dynamic and pragmatic, prefers action-oriented and flexible approaches.',
            'ESFP': 'Friendly and spontaneous, brings energy and encourages participation.'
        };
        
        return styles[type] || 'Balanced communication style adapting to context and audience.';
    }

    updatePersonaSummary() {
        const summaryContainer = document.querySelector('.persona-summary');
        if (!summaryContainer) return;

        summaryContainer.innerHTML = `
            <h3>Persona Summary</h3>
            <div class="summary-item">
                <span>Type:</span>
                <strong>${this.persona.type}</strong>
            </div>
            <div class="summary-item">
                <span>Name:</span>
                <strong>${this.persona.name}</strong>
            </div>
            <div class="summary-item">
                <span>Occupation:</span>
                <strong>${this.persona.occupation}</strong>
            </div>
            <div class="summary-item">
                <span>Tech Level:</span>
                <strong>${this.persona.techLevel}/10</strong>
            </div>
        `;
    }

    // Interview step
    loadInterviewStep() {
        this.setupChatInterface();
        this.setupInterviewEventListeners();
        this.startInterviewTimer();
    }

    setupChatInterface() {
        const chatPersonaName = document.getElementById('chatPersonaName');
        const chatPersonaType = document.getElementById('chatPersonaType');
        const chatPersonaRole = document.getElementById('chatPersonaRole');
        
        const selectedType = this.getPersonalityTypeDetails(this.persona.type);
        
        if (chatPersonaName) {
            chatPersonaName.textContent = this.persona.name || selectedType?.name || 'AI Persona';
        }
        
        if (chatPersonaType) {
            chatPersonaType.textContent = `${this.persona.type} - ${selectedType?.name || ''}`;
        }
        
        if (chatPersonaRole) {
            chatPersonaRole.textContent = this.persona.occupation || selectedType?.name || 'Assistant';
        }
        
        // Update current personality in stats
        const currentPersonality = document.getElementById('currentPersonality');
        if (currentPersonality) {
            currentPersonality.textContent = this.persona.type;
        }
        
        // Populate form with current persona data
        document.getElementById('chatPersonaNameInput').value = this.persona.name || '';
        document.getElementById('chatPersonaAge').value = this.persona.age;
        document.getElementById('chatPersonaOccupation').value = this.persona.occupation || '';
        document.getElementById('chatTechLevel').value = this.persona.techLevel;
        document.getElementById('chatTechValue').textContent = this.persona.techLevel;
        
        // Initialize voice toggle button appearance
        const voiceToggle = document.getElementById('voiceToggle');
        if (voiceToggle) {
            voiceToggle.innerHTML = this.isVoiceEnabled ? '🔊' : '🔇';
            voiceToggle.title = this.isVoiceEnabled ? 'Voice enabled - Click to mute' : 'Voice disabled - Click to enable';
            voiceToggle.style.opacity = this.isVoiceEnabled ? '1' : '0.5';
        }
    }

    setupInterviewEventListeners() {
        // Tech level slider in interview sidebar
        const techSlider = document.getElementById('chatTechLevel');
        const techValue = document.getElementById('chatTechValue');
        
        if (techSlider && techValue) {
            techSlider.addEventListener('input', (e) => {
                techValue.textContent = e.target.value;
            });
        }
        
        // Update persona button
        const updateBtn = document.getElementById('updatePersona');
        if (updateBtn) {
            updateBtn.addEventListener('click', () => {
                this.updatePersonaFromForm();
            });
        }
        
        // Voice toggle
        const voiceToggle = document.getElementById('voiceToggle');
        if (voiceToggle) {
            voiceToggle.addEventListener('click', () => {
                this.toggleVoice();
            });
        }
    }

    updatePersonaFromForm() {
        // Update persona from the interview form
        this.persona.name = document.getElementById('chatPersonaNameInput').value || this.persona.name;
        this.persona.age = parseInt(document.getElementById('chatPersonaAge').value);
        this.persona.occupation = document.getElementById('chatPersonaOccupation').value || this.persona.occupation;
        this.persona.techLevel = parseInt(document.getElementById('chatTechLevel').value);
        
        // Update the chat interface
        this.setupChatInterface();
        
        // Add a system message about the update
        this.addMessage('ai', `Great! I've updated my details. I'm now ${this.persona.name || 'your AI persona'}, ${this.persona.age} years old, working as a ${this.persona.occupation || 'professional'} with a tech level of ${this.persona.techLevel}/10.`);
    }

    startInterviewTimer() {
        if (this.interviewStartTime) {
            const timerElement = document.getElementById('interviewTimer');
            const durationElement = document.getElementById('interviewDuration');
            
            setInterval(() => {
                const elapsed = Date.now() - this.interviewStartTime;
                const minutes = Math.floor(elapsed / 60000);
                const seconds = Math.floor((elapsed % 60000) / 1000);
                const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                if (timerElement) timerElement.textContent = timeString;
                if (durationElement) durationElement.textContent = timeString;
            }, 1000);
        }
    }

    setupInterviewEnvironment() {
        // Initialize chat interface
        this.setupEventListeners();
        this.updateChatPersonaInfo();
        this.resetChat();
    }

    async startInterview() {
        this.interviewStartTime = Date.now();
        this.showStep(5);
        
        // Ensure persona voice gender is set correctly
        this.persona.voiceGender = this.persona.gender;
        
        // Wait for voice system to be ready before sending initial message
        if (!this.voiceSystemReady) {
            console.log('Waiting for voice system to be ready...');
            await this.initializeVoiceSystem();
        }
        
        // Send initial message with proper voice synthesis
        setTimeout(() => {
            const initialMessage = `Hello! I'm ${this.persona.name || 'your AI persona'}, a ${this.persona.occupation || this.getPersonalityTypeDetails(this.persona.type)?.name || 'helpful assistant'}. I'm excited to chat with you today. What would you like to know about me or discuss?`;
            this.addMessage('ai', initialMessage);
        }, 1200); // Increased delay to ensure voice is properly selected
    }

    updateChatPersonaInfo() {
        const selectedType = this.getPersonalityTypeDetails(this.persona.type);
        
        document.getElementById('chatPersonaName').textContent = this.persona.name || 'AI Persona';
        document.getElementById('chatPersonaType').textContent = this.persona.type ? 
            `${this.persona.type} - ${selectedType?.name || ''}` : 'Unknown Type';
        document.getElementById('chatPersonaRole').textContent = this.persona.occupation || 'Assistant';
        
        // Update sidebar form
        document.getElementById('chatPersonaNameInput').value = this.persona.name || '';
        document.getElementById('chatPersonaAge').value = this.persona.age || 28;
        document.getElementById('chatPersonaOccupation').value = this.persona.occupation || '';
        document.getElementById('chatTechLevel').value = this.persona.techLevel || 7;
        document.getElementById('chatTechValue').textContent = this.persona.techLevel || 7;
        
        // Update stats
        document.getElementById('currentPersonality').textContent = this.persona.type || '-';
    }

    resetChat() {
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
        }
        
        // Reset stats
        document.getElementById('messageCount').textContent = '0';
        document.getElementById('interviewDuration').textContent = '00:00';
        
        // Reset timer
        this.interviewStartTime = null;
        clearInterval(this.timerInterval);
    }

    // Chat functionality
    setupEventListeners() {
        // Message input
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendMessage');
        
        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        if (sendButton) {
            sendButton.addEventListener('click', () => this.sendMessage());
        }

        // Voice recording
        const voiceButton = document.getElementById('voiceRecord');
        if (voiceButton) {
            voiceButton.addEventListener('click', () => this.toggleVoiceRecording());
        }

        // Image upload
        const imageInput = document.getElementById('imageInput');
        const imageButton = document.getElementById('imageUpload');
        
        if (imageButton) {
            imageButton.addEventListener('click', () => imageInput?.click());
        }

        if (imageInput) {
            imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        }
    }

    async sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (!message && !this.selectedImage) return;

        // Add user message with image if present
        this.addMessage('user', message, this.selectedImage);
        
        // Store the image for AI processing
        const imageForAI = this.selectedImage;
        
        messageInput.value = '';
        this.selectedImage = null;
        this.clearImagePreview();

        // Generate AI response
        try {
            const response = await this.generateAIResponse(message, imageForAI);
            this.addMessage('ai', response);
        } catch (error) {
            console.error('Error generating response:', error);
            this.addMessage('ai', 'I apologize, but I encountered an error. Please try again.');
        }
    }

    addMessage(sender, content, image = null) {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const timestamp = new Date().toLocaleTimeString();
        
        messageDiv.innerHTML = `
            <div class="message-content">${content}</div>
            ${image ? `<img src="${image}" class="message-image" alt="Uploaded image">` : ''}
            <div class="message-time">${timestamp}</div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.messageCount++;
        this.updateMessageCount();

        // Add speech synthesis for AI messages - only if voice system is ready
        if (sender === 'ai' && content && this.voiceSystemReady) {
            // Small delay to ensure message is rendered and voice is properly selected
            setTimeout(() => {
                this.speakText(content);
            }, 500);
        } else if (sender === 'ai' && content && !this.voiceSystemReady) {
            console.log('Voice system not ready yet, skipping speech synthesis for initial message');
        }
    }

    updateMessageCount() {
        const countElement = document.getElementById('messageCount');
        if (countElement) {
            countElement.textContent = this.messageCount;
        }
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            this.selectedImage = e.target.result;
            this.showImagePreview(this.selectedImage);
        };
        reader.readAsDataURL(file);
    }

    showImagePreview(imageSrc) {
        const container = document.getElementById('imagePreviewContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="image-preview">
                <img src="${imageSrc}" alt="Preview">
                <button class="remove-image" onclick="app.clearImagePreview()">×</button>
            </div>
        `;
        container.style.display = 'block';
    }

    clearImagePreview() {
        const container = document.getElementById('imagePreviewContainer');
        if (container) {
            container.innerHTML = '';
            container.style.display = 'none';
        }
        this.selectedImage = null;
    }

    // AI and voice functionality
    async generateAIResponse(userMessage, imageData = null) {
        const prompt = this.generatePersonaPrompt(userMessage);
        
        // Prepare the message with image if provided
        let userContent = userMessage;
        if (imageData) {
            userContent = [
                {
                    "type": "text",
                    "text": userMessage || "I've shared an image with you. What do you see?"
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": imageData
                    }
                }
            ];
        }

        const messages = [
            { role: 'system', content: prompt },
            ...this.currentConversation.slice(-10), // Keep last 10 messages for context
            { role: 'user', content: userContent }
        ];

        const response = await this.callAzureOpenAI(messages);
        
        // Store conversation (store text only for context)
        this.currentConversation.push(
            { role: 'user', content: userMessage || "Shared an image" },
            { role: 'assistant', content: response }
        );

        return response;
    }

    generatePersonaPrompt(userMessage) {
        const selectedType = this.getPersonalityTypeDetails(this.persona.type);
        
        return `You are ${this.persona.name}, a ${this.persona.age}-year-old ${this.persona.gender} ${this.persona.occupation} with ${this.persona.type} personality type (${selectedType?.name || ''}).

Personal Details:
- Location: ${this.persona.country}
- Primary Language: ${this.persona.language.toUpperCase()}
- Technology Proficiency: ${this.persona.techLevel}/10
${this.persona.customTraits ? `- Additional Traits: ${this.persona.customTraits}` : ''}

Personality Traits:
- Type: ${this.persona.type} - ${selectedType?.desc || ''}
- Communication Style: ${this.getCommunicationStyle()}

Instructions:
1. Stay completely in character as ${this.persona.name}
2. Respond naturally based on your personality type and background
3. Match your tech knowledge to your proficiency level (${this.persona.techLevel}/10)
4. Keep responses conversational and authentic
5. If you receive an image, analyze it carefully and describe what you see in detail, relating it to your expertise and personality
6. Show personality traits consistent with ${this.persona.type}
7. When discussing images, be specific about what you observe and connect it to your professional knowledge if relevant
${this.persona.customTraits ? `8. Incorporate your additional traits: ${this.persona.customTraits}` : ''}

Current conversation context: This is an interview/chat session where someone wants to get to know you better.`;
    }

    async callAzureOpenAI(messages) {
        const response = await fetch(`${AZURE_CONFIG.openai.endpoint}/openai/deployments/${AZURE_CONFIG.openai.deployment}/chat/completions?api-version=2024-02-15-preview`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': AZURE_CONFIG.openai.apiKey
            },
            body: JSON.stringify({
                messages: messages,
                max_tokens: 800,
                temperature: 0.7,
                top_p: 0.95,
                frequency_penalty: 0,
                presence_penalty: 0
            })
        });

        if (!response.ok) {
            throw new Error(`Azure OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    async synthesizeSpeech(text) {
        try {
            const voice = this.selectVoiceFromCSV(this.persona);
            if (!voice) return;

            const ssml = `
                <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${voice.locale}">
                    <voice name="${voice.shortName}">
                        ${text}
                    </voice>
                </speak>
            `;

            const response = await fetch(`https://${AZURE_CONFIG.speech.region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': AZURE_CONFIG.speech.key,
                    'Content-Type': 'application/ssml+xml',
                    'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3'
                },
                body: ssml
            });

            if (response.ok) {
                const audioBlob = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                audio.play();
            }
        } catch (error) {
            console.error('Speech synthesis error:', error);
        }
    }

    selectVoiceFromCSV(persona) {
        if (!this.azureVoices.length) {
            console.warn('No Azure voices available');
            return null;
        }

        console.log('Selecting voice for persona:', {
            language: persona.language,
            country: persona.country,
            voiceGender: persona.voiceGender
        });

        // Create locale string from language and country (e.g., 'en-US')
        const targetLocale = `${persona.language}-${persona.country}`;
        
        // First try to match exact locale (language-country)
        let candidates = this.azureVoices.filter(voice => 
            voice.locale === targetLocale
        );
        
        console.log(`Found ${candidates.length} voices for exact locale ${targetLocale}`);

        // If no exact locale match, try language only (e.g., 'en-*')
        if (candidates.length === 0) {
            candidates = this.azureVoices.filter(voice => 
                voice.locale.startsWith(persona.language + '-')
            );
            console.log(`Found ${candidates.length} voices for language ${persona.language}`);
        }

        // If still no match, use English as fallback
        if (candidates.length === 0) {
            candidates = this.azureVoices.filter(voice => 
                voice.locale.startsWith('en-')
            );
            console.log(`Using English fallback, found ${candidates.length} voices`);
        }

        // Filter by gender (voiceGender comes from persona.gender now)
        const genderFiltered = candidates.filter(voice => 
            voice.gender.toLowerCase() === persona.voiceGender.toLowerCase()
        );
        
        if (genderFiltered.length > 0) {
            candidates = genderFiltered;
            console.log(`After gender filtering (${persona.voiceGender}): ${candidates.length} voices`);
        } else {
            console.log(`No voices found for gender ${persona.voiceGender}, using all genders`);
        }

        // Prefer Neural voices
        const neuralVoices = candidates.filter(voice => 
            voice.voiceType === 'Neural' || voice.shortName.includes('Neural')
        );
        
        if (neuralVoices.length > 0) {
            candidates = neuralVoices;
            console.log(`After neural filtering: ${candidates.length} voices`);
        }

        // Return random voice from candidates or first one
        const selectedVoice = candidates.length > 0 
            ? candidates[Math.floor(Math.random() * candidates.length)]
            : null;
            
        console.log('Selected voice:', selectedVoice?.displayName || 'None');
        return selectedVoice;
    }

    // Speech synthesis
    speakText(text) {
        // Check if voice is enabled
        if (!this.isVoiceEnabled) {
            console.log('Voice is disabled, skipping speech synthesis');
            return;
        }

        // Check if voice system is ready
        if (!this.voiceSystemReady) {
            console.warn('Voice system not ready, skipping speech synthesis');
            return;
        }

        // Stop any current speech
        if (this.currentSpeech) {
            speechSynthesis.cancel();
        }

        if (!text || !('speechSynthesis' in window)) {
            console.warn('Speech synthesis not supported or no text provided');
            return;
        }

        // Clean text for speech (remove HTML tags, etc.)
        const cleanText = text.replace(/<[^>]*>/g, '').trim();
        if (!cleanText) return;

        // Ensure persona voice gender is set
        if (!this.persona.voiceGender) {
            this.persona.voiceGender = this.persona.gender || 'Female';
        }

        // Get selected voice for the persona
        const selectedVoice = this.selectVoiceFromCSV(this.persona);
        console.log('Using voice for speech synthesis:', selectedVoice?.displayName);
        console.log('Persona voice settings:', {
            gender: this.persona.gender,
            voiceGender: this.persona.voiceGender,
            language: this.persona.language,
            country: this.persona.country
        });
        
        // Create speech utterance
        const utterance = new SpeechSynthesisUtterance(cleanText);
        
        // Configure voice settings
        if (selectedVoice) {
            // Try to find matching browser voice
            const voices = speechSynthesis.getVoices();
            console.log('Available browser voices:', voices.length);
            
            // First try to match by exact locale
            let matchingVoice = voices.find(voice => 
                voice.lang === selectedVoice.locale
            );
            
            // If no exact match, try to match by language prefix
            if (!matchingVoice) {
                const languagePrefix = selectedVoice.locale.split('-')[0];
                matchingVoice = voices.find(voice => 
                    voice.lang.startsWith(languagePrefix)
                );
            }
            
            // If still no match, try to find by gender and language
            if (!matchingVoice) {
                const languagePrefix = selectedVoice.locale.split('-')[0];
                matchingVoice = voices.find(voice => 
                    voice.lang.startsWith(languagePrefix) && 
                    voice.name.toLowerCase().includes(selectedVoice.gender.toLowerCase())
                );
            }
            
            if (matchingVoice) {
                utterance.voice = matchingVoice;
                console.log('Selected browser voice:', matchingVoice.name, matchingVoice.lang);
            } else {
                console.log('No matching browser voice found, using default');
            }
        }

        // Set speech parameters based on persona
        utterance.rate = 0.9;
        utterance.pitch = this.persona.voiceGender === 'Female' ? 1.1 : 0.9;
        utterance.volume = 0.8;

        // Set up event handlers
        utterance.onstart = () => {
            console.log('Speech started');
            this.currentSpeech = utterance;
        };

        utterance.onend = () => {
            console.log('Speech ended');
            this.currentSpeech = null;
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
            this.currentSpeech = null;
        };

        // Speak the text
        speechSynthesis.speak(utterance);
    }

    // Speech recognition
    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.speechRecognition = new SpeechRecognition();
            
            this.speechRecognition.continuous = false;
            this.speechRecognition.interimResults = false;
            this.speechRecognition.lang = `${this.persona.language}-${this.persona.country}`;

            this.speechRecognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('messageInput').value = transcript;
            };

            this.speechRecognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isRecording = false;
                this.updateVoiceButton();
            };

            this.speechRecognition.onend = () => {
                this.isRecording = false;
                this.updateVoiceButton();
            };
        }
    }

    toggleVoiceRecording() {
        if (!this.speechRecognition) return;

        if (this.isRecording) {
            this.speechRecognition.stop();
        } else {
            this.speechRecognition.start();
            this.isRecording = true;
        }
        
        this.updateVoiceButton();
    }

    updateVoiceButton() {
        const button = document.getElementById('voiceRecord');
        if (button) {
            button.innerHTML = this.isRecording ? '🔴' : '🎤';
            button.title = this.isRecording ? 'Stop recording' : 'Start voice recording';
        }
    }

    toggleVoice() {
        this.isVoiceEnabled = !this.isVoiceEnabled;
        
        // Update the voice toggle button appearance
        const voiceToggle = document.getElementById('voiceToggle');
        if (voiceToggle) {
            voiceToggle.innerHTML = this.isVoiceEnabled ? '🔊' : '🔇';
            voiceToggle.title = this.isVoiceEnabled ? 'Voice enabled - Click to mute' : 'Voice disabled - Click to enable';
            
            // Add visual feedback
            voiceToggle.style.opacity = this.isVoiceEnabled ? '1' : '0.5';
        }
        
        // Stop current speech if disabling voice
        if (!this.isVoiceEnabled && this.currentSpeech) {
            speechSynthesis.cancel();
            this.currentSpeech = null;
        }
        
        console.log('Voice toggled:', this.isVoiceEnabled ? 'enabled' : 'disabled');
    }
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, creating app...');
    try {
        window.app = app = new UserPersonaApp();
        console.log('App created successfully!');
    } catch (error) {
        console.error('Error creating app:', error);
    }
});
