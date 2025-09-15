import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from src.iqs_api.routers import chat_router
from src.iqs_api.routers import queue_router
from src.iqs_ws.queue import StateQueue


@pytest.fixture
def app() -> FastAPI:
    app = FastAPI()
    app.include_router(chat_router.router, prefix='/api/chat')
    app.include_router(queue_router.router, prefix='/api/queue')
    app.state.queue = StateQueue()
    return app


@pytest.fixture
def client(app: FastAPI) -> TestClient:
    return TestClient(app)


@pytest.fixture
def create_queue(client: TestClient) -> list[str]:
    ids = ['s1', 's2', 's3']
    for id in ids:
        res = client.post(f'/api/queue/register/{id}')
        assert res.status_code == 200
    return ids


def test_init_chat(client: TestClient, create_queue, app) -> None:
    for sid in create_queue:
        res = client.post(f'/api/chat/init/{sid}')
        assert res.status_code == 200
        data = res.json()
        assert 'history' in data
        assert isinstance(data['history'], list)
        assert isinstance(data['history'][0], object)
        assert len(data['history']) == 1


def test_get_chat(client: TestClient, create_queue, app) -> None:
    sid = create_queue[0]

    res = client.post(f'/api/chat/init/{sid}')
    assert res.status_code == 200

    res = client.get(f'/api/chat/{sid}')
    assert res.status_code == 200
    data = res.json()
    assert 'history' in data
    assert isinstance(data['history'], list)
    assert isinstance(data['history'][0], object)
    assert len(data['history']) == 1


def test_chat(client: TestClient, create_queue, app) -> None:
    sid = create_queue[0]

    res = client.post(f'/api/chat/init/{sid}')
    assert res.status_code == 200

    res = client.post(f'/api/chat/{sid}', json={'message': 'I feel sick'})
    assert res.status_code == 200

    data = res.json()
    assert 'history' in data
    assert isinstance(data['history'], list)
    assert isinstance(data['history'][0], object)
    assert len(data['history']) > 1
    messages = data['history']
    assert messages[0]['role'] == 'assistant'
    assert messages[1]['role'] == 'user'
    assert isinstance(messages[0]['content'], str)
