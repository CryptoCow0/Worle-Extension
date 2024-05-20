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
//RandomWord();
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
const NotInBank = (event) => {
  const h3Element = document.getElementById('NotInBank');
  if(h3Element){
    h3Element.textContent = "Word not in word list."
  }
}

const InBank = (event) => {
  const h3Element = document.getElementById('NotInBank');
  if(h3Element){
    h3Element.textContent = ""
  }
}

const fetchSecretWord = async () => {
  //randomly generate a number and pick that number from the list of words
  const x = Math.floor(Math.random() * 164); // random number from 0 to 457

  // Specify the file path or URL
  const filePath = 'WordleList.txt'; // Update this to the correct path or URL

  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.text();
  // Split the file contents into an array of lines
  const lines = data.split('\n');
  if (lines.length >= x) {
    // Get the secret word
    return lines[x].trim();
  } else {
    throw new Error('The random number exceeds the number of words in the list.');
  }
};



let secretWord = '';

const setSecretWord = () => {
  fetchSecretWord()
    .then(word => {
      secretWord = word;
      // Update the DOM with the secret word if needed
      const secretWordHeading = document.getElementById('secretWordHeading');
      if (secretWordHeading) {
        secretWordHeading.textContent = secretWord;
      }
      console.log('Secret Word:', secretWord); // For debugging
    })
    .catch(error => {
      console.error('Error fetching secret word:', error);
    });
};


setSecretWord(); // only call it once

// checks if work is in file
const checkWordInFile = async (searchWord) => {
  const filePath = 'WordleList.txt'; // Update this to the correct path or URL

  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const text = await response.text();
    const regex = new RegExp(`\\b${searchWord}\\b`, 'i');
    return regex.test(text);
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};



const Comparison = async (event) => {
  let element = event.target;
  let charInput = event.keyCode;

  if (charInput === 13) { // enter was pushed
    let Word = currentWord.join(''); // take list and make into word
    Word = Word.toLowerCase(); // to be able to compare
    console.log(Word);
    if (Word.length !== 5) {
      wrongLength(event);
      return; // avoid even checking the rest
    }

    // Compare it to the secret word
    if (Word === secretWord) {
      const gridItems = document.querySelectorAll('.grid-item');
      let index = getIndex(element);
      // Change the background color to green
      for (let i = 5; i > 0; i--) {
        let item = gridItems[index];
        item.style.backgroundColor = 'green';
        index--;
      }
    } else {
      const check = await checkWordInFile(Word); // Await the result of the check
      console.log(check); // Logs true if the word is found, otherwise false

      if (!check) {
        //console.error("testing some things");
        NotInBank(event);
        return; // Exit if the word is not valid
      }
      InBank(event);

      // Process the word comparison
      let result = [];
      for (let i = 0; i < secretWord.length; i++) {
        const letter = secretWord[i]; // character
        let match = false;

        if (Word[i] === letter) {
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
        }
      }

      // After the loop
      console.log(result);
      Coloring(result, event);
    }
  }
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

    gridItem.addEventListener("input", handleInput); // This is for characters placed into the grid
    //gridItem.addEventListener("keydown", handleInput);
    gridItem.addEventListener("keydown", BackwardsMotion); // backspace isn't considered an input so this is a seperate consideration

    gridItem.addEventListener("keydown", Comparison); // checks if this is a word

});

