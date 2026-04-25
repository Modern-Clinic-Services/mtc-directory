/*! MTC directory + search behavior — built from webflow/directory-page-embed.html */
(function(){
  var __MTC_CSS__ = "\n  /* ===== /directory hero search bar ===== */\n  .dir-home__search { display: block; width: 100%; max-width: 720px; }\n  .dir-home__search form { display: flex !important; flex-wrap: wrap; gap: 0.5rem; align-items: stretch; margin: 0; }\n  .dir-home__search form input[type=\"search\"] {\n    flex: 1 1 280px; min-width: 0; height: auto;\n    padding: 0.875rem 1rem; font-size: 1rem; line-height: 1.4;\n    border: 1px solid #d6dfe4; border-radius: 0.5rem; background: #fff; color: #0f2a36;\n    box-shadow: 0 1px 2px rgba(15,42,54,0.04);\n  }\n  .dir-home__search form input[type=\"search\"]::placeholder { color: #8a9aa3; }\n  .dir-home__search form input[type=\"search\"]:focus {\n    outline: none; border-color: #0f2a36; box-shadow: 0 0 0 3px rgba(15,42,54,0.12);\n  }\n  .dir-home__search form input[type=\"submit\"] {\n    flex: 0 0 auto; padding: 0.875rem 1.5rem; font-size: 1rem; font-weight: 600;\n    background: #0f2a36; color: #fff; border: none; border-radius: 0.5rem; cursor: pointer;\n    transition: background 0.15s; line-height: 1.4;\n  }\n  .dir-home__search form input[type=\"submit\"]:hover { background: #1a4051; }\n  .dir-home__search .w-form-done, .dir-home__search .w-form-fail { display: none !important; }\n\n  /* ===== /search page (site-wide search) ===== */\n  body.mtc-search-page .w-form { max-width: 720px; }\n  body.mtc-search-page .w-form form { display: flex !important; flex-wrap: wrap; gap: 0.5rem; align-items: stretch; margin: 0; }\n  body.mtc-search-page .w-form input[type=\"search\"] {\n    flex: 1 1 280px; min-width: 0; height: auto;\n    padding: 0.875rem 1rem; font-size: 1rem; line-height: 1.4;\n    border: 1px solid #d6dfe4; border-radius: 0.5rem; background: #fff; color: #0f2a36;\n    box-shadow: 0 1px 2px rgba(15,42,54,0.04);\n  }\n  body.mtc-search-page .w-form input[type=\"search\"]:focus {\n    outline: none; border-color: #0f2a36; box-shadow: 0 0 0 3px rgba(15,42,54,0.12);\n  }\n  body.mtc-search-page .w-form input[type=\"submit\"] {\n    flex: 0 0 auto; padding: 0.875rem 1.5rem; font-size: 1rem; font-weight: 600;\n    background: #0f2a36; color: #fff; border: none; border-radius: 0.5rem; cursor: pointer;\n    line-height: 1.4;\n  }\n  body.mtc-search-page .w-form input[type=\"submit\"]:hover { background: #1a4051; }\n  body.mtc-search-page .search-result-items > div {\n    padding: 1rem 0; border-bottom: 1px solid #e3eaee;\n  }\n  body.mtc-search-page .search-result-items > div:last-child { border-bottom: none; }\n  body.mtc-search-page .search-result-items > div > a:first-child {\n    display: block; font-weight: 600; color: #0f2a36; font-size: 1.05rem; margin-bottom: 0.25rem;\n    text-decoration: none;\n  }\n  body.mtc-search-page .search-result-items > div > a:first-child:hover { text-decoration: underline; }\n  body.mtc-search-page .search-result-items > div > div { font-size: 0.8rem; color: #8a9aa3; margin-bottom: 0.4rem; word-break: break-all; }\n  body.mtc-search-page .search-result-items > div > p { font-size: 0.92rem; color: #2c3e47; margin: 0; line-height: 1.5; }\n  /* Section header above native results */\n  .mtc-other-results-head {\n    margin: 2rem 0 0.5rem; padding-bottom: 0.5rem;\n    border-bottom: 1px solid #e3eaee;\n    font-size: 1.15rem; font-weight: 700; color: #0f2a36;\n  }\n  .mtc-no-other-results { color: #5a6f78; font-size: 0.95rem; padding: 0.5rem 0 1rem; }\n\n  /* ===== Results section ===== */\n  .mtc-results { margin: 2.5rem auto 3rem; max-width: 1100px; padding: 0 1.25rem; }\n  .mtc-results__head {\n    display: flex; align-items: baseline; gap: 1rem; flex-wrap: wrap;\n    margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid #e3eaee;\n  }\n  .mtc-results__title { font-size: 1.5rem; font-weight: 700; margin: 0; color: #0f2a36; }\n  .mtc-results__count { color: #5a6f78; font-size: 0.95rem; }\n  .mtc-results__clear { margin-left: auto; color: #0f2a36; font-size: 0.9rem; text-decoration: underline; cursor: pointer; }\n  .mtc-results__clear:hover { color: #1a4051; }\n  .mtc-results__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 0.75rem; }\n  .mtc-results__card {\n    display: block; padding: 1rem 1.1rem;\n    border: 1px solid #e3eaee; border-radius: 0.6rem; background: #fff;\n    text-decoration: none !important; color: inherit;\n    transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;\n  }\n  .mtc-results__card:hover {\n    border-color: #0f2a36; transform: translateY(-1px);\n    box-shadow: 0 4px 12px rgba(15,42,54,0.08);\n  }\n  .mtc-results__name { font-weight: 600; color: #0f2a36; font-size: 1.05rem; line-height: 1.3; }\n  .mtc-results__meta { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.45rem; flex-wrap: wrap; }\n  .mtc-results__pill {\n    display: inline-block; font-size: 0.7rem; font-weight: 600;\n    text-transform: uppercase; letter-spacing: 0.04em; color: #2c5763;\n    background: #eaf2f4; padding: 0.22rem 0.6rem; border-radius: 999px;\n  }\n  .mtc-results__alias { font-size: 0.82rem; color: #5a6f78; font-style: italic; }\n  .mtc-results__empty { text-align: center; color: #5a6f78; padding: 2.5rem 1rem; font-size: 1rem; }\n  .mtc-results__empty a { color: #0f2a36; text-decoration: underline; }\n\n  /* In results mode, hide marketing sections so results take focus */\n  body.mtc-results-mode .dir-home__categories,\n  body.mtc-results-mode .dir-home__featured,\n  body.mtc-results-mode .dir-home__faq { display: none !important; }\n";
  var s = document.createElement('style');
  s.id = 'mtc-directory-styles';
  s.textContent = __MTC_CSS__;
  (document.head || document.documentElement).appendChild(s);
})();

(function(){
  var INDEX = [["Hashimoto's Thyroiditis","hashimotos-thyroiditis","condition","Hashimoto's Disease|Chronic Lymphocytic Thyroiditis|Autoimmune Thyroiditis"],["Hypothyroidism","hypothyroidism","condition","Underactive Thyroid|Low Thyroid"],["Hyperthyroidism","hyperthyroidism","condition","Overactive Thyroid"],["Graves' Disease","graves-disease","condition","Toxic Diffuse Goiter|Basedow's Disease"],["Thyroid Nodules","thyroid-nodules","condition","Thyroid Lumps"],["Goiter","goiter","condition","Enlarged Thyroid|Thyroid Enlargement"],["Multinodular Goiter","multinodular-goiter","condition","MNG|Nodular Goiter"],["Thyroid Cancer","thyroid-cancer","condition","Papillary Thyroid Cancer|Follicular Thyroid Cancer|Medullary Thyroid Cancer|Anaplastic Thyroid Cancer"],["Thyroiditis","thyroiditis","condition","Thyroid Inflammation"],["Postpartum Thyroiditis","postpartum-thyroiditis","condition","PPT"],["Subacute Thyroiditis","subacute-thyroiditis","condition","De Quervain's Thyroiditis|Granulomatous Thyroiditis|Painful Thyroiditis"],["Silent Thyroiditis","silent-thyroiditis","condition","Painless Thyroiditis|Lymphocytic Thyroiditis"],["Subclinical Hypothyroidism","subclinical-hypothyroidism","condition","Mild Hypothyroidism|Compensated Hypothyroidism"],["Subclinical Hyperthyroidism","subclinical-hyperthyroidism","condition","Mild Hyperthyroidism"],["Thyroid Storm","thyroid-storm","condition","Thyrotoxic Crisis"],["Myxedema Coma","myxedema-coma","condition","Severe Hypothyroidism"],["Euthyroid Sick Syndrome","euthyroid-sick-syndrome","condition","Non-Thyroidal Illness Syndrome|NTIS|Low T3 Syndrome"],["Congenital Hypothyroidism","congenital-hypothyroidism","condition","Cretinism (historical term)"],["Thyroid Eye Disease","thyroid-eye-disease","condition","Graves' Ophthalmopathy|TED|Graves' Eye Disease"],["Thyroid Hormone Resistance","thyroid-hormone-resistance","condition","Refetoff Syndrome|RTH"],["Iodine Deficiency","iodine-deficiency","condition","Low Iodine"],["Hashitoxicosis","hashitoxicosis","condition","Hashitoxic Phase"],["Polycystic Ovary Syndrome (PCOS)","polycystic-ovary-syndrome","condition","PCOS|Polycystic Ovarian Syndrome"],["Insulin Resistance","insulin-resistance","condition","IR|Metabolic Insulin Resistance"],["Type 2 Diabetes","type-2-diabetes","condition","T2D|T2DM|Adult-Onset Diabetes"],["Prediabetes","prediabetes","condition","Impaired Fasting Glucose|Impaired Glucose Tolerance"],["Metabolic Syndrome","metabolic-syndrome","condition","Syndrome X|Insulin Resistance Syndrome"],["Obesity","obesity","condition","Class I/II/III Obesity"],["Adrenal Insufficiency","adrenal-insufficiency","condition","Addison's Disease|Primary Adrenal Insufficiency"],["Cushing's Syndrome","cushings-syndrome","condition","Hypercortisolism"],["Adrenal Fatigue","adrenal-fatigue","concept","HPA Axis Dysfunction|Adrenal Dysfunction"],["Perimenopause","perimenopause","condition","Menopausal Transition|Pre-Menopause"],["Menopause","menopause","condition","Post-Menopause"],["Premature Ovarian Insufficiency","premature-ovarian-insufficiency","condition","POI|Premature Ovarian Failure|Early Menopause"],["Estrogen Dominance","estrogen-dominance","concept","Relative Estrogen Excess"],["Low Testosterone in Women","low-testosterone-women","condition","Female Androgen Deficiency"],["Andropause","andropause","condition","Male Menopause|Low T|Late-Onset Hypogonadism"],["Endometriosis","endometriosis","condition","Endo"],["Hyperprolactinemia","hyperprolactinemia","condition","High Prolactin"],["Pituitary Adenoma","pituitary-adenoma","condition","Pituitary Tumor|Prolactinoma"],["Hypopituitarism","hypopituitarism","condition","Pituitary Insufficiency"],["Hyperparathyroidism","hyperparathyroidism","condition","Overactive Parathyroid|HPT"],["Hypoparathyroidism","hypoparathyroidism","condition","Underactive Parathyroid"],["Acromegaly","acromegaly","condition","Growth Hormone Excess"],["PMDD","pmdd","condition","Premenstrual Dysphoric Disorder"],["PMS","pms","condition","Premenstrual Syndrome"],["Non-Alcoholic Fatty Liver Disease","non-alcoholic-fatty-liver-disease","condition","NAFLD|MASLD|Fatty Liver"],["Dyslipidemia","dyslipidemia","condition","High Cholesterol|Hyperlipidemia"],["Autoimmune Disease","autoimmune-disease","concept","Autoimmunity"],["Secondary Amenorrhea","amenorrhea","condition","Missed Periods|Absent Menstruation"],["Fatigue","fatigue","symptom","Chronic Fatigue|Exhaustion|Low Energy"],["Hair Loss","hair-loss","symptom","Thinning Hair|Hair Shedding|Telogen Effluvium"],["Brain Fog","brain-fog","symptom","Mental Fog|Cognitive Dysfunction"],["Weight Gain","weight-gain","symptom","Unexplained Weight Gain"],["Unexplained Weight Loss","unexplained-weight-loss","symptom","Unintentional Weight Loss"],["Dry Skin","dry-skin","symptom","Xerosis"],["Cracked Heels","cracked-heels","symptom","Cracked Feet|Heel Fissures"],["Low Libido","low-libido","symptom","Low Sex Drive|Decreased Libido"],["Cold Intolerance","cold-intolerance","symptom","Feeling Cold|Cold Hands and Feet"],["Heat Intolerance","heat-intolerance","symptom","Feeling Hot"],["Constipation","constipation","symptom","Slow Bowels|Infrequent Stools"],["Brittle Nails","brittle-nails","symptom","Weak Nails|Splitting Nails"],["Puffy Face","puffy-face","symptom","Facial Swelling|Facial Edema|Myxedema"],["Bulging Eyes","bulging-eyes","symptom","Exophthalmos|Proptosis"],["Heart Palpitations","heart-palpitations","symptom","Fluttering Heart|Pounding Heart"],["Tachycardia","tachycardia","symptom","Fast Heart Rate"],["Bradycardia","bradycardia","symptom","Slow Heart Rate"],["Tremors","tremors","symptom","Shaking|Hand Tremors"],["Anxiety","anxiety","symptom","Hormonal Anxiety"],["Depression","depression","symptom","Low Mood|Hormonal Depression"],["Mood Swings","mood-swings","symptom","Emotional Lability"],["Insomnia","insomnia","symptom","Sleeplessness|Sleep Disturbance"],["Night Sweats","night-sweats","symptom","Nocturnal Sweating"],["Hot Flashes","hot-flashes","symptom","Vasomotor Symptoms|VMS|Hot Flushes"],["Menstrual Irregularities","irregular-periods","symptom","Irregular Periods|Menstrual Cycle Changes"],["Heavy Periods","heavy-periods-menorrhagia","symptom","Menorrhagia|Heavy Menstrual Bleeding|HMB"],["Infertility","infertility","symptom","Trouble Conceiving|Subfertility"],["Muscle Weakness","muscle-weakness","symptom","Proximal Muscle Weakness"],["Joint Pain","joint-pain","symptom","Arthralgia"],["Hoarseness","hoarseness","symptom","Raspy Voice|Voice Changes"],["Neck Swelling","neck-swelling","symptom","Neck Lump|Anterior Neck Fullness"],["Memory Issues","memory-issues","symptom","Forgetfulness|Memory Loss"],["Hormonal Acne","acne-hormonal","symptom","Adult Acne|Cystic Acne"],["Hirsutism","hirsutism-symptom","symptom","Excess Facial Hair|Male-Pattern Hair Growth"],["Bloating","bloating","symptom","Abdominal Bloating|Gas"],["Edema","edema","symptom","Water Retention|Swelling"],["Low Body Temperature","low-body-temperature","symptom","Hypothermia|Cool Basal Temperature"],["Thinning Eyebrows","thinning-eyebrows","symptom","Loss of Outer Eyebrow|Lateral Eyebrow Thinning|Queen Anne's Sign"],["Sugar Cravings","sugar-cravings","symptom","Carb Cravings"],["Irritability","irritability","symptom","Rage|Short Temper"],["Vaginal Dryness","vaginal-dryness","symptom","Genitourinary Syndrome of Menopause|GSM"],["Difficulty Swallowing","difficulty-swallowing","symptom","Dysphagia"],["Levothyroxine","levothyroxine","medication","L-Thyroxine|T4"],["Synthroid","synthroid","medication","Brand-name levothyroxine"],["Tirosint","tirosint","medication","Liquid-filled capsule levothyroxine"],["Levoxyl","levoxyl","medication","Brand-name levothyroxine"],["Liothyronine","liothyronine","medication","T3|Synthetic T3"],["Cytomel","cytomel","medication","Brand-name liothyronine"],["Natural Desiccated Thyroid","natural-desiccated-thyroid","medication","NDT|Desiccated Thyroid Extract|DTE"],["Armour Thyroid","armour-thyroid","medication","Branded NDT"],["NP Thyroid","np-thyroid","medication","Acella NP Thyroid"],["WP Thyroid","wp-thyroid","medication","Nature-Throid (historical)"],["Compounded T3/T4","compounded-t3-t4","medication","Compounded Thyroid Medication"],["Methimazole","methimazole","medication","Tapazole|MMI"],["Propylthiouracil","propylthiouracil","medication","PTU"],["Beta Blockers","beta-blockers","medication","Beta-Adrenergic Blockers"],["Propranolol","propranolol","medication","Inderal"],["Atenolol","atenolol","medication","Tenormin"],["Semaglutide","semaglutide","medication","GLP-1 receptor agonist"],["Ozempic","ozempic","medication","Branded semaglutide (injectable, for diabetes)"],["Wegovy","wegovy","medication","Branded semaglutide (higher-dose, for weight loss)"],["Rybelsus","rybelsus","medication","Oral semaglutide"],["Tirzepatide","tirzepatide","medication","GIP/GLP-1 receptor agonist"],["Mounjaro","mounjaro","medication","Branded tirzepatide (for diabetes)"],["Zepbound","zepbound","medication","Branded tirzepatide (for weight loss)"],["Liraglutide","liraglutide","medication","Branded GLP-1 (Saxenda, Victoza)"],["Saxenda","saxenda","medication","Branded liraglutide (for weight loss)"],["Victoza","victoza","medication","Branded liraglutide (for diabetes)"],["GLP-1 Agonists","glp-1-agonists","medication","GLP-1 receptor agonists|GLP-1 RA"],["Compounded Semaglutide","compounded-semaglutide","medication","Compounded GLP-1"],["Metformin","metformin","medication","Glucophage"],["Low Dose Naltrexone","low-dose-naltrexone","medication","LDN"],["Bioidentical Hormone Replacement Therapy","bioidentical-hormone-replacement-therapy","medication","BHRT|Bioidentical HRT"],["Estradiol","estradiol","medication","E2|Oral/Transdermal Estrogen|Vaginal Estrogen"],["Progesterone (Bioidentical)","progesterone-bioidentical","medication","Oral Micronized Progesterone|Prometrium"],["Testosterone Therapy for Women","testosterone-therapy-women","medication","Female Testosterone Replacement|Low-Dose T Therapy"],["DHEA","dhea","medication","Dehydroepiandrosterone"],["Spironolactone","spironolactone","medication","Aldactone"],["Oral Contraceptives","birth-control-pills","medication","Birth Control Pills|The Pill|OCPs|Combined Hormonal Contraceptives"],["Clomiphene","clomiphene","medication","Clomid|Clomiphene Citrate"],["Anastrozole","anastrozole","medication","Arimidex"],["Selenium","selenium","supplement","Selenomethionine"],["Iodine Supplement","iodine-supplement","supplement","Potassium Iodide|Iodide"],["Zinc","zinc","supplement","Zinc Picolinate|Zinc Citrate"],["Magnesium","magnesium","supplement","Mg|Magnesium Glycinate|Magnesium Citrate"],["Vitamin D","vitamin-d","supplement","Vitamin D3|Cholecalciferol|25-OH Vitamin D"],["Vitamin B12","vitamin-b12","supplement","Cobalamin|Methylcobalamin"],["Iron / Ferritin Support","iron-ferritin-support","supplement","Iron Bisglycinate|Ferrous Sulfate"],["Tyrosine","tyrosine","supplement","L-Tyrosine"],["Ashwagandha","ashwagandha","supplement","Withania somnifera|Indian Ginseng"],["Rhodiola","rhodiola","supplement","Rhodiola rosea|Arctic Root"],["Myo-Inositol","myo-inositol","supplement","Inositol"],["D-Chiro-Inositol","d-chiro-inositol","supplement","DCI"],["DIM","dim","supplement","Diindolylmethane"],["Berberine","berberine","supplement","Berberine HCl"],["N-Acetyl Cysteine","nac","supplement","NAC"],["Glutathione","glutathione","supplement","GSH|Liposomal Glutathione"],["Omega-3 Fatty Acids","omega-3-fatty-acids","supplement","Fish Oil|EPA/DHA"],["CoQ10","coq10","supplement","Coenzyme Q10|Ubiquinol"],["L-Carnitine","l-carnitine","supplement","Acetyl-L-Carnitine|ALCAR"],["Methylfolate","methylfolate","supplement","5-MTHF|L-Methylfolate|Active Folate"],["Chromium","chromium","supplement","Chromium Picolinate"],["Vitex","vitex","supplement","Chasteberry|Vitex agnus-castus"],["Maca Root","maca-root","supplement","Lepidium meyenii"],["Black Cohosh","black-cohosh","supplement","Actaea racemosa"],["Curcumin","curcumin","supplement","Turmeric Extract"],["Probiotics","probiotics","supplement","Beneficial Bacteria"],["TSH","tsh","lab","Thyroid Stimulating Hormone|Thyrotropin"],["Free T4","free-t4","lab","FT4|Free Thyroxine"],["Free T3","free-t3","lab","FT3|Free Triiodothyronine"],["Total T3","total-t3","lab","TT3"],["Total T4","total-t4","lab","TT4"],["Reverse T3","reverse-t3","lab","rT3"],["TPO Antibodies","tpo-antibodies","lab","Thyroid Peroxidase Antibodies|Anti-TPO|TPOAb"],["Thyroglobulin Antibodies","thyroglobulin-antibodies","lab","TgAb|Anti-Tg"],["TSI","tsi","lab","Thyroid Stimulating Immunoglobulin"],["TRAb","trab","lab","TSH Receptor Antibodies"],["Thyroid Ultrasound","thyroid-ultrasound","lab","Thyroid Sonogram"],["Radioactive Iodine Uptake","radioactive-iodine-uptake","lab","RAIU|I-123 Uptake Scan"],["Full Thyroid Panel","full-thyroid-panel","lab","Complete Thyroid Panel|Comprehensive Thyroid Panel"],["HbA1c","hba1c","lab","Hemoglobin A1c|Glycated Hemoglobin|A1c"],["Fasting Insulin","fasting-insulin","lab","Insulin Level"],["Fasting Glucose","fasting-glucose","lab","Fasting Blood Sugar|FBG"],["Cortisol (AM)","cortisol-am","lab","Morning Cortisol|Serum Cortisol"],["DUTCH Test","dutch-test","lab","Dried Urine Test for Comprehensive Hormones"],["Sex Hormone Binding Globulin","shbg","lab","SHBG"],["Estradiol (Lab)","estradiol-lab","lab","Serum E2"],["Progesterone (Lab)","progesterone-lab","lab","Serum Progesterone"],["Testosterone (Total & Free)","testosterone-total-free","lab","Total Testosterone|Free Testosterone"],["DHEA-S","dhea-s","lab","DHEA Sulfate|Dehydroepiandrosterone Sulfate"],["FSH","fsh","lab","Follicle Stimulating Hormone"],["LH","lh","lab","Luteinizing Hormone"],["Prolactin","prolactin","lab","PRL"],["hs-CRP","hs-crp","lab","High-Sensitivity C-Reactive Protein"],["Homocysteine","homocysteine","lab","Hcy"],["Comprehensive Metabolic Panel","comprehensive-metabolic-panel","lab","CMP"],["Lipid Panel","lipid-panel","lab","Cholesterol Panel"],["Vitamin D (Lab)","vitamin-d-lab","lab","25-Hydroxy Vitamin D|25-OH D"],["Ferritin","ferritin","lab","Serum Ferritin"],["Thyroidectomy","thyroidectomy","procedure","Thyroid Surgery|Total Thyroidectomy"],["Thyroid Lobectomy","thyroid-lobectomy","procedure","Hemithyroidectomy|Partial Thyroidectomy"],["Radioactive Iodine Ablation","radioactive-iodine-ablation","procedure","RAI|I-131 Therapy"],["Fine Needle Aspiration","fine-needle-aspiration","procedure","FNA|Thyroid Biopsy"],["Hormone Pellet Insertion","hormone-pellet-insertion","procedure","Pellet Therapy|Subcutaneous Hormone Pellets"],["T4 to T3 Conversion","t4-to-t3-conversion","concept","Thyroid Hormone Conversion|Peripheral Deiodination"],["HPA Axis","hpa-axis","concept","Hypothalamic-Pituitary-Adrenal Axis"],["Functional Range vs Reference Range","functional-range-vs-reference-range","concept","Optimal Range"],["Functional Medicine","functional-medicine","concept","Root-Cause Medicine|Integrative Medicine"],["Goitrogens","goitrogens","concept","Thyroid-Blocking Foods (common term)"],["Gluten and Thyroid","gluten-and-thyroid","concept","Gluten-Thyroid Connection"],["Leaky Gut","leaky-gut","concept","Intestinal Permeability"],["Gut-Thyroid Connection","gut-thyroid-connection","concept","Gut-Thyroid Axis"],["Estrogen Metabolism","estrogen-metabolism","concept","Estrogen Detoxification"],["Bioidentical vs Synthetic Hormones","bioidentical-vs-synthetic-hormones","concept",""],["Hormone Replacement Therapy","hormone-replacement-therapy","concept","HRT|Menopausal Hormone Therapy|MHT"],["Compounding Pharmacy","compounding-pharmacy","concept","Compounded Medications"],["Cortisol Rhythm","cortisol-rhythm","concept","Diurnal Cortisol|Cortisol Curve"],["Thyroid-Adrenal Connection","thyroid-adrenal-connection","concept","Thyroid-Adrenal Axis"]];
  var CATS = {
    condition:'Condition', symptom:'Symptom', medication:'Medication',
    supplement:'Supplement', lab:'Lab or Test', procedure:'Procedure', concept:'Concept'
  };

  function getParams() {
    var p = new URLSearchParams(location.search);
    return {
      query: (p.get('query') || p.get('q') || '').trim(),
      category: (p.get('category') || '').trim().toLowerCase()
    };
  }

  function fixCategoryLinks() {
    document.querySelectorAll('a[href^="/search?query="]').forEach(function(a){
      try {
        var u = new URL(a.href);
        var q = u.searchParams.get('query');
        if (q && CATS[q]) a.setAttribute('href', '/directory?category=' + q);
      } catch(e){}
    });
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
    });
  }

  function search(q, category) {
    var ql = q.toLowerCase();
    var hasQ = ql.length > 0, hasC = !!category;
    var matches = [];
    INDEX.forEach(function(row){
      var name = row[0], slug = row[1], cat = row[2], aliases = row[3];
      if (hasC && cat !== category) return;
      if (hasQ) {
        var nl = name.toLowerCase();
        var al = aliases.toLowerCase();
        var nameIdx = nl.indexOf(ql);
        var aliasIdx = al.indexOf(ql);
        if (nameIdx < 0 && aliasIdx < 0) return;
        var matchedAlias = null;
        if (nameIdx < 0 && aliasIdx >= 0) {
          var parts = aliases.split('|');
          for (var i=0; i<parts.length; i++) {
            if (parts[i].toLowerCase().indexOf(ql) >= 0) { matchedAlias = parts[i]; break; }
          }
        }
        var rank = nameIdx === 0 ? 0 : (nameIdx > 0 ? 1 : 2);
        matches.push({rank: rank, name:name, slug:slug, cat:cat, alias: matchedAlias});
      } else {
        matches.push({rank: 0, name:name, slug:slug, cat:cat, alias: null});
      }
    });
    matches.sort(function(a,b){ return a.rank - b.rank || a.name.localeCompare(b.name); });
    return matches;
  }

  function renderResults(params) {
    var results = search(params.query, params.category);
    var heading;
    if (params.query && params.category) {
      heading = 'Results for “' + params.query + '” in ' + (CATS[params.category] || params.category);
    } else if (params.query) {
      heading = 'Results for “' + params.query + '”';
    } else if (params.category) {
      heading = (CATS[params.category] || params.category);
    } else { return; }

    var container = document.getElementById('mtc-results');
    if (!container) {
      container = document.createElement('div');
      container.id = 'mtc-results';
      container.className = 'mtc-results';
      var hero = document.querySelector('.dir-home__hero');
      if (hero && hero.parentElement) {
        hero.parentElement.insertBefore(container, hero.nextSibling);
      } else {
        document.body.appendChild(container);
      }
    }

    var body;
    if (results.length === 0) {
      body = '<p class="mtc-results__empty">No directory entries match. Try a different word, or <a href="/directory">browse all categories</a>.</p>';
    } else {
      body = '<div class="mtc-results__grid">' + results.map(function(r){
        var pill = '<span class="mtc-results__pill">' + escapeHtml(CATS[r.cat] || r.cat) + '</span>';
        var alias = r.alias ? '<span class="mtc-results__alias">match: ' + escapeHtml(r.alias) + '</span>' : '';
        return '<a class="mtc-results__card" href="/directory/' + encodeURIComponent(r.slug) + '">' +
          '<div class="mtc-results__name">' + escapeHtml(r.name) + '</div>' +
          '<div class="mtc-results__meta">' + pill + alias + '</div>' +
        '</a>';
      }).join('') + '</div>';
    }

    container.innerHTML =
      '<div class="mtc-results__head">' +
        '<h2 class="mtc-results__title">' + escapeHtml(heading) + '</h2>' +
        '<span class="mtc-results__count">' + results.length + ' result' + (results.length === 1 ? '' : 's') + '</span>' +
        '<a class="mtc-results__clear" href="/directory">Clear</a>' +
      '</div>' + body;

    document.body.classList.add('mtc-results-mode');
  }

  function bindSearchForm() {
    var form = document.querySelector('.dir-home__search form');
    if (!form) return;
    var btn = form.querySelector('input[type="submit"]');
    if (btn) btn.value = 'Search';
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var input = form.querySelector('input[type="search"]');
      var v = input ? input.value.trim() : '';
      if (!v) return;
      location.assign('/directory?query=' + encodeURIComponent(v));
    });
  }

  function initDirectoryPage(){
    fixCategoryLinks();
    bindSearchForm();
    var params = getParams();
    var inp = document.querySelector('.dir-home__search input[type="search"]');
    if (inp && params.query) inp.value = params.query;
    if (params.query || params.category) renderResults(params);
  }

  // ===== /search page handler =====
  function renderDirectoryMatchesOnSearchPage(query) {
    var native = document.querySelector('.search-result-items');
    if (!native) return;

    // De-duplicate: if the native search already returned a /directory/ link,
    // we still surface it via our own card (same target) and remove the native
    // duplicate so each entry shows once at the top.
    Array.from(native.children).forEach(function(child){
      var a = child.querySelector('a[href^="/directory/"]');
      if (a) child.remove();
    });

    var matches = search(query, '');

    // Limit to 12 to keep the page balanced; users can click through to /directory for more.
    var cap = 12;
    var top = matches.slice(0, cap);

    var container = document.createElement('div');
    container.id = 'mtc-results';
    container.className = 'mtc-results';

    var heading = 'Directory entries for “' + query + '”';
    var moreLink = matches.length > cap
      ? ' · <a class="mtc-results__clear" href="/directory?query=' + encodeURIComponent(query) + '">View all ' + matches.length + ' in the directory →</a>'
      : '';

    if (matches.length === 0) {
      container.innerHTML =
        '<div class="mtc-results__head">' +
          '<h2 class="mtc-results__title">' + escapeHtml(heading) + '</h2>' +
          '<span class="mtc-results__count">0 results</span>' +
        '</div>' +
        '<p class="mtc-results__empty">No directory entries match. <a href="/directory">Browse the full directory →</a></p>';
    } else {
      var grid = top.map(function(r){
        var pill = '<span class="mtc-results__pill">' + escapeHtml(CATS[r.cat] || r.cat) + '</span>';
        var alias = r.alias ? '<span class="mtc-results__alias">match: ' + escapeHtml(r.alias) + '</span>' : '';
        return '<a class="mtc-results__card" href="/directory/' + encodeURIComponent(r.slug) + '">' +
          '<div class="mtc-results__name">' + escapeHtml(r.name) + '</div>' +
          '<div class="mtc-results__meta">' + pill + alias + '</div>' +
        '</a>';
      }).join('');
      container.innerHTML =
        '<div class="mtc-results__head">' +
          '<h2 class="mtc-results__title">' + escapeHtml(heading) + '</h2>' +
          '<span class="mtc-results__count">' + matches.length + ' result' + (matches.length === 1 ? '' : 's') + moreLink + '</span>' +
        '</div>' +
        '<div class="mtc-results__grid">' + grid + '</div>';
    }

    native.parentElement.insertBefore(container, native);

    // Header for the remaining (non-directory) site results.
    var hasOther = native.children.length > 0;
    var otherHead = document.createElement('h3');
    otherHead.className = 'mtc-other-results-head';
    otherHead.textContent = hasOther ? 'Other pages on the site' : 'Other pages on the site';
    native.parentElement.insertBefore(otherHead, native);
    if (!hasOther) {
      var none = document.createElement('p');
      none.className = 'mtc-no-other-results';
      none.textContent = 'No other pages match — only directory entries above.';
      native.parentElement.insertBefore(none, native);
    }
  }

  function initSearchPage(){
    document.body.classList.add('mtc-search-page');
    var p = new URLSearchParams(location.search);
    var q = (p.get('query') || p.get('q') || '').trim();
    if (!q) return;
    // The native search injects results asynchronously after the page loads.
    // Poll briefly for `.search-result-items` to be populated, then enrich.
    var tries = 0;
    var poll = setInterval(function(){
      tries++;
      var native = document.querySelector('.search-result-items');
      var ready = native && (native.children.length > 0 || tries > 20);
      if (ready) {
        clearInterval(poll);
        renderDirectoryMatchesOnSearchPage(q);
      } else if (tries > 30) {
        clearInterval(poll);
        // Render anyway, even without native results.
        if (native) renderDirectoryMatchesOnSearchPage(q);
      }
    }, 200);
  }

  function init(){
    var path = location.pathname.replace(/\/$/, '');
    if (path === '/directory') {
      initDirectoryPage();
    } else if (path === '/search') {
      initSearchPage();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

