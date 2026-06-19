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
        "Amcar ეხმარება მძღოლებს მოძებნონ ახლომდებარე ხელოსნები, შეადარონ სერვისები და ფასები და თავდაჯერებულად დაუბრუნდნენ გზას.",
      downloadApp: "აპლიკაციის ჩამოტვირთვა",
      watchDemo: "დემოს ნახვა",
      lovedBy: "ენდობა 10 000-ზე მეტი მძღოლი",
      chip1Title: "6 წუთის სავალზე",
      chip1Sub: "AutoCare Pro",
      chip2Title: "ზეთის შეცვლა ₾39-დან",
      chip2Sub: "საუკეთესო ფასი ახლომახლო",
    },

    features: {
      eyebrow: "რატომ Amcar",
      title: "ყველაფერი, რაც სწორი ხელოსნის ასარჩევად გჭირდებათ",
      subtitle:
        "აღარავითარი გამოცნობა და გაუთავებელი ზარები. Amcar მძღოლებს წამებში არჩევანის გაკეთების საშუალებას აძლევს.",
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
            "ერთი შეხებით გახსენით მარშრუტი და შეუდექით გზას.",
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
            "დაათვალიერეთ საწყისი ფასები და შეთავაზებები სხვადასხვა სერვისში, რათა ყოველთვის სამართლიანი ფასი მიიღოთ.",
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
            "გახსენით Amcar და მყისიერად ნახეთ ახლომდებარე სანდო ხელოსნები ცოცხალ, ინტერაქტიულ რუკაზე.",
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
      eyebrow: "რატომ Amcar",
      title: "შექმნილია მძღოლებისა და ხელოსნებისთვის",
      subtitle:
        "Amcar ეხმარება მძღოლებს სწრაფად იპოვონ სანდო დახმარება და უკავშირებს ხელოსნებს ახალ მომხმარებლებს.",
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
        "მძღოლები მთელი ქვეყნის მასშტაბით ენდობიან Amcar-ს, როცა ეს ყველაზე მნიშვნელოვანია.",
      items: [
        {
          name: "მარიამ ბერიძე",
          role: "ყოველდღიური მძღოლი",
          quote:
            "ძრავის ნიშანი მგზავრობისას აინთო. Amcar-მა 4 წუთის სავალზე გადამოწმებული სერვისი მიპოვა შესანიშნავი შეფასებებით. ნამდვილი გადამრჩენელი.",
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
            "მეც კი ვიყენებ Amcar-ს, როცა სამუშაო ჩემს შესაძლებლობებს სცდება. რუკა და სერვისების აღწერა ნამდვილად კარგად არის გააზრებული.",
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
          q: "უფასოა Amcar-ს გამოყენება?",
          a: "დიახ. Amcar-ს ჩამოტვირთვა და ხელოსნების მოძებნა, შედარება და მათთან ნავიგაცია მძღოლებისთვის სრულიად უფასოა.",
        },
        {
          q: "როგორ ხდება ხელოსნების გადამოწმება?",
          a: "Amcar-ში თითოეული სერვისი გადის გადამოწმების პროცესს და მუდმივად ფასდება რეალური მძღოლების მიერ, ასე რომ ჩამონათვალი სანდო რჩება.",
        },
        {
          q: "ნაჩვენები ფასები საბოლოოა?",
          a: "ჩვენ ვაჩვენებთ გამჭვირვალე საწყის ფასებს სამართლიანი შედარებისთვის. საბოლოო ფასი დასტურდება სერვისთან თქვენი კონკრეტული საჭიროების მიხედვით.",
        },
        {
          q: "რომელ ქალაქებშია Amcar ხელმისაწვდომი?",
          a: "Amcar ახლახ იწყებს მუშაობას — ამ ეტაპზე ვამატებთ გადამოწმებულ ხელოსნებს და ახალ რეგიონებს რეგულარულად დავამატებთ.",
        },
        {
          q: "რომელ მოწყობილობებს უჭერს მხარს?",
          a: "Amcar ამჟამად ხელმისაწვდომია Android-ზე. უბრალოდ ჩამოტვირთეთ Google Play-დან. iOS ვერსია მალე დაემატება.",
        },
      ],
    },

    cta: {
      title: "ყველაფერი ავტომობილის მოვლისთვის — ერთ აპლიკაციაში",
      description:
        "იპოვეთ სანდო ხელოსნები წამებში. ჩამოტვირთეთ Amcar და მოიხსენით ავტომობილის მოვლის სტრესი.",
      perks: ["უფასო ჩამოსატვირთად", "გამოწერის გარეშე", "Android-ზე"],
    },

    footer: {
      brandDesc:
        "იპოვეთ სანდო ხელოსნები უფრო სწრაფად. შეადარეთ სერვისები და ფასები, შემდეგ კი თავდაჯერებულად დაუბრუნდით გზას.",
      productTitle: "პროდუქტი",
      companyTitle: "კომპანია",
      legalTitle: "იურიდიული",
      product: ["ფუნქციები", "როგორ მუშაობს", "ჩამოტვირთვა"],
      company: ["ჩვენ შესახებ", "პრესა", "ბლოგი", "კონტაქტი"],
      legal: ["კონფიდენციალურობა", "პირობები", "ქუქიები", "ლიცენზიები"],
      getOnPhone: "მიიღეთ Amcar თქვენს ტელეფონზე",
      getOnPhoneSub: "უფასო ჩამოსატვირთად. ხელმისაწვდომია Android-ზე.",
      rights: "ყველა უფლება დაცულია.",
      operational: "ყველა სისტემა გამართულად მუშაობს",
    },

    store: {
      appStoreTop: "ჩამოტვირთეთ",
      appStoreBottom: "App Store",
      playTop: "გადმოწერეთ",
      playBottom: "Google Play",
    },

    pages: {
      backHome: "მთავარ გვერდზე დაბრუნება",
      updatedLabel: "ბოლო განახლება",
      tocTitle: "ამ გვერდზე",
      legal: {
        privacy: {
          eyebrow: "იურიდიული",
          title: "კონფიდენციალურობის პოლიტიკა",
          updated: "2026 წლის 1 ივნისი",
          intro:
            "თქვენი კონფიდენციალურობა ჩვენთვის მნიშვნელოვანია. ეს პოლიტიკა განმარტავს, რა მონაცემებს ვაგროვებთ, როგორ ვიყენებთ მათ და რა უფლებები გაქვთ Amcar-ის გამოყენებისას.",
          sections: [
            {
              heading: "რა მონაცემებს ვაგროვებთ",
              body: [
                "ანგარიშის მონაცემები, როგორიცაა სახელი, ტელეფონის ნომერი და ელფოსტა, რომელსაც რეგისტრაციისას უთითებთ.",
                "მდებარეობის მონაცემები, რათა გაჩვენოთ ახლომდებარე ხელოსნები — მხოლოდ თქვენი ნებართვით.",
                "გამოყენების მონაცემები, როგორიცაა ნანახი ხელოსნები და ძიების ისტორია, რათა გავაუმჯობესოთ სერვისი.",
              ],
            },
            {
              heading: "როგორ ვიყენებთ თქვენს მონაცემებს",
              body: [
                "სანდო ხელოსნების მოსაძებნად, შესადარებლად და მათთან ნავიგაციისთვის.",
                "აპლიკაციის გასაუმჯობესებლად, უსაფრთხოების უზრუნველსაყოფად და ხარვეზების აღმოსაფხვრელად.",
                "მნიშვნელოვანი შეტყობინებების გასაგზავნად თქვენი ანგარიშისა და მოთხოვნების შესახებ.",
              ],
            },
            {
              heading: "მონაცემთა გაზიარება",
              body: [
                "ჩვენ არ ვყიდით თქვენს პერსონალურ მონაცემებს. ინფორმაციას ვუზიარებთ მხოლოდ გადამოწმებულ ხელოსნებს, როცა თქვენ თავად იწყებთ კონტაქტს.",
                "მონაცემები შესაძლოა გავუზიაროთ სანდო სერვის-პროვაიდერებს, რომლებიც გვეხმარებიან აპლიკაციის ფუნქციონირებაში მკაცრი კონფიდენციალურობის პირობებით.",
              ],
            },
            {
              heading: "თქვენი უფლებები",
              body: [
                "ნებისმიერ დროს შეგიძლიათ წვდომა, განახლება ან წაშლა მოითხოვოთ თქვენი მონაცემებისთვის.",
                "მონაცემებთან დაკავშირებული ნებისმიერი მოთხოვნისთვის დაგვიკავშირდით: amcar2drivers@gmail.com.",
              ],
            },
          ],
        },
        terms: {
          eyebrow: "იურიდიული",
          title: "მომსახურების პირობები",
          updated: "2026 წლის 1 ივნისი",
          intro:
            "ეს პირობები არეგულირებს Amcar-ის გამოყენებას. აპლიკაციით სარგებლობით თქვენ ეთანხმებით ქვემოთ მოცემულ წესებს.",
          sections: [
            {
              heading: "სერვისის გამოყენება",
              body: [
                "Amcar დაგეხმარებათ ახლომდებარე ხელოსნების მოძებნაში, შედარებასა და მათთან დაკავშირებაში. სერვისი მძღოლებისთვის უფასოა.",
                "თქვენ თანახმა ხართ, აპლიკაცია გამოიყენოთ მხოლოდ კანონიერი მიზნებისთვის და არ დააზიანოთ მისი ფუნქციონირება.",
              ],
            },
            {
              heading: "ანგარიშები",
              body: [
                "გარკვეული ფუნქციებისთვის შესაძლოა საჭირო გახდეს ანგარიში. პასუხისმგებელი ხართ თქვენი ანგარიშის უსაფრთხოებაზე.",
                "უნდა მოგვაწოდოთ ზუსტი ინფორმაცია და დროულად განაახლოთ იგი ცვლილების შემთხვევაში.",
              ],
            },
            {
              heading: "ხელოსნები და სერვისები",
              body: [
                "Amcar არის პლატფორმა, რომელიც აკავშირებს მძღოლებსა და ხელოსნებს. ჩვენ არ ვართ მომსახურების უშუალო მიმწოდებელი.",
                "ხელოსანთან გაფორმებული ნებისმიერი შეთანხმება დადებულია თქვენსა და ხელოსანს შორის.",
              ],
            },
            {
              heading: "პასუხისმგებლობის შეზღუდვა",
              body: [
                "Amcar არ აგებს პასუხს მესამე მხარის ხელოსნების მიერ გაწეული მომსახურების ხარისხზე.",
                "სერვისი მოწოდებულია „როგორც არის“ პრინციპით, კანონით დაშვებულ ფარგლებში.",
              ],
            },
          ],
        },
        cookies: {
          eyebrow: "იურიდიული",
          title: "ქუქი-ფაილების პოლიტიკა",
          updated: "2026 წლის 1 ივნისი",
          intro:
            "ეს პოლიტიკა განმარტავს, როგორ ვიყენებთ ქუქი-ფაილებსა და მსგავს ტექნოლოგიებს Amcar-ის ვებსაიტსა და აპლიკაციაში.",
          sections: [
            {
              heading: "რა არის ქუქი-ფაილები",
              body: [
                "ქუქი-ფაილები მცირე ტექსტური ფაილებია, რომლებიც თქვენს მოწყობილობაზე ინახება და გვეხმარება საიტის გამართულ მუშაობაში.",
              ],
            },
            {
              heading: "როგორ ვიყენებთ მათ",
              body: [
                "აუცილებელი ქუქი-ფაილები: საჭიროა საიტის ძირითადი ფუნქციონირებისთვის.",
                "ანალიტიკური ქუქი-ფაილები: გვეხმარება გავიგოთ, როგორ იყენებთ საიტს, რათა გავაუმჯობესოთ იგი.",
                "პრეფერენციების ქუქი-ფაილები: იმახსოვრებს თქვენს არჩევანს, მაგალითად, ენას.",
              ],
            },
            {
              heading: "ქუქი-ფაილების მართვა",
              body: [
                "ბრაუზერის პარამეტრებიდან შეგიძლიათ ნებისმიერ დროს დაბლოკოთ ან წაშალოთ ქუქი-ფაილები.",
                "ზოგიერთი ქუქი-ფაილის გათიშვამ შესაძლოა იმოქმედოს საიტის ფუნქციონირებაზე.",
              ],
            },
          ],
        },
        licenses: {
          eyebrow: "იურიდიული",
          title: "ლიცენზიები",
          updated: "2026 წლის 1 ივნისი",
          intro:
            "Amcar აგებულია შესანიშნავი ღია წყაროს პროგრამული უზრუნველყოფის გამოყენებით. გულწრფელად ვმადლობთ ამ პროექტების შემქმნელებს.",
          sections: [
            {
              heading: "ღია წყაროს ბიბლიოთეკები",
              body: [
                "React, React Router — MIT ლიცენზია.",
                "Tailwind CSS — MIT ლიცენზია.",
                "Framer Motion — MIT ლიცენზია.",
                "Lucide Icons — ISC ლიცენზია.",
              ],
            },
            {
              heading: "სავაჭრო ნიშნები",
              body: [
                "Amcar და Amcar-ის ლოგო Amcar-ის სავაჭრო ნიშნებია. ყველა სხვა სავაჭრო ნიშანი მათი მფლობელების საკუთრებაა.",
              ],
            },
            {
              heading: "კონტაქტი",
              body: [
                "ლიცენზიებთან დაკავშირებული შეკითხვებისთვის მოგვწერეთ: amcar2drivers@gmail.com.",
              ],
            },
          ],
        },
      },
      contact: {
        eyebrow: "კონტაქტი",
        title: "დაგვიკავშირდით",
        subtitle:
          "გაქვთ შეკითხვა, წინადადება ან გჭირდებათ დახმარება? ჩვენი გუნდი მზადაა დაგეხმაროთ. აირჩიეთ თქვენთვის სასურველი გზა ან მოგვწერეთ ფორმის მეშვეობით.",
        methods: [
          { title: "ტელეფონი", value: "(+995) 592 076 515", desc: "" },
          { title: "მხარდაჭერა", value: "amcar2drivers@gmail.com", desc: "დახმარება აპლიკაციასთან" },
          { title: "მდებარეობა", value: "თბილისი, საქართველო", desc: "" },
          { title: "ხელმისაწვდომობა", value: "24/7", desc: "ჩვენ ყოველთვის თქვენს გვერდით ვართ" },
        ],
        formTitle: "გამოგვიგზავნეთ შეტყობინება",
        formSubtitle: "შეავსეთ ფორმა და მალე დაგიკავშირდებით.",
        fields: {
          name: "სახელი",
          namePh: "თქვენი სახელი",
          email: "ელფოსტა",
          emailPh: "you@example.com",
          subject: "თემა",
          subjectPh: "რის შესახებ გვწერთ?",
          message: "შეტყობინება",
          messagePh: "მოგვიყევით მეტი…",
        },
        send: "შეტყობინების გაგზავნა",
        sending: "იგზავნება…",
        error: "შეტყობინების გაგზავნა ვერ მოხერხდა. სცადეთ ხელახლა.",
        success: "გმადლობთ! თქვენი შეტყობინება მიღებულია — მალე დაგიკავშირდებით.",
      },
      notFound: {
        title: "გვერდი ვერ მოიძებნა",
        subtitle: "ბოდიში, გვერდი, რომელსაც ეძებთ, არ არსებობს ან გადატანილია.",
        cta: "მთავარ გვერდზე დაბრუნება",
      },
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
      toggleTheme: "მუქ/ღია რეჟიმის შეცვლა",
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
        "Amcar helps drivers locate nearby mechanics, compare services and prices, and get back on the road with confidence.",
      downloadApp: "Download App",
      watchDemo: "Watch Demo",
      lovedBy: "Loved by 10,000+ drivers",
      chip1Title: "6 min away",
      chip1Sub: "AutoCare Pro",
      chip2Title: "$39+ oil change",
      chip2Sub: "Best nearby price",
    },

    features: {
      eyebrow: "Why Amcar",
      title: "Everything you need to choose the right mechanic",
      subtitle:
        "No more guesswork or endless phone calls. Amcar gives drivers the clarity to decide in seconds.",
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
            "Open Amcar and instantly see trusted mechanics near you on a live, interactive map.",
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
      eyebrow: "Why Amcar",
      title: "Built for drivers and mechanics alike",
      subtitle:
        "Amcar helps drivers find trusted help fast — and connects mechanics with new customers.",
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
      subtitle: "Drivers across the country trust Amcar when it matters most.",
      items: [
        {
          name: "Maya Thompson",
          role: "Daily commuter",
          quote:
            "My check-engine light came on during a road trip. Amcar found a verified shop 4 minutes away with great reviews. Lifesaver.",
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
            "Even I use Amcar when a job's out of my depth. The map and service breakdowns are genuinely well designed.",
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
          q: "Is Amcar free to use?",
          a: "Yes. Downloading Amcar and finding, comparing, and navigating to mechanics is completely free for drivers.",
        },
        {
          q: "How are mechanics verified?",
          a: "Every shop on Amcar goes through a verification process and is continuously rated by real drivers, so listings stay trustworthy.",
        },
        {
          q: "Are the prices shown final?",
          a: "We display transparent starting prices so you can compare fairly. Final pricing is confirmed with the shop based on your specific needs.",
        },
        {
          q: "Which cities is Amcar available in?",
          a: "Amcar is just launching. We're onboarding verified mechanics now, and new areas are added regularly.",
        },
        {
          q: "Which devices are supported?",
          a: "Amcar is available on Android right now. Just download it from Google Play to get started — an iOS version is coming soon.",
        },
      ],
    },

    cta: {
      title: "Everything you need for vehicle maintenance in one app",
      description:
        "Find trusted mechanics in seconds. Download Amcar and take the stress out of car care.",
      perks: ["Free to download", "No subscription", "On Android"],
    },

    footer: {
      brandDesc:
        "Find trusted mechanics faster. Compare services and prices, then get back on the road with confidence.",
      productTitle: "Product",
      companyTitle: "Company",
      legalTitle: "Legal",
      product: ["Features", "How it works", "Download"],
      company: ["About", "Press", "Blog", "Contact"],
      legal: ["Privacy", "Terms", "Cookies", "Licenses"],
      getOnPhone: "Get Amcar on your phone",
      getOnPhoneSub: "Free to download. Available on Android.",
      rights: "All rights reserved.",
      operational: "All systems operational",
    },

    store: {
      appStoreTop: "Download on the",
      appStoreBottom: "App Store",
      playTop: "Get it on",
      playBottom: "Google Play",
    },

    pages: {
      backHome: "Back to home",
      updatedLabel: "Last updated",
      tocTitle: "On this page",
      legal: {
        privacy: {
          eyebrow: "Legal",
          title: "Privacy Policy",
          updated: "June 1, 2026",
          intro:
            "Your privacy matters to us. This policy explains what data we collect, how we use it, and the rights you have when using Amcar.",
          sections: [
            {
              heading: "What we collect",
              body: [
                "Account details such as your name, phone number, and email when you sign up.",
                "Location data to show nearby mechanics — only with your permission.",
                "Usage data such as the shops you view and your search history, to improve the service.",
              ],
            },
            {
              heading: "How we use your data",
              body: [
                "To find, compare, and navigate to trusted mechanics for you.",
                "To improve the app, keep it secure, and fix issues.",
                "To send you important notices about your account and requests.",
              ],
            },
            {
              heading: "Data sharing",
              body: [
                "We never sell your personal data. We only share information with verified mechanics when you choose to contact them.",
                "We may share data with trusted service providers who help us run the app, under strict confidentiality terms.",
              ],
            },
            {
              heading: "Your rights",
              body: [
                "You can request access to, correction of, or deletion of your data at any time.",
                "For any data request, contact us at amcar2drivers@gmail.com.",
              ],
            },
          ],
        },
        terms: {
          eyebrow: "Legal",
          title: "Terms of Service",
          updated: "June 1, 2026",
          intro:
            "These terms govern your use of Amcar. By using the app, you agree to the rules below.",
          sections: [
            {
              heading: "Using the service",
              body: [
                "Amcar helps you find, compare, and connect with nearby mechanics. The service is free for drivers.",
                "You agree to use the app only for lawful purposes and not to disrupt how it works.",
              ],
            },
            {
              heading: "Accounts",
              body: [
                "Some features may require an account. You are responsible for keeping your account secure.",
                "You must provide accurate information and keep it up to date.",
              ],
            },
            {
              heading: "Mechanics and services",
              body: [
                "Amcar is a platform that connects drivers and mechanics. We are not the direct provider of repair services.",
                "Any agreement you make with a mechanic is between you and that mechanic.",
              ],
            },
            {
              heading: "Limitation of liability",
              body: [
                "Amcar is not responsible for the quality of services provided by third-party mechanics.",
                "The service is provided “as is,” to the extent permitted by law.",
              ],
            },
          ],
        },
        cookies: {
          eyebrow: "Legal",
          title: "Cookie Policy",
          updated: "June 1, 2026",
          intro:
            "This policy explains how we use cookies and similar technologies on the Amcar website and app.",
          sections: [
            {
              heading: "What cookies are",
              body: [
                "Cookies are small text files stored on your device that help the site work properly.",
              ],
            },
            {
              heading: "How we use them",
              body: [
                "Essential cookies: required for core site functionality.",
                "Analytics cookies: help us understand how you use the site so we can improve it.",
                "Preference cookies: remember your choices, such as language.",
              ],
            },
            {
              heading: "Managing cookies",
              body: [
                "You can block or delete cookies at any time from your browser settings.",
                "Disabling some cookies may affect how the site works.",
              ],
            },
          ],
        },
        licenses: {
          eyebrow: "Legal",
          title: "Licenses",
          updated: "June 1, 2026",
          intro:
            "Amcar is built on top of excellent open-source software. We're grateful to the people behind these projects.",
          sections: [
            {
              heading: "Open-source libraries",
              body: [
                "React, React Router — MIT License.",
                "Tailwind CSS — MIT License.",
                "Framer Motion — MIT License.",
                "Lucide Icons — ISC License.",
              ],
            },
            {
              heading: "Trademarks",
              body: [
                "Amcar and the Amcar logo are trademarks of Amcar. All other trademarks are the property of their respective owners.",
              ],
            },
            {
              heading: "Contact",
              body: [
                "For licensing questions, email us at amcar2drivers@gmail.com.",
              ],
            },
          ],
        },
      },
      contact: {
        eyebrow: "Contact",
        title: "Get in touch",
        subtitle:
          "Have a question, a suggestion, or need a hand? Our team is here to help. Pick whatever channel suits you, or send us a message below.",
        methods: [
          { title: "Phone", value: "(+995) 592 076 515", desc: "" },
          { title: "Support", value: "amcar2drivers@gmail.com", desc: "Help with the app" },
          { title: "Location", value: "Tbilisi, Georgia", desc: "" },
          { title: "Availability", value: "24/7", desc: "We're always here to help" },
        ],
        formTitle: "Send us a message",
        formSubtitle: "Fill out the form and we'll get back to you shortly.",
        fields: {
          name: "Name",
          namePh: "Your name",
          email: "Email",
          emailPh: "you@example.com",
          subject: "Subject",
          subjectPh: "What's this about?",
          message: "Message",
          messagePh: "Tell us more…",
        },
        send: "Send message",
        sending: "Sending…",
        error: "Couldn't send your message. Please try again.",
        success: "Thanks! Your message has been received — we'll be in touch soon.",
      },
      notFound: {
        title: "Page not found",
        subtitle: "Sorry, the page you're looking for doesn't exist or has moved.",
        cta: "Back to home",
      },
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
      toggleTheme: "Toggle dark mode",
    },
  },
};
