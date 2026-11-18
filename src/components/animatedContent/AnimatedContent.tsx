
import {
  useLayoutEffect,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { gsap } from "gsap";

type WipeDirection = "none" | "up" | "down" | "left" | "right" | "center";

interface AnimatedContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  distance?: number;
  direction?: "vertical" | "horizontal";
  duration?: number;
  ease?: string;
  initialOpacity?: number;
  blur?: number;
  scale?: number;
  wipe?: WipeDirection;
  delay?: number;
  stagger?: number;
  className?: string;
}

const wipes: Record<Exclude<WipeDirection, "none">, string> = {
  up: "linear-gradient(to top, #000 calc(var(--ac-wipe) * 140% - 40%), transparent calc(var(--ac-wipe) * 140%))",
  down: "linear-gradient(to bottom, #000 calc(var(--ac-wipe) * 140% - 40%), transparent calc(var(--ac-wipe) * 140%))",
  left: "linear-gradient(to left, #000 calc(var(--ac-wipe) * 140% - 40%), transparent calc(var(--ac-wipe) * 140%))",
  right: "linear-gradient(to right, #000 calc(var(--ac-wipe) * 140% - 40%), transparent calc(var(--ac-wipe) * 140%))",
  center:
    "radial-gradient(farthest-corner at 50% 50%, #000 calc(var(--ac-wipe) * 140% - 40%), transparent calc(var(--ac-wipe) * 140%))",
};

export default function AnimatedContent({
  children,
  distance = 100,
  direction = "vertical",
  duration = 1.5,
  ease = "power2.out",
  initialOpacity = 0,
  blur = 0,
  scale = 1,
  wipe = "up",
  delay = 0,
  stagger = 0.08,
  className = "",
  style,
  ...props
}: AnimatedContentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      gsap.set(element, { visibility: "visible" });
      return;
    }

    const targets =
      stagger > 0 && element.children.length
        ? Array.from(element.children)
        : [element];

    const axis = direction === "horizontal" ? "x" : "y";
    const mask = wipe === "none" ? undefined : wipes[wipe];

    const context = gsap.context(() => {
      gsap.set(element, { visibility: "visible" });

      if (mask) {
        gsap.set(targets, {
          maskImage: mask,
          webkitMaskImage: mask,
          "--ac-wipe": 0,
        });
      }

      const from: gsap.TweenVars = {
        [axis]: distance,
        opacity: initialOpacity,
        scale,
      };

      const to: gsap.TweenVars = {
        [axis]: 0,
        opacity: 1,
        scale: 1,
        duration,
        ease,
        delay,
        stagger: stagger > 0 ? stagger : 0,
        clearProps: "transform,filter",
      };

      if (blur > 0) {
        from.filter = `blur(${blur}px)`;
        to.filter = "blur(0px)";
      }

      if (mask) {
        from["--ac-wipe"] = 0;
        to["--ac-wipe"] = 1;
      }

      gsap.fromTo(targets, from, to);
    }, element);

    return () => context.revert();
  }, [
    distance,
    direction,
    duration,
    ease,
    initialOpacity,
    blur,
    scale,
    wipe,
    delay,
    stagger,
  ]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ visibility: "hidden", ...style }}
      {...props}
    >
      {children}
    </div>
  );
}