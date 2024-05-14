document.body.style.width = '600px';
// document.body.style.height = '700px';
// Get all the grid items
const gridItems = document.querySelectorAll('.grid-item');

// Determine keys pressed
const forceKeyToUpper = (event) => {
  let element = event.target;
  let charInput = event.key; // use e.key instead of e.keyCode for modern browsers apperantly

  const gridItem = element.nextElementSibling;
  if (gridItem){
    gridItem.focus();
  }

  // handle exceptions
  if (charInput === 'Backspace'|| charInput === 'ArrowLeft' || charInput === 'ArrowRight') 
    {
      return;
      console.log('balls');
    // If it's a lowercase letter or a non-alphabetic key, let it pass without conversion
    }
    //convert the element to an UPPERCASE LETTER
    element.value = element.value.toUpperCase();

};


//Define the function to move focus to the previous grid element
const moveToPreviousGridElement = (element) => {
    // Move focus to the previous grid element
    const gridItem = element.previousElementSibling;
    if (gridItem) {
        gridItem.focus();
    }
};

// move across the grid
const moving = (event) => {
  let element = event.target;
  let charInput = event.key;

  if (charInput === 'Backspace') 
    {
       // If there is text selected, delete the selected text
       if (element.selectionStart !== element.selectionEnd) {
        return; // Let the default backspace behavior handle deletion
    }
    
    // If the cursor is at the beginning of the input, move to the previous grid element
    if (element.selectionStart === 0) {
        moveToPreviousGridElement(element);
        event.preventDefault(); // Prevent the default backspace behavior
    }
} 
};
      
const RandomWord = (event) => {
  //randomly generate a number and pick that number from the list of words
  
  let 

};











// Iterate over each grid item
gridItems.forEach(gridItem => {
   //onkeyup = gitdItem.value = gridItem.value.toUpperCase();
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

    //SETS EACH INPUT TO BE UPPERCASE
    gridItem.addEventListener("input", forceKeyToUpper);
    gridItem.addEventListener("keydown", moving);

  });

