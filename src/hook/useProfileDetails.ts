import {useEffect, useState} from "react";

interface FetchResult<T> {
    data: T | null;
    isLoading: boolean;
    error: string | null;
}

//TODO: merge with useReplyMessage
export default function useProfileDetails<T>(username: string): FetchResult<T> {
    const [profile, setProfile] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`https://api.femboymatrix.su/user/${username}`)
            .then(async (res) => {
                try {
                    const data = await res.json();
                    if (res.ok) setProfile(data);
                    else setError(data.error);
                } catch (e) {
                    setError((e as Error).message);
                }
            })
            .catch((e) => setError((e as Error).message))
            .finally(() => setLoading(false));
    }, [username]);
    return {
        data: profile,
        isLoading: loading,
        error
    };
}