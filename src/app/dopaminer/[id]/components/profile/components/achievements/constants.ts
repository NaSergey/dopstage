import type React from "react";
import OgIcon from "./icons/og-icon";
import DopIcon from "./icons/dop-icon";
import FirstTweetIcon from "./icons/first-tweet-icon";
import XConnectIcon from "./icons/x-connect-icon";
import RejectIcon from "./icons/reject-icon";
import DaysIcon from "./icons/days-icon";
import TotalDopsIcon from "./icons/total-dops-icon";
import ClaimedIcon from "./icons/claimed-icon";
import EarnedIcon from "./icons/earned-icon";
import ProgramsIcon from "./icons/programs-icon";
import TweetsIcon from "./icons/tweets-icon";
import TopProgramIcon from "./icons/top-program-icon";
import MysteryIcon from "./icons/mystery-icon";

export type AchievementIconComponent = React.ComponentType<{
    type: string;
    className?: string;
}>;

export interface Achievement {
    enabled: boolean;
    description: string;
    timestamp: number;
    current_rank: number;
    rank_label: string;
}

export interface AchievementConfig {
    key: string;
    /** Value of the `name` field returned by the API (lowercased) */
    name: string;
    Icon: AchievementIconComponent;
    title: string;
    description: string;
    getType: (achievement: Achievement | undefined) => string;
}

export const ACHIEVEMENTS_CONFIG: AchievementConfig[] = [
    {
        key: "og",
        name:"og",
        Icon: OgIcon as AchievementIconComponent,
        title: "OG Yapper",
        description: "First 1000 yappers registered with dope score.",
        getType: (a) => (a?.enabled ? "enabled" : "disabled"),
    },
    {
        key: "dop",
        name:"dop enthusiast", // TODO: confirm API name when backend adds this achievement
        Icon: DopIcon as AchievementIconComponent,
        title: "Dop Enthusiast",
        description: "Active participant in App activities.",
        getType: (a) => {
            if (!a?.enabled) return "disabled";
            const levels = ["1", "10", "50", "100"] as const;
            return levels[a.current_rank - 1] ?? "disabled";
        },
    },
    {
        key: "first_tweet",
        name:"first tweet",
        Icon: FirstTweetIcon as AchievementIconComponent,
        title: "First Tweet",
        description: "Published the first tweet.",
        getType: (a) => (a?.enabled ? "enabled" : "disabled"),
    },
    {
        key: "x_connect",
        name:"connect twitter",
        Icon: XConnectIcon as AchievementIconComponent,
        title: "X Connected",
        description: "Successfully linked your Twitter account.",
        getType: (a) => (a?.enabled ? "enabled" : "disabled"),
    },
    {
        key: "reject",
        name:"resilient", // TODO: confirm API name when backend adds this achievement
        Icon: RejectIcon as AchievementIconComponent,
        title: "Resilient",
        description: "Kept going after a rejection.",
        getType: (a) => (a?.enabled ? "enabled" : "disabled"),
    },
    {
        key: "days",
        name:"consistency streak",
        Icon: DaysIcon as AchievementIconComponent,
        title: "Daily Yapper",
        description: "Maintained a consistent daily presence.",
        getType: (a) => {
            if (!a?.enabled) return "disabled";
            const levels = ["10", "30", "50", "100"] as const;
            return levels[a.current_rank - 1] ?? "disabled";
        },
    },
    {
        key: "total_dops",
        name:"dop collector",
        Icon: TotalDopsIcon as AchievementIconComponent,
        title: "Dop Collector",
        description: "Accumulated a significant amount of Dops.",
        getType: (a) => {
            if (!a?.enabled) return "disabled";
            const levels = ["1m", "5m", "10m", "100m"] as const;
            return levels[a.current_rank - 1] ?? "disabled";
        },
    },
    {
        key: "earned",
        name:"top earner", // TODO: confirm API name when backend adds this achievement
        Icon: EarnedIcon as AchievementIconComponent,
        title: "Top Earner",
        description: "Among the highest earners on the platform.",
        getType: (a) => {
            if (!a?.enabled) return "disabled";
            const levels = ["10", "100", "1k", "10k"] as const;
            return levels[a.current_rank - 1] ?? "disabled";
        },
    },
    {
        key: "claimed",
        name:"claim champion", // TODO: confirm API name when backend adds this achievement
        Icon: ClaimedIcon as AchievementIconComponent,
        title: "Claim Champion",
        description: "Regularly claimed your rewards.",
        getType: (a) => {
            if (!a?.enabled) return "disabled";
            const levels = ["10", "100", "1k", "10k"] as const;
            return levels[a.current_rank - 1] ?? "disabled";
        },
    },
    {
        key: "programs",
        name:"program participant",
        Icon: ProgramsIcon as AchievementIconComponent,
        title: "Program Explorer",
        description: "Participated in multiple App programs.",
        getType: (a) => {
            if (!a?.enabled) return "disabled";
            const levels = ["3", "10", "30", "50"] as const;
            return levels[a.current_rank - 1] ?? "disabled";
        },
    },
    {
        key: "tweets",
        name:"tweet volume",
        Icon: TweetsIcon as AchievementIconComponent,
        title: "Active Yapper",
        description: "Sent tweets through App.",
        getType: (a) => {
            if (!a?.enabled) return "disabled";
            const levels = ["1", "10", "50", "100"] as const;
            return levels[a.current_rank - 1] ?? "disabled";
        },
    },
    {
        key: "top_percent",
        name:"program leaderboard",
        Icon: TopProgramIcon as AchievementIconComponent,
        title: "Elite Participant",
        description: "Reached a top tier in an App program.",
        getType: (a) => {
            if (!a?.enabled) return "disabled";
            const levels = ["80", "50", "10", "1"] as const;
            return levels[a.current_rank - 1] ?? "disabled";
        },
    },
    {
        key: "mystery",
        name:"mystery", // TODO: confirm API name when backend adds this achievement
        Icon: MysteryIcon as AchievementIconComponent,
        title: "Mystery Unlocked",
        description: "Discovered a hidden secret within the app.",
        getType: (a) => (a?.enabled ? "enabled" : "disabled"),
    },
];
