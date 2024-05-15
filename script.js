document.body.style.width = '600px';
// document.body.style.height = '700px';
// Get all the grid items
const gridItems = document.querySelectorAll('.grid-item');

// Determine keys pressed
const MovingForward = (event) => {
  let element = event.target;
  let charInput = event.key; // use e.key instead of e.keyCode for modern browsers apperantly

  const gridItem = element.nextElementSibling; //moves to next item
  if (gridItem){
    gridItem.focus();
  }

  // handle exceptions
  if (charInput === 'Backspace'|| charInput === 'ArrowLeft' || charInput === 'ArrowRight') 
    {
      return;
    }
    //convert the element to an UPPERCASE LETTER
  element.value = element.value.toUpperCase();
  
};

const handleInput = (event) => {
  let element = event.target;
  let charInput = event.data; // Get the character entered
  let cursorPositionBefore = element.selectionStart; // Get cursor position before input


  if (charInput && charInput.trim() !== '') {
      // Convert input to uppercase
      element.value = charInput.toUpperCase();
      // Move focus to the next grid item
      //moveToNextGridElement(element);
      const gridItem = element.nextElementSibling; //moves to next item
      if (gridItem){
      gridItem.focus();
      }
  }     
  let cursorPositionAfter = element.selectionStart; // Get cursor position after input

  // If the cursor position decreased after input, it indicates backward movement
  if (cursorPositionAfter === cursorPositionBefore) {
      // If the cursor is at the beginning of the input, move to the previous grid element
      if (cursorPositionAfter === 0) {
          moveToPreviousGridElement(element);
      }
  }

};







// Define a function to get the index of a grid item
const getIndex = (element) => {
  const gridItems = document.querySelectorAll('.grid-item');
  return Array.from(gridItems).indexOf(element);
};

// Define the function to move focus to the previous grid element
const moveToPreviousGridElement = (element) => {
  // Get the index of the current element
  const currentIndex = getIndex(element);
  // Move focus to the previous grid element
  const previousIndex = currentIndex - 1;
  if (previousIndex >= 0) {
      const gridItems = document.querySelectorAll('.grid-item');
      gridItems[previousIndex].focus();
  }
};

// move across the grid
const BackwardsMotion = (event) => {
  let element = event.target;
  let charInput = event.key;

  if (charInput === 'Backspace') 
    {
       // If there is text selected, delete the selected text
       if (element.selectionStart !== element.selectionEnd) {
        return; // Let the default backspace behavior handle deletion
    };
    
    // If the cursor is at the beginning of the input, move to the previous grid element
    if (element.selectionStart === 0) {
        moveToPreviousGridElement(element);
        event.preventDefault(); // Prevent the default backspace behavior
    };
};


};



      
const RandomWord = (event) => {
  //randomly generate a number and pick that number from the list of words

  let x = Math.floor(Math.random() * 458); // random number from 1 to 458
  const fs = require('fs');

// Specify the file path
const filePath = 'WordleList.txt'; // Replace 'path/to/your/file.txt' with the path to your file

// Read the file asynchronously
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    // Split the file contents into an array of lines
    const lines = data.split('\n');

    let secretWord;

    // Iterate through each line
    for(let i =0; i < x; i++){
        const line = lines[i];

        if (i === x-1){
          secretWord = line.trim();
          const secretWordHeading = document.getElementById('secretWordHeading');
          secretWordHeading.textContent = secretWord;
        }
    };
});


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
    gridItem.addEventListener("input", handleInput);
    //gridItem.addEventListener("keydown", BackwardsMotion);

  });

