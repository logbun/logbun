'use client';

import SearchIcon from '@logbun/app/assets/illustrations/search.svg';
import { Button, buttonVariants } from '@logbun/ui';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const issues = [];

export default function List() {
  const pathname = usePathname();

  return (
    <>
      {!issues.length && (
        <div className="flex flex-col items-center justify-center space-y-1">
          <Image src={SearchIcon} alt="files" className="w-32 h-32" />
          <h6 className="flex items-center py-3 space-x-2">
            <span className="relative flex w-3 h-3">
              <span className="absolute inline-flex w-full h-full bg-yellow-400 rounded-full opacity-75 animate-ping"></span>
              <span className="relative inline-flex w-3 h-3 scale-75 bg-yellow-500 rounded-full"></span>
            </span>
            <span>Waiting for your first issue event</span>
          </h6>
          <Link href={`${pathname}/settings/tracking`} className={buttonVariants()}>
            Installation instructions {'->'}
          </Link>
          <Button variant="default" size="small">
            Create sample event
          </Button>
        </div>
      )}
    </>
  );
}
