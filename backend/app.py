from flask import Flask, request, jsoniify, send_file, render_template
from flask_cors import CORS
from openai import OpenAI

import os
import uuid
import base64

app = Flask(__name__)
CORS(app)

if not os.path.exists('imagens'): os.makedirs('imagens')
if not os.path.exists('audios'): os.makedirs('audios')