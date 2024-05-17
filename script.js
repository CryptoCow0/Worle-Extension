
document.body.style.width = '600px';
//Put the cursor into the first spot
document.addEventListener('DOMContentLoaded', function() {
  const firstGridItem = document.querySelector('.grid-item');
  if (firstGridItem) {
    firstGridItem.focus();
  }
});

// Global variables
const gridItems = document.querySelectorAll('.grid-item');
let count = 0;
// let x; was used for testing KeyCodes
const currentWord = []; // takes letters from grid
let Word = ''; // used for checking
let condition = false; // used in Input Handling



// Determine keys pressed
const handleInput = (event) => {
    let element = event.target; //element that trigged the event
    let charInput = event.data; // Get the character entered
     
//    x = event.keyCode; not actually needed because we are only concered with inputs
    
    //Input is a character
    if(charInput && charInput !== '' && condition === false){
      // Convert input to uppercase
      element.value = charInput.toUpperCase();

      currentWord.push(element.value); // this will help us when checking the word

      updateWordDisplay(); // show's us the word for debuggin

    count++; // when this is 4 we don't want to move

    if (count === 5){
      condition = true; // you are at the end of the word
      return;
    };
    
    // Move focus to the next grid item
    const gridItem = element.nextElementSibling; //moves to next item
    if (gridItem){
    gridItem.focus();
    };
  }

};


//helper fucntion 
const updateWordDisplay = () => {
  const h1Element = document.getElementById('countDisplay');
  if (h1Element) {
      h1Element.textContent = count.toString(); // Convert count to string before setting as text content
    } 
};
// debugging fucnction
const printKeyEvent = (event) => {
  const h2Element = document.getElementById('countDisplay');
  if (h2Element) {
      h2Element.textContent = event.keyCode.toString(); // Set the text content to the value of event.key
     // h2Element.textContent = x;
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
  let charInput = event.keyCode;
  index = getIndex(element);
  if (charInput === 8) 
      {
        
      if(count === 0){
        condition=false;
          return; // to avoid moving back
        };


      event.preventDefault();
      currentWord.pop();

      updateWordDisplay();
       if(count !== 0)
         {count--;
          condition = false;
         };
       
         
       element.value = element.value.slice(0, -1);
       
       //currentWord.pop(index);
        moveToPreviousGridElement(element);
        updateWordDisplay();
        }
      
      };

const wrongLength = (event) =>{
  const h1Element = document.getElementById('countDisplay');
if (h1Element) {
    h1Element.textContent = "Not long enough"; // Convert count to string before setting as text content
    //h1Element.textContent = x;
  } 
  rightLength(event);
};

const rightLength = (event) => {
 
  const h2Element = document.getElementById('WordLength');
  if(h2Element){
    h2Element.textContent = Word;
  }
}

const Comparison = (event) => {
  let element = event.target;
  let charInput = event.keyCode;
  
  if (charInput === 13) // enter was pushed
    {
      Word = currentWord.join('');//take list and make into word

      if(Word.length !== 5){
        //Word = ''; // not long enough reset
        wrongLength(event);
        return; // avoid even checking the rest
      }
      
      //will update this soon
      secretWord = "GREAT"
    
    // Compare it to the secret word
    if (Word === secretWord){
      const gridItems = document.querySelectorAll('.grid-item');
      index = getIndex(element);
      // Change the background color to green
      for(let i = 5; i>0; i--){
        
        item = gridItems[index];

        item.style.backgroundColor = 'green';

        index--;
      }
    }
    // not exactly equal
    else{
      result = [];
      for(let i = 0; i < secretWord.length; i++)
        {
          const letter = secretWord[i]; // character
          let match = false;

          //for(let j = 0; j < Word.length; j++){

            if(Word[i] == letter){
              result.push(2); // 2 means we have an exact match
              match = true;
            }
            // If the letter is not found at the same index, check if it exists anywhere else in the second string
          if (!match && secretWord.includes(Word[i])) {
              result.push(1); // Same character exists but not at the same position
              match = true;
          }
          
          // If the letter is not found in the second string
          if (!match) {
              result.push(0);
          };

     

    }
    //after the loop
    console.log(result);
    Coloring(result,event);
    
  }

    };

};

function Coloring(result, event) {

  const gridItems = document.querySelectorAll('.grid-item');
    let index = getIndex(event.target); // gets the index

    // Change the background color based on the result array
    for (let i = result.length - 1; i >= 0; i--) {
      console.log(i);
      item = gridItems[index];
      if(!item){
        console.error('Grid Item is bugging');
        return;
      }
        if (result[i] === 2) {
            item.style.backgroundColor = 'green';
        } 
        else if (result[i] === 1) {
            item.style.backgroundColor = 'rgba(253,208,23, 0.8)';
        }

      index--;
    
};
// After coloring you must move to next row and reset variables
result = []; // reset result
count = 0; //used for movement
Word = '';// new guess is empty
condition = false; // condition on

for(let i = 0; i< 5; i++){
  currentWord.pop(); // empties the const
};
updateWordDisplay();

// Move focus to the next grid item
   // moveToNextGridElement(element);
   const gridItem = event.target.nextElementSibling; //moves to next item
   //count++; // when this is 5 we don't want to move
   if (gridItem){
  gridItem.focus();
   return;
   };


}
      
const RandomWord = () => {
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
    // document.addEventListener("input", function(event) {
    //    //printKeyEvent(event);
    //    var charCode = event.keyCode;

    //    //printKeyEvent(event);
    //     if (charCode >= 65 && charCode <= 90){
    //       printKeyEvent(event);

    //       handleInput(event);
    //     }
    // });
    gridItem.addEventListener("input", handleInput); // This is for characters placed into the grid
    //gridItem.addEventListener("keydown", handleInput);
    gridItem.addEventListener("keydown", BackwardsMotion); // backspace isn't considered an input so this is a seperate consideration

    gridItem.addEventListener("keydown", Comparison); // checks if this is a word

});

