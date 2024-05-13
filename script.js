document.body.style.width = '600px';
// Get all the grid items
const gridItems = document.querySelectorAll('.grid-item');

// Iterate over each grid item
gridItems.forEach(gridItem => {
    // Get the computed style of the grid item
    const gridItemStyle = getComputedStyle(gridItem);
    // Get the width of the grid item
    const gridItemWidth = parseFloat(gridItemStyle.width);
    // Get the height of the grid item
    const gridItemHeight = parseFloat(gridItemStyle.height);
    // Calculate the font size based on the grid item size
    const fontSize = Math.min(gridItemWidth, gridItemHeight) * 0.8; // You can adjust the multiplier as needed

    // Set the font size of the grid item
    gridItem.style.fontSize = fontSize + 'px';
});

//document.body.style.height = '800px';
// Get the current window ID
//chrome.windows.getCurrent(function(window) {
    // Define new size
  //  var updateInfo = {
//         width: 800, // New width
//         height: 600, // New height
//     };

//     // Update the window size
//     chrome.windows.update(window.id, updateInfo);
// });
