# Changelog

## [2.0.1] - 2025-10-05

### Added33
- 333Complete overhaul of the recording architecture with segmented recording, memory monitor, and whiteboard/countdown flow.
- New UI for Home, Recording Area Selector, Countdown, Settings, and Recording Toolbar with gradient themes and notifications.
- Auto-update integration using `electron-updater`.
- System sleep handling that saves current segments, stops recording, and shows system notifications.

## [2.0.0] - 2025-10-05

### Added
- Complete overhaul of the recording architecture with segmented recording, memory monitor, and whiteboard/countdown flow.
- New UI for Home, Recording Area Selector, Countdown, Settings, and Recording Toolbar with gradient themes and notifications.
- Auto-update integration using `electron-updater`.
- System sleep handling that saves current segments, stops recording, and shows system notifications.

### Changed
- Updated window sizing and minimized Home during recording; hid Home while recording and restored after finish.
- Unified theme, i18n texts, and general UI polish with animations and gradients.
- Updated Electron-related dependencies ("electron-localstorage-store", "@miniben90/x-win", etc.).
- Flattened Settings page and integrated segmented recorder utilities with memory monitoring.

### Fixed
- Adjusted WebM duration handling, recorder timer issues, microphone volume, toolbox/camera shadow, and stuck recording after cancel.
- Fixed mission control window filtering, countdown sizing, camera/board positioning, and whiteboard tool visibility.
- Addressed system sleep state sync and various i18n/layout glitches.

### Build
- Added GitHub Actions workflow to build and publish releases via pnpm.
- Updated `electron-builder.yml` to publish to github.com/syt-honey/vboard with release type `release`.
- Bumped pnpm lockfile and added release scripts (`release.js`, `auto-commit.js`).

---

## [1.0.0] - 2025-06-01

- Initial public release.
