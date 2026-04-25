/*! MTC directory + search behavior — built from webflow/directory-page-embed.html */
(function(){
  var s = document.createElement('style');
  s.id = 'mtc-directory-styles';
  s.textContent = "\n  /* MTC brand tokens (mirrors CSS variables on modernthyroidclinic.com)\n       --teal-dark      #376c74   primary brand teal\n       --dark-salmon    #dda792   primary CTA bg (Book Appointment pattern)\n       --peru           #af8264   CTA hover border / brown accent\n       --cadet-blue     #bad1d5   light teal\n       --midnight-blue  #1a1f36   primary text\n       --slate-grey     #5a727c   muted text\n       Headings: Playfair Display, Georgia, serif\n       Body:     Source Sans Pro, Inter, system-ui, sans-serif\n  */\n\n  /* ===== /directory hero search bar ===== */\n  .dir-home__search { display: block; width: 100%; max-width: 720px; font-family: \"Source Sans Pro\", Inter, system-ui, sans-serif; }\n  .dir-home__search form { display: flex !important; flex-wrap: wrap; gap: 0.5rem; align-items: stretch; margin: 0; }\n  .dir-home__search form input[type=\"search\"] {\n    flex: 1 1 280px; min-width: 0; height: auto;\n    padding: 0.875rem 1rem; font-size: 1rem; line-height: 1.4;\n    font-family: \"Source Sans Pro\", Inter, system-ui, sans-serif;\n    border: 1px solid #c6d3cf; border-radius: 0.5rem; background: #fff; color: #1a1f36;\n    box-shadow: 0 1px 2px rgba(26,31,54,0.04);\n  }\n  .dir-home__search form input[type=\"search\"]::placeholder { color: #5a727c; }\n  .dir-home__search form input[type=\"search\"]:focus {\n    outline: none; border-color: #376c74; box-shadow: 0 0 0 3px rgba(55,108,116,0.18);\n  }\n  .dir-home__search form input[type=\"submit\"] {\n    flex: 0 0 auto; padding: 0.875rem 1.75rem; font-size: 1rem; font-weight: 600;\n    font-family: \"Source Sans Pro\", Inter, system-ui, sans-serif;\n    background: #dda792; color: #fff; border: 1px solid transparent; border-radius: 4px; cursor: pointer;\n    transition: background 0.15s, color 0.15s, border-color 0.15s;\n    line-height: 1.4; letter-spacing: 0.01em;\n  }\n  .dir-home__search form input[type=\"submit\"]:hover {\n    background: transparent; color: #af8264; border-color: #af8264;\n  }\n  .dir-home__search .w-form-done, .dir-home__search .w-form-fail { display: none !important; }\n\n  /* ===== /search page (site-wide search) ===== */\n  body.mtc-search-page .w-form { max-width: 720px; }\n  body.mtc-search-page .w-form form { display: flex !important; flex-wrap: wrap; gap: 0.5rem; align-items: stretch; margin: 0; }\n  body.mtc-search-page .w-form input[type=\"search\"] {\n    flex: 1 1 280px; min-width: 0; height: auto;\n    padding: 0.875rem 1rem; font-size: 1rem; line-height: 1.4;\n    font-family: \"Source Sans Pro\", Inter, system-ui, sans-serif;\n    border: 1px solid #c6d3cf; border-radius: 0.5rem; background: #fff; color: #1a1f36;\n    box-shadow: 0 1px 2px rgba(26,31,54,0.04);\n  }\n  body.mtc-search-page .w-form input[type=\"search\"]:focus {\n    outline: none; border-color: #376c74; box-shadow: 0 0 0 3px rgba(55,108,116,0.18);\n  }\n  body.mtc-search-page .w-form input[type=\"submit\"] {\n    flex: 0 0 auto; padding: 0.875rem 1.75rem; font-size: 1rem; font-weight: 600;\n    font-family: \"Source Sans Pro\", Inter, system-ui, sans-serif;\n    background: #dda792; color: #fff; border: 1px solid transparent; border-radius: 4px; cursor: pointer;\n    transition: background 0.15s, color 0.15s, border-color 0.15s; line-height: 1.4;\n  }\n  body.mtc-search-page .w-form input[type=\"submit\"]:hover {\n    background: transparent; color: #af8264; border-color: #af8264;\n  }\n  body.mtc-search-page .search-result-items > div {\n    padding: 1rem 0; border-bottom: 1px solid #e3ebed;\n  }\n  body.mtc-search-page .search-result-items > div:last-child { border-bottom: none; }\n  body.mtc-search-page .search-result-items > div > a:first-child {\n    display: block; font-weight: 600; color: #376c74; font-size: 1.05rem; margin-bottom: 0.25rem;\n    font-family: \"Playfair Display\", Georgia, serif;\n    text-decoration: none;\n  }\n  body.mtc-search-page .search-result-items > div > a:first-child:hover { text-decoration: underline; }\n  body.mtc-search-page .search-result-items > div > div { font-size: 0.8rem; color: #5a727c; margin-bottom: 0.4rem; word-break: break-all; }\n  body.mtc-search-page .search-result-items > div > p { font-size: 0.92rem; color: #1a1f36; margin: 0; line-height: 1.5; font-family: \"Source Sans Pro\", Inter, system-ui, sans-serif; }\n  /* Section header above native results */\n  .mtc-other-results-head {\n    margin: 2rem 0 0.5rem; padding-bottom: 0.5rem;\n    border-bottom: 1px solid #e3ebed;\n    font-size: 1.15rem; font-weight: 700; color: #1a1f36;\n    font-family: \"Playfair Display\", Georgia, serif;\n  }\n  .mtc-no-other-results { color: #5a727c; font-size: 0.95rem; padding: 0.5rem 0 1rem; }\n\n  /* ===== Results section ===== */\n  .mtc-results { margin: 2.5rem auto 3rem; max-width: 1100px; padding: 0 1.25rem; font-family: \"Source Sans Pro\", Inter, system-ui, sans-serif; }\n  .mtc-results__head {\n    display: flex; align-items: baseline; gap: 1rem; flex-wrap: wrap;\n    margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid #e3ebed;\n  }\n  .mtc-results__title { font-size: 1.75rem; font-weight: 700; margin: 0; color: #1a1f36; font-family: \"Playfair Display\", Georgia, serif; letter-spacing: -0.01em; }\n  .mtc-results__count { color: #5a727c; font-size: 0.95rem; }\n  .mtc-results__clear { margin-left: auto; color: #376c74; font-size: 0.9rem; text-decoration: underline; cursor: pointer; }\n  .mtc-results__clear:hover { color: #af8264; }\n  .mtc-results__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 0.75rem; }\n  .mtc-results__card {\n    display: block; padding: 1rem 1.1rem;\n    border: 1px solid #e3ebed; border-radius: 0.6rem; background: #fff;\n    text-decoration: none !important; color: inherit;\n    transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;\n  }\n  .mtc-results__card:hover {\n    border-color: #376c74; transform: translateY(-1px);\n    box-shadow: 0 4px 12px rgba(55,108,116,0.12);\n  }\n  .mtc-results__name { font-weight: 600; color: #376c74; font-size: 1.05rem; line-height: 1.3; font-family: \"Playfair Display\", Georgia, serif; }\n  .mtc-results__meta { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.45rem; flex-wrap: wrap; }\n  .mtc-results__pill {\n    display: inline-block; font-size: 0.7rem; font-weight: 600;\n    text-transform: uppercase; letter-spacing: 0.04em; color: #376c74;\n    background: #e3ebed; padding: 0.22rem 0.6rem; border-radius: 999px;\n  }\n  .mtc-results__alias { font-size: 0.82rem; color: #5a727c; font-style: italic; }\n  .mtc-results__empty { text-align: center; color: #5a727c; padding: 2.5rem 1rem; font-size: 1rem; }\n  .mtc-results__empty a { color: #376c74; text-decoration: underline; }\n\n  /* In results mode, hide marketing sections so results take focus */\n  body.mtc-results-mode .dir-home__categories,\n  body.mtc-results-mode .dir-home__featured,\n  body.mtc-results-mode .dir-home__faq { display: none !important; }\n";
  (document.head || document.documentElement).appendChild(s);
})();

(function(){
  var INDEX = [["Acromegaly","acromegaly","condition","Growth Hormone Excess"],["Adrenal Fatigue","adrenal-fatigue","concept","HPA Axis Dysfunction|Adrenal Dysfunction"],["Adrenal Insufficiency","adrenal-insufficiency","condition","Addison's Disease|Primary Adrenal Insufficiency"],["Anastrozole","anastrozole","medication","Arimidex"],["Andropause","andropause","condition","Male Menopause|Low T|Late-Onset Hypogonadism"],["Anxiety","anxiety","symptom","Hormonal Anxiety"],["Armour Thyroid","armour-thyroid","medication","Branded NDT"],["Ashwagandha","ashwagandha","supplement","Withania somnifera|Indian Ginseng"],["Atenolol","atenolol","medication","Tenormin"],["Berberine","berberine","supplement","Berberine HCl"],["Beta Blockers","beta-blockers","medication","Beta-Adrenergic Blockers"],["Bioidentical Hormone Replacement Therapy","bioidentical-hormone-replacement-therapy","medication","BHRT|Bioidentical HRT"],["Bioidentical vs Synthetic Hormones","bioidentical-vs-synthetic-hormones","concept",""],["Black Cohosh","black-cohosh","supplement","Actaea racemosa"],["Bloating","bloating","symptom","Abdominal Bloating|Gas"],["Bradycardia","bradycardia","symptom","Slow Heart Rate"],["Brain Fog","brain-fog","symptom","Mental Fog|Cognitive Dysfunction"],["Brittle Nails","brittle-nails","symptom","Weak Nails|Splitting Nails"],["Bulging Eyes","bulging-eyes","symptom","Exophthalmos|Proptosis"],["Chromium","chromium","supplement","Chromium Picolinate"],["Clomiphene","clomiphene","medication","Clomid|Clomiphene Citrate"],["Cold Intolerance","cold-intolerance","symptom","Feeling Cold|Cold Hands and Feet"],["Compounded Semaglutide","compounded-semaglutide","medication","Compounded GLP-1"],["Compounded T3/T4","compounded-t3-t4","medication","Compounded Thyroid Medication"],["Compounding Pharmacy","compounding-pharmacy","concept","Compounded Medications"],["Comprehensive Metabolic Panel","comprehensive-metabolic-panel","lab","CMP"],["Congenital Hypothyroidism","congenital-hypothyroidism","condition","Cretinism (historical term)"],["Constipation","constipation","symptom","Slow Bowels|Infrequent Stools"],["CoQ10","coq10","supplement","Coenzyme Q10|Ubiquinol"],["Cortisol (AM)","cortisol-am","lab","Morning Cortisol|Serum Cortisol"],["Cortisol Rhythm","cortisol-rhythm","concept","Diurnal Cortisol|Cortisol Curve"],["Cracked Heels","cracked-heels","symptom","Cracked Feet|Heel Fissures"],["Curcumin","curcumin","supplement","Turmeric Extract"],["Cushing's Syndrome","cushings-syndrome","condition","Hypercortisolism"],["Cytomel","cytomel","medication","Brand-name liothyronine"],["D-Chiro-Inositol","d-chiro-inositol","supplement","DCI"],["Depression","depression","symptom","Low Mood|Hormonal Depression"],["DHEA","dhea","medication","Dehydroepiandrosterone"],["DHEA-S","dhea-s","lab","DHEA Sulfate|Dehydroepiandrosterone Sulfate"],["Difficulty Swallowing","difficulty-swallowing","symptom","Dysphagia"],["DIM","dim","supplement","Diindolylmethane"],["Dry Skin","dry-skin","symptom","Xerosis"],["DUTCH Test","dutch-test","lab","Dried Urine Test for Comprehensive Hormones"],["Dyslipidemia","dyslipidemia","condition","High Cholesterol|Hyperlipidemia"],["Edema","edema","symptom","Water Retention|Swelling"],["Endometriosis","endometriosis","condition","Endo"],["Estradiol","estradiol","medication","E2|Oral/Transdermal Estrogen|Vaginal Estrogen"],["Estradiol (Lab)","estradiol-lab","lab","Serum E2"],["Estrogen Dominance","estrogen-dominance","concept","Relative Estrogen Excess"],["Estrogen Metabolism","estrogen-metabolism","concept","Estrogen Detoxification"],["Euthyroid Sick Syndrome","euthyroid-sick-syndrome","condition","Non-Thyroidal Illness Syndrome|NTIS|Low T3 Syndrome"],["Fasting Glucose","fasting-glucose","lab","Fasting Blood Sugar|FBG"],["Fasting Insulin","fasting-insulin","lab","Insulin Level"],["Fatigue","fatigue","symptom","Chronic Fatigue|Exhaustion|Low Energy"],["Ferritin","ferritin","lab","Serum Ferritin"],["Fine Needle Aspiration","fine-needle-aspiration","procedure","FNA|Thyroid Biopsy"],["Free T3","free-t3","lab","FT3|Free Triiodothyronine"],["Free T4","free-t4","lab","FT4|Free Thyroxine"],["FSH","fsh","lab","Follicle Stimulating Hormone"],["Full Thyroid Panel","full-thyroid-panel","lab","Complete Thyroid Panel|Comprehensive Thyroid Panel"],["Functional Medicine","functional-medicine","concept","Root-Cause Medicine|Integrative Medicine"],["Functional Range vs Reference Range","functional-range-vs-reference-range","concept","Optimal Range"],["GLP-1 Agonists","glp-1-agonists","medication","GLP-1 receptor agonists|GLP-1 RA"],["Glutathione","glutathione","supplement","GSH|Liposomal Glutathione"],["Gluten and Thyroid","gluten-and-thyroid","concept","Gluten-Thyroid Connection"],["Goiter","goiter","condition","Enlarged Thyroid|Thyroid Enlargement"],["Goitrogens","goitrogens","concept","Thyroid-Blocking Foods (common term)"],["Graves' Disease","graves-disease","condition","Toxic Diffuse Goiter|Basedow's Disease"],["Gut-Thyroid Connection","gut-thyroid-connection","concept","Gut-Thyroid Axis"],["Hair Loss","hair-loss","symptom","Thinning Hair|Hair Shedding|Telogen Effluvium"],["Hashimoto's Thyroiditis","hashimotos-thyroiditis","condition","Hashimoto's Disease|Chronic Lymphocytic Thyroiditis|Autoimmune Thyroiditis"],["Hashitoxicosis","hashitoxicosis","condition","Hashitoxic Phase"],["HbA1c","hba1c","lab","Hemoglobin A1c|Glycated Hemoglobin|A1c"],["Heart Palpitations","heart-palpitations","symptom","Fluttering Heart|Pounding Heart"],["Heat Intolerance","heat-intolerance","symptom","Feeling Hot"],["Heavy Periods","heavy-periods-menorrhagia","symptom","Menorrhagia|Heavy Menstrual Bleeding|HMB"],["Hirsutism","hirsutism-symptom","symptom","Excess Facial Hair|Male-Pattern Hair Growth"],["Hoarseness","hoarseness","symptom","Raspy Voice|Voice Changes"],["Homocysteine","homocysteine","lab","Hcy"],["Hormonal Acne","acne-hormonal","symptom","Adult Acne|Cystic Acne"],["Hormone Pellet Insertion","hormone-pellet-insertion","procedure","Pellet Therapy|Subcutaneous Hormone Pellets"],["Hormone Replacement Therapy","hormone-replacement-therapy","concept","HRT|Menopausal Hormone Therapy|MHT"],["Hot Flashes","hot-flashes","symptom","Vasomotor Symptoms|VMS|Hot Flushes"],["HPA Axis","hpa-axis","concept","Hypothalamic-Pituitary-Adrenal Axis"],["hs-CRP","hs-crp","lab","High-Sensitivity C-Reactive Protein"],["Hyperparathyroidism","hyperparathyroidism","condition","Overactive Parathyroid|HPT"],["Hyperprolactinemia","hyperprolactinemia","condition","High Prolactin"],["Hyperthyroidism","hyperthyroidism","condition","Overactive Thyroid"],["Hypoparathyroidism","hypoparathyroidism","condition","Underactive Parathyroid"],["Hypopituitarism","hypopituitarism","condition","Pituitary Insufficiency"],["Hypothyroidism","hypothyroidism","condition","Underactive Thyroid|Low Thyroid"],["Infertility","infertility","symptom","Trouble Conceiving|Subfertility"],["Insomnia","insomnia","symptom","Sleeplessness|Sleep Disturbance"],["Insulin Resistance","insulin-resistance","condition","IR|Metabolic Insulin Resistance"],["Iodine Deficiency","iodine-deficiency","condition","Low Iodine"],["Iodine Supplement","iodine-supplement","supplement","Potassium Iodide|Iodide"],["Iron / Ferritin Support","iron-ferritin-support","supplement","Iron Bisglycinate|Ferrous Sulfate"],["Irritability","irritability","symptom","Rage|Short Temper"],["Joint Pain","joint-pain","symptom","Arthralgia"],["L-Carnitine","l-carnitine","supplement","Acetyl-L-Carnitine|ALCAR"],["Leaky Gut","leaky-gut","concept","Intestinal Permeability"],["Levothyroxine","levothyroxine","medication","L-Thyroxine|T4"],["Levoxyl","levoxyl","medication","Brand-name levothyroxine"],["LH","lh","lab","Luteinizing Hormone"],["Liothyronine","liothyronine","medication","T3|Synthetic T3"],["Lipid Panel","lipid-panel","lab","Cholesterol Panel"],["Liraglutide","liraglutide","medication","Branded GLP-1 (Saxenda|Victoza)"],["Low Body Temperature","low-body-temperature","symptom","Hypothermia|Cool Basal Temperature"],["Low Dose Naltrexone","low-dose-naltrexone","medication","LDN"],["Low Libido","low-libido","symptom","Low Sex Drive|Decreased Libido"],["Low Testosterone in Women","low-testosterone-women","condition","Female Androgen Deficiency"],["Maca Root","maca-root","supplement","Lepidium meyenii"],["Magnesium","magnesium","supplement","Mg|Magnesium Glycinate|Magnesium Citrate"],["Memory Issues","memory-issues","symptom","Forgetfulness|Memory Loss"],["Menopause","menopause","condition","Post-Menopause"],["Menstrual Irregularities","irregular-periods","symptom","Irregular Periods|Menstrual Cycle Changes"],["Metabolic Syndrome","metabolic-syndrome","condition","Syndrome X|Insulin Resistance Syndrome"],["Metformin","metformin","medication","Glucophage"],["Methimazole","methimazole","medication","Tapazole|MMI"],["Methylfolate","methylfolate","supplement","5-MTHF|L-Methylfolate|Active Folate"],["Mood Swings","mood-swings","symptom","Emotional Lability"],["Mounjaro","mounjaro","medication","Branded tirzepatide (for diabetes)"],["Multinodular Goiter","multinodular-goiter","condition","MNG|Nodular Goiter"],["Muscle Weakness","muscle-weakness","symptom","Proximal Muscle Weakness"],["Myo-Inositol","myo-inositol","supplement","Inositol"],["Myxedema Coma","myxedema-coma","condition","Severe Hypothyroidism"],["N-Acetyl Cysteine","nac","supplement","NAC"],["Natural Desiccated Thyroid","natural-desiccated-thyroid","medication","NDT|Desiccated Thyroid Extract|DTE"],["Neck Swelling","neck-swelling","symptom","Neck Lump|Anterior Neck Fullness"],["Night Sweats","night-sweats","symptom","Nocturnal Sweating"],["Non-Alcoholic Fatty Liver Disease","non-alcoholic-fatty-liver-disease","condition","NAFLD|MASLD|Fatty Liver"],["NP Thyroid","np-thyroid","medication","Acella NP Thyroid"],["Obesity","obesity","condition","Class I/II/III Obesity"],["Omega-3 Fatty Acids","omega-3-fatty-acids","supplement","Fish Oil|EPA/DHA"],["Oral Contraceptives","birth-control-pills","medication","Birth Control Pills|The Pill|OCPs|Combined Hormonal Contraceptives"],["Ozempic","ozempic","medication","Branded semaglutide (injectable|for diabetes)"],["Perimenopause","perimenopause","condition","Menopausal Transition|Pre-Menopause"],["Pituitary Adenoma","pituitary-adenoma","condition","Pituitary Tumor|Prolactinoma"],["PMDD","pmdd","condition","Premenstrual Dysphoric Disorder"],["PMS","pms","condition","Premenstrual Syndrome"],["Polycystic Ovary Syndrome (PCOS)","polycystic-ovary-syndrome","condition","PCOS|Polycystic Ovarian Syndrome"],["Postpartum Thyroiditis","postpartum-thyroiditis","condition","PPT"],["Prediabetes","prediabetes","condition","Impaired Fasting Glucose|Impaired Glucose Tolerance"],["Premature Ovarian Insufficiency","premature-ovarian-insufficiency","condition","POI|Premature Ovarian Failure|Early Menopause"],["Probiotics","probiotics","supplement","Beneficial Bacteria"],["Progesterone (Bioidentical)","progesterone-bioidentical","medication","Oral Micronized Progesterone|Prometrium"],["Progesterone (Lab)","progesterone-lab","lab","Serum Progesterone"],["Prolactin","prolactin","lab","PRL"],["Propranolol","propranolol","medication","Inderal"],["Propylthiouracil","propylthiouracil","medication","PTU"],["Puffy Face","facial-edema","symptom","Facial Swelling|Facial Edema|Myxedema"],["Radioactive Iodine Ablation","radioactive-iodine-ablation","procedure","RAI|I-131 Therapy"],["Radioactive Iodine Uptake","radioactive-iodine-uptake","lab","RAIU|I-123 Uptake Scan"],["Reverse T3","reverse-t3","lab","rT3"],["Rhodiola","rhodiola","supplement","Rhodiola rosea|Arctic Root"],["Rybelsus","rybelsus","medication","Oral semaglutide"],["Saxenda","saxenda","medication","Branded liraglutide (for weight loss)"],["Secondary Amenorrhea","amenorrhea","condition","Missed Periods|Absent Menstruation"],["Selenium","selenium","supplement","Selenomethionine"],["Semaglutide","semaglutide","medication","GLP-1 receptor agonist"],["Sex Hormone Binding Globulin","shbg","lab","SHBG"],["Silent Thyroiditis","silent-thyroiditis","condition","Painless Thyroiditis|Lymphocytic Thyroiditis"],["Spironolactone","spironolactone","medication","Aldactone"],["Subacute Thyroiditis","subacute-thyroiditis","condition","De Quervain's Thyroiditis|Granulomatous Thyroiditis|Painful Thyroiditis"],["Subclinical Hyperthyroidism","subclinical-hyperthyroidism","condition","Mild Hyperthyroidism"],["Subclinical Hypothyroidism","subclinical-hypothyroidism","condition","Mild Hypothyroidism|Compensated Hypothyroidism"],["Sugar Cravings","sugar-cravings","symptom","Carb Cravings"],["Synthroid","synthroid","medication","Brand-name levothyroxine"],["T4 to T3 Conversion","t4-to-t3-conversion","concept","Thyroid Hormone Conversion|Peripheral Deiodination"],["Tachycardia","tachycardia","symptom","Fast Heart Rate"],["Testosterone (Total & Free)","testosterone-total-free","lab","Total Testosterone|Free Testosterone"],["Testosterone Therapy for Women","testosterone-therapy-women","medication","Female Testosterone Replacement|Low-Dose T Therapy"],["Thinning Eyebrows","thinning-eyebrows","symptom","Loss of Outer Eyebrow|Lateral Eyebrow Thinning|Queen Anne's Sign"],["Thyroglobulin Antibodies","thyroglobulin-antibodies","lab","TgAb|Anti-Tg"],["Thyroid Cancer","thyroid-cancer","condition","Papillary Thyroid Cancer|Follicular Thyroid Cancer|Medullary Thyroid Cancer|Anaplastic Thyroid Cancer"],["Thyroid Eye Disease","thyroid-eye-disease","condition","Graves' Ophthalmopathy|TED|Graves' Eye Disease"],["Thyroid Hormone Resistance","thyroid-hormone-resistance","condition","Refetoff Syndrome|RTH"],["Thyroid Lobectomy","thyroid-lobectomy","procedure","Hemithyroidectomy|Partial Thyroidectomy"],["Thyroid Nodules","thyroid-nodules","condition","Thyroid Lumps"],["Thyroid Storm","thyroid-storm","condition","Thyrotoxic Crisis"],["Thyroid Ultrasound","thyroid-ultrasound","lab","Thyroid Sonogram"],["Thyroid-Adrenal Connection","thyroid-adrenal-connection","concept","Thyroid-Adrenal Axis"],["Thyroidectomy","thyroidectomy","procedure","Thyroid Surgery|Total Thyroidectomy"],["Thyroiditis","thyroiditis","condition","Thyroid Inflammation"],["Tirosint","tirosint","medication","Liquid-filled capsule levothyroxine"],["Tirzepatide","tirzepatide","medication","GIP/GLP-1 receptor agonist"],["Total T3","total-t3","lab","TT3"],["Total T4","total-t4","lab","TT4"],["TPO Antibodies","tpo-antibodies","lab","Thyroid Peroxidase Antibodies|Anti-TPO|TPOAb"],["TRAb","trab","lab","TSH Receptor Antibodies"],["Tremors","tremors","symptom","Shaking|Hand Tremors"],["TSH","tsh","lab","Thyroid Stimulating Hormone|Thyrotropin"],["TSI","tsi","lab","Thyroid Stimulating Immunoglobulin"],["Type 2 Diabetes","type-2-diabetes","condition","T2D|T2DM|Adult-Onset Diabetes"],["Tyrosine","tyrosine","supplement","L-Tyrosine"],["Unexplained Weight Loss","unexplained-weight-loss","symptom","Unintentional Weight Loss"],["Vaginal Dryness","vaginal-dryness","symptom","Genitourinary Syndrome of Menopause|GSM"],["Victoza","victoza","medication","Branded liraglutide (for diabetes)"],["Vitamin B12","vitamin-b12","supplement","Cobalamin|Methylcobalamin"],["Vitamin D","vitamin-d","supplement","Vitamin D3|Cholecalciferol|25-OH Vitamin D"],["Vitamin D (Lab)","vitamin-d-lab","lab","25-Hydroxy Vitamin D|25-OH D"],["Vitex","vitex","supplement","Chasteberry|Vitex agnus-castus"],["Wegovy","wegovy","medication","Branded semaglutide (higher-dose|for weight loss)"],["Weight Gain","weight-gain","symptom","Unexplained Weight Gain"],["WP Thyroid","wp-thyroid","medication","Nature-Throid (historical)"],["Zepbound","zepbound","medication","Branded tirzepatide (for weight loss)"],["Zinc","zinc","supplement","Zinc Picolinate|Zinc Citrate"]];
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

