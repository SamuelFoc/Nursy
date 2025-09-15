import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from src.iqs_api.routers.queue_router import router
from src.iqs_ws.queue import StateQueue


@pytest.fixture
def app() -> FastAPI:
    app = FastAPI()
    app.include_router(router)
    app.state.queue = StateQueue()
    return app


@pytest.fixture
def client(app: FastAPI) -> TestClient:
    return TestClient(app)


def test_get_public_queue(client: TestClient, app) -> None:
    res = client.get('/')
    assert res.status_code == 200
    data = res.json()
    assert data['queue'] == []

    for sid in ['s1', 's2', 's3']:
        res = client.post(f'/register/{sid}')

    res = client.get('/')
    assert res.status_code == 200
    data = res.json()
    assert len(data['queue']) == 3
    assert data['queue'][0] == 1


def test_register_participant(client: TestClient, app) -> None:
    ids = ['s1', 's2', 's3']

    for idx, sid in enumerate(ids):
        res = client.post(f'/register/{sid}')
        assert res.status_code == 200
        data = res.json()
        assert data['session_id'] == sid
        assert data['seq'] == idx + 1
        assert data['chat'] is None

    assert len(app.state.queue) == 3

    participant = app.state.queue.dequeue()
    assert len(app.state.queue) == 2
    assert participant.seq == 1
    assert participant.session_id == 's1'

    res = client.post(f'/register/{ids[-1]}')
    assert len(app.state.queue) == 2
    res = client.post(f'/register/{ids[-1]}')
    assert len(app.state.queue) == 2


def test_get_participant(client: TestClient, app) -> None:
    sid = 's1'
    res = client.post(f'/register/{sid}')
    assert res.status_code == 200

    res = client.get(f'/participant/{sid}')
    assert res.status_code == 200
    data = res.json()
    assert data['session_id'] == sid
    assert data['seq'] == 1
    assert data['chat'] is None
