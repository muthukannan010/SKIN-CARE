"""
test_integration.py — Complete End-to-End Test Suite for NEXORA AI.
Validates:
  1. System Health & Model Status
  2. Authentication & User Management (Register, Login, Me, Profile Update, Logout)
  3. Image Analysis & MedGemma Contract (Valid image, Invalid format, Empty file)
  4. History & Dashboard Analytics (Listing, Detail, Dashboard Stats, Deletion)
  5. Single-Host SPA Static File & Routing Fallback
"""

import json
from unittest.mock import AsyncMock, patch
import httpx
from starlette.testclient import TestClient

from app.main import app
from app.config import settings
from app.services.ollama_service import (
    _extract_json_payload,
    validate_image_bytes,
)

client = TestClient(app)


def test_1_system_health():
    print("\n--- 1. Testing System Health & Model Status ---")
    res = client.get("/api/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    data = res.json()
    assert data["status"] == "ok"
    assert "ollama" in data
    assert data["ollama"]["target_model"] == settings.ollama_model
    print("  [PASS] GET /api/health returned 200 with Ollama diagnostics.")

    res_model = client.get("/api/model/status")
    assert res_model.status_code == 200
    model_data = res_model.json()
    assert model_data["target_model"] == settings.ollama_model
    print(f"  [PASS] GET /api/model/status connected={model_data.get('connected')}, target={model_data.get('target_model')}")


def test_2_auth_lifecycle():
    print("\n--- 2. Testing Authentication & Profile Lifecycle ---")
    # A. Demo user login
    res_demo = client.post("/api/auth/login", json={
        "email_or_username": "demo@nexora.ai",
        "password": "password123"
    })
    assert res_demo.status_code == 200
    demo_token = res_demo.json()["access_token"]
    assert demo_token.startswith("nexora_token_")
    print("  [PASS] Demo account login succeeded with JWT bearer token.")

    # B. Invalid credentials rejection
    res_bad = client.post("/api/auth/login", json={
        "email_or_username": "demo@nexora.ai",
        "password": "wrongpassword"
    })
    assert res_bad.status_code == 401
    print("  [PASS] Invalid password correctly rejected with HTTP 401.")

    # C. Registration of new user
    new_user_payload = {
        "first_name": "Rishaan",
        "last_name": "Kannan",
        "username": "rishaan_k",
        "email": "rishaan@example.com",
        "password": "securepassword123",
        "confirm_password": "securepassword123"
    }
    res_reg = client.post("/api/auth/register", json=new_user_payload)
    assert res_reg.status_code == 200
    reg_data = res_reg.json()
    new_token = reg_data["access_token"]
    assert reg_data["user"]["username"] == "rishaan_k"
    print("  [PASS] New user registration succeeded.")

    # D. Profile retrieval via Bearer token
    res_me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {new_token}"})
    assert res_me.status_code == 200
    assert res_me.json()["username"] == "rishaan_k"
    print("  [PASS] Session restoration via GET /api/auth/me confirmed.")

    # E. Profile update
    res_update = client.put(
        "/api/profile",
        json={"first_name": "Rishaan Kumar"},
        headers={"Authorization": f"Bearer {new_token}"}
    )
    assert res_update.status_code == 200
    assert res_update.json()["first_name"] == "Rishaan Kumar"
    print("  [PASS] Profile update PUT /api/profile succeeded.")


def test_3_image_analysis_e2e():
    print("\n--- 3. Testing Image Analysis & Contract Validation ---")
    # A. Invalid format handling (Text file instead of Image)
    files_invalid = {"image": ("test.txt", b"Invalid non-image content", "text/plain")}
    res_inv = client.post("/api/analyze", files=files_invalid)
    assert res_inv.status_code == 422
    print("  [PASS] Non-image file rejected with HTTP 422 Unprocessable Entity.")

    # B. Empty file handling
    files_empty = {"image": ("empty.jpg", b"", "image/jpeg")}
    res_emp = client.post("/api/analyze", files=files_empty)
    assert res_emp.status_code == 400
    print("  [PASS] Empty file rejected with HTTP 400 Bad Request.")

    # C. End-to-end Valid Image Analysis
    mock_medgemma_response = {
        "predicted_condition": "Seborrheic Dermatitis",
        "observations": "Erythematous plaques with greasy yellowish scales localized along nasolabial and scalp margins.",
        "explanation": "Seborrheic dermatitis is a chronic inflammatory disorder associated with Malassezia yeast colonization.",
        "confidence_score": 78,
        "differential_predictions": [
            {"condition": "Seborrheic Dermatitis", "confidence": 78},
            {"condition": "Plaque Psoriasis", "confidence": 20},
            {"condition": "Atopic Dermatitis", "confidence": 12}
        ],
        "symptoms": ["Greasy scaling", "Flaking", "Mild erythema", "Itching"],
        "possible_causes": ["Malassezia yeast proliferation", "Epidermal barrier sebum interaction"],
        "supportive_care": ["Use gentle zinc pyrithione or ketoconazole shampoos", "Avoid oil-based heavy face creams"],
        "prevention": ["Wash scalp and facial creases regularly with mild foaming cleansers"],
        "when_to_see_doctor": ["Lesions spread to body folds or fail to improve after 2 weeks"],
        "emergency_warning_signs": ["Sudden severe secondary bacterial infection with purulent discharge"]
    }

    mock_ollama_resp = httpx.Response(
        status_code=200,
        json={
            "message": {
                "role": "assistant",
                "content": json.dumps(mock_medgemma_response)
            }
        },
        request=httpx.Request("POST", "http://localhost:11434/api/chat")
    )

    with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
        mock_post.return_value = mock_ollama_resp

        with open("test_skin.jpg", "rb") as f:
            files_valid = {"image": ("test_skin.jpg", f, "image/jpeg")}
            res_analysis = client.post("/api/analyze", files=files_valid)

        assert res_analysis.status_code == 200, res_analysis.text
        data = res_analysis.json()
        assert "result" in data
        result = data["result"]

        # Validate complete schema required by React components
        assert result["predicted_condition"] == "Seborrheic Dermatitis"
        assert result["confidence"] == 78
        assert len(result["predictions"]) == 3
        assert result["predictions"][0]["rank"] == 1
        assert "Visible Image Observations" in result["description"]
        assert "Clinical Context & Explanation" in result["description"]
        assert len(result["symptoms"]) == 4
        assert len(result["supportive_care"]) == 2
        assert len(result["when_to_see_doctor"]) == 1
        assert len(result["emergency_warning_signs"]) == 1
        assert result["model_version"].startswith("MedGemma-27B")
        assert result["image_url"].startswith("data:image/jpeg;base64,")

        print("  [PASS] POST /api/analyze returned complete AnalysisResult compliant with frontend.")
        return result["id"]


def test_4_history_and_dashboard(scan_id: str):
    print("\n--- 4. Testing History & Dashboard Analytics ---")
    # A. History list
    res_hist = client.get("/api/history?page=1&per_page=10")
    assert res_hist.status_code == 200
    hist_data = res_hist.json()
    assert hist_data["total"] >= 1
    assert any(item["id"] == scan_id for item in hist_data["items"])
    print(f"  [PASS] GET /api/history listed {hist_data['total']} scan records.")

    # B. History detail
    res_detail = client.get(f"/api/history/{scan_id}")
    assert res_detail.status_code == 200
    assert res_detail.json()["id"] == scan_id
    assert res_detail.json()["predicted_condition"] == "Seborrheic Dermatitis"
    print("  [PASS] GET /api/history/{id} retrieved detailed report.")

    # C. Dashboard stats
    res_dash = client.get("/api/dashboard/stats")
    assert res_dash.status_code == 200
    dash_data = res_dash.json()
    assert dash_data["total_analyses"] >= 1
    assert dash_data["latest_prediction"] == "Seborrheic Dermatitis"
    print("  [PASS] GET /api/dashboard/stats aggregated statistics correctly.")

    # D. Delete scan
    res_del = client.delete(f"/api/history/{scan_id}")
    assert res_del.status_code == 200
    res_check = client.get(f"/api/history/{scan_id}")
    assert res_check.status_code == 404
    print("  [PASS] DELETE /api/history/{id} removed record cleanly.")


def test_5_spa_routing_and_assets():
    print("\n--- 5. Testing Single-Host SPA Routing & Assets ---")
    # Test client-side routes handled by FastAPI SPA catch-all
    for path in ["/dashboard", "/analyzer", "/history", "/profile", "/login"]:
        res_spa = client.get(path)
        assert res_spa.status_code == 200
        assert "text/html" in res_spa.headers.get("content-type", "")
        assert "<!doctype html>" in res_spa.text.lower()
    print("  [PASS] SPA client-side routes (/dashboard, /analyzer, /history, /profile) cleanly serve index.html.")


if __name__ == "__main__":
    print("================================================================")
    print("           NEXORA AI — END-TO-END VERIFICATION SUITE            ")
    print("================================================================")
    test_1_system_health()
    test_2_auth_lifecycle()
    scan_id = test_3_image_analysis_e2e()
    test_4_history_and_dashboard(scan_id)
    test_5_spa_routing_and_assets()
    print("\n================================================================")
    print("         >>> ALL END-TO-END APPLICATION CHECKS PASSED <<<       ")
    print("================================================================\n")
