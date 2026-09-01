let geoData = null;
let frgData = null;
let map = null;
let geojsonLayer = null;
let soilChartInstance = null;

function toBengaliNumerals(num) {
    if (num === null || num === undefined || isNaN(num)) return 'তথ্য নেই';
    const bnNums = {'0':'০', '1':'১', '2':'২', '3':'৩', '4':'৪', '5':'৫', '6':'৬', '7':'৭', '8':'৮', '9':'৯', '.':'.'};
    return String(num).split('').map(char => bnNums[char] || char).join('');
}

const nutrientRanges = {
    'Nitrogen': [
        { label: 'Very Low (0.01 - 0.09)', min: 0.01, max: 0.09, color: '#d73027' },
        { label: 'Low (0.091 - 0.18)', min: 0.091, max: 0.18, color: '#f46d43' },
        { label: 'Moderate (0.181 - 0.27)', min: 0.181, max: 0.27, color: '#fee08b' },
        { label: 'Optimum (0.271 - 0.36)', min: 0.271, max: 0.36, color: '#d9ef8b' },
        { label: 'High (0.361 - 0.45)', min: 0.361, max: 0.45, color: '#66bd63' },
        { label: 'Very High (> 0.45)', min: 0.4501, max: Infinity, color: '#1a9850' }
    ],
    'Phosphorus': [
        { label: 'Very Low (0.01 - 5.25)', min: 0.01, max: 5.25, color: '#d73027' },
        { label: 'Low (5.26 - 10.5)', min: 5.26, max: 10.5, color: '#f46d43' },
        { label: 'Moderate (10.51 - 15.75)', min: 10.51, max: 15.75, color: '#fee08b' },
        { label: 'Optimum (15.76 - 21.0)', min: 15.76, max: 21.0, color: '#d9ef8b' },
        { label: 'High (21.1 - 26.25)', min: 21.1, max: 26.25, color: '#66bd63' },
        { label: 'Very High (> 26.25)', min: 26.2501, max: Infinity, color: '#1a9850' }
    ],
    'Potassium': [
        { label: 'Very Low (0.01 - 0.09)', min: 0.01, max: 0.09, color: '#d73027' },
        { label: 'Low (0.091 - 0.18)', min: 0.091, max: 0.18, color: '#f46d43' },
        { label: 'Moderate (0.181 - 0.27)', min: 0.181, max: 0.27, color: '#fee08b' },
        { label: 'Optimum (0.271 - 0.36)', min: 0.271, max: 0.36, color: '#d9ef8b' },
        { label: 'High (0.361 - 0.45)', min: 0.361, max: 0.45, color: '#66bd63' },
        { label: 'Very High (> 0.45)', min: 0.4501, max: Infinity, color: '#1a9850' }
    ],
    'Sulphur': [
        { label: 'Very Low (0.01 - 7.5)', min: 0.01, max: 7.5, color: '#d73027' },
        { label: 'Low (7.51 - 15.0)', min: 7.51, max: 15.0, color: '#f46d43' },
        { label: 'Moderate (15.1 - 22.5)', min: 15.1, max: 22.5, color: '#fee08b' },
        { label: 'Optimum (22.51 - 30.0)', min: 22.51, max: 30.0, color: '#d9ef8b' },
        { label: 'High (30.1 - 37.5)', min: 30.1, max: 37.5, color: '#66bd63' },
        { label: 'Very High (> 37.5)', min: 37.501, max: Infinity, color: '#1a9850' }
    ],
    'Zinc': [
        { label: 'Very Low (0.01 - 0.45)', min: 0.01, max: 0.45, color: '#d73027' },
        { label: 'Low (0.451 - 0.9)', min: 0.451, max: 0.9, color: '#f46d43' },
        { label: 'Moderate (0.91 - 1.35)', min: 0.91, max: 1.35, color: '#fee08b' },
        { label: 'Optimum (1.351 - 1.8)', min: 1.351, max: 1.8, color: '#d9ef8b' },
        { label: 'High (1.801 - 2.25)', min: 1.801, max: 2.25, color: '#66bd63' },
        { label: 'Very High (> 2.25)', min: 2.2501, max: Infinity, color: '#1a9850' }
    ],
    'Boron': [
        { label: 'Very Low (0.01 - 0.15)', min: 0.01, max: 0.15, color: '#d73027' },
        { label: 'Low (0.151 - 0.3)', min: 0.151, max: 0.3, color: '#f46d43' },
        { label: 'Moderate (0.301 - 0.45)', min: 0.301, max: 0.45, color: '#fee08b' },
        { label: 'Optimum (0.451 - 0.6)', min: 0.451, max: 0.6, color: '#d9ef8b' },
        { label: 'High (0.601 - 0.75)', min: 0.601, max: 0.75, color: '#66bd63' },
        { label: 'Very High (> 0.75)', min: 0.7501, max: Infinity, color: '#1a9850' }
    ],
    'Calcium': [
        { label: 'Very Low (0.01 - 1.5)', min: 0.01, max: 1.5, color: '#d73027' },
        { label: 'Low (1.51 - 3.0)', min: 1.51, max: 3.0, color: '#f46d43' },
        { label: 'Moderate (3.01 - 4.5)', min: 3.01, max: 4.5, color: '#fee08b' },
        { label: 'Optimum (4.51 - 6.0)', min: 4.51, max: 6.0, color: '#d9ef8b' },
        { label: 'High (6.01 - 7.5)', min: 6.01, max: 7.5, color: '#66bd63' },
        { label: 'Very High (> 7.5)', min: 7.501, max: Infinity, color: '#1a9850' }
    ],
    'Magnesium': [
        { label: 'Very Low (0.01 - 0.375)', min: 0.01, max: 0.375, color: '#d73027' },
        { label: 'Low (0.376 - 0.75)', min: 0.376, max: 0.75, color: '#f46d43' },
        { label: 'Moderate (0.751 - 1.125)', min: 0.751, max: 1.125, color: '#fee08b' },
        { label: 'Optimum (1.1256 - 1.5)', min: 1.1256, max: 1.5, color: '#d9ef8b' },
        { label: 'High (1.501 - 1.875)', min: 1.501, max: 1.875, color: '#66bd63' },
        { label: 'Very High (> 1.875)', min: 1.8751, max: Infinity, color: '#1a9850' }
    ],
    'pH': [
        { label: 'Extremely Acidic (0 - 4.5)', max: 4.5, color: '#a50026' },
        { label: 'Highly Acidic (4.51 - 5.5)', max: 5.5, color: '#d73027' },
        { label: 'Slightly Acidic (5.51 - 6.5)', max: 6.5, color: '#fee08b' },
        { label: 'Neutral (6.6 - 7.3)', max: 7.3, color: '#1a9850' },
        { label: 'Slightly Alkaline (7.4 - 8.4)', max: 8.4, color: '#67a9cf' },
        { label: 'Highly Alkaline (8.5 - 9.0)', max: 9.0, color: '#02818a' },
        { label: 'Extremely Alkaline (> 9.0)', max: Infinity, color: '#014636' }
    ],
    'OM': [
        { label: 'Extremely Low (0 - 1.0)', min: 0, max: 1.0, color: '#d73027' },
        { label: 'Low (1.01 - 1.7)', min: 1.01, max: 1.7, color: '#f46d43' },
        { label: 'Moderate (1.71 - 3.4)', min: 1.71, max: 3.4, color: '#fee08b' },
        { label: 'High (3.41 - 5.5)', min: 3.41, max: 5.5, color: '#66bd63' },
        { label: 'Extremely High (> 5.5)', min: 5.51, max: Infinity, color: '#1a9850' }
    ]
};

const seasonCrops = {
    'Rabi': [
        'boro_hyv', 'boro_hybrid', 'wheat', 'barley', 'lentil', 'chickpea', 'mungbean', 
        'blackgram', 'khesari', 'cowpea', 'mustard', 'sunflower', 'groundnut', 'soybean', 
        'potato', 'sweet_potato', 'radish', 'carrot', 'cabbage', 'cauliflower', 'tomato', 
        'brinjal', 'marigold', 'rose', 'tuberose', 'gladiolus'
    ],
    'Kharif-1': [
        'aus_hyv', 'mungbean', 'blackgram', 'cowpea', 'jute_tossa', 'jute_deshi', 'kenaf', 
        'sesame', 'groundnut', 'soybean', 'watermelon', 'brinjal', 'okra', 'bitter_gourd', 
        'pointed_gourd', 'bottle_gourd', 'sweet_gourd', 'cucumber', 'pui_shak', 'red_amaranth', 
        'papaya', 'banana', 'marigold', 'rose'
    ],
    'Kharif-2': [
        'aman_hyv', 'aman_local', 'brinjal', 'sweet_potato', 'okra', 'bitter_gourd', 
        'pointed_gourd', 'bottle_gourd', 'sweet_gourd', 'cucumber', 'pui_shak', 'red_amaranth', 
        'banana', 'papaya'
    ]
};

const cropCategories = {
    grains: [
        { id: 'boro_hyv', name: 'উফশী বোরো ধান', N: 160, P: 25, K: 80, S: 15, Zn: 3, B: 1 },
        { id: 'boro_hybrid', name: 'হাইব্রিড বোরো ধান', N: 180, P: 30, K: 90, S: 18, Zn: 4, B: 1 },
        { id: 'aman_hyv', name: 'উফশী রোপা আমন ধান', N: 90, P: 15, K: 50, S: 10, Zn: 1.5, B: 0 },
        { id: 'aman_local', name: 'স্থানীয় রোপা আমন ধান', N: 50, P: 10, K: 30, S: 5, Zn: 0, B: 0 },
        { id: 'aus_hyv', name: 'উফশী আউশ ধান', N: 80, P: 12, K: 40, S: 8, Zn: 1, B: 0 },
        { id: 'wheat', name: 'গম', N: 120, P: 30, K: 70, S: 15, Zn: 2.5, B: 1 },
        { id: 'barley', name: 'যব (Barley)', N: 60, P: 20, K: 40, S: 10, Zn: 1, B: 0.5 }
    ],
    vegetables: [
        { id: 'brinjal', name: 'বেগুন', N: 150, P: 45, K: 100, S: 18, Zn: 3, B: 1.5 },
        { id: 'tomato', name: 'টমেটো', N: 140, P: 40, K: 110, S: 16, Zn: 3, B: 1.2 },
        { id: 'cabbage', name: 'বাঁধাকপি', N: 160, P: 50, K: 120, S: 20, Zn: 4, B: 1.5 },
        { id: 'cauliflower', name: 'ফুলকপি', N: 170, P: 55, K: 125, S: 22, Zn: 4, B: 2.0 },
        { id: 'potato', name: 'আলু', N: 180, P: 40, K: 140, S: 20, Zn: 4, B: 1.5 },
        { id: 'sweet_potato', name: 'মিষ্টি আলু', N: 80, P: 30, K: 90, S: 10, Zn: 2, B: 1.0 },
        { id: 'radish', name: 'মুলা', N: 120, P: 30, K: 80, S: 12, Zn: 2, B: 1.0 },
        { id: 'carrot', name: 'গাজর', N: 110, P: 35, K: 90, S: 14, Zn: 2, B: 1.2 },
        { id: 'okra', name: 'ঢেঁড়স', N: 100, P: 30, K: 60, S: 12, Zn: 2, B: 1.0 },
        { id: 'bitter_gourd', name: 'করলা / উচ্ছে', N: 110, P: 35, K: 75, S: 14, Zn: 2, B: 1.0 },
        { id: 'pointed_gourd', name: 'পটল', N: 120, P: 40, K: 80, S: 15, Zn: 2.5, B: 1.0 },
        { id: 'bottle_gourd', name: 'লাউ', N: 100, P: 30, K: 70, S: 12, Zn: 2, B: 1.0 },
        { id: 'sweet_gourd', name: 'মিষ্টি কুমড়া', N: 90, P: 30, K: 70, S: 12, Zn: 2, B: 1.0 },
        { id: 'cucumber', name: 'শসা', N: 100, P: 30, K: 70, S: 12, Zn: 2, B: 1.0 },
        { id: 'red_amaranth', name: 'লালশাক', N: 60, P: 15, K: 40, S: 8, Zn: 1, B: 0.5 },
        { id: 'pui_shak', name: 'পুঁই শাক', N: 90, P: 25, K: 60, S: 12, Zn: 2, B: 0.8 }
    ],
    pulses: [
        { id: 'lentil', name: 'মসুর', N: 25, P: 20, K: 20, S: 10, Zn: 1.5, B: 1.0 },
        { id: 'chickpea', name: 'ছোলা', N: 20, P: 20, K: 20, S: 10, Zn: 1.5, B: 1.0 },
        { id: 'mungbean', name: 'মুগ ডাল', N: 20, P: 18, K: 15, S: 8, Zn: 1.0, B: 0.8 },
        { id: 'blackgram', name: 'মাষকলাই', N: 20, P: 18, K: 15, S: 8, Zn: 1.0, B: 0.8 },
        { id: 'khesari', name: 'খেসারী', N: 15, P: 15, K: 15, S: 6, Zn: 1.0, B: 0.5 },
        { id: 'cowpea', name: 'ফেলন / বরবটি ডাল', N: 20, P: 20, K: 20, S: 8, Zn: 1.0, B: 0.8 }
    ],
    fibers: [
        { id: 'jute_tossa', name: 'তোষা পাট', N: 90, P: 10, K: 40, S: 8, Zn: 1, B: 0.5 },
        { id: 'jute_deshi', name: 'দেশি পাট', N: 80, P: 10, K: 35, S: 8, Zn: 1, B: 0.5 },
        { id: 'kenaf', name: 'মেস্তা / কেনাফ', N: 70, P: 10, K: 30, S: 6, Zn: 1, B: 0.5 }
    ],
    oils: [
        { id: 'mustard', name: 'সরিষা', N: 100, P: 30, K: 60, S: 20, Zn: 2, B: 1 },
        { id: 'sunflower', name: 'সূর্যমুখী', N: 120, P: 35, K: 70, S: 22, Zn: 3, B: 1.5 },
        { id: 'sesame', name: 'তিল', N: 60, P: 20, K: 30, S: 12, Zn: 1, B: 0.5 },
        { id: 'groundnut', name: 'চিনাবাদাম', N: 30, P: 35, K: 50, S: 20, Zn: 2, B: 1 },
        { id: 'soybean', name: 'সোয়াবিন', N: 40, P: 35, K: 60, S: 15, Zn: 2, B: 1 }
    ],
    fruits: [
        { id: 'watermelon', name: 'তরমুজ', N: 130, P: 35, K: 90, S: 15, Zn: 2, B: 1 },
        { id: 'banana', name: 'কলা (প্রতি গাছ/বছর)', N: 250, P: 60, K: 300, S: 30, Zn: 5, B: 2 },
        { id: 'papaya', name: 'পেঁপে', N: 150, P: 50, K: 150, S: 20, Zn: 3, B: 1.5 }
    ],
    flowers: [
        { id: 'marigold', name: 'গাঁদা ফুল', N: 80, P: 25, K: 50, S: 10, Zn: 1.5, B: 0.8 },
        { id: 'rose', name: 'গোলাপ', N: 100, P: 40, K: 80, S: 15, Zn: 2, B: 1 },
        { id: 'tuberose', name: 'রজনীগন্ধা', N: 120, P: 45, K: 90, S: 15, Zn: 2, B: 1 },
        { id: 'gladiolus', name: 'গ্লাডিওলাস', N: 110, P: 40, K: 85, S: 12, Zn: 2, B: 1 }
    ]
};

const FRG_LIMITS = {
    'N':  { vl: 0.09,  l: 0.18,  m: 0.27,  opt: 0.36,  h: 0.45 },
    'P':  { vl: 5.25,  l: 10.5,  m: 15.75, opt: 21.0,  h: 26.25 },
    'K':  { vl: 0.09,  l: 0.18,  m: 0.27,  opt: 0.36,  h: 0.45 },
    'S':  { vl: 7.5,   l: 15.0,  m: 22.5,  opt: 30.0,  h: 37.5 },
    'Zn': { vl: 0.45,  l: 0.9,   m: 1.35,  opt: 1.8,   h: 2.25 },
    'B':  { vl: 0.15,  l: 0.3,   m: 0.45,  opt: 0.6,   h: 0.75 }
};

document.addEventListener("DOMContentLoaded", () => {
    initMap();
    fetchGeoJSON();
});

function getProp(props, keyName) {
    if (!props) return null;
    const foundKey = Object.keys(props).find(k => k.trim().toLowerCase() === keyName.trim().toLowerCase());
    return foundKey ? props[foundKey] : null;
}

function initMap() {
    map = L.map('map-container').setView([23.2332, 90.6712], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | SRDI GIS'
    }).addTo(map);
}

function fetchGeoJSON() {
    fetch('Chandpur.geojson')
        .then(res => res.json())
        .then(data => {
            geoData = data;
            populateDivisions();
            renderSoilAnalysis();
        })
        .catch(err => console.error("GeoJSON error:", err));
}

function getNutrientCategory(nutrientName, val) {
    const numericVal = parseFloat(val);
    if (isNaN(numericVal)) return { label: 'তথ্য নেই', color: '#cccccc' };
    
    let key = nutrientName;
    if (nutrientName === 'N') key = 'Nitrogen';
    if (nutrientName === 'P') key = 'Phosphorus';
    if (nutrientName === 'K') key = 'Potassium';
    if (nutrientName === 'S') key = 'Sulphur';
    if (nutrientName === 'Zn') key = 'Zinc';
    if (nutrientName === 'B') key = 'Boron';

    const ranges = nutrientRanges[key];
    if (!ranges) return { label: String(val), color: '#2e7d32' };

    for (let r of ranges) {
        if (r.min !== undefined && r.max !== undefined) {
            if (numericVal >= r.min && numericVal <= r.max) return r;
        } else if (r.max !== undefined) {
            if (numericVal <= r.max) return r;
        }
    }
    return { label: 'সীমার বাইরে', color: '#999999' };
}

function getFeatureNutrientValue(props, nutrient, mode) {
    if (nutrient === 'pH') {
        const keyName = mode === 'new' ? 'pH_new' : 'pH_old';
        return getProp(props, keyName) || getProp(props, 'pH') || 0;
    }
    
    if (nutrient === 'OM') {
        const keyName = mode === 'new' ? 'OM_new' : 'OM_old';
        return getProp(props, keyName) || getProp(props, 'OM') || 0;
    }

    if (nutrient === 'Sulphur') {
        const keyName = mode === 'new' ? 'sulfur_new' : 'sulfur_old';
        const keyNameAlt = mode === 'new' ? 'Sulphur_new' : 'Sulphur_old';
        return getProp(props, keyName) || getProp(props, keyNameAlt) || getProp(props, 'Sulphur') || 0;
    }

    const shortNutrients = { 
        'Nitrogen': 'N', 
        'Phosphorus': 'P', 
        'Potassium': 'K',
        'Zinc': 'Zn', 
        'Boron': 'B', 
        'Calcium': 'Ca', 
        'Magnesium': 'Mg' 
    };
    
    const code = shortNutrients[nutrient] || nutrient;

    const codeKey = mode === 'new' ? `${code}_new` : `${code}_old`;
    let val = getProp(props, codeKey);
    if (val !== null && val !== undefined) return val;

    const fullNameKey = mode === 'new' ? `${nutrient}_new` : `${nutrient}_old`;
    val = getProp(props, fullNameKey);
    if (val !== null && val !== undefined) return val;

    return getProp(props, code) || getProp(props, nutrient) || 0;
}

function renderSoilAnalysis() {
    renderValuesAndChart();
    renderMapLayers();
}

function renderValuesAndChart() {
    const selectedMauza = document.getElementById('soil-mauza').value;
    const selectedNutrient = document.getElementById('soil-nutrient').value;

    const oldSpan = document.getElementById('val-old-display');
    const newSpan = document.getElementById('val-new-display');

    if (!geoData || !selectedMauza) {
        oldSpan.innerText = '--';
        newSpan.innerText = '--';
        initChart(selectedNutrient, 0, 0);
        return;
    }

    const feature = geoData.features.find(f => {
        let m = getProp(f.properties, 'MAUZNAME');
        return m && String(m).trim() === selectedMauza;
    });

    if (!feature) {
        oldSpan.innerText = 'পাওয়া যায়নি';
        newSpan.innerText = 'পাওয়া যায়নি';
        initChart(selectedNutrient, 0, 0);
        return;
    }

    const oldVal = parseFloat(getFeatureNutrientValue(feature.properties, selectedNutrient, 'old')) || 0;
    const newVal = parseFloat(getFeatureNutrientValue(feature.properties, selectedNutrient, 'new')) || 0;

    oldSpan.innerText = `${toBengaliNumerals(oldVal)}`;
    newSpan.innerText = `${toBengaliNumerals(newVal)}`;

    initChart(selectedNutrient, oldVal, newVal);
}

function initChart(nutrientLabel, oldVal, newVal) {
    const ctx = document.getElementById('soilChart').getContext('2d');
    if (soilChartInstance) soilChartInstance.destroy();

    soilChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['পুরাতন মান (Old Value)', 'নতুন মান (New Value)'],
            datasets: [{
                label: `${nutrientLabel} এর পরিমাণ`,
                data: [oldVal, newVal],
                backgroundColor: ['#d9534f', '#5cb85c']
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
        }
    });
}

function renderMapLayers() {
    if (!geoData || !map) return;
    if (geojsonLayer) map.removeLayer(geojsonLayer);

    const selectedMauza = document.getElementById('soil-mauza').value;
    const selectedUpazila = document.getElementById('soil-upazila').value;
    const selectedNutrient = document.getElementById('soil-nutrient').value;
    const mode = document.querySelector('input[name="mapMode"]:checked')?.value || 'old';

    geojsonLayer = L.geoJSON(geoData, {
        style: (feature) => {
            const props = feature.properties;
            const val = getFeatureNutrientValue(props, selectedNutrient, mode);
            const cat = getNutrientCategory(selectedNutrient, val);
            
            const mauza = getProp(props, 'MAUZNAME');
            const isSelected = selectedMauza && mauza && String(mauza).trim() === selectedMauza;

            return {
                fillColor: cat.color,
                weight: isSelected ? 3 : 1,
                opacity: 1,
                color: isSelected ? '#ff1100' : '#ffffff',
                fillOpacity: 0.7
            };
        },
        onEachFeature: (feature, layer) => {
            const props = feature.properties;
            const mName = getProp(props, 'MAUZNAME') || 'অজ্ঞাত';
            const uName = getProp(props, 'THANAME') || 'অজ্ঞাত';
            
            const val = getFeatureNutrientValue(props, selectedNutrient, mode);
            const cat = getNutrientCategory(selectedNutrient, val);

            layer.bindTooltip(`<b>উপজেলা:</b> ${uName}<br><b>মৌজা:</b> ${mName}<br><b>মান:</b> ${toBengaliNumerals(val)}<br><b>ক্যাটাগরি:</b> ${cat.label}`);
        }
    }).addTo(map);

    let boundsTarget = null;
    geojsonLayer.eachLayer(layer => {
        const props = layer.feature.properties;
        const m = getProp(props, 'MAUZNAME');
        const up = getProp(props, 'THANAME');
        if (selectedMauza && m && String(m).trim() === selectedMauza) {
            boundsTarget = layer.getBounds();
        } else if (!boundsTarget && selectedUpazila && up && String(up).trim() === selectedUpazila) {
            boundsTarget = layer.getBounds();
        }
    });

    if (boundsTarget) {
        map.fitBounds(boundsTarget);
    } else if (geojsonLayer.getBounds().isValid()) {
        map.fitBounds(geojsonLayer.getBounds());
    }
}

function generateSoilReportOnScreen() {
    const mauza = document.getElementById('soil-mauza').value;
    const mode = document.querySelector('input[name="mapMode"]:checked')?.value.toUpperCase();
    const reportCard = document.getElementById('soil-report-card');

    if (!geoData || !mauza) {
        alert("অনুগ্রহ করে একটি মৌজা সিলেক্ট করুন।");
        return;
    }
    document.getElementById('display-soil-location').innerText = `মৌজা: ${mauza} (${mode} MAP)`;
    const tbody = document.getElementById('display-soil-tbody');
    tbody.innerHTML = '';
    const feature = geoData.features.find(f => getProp(f.properties, 'MAUZNAME') === mauza);
    const targets = ['pH', 'OM', 'Nitrogen', 'Phosphorus', 'Potassium', 'Sulphur', 'Zinc', 'Boron', 'Calcium', 'Magnesium'];
    targets.forEach(n => {
        let val = getFeatureNutrientValue(feature.properties, n, mode.toLowerCase());
        let cat = getNutrientCategory(n, val);
        tbody.innerHTML += `
            <tr>
                <td style="padding:8px; border:1px solid #ccc; font-weight:bold;">${n}</td>
                <td style="padding:8px; border:1px solid #ccc; color:${cat.color}; font-weight:bold;">${cat.label} (মান: ${toBengaliNumerals(val)})</td>
            </tr>`;
    });
    reportCard.style.display = 'block';
    reportCard.scrollIntoView({ behavior: 'smooth' });
}

function onSeasonOrCategoryChange() {
    const season = document.getElementById('cropSeasonSelect').value;
    const category = document.getElementById('cropCategorySelect').value;
    const cropSelect = document.getElementById('cropNameSelect');
    
    cropSelect.innerHTML = '<option value="">-- ফসল সিলেক্ট করুন --</option>';
    if (!category) return;
    let availableCrops = cropCategories[category] || [];
    if (season && seasonCrops[season]) {
        availableCrops = availableCrops.filter(c => seasonCrops[season].includes(c.id));
    }
    availableCrops.forEach(crop => {
        cropSelect.innerHTML += `<option value="${crop.id}">${crop.name}</option>`;
    });
}

function calculateFRG2018Nutrient(Ci, soilVal, type) {
    if (!Ci || Ci <= 0) return 0;
    if (soilVal === null || soilVal === undefined || isNaN(soilVal)) return Ci;
    const lim = FRG_LIMITS[type];
    if (!lim) return Ci;
    let Sl = 0, St = 0;
    if (soilVal <= lim.vl) { Sl = 0; St = lim.vl; }
    else if (soilVal <= lim.l) { Sl = lim.vl; St = lim.l; }
    else if (soilVal <= lim.m) { Sl = lim.l; St = lim.m; }
    else if (soilVal <= lim.opt) { Sl = lim.m; St = lim.opt; }
    else if (soilVal <= lim.h) { Sl = lim.opt; St = lim.h; }
    else { return 0; }
    
    let Uf = Ci - ((Ci - Sl) / St) * soilVal;
    return Uf > 0 ? Uf : 0;
}

function generateFertilizerReportOnScreen() {
    const category = document.getElementById('cropCategorySelect').value;
    const cropId = document.getElementById('cropNameSelect').value;
    const season = document.getElementById('cropSeasonSelect').value;
    const mauza = document.getElementById('fert-mauza').value;
    const reportCard = document.getElementById('fert-report-card');

    if (!category || !cropId) {
        alert("অনুগ্রহ করে ফসলের ধরন ও ফসলের নাম নির্বাচন করুন।");
        return;
    }
    const cropObj = cropCategories[category].find(c => c.id === cropId);
    const seasonText = season ? ` | মৌসুম: ${season}` : '';
    document.getElementById('display-fert-location').innerText = `মৌজা: ${mauza || 'সার্বিক'} ${seasonText} | ফসল: ${cropObj.name}`;

    let nVal = null, pVal = null, kVal = null, sVal = null, znVal = null, bVal = null;
    
    if (geoData && mauza) {
        const feature = geoData.features.find(f => getProp(f.properties, 'MAUZNAME') === mauza);
        if (feature) {
            nVal = parseFloat(getFeatureNutrientValue(feature.properties, 'Nitrogen', 'new'));
            pVal = parseFloat(getFeatureNutrientValue(feature.properties, 'Phosphorus', 'new'));
            kVal = parseFloat(getFeatureNutrientValue(feature.properties, 'Potassium', 'new'));
            sVal = parseFloat(getFeatureNutrientValue(feature.properties, 'Sulphur', 'new'));
            znVal = parseFloat(getFeatureNutrientValue(feature.properties, 'Zinc', 'new'));
            bVal = parseFloat(getFeatureNutrientValue(feature.properties, 'Boron', 'new'));
        }
    }

    const reqN  = calculateFRG2018Nutrient(cropObj.N, nVal, 'N');
    const reqP  = calculateFRG2018Nutrient(cropObj.P, pVal, 'P');
    const reqK  = calculateFRG2018Nutrient(cropObj.K, kVal, 'K');
    const reqS  = calculateFRG2018Nutrient(cropObj.S, sVal, 'S');
    const reqZn = calculateFRG2018Nutrient(cropObj.Zn, znVal, 'Zn');
    const reqB  = calculateFRG2018Nutrient(cropObj.B, bVal, 'B');

    const CONV_FACTOR = 4.04685; // ১ কেজি/হেক্টর = ৪.০৪৬৮৫ গ্রাম/শতক
    const urea   = (reqN * 2.17 * CONV_FACTOR).toFixed(1);
    const tsp    = (reqP * 5.00 * CONV_FACTOR).toFixed(1);
    const mop    = (reqK * 1.67 * CONV_FACTOR).toFixed(1);
    const gypsum = (reqS * 5.55 * CONV_FACTOR).toFixed(1);
    const znSulf = (reqZn * 2.80 * CONV_FACTOR).toFixed(1);
    const boric  = (reqB * 5.80 * CONV_FACTOR).toFixed(1);

    const ferts = [
        { name: 'ইউরিয়া (N)', amount: `${toBengaliNumerals(urea)} গ্রাম/শতক` },
        { name: 'টিএসপি (P)', amount: `${toBengaliNumerals(tsp)} গ্রাম/শতক` },
        { name: 'এমওপি (K)', amount: `${toBengaliNumerals(mop)} গ্রাম/শতক` },
        { name: 'জিপসাম (S)', amount: `${toBengaliNumerals(gypsum)} গ্রাম/শতক` },
        { name: 'জিংক সালফেট (Zn)', amount: `${toBengaliNumerals(znSulf)} গ্রাম/শতক` },
        { name: 'বোরিক এসিড (B)', amount: `${toBengaliNumerals(boric)} গ্রাম/শতক` }
    ];
    const tbody = document.getElementById('display-fert-tbody');
    tbody.innerHTML = '';
    ferts.forEach(i => {
        tbody.innerHTML += `
            <tr>
                <td style="padding:8px; border:1px solid #ccc; font-weight:bold;">${i.name}</td>
                <td style="padding:8px; border:1px solid #ccc;">${i.amount}</td>
            </tr>`;
    });

    reportCard.style.display = 'block';
    reportCard.scrollIntoView({ behavior: 'smooth' });
}

function populateDivisions() {
    ['soil', 'fert', 'weather'].forEach(prefix => {
        const divSelect = document.getElementById(`${prefix}-division`);
        if (!divSelect) return;
        divSelect.innerHTML = '<option value="">সিলেক্ট করুন</option>';
        let divisions = new Set();
        geoData.features.forEach(f => {
            divisions.add(getProp(f.properties, 'Division') || "চট্টগ্রাম");
        });
        divisions.forEach(d => divSelect.innerHTML += `<option value="${d}">${d}</option>`);
    });
}

function onDivisionChange(prefix) {
    const distSelect = document.getElementById(`${prefix}-district`);
    if (!distSelect) return;
    distSelect.innerHTML = '<option value="">সিলেক্ট করুন</option>';
    let districts = new Set();
    geoData.features.forEach(f => {
        districts.add(getProp(f.properties, 'District') || "চাঁদপুর");
    });
    districts.forEach(d => distSelect.innerHTML += `<option value="${d}">${d}</option>`);
}

function onDistrictChange(prefix) {
    const upazilaSelect = document.getElementById(`${prefix}-upazila`);
    if (!upazilaSelect) return;
    upazilaSelect.innerHTML = '<option value="">সিলেক্ট করুন</option>';
    let upazilas = new Set();
    geoData.features.forEach(f => {
        let up = getProp(f.properties, 'THANAME') || getProp(f.properties, 'Upazila');
        if (up) upazilas.add(String(up).trim());
    });
    upazilas.forEach(u => upazilaSelect.innerHTML += `<option value="${u}">${u}</option>`);
}

function onUpazilaChange(prefix) {
    const selectedUpazila = document.getElementById(`${prefix}-upazila`).value;
    const unionSelect = document.getElementById(`${prefix}-union`);
    if (unionSelect) {
        unionSelect.innerHTML = '<option value="">সিলেক্ট করুন</option>';
        let unions = new Set();
        geoData.features.forEach(f => {
            let up = getProp(f.properties, 'THANAME');
            let un = getProp(f.properties, 'UNINAME');
            if (!selectedUpazila || (up && String(up).trim() === selectedUpazila)) {
                if (un) unions.add(String(un).trim());
            }
        });
        unions.forEach(u => unionSelect.innerHTML += `<option value="${u}">${u}</option>`);
    }
    if (prefix === 'soil') renderSoilAnalysis();
}

function onUnionChange(prefix) {
    const selectedUnion = document.getElementById(`${prefix}-union`).value;
    const mauzaSelect = document.getElementById(`${prefix}-mauza`);
    if (mauzaSelect) {
        mauzaSelect.innerHTML = '<option value="">সিলেক্ট করুন</option>';
        let mauzas = new Set();
        geoData.features.forEach(f => {
            let un = getProp(f.properties, 'UNINAME');
            let m = getProp(f.properties, 'MAUZNAME');
            if (!selectedUnion || (un && String(un).trim() === selectedUnion)) {
                if (m) mauzas.add(String(m).trim());
            }
        });
        mauzas.forEach(m => mauzaSelect.innerHTML += `<option value="${m}">${m}</option>`);
    }
    if (prefix === 'soil') renderSoilAnalysis();
}

function fetchLocationWeather() {
    const selectedUpazila = document.getElementById('weather-upazila').value;
    let lat = 23.2332, lon = 90.6712;
    if (geoData && selectedUpazila) {
        const feature = geoData.features.find(f => {
            let u = getProp(f.properties, 'THANAME');
            return u && String(u).trim() === selectedUpazila;
        });
        if (feature && feature.geometry) {
            const bounds = L.geoJSON(feature).getBounds();
            const center = bounds.getCenter();
            lat = center.lat;
            lon = center.lng;
        }
    }
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,precipitation_probability_max,sunshine_duration,windspeed_10m_max,winddirection_10m_dominant&timezone=auto`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const current = data.current_weather;
            document.getElementById('w-temp').innerText = `${toBengaliNumerals(current.temperature)}°C`;
            document.getElementById('w-cond').innerText = current.weathercode === 0 ? "পরিষ্কার আকাশ" : "আংশিক মেঘলা";
            document.getElementById('w-wind').innerText = `${toBengaliNumerals(current.windspeed)} km/h`;
            document.getElementById('w-dir').innerText = `${toBengaliNumerals(current.winddirection)}°`;
            document.getElementById('w-rain').innerText = `${toBengaliNumerals(data.daily.precipitation_probability_max[0] || 0)} %`;  
            const sunHours = (data.daily.sunshine_duration[0] / 3600).toFixed(1);
            document.getElementById('w-sun').innerText = `${toBengaliNumerals(sunHours)} hrs`;

            const forecastContainer = document.getElementById('forecast-container');
            forecastContainer.innerHTML = '';
            for(let i = 1; i <= 3; i++) {
                const daySun = (data.daily.sunshine_duration[i] / 3600).toFixed(1);
                forecastContainer.innerHTML += `
                    <div class="forecast-item" style="border-bottom: 1px solid #eee; padding: 6px 0;">
                        <p><strong>দিন ${toBengaliNumerals(i)}:</strong> সর্বোচ্চ তাপ: ${toBengaliNumerals(data.daily.temperature_2m_max[i])}°C | বৃষ্টিপাত: ${toBengaliNumerals(data.daily.precipitation_probability_max[i])}% | বাতাস: ${toBengaliNumerals(data.daily.windspeed_10m_max[i])} km/h (${toBengaliNumerals(data.daily.winddirection_10m_dominant[i])}°) | সূর্যালোক: ${toBengaliNumerals(daySun)} hrs</p>
                    </div>
                `;
            }
        });
}

function showInlineNotice(message) {
    const noticeBox = document.getElementById('inline-notice-box');
    const noticeText = document.getElementById('inline-notice-text');
    if (noticeBox && noticeText) {
        noticeText.innerText = message;
        noticeBox.style.display = 'block';
    }
}

function resetReports() {
    const soilCard = document.getElementById('soil-report-card');
    const fertCard = document.getElementById('fert-report-card');
    const noticeBox = document.getElementById('inline-notice-box');
    
    if (soilCard) soilCard.style.display = 'none';
    if (fertCard) fertCard.style.display = 'none';
    if (noticeBox) noticeBox.style.display = 'none';
}

function switchView(viewId) {
    resetReports();
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    if (viewId === 'soil-view' && map) setTimeout(() => map.invalidateSize(), 300);
    if (viewId === 'weather-view') fetchLocationWeather();
}

function switchTab(element, viewId) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    switchView(viewId);
}