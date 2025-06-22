const ALL_CATEGORIES = [
    "top1", "top2", "pants1", "pants2", "skirt1", "skirt2", 
    "shoes1", "shoes2", "jacket1", "jacket2", "dress1", "dress2", 
    "sweatshirt1", "sweatshirt2", "hat1", "hat2", "socks1", "socks2", 
    "accessories", "leaf1", "leaf2", "topunderwear1", "bottomunderwear1","bottomunderwear2",
    "boxers1", "boxers2", "onepiece1", "topunderwear2", "accessories1", "accessories2"
];

function applyPreset1() {
    hideSpecificCategories(ALL_CATEGORIES);
    showItems([
        ["jacket1_1.png", "jacket1"],
        ["top1_1.png", "top1"],
        ["glove1_1.png", "glove1"],
        ["pants1_1.png", "pants1"],
        ["boots1_1.png", "boots1"],
        ["glove2_1.png", "glove2"],
        ["boots2_1.png", "boots2"],
        ["belt2_1.png", "belt2"],
        ["pants2_1.png", "pants2"],
        ["sweatshirt2_1.png", "sweatshirt2"],
        ["bottomunderwear1_1.png", "bottomunderwear1"],
        ["topunderwear1_1.png", "topunderwear1"],
        ["boxers2_1.png", "boxers"]
    ]);
}

function applyUnderwearOnlyPreset() {
    hideSpecificCategories(ALL_CATEGORIES);
    showItems([
        ["topunderwear1_1.png", "topunderwear1"],
        ["bottomunderwear1_1.png", "bottomunderwear1"],
        ["boxers2_1.png", "boxers"]
    ]);
}



// Utility Functions

function showItems(items) {
    items.forEach(([itemId, category]) => showItem(itemId, category));
}

function showItem(itemId, categoryName) {
    const selectedItem = document.getElementById(itemId);
    if (selectedItem) {
        selectedItem.style.visibility = "visible";
        selectedItem.style.display = "block";
        selectedItem.style.position = "absolute";
        selectedItem.style.left = "0";
        selectedItem.style.top = "0";
        selectedItem.style.zIndex = getZIndex(categoryName);
    } else {
        console.warn(`Item not found: ${itemId} in category ${categoryName}`);
    }
}