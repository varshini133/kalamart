import { Product, Artisan, GuildRegion, OrderItem, Review, MarketplaceCategory, CraftCollection } from '../types';

export const BRAND_LOGO = '/logo.svg';

export const WELCOME_HERO_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWkbURlNLmXN-s4Zszn3mtj-j_F-g03p2g8NlwcNNNwK9zNRydwutcb33YyOj82iWxKekdrV6PaLpngb_j8VfRak2B-a-eg2L6RfXCnH1WC3YpToGrFHBbhSXLFsQTxeg3dcPEV-SUwdNFQXQjUcdJljop5ad-N572jbKR9Cvk13JHxrj9w7pjno_PvvRTcV1Gp5vtQa-1x-QvbOFnbb1SklTSWEk-hkab_EY4zLyxcqwQLbaOzPLp';

export const RAMDEV_PORTRAIT = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHgcpedYN9og1OrI5AgUGD21CNvwwr__CfJf8XXhKElzOWy_nzPgbPx3JiqF_px3nJJ_cmpZmerTmbQGpMrVHlnB1w8yB4sLquGnUskzn6YXz3KXN6t6GAJcJVS23tCd-husfCL_6B7QPGvPKN6ggbAK5mQJA6PTnkVvD6jdzcruj-1NFTD6stxcD2Fyg60R0zUuwrvl3EHHy_EQe8r18WlssaXuZ2ZU1GldZ11mwfOaVuEr_Ptol5';

export const KUTCH_POTTERY_HERO = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhMywS3Q8DFTaXnALw8d2eWclzsGtzmrmmNQMH5SAoRi075C2ZDTsjlO20BmALW4gkl2Pr-CA99QITyWWwpSvcfzR3Nwj8C44j2_ZXmlLr-4b2m8IG0AjHpMQMoMv7lpco_R-pjGdxFiJ9zrm6RElI3aMWvyDENMnLw5-zzfjog8__q8V3me8UYfxhCJqkDQ6Geam605RhdD0X2sQPSkQhESp3-5y-Xjvb5bdEDlwGpSG6I-BIlGiJ';

export const PRODUCTS: Product[] = [
  {
    id: 'kutch-kalash',
    title: 'Handcrafted Kutch Kalash Terracotta Pitcher',
    hindiTitle: 'पारंपरिक कच्छ कलश मिट्टी का घड़ा',
    price: 850,
    originalPrice: 1100,
    discount: '23% OFF',
    artisanName: 'Ramdev Kumbhar',
    artisanLocation: 'Bhuj, Kutch (Gujarat)',
    artisanRole: '5th Generation Craftsman',
    artisanExperience: '34 yrs craft mastery',
    artisanQuote: 'The clay of Kutch breathes life when shaped with mindful slowness. Each pitcher holds our family’s blessing for health and cool respite.',
    artisanImage: RAMDEV_PORTRAIT,
    category: 'Pottery',
    hindiCategory: 'मिट्टी के बर्तन',
    giTag: 'Kutch Claycraft • GI Tagged',
    giCertified: true,
    material: 'Natural Terracotta Clay',
    technique: 'Wheel-thrown & Burnished',
    craftOrigin: 'Bhuj, Kutch (Gujarat)',
    capacity: '2.2 Litres (0.58 Gal)',
    rating: 4.9,
    reviewsCount: 128,
    badge: '100% Verified Handmade',
    status: 'published',
    inStock: true,
    stockCount: 12,
    productionTime: 'Ready to ship',
    moq: 6,
    bulkPrice: 650,
    bulkOrderAvailable: true,
    productionCapacity: '180 units / month',
    approxLeadTime: '10–14 days',
    performance: { views: 1420, inquiries: 18, orders: 24, revenue: 20400, rating: 4.9, reviewsCount: 128 },
    aiPreservedData: {
      originalTitle: 'Handcrafted Kutch Kalash Terracotta Pitcher',
      originalDescription: 'Hand-turned on a traditional potter\'s wheel in Bhuj using raw saline riverbed clay.',
      culturalStory: 'Shaped with mindful slowness. Each pitcher holds blessings for health and earthen cooling.',
      autoTags: ['Terracotta', 'Kalash', 'Earthenware', 'EcoCooling', 'WaterPot'],
      suggestedFairPrice: 850,
      detectedMaterials: ['Natural Terracotta Clay', 'Wild Grass Ash']
    },
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD0VMoMX4HuHFCBWiIJcYfIiucBtcWdgHyIbYWCyMUEkqWr8J83wJGSNbBhIQv_agE9uwzj0epLMWTOq2XE3xWCiG72VZTPBVheJpq5--me4qVA9mvrX8EZAORV74OIgA8HLdQXymeVUoSZC7141glYGs5mkHr_pNPBTMF6VBg9d5LNlPpvjKh6Qni41WSLdovo-rSDm_mJijrF2lUEiTPeyCkRKpfL4h6cjwbyvewgb_Hr5LoU8gB3',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDJCaoLPFm8p8Zm08bATiHtOIXOKv1axlgXGv_t3Tn2nU0k4LcfeaAv3ouDn-AGte38MGty-IsgILHgA7ZayKH8R4m9YfOjHrv11V_3RoDzskPbcuLsuvJoMnUTQILpgMMJ_TXH4JeOlVTBw4wg3vhT7N9gbGzi-aLYb8bGlawuPZzljkNn9EtTPNHaaneefYJ0qCR2CQe5z74vhaxg4mVkvGyv_k7lSWifCnIeAfwpcOmVqGcYJA74',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBWVv2dVIh1IjcuSaFKsNW_Oixou2iwnFLbJkJsBwQv-o6n2e-Gzlng0o22UJUcFopkPZgCMS2136pe0JDjrnBlxg_lSJ5FlDf7LfhWUGi7ov5yAKWzy17pnJxHstSQXd9EBAsQUAF6YirQ471gLMLkiM6qDf5wLAd9U24F2JfXgVlD_hT5bSoBpqjUYg_HI5TCjfcBaMJ0XuOfujvQ4wVvjw72K6sZ3fNPXq43kPvCNFE5Edkflfhm'
    ],
    description: "Hand-turned on a traditional potter's wheel in Bhuj using raw saline riverbed clay, sun-cured, and slow wood-fired. Micro-porous terracotta naturally chills drinking water by 5°C without electricity while imparting essential alkaline earthen minerals.",
    howItsMade: [
      {
        step: 1,
        title: 'Riverbed Clay Harvesting & Tempering',
        description: 'Saline riverbed clay mixed with sieved sand and wild grass ash for balanced porosity.'
      },
      {
        step: 2,
        title: 'Wheel Shaping (Sacred Slow Wheel)',
        description: 'Spun entirely on stone-weighted pivot wheels without electrical speed regulation.'
      },
      {
        step: 3,
        title: 'Natural Ochre Engobe & Carving',
        description: 'Etched with needle tools and river agate stones to lock in the silky, non-chemical sheen.'
      },
      {
        step: 4,
        title: 'Underground Wood Kiln Firing',
        description: 'Baked continuously for 14 hours at 900°C using dried desert acacia boughs.'
      }
    ],
    specifications: [
      { label: 'Material', value: 'Natural Terracotta Clay' },
      { label: 'Technique', value: 'Wheel-thrown & Burnished' },
      { label: 'Craft Origin', value: 'Bhuj, Kutch (Gujarat)' },
      { label: 'Capacity', value: '2.2 Litres (0.58 Gal)' }
    ]
  },
  {
    id: 'dhokra-diya',
    title: 'Dhokra Lost-Wax Diya',
    hindiTitle: 'ढोकरा बेल-मेटल दिया',
    price: 3450,
    originalPrice: 4200,
    discount: '18% OFF',
    artisanName: 'Budhram Baghel',
    artisanLocation: 'Bastar, Chhattisgarh',
    artisanRole: 'National Award Caster',
    artisanExperience: '28 yrs master casting',
    artisanQuote: 'Every brass thread is shaped by hand with pure beeswax before being surrendered to the furnace fire.',
    category: 'Home Decor',
    giTag: 'Bastar Bell Metal • GI Certified',
    giCertified: true,
    material: '100% Brass & Bell Metal',
    technique: 'Cire-Perdue (Lost-Wax)',
    craftOrigin: 'Bastar, Chhattisgarh',
    rating: 4.8,
    reviewsCount: 94,
    badge: '100% Bell Metal',
    status: 'published',
    inStock: true,
    stockCount: 15,
    productionTime: 'Ready to ship',
    moq: 8,
    bulkPrice: 2600,
    bulkOrderAvailable: true,
    productionCapacity: '60 units / month',
    approxLeadTime: '15–20 days',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuACm8mIi0Uyd4aTu3HnJ_njyfA5deLeGBjHglHu4RT1zznER-m6K9CUbLm__DLya3sM8b6ucBwaC0mVzVGAEFYNNMXn2IHkf7l8UdP7_9lds9qCX118Q-bpd83giI20RZeoF-AQvrEaS88gXZVJ30aShJ9Uhk08G0vnpGhK3hfGavN9pNwuACAVAXARX1Fb2aZsdA6Txybiks9y3E28jsY3xY576qs3b-kR7ShzjSI35FSZ_vMtfLZ0'
    ],
    description: 'Handcrafted bell-metal Dhokra ceremonial oil lamp with coiled tribal dancers base, warm bronze sheen in editorial soft studio lighting.'
  },
  {
    id: 'jaipur-blue-urn',
    title: 'Jaipur Blue Floral Urn',
    hindiTitle: 'जयपुर ब्लू पॉटरी गुलदस्ता',
    price: 2800,
    originalPrice: 3100,
    discount: '10% OFF',
    artisanName: 'Giriraj Kripal',
    artisanLocation: 'Jaipur, Rajasthan',
    artisanRole: 'Master Quartz Potter',
    artisanExperience: '31 yrs court pottery',
    artisanQuote: 'Unlike clay, quartz faience creates an immortal ceramic body that never loses its Egyptian cobalt brilliance.',
    category: 'Pottery',
    giTag: 'Jaipur Blue Pottery • GI Certified',
    giCertified: true,
    material: 'Quartz Dough & Natural Oxides',
    technique: 'Low-fire Egyptian Faience glaze',
    craftOrigin: 'Jaipur, Rajasthan',
    rating: 4.9,
    reviewsCount: 156,
    badge: 'Quartz Ceramic',
    status: 'published',
    inStock: true,
    stockCount: 8,
    productionTime: 'Ready to ship',
    moq: 5,
    bulkPrice: 2100,
    bulkOrderAvailable: true,
    productionCapacity: '90 units / month',
    approxLeadTime: '12–16 days',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCxSQE-UUyb2zjyQ_mLIxTS1gdHc-7o8HUrFtH03mYQeJ84ex5YEvP5fUeOS-bLH1v2FyaaQiW-ciQtljymHXvXtulgL59gk0zE1_2yg5u26gccHIkF5R8f7JS_Ss_nVH-ZrTxjUEdC-Dl-doCf9QRWP42oitUjrk19ROcyvPZjfVsgs3fDzk9FDuNOMs4_SVh4GQuTJKix2f1KIxeGQgU0mmhPThV1-dkOZnGfCUlcEJQjP7pFZvMo'
    ],
    description: 'Intricate blue pottery ceramic hand-painted floral vase from Jaipur with turquoise indigo glazes resting on warm neutral linen.'
  },
  {
    id: 'chanderi-stole',
    title: 'Chanderi Zari Silk Stole',
    hindiTitle: 'चंदेरी जरी स्टोल',
    price: 4600,
    originalPrice: 5400,
    discount: '15% OFF',
    artisanName: 'Deviji Vankar',
    artisanLocation: 'Chanderi, Madhya Pradesh',
    artisanRole: 'Master Silk Weaver',
    artisanExperience: '25 yrs loom mastery',
    artisanQuote: 'Weaving Chanderi gossamer silk is like weaving morning mist with strands of sunlight.',
    category: 'Handloom',
    giTag: 'Chanderi Fabric • GI Certified',
    giCertified: true,
    material: 'Pure Silk & Zari Threads',
    technique: 'Traditional Pit-Loom Weaving',
    craftOrigin: 'Chanderi, MP',
    rating: 4.9,
    reviewsCount: 88,
    badge: 'Silk Mark Certified',
    status: 'published',
    inStock: true,
    stockCount: 10,
    productionTime: 'Ready to ship',
    moq: 4,
    bulkPrice: 3500,
    bulkOrderAvailable: true,
    productionCapacity: '40 pieces / month',
    approxLeadTime: '18–25 days',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDhs-TcyVJ5mbma1Eryu64vzrWGGdyMld4_znK317iPUDdkSVHmRWaTkRKv5SQid6CSopvK3kx4dUekYcB59H-t8f7Tmx8ntyZq-lPUI5NnaLTY1zuwX6QUTj5TBPPSeoolP1waBt8CjNfyV2yKHk0cUbwPXk4Ji48lbu5-nealQc_NePH4VD0M75DEB5NeWQ1jRK4UkGCQk3kmxTiUl5UkI73b2D7ewgSVmjdGo2obMWdBF4O1wr2T'
    ],
    description: 'Handloom Chanderi pure silk and cotton gold zari booti dupatta in soft blush lotus pink with fine sheer texture.'
  },
  {
    id: 'bastar-dhokra-choker',
    title: 'Bastar Dhokra Tribal Filigree Choker',
    hindiTitle: 'बस्तर ढोकरा जनजातीय हार',
    price: 1850,
    originalPrice: 2200,
    discount: '16% OFF',
    artisanName: 'Budhram Baghel',
    artisanLocation: 'Bastar, Chhattisgarh',
    artisanRole: 'Tribal Metal Sculptor',
    category: 'Jewelry',
    giTag: 'Bastar Bell Metal • GI Certified',
    giCertified: true,
    material: '100% Brass & Bell Metal',
    technique: 'Lost-Wax Casting & Thread Wrapping',
    craftOrigin: 'Bastar, Chhattisgarh',
    rating: 4.8,
    reviewsCount: 54,
    badge: '100% Bell Metal',
    status: 'published',
    inStock: true,
    stockCount: 9,
    productionTime: 'Ready to ship',
    moq: 10,
    bulkPrice: 1350,
    bulkOrderAvailable: true,
    productionCapacity: '120 units / month',
    approxLeadTime: '10–15 days',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAsWcldKwDj8Mw01rXmBdmyzRDM4Ofj5I17imh0cwVPLLBMm7jZ62if4P_zbz2pxVmPmWFKNzjku-4gTRCn0p5e41-kbDQo5_xel29c1TJdYypTF0BgpOgGGOiWYy3AGOGl_2GfapK_TXcLVaZ4ZEAnsWysqVL5fPBga8T27K8rRKxsdQCQ_NIbVECsV5rgqCWuSGqTRsQND9XhVhObJEbYaasKQhkoDlnkY72QEuIRCqopvV62OyzQ'
    ],
    description: 'Intricately coiled solid brass bell metal tribal choker necklace featuring ancient geometric motifs and rhythmic pendant beads.'
  },
  {
    id: 'kutch-dhabla-shawl',
    title: 'Kutch Dhabla Handwoven Desi Wool Shawl',
    hindiTitle: 'कच्छ धाबला ऊनी शॉल',
    price: 3800,
    originalPrice: 4400,
    discount: '14% OFF',
    artisanName: 'Deviji Vankar',
    artisanLocation: 'Bhujodi, Gujarat',
    artisanRole: 'National Award Weaver',
    category: 'Textiles',
    giTag: 'Kutch Shawl • GI Certified',
    giCertified: true,
    material: 'Indigenous Desi Wool',
    technique: 'Extra Weft Geometric Weave',
    craftOrigin: 'Bhujodi, Gujarat',
    rating: 4.9,
    reviewsCount: 112,
    badge: 'Desi Wool Mark',
    status: 'published',
    inStock: true,
    stockCount: 7,
    productionTime: 'Ready to ship',
    moq: 5,
    bulkPrice: 2900,
    bulkOrderAvailable: true,
    productionCapacity: '35 pieces / month',
    approxLeadTime: '20–30 days',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAoGE39LTeCYftWhk8a7F9YQEpwTzDaViru_qnSWyUqKLbtet0WxIE4wUHJFv4x-TO2DrSucNbMn_jQYiOpW5wnxqKaqJk6JIP-8lthSzH7oUeoiMHBD9WcS1kt5zhHxfUras6kAqArGFJvVyz-O1jyUttsey9LxQeOExvy9H4atQev-b8fLM9zNBv9id1zZrsZGHQLz4I8HQHUgomwlk2-BQOqZU9vD_vgTSzPIw0INoxy9KhySOA5'
    ],
    description: 'Traditional nomadic pastoral shawl handwoven on pit looms using organic sheep wool and natural indigo & madder root dyes.'
  },
  {
    id: 'madhubani-tree-of-life',
    title: 'Mithila Madhubani Tree of Life Folk Painting',
    hindiTitle: 'मिथिला मधुबनी जीवन वृक्ष चित्रकला',
    price: 2950,
    originalPrice: 3500,
    discount: '16% OFF',
    artisanName: 'Malati Devi',
    artisanLocation: 'Madhubani, Bihar',
    artisanRole: 'Senior Kachni Folk Artist',
    artisanExperience: '38 yrs ritual muralist',
    artisanQuote: 'In Madhubani, a single line connects the tree, the earth, and the divine breath of nature.',
    category: 'Traditional Art',
    giTag: 'Madhubani Art • GI Certified',
    giCertified: true,
    material: 'Handmade Lokta Paper & Forest Dyes',
    technique: 'Kachni Fine-Line Bamboo Nib Work',
    craftOrigin: 'Madhubani, Bihar',
    rating: 5.0,
    reviewsCount: 89,
    badge: 'Master Folk Artist',
    status: 'published',
    inStock: true,
    stockCount: 6,
    productionTime: 'Ready to ship',
    moq: 5,
    bulkPrice: 2150,
    bulkOrderAvailable: true,
    productionCapacity: '45 artworks / month',
    approxLeadTime: '14–20 days',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDl3vbK84xDwzfG0xJZLoNb8Q6cOJCd-tJHZ_B9WBc5pYbZ0KC-7nFf-VGCIZzf2akmxcLEpVkgSNqO-xbyrD93Xob8i3JxeJCx0BfiRNt4f92XAZ6Yh7TyBrRocieKMStXYetmIAKLp30z89ermbMVIiNvRokhEIetGNiUpt8hGt9bjP_3_Qc5HXmdIx2SnDzOxPC9pqY2pUeew0cEvivB973Rb_2fzw6qPijnYc2omWsEP3khtfwP'
    ],
    description: 'Intricate Kachni style Madhubani folk painting depicting the sacred Tree of Life, hand-drawn with bamboo pens and natural plant-based pigments.'
  },
  {
    id: 'carved-masala-dabba',
    title: 'Hand-Carved Sheesham Masala Dabba',
    hindiTitle: 'नक्काशीदार शीशम मसाला डिब्बा',
    price: 1950,
    originalPrice: 2300,
    discount: '15% OFF',
    artisanName: 'Tahir Woodcraft',
    artisanLocation: 'Saharanpur, Uttar Pradesh',
    artisanRole: 'Master Wood Carver',
    category: 'Home Decor',
    giTag: 'Saharanpur Wood Craft • GI Certified',
    giCertified: true,
    material: 'Aromatic Sheesham Wood',
    technique: 'Hand Chiseling & Beeswax Buffing',
    craftOrigin: 'Saharanpur, UP',
    rating: 4.7,
    reviewsCount: 62,
    badge: 'Rosewood Certified',
    status: 'published',
    inStock: true,
    stockCount: 12,
    productionTime: 'Ready to ship',
    moq: 10,
    bulkPrice: 1450,
    bulkOrderAvailable: true,
    productionCapacity: '150 units / month',
    approxLeadTime: '10–12 days',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAm8qFDBZzzY5qaIdRjfMB2zvjOW0WAv--PIXrbq7DL1xfFkxF1iKULLnbutQc8s8mwmo-sNr08qukgyIZv9bUjTi2vQx4bDMe2E2lTK84zkXx7XLl4bD5sTyN_jTBJFK86D4UxzaNo76NEfcV3RzNSfL6XlJsmrdyyiEyErUEcy479pvTmBkbHAbAZ95xDv-b6R_s_S4P0fzaovERxmzJEOtoje7-Gb8MqAjnxMX6na53pMRMSgNde'
    ],
    description: 'Hand carved aromatic Saharanpur sheesham wood spice box with brass latch and nine compartments displaying star anise and turmeric.'
  },
  {
    id: 'terracotta-urli',
    title: 'Terracotta Urli with Floral Diyas',
    hindiTitle: 'नक्काशीदार सजावटी उरली',
    price: 1200,
    originalPrice: 1500,
    discount: '20% OFF',
    artisanName: 'Ramdev Kumbhar',
    artisanLocation: 'Bhuj, Gujarat',
    artisanRole: 'Master Potter',
    category: 'Home Decor',
    giTag: 'Kutch Claycraft • GI Certified',
    giCertified: true,
    material: 'Terracotta Red River Clay',
    technique: 'Hand-molded & Carved',
    craftOrigin: 'Bhuj, Gujarat',
    rating: 4.9,
    reviewsCount: 42,
    badge: 'Handmade Heritage',
    status: 'published',
    inStock: true,
    stockCount: 8,
    productionTime: '2-3 days',
    moq: 8,
    bulkPrice: 900,
    bulkOrderAvailable: true,
    productionCapacity: '120 units / month',
    approxLeadTime: '8–12 days',
    performance: { views: 640, inquiries: 7, orders: 14, revenue: 16800, rating: 4.9, reviewsCount: 42 },
    aiPreservedData: {
      originalTitle: 'Terracotta Urli with Floral Diyas',
      originalDescription: 'Handcrafted terracotta urli bowl filled with water and floating carved clay diyas.',
      culturalStory: 'A traditional welcoming centerpiece in Indian courtyards bringing auspicious light and fragrance.',
      autoTags: ['Urli', 'Terracotta', 'Handmade', 'Diya', 'EcoFriendly'],
      suggestedFairPrice: 1200,
      detectedMaterials: ['Terracotta Red River Clay', 'Mineral Ochre']
    },
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBMs7hPE8gmakn2V2_N8cnPD0J5QggMsDR9pKTMgTgRDaolDLDnSArBJcEosxmFA3HIfISh066i474V4q1BGhL_oFC1PEP1lWpKxLJNNcoDdalP8Cdum0mlAsnCDVMtQK7XGYopZ5AwcVKikSuiMsZxAoUNd_s2oPF6GhWdrdzkvJv2kV7HJI7j8IVw84S1gPS-BwmKtSLVaFnPIQ3dVy4S2-PUQEZko9WyOcALkVMl5gl0hL9PNti-'
    ],
    description: 'Close-up shot of a handcrafted terracotta urli bowl filled with water, floating yellow marigold flowers, and carved clay diyas glowing warmly in natural rural morning sunlight.'
  },
  {
    id: 'incense-burner-kutch',
    title: 'Terracotta Temple Incense Burner',
    hindiTitle: 'कच्छ धूपदान धूप बर्नर',
    price: 950,
    originalPrice: 1200,
    discount: '20% OFF',
    artisanName: 'Ramdev Kumbhar',
    artisanLocation: 'Bhuj, Gujarat',
    category: 'Pottery & Clay Decor',
    giTag: 'Kutch Claycraft • Verification In-Progress',
    giCertified: false,
    status: 'pending_review',
    stockCount: 15,
    productionTime: '3-4 days',
    reviewFeedback: 'Submitted to Kutch Claycraft Guild for GI authentication and photographic quality verification.',
    rating: 5.0,
    reviewsCount: 0,
    performance: { views: 140, inquiries: 3, orders: 0, revenue: 0, rating: 5.0, reviewsCount: 0 },
    material: 'Natural Terracotta Clay',
    technique: 'Wheel-thrown & Pierced Lattice',
    craftOrigin: 'Bhuj, Kutch (Gujarat)',
    badge: 'Under Review',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBKEAtJLOEouP5Y0uc7qMue7vytttMtsmVEonY-GknldiMwk00xakpLEkflGB7uQBFcyV6tSPwTd-4wF-t1UzcGUBLWeky-OlcOphIrBQ1kmkhvWWefpeGPlzGEL_x9fYhb-RdNZ6QRxr-EBz0J7GZ1dCcy7iHICxpNvo84-zHgaSR9CZBsZlrjXv2hj1MabLJDD72MN7QROk4JUZ4y9CNUeJsXd-y403oOL7arcpXNzmNNY-JwqSJH'
    ],
    description: 'Perforated terracotta temple incense burner handcrafted with intricate jaali lattice work that disperses aromatic dhoop smoke gracefully.',
    aiPreservedData: {
      originalTitle: 'Terracotta Temple Incense Burner with Jaali Lattice',
      originalDescription: 'Perforated terracotta temple incense burner handcrafted with pierced geometric lattice.',
      culturalStory: 'Used in evening temple aarti rituals to purify the atmosphere with resinous frankincense.',
      autoTags: ['Incense Burner', 'Jaali', 'Terracotta', 'Temple Decor', 'Aromatherapy'],
      suggestedFairPrice: 950,
      detectedMaterials: ['Terracotta Red River Clay', 'Charcoal Ash Filter']
    }
  },
  {
    id: 'kumbhar-ceramic-draft',
    title: 'Kumbhar Hand-turned Earthen Serving Platter',
    hindiTitle: 'हाथ से बना मिट्टी का सर्विंग थाल',
    price: 780,
    originalPrice: 950,
    artisanName: 'Ramdev Kumbhar',
    artisanLocation: 'Bhuj, Gujarat',
    category: 'Pottery & Clay Decor',
    giTag: 'Kutch Claycraft • Local Draft',
    giCertified: false,
    status: 'draft',
    stockCount: 6,
    productionTime: 'Made to order (5 days)',
    rating: 0,
    reviewsCount: 0,
    performance: { views: 0, inquiries: 0, orders: 0, revenue: 0, rating: 0, reviewsCount: 0 },
    material: 'Raw Riverbed Clay',
    technique: 'Slow Wheel-Turned & Sun-Baked',
    craftOrigin: 'Bhuj, Gujarat',
    badge: 'Draft',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBWVv2dVIh1IjcuSaFKsNW_Oixou2iwnFLbJkJsBwQv-o6n2e-Gzlng0o22UJUcFopkPZgCMS2136pe0JDjrnBlxg_lSJ5FlDf7LfhWUGi7ov5yAKWzy17pnJxHstSQXd9EBAsQUAF6YirQ471gLMLkiM6qDf5wLAd9U24F2JfXgVlD_hT5bSoBpqjUYg_HI5TCjfcBaMJ0XuOfujvQ4wVvjw72K6sZ3fNPXq43kPvCNFE5Edkflfhm'
    ],
    description: 'Rustic sun-baked terracotta serving dish with subtle thumb-pressed scalloped borders. Saved as draft during voice cataloging.',
    aiPreservedData: {
      originalTitle: 'Kumbhar Hand-turned Earthen Serving Platter',
      originalDescription: 'Rustic sun-baked terracotta serving dish with subtle thumb-pressed scalloped borders.',
      culturalStory: 'Traditional rural tableware designed for festive dining and prasad offerings.',
      autoTags: ['Serving Platter', 'Terracotta', 'Dinnerware', 'Handmade'],
      suggestedFairPrice: 780,
      detectedMaterials: ['Raw Riverbed Clay']
    }
  },
  {
    id: 'brass-filigree-anklet',
    title: 'Dhokra Filigree Brass Tribal Anklet',
    hindiTitle: 'ढोकरा पीतल पायल',
    price: 1650,
    originalPrice: 2100,
    discount: '21% OFF',
    artisanName: 'Budhram Baghel',
    artisanLocation: 'Bastar, Chhattisgarh',
    category: 'Metal & Bell Craft',
    giTag: 'Bastar Bell Metal • Action Required',
    giCertified: false,
    status: 'rejected',
    stockCount: 4,
    productionTime: '4-6 days',
    rejectionReason: 'Primary photo has busy synthetic fabric in background. Please re-photograph the craft piece against a clean, plain textured cotton or stone surface and resubmit.',
    rating: 0,
    reviewsCount: 0,
    performance: { views: 42, inquiries: 1, orders: 0, revenue: 0, rating: 0, reviewsCount: 0 },
    material: '100% Solid Brass Wire',
    technique: 'Lost-Wax Thread Wrapping',
    craftOrigin: 'Bastar, Chhattisgarh',
    badge: 'Revision Needed',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuACm8mIi0Uyd4aTu3HnJ_njyfA5deLeGBjHglHu4RT1zznER-m6K9CUbLm__DLya3sM8b6ucBwaC0mVzVGAEFYNNMXn2IHkf7l8UdP7_9lds9qCX118Q-bpd83giI20RZeoF-AQvrEaS88gXZVJ30aShJ9Uhk08G0vnpGhK3hfGavN9pNwuACAVAXARX1Fb2aZsdA6Txybiks9y3E28jsY3xY576qs3b-kR7ShzjSI35FSZ_vMtfLZ0'
    ],
    description: 'Intricately wrapped solid brass bell metal anklet featuring rhythmic sound beads. Requires updated photography to complete marketplace approval.',
    aiPreservedData: {
      originalTitle: 'Dhokra Filigree Brass Tribal Anklet',
      originalDescription: 'Solid brass bell metal anklet with intricate wax-wire spiral beads.',
      culturalStory: 'Worn by tribal dancers during harvest festivities in the Bastar forest region.',
      autoTags: ['Dhokra', 'Tribal Jewelry', 'Brass', 'Anklet', 'Handmade'],
      suggestedFairPrice: 1650,
      detectedMaterials: ['Solid Brass Wire', 'Beeswax Core']
    }
  }
];

export const ARTISANS: Artisan[] = [
  {
    id: 'ramdev-kumbhar',
    name: 'Ramdev Kumbhar',
    hindiName: 'रामदेव कुम्हार',
    role: 'Master Potter & Terracotta Sculptor',
    location: 'Bhuj, Gujarat',
    specialty: 'Kutch Kalash & Living Terracotta',
    image: RAMDEV_PORTRAIT,
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0VMoMX4HuHFCBWiIJcYfIiucBtcWdgHyIbYWCyMUEkqWr8J83wJGSNbBhIQv_agE9uwzj0epLMWTOq2XE3xWCiG72VZTPBVheJpq5--me4qVA9mvrX8EZAORV74OIgA8HLdQXymeVUoSZC7141glYGs5mkHr_pNPBTMF6VBg9d5LNlPpvjKh6Qni41WSLdovo-rSDm_mJijrF2lUEiTPeyCkRKpfL4h6cjwbyvewgb_Hr5LoU8gB3',
    verified: true,
    giCertified: true,
    creationsCount: 14,
    yearsOfExperience: '34 Years',
    trustRating: 4.9,
    craftLineage: '5th Generation Kumbhar Lineage (Kutch Guild)',
    awards: ['National Crafts Master Award 2018', 'Gujarat State Heritage Award', 'UNESCO Seal of Excellence Finalist'],
    bulkDetails: {
      acceptsBulk: true,
      moq: 12,
      leadTime: '10-14 days',
      acceptsCustom: true,
      packagingNotes: 'Individual recycled straw cushioning & terracotta seal'
    },
    storyQuote: 'The red riverbed clay of Kutch breathes life when shaped with mindful slowness. Each piece carries our ancestral blessings for earthen cooling.',
    bio: '5th-generation master terracotta sculptor from Kutch. Ramdev uses centuries-old stone pivot wheels and desert acacia wood kilns to craft micro-porous vessels.',
    miniProducts: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD0VMoMX4HuHFCBWiIJcYfIiucBtcWdgHyIbYWCyMUEkqWr8J83wJGSNbBhIQv_agE9uwzj0epLMWTOq2XE3xWCiG72VZTPBVheJpq5--me4qVA9mvrX8EZAORV74OIgA8HLdQXymeVUoSZC7141glYGs5mkHr_pNPBTMF6VBg9d5LNlPpvjKh6Qni41WSLdovo-rSDm_mJijrF2lUEiTPeyCkRKpfL4h6cjwbyvewgb_Hr5LoU8gB3',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBMs7hPE8gmakn2V2_N8cnPD0J5QggMsDR9pKTMgTgRDaolDLDnSArBJcEosxmFA3HIfISh066i474V4q1BGhL_oFC1PEP1lWpKxLJNNcoDdalP8Cdum0mlAsnCDVMtQK7XGYopZ5AwcVKikSuiMsZxAoUNd_s2oPF6GhWdrdzkvJv2kV7HJI7j8IVw84S1gPS-BwmKtSLVaFnPIQ3dVy4S2-PUQEZko9WyOcALkVMl5gl0hL9PNti-',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBKEAtJLOEouP5Y0uc7qMue7vytttMtsmVEonY-GknldiMwk00xakpLEkflGB7uQBFcyV6tSPwTd-4wF-t1UzcGUBLWeky-OlcOphIrBQ1kmkhvWWefpeGPlzGEL_x9fYhb-RdNZ6QRxr-EBz0J7GZ1dCcy7iHICxpNvo84-zHgaSR9CZBsZlrjXv2hj1MabLJDD72MN7QROk4JUZ4y9CNUeJsXd-y403oOL7arcpXNzmNNY-JwqSJH'
    ]
  },
  {
    id: 'budhram-baghel',
    name: 'Budhram Baghel',
    hindiName: 'बुधराम बघेल',
    role: 'Master Bastar Bell Metal Caster',
    location: 'Bastar, Chhattisgarh',
    specialty: 'Dhokra Cire-Perdue Lost Wax',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ93X4OCxEhiVEMen60lz_O7Z4vcq-LULphu8KAnYI3BoNOhGWYL1ZV4DyeWfXiYKv0xaSfHvCQuIbJwAQtzbS2nXj8yjZNE7CqG_0c6q-6XSIuL-DDVLwoI5mny7qkyuCSyZd2jeBEdIiM3m0y5Egd3TO2L39NUpFILUE9O2DGtNVL81ftNXVWJhTwYEUGWilAoXSLQiW1F58LPeZlZV-MJWKn0nrP4_TdwpPW4aMEY5MX6ag3MTv',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsWcldKwDj8Mw01rXmBdmyzRDM4Ofj5I17imh0cwVPLLBMm7jZ62if4P_zbz2pxVmPmWFKNzjku-4gTRCn0p5e41-kbDQo5_xel29c1TJdYypTF0BgpOgGGOiWYy3AGOGl_2GfapK_TXcLVaZ4ZEAnsWysqVL5fPBga8T27K8rRKxsdQCQ_NIbVECsV5rgqCWuSGqTRsQND9XhVhObJEbYaasKQhkoDlnkY72QEuIRCqopvV62OyzQ',
    verified: true,
    giCertified: true,
    creationsCount: 16,
    yearsOfExperience: '28 Years',
    trustRating: 4.8,
    craftLineage: 'Ghadwa Tribal Bronze Metallurgy Guild',
    awards: ['Shilp Guru Nominee', 'Chhattisgarh State Tribal Art Honour'],
    bulkDetails: {
      acceptsBulk: true,
      moq: 10,
      leadTime: '15-20 days',
      acceptsCustom: true,
      packagingNotes: 'Eco jute pouches with Bastar craft certificate'
    },
    storyQuote: 'Every thread of brass is first hand-rolled in wild forest beeswax. When molten bell metal fills the clay mould, our tribal songs take permanent form.',
    bio: 'National Award-winning Dhokra artist preserving the 4,000-year living bronze metallurgy tradition of the Dandakaranya forest clans.',
    miniProducts: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuACm8mIi0Uyd4aTu3HnJ_njyfA5deLeGBjHglHu4RT1zznER-m6K9CUbLm__DLya3sM8b6ucBwaC0mVzVGAEFYNNMXn2IHkf7l8UdP7_9lds9qCX118Q-bpd83giI20RZeoF-AQvrEaS88gXZVJ30aShJ9Uhk08G0vnpGhK3hfGavN9pNwuACAVAXARX1Fb2aZsdA6Txybiks9y3E28jsY3xY576qs3b-kR7ShzjSI35FSZ_vMtfLZ0',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAsWcldKwDj8Mw01rXmBdmyzRDM4Ofj5I17imh0cwVPLLBMm7jZ62if4P_zbz2pxVmPmWFKNzjku-4gTRCn0p5e41-kbDQo5_xel29c1TJdYypTF0BgpOgGGOiWYy3AGOGl_2GfapK_TXcLVaZ4ZEAnsWysqVL5fPBga8T27K8rRKxsdQCQ_NIbVECsV5rgqCWuSGqTRsQND9XhVhObJEbYaasKQhkoDlnkY72QEuIRCqopvV62OyzQ'
    ]
  },
  {
    id: 'deviji-vankar',
    name: 'Deviji Vankar',
    hindiName: 'देवीजी वनकर',
    role: 'National Award Handloom Weaver',
    location: 'Bhujodi, Gujarat',
    specialty: 'Kutch Dhabla & Desi Wool',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCw6VsVxD97OBTrfOqgYDcvPKKwIZ2W00Aj7ex84UoMvX53yg3JTz-fvDq74ch9aXt7h_uGzv2v9v1ffyaf-eDLmD_I5lqwXNrgyqEAUEup0DqRkJ99580KDQBb1-y9-9APpDWGudMv1uVGlI6Ppg13mX27v2hakwzlNMArtNI-yOQmfwdyXpj6RrgUBGqLw0mQ8kF9583sxtyHq6prsqe4v7ce2l50KeakhlgbU3irVkfsTSbtnbJo',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoGE39LTeCYftWhk8a7F9YQEpwTzDaViru_qnSWyUqKLbtet0WxIE4wUHJFv4x-TO2DrSucNbMn_jQYiOpW5wnxqKaqJk6JIP-8lthSzH7oUeoiMHBD9WcS1kt5zhHxfUras6kAqArGFJvVyz-O1jyUttsey9LxQeOExvy9H4atQev-b8fLM9zNBv9id1zZrsZGHQLz4I8HQHUgomwlk2-BQOqZU9vD_vgTSzPIw0INoxy9KhySOA5',
    verified: true,
    giCertified: true,
    creationsCount: 18,
    yearsOfExperience: '32 Years',
    trustRating: 4.9,
    craftLineage: 'Marwada Vankar Master Weavers Clan',
    awards: ['President of India National Handloom Award', 'Sant Kabir Award Nominee'],
    bulkDetails: {
      acceptsBulk: true,
      moq: 5,
      leadTime: '14-21 days',
      acceptsCustom: true,
      packagingNotes: 'Handloom cotton storage bags with herbal neem sachet'
    },
    storyQuote: 'Our ancestors spun wool from Rabari sheep beside campfires. When the pit-loom shuttle glides across silk and wool, we re-weave the desert horizon.',
    bio: 'Master pit-loom weaver known for pure indigenous wool weaving with natural madder root, pomegranate rind, and wild indigo vats.',
    miniProducts: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAoGE39LTeCYftWhk8a7F9YQEpwTzDaViru_qnSWyUqKLbtet0WxIE4wUHJFv4x-TO2DrSucNbMn_jQYiOpW5wnxqKaqJk6JIP-8lthSzH7oUeoiMHBD9WcS1kt5zhHxfUras6kAqArGFJvVyz-O1jyUttsey9LxQeOExvy9H4atQev-b8fLM9zNBv9id1zZrsZGHQLz4I8HQHUgomwlk2-BQOqZU9vD_vgTSzPIw0INoxy9KhySOA5',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDel2kItC1iVDLI0hdDduKEOaac03d-ygQEfYQuAs9WeZo9_AfF_nd82kwCZB9lyvPdpfXNG20Q2m1xwaMK9dUmpwbwXvqgQRVdiVg-KWEHOVqpqxP0TWHSq6ubefrnJAB2WRTDxRQtXemD0m6W9U46IBUFv2BCf2RT_Z0NLVgM_nW7vudQ6T94QSvX3_W5C9hIiqKlp6kHqFO_tMEM8FaJeV7rwuAIgPCsYHwlM5_XMnLJrGc9KrQo',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA0NYoQPvrUWNFBy3KKktV98gWeMp6PpCIvdzEoIFBbgWDJ34GoWudxFlbdt1Qlxdp7ALfVO-w3AuwxfOKmxRsmZBoXCwVs6H1WEuWkgQ6GDu-uo5r40kH1AMbfhH9tc7VS5m9tdiJb3KyAhoDpENFdshn0ZDumT1YDjznG_8vAwrPKwf-XNmLZwU0uT95uG7nL7iWCOVYbU0Yi4aKlC-NhkgT0CM7kHQ1WuP734XW905g7OH9kKLtA'
    ]
  },
  {
    id: 'malati-devi',
    name: 'Malati Devi',
    hindiName: 'मालती देवी',
    role: 'Senior Mithila Folk Muralist',
    location: 'Madhubani, Bihar',
    specialty: 'Kachni Fine-Line Narrative Art',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjB7Eho-1ZRbH5a11WmBP3uNWt53Xb04OfT7TBBljn2mc_fPnSe36XhaNnj3XwQCcdwDKdV2qN9aaOegaJiCEuxggVkH4X_EIBHkE43oqPhxuMYNDB4PVX1xeZkNEkUPb79OzcF26MM8sDM-N_OrZhnGA42AsojkdRGttos5_l57BIBW3_gpShsmFu9_KzYxFtjV9AmoLFL2AfBCwr2iuXkcxk-eYd3y2lBpLwUW2PUJvhd8aBpYr9',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDl3vbK84xDwzfG0xJZLoNb8Q6cOJCd-tJHZ_B9WBc5pYbZ0KC-7nFf-VGCIZzf2akmxcLEpVkgSNqO-xbyrD93Xob8i3JxeJCx0BfiRNt4f92XAZ6Yh7TyBrRocieKMStXYetmIAKLp30z89ermbMVIiNvRokhEIetGNiUpt8hGt9bjP_3_Qc5HXmdIx2SnDzOxPC9pqY2pUeew0cEvivB973Rb_2fzw6qPijnYc2omWsEP3khtfwP',
    verified: true,
    giCertified: true,
    creationsCount: 12,
    yearsOfExperience: '38 Years',
    trustRating: 5.0,
    craftLineage: 'Jitwarpur Sacred Ritual Mural Guild',
    awards: ['National Merit Award', 'Bihar Kala Samman'],
    bulkDetails: {
      acceptsBulk: true,
      moq: 4,
      leadTime: '12-18 days',
      acceptsCustom: true,
      packagingNotes: 'Rigid kraft cylindrical tubes with archival tissue'
    },
    storyQuote: 'In Madhubani, our lines are prayers. We use bamboo twigs wrapped in raw cotton to paint the harmony of birds, lotus blossoms, and cosmic skies.',
    bio: 'Custodian of ceremonial Kachni ritual murals from Jitwarpur village, crafting pigments from lamp soot, dried marigolds, and acacia gum.',
    miniProducts: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDl3vbK84xDwzfG0xJZLoNb8Q6cOJCd-tJHZ_B9WBc5pYbZ0KC-7nFf-VGCIZzf2akmxcLEpVkgSNqO-xbyrD93Xob8i3JxeJCx0BfiRNt4f92XAZ6Yh7TyBrRocieKMStXYetmIAKLp30z89ermbMVIiNvRokhEIetGNiUpt8hGt9bjP_3_Qc5HXmdIx2SnDzOxPC9pqY2pUeew0cEvivB973Rb_2fzw6qPijnYc2omWsEP3khtfwP',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDNhbRoNsff31yayah4Chn_vLvKp4-wvr5fJpPSLwUxpPaba2EF_Biw_Sj7k25RTP6qBuaHPLulQuWezCt83Zs3FGeXxur2qEZYp_PVMQSptas7wDg3fFWij_6bTwZyTorviWflp5MrnuAfN8CXiqAhHJTxHcDb7oI2xAGg6cpfRXFxiD25GK2YUYoK8hY3YufD8mtK4zLhoY0j1Pb5PCjB18aSH-xmLou0Ay4lylfcWxZ-JJ7L7TpV'
    ]
  },
  {
    id: 'giriraj-kripal',
    name: 'Giriraj Kripal',
    hindiName: 'गिरिराज कृपाल',
    role: 'Master Jaipur Blue Potter',
    location: 'Jaipur, Rajasthan',
    specialty: 'Quartz Faience & Cobalt Glazes',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNAM62P7GDw0MDQFEdElIJuCw6GIgxNqxgUovctgMR-Ra3PsCLbpG72_f2GshS7YN3SuH_AFreDRrnoSP41nN5az3lPIlcgeuCqCHYukF_ZjARSjdgQ-kXU9ZWtnO9Zy8Sp2akLe92BvOzNWIFTvkwtDFjvJLBQX_N2CqzWff6GMD47heuSokx69gjOAj4V_XfKlepoU-JXBAyT4YH5bPy5y4-qttDOtQ4uaKb3icq2EucuZkt4maB',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF2k8_p2a7q_tLq1f1589-aL7vN1eS32-V6k1x8Yp2d9_7dF9_11q8_k2m8Xb2q7dF9_11q8_k2m8Xb2q7dF9_11q8_k2m8Xb2q7dF9_11q8_k2m8Xb2q7dF9_11q8_k2m8Xb',
    verified: true,
    giCertified: true,
    creationsCount: 11,
    yearsOfExperience: '26 Years',
    trustRating: 4.8,
    craftLineage: 'Kripal Kumbh Royal Blue Pottery Lineage',
    awards: ['Rajasthan State Craft Fellowship', 'Surajkund Crafts Mela Best Artisan'],
    bulkDetails: {
      acceptsBulk: true,
      moq: 8,
      leadTime: '12-16 days',
      acceptsCustom: true,
      packagingNotes: 'Double-walled impact-absorbing corrugated boxes'
    },
    storyQuote: 'Our turquoise and lapis glaze is ground from real quartz and copper oxides. It contains no clay, only minerals fired into glass.',
    bio: 'Trained under the legendary Kripal Singh Shekhawat, keeping alive Jaipur’s distinct Persian-influenced blue quartz glaze craft.',
    miniProducts: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBKEAtJLOEouP5Y0uc7qMue7vytttMtsmVEonY-GknldiMwk00xakpLEkflGB7uQBFcyV6tSPwTd-4wF-t1UzcGUBLWeky-OlcOphIrBQ1kmkhvWWefpeGPlzGEL_x9fYhb-RdNZ6QRxr-EBz0J7GZ1dCcy7iHICxpNvo84-zHgaSR9CZBsZlrjXv2hj1MabLJDD72MN7QROk4JUZ4y9CNUeJsXd-y403oOL7arcpXNzmNNY-JwqSJH',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBMs7hPE8gmakn2V2_N8cnPD0J5QggMsDR9pKTMgTgRDaolDLDnSArBJcEosxmFA3HIfISh066i474V4q1BGhL_oFC1PEP1lWpKxLJNNcoDdalP8Cdum0mlAsnCDVMtQK7XGYopZ5AwcVKikSuiMsZxAoUNd_s2oPF6GhWdrdzkvJv2kV7HJI7j8IVw84S1gPS-BwmKtSLVaFnPIQ3dVy4S2-PUQEZko9WyOcALkVMl5gl0hL9PNti-'
    ]
  }
];

export const MARKETPLACE_CATEGORIES: MarketplaceCategory[] = [
  {
    id: 'Handloom',
    name: 'Handloom',
    hindiName: 'हथकरघा',
    tamilName: 'கைத்தறி',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEgci_fJwZFK8bcJ5sgz4Uje0j93MnDHs_CGkmg9mNFoEjqAJb5DenFrBsmi8RrwH3a5gcTyNtIgSGPrt-2sTEYaD28OwzzZPQ9tpzQQ9X-Xdq1ODE_BwwsnfhlITYNTsRljdHFDwDAQHXXQnkzNv8jOQXW1fCXSqtlry1ML4lXjgKCW3fh3rKBDzx6pKSoRvpB1E_kz0A5k8VQaEpt3aqlZwNtVc2pfQbnsBu8XtiqJUdtKHMezWO',
    count: '24+ Crafts',
    subtitle: 'Pit-loom silks & geometric ikat'
  },
  {
    id: 'Home Decor',
    name: 'Home Decor',
    hindiName: 'गृह सज्जा',
    tamilName: 'வீட்டு அலங்காரம்',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMs7hPE8gmakn2V2_N8cnPD0J5QggMsDR9pKTMgTgRDaolDLDnSArBJcEosxmFA3HIfISh066i474V4q1BGhL_oFC1PEP1lWpKxLJNNcoDdalP8Cdum0mlAsnCDVMtQK7XGYopZ5AwcVKikSuiMsZxAoUNd_s2oPF6GhWdrdzkvJv2kV7HJI7j8IVw84S1gPS-BwmKtSLVaFnPIQ3dVy4S2-PUQEZko9WyOcALkVMl5gl0hL9PNti-',
    count: '38+ Crafts',
    subtitle: 'Brass urlis, lamps & carved wood'
  },
  {
    id: 'Jewelry',
    name: 'Jewelry',
    hindiName: 'पारंपरिक आभूषण',
    tamilName: 'கைவினை நகைகள்',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsWcldKwDj8Mw01rXmBdmyzRDM4Ofj5I17imh0cwVPLLBMm7jZ62if4P_zbz2pxVmPmWFKNzjku-4gTRCn0p5e41-kbDQo5_xel29c1TJdYypTF0BgpOgGGOiWYy3AGOGl_2GfapK_TXcLVaZ4ZEAnsWysqVL5fPBga8T27K8rRKxsdQCQ_NIbVECsV5rgqCWuSGqTRsQND9XhVhObJEbYaasKQhkoDlnkY72QEuIRCqopvV62OyzQ',
    count: '16+ Crafts',
    subtitle: 'Lost-wax bell metal & filigree'
  },
  {
    id: 'Pottery',
    name: 'Pottery',
    hindiName: 'मिट्टी कला',
    tamilName: 'மண்பாண்டம்',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0VMoMX4HuHFCBWiIJcYfIiucBtcWdgHyIbYWCyMUEkqWr8J83wJGSNbBhIQv_agE9uwzj0epLMWTOq2XE3xWCiG72VZTPBVheJpq5--me4qVA9mvrX8EZAORV74OIgA8HLdQXymeVUoSZC7141glYGs5mkHr_pNPBTMF6VBg9d5LNlPpvjKh6Qni41WSLdovo-rSDm_mJijrF2lUEiTPeyCkRKpfL4h6cjwbyvewgb_Hr5LoU8gB3',
    count: '29+ Crafts',
    subtitle: 'Wheel-turned terracotta & quartz blue'
  },
  {
    id: 'Textiles',
    name: 'Textiles',
    hindiName: 'वस्त्र एवं शॉल',
    tamilName: 'ஜவுளி நெசவு',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoGE39LTeCYftWhk8a7F9YQEpwTzDaViru_qnSWyUqKLbtet0WxIE4wUHJFv4x-TO2DrSucNbMn_jQYiOpW5wnxqKaqJk6JIP-8lthSzH7oUeoiMHBD9WcS1kt5zhHxfUras6kAqArGFJvVyz-O1jyUttsey9LxQeOExvy9H4atQev-b8fLM9zNBv9id1zZrsZGHQLz4I8HQHUgomwlk2-BQOqZU9vD_vgTSzPIw0INoxy9KhySOA5',
    count: '32+ Crafts',
    subtitle: 'Desi wool shawls & zari dupattas'
  },
  {
    id: 'Traditional Art',
    name: 'Traditional Art',
    hindiName: 'पारंपरिक कला',
    tamilName: 'பாரம்பரியக் கலை',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDl3vbK84xDwzfG0xJZLoNb8Q6cOJCd-tJHZ_B9WBc5pYbZ0KC-7nFf-VGCIZzf2akmxcLEpVkgSNqO-xbyrD93Xob8i3JxeJCx0BfiRNt4f92XAZ6Yh7TyBrRocieKMStXYetmIAKLp30z89ermbMVIiNvRokhEIetGNiUpt8hGt9bjP_3_Qc5HXmdIx2SnDzOxPC9pqY2pUeew0cEvivB973Rb_2fzw6qPijnYc2omWsEP3khtfwP',
    count: '21+ Crafts',
    subtitle: 'Madhubani & sacred ritual folk murals'
  }
];

export const CRAFT_COLLECTIONS: CraftCollection[] = [
  {
    id: 'indus-earthenware',
    title: 'The Indus Valley Earthenware',
    hindiTitle: 'सिंधु घाटी मिट्टी संग्रह',
    tamilTitle: 'சிந்து சமவெளி மண்பாண்டங்கள்',
    subtitle: '4,000-year living lineage of micro-porous terracotta vessels and festive warm urlis.',
    region: 'Kutch, Gujarat',
    badge: 'Ancient Lineage',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0VMoMX4HuHFCBWiIJcYfIiucBtcWdgHyIbYWCyMUEkqWr8J83wJGSNbBhIQv_agE9uwzj0epLMWTOq2XE3xWCiG72VZTPBVheJpq5--me4qVA9mvrX8EZAORV74OIgA8HLdQXymeVUoSZC7141glYGs5mkHr_pNPBTMF6VBg9d5LNlPpvjKh6Qni41WSLdovo-rSDm_mJijrF2lUEiTPeyCkRKpfL4h6cjwbyvewgb_Hr5LoU8gB3',
    craftQuery: 'Terracotta',
    artisanName: 'Ramdev Kumbhar'
  },
  {
    id: 'sacred-bastar-dhokra',
    title: 'Sacred Bastar Bell Metal',
    hindiTitle: 'पवित्र बस्तर ढोकरा कांस्य',
    tamilTitle: 'பஸ்தார் வெண்கலக் கைவினை',
    subtitle: 'Lost-wax thread-cast brass diyas, tribal deities and temple bells from Dandakaranya forest clans.',
    region: 'Bastar, Chhattisgarh',
    badge: 'Tribal GI Heritage',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACm8mIi0Uyd4aTu3HnJ_njyfA5deLeGBjHglHu4RT1zznER-m6K9CUbLm__DLya3sM8b6ucBwaC0mVzVGAEFYNNMXn2IHkf7l8UdP7_9lds9qCX118Q-bpd83giI20RZeoF-AQvrEaS88gXZVJ30aShJ9Uhk08G0vnpGhK3hfGavN9pNwuACAVAXARX1Fb2aZsdA6Txybiks9y3E28jsY3xY576qs3b-kR7ShzjSI35FSZ_vMtfLZ0',
    craftQuery: 'Dhokra',
    artisanName: 'Budhram Baghel'
  },
  {
    id: 'royal-jaipur-ceramics',
    title: 'Royal Jaipur Blue Pottery',
    hindiTitle: 'शाही जयपुर ब्लू पॉटरी',
    tamilTitle: 'ஜெய்ப்பூர் நீல பீங்கான்',
    subtitle: 'Non-clay Egyptian quartz faience glazed with natural cobalt and copper oxides.',
    region: 'Jaipur, Rajasthan',
    badge: 'Mughal-Persian Court',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxSQE-UUyb2zjyQ_mLIxTS1gdHc-7o8HUrFtH03mYQeJ84ex5YEvP5fUeOS-bLH1v2FyaaQiW-ciQtljymHXvXtulgL59gk0zE1_2yg5u26gccHIkF5R8f7JS_Ss_nVH-ZrTxjUEdC-Dl-doCf9QRWP42oitUjrk19ROcyvPZjfVsgs3fDzk9FDuNOMs4_SVh4GQuTJKix2f1KIxeGQgU0mmhPThV1-dkOZnGfCUlcEJQjP7pFZvMo',
    craftQuery: 'Blue Pottery',
    artisanName: 'Giriraj Kripal'
  },
  {
    id: 'mithila-folk-murals',
    title: 'Mithila Sacred Folk Murals',
    hindiTitle: 'मिथिला मधुबनी लोक कला',
    tamilTitle: 'மிதிலா மதுபானி ஓவியங்கள்',
    subtitle: 'Bamboo-quill fine-line paintings celebrating harmony between nature, birds, and cosmic fertility.',
    region: 'Madhubani, Bihar',
    badge: 'GI Certified Folk',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDl3vbK84xDwzfG0xJZLoNb8Q6cOJCd-tJHZ_B9WBc5pYbZ0KC-7nFf-VGCIZzf2akmxcLEpVkgSNqO-xbyrD93Xob8i3JxeJCx0BfiRNt4f92XAZ6Yh7TyBrRocieKMStXYetmIAKLp30z89ermbMVIiNvRokhEIetGNiUpt8hGt9bjP_3_Qc5HXmdIx2SnDzOxPC9pqY2pUeew0cEvivB973Rb_2fzw6qPijnYc2omWsEP3khtfwP',
    craftQuery: 'Madhubani',
    artisanName: 'Malati Devi'
  }
];

export const GUILDS: GuildRegion[] = [
  {
    id: 'gujarat',
    state: 'Gujarat',
    region: 'west',
    zoneLabel: 'West Zone',
    location: 'Bhuj, Western India',
    craftName: 'Kutch Claywork & Rogan Art',
    description: 'Lippan mirror mosaic work harmonized with freehand stylus Rogan oil painting.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGVbSGzTZXw0BZMgJoyEiQVE-IRLE2ND_wkedcn1vZQ5slS5OlxorTR7HLgqrqZItu9USTBa8H1A7ZMyydu8eT8qGT9DnWa2xyceuWUCSJEH6dqXAxHvSj1lmfcykOVMvyaV3Dl9FMctU-vEralHr0PUDrAmWLe1RnfOs81CrgiHY99sKnxMyhNH9Z2VOgIJsnQfkuglPmmGzJxreh-4qjq-NZTtF4Dp8U93mO8M9GseGrLK5wWKJC',
    giTag: 'GI Certified • 4,000 yr Indus Lineage',
    artisanCount: 420,
    productCount: 86
  },
  {
    id: 'rajasthan',
    state: 'Rajasthan',
    region: 'west',
    zoneLabel: 'West Zone',
    location: 'Jaipur, Western India',
    craftName: 'Jaipur Blue Pottery & Miniature Art',
    description: 'Low-fire quartz dough pottery paired with single-hair brush court painting.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBd9TldLi9Tce-_aDaQZFEdQPXx2Y6tAV_k4oPh-iyjIR51QM93HJ2dcrtMbP_OQu3aLnToa1-ipgyVXsHnkgmqWTdQQ5wqA81h5IEz3FQAtrnKVnAitjBOZib1rcG3gAy2VKHEvpj88r3IYaudff8AUqZsxYBJs_Mf2mbIUlOSI4O3nDpVShyN_vMa5VqINhhSlAXSb_tsO-GcKF6LgHbEA8vYSydPMZ23EKdk8I88gDX5VSQ5IL1p',
    giTag: 'GI Certified • Persian-Mughal Fusion',
    artisanCount: 280,
    productCount: 112
  },
  {
    id: 'tamil-nadu',
    state: 'Tamil Nadu',
    region: 'south',
    zoneLabel: 'South Zone',
    location: 'Thanjavur, Southern India',
    craftName: 'Tanjore Gold Foil & Bronze Casting',
    description: '22k pure gold relief gesso wooden boards and sacred lost-wax alloy bell bronzes.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAX8exfvBKutvP-aBcMkeurqoAP_6xIPR7dU81gkuORMlakGWjKsX77VvOpMFrBagdMWrQWl0rfED-UQ9XPgI-Nr9MlK5ilUQjEKBgEqUR2kDojubq-CJB5p0S_3EzmjOitXCQcJ7A2DIqzh3AsuJi9HtpH5OGlIpS_G0xQdWpNKBBSf2DaHVREyzy7kG6lHzdrzudFElyFs9QhBzuJqJK7xsPNdMI6fPBKWgaB3qGpLRmKkjX5Jggx',
    giTag: 'GI Certified • Chola Dynasty Legacy',
    artisanCount: 195,
    productCount: 45
  },
  {
    id: 'uttar-pradesh',
    state: 'Uttar Pradesh',
    region: 'north',
    zoneLabel: 'North Zone',
    location: 'Lucknow & Varanasi',
    craftName: 'Lucknowi Chikankari & Banarasi Brocade',
    description: 'Master 32 needlework stitches over gossamer muslin, woven with real metallic zari.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgeDgLAjuYN76IkQycay3LsFRkEVBhTWRrVoGLRZlh_B6JUlAp1b6K7aMk9lSCYPjN2P1Dw5LD9aOAy3X5VCkBMp74U7EqI_x1Qw05GHQumykHL9UVJySo8-15XPk1X4gvA3PL8kJPO2nlst2vwYNqRBCxxQ4WMVBZ9EGSRcrO-nmyKSCURMDWbw2ocXKD-FwgG8ikXMEAqA7SXJtI3zrsjd5B3gQqBt8zJFfAeU9IOa9kp42X_ksJ',
    giTag: 'GI Certified • Awadh Royal Craft',
    artisanCount: 650,
    productCount: 230
  },
  {
    id: 'west-bengal',
    state: 'West Bengal',
    region: 'east',
    zoneLabel: 'East Zone',
    location: 'Shantiniketan, Eastern India',
    craftName: 'Kantha Stitch & Bankura Terracotta',
    description: 'Narrative running stitch upcycled silks and sacred hollow-bodied earthenware sculptures.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAb0_KBwzaZJUGSeKVeIg9S-gW1cg_ixjH8GksMaxBiqxm5mcoeLvPy4LB7wCkKUPoCfZ5TJYCHDB-k1dXi-jLnaVTjvz0uM6kPE9YiCRnbNFa8wy-HTEWpzSR1XM-qyEicn-CIZf9sj-x0Xah__IvYAsT2SBmBfAAW4SX7jrZtfpcFEEpsGGBjGVgqKymQ7Ac6lLOJrK-C2oWlyH-J9d6INGanjsiHP1IMpKezwaEdh-DXjteQ0ARv',
    giTag: 'GI Certified • Folk Narrative Quilting',
    artisanCount: 310,
    productCount: 74
  },
  {
    id: 'bihar',
    state: 'Bihar',
    region: 'east',
    zoneLabel: 'East Zone',
    location: 'Mithila, Eastern India',
    craftName: 'Madhubani Folk Art',
    description: 'Ritualistic linear line drawings with natural pigments made by village women guilds.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMwHzIqOnbrUHZYM4gsBodl23X9Pb0Sq4t0U85g0Q-WVCFMDmBgN2dY9b6yp9XPoNEN9WabnfNHIXJ2YigrpgbVDf-ePZhNyQRrzwH7bPfo78pc4E0VjdQ_4Gf67gP4aPqYsKsrTwIWagB3lL1M-YQJAAXvJUW-C87Gacg7da90kUpaIGAipc1krafQClfQvavAdln9kuNg6W0jHWHDdwZROIrK-HSLR0VqVhROYYkfdGfMBzN_icG',
    giTag: 'GI Certified • Mithila Ritual Art',
    artisanCount: 520,
    productCount: 140
  },
  {
    id: 'karnataka',
    state: 'Karnataka',
    region: 'south',
    zoneLabel: 'South Zone',
    location: 'Ramanagara, Southern India',
    craftName: 'Channapatna Lacquerware Toys',
    description: 'Smooth turned ivory-wood finished with non-toxic turmeric, indigo, and kumkum resin dyes.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADHGLodWxIqVclOWqdA9IYrN-MWdVbCQGoWAMUSSI0HR6THhnWByAh5Qv3ligIG3JSd79F_tq-6iNpJYH_cPj244HRsNhxeWlJ4ef4w8YsVkth1XREvZMblbhPUxZZdP5aai_B_oYopaEzmDnwzAO-poAd8m-nYgr-2TpTSMT5U-35GdnW38y5EDcsRV48JLcvfjgYO6JC5991ZhcpI-85JBBBlHbs6NLmsgch3E_VFlcwk2u3atp4',
    giTag: 'GI Certified • Non-Toxic Veg Dyes',
    artisanCount: 180,
    productCount: 58
  }
];

export const ORDERS: OrderItem[] = [
  {
    id: 'order-1',
    orderNumber: '#KM-8092',
    productName: 'Terracotta Urli with Floral Diya Set',
    hindiProductName: 'नक्काशीदार सजावटी उरली',
    quantity: '1 Unit (१ सेट)',
    price: 1200,
    prepaid: true,
    status: 'packing',
    currentStep: 3,
    timeAgo: 'आज 10:30 AM • Today',
    buyerName: 'Ananya Sharma',
    buyerLocation: 'Bangalore, 560001',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMs7hPE8gmakn2V2_N8cnPD0J5QggMsDR9pKTMgTgRDaolDLDnSArBJcEosxmFA3HIfISh066i474V4q1BGhL_oFC1PEP1lWpKxLJNNcoDdalP8Cdum0mlAsnCDVMtQK7XGYopZ5AwcVKikSuiMsZxAoUNd_s2oPF6GhWdrdzkvJv2kV7HJI7j8IVw84S1gPS-BwmKtSLVaFnPIQ3dVy4S2-PUQEZko9WyOcALkVMl5gl0hL9PNti-',
    pickupInfo: 'Blue Dart Pickup: कल 11:00 AM • कृपया कल सुबह 11 बजे से पहले पैक रखें'
  },
  {
    id: 'order-2',
    orderNumber: '#KM-8104',
    productName: 'Kutch Embossed Clay Carafe',
    hindiProductName: 'कच्छ नक्काशीदार सुराही',
    quantity: '2 Units (२ सुराही)',
    price: 1700,
    prepaid: true,
    status: 'new',
    currentStep: 1,
    timeAgo: '1 घंटा पहले • 1 hour ago',
    buyerName: 'Vikramaditya Sen',
    buyerLocation: 'Kolkata, WB',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKEAtJLOEouP5Y0uc7qMue7vytttMtsmVEonY-GknldiMwk00xakpLEkflGB7uQBFcyV6tSPwTd-4wF-t1UzcGUBLWeky-OlcOphIrBQ1kmkhvWWefpeGPlzGEL_x9fYhb-RdNZ6QRxr-EBz0J7GZ1dCcy7iHICxpNvo84-zHgaSR9CZBsZlrjXv2hj1MabLJDD72MN7QROk4JUZ4y9CNUeJsXd-y403oOL7arcpXNzmNNY-JwqSJH',
    urgent: true
  },
  {
    id: 'order-3',
    orderNumber: '#KM-7941',
    productName: 'Blue Pottery Vase',
    hindiProductName: 'ब्लू पॉटरी गुलदस्ता',
    quantity: '1 Unit',
    price: 850,
    prepaid: true,
    status: 'delivered',
    currentStep: 5,
    timeAgo: '3 days ago',
    buyerName: 'Rohan Mehra',
    buyerLocation: 'Mumbai, MH',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNAM62P7GDw0MDQFEdElIJuCw6GIgxNqxgUovctgMR-Ra3PsCLbpG72_f2GshS7YN3SuH_AFreDRrnoSP41nN5az3lPIlcgeuCqCHYukF_ZjARSjdgQ-kXU9ZWtnO9Zy8Sp2akLe92BvOzNWIFTvkwtDFjvJLBQX_N2CqzWff6GMD47heuSokx69gjOAj4V_XfKlepoU-JXBAyT4YH5bPy5y4-qttDOtQ4uaKb3icq2EucuZkt4maB'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Ananya S.',
    location: 'Bengaluru, Karnataka',
    date: 'Yesterday',
    rating: 5,
    comment: '"The water in the Kutch Kalash tastes so sweet and cool. It brings back childhood memories of my grandmother’s home. Wonderful mastercraft!"',
    initials: 'AS'
  },
  {
    id: 'rev-2',
    author: 'Rahul M.',
    location: 'Delhi NCR',
    date: '3 days ago',
    rating: 5,
    comment: '"Packaging was 100% plastic-free with straw and recycled jute. Arrived completely safe. Hats off to Ramdev ji for this dedication."',
    initials: 'RM'
  },
  {
    id: 'rev-3',
    author: 'Sunita Rao',
    location: 'Chennai, Tamil Nadu',
    date: '1 week ago',
    rating: 5,
    comment: '"The weight, earthen smell and etched motifs are pure art. Directly supporting the master potter feels immensely fulfilling."',
    initials: 'SR'
  }
];

export const HERITAGE_CATEGORIES = [
  {
    id: 'ikat',
    name: 'Handloom Ikat',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEgci_fJwZFK8bcJ5sgz4Uje0j93MnDHs_CGkmg9mNFoEjqAJb5DenFrBsmi8RrwH3a5gcTyNtIgSGPrt-2sTEYaD28OwzzZPQ9tpzQQ9X-Xdq1ODE_BwwsnfhlITYNTsRljdHFDwDAQHXXQnkzNv8jOQXW1fCXSqtlry1ML4lXjgKCW3fh3rKBDzx6pKSoRvpB1E_kz0A5k8VQaEpt3aqlZwNtVc2pfQbnsBu8XtiqJUdtKHMezWO'
  },
  {
    id: 'clay',
    name: 'Earthen Clay',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOrJ-BPyd2lsbCuyoepnQ-ciSXn0rZCjGXyEB2yx4jBK4IdNdKb5Y-LT6CCuZAOcbEZB2Tfb2lmo3OT6BWN25MIjW6D2yz7xgye-0iNK3rmNXH2QEpm3GWg3i9f8vv35WxjviwxZZNhJQA0sJCUusEh_UX-cRIFxx60sSMscFtVtuL-ckNI30M9EVNKVnkScEgWwyranoKKeYc9y_bey7QbKNoJrETIyl-D2iAtS9eDKuI0GVxpM-o'
  },
  {
    id: 'dhokra',
    name: 'Brass Dhokra',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ93X4OCxEhiVEMen60lz_O7Z4vcq-LULphu8KAnYI3BoNOhGWYL1ZV4DyeWfXiYKv0xaSfHvCQuIbJwAQtzbS2nXj8yjZNE7CqG_0c6q-6XSIuL-DDVLwoI5mny7qkyuCSyZd2jeBEdIiM3m0y5Egd3TO2L39NUpFILUE9O2DGtNVL81ftNXVWJhTwYEUGWilAoXSLQiW1F58LPeZlZV-MJWKn0nrP4_TdwpPW4aMEY5MX6ag3MTv'
  },
  {
    id: 'wood',
    name: 'Wood Carving',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfeSrexS-7KhDI-qPjeSEK34ASrBcZfnlxviUOlIOTC-WDX2KTljRtx-smQKrppq-d7U0QYtb6crdnM48wrWQCpEZ3ZE1KSU0imqhmHcJHDtJd8YPp22w8fZZ24wQqOjc6Yiqo_oSTk1AU1XnTwE-pm6Fgj3NdWEitvVxD1x6XJW1S8fSvBVupWTh6MFd3xEBUgr8LmkfSyPZvbhPKUuMaLLjcX3XZyXSL5M1GmxdOYcyvbptFBG9C'
  },
  {
    id: 'madhubani',
    name: 'Madhubani',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGeMDTngxD1lnG0GB1QyUHvjsLJV2FL_0e6MG7SDh1jSWYtCNxIWZADUKrikTFTgnyuQB2lntNeIqpO6dfVIUsz4iNvnNzjAMn83WfZR6iMQHHuvhUiyypzrtLtwwFcRgSETNd8anzZih1q0QKTodpcdBAfbdmGYyxSL9b5ugvDk01zTXYgkjjjUg3sLcB0Wsd_oa0BMoh9nQow5a8Ovy183cCbDKEXaIP3PigvDFqPQowILu2H7HK'
  },
  {
    id: 'silver',
    name: 'Organic Silver',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsWcldKwDj8Mw01rXmBdmyzRDM4Ofj5I17imh0cwVPLLBMm7jZ62if4P_zbz2pxVmPmWFKNzjku-4gTRCn0p5e41-kbDQo5_xel29c1TJdYypTF0BgpOgGGOiWYy3AGOGl_2GfapK_TXcLVaZ4ZEAnsWysqVL5fPBga8T27K8rRKxsdQCQ_NIbVECsV5rgqCWuSGqTRsQND9XhVhObJEbYaasKQhkoDlnkY72QEuIRCqopvV62OyzQ'
  }
];
