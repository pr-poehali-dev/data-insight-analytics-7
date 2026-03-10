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

    api_key = os.environ.get('DADATA_API_KEY', '')

    if not api_key:
        return {'statusCode': 503, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'API-ключ не настроен. Добавьте DADATA_API_KEY в секреты проекта.'})}

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
        d = item.get('data', {})
        results.append({
            'name': item.get('value'),
            'inn': d.get('inn'),
            'ogrn': d.get('ogrn'),
            'kpp': d.get('kpp'),
            'status': d.get('state', {}).get('status'),
            'type': d.get('type'),
            'address': d.get('address', {}).get('value'),
            'director': d.get('management', {}).get('name'),
            'director_post': d.get('management', {}).get('post'),
            'okved': d.get('okved'),
            'okved_name': d.get('okved_type'),
        })

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'results': results}, ensure_ascii=False)
    }
