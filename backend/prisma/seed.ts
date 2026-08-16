import { PrismaClient, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

// ── helpers ──────────────────────────────────────────────────────────────────

/** Strip [cite: …] annotations left over from source documents */
function clean(text: string): string {
  return text.replace(/\[cite:[^\]]*\]/g, '').replace(/\s{2,}/g, ' ').trim();
}

// ── seed data ─────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱  Starting seed…');

  // ── 1. Test user ────────────────────────────────────────────────────────────
  const testUser = await prisma.user.upsert({
    where: { email: 'demo@finlit.app' },
    update: {},
    create: {
      id: '00000000-0000-4000-8000-000000000099',
      email: 'demo@finlit.app',
      username: 'demo_user',
      passwordHash: '$2b$10$placeholderHashForDemoUserOnly',
      displayName: 'Demo User',
    },
  });
  console.log(`✅  User: ${testUser.email}`);

  // ── 2. Course ────────────────────────────────────────────────────────────────
  const course = await prisma.course.upsert({
    where: { slug: 'financial-literacy-101' },
    update: {},
    create: {
      title: 'Financial Literacy 101',
      slug: 'financial-literacy-101',
      description:
        'Master the essentials of personal finance — from credit cards to investing and insurance.',
      difficulty: Difficulty.BEGINNER,
      isPublished: true,
    },
  });
  console.log(`✅  Course: ${course.title}`);

  // ── 3. Modules ───────────────────────────────────────────────────────────────
  const moduleCC = await prisma.module.upsert({
    where: { courseId_order: { courseId: course.id, order: 1 } },
    update: {},
    create: {
      courseId: course.id,
      title: 'Credit Cards',
      description: 'How credit really works and how to use it to your advantage.',
      order: 1,
    },
  });

  const moduleInsurance = await prisma.module.upsert({
    where: { courseId_order: { courseId: course.id, order: 2 } },
    update: {},
    create: {
      courseId: course.id,
      title: 'Insurance',
      description: "Protect your finances against life's unexpected events.",
      order: 2,
    },
  });

  const moduleIndex = await prisma.module.upsert({
    where: { courseId_order: { courseId: course.id, order: 3 } },
    update: {},
    create: {
      courseId: course.id,
      title: 'Investing & Index Funds',
      description: 'Build long-term wealth with passive index investing.',
      order: 3,
    },
  });

  console.log('✅  Modules created');

  // ── 4. Lessons & Slides ───────────────────────────────────────────────────────

  // ── 4a. Credit Card Masterclass ──────────────────────────────────────────────
  const lessonCC = await prisma.lesson.upsert({
    where: { moduleId_order: { moduleId: moduleCC.id, order: 1 } },
    update: {},
    create: {
      moduleId: moduleCC.id,
      title: 'Credit Card Masterclass',
      description: 'Understand the real cost — and benefit — of a credit card.',
      order: 1,
      xpReward: 50,
    },
  });

  const creditCardSlides = [
    {
      order: 1,
      type: 'TEXT' as const,
      title: 'The Ad Cracks Open',
      body: clean(
        "You've seen the ads: cashback, airport lounges, 5X reward points. What nobody shows you in that ad: the exact math of how a card can quietly cost you money instead. We'll get to the rewards. First — the thing that decides whether you're even allowed to play that game.",
      ),
    },
    {
      order: 2,
      type: 'TEXT' as const,
      title: 'The Ghost Protocol',
      body: clean(
        "If you only use cash and debit cards, you're financially invisible. To a bank, a 28-year-old with zero credit history reads exactly as risky as an 18-year-old. You are a ghost.",
      ),
    },
    {
      order: 3,
      type: 'TEXT' as const,
      title: 'The Trust Test',
      body: clean(
        "A credit card isn't extra money. It's a trust test. Banks watch how you handle a small amount of borrowed money before they'll ever trust you with a big one — a car loan, a home loan.",
      ),
    },
    {
      order: 4,
      type: 'TEXT' as const,
      title: 'The Debit Math',
      body: clean(
        'Swipe a debit card, and the money leaves your bank instantly. If someone steals your debit card info, they steal your actual cash — you have to fight the bank to get it back.',
      ),
    },
    {
      order: 5,
      type: 'TEXT' as const,
      title: 'The Shield of the Credit Card',
      body: clean(
        "Swipe a credit card, and you're spending the bank's money. If fraud happens, the bank's money is stolen, not yours. They fight to fix it — your checking account stays untouched.",
      ),
    },
    {
      order: 6,
      type: 'TEXT' as const,
      title: 'Borrowed Time, Not Free Money',
      body: clean(
        "This isn't extra cash. It's a 45-day, interest-free loan — if you know the rules. That gap is breathing room, not a reward.",
      ),
    },
    {
      order: 7,
      type: 'QUIZ' as const,
      question: 'What makes someone a "Transactor" vs a "Revolver"?',
      options: [
        'Transactors use debit; Revolvers use credit',
        'Transactors pay their full bill every time; Revolvers carry a balance',
        'Transactors earn more cashback',
        'Revolvers have better credit scores',
      ],
      correctOption: 1,
      explanation:
        'Transactors pay in full every month — zero interest, always. Revolvers carry a balance and pay interest, funding the bank\'s profit margin.',
    },
    {
      order: 8,
      type: 'TEXT' as const,
      title: 'The Goal',
      body: clean(
        "By the end of this lesson, you'll know exactly how to be a Transactor. Including the one number that decides whether you ever pay interest at all.",
      ),
    },
    {
      order: 9,
      type: 'QUIZ' as const,
      question: 'Which is the safest way to pay online to protect against fraud?',
      options: [
        'Debit card — money leaves faster',
        'Cash on delivery',
        "Credit card — bank's money is at risk, not yours",
        'UPI — instant settlement',
      ],
      correctOption: 2,
      explanation:
        "With a credit card, if fraud happens the bank's money is stolen, not yours. Your checking account stays untouched while the bank resolves it.",
    },
  ];

  for (const slide of creditCardSlides) {
    await prisma.slide.upsert({
      where: { lessonId_order: { lessonId: lessonCC.id, order: slide.order } },
      update: {},
      create: { lessonId: lessonCC.id, ...slide },
    });
  }
  console.log(`✅  Lesson: ${lessonCC.title} (${creditCardSlides.length} slides)`);

  // ── 4b. Insurance Basics ─────────────────────────────────────────────────────
  const lessonInsurance = await prisma.lesson.upsert({
    where: { moduleId_order: { moduleId: moduleInsurance.id, order: 1 } },
    update: {},
    create: {
      moduleId: moduleInsurance.id,
      title: 'Insurance Basics',
      description: 'Why insurance is not a product but a financial shield.',
      order: 1,
      xpReward: 40,
    },
  });

  const insuranceSlides = [
    {
      order: 1,
      type: 'TEXT' as const,
      title: 'Risk Transfer',
      body: clean(
        "Insurance isn't really a product. It's Risk Transfer. You aren't buying a service — you're paying a financial institution a small, regular fee to take a catastrophic-cost scenario off your shoulders.",
      ),
    },
    {
      order: 2,
      type: 'TEXT' as const,
      title: 'Your Tranches Are Exposed',
      body: clean(
        'Right now, a job loss and a medical emergency happening close together could seriously damage your finances — with no policy in place to absorb the hit.',
      ),
    },
    {
      order: 3,
      type: 'TEXT' as const,
      title: 'Shield 3: The Baseline',
      body: clean(
        "Don't insure cheap things. Insure what would actually hurt to replace tomorrow — your car, or your apartment's contents in a fire or theft.",
      ),
    },
    {
      order: 4,
      type: 'TEXT' as const,
      title: 'Shield 1: The Body',
      body: clean(
        "Your greatest wealth-building asset right now is your ability to work. Health insurance ensures a medical problem doesn't also become a financial one. Your employer's policy helps while you're there — but it usually ends the day you quit or get laid off, right when you might need it most.",
      ),
    },
    {
      order: 5,
      type: 'TEXT' as const,
      title: 'An Asymmetric Bet',
      body: clean(
        "It's an asymmetric bet. The insurer contractually agrees to cover a much larger cost if the covered event happens — as long as your policy is active and the claim fits its terms.",
      ),
    },
    {
      order: 6,
      type: 'TEXT' as const,
      title: 'Protect the Engine',
      body: clean(
        "You can't confidently play offense if your defense has an open gap. Look up a direct base health and term policy today — read the exclusions and waiting period before you buy. Protect the engine.",
      ),
    },
    {
      order: 7,
      type: 'QUIZ' as const,
      question: 'What is the main purpose of insurance?',
      options: [
        'To make a profit from premiums',
        'To invest your savings',
        'To transfer catastrophic financial risk to an institution',
        'To replace your emergency fund',
      ],
      correctOption: 2,
      explanation:
        "Insurance is risk transfer — you pay a small regular fee so a catastrophic cost scenario (hospital bill, accident) doesn't wipe out your savings.",
    },
    {
      order: 8,
      type: 'TEXT' as const,
      title: 'Fixing the Gap',
      body: clean(
        "Fixing this doesn't take long. A basic term and health policy at your age is often surprisingly affordable — though the exact cost depends on your age, health, and cover amount. You don't need a premium agent, just a basic, direct-to-consumer policy to plug the gap.",
      ),
    },
    {
      order: 9,
      type: 'TEXT' as const,
      title: 'The Small Chance',
      body: clean(
        "You might have a 99%+ chance of being fine this year. But that small remaining chance of a serious medical emergency doesn't just hurt — it can wipe out years of savings in one hospital bill.",
      ),
    },
    {
      order: 10,
      type: 'QUIZ' as const,
      question: "Your employer's group health policy covers you while employed. What's the risk?",
      options: [
        'The premiums are too high',
        'It covers pre-existing conditions too broadly',
        "It ends when you quit or get laid off — right when you might need it",
        'It only covers accidents, not illness',
      ],
      correctOption: 2,
      explanation:
        "Employer policies are great while you're employed, but they disappear the moment you leave — often at the worst possible time. A personal base policy fills that gap.",
    },
  ];

  for (const slide of insuranceSlides) {
    await prisma.slide.upsert({
      where: { lessonId_order: { lessonId: lessonInsurance.id, order: slide.order } },
      update: {},
      create: { lessonId: lessonInsurance.id, ...slide },
    });
  }
  console.log(`✅  Lesson: ${lessonInsurance.title} (${insuranceSlides.length} slides)`);

  // ── 4c. Index Funds & Investing ──────────────────────────────────────────────
  const lessonIndex = await prisma.lesson.upsert({
    where: { moduleId_order: { moduleId: moduleIndex.id, order: 1 } },
    update: {},
    create: {
      moduleId: moduleIndex.id,
      title: 'Index Funds: The Boring Wealth Engine',
      description: 'Why passive index investing beats most active strategies.',
      order: 1,
      xpReward: 60,
    },
  });

  const indexSlides = [
    {
      order: 1,
      type: 'TEXT' as const,
      title: 'The Puzzle Grid',
      body: clean(
        "You don't need to predict which company wins tomorrow. You don't need to out-trade an algorithm. You just own a tiny slice of every top company in the country — all at once.",
      ),
    },
    {
      order: 2,
      type: 'TEXT' as const,
      title: 'The Index Fund',
      body: clean(
        "Welcome to The Index Fund. The most boring, unemotional wealth-building tool most people never touch. It doesn't guess. It simply owns the top 50 companies — the NIFTY 50.",
      ),
    },
    {
      order: 3,
      type: 'TEXT' as const,
      title: 'The Haystack',
      body: clean(
        '"Don\'t look for the needle in the haystack. Just buy the haystack." — John Bogle, creator of the index fund.',
      ),
    },
    {
      order: 4,
      type: 'TEXT' as const,
      title: 'The Brutal Math',
      body: clean(
        'A statistic most people never hear: over 10 years, a simple, passive index fund has historically outperformed the majority of actively-managed funds — funds you\'d otherwise pay real fees to access.',
      ),
    },
    {
      order: 5,
      type: 'QUIZ' as const,
      question: 'What percentage of professional fund managers in India failed to beat a plain index fund over 10 years?',
      options: ['Around 25%', 'Around 50%', 'Around 76%', 'Around 90%'],
      correctOption: 2,
      explanation:
        "76% of professional fund managers in India failed to beat a plain index fund over the last 10 years. You're paying full price for someone to lose to a computer.",
    },
    {
      order: 6,
      type: 'TEXT' as const,
      title: 'Self-Cleaning Machine',
      body: clean(
        'It cleans itself. The NIFTY 50 is a self-cleaning index. If a company falls out of the top 50, it\'s automatically replaced by the next winner. You never have to read an earnings report or click "sell."',
      ),
    },
    {
      order: 7,
      type: 'TEXT' as const,
      title: 'Your Unfair Advantage',
      body: clean(
        "Whatever your age — if you're early in your earning years, you have one asset no algorithm or billionaire can buy more of: Time. The Index Engine doesn't need technical skill — it needs patience.",
      ),
    },
    {
      order: 8,
      type: 'TEXT' as const,
      title: 'The SIP Rule',
      body: clean(
        'Remove Emotion. The engine works best when you remove human emotion from it. Automate it through a SIP — money drafted from your account on a fixed date, before your brain gets a chance to talk you out of it.',
      ),
    },
    {
      order: 9,
      type: 'QUIZ' as const,
      question: 'What does SIP stand for and why is it powerful?',
      options: [
        'Stock Investment Plan — lets you pick individual stocks automatically',
        'Systematic Investment Plan — automates investing on a fixed date, removing emotion',
        'Savings Interest Plan — grows savings in a bank account',
        'Secure Investment Protocol — a government-backed scheme',
      ],
      correctOption: 1,
      explanation:
        'SIP (Systematic Investment Plan) automates your investment on a fixed date every month, removing the temptation to time the market or skip months.',
    },
    {
      order: 10,
      type: 'TEXT' as const,
      title: 'Rent vs. Buy — The Two Camps',
      body: clean(
        '"Renting is throwing money away." "Buying is a trap that kills your mobility." Your relatives believe the first. Some finance content believes the second. Neither camp has actually run your numbers. Let\'s run them.',
      ),
    },
    {
      order: 11,
      type: 'TEXT' as const,
      title: 'Illusion of Ownership',
      body: clean(
        "With a 20-year EMI, you're building equity in a home the bank has a legal claim on. You're covering housing costs either way — the real question is whose asset it becomes over time.",
      ),
    },
    {
      order: 12,
      type: 'TEXT' as const,
      title: 'The Concrete Anchor',
      body: clean(
        'Real estate is "illiquid." Need money fast for an emergency or a big opportunity? Your equity is tied up in bricks, not sitting ready in an account.',
      ),
    },
    {
      order: 13,
      type: 'TEXT' as const,
      title: 'Greatest Asset of Your 20s',
      body: clean(
        'At 24, one underrated asset is mobility. The freedom to move cities for a better job, a new industry, or a role you actually want. A 20-year loan can quietly take that option off the table.',
      ),
    },
    {
      order: 14,
      type: 'TEXT' as const,
      title: 'The Real Formula',
      body: clean(
        '"Rent + Invest" only works if you actually invest. Every month, for years, without skipping. If you don\'t trust yourself to invest the gap, the math on paper won\'t match your actual life.',
      ),
    },
    {
      order: 15,
      type: 'TEXT' as const,
      title: 'Your Real Comparison',
      body: clean(
        'Rent + Invest: ~₹1.09 Cr in 15 yrs. Buy (with tax/appreciation): ~₹2 Cr in 15 yrs. Both build wealth. The real difference is liquidity now vs. a fixed asset later.',
      ),
    },
    {
      order: 16,
      type: 'QUIZ' as const,
      question: 'If you invest the ₹20L down payment at ~12% for 20 years, what could it grow to?',
      options: ['~₹50 Lakhs', '~₹1.9 Crores', '~₹5 Crores', '~₹25 Lakhs'],
      correctOption: 1,
      explanation:
        'At a historical index fund average of ~12%, ₹20 Lakhs invested for 20 years could grow to roughly ₹1.9 Crores. Historical average, not a promise — real returns move with the market.',
    },
    {
      order: 17,
      type: 'TEXT' as const,
      title: 'Final Action',
      body: clean(
        "There's no universally correct answer. Flexibility and liquidity matter more right now? Renting is strong. Stability and a 10+ year commitment matter? So is buying. Open your investment app and look up index funds tracking the NIFTY 50 — set up a SIP into the one that fits.",
      ),
    },
  ];

  for (const slide of indexSlides) {
    await prisma.slide.upsert({
      where: { lessonId_order: { lessonId: lessonIndex.id, order: slide.order } },
      update: {},
      create: { lessonId: lessonIndex.id, ...slide },
    });
  }
  console.log(`✅  Lesson: ${lessonIndex.title} (${indexSlides.length} slides)`);

  // ── 5. Enroll test user in the course ────────────────────────────────────────
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: testUser.id, courseId: course.id } },
    update: {},
    create: { userId: testUser.id, courseId: course.id },
  });
  console.log(`✅  Enrolled ${testUser.displayName} in ${course.title}`);

  console.log('\n🎉  Seed complete!');
  console.log(`    Course:   ${course.title}`);
  console.log(`    Modules:  3`);
  console.log(`    Lessons:  3  (Credit Card · Insurance · Index Funds)`);
  console.log(
    `    Slides:   ${creditCardSlides.length + insuranceSlides.length + indexSlides.length} total`,
  );
  console.log(`    Test user: demo@finlit.app  (id: ${testUser.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
