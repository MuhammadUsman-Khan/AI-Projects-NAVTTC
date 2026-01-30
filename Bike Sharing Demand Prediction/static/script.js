document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let currentPrediction = null;
    
    // DOM Elements
    const form = document.getElementById('prediction-form');
    const hrSlider = document.getElementById('hr');
    const hrDisplay = document.getElementById('hr-display');
    const tempSlider = document.getElementById('temp');
    const tempValue = document.getElementById('temp-value');
    const atempSlider = document.getElementById('atemp');
    const atempValue = document.getElementById('atemp-value');
    const humSlider = document.getElementById('hum');
    const humValue = document.getElementById('hum-value');
    const windspeedSlider = document.getElementById('windspeed');
    const windspeedValue = document.getElementById('windspeed-value');
    const holidayToggle = document.getElementById('holiday');
    const workingdayToggle = document.getElementById('workingday');
    const holidayText = document.getElementById('holiday-text');
    const workingdayText = document.getElementById('workingday-text');
    const weatherOptions = document.querySelectorAll('.weather-option');
    const weathersitInput = document.getElementById('weathersit');
    const loadingModal = document.getElementById('loading-modal');
    const predictionDisplay = document.getElementById('prediction-display');
    const resultsBreakdown = document.getElementById('results-breakdown');
    const insightsPanel = document.getElementById('insights-panel');
    const insightsContent = document.getElementById('insights-content');
    const casualCount = document.getElementById('casual-count');
    const registeredCount = document.getElementById('registered-count');
    const totalDemand = document.getElementById('total-demand');
    
    // Mapping dictionaries for display to numeric
    const SEASON_MAP = {
        'spring': 1,
        'summer': 2,
        'fall': 3,
        'winter': 4
    };
    
    const YEAR_MAP = {
        '2011': 0,
        '2012': 1
    };
    
    const MONTH_MAP = {
        'january': 1, 'february': 2, 'march': 3, 'april': 4,
        'may': 5, 'june': 6, 'july': 7, 'august': 8,
        'september': 9, 'october': 10, 'november': 11, 'december': 12
    };
    
    const WEEKDAY_MAP = {
        'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
        'thursday': 4, 'friday': 5, 'saturday': 6
    };
    
    const WEATHERSIT_MAP = {
        'clear': 1,
        'mist': 2,
        'light_rain': 3,
        'heavy_rain': 4
    };
    
    // Initialize form with default values
    function initializeForm() {
        // Set initial slider values
        hrSlider.value = 0;
        updateHourDisplay(0);
        
        tempSlider.value = 24; // 0.24 * 100
        updateSliderValue(tempSlider, tempValue);
        
        atempSlider.value = 29; // 0.2879 * 100
        updateSliderValue(atempSlider, atempValue);
        
        humSlider.value = 81;
        updateSliderValue(humSlider, humValue);
        
        windspeedSlider.value = 0;
        updateSliderValue(windspeedSlider, windspeedValue);
        
        // Set default selects (string values for display)
        document.getElementById('season').value = 'spring';
        document.getElementById('mnth').value = 'january';
        document.getElementById('yr').value = '2011';
        document.getElementById('weekday').value = 'saturday';
        
        // Set active weather option
        setActiveWeatherOption('clear');
        
        // Initialize toggles
        holidayToggle.checked = false;
        holidayText.textContent = 'No';
        
        workingdayToggle.checked = true;
        workingdayText.textContent = 'Yes';
        
        // Add event listeners
        setupEventListeners();
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Hour slider
        hrSlider.addEventListener('input', function() {
            updateHourDisplay(parseInt(this.value));
        });
        
        // Temperature and environment sliders
        [tempSlider, atempSlider, humSlider, windspeedSlider].forEach(slider => {
            slider.addEventListener('input', function() {
                const display = document.getElementById(`${this.id}-value`);
                updateSliderValue(this, display);
            });
        });
        
        // Weather option selection
        weatherOptions.forEach(option => {
            option.addEventListener('click', function() {
                const value = this.dataset.value;
                setActiveWeatherOption(value);
                
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
        
        // Toggle switches
        holidayToggle.addEventListener('change', function() {
            holidayText.textContent = this.checked ? 'Yes' : 'No';
        });
        
        workingdayToggle.addEventListener('change', function() {
            workingdayText.textContent = this.checked ? 'Yes' : 'No';
        });
        
        // Form submission
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Helper functions
    function updateSliderValue(slider, display) {
        const value = parseInt(slider.value) / 100;
        display.textContent = value.toFixed(4);
    }
    
    function updateHourDisplay(hour) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        hrDisplay.textContent = `${displayHour.toString().padStart(2, '0')}:00 ${period}`;
    }
    
    function setActiveWeatherOption(value) {
        weatherOptions.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.value === value) {
                option.classList.add('active');
            }
        });
        weathersitInput.value = value;
    }
    
    // Format helper functions
    function formatHour(hour) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:00 ${period}`;
    }
    
    function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    // Prepare data for pipeline (convert to NUMERIC values)
    function prepareDataForPipeline(userData) {
        // Convert string inputs to NUMERIC values that the pipeline expects
        const pipelineData = {
            'season': SEASON_MAP[userData.season] || 1, // 1, 2, 3, 4
            'yr': YEAR_MAP[userData.yr] || 0, // 0, 1
            'mnth': MONTH_MAP[userData.mnth] || 1, // 1-12
            'hr': parseInt(userData.hr), // 0-23
            'holiday': userData.holiday === 'true' ? 1 : 0, // 0 or 1
            'weekday': WEEKDAY_MAP[userData.weekday] || 0, // 0-6
            'workingday': userData.workingday === 'true' ? 1 : 0, // 0 or 1
            'weathersit': WEATHERSIT_MAP[userData.weathersit] || 1, // 1-4
            'temp': parseFloat(userData.temp), // 0.24
            'atemp': parseFloat(userData.atemp), // 0.2879
            'hum': parseFloat(userData.hum), // 0.81
            'windspeed': parseFloat(userData.windspeed) // 0.0
        };
        
        console.log('Sending to pipeline (numeric):', pipelineData);
        return pipelineData;
    }
    
    // Convert numeric pipeline data back to display format
    function convertToDisplayFormat(pipelineData) {
        // Reverse mappings
        const REVERSE_SEASON = {
            1: 'Spring', 2: 'Summer', 3: 'Fall', 4: 'Winter'
        };
        
        const REVERSE_MONTH = {
            1: 'January', 2: 'February', 3: 'March', 4: 'April',
            5: 'May', 6: 'June', 7: 'July', 8: 'August',
            9: 'September', 10: 'October', 11: 'November', 12: 'December'
        };
        
        const REVERSE_WEEKDAY = {
            0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday',
            4: 'Thursday', 5: 'Friday', 6: 'Saturday'
        };
        
        const REVERSE_WEATHERSIT = {
            1: 'Clear, Few clouds',
            2: 'Mist + Cloudy',
            3: 'Light Snow, Light Rain',
            4: 'Heavy Rain + Thunderstorm'
        };
        
        return {
            'season': REVERSE_SEASON[pipelineData.season] || 'Spring',
            'yr': pipelineData.yr === 0 ? '2011' : '2012',
            'mnth': REVERSE_MONTH[pipelineData.mnth] || 'January',
            'hr': pipelineData.hr,
            'holiday': pipelineData.holiday === 1 ? 'Yes' : 'No',
            'weekday': REVERSE_WEEKDAY[pipelineData.weekday] || 'Sunday',
            'workingday': pipelineData.workingday === 1 ? 'Yes' : 'No',
            'weathersit': REVERSE_WEATHERSIT[pipelineData.weathersit] || 'Clear',
            'temp': pipelineData.temp,
            'atemp': pipelineData.atemp,
            'hum': pipelineData.hum,
            'windspeed': pipelineData.windspeed
        };
    }
    
    // Generate insights based on prediction
    function generateInsights(prediction, displayData) {
        const total = Math.round(prediction);
        const hour = parseInt(displayData.hr);
        const temp = parseFloat(displayData.temp);
        const atemp = parseFloat(displayData.atemp);
        const hum = parseFloat(displayData.hum);
        const weathersit = displayData.weathersit;
        const isHoliday = displayData.holiday === 'Yes';
        const isWorkingday = displayData.workingday === 'Yes';
        const season = displayData.season;
        const month = displayData.mnth;
        
        let insights = [];
        
        // Demand level insight
        if (total < 50) {
            insights.push({
                icon: 'fas fa-info-circle',
                text: `Low demand expected (${total} bikes). Ideal time for maintenance operations.`
            });
        } else if (total < 150) {
            insights.push({
                icon: 'fas fa-chart-line',
                text: `Moderate demand (${total} bikes). Standard deployment strategy recommended.`
            });
        } else if (total < 300) {
            insights.push({
                icon: 'fas fa-bolt',
                text: `High demand (${total} bikes). Consider increasing bike availability at popular stations.`
            });
        } else {
            insights.push({
                icon: 'fas fa-fire',
                text: `Peak demand (${total} bikes). Maximum deployment required. Consider surge pricing.`
            });
        }
        
        // Seasonal insight
        if (season === 'Summer') {
            insights.push({
                icon: 'fas fa-sun',
                text: `Summer season typically sees highest demand due to favorable weather conditions.`
            });
        } else if (season === 'Winter') {
            insights.push({
                icon: 'fas fa-snowflake',
                text: `Winter months: Focus on commuter routes as recreational usage decreases by 30-40%.`
            });
        }
        
        // Time-based insight
        if (hour >= 7 && hour <= 9) {
            insights.push({
                icon: 'fas fa-briefcase',
                text: `Morning rush hour (${formatHour(hour)}): Predominantly registered users commuting to work.`
            });
        } else if (hour >= 16 && hour <= 18) {
            insights.push({
                icon: 'fas fa-home',
                text: `Evening commute: High return traffic expected at business district stations.`
            });
        } else if (hour >= 12 && hour <= 14) {
            insights.push({
                icon: 'fas fa-utensils',
                text: `Lunch hours: Mixed usage patterns with both casual and registered users.`
            });
        }
        
        // Weather insight
        if (weathersit.includes('Clear')) {
            insights.push({
                icon: 'fas fa-sun',
                text: `Clear weather increases casual user demand by 30-40%.`
            });
        } else if (weathersit.includes('Heavy Rain')) {
            insights.push({
                icon: 'fas fa-cloud-rain',
                text: `Stormy conditions reduce overall demand by 50-70%. Focus on essential routes.`
            });
        }
        
        // Temperature insight
        const actualTemp = (temp * 41).toFixed(1);
        const feelsLike = (atemp * 50).toFixed(1);
        
        if (temp > 0.6) {
            insights.push({
                icon: 'fas fa-temperature-high',
                text: `Warm temperatures (${actualTemp}°C, feels like ${feelsLike}°C) boost recreational usage.`
            });
        } else if (temp < 0.3) {
            insights.push({
                icon: 'fas fa-temperature-low',
                text: `Cool temperatures may reduce casual user turnout by 20-30%.`
            });
        }
        
        // Day type insight
        if (isHoliday) {
            insights.push({
                icon: 'fas fa-umbrella-beach',
                text: `Holiday pattern: Expect delayed morning peaks and extended afternoon usage.`
            });
        }
        
        if (!isWorkingday && !isHoliday) {
            insights.push({
                icon: 'fas fa-weekend',
                text: `Weekend pattern: Recreational usage peaks between 10 AM - 4 PM.`
            });
        }
        
        // Humidity insight
        if (hum > 0.8) {
            insights.push({
                icon: 'fas fa-tint',
                text: `High humidity (${(hum * 100).toFixed(0)}%) may slightly reduce demand.`
            });
        }
        
        return insights;
    }
    
    // Estimate user breakdown
    function estimateUserBreakdown(total, displayData) {
        const hour = parseInt(displayData.hr);
        const isWorkingday = displayData.workingday === 'Yes';
        const isHoliday = displayData.holiday === 'Yes';
        const weathersit = displayData.weathersit;
        
        let registeredRatio;
        
        if (isWorkingday && !isHoliday) {
            if (hour >= 7 && hour <= 9) registeredRatio = 0.85;
            else if (hour >= 16 && hour <= 18) registeredRatio = 0.80;
            else registeredRatio = 0.70;
        } else {
            if (hour >= 10 && hour <= 16) registeredRatio = 0.40;
            else registeredRatio = 0.60;
        }
        
        // Weather adjustments
        if (weathersit.includes('Clear')) registeredRatio -= 0.1;
        if (weathersit.includes('Heavy Rain')) registeredRatio += 0.15;
        
        // Ensure ratio stays within bounds
        registeredRatio = Math.max(0.3, Math.min(0.9, registeredRatio));
        
        const registered = Math.round(total * registeredRatio);
        const casual = Math.max(0, total - registered);
        
        return { casual, registered };
    }
    
    // Display prediction results
    function displayPredictionResult(prediction, pipelineData) {
        const total = Math.round(prediction);
        const displayData = convertToDisplayFormat(pipelineData);
        const userBreakdown = estimateUserBreakdown(total, displayData);
        const insights = generateInsights(prediction, displayData);
        
        // Update main display
        predictionDisplay.innerHTML = `
            <div class="prediction-active">
                <div class="demand-value">${total}</div>
                <div class="demand-label">Total Bikes Required</div>
                <div class="details-grid">
                    <div class="detail-item">
                        <div class="detail-label">Time</div>
                        <div class="detail-value">${formatHour(displayData.hr)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Day</div>
                        <div class="detail-value">${displayData.weekday}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Season</div>
                        <div class="detail-value">${displayData.season}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Weather</div>
                        <div class="detail-value">${displayData.weathersit.split(',')[0]}</div>
                    </div>
                </div>
            </div>
        `;
        
        // Update breakdown
        casualCount.textContent = userBreakdown.casual;
        registeredCount.textContent = userBreakdown.registered;
        totalDemand.textContent = total;
        resultsBreakdown.style.display = 'block';
        
        // Update insights
        insightsContent.innerHTML = insights.map((insight, index) => `
            <div class="insight-item" style="animation-delay: ${index * 0.1}s">
                <i class="${insight.icon}"></i>
                <p>${insight.text}</p>
            </div>
        `).join('');
        insightsPanel.style.display = 'block';
        
        // Add fade-in animation to insight items
        document.querySelectorAll('.insight-item').forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 100);
        });
        
        // Store current prediction
        currentPrediction = { prediction, pipelineData, displayData, userBreakdown, insights };
    }
    
    // Handle form submission
    async function handleFormSubmit(e) {
        e.preventDefault();
        
        // Show loading modal
        loadingModal.style.display = 'flex';
        
        // Collect user input (string values for display)
        const userData = {
            season: document.getElementById('season').value,
            yr: document.getElementById('yr').value,
            mnth: document.getElementById('mnth').value,
            hr: hrSlider.value,
            holiday: holidayToggle.checked.toString(),
            weekday: document.getElementById('weekday').value,
            workingday: workingdayToggle.checked.toString(),
            weathersit: weathersitInput.value,
            temp: (parseInt(tempSlider.value) / 100).toFixed(4),
            atemp: (parseInt(atempSlider.value) / 100).toFixed(4),
            hum: (parseInt(humSlider.value) / 100).toFixed(4),
            windspeed: (parseInt(windspeedSlider.value) / 100).toFixed(4)
        };
        
        // Convert to NUMERIC values for pipeline
        const pipelineData = prepareDataForPipeline(userData);
        
        console.log('Sending to Flask (numeric):', pipelineData);
        
        try {
            // Send prediction request with NUMERIC values
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pipelineData)
            });
            
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            
            const result = await response.json();
            
            // Check for errors in response
            if (result.error) {
                throw new Error(result.error);
            }
            
            // Hide loading modal
            setTimeout(() => {
                loadingModal.style.display = 'none';
                
                // Display results
                setTimeout(() => {
                    displayPredictionResult(result.predicted_demand, pipelineData);
                }, 300);
            }, 500);
            
        } catch (error) {
            console.error('Error:', error);
            
            // Hide loading modal
            loadingModal.style.display = 'none';
            
            // Show error message
            predictionDisplay.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Prediction Error</h3>
                    <p>${error.message || 'Unable to process prediction'}</p>
                    <p style="margin-top: 15px; font-size: 0.9rem; color: var(--text-muted);">
                        Please check your input and try again.
                    </p>
                </div>
            `;
            
            resultsBreakdown.style.display = 'none';
            insightsPanel.style.display = 'none';
        }
    }
    
    // Initialize the application
    initializeForm();
});