const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const Contribution = require('../models/Contribution');
const { protect } = require('../middleware/auth');

// @route   GET /api/campaigns
// @desc    Fetch all campaigns with search, category, and sort filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, status } = req.query;

    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'popular') {
      sortOptions = { backersCount: -1 };
    } else if (sort === 'funded') {
      sortOptions = { currentAmount: -1 };
    } else if (sort === 'endingSoon') {
      sortOptions = { deadline: 1 };
    }

    const campaigns = await Campaign.find(query)
      .populate('creator', 'name email avatar')
      .sort(sortOptions);

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/campaigns/:id
// @desc    Fetch single campaign by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('creator', 'name email avatar bio');

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Fetch recent contributions for backer list
    const recentContributions = await Contribution.find({ campaign: campaign._id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ campaign, recentContributions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/campaigns
// @desc    Create a new campaign (Wizard submission)
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, tagline, description, category, targetGoal, deadline, imageUrl, rewards } = req.body;

    if (!title || !tagline || !description || !targetGoal || !deadline) {
      return res.status(400).json({ message: 'Please provide all required campaign details' });
    }

    const campaign = new Campaign({
      title,
      tagline,
      description,
      category: category || 'Technology',
      targetGoal: Number(targetGoal),
      deadline,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1000&q=80',
      creator: req.user._id,
      rewards: rewards || []
    });

    const createdCampaign = await campaign.save();
    const populated = await Campaign.findById(createdCampaign._id).populate('creator', 'name email avatar');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/campaigns/:id/contribute
// @desc    Pledge / Support a campaign
// @access  Private
router.post('/:id/contribute', protect, async (req, res) => {
  try {
    const { amount, rewardTitle } = req.body;
    const pledgeAmount = Number(amount);

    if (!pledgeAmount || pledgeAmount <= 0) {
      return res.status(400).json({ message: 'Please enter a valid contribution amount' });
    }

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Create contribution record
    const contribution = await Contribution.create({
      campaign: campaign._id,
      user: req.user._id,
      amount: pledgeAmount,
      rewardTitle: rewardTitle || 'Custom Pledge',
      paymentStatus: 'completed'
    });

    // Update campaign metrics
    campaign.currentAmount += pledgeAmount;
    campaign.backersCount += 1;

    // Check if goal reached
    if (campaign.currentAmount >= campaign.targetGoal && campaign.status === 'active') {
      campaign.status = 'successful';
    }

    // Increment backer count for reward tier if matched
    if (rewardTitle && campaign.rewards && campaign.rewards.length > 0) {
      const rewardTier = campaign.rewards.find(r => r.title === rewardTitle);
      if (rewardTier) {
        rewardTier.backersCount = (rewardTier.backersCount || 0) + 1;
      }
    }

    await campaign.save();

    res.status(201).json({
      message: 'Contribution successful! Thank you for backing this project.',
      contribution,
      updatedCampaign: campaign
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/campaigns/:id/updates
// @desc    Post a project update for a campaign
// @access  Private (Creator only)
router.post('/:id/updates', protect, async (req, res) => {
  try {
    const { title, content } = req.body;
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (campaign.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the campaign creator can post updates' });
    }

    campaign.updates.unshift({ title, content });
    await campaign.save();

    res.status(201).json(campaign.updates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/campaigns/:id
// @desc    Delete a campaign
// @access  Private (Creator only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (campaign.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this campaign' });
    }

    await Campaign.findByIdAndDelete(req.params.id);
    res.json({ message: 'Campaign removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
