from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForQuestionAnswering, Trainer, TrainingArguments
import torch


# Load the dataset
data_files = {"train": "qa_data.json"}  # Replace with your file path
dataset = load_dataset('json', data_files=data_files, field='data')

# Tokenize the dataset
model_name = "distilbert-base-uncased-distilled-squad" 
tokenizer = AutoTokenizer.from_pretrained(model_name)

def preprocess_function(examples):
    contexts = []
    questions = []
    answers = []
    
    for data_entry in examples['paragraphs']:
        for qa in data_entry[0]['qas']:
            questions.append(qa['question'])
            contexts.append(data_entry[0]['context'])
            answers.append(qa['answers'][0])  # Assume one answer per question

    inputs = tokenizer(
        contexts,
        questions,
        max_length=384,
        truncation="only_second",
        stride=128,
        return_overflowing_tokens=True,
        return_offsets_mapping=True,
        padding="max_length",
    )
    
    offset_mapping = inputs.pop("offset_mapping")
    start_positions = []
    end_positions = []
    
    for i, offsets in enumerate(offset_mapping):
        answer = answers[i]
        start_char = answer["answer_start"]
        end_char = start_char + len(answer["text"])

        sequence_ids = inputs.sequence_ids(i)

        # Find the start and end of the context
        context_start = 0
        while sequence_ids[context_start] != 1:
            context_start += 1
        context_end = len(sequence_ids) - 1
        while sequence_ids[context_end] != 1:
            context_end -= 1

        # If the answer is out of the context, set to CLS index
        if offsets[context_start][0] > start_char or offsets[context_end][1] < end_char:
            start_positions.append(inputs.input_ids[i].index(tokenizer.cls_token_id))
            end_positions.append(inputs.input_ids[i].index(tokenizer.cls_token_id))
        else:
            start_positions.append(start_char - offsets[context_start][0])
            end_positions.append(end_char - offsets[context_start][0])

    inputs["start_positions"] = start_positions
    inputs["end_positions"] = end_positions
    return inputs

# Apply the preprocessing function to the dataset
tokenized_datasets = dataset.map(preprocess_function, batched=True, remove_columns=['paragraphs'])

# Define training arguments
training_args = TrainingArguments(
    output_dir="./results",
    evaluation_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    num_train_epochs=3,
    weight_decay=0.01,
)

# Initialize the Trainer
model = AutoModelForQuestionAnswering.from_pretrained(model_name)
device = torch.device("cpu")
model.to(device)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_datasets['train'],
)

# Define a data collator that moves the inputs to the correct device
def data_collator(features):
    # Convert to PyTorch tensors and move to the correct device
    return {key: torch.tensor([f[key] for f in features]).to(device) for key in features[0]}

# Train the model
trainer.train()

# Save the model and tokenizer
model_dir = "./finetuned_model"
trainer.save_model(model_dir)
tokenizer.save_pretrained(model_dir)