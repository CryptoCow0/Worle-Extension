# Generate a 5-letter word
import tensorflow as tf
import re # regurlar expressions
from tensorflow import keras
from flask import Flask, jsonify
from flask_cors import CORS
import random
import numpy as np
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # '3' for only errors
import tensorflow as tf

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


# for word in cleanWords:
#     wordIndex = [charIndex[char] for char in word]
#     if(len(word) == seq_len):
#         for i in range(1, seq_len):
#             inputSeq = word[:i]
#             padding  = ["<PAD>"] * (4- len(inputSeq))
#             inputSeq = list(padding) + list(inputSeq)
            
#             target = word[i]
#             target = [charIndex[char] for char in target]
            
#             # print(inputSeq)#
#             inputSeqIndex = [charIndex[char] for char in inputSeq]
        
#             # print(inputSeqIndex)
#             inputSeqCode = keras.utils.to_categorical(inputSeqIndex,num_classes=27)
#             # print(target)
#             targetCode = keras.utils.to_categorical(target,num_classes=27)
#             targetCode = np.squeeze(targetCode)
#             x.append(inputSeqCode)
#             y.append(targetCode)

model = tf.keras.models.load_model('word_model.keras')


def generate_word(model,CharIndex,indexChar, seed="<PAD>"):

    generated_word = seed if seed != "<PAD>" else ""
    # randomly pick the first letter
    first_index = random.randint(0,25)
    
    generated_word = seed if seed != "<PAD>" else ""
    
    generated_word += indexToChar[first_index]

    inputSeq = [charIndex["<PAD>"]] * 3 + [first_index]  # Initial padded input

    

    for _ in range(5 - len(generated_word)):
        inputSeqCode = keras.utils.to_categorical(inputSeq, num_classes = len(charIndex))
        inputSeqCode = inputSeqCode[np.newaxis, ...]  # Add batch dimension (1, 4, 27)

        # Predict the next letter
        prediction = model.predict(inputSeqCode, verbose=0)
        next_index = np.argmax(prediction)  # Get the index of the most likely letter

        next_char = indexChar[next_index]
        generated_word += next_char

        # Update the input sequence (slide window forward)
        inputSeq = inputSeq[1:] + [next_index]

    return generated_word


# create Flask app

app = Flask(__name__)
CORS(app)

@app.route('/generate',methods=['GET'])

def get_word():
    word = generate_word(model, charIndex, indexToChar)
    return jsonify({'word': word})

if __name__ == '__main__':
    app.run(debug=True)