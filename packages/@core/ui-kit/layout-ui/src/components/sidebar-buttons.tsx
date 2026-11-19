import { ChevronsLeft, ChevronsRight, Pin, PinOff } from '@vben-core/icons';

interface SidebarCollapseButtonProps {
  collapsed: boolean;
  label?: string;
  onToggle: (collapsed: boolean) => void;
}

/**
 * دکمه‌ی جمع/باز کردن نوار کناری (پایین نوار)
 */
function SidebarCollapseButton({ collapsed, label, onToggle }: SidebarCollapseButtonProps) {
  return (
    <button
      aria-label={label}
      aria-pressed={collapsed}
      className="absolute start-3 bottom-2 z-10 flex-center cursor-pointer rounded-sm bg-accent p-1 text-foreground/60 hover:bg-accent-hover hover:text-foreground"
      data-layout-action="toggle-sidebar-collapse"
      onClick={(e) => {
        e.stopPropagation();
        onToggle(!collapsed);
      }}
      type="button"
    >
      {collapsed ? (
        <ChevronsRight className="size-4 rtl:rotate-180" />
      ) : (
        <ChevronsLeft className="size-4 rtl:rotate-180" />
      )}
    </button>
  );
}

interface SidebarFixedButtonProps {
  expandOnHover: boolean;
  onToggle: () => void;
}

/**
 * دکمه‌ی سنجاق نوار کناری
 */
function SidebarFixedButton({ expandOnHover, onToggle }: SidebarFixedButtonProps) {
  return (
    <div
      className="absolute end-3 bottom-2 z-10 flex-center cursor-pointer rounded-sm bg-accent p-1.25 text-foreground/60 transition-all duration-300 hover:bg-accent-hover hover:text-foreground"
      onClick={onToggle}
    >
      {expandOnHover ? <Pin className="size-3.5" /> : <PinOff className="size-3.5" />}
    </div>
  );
}

export { SidebarCollapseButton, SidebarFixedButton };
