import * as React from "react";

type UseExtensibleDrawerOptions = {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  collapsedWidth?: string;
  expandedWidth?: string;
};

type UseExtensibleDrawerReturn = {
  open: boolean;
  setOpen: (open: boolean) => void;
  expansionMode: string | null;
  isExpanded: boolean;
  expand: (mode: string) => void;
  collapse: () => void;
  toggleExpansion: (mode: string) => void;
  collapsedWidth: string;
  expandedWidth: string;
};

export function useExtensibleDrawer({
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  collapsedWidth = "28rem",
  expandedWidth = "56rem",
}: UseExtensibleDrawerOptions = {}): UseExtensibleDrawerReturn {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const [expansionMode, setExpansionMode] = React.useState<string | null>(null);

  const open = openProp ?? internalOpen;

  const setOpen = React.useCallback(
    (value: boolean) => {
      onOpenChange?.(value);
      setInternalOpen(value);
      // Reset expansion when opening, not on close (preserves content during close animation)
      if (value) {
        setExpansionMode(null);
      }
    },
    [onOpenChange]
  );

  const expand = React.useCallback((mode: string) => {
    setExpansionMode(mode);
  }, []);

  const collapse = React.useCallback(() => {
    setExpansionMode(null);
  }, []);

  const toggleExpansion = React.useCallback((mode: string) => {
    setExpansionMode((current) => (current === mode ? null : mode));
  }, []);

  return {
    open,
    setOpen,
    expansionMode,
    isExpanded: expansionMode !== null,
    expand,
    collapse,
    toggleExpansion,
    collapsedWidth,
    expandedWidth,
  };
}
