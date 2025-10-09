export default function LoadingCircles() {
    return (
        <div data-testid="loading-circles" className={"flex flex-col sticky w-full justify-center"}>
            <div className={"self-center animate-loading-circle p-10 border-4 border-loading-circle rounded-full absolute"}/>
            <div className={"self-center opacity-0 animate-[loadingCircle_1s_ease-in-out_0.5s_infinite]" +
                " p-10 border-4 border-loading-circle rounded-full"}/>
        </div>
    );
}