from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForQuestionAnswering, Trainer, TrainingArguments
from simpletransformers.question_answering import QuestionAnsweringModel
import torch
import json


# Load the uploaded JSON file
uploaded_file_path = 'qa_data.json'
with open(uploaded_file_path, 'r', encoding='utf-8') as file:
    qa_data = json.load(file)

# Convert the data into the required format
train_data = []

for document in qa_data["data"]:
    for paragraph in document["paragraphs"]:
        context = paragraph["context"]
        for qa in paragraph["qas"]:
            question = qa["question"]
            is_impossible = False  # Assuming all questions have answers
            answers = qa.get("answers", [])
            # Assuming one answer per question
            answer_text = answers[0]["text"] if answers else ""
            answer_start = answers[0]["answer_start"] if answers else 0

            train_data.append({
                "context": context,
                "qas": [
                    {
                        "id": qa["id"],
                        "is_impossible": is_impossible,
                        "question": question,
                        "answers": [{"text": answer_text, "answer_start": answer_start}],
                    }
                ],
            })
            

with open("train.json", "w") as f:
    json.dump(train_data, f)

# Create the QuestionAnsweringModel
model = QuestionAnsweringModel(
    "distilbert",
    "distilbert-base-uncased-distilled-squad",
    args={"reprocess_input_data": True, "overwrite_output_dir": True},
)

# Train the model
model.train_model("train.json")
            
# # Load the dataset
# data_files = {"train": "qa_data.json"}  # Replace with your file path
# dataset = load_dataset('json', data_files=data_files, field='data')
        
# # Tokenize the dataset
# model_name = "distilbert-base-uncased-distilled-squad" 
# tokenizer = AutoTokenizer.from_pretrained(model_name)

# def preprocess_function(examples):
#     contexts = []
#     questions = []
#     answers = []
    
#     for data_entry in examples['paragraphs']:
#         for qa in data_entry[0]['qas']:
#             questions.append(qa['question'])
#             contexts.append(data_entry[0]['context'])
#             answers.append(qa['answers'][0])

#     inputs = tokenizer(
#         contexts,
#         questions,
#         max_length=384,
#         truncation="only_second",
#         stride=128,
#         return_overflowing_tokens=True,
#         return_offsets_mapping=True,
#         padding="max_length",
#     )
    
#     offset_mapping = inputs.pop("offset_mapping")
#     start_positions = []
#     end_positions = []
    
#     for i, offsets in enumerate(offset_mapping):
#         answer = answers[i]
#         start_char = answer["answer_start"]
#         end_char = start_char + len(answer["text"])

#         sequence_ids = inputs.sequence_ids(i)

#         # Find the start and end of the context
#         context_start = 0
#         while sequence_ids[context_start] != 1:
#             context_start += 1
#         context_end = len(sequence_ids) - 1
#         while sequence_ids[context_end] != 1:
#             context_end -= 1

#         # If the answer is out of the context, set to CLS index
#         if offsets[context_start][0] > start_char or offsets[context_end][1] < end_char:
#             start_positions.append(inputs.input_ids[i].index(tokenizer.cls_token_id))
#             end_positions.append(inputs.input_ids[i].index(tokenizer.cls_token_id))
#         else:
#             start_positions.append(start_char - offsets[context_start][0])
#             end_positions.append(end_char - offsets[context_start][0])

#     inputs["start_positions"] = start_positions
#     inputs["end_positions"] = end_positions
#     return inputs

# # Apply the preprocessing function to the dataset
# tokenized_datasets = dataset.map(preprocess_function, batched=True, remove_columns=['paragraphs'])

# # Define training arguments
# training_args = TrainingArguments(
#     output_dir="./results",
#     evaluation_strategy="no", #"epoch",
#     learning_rate=2e-5,
#     per_device_train_batch_size=16,
#     per_device_eval_batch_size=16,
#     num_train_epochs=3,
#     weight_decay=0.01,
# )

# # Initialize the Trainer
# model = AutoModelForQuestionAnswering.from_pretrained(model_name)
# device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
# model.to(device)

# trainer = Trainer(
#     model=model,
#     args=training_args,
#     train_dataset=tokenized_datasets['train'],
# )

# print(tokenized_datasets['train'])


# # Train the model
# trainer.train()

# # Save the model and tokenizer
# model_dir = "./finetuned_model"
# trainer.save_model(model_dir)
# tokenizer.save_pretrained(model_dir)