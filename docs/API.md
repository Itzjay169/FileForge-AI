# FileForge AI — API Specification (Phase 1)

This document describes the REST API endpoints provided by FileForge AI for format inspection, system status, plans, and authentication.

All endpoints adhere to the standard envelope schema:

```json
{
  "success": true,
  "data": { ... },
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable description",
    "details": null
  },
  "meta": {
    "requestId": "uuid-v4",
    "timestamp": "2026-11-19T16:00:00.000Z",
    "processingTimeMs": 2
  }
}
```

---

## 1. System Health

### `GET /api/health`
Returns the operational state of the FileForge AI platform, connected services (database, Redis, storage), worker queue telemetry, and system uptime.

- **Authentication**: None (Public)
- **Rate Limit**: 120 req/min
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "uptimeSeconds": 3600,
    "version": "1.0.0",
    "timestamp": "2026-11-19T16:00:00.000Z",
    "services": {
      "database": true,
      "redis": true,
      "storage": true,
      "workers": {
        "activeWorkers": 4,
        "queuedJobs": 0
      }
    }
  }
}
```

---

## 2. Universal File Format Registry

### `GET /api/formats`
Queries the central file-type registry. Supports real-time search and multi-facet filtering across all 12 categories.

- **Authentication**: None (Public)
- **Query Parameters**:
  - `q` or `search` (string, optional): Search keyword against extension, name, or description.
  - `category` (enum, optional): One of `documents`, `spreadsheets`, `presentations`, `images`, `video`, `audio`, `code`, `archives`, `executables`, `databases`, `fonts`, `cad3d`.
  - `canCompress` (boolean, optional): `true` to filter formats with compression algorithms.
  - `canConvert` (boolean, optional): `true` to filter formats with registered conversion targets.

- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "total": 105,
    "formats": [
      {
        "extension": "docx",
        "name": "Microsoft Word OpenXML Document",
        "category": "documents",
        "mimeTypes": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        "uploadAllowed": true,
        "previewSupported": true,
        "compressionSupported": true,
        "conversionTargets": ["pdf", "odt", "rtf", "txt", "html", "epub"],
        "riskLevel": "LOW",
        "requiredProcessor": "LIBREOFFICE",
        "isBinary": true,
        "maxFreeSizeBytes": 524288000,
        "requiresPremiumWorker": false
      }
    ],
    "categories": [ ... ]
  }
}
```

### `GET /api/formats/[extension]`
Returns deep metadata, loss warnings, required processors, and valid conversion paths for a single format.

- **Authentication**: None (Public)
- **Parameters**: `extension` (e.g. `psd`, `heic`, `docx`)
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "format": {
      "extension": "psd",
      "name": "Adobe Photoshop Document",
      "category": "images",
      "mimeTypes": ["image/vnd.adobe.photoshop"],
      "uploadAllowed": true,
      "previewSupported": true,
      "compressionSupported": true,
      "conversionTargets": ["png", "jpg", "webp", "tiff", "pdf"],
      "lossWarnings": {
        "png": {
          "warningTitle": "Layers will be flattened",
          "lostAttributes": ["Smart objects", "Layer masks", "Adjustment layers"],
          "recommendation": "Export individual artboards or flatten to high-bitrate PNG",
          "isLossy": true
        }
      },
      "riskLevel": "LOW",
      "requiredProcessor": "SHARP"
    },
    "availableConversions": [
      {
        "target": { "extension": "png", "name": "Portable Network Graphics" },
        "isLossy": true,
        "warning": "Layers will be flattened"
      }
    ]
  }
}
```

---

## 3. Subscription Plans & Limits

### `GET /api/plans`
Fetches subscription tiers, limits, prices, and feature breakdowns.

- **Authentication**: None (Public)
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "plans": [
      {
        "id": "FREE",
        "name": "Free Studio",
        "priceMonthly": 0,
        "priceYearly": 0,
        "maxFileSizeBytes": 2147483648,
        "dailyConversions": 25,
        "concurrentJobs": 2,
        "retentionDays": 1,
        "features": [ ... ]
      },
      {
        "id": "PRO_CREATIVE",
        "name": "Pro Creative",
        "priceMonthly": 12,
        "priceYearly": 108,
        "maxFileSizeBytes": 10737418240,
        "dailyConversions": "UNLIMITED",
        "concurrentJobs": 10,
        "retentionDays": 30
      }
    ],
    "systemLimits": {
      "FREE_MAX_FILE_BYTES": 2147483648,
      "PRO_MAX_FILE_BYTES": 10737418240,
      "STUDIO_MAX_FILE_BYTES": 53687091200
    }
  }
}
```

---

## 4. Live Studio Ticker Stats

### `GET /api/stats`
Provides aggregated platform metrics for the hero ticker and live dashboard.

- **Authentication**: None (Public)
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "totalFormatsSupported": 105,
    "categoriesCount": 12,
    "compressibleCount": 92,
    "convertibleCount": 84,
    "previewableCount": 78,
    "freeTierMaxFileSizeMb": 2048,
    "averageCompressionRatio": 65,
    "communityFilesProcessed": "1,428,950+"
  }
}
```

---

## 5. Authentication

### `GET /api/auth/providers`
Returns available authentication identity providers (Google, Apple, Credentials).

### `POST /api/auth/callback/credentials`
Validates user credentials and returns session tokens.
