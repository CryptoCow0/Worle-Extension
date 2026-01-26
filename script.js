let English = false;
let Spanish = false;

document
  .getElementById('select-english')
  .addEventListener('click', () => selectLanguage('english'));

document
  .getElementById('select-spanish')
  .addEventListener('click', () => selectLanguage('spanish'));


function selectLanguage(language) {
  document.getElementById('main-content').classList.remove('hidden');
  document.getElementById('select-english').classList.add('hidden');
  document.getElementById('select-spanish').classList.add('hidden');
  document.getElementById('H1').classList.add('hidden');

  English = language === 'english';
  Spanish = language === 'spanish';

  setSecretWord();

  setTimeout(focusFirstGridItem, 0);

}



document.body.style.width = '600px';


//Put the cursor into the first spot
function focusFirstGridItem() {
  const firstGridItem = document.querySelector('.grid-item');
  if (firstGridItem) {
    firstGridItem.focus();
  }
};

// Global variables
const gridItems = document.querySelectorAll('.grid-item');
let count = 0; // used for word Length
const currentWord = []; // takes letters from grid
let Word = ''; // used for checking
let condition = false; // used in Input Handling



// Determine keys pressed
const ForwardsMotion = (event) => {
    let element = event.target; //element that trigged the event
    let charInput = String.fromCharCode(event.keyCode); // Get the character entered
    let key = event.key; // get the keyCode

    if(/^[A-Z]$/.test(key.toUpperCase()) && condition === false){

      if (count != 0){
      const gridItem = element.nextElementSibling; //moves to next item

       gridItem.focus();
       gridItem.value = charInput.toUpperCase();
     
      currentWord.push(gridItem.value); // push the letter into the list
      }
      else{
        element.value = charInput.toUpperCase();
        currentWord.push(element.value);
      }

      count++; // when this is 4 we don't want to move
     
      if (count === 5){

        condition = true; // you are at the end of the word
        return;
      };
    
  };
  
};

// helper fucntion used for testing
const updateWordDisplay = () => {
  const h1Element = document.getElementById('countDisplay');
  if (h1Element) {
      h1Element.textContent = currentWord.toString(); // Convert count to string before setting as text content
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

        clearTags(event);

        if(count === 0 ){
          currentWord.pop();
            return; // to avoid moving back
        }
        if (count === 1){
          count --;
          currentWord.pop();
          return;
        }

        count--;
        condition = false; // always is reduent TODO: optomize
        
        currentWord.pop();

        moveToPreviousGridElement(element);
        
     }
      
};

const wrongLength = (event) =>{
  const h1Element = document.getElementById('countDisplay');
if (h1Element) {
    h1Element.textContent = "Wrong Length"; // Convert count to string before setting as text content
  } 
};

const rightLength = (event) => {
 
  const h2Element = document.getElementById('WordLength');
  if(h2Element){
    h2Element.textContent = "";
  }
}

const NotInBank = (event) => {
  const h3Element = document.getElementById('NotInBank');
  if(h3Element){
    h3Element.textContent = "Word not in word list.";
  }
}
const clearTags = (event) =>{
  // Clears if the word doesn't exist
  const h3Element = document.getElementById('NotInBank');
  if(h3Element){
    h3Element.textContent = "";
  }
  // clears length issues
  const h1Element = document.getElementById('countDisplay');
  if (h1Element) {
      h1Element.textContent = ""; // Convert count to string before setting as text content
    } 
}

const letterCount = {
  a: 514,
  b: 620,
  c: 678,
  d: 466,
  e: 199,
  f: 438,
  g: 430,
  h: 348,
  i: 121,
  j: 139,
  k: 220,
  l: 417,
  m: 461,
  n: 207,
  o: 185,
  p: 579,
  q: 56,
  r: 434,
  s: 1075,
  t: 567,
  u: 124,
  v: 167,
  w: 301,
  x: 13,
  y: 101,
  z: 56
};


const fetchSecretWord = async () => {

  //randomly generate a number and pick that number from the list of words
  const x = Math.floor(Math.random() * 26); // randomly select the letter
  const y = Math.floor(Math.random() * 174); // Random number for the Spanish list
  const letter = String.fromCharCode(97 + x); // 97 = 'a'
  // Specify the file path or URL

  const maxLength = letterCount[letter]; // max number

  const w = Math.floor(Math.random()*maxLength); 

  const filePath = English ? 'testing.txt' : (Spanish ? 'WordleListSpanish.txt' : 'WordleList.txt');
  //console.log("FilePATH is " + filePath);
  const response = await fetch(filePath);
  
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.text();
  // Split the file contents into an array of lines
  const lines = data.split('\n');
if(Spanish){

    if (lines.length >= y) {
    // Get the secret word
    console.log('Are we here chat because otherwise how?');
    return lines[y].trim();
  } else {
    throw new Error('The random number exceeds the number of words in the list.');
  }
  }

  else {
  if (lines.length >= x) {
    // Get the secret word
    return lines[x].split(" ")[w].trim();
  } else {
    throw new Error('The random number exceeds the number of words in the list.');
  }
  }


};



let secretWord = '';

const setSecretWord = async () => {
  try {
    const word = await fetchSecretWord();
    if (!word) {
     console.log("no word :/"); 
      return; // Avoids crashing if word is undefined
    }
    secretWord = word.toLowerCase();

    if (secretWord.length !== 5) {
      return setSecretWord(); // Retry if word is bad
    }

    // Update the DOM with the secret word if needed
    const secretWordHeading = document.getElementById('secretWordHeading');
    if (secretWordHeading) {
      secretWordHeading.textContent = secretWord;
    }

    console.log('Secret Word:', secretWord); // For debugging
  } catch (error) {
    console.error('Error fetching secret word:', error);
  }
};

// checks if work is in file
const checkWordInFile = async (searchWord) => {
  const filePath = English ? 'testing.txt' : (Spanish ? 'WordleListSpanish.txt' : null);
  //const filePath = 'WordleList.txt'; // Update this to the correct path or URL

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

function RemoveMatchingLetter(str1, str2){

  // convert strings into arrays for easier manipulation
  let arr1 = str1.split('');

  let position = 0;
  for(let i = 0; i < arr1.length;i++){
    
    if (arr1[i] === str2){
      arr1.splice(i,1);
      break;
    }

  }
  let newStr1 = arr1.join('');
  return newStr1;

};

function Restart(){
  // After coloring you must move to next row and reset variables
result = []; // reset result
count = 0; //used for movement
enter = 0; 
Word = '';// new guess is empty
condition = false; // condition on

for(let i = 0; i< 5; i++){
  currentWord.pop(); // empties the const
};
  gridItems.forEach(gridItem =>{
    gridItem.value = ' ';

    gridItem.style.backgroundColor = "rgba(80, 79, 79, 0.8)";
    //console.log("TESTING THIS ISH")
  })
  

  //TODO AFTER PUT FOCUS ON THE LEFT MOST GRID.

  //Set a new word to be the secrectWord;
  setSecretWord();

}
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let enter = 0;
const Comparison = async (event) => {
  let element = event.target;
  let charInput = event.keyCode;
  let sucess = false;
  if (charInput === 13) { // enter was pushed
    let Word = currentWord.join(''); // take list and make into word
    Word = Word.toLowerCase(); // to be able to compare
    //console.log(Word);
    if (Word.length !== 5) {
      wrongLength(event);
      return; // avoid even checking the rest
    }
    
    // Compare it to the secret word
    if (Word === secretWord) {
      sucess = true;
      const gridItems = document.querySelectorAll('.grid-item');
      let index = getIndex(element);
      // Change the background color to green
      for (let i = 5; i > 0; i--) {
        let item = gridItems[index];
        item.style.backgroundColor = '#538D4E';
        index--;
      };

    } 
    else {
      const check = await checkWordInFile(Word); // Await the result of the check
      //console.log(check); // Logs true if the word is found, otherwise false

      if (!check) {
        //console.error("testing some things");
        NotInBank(event);
        return; // Exit if the word is not valid
      }
     
      // Process the word comparison
      let result = [];
      let usedChars = {};

      // populate the dictionary of characters
      for(let character of secretWord){
        usedChars[character] = (usedChars[character] || 0) +1;
      }

      for (let i = 0; i < Word.length; i++) {
        const letter = Word[i]; // character
        //let match = false;

        if (secretWord[i] === letter) {
          result.push(2); // 2 means we have an exact match
          //match = true;
          usedChars[letter]--;
        }
        else{
          result.push(null); //Placeholder
        }
      }
      for (let i =0; i< Word.length; i++){
        if (result[i] == null){
          if(usedChars[Word[i]] > 0){
            result[i] = 1;
            usedChars[Word[i]]--; //reduce the count for used cahracters
          }
        
        else{
          result[i] = 0;
        }
      }

        }

      Coloring(result, event);
    }
    if(sucess){
      await sleep(500);
      if(confirm("You did it! Want to play again?")){
      Restart();
      }
    }
    enter++;
    if(enter == 5 && sucess == false){
      if(confirm("DANG IT SO CLOSE... kinda, the correct word was " + secretWord +'\n' + "Want to play again? (You know you do.)"))
        {
          
        Restart();
        return;
      }
      else{
        window.close();
      }
      
    }
   
  }
};

function Coloring(result, event) {

  const gridItems = document.querySelectorAll('.grid-item');
    let index = getIndex(event.target); // gets the index

    // Change the background color based on the result array
    for (let i = result.length - 1; i >= 0; i--) {
      //console.log(i);
      item = gridItems[index];
      if(!item){
        console.error('Grid Item is bugging');
        return;
      }
        if (result[i] === 2) {
            item.style.backgroundColor = '#538D4E';
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
////updateWordDisplay();

// Move focus to the next grid item
   // moveToNextGridElement(element);
   const gridItem = event.target.nextElementSibling; //moves to next item
   //count++; // when this is 5 we don't want to move
   if (gridItem){
  gridItem.focus();
   return;
   };


}
      


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
    
    let inputHandled = true;
    let keydown = true;

    gridItem.addEventListener("keydown", ForwardsMotion); // This is for characters placed into the grid
    
    
    //gridItem.addEventListener("keydown", handleInput);
    gridItem.addEventListener("keyup", BackwardsMotion); // backspace isn't considered an input so this is a seperate consideration

    gridItem.addEventListener("keydown", Comparison); // checks if this is a word

});

