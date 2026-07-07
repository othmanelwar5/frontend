/**
 * Mizan Store — Google Sheets order webhook
 *
 * Setup:
 * 1. Create a spreadsheet with a sheet named "Sheet1" (or change SHEET_NAME below).
 * 2. Extensions → Apps Script → paste this file → Save.
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the deployment URL into backend env ORDER_WEBHOOK_URL
 */

const SHEET_NAME = 'Sheet1';

const HEADERS = [
  'date',
  'order id',
  'country',
  'name',
  'phone',
  'product',
  'sku',
  'quantity',
  'total',
  'curency',
  'status',
];

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const sheet = getOrdersSheet_();
    ensureHeaders_(sheet);

    sheet.appendRow([
      payload.date || '',
      payload.order_id || '',
      payload.country || 'KSA',
      payload.name || '',
      payload.phone || '',
      payload.product || '',
      payload.sku || '',
      payload.quantity || '',
      payload.total != null ? String(payload.total) : '',
      payload.currency || payload.curency || 'SAR',
      payload.status || '',
    ]);

    return jsonResponse_({ ok: true, order_id: payload.order_id || '' }, 200);
  } catch (error) {
    return jsonResponse_({ ok: false, error: String(error) }, 500);
  }
}

function doGet() {
  return jsonResponse_({ ok: true, service: 'mizan-order-webhook' }, 200);
}

function getOrdersSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() > 0) {
    return;
  }

  sheet.appendRow(HEADERS);
}

function jsonResponse_(data, statusCode) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
