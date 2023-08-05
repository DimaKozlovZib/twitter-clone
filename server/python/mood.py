import sys
import json
from textblob import TextBlob
from googletrans import Translator

input_data = sys.stdin.buffer.read()

# Декодирование строки в нужную кодировку
decoded_data = input_data.decode('utf-8')

# Преобразование строки JSON в объект Python
document = json.loads(decoded_data)
translator = Translator(service_urls=['translate.googleapis.com'])

result = translator.translate(document)
translateText = result.text  # type: ignore

text_blob_object = TextBlob(translateText)

polarity = text_blob_object.sentiment.polarity  # type: ignore
subjectivity = text_blob_object.sentiment.subjectivity  # type: ignore

# Возвращение результата в Node.js
output_data = json.dumps([polarity, subjectivity],
                         ensure_ascii=False).encode('utf-8')
sys.stdout.buffer.write(output_data)
