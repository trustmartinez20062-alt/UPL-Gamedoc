import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-red-600 group-[.toaster]:text-white group-[.toaster]:border-red-700 group-[.toaster]:shadow-lg font-bold",
          description: "group-[.toast]:text-red-100",
          actionButton: "group-[.toast]:bg-white group-[.toast]:text-red-600",
          cancelButton: "group-[.toast]:bg-red-800 group-[.toast]:text-red-100",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
