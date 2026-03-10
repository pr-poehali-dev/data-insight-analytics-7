import os
import json
import requests

def handler(event: dict, context) -> dict:
    """Поиск информации по ИНН или названию компании через DaData API"""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'}, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    query = body.get('query', '').strip()

    if not query:
        return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Введите ИНН или название'})}

    api_key = os.environ.get('DADATA_API_KEY', 'f923f7e6fc0b772476e4356d61994de97a5c491e')

    resp = requests.post(
        'https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party',
        headers={'Content-Type': 'application/json', 'Authorization': f'Token {api_key}'},
        json={'query': query, 'count': 3}
    )

    if resp.status_code != 200:
        return {'statusCode': 502, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Ошибка запроса к DaData'})}

    data = resp.json().get('suggestions', [])

    if not data:
        # Попробуем поиск по названию
        resp2 = requests.post(
            'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party',
            headers={'Content-Type': 'application/json', 'Authorization': f'Token {api_key}'},
            json={'query': query, 'count': 3}
        )
        data = resp2.json().get('suggestions', []) if resp2.status_code == 200 else []

    results = []
    for item in data:
        d = item.get('data') or {}
        state = d.get('state') or {}
        address = d.get('address') or {}
        management = d.get('management') or {}
        results.append({
            'name': item.get('value'),
            'inn': d.get('inn'),
            'ogrn': d.get('ogrn'),
            'kpp': d.get('kpp'),
            'status': state.get('status'),
            'type': d.get('type'),
            'address': address.get('value'),
            'director': management.get('name'),
            'director_post': management.get('post'),
            'okved': d.get('okved'),
        })

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'results': results}, ensure_ascii=False)
    }