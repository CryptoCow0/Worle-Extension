document.body.style.width = '600px';
// document.body.style.height = '700px';
// Get all the grid items
const gridItems = document.querySelectorAll('.grid-item');
let count = 0;
let x;
const currentWord = []; // takes letters from grid
let Word = ''; // used for checking
let condition = false; // used in Input Handling

// Determine keys pressed
const handleInput = (event) => {
  let element = event.target;
  let charInput = event.data; // Get the character entered
   x = event.keyCode;
  //updateCountDisplay();
  if(charInput && condition === false){
        // Convert input to uppercase
    element.value = charInput.toUpperCase();

    currentWord.push(element.value);// this will help us when checking the word

    //updateCountDisplay();
    if (count === 4){
          condition = true; // you are at the end of the word
          return;
        };
        
        // Move focus to the next grid item
        //moveToNextGridElement(element);
        const gridItem = element.nextElementSibling; //moves to next item
        count++; // when this is 5 we don't want to move
        if (gridItem){
        gridItem.focus();
        };
    }   

};



//helper fucntion
const updateCountDisplay = () => {
  const h1Element = document.getElementById('countDisplay');
  if (h1Element) {
      h1Element.textContent = Word.toString(); // Convert count to string before setting as text content
      //h1Element.textContent = x;
    } 
};
// debugging fucnction
const printKeyEvent = (event) => {
  const h2Element = document.getElementById('countDisplay');
  if (h2Element) {
      h2Element.textContent = Word.toString(); // Set the text content to the value of event.key
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

  if (charInput === 8) 
      {
        //event.preventDefault();

       if(count !== 0)
         {count--;
          condition = false;
         };
       if(count === 0){condition=false;};

       element.value = element.value.slice(0, -1);
       moveToPreviousGridElement(element);
       
        };
   
};

const wrongLength = (event) =>{
  const h1Element = document.getElementById('countDisplay');
if (h1Element) {
    h1Element.textContent = "Not long enough"; // Convert count to string before setting as text content
    //h1Element.textContent = x;
  } 
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
  
  if (charInput === 13)// enter was pushed
    {
      Word = currentWord.join('');
      if(Word.length !== 5){
        Word = ''; // not long enough reset
        wrongLength(event);
      }
      // rightLength(event); This does work

    // Compare it to the secret word
    if (Word === "GREAT"){
      const gridItems = document.querySelectorAll('.grid-item');
      index = getIndex(element);
      // Change the background color to green
      for(let i = 5; i>0; i--){
        
        item = gridItems[index];
      //gridItems.forEach(function(item) {
        item.style.backgroundColor = 'green';
        index--;

    //});
  }


  }


    };

};


      
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
    // document.addEventListener('keydown', (event) => {
    //    wrongLength(event);
    // });
    gridItem.addEventListener("input", handleInput); // This is for characters placed into the grid
 
    gridItem.addEventListener("keydown", BackwardsMotion); // backspace isn't considered an input so this is a seperate consideration

    gridItem.addEventListener("keydown", Comparison); // checks if this is a word

});

