import { cn } from '@/lib/utils';

/**
 * SkeletonLoader component
 * Premium shimmer loading placeholder
 */
const SkeletonLoader: React.FC<{
    className?: string;
    lines?: number;
    avatar?: boolean;
}> = ({ className = '', lines = 3, avatar = false }) => {
    return (
        <div className={cn('animate-pulse space-y-3', className)}>
            {avatar && (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full shimmer" />
                    <div className="flex-1 space-y-2">
                        <div className="h-3 shimmer rounded-full w-1/3" />
                        <div className="h-2.5 shimmer rounded-full w-1/4" />
                    </div>
                </div>
            )}
            {Array.from({ length: lines }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <div
                        className="h-3 shimmer rounded-full"
                        style={{ width: `${75 - i * 15}%` }}
                    />
                </div>
            ))}
        </div>
    );
};

/**
 * ChatSkeletonLoader
 * Full-page skeleton for the chat loading state
 */
export const ChatSkeletonLoader: React.FC = () => {
    return (
        <div className="flex flex-col h-screen">
            {/* Header skeleton */}
            <div className="h-16 glass-heavy border-b border-border/30 flex items-center px-4 gap-3">
                <div className="w-8 h-8 rounded-xl shimmer" />
                <div className="flex-1 space-y-2">
                    <div className="h-3.5 shimmer rounded-full w-32" />
                    <div className="h-2.5 shimmer rounded-full w-20" />
                </div>
                <div className="w-8 h-8 rounded-xl shimmer" />
            </div>

            {/* Messages skeleton */}
            <div className="flex-1 p-4 space-y-6">
                {/* Bot message */}
                <div className="flex gap-3 max-w-[70%]">
                    <div className="w-8 h-8 rounded-full shimmer shrink-0" />
                    <div className="flex-1 space-y-2 p-4 rounded-2xl bg-muted/30">
                        <div className="h-3 shimmer rounded-full w-full" />
                        <div className="h-3 shimmer rounded-full w-4/5" />
                        <div className="h-3 shimmer rounded-full w-3/5" />
                    </div>
                </div>

                {/* User message */}
                <div className="flex justify-end">
                    <div className="max-w-[60%] space-y-2 p-4 rounded-2xl bg-primary/10">
                        <div className="h-3 shimmer rounded-full w-full" />
                        <div className="h-3 shimmer rounded-full w-2/3" />
                    </div>
                </div>

                {/* Bot message */}
                <div className="flex gap-3 max-w-[70%]">
                    <div className="w-8 h-8 rounded-full shimmer shrink-0" />
                    <div className="flex-1 space-y-2 p-4 rounded-2xl bg-muted/30">
                        <div className="h-3 shimmer rounded-full w-full" />
                        <div className="h-3 shimmer rounded-full w-5/6" />
                    </div>
                </div>
            </div>

            {/* Input skeleton */}
            <div className="p-4 border-t border-border/30">
                <div className="flex gap-2 items-center">
                    <div className="w-10 h-10 rounded-xl shimmer" />
                    <div className="flex-1 h-12 shimmer rounded-2xl" />
                    <div className="w-12 h-12 rounded-2xl shimmer" />
                </div>
            </div>
        </div>
    );
};

export default SkeletonLoader;
