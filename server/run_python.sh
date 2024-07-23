# For mac
python3 -m venv imv_venv
source imv_venv/bin/activate
pip install flask transformers torch
cd robot/
python app.py
