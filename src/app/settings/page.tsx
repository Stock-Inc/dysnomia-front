"use client";
import BackButton from "@/components/profile/BackButton";
import {useMemo, useState} from "react";
import SettingsTabButton from "@/components/settings/SettingsTabButton";

export type SettingsTabs = "profile" | "preferences" | "privacy";

export default function Page() {
    const [currentTab, setCurrentTab] = useState<SettingsTabs>("profile");
    const tabToRender = useMemo(() => {
        switch (currentTab) {
            case "profile": return <div>profile tab</div>;
            case "preferences": return <div>preferences tab</div>;
            case "privacy": return <div>privacy tab</div>;
        }
    }, [currentTab]);

    return (
        <>
            <BackButton/>
            <div className={"h-screen flex flex-col justify-center w-full font-main"}>
                <div className={"border-2 border-card-border bg-light-background p-4 place-self-center rounded-2xl flex flex-col space-y-2"}>
                    <h1 className={"text-3xl text-center"}>Settings</h1>
                    <div className={"flex justify-evenly space-x-5 text-xl"}>
                        <SettingsTabButton
                            associatedTab={"profile"}
                            currentTab={currentTab}
                            setCurrentTabAction={setCurrentTab}
                        >
                            Profile
                        </SettingsTabButton>
                        <SettingsTabButton
                            associatedTab={"preferences"}
                            currentTab={currentTab}
                            setCurrentTabAction={setCurrentTab}
                        >
                            Preferences
                        </SettingsTabButton>
                        <SettingsTabButton
                            associatedTab={"privacy"}
                            currentTab={currentTab}
                            setCurrentTabAction={setCurrentTab}
                        >
                            Privacy
                        </SettingsTabButton>
                    </div>
                    {
                        tabToRender
                    }
                </div>
            </div>
        </>
    );
}