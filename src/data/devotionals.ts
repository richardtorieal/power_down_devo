export interface DevotionalDay {
  dayNumber: number;
  scripture: string;
  reflection: string;
}

export interface WeekData {
  weekNumber: number;
  theme: string;
  days: DevotionalDay[];
  journalPrompts: string[];
}

export const coreStrategy = {
  church: "One Community Church",
  corePlan: "Spiritual Intimacy expands Spiritual Capacity, which expands Spiritual Authority (Ephesians 3:14-21).",
  faithSteps: [
    { letter: "F", title: "Focus on your goals", description: "Set your eyes on spiritual growth and align your choices with God's purpose." },
    { letter: "A", title: "Act with integrity", description: "Live out your beliefs transparently, maintaining honor in private and public actions." },
    { letter: "I", title: "Inspire others", description: "Encourage those around you through a walk that demonstrates Christ's love." },
    { letter: "T", title: "Trust the process", description: "Surrender to God's timing and development, knowing He makes all things beautiful." },
    { letter: "H", title: "Hold on to hope", description: "Keep an unwavering expectation of God's goodness, regardless of current storms." }
  ]
};

export const weeklyData: WeekData[] = [
  {
    weekNumber: 1,
    theme: "A devotional guide for understanding what faith is and placing your trust in God's character.",
    days: [
      {
        dayNumber: 1,
        scripture: "Hebrews 11:1-6",
        reflection: "How does this definition of faith challenge your current understanding of \"seeing is believing\"?"
      },
      {
        dayNumber: 2,
        scripture: "Romans 10:9-17",
        reflection: "What practical steps can you take to surround yourself with more of God's Word this week?"
      },
      {
        dayNumber: 3,
        scripture: "Proverbs 3:5-6",
        reflection: "Is there an area in your life right now where you are relying on your own understanding instead of God's?"
      },
      {
        dayNumber: 4,
        scripture: "Ephesians 2:8-9",
        reflection: "How does knowing that faith is a free gift—not something you must earn—change your relationship with God?"
      },
      {
        dayNumber: 5,
        scripture: "Mark 11:22-24",
        reflection: "When you pray, do you honestly expect God to answer, or are you just going through the motions?"
      },
      {
        dayNumber: 6,
        scripture: "2 Corinthians 5:7",
        reflection: "What would your day look like today if you truly made choices based on faith rather than what you see around you?"
      },
      {
        dayNumber: 7,
        scripture: "Psalm 9:9-10",
        reflection: "Think back to a time God proved Himself trustworthy to you. How can that memory strengthen your current faith?"
      }
    ],
    journalPrompts: [
      "Write an honest evaluation of the current state of your faith. Where do you find it easiest to trust God, and where is it hardest?",
      "Write a prayer asking God to build your foundation on His unchanging character rather than your changing circumstances."
    ]
  },
  {
    weekNumber: 2,
    theme: "A devotional guide for demonstrating your faith through obedience, perseverance, and action.",
    days: [
      {
        dayNumber: 8,
        scripture: "James 2:14-26",
        reflection: "What is one concrete action you can take today to show that your faith is alive and active?"
      },
      {
        dayNumber: 9,
        scripture: "James 1:2-8",
        reflection: "How can shifting your perspective to see trials as faith-builders change the way you handle a current hardship?"
      },
      {
        dayNumber: 10,
        scripture: "1 Samuel 17:41-50",
        reflection: "What is the \"Goliath\" in your life right now, and how can you face it using David's posture of faith?"
      },
      {
        dayNumber: 11,
        scripture: "Daniel 3:16-28",
        reflection: "Do you have an \"even if He doesn't\" kind of faith? How can you develop that level of commitment to God?"
      },
      {
        dayNumber: 12,
        scripture: "Luke 17:5-6",
        reflection: "You do not need massive faith to see God move; you just need to direct what little faith you have toward Him. How does this comfort you?"
      },
      {
        dayNumber: 13,
        scripture: "Hebrews 12:1-3",
        reflection: "What is a specific weight or distraction you need to throw off today so you can run your spiritual race effectively?"
      },
      {
        dayNumber: 14,
        scripture: "Galatians 2:20",
        reflection: "What does it practically mean for you to let Christ live through you today instead of trying to do it on your own?"
      }
    ],
    journalPrompts: [
      "Reflect on a time when taking a step of obedience required immense faith. What did you learn about God through that outcome?",
      "Identify a \"weight\" that is slowing down your spiritual walk. Write down a strategy to surrender that specific burden to God this week."
    ]
  },
  {
    weekNumber: 3,
    theme: "A devotional guide for overcoming anxiety, doubt, and fear by focusing on God's sovereignty.",
    days: [
      {
        dayNumber: 15,
        scripture: "Matthew 14:22-33",
        reflection: "When Peter took his eyes off Jesus, he sank. What are the \"waves\" in your life that tempt you to look away from Jesus?"
      },
      {
        dayNumber: 16,
        scripture: "Philippians 4:4-7",
        reflection: "Turn your primary worry today into a specific prayer request. What peace do you feel after handing it over?"
      },
      {
        dayNumber: 17,
        scripture: "Isaiah 41:10",
        reflection: "God promises His presence, strength, and help. Which of these three promises do you need to cling to the most right now?"
      },
      {
        dayNumber: 18,
        scripture: "2 Timothy 1:7",
        reflection: "Fear does not come from God. When fear strikes today, how can you actively lean into His power, love, and self-discipline?"
      },
      {
        dayNumber: 19,
        scripture: "Psalm 27:1-4",
        reflection: "What does making the Lord your \"light and salvation\" do to the fears that try to overwhelm you?"
      },
      {
        dayNumber: 20,
        scripture: "Hebrews 12:1-3",
        reflection: "Jesus said, \"Don't be afraid; just believe.\" In what area of your life is Jesus speaking those exact words to you right now?"
      },
      {
        dayNumber: 21,
        scripture: "1 Peter 5:6-11",
        reflection: "What does it look like to practically \"cast your anxiety\" on God instead of picking it back up again?"
      }
    ],
    journalPrompts: [
      "Make a list of your top three fears or anxieties right now. Underneath each one, write a specific scripture from this week that counters that fear.",
      "Describe a situation where fear almost stopped you from doing the right thing, but faith carried you through."
    ]
  },
  {
    weekNumber: 4,
    theme: "A devotional guide for experiencing the peace, answers, and spiritual growth that come through faith.",
    days: [
      {
        dayNumber: 22,
        scripture: "Hebrews 11:32-40",
        reflection: "True faith looks forward to God's ultimate eternal rewards. How does an eternal perspective change your view of daily struggles?"
      },
      {
        dayNumber: 23,
        scripture: "Matthew 21:18-22",
        reflection: "Is there a prayer request you have given up on? How can you pray for it today with renewed faith?"
      },
      {
        dayNumber: 24,
        scripture: "Romans 5:1-5",
        reflection: "How have past sufferings produced endurance and character in your life, ultimately strengthening your hope?"
      },
      {
        dayNumber: 25,
        scripture: "1 John 5:1-5",
        reflection: "What does it mean to you that your faith in Christ gives you victory over the pressures and temptations of the world?"
      },
      {
        dayNumber: 26,
        scripture: "Ephesians 3:16-21",
        reflection: "Does your life currently overflow with joy and peace? If not, how can you rely more on the power of the Holy Spirit today?"
      },
      {
        dayNumber: 27,
        scripture: "1 Peter 1:3-9",
        reflection: "God can do immeasurably more than all we ask or imagine. What is a \"too big to ask\" prayer you need to bring to Him?"
      },
      {
        dayNumber: 28,
        scripture: "1 Peter 1:3-9",
        reflection: "Why is a tested, proven faith more precious than gold? How does this truth give purpose to your trials?"
      }
    ],
    journalPrompts: [
      "Write down a detailed list of prayers God has answered in your past. Use this \"altar of remembrance\" to fuel your faith for current requests.",
      "Describe what internal peace feels like to you. How does your faith anchor that peace when external circumstances are chaotic?"
    ]
  },
  {
    weekNumber: 5,
    theme: "A devotional guide for equipping yourself for spiritual battles and maintaining faith to the end.",
    days: [
      {
        dayNumber: 29,
        scripture: "Ephesians 6:10-17",
        reflection: "How does the \"shield of faith\" actively extinguish the flaming arrows of doubt, lies, or discouragement aimed at you?"
      },
      {
        dayNumber: 30,
        scripture: "1 Timothy 6:11-12",
        reflection: "What does it mean to \"fight the good fight of faith\" in your everyday interactions with family, coworkers, or neighbors?"
      },
      {
        dayNumber: 31,
        scripture: "2 Timothy 4:6-8",
        reflection: "When you look back at this 31-day journey, what is one major area where your faith has grown or shifted?"
      }
    ],
    journalPrompts: [
      "Imagine looking back on your life decades from now. What do you want your legacy of faith to look like to those who knew you?",
      "Write out a declaration of faith for your future, committing to trust God's plan, fight the good fight, and keep the faith no matter what comes."
    ]
  }
];
