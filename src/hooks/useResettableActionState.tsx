import { startTransition, useActionState } from 'react';

export default function useResettableActionState<State, Payload>(
    action: (state: Awaited<State>, payload: Payload) => State | Promise<State>,
    initialState: Awaited<State>,
    permalink?: string,
): [state: Awaited<State>, dispatch: (payload: Payload | null) => void, isPending: boolean, reset: () => void] {
    const [state, submit, isPending] = useActionState(
        async (state: Awaited<State>, payload: Payload | null) => {
            if (!payload) {
                return initialState;
            }
            const data = await action(state, payload);
            return data;
        },
        initialState,
        permalink,
    );

    const reset = () => {
        startTransition(() => {
            submit(null);
        });
    };

    return [state, submit, isPending, reset];
}
