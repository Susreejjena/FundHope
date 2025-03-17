const asyncHandler = require('express-async-handler');
const Campaign = require('../models/campaignModel');
const User = require('../models/userModel');

// @desc    Create a new campaign
// @route   POST /api/campaigns
// @access  Private
const createCampaign = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    shortDescription,
    category,
    goal,
    endDate,
  } = req.body;

  // Check if image is uploaded
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload an image for your campaign');
  }

  // Create campaign
  const campaign = await Campaign.create({
    title,
    description,
    shortDescription,
    image: req.file.path,
    category,
    goal,
    endDate,
    creator: req.user._id,
  });

  if (campaign) {
    // Add campaign to user's campaigns
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { campaigns: campaign._id } }
    );

    res.status(201).json(campaign);
  } else {
    res.status(400);
    throw new Error('Invalid campaign data');
  }
});

// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Public
const getCampaigns = asyncHandler(async (req, res) => {
  const pageSize = 9;
  const page = Number(req.query.page) || 1;
  const category = req.query.category || '';
  const keyword = req.query.keyword || '';

  const categoryFilter = category ? { category } : {};
  const keywordFilter = keyword
    ? {
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
        ],
      }
    : {};

  const count = await Campaign.countDocuments({
    ...categoryFilter,
    ...keywordFilter,
    status: 'active',
  });

  const campaigns = await Campaign.find({
    ...categoryFilter,
    ...keywordFilter,
    status: 'active',
  })
    .populate('creator', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    campaigns,
    page,
    pages: Math.ceil(count / pageSize),
    totalCampaigns: count,
  });
});

// @desc    Get campaign by ID
// @route   GET /api/campaigns/:id
// @access  Public
const getCampaignById = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id)
    .populate('creator', 'name avatar bio')
    .populate({
      path: 'donations',
      populate: {
        path: 'user',
        select: 'name avatar',
      },
    });

  if (campaign) {
    res.json(campaign);
  } else {
    res.status(404);
    throw new Error('Campaign not found');
  }
});

// @desc    Update campaign
// @route   PUT /api/campaigns/:id
// @access  Private/Creator
const updateCampaign = asyncHandler(async (req, res) => {
  console.log('Update campaign request received:', req.params.id);
  console.log('Request body:', req.body);
  console.log('File uploaded:', req.file);

  const {
    title,
    description,
    shortDescription,
    category,
    goal,
    endDate,
  } = req.body;

  const campaign = await Campaign.findById(req.params.id);

  if (campaign) {
    // Only update fields that are actually provided in the request
    if (title !== undefined) campaign.title = title;
    if (description !== undefined) campaign.description = description;
    if (shortDescription !== undefined) campaign.shortDescription = shortDescription;
    if (category !== undefined) campaign.category = category;
    if (goal !== undefined) campaign.goal = goal;
    if (endDate !== undefined) campaign.endDate = endDate;

    if (req.file) {
      campaign.image = req.file.path;
    }

    console.log('Updated campaign object:', campaign);
    const updatedCampaign = await campaign.save();
    console.log('Campaign saved successfully');
    res.json(updatedCampaign);
  } else {
    console.log('Campaign not found with ID:', req.params.id);
    res.status(404);
    throw new Error('Campaign not found');
  }
});

// @desc    Delete campaign
// @route   DELETE /api/campaigns/:id
// @access  Private/Creator
const deleteCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);

  if (campaign) {
    await campaign.remove();
    
    // Remove campaign from user's campaigns
    await User.findByIdAndUpdate(
      campaign.creator,
      { $pull: { campaigns: campaign._id } }
    );
    
    res.json({ message: 'Campaign removed' });
  } else {
    res.status(404);
    throw new Error('Campaign not found');
  }
});

// @desc    Add campaign update
// @route   POST /api/campaigns/:id/updates
// @access  Private/Creator
const addCampaignUpdate = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  const campaign = await Campaign.findById(req.params.id);

  if (campaign) {
    const update = {
      title,
      content,
      date: Date.now(),
    };

    campaign.updates.push(update);
    await campaign.save();
    
    res.status(201).json(campaign.updates[campaign.updates.length - 1]);
  } else {
    res.status(404);
    throw new Error('Campaign not found');
  }
});

// @desc    Get campaigns created by the current user
// @route   GET /api/campaigns/user
// @access  Private
const getUserCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await Campaign.find({ creator: req.user._id })
    .sort({ createdAt: -1 });

  res.json(campaigns);
});

module.exports = {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  addCampaignUpdate,
  getUserCampaigns,
}; 