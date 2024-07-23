from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the BERT model for question answering
qa_pipeline = pipeline("question-answering", model="bert-large-uncased-whole-word-masking-finetuned-squad")

# Example context for testing purposes
default_context = """
The Transformer architecture is a deep learning model introduced in the paper "Attention Is All You Need".
It relies entirely on self-attention mechanisms to compute representations of its input and output without using sequence-aligned RNNs or convolution.
The model achieves parallelization by processing all elements in the sequence simultaneously, which significantly improves training efficiency.
"""

@app.route('/api/ask-ai', methods=['POST'])
def ask_ai():
    data = request.json
    question = data.get('question')
    context = data.get('context', default_context)

    if not question:
        return jsonify({'error': 'Question is required'}), 400

    result = qa_pipeline(question=question, context=context)
    answer = result['answer']
    
    return jsonify({'answer': answer})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7001)  # Changed port to 7001
