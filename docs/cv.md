# Curriculum vitae

Milestone 10 adds a structured, configurable, print-ready CV.

## Configuration

Use `/admin/cv` to reorder or show/hide the six finite sections: Profile, Education, Experience, Selected Projects, Publications, and Skills. The editor saves the complete section configuration in one authenticated transaction. It does not provide arbitrary templates, executable layouts, or free-form section types.

Published projects are available as explicit selections. Selections use stable project IDs and cascade when a project is deleted. Draft or archived projects are never offered or rendered publicly. Publications include all currently published records; education and experience follow their existing structured order; only visible skills are grouped by category.

## Public route and printing

`/cv` is server-rendered from the owner profile and existing structured records. Timeline descriptions use the shared sanitized Markdown pipeline. Hidden sections are omitted, configured order is preserved, and private project/publication state is not exposed.

The “Print or save PDF” button invokes browser printing. Print media uses A4 pages, hides the public header/navigation, footer, skip link, sidebar layout, and controls, removes screen width constraints, and keeps entries together where practical. Server-generated PDFs and additional templates remain deferred.
