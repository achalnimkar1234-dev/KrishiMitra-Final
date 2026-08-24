import type { GovernmentSubsidy, SubsidyCategory, Plot } from '@/types';

export const governmentSubsidies: GovernmentSubsidy[] = [
  // ==========================================
  // CATEGORY 1: SEEDS, FERTILIZERS & CROP PROTECTION
  // ==========================================
  {
    id: 'mahadbt-seeds-fertilizers-chemicals',
    name: 'MahaDBT — Subsidised Seeds, Fertilizers & Chemicals',
    marathiName: 'महाडीबीटी — अनुदानित बियाणे, खते व पीक संरक्षण औषधे',
    hindiName: 'महाडीबीटी — अनुदानित बीज, उर्वरक और फसल सुरक्षा रसायन',
    category: 'inputs',
    shortDescription: 'Financial assistance on certified/hybrid seeds, bio-fertilizers, micronutrients and crop protection inputs under NFSM and State schemes.',
    marathiDescription: 'राष्ट्रीय अन्न सुरक्षा अभियान व राज्य योजनांतर्गत प्रमाणित बियाणे, जैविक खते, सूक्ष्म अन्नद्रव्ये आणि पीक संरक्षण औषधांवर थेट अनुदान.',
    hindiDescription: 'राष्ट्रीय खाद्य सुरक्षा मिशन और राज्य योजनाओं के तहत प्रमाणित बीजों, जैव उर्वरकों, सूक्ष्म पोषक तत्वों और फसल सुरक्षा रसायनों पर वित्तीय सहायता।',
    benefit: 'Up to 50% subsidy on certified seeds (or fixed ceiling per quintal); standard input assistance for bio-fertilizers and micronutrients as per scheme norms.',
    marathiBenefit: 'प्रमाणित बियाण्यांवर ५०% पर्यंत अनुदान (किंवा प्रति क्विंटल निश्चित मर्यादा); मार्गदर्शक तत्त्वांनुसार जैविक खते व सूक्ष्म अन्नद्रव्यांवर थेट अर्थसहाय्य.',
    hindiBenefit: 'प्रमाणित बीजों पर 50% तक सब्सिडी (या प्रति क्विंटल निर्धारित सीमा); योजना मानकों के अनुसार जैव-उर्वरकों और सूक्ष्म पोषक तत्वों पर वित्तीय अनुदान।',
    eligibleFor: 'All registered farmers in Maharashtra (Small, Marginal, SC/ST, Women, General)',
    marathiEligibleFor: 'महाराष्ट्रातील सर्व नोंदणीकृत शेतकरी (अल्प, अत्यल्प, मागासवर्गीय, महिला व सर्वसाधारण)',
    hindiEligibleFor: 'महाराष्ट्र के सभी पंजीकृत किसान (लघु, सीमांत, एससी/एसटी, महिला एवं सामान्य)',
    eligibilitySummary: 'Eligibility depends on landholding category, crop variety, and current MahaDBT lottery/selection guidelines.',
    marathiEligibilitySummary: 'पात्रता जमीन धारणा, पिकाचा प्रकार आणि महाडीबीटी निवड निकषांवर अवलंबून असते.',
    hindiEligibilitySummary: 'पात्रता जोत श्रेणी, फसल के प्रकार और महाडीबीटी चयन दिशानिर्देशों पर निर्भर करती है।',
    documents: ['Aadhaar Card', '7/12 & 8A Land Extract', 'Bank Passbook / Cancelled Cheque', 'Sowing / Crop Declaration'],
    marathiDocuments: ['आधार कार्ड', '७/१२ आणि ८-अ उतारा', 'बँक पासबुक', 'पीक पेरा स्वयंघोषणापत्र'],
    hindiDocuments: ['आधार कार्ड', '7/12 और 8-ए खतौनी', 'बैंक पासबुक', 'फसल बुवाई स्व-घोषणा'],
    sourceName: 'Government of Maharashtra / MahaDBT',
    portalName: 'MahaDBT Farmer Portal',
    officialUrl: 'https://mahadbt.maharashtra.gov.in/',
    state: 'Maharashtra',
    targetCrops: ['soybean', 'wheat', 'rice', 'maize', 'jowar', 'bajra', 'groundnut', 'chana', 'tur', 'cotton'],
    irrigationRelevance: 'any',
  },
  {
    id: 'nfsm-pulses-oilseeds',
    name: 'National Food Security Mission (NFSM) — Pulses & Oilseeds Support',
    marathiName: 'राष्ट्रीय अन्न सुरक्षा अभियान (NFSM) — कडधान्य व तेलबिया सहाय्य',
    hindiName: 'राष्ट्रीय खाद्य सुरक्षा मिशन (NFSM) — दलहन एवं तिलहन सहायता',
    category: 'inputs',
    shortDescription: 'Production and distribution subsidy on high-yielding pulse and oilseed varieties, including minikits and Integrated Nutrient/Pest Management.',
    marathiDescription: 'सुधारित कडधान्य व तेलबिया वाणांच्या बियाणे वितरणावर अनुदान, मिनीकीट्स वाटप आणि एकात्मिक अन्नद्रव्य/कीड व्यवस्थापन सहाय्य.',
    hindiDescription: 'उन्नत दलहन और तिलहन किस्मों के बीज वितरण पर सब्सिडी, मिनीकिट वितरण और एकीकृत पोषक तत्व/कीट प्रबंधन प्रदर्शन सहायता।',
    benefit: 'Subsidized seed distribution, free/concessional variety minikits, and assistance for INM/IPM field demonstrations.',
    marathiBenefit: 'प्रमाणित बियाणे वाटपावर अनुदान, प्रात्यक्षिक बियाणे मिनीकीट्स आणि एकात्मिक कीड व्यवस्थापनासाठी अर्थसहाय्य.',
    hindiBenefit: 'रियायती बीज वितरण, बीज मिनीकिट और एकीकृत पोषक व कीट प्रबंधन प्रदर्शनों के लिए वित्तीय सहायता।',
    eligibleFor: 'Farmers cultivating Soybean, Tur, Chana, Groundnut, or Sunflower in notified districts of Maharashtra',
    marathiEligibleFor: 'सोयाबीन, तूर, हरभरा, भुईमूग किंवा सूर्यफूल लागवड करणारे अधिसूचित जिल्ह्यातील शेतकरी',
    hindiEligibleFor: 'महाराष्ट्र के अधिसूचित जिलों में सोयाबीन, अरहर/तूर, चना, मूंगफली या सूरजमुखी उगाने वाले किसान',
    eligibilitySummary: 'Priority for small and marginal pulse/oilseed growers under central NFSM cluster guidelines.',
    marathiEligibilitySummary: 'केंद्रीय मार्गदर्शक तत्त्वांनुसार अल्प व अत्यल्प भूधारक कडधान्य/तेलबिया उत्पादकांना प्राधान्य.',
    hindiEligibilitySummary: 'केंद्रीय दिशानिर्देशों के तहत लघु व सीमांत दलहन/तिलहन उत्पादकों को प्राथमिकता।',
    documents: ['Aadhaar Card', '7/12 Land Record', 'Bank Account linked to Aadhaar'],
    marathiDocuments: ['आधार कार्ड', '७/१२ उतारा', 'आधार संलग्न बँक खाते'],
    hindiDocuments: ['आधार कार्ड', '7/12 भू-अभिलेख', 'आधार से जुड़ा बैंक खाता'],
    sourceName: 'Ministry of Agriculture & Farmers Welfare, GoI / MahaDBT',
    portalName: 'Maharashtra Krishi Vibhag & MahaDBT',
    officialUrl: 'https://krishi.maharashtra.gov.in/',
    state: 'Maharashtra',
    targetCrops: ['soybean', 'tur', 'chana', 'groundnut', 'sunflower'],
    irrigationRelevance: 'any',
  },
  {
    id: 'soil-health-micronutrient',
    name: 'Soil Health & Micronutrient Assistance Scheme (RKVY-RAFTAAR)',
    marathiName: 'मृदा आरोग्य व सूक्ष्म अन्नद्रव्ये सहाय्य योजना (आरकेव्हीवाय)',
    hindiName: 'मृदा स्वास्थ्य एवं सूक्ष्म पोषक तत्व सहायता योजना (RKVY)',
    category: 'inputs',
    shortDescription: 'Assistance for soil ameliorants (Gypsum/Lime) and essential micronutrients (Zinc, Boron) based on Soil Health Card testing.',
    marathiDescription: 'मृदा आरोग्य पत्रिकेतील तपासणीनुसार जमिनीच्या सुपीकतेसाठी जिप्सम/चुना आणि जस्त (झिंक), बोरॉन सारख्या सूक्ष्म अन्नद्रव्यांवर अनुदान.',
    hindiDescription: 'मृदा स्वास्थ्य कार्ड परीक्षण के आधार पर मिट्टी सुधारक (जिप्सम/चूना) और आवश्यक सूक्ष्म पोषक तत्वों (जिंक, बोरॉन) पर अनुदान सहायता।',
    benefit: 'Up to 50% subsidy on soil ameliorants (Gypsum/Lime up to ₹750/ha) and bio-fertilizers/micronutrients as per approved norms.',
    marathiBenefit: 'जिप्सम/चुना खरेदीवर ५०% पर्यंत अनुदान (जास्तीत जास्त ₹७५०/हेक्टर) आणि प्रमाणित सूक्ष्म अन्नद्रव्यांवर अर्थसहाय्य.',
    hindiBenefit: 'जिप्सम/चूना पर 50% तक सब्सिडी (अधिकतम ₹750/हेक्टेयर) और अनुमोदित सूक्ष्म पोषक तत्वों पर वित्तीय सहायता।',
    eligibleFor: 'Farmers with active Soil Health Cards indicating nutrient deficiencies or soil acidity/alkalinity',
    marathiEligibleFor: 'मृदा तपासणी अहवालात अन्नद्रव्यांची कमतरता अथवा आम्ल/क्षारयुक्त जमीन आढळलेले शेतकरी',
    hindiEligibleFor: 'मृदा स्वास्थ्य कार्ड में पोषक तत्वों की कमी या समस्याग्रस्त मिट्टी वाले किसान',
    eligibilitySummary: 'Allocated based on Soil Health Card nutrient ratings and departmental target quotas.',
    marathiEligibilitySummary: 'मृदा आरोग्य पत्रिकेतील नोंदी आणि शासकीय उद्दिष्टानुसार निवड.',
    hindiEligibilitySummary: 'मृदा स्वास्थ्य परीक्षण रिपोर्ट और विभागीय आवंटन के आधार पर।',
    documents: ['Soil Health Card / Test Report', '7/12 Land Record', 'Aadhaar Card'],
    marathiDocuments: ['मृदा आरोग्य पत्रिका / तपासणी अहवाल', '७/१२ उतारा', 'आधार कार्ड'],
    hindiDocuments: ['मृदा स्वास्थ्य कार्ड / टेस्ट रिपोर्ट', '7/12 भू-अभिलेख', 'आधार कार्ड'],
    sourceName: 'Government of Maharashtra / MahaDBT',
    portalName: 'MahaDBT Farmer Portal',
    officialUrl: 'https://mahadbt.maharashtra.gov.in/',
    state: 'Maharashtra',
    targetCrops: ['soybean', 'wheat', 'sugarcane', 'cotton', 'onion', 'tomato', 'potato', 'tur', 'chana', 'groundnut', 'maize', 'rice'],
    irrigationRelevance: 'any',
  },

  // ==========================================
  // CATEGORY 2: IRRIGATION & SOLAR EQUIPMENT
  // ==========================================
  {
    id: 'pmksy-per-drop-more-crop',
    name: 'PMKSY — Per Drop More Crop (Micro-Irrigation)',
    marathiName: 'प्रधानमंत्री कृषी सिंचन योजना (PMKSY) — प्रति थेंब अधिक पीक (ठिबक व तुषार)',
    hindiName: 'प्रधानमंत्री कृषि सिंचाई योजना (PMKSY) — प्रति बूंद अधिक फसल (ड्रिप एवं स्प्रिंकलर)',
    category: 'irrigation',
    shortDescription: 'Financial subsidy for installing modern Drip and Sprinkler irrigation systems to achieve high water efficiency.',
    marathiDescription: 'पाण्याची बचत व उत्पादकतेत वाढ करण्यासाठी ठिबक व तुषार सिंचन संच बसविण्याकरिता थेट शासकीय अनुदान.',
    hindiDescription: 'पानी की बचत और उत्पादकता बढ़ाने के लिए आधुनिक ड्रिप (टपक) और स्प्रिंकलर (फव्वारा) सिंचाई प्रणालियों पर वित्तीय सब्सिडी।',
    benefit: 'Up to 55% financial assistance for Small & Marginal farmers (≤ 2 ha) and 45% for Other farmers, plus Maharashtra supplementary top-up subsidy.',
    marathiBenefit: 'अल्प व अत्यल्प भूधारक शेतकऱ्यांना ५५% पर्यंत आणि इतर शेतकऱ्यांना ४५% पर्यंत अनुदान, अधिक राज्य शासनाचे पूरक अनुदान.',
    hindiBenefit: 'लघु एवं सीमांत किसानों (≤ 2 हे.) को 55% तक तथा अन्य किसानों को 45% तक सब्सिडी, साथ में महाराष्ट्र राज्य की पूरक सब्सिडी।',
    eligibleFor: 'Landholding farmers in Maharashtra with an assured water source (Well, Borewell, Farm Pond, Canal)',
    marathiEligibleFor: 'पाण्याचा निश्चित स्त्रोत (विहीर, कूपनलिका, शेततळे, कालवा) असणारे सर्व जमीनधारक शेतकरी',
    hindiEligibleFor: 'निश्चित जल स्रोत (कुआं, नलकूप, खेत तालाब, नहर) वाले महाराष्ट्र के सभी भूमिधारक किसान',
    eligibilitySummary: 'Must have valid water source on 7/12. System must be procured from registered/approved manufacturers on MahaDBT.',
    marathiEligibilitySummary: '७/१२ वर जलस्त्रोताची नोंद असणे आवश्यक. महाडीबीटी पोर्टलवरील नोंदणीकृत कंपनीकडून खरेदी बंधनकारक.',
    hindiEligibilitySummary: '7/12 पर जल स्रोत दर्ज होना आवश्यक है। महाडीबीटी पर पंजीकृत अधिकृत डीलर से खरीद अनिवार्य।',
    documents: ['7/12 & 8A Land Extract', 'Water Source Certificate/Proof', 'Authorized Dealer Quotation', 'Aadhaar Card', 'Bank Passbook'],
    marathiDocuments: ['७/१२ आणि ८-अ उतारा', 'पाण्याचा स्त्रोत पुरावा', 'अधिकृत विक्रेत्याचे कोटेशन', 'आधार कार्ड', 'बँक पासबुक'],
    hindiDocuments: ['7/12 और 8-ए खतौनी', 'जल स्रोत प्रमाणपत्र/प्रमाण', 'अधिकृत डीलर कोटेशन', 'आधार कार्ड', 'बैंक पासबुक'],
    sourceName: 'Government of Maharashtra / MahaDBT & Ministry of Agriculture, GoI',
    portalName: 'MahaDBT PMKSY Portal',
    officialUrl: 'https://mahadbt.maharashtra.gov.in/',
    state: 'Maharashtra',
    targetCrops: ['sugarcane', 'cotton', 'onion', 'tomato', 'potato', 'soybean', 'wheat', 'groundnut', 'tur'],
    irrigationRelevance: 'any',
  },
  {
    id: 'pm-kusum-solar-pump',
    name: 'PM-KUSUM (Component B) & Mukhyamantri Saur Krushi Pump Yojana (MSKPY)',
    marathiName: 'पीएम-कुसुम (घटक ब) व मुख्यमंत्री सौर कृषी पंप योजना (MSKPY)',
    hindiName: 'पीएम-कुसुम (घटक बी) एवं मुख्यमंत्री सौर कृषि पंप योजना (MSKPY)',
    category: 'irrigation',
    shortDescription: 'Subsidized standalone Solar Agricultural Pumps (3 HP, 5 HP, 7.5 HP) for daytime irrigation without grid electricity dependency.',
    marathiDescription: 'विजेवर अवलंबून न राहता दिवसा सिंचन करण्यासाठी ३, ५ आणि ७.५ एचपी सौर कृषी पंपांवर भरघोस शासकीय अनुदान.',
    hindiDescription: 'बिजली ग्रिड पर निर्भर हुए बिना दिन में सिंचाई के लिए 3, 5 और 7.5 एचपी स्टैंडअलोन सोलर कृषि पंपों पर भारी सरकारी सब्सिडी।',
    benefit: 'Up to 90%–95% financial subsidy (Beneficiary farmer pays only 5%–10% of total system cost as farmer share).',
    marathiBenefit: '९०% ते ९५% पर्यंत शासकीय अनुदान (शेतकऱ्याला एकूण खर्चाच्या केवळ ५% ते १०% हिस्सा भरावा लागतो).',
    hindiBenefit: '90% से 95% तक वित्तीय सब्सिडी (किसान को कुल लागत का केवल 5% से 10% लाभार्थी अंशदान देना होता है)।',
    eligibleFor: 'Farmers with agricultural land & assured water source without conventional electric grid irrigation connection',
    marathiEligibleFor: 'शेतात पाण्याचा स्त्रोत उपलब्ध असणारे परंतु पारंपरिक वीज जोडणी नसलेले शेतकरी',
    hindiEligibleFor: 'खेत में जल स्रोत उपलब्ध होने के बावजूद पारंपरिक बिजली कनेक्शन न रखने वाले किसान',
    eligibilitySummary: 'Priority for off-grid, un-electrified remote plots and small/marginal/SC/ST farmers under MSKPY guidelines.',
    marathiEligibilitySummary: 'अविद्युतीकृत शेतजमीन, दुर्गम भाग आणि अल्प/अत्यल्प भूधारक व मागासवर्गीय शेतकऱ्यांना प्राधान्य.',
    hindiEligibilitySummary: 'गैर-विद्युतीकृत दूरदराज के खेतों और लघु/सीमांत/एससी/एसटी किसानों को प्राथमिकता।',
    documents: ['7/12 Land Record', 'Aadhaar Card', 'Caste Certificate (if applying under SC/ST category)', 'Bank Passbook', 'Co-owner NOC (if applicable)'],
    marathiDocuments: ['७/१२ उतारा', 'आधार कार्ड', 'जात प्रमाणपत्र (लागू असल्यास)', 'बँक पासबुक', 'सहहिस्सेदार संमतीपत्र'],
    hindiDocuments: ['7/12 भू-अभिलेख', 'आधार कार्ड', 'जाति प्रमाण पत्र (यदि लागू हो)', 'बैंक पासबुक', 'सह-खातेदार एनओसी'],
    sourceName: 'Ministry of New & Renewable Energy (MNRE), GoI & Government of Maharashtra / MSEDCL',
    portalName: 'Maharashtra Solar MSKPY Portal',
    officialUrl: 'https://www.mahadiscom.in/solar_mskpy/',
    state: 'Maharashtra',
    targetCrops: ['soybean', 'wheat', 'cotton', 'sugarcane', 'onion', 'tomato', 'potato', 'tur', 'chana', 'groundnut'],
    irrigationRelevance: 'needed',
  },
  {
    id: 'cm-sustainable-agriculture-irrigation',
    name: 'Chief Minister Sustainable Agriculture Irrigation Scheme (Farm Pond Lining)',
    marathiName: 'मुख्यमंत्री शाश्वत कृषी सिंचन योजना (शेततळे प्लास्टिक अस्तरीकरण)',
    hindiName: 'मुख्यमंत्री शाश्वत कृषि सिंचाई योजना (खेत तालाब प्लास्टिक अस्तर)',
    category: 'irrigation',
    shortDescription: 'Financial grant for 500-micron plastic lining of excavated farm ponds (Shettale) to prevent water percolation loss.',
    marathiDescription: 'शेततळ्यातील पाण्याचा पाझर रोखून संरक्षित सिंचन मिळविण्यासाठी ५०० मायक्रॉन प्लास्टिक अस्तरीकरणाकरिता थेट अनुदान.',
    hindiDescription: 'खेत तालाबों में पानी के रिसाव को रोकने और संरक्षित सिंचाई सुनिश्चित करने के लिए 500 माइक्रोन प्लास्टिक लाइनिंग पर अनुदान।',
    benefit: 'Subsidy up to 50% of cost or maximum ₹75,000 for 500-micron EPDM/HDPE farm pond plastic lining.',
    marathiBenefit: 'शेततळे प्लास्टिक अस्तरीकरणासाठी खर्चाच्या ५०% किंवा कमाल ₹७५,००० पर्यंत थेट शासकीय अनुदान.',
    hindiBenefit: 'खेत तालाब प्लास्टिक लाइनिंग के लिए लागत का 50% या अधिकतम ₹75,000 तक प्रत्यक्ष सरकारी अनुदान।',
    eligibleFor: 'Individual farmers in Maharashtra with an excavated farm pond seeking water storage preservation',
    marathiEligibleFor: 'जमिनीवर शेततळे पूर्ण झालेले व पाणी साठवण सुरक्षित करू इच्छिणारे शेतकरी',
    hindiEligibleFor: 'महाराष्ट्र के वे किसान जिनके पास खोदा गया खेत तालाब है और जो पानी का संरक्षण करना चाहते हैं',
    eligibilitySummary: 'Online application via MahaDBT followed by departmental geo-tagged field verification.',
    marathiEligibilitySummary: 'महाडीबीटी प्रणालीद्वारे अर्ज व कृषी विभागामार्फत जिओ-टॅगिंग क्षेत्रीय पडताळणी.',
    hindiEligibilitySummary: 'महाडीबीटी पोर्टल के माध्यम से आवेदन और कृषि विभाग द्वारा जियो-टैग्ड स्थलीय सत्यापन।',
    documents: ['7/12 Land Record', 'Farm Pond Geo-tagged Photo', 'Aadhaar Card', 'Bank Passbook'],
    marathiDocuments: ['७/१२ उतारा', 'शेततळे जिओ-टॅग्ड फोटो', 'आधार कार्ड', 'बँक पासबुक'],
    hindiDocuments: ['7/12 भू-अभिलेख', 'खेत तालाब जियो-टैग्ड फोटो', 'आधार कार्ड', 'बैंक पासबुक'],
    sourceName: 'Government of Maharashtra / MahaDBT',
    portalName: 'MahaDBT Farmer Portal',
    officialUrl: 'https://mahadbt.maharashtra.gov.in/',
    state: 'Maharashtra',
    targetCrops: ['soybean', 'cotton', 'jowar', 'bajra', 'tur', 'chana', 'sunflower', 'onion'],
    irrigationRelevance: 'needed',
  },
];

export function getSubsidiesByCategory(category?: SubsidyCategory): GovernmentSubsidy[] {
  if (!category) return governmentSubsidies;
  return governmentSubsidies.filter((s) => s.category === category);
}

export function isSchemeRelevantToFarm(
  scheme: GovernmentSubsidy,
  plot?: Plot | null,
  cropId?: string | null
): boolean {
  if (!plot) return false;

  // 1. Crop relevance check
  const matchesCrop =
    !cropId ||
    !scheme.targetCrops ||
    scheme.targetCrops.includes(cropId.toLowerCase());

  // 2. Irrigation relevance check
  if (scheme.category === 'irrigation') {
    if (scheme.id === 'pmksy-per-drop-more-crop') {
      // Drip / Sprinkler is relevant if the farmer has water reserve or irrigation
      return matchesCrop && (plot.hasIrrigation || plot.waterReserve === 'high' || plot.waterReserve === 'medium');
    }
    if (scheme.id === 'pm-kusum-solar-pump') {
      // Solar pump is highly relevant if plot currently lacks irrigation or has low water reserve
      return matchesCrop && (!plot.hasIrrigation || plot.waterReserve === 'low');
    }
    if (scheme.id === 'cm-sustainable-agriculture-irrigation') {
      // Farm pond lining is relevant for rainfed/medium water or dry areas
      return matchesCrop && (!plot.hasIrrigation || plot.waterReserve !== 'high');
    }
  }

  // 3. Inputs relevance check
  if (scheme.category === 'inputs') {
    if (scheme.id === 'nfsm-pulses-oilseeds') {
      const pulseOilseedCrops = ['soybean', 'tur', 'chana', 'groundnut', 'sunflower'];
      return cropId ? pulseOilseedCrops.includes(cropId.toLowerCase()) : true;
    }
    if (scheme.id === 'soil-health-micronutrient') {
      return plot.soilStatus.toLowerCase().includes('deficient') || matchesCrop;
    }
    return matchesCrop;
  }

  return matchesCrop;
}

export function getRelevantSubsidies(
  plot?: Plot | null,
  cropId?: string | null,
  category?: SubsidyCategory
): { relevant: GovernmentSubsidy[]; others: GovernmentSubsidy[] } {
  const list = getSubsidiesByCategory(category);
  const relevant: GovernmentSubsidy[] = [];
  const others: GovernmentSubsidy[] = [];

  for (const s of list) {
    if (isSchemeRelevantToFarm(s, plot, cropId)) {
      relevant.push(s);
    } else {
      others.push(s);
    }
  }

  return { relevant, others };
}
