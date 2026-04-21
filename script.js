// ==========================================
// 1. CONFIG & DATA INITIALIZATION
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyCSavMO9lUOQLEGUk1LD-FkE64Ixl0CHIM",
    authDomain: "bizhar-pos.firebaseapp.com",
    projectId: "bizhar-pos",
    databaseURL: "https://bizhar-pos-default-rtdb.firebaseio.com/",
    storageBucket: "bizhar-pos.firebasestorage.app",
    messagingSenderId: "880868795852",
    appId: "1:880868795852:web:065eac96bb99d7cda46969",
    measurementId: "G-F6CGHB3BYT"
};

let db, storage;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.database();
    storage = firebase.storage();
} catch (e) {
    console.error("Firebase init failed:", e);
}

let inv = []; let sales = []; let archive = []; let trash = []; let reports = []; let customers = [];
let expenses = []; let suppliers = []; let logs = []; let guarantors = []; let commissions = [];

let privacyHidden = true; let isInventoryOpen = false; let currentDocFile = null; let activeScanner = null;
let isScanning = false; let currentUserRole = "Cashier"; let currentUsername = "User";
let currentCurrency = { code: 'USD', rate: 1, symbol: '$' };

let securitySettings = { masterPass: "", protectedSections: [] };

// ==========================================
// 2. TRANSLATIONS (100% COMPLETE FOR 6 LANGUAGES)
// ==========================================
const translations = {
    bd: {
        login_sub: "سیستەمێ فرۆشتنێ و قیستان", tab_si: "چوونەژوور", tab_su: "تۆمارکرن",
        user: "ناڤێ بکارئینەری", pass: "کۆدا نهێنی", user_new: "ناڤێ بکارئینەری نوێ", role_c: "کاشێر", role_a: "ئەدمین",
        lbl_code: "کۆدی (٦ ژمارە)", buy_code: "کڕینا کۆدی", wa_link: "پەیوەندی ب گەشەپێدەرێ",
        err_empty: "تکایە هەمی خانێن پڕ بکە!", err_code: "کۆد یان زانیاری شێلۆنە!", err_exists: "ئەڤ ناڤە یێ هەی!",
        succ_su: "سەرکەفتی! حیساب هاتە چێکرن.", succ_si: "ب سەرکەفتی چوویتە ژوور!", waMsg: "سڵاف، دێ شێم کۆدەکێ چالاککرنا سیستەمی کڕم؟",
        mhead: "مینیو", tform: "فرۆشتنا نوی", lname: "ناڤێ کڕیاری", lphone: "موبایلا کڕیاری", lwitness: "ناڤێ دیدەڤانی", lwphone: "موبایلا دیدەڤانی", litem: " ئامێر/کاڵا",
        lbuy: "بهایێ فرۆتنێ", ldown: "پێشەکی", lduration: "ماوێ قیستێ", lmon: "قیست", ltotal: "کۆم", bsave: "تۆمارکرن",
        s1: "کۆگە", s4: "قازانج", srem: "ماوە", sannual: "تەخمینا ساڵانە", lnote: "تێبینی",
        th1: "کڕیار", th2: " ئامێر", th3: "کۆم", th_down: "پێشەکی", th4: "قیست", th5: "کردار",
        madd: "مەخزەن", bclose: "داخستن", search: "لێگەریان ب ناڤ، بارکۆد یان ID...", inv_name: "ناڤێ ئامێری", inv_qty: "دانە", inv_add: "زێدەکرن",
        marchive: "ئەڕشیڤ", mtrash: "گلێش", mbackup: "سەیفکرنا ئێکسل", mbackup_json: "باکئەپ (JSON)", mpdf: "سەیفکرنا PDF", mrestore: "دووبارە زێدەکرن",
        mreports: "ڕاپۆرت", mabout: "گەشەپێدەر", mlogout: "چوونەدەر", mpc: "کۆمپیوتەر", mmobile: "موبایل", mdark: "شەڤ", mlight: "ڕۆژ",
        dev_role: "پسپۆرێ IT و گەشەپێدەر", dev_msg: "ئەڤ سیستەمە ژ لایێ بژار ڕەشید هاتیە دروستکرن", other: "پشکێن دی",
        lsaletype: "جۆرێ فرۆشتنێ", opt_inst: "بقیست", opt_cash: "کاش", opt_debt: "قەرز/دەین", opt_other_plan: "پشکێن دی (دەستکاری)",
        custom_rate: "ڕێژەیا قازانجی %", custom_months: "هژمارا هەیڤان", rep_d: "ڕۆژانە", rep_w: "هەفتیانە", rep_m: "هەیڤانە", rep_y: "ساڵانە",
        rep_count: "هژمارا وەصلا", rep_total: "کۆما پارەی", click_visit: "بۆ دیتنا پۆرتبۆلیۆی کلیک بکە", rec_title: "وەصلا وەرگرتنێ",
        rec_cust: "کڕیار", rec_wit: "دیدەڤان", rec_rem: "ماوە", rec_msg: "سوپاس بۆ متمانەیا هەوە", notif_title: "ئاگەهداریێن قستان", notif_msg: "٣ ڕۆژ ماینە بۆ دانا قستێ",
        inv_cost: "بهایێ کڕینێ", out_of_stock: "ئەڤ کەلوپەلە د مەخزەنی دا نەماینە!", mlabel: "چاپکرنا لەیبلا", invalid_phone: "ژمارەیا موبایلێ یا خەلەتە!",
        save_error: "کێشەیەک ل دەمێ سەیفکرنێ پەیدابوو!", h_title: "دیرۆکا پارەدانێ", mclosing: "داخستنا سندوقێ", lupload: "بارکرنا ناسنامێ", mvault: "سندوق",
        edit_sale: "دەستکاری", update: "نویکردنەوە", confirm_del: "ئەرێ تو پشتراستی دێ برە د ناف گلێشی دا؟",
        success_save: "وەێل ب سەرکەفتی هاتە تۆمارکرن", success_pay: "پارە ب سەرکەفتی هاتە وەرگرتن", success_inv: "کەلوپەل ل مەخزەنی هاتە زێدەکرن", success_restore: "داتا ب سەرکەفتی هاتە زێدەکرن",
        doc_label: "بەلگەیێ کڕیاری (ناسنامە)", mcustomers: "کڕیاران", mcurrency: "دراو", edit_receipt: "دەستکاری وەسلێ", save_changes: "تۆمارکرنا گۆهرینان",
        print_preview: "پێشبینینا چاپکرنێ", receipt_saved: "وەسل هاتە تۆمارکرن", add_customer: "زێدەکرنا کڕیاری", customer_saved: "کڕیار هاتە تۆمارکرن", customer_exists: "ئەڤ کڕیاری پێشتر هەیە",
        currency_usd: "دۆلاری ئەمریکی", currency_iqd: "دیناری عێراقی", currency_irr: "تۆمانی ئێرانی", currency_try: "لیرەی تورکی",
        edit_receipt_note: "دەستکاریێن تێدا بکە پاشان تۆمار بکە", msecurity: "سکیورتی / پاسۆرد", sec_title: "رێکخستنا پاسۆردی", sec_pass: "پاسۆردێ نوێ بنڤیسە", sec_save: "پاسۆردێ خەزن بکە",
        prot_inv: "پاراستنا مەخزەنی", prot_edit: "پاراستنا دەستکاریکرنێ", prot_ret: "پاراستنا گەڕاندنەوەی", prot_pay: "پاراستنا وەرگرتنا پارەی", prot_del: "پاراستنا سڕینەوەی",
        enter_pass: "تکایە پاسۆردی بنڤیسە:", print_qr: "چاپکرن", net_profit: "قازانجێ سافی", pay_method: "شێوازێ پارەدانێ",
        m_expenses: "خەرجی", m_suppliers: "دابینکار (کۆمپانیا)", cash_in_box: "کۆما پارەیێ سندوقێ", th_desc: "وەسف", th_amt: "بڕێ پارەی", th_date: "بەروار", th_del: "سڕینەوە",
        btn_restore: "گەڕاندنەوە", discount: "داشکاندن (خصم)", imei: "IMEI / ژمارا زنجیرەیی", blacklist: "لیستا ڕەش", m_stocktake: "جەردکرنا مەخزەنی", low_stock: "ل مەخزەنی کێم بوویە",
        err_blacklisted: "ئەڤ کڕیارە د لیستا ڕەش دایە، نابت ب قەرز ببەت!", m_audit: "تۆماری چالاکیان", m_statement: "کەشفی حساب", btn_a4: "چاپا A4", contract_title: "گرێبەستا قستان",
        seller: "فرۆشیار", buyer: "کڕیار", guarantor: "کەفیل", m_guarantors: "کەفیلان", m_commissions: "عومولە و پاداشت", late_fee: "غەرامەیا دواکەفتنێ",
        exp_cat: "پۆلێ خەرجیێ", cat_rent: "کرێ", cat_salary: "مووچە", cat_bills: "پارەیێن خزمەتگوزاری", cat_other: "یێن دی", comm_amt: "عومولەیا کارمەندی",
        auth_req: "پاسۆردێ نوکە یان کۆدێ ئەدمینی:", err_auth_req: "تکایە پاسۆردێ نوکە یان کۆد بنڤیسە!", err_auth_fail: "پاسۆرد یان کۆد خەلەتە!"
    },
    sr: {
        login_sub: "سیستەمی فرۆشتن و قیستەکان", tab_si: "چوونەژوورەوە", tab_su: "خۆتۆمارکردن",
        user: "ناوی بەکارهێنەر", pass: "وشەی نهێنی", user_new: "ناوی بەکارهێنەری نوێ", role_c: "کاشێر", role_a: "بەڕێوەبەر",
        lbl_code: "کۆد (٦ ژمارە)", buy_code: "کڕینی کۆد", wa_link: "پەیوەندی بە گەشەپێدەرەوە",
        err_empty: "تکایە هەموو خانەکان پڕبکەوە!", err_code: "کۆدەکە یان زانیارییەکان هەڵەن!", err_exists: "ئەم ناوە پێشتر بەکارهاتووە!",
        succ_su: "سەرکەوتووبوو! هەژمار دروستکرا.", succ_si: "بە سەرکەوتوویی چوویتە ژوورەوە!", waMsg: "سڵاو، دەتوانم کۆدێکی چالاککردنی سیستم بکڕم؟",
        mhead: "مینیو", tform: "فرۆشتنی نوێ", lname: "ناوی کڕیار", lphone: "موبایلی کڕیار", lwitness: "ناوی دیدەڤان", lwphone: "موبایلی دیدەڤان", litem: "ئامێر",
        lbuy: "نرخی فرۆشتنی", ldown: "پێشەکی", lduration: "ماوە", lmon: "قیست", ltotal: "کۆم", bsave: "پاشەکەوت",
        s1: "کۆگا", s4: "قازانج", srem: "ماوە", sannual: "ساڵانە", lnote: "تێبینی",
        th1: "کڕیار", th2: "ئامێر", th3: "کۆم", th_down: "پێشەکی", th4: "قیست", th5: "کردار",
        madd: "کۆگا", bclose: "داخستن", search: "گەڕان بە ناو، بارکۆد یان ID...", inv_name: "ناوی کاڵا", inv_qty: "ژمارە", inv_add: "زیادکردن",
        marchive: "ئەرشیف", mtrash: "تەنەکەی خۆڵ", mbackup: "باکئەپی ئێکسل", mbackup_json: "باکئەپ (JSON)", mpdf: "باکئەپی PDF", mrestore: "گێڕانەوەی داتا",
        mreports: "ڕاپۆرتەکان", mabout: "دەربارەی سیستم", mlogout: "چوونەدرەوە", mpc: "کۆمپیوتەر", mmobile: "موبایل", mdark: "شەو", mlight: "ڕۆژ",
        dev_role: "پسپۆڕی IT و گەشەپێدەر", dev_msg: "ئەم سیستمە لەلایەن بژار ڕەشید دروست کراوە", other: "بەشەکانی تر",
        lsaletype: "جۆری فرۆشتن", opt_inst: "قست", opt_cash: "نەقد", opt_debt: "قەرز", opt_other_plan: "دەستکاری",
        custom_rate: "ڕێژەی قازانج %", custom_months: "مانگەکان", rep_d: "ڕۆژانە", rep_w: "هەفتانە", rep_m: "مانگانە", rep_y: "ساڵانە",
        rep_count: "ژمارەی وەصڵ", rep_total: "کۆیی پارە", click_visit: "بۆ بینینی پۆرتبۆلیۆ کلیک بکە", rec_title: "وەصڵی وەرگرتن",
        rec_cust: "کڕیار", rec_wit: "شایەت", rec_rem: "ماوە", rec_msg: "سوپاس بۆ متمانەکەتان", notif_title: "ئاگادارکەرەوەی قیستەکان", notif_msg: "٣ ڕۆژ ماوە بۆدانی قیست",
        inv_cost: "نرخی کڕین", out_of_stock: "ببوورە! ئەم کاڵایە لە کۆگا نەماوە", mlabel: "چاپکردنی لەیبڵ", invalid_phone: "ژمارەی مۆبایلەکە هەڵەیە!",
        save_error: "کێشەیەک لە پاشەکەوتکردن هەبوو!", h_title: "مێژووی قیستەکان", mclosing: "داخستنی سندوق", lupload: "بارکردنی ناسنامە", mvault: "سندوق",
        edit_sale: "دەستکاری", update: "نوێکردنەوە", confirm_del: "ئایا دڵنیای دەتەوێت بیخەیتە ناو تەنەکەی خۆڵ؟",
        success_save: "وەصڵەکە بە سەرکەوتوویی پاشەکەوت کرا", success_pay: "پارەکە بە سەرکەوتوویی وەرگیرا", success_inv: "کاڵاکە بۆ کۆگا زیاد کرا", success_restore: "داتاکان بە سەرکەوتوویی گەڕێنرانەوە",
        doc_label: "بەڵگەی کڕیار (ناسنامە)", mcustomers: "کڕیاران", mcurrency: "دراو", edit_receipt: "دەستکاری وەصڵ", save_changes: "پاشەکەوتکردنی گۆڕانکاریەکان",
        print_preview: "پێشبینینی چاپکردن", receipt_saved: "وەصڵ پاشەکەوت کرا", add_customer: "زیادکردنی کڕیار", customer_saved: "کڕیار پاشەکەوت کرا", customer_exists: "ئەم کڕیارە پێشتر هەیە",
        currency_usd: "دۆلاری ئەمریکی", currency_iqd: "دیناری عێراقی", currency_irr: "تۆمانی ئێرانی", currency_try: "لیرەی تورکی",
        edit_receipt_note: "گۆڕانکاریەکان بکە پاشان پاشەکەوت بکە", msecurity: "سکیوریتی / پاسۆرد", sec_title: "ڕێکخستنی پاسۆرد", sec_pass: "پاسۆردی نوێ بنووسە", sec_save: "پاشەکەوتکردنی پاسۆرد",
        prot_inv: "پاراستنی کۆگا", prot_edit: "پاراستنی دەستکاری فرۆشتن", prot_ret: "پاراستنی گەڕاندنەوە", prot_pay: "پاراستنی وەرگرتنی پارە", prot_del: "پاراستنی سڕینەوە",
        enter_pass: "تکایە پاسۆرد بنووسە:", print_qr: "چاپکردن", net_profit: "قازانجی پوخت", pay_method: "شێوازی پارەدان",
        m_expenses: "خەرجییەکان", m_suppliers: "دابینکاران (کۆمپانیا)", cash_in_box: "کۆی پارەی ناو سندوق", th_desc: "وەسف", th_amt: "بڕ", th_date: "بەروار", th_del: "سڕینەوە",
        btn_restore: "گەڕاندنەوە", discount: "داشکاندن (خصم)", imei: "IMEI / زنجیرەیی", blacklist: "لیستی ڕەش", m_stocktake: "جەردکردنی کۆگا", low_stock: "لە کۆگا کەم بووەتەوە",
        err_blacklisted: "ئەم کڕیارە لە لیستی ڕەشدایە!", m_audit: "تۆماری چالاکیەکان", m_statement: "کەشفی حساب", btn_a4: "چاپی A4", contract_title: "گرێبەستی قیست",
        seller: "فرۆشیار", buyer: "کڕیار", guarantor: "کەفیل", m_guarantors: "کەفیلەکان", m_commissions: "عومولەکان", late_fee: "سزای دواکەوتن",
        exp_cat: "جۆری خەرجی", cat_rent: "کرێ", cat_salary: "مووچە", cat_bills: "پسوولە", cat_other: "هیتر", comm_amt: "بڕی عومولە",
        auth_req: "پاسۆردی ئێستا یان کۆدی ئەدمین:", err_auth_req: "تکایە پاسۆردی ئێستا یان کۆدی ئەدمین بنووسە!", err_auth_fail: "پاسۆرد یان کۆدی ئەدمین هەڵەیە!"
    },
    ar: {
        login_sub: "نظام المبيعات والأقساط", tab_si: "تسجيل الدخول", tab_su: "إنشاء حساب",
        user: "اسم المستخدم", pass: "كلمة المرور", user_new: "اسم مستخدم جديد", role_c: "كاشير", role_a: "مدير",
        lbl_code: "الرمز (6 أرقام)", buy_code: "شراء الرمز", wa_link: "اتصل بالمطور",
        err_empty: "يرجى ملء جميع الحقول!", err_code: "الرمز أو البيانات خاطئة!", err_exists: "هذا المستخدم موجود مسبقاً!",
        succ_su: "نجاح! تم إنشاء الحساب.", succ_si: "تم تسجيل الدخول بنجاح!", waMsg: "مرحباً، هل يمكنني شراء كود تفعيل النظام؟",
        mhead: "القائمة", tform: "بيع جديد", lname: "اسم الزبون", lphone: "رقم الهاتف", lwitness: "اسم الشاهد", lwphone: "هاتف الشاهد", litem: "المنتج",
        lbuy: "سعر البيع", ldown: "المقدمة", lduration: "مدة الأقساط", lmon: "القسط الشهري", ltotal: "المجموع", bsave: "حفظ",
        s1: "المخزن", s4: "الأرباح", srem: "المتبقي", sannual: "التوقع السنوي", lnote: "ملاحظات",
        th1: "الزبون", th2: "المنتج", th3: "المجموع", th_down: "المقدم", th4: "المدفوع", th5: "إجراء",
        madd: "المخزن", bclose: "إغلاق", search: "بحث عن طريق الاسم أو الرقم...", inv_name: "اسم المنتج", inv_qty: "الكمية", inv_add: "إضافة",
        marchive: "الأرشيف", mtrash: "سلة المهملات", mbackup: "تصدير إكسل", mbackup_json: "نسخة JSON", mpdf: "تصدير PDF", mrestore: "استرجاع البيانات",
        mreports: "التقارير", mabout: "حول المطور", mlogout: "تسجيل الخروج", mpc: "وضع الكمبيوتر", mmobile: "وضع الهاتف", mdark: "ليلي", mlight: "نهاري",
        dev_role: "خبير IT ومطور برامج", dev_msg: "تم تطوير هذا النظام بواسطة بژار رشيد", other: "أقسام أخرى",
        lsaletype: "نوع البيع", opt_inst: "أقساط", opt_cash: "نقدي", opt_debt: "دين", opt_other_plan: "تعديل النسبة",
        custom_rate: "النسبة %", custom_months: "الأشهر", rep_d: "يومي", rep_w: "أسبوعي", rep_m: "شهري", rep_y: "سنوي",
        rep_count: "عدد الوصلات", rep_total: "إجمالي المبلغ", click_visit: "لمشاهدة معرض الأعمال", rec_title: "وصل استلام",
        rec_cust: "الزبون", rec_wit: "الشاهد", rec_rem: "الباقي", rec_msg: "شكراً لثقتكم بنا", notif_title: "تنبيهات الأقساط", notif_msg: "بقي ٣ أيام على موعد القسط",
        inv_cost: "سعر الشراء", out_of_stock: "عذراً! المنتج غير متوفر", mlabel: "صانع الليبل", invalid_phone: "رقم الهاتف غير صحيح!",
        save_error: "فشل الحفظ!", h_title: "سجل المدفوعات", mclosing: "إغلاق الصندوق", lupload: "رفع المستمسكات", mvault: "الصندوق",
        edit_sale: "تعديل", update: "تحديث", confirm_del: "هل أنت متأكد من النقل لسلة المهملات؟",
        success_save: "تم حفظ الوصل بنجاح", success_pay: "تم استلام المبلغ بنجاح", success_inv: "تمت إضافة المنتج للمخزن", success_restore: "تم استرجاع البيانات بنجاح",
        doc_label: "مستمسك الزبون", mcustomers: "العملاء", mcurrency: "العملة", edit_receipt: "تعديل الوصل", save_changes: "حفظ التغييرات",
        print_preview: "معاينة الطباعة", receipt_saved: "تم حفظ الوصل", add_customer: "إضافة عميل", customer_saved: "تم حفظ العميل", customer_exists: "هذا العميل موجود مسبقاً",
        currency_usd: "دولار أمريكي", currency_iqd: "دينار عراقي", currency_irr: "تومان إيراني", currency_try: "ليرة تركية",
        edit_receipt_note: "قم بالتعديل ثم احفظ", msecurity: "الأمان وكلمة المرور", sec_title: "إعدادات كلمة المرور", sec_pass: "أدخل كلمة المرور الجديدة", sec_save: "حفظ الإعدادات",
        prot_inv: "حماية المخزن", prot_edit: "حماية تعديل البيع", prot_ret: "حماية إرجاع البيع", prot_pay: "حماية استلام المبالغ", prot_del: "حماية الحذف",
        enter_pass: "الرجاء إدخال كلمة المرور:", print_qr: "طباعة", net_profit: "صافي الربح", pay_method: "طريقة الدفع",
        m_expenses: "المصروفات", m_suppliers: "الموردين", cash_in_box: "النقد في الصندوق", th_desc: "الوصف", th_amt: "المبلغ", th_date: "التاريخ", th_del: "حذف",
        btn_restore: "استعادة", discount: "الخصم", imei: "السيريال / IMEI", blacklist: "القائمة السوداء", m_stocktake: "جرد المخزن", low_stock: "نفاد الكمية قريباً",
        err_blacklisted: "العميل في القائمة السوداء!", m_audit: "سجل النشاطات", m_statement: "كشف حساب", btn_a4: "طباعة عقد A4", contract_title: "عقد بيع بالتقسيط",
        seller: "البائع", buyer: "المشتري", guarantor: "الضامن", m_guarantors: "الضامنين", m_commissions: "العمولات", late_fee: "غرامة تأخير",
        exp_cat: "نوع المصروف", cat_rent: "إيجار", cat_salary: "رواتب", cat_bills: "فواتير", cat_other: "أخرى", comm_amt: "مبلغ العمولة",
        auth_req: "كلمة المرور الحالية أو كود الآدمن:", err_auth_req: "يرجى إدخال كلمة المرور أو الكود!", err_auth_fail: "كلمة المرور أو الكود غير صحيح!"
    },
    en: {
        login_sub: "Sales & Installment System", tab_si: "Sign In", tab_su: "Sign Up",
        user: "Username", pass: "Password", user_new: "New Username", role_c: "Cashier", role_a: "Admin",
        lbl_code: "Code (6 Digits)", buy_code: "Buy Code", wa_link: "Contact Developer",
        err_empty: "Please fill all fields!", err_code: "Invalid Code or Data!", err_exists: "User already exists!",
        succ_su: "Success! Account created.", succ_si: "Logged in successfully!", waMsg: "Hello, can I purchase a system activation code?",
        mhead: "MENU", tform: "NEW SALE", lname: "CUSTOMER NAME", lphone: "PHONE", lwitness: "WITNESS", lwphone: "WIT PHONE", litem: "ITEM",
        lbuy: "PRICE", ldown: "DOWN", lduration: "PLAN", lmon: "MONTHLY", ltotal: "TOTAL", bsave: "SAVE",
        s1: "STOCK", s4: "NET PROFIT", srem: "REMAIN", sannual: "ANNUAL", lnote: "NOTES",
        th1: "NAME", th2: "ITEM", th3: "TOTAL", th_down: "DOWN", th4: "PAID", th5: "ACTION",
        madd: "INVENTORY", bclose: "CLOSE", search: "Search by Name, Barcode or ID...", inv_name: "Item Name", inv_qty: "Qty", inv_add: "Add",
        marchive: "Archive", mtrash: "Trash", mbackup: "Excel", mbackup_json: "Backup JSON", mpdf: "PDF", mrestore: "Restore",
        mreports: "Reports", mabout: "About", mlogout: "Logout", mpc: "PC Mode", mmobile: "Mobile Mode", mdark: "Dark", mlight: "Light",
        dev_role: "IT Specialist & Developer", dev_msg: "Developed by Bizhar Rasheed", other: "Other Items",
        lsaletype: "Sale Type", opt_inst: "Installments", opt_cash: "Cash", opt_debt: "Debt", opt_other_plan: "Other",
        custom_rate: "Rate %", custom_months: "Months", rep_d: "Daily", rep_w: "Weekly", rep_m: "Monthly", rep_y: "Yearly",
        rep_count: "Receipts", rep_total: "Total", click_visit: "Portfolio", rec_title: "RECEIPT",
        rec_cust: "Customer", rec_wit: "Witness", rec_rem: "Remain", rec_msg: "Thank you for your trust", notif_title: "Installment Alerts", notif_msg: "3 days left for payment",
        inv_cost: "Cost Price", out_of_stock: "Sorry! Item out of stock", mlabel: "Label Maker", invalid_phone: "Invalid phone number!",
        save_error: "Save failed!", h_title: "Payment Ledger", mclosing: "Daily Closing", lupload: "Upload Document", mvault: "Cash Drawer",
        edit_sale: "Edit", update: "Update", confirm_del: "Are you sure you want to move this to trash?",
        success_save: "Sale saved successfully!", success_pay: "Payment received!", success_inv: "Inventory updated!", success_restore: "Data restored successfully!",
        doc_label: "Customer ID Doc", mcustomers: "Customers", mcurrency: "Currency", edit_receipt: "Edit Receipt", save_changes: "Save Changes",
        print_preview: "Print Preview", receipt_saved: "Receipt saved", add_customer: "Add Customer", customer_saved: "Customer saved", customer_exists: "Customer already exists",
        currency_usd: "US Dollar", currency_iqd: "Iraqi Dinar", currency_irr: "Iranian Toman", currency_try: "Turkish Lira",
        edit_receipt_note: "Edit then save", msecurity: "Security / Password", sec_title: "Password Settings", sec_pass: "Set Master Password", sec_save: "Save Settings",
        prot_inv: "Protect Inventory Access", prot_edit: "Protect Edit Sale", prot_ret: "Protect Return Sale", prot_pay: "Protect Receive Payment", prot_del: "Protect Delete/Trash",
        enter_pass: "Please enter password:", print_qr: "Print QR", net_profit: "NET PROFIT", pay_method: "Payment Method",
        m_expenses: "Expenses", m_suppliers: "Suppliers", cash_in_box: "TOTAL CASH IN BOX", th_desc: "Description", th_amt: "Amount", th_date: "Date", th_del: "Delete",
        btn_restore: "RESTORE", discount: "Discount", imei: "IMEI / Serial", blacklist: "Blacklist", m_stocktake: "Stocktaking", low_stock: "Low in Stock",
        err_blacklisted: "Customer is blacklisted!", m_audit: "Audit Log", m_statement: "Statement", btn_a4: "Print A4", contract_title: "Installment Contract",
        seller: "Seller", buyer: "Buyer", guarantor: "Guarantor", m_guarantors: "Guarantors", m_commissions: "Commissions", late_fee: "Late Fee",
        exp_cat: "Category", cat_rent: "Rent", cat_salary: "Salary", cat_bills: "Bills", cat_other: "Other", comm_amt: "Commission Amt",
        auth_req: "Current Pass or Admin Code:", err_auth_req: "Please enter current pass or code!", err_auth_fail: "Invalid password or admin code!"
    },
    tr: {
        login_sub: "Satış ve Taksit Sistemi", tab_si: "Giriş Yap", tab_su: "Kayıt Ol",
        user: "Kullanıcı Adı", pass: "Şifre", user_new: "Yeni Kullanıcı Adı", role_c: "Kasiyer", role_a: "Yönetici",
        lbl_code: "Kod (6 Hane)", buy_code: "Kod Satın Al", wa_link: "Geliştiriciyle İletişim",
        err_empty: "Lütfen tüm alanları doldurun!", err_code: "Geçersiz Kod veya Veri!", err_exists: "Kullanıcı zaten mevcut!",
        succ_su: "Başarılı! Hesap oluşturuldu.", succ_si: "Başarıyla giriş yapıldı!", waMsg: "Merhaba, sistem aktivasyon kodu satın alabilir miyim?",
        mhead: "MENÜ", tform: "YENİ SATIŞ", lname: "MÜŞTERİ ADI", lphone: "TELEFON", lwitness: "ŞAHİT", lwphone: "ŞAHİT TEL", litem: "ÜRÜN",
        lbuy: "SATIŞ FİYATI", ldown: "PEŞİNAT", lduration: "TAKSİT PLANI", lmon: "AYLIK", ltotal: "TOPLAM", bsave: "KAYDET",
        s1: "STOK", s4: "KAR", srem: "KALAN", sannual: "YILLIK TAHMİN", lnote: "NOTLAR",
        th1: "AD", th2: "ÜRÜN", th3: "TOPLAM", th_down: "PEŞİN", th4: "ÖDENEN", th5: "İŞLEM",
        madd: "ENVANTER", bclose: "KAPAT", search: "İsim veya ID ile ara...", inv_name: "Ürün Adı", inv_qty: "Adet", inv_add: "Ekle",
        marchive: "Arşiv", mtrash: "Çöp Kutusu", mbackup: "Excel Çıktısı", mbackup_json: "JSON Yedek", mpdf: "PDF Çıktısı", mrestore: "Veriyi Geri Yükle",
        mreports: "Raporlar", mabout: "Geliştirici", mlogout: "Çıkış Yap", mpc: "PC Modu", mmobile: "Mobil Mod", mdark: "Koyu", mlight: "Açık",
        dev_role: "BT Uzmanı ve Geliştirici", dev_msg: "Bu sistem Bizhar Rasheed tarafından geliştirildi", other: "Diğer Bölümler",
        lsaletype: "Satış Türü", opt_inst: "Taksitli", opt_cash: "Nakit", opt_debt: "Borç", opt_other_plan: "Oranı Düzenle",
        custom_rate: "Oran %", custom_months: "Ay Sayısı", rep_d: "Günlük", rep_w: "Haftalık", rep_m: "Aylık", rep_y: "Yıllık",
        rep_count: "Fiş Sayısı", rep_total: "Toplam Tutar", click_visit: "Portfolyoyu Gör", rec_title: "MAKBUZ",
        rec_cust: "Müşteri", rec_wit: "Şahit", rec_rem: "Kalan", rec_msg: "Güveniniz için teşekkürler", notif_title: "Taksit Uyarıları", notif_msg: "Ödeme için 3 gün kaldı",
        inv_cost: "Maliyet", out_of_stock: "Üzgünüz! Ürün stokta yok", mlabel: "Etiket Oluşturucu", invalid_phone: "Geçersiz telefon numarası!",
        save_error: "Kaydetme hatası!", h_title: "Ödeme Geçmişi", mclosing: "Günlük Kapanış", lupload: "Belge Yükle", mvault: "Kasa",
        edit_sale: "Düzenle", update: "Güncelle", confirm_del: "Çöp kutusuna taşımak istediğinize emin misiniz?",
        success_save: "Satış başarıyla kaydedildi!", success_pay: "Ödeme alındı!", success_inv: "Envanter güncellendi!", success_restore: "Veriler başarıyla yüklendi!",
        doc_label: "Müşteri Kimlik Belgesi", mcustomers: "Müşteriler", mcurrency: "Para Birimi", edit_receipt: "Makbuzu Düzenle", save_changes: "Değişiklikleri Kaydet",
        print_preview: "Baskı Önizleme", receipt_saved: "Makbuz kaydedildi", add_customer: "Müşteri Ekle", customer_saved: "Müşteri kaydedildi", customer_exists: "Müşteri zaten mevcut",
        currency_usd: "Amerikan Doları", currency_iqd: "Irak Dinarı", currency_irr: "İran Tümeni", currency_try: "Türk Lirası",
        edit_receipt_note: "Düzenleyip kaydedin", msecurity: "Güvenlik / Şifre", sec_title: "Şifre Ayarları", sec_pass: "Yeni Şifre Belirle", sec_save: "Ayarları Kaydet",
        prot_inv: "Envanteri Koru", prot_edit: "Düzenlemeyi Koru", prot_ret: "İadeyi Koru", prot_pay: "Ödeme Almayı Koru", prot_del: "Silmeyi Koru",
        enter_pass: "Lütfen şifreyi girin:", print_qr: "Yazdır", net_profit: "NET KÂR", pay_method: "Ödeme Yöntemi",
        m_expenses: "Giderler", m_suppliers: "Tedarikçiler", cash_in_box: "KASADAKİ TOPLAM PARA", th_desc: "Açıklama", th_amt: "Tutar", th_date: "Tarih", th_del: "Sil",
        btn_restore: "GERİ YÜKLE", discount: "İndirim", imei: "IMEI / Seri No", blacklist: "Kara Liste", m_stocktake: "Stok Sayımı", low_stock: "Stokta Az",
        err_blacklisted: "Müşteri kara listede!", m_audit: "İşlem Günlüğü", m_statement: "Hesap Özeti", btn_a4: "A4 Yazdır", contract_title: "Taksit Sözleşmesi",
        seller: "Satıcı", buyer: "Alıcı", guarantor: "Kefil", m_guarantors: "Kefiller", m_commissions: "Komisyonlar", late_fee: "Gecikme Cezası",
        exp_cat: "Kategori", cat_rent: "Kira", cat_salary: "Maaş", cat_bills: "Faturalar", cat_other: "Diğer", comm_amt: "Komisyon Miktarı",
        auth_req: "Mevcut Şifre veya Admin Kodu:", err_auth_req: "Lütfen mevcut şifre veya kodu girin!", err_auth_fail: "Geçersiz şifre veya kod!"
    },
    fa: {
        login_sub: "سیستم فروش و اقساط", tab_si: "ورود", tab_su: "ثبت نام",
        user: "نام کاربری", pass: "رمز عبور", user_new: "نام کاربری جدید", role_c: "صندوقدار", role_a: "مدیر",
        lbl_code: "کد (۶ رقم)", buy_code: "خرید کد", wa_link: "تماس با برنامه‌نویس",
        err_empty: "لطفا همه فیلدها را پر کنید!", err_code: "کد یا اطلاعات اشتباه است!", err_exists: "این کاربر قبلا وجود دارد!",
        succ_su: "موفقیت! حساب ایجاد شد.", succ_si: "با موفقیت وارد شدید!", waMsg: "سلام، آیا می‌توانم کد فعال‌سازی سیستم را خریداری کنم؟",
        mhead: "منو", tform: "فروش جدید", lname: "نام مشتری", lphone: "شماره تماس", lwitness: "نام شاهد", lwphone: "تماس شاهد", litem: "کالا",
        lbuy: "قیمت فروش", ldown: "پیش‌پرداخت", lduration: "مدت اقساط", lmon: "قسط ماهانه", ltotal: "مجموع", bsave: "ذخیره",
        s1: "موجودی", s4: "سود", srem: "باقیمانده", sannual: "تخمین سالانه", lnote: "یادداشت",
        th1: "مشتری", th2: "کالا", th3: "مجموع", th_down: "پیش", th4: "پرداختی", th5: "عملیات",
        madd: "انبار", bclose: "بستن", search: "جستجو با نام یا شناسه...", inv_name: "نام کالا", inv_qty: "تعداد", inv_add: "افزودن",
        marchive: "آرشیو", mtrash: "زباله‌دان", mbackup: "خروجی اکسل", mbackup_json: "پشتیبان JSON", mpdf: "خروجی PDF", mrestore: "بازیابی داده‌ها",
        mreports: "گزارش‌ها", mabout: "درباره توسعه‌دهنده", mlogout: "خروج", mpc: "حالت کامپیوتر", mmobile: "حالت موبایل", mdark: "تاریک", mlight: "روشن",
        dev_role: "متخصص IT و توسعه‌دهنده", dev_msg: "این سیستم توسط بژار رشید طراحی شده است", other: "بخش‌های دیگر",
        lsaletype: "نوع فروش", opt_inst: "اقساطی", opt_cash: "نقدی", opt_debt: "قرض", opt_other_plan: "تغییر درصد",
        custom_rate: "درصد سود %", custom_months: "تعداد ماه", rep_d: "روزانه", rep_w: "هفتگی", rep_m: "ماهانه", rep_y: "سالانه",
        rep_count: "تعداد فاکتور", rep_total: "جمع مبالغ", click_visit: "مشاهده نمونه کارها", rec_title: "رسید پرداخت",
        rec_cust: "مشتری", rec_wit: "شاهد", rec_rem: "مانده", rec_msg: "ممنون از اعتماد شما", notif_title: "هشدار اقساط", notif_msg: "۳ روز تا سررسید قسط",
        inv_cost: "قیمت خرید", out_of_stock: "متاسفیم! موجودی انبار تمام شده", mlabel: "برچسب‌ساز", invalid_phone: "شماره تماس نامعتبر است!",
        save_error: "خطا در ذخیره‌سازی!", h_title: "تاریخچه پرداخت", mclosing: "بستن صندوق", lupload: "بارگذاری مدرک", mvault: "صندوق نقد",
        edit_sale: "ویرایش", update: "بروزرسانی", confirm_del: "آیا از انتقال به زباله‌دان مطمئن هستید؟",
        success_save: "فروش با موفقیت ثبت شد", success_pay: "مبلغ دریافت شد!", success_inv: "انبار بروزرسانی شد", success_restore: "داده‌ها بازیابی شدند",
        doc_label: "مدارک مشتری", mcustomers: "مشتریان", mcurrency: "ارز", edit_receipt: "ویرایش رسید", save_changes: "ذخیره تغییرات",
        print_preview: "پیش‌نمایش چاپ", receipt_saved: "رسید ذخیره شد", add_customer: "افزودن مشتری", customer_saved: "مشتری ذخیره شد", customer_exists: "این مشتری قبلاً وجود دارد",
        currency_usd: "دلار آمریکا", currency_iqd: "دین عراق", currency_irr: "تومان ایران", currency_try: "لیر ترکیه",
        edit_receipt_note: "ویرایش کنید و ذخیره کنید", msecurity: "امنیت / رمز عبور", sec_title: "تنظیمات رمز عبور", sec_pass: "رمز عبور جدید", sec_save: "ذخیره تنظیمات",
        prot_inv: "محافظت از انبار", prot_edit: "محافظت از ویرایش", prot_ret: "محافظت از مرجوعی", prot_pay: "محافظت از دریافت وجه", prot_del: "محافظت از حذف",
        enter_pass: "لطفا رمز عبور را وارد کنید:", print_qr: "چاپ", net_profit: "سود خالص", pay_method: "روش پرداخت",
        m_expenses: "هزینه‌ها", m_suppliers: "تامین‌کنندگان", cash_in_box: "کل موجودی صندوق", th_desc: "توضیحات", th_amt: "مبلغ", th_date: "تاریخ", th_del: "حذف",
        btn_restore: "بازیابی", discount: "تخفیف", imei: "شماره سریال / IMEI", blacklist: "لیست سیاه", m_stocktake: "انبارگردانی", low_stock: "موجودی کم",
        err_blacklisted: "این مشتری در لیست سیاه است!", m_audit: "گزارش فعالیت", m_statement: "صورتحساب", btn_a4: "چاپ A4", contract_title: "قرارداد اقساطی",
        seller: "فروشنده", buyer: "خریدار", guarantor: "ضامن", m_guarantors: "ضامنین", m_commissions: "پورسانت‌ها", late_fee: "جریمه دیرکرد",
        exp_cat: "دسته‌بندی", cat_rent: "اجاره", cat_salary: "حقوق", cat_bills: "قبوض", cat_other: "سایر", comm_amt: "مبلغ پورسانت",
        auth_req: "رمز فعلی یا کد ادمین:", err_auth_req: "لطفا رمز فعلی یا کد را وارد کنید!", err_auth_fail: "رمز یا کد ادمین اشتباه است!"
    }
};

let currentRole = 'cashier';
let currentTab = 'signin';

// ==========================================
// 3. SECURITY & UTILS
// ==========================================

function escapeHTML(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag] || tag));
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : (type === 'danger' ? 'fa-circle-xmark' : 'fa-circle-info');
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
}

function logAction(actionName, details) {
    let id = Date.now();
    let logData = {
        id: id,
        user: currentUsername + " (" + currentUserRole + ")",
        action: actionName,
        details: details,
        time: new Date().toLocaleString(),
        timestamp: id
    };
    db.ref('/logs/' + id).set(logData);
}

function changeLoginLanguage() {
    document.getElementById('lang-sel').value = document.getElementById('login-lang-select').value;
    applyLang();
}

function syncLangFromPOS() {
    document.getElementById('login-lang-select').value = document.getElementById('lang-sel').value;
    applyLang();
}

function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');
    document.querySelectorAll('.form-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(`section-${tab}`).classList.add('active');
}

function selectRole(role) {
    currentRole = role;
    document.querySelectorAll('.role-option').forEach(opt => opt.classList.remove('selected'));
    document.getElementById(`role-${role}`).classList.add('selected');
}

function handleCodeInput(input, index) {
    const val = input.value;
    if (!/^\d*$/.test(val)) {
        input.value = '';
        return;
    }
    if (val && index < 5) {
        document.querySelector(`[data-index="${index + 1}"]`).focus();
    }
}

function handleCodeKeydown(event, index) {
    if (event.key === 'Backspace' && !event.target.value && index > 0) {
        document.querySelector(`[data-index="${index - 1}"]`).focus();
    }
}

function getEnteredCode() {
    const digits = document.querySelectorAll('.code-digit');
    return Array.from(digits).map(d => d.value).join('');
}

function openWhatsAppCode() {
    const lang = document.getElementById('login-lang-select').value;
    const msg = encodeURIComponent(translations[lang].waMsg);
    window.open(`https://wa.me/9647503644666?text=${msg}`, "_blank");
}

function handleSignUp() {
    const user = escapeHTML(document.getElementById('signup-user').value.trim());
    const pass = document.getElementById('signup-pass').value;
    const code = getEnteredCode();
    const l = translations[document.getElementById('login-lang-select').value];

    if (!user || !pass || code.length !== 6) {
        showToast(l.err_empty, 'danger');
        return;
    }

    if (pass.length < 6) {
        showToast("وشەیا نهێنی دڤێت لێ کێمتی ٦ پیت/ژمارە بن!", 'danger');
        return;
    }

    const email = user.toLowerCase() + "@bizharpos.com";
    const expectedRole = currentRole === 'admin' ? 'Admin' : 'Cashier';

    db.ref('activationCodes/' + code).once('value').then((snapshot) => {
        if (snapshot.exists()) {
            const codeData = snapshot.val();
            
            if (codeData.used === true) {
                showToast("ئەڤ کۆدە یێ هاتیە بکارئینان!", 'danger');
                document.querySelectorAll('.code-digit').forEach(d => d.value = '');
                return;
            }
            
            if (codeData.role !== expectedRole) {
                showToast("ئەڤ کۆدە بۆ ڤی جۆرێ حیسابێ نینە!", 'danger');
                return;
            }

            firebase.auth().createUserWithEmailAndPassword(email, pass)
                .then((userCredential) => {
                    const uid = userCredential.user.uid;
                    const updates = {};
                    updates['users/' + uid] = { username: user, role: expectedRole };
                    updates['activationCodes/' + code + '/used'] = true; 

                    db.ref().update(updates).then(() => {
                        showToast(l.succ_su, 'success');
                        setTimeout(() => {
                            document.getElementById('signin-user').value = user;
                            switchTab('signin');
                        }, 1500);
                    });
                })
                .catch((error) => {
                    if (error.code === 'auth/email-already-in-use') {
                        showToast(l.err_exists, 'danger');
                    } else {
                        showToast(error.message, 'danger');
                    }
                });

        } else {
            showToast(l.err_code, 'danger');
            document.querySelectorAll('.code-digit').forEach(d => d.value = '');
            document.querySelector('[data-index="0"]').focus();
        }
    }).catch((err) => {
        showToast("کێشە د هێلا ئینتەرنێتێ دا هەیە!", 'danger');
    });
}

function handleSignIn() {
    const user = escapeHTML(document.getElementById('signin-user').value.trim());
    const pass = document.getElementById('signin-pass').value;
    const l = translations[document.getElementById('login-lang-select').value];

    if (!user || !pass) {
        showToast(l.err_empty, 'danger');
        return;
    }

    const email = user.toLowerCase() + "@bizharpos.com";

    firebase.auth().signInWithEmailAndPassword(email, pass)
        .then((userCredential) => {
            const uid = userCredential.user.uid;
            db.ref('users/' + uid).once('value').then((snapshot) => {
                if (snapshot.exists()) {
                    currentUserRole = snapshot.val().role;
                    currentUsername = snapshot.val().username || user;
                    loginSuccess();
                } else {
                    showToast("زانیارییەکانی ئەم بەکارهێنەرە نەدۆزرایەوە!", 'danger');
                }
            });
        })
        .catch((error) => {
            showToast("ناو یان وشەی نهێنی هەڵەیە!", 'danger');
        });
}

function loginSuccess() {
    const l = translations[document.getElementById('login-lang-select').value];
    localStorage.setItem("bizhar_logged", "true");
    document.getElementById('login-wrapper').style.display = 'none';
    applyPermissions();
    logAction("LOGIN", "User logged into the system.");
    requestRender();
    showToast(l.succ_si, "success");
}

function togglePrivacy() {
    privacyHidden = !privacyHidden;
    render();
}
function toggleDark() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    const l = translations[document.getElementById('lang-sel').value];
    document.getElementById('m-dark').innerText = isDark ? l.mlight : l.mdark;
    document.getElementById('mode-icon').className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
    toggleMenu();
}

// ==========================================
// 4. MAIN POS LOGIC & SCALABLE DB SYNC
// ==========================================
let renderTimeout;

function requestRender() {
    clearTimeout(renderTimeout);
    renderTimeout = setTimeout(() => {
        render();
        if (isInventoryOpen) {
            showInventory();
        }
        checkInstallmentsNotif();
        updateCustomerDropdown();
    }, 200);
}

function syncNode(nodePath, arrayTarget, sortFunc = null) {
    db.ref(nodePath).on('child_added', snap => {
        const data = snap.val();
        if(!arrayTarget.find(x => x.id === data.id)) {
            arrayTarget.push(data);
            if(sortFunc) {
                arrayTarget.sort(sortFunc);
            }
        }
        requestRender();
    });

    db.ref(nodePath).on('child_changed', snap => {
        const data = snap.val();
        const idx = arrayTarget.findIndex(x => x.id === data.id);
        if (idx !== -1) {
            arrayTarget[idx] = data;
            if(sortFunc) {
                arrayTarget.sort(sortFunc);
            }
        }
        requestRender();
    });

    db.ref(nodePath).on('child_removed', snap => {
        const idx = arrayTarget.findIndex(x => x.id.toString() === snap.key);
        if (idx !== -1) {
            arrayTarget.splice(idx, 1);
        }
        requestRender();
    });
}

window.onload = () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            db.ref('users/' + user.uid).once('value').then((snapshot) => {
                if (snapshot.exists()) {
                    currentUserRole = snapshot.val().role || "Cashier";
                    currentUsername = snapshot.val().username || "User";
                    document.getElementById('login-wrapper').style.display = 'none';
                    applyPermissions();
                    requestRender();
                }
            });
        }
    });

    if (db) {
        const sortDesc = (a, b) => b.timestamp - a.timestamp;
        
        syncNode('i', inv);
        syncNode('s', sales, sortDesc);
        syncNode('a', archive, sortDesc);
        syncNode('t', trash);
        syncNode('r', reports, sortDesc);
        syncNode('c', customers);
        syncNode('e', expenses);
        syncNode('sup', suppliers);
        syncNode('logs', logs, sortDesc);
        syncNode('g', guarantors);
        syncNode('comm', commissions, sortDesc);

        db.ref('currency').on('value', snap => {
            if(snap.val()) {
                currentCurrency = snap.val();
                requestRender();
            }
        });

        db.ref('sec').on('value', snap => {
            if(snap.val()) {
                securitySettings = snap.val();
                requestRender();
            }
        });
    }

    loadCurrency();
    applyLang();
    toggleSaleMode();

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.customer-select')) {
            const d = document.getElementById('customer-dropdown');
            if (d) {
                d.classList.remove('show');
            }
        }
    });
};

function requireAuth(actionType, callback) {
    if (securitySettings.protectedSections && securitySettings.protectedSections.includes(actionType) && securitySettings.masterPass) {
        const l = translations[document.getElementById('lang-sel').value];
        const p = prompt(l.enter_pass);
        if (p === securitySettings.masterPass) {
            callback();
        } else {
            showToast("Access Denied! Incorrect Password", "danger");
            logAction("FAILED AUTH", "Attempted protected action: " + actionType);
        }
    } else {
        callback();
    }
}

function applyPermissions() {
    const adminMenu = document.getElementById('admin-only-menu');
    const adminFeatures = document.querySelectorAll('.admin-feature');
    
    if (currentUserRole === "Admin") {
        if (adminMenu) adminMenu.style.display = 'block';
        adminFeatures.forEach(el => el.style.display = 'block');
    } else {
        if (adminMenu) adminMenu.style.display = 'none';
        adminFeatures.forEach(el => el.style.display = 'none');
    }
}

function logout() {
    logAction("LOGOUT", "User logged out.");
    firebase.auth().signOut().then(() => {
        localStorage.removeItem("bizhar_logged");
        location.reload();
    });
}

function checkInvPass() {
    requireAuth('inv_add', () => {
        isInventoryOpen = true;
        showInventory();
    });
}

function deleteImage(url) {
    if (url && url.includes('firebasestorage')) {
        try {
            storage.refFromURL(url).delete().catch(e => console.log("Image delete handled silently"));
        } catch(e) {}
    }
}

function handleSearch() {
    render();
    if (isInventoryOpen) {
        showInventory();
    }
    
    const modalTitle = document.getElementById('modal-title');
    if (modalTitle) {
        const t = modalTitle.innerText;
        const l = translations[document.getElementById('lang-sel').value];
        if (t === l.marchive) {
            showArchive(true);
        }
        if (t === l.mtrash || t === "TRASH") {
            showRecycleBin(true);
        }
    }
}

function previewDoc(input) {
    if (input.files && input.files[0]) {
        if (input.files[0].size > 5 * 1024 * 1024) {
            showToast("File too large! Max 5MB", "danger");
            input.value = '';
            return;
        }
        currentDocFile = input.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.getElementById('doc-preview');
            img.src = e.target.result;
            img.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function toggleSaleMode() {
    const type = document.getElementById('i-sale-type').value;
    const instSec = document.getElementById('installments-details-section');
    const witSec = document.getElementById('witness-section');
    const monSec = document.getElementById('monthly-output-section');
    const downSec = document.getElementById('down-pay-section');

    if (type === 'Cash') {
        instSec.style.display = 'none';
        witSec.style.display = 'none';
        monSec.style.visibility = 'hidden';
        downSec.style.visibility = 'hidden';
        document.getElementById('i-down').value = '';
        document.getElementById('i-witness').value = '';
        document.getElementById('i-witness-phone').value = '';
    } else if (type === 'Debt') {
        instSec.style.display = 'none';
        witSec.style.display = 'none';
        monSec.style.visibility = 'hidden';
        downSec.style.visibility = 'visible';
        document.getElementById('i-witness').value = '';
        document.getElementById('i-witness-phone').value = '';
    } else {
        instSec.style.display = 'block';
        witSec.style.display = 'block';
        monSec.style.visibility = 'visible';
        downSec.style.visibility = 'visible';
    }
    calc();
}

function toggleOtherPlan() {
    const val = document.getElementById('i-months').value;
    document.getElementById('other-plan-section').style.display = (val === 'Other') ? 'block' : 'none';
    if (val !== 'Other') {
        document.getElementById('i-other-rate').value = '';
        document.getElementById('i-other-months').value = '';
    }
}

function calc() {
    const type = document.getElementById('i-sale-type').value;
    let b = Math.abs(parseFloat(document.getElementById('i-buy').value)) || 0;
    let discount = Math.abs(parseFloat(document.getElementById('i-discount').value)) || 0;
    let d = Math.abs(parseFloat(document.getElementById('i-down').value)) || 0;

    let priceAfterDiscount = Math.max(0, b - discount);

    if (type !== 'Installments' && d > priceAfterDiscount) {
        d = priceAfterDiscount;
        document.getElementById('i-down').value = priceAfterDiscount;
    }

    let total = priceAfterDiscount, mon = 0, m = 1;

    if (type === 'Installments') {
        let plan = document.getElementById('i-months').value;
        let rate = 0;
        if (plan === 'Other') {
            rate = (Math.abs(parseFloat(document.getElementById('i-other-rate').value)) || 0) / 100;
            m = Math.max(1, parseInt(document.getElementById('i-other-months').value) || 1);
        } else {
            let rates = { 2: 0.15, 3: 0.25, 4: 0.35, 6: 0.40, 8: 0.50, 10: 0.60, 12: 0.70, 16: 0.85 };
            m = parseInt(plan) || 1;
            rate = rates[m] || 0;
        }
        let rem = Math.max(0, priceAfterDiscount - d);
        total = Math.round((priceAfterDiscount + (rem * rate)) * 100) / 100;
        mon = Math.round(((total - d) / m) * 100) / 100;
    } else if (type === 'Debt') {
        total = priceAfterDiscount;
        mon = Math.max(0, priceAfterDiscount - d);
        m = 1;
    } else {
        total = priceAfterDiscount;
        mon = 0;
        m = 1;
    }

    document.getElementById('o-mon').innerText = currentCurrency.symbol + (mon > 0 ? mon.toFixed(2) : 0);
    document.getElementById('o-total').innerText = currentCurrency.symbol + total.toFixed(2);
    
    return { 
        total: Number(total.toFixed(2)), 
        mon: Number(mon.toFixed(2)), 
        b: Number(b.toFixed(2)), 
        discount: Number(discount.toFixed(2)), 
        d: Number(d.toFixed(2)), 
        m: m 
    };
}

function showCustomerList() {
    document.getElementById('customer-dropdown').classList.add('show');
    filterCustomers();
}

function filterCustomers() {
    const input = document.getElementById('i-name');
    const dropdown = document.getElementById('customer-dropdown');
    const term = input.value.toLowerCase();
    const l = translations[document.getElementById('lang-sel').value];
    
    const filtered = customers.filter(c => c.name.toLowerCase().includes(term));
    
    if (filtered.length === 0) {
        dropdown.innerHTML = `
        <div class="customer-item" onclick="addNewCustomer()">
            <i class="fa-solid fa-plus"></i> ${l.add_customer}
        </div>`;
    } else {
        dropdown.innerHTML = filtered.map(c => `
        <div class="customer-item" onclick="selectCustomer('${escapeHTML(c.name)}', '${escapeHTML(c.phone)}')">
            <span style="color:${c.blacklist ? 'var(--danger)' : 'inherit'}">${escapeHTML(c.name)} - ${escapeHTML(c.phone)} ${c.blacklist ? '(Blacklist)' : ''}</span>
        </div>`).join('');
    }
}

function selectCustomer(name, phone) {
    document.getElementById('i-name').value = name;
    document.getElementById('i-phone').value = phone;
    document.getElementById('customer-dropdown').classList.remove('show');
}

function addNewCustomer() {
    const name = escapeHTML(document.getElementById('i-name').value.trim());
    const phone = escapeHTML(document.getElementById('i-phone').value.trim());
    const l = translations[document.getElementById('lang-sel').value];
    
    if (!name || !phone) { 
        showToast("Enter name and phone first!", "warning"); 
        return; 
    }
    
    if (customers.find(c => c.phone === phone)) { 
        showToast(l.customer_exists, "warning"); 
        return; 
    }
    
    let custId = Date.now();
    let updates = {};
    updates['/c/' + custId] = { name, phone, id: custId, blacklist: false };
    
    db.ref().update(updates).then(() => {
        showToast(l.customer_saved, "success");
        logAction("ADD CUSTOMER", "Added new customer: " + name);
        document.getElementById('customer-dropdown').classList.remove('show');
    });
}

function updateCustomerDropdown() {
    filterCustomers();
}

function showCustomers() {
    const l = translations[document.getElementById('lang-sel').value];
    document.getElementById('modal-title').innerText = l.mcustomers;
    
    document.getElementById('modal-content').innerHTML = `
    <div class="card" style="margin-bottom:15px;">
        <input type="text" id="new-cust-name" placeholder="${l.lname}">
        <input type="tel" id="new-cust-phone" placeholder="${l.lphone}" style="margin-top:10px;">
        <button class="main-btn" onclick="saveNewCustomerModal()">
            <i class="fa-solid fa-plus"></i> ${l.add_customer}
        </button>
    </div>
    <div class="table-wrap">
        <table>
            <thead>
                <tr>
                    <th>${l.lname}</th>
                    <th>${l.lphone}</th>
                    <th>${l.blacklist || 'Blacklist'}</th>
                    <th>${l.th5}</th>
                </tr>
            </thead>
            <tbody>
                ${customers.map(c => `
                <tr>
                    <td style="color:${c.blacklist ? 'var(--danger)' : 'var(--text)'}; font-weight:bold;">${escapeHTML(c.name)}</td>
                    <td>${escapeHTML(c.phone)}</td>
                    <td>
                        <button onclick="toggleBlacklist(${c.id}, ${c.blacklist || false})" class="btn-sm" style="background:${c.blacklist ? 'var(--danger)' : '#475569'}; width:auto; padding:0 15px;">
                            ${c.blacklist ? '<i class="fa-solid fa-ban"></i>' : '<i class="fa-solid fa-check"></i>'}
                        </button>
                    </td>
                    <td>
                        <button onclick="showCustomerStatement('${escapeHTML(c.phone)}')" class="btn-sm" style="background:var(--primary); width:auto; padding:0 10px;">
                            <i class="fa-solid fa-file-invoice"></i> ${l.m_statement}
                        </button>
                        <button onclick="deleteCustomer(${c.id})" class="btn-sm" style="background:var(--danger);">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>`).join('')}
            </tbody>
        </table>
    </div>`;
    
    document.getElementById('modal-universal').style.display = 'flex';
    toggleMenu();
}

function showCustomerStatement(phone) {
    const l = translations[document.getElementById('lang-sel').value];
    document.getElementById('modal-title').innerText = l.m_statement || "Customer Statement";
    
    let cCust = customers.find(c => c.phone === phone);
    let cSales = sales.filter(s => s.phone === phone);
    let cArch = archive.filter(s => s.phone === phone);
    let all = [...cSales, ...cArch];
    
    if (!cCust) return;
    
    let totalBought = 0, totalPaid = 0;
    
    let statementHtml = `
        <div class="statement-header">
            <h3>${escapeHTML(cCust.name)}</h3>
            <p>${escapeHTML(cCust.phone)}</p>
        </div>
        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Item</th>
                        <th>Type</th>
                        <th>Total</th>
                        <th>Paid</th>
                        <th>Rem</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    all.forEach(s => {
        totalBought += parseFloat(s.total);
        let sPaid = 0;
        
        if(s.type === 'Debt') {
            sPaid = parseFloat(s.total) - parseFloat(s.mon);
        } else if (s.type === 'Cash') {
            sPaid = parseFloat(s.total);
        } else {
            sPaid = parseFloat(s.down) + (parseFloat(s.mon) * parseInt(s.paid || 0));
        }
        
        totalPaid += sPaid;
        let sRem = parseFloat(s.total) - sPaid;
        
        statementHtml += `
            <tr>
                <td><small>${new Date(s.timestamp).toLocaleDateString()}</small></td>
                <td>${escapeHTML(s.item)}</td>
                <td>${s.type}</td>
                <td>${currentCurrency.symbol}${s.total}</td>
                <td style="color:var(--success);">${currentCurrency.symbol}${sPaid.toFixed(2)}</td>
                <td style="color:var(--danger);">${currentCurrency.symbol}${sRem.toFixed(2)}</td>
            </tr>
        `;
    });
    
    let totalRem = totalBought - totalPaid;
    statementHtml += `</tbody></table></div>`;
    
    let summaryHtml = `
    <div style="display:flex; justify-content:space-around; margin-top:20px; background:var(--bg); padding:15px; border-radius:15px; border:2px solid var(--primary);">
        <div style="text-align:center;">
            <b>Total Bought</b><br>
            <span style="font-size:1.2rem;">${currentCurrency.symbol}${totalBought.toFixed(2)}</span>
        </div>
        <div style="text-align:center; color:var(--success);">
            <b>Total Paid</b><br>
            <span style="font-size:1.2rem;">${currentCurrency.symbol}${totalPaid.toFixed(2)}</span>
        </div>
        <div style="text-align:center; color:var(--danger);">
            <b>Remaining</b><br>
            <span style="font-size:1.2rem;">${currentCurrency.symbol}${totalRem.toFixed(2)}</span>
        </div>
    </div>`;
    
    document.getElementById('modal-content').innerHTML = statementHtml + summaryHtml;
}

function toggleBlacklist(id, currentStatus) {
    if (confirm("Are you sure you want to change the blacklist status?")) {
        db.ref('/c/' + id + '/blacklist').set(!currentStatus).then(() => {
            logAction("BLACKLIST TOGGLE", "Changed blacklist status for customer ID: " + id);
            showToast("Customer status updated!", "success"); 
            showCustomers(); 
        });
    }
}

function saveNewCustomerModal() {
    const name = escapeHTML(document.getElementById('new-cust-name').value.trim());
    const phone = escapeHTML(document.getElementById('new-cust-phone').value.trim());
    const l = translations[document.getElementById('lang-sel').value];
    
    if (!name || !phone) { 
        showToast("Fill all fields!", "warning"); 
        return; 
    }
    
    if (customers.find(c => c.phone === phone)) { 
        showToast(l.customer_exists, "warning"); 
        return; 
    }
    
    let custId = Date.now();
    db.ref().update({ ['/c/' + custId]: { name, phone, id: custId, blacklist: false } }).then(() => {
        logAction("ADD CUSTOMER", "Added new customer: " + name);
        showToast(l.customer_saved, "success");
        showCustomers();
    });
}

function deleteCustomer(id) {
    if (confirm("Delete customer?")) {
        db.ref('/c/' + id).remove().then(() => { 
            logAction("DELETE CUSTOMER", "Deleted customer ID: " + id); 
            showToast("Deleted!", "success"); 
            showCustomers(); 
        });
    }
}

function showGuarantors() {
    const l = translations[document.getElementById('lang-sel').value];
    document.getElementById('modal-title').innerText = l.m_guarantors;
    
    document.getElementById('modal-content').innerHTML = `
    <div class="card" style="margin-bottom:15px; border-left: 5px solid var(--primary);">
        <input type="text" id="new-g-name" placeholder="${l.lname}">
        <input type="tel" id="new-g-phone" placeholder="${l.lphone}" style="margin-top:10px;">
        <button class="main-btn" onclick="saveNewGuarantor()">
            <i class="fa-solid fa-plus"></i> Add Guarantor
        </button>
    </div>
    <div class="table-wrap">
        <table>
            <thead>
                <tr>
                    <th>${l.lname}</th>
                    <th>${l.lphone}</th>
                    <th>Linked Sales</th>
                    <th>${l.th_del}</th>
                </tr>
            </thead>
            <tbody>
                ${guarantors.map(g => {
                    let linked = sales.filter(s => s.witnessPhone === g.phone).length;
                    return `
                    <tr>
                        <td><b>${escapeHTML(g.name)}</b></td>
                        <td>${escapeHTML(g.phone)}</td>
                        <td style="color:${linked > 2 ? 'var(--danger)' : 'var(--success)'}; font-weight:bold;">${linked} Active</td>
                        <td>
                            <button onclick="deleteGuarantor(${g.id})" class="btn-sm" style="background:var(--danger);">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    </tr>`;
                }).join('')}
            </tbody>
        </table>
    </div>`;
    
    document.getElementById('modal-universal').style.display = 'flex';
    toggleMenu();
}

function saveNewGuarantor() {
    const name = escapeHTML(document.getElementById('new-g-name').value.trim());
    const phone = escapeHTML(document.getElementById('new-g-phone').value.trim());
    
    if (!name || !phone) { 
        showToast("Fill all fields!", "warning"); 
        return; 
    }
    
    if (guarantors.find(g => g.phone === phone)) { 
        showToast("Guarantor already exists!", "warning"); 
        return; 
    }
    
    let gId = Date.now();
    db.ref().update({ ['/g/' + gId]: { name, phone, id: gId } }).then(() => {
        logAction("ADD GUARANTOR", "Added guarantor: " + name);
        showToast("Guarantor Saved", "success");
        showGuarantors();
    });
}

function deleteGuarantor(id) {
    if (confirm("Delete guarantor?")) {
        db.ref('/g/' + id).remove().then(() => { 
            logAction("DELETE GUARANTOR", "Deleted ID: " + id); 
            showToast("Deleted!", "success"); 
            showGuarantors(); 
        });
    }
}

function showAuditLog() {
    requireAuth('inv_add', () => { 
        const l = translations[document.getElementById('lang-sel').value];
        document.getElementById('modal-title').innerText = l.m_audit || "Audit Log";
        
        let html = `<div style="background:var(--bg); border-radius:15px; padding:15px; max-height:60vh; overflow-y:auto;">`;
        if(logs.length === 0) {
            html += `<p style="text-align:center;">No activity recorded yet.</p>`;
        } else {
            logs.forEach(log => {
                html += `
                <div class="audit-item">
                    <div>
                        <b style="color:var(--primary);">${log.action}</b> 
                        <span class="audit-user">${escapeHTML(log.user)}</span><br>
                        <small>${escapeHTML(log.details)}</small>
                    </div>
                    <div class="audit-time">${log.time}</div>
                </div>`;
            });
        }
        html += `</div>`;
        
        document.getElementById('modal-content').innerHTML = html;
        document.getElementById('modal-universal').style.display = 'flex';
        toggleMenu();
    });
}

function loadCurrency() {
    const saved = localStorage.getItem('pos_currency');
    if (saved) {
        currentCurrency = JSON.parse(saved);
    }
}

function showCurrencySettings() {
    const l = translations[document.getElementById('lang-sel').value];
    document.getElementById('modal-title').innerText = l.mcurrency;
    
    document.getElementById('modal-content').innerHTML = `
    <div class="card">
        <label style="font-weight:700;">Select Currency</label>
        <select id="currency-select" onchange="changeCurrency()">
            <option value="USD" ${currentCurrency.code === 'USD' ? 'selected' : ''}>${l.currency_usd} (USD) - $</option>
            <option value="IQD" ${currentCurrency.code === 'IQD' ? 'selected' : ''}>${l.currency_iqd} (IQD) - د.ع</option>
            <option value="IRR" ${currentCurrency.code === 'IRR' ? 'selected' : ''}>${l.currency_irr || 'تومان'} (IRR) - تومان</option>
            <option value="TRY" ${currentCurrency.code === 'TRY' ? 'selected' : ''}>${l.currency_try} (TRY) - ₺</option>
        </select>
        
        <label style="font-weight:700; margin-top:15px; display:block;">Exchange Rate (to USD)</label>
        <input type="number" id="currency-rate" value="${currentCurrency.rate}" step="0.01" placeholder="1.0">
        
        <button class="main-btn" onclick="saveCurrency()">
            <i class="fa-solid fa-save"></i> Save
        </button>
    </div>`;
    
    document.getElementById('modal-universal').style.display = 'flex';
    toggleMenu();
}
function changeCurrency() {
    const code = document.getElementById('currency-select').value;
    const rates = { USD: 1, IQD: 1450, IRR: 50000, TRY: 30 };
    document.getElementById('currency-rate').value = rates[code];
}

function saveCurrency() {
    const code = document.getElementById('currency-select').value;
    const rate = parseFloat(document.getElementById('currency-rate').value) || 1;
    const symbols = { USD: '$', IQD: 'د.ع', IRR: 'تومان', TRY: '₺' };
    
    currentCurrency = { code, rate, symbol: symbols[code] };
    localStorage.setItem('pos_currency', JSON.stringify(currentCurrency));
    
    db.ref('/currency').set(currentCurrency).then(() => {
        logAction("CURRENCY CHANGED", "Currency set to " + code);
        showToast("Currency updated!", "success");
        closeModal();
    });
}

function showSecuritySettings() {
    const l = translations[document.getElementById('lang-sel').value];
    document.getElementById('modal-title').innerText = l.sec_title;
    
    let html = `
    <div class="card">
        `;
        
    if (securitySettings.masterPass) {
        html += `
        <label style="font-weight:700; color:var(--danger);">${l.auth_req || 'Current Pass or Admin Code (to change):'}</label>
        <input type="password" id="sec-auth-input" placeholder="Current Pass OR 6-digit Code" style="border-color:var(--danger); margin-bottom:15px;">
        `;
    }
        
    html += `
        <label style="font-weight:700;">${l.sec_pass}</label>
        <input type="password" id="sec-master-pass" placeholder="Leave empty to remove password">
        
        <label style="font-weight:700; margin-top:20px; display:block;">Select Protected Actions:</label>
        <div style="display:flex; flex-direction:column; gap:10px; margin-top:10px;">
            <label><input type="checkbox" id="chk-inv_add" ${securitySettings.protectedSections.includes('inv_add') ? 'checked' : ''}> ${l.prot_inv}</label>
            <label><input type="checkbox" id="chk-sale_edit" ${securitySettings.protectedSections.includes('sale_edit') ? 'checked' : ''}> ${l.prot_edit}</label>
            <label><input type="checkbox" id="chk-sale_return" ${securitySettings.protectedSections.includes('sale_return') ? 'checked' : ''}> ${l.prot_ret}</label>
            <label><input type="checkbox" id="chk-pay_receive" ${securitySettings.protectedSections.includes('pay_receive') ? 'checked' : ''}> ${l.prot_pay}</label>
            <label><input type="checkbox" id="chk-trash_delete" ${securitySettings.protectedSections.includes('trash_delete') ? 'checked' : ''}> ${l.prot_del}</label>
        </div>
        
        <button class="main-btn" onclick="saveSecuritySettings()">
            <i class="fa-solid fa-save"></i> ${l.sec_save}
        </button>
    </div>`;
    
    document.getElementById('modal-content').innerHTML = html;
    document.getElementById('modal-universal').style.display = 'flex';
    toggleMenu();
}

function saveSecuritySettings() {
    const l = translations[document.getElementById('lang-sel').value];
    const newPass = document.getElementById('sec-master-pass').value.trim();
    const authInput = document.getElementById('sec-auth-input') ? document.getElementById('sec-auth-input').value.trim() : '';
    
    const chks = ['inv_add', 'sale_edit', 'sale_return', 'pay_receive', 'trash_delete'];
    let newProtected = [];
    
    chks.forEach(chk => {
        if (document.getElementById(`chk-${chk}`).checked) {
            newProtected.push(chk);
        }
    });

    if (securitySettings.masterPass) {
        if (!authInput) {
            showToast(l.err_auth_req || "Please provide current password or Admin code!", "danger");
            return;
        }
        
        if (authInput === securitySettings.masterPass) {
            executeSaveSec(newPass, newProtected);
        } else if (authInput.length === 6) {
            db.ref('activationCodes/' + authInput).once('value').then(snap => {
                if (snap.exists() && snap.val().role === 'Admin') {
                    executeSaveSec(newPass, newProtected);
                } else {
                    showToast(l.err_auth_fail || "Invalid Password or Admin Code!", "danger");
                }
            }).catch(() => {
                showToast("Error checking code!", "danger");
            });
        } else {
            showToast(l.err_auth_fail || "Invalid Password or Admin Code!", "danger");
        }
    } else {
        executeSaveSec(newPass, newProtected);
    }
}

function executeSaveSec(newPass, newProtected) {
    db.ref('/sec').set({ masterPass: newPass, protectedSections: newProtected }).then(() => {
        logAction("SECURITY SETTINGS", "Updated security and passwords");
        showToast("Security Settings Saved!", "success");
        closeModal();
    });
}

function showExpenses() {
    const l = translations[document.getElementById('lang-sel').value];
    document.getElementById('modal-title').innerText = l.m_expenses;
    let totalExp = expenses.reduce((a, b) => a + parseFloat(b.amount), 0);
    
    document.getElementById('modal-content').innerHTML = `
    <div class="card" style="margin-bottom:15px; border-left: 5px solid var(--danger);">
        <select id="exp-cat" style="margin-bottom:10px;">
            <option value="${l.cat_rent}">${l.cat_rent}</option>
            <option value="${l.cat_salary}">${l.cat_salary}</option>
            <option value="${l.cat_bills}">${l.cat_bills}</option>
            <option value="${l.cat_other}">${l.cat_other}</option>
        </select>
        <input type="text" id="exp-desc" placeholder="${l.th_desc}...">
        <input type="number" id="exp-amount" placeholder="${l.th_amt}..." min="0" step="0.01" style="margin-top:10px;">
        <button class="main-btn danger" onclick="addExpense()" style="margin-top:15px;">
            <i class="fa-solid fa-plus"></i> ${l.inv_add}
        </button>
    </div>
    <div style="text-align:center; padding:15px; background:var(--bg); border-radius:15px; margin-bottom:15px; border: 2px solid var(--danger);">
        <b style="color:var(--danger); font-size: 1.2rem;">${l.m_expenses}: ${currentCurrency.symbol}${totalExp.toFixed(2)}</b>
    </div>
    <div class="table-wrap">
        <table>
            <thead>
                <tr>
                    <th>${l.exp_cat}</th>
                    <th>${l.th_desc}</th>
                    <th>${l.th_amt}</th>
                    <th>${l.th_date}</th>
                    <th>${l.th_del}</th>
                </tr>
            </thead>
            <tbody>
                ${expenses.map(x => `
                <tr>
                    <td><small style="background:var(--danger); color:white; padding:2px 5px; border-radius:5px;">${escapeHTML(x.cat || l.cat_other)}</small></td>
                    <td>${escapeHTML(x.desc)}</td>
                    <td style="color:var(--danger); font-weight:bold;">${currentCurrency.symbol}${x.amount}</td>
                    <td>${x.date}</td>
                    <td>
                        <button onclick="deleteExpense(${x.id})" class="btn-sm" style="background:var(--danger);">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>`).join('')}
            </tbody>
        </table>
    </div>`;
    
    document.getElementById('modal-universal').style.display = 'flex';
    toggleMenu();
}

function addExpense() {
    let cat = document.getElementById('exp-cat').value;
    let desc = escapeHTML(document.getElementById('exp-desc').value.trim());
    let amount = parseFloat(document.getElementById('exp-amount').value);
    
    if (!desc || !amount) {
        showToast("Error", "danger");
        return;
    }
    
    let id = Date.now();
    db.ref().update({ 
        [`/e/${id}`]: { id: id, cat: cat, desc: desc, amount: amount, date: new Date().toLocaleDateString() } 
    }).then(() => {
        logAction("ADD EXPENSE", "Cat: " + cat + " | Amt: " + amount + " | " + desc);
        showToast("Success", "success");
        showExpenses();
    });
}

function deleteExpense(id) {
    if (confirm("Delete?")) {
        db.ref('/e/' + id).remove().then(() => {
            logAction("DELETE EXPENSE", "ID: " + id);
            showToast("Deleted!", "success");
            showExpenses();
        });
    }
}

function showSuppliers() {
    const l = translations[document.getElementById('lang-sel').value];
    document.getElementById('modal-title').innerText = l.m_suppliers;
    
    document.getElementById('modal-content').innerHTML = `
    <div class="card" style="margin-bottom:15px;">
        <input type="text" id="sup-name" placeholder="${l.lname}...">
        <input type="tel" id="sup-phone" placeholder="${l.lphone}..." style="margin-top:10px;">
        <button class="main-btn" onclick="addSupplier()" style="margin-top:15px;">
            <i class="fa-solid fa-plus"></i> ${l.inv_add}
        </button>
    </div>
    <div class="table-wrap">
        <table>
            <thead>
                <tr>
                    <th>${l.lname}</th>
                    <th>${l.lphone}</th>
                    <th>${l.th_del}</th>
                </tr>
            </thead>
            <tbody>
                ${suppliers.map(x => `
                <tr>
                    <td>${escapeHTML(x.name)}</td>
                    <td>${escapeHTML(x.phone)}</td>
                    <td>
                        <button onclick="deleteSupplier(${x.id})" class="btn-sm" style="background:var(--danger);">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>`).join('')}
            </tbody>
        </table>
    </div>`;
    
    document.getElementById('modal-universal').style.display = 'flex';
    toggleMenu();
}

function addSupplier() {
    let name = escapeHTML(document.getElementById('sup-name').value.trim());
    let phone = escapeHTML(document.getElementById('sup-phone').value.trim());
    
    if (!name) {
        showToast("Error", "danger");
        return;
    }
    
    let id = Date.now();
    db.ref().update({ 
        [`/sup/${id}`]: { id: id, name: name, phone: phone } 
    }).then(() => {
        logAction("ADD SUPPLIER", "Name: " + name);
        showToast("Success", "success");
        showSuppliers();
    });
}

function deleteSupplier(id) {
    if (confirm("Delete?")) {
        db.ref('/sup/' + id).remove().then(() => {
            logAction("DELETE SUPPLIER", "ID: " + id);
            showToast("Deleted!", "success");
            showSuppliers();
        });
    }
}

// COMMISSIONS MANAGEMENT 
function showCommissions() {
    const l = translations[document.getElementById('lang-sel').value];
    document.getElementById('modal-title').innerText = l.m_commissions;
    
    let userTotals = {};
    commissions.forEach(c => {
        if(!userTotals[c.user]) {
            userTotals[c.user] = 0;
        }
        userTotals[c.user] += parseFloat(c.amount);
    });

    let summaryHtml = `<div style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:15px;">`;
    for (let u in userTotals) {
        summaryHtml += `
        <div class="rep-stat" style="flex:1;">
            <small>${u}</small>
            <h3 style="color:var(--success);">${currentCurrency.symbol}${userTotals[u].toFixed(2)}</h3>
        </div>`;
    }
    summaryHtml += `</div>`;

    document.getElementById('modal-content').innerHTML = `
    ${summaryHtml}
    <div class="table-wrap">
        <table>
            <thead>
                <tr>
                    <th>User</th>
                    <th>Sale ID</th>
                    <th>${l.comm_amt}</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                ${commissions.map(c => `
                <tr>
                    <td><b>${escapeHTML(c.user)}</b></td>
                    <td><small>${c.saleId}</small></td>
                    <td style="color:var(--success); font-weight:bold;">${currentCurrency.symbol}${parseFloat(c.amount).toFixed(2)}</td>
                    <td>${c.date}</td>
                </tr>`).join('')}
            </tbody>
        </table>
    </div>`;
    
    document.getElementById('modal-universal').style.display = 'flex';
    toggleMenu();
}

async function saveSale() {
    let n = escapeHTML(document.getElementById('i-name').value.trim());
    let phone = escapeHTML(document.getElementById('i-phone').value.trim());
    let wit = escapeHTML(document.getElementById('i-witness').value.trim());
    let witPhone = escapeHTML(document.getElementById('i-witness-phone').value.trim());
    let iId = document.getElementById('i-item').value;
    let nt = escapeHTML(document.getElementById('i-note').value);
    let saleType = document.getElementById('i-sale-type').value;
    let paymentMethod = document.getElementById('i-payment-method').value;
    let imeiVal = escapeHTML(document.getElementById('i-imei').value.trim());
    const l = translations[document.getElementById('lang-sel').value];

    let existingCustomer = customers.find(c => c.phone === phone);
    if (existingCustomer && existingCustomer.blacklist && saleType !== 'Cash') {
        showToast(l.err_blacklisted || "Customer is blacklisted!", "danger");
        return;
    }

    if (!n || !iId) {
        showToast(l.err_empty, "danger");
        return;
    }
    
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
        showToast(l.invalid_phone, "danger");
        return;
    }
    
    if (saleType === 'Installments' && !phoneRegex.test(witPhone)) {
        showToast(l.invalid_phone, "danger");
        return;
    }

    let idx = inv.findIndex(x => x.id == iId || x.name == iId || x.barcode == iId);
    if (idx === -1 || inv[idx].qty <= 0) {
        showToast(l.out_of_stock, "danger");
        return;
    }

    const saveBtn = document.getElementById('save-sale-btn');
    const originalBtnContent = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = `<div class="spinner"></div> UPLOADING...`;

    let docUrl = "";
    if (currentDocFile) {
        try {
            const storageRef = storage.ref(`documents/${Date.now()}_${currentDocFile.name}`);
            const snapshot = await storageRef.put(currentDocFile);
            docUrl = await snapshot.ref.getDownloadURL();
        } catch (e) {
            showToast("Image Upload Failed! Please check internet", "danger");
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalBtnContent;
            return;
        }
    }

    let p = calc();
    let itemFullData = JSON.parse(JSON.stringify(inv[idx]));

    const now = new Date();
    const saleId = Date.now();
    
    const saleData = {
        id: saleId,
        name: n,
        phone: phone,
        customerDoc: docUrl,
        witness: (saleType === 'Cash' || saleType === 'Debt' ? 'N/A' : wit),
        witnessPhone: (saleType === 'Cash' || saleType === 'Debt' ? 'N/A' : witPhone),
        item: itemFullData.name,
        itemId: itemFullData.id,
        itemDetails: itemFullData,
        imei: imeiVal,
        total: p.total,
        buy: p.b,
        discount: p.discount,
        cost: Number(parseFloat(itemFullData.cost || 0).toFixed(2)),
        down: p.d,
        mon: p.mon,
        months: p.m,
        paid: 0,
        date: now.toLocaleString(),
        lastPaymentDate: now.getTime(),
        timestamp: now.getTime(),
        note: nt,
        type: saleType,
        paymentMethod: paymentMethod,
        paymentsHistory: [],
        currency: currentCurrency.code
    };

    let itemRef = db.ref('/i/' + itemFullData.id + '/qty');
    itemRef.transaction(function(currentQty) {
        if (currentQty === null) return 0;
        if (currentQty <= 0) return undefined;
        return currentQty - 1;
    }, function(error, committed, snapshot) {
        if (error || !committed) {
            if (docUrl) deleteImage(docUrl); 
            showToast(l.out_of_stock, "danger");
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalBtnContent;
        } else {
            let updates = {};
            if (saleType === 'Cash') {
                updates['/a/' + saleId] = saleData;
            } else {
                updates['/s/' + saleId] = saleData;
            }

            if (!customers.find(c => c.phone === phone)) {
                updates['/c/' + saleId] = { name: n, phone, id: saleId, blacklist: false };
            }
            
            if (witPhone && saleType === 'Installments' && !guarantors.find(g => g.phone === witPhone)) {
                updates['/g/' + saleId] = { name: wit, phone: witPhone, id: saleId };
            }

            // Simple Commission: 1% of total collected today (down payment or full cash)
            let commAmt = saleType === 'Cash' ? p.total * 0.01 : p.d * 0.01;
            if (commAmt > 0) {
                updates['/comm/' + saleId] = { 
                    id: saleId, 
                    user: currentUsername, 
                    saleId: saleId, 
                    amount: commAmt.toFixed(2), 
                    date: now.toLocaleDateString(), 
                    timestamp: now.getTime() 
                };
            }

            db.ref().update(updates).then(() => {
                logAction("NEW SALE", "Customer: " + n + " | Item: " + itemFullData.name + " | Type: " + saleType);
                saveBtn.disabled = false;
                saveBtn.innerHTML = originalBtnContent;
                showToast(l.success_save, "success");
                
                ["i-name", "i-phone", "i-witness", "i-witness-phone", "i-note", "i-buy", "i-down", "i-other-rate", "i-other-months", "i-imei", "i-discount"].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.value = "";
                });
                
                const docPreview = document.getElementById('doc-preview');
                if (docPreview) {
                    docPreview.style.display = 'none';
                    docPreview.src = "";
                }
                currentDocFile = null;
                calc();
                applyLang();
            }).catch(() => {
                if (docUrl) deleteImage(docUrl); 
                showToast(l.save_error, "danger");
                saveBtn.disabled = false;
                saveBtn.innerHTML = originalBtnContent;
            });
        }
    });
}

function editSale(id) {
    requireAuth('sale_edit', () => {
        const s = sales.find(x => x.id === id) || archive.find(x => x.id === id);
        if (!s) return;
        
        const l = translations[document.getElementById('lang-sel').value];
        document.getElementById('modal-title').innerText = l.edit_sale;
        document.getElementById('modal-content').innerHTML = `
            <div class="card">
                <label style="font-weight:700;">${l.lname}</label>
                <input type="text" id="edit-name" value="${escapeHTML(s.name)}">
                
                <label style="font-weight:700; margin-top:15px; display:block;">${l.lphone}</label>
                <input type="tel" id="edit-phone" value="${escapeHTML(s.phone)}">
                
                ${s.type === 'Installments' ? `
                    <label style="font-weight:700; margin-top:15px; display:block;">${l.lwitness}</label>
                    <input type="text" id="edit-witness" value="${escapeHTML(s.witness)}">
                    <label style="font-weight:700; margin-top:15px; display:block;">${l.lwphone}</label>
                    <input type="tel" id="edit-witphone" value="${escapeHTML(s.witnessPhone)}">
                ` : ''}
                
                <label style="font-weight:700; margin-top:15px; display:block;">${l.lnote}</label>
                <textarea id="edit-note" rows="2">${escapeHTML(s.note || "")}</textarea>
                
                <button class="main-btn" onclick="updateSale(${s.id})">
                    <i class="fa-solid fa-check-double"></i> ${l.update}
                </button>
            </div>`;
        
        document.getElementById('modal-universal').style.display = 'flex';
    });
}

function updateSale(id) {
    let sIdx = sales.findIndex(x => x.id === id);
    let aIdx = archive.findIndex(x => x.id === id);
    
    let target = sIdx !== -1 ? sales[sIdx] : archive[aIdx];
    let path = sIdx !== -1 ? `/s/${id}` : `/a/${id}`;
    
    if (!target) return;
    
    let updates = {};
    updates[`${path}/name`] = escapeHTML(document.getElementById('edit-name').value);
    updates[`${path}/phone`] = escapeHTML(document.getElementById('edit-phone').value);
    updates[`${path}/note`] = escapeHTML(document.getElementById('edit-note').value);
    
    if (target.type === 'Installments') {
        updates[`${path}/witness`] = escapeHTML(document.getElementById('edit-witness').value);
        updates[`${path}/witnessPhone`] = escapeHTML(document.getElementById('edit-witphone').value);
    }
    
    db.ref().update(updates).then(() => {
        logAction("EDIT SALE", "Edited sale ID: " + id);
        showToast("Updated!", "success");
        closeModal();
    });
}

function returnSale(id) {
    requireAuth('sale_return', () => {
        let sIdx = sales.findIndex(x => x.id === id);
        let aIdx = archive.findIndex(x => x.id === id);
        let saleItem = sIdx !== -1 ? sales[sIdx] : archive[aIdx];
        
        if (!saleItem) return;
        
        if (confirm(`ئایا دڵنیای لە گەڕاندنەوەی: ${saleItem.item} ؟`)) {
            let updates = {};
            let invIdx = inv.findIndex(x => x.id == saleItem.itemId);
            
            if (invIdx !== -1) {
                updates[`/i/${saleItem.itemId}/qty`] = inv[invIdx].qty + 1;
            }
            
            let refundAmount = parseFloat(saleItem.down) + (parseFloat(saleItem.mon) * parseInt(saleItem.paid || 0));
            if (saleItem.type === 'Debt') {
                refundAmount = parseFloat(saleItem.total) - parseFloat(saleItem.mon);
            }
            
            let expId = Date.now();
            updates[`/e/${expId}`] = {
                id: expId,
                cat: 'Refunds',
                desc: `گەڕاندنەوەی کاڵا: ${saleItem.item} - ${saleItem.name}`,
                amount: refundAmount,
                date: new Date().toLocaleDateString()
            };

            reports.forEach(r => {
                if (r.saleId === id || (r.name === saleItem.name && r.item === saleItem.item)) {
                    updates[`/r/${r.id}`] = null;
                }
            });

            if(saleItem.customerDoc) {
                deleteImage(saleItem.customerDoc);
            }
            
            if (sIdx !== -1) { 
                updates[`/s/${id}`] = null; 
            } else {
                updates[`/a/${id}`] = null; 
            }
            
            db.ref().update(updates).then(() => {
                logAction("RETURN SALE", "Returned item: " + saleItem.item + " for " + saleItem.name);
                showToast("کاڵا گەڕێنرایەوە بۆ مەخزەن و پارە خرایە خەرجییەکان", "success");
            });
        }
    });
}

function pay(id) {
    requireAuth('pay_receive', () => {
        let idx = sales.findIndex(x => x.id === id);
        if (idx !== -1) {
            let saleObj = { ...sales[idx] };
            let count = 1, amountToPay = 0, lateFee = 0;
            
            if (saleObj.type === 'Debt') {
                amountToPay = parseFloat(prompt("چەند پارەی ددەت؟", saleObj.mon)) || 0;
                if (amountToPay <= 0) return;
            } else {
                count = parseInt(prompt("چەند قیستان ددەت؟", "1")) || 1;
                let available = saleObj.months - saleObj.paid;
                if (count > available) count = available;
                if (count <= 0) return;
                amountToPay = parseFloat(saleObj.mon);
                
                const l = translations[document.getElementById('lang-sel').value];
                lateFee = parseFloat(prompt(l.late_fee + " (0 if none):", "0")) || 0;
            }

            const now = new Date(), payTime = now.toLocaleString();
            if (!saleObj.paymentsHistory) saleObj.paymentsHistory = [];
            let updates = {};
            let tempReports = [];

            if (saleObj.type === 'Debt') {
                let currentDebt = parseFloat(saleObj.mon);
                let newDebt = Math.max(0, currentDebt - amountToPay);
                saleObj.mon = Number(newDebt.toFixed(2));
                
                saleObj.paymentsHistory.push({ 
                    installmentNo: 'Debt Payment', 
                    amount: (amountToPay + lateFee).toFixed(2), 
                    lateFee: lateFee, 
                    date: payTime, 
                    collector: currentUserRole 
                });
                
                const repId = Date.now();
                const rep = { 
                    ...saleObj, saleId: id, id: repId, payDate: payTime, 
                    mon: Number((amountToPay + lateFee).toFixed(2)), 
                    currentPayment: 'Debt', remAmt: saleObj.mon, remCount: 0, timestamp: repId 
                };
                
                updates[`/r/${repId}`] = rep;
                tempReports.push(rep);
                
                if (saleObj.mon <= 0) { 
                    updates[`/a/${id}`] = saleObj; 
                    updates[`/s/${id}`] = null; 
                } else {
                    saleObj.lastPaymentDate = now.getTime();
                    updates[`/s/${id}`] = saleObj;
                }
            } else {
                for (let i = 0; i < count; i++) {
                    saleObj.paid++;
                    let amtWithFee = i === 0 ? amountToPay + lateFee : amountToPay; 
                    
                    saleObj.paymentsHistory.push({ 
                        installmentNo: saleObj.paid, 
                        amount: amtWithFee.toFixed(2), 
                        lateFee: (i===0 ? lateFee : 0), 
                        date: payTime, 
                        collector: currentUserRole 
                    });
                    
                    const paidAmt = (parseFloat(saleObj.mon) * saleObj.paid);
                    const calcRemain = Math.max(0, (parseFloat(saleObj.total) - parseFloat(saleObj.down) - paidAmt));
                    const repId = Date.now() + i;
                    
                    const rep = { 
                        ...saleObj, saleId: id, id: repId, payDate: payTime, 
                        mon: Number(amtWithFee.toFixed(2)), currentPayment: saleObj.paid, 
                        remAmt: Number(calcRemain.toFixed(2)), remCount: (saleObj.months - saleObj.paid), timestamp: repId 
                    };
                    
                    updates[`/r/${repId}`] = rep;
                    tempReports.push(rep);
                }
                
                if (saleObj.paid >= saleObj.months) { 
                    updates[`/a/${id}`] = saleObj; 
                    updates[`/s/${id}`] = null; 
                } else {
                    saleObj.lastPaymentDate = now.getTime();
                    updates[`/s/${id}`] = saleObj;
                }
            }
            
            db.ref().update(updates).then(() => {
                logAction("RECEIVED PAYMENT", "Received " + (amountToPay + lateFee) + " from " + saleObj.name + " (Late Fee: " + lateFee + ")");
                const l = translations[document.getElementById('lang-sel').value];
                showToast(l.success_pay, "success");
                if (tempReports.length > 0) {
                    showReceiptEditor(tempReports[tempReports.length - 1]);
                }
            });
        }
    });
}

function showReceiptEditor(rep) {
    const lang = document.getElementById('lang-sel').value;
    const l = translations[lang];
    const isRtl = !['en','tr'].includes(lang);
    
    document.getElementById('modal-title').innerText = l.edit_receipt;
    
    let detailsHtml = "";
    const d = rep.itemDetails;
    if (d) {
        if (d.type === "Mobile") {
            detailsHtml = `${escapeHTML(d.model) || ''} | ${escapeHTML(d.storage) || ''}/${escapeHTML(d.ram) || ''}GB`;
        } else if (d.type === "Computer") {
            detailsHtml = `${escapeHTML(d.cpu) || ''} | RAM: ${escapeHTML(d.ram) || ''}GB`;
        } else {
            detailsHtml = escapeHTML(d.otherInfo) || '---';
        }
    }

    document.getElementById('modal-content').innerHTML = `
        <p style="margin-bottom:15px; color:var(--primary); font-weight:700;">${l.edit_receipt_note}</p>
        <div class="edit-receipt-form">
            <label>Customer Name</label><input type="text" id="edit-rec-name" value="${escapeHTML(rep.name)}">
            <label>Item</label><input type="text" id="edit-rec-item" value="${escapeHTML(rep.item)}">
            <label>Details</label><input type="text" id="edit-rec-details" value="${detailsHtml}">
            <label>Total Amount</label><input type="number" id="edit-rec-total" value="${rep.total}">
            <label>Paid Amount</label><input type="number" id="edit-rec-paid" value="${rep.mon}">
            <label>Remaining</label><input type="number" id="edit-rec-rem" value="${rep.remAmt}">
            <label>Payment Date</label><input type="text" id="edit-rec-date" value="${rep.payDate}">
        </div>
        
        <div class="receipt-preview" id="preview-box" style="direction: ${isRtl ? 'rtl' : 'ltr'};">
            <div style="text-align:center;">
                <img src="https://i.postimg.cc/3WMQdH2P/17ABF58A-85E9-4C1A-B6DD-97977E81AA3C.jpg" style="width:80px; margin-bottom:10px;" alt="Logo">
                <h3>${l.rec_title}</h3>
                <p id="preview-date">${rep.payDate}</p>
            </div>
            <hr style="margin:10px 0; border:0.5px dashed #000;">
            <p><b>${l.rec_cust}:</b> <span id="preview-name">${escapeHTML(rep.name)}</span></p>
            <p><b>${l.th2}:</b> <span id="preview-item">${escapeHTML(rep.item)}</span> (<span id="preview-details">${detailsHtml}</span>)</p>
            <p><b>${l.ltotal}:</b> <span id="preview-total">${currentCurrency.symbol}${rep.total}</span></p>
            <p><b>${l.th4}:</b> ${rep.type === 'Debt' ? 'Debt Pay' : rep.currentPayment + ' / ' + rep.months}</p>
            <p style="font-size:1.2rem; margin-top:5px;"><b>${l.rec_rem}:</b> <span id="preview-rem">${currentCurrency.symbol}${rep.remAmt}</span></p>
            <div id="qr-preview" style="display:flex; justify-content:center; margin-top:15px;"></div>
            <p style="text-align:center; font-size:0.8rem; margin-top:15px;">Powered by BIZHAR RASHEED</p>
        </div>
        
        <div class="print-settings">
            <div>
                <label style="font-size:12px; font-weight:bold;">PAPER</label>
                <select id="print-size-sel">
                    <option value="80mm">80mm</option>
                    <option value="58mm">58mm</option>
                </select>
            </div>
            <div>
                <label style="font-size:12px; font-weight:bold;">ORIENT</label>
                <select id="print-orient-sel">
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                </select>
            </div>
        </div>
        
        <button class="main-btn" onclick="saveEditedReceipt()">
            <i class="fa-solid fa-save"></i> ${l.save_changes}
        </button>
        <button class="main-btn secondary" onclick="previewChanges()" style="margin-top:10px;">
            <i class="fa-solid fa-eye"></i> ${l.print_preview}
        </button>
    `;
    
    try {
        new QRCode(document.getElementById("qr-preview"), { text: `POS:${rep.id}`, width: 80, height: 80 });
    } catch (e) {}

    ['edit-rec-name', 'edit-rec-item', 'edit-rec-details', 'edit-rec-total', 'edit-rec-rem', 'edit-rec-date'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', updatePreview);
        }
    });
    
    document.getElementById('modal-universal').style.display = 'flex';
    window.currentEditingReceipt = rep;
}

function updatePreview() {
    document.getElementById('preview-name').innerText = escapeHTML(document.getElementById('edit-rec-name').value);
    document.getElementById('preview-item').innerText = escapeHTML(document.getElementById('edit-rec-item').value);
    document.getElementById('preview-details').innerText = escapeHTML(document.getElementById('edit-rec-details').value);
    document.getElementById('preview-total').innerText = currentCurrency.symbol + document.getElementById('edit-rec-total').value;
    document.getElementById('preview-rem').innerText = currentCurrency.symbol + document.getElementById('edit-rec-rem').value;
    document.getElementById('preview-date').innerText = document.getElementById('edit-rec-date').value;
}

function previewChanges() {
    updatePreview();
}

function saveEditedReceipt() {
    const l = translations[document.getElementById('lang-sel').value];
    const rep = window.currentEditingReceipt;
    
    rep.name = escapeHTML(document.getElementById('edit-rec-name').value);
    rep.item = escapeHTML(document.getElementById('edit-rec-item').value);
    rep.total = parseFloat(document.getElementById('edit-rec-total').value);
    rep.mon = parseFloat(document.getElementById('edit-rec-paid').value);
    rep.remAmt = parseFloat(document.getElementById('edit-rec-rem').value);
    rep.payDate = escapeHTML(document.getElementById('edit-rec-date').value);
    
    if (rep.itemDetails) {
        const detailsText = escapeHTML(document.getElementById('edit-rec-details').value);
        if (rep.itemDetails.type === 'Mobile') {
            const parts = detailsText.split('|');
            if (parts[0]) rep.itemDetails.model = parts[0].trim();
        } else if (rep.itemDetails.type === 'Computer') {
            const parts = detailsText.split('|');
            if (parts[0]) rep.itemDetails.cpu = parts[0].trim();
        } else {
            rep.itemDetails.otherInfo = detailsText;
        }
    }
    
    let updates = {};
    updates['/r/' + rep.id] = rep; 

    const trueSaleId = rep.saleId || rep.id;
    const saleIdx = sales.findIndex(s => s.id === trueSaleId);
    const archIdx = archive.findIndex(s => s.id === trueSaleId);
    const path = saleIdx !== -1 ? '/s/' + trueSaleId : (archIdx !== -1 ? '/a/' + trueSaleId : null);

    if (path) {
        updates[path + '/name'] = rep.name;
        updates[path + '/item'] = rep.item;
        updates[path + '/total'] = rep.total;
        if (rep.itemDetails) {
            updates[path + '/itemDetails'] = rep.itemDetails;
        }
    }

    db.ref().update(updates).then(() => {
        showToast(l.receipt_saved, "success");
        executePrint(rep);
        closeModal();
    });
}

function reprintReceipt(reportTimestamp) {
    const r = reports.find(r => r.timestamp === reportTimestamp);
    if (r) {
        showReceiptEditor(r);
    } else {
        showToast("Receipt details not found!", "danger");
    }
}

function showLedger(id) {
    const sale = sales.find(x => x.id === id) || archive.find(x => x.id === id);
    if (!sale) return;
    
    const l = translations[document.getElementById('lang-sel').value];
    const history = sale.paymentsHistory || [];
    
    document.getElementById('modal-title').innerText = l.h_title;
    
    let html = `
    <div class="card" style="margin-bottom:15px; border-right: 5px solid var(--primary);">
        <b>${escapeHTML(sale.name)}</b><br>
        <small>${escapeHTML(sale.item)} (${sale.type}) - Paid via: ${sale.paymentMethod || 'Cash'}</small>
        ${sale.imei ? `<br><small style="color:var(--neon-blue);">IMEI/Serial: ${escapeHTML(sale.imei)}</small>` : ''}
        
        <div style="display:flex; justify-content:space-between; margin-top:10px;">
            <span>Total: ${currentCurrency.symbol}${sale.total}</span>
            <span>Down: ${currentCurrency.symbol}${sale.down}</span>
        </div>
        
        ${sale.customerDoc ? `<div style="margin-top:15px; text-align:center;"><p style="font-size:11px; font-weight:900;">CUSTOMER DOCUMENT</p><img src="${sale.customerDoc}" style="width:100%; max-height:200px; object-fit:contain; border-radius:10px; border:1px solid var(--border);" alt="Document"></div>` : ''}
        
        ${sale.type === 'Installments' ? `
            <button class="main-btn" onclick="printA4Contract(${sale.id})" style="background:linear-gradient(45deg, #1e293b, #334155); margin-top:15px;">
                <i class="fa-solid fa-file-contract"></i> ${l.btn_a4 || 'Print A4 Contract'}
            </button>
        ` : ''}
    </div>`;
    
    if (history.length === 0) {
        html += `<p style="text-align:center; padding:20px;">No payments recorded yet.</p>`;
    } else {
        html += `<div class="history-list">`;
        history.forEach(p => {
            const mRep = reports.find(r => r.saleId === sale.id && r.payDate === p.date) || reports.find(r => r.id === sale.id && r.payDate === p.date);
            const printBtnHtml = mRep ? `<button onclick="reprintReceipt(${mRep.timestamp})" class="btn-sm" style="background:#475569; width:30px; height:30px; margin:0;"><i class="fa-solid fa-print"></i></button>` : '';
            
            html += `
            <div class="history-item">
                <div>
                    <b>${isNaN(p.installmentNo) ? p.installmentNo : 'Installment #' + p.installmentNo}</b>
                    ${p.lateFee > 0 ? `<span style="color:var(--danger); font-size:10px; margin-left:5px;">(+Fee: ${p.lateFee})</span>` : ''}<br>
                    <small><i class="fa-solid fa-calendar-day"></i> ${p.date}</small><br>
                    <small><i class="fa-solid fa-user-check"></i> ${p.collector || 'Admin'}</small>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-weight:900; color:var(--success); font-size:1.1rem;">${currentCurrency.symbol}${p.amount}</span>
                    ${printBtnHtml}
                </div>
            </div>`;
        });
        html += `</div>`;
    }
    
    document.getElementById('modal-content').innerHTML = html;
    document.getElementById('modal-universal').style.display = 'flex';
}

function printA4Contract(saleId) {
    const sale = sales.find(x => x.id === saleId) || archive.find(x => x.id === saleId);
    if (!sale) return;
    
    const lang = document.getElementById('lang-sel').value;
    const l = translations[lang];
    const isRtl = !['en','tr'].includes(lang);
    const area = document.getElementById('print-area');
    
    let termsHtml = ``;
    if(isRtl) {
        termsHtml = `
            <ul>
                <li>کڕیار بەرپرسیارە ژ دانا قیستان د دەمێ خۆ دا بێی گیرۆبوون.</li>
                <li>دەمێ کو کڕیار دوو هەیڤان ل دویڤ ئێک قیست نەدەت، مافێ فرۆشیاری یە ڕێکارێن یاسایی بگریتەبەر.</li>
                <li>کەفیل ب تەمامی بەرپرسیارە بەرامبەر ڤێ کۆژمێ پارەی ئەگەر کڕیار نەدەت.</li>
                <li>ئەڤ ئامێرە ل سەر ناڤێ کۆمپانیایێ یە هەتا قیستێ دوماهیێ دهێتە دان.</li>
            </ul>`;
    } else {
        termsHtml = `
            <ul>
                <li>The buyer is responsible for paying installments on time without delay.</li>
                <li>If the buyer misses two consecutive payments, the seller has the right to take legal action.</li>
                <li>The guarantor is fully responsible for the outstanding amount if the buyer defaults.</li>
                <li>The item remains the property of the seller until the final installment is paid.</li>
            </ul>`;
    }

    area.innerHTML = `
        <div class="a4-print" style="direction: ${isRtl ? 'rtl' : 'ltr'};">
            <img src="https://i.postimg.cc/3WMQdH2P/17ABF58A-85E9-4C1A-B6DD-97977E81AA3C.jpg" class="a4-print-logo" alt="Logo">
            <h2>${l.contract_title || 'INSTALLMENT CONTRACT'}</h2>
            
            <div class="a4-header-details">
                <div><b>Date:</b> ${sale.date.split(',')[0]}</div>
                <div><b>Contract ID:</b> ${sale.id}</div>
            </div>
            
            <table>
                <tr>
                    <th>${l.seller || 'Seller'}</th>
                    <td>BIZHAR POS</td>
                    <th>${l.buyer || 'Buyer'}</th>
                    <td>${escapeHTML(sale.name)}</td>
                </tr>
                <tr>
                    <th>${l.lphone || 'Phone'}</th>
                    <td>0750 000 0000</td>
                    <th>${l.lphone || 'Phone'}</th>
                    <td>${escapeHTML(sale.phone)}</td>
                </tr>
                <tr>
                    <th>${l.guarantor || 'Guarantor'}</th>
                    <td>${escapeHTML(sale.witness)}</td>
                    <th>${l.lwphone || 'Wit. Phone'}</th>
                    <td>${escapeHTML(sale.witnessPhone)}</td>
                </tr>
            </table>

            <h3>Item Details</h3>
            <table>
                <tr>
                    <th>${l.th2 || 'Item'}</th>
                    <th>IMEI/Serial</th>
                    <th>${l.ltotal || 'Total'}</th>
                    <th>${l.ldown || 'Down'}</th>
                    <th>${l.lmon || 'Monthly'} / ${l.lduration || 'Months'}</th>
                </tr>
                <tr>
                    <td>${escapeHTML(sale.item)}</td>
                    <td>${escapeHTML(sale.imei) || 'N/A'}</td>
                    <td>${currentCurrency.symbol}${sale.total}</td>
                    <td>${currentCurrency.symbol}${sale.down}</td>
                    <td>${currentCurrency.symbol}${sale.mon} (${sale.months} Months)</td>
                </tr>
            </table>

            <div class="a4-terms">
                <h3>Terms & Conditions</h3>
                ${termsHtml}
            </div>

            <div class="contract-signatures">
                <div>${l.seller || 'Seller Signature'}</div>
                <div>${l.buyer || 'Buyer Signature'}</div>
                <div>${l.guarantor || 'Guarantor Signature'}</div>
            </div>
        </div>`;
        
    setTimeout(() => { window.print(); }, 800);
}

function checkInstallmentsNotif() {
    const now = Date.now(), dueMillis = 27 * 24 * 60 * 60 * 1000;
    let count = 0;
    
    sales.forEach(s => {
        if (s.type !== 'Cash' && (now - s.lastPaymentDate) >= dueMillis) count++;
    });
    
    inv.forEach(item => {
        if (item.qty <= 3) count++;
    });
    
    const bell = document.getElementById('notif-bell');
    const badge = document.getElementById('notif-badge');
    
    if (count > 0) {
        bell.classList.add('active');
        badge.style.display = 'flex';
        badge.innerText = count;
    } else {
        bell.classList.remove('active');
        badge.style.display = 'none';
    }
}

function showNotifs() {
    const l = translations[document.getElementById('lang-sel').value];
    const now = Date.now(), dueMillis = 27 * 24 * 60 * 60 * 1000;
    let html = '';
    
    sales.forEach(s => {
        if (s.type !== 'Cash' && (now - s.lastPaymentDate) >= dueMillis) {
            html += `
            <div class="notif-item">
                <b>${escapeHTML(s.name)}</b>
                <span>${escapeHTML(s.item)} (${s.type}) - ${l.notif_msg}</span>
            </div>`;
        }
    });
    
    inv.forEach(item => {
        if (item.qty <= 3) {
            html += `
            <div class="notif-item" style="border-right: 4px solid var(--warning);">
                <b style="color:var(--warning);"><i class="fa-solid fa-boxes-stacked"></i> ${escapeHTML(item.name)}</b>
                <span>${l.low_stock || 'Low stock'}: Only ${item.qty} left!</span>
            </div>`;
        }
    });
    
    document.getElementById('modal-title').innerText = l.notif_title || "Notifications & Alerts";
    document.getElementById('modal-content').innerHTML = html || `<p style="text-align:center; padding:20px;">No Alerts.</p>`;
    document.getElementById('modal-universal').style.display = 'flex';
}

function executePrint(data) {
    const area = document.getElementById('print-area');
    const lang = document.getElementById('lang-sel').value;
    const l = translations[lang];
    const isRtl = !['en','tr'].includes(lang);
    const size = document.getElementById('print-size-sel') ? document.getElementById('print-size-sel').value : '80mm';
    const orient = document.getElementById('print-orient-sel') ? document.getElementById('print-orient-sel').value : 'portrait';
    const detailsHtml = document.getElementById('edit-rec-details') ? escapeHTML(document.getElementById('edit-rec-details').value) : '';
    const qrContent = `POS-ELITE:${data.id}|${escapeHTML(data.name)}|${data.type}`;
    
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `@media print { @page { size: ${orient}; } }`;
    document.head.appendChild(styleTag);

    area.innerHTML = `
        <div class="${size === '80mm' ? 'print-80mm' : 'print-58mm'}" style="direction: ${isRtl ? 'rtl' : 'ltr'};">
            <div class="thermal-header">
                <img src="https://i.postimg.cc/3WMQdH2P/17ABF58A-85E9-4C1A-B6DD-97977E81AA3C.jpg" class="thermal-logo" alt="Logo">
                <div class="receipt-title">${l.rec_title}</div>
                <p>${data.payDate}</p>
            </div>
            <div class="thermal-row"><span>${l.rec_cust}:</span><b>${escapeHTML(data.name)}</b></div>
            <div class="thermal-item-box"><b>${escapeHTML(data.item)}</b><br><small>${detailsHtml}</small></div>
            <div class="thermal-row"><span>${l.ltotal}:</span><b>${currentCurrency.symbol}${data.total}</b></div>
            <div class="thermal-row"><span>${l.th4}:</span><b>${data.type === 'Debt' ? 'Debt' : data.currentPayment + ' / ' + data.months}</b></div>
            <div class="thermal-row" style="font-size:11pt;"><span>${l.rec_rem}:</span><b>${currentCurrency.symbol}${data.remAmt}</b></div>
            <div id="qr-code-final" style="display: flex; justify-content: center;"></div>
            <div class="thermal-footer"><p>Powered BY: BIZHAR RASHEED</p></div>
        </div>`;
        
    try {
        new QRCode(document.getElementById("qr-code-final"), { text: qrContent, width: 100, height: 100 });
    } catch (e) {}
    
    setTimeout(() => {
        window.print();
        if (styleTag.parentNode) {
            styleTag.remove();
        }
    }, 800);
}

function showInventory() {
    const l = translations[document.getElementById('lang-sel').value];
    const q = document.getElementById('search-input').value.toLowerCase();
    document.getElementById('modal-title').innerText = l.madd;
    
    let filteredInv = inv.filter(x => x.name.toLowerCase().includes(q) || (x.barcode && x.barcode.toLowerCase().includes(q)));

    document.getElementById('modal-content').innerHTML = `
    <div class="card" style="padding:15px; margin-bottom:15px;">
        <select id="inv-type" onchange="toggleInvFields()">
            <option value="Mobile">Mobile</option>
            <option value="Computer">Computer</option>
            <option value="Other">${l.other}</option>
        </select>
        <div style="display: flex; gap: 8px;">
            <input type="text" id="add-n" placeholder="${l.inv_name}" style="flex:1;">
            <button onclick="startGenericScanner('add-barcode')" class="scan-action-btn" style="margin-top: 8px;">
                <i class="fa-solid fa-barcode"></i>
            </button>
        </div>
        <input type="text" id="add-barcode" placeholder="بارکۆد یان SKU (ئارەزوومەندانە)" style="margin-top:8px;">
        <input type="number" id="add-cost" placeholder="${l.inv_cost}" min="0" step="0.01">
        
        <div id="mobile-fields" class="details-grid">
            <input type="text" id="m-model" placeholder="Model">
            <input type="text" id="m-color" placeholder="Color">
            <input type="number" id="m-storage" placeholder="Storage" min="0">
            <input type="number" id="m-ram" placeholder="RAM" min="0">
        </div>
        <div id="pc-fields" class="details-grid" style="display:none;">
            <input type="text" id="p-cpu" placeholder="CPU">
            <input type="number" id="p-ram" placeholder="RAM" min="0">
            <input type="text" id="p-ssd" placeholder="SSD">
            <select id="p-gpu">
                <option value="RTX">RTX</option>
                <option value="Integrated">Integrated</option>
            </select>
        </div>
        <div id="other-fields" style="display:none;">
            <textarea id="o-info" placeholder="Details" rows="2"></textarea>
        </div>
        
        <input type="number" id="add-q" placeholder="${l.inv_qty}" min="1">
        <button class="main-btn" onclick="addInv()"><i class="fa-solid fa-plus"></i> ${l.inv_add}</button>
    </div>
    <div class="table-wrap">
        <table>
            <thead>
                <tr>
                    <th>${l.inv_name} / Barcode</th>
                    <th>Cost</th>
                    <th>Qty</th>
                    <th>${l.th_del || 'X'}</th>
                </tr>
            </thead>
            <tbody>
                ${filteredInv.map((x) => `
                <tr>
                    <td><b>${escapeHTML(x.name)}</b><br><small style="color:var(--neon-blue);">${escapeHTML(x.barcode) || ''}</small></td>
                    <td>${currentCurrency.symbol}${parseFloat(x.cost || 0).toFixed(2)}</td>
                    <td>${x.qty}</td>
                    <td>
                        <button onclick="directPrintLabel(${x.id})" class="btn-sm" style="background:#475569;" title="${l.print_qr}"><i class="fa-solid fa-print"></i></button>
                        <button onclick="delInv(${x.id})" class="btn-sm" style="background:var(--danger);"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>`).join('')}
            </tbody>
        </table>
    </div>`;
    document.getElementById('modal-universal').style.display = 'flex';
}

function showStocktake() {
    requireAuth('inv_add', () => {
        const l = translations[document.getElementById('lang-sel').value];
        document.getElementById('modal-title').innerText = l.m_stocktake || "Stocktaking";
        
        let html = `
        <div class="card" style="margin-bottom:15px; background: rgba(0, 210, 255, 0.05); border: 2px dashed var(--neon-blue);">
            <h3 style="color:var(--neon-blue); text-align:center;">PHYSICAL INVENTORY COUNT</h3>
            <p style="text-align:center; font-size:12px;">Compare system stock with actual physical stock.</p>
        </div>
        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Item / Barcode</th>
                        <th>Sys Qty</th>
                        <th>Actual Qty</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${inv.map(x => `
                    <tr>
                        <td><b>${escapeHTML(x.name)}</b><br><small>${escapeHTML(x.barcode) || ''}</small></td>
                        <td style="font-size:18px; font-weight:900;">${x.qty}</td>
                        <td><input type="number" id="actual-qty-${x.id}" placeholder="0" value="${x.qty}" style="width:70px; text-align:center; padding:5px; margin:0;"></td>
                        <td><button onclick="updateStocktake(${x.id})" class="btn-sm" style="background:var(--success); width:auto; padding:0 15px;">Update</button></td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>`;
        
        document.getElementById('modal-content').innerHTML = html;
        document.getElementById('modal-universal').style.display = 'flex';
        toggleMenu();
    });
}

function updateStocktake(id) {
    let actualInput = document.getElementById(`actual-qty-${id}`).value;
    let actualQty = parseInt(actualInput) || 0;
    
    if (confirm(`Update stock to ${actualQty}?`)) {
        db.ref(`/i/${id}/qty`).set(actualQty).then(() => {
            logAction("STOCKTAKING", "Updated item ID " + id + " to qty " + actualQty);
            showToast("Stock Updated!", "success");
            showStocktake();
        });
    }
}

function directPrintLabel(id) {
    const item = inv.find(x => x.id == id);
    if (!item) return;
    const area = document.getElementById('print-area');
    
    area.innerHTML = `
        <div id="label-temp" class="label-print">
            <b style="font-size:12px; display:block;">${escapeHTML(item.name)}</b>
            <div id="label-qr-direct" style="display:flex; justify-content:center; margin:2px 0;"></div>
            <small style="font-size:10px;">${escapeHTML(item.barcode) || 'ID: ' + item.id}</small>
        </div>`;
        
    try {
        new QRCode(document.getElementById("label-qr-direct"), { text: item.barcode || item.name, width: 50, height: 50 });
    } catch (e) {}
    
    setTimeout(() => { window.print(); }, 800);
}

function showLabelMaker() {
    const l = translations[document.getElementById('lang-sel').value];
    document.getElementById('modal-title').innerText = l.mlabel;
    
    document.getElementById('modal-content').innerHTML = `
        <div class="card">
            <select id="label-item-sel" onchange="previewLabel()">
                <option value="">--- Select Item ---</option>
                ${inv.map(x => `<option value="${x.id}">${escapeHTML(x.name)} ${x.barcode ? '('+escapeHTML(x.barcode)+')' : ''}</option>`).join('')}
            </select>
            <div id="label-preview-area" style="margin-top:20px; display:flex; justify-content:center;"></div>
            <button class="main-btn" onclick="printLabel()"><i class="fa-solid fa-print"></i> ${l.print_qr}</button>
        </div>`;
        
    document.getElementById('modal-universal').style.display = 'flex';
    toggleMenu();
}

function previewLabel() {
    const id = document.getElementById('label-item-sel').value;
    const item = inv.find(x => x.id == id);
    const area = document.getElementById('label-preview-area');
    
    if (!item) {
        area.innerHTML = "";
        return;
    }
    
    area.innerHTML = `
        <div id="label-temp" class="label-print">
            <b style="font-size:12px; display:block;">${escapeHTML(item.name)}</b>
            <div id="label-qr" style="display:flex; justify-content:center; margin:2px 0;"></div>
            <small style="font-size:10px;">${escapeHTML(item.barcode) || 'ID: ' + item.id}</small>
        </div>`;
        
    try {
        new QRCode(document.getElementById("label-qr"), { text: item.barcode || item.name, width: 50, height: 50 });
    } catch (e) {}
}

function printLabel() {
    const area = document.getElementById('print-area');
    area.innerHTML = document.getElementById('label-preview-area').innerHTML;
    setTimeout(() => { window.print(); }, 800);
}

function toggleInvFields() {
    const type = document.getElementById('inv-type').value;
    document.getElementById('mobile-fields').style.display = type === 'Mobile' ? 'grid' : 'none';
    document.getElementById('pc-fields').style.display = type === 'Computer' ? 'grid' : 'none';
    document.getElementById('other-fields').style.display = type === 'Other' ? 'block' : 'none';
}

function addInv() {
    let type = document.getElementById('inv-type').value;
    let n = escapeHTML(document.getElementById('add-n').value.trim());
    let q = parseInt(document.getElementById('add-q').value) || 0;
    let cost = Math.abs(parseFloat(document.getElementById('add-cost').value)) || 0;
    let bc = escapeHTML(document.getElementById('add-barcode').value.trim());
    
    if (!n || q <= 0) {
        showToast("Please fill all fields with valid numbers!", "danger");
        return;
    }
    
    if (!bc) {
        bc = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    }
    
    let deviceData = { id: Date.now(), name: n, barcode: bc, qty: q, cost: Number(cost.toFixed(2)), type: type };
    
    if (type === 'Mobile') {
        deviceData.model = escapeHTML(document.getElementById('m-model').value);
        deviceData.color = escapeHTML(document.getElementById('m-color').value);
        deviceData.storage = Math.abs(document.getElementById('m-storage').value);
        deviceData.ram = Math.abs(document.getElementById('m-ram').value);
    } else if (type === 'Computer') {
        deviceData.cpu = escapeHTML(document.getElementById('p-cpu').value);
        deviceData.ram = Math.abs(document.getElementById('p-ram').value);
        deviceData.storage = escapeHTML(document.getElementById('p-ssd').value);
    } else {
        deviceData.otherInfo = escapeHTML(document.getElementById('o-info').value);
    }
    
    db.ref().update({ [`/i/${deviceData.id}`]: deviceData }).then(() => {
        logAction("ADD INVENTORY", "Added " + q + "x " + n);
        const l = translations[document.getElementById('lang-sel').value];
        showToast(l.success_inv, "success");
        showInventory();
    });
}

function playBeep() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    } catch(e) {}
}

function startGenericScanner(targetInputId) {
    if (isScanning) return;
    if (activeScanner) {
        activeScanner.stop().then(() => {
            activeScanner = null;
            initScanner(targetInputId);
        }).catch(() => {
            activeScanner = null;
            initScanner(targetInputId);
        });
    } else {
        initScanner(targetInputId);
    }
}

function initScanner(targetInputId) {
    isScanning = true;
    const content = document.getElementById('modal-content');
    const oldHtml = content.innerHTML;
    
    content.innerHTML = `
        <div id="reader-box"></div>
        <button class="main-btn" id="close-scanner-btn" style="background:#475569; margin-top:15px;">
            <i class="fa-solid fa-arrow-left"></i> Back
        </button>`;
        
    const config = { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 };
    activeScanner = new Html5Qrcode("reader-box");
    
    activeScanner.start({ facingMode: "environment" }, config, (decodedText) => {
        playBeep(); 
        document.getElementById(targetInputId).value = decodedText;
        if (targetInputId === 'i-item') updateDetailsHint();
        stopAndResetScanner(targetInputId, oldHtml);
    }, (errorMessage) => {}).catch((err) => {
        showToast("Camera access denied or not available", "danger");
        stopAndResetScanner(targetInputId, oldHtml);
    });
    
    document.getElementById('close-scanner-btn').onclick = () => { stopAndResetScanner(targetInputId, oldHtml); };
}

function stopAndResetScanner(targetInputId, oldHtml) {
    isScanning = false;
    if (activeScanner) {
        activeScanner.stop().then(() => {
            activeScanner = null;
            if (targetInputId === 'add-barcode') showInventory(); else closeModal();
        }).catch((err) => {
            activeScanner = null;
            if (targetInputId === 'add-barcode') showInventory(); else closeModal();
        });
    } else {
        if (targetInputId === 'add-barcode') showInventory(); else closeModal();
    }
}

function scanForSale() {
    document.getElementById('modal-title').innerText = "SCAN";
    document.getElementById('modal-universal').style.display = 'flex';
    startGenericScanner('i-item');
}

function updateDetailsHint() {
    const iVal = document.getElementById('i-item').value;
    const item = inv.find(x => x.id == iVal || x.name == iVal || x.barcode == iVal);
    const hint = document.getElementById('item-details-hint');
    
    if (item) {
        document.getElementById('i-item').value = item.id;
        if (item.type === 'Mobile') {
            hint.innerText = `${escapeHTML(item.model) || ''} | ${escapeHTML(item.storage) || ''}GB | Cost: ${currentCurrency.symbol}${item.cost || 0}`;
        } else if (item.type === 'Computer') {
            hint.innerText = `${escapeHTML(item.cpu) || ''} | ${escapeHTML(item.ram) || ''}GB RAM | Cost: ${currentCurrency.symbol}${item.cost || 0}`;
        } else {
            hint.innerText = `Item Found | Cost: ${currentCurrency.symbol}${item.cost || 0}`;
        }
    } else {
        hint.innerText = "";
    }
}

function applyLang() {
    const langSel = document.getElementById('lang-sel');
    const l = translations[langSel.value] || translations.bd;
    const isLtr = ['en', 'tr'].includes(langSel.value);
    document.body.dir = isLtr ? "ltr" : "rtl";
    
    const elements = {
        'txt-subtitle': l.login_sub, 'txt-tab-si': l.tab_si, 'txt-tab-su': l.tab_su, 'lbl-si-user': l.user, 'lbl-si-pass': l.pass, 'btn-si': l.tab_si,
        'lbl-su-user': l.user_new, 'lbl-su-pass': l.pass, 'btn-su': l.tab_su, 'txt-role-cashier': l.role_c, 'txt-role-admin': l.role_a, 'txt-buy': l.buy_code,
        'm-header': l.mhead, 'm-archive': l.marchive, 'm-trash': l.mtrash, 'm-backup': l.mbackup, 'm-backup-json': l.mbackup_json,
        'm-pdf': l.mpdf || "PDF", 'm-restore': l.mrestore, 'm-add': l.madd, 'm-label': l.mlabel, 'm-reports': l.mreports,
        'm-closing': l.mclosing, 'm-vault': l.mvault, 'm-customers': l.mcustomers || "Customers", 'm-currency': l.mcurrency || "Currency",
        'm-about': l.mabout, 'm-logout': l.mlogout, 'm-pc': document.getElementById('app-container').classList.contains('pc-mode-active') ? (l.mmobile || "Mobile Mode") : l.mpc, 'btn-close': l.bclose,
        'm-security': l.msecurity || "Security"
    };
    
    Object.entries(elements).forEach(([id, text]) => {
        const el = document.getElementById(id);
        if (el) {
            el.innerText = text;
        }
    });

    if (document.getElementById('lbl-code')) {
        document.getElementById('lbl-code').innerHTML = `<i class="fa-solid fa-key"></i> ${l.lbl_code}`;
    }
    if (document.getElementById('link-wa')) {
        document.getElementById('link-wa').innerHTML = `<i class="fa-brands fa-whatsapp"></i> ${l.wa_link}`;
    }

    document.getElementById('t-form').innerHTML = `<i class="fa-solid fa-cart-plus"></i> ${l.tform}`;
    document.getElementById('l-sale-type').innerText = l.lsaletype;
    document.getElementById('opt-inst').innerText = l.opt_inst;
    document.getElementById('opt-cash').innerText = l.opt_cash;
    document.getElementById('opt-debt').innerText = l.opt_debt;
    
    document.getElementById('l-name').innerText = l.lname;
    document.getElementById('l-phone').innerText = l.lphone;
    document.getElementById('l-witness').innerText = l.lwitness;
    document.getElementById('l-witness-phone').innerText = l.lwphone;
    
    document.getElementById('l-item').innerText = l.litem;
    document.getElementById('l-buy').innerText = l.lbuy;
    document.getElementById('l-down').innerText = l.ldown;
    document.getElementById('l-duration').innerText = l.lduration;
    
    document.getElementById('opt-other-plan').innerText = l.opt_other_plan;
    document.getElementById('l-other-rate').innerText = l.custom_rate;
    document.getElementById('l-other-months').innerText = l.custom_months;
    
    document.getElementById('l-note-title').innerText = l.lnote;
    document.getElementById('l-total-box').innerText = l.ltotal;
    document.getElementById('l-mon').innerText = l.lmon;
    document.getElementById('b-save').innerText = l.bsave;
    
    document.getElementById('l-upload-text').innerText = l.lupload || "Upload Doc";
    document.getElementById('l-upload-label').innerText = l.doc_label || "Customer Document";
    document.getElementById('s1').innerText = l.s1;
    
    const s4El = document.getElementById('s4');
    if (s4El) {
        s4El.innerHTML = `${l.net_profit} <i class="fa-solid fa-eye privacy-toggle" onclick="togglePrivacy()"></i>`;
    }

    const payMethodLabel = document.getElementById('l-payment-method');
    if (payMethodLabel) {
        payMethodLabel.innerText = l.pay_method;
    }

    if (document.getElementById('m-expenses')) document.getElementById('m-expenses').innerText = l.m_expenses;
    if (document.getElementById('m-suppliers')) document.getElementById('m-suppliers').innerText = l.m_suppliers;
    if (document.getElementById('m-stocktake')) document.getElementById('m-stocktake').innerText = l.m_stocktake || "Stocktaking";
    if (document.getElementById('m-audit')) document.getElementById('m-audit').innerText = l.m_audit || "Audit Log";
    if (document.getElementById('m-guarantors')) document.getElementById('m-guarantors').innerText = l.m_guarantors || "Guarantors";
    if (document.getElementById('m-commissions')) document.getElementById('m-commissions').innerText = l.m_commissions || "Commissions";
    
    if (document.getElementById('l-imei')) document.getElementById('l-imei').innerText = l.imei || "IMEI / SERIAL";
    if (document.getElementById('l-discount')) document.getElementById('l-discount').innerText = l.discount || "DISCOUNT $";

    document.getElementById('s-rem').innerText = l.srem;
    document.getElementById('s-annual').innerText = l.sannual;
    document.getElementById('search-input').placeholder = l.search;
    
    document.getElementById('th1').innerText = l.th1;
    document.getElementById('th2').innerText = l.th2;
    document.getElementById('th3').innerText = l.th3;
    document.getElementById('th_down').innerText = l.th_down;
    document.getElementById('th4').innerText = l.th4;
    document.getElementById('th5').innerText = l.th5;

    const isDark = document.body.classList.contains('dark-mode');
    document.getElementById('m-dark').innerText = isDark ? l.mlight : l.mdark;
    
    requestRender();
}

function render() {
    const v1 = document.getElementById('v1');
    const v4 = document.getElementById('v4');
    const vAnnual = document.getElementById('v-annual');
    const vRem = document.getElementById('v-rem');
    
    if (v1) {
        v1.innerText = inv.reduce((a, b) => a + parseInt(b.qty), 0);
    }
    
    let pro = 0, remTotal = 0;
    const q = document.getElementById('search-input').value.toLowerCase();
    
    const processSaleProfit = (s) => {
        let totalVal = parseFloat(s.total) || 0;
        let costVal = parseFloat(s.cost) || 0;
        let downVal = parseFloat(s.down) || 0;
        let monVal = parseFloat(s.mon) || 0;
        let paidCount = parseInt(s.paid) || 0;
        let monthsVal = parseInt(s.months) || 1;
        
        if (s.type === 'Debt') {
            let saleProfit = totalVal - costVal;
            let currentProfitShare = totalVal > 0 ? (downVal / totalVal) * saleProfit : 0;
            pro += currentProfitShare;
            remTotal += parseFloat(s.mon);
        } else if (totalVal > 0) {
            let saleProfit = totalVal - costVal;
            let currentCashIn = downVal + (monVal * paidCount);
            let currentProfitShare = (currentCashIn / totalVal) * saleProfit;
            pro += currentProfitShare;
            remTotal += (monVal * (monthsVal - paidCount));
        }
    };
    
    sales.forEach(processSaleProfit);
    archive.forEach(s => { 
        pro += (parseFloat(s.total) - parseFloat(s.cost || 0)); 
    });

    let totalExp = expenses.reduce((a, b) => a + parseFloat(b.amount), 0);
    let netProfit = pro - totalExp;

    if (v4) {
        v4.innerText = privacyHidden ? "****" : currentCurrency.symbol + Number(netProfit.toFixed(0));
    }
    if (vAnnual) {
        vAnnual.innerText = privacyHidden ? "****" : currentCurrency.symbol + Number((netProfit * 1.6).toFixed(0));
    }
    if (vRem) {
        vRem.innerText = currentCurrency.symbol + Number(remTotal.toFixed(0));
    }
    
    let sel = document.getElementById('i-item');
    if (sel) {
        let curr = sel.value;
        let selHtml = '<option value="">--- ITEM ---</option>';
        inv.forEach(x => {
            if (x.qty > 0) {
                selHtml += `<option value="${x.id}">${escapeHTML(x.name)} ${x.barcode ? '('+escapeHTML(x.barcode)+')' : ''}</option>`;
            }
        });
        sel.innerHTML = selHtml;
        sel.value = curr;
    }
    
    let list = document.getElementById('sales-list');
    if (list) {
        let listHtml = '';
        sales.filter(s => {
            return s.name.toLowerCase().includes(q) || 
                   s.item.toLowerCase().includes(q) || 
                   s.id.toString().includes(q) || 
                   (s.imei && s.imei.toLowerCase().includes(q)) || 
                   (s.itemDetails && s.itemDetails.barcode && s.itemDetails.barcode.toLowerCase().includes(q));
        }).forEach(s => {
            listHtml += `
            <tr>
                <td><b>${escapeHTML(s.name)}</b><br><small style="color:${s.type === 'Debt' ? 'var(--danger)' : 'var(--primary)'}">${s.type}</small></td>
                <td>${escapeHTML(s.item)}</td>
                <td>${currentCurrency.symbol}${s.total}</td>
                <td>${currentCurrency.symbol}${s.down}</td>
                <td>${s.type === 'Debt' ? currentCurrency.symbol + s.mon : s.paid + '/' + s.months}</td>
                <td>
                    <button onclick="pay(${s.id})" class="btn-sm" style="background:var(--success);"><i class="fa-solid fa-receipt"></i></button>
                    <button onclick="showLedger(${s.id})" class="btn-sm" style="background:var(--primary);"><i class="fa-solid fa-clock-rotate-left"></i></button>
                    ${currentUserRole === "Admin" ? `
                        <button onclick="editSale(${s.id})" class="btn-sm" style="background:#f59e0b;"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button onclick="returnSale(${s.id})" class="btn-sm" style="background:#8b5cf6;" title="${translations[document.getElementById('lang-sel').value].btn_restore}"><i class="fa-solid fa-rotate-left"></i></button>
                        <button onclick="softDelete(${s.id})" class="btn-sm" style="background:var(--danger);"><i class="fa-solid fa-trash-can"></i></button>
                    ` : ''}
                </td>
            </tr>`;
        });
        list.innerHTML = listHtml;
    }
}

function exportPDF() {
    const element = document.getElementById('main-table');
    if (!element) return;
    const opt = {
        margin: 0.5,
        filename: 'Sales.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();
    showToast("PDF Exported!", "success");
}

function showReports(type = 'daily') {
    const l = translations[document.getElementById('lang-sel').value];
    document.getElementById('modal-title').innerText = l.mreports;
    const menuOverlay = document.getElementById('menu-overlay');
    if (menuOverlay && menuOverlay.classList.contains('show')) {
        toggleMenu();
    }
    
    const now = new Date();
    let filtered = [];
    
    if (type === 'daily') {
        filtered = reports.filter(r => new Date(r.timestamp).toDateString() === now.toDateString());
    } else if (type === 'weekly') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = reports.filter(r => new Date(r.timestamp) >= weekAgo);
    } else if (type === 'monthly') {
        filtered = reports.filter(r => {
            const d = new Date(r.timestamp);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });
    } else if (type === 'yearly') {
        filtered = reports.filter(r => new Date(r.timestamp).getFullYear() === now.getFullYear());
    }
    
    const totalAmt = filtered.reduce((acc, curr) => acc + parseFloat(curr.mon), 0);
    
    document.getElementById('modal-content').innerHTML = `
    <div class="report-tabs">
        <button class="tab-btn ${type === 'daily' ? 'active' : ''}" onclick="showReports('daily')">${l.rep_d}</button>
        <button class="tab-btn ${type === 'weekly' ? 'active' : ''}" onclick="showReports('weekly')">${l.rep_w}</button>
        <button class="tab-btn ${type === 'monthly' ? 'active' : ''}" onclick="showReports('monthly')">${l.rep_m}</button>
        <button class="tab-btn ${type === 'yearly' ? 'active' : ''}" onclick="showReports('yearly')">${l.rep_y}</button>
    </div>
    <div class="rep-sum-box">
        <div class="rep-stat"><small>${l.rep_count}</small><h3>${filtered.length}</h3></div>
        <div class="rep-stat"><small>${l.rep_total}</small><h3>${currentCurrency.symbol}${totalAmt.toFixed(2)}</h3></div>
    </div>
    <div class="table-wrap">
        <table>
            <thead><tr><th>Customer</th><th>Amount</th><th>Date</th></tr></thead>
            <tbody>
                ${filtered.map(x => `
                <tr>
                    <td>${escapeHTML(x.name)}</td>
                    <td>${currentCurrency.symbol}${parseFloat(x.mon).toFixed(2)}</td>
                    <td style="font-size:10px;">${new Date(x.timestamp).toLocaleDateString()}</td>
                </tr>`).join('')}
            </tbody>
        </table>
    </div>`;
    
    document.getElementById('modal-universal').style.display = 'flex';
}

function showDailyClosing() {
    const l = translations[document.getElementById('lang-sel').value];
    const nowStr = new Date().toDateString();
    const nowFormatted = new Date().toLocaleString();
    let dailyDownPayments = 0, downPayCount = 0;
    
    [...sales, ...archive].forEach(s => {
        if (new Date(s.timestamp).toDateString() === nowStr) {
            dailyDownPayments += parseFloat(s.down);
            downPayCount++;
        }
    });
    
    const dailyInstallments = reports.filter(r => new Date(r.timestamp).toDateString() === nowStr);
    const installmentTotal = dailyInstallments.reduce((acc, curr) => acc + parseFloat(curr.mon), 0);
    const closingTotal = dailyDownPayments + installmentTotal;
    
    document.getElementById('modal-title').innerText = l.mclosing;
    document.getElementById('modal-content').innerHTML = `
        <div class="card receipt-preview" id="closing-preview" style="background:var(--bg); border:2px dashed var(--neon-blue);">
            <div style="text-align:center;">
                <h3 style="color:var(--neon-blue)">DAILY CLOSING</h3>
                <p>${nowFormatted}</p>
            </div>
            <hr style="margin:15px 0; border:0.5px dashed #000;">
            <div class="thermal-row">
                <span>New Sales (Downpay):</span>
                <b>${currentCurrency.symbol}${dailyDownPayments.toFixed(2)} (${downPayCount})</b>
            </div>
            <div class="thermal-row">
                <span>Installments Recv:</span>
                <b>${currentCurrency.symbol}${installmentTotal.toFixed(2)} (${dailyInstallments.length})</b>
            </div>
            <hr style="margin:15px 0; border:0.5px dashed #000;">
            <div class="thermal-row" style="font-size:1.4rem;">
                <span>CASH IN BOX:</span>
                <b style="color:var(--success);">${currentCurrency.symbol}${closingTotal.toFixed(2)}</b>
            </div>
        </div>
        <button class="main-btn" onclick="printClosing()"><i class="fa-solid fa-print"></i> PRINT CLOSING</button>
    `;
    document.getElementById('modal-universal').style.display = 'flex';
    toggleMenu();
}

function showCashDrawer() {
    const l = translations[document.getElementById('lang-sel').value];
    let totalDown = [...sales, ...archive].reduce((acc, s) => acc + parseFloat(s.down || 0), 0);
    let totalReceived = reports.reduce((acc, r) => acc + parseFloat(r.mon || 0), 0);
    let cashInDrawer = totalDown + totalReceived;
    
    document.getElementById('modal-title').innerText = l.mvault || "Cash Drawer";
    document.getElementById('modal-content').innerHTML = `
    <div class="card" style="text-align:center; padding:30px; border:2px solid var(--success);">
        <i class="fa-solid fa-vault" style="font-size:3rem; color:var(--success); margin-bottom:15px;"></i>
        <p style="color:#64748b; font-weight:700;">${l.cash_in_box}</p>
        <h1 style="font-size:3.5rem; font-weight:900; color:var(--text);">${currentCurrency.symbol}${cashInDrawer.toFixed(2)}</h1>
        <hr style="margin:20px 0; border:0.5px dashed var(--border);">
        <div class="details-grid" style="text-align:left;">
            <div class="rep-stat"><small>From Down Payments</small><h3>${currentCurrency.symbol}${totalDown.toFixed(2)}</h3></div>
            <div class="rep-stat"><small>From Installments</small><h3>${currentCurrency.symbol}${totalReceived.toFixed(2)}</h3></div>
        </div>
    </div>`;
    document.getElementById('modal-universal').style.display = 'flex';
    toggleMenu();
}

function printClosing() {
    const content = document.getElementById('closing-preview');
    if (!content) return;
    const area = document.getElementById('print-area');
    area.innerHTML = `<div class="print-80mm" style="padding:10px;">${content.innerHTML}</div>`;
    setTimeout(() => { window.print(); }, 800);
}

function toggleLayout() {
    const container = document.getElementById('app-container');
    container.classList.toggle('pc-mode-active');
    const isPC = container.classList.contains('pc-mode-active');
    const langSel = document.getElementById('lang-sel').value;
    const l = translations[langSel] || translations.bd;
    const icon = document.getElementById('layout-icon');
    const textSpan = document.getElementById('m-pc');
    
    if (isPC) {
        icon.className = "fa-solid fa-mobile-screen";
        textSpan.innerText = l.mmobile || "Mobile Mode";
    } else {
        icon.className = "fa-solid fa-display";
        textSpan.innerText = l.mpc || "PC Mode";
    }
    toggleMenu();
}

function toggleMenu() {
    const overlay = document.getElementById('menu-overlay');
    if (overlay) {
        overlay.classList.toggle('show');
    }
}

function delInv(id) {
    const l = translations[document.getElementById('lang-sel').value];
    if (confirm(l.th_del + " ?")) {
        db.ref('/i/' + id).remove().then(() => {
            logAction("DELETE ITEM", "Deleted item ID " + id);
            showToast("Item Deleted!", "danger");
        });
    }
}

function softDelete(id) {
    const l = translations[document.getElementById('lang-sel').value];
    document.getElementById('modal-title').innerText = "CONFIRM";
    document.getElementById('modal-content').innerHTML = `
    <div class="confirm-box">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <p style="font-weight:900; font-size:1.1rem;">${l.confirm_del}</p>
        <div class="confirm-actions">
            <button class="confirm-btn btn-no" onclick="closeModal()">NO</button>
            <button class="confirm-btn btn-yes" onclick="executeSoftDelete(${id})">YES, TRASH IT</button>
        </div>
    </div>`;
    document.getElementById('modal-universal').style.display = 'flex';
}

function executeSoftDelete(id) {
    requireAuth('trash_delete', () => {
        let idx = sales.findIndex(x => x.id === id);
        if (idx !== -1) {
            let saleItem = sales[idx];
            let updates = {};
            let invIdx = inv.findIndex(x => x.id == saleItem.itemId);
            
            if (invIdx !== -1) {
                updates[`/i/${saleItem.itemId}/qty`] = inv[invIdx].qty + 1;
            }
            updates[`/t/${id}`] = saleItem;
            updates[`/s/${id}`] = null;
            
            db.ref().update(updates).then(() => {
                logAction("TRASH SALE", "Moved sale ID " + id + " to trash.");
                showToast("Moved to Trash", "danger");
                closeModal();
            });
        }
    });
}

function showArchive(isRefresh = false) {
    const q = document.getElementById('search-input').value.toLowerCase();
    const l = translations[document.getElementById('lang-sel').value];
    
    let filtered = archive.filter(x => {
        return x.name.toLowerCase().includes(q) || x.item.toLowerCase().includes(q) || x.id.toString().includes(q);
    });
    
    document.getElementById('modal-title').innerText = l.marchive;
    document.getElementById('modal-content').innerHTML = `
    <div class="table-wrap">
        <table>
            <thead><tr><th>${l.th1}</th><th>${l.th2}</th><th>${l.th3}</th><th>${l.th5}</th></tr></thead>
            <tbody>
                ${filtered.map(x => `
                <tr>
                    <td><b>${escapeHTML(x.name)}</b></td>
                    <td>${escapeHTML(x.item)}</td>
                    <td>${currentCurrency.symbol}${parseFloat(x.total).toFixed(2)}</td>
                    <td>
                        <button onclick="showLedger(${x.id})" class="btn-sm" style="background:var(--primary);"><i class="fa-solid fa-clock-rotate-left"></i></button>
                        ${currentUserRole === "Admin" ? `<button onclick="editSale(${x.id})" class="btn-sm" style="background:#f59e0b;"><i class="fa-solid fa-pen-to-square"></i></button>` : ''}
                    </td>
                </tr>`).join('')}
            </tbody>
        </table>
    </div>`;
    
    document.getElementById('modal-universal').style.display = 'flex';
    if (!isRefresh) toggleMenu();
}

function showRecycleBin(isRefresh = false) {
    const q = document.getElementById('search-input').value.toLowerCase();
    const l = translations[document.getElementById('lang-sel').value];
    
    let filtered = trash.filter(x => {
        return x.name.toLowerCase().includes(q) || x.item.toLowerCase().includes(q) || x.id.toString().includes(q);
    });
    
    document.getElementById('modal-title').innerText = l.mtrash;
    document.getElementById('modal-content').innerHTML = `
    <div class="table-wrap">
        <table>
            <thead><tr><th>${l.th1}</th><th>${l.th2}</th><th>${l.th5}</th></tr></thead>
            <tbody>
                ${filtered.map((x) => `
                <tr>
                    <td><b>${escapeHTML(x.name)}</b></td>
                    <td>${escapeHTML(x.item)}</td>
                    <td style="display:flex; justify-content:center; gap:5px;">
                        <button onclick="restore(${x.id})" class="main-btn" style="margin-top:0; padding:8px;">${l.btn_restore}</button>
                        <button onclick="permanentlyDelete(${x.id})" class="btn-sm" style="background:var(--danger);"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>`).join('')}
            </tbody>
        </table>
    </div>`;
    
    document.getElementById('modal-universal').style.display = 'flex';
    if (!isRefresh) toggleMenu();
}

function restore(id) {
    let restoredSale = trash.find(x => x.id === id);
    if(!restoredSale) return;

    let updates = {};
    let invIdx = inv.findIndex(x => x.id == restoredSale.itemId);
    
    if (invIdx !== -1) {
        if (inv[invIdx].qty <= 0) {
            showToast("کێشە: ئەڤ کاڵایە ل مەخزەنی نەماوە!", "danger");
            return;
        }
        updates[`/i/${restoredSale.itemId}/qty`] = inv[invIdx].qty - 1;
        updates[`/s/${restoredSale.id}`] = restoredSale;
        updates[`/t/${restoredSale.id}`] = null;
        
        db.ref().update(updates).then(() => {
            logAction("RESTORE SALE", "Restored sale ID " + id);
            showToast("Restored!", "success");
            closeModal();
        });
    } else {
        showToast("Item not found in inventory!", "danger");
    }
}

function permanentlyDelete(id) {
    if(confirm("سڕینەوەی یەکجاری؟ (PERMANENT DELETE?)")) {
        let item = trash.find(x => x.id === id);
        if(item && item.customerDoc) {
            deleteImage(item.customerDoc);
        }
        
        db.ref('/t/' + id).remove().then(() => { 
            logAction("PERMANENT DELETE", "Deleted sale ID " + id);
            showToast("Deleted Permanently!", "success"); 
            const title = document.getElementById('modal-title').innerText;
            const l = translations[document.getElementById('lang-sel').value];
            if(title === l.mtrash || title === "TRASH") {
                showRecycleBin(true); 
            }
        });
    }
}

function closeModal() {
    isInventoryOpen = false;
    if (activeScanner) {
        activeScanner.stop().then(() => {
            activeScanner = null;
            isScanning = false;
            document.getElementById('modal-universal').style.display = 'none';
        }).catch(() => {
            activeScanner = null;
            isScanning = false;
            document.getElementById('modal-universal').style.display = 'none';
        });
    } else {
        document.getElementById('modal-universal').style.display = 'none';
    }
}

function exportToExcel() {
    try {
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sales), "Sales");
        XLSX.writeFile(wb, "POS_Backup.xlsx");
        showToast("Excel Exported!", "success");
    } catch (e) {
        showToast("Export failed!", "danger");
    }
}

function exportJSON() {
    try {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
            i: inv,
            s: sales,
            a: archive,
            t: trash,
            r: reports,
            c: customers,
            e: expenses,
            sup: suppliers,
            logs: logs,
            g: guarantors,
            comm: commissions,
            sec: securitySettings
        }));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "POS_Backup_Full.json");
        document.body.appendChild(dlAnchorElem);
        dlAnchorElem.click();
        document.body.removeChild(dlAnchorElem);
        showToast("JSON Backup Ready!", "success");
    } catch (e) {
        showToast("Export failed!", "danger");
    }
}

function triggerRestore() {
    document.getElementById('restore-input').click();
}

function restoreData(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            const d = JSON.parse(ev.target.result);
            if (!d || typeof d !== 'object' || (!d.i && !d.s && !d.a && !d.c)) {
                throw new Error("Invalid Format");
            }
            inv = d.i || [];
            sales = d.s || [];
            archive = d.a || [];
            trash = d.t || [];
            reports = d.r || [];
            customers = d.c || [];
            expenses = d.e || [];
            suppliers = d.sup || [];
            logs = d.logs || [];
            guarantors = d.g || [];
            commissions = d.comm || [];
            securitySettings = d.sec || { masterPass: "", protectedSections: [] };
            
            db.ref().update({
                i: inv, s: sales, a: archive, t: trash, r: reports,
                c: customers, e: expenses, sup: suppliers, logs: logs, g: guarantors, comm: commissions, sec: securitySettings
            }).then(() => {
                const l = translations[document.getElementById('lang-sel').value];
                showToast(l.success_restore, "success");
                setTimeout(() => location.reload(), 1500);
            });
        } catch (e) {
            showToast("Invalid File Format!", "danger");
        }
    };
    reader.onerror = () => {
        showToast("Failed to read file!", "danger");
    };
    reader.readAsText(file);
}

function showAbout() {
    const l = translations[document.getElementById('lang-sel').value];
    document.getElementById('modal-title').innerText = l.mabout;
    document.getElementById('modal-content').innerHTML = `
    <div style="text-align:center; padding:20px;">
        <img src="https://i.postimg.cc/nV1HLXWy/EFAC45A5-C196-48E5-913E-A27706778B90.jpg" style="width:120px; border-radius:50%; border:3px solid var(--neon-blue); margin-bottom:15px;" alt="Developer">
        <h2 style="color:var(--neon-blue)">Bizhar Rasheed</h2>
        <p>${l.dev_role}</p>
        <p>${l.dev_msg}</p>
        <a href="https://bizhar-cloud.github.io/BizharRasheed/" target="_blank" rel="noopener noreferrer" class="dev-link">${l.click_visit}</a>
    </div>`;
    document.getElementById('modal-universal').style.display = 'flex';
    toggleMenu();
}

// ==========================================
// PWA & OFFLINE SYNC SUPPORT
// ==========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => console.log('ServiceWorker registered with scope:', registration.scope))
            .catch(err => console.log('ServiceWorker registration failed:', err));
    });
}

window.addEventListener('online', () => {
    const indicator = document.getElementById('offline-indicator');
    if (indicator) {
        indicator.style.display = 'none';
    }
    showToast("ئینتەرنێت هاتەڤە! داتا هاتنە هەڤکێشکرن.", "success");
});

window.addEventListener('offline', () => {
    const indicator = document.getElementById('offline-indicator');
    if (indicator) {
        indicator.style.display = 'block';
    }
    showToast("پەیوەندی ب ئینتەرنێتێ پچڕا! سیستەم ب ئۆفلاین کار دکەت.", "warning");
});
