"use strict";
// app/api/profits/credit/route.ts
// Call this endpoint daily to credit profits to all active plan users.
// Set up a Vercel Cron: vercel.json → "crons": [{ "path": "/api/profits/credit", "schedule": "0 0 * * *" }]
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
exports.GET = exports.POST = void 0;
var server_1 = require("next/server");
var supabase_js_1 = require("@supabase/supabase-js");
var supabaseAdmin = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
function POST(req) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, activePlans, plansError, today, credited, skipped, _i, activePlans_1, plan, existing, profitError, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 9, , 10]);
                    return [4 /*yield*/, supabaseAdmin
                            .from('user_plans')
                            .select('*')
                            .eq('status', 'active')];
                case 1:
                    _a = _b.sent(), activePlans = _a.data, plansError = _a.error;
                    if (plansError)
                        throw plansError;
                    if (!activePlans || activePlans.length === 0) {
                        return [2 /*return*/, server_1.NextResponse.json({ message: 'No active plans', credited: 0 })];
                    }
                    today = new Date().toISOString().split('T')[0];
                    credited = 0;
                    skipped = 0;
                    _i = 0, activePlans_1 = activePlans;
                    _b.label = 2;
                case 2:
                    if (!(_i < activePlans_1.length)) return [3 /*break*/, 8];
                    plan = activePlans_1[_i];
                    return [4 /*yield*/, supabaseAdmin
                            .from('profits')
                            .select('id')
                            .eq('user_id', plan.user_id)
                            .eq('user_plan_id', plan.id)
                            .eq('date', today)
                            .single()];
                case 3:
                    existing = (_b.sent()).data;
                    if (existing) {
                        skipped++;
                        return [3 /*break*/, 7];
                    }
                    if (!(new Date() > new Date(plan.end_date))) return [3 /*break*/, 5];
                    return [4 /*yield*/, supabaseAdmin
                            .from('user_plans')
                            .update({ status: 'completed' })
                            .eq('id', plan.id)];
                case 4:
                    _b.sent();
                    skipped++;
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, supabaseAdmin
                        .from('profits')
                        .insert({
                        user_id: plan.user_id,
                        user_plan_id: plan.id,
                        amount: plan.daily_return,
                        date: today,
                    })];
                case 6:
                    profitError = (_b.sent()).error;
                    if (profitError) {
                        console.error("Failed for user ".concat(plan.user_id, ":"), profitError);
                        return [3 /*break*/, 7];
                    }
                    credited++;
                    _b.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 2];
                case 8: return [2 /*return*/, server_1.NextResponse.json({ success: true, credited: credited, skipped: skipped, total: activePlans.length })];
                case 9:
                    error_1 = _b.sent();
                    console.error('Credit profits error:', error_1);
                    return [2 /*return*/, server_1.NextResponse.json({ error: 'Failed to credit profits' }, { status: 500 })];
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.POST = POST;
function GET(req) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, POST(req)];
        });
    });
}
exports.GET = GET;
