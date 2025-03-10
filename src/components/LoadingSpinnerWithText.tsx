interface LoadingSpinnerWithTextProps {
    loadingText: string;
    leftAligned?: boolean;
}

export const LoadingSpinnerWithText = ({ loadingText, leftAligned }: LoadingSpinnerWithTextProps) => {
    return (
        <div className={`flex flex-row items-center ${!leftAligned ? 'justify-center' : ''} gap-2`}>
            <span className="loading loading-spinner loading-xl" />
            <span>{loadingText}</span>
        </div>
    );
};
