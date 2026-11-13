GRADE 7 SCIENCE – UNDERSTANDING MOTION
GitHub Pages + Google Sheets submission setup

WHY THE ERROR HAPPENED
The original submit button used google.script.run. That API exists only when the HTML is served by Google Apps Script, not when opened from GitHub Pages.

THIS PACKAGE FIXES THAT
- index.html remains hosted on GitHub Pages.
- The submit button sends a standard HTML form POST to your Apps Script web app.
- Code_GitHub.gs accepts the form payload, saves it to the Motion Lesson Responses tab, and returns a confirmation to the GitHub page.

YOUR GOOGLE SHEET
https://docs.google.com/spreadsheets/d/1YuD5AYyX1otXuSqTn2OdE8Bm3Z_FWMgEIS0amVobZkc/edit

YOUR DEPLOYED APPS SCRIPT ENDPOINT
https://script.google.com/macros/s/AKfycbwu09ch0EBji8Ay0qA5VaGVRjKa6vJeSpIjg6CxgJWSoTSo_H9WiMsFTnHZQCVGg2Ri/exec

INSTALLATION
1. Open the Google Sheet above, then Extensions > Apps Script.
2. Replace the contents of Code.gs with the contents of Code_GitHub.gs in this package.
3. Save the project.
4. Deploy > Manage deployments > click the pencil (Edit) for the existing web app deployment.
5. For Version, choose New version. Keep Execute as: Me. Set access so your intended learners can use it (often Anyone, subject to your school/account policy).
6. Click Deploy and authorize if prompted. Keep using the same /exec deployment URL shown above.
7. In your GitHub repository romuloido001/motion2, replace the existing index.html with the index.html in this package and commit/push the change.
8. Open https://romuloido001.github.io/motion2/ in a fresh tab, enter a test learner name, and submit once.
9. Check the Motion Lesson Responses tab. The page should show the saved row number after confirmation.

IMPORTANT
- The endpoint URL is already configured in index.html. If you create a completely new Apps Script deployment with a different URL, update APPS_SCRIPT_ENDPOINT in index.html before publishing.
- Do not test by opening the HTML as a local file. Test the published GitHub Pages URL.
- A learner response contains names and schoolwork. Share the Sheet only with authorized school personnel and follow your school's learner-data privacy rules.


TROUBLESHOOTING UPDATE (confirmation timeout)
The updated Code.gs sends its confirmation message to the top-level GitHub page using window.top.postMessage. The updated index.html matches that message using a unique request ID. This handles the extra iframe layer used by Google Apps Script HtmlService. Replace BOTH files and deploy a NEW Apps Script version before testing. Then replace index.html in GitHub Pages. After a timeout, check the response sheet before retrying to avoid duplicate rows.
