/**
 * Grade 7 Science – Understanding Motion
 * Google Sheets backend for learner submissions.
 *
 * SETUP:
 * 1. Set SPREADSHEET_ID to the ID of the destination Google Spreadsheet.
 * 2. Replace the contents of Code.gs with this code.
 * 3. Add an HTML file named index and copy in index.html.
 * 4. Save, then Deploy > Manage deployments > Edit > New version.
 * 5. Execute as: Me. Keep the existing access level unless it needs to change.
 * 6. Deploy and authorize when prompted.
 */

const SHEET_NAME = 'Motion Lesson Responses';
const SPREADSHEET_ID = '1YuD5AYyX1otXuSqTn2OdE8Bm3Z_FWMgEIS0amVobZkc';

const HEADERS = [
  'Timestamp',
  'Learner Full Name',
  'Grade & Section',
  'Learner Date',
  'Assessment Submitted',
  'Assessment Score',
  'Assessment Percentage',
  'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6',
  'Q7', 'Q8', 'Q9', 'Q10', 'Q11', 'Q12',
  'Activity A - Map the Journey',
  'Activity B - Calculate Speed',
  'Activity C - Independent Variable',
  'Activity C - Dependent Variable',
  'Activity C - Controlled Variables',
  'Activity D - Graph Detective Q1',
  'Activity D - Graph Detective Q2',
  'Activity D - Graph Detective Q3',
  'Activity E - Speed or Velocity Q1',
  'Activity E - Speed or Velocity Q2',
  'Activity E - Velocity Calculation',
  'Activity F - Independent Variable',
  'Activity F - Dependent Variable',
  'Activity F - Controlled Variables',
  'Activity F - Fair-Test Plan',
  'Activity G - Explanation',
  'Reflection - One Thing Learned',
  'Reflection - One Question',
  'Raw Submission JSON'
];

/**
 * Serves the lesson, or a JSON health check at ?health=1.
 */
function doGet(e) {
  if (e && e.parameter && e.parameter.health === '1') {
    return jsonOutput({
      success: true,
      message: 'Grade 7 Science Motion backend is running.',
      sheet: SHEET_NAME
    });
  }

  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Grade 7 Science | Understanding Motion')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Called by the Apps Script-hosted lesson through google.script.run.
 */
function saveSubmission(data) {
  return appendSubmission_(data);
}

/**
 * Receives one learner submission as a JSON POST request.
 */
function doPost(e) {
  try {
    if (!e) throw new Error('No submission data was received.');

    // GitHub Pages submits a normal HTML form with a URL-encoded payload.
    // Keep JSON POST support for other clients as well.
    let data = null;
    if (e.parameter && e.parameter.payload) {
      data = JSON.parse(e.parameter.payload);
    } else if (e.postData && e.postData.contents) {
      const contentType = String(e.postData.type || '').toLowerCase();
      if (contentType.indexOf('application/x-www-form-urlencoded') !== -1) {
        const params = new URLSearchParams(e.postData.contents);
        data = JSON.parse(params.get('payload') || '{}');
      } else {
        data = JSON.parse(e.postData.contents);
      }
    }
    if (!data) throw new Error('No submission payload was received.');

    const result = appendSubmission_(data);
    return submissionPage_(result);
  } catch (err) {
    return submissionPage_({
      success: false,
      message: err && err.message ? err.message : 'Unable to save submission.'
    });
  }
}

/** Returns a small response page that notifies the GitHub page via postMessage. */
function submissionPage_(result) {
  const safeJson = JSON.stringify(result).replace(/</g, '\\u003c');
  const html = '<!doctype html><html><head><meta charset="utf-8"></head><body>' +
    '<script>window.parent.postMessage({type:"motion-sheet-result",result:' + safeJson + '},"*");</script>' +
    '<p>Submission processed. You may close this frame.</p></body></html>';
  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function appendSubmission_(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Submission data must be an object.');
  }

  const learnerName = cleanText(data.learnerName, 200);
  if (!learnerName) {
    throw new Error('Learner full name is required.');
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  const sheet = getOrCreateResponseSheet_(ss);
  const answers = data.assessmentAnswers || {};
  const activities = data.activities || {};
  const reflection = data.reflection || {};
  const score = isNumber(data.assessmentScore) ? Number(data.assessmentScore) : '';
  const percentage = score === '' ? '' : Math.round((score / 12) * 100);

  const row = [
    new Date(),
    learnerName,
    cleanText(data.gradeSection, 100),
    cleanText(data.learnerDate, 50),
    data.assessmentSubmitted === true ? 'Yes' : 'No',
    score,
    percentage,
    cleanText(answers.q1, 20),
    cleanText(answers.q2, 20),
    cleanText(answers.q3, 20),
    cleanText(answers.q4, 20),
    cleanText(answers.q5, 20),
    cleanText(answers.q6, 20),
    cleanText(answers.q7, 20),
    cleanText(answers.q8, 20),
    cleanText(answers.q9, 20),
    cleanText(answers.q10, 20),
    cleanText(answers.q11, 20),
    cleanText(answers.q12, 20),
    cleanText(activities.actA, 5000),
    cleanText(activities.actB, 500),
    cleanText(activities.actC1, 500),
    cleanText(activities.actC2, 500),
    cleanText(activities.actC3, 1000),
    cleanText(activities.actD1, 20),
    cleanText(activities.actD2, 20),
    cleanText(activities.actD3, 20),
    cleanText(activities.actE1, 20),
    cleanText(activities.actE2, 20),
    cleanText(activities.actE3, 500),
    cleanText(activities.actF1, 500),
    cleanText(activities.actF2, 500),
    cleanText(activities.actF3, 1000),
    cleanText(activities.actF4, 5000),
    cleanText(activities.actG, 5000),
    cleanText(reflection.reflect1, 3000),
    cleanText(reflection.reflect2, 3000),
    JSON.stringify(data)
  ];

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const responseRow = sheet.getLastRow() + 1;
    sheet.getRange(responseRow, 1, 1, row.length).setValues([row]);
    return {
      success: true,
      message: 'Learner submission saved successfully.',
      row: responseRow
    };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Creates the response tab and headings if needed.
 */
function getOrCreateResponseSheet_(ss) {
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#123f70')
      .setFontColor('#ffffff')
      .setWrap(true);
    sheet.autoResizeColumns(1, HEADERS.length);
  }

  return sheet;
}

/**
 * Safely converts incoming values to plain text and limits their length.
 */
function cleanText(value, maxLength) {
  if (value === null || value === undefined) return '';
  let text = String(value).trim();
  if (text.length > maxLength) {
    text = text.substring(0, maxLength);
  }
  return text;
}

function isNumber(value) {
  return value !== null &&
    value !== undefined &&
    value !== '' &&
    Number.isFinite(Number(value));
}

function jsonOutput(object) {
  return ContentService
    .createTextOutput(JSON.stringify(object))
    .setMimeType(ContentService.MimeType.JSON);
}
