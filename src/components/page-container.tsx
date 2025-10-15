'use client';

import { useSidebar } from '@/components/ui/sidebar';

export function PageContainer({ children }: { children: React.ReactNode }) {
  const { open, setOpen, isMobile, setOpenMobile } = useSidebar();

  const handlePageClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    } else if (open) {
      setOpen(false);
    }
  };

  return (
    <div className="flex flex-col flex-1" onClick={handlePageClick}>
      {children}
    </div>
  );
}
