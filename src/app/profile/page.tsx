import ProfileDetails from "@/components/profile/ProfileDetails";

export default function Page() {
    return (
        <div className={"h-screen flex flex-col justify-center items-center font-main"}>
            <div className={"p-8 bg-light-background border-2 border-card-border rounded-2xl flex flex-col space-y-4"}>
                <h1 className={"text-center text-3xl"}>Profile</h1>
                <ProfileDetails/>
            </div>
        </div>
    );
}