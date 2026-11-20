# Page Design Override: Creative Studio Workspace (`/studio`, `/convert`, `/editor`)

## Purpose
High-density creative workstation for multi-format processing (200+ formats across 12 categories).

## Component Rules
- Primary CTAs: `<sakuga-button>` with done check-state.
- Settings: `<sakuga-toggle>` for lossless/lossy mode, metadata stripping, WebP transcoding.
- Parameter adjustment: `<sakuga-slider>` for quality, target bitrate, resolution scaling.
- Batch options: `<sakuga-checkbox>` for EXIF removal, PDF merging, password protection.
- Category navigation: `<sakuga-tabs>` with horizontal scroll support on mobile.
- Processing feedback: `<sakuga-progress>` with real-time pipeline status.
- Tooltips: `<sakuga-tooltip>` on technical compression and format parameters.
