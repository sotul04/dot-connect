import * as React from "react"
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const nodeVariants = cva(
    "relative z-10",
    {
        variants: {
            variant: {
                default: "bg-gray-300 rounded-full cursor-pointer",
                blocked: "bg-black rounded-sm",
                picked: "bg-emerald-600 rounded-full cursor-pointer",
            },
            level: {
                beginner: "w-[80px] h-[80px] m-[20px]",
                easy: "w-[60px] h-[60px] m-[15px]",
                medium: "w-[60px] h-[60px] m-[15px]",
                hard: "w-[50px] h-[50px] m-[12.5px]",
            },
            arrow: {
                default: "",
                left: "after:absolute after:rounded-full after:h-[25%] after:w-[150%] after:bg-inherit after:right-[50%] after:top-[37.5%] connect-x",
                top: "after:absolute after:rounded-full after:w-[25%] after:h-[150%] after:bg-inherit after:bottom-[50%] after:left-[37.5%] connect-y",
                right: "after:absolute after:rounded-full after:h-[25%] after:w-[150%] after:bg-inherit after:left-[50%] after:top-[37.5%] connect-x",
                bottom: "after:absolute after:rounded-full after:w-[25%] after:h-[150%] after:bg-inherit after:top-[50%] after:left-[37.5%] connect-y",
            },
            current: {
                true: "current-node",
                false: "",
            }
        },
        defaultVariants: {
            variant: "default",
            level: "beginner",
            arrow: "default",
        }
    }
)

export interface NodeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof nodeVariants> {
    asChild?: boolean
    current?: boolean
}

export interface VariantNode {
    variant: "default" | "blocked" | "picked" | undefined | null;
}

export interface LevelNode {
    level: "beginner" | "easy" | "medium" | "hard" | undefined | null;
}

export interface ArrowNode {
    arrow: "default" | "left" | "bottom" | "right" | undefined | null;
}

interface CurrentNode {
    current: boolean | undefined | null;
}

export const Node = React.forwardRef<HTMLDivElement, NodeProps>(
    ({ className, variant, level, arrow, current = false, ...props }, ref) => {
        const isCurrent: CurrentNode = current ? { current: true} : {current: false};
        return (
            <div
                className={cn(nodeVariants({ variant, arrow, level, current: isCurrent.current, className }))}
                ref={ref}
                {...props}
            ></div>
        );
    }
)

Node.displayName = "Node";
