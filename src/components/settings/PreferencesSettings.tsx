import {persistentStore, Theme} from "@/lib/app-store";
import {useState} from "react";

export default function PreferencesSettings() {
    const store = persistentStore();
    const [chosenTheme, setChosenTheme] = useState<Theme>(store.theme);
    return (
        //TODO: next-themes
        <div>
            <form className={"text-xl flex flex-col p-4"}>
                <div className={"flex space-x-3"}>
                    <label htmlFor={"theme"}>Theme</label>
                    <select onChange={(e) => {
                        setChosenTheme(e.currentTarget.value as Theme);
                    }} value={chosenTheme} id={"theme"} className={"focus:outline-none bg-card-border rounded-xl p-1"}>
                        <option value={"dark"}>Dark</option>
                        <option value={"light"}>Light</option>
                    </select>
                </div>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        store.setTheme(chosenTheme);
                    }}
                    className={`hover:bg-card-border hover:text-accent border-2 border-card-border 
                    rounded-2xl mt-5 p-2 transition-all cursor-pointer focus:outline-none`}
                    type={"submit"}
                >
                    Apply
                </button>
            </form>
        </div>
    );
}