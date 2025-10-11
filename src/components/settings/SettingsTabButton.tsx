import {SettingsTabs} from "@/app/settings/page";
import {ReactNode} from "react";
import classBuilder from "@/lib/classBuilder";

export default function SettingsTabButton(
    {
        children,
        associatedTab,
        currentTab,
        setCurrentTabAction,
    }: {
        children: ReactNode;
        associatedTab: SettingsTabs,
        currentTab: SettingsTabs,
        setCurrentTabAction: (tab: SettingsTabs) => void;
    }
) {
    return (
        <button
            className={
                classBuilder(
                    "text-center focus:outline-none transition-all p-2 rounded-2xl",
                    [currentTab === associatedTab, "bg-card-border text-accent"],
                    [currentTab !== associatedTab, "hover:bg-card-border"],
                )
            }
            onClick={() => setCurrentTabAction(associatedTab)}
        >
            {children}
        </button>
    );
}