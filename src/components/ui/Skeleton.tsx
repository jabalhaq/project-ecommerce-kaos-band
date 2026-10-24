
import { cn } from '@/lib/utils';

export const Skeleton = ({ className }: { className?: string }) => {
  return <div className={cn('animate-pulse bg-zinc-800 rounded', className)} />;
};
