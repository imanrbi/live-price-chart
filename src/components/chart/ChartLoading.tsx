type ChartLoadingProps = {
  isLoading: boolean;
};

export const ChartLoading = ({ isLoading = false }: ChartLoadingProps) => {
  if (isLoading) {
    return (
      <div className="w-full h-full left-0 top-0 absolute flex items-center justify-center bg-black-800/5 backdrop-blur">
        <svg viewBox="0 0 18 18" className="animate-spin w-16 h-16">
          <circle
            cx="9"
            cy="9"
            r="8"
            className="stroke-blue-600 stroke-1 fill-none"
            strokeDasharray="9 18"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  return null;
};
