interface LoadingComponentProps {
    loadingText: string;
}

export const LoadingComponent = ({ loadingText }: LoadingComponentProps) => {
    return (
        <div className="flex flex-row items-center justify-center gap-2 pt-2">
            <span className="loading loading-spinner loading-xl" />
            <span>{loadingText}</span>
        </div>
    );
};
