const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Campaign = require('./models/Campaign');
const Contribution = require('./models/Contribution');

dotenv.config();

const sampleCampaigns = [
  {
    title: 'AuraRing - Next Gen Smart Health Companion',
    tagline: 'Track sleep, HRV, recovery and daily performance with zero subscription fees.',
    description: 'AuraRing is engineered with titanium micro-sensors to deliver clinical-grade health analytics straight to your smartphone. With up to 10 days of battery life, lightweight water resistance up to 100m, and an intuitive dashboard, AuraRing empowers you to unlock your peak human potential.',
    category: 'Technology',
    targetGoal: 45000,
    currentAmount: 32400,
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days left
    imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=1000&q=80',
    backersCount: 184,
    status: 'active',
    rewards: [
      {
        title: 'Early Bird Starter Pack',
        amount: 149,
        description: '1x AuraRing Titanium Edition + Wireless Charger Stand + Companion App Lifetime Access.',
        estimatedDelivery: 'October 2026',
        backersCount: 120
      },
      {
        title: 'Duo Pioneer Bundle',
        amount: 279,
        description: '2x AuraRing Titanium Edition + 2 Wireless Chargers + Custom Ring Sizing Kit.',
        estimatedDelivery: 'November 2026',
        backersCount: 64
      }
    ],
    updates: [
      {
        title: 'First 100 Backers Milestone Reached!',
        content: 'We are thrilled to announce that we crossed our first 100 backers within 48 hours of launch! Manufacturing prototypes are being finalized in our Zurich laboratory.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ]
  },
  {
    title: 'EcoPod - Modular Zero-Waste Hydroponic Garden',
    tagline: 'Grow organic vegetables, fresh herbs, and microgreens in any indoor apartment space.',
    description: 'EcoPod brings sustainable farming into your living room. Featuring AI-assisted LED lighting, automatic water recirculation, and zero soil requirements. EcoPod uses 95% less water than traditional gardening.',
    category: 'Green Tech',
    targetGoal: 25000,
    currentAmount: 28900,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80',
    backersCount: 215,
    status: 'successful',
    rewards: [
      {
        title: 'Single Vertical Pod',
        amount: 99,
        description: '1x Hydroponic Pod + Seed Starter Pods (Basil, Mint, Kale) + Nutrient Concentrate.',
        estimatedDelivery: 'September 2026',
        backersCount: 150
      },
      {
        title: 'Family Tower System',
        amount: 229,
        description: '3x Stackable Vertical Pods + Automated Hydro Tower + 1 Year Organic Seed Supply.',
        estimatedDelivery: 'September 2026',
        backersCount: 65
      }
    ],
    updates: [
      {
        title: 'Goal Funded! 100% Milestone Reached 🎉',
        content: 'Thanks to your overwhelming support, EcoPod is officially 100% funded! We are unlocking our stretch goal: Free organic strawberry seed packs for all backers!',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ]
  },
  {
    title: 'ChronoQuest: Tactical RPG Board Game',
    tagline: 'An immersive story-driven fantasy world with 40+ miniature figurines and branching storylines.',
    description: 'Journey through time in ChronoQuest! Form alliances, conquer ancient dungeons, and manipulate time mechanics to reshape history in this co-op tactical board game for 1-4 players.',
    category: 'Gaming',
    targetGoal: 60000,
    currentAmount: 41200,
    deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    imageUrl: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=1000&q=80',
    backersCount: 310,
    status: 'active',
    rewards: [
      {
        title: 'Core Game Box',
        amount: 75,
        description: 'Complete ChronoQuest Core Edition + All Unlocked Digital Stretch Goals.',
        estimatedDelivery: 'December 2026',
        backersCount: 210
      },
      {
        title: 'Deluxe Collector Edition',
        amount: 140,
        description: 'Core Game Box + Pre-painted Resin Miniatures + Metal Coins + Collector Art Book.',
        estimatedDelivery: 'December 2026',
        backersCount: 100
      }
    ],
    updates: []
  },
  {
    title: 'SolarFlow - Portable Solar Water Purifier',
    tagline: 'Clean drinking water for off-grid adventures and emergency relief zones anywhere on Earth.',
    description: 'SolarFlow utilizes UV-C technology and multi-stage carbon filtration powered entirely by an integrated solar panel. Purifies up to 50 gallons of water per day without external power grids.',
    category: 'Community',
    targetGoal: 35000,
    currentAmount: 12800,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
    backersCount: 92,
    status: 'active',
    rewards: [
      {
        title: 'Backpacker Kit',
        amount: 65,
        description: '1x SolarFlow Handheld Unit + Carabiner Strap + 2 Extra Filter Cartridges.',
        estimatedDelivery: 'January 2027',
        backersCount: 92
      }
    ],
    updates: []
  }
];

const seedData = async () => {
  try {
    const connStr = process.env.MONGODB_URI;
    if (!connStr || connStr.includes('<db_password>')) {
      console.log('Skipping database auto-seed: MONGODB_URI missing valid credentials.');
      return;
    }
    await mongoose.connect(connStr);
    console.log('Connected to MongoDB for seeding...');

    // Create demo admin/creator user
    let creator = await User.findOne({ email: 'creator@crowdfund.com' });
    if (!creator) {
      creator = await User.create({
        name: 'Sarah Jenkins (Apex Labs)',
        email: 'creator@crowdfund.com',
        password: 'password123',
        role: 'creator',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
      });
      console.log('Created demo creator user: creator@crowdfund.com / password123');
    }

    // Check existing campaigns count
    const existingCount = await Campaign.countDocuments();
    if (existingCount === 0) {
      const preparedCampaigns = sampleCampaigns.map(c => ({
        ...c,
        creator: creator._id
      }));
      await Campaign.insertMany(preparedCampaigns);
      console.log(`✅ Seeded ${preparedCampaigns.length} sample crowdfunding campaigns!`);
    } else {
      console.log(`Database already has ${existingCount} campaigns.`);
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('Seed Error:', error.message);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
