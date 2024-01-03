'use client';

import {
  Cog6ToothIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/solid';
import { cn } from '@logbun/utils';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

// const options = [
//   { name: 'Documentation', href: '/docs', icon: FileText },
//   { name: 'Give Feedback', href: '/feedback', icon: AlertCircle },
// ];

interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  selected: boolean;
  icon: LucideIcon;
  href: string;
}

function NavLink(props: NavLinkProps) {
  const { children, className, selected, ...rest } = props;

  return (
    <Link
      className={cn(
        'group flex gap-x-2 rounded-md p-2 text-sm font-medium',
        selected
          ? 'bg-gray-300 bg-opacity-50 text-gray-800'
          : 'text-gray-600 hover:text-gray-700 hover:bg-gray-300 hover:bg-opacity-50',
        className
      )}
      {...rest}
    >
      <props.icon
        className={cn('h-5 w-5 shrink-0', selected ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500')}
      />
      {children}
    </Link>
  );
}

export default function Sidebar() {
  const params = useParams();

  const pathname = usePathname();

  const navigation = [
    { name: 'Issues', href: `/${params.id}`, icon: ExclamationTriangleIcon },
    { name: 'Settings', href: `/${params.id}/settings`, icon: Cog6ToothIcon },
    { name: 'Documentation', href: '/docs', icon: DocumentTextIcon },
    { name: 'Give Feedback', href: '/feedback', icon: QuestionMarkCircleIcon },
  ];

  return (
    <nav role="list" className="flex flex-col flex-1 pt-10">
      <ul role="list" className="space-y-3">
        {navigation.map((item) => (
          <li key={item.name}>
            <NavLink icon={item.icon} href={item.href} selected={item.href === pathname}>
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
