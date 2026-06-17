/**
 * dictionary.js — all translatable copy, keyed by locale.
 * Georgian (ka) is the primary language; English (en) is the alternative.
 *
 * Only *text* lives here. Structural data (icons, screen ids, hrefs, numeric
 * stat values) stays in constants/site.js so it isn't duplicated per language.
 * Text arrays are zipped with that structure by index inside each component.
 */

export const LANGS = [
  { code: "ka", short: "ქარ", name: "ქართული" },
  { code: "en", short: "EN", name: "English" },
];

export const DEFAULT_LANG = "ka";

export const dictionaries = {
  /* ===================================================================
     ქართული — primary
     =================================================================== */
  ka: {
    brand: "Amcar",
    nav: {
      features: "ფუნქციები",
      how: "როგორ მუშაობს",
      about: "ჩვენ შესახებ",
      reviews: "შეფასებები",
      getApp: "ჩამოტვირთვა",
      getAppFull: "აპლიკაციის ჩამოტვირთვა",
    },

    hero: {
      badge: "უკვე ხელმისაწვდომია 40-ზე მეტ ქალაქში",
      titleBefore: "იპოვეთ ",
      titleHighlight: "სანდო ხელოსნები",
      titleAfter: " უფრო სწრაფად",
      description:
        "ხოდზე ეხმარება მძღოლებს მოძებნონ ახლომდებარე ხელოსნები, შეადარონ სერვისები და ფასები და თავდაჯერებულად დაუბრუნდნენ გზას.",
      downloadApp: "აპლიკაციის ჩამოტვირთვა",
      watchDemo: "დემოს ნახვა",
      lovedBy: "ენდობა 10 000-ზე მეტი მძღოლი",
      chip1Title: "6 წუთის სავალზე",
      chip1Sub: "AutoCare Pro",
      chip2Title: "ზეთის შეცვლა ₾39-დან",
      chip2Sub: "საუკეთესო ფასი ახლომახლო",
    },

    features: {
      eyebrow: "რატომ ხოდზე",
      title: "ყველაფერი, რაც სწორი ხელოსნის ასარჩევად გჭირდებათ",
      subtitle:
        "აღარავითარი გამოცნობა და გაუთავებელი ზარები. ხოდზე მძღოლებს წამებში არჩევანის გაკეთების საშუალებას აძლევს.",
      items: [
        {
          title: "იპოვეთ ახლომდებარე ხელოსნები",
          description:
            "ნახეთ ყველა სანდო ხელოსანი თქვენ ირგვლივ ცოცხალ რუკაზე, დახარისხებული მანძილის, რეიტინგისა და ხელმისაწვდომობის მიხედვით.",
        },
        {
          title: "დაათვალიერეთ რეალური სერვისები",
          description:
            "იცოდეთ ზუსტად რას სთავაზობს თითოეული სერვისი — ზეთის შეცვლიდან სრულ დიაგნოსტიკამდე — მისვლამდე.",
        },
        {
          title: "გამჭვირვალე ფასები",
          description:
            "შეადარეთ საწყისი ფასები წინასწარ. არანაირი მოულოდნელობა, ფარული გადასახადი თუ უხერხული სატელეფონო ზარი.",
        },
        {
          title: "შეადარეთ გვერდიგვერდ",
          description:
            "შეაფასეთ ვარიანტები ფასის, შეფასებებისა და სიახლოვის მიხედვით ერთი შეხებით და აირჩიეთ თქვენთვის შესაფერისი.",
        },
        {
          title: "ნავიგაცია ერთი შეხებით",
          description:
            "გააგზავნეთ მარშრუტი თქვენს საყვარელ რუკების აპლიკაციაში და მიდით ყოყმანის გარეშე.",
        },
        {
          title: "გადამოწმებული და შეფასებული",
          description:
            "თითოეული ხელოსანი გადამოწმებულია და შეფასებულია რეალური მძღოლების მიერ, ასე რომ ყოველთვის თავდაჯერებულად ჯავშნით.",
        },
      ],
    },

    showcase: {
      eyebrow: "აპლიკაციის შიგნით",
      title: "შექმნილია უმარტივესი გამოყენებისთვის",
      subtitle:
        "თითოეული ეკრანი სიცხადისთვისაა შექმნილი — პირველი ძიებიდან ნაბიჯ-ნაბიჯ ნავიგაციამდე.",
      items: [
        {
          eyebrow: "მთავარი",
          title: "თქვენი ავტოფარეხი ხელახლა გააზრებული",
          description:
            "მშვიდი მთავარი ეკრანი აპლიკაციის გახსნისთანავე აჩვენებს ახლომდებარე სერვისებს, შენახულ ხელოსნებსა და ბოლო ძიებებს.",
          bullets: [
            "პერსონალიზებული თქვენი ავტომობილისთვის",
            "შენახული და ბოლოს ნანახი ერთ შეხებაზე",
          ],
        },
        {
          eyebrow: "ცოცხალი რუკა",
          title: "ყველა ხელოსანი ერთ რუკაზე",
          description:
            "აღნიშვნები რეალურ დროში განახლდება რეიტინგითა და მანძილით. შეეხეთ ნებისმიერს სერვისებისა და ფასების მყისიერად სანახავად.",
          bullets: [
            "ხელმისაწვდომობა რეალურ დროში",
            "მანძილი და რეიტინგი ერთი შეხედვით",
          ],
        },
        {
          eyebrow: "სერვისები",
          title: "შეადარეთ სერვისები და ფასები",
          description:
            "დაათვალიერეთ საწყისი ფასები და შეთავაზებები სხვადასხვა სერვისში, რათა ყოველთვის სამართლიან ფასს მიიღოთ.",
          bullets: ["გამჭვირვალე საწყისი ფასები", "სერვისების მკაფიო დაყოფა"],
        },
        {
          eyebrow: "პროფილი",
          title: "ნდობა დაჯავშნამდე",
          description:
            "გადამოწმების ნიშნები, ფოტოები და მძღოლების რეალური შეფასებები სრულ სურათს გაჩვენებთ გადაწყვეტამდე.",
          bullets: ["გადამოწმებული ხელოსნის ნიშანი", "ფოტოები და ნამდვილი შეფასებები"],
        },
      ],
    },

    steps: {
      eyebrow: "როგორ მუშაობს",
      title: "გზაზე სამ მარტივ ნაბიჯში",
      subtitle:
        "გამაფრთხილებელი ნიშნიდან დაჯავშნამდე ორ წუთზე ნაკლებ დროში.",
      items: [
        {
          title: "მოძებნა",
          description:
            "გახსენით ხოდზე და მყისიერად ნახეთ ახლომდებარე სანდო ხელოსნები ცოცხალ, ინტერაქტიულ რუკაზე.",
        },
        {
          title: "შედარება",
          description:
            "შეამოწმეთ სერვისები, რეიტინგები და საწყისი ფასები გვერდიგვერდ სწორი არჩევანისთვის.",
        },
        {
          title: "ნავიგაცია",
          description:
            "მიიღეთ ნაბიჯ-ნაბიჯ მითითებები და პირდაპირ თქვენს ხელოსანთან მიდით ყოყმანის გარეშე.",
        },
      ],
    },

    benefits: {
      eyebrow: "ციფრებში",
      title: "მძღოლებისა და ხელოსნების ნდობით სარგებლობს",
      subtitle:
        "ათასობით მძღოლი ეყრდნობა ხოდზეს ყოველ კვირას სწრაფი დახმარებისთვის — და ქსელი მუდმივად იზრდება.",
      statLabels: [
        "დახმარებული მძღოლი",
        "გადამოწმებული ხელოსანი",
        "შესრულებული ძიება",
        "აპლიკაციის საშუალო შეფასება",
      ],
      items: [
        {
          title: "დაზოგეთ საათები, არა წუთები",
          description:
            "გამოტოვეთ ზარები და ჩიხები. მძღოლები სწორ ხელოსანს საშუალოდ ორ წუთზე ნაკლებ დროში პოულობენ.",
        },
        {
          title: "დაჯავშნეთ თავდაჯერებულად",
          description:
            "გადამოწმებული სერვისები და გამჭვირვალე შეფასებები ნიშნავს, რომ ყოველთვის იცით ვის ანდობთ თქვენს ავტომობილს.",
        },
        {
          title: "აღარასოდეს გადაიხადოთ ზედმეტი",
          description:
            "წინასწარი ფასები გაკონტროლებთ — იხდით მხოლოდ იმ სამუშაოში, რომელიც ნამდვილად გჭირდებათ.",
        },
      ],
    },

    testimonials: {
      eyebrow: "მძღოლების რჩეული",
      title: "რეალური ისტორიები გზიდან",
      subtitle:
        "მძღოლები მთელი ქვეყნის მასშტაბით ენდობიან ხოდზეს, როცა ეს ყველაზე მნიშვნელოვანია.",
      items: [
        {
          name: "მარიამ ბერიძე",
          role: "ყოველდღიური მძღოლი",
          quote:
            "ძრავის ნიშანი მგზავრობისას აინთო. ხოდზემ 4 წუთის სავალზე გადამოწმებული სერვისი მიპოვა შესანიშნავი შეფასებებით. ნამდვილი გადამრჩენელი.",
          initials: "მბ",
        },
        {
          name: "დავით ნოზაძე",
          role: "ტაქსის მძღოლი",
          quote:
            "მანქანას მთელი დღე ვამუშავებ, ამიტომ მოცდენა ფულს მიჯდება. ფასების წინასწარ შედარებამ წელს ასობით ლარი დამიზოგა.",
          initials: "დნ",
        },
        {
          name: "ანა ქავთარაძე",
          role: "ახალი ავტომფლობელი",
          quote:
            "როგორც ადამიანს, ვისაც მანქანებში არაფერი გამეგება, გადამოწმების ნიშნები და გულწრფელი შეფასებები დაჯავშნისას სრულ უსაფრთხოებას მაგრძნობინებს.",
          initials: "აქ",
        },
        {
          name: "გიორგი მაისურაძე",
          role: "მოყვარული ხელოსანი",
          quote:
            "მეც კი ვიყენებ ხოდზეს, როცა სამუშაო ჩემს შესაძლებლობებს სცდება. რუკა და სერვისების აღწერა ნამდვილად კარგად არის გააზრებული.",
          initials: "გმ",
        },
        {
          name: "სოფო ალავიძე",
          role: "დაკავებული მშობელი",
          quote:
            "ზეთის შეცვლა სკოლის გზებს შორის წუთზე ნაკლებში დავჯავშნე. მთელი პროცესი უბრალოდ უპრობლემოა.",
          initials: "სა",
        },
      ],
    },

    faq: {
      eyebrow: "კითხვები",
      title: "კითხვები, რომლებსაც პასუხი აქვს",
      items: [
        {
          q: "უფასოა ხოდზეს გამოყენება?",
          a: "დიახ. ხოდზეს ჩამოტვირთვა და ხელოსნების მოძებნა, შედარება და მათთან ნავიგაცია მძღოლებისთვის სრულიად უფასოა.",
        },
        {
          q: "როგორ ხდება ხელოსნების გადამოწმება?",
          a: "ხოდზეში თითოეული სერვისი გადის გადამოწმების პროცესს და მუდმივად ფასდება რეალური მძღოლების მიერ, ასე რომ ჩამონათვალი სანდო რჩება.",
        },
        {
          q: "ნაჩვენები ფასები საბოლოოა?",
          a: "ჩვენ ვაჩვენებთ გამჭვირვალე საწყის ფასებს სამართლიანი შედარებისთვის. საბოლოო ფასი დასტურდება სერვისთან თქვენი კონკრეტული საჭიროების მიხედვით.",
        },
        {
          q: "რომელ ქალაქებშია ხოდზე ხელმისაწვდომი?",
          a: "ხოდზე სწრაფად ფართოვდება ძირითად ქალაქებში და უკვე 500-ზე მეტი გადამოწმებული ხელოსანი გვყავს. ახალი რეგიონები ყოველთვიურად ემატება.",
        },
        {
          q: "რომელ მოწყობილობებს უჭერს მხარს?",
          a: "ხოდზე ხელმისაწვდომია iOS-სა და Android-ზე. უბრალოდ ჩამოტვირთეთ App Store-დან ან Google Play-დან.",
        },
      ],
    },

    cta: {
      title: "ყველაფერი ავტომობილის მოვლისთვის — ერთ აპლიკაციაში",
      description:
        "შემოუერთდით ათასობით მძღოლს, ვინც სანდო ხელოსნებს წამებში პოულობს. ჩამოტვირთეთ ხოდზე და მოიხსენით ავტომობილის მოვლის სტრესი.",
      perks: ["უფასო ჩამოსატვირთად", "გამოწერის გარეშე", "iOS და Android"],
    },

    footer: {
      brandDesc:
        "იპოვეთ სანდო ხელოსნები უფრო სწრაფად. შეადარეთ სერვისები და ფასები, შემდეგ კი თავდაჯერებულად დაუბრუნდით გზას.",
      productTitle: "პროდუქტი",
      companyTitle: "კომპანია",
      legalTitle: "იურიდიული",
      product: ["ფუნქციები", "როგორ მუშაობს", "შეფასებები", "ჩამოტვირთვა"],
      company: ["ჩვენ შესახებ", "კარიერა", "პრესა", "ბლოგი"],
      legal: ["კონფიდენციალურობა", "პირობები", "ქუქიები", "ლიცენზიები"],
      getOnPhone: "მიიღეთ ხოდზე თქვენს ტელეფონზე",
      getOnPhoneSub: "უფასო ჩამოსატვირთად. ხელმისაწვდომია iOS-სა და Android-ზე.",
      rights: "ყველა უფლება დაცულია.",
      operational: "ყველა სისტემა გამართულად მუშაობს",
    },

    store: {
      appStoreTop: "ჩამოტვირთეთ",
      appStoreBottom: "App Store",
      playTop: "გადმოწერეთ",
      playBottom: "Google Play",
    },

    phone: {
      home: {
        greeting: "დილა მშვიდობისა, ნიკა",
        title: "იპოვეთ ხელოსანი",
        search: "ძებნა: ხელოსანი, სერვისი…",
        actions: ["შეკეთება", "ახლომახლო", "გადამოწმებული"],
        nearYou: "ახლომახლო",
        seeAll: "ყველა",
        open: "ღიაა",
        shops: [
          { name: "ავტოკარე", meta: "0.4 კმ", price: "₾39-დან" },
          { name: "სითი მოტორსი", meta: "0.8 კმ", price: "₾45-დან" },
          { name: "გიარჰედი", meta: "1.2 კმ", price: "₾35-დან" },
        ],
      },
      map: {
        name: "ავტოკარე",
        distance: "0.4 კმ · 6 წთ",
        navigate: "ნავიგაცია",
      },
      service: {
        shop: "ავტოკარე",
        title: "სერვისები და ფასები",
        reviews: "312 შეფასება · 0.4 კმ",
        starting: "საწყისი",
        bestPrice: "საუკეთესო ფასი",
        compare: "ახლომდებარეების შედარება",
        items: [
          { name: "ზეთის შეცვლა", time: "30 წთ", price: "₾39" },
          { name: "მუხრუჭების შემოწმება", time: "45 წთ", price: "₾59" },
          { name: "სრული დიაგნოსტიკა", time: "60 წთ", price: "₾89" },
          { name: "საბურავების შემობრუნება", time: "25 წთ", price: "₾29" },
        ],
      },
      profile: {
        name: "ავტოკარე",
        status: "გადამოწმებული ხელოსანი · ღიაა 20:00-მდე",
        stats: [
          { k: "რეიტინგი", v: "4.9" },
          { k: "შეფასება", v: "312" },
          { k: "მანძილი", v: "0.4კმ" },
        ],
        review:
          "„სწრაფი, სამართლიანი და თავაზიანი. წამებში დავჯავშნე და ერთ საათში გზაზე დავაბრუნე.“",
        reviewer: "— მარიამ ბ.",
        directions: "მარშრუტის მიღება",
      },
    },

    a11y: {
      switchLang: "ენის შეცვლა",
    },
  },

  /* ===================================================================
     English — alternative
     =================================================================== */
  en: {
    brand: "Amcar",
    nav: {
      features: "Features",
      how: "How it works",
      about: "About",
      reviews: "Reviews",
      getApp: "Get App",
      getAppFull: "Get the App",
    },

    hero: {
      badge: "Now live in 40+ cities",
      titleBefore: "Find ",
      titleHighlight: "trusted mechanics",
      titleAfter: " faster",
      description:
        "ხოდზე helps drivers locate nearby mechanics, compare services and prices, and get back on the road with confidence.",
      downloadApp: "Download App",
      watchDemo: "Watch Demo",
      lovedBy: "Loved by 10,000+ drivers",
      chip1Title: "6 min away",
      chip1Sub: "AutoCare Pro",
      chip2Title: "$39+ oil change",
      chip2Sub: "Best nearby price",
    },

    features: {
      eyebrow: "Why ხოდზე",
      title: "Everything you need to choose the right mechanic",
      subtitle:
        "No more guesswork or endless phone calls. ხოდზე gives drivers the clarity to decide in seconds.",
      items: [
        {
          title: "Find Mechanics Nearby",
          description:
            "See every trusted mechanic around you on a live map, ranked by distance, rating, and availability.",
        },
        {
          title: "Browse Real Services",
          description:
            "Know exactly what each shop offers — from oil changes to full diagnostics — before you arrive.",
        },
        {
          title: "Transparent Pricing",
          description:
            "Compare starting prices upfront. No surprises, no hidden fees, no awkward phone calls.",
        },
        {
          title: "Compare Side by Side",
          description:
            "Weigh options on price, reviews, and proximity in one tap and pick the shop that fits you.",
        },
        {
          title: "One-Tap Navigation",
          description:
            "Send the route straight to your favorite maps app and drive there without a second thought.",
        },
        {
          title: "Verified & Reviewed",
          description:
            "Every mechanic is verified and rated by real drivers, so you always book with confidence.",
        },
      ],
    },

    showcase: {
      eyebrow: "Inside the app",
      title: "Designed to feel effortless",
      subtitle:
        "Every screen is crafted for clarity — from the first search to turn-by-turn directions.",
      items: [
        {
          eyebrow: "Home",
          title: "Your garage, reimagined",
          description:
            "A calm home screen surfaces nearby shops, your saved mechanics, and recent searches the moment you open the app.",
          bullets: ["Personalized for your vehicle", "Saved & recent in one tap"],
        },
        {
          eyebrow: "Live Map",
          title: "Every mechanic, on one map",
          description:
            "Pins update in real time with ratings and distance. Tap any pin to preview services and pricing instantly.",
          bullets: ["Real-time availability", "Distance & rating at a glance"],
        },
        {
          eyebrow: "Services",
          title: "Compare services & prices",
          description:
            "Scan starting prices and offerings across shops so you always know you're getting a fair deal.",
          bullets: ["Transparent starting prices", "Clear service breakdowns"],
        },
        {
          eyebrow: "Profile",
          title: "Trust before you book",
          description:
            "Verified badges, photos, and real driver reviews give you the full picture before you commit.",
          bullets: ["Verified mechanic badges", "Photos & authentic reviews"],
        },
      ],
    },

    steps: {
      eyebrow: "How it works",
      title: "On the road in three simple steps",
      subtitle: "From a warning light to a booked appointment in under two minutes.",
      items: [
        {
          title: "Find",
          description:
            "Open ხოდზე and instantly see trusted mechanics near you on a live, interactive map.",
        },
        {
          title: "Compare",
          description:
            "Check services, ratings, and starting prices side by side to choose the right shop.",
        },
        {
          title: "Navigate",
          description:
            "Get turn-by-turn directions and drive straight to your mechanic with zero guesswork.",
        },
      ],
    },

    benefits: {
      eyebrow: "By the numbers",
      title: "Trusted by drivers and mechanics alike",
      subtitle:
        "Thousands of drivers rely on ხოდზე every week to find help fast — and the network keeps growing.",
      statLabels: [
        "Drivers helped",
        "Verified mechanics",
        "Searches completed",
        "Average app rating",
      ],
      items: [
        {
          title: "Save hours, not minutes",
          description:
            "Skip the calls and dead ends. Drivers find the right mechanic in under two minutes on average.",
        },
        {
          title: "Book with confidence",
          description:
            "Verified shops and transparent reviews mean you always know who you're trusting with your car.",
        },
        {
          title: "Never overpay again",
          description:
            "Upfront pricing puts you in control, so you only pay for the work you actually need.",
        },
      ],
    },

    testimonials: {
      eyebrow: "Loved by drivers",
      title: "Real stories from the road",
      subtitle: "Drivers across the country trust ხოდზე when it matters most.",
      items: [
        {
          name: "Maya Thompson",
          role: "Daily commuter",
          quote:
            "My check-engine light came on during a road trip. ხოდზე found a verified shop 4 minutes away with great reviews. Lifesaver.",
          initials: "MT",
        },
        {
          name: "Daniel Reyes",
          role: "Rideshare driver",
          quote:
            "I keep my car running all day, so downtime costs me money. Comparing prices upfront has saved me hundreds this year.",
          initials: "DR",
        },
        {
          name: "Aisha Karim",
          role: "New car owner",
          quote:
            "As someone who knows nothing about cars, the verified badges and honest reviews make me feel completely safe booking.",
          initials: "AK",
        },
        {
          name: "Marcus Lee",
          role: "Weekend mechanic",
          quote:
            "Even I use ხოდზე when a job's out of my depth. The map and service breakdowns are genuinely well designed.",
          initials: "ML",
        },
        {
          name: "Sofia Alvarez",
          role: "Busy parent",
          quote:
            "Booked an oil change between school runs in under a minute. The whole experience just feels effortless.",
          initials: "SA",
        },
      ],
    },

    faq: {
      eyebrow: "FAQ",
      title: "Questions, answered",
      items: [
        {
          q: "Is ხოდზე free to use?",
          a: "Yes. Downloading ხოდზე and finding, comparing, and navigating to mechanics is completely free for drivers.",
        },
        {
          q: "How are mechanics verified?",
          a: "Every shop on ხოდზე goes through a verification process and is continuously rated by real drivers, so listings stay trustworthy.",
        },
        {
          q: "Are the prices shown final?",
          a: "We display transparent starting prices so you can compare fairly. Final pricing is confirmed with the shop based on your specific needs.",
        },
        {
          q: "Which cities is ხოდზე available in?",
          a: "ხოდზე is expanding fast across major metros with 500+ verified mechanics already on board. New regions are added every month.",
        },
        {
          q: "Which devices are supported?",
          a: "ხოდზე is available for both iOS and Android. Just download it from the App Store or Google Play to get started.",
        },
      ],
    },

    cta: {
      title: "Everything you need for vehicle maintenance in one app",
      description:
        "Join thousands of drivers who find trusted mechanics in seconds. Download ხოდზე and take the stress out of car care.",
      perks: ["Free to download", "No subscription", "iOS & Android"],
    },

    footer: {
      brandDesc:
        "Find trusted mechanics faster. Compare services and prices, then get back on the road with confidence.",
      productTitle: "Product",
      companyTitle: "Company",
      legalTitle: "Legal",
      product: ["Features", "How it works", "Reviews", "Download"],
      company: ["About", "Careers", "Press", "Blog"],
      legal: ["Privacy", "Terms", "Cookies", "Licenses"],
      getOnPhone: "Get ხოდზე on your phone",
      getOnPhoneSub: "Free to download. Available on iOS and Android.",
      rights: "All rights reserved.",
      operational: "All systems operational",
    },

    store: {
      appStoreTop: "Download on the",
      appStoreBottom: "App Store",
      playTop: "Get it on",
      playBottom: "Google Play",
    },

    phone: {
      home: {
        greeting: "Good morning, Alex",
        title: "Find a mechanic",
        search: "Search mechanics, services…",
        actions: ["Repair", "Nearby", "Verified"],
        nearYou: "Near you",
        seeAll: "See all",
        open: "Open now",
        shops: [
          { name: "AutoCare Pro", meta: "0.4 mi", price: "$39+" },
          { name: "City Motors", meta: "0.8 mi", price: "$45+" },
          { name: "GearHead Garage", meta: "1.2 mi", price: "$35+" },
        ],
      },
      map: {
        name: "AutoCare Pro",
        distance: "0.4 mi away · 6 min",
        navigate: "Navigate",
      },
      service: {
        shop: "AutoCare Pro",
        title: "Services & pricing",
        reviews: "312 reviews · 0.4 mi",
        starting: "Starting",
        bestPrice: "Best price",
        compare: "Compare nearby shops",
        items: [
          { name: "Oil Change", time: "30 min", price: "$39" },
          { name: "Brake Inspection", time: "45 min", price: "$59" },
          { name: "Full Diagnostic", time: "60 min", price: "$89" },
          { name: "Tire Rotation", time: "25 min", price: "$29" },
        ],
      },
      profile: {
        name: "AutoCare Pro",
        status: "Verified mechanic · Open until 8 PM",
        stats: [
          { k: "Rating", v: "4.9" },
          { k: "Reviews", v: "312" },
          { k: "Distance", v: "0.4mi" },
        ],
        review:
          "“Fast, fair, and friendly. Booked in seconds and they had me back on the road within the hour.”",
        reviewer: "— Maya T.",
        directions: "Get directions",
      },
    },

    a11y: {
      switchLang: "Switch language",
    },
  },
};
