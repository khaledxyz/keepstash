import React from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { Spinner } from "@/components/ui/spinner";

// Extract the variant type from Button props
type ButtonVariant = React.ComponentProps<typeof Button>["variant"];

interface PromptConfig {
  title: string;
  description: string;
  variant?: ButtonVariant;
  verificationText?: string;
  verificationPlaceholder?: string;
  cancelText?: string;
  confirmText?: string;
  processingText?: string;
  onConfirm?: () => Promise<void> | void;
  onError?: (error: unknown) => void;
}

interface PromptContextValue {
  prompt: (config: PromptConfig) => Promise<boolean>;
}

const PromptContext = React.createContext<PromptContextValue | null>(null);

interface PromptDialogProps {
  open: boolean;
  config: PromptConfig;
  onConfirm: () => void;
  onCancel: () => void;
}

const PromptDialog = React.memo(
  ({ open, config, onConfirm, onCancel }: PromptDialogProps) => {
    const [input, setInput] = React.useState("");
    const [isProcessing, setIsProcessing] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const {
      title,
      description,
      variant = "default",
      verificationText,
      verificationPlaceholder,
      cancelText = "Cancel",
      confirmText = "Confirm",
      processingText = "Processing...",
      onConfirm: asyncOnConfirm,
      onError,
    } = config;

    const isValid = verificationText ? input === verificationText : true;

    // Auto-focus input when verification is required
    React.useEffect(() => {
      if (open && verificationText) {
        inputRef.current?.focus();
      }
    }, [open, verificationText]);

    const handleConfirm = async () => {
      if (!isValid || isProcessing) {
        return;
      }

      if (asyncOnConfirm) {
        try {
          setIsProcessing(true);
          await asyncOnConfirm();
          onConfirm();
        } catch (error) {
          onError?.(error);
          setIsProcessing(false);
        }
      } else {
        onConfirm();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && isValid && !isProcessing) {
        e.preventDefault();
        handleConfirm();
      }
    };

    return (
      <ResponsiveModal
        onOpenChange={(openState) => {
          if (!(openState || isProcessing)) {
            onCancel();
          }
        }}
        open={open}
      >
        <ResponsiveModalContent>
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>{title}</ResponsiveModalTitle>
            <ResponsiveModalDescription>
              {description}
            </ResponsiveModalDescription>
          </ResponsiveModalHeader>

          {verificationText ? (
            <Field>
              <FieldLabel className="gap-1" htmlFor="verification-input">
                Please type <strong>{verificationText}</strong> to confirm
              </FieldLabel>
              <Input
                autoComplete="off"
                disabled={isProcessing}
                id="verification-input"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setInput(e.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder={verificationPlaceholder || verificationText}
                ref={inputRef}
                type="text"
                value={input}
              />
            </Field>
          ) : null}

          <ResponsiveModalFooter>
            <Button
              aria-label={cancelText}
              disabled={isProcessing}
              onClick={onCancel}
              size="lg"
              variant="outline"
            >
              {cancelText}
            </Button>
            <Button
              aria-busy={isProcessing}
              aria-label={confirmText}
              disabled={!isValid || isProcessing}
              onClick={handleConfirm}
              size="lg"
              variant={variant}
            >
              {isProcessing ? <Spinner /> : null}
              {isProcessing ? processingText : confirmText}
            </Button>
          </ResponsiveModalFooter>
        </ResponsiveModalContent>
      </ResponsiveModal>
    );
  }
);

PromptDialog.displayName = "PromptDialog";

export const PromptProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [config, setConfig] = React.useState<PromptConfig | null>(null);
  const pendingResolve = React.useRef<((value: boolean) => void) | null>(null);
  const CLOSE_ANIMATION_MS = 220;
  const closeTimerRef = React.useRef<number | null>(null);
  const isClosingRef = React.useRef(false);
  const openIdRef = React.useRef(0);

  const prompt = React.useCallback((cfg: PromptConfig): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (pendingResolve.current || isClosingRef.current) {
        reject(new Error("A prompt is already open"));
        return;
      }
      pendingResolve.current = resolve;
      openIdRef.current += 1;

      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
        isClosingRef.current = false;
      }

      setConfig(cfg);
      setIsOpen(true);
    });
  }, []);

  const handleConfirm = React.useCallback(() => {
    pendingResolve.current?.(true);
    pendingResolve.current = null;
    setIsOpen(false);
    isClosingRef.current = true;
    closeTimerRef.current = window.setTimeout(() => {
      setConfig(null);
      isClosingRef.current = false;
      closeTimerRef.current = null;
    }, CLOSE_ANIMATION_MS);
  }, []);

  const handleCancel = React.useCallback(() => {
    pendingResolve.current?.(false);
    pendingResolve.current = null;
    setIsOpen(false);
    isClosingRef.current = true;
    closeTimerRef.current = window.setTimeout(() => {
      setConfig(null);
      isClosingRef.current = false;
      closeTimerRef.current = null;
    }, CLOSE_ANIMATION_MS);
  }, []);

  React.useEffect(
    () => () => {
      pendingResolve.current?.(false);
      pendingResolve.current = null;
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    },
    []
  );

  const contextValue = React.useMemo(() => ({ prompt }), [prompt]);

  return (
    <PromptContext value={contextValue}>
      {children}
      {config ? (
        <PromptDialog
          config={config}
          key={openIdRef.current}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
          open={isOpen}
        />
      ) : null}
    </PromptContext>
  );
};

PromptProvider.displayName = "PromptProvider";

export const usePrompt = (): PromptContextValue["prompt"] => {
  const context = React.use(PromptContext);

  if (!context) {
    throw new Error("usePrompt must be used within a PromptProvider");
  }

  return context.prompt;
};
