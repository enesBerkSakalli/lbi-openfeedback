import { useCallback, useEffect, useState } from 'react'
import type firebase from 'firebase/compat/app'

type Query = firebase.firestore.Query
type QuerySnapshot<T> = firebase.firestore.QuerySnapshot<T>
type DocumentData = firebase.firestore.DocumentData

export type UseQueryResult<T = unknown> = {
    isLoading: boolean
    load: () => void
    error: string
    isError: boolean
    data: T | null
    loaded: boolean
}

// The documents are cast to T: callers state the shape of the collection.
export const useFirestoreCollection = <T>(
    query: Query,
    requestId: string
): UseQueryResult<T[]> => {
    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [data, setData] = useState<T[]>()

    const isError = error !== ''

    const docTransformer = (querySnapshot: QuerySnapshot<DocumentData>) => {
        setData(
            querySnapshot.docs.map((doc: DocumentData) => ({
                id: doc.id,
                ...(doc.data() as T),
            }))
        )
    }

    const load = useCallback(() => {
        setData([])
        setLoading(true)

        try {
            query
                .get()
                .then((querySnapshot) => {
                    docTransformer(querySnapshot)
                })
                .catch((error) => {
                    setLoading(false)
                    setError(error.message)
                })
                .finally(() => {
                    setLoading(false)
                })
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : `${error}`)
        }
    }, [requestId])

    useEffect(() => {
        return load()
    }, [load])

    return {
        isLoading,
        load,
        error,
        isError,
        data: data || null,
        loaded: data !== undefined,
    }
}
