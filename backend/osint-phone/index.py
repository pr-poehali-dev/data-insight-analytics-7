import os
import json
import requests

def handler(event: dict, context) -> dict:
    """Поиск информации по номеру телефона через DaData API"""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'}, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    phone = body.get('query', '').strip()

    if not phone:
        return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Введите номер телефона'})}

    api_key = os.environ.get('DADATA_API_KEY', '')

    if not api_key:
        return {'statusCode': 503, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'API-ключ не настроен. Добавьте DADATA_API_KEY в секреты проекта.'})}

    resp = requests.post(
        'https://cleaner.dadata.ru/api/v1/clean/phone',
        headers={'Content-Type': 'application/json', 'Authorization': f'Token {api_key}'},
        json=[phone]
    )

    if resp.status_code != 200:
        return {'statusCode': 502, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Ошибка запроса к DaData'})}

    data = resp.json()
    if not data:
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'result': None})}

    d = data[0]
    result = {
        'phone': d.get('phone') or phone,
        'type': d.get('type'),
        'carrier': d.get('provider'),
        'region': d.get('region'),
        'city': d.get('city'),
        'country': d.get('country'),
        'timezone': d.get('timezone'),
        'qc': d.get('qc'),
    }

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'result': result}, ensure_ascii=False)
    }
