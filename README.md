# Grade 7 Science Interactive Lesson: Understanding Motion

A self-contained interactive learning resource with an optional Google Sheets submission backend.

## Files
- `index.html` — interactive lesson, activities, 12-item assessment, and downloadable learner report.
- `Code.gs` — Google Apps Script web app and Google Sheets backend.

## Connect to a Google Sheet
1. Copy the destination spreadsheet ID from its URL and set `SPREADSHEET_ID` in `Code.gs`.
2. In the Apps Script project, replace `Code.gs` with the local `Code.gs` contents. Add an HTML file named `index` and copy in `index.html`.
3. Save the project. Select **Deploy → Manage deployments → Edit → New version → Deploy** to update the existing web app without changing its access level.
4. Open the deployed web app URL (ending in `/exec`). It serves the lesson and its **Submit to Teacher's Google Sheet** button writes to the `Motion Lesson Responses` tab of the spreadsheet identified in `SPREADSHEET_ID`.

The backend creates the response tab and header row automatically. Add `?health=1` to the web app URL to check whether the backend is running.

## Preview locally
Open `index.html` in a modern browser to use the lesson and download the learner report. Submitting to the Google Sheet works only when the page is opened from its deployed Apps Script web app.

## Learner privacy
When a learner chooses **Submit to Teacher's Google Sheet**, their name, section, date, assessment answers and score, activity responses, and reflection are sent to the spreadsheet associated with the Apps Script project. The downloadable report is generated locally. Set web app access according to your school's privacy and account requirements.

## Teacher note
The resource is designed as a Grade 7 learning aid aligned to the supplied learning targets and an inquiry-oriented lesson flow: activate prior knowledge, explore examples, practise, assess, and reflect. Please review against your school's current curriculum guide and lesson plan before classroom use.
