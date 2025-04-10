# Generate a 5-letter word
import tensorflow as tf
import re # regurlar expressions
from tensorflow import keras
import numpy as np
# from tensorflow import models 
# from tensorflow import Sequential
# from tensorflow import LSTM, Dense
# from keras.utils import to_categorical # for bit vectors (One-Hot Encoding)

    
# read the file
with open('WordleList.txt','r') as file:
    words = file.read().splitlines()


# clean the dataset
cleanWords = []
for word in words:
    word = word.lower()
    word = re.sub(r'[^a-z]', '', word)
    if len(word) == 5:
        cleanWords.append(word)

# Remove duplicates
cleanWords = list(set(cleanWords))


# Convert words to one-hot encoded inputs

x = []
y = []

# Tokenization for characters
vocab = list("abcdefghijklmnopqrstuvwxyz")

charIndex = {char: idx for idx, char in enumerate(vocab)}

indexToChar = {idx: char for char, idx in charIndex.items()}
charIndex["<PAD>"] = 26 # special token
seq_len = 5


for word in cleanWords:
    wordIndex = [charIndex[char] for char in word]
    if(len(word) == seq_len):
        for i in range(1, seq_len):
            inputSeq = word[:i]
            padding  = ["<PAD>"] * (4- len(inputSeq))
            inputSeq = list(padding) + list(inputSeq)
            
            target = word[i]
            target = [charIndex[char] for char in target]
            
            # print(inputSeq)#
            inputSeqIndex = [charIndex[char] for char in inputSeq]
        
            # print(inputSeqIndex)
            inputSeqCode = keras.utils.to_categorical(inputSeqIndex,num_classes=27)
            # print(target)
            targetCode = keras.utils.to_categorical(target,num_classes=27)
            targetCode = np.squeeze(targetCode)
            x.append(inputSeqCode)
            y.append(targetCode)

# # Convert to numpy arrays
x = np.array(x)  # Shape: (num_samples, sequence_length, 26)
y = np.array(y)  # Shape: (num_samples, 26)

# # Build a simple LSTM model
model = keras.Sequential([

    keras.layers.Masking(mask_value=26,input_shape=(4,27)),
    keras.layers.LSTM(256, return_sequences=True),
    keras.layers.Dropout(0.2),
    keras.layers.LSTM(128),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(27, activation="softmax")
   
])
print(model.summary())

# # Compile and train
# optimizer= keras.optimizers.Adam(learning_rate=0.001) 
model.compile(optimizer='adam', loss="categorical_crossentropy", metrics=['accuracy', 'precision', 'recall', 'mae', 'mse', 'auc'])
model.fit(x, y, epochs=220)
model.save('word_model.keras')

def generate_word(model,CharIndex,indexChar, seed="<PAD>"):
    inputSeq = [charIndex["<PAD>"]] * 3 + [charIndex[seed]]  # Initial padded input
    generated_word = seed if seed != "<PAD>" else ""

    for _ in range(5 - len(generated_word)):
        inputSeqCode = keras.utils.to_categorical(inputSeq, num_classes=len(charIndex))
        inputSeqCode = inputSeqCode[np.newaxis, ...]  # Add batch dimension (1, 4, 27)

        # Predict the next letter
        prediction = model.predict(inputSeqCode, verbose=0)
        next_index = np.argmax(prediction)  # Get the index of the most likely letter

        next_char = indexChar[next_index]
        generated_word += next_char

        # Update the input sequence (slide window forward)
        inputSeq = inputSeq[1:] + [next_index]

    return generated_word

print(generate_word(model, charIndex, indexToChar))