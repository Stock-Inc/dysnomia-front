"use client";
import BackButton from "@/components/profile/BackButton";
import {useMemo, useState} from "react";
import SettingsTabButton from "@/components/settings/SettingsTabButton";
import PreferencesSettings from "@/components/settings/PreferencesSettings";
import ProfileSettings from "@/components/settings/ProfileSettings";
import {QueryClient} from "@tanstack/query-core";
import {QueryClientProvider} from "@tanstack/react-query";

export type SettingsTabs = "profile" | "preferences" | "privacy";

export default function Page() {
    const queryClient = new QueryClient();
    const [currentTab, setCurrentTab] = useState<SettingsTabs>("profile");
    const tabToRender = useMemo(() => {
        switch (currentTab) {
            case "profile": return <ProfileSettings/>;
            case "preferences": return <PreferencesSettings/>;
            case "privacy": return <div>privacy tab</div>;
        }
    }, [currentTab]);

    return (
        <div className={"flex justify-center"}>
            <BackButton/>
            <div className={"h-screen flex flex-col justify-center w-full font-main max-sm:max-w-40"}>
                <div className={"border-2 border-card-border bg-light-background max-sm:p-2 sm:p-4 place-self-center rounded-2xl flex flex-col space-y-2"}>
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
                    <QueryClientProvider client={queryClient}>
                        {
                            tabToRender
                        }
                    </QueryClientProvider>
                </div>
            </div>
        </div>
    );
}