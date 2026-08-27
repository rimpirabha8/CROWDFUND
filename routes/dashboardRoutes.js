const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const Contribution = require('../models/Contribution');
const { protect } = require('../middleware/auth');

// @route   GET /api/dashboard/stats
// @desc    Get user dashboard stats (backed campaigns, created campaigns, total pledged)
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user contributions
    const contributions = await Contribution.find({ user: userId })
      .populate({
        path: 'campaign',
        populate: { path: 'creator', select: 'name avatar' }
      })
      .sort({ createdAt: -1 });

    // Fetch user created campaigns
    const createdCampaigns = await Campaign.find({ creator: userId })
      .sort({ createdAt: -1 });

    // Calculate aggregated stats
    const totalPledged = contributions.reduce((acc, item) => acc + item.amount, 0);
    const backedCount = contributions.length;
    const createdCount = createdCampaigns.length;

    const totalFundsRaised = createdCampaigns.reduce((acc, camp) => acc + camp.currentAmount, 0);

    res.json({
      summary: {
        totalPledged,
        backedCount,
        createdCount,
        totalFundsRaised
      },
      contributions,
      createdCampaigns
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
