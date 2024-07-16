import * as mongoose from 'mongoose';

export const SubcategoryAnalyticsSchema = new mongoose.Schema(
	{
		user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true},
		subcategory: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Subcategory',
			index: true,
		},
	},
	{timestamps: {createdAt: true, updatedAt: false}},
);
