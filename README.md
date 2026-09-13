# Apeiron Solutions - Corporate Website

## Architecture
This project is built using 100% Native Web Technologies (HTML5, CSS3, Vanilla JS). 
Zero external dependencies, frameworks, or CDNs are used.

## How to Customize
All global settings are managed in `css/variables.css`.

- **Colors:** Modify `--color-primary`, `--color-accent`, etc.
- **Typography:** The system uses premium native font stacks. Adjust `--font-primary` if adding local web fonts. Font sizes scale automatically using `clamp()`.
- **Replacing Logos/Images:** Drop new assets into `/assets/images/` and update the `src` attributes in HTML.
- **Adding Services:** Copy an existing `<article class="service-card">` in the HTML, update the text, and ensure the `data-modal-content` attribute links to the correct modal ID.
- **Form Backend:** Locate the `handleFormSubmit` function in `js/main.js`. Replace the `setTimeout` simulation with your `fetch()` POST request to your server.