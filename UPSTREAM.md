# DanIA Táctica

Independent adaptation of [Board](https://github.com/TacticsJournal/board),
Copyright (c) 2026 Kyle Boas, licensed under MIT.

Source snapshot: `a2f59eae0b7dff80a76cceeea54b6ad7d030f77a`, retrieved 2026-08-31.
The upstream source, tests and notices are retained in `vendor/board`.

This version uses the upstream self-host mode. Local editing, object tools,
project files, images and animation export are preserved. Tactics Journal's
accounts, payments, cloud sync and agent-link service are not part of this deployment.
Project state follows the original browser-local storage design; export project
files to retain independent backups or transfer work between devices.
The owner's predefined squad is included with the private app and remains
available in the player-name picker on every device, including blank boards
and browsers with other team setups. Its three goalkeepers are marked POR;
shirt numbers and unspecified outfield positions are not invented. The preset
is not sent to the public club-search APIs. Drawings still use local storage.
Keep original uploaded background images separately: the upstream device-transfer
JSON is not an archive of all browser-local image storage.

The private app also includes three original Zone 2 session tasks in the
"Tareas · Zona 2" menu: two simultaneous 2v2+2-neutral fields, two simultaneous
3v3+2-neutral fields, and a 7v7+2-goalkeeper collective game. Each task is an
editable three-board sequence with initial attack, counter-press and fallback
positions. The working assumption is 20 participants, including two goalkeepers,
one coach and the limited space of Albolote's small field;
waiting relays remain outside until a play ends, not until possession changes.
The canonical content is versioned with this app. Selecting a task creates its
browser-local working copy or reopens the existing copy without resetting edits.
Nothing is automatically imported into or removed from existing user projects.
The diagrams use anonymous role labels, not assignments of the private roster.

The "Sesiones" planner stores multiple editable session plans in the browser.
Its authored Wednesday plan carries the 19:45 arrival instruction, confirmed
weekly absences, both available goalkeepers, general session data and complete
fields for every task. The three Zone 2 diagrams are linked from their task cards.
The current session can be downloaded as a printable HTML document, printed or
saved as PDF through the browser, or exported as JSON. Session storage remains
device-local and is independent from the project library.

Changes: Sites/Vinext integration, independent DanIA title and mark, original
functional pitch diagrams without upstream trademarks, Spanish interface labels
and help, and a warmer neutral/gold interface palette. This is not an official
Tactics Journal service and is not endorsed by its authors.

The main editor, project actions, exports and help are localized; some advanced
upstream screens and fallback document names remain in English.

Verification: production build; the selected upstream
unit tests for project storage, geometry, notes, GIFs and archives; adaptation tests
for browser-only integration, action-hook stability, licensing, pitch assets and
the QA regression fixes. Interactive browser checks are documented in
`tests/QA-2026-08-31.md`. Viewport checks do not claim physical-device testing.

QA fixes: removed an incomplete upstream carry-menu listener that aborted startup;
preserved browser keyboard key names during localization; saved editable player
names/numbers without destroying focused inputs; deferred resize layout writes;
and paced video capture by elapsed time instead of display refresh rate.

Notices: `vendor/board/LICENSE`, `vendor/board/TRADEMARKS.md`,
`vendor/board/THIRD_PARTY_NOTICES.md`, and `vendor/board/public/LICENSE-icons`.
