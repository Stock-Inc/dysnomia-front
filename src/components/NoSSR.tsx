import dynamic from 'next/dynamic';
import { ReactNode } from 'react';
import LoadingCircles from "@/components/LoadingCircles";

const NoSSR = ({ children }: { children: ReactNode }) => <>{children}</>;

export default dynamic(() => Promise.resolve(NoSSR), {
    ssr: false,
    loading: () => <div className={"h-screen flex flex-col justify-center"}><LoadingCircles/></div>
});