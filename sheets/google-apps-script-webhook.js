const ORDERS_SHEET = 'Orders';
const ITEMS_SHEET = 'Items';

function doPost(e) {
  try {
    const expectedSecret = PropertiesService.getScriptProperties().getProperty('MYMIZAN_WEBHOOK_SECRET');
    const providedSecret = e && e.parameter ? e.parameter.secret : null;
    const headerSecret = e && e.postData && e.postData.type ? null : null;

    // Apps Script web apps do not reliably expose custom headers in all deployments.
    // Prefer sending ?secret=... from the backend webhook URL, or include secret in payload.
    const payload = JSON.parse(e.postData.contents || '{}');
    const bodySecret = payload.secret || null;

    if (expectedSecret && providedSecret !== expectedSecret && bodySecret !== expectedSecret && headerSecret !== expectedSecret) {
      return jsonResponse({ ok: false, error: 'Unauthorized' }, 401);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ordersSheet = ss.getSheetByName(ORDERS_SHEET);
    const itemsSheet = ss.getSheetByName(ITEMS_SHEET);

    if (!ordersSheet || !itemsSheet) {
      return jsonResponse({ ok: false, error: 'Missing Orders or Items sheet' }, 500);
    }

    const order = payload.order || payload;
    const attribution = order.attribution || {};

    ordersSheet.appendRow([
      order.order_number || '',
      order.created_at || new Date().toISOString(),
      order.status || 'new',
      order.customer_name || '',
      order.phone_e164 || '',
      order.phone_digits || '',
      order.total_sar || '',
      order.currency || 'SAR',
      order.payment_method || 'cod',
      order.upsell_accepted === true ? 'yes' : 'no',
      order.upsell_product_id || '',
      attribution.landing_page_url || order.landing_page_url || '',
      attribution.referrer || order.referrer || '',
      attribution.utm_source || '',
      attribution.utm_medium || '',
      attribution.utm_campaign || '',
      attribution.utm_content || '',
      attribution.utm_term || '',
      attribution.fbp || '',
      attribution.fbc || '',
      attribution.ttp || '',
      attribution.ttclid || '',
      attribution.snap_click_id || '',
      'new',
      0,
      '',
      ''
    ]);

    const items = order.items || [];
    items.forEach(function(item) {
      itemsSheet.appendRow([
        order.order_number || '',
        item.product_id || '',
        item.product_name_ar || '',
        item.slug || '',
        item.quantity || '',
        item.offer_price_sar || '',
        item.unit_original_price_sar || '',
        item.is_upsell === true ? 'yes' : 'no',
        item.line_total_sar || item.offer_price_sar || ''
      ]);
    });

    return jsonResponse({ ok: true, order_number: order.order_number || '' }, 200);
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) }, 500);
  }
}

function jsonResponse(data, statusCode) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
