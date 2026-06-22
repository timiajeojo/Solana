"use strict";
// app/api/nowpayments/webhook/route.ts
// NOWPayments sends a POST request here when a payment status changes.
// We verify the IPN signature and update the deposit in Supabase.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
var server_1 = require("next/server");
var crypto_1 = require("crypto");
var supabase_js_1 = require("@supabase/supabase-js");
// Use service-role key so we can write to DB from server without RLS blocking
var supabaseAdmin = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
function verifySignature(payload, signature) {
    var secret = process.env.NOWPAYMENTS_IPN_SECRET;
    if (!secret)
        return false;
    var hash = crypto_1.default
        .createHmac('sha512', secret)
        .update(payload)
        .digest('hex');
    return hash === signature;
}
function POST(req) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var body, signature, data, payment_id, payment_status, price_amount, pay_currency, order_id, actually_paid, userId, depositStatus, existing, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, req.text()];
                case 1:
                    body = _b.sent();
                    signature = (_a = req.headers.get('x-nowpayments-sig')) !== null && _a !== void 0 ? _a : '';
                    // Verify the request is genuinely from NOWPayments
                    if (!verifySignature(body, signature)) {
                        console.error('Invalid IPN signature');
                        return [2 /*return*/, server_1.NextResponse.json({ error: 'Invalid signature' }, { status: 401 })];
                    }
                    data = JSON.parse(body);
                    payment_id = data.payment_id, payment_status = data.payment_status, price_amount = data.price_amount, pay_currency = data.pay_currency, order_id = data.order_id, actually_paid = data.actually_paid;
                    console.log("IPN received: payment ".concat(payment_id, " \u2192 ").concat(payment_status));
                    userId = order_id === null || order_id === void 0 ? void 0 : order_id.split('_')[0];
                    if (!userId) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: 'Invalid order_id' }, { status: 400 })];
                    }
                    depositStatus = payment_status === 'finished' ? 'completed' :
                        payment_status === 'confirmed' ? 'completed' :
                            payment_status === 'failed' ? 'failed' :
                                payment_status === 'expired' ? 'failed' :
                                    'pending';
                    return [4 /*yield*/, supabaseAdmin
                            .from('deposits')
                            .select('id')
                            .eq('payment_id', payment_id)
                            .single()];
                case 2:
                    existing = (_b.sent()).data;
                    if (!existing) return [3 /*break*/, 4];
                    // Update existing deposit
                    return [4 /*yield*/, supabaseAdmin
                            .from('deposits')
                            .update({ status: depositStatus, updated_at: new Date().toISOString() })
                            .eq('payment_id', payment_id)];
                case 3:
                    // Update existing deposit
                    _b.sent();
                    return [3 /*break*/, 6];
                case 4: 
                // Insert new deposit record
                return [4 /*yield*/, supabaseAdmin
                        .from('deposits')
                        .insert({
                        user_id: userId,
                        amount: price_amount,
                        plan: "SOL Deposit (".concat(pay_currency === null || pay_currency === void 0 ? void 0 : pay_currency.toUpperCase(), ")"),
                        status: depositStatus,
                        payment_id: payment_id,
                    })];
                case 5:
                    // Insert new deposit record
                    _b.sent();
                    _b.label = 6;
                case 6: return [2 /*return*/, server_1.NextResponse.json({ received: true })];
                case 7:
                    error_1 = _b.sent();
                    console.error('Webhook error:', error_1);
                    return [2 /*return*/, server_1.NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.POST = POST;
