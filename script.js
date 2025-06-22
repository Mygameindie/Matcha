// Array of JSON file paths
const jsonFiles = [
    'bottomunderwear1.json', 'bottomunderwear2.json',
    'topunderwear1.json', 'topunderwear2.json',
    'onepiece1.json', 'socks1.json', 'socks2.json',
    'boxers1.json', 'boxers2.json',
    'sweatshirt1.json', 'sweatshirt2.json',
	'glove1.json','glove2.json',
    'shoes1.json','shoes2.json',
    'pants1.json','pants2.json',
	'belt2.json',
	'boots1.json','boots2.json',
    'skirt1.json', 'skirt2.json',
    'top1.json', 'top2.json',
    'dress1.json', 'dress2.json',
    'jacket1.json', 'jacket2.json',
    'accessories1.json', 'accessories2.json',
    'hat1.json', 'hat2.json',
];

// Color palette for clothing items
const colorPalette = [
    { name: 'Original', value: 'none' },
    { name: 'Red', value: 'hue-rotate(0deg)' },
    { name: 'Blue', value: 'hue-rotate(240deg)' },
    { name: 'Green', value: 'hue-rotate(120deg)' },
    { name: 'Purple', value: 'hue-rotate(270deg)' },
    { name: 'Orange', value: 'hue-rotate(30deg)' },
    { name: 'Pink', value: 'hue-rotate(320deg)' },
    { name: 'Yellow', value: 'hue-rotate(60deg)' },
    { name: 'Cyan', value: 'hue-rotate(180deg)' }
];

// Track currently selected item for color changing
let currentlySelectedItem = null;

// Helper function to set z-index for categories
function getZIndex(categoryName) {
    const zIndexMap = {
        bottomunderwear: 3, topunderwear: 4, 
        onepiece: 5, socks: 5, boxer: 6, sweatshirt: 7, 
        shoe: 8, pants: 9, skirt: 10, top: 11, dress: 12, 
        jacket: 13, accessories: 14, hat: 15 
    };
    return zIndexMap[categoryName] || 0;
}

// Load each JSON file
async function loadItemFile(file) {
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Error loading file: ${file}`);
        return await response.json();
    } catch (error) {
        console.error(`Failed to load ${file}:`, error);
        return [];
    }
}

// Create color picker UI
function createColorPicker() {
    const colorPickerContainer = document.createElement('div');
    colorPickerContainer.classList.add('color-picker-container');
    colorPickerContainer.style.display = 'none';
    
    const colorPickerTitle = document.createElement('h4');
    colorPickerTitle.textContent = 'Choose Color:';
    colorPickerContainer.appendChild(colorPickerTitle);
    
    const colorGrid = document.createElement('div');
    colorGrid.classList.add('color-grid');
    
    colorPalette.forEach(color => {
        const colorButton = document.createElement('button');
        colorButton.classList.add('color-button');
        colorButton.textContent = color.name;
        colorButton.onclick = () => applyColorToItem(color.value);
        colorGrid.appendChild(colorButton);
    });
    
    colorPickerContainer.appendChild(colorGrid);
    
    // Close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.classList.add('close-color-picker');
    closeButton.onclick = hideColorPicker;
    colorPickerContainer.appendChild(closeButton);
    
    document.querySelector('.controls').appendChild(colorPickerContainer);
}

// Show color picker
function showColorPicker(itemId) {
    currentlySelectedItem = itemId;
    const colorPicker = document.querySelector('.color-picker-container');
    colorPicker.style.display = 'block';
}

// Hide color picker
function hideColorPicker() {
    const colorPicker = document.querySelector('.color-picker-container');
    colorPicker.style.display = 'none';
    currentlySelectedItem = null;
}

// Apply color filter to selected item
function applyColorToItem(filterValue) {
    if (!currentlySelectedItem) return;
    
    const item = document.getElementById(currentlySelectedItem);
    if (item) {
        if (filterValue === 'none') {
            item.style.filter = '';
        } else {
            item.style.filter = filterValue;
        }
    }
    hideColorPicker();
}

// Load items in batches to reduce load time and improve responsiveness
async function loadItemsInBatches(batchSize = 3) {
    const baseContainer = document.querySelector('.base-container');
    const controlsContainer = document.querySelector('.controls');
    
    // Create color picker first
    createColorPicker();
    
    for (let i = 0; i < jsonFiles.length; i += batchSize) {
        const batch = jsonFiles.slice(i, i + batchSize);

        await Promise.all(batch.map(async file => {
            const data = await loadItemFile(file);
            const categoryName = file.replace('.json', '');
            const categoryContainer = document.createElement('div');
            categoryContainer.classList.add('category');

            const categoryHeading = document.createElement('h3');
            categoryHeading.textContent = categoryName;
            categoryContainer.appendChild(categoryHeading);

            data.forEach(item => {
                const itemId = item.id.endsWith('.png') ? item.id : `${item.id}.png`;

                const img = document.createElement('img');
                img.id = itemId;
                img.src = item.src;
                img.alt = item.alt;
                img.classList.add(categoryName);
                img.setAttribute('data-file', file);
                img.style.visibility = item.visibility === "visible" ? "visible" : "hidden";
                img.style.position = 'absolute';
                img.style.zIndex = getZIndex(categoryName);
                baseContainer.appendChild(img);

                // Create container for buttons
const buttonContainer = document.createElement('div');
buttonContainer.classList.add('button-container');

// Create a wrapper to stack buttons vertically
const buttonWrap = document.createElement('div');
buttonWrap.classList.add('button-wrap');

// Main item button
const button = document.createElement('img');
const buttonFile = item.src.replace('.png', 'b.png');
button.src = buttonFile;
button.alt = item.alt + ' Button';
button.classList.add('item-button');
button.onclick = () => toggleVisibility(itemId, categoryName);
buttonWrap.appendChild(button);

// Color change button
const colorButton = document.createElement('button');
colorButton.textContent = '🎨';
colorButton.classList.add('color-change-button');
colorButton.onclick = (e) => {
    e.stopPropagation();
    const targetItem = document.getElementById(itemId);
    if (targetItem.style.visibility === 'hidden') {
        toggleVisibility(itemId, categoryName);
    }
    showColorPicker(itemId);
};
buttonWrap.appendChild(colorButton);

// Add stacked buttonWrap to container
buttonContainer.appendChild(buttonWrap);
categoryContainer.appendChild(buttonContainer);
            });

            //controlsContainer.appendChild(categoryContainer);
        }));

        await new Promise(resolve => setTimeout(resolve, 0.1));
    }
}

// Toggle visibility of item images, ensuring mutual exclusivity
function toggleVisibility(itemId, categoryName) {
	// Auto-scroll to the item's category heading
const allHeadings = document.querySelectorAll('.category h3');
allHeadings.forEach(heading => {
    if (heading.textContent.trim() === categoryName.trim()) {
        heading.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});
    const categoryItems = document.querySelectorAll(`.${categoryName}`);
    categoryItems.forEach(item => {
        if (item.id !== itemId) {
            item.style.visibility = 'hidden';
        }
    });

    const selectedItem = document.getElementById(itemId);
    selectedItem.style.visibility = selectedItem.style.visibility === 'visible' ? 'hidden' : 'visible';

    if (selectedItem.style.visibility === 'visible') {
        if (categoryName === 'onepiece1') {
            hideSpecificCategories(['topunderwear1', 'bottomunderwear1']);
        } else if (categoryName === 'dress1') {
            hideSpecificCategories(['top1', 'pants1', 'skirt1', 'sweatshirt1']);
        } else if (categoryName === 'dress2') {
            hideSpecificCategories(['top2', 'pants2', 'skirt2', 'sweatshirt2']);
        } else if (categoryName.startsWith('top1') || categoryName.startsWith('pants1') || categoryName.startsWith('skirt1') || categoryName.startsWith('sweatshirt1')) {
            hideSpecificCategories(['dress1']);
        } else if (categoryName.startsWith('top2') || categoryName.startsWith('pants2') || categoryName.startsWith('skirt2') || categoryName.startsWith('sweatshirt2')) {
            hideSpecificCategories(['dress2']);
        } else if (categoryName === 'topunderwear1' || categoryName === 'bottomunderwear1') {
            hideSpecificCategories(['onepiece1']);
        }
    }
}

// Helper function to hide items for specific categories
function hideSpecificCategories(categories) {
    categories.forEach(category => {
        const items = document.querySelectorAll(`.${category}`);
        items.forEach(item => {
            item.style.visibility = 'hidden';
        });
    });
}

function adjustCanvasLayout() {
    const baseContainer = document.querySelector('.base-container');
    const controlsContainer = document.querySelector('.controls');
    const screenWidth = window.innerWidth;

    requestAnimationFrame(() => {
        if (screenWidth <= 600) {
            baseContainer.classList.add('mobile-layout');
            baseContainer.classList.remove('desktop-layout');
            controlsContainer.classList.add('mobile-controls');
            controlsContainer.classList.remove('desktop-controls');
        } else {
            baseContainer.classList.add('desktop-layout');
            baseContainer.classList.remove('mobile-layout');
            controlsContainer.classList.add('desktop-controls');
            controlsContainer.classList.remove('mobile-controls');
        }
    });
}

// Load items and adjust layout on window load
window.onload = () => {
    loadItemsInBatches();
    adjustCanvasLayout();
    
    
};

window.addEventListener('resize', adjustCanvasLayout);

// Function to start the game (hide menu, show game)
function enterGame() {
    document.querySelector('.main-menu').style.display = 'none';
    document.querySelector('.game-container').style.display = 'block';
const audio = document.getElementById("backgroundMusic");
if (audio) {
    audio.play().catch(e => console.warn("Autoplay blocked:", e));
    const button = document.getElementById("musicToggleButton");
    if (button) button.textContent = "🔊 Music On";
}
}

// Function to remove focus from button after interaction
function blurButton(event) {
    event.preventDefault(); // Prevent default focus behavior
    event.target.blur(); // Remove focus from the button
}

// Function for Button 1: Show Base2 on press, hide on release
function pressButton1(event) {
    blurButton(event);
    document.getElementById("base2-image").style.display = "block";
}

function releaseButton1(event) {
    blurButton(event);
    document.getElementById("base2-image").style.display = "none";
}

// Function for Button 2: Show Base3 on press, hide on release
function pressButton2(event) {
    blurButton(event);
    document.getElementById("base3-image").style.display = "block";
}

function releaseButton2(event) {
    blurButton(event);
    document.getElementById("base3-image").style.display = "none";
}

// Add event listeners to buttons (Support Desktop & Mobile)
document.addEventListener("DOMContentLoaded", () => {
    const button1 = document.querySelector(".button-1");
    const button2 = document.querySelector(".button-2");

    // Button 1 (Base2)
    if (button1) {
        button1.addEventListener("mousedown", pressButton1);
        button1.addEventListener("mouseup", releaseButton1);
        button1.addEventListener("touchstart", pressButton1, { passive: false });
        button1.addEventListener("touchend", releaseButton1, { passive: false });
    }

    // Button 2 (Base3)
    if (button2) {
        button2.addEventListener("mousedown", pressButton2);
        button2.addEventListener("mouseup", releaseButton2);
        button2.addEventListener("touchstart", pressButton2, { passive: false });
        button2.addEventListener("touchend", releaseButton2, { passive: false });
    }
});

