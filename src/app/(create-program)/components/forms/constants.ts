import { FilterImageVerifiedIcon, FilterTriangleBadgeIcon, FilterDiamondBadgeIcon, FilterGearsBadgeIcon, FilterBarsBadgeIcon, FilterDashedBadgeIcon, FilterVerifiedPlusIcon } from "@/shared/ui/icons";

export const boosterItems1 = [
  { id: 'newAuthor', title: 'New author', subtitle: 'Fresh accounts, 300d max', Icon: FilterVerifiedPlusIcon },
  { id: 'consistency', title: 'Consistency', subtitle: 'Authors who post about your campaign at least once a week', Icon: FilterDashedBadgeIcon },
  { id: 'frequency', title: 'Frequency', subtitle: 'Authors who post every day', Icon: FilterGearsBadgeIcon },
];

export const boosterItems2 = [
  { id: 'sentiment', title: 'Sentiment', subtitle: 'Here is an explanation about the filter', Icon: FilterDiamondBadgeIcon },
  { id: 'soloMention', title: 'Solo mention', subtitle: 'Exclude regular posts with other campaigns', Icon: FilterBarsBadgeIcon },
  { id: 'onlyMedia', title: 'Only with media', subtitle: 'Exclude regular posts', Icon: FilterImageVerifiedIcon },
  { id: 'verified', title: 'Verified', subtitle: 'Verified X accounts only', Icon: FilterTriangleBadgeIcon },
];

export const filterIcons = [
  { id: "newAuthor", Icon: FilterVerifiedPlusIcon },
  { id: "consistency", Icon: FilterDashedBadgeIcon },
  { id: "frequency", Icon: FilterGearsBadgeIcon },
  { id: "sentiment", Icon: FilterDiamondBadgeIcon },
  { id: "soloMention", Icon: FilterBarsBadgeIcon },
  { id: "onlyMedia", Icon: FilterImageVerifiedIcon },
  { id: "verified", Icon: FilterTriangleBadgeIcon },
];
