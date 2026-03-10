import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-neutral-900 bg-neutral-950 px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", "focus-visible:bg-neutral-900 focus-visible:ring-[0px] focus-visible:bg-neutral-900",
        "aria-invalid:border-red-400 aria-invalid:border-red-400 dark:aria-invalid:border-red-400",
        "text-white",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
