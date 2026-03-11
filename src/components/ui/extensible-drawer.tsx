import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { ArrowLeft01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { Button } from "@/components/ui/button";
import { useExtensibleDrawer } from "@/hooks/use-extensible-drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

// --- Context ---

type ExtensibleDrawerContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  expansionMode: string | null;
  isExpanded: boolean;
  expand: (mode: string) => void;
  collapse: () => void;
  toggleExpansion: (mode: string) => void;
  collapsedWidth: string;
  expandedWidth: string;
  isMobile: boolean;
};

const ExtensibleDrawerContext =
  React.createContext<ExtensibleDrawerContextValue | null>(null);

function useExtensibleDrawerContext(): ExtensibleDrawerContextValue {
  const context = React.useContext(ExtensibleDrawerContext);
  if (!context) {
    throw new Error(
      "useExtensibleDrawerContext must be used within an ExtensibleDrawer."
    );
  }
  return context;
}

// --- Root ---

function ExtensibleDrawer({
  children,
  defaultOpen,
  open: openProp,
  onOpenChange,
  collapsedWidth,
  expandedWidth,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  collapsedWidth?: string;
  expandedWidth?: string;
}) {
  const isMobile = useIsMobile();
  const state = useExtensibleDrawer({
    defaultOpen,
    open: openProp,
    onOpenChange,
    collapsedWidth,
    expandedWidth,
  });

  const contextValue: ExtensibleDrawerContextValue = {
    ...state,
    isMobile,
  };

  if (isMobile) {
    return (
      <ExtensibleDrawerContext.Provider value={contextValue}>
        <DrawerPrimitive.Root onOpenChange={state.setOpen} open={state.open}>
          {children}
        </DrawerPrimitive.Root>
      </ExtensibleDrawerContext.Provider>
    );
  }

  return (
    <ExtensibleDrawerContext.Provider value={contextValue}>
      <SheetPrimitive.Root
        modal={false}
        onOpenChange={state.setOpen}
        open={state.open}
      >
        {children}
      </SheetPrimitive.Root>
    </ExtensibleDrawerContext.Provider>
  );
}

// --- Content ---

function ExtensibleDrawerContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { isMobile, isExpanded, collapsedWidth, expandedWidth } =
    useExtensibleDrawerContext();

  if (isMobile) {
    return (
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay
          className="fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs"
          data-slot="extensible-drawer-overlay"
        />
        <DrawerPrimitive.Content
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-xl border-t bg-background text-sm",
            className
          )}
          data-slot="extensible-drawer-content"
        >
          <div className="mx-auto mt-4 h-1 w-[100px] shrink-0 rounded-full bg-muted" />
          {children}
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    );
  }

  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Popup
        className={cn(
          "data-open:fade-in-0 data-closed:fade-out-0 data-open:slide-in-from-right-10 data-closed:slide-out-to-right-10 data-closed:animate-out data-open:animate-in",
          "fixed top-4 right-4 bottom-4 z-50 flex overflow-hidden rounded-2xl border bg-background text-sm shadow-lg",
          "transition-[width] duration-300 ease-in-out",
          className
        )}
        data-slot="extensible-drawer-content"
        style={{ width: isExpanded ? expandedWidth : collapsedWidth }}
      >
        <SheetPrimitive.Title className="sr-only">Panel</SheetPrimitive.Title>
        <SheetPrimitive.Description className="sr-only">
          Detail panel
        </SheetPrimitive.Description>
        {children}
      </SheetPrimitive.Popup>
    </SheetPrimitive.Portal>
  );
}

// --- Main ---

function ExtensibleDrawerMain({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { isExpanded, isMobile } = useExtensibleDrawerContext();

  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col overflow-hidden transition-opacity duration-300",
        !isMobile && isExpanded && "pointer-events-none opacity-60",
        isMobile && isExpanded && "hidden",
        className
      )}
      data-slot="extensible-drawer-main"
      {...props}
    >
      {children}
    </div>
  );
}

// --- Header ---

function ExtensibleDrawerHeader({
  actions,
  className,
  children,
  ...props
}: {
  actions?: React.ReactNode;
} & React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-start justify-between gap-4 p-4", className)}
      data-slot="extensible-drawer-header"
      {...props}
    >
      <div className="flex flex-col gap-0.5">{children}</div>
      {actions && <div className="flex items-center gap-1">{actions}</div>}
    </div>
  );
}

// --- Title ---

function ExtensibleDrawerTitle({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { isMobile } = useExtensibleDrawerContext();
  const titleClassName = cn("font-medium text-base text-foreground", className);

  if (isMobile) {
    return (
      <DrawerPrimitive.Title
        className={titleClassName}
        data-slot="extensible-drawer-title"
      >
        {children}
      </DrawerPrimitive.Title>
    );
  }

  // On desktop, the sr-only primitive Title is in ExtensibleDrawerContent.
  // This renders a visual-only heading.
  return (
    <h2 className={titleClassName} data-slot="extensible-drawer-title">
      {children}
    </h2>
  );
}

// --- Description ---

function ExtensibleDrawerDescription({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { isMobile } = useExtensibleDrawerContext();
  const descriptionClassName = cn("text-muted-foreground text-sm", className);

  if (isMobile) {
    return (
      <DrawerPrimitive.Description
        className={descriptionClassName}
        data-slot="extensible-drawer-description"
      >
        {children}
      </DrawerPrimitive.Description>
    );
  }

  return (
    <p
      className={descriptionClassName}
      data-slot="extensible-drawer-description"
    >
      {children}
    </p>
  );
}

// --- Body ---

function ExtensibleDrawerBody({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex-1 overflow-y-auto p-4", className)}
      data-slot="extensible-drawer-body"
      {...props}
    >
      {children}
    </div>
  );
}

// --- Footer ---

function ExtensibleDrawerFooter({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      data-slot="extensible-drawer-footer"
      {...props}
    >
      {children}
    </div>
  );
}

// --- Expansion Panel ---

function ExtensibleDrawerExpansionPanel({
  mode,
  title,
  className,
  children,
  ...props
}: {
  mode: string;
  title?: string;
} & Omit<React.ComponentProps<"div">, "title">) {
  const { expansionMode, collapse, isMobile } = useExtensibleDrawerContext();

  if (expansionMode !== mode) {
    return null;
  }

  if (isMobile) {
    return (
      <div
        className={cn("flex flex-1 flex-col overflow-hidden", className)}
        data-slot="extensible-drawer-expansion-panel"
        {...props}
      >
        <div className="flex items-center gap-2 border-b p-4">
          <Button
            onClick={collapse}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
            <span className="sr-only">Back</span>
          </Button>
          {title && (
            <span className="font-medium text-base text-foreground">
              {title}
            </span>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col overflow-hidden border-l",
        className
      )}
      data-slot="extensible-drawer-expansion-panel"
      {...props}
    >
      <div className="flex items-center justify-between border-b p-4">
        {title && (
          <span className="font-medium text-base text-foreground">{title}</span>
        )}
        <Button
          className="ml-auto"
          onClick={collapse}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
          <span className="sr-only">Close panel</span>
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}

export {
  ExtensibleDrawer,
  ExtensibleDrawerBody,
  ExtensibleDrawerContent,
  ExtensibleDrawerDescription,
  ExtensibleDrawerExpansionPanel,
  ExtensibleDrawerFooter,
  ExtensibleDrawerHeader,
  ExtensibleDrawerMain,
  ExtensibleDrawerTitle,
  useExtensibleDrawerContext,
};
