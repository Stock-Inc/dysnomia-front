import GoBack from "@/components/GoBack";

export default function NotFound() {
    return (
        <div className="font-main flex flex-col items-center justify-center h-screen space-y-2">
            <h1 className={"text-2xl"}>Nothing Found</h1>
            <GoBack/>
        </div>
    );
}