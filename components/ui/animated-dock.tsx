'use client';

import * as React from 'react';
import { useRef } from 'react';
import {
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';

const cn = (...args: any[]) => twMerge(clsx(args));

export interface DockItemData {
  link: string;
  Icon: React.ReactNode;
  target?: string;
  label?: string;
}

export interface AnimatedDockProps {
  className?: string;
  items: DockItemData[];
}

export const AnimatedDock = ({ className, items }: AnimatedDockProps) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        'mx-auto flex h-20 items-end gap-4 rounded-3xl glass shadow-pink px-6 pb-3',
        className
      )}
    >
      {items.map((item, index) => (
        <DockItem key={index} mouseX={mouseX} label={item.label}>
          <Link
            href={item.link}
            target={item.target}
            aria-label={item.label}
            className="grow flex items-center justify-center w-full h-full text-white"
          >
            {item.Icon}
          </Link>
        </DockItem>
      ))}
    </motion.div>
  );
};

interface DockItemProps {
  mouseX: MotionValue<number>;
  children: React.ReactNode;
  label?: string;
}

const DockItem = ({ mouseX, children, label }: DockItemProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [44, 86, 44]);
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const iconScale = useTransform(width, [44, 86], [1, 1.55]);
  const iconSpring = useSpring(iconScale, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className="group relative aspect-square w-11 rounded-full bg-gradient-to-br from-pink-vivid to-pink-deeper shadow-pink-soft flex items-center justify-center"
    >
      <motion.div
        style={{ scale: iconSpring }}
        className="flex items-center justify-center w-full h-full"
      >
        {children}
      </motion.div>
      {label && (
        <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-text-dark text-white text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {label}
        </span>
      )}
    </motion.div>
  );
};
