---
name: tanstack-form-web
description: Build and refactor forms in this repo using TanStack React Form. Covers preferred patterns (useForm/useAppForm/withForm), validation via Zod (Standard Schema), field listeners, linked fields, error display, and performance via Subscribe selectors.
metadata:
  short-description: TanStack Form (apps/web) guidance
---

# TanStack Form (apps/web) Skill

Use this skill whenever you create or refactor a form in `apps/web`. More details can be found via searching for "TanStack Form" in the Context7 MCP server.

## Key Concepts

### Standard Schema (No Adapter Needed)

TanStack Form supports Standard Schema natively. With **Zod v3.24.0+**, you can pass Zod schemas directly to validators without any adapter:

```typescript
import { useForm } from "@tanstack/react-form";
import { MySchema } from "@/schemas/my-form";

// No adapter needed - just pass the schema directly
const form = useForm({
  defaultValues: { /* ... */ },
  validators: {
    onChange: MySchema,
  },
});
```

**Do NOT install `@tanstack/zod-form-adapter`** - it's unnecessary with modern Zod.

---

## Defaults (House Style)

| Scenario | Approach |
|----------|----------|
| **Basic forms** (auth, simple modals) | `useForm` + Zod schema |
| **Complex forms** (drawers, multi-section) | `useAppForm` from `hooks/form.tsx` |
| **Field resets another field** | `listeners.onChange` (side effect) |
| **Field validation depends on another field** | `validators.onChangeListenTo` |
| **Complex field logic** | Wrap in `withForm` HOC |

- Prefer `form.Subscribe(selector)` and `form.Field` render props over reading `form.state` at the top of components.
- Prefer Zod schemas at form level; use field `validators` for specific rules.

---

## Choose the Right Pattern

### A) Basic Forms (modal/dialog/page)

Use `useForm` directly for simple, isolated forms.

```typescript
import { useForm } from "@tanstack/react-form";
import { MySchema } from "@/schemas/my-form";

const form = useForm({
  defaultValues: {
    email: "",
    password: "",
  },
  validators: {
    onChange: MySchema,
  },
  onSubmit: async ({ value }) => {
    // Value is already validated
  },
});
```

Checklist:
- Define stable `defaultValues`.
- Pass Zod schema to `validators.onChange`.
- Use `<form onSubmit={... form.handleSubmit() ...}>`.
- Use `form.Subscribe` for submit button disabled/loading.

### B) Complex Forms

Use `useAppForm` in the parent and split UI into sections using `withForm`.

#### How `useAppForm` is Created

The `useAppForm` hook is created using TanStack Form's `createFormHook` factory. This allows registering reusable field components that can be used via `form.AppField`:

```typescript
// apps/web/src/hooks/form.tsx

import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

// 1. Create contexts for field components to access form state
export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

// 2. Define reusable field components that use the context
function TextField({ label }: { label: string }) {
  const field = useFieldContext<string>();
  // ... render field with label, input, error display
}

function NumberField({ label, min, step, nullable }: Props) {
  const field = useFieldContext<number | null>();
  // ... render number input
}

function YesNoSelect({ label }: { label: string }) {
  const field = useFieldContext<boolean>();
  // ... render yes/no select
}

// 3. Create the form hook with registered components
export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    NumberField,
    YesNoSelect,
  },
  formComponents: {},
});
```

#### Using `useAppForm`

```typescript
import { useAppForm } from "@/hooks/form";

const form = useAppForm({
  ...myFormOptions,
  defaultValues: recordToFormValues(record),
  validators: {
    onChange: MySchema,
  },
});

// Use registered field components via form.AppField
<form.AppField name="price" children={(field) => <NumberField label="Price" />} />

// Or use standard form.Field for custom fields
<form.Field name="customField">
  {(field) => /* custom render */}
</form.Field>
```

Checklist:
- Put shared defaults in `formOptions` (e.g. `enquiryFormOptions`).
- Sections are `withForm({ ...formOptions, render({ form, ...props }) { ... } })`.
- Use `form.AppField` for registered field components (`TextField`, `NumberField`, `YesNoSelect`).
- Use `form.Field` for custom one-off fields.

---

## Validation

### Form-Level Validation (Zod)

Pass Zod schemas directly to form validators:

```typescript
const form = useForm({
  validators: {
    onChange: MyZodSchema,
  },
});
```

### Field-Level Validation

For field-specific rules not covered by the schema:

```typescript
<form.Field
  name="customField"
  validators={{
    onChange: ({ value }) => {
      if (someCondition(value)) {
        return "Error message";
      }
      return undefined;
    },
  }}
>
  {(field) => /* render */}
</form.Field>
```

### Async Validation

```typescript
<form.Field
  name="username"
  validators={{
    onChangeAsyncDebounceMs: 500,
    onChangeAsync: async ({ value }) => {
      const exists = await checkUsernameExists(value);
      return exists ? "Username already taken" : undefined;
    },
  }}
>
  {(field) => /* render */}
</form.Field>
```

---

## Linked Fields

### Side Effects: `listeners.onChange`

Use when a field change should reset or modify another field:

```typescript
<form.Field
  name="country"
  listeners={{
    onChange: ({ value }) => {
      // Side effect: clear province when country changes
      form.setFieldValue("province", "");
    },
  }}
>
  {(field) => /* render */}
</form.Field>
```

### Validation Dependencies: `onChangeListenTo`

Use when a field's validation depends on another field's value:

```typescript
<form.Field
  name="confirmPassword"
  validators={{
    onChangeListenTo: ["password"], // Re-run validation when password changes
    onChange: ({ value, fieldApi }) => {
      if (value !== fieldApi.form.getFieldValue("password")) {
        return "Passwords do not match";
      }
      return undefined;
    },
  }}
>
  {(field) => /* render */}
</form.Field>
```

### Combining Both Patterns

For fields that need both side effects AND validation dependencies:

```typescript
// Source field: has side effect (clears dependent field)
<form.Field
  name="source"
  listeners={{
    onChange: ({ value }) => {
      if (value !== "agent") {
        form.setFieldValue("sourceAgentName", "");
      }
    },
  }}
>
  {(field) => /* render */}
</form.Field>

// Dependent field: validation depends on source
<form.Field
  name="sourceAgentName"
  validators={{
    onChangeListenTo: ["source"],
    onChange: ({ value, fieldApi }) => {
      const source = fieldApi.form.getFieldValue("source");
      if (source === "agent" && (!value || !value.trim())) {
        return "Agent name required when source is Agent";
      }
      return undefined;
    },
  }}
>
  {(field) => /* render */}
</form.Field>
```

---

## Error Display

Use `field.state.meta.isValid` and `formatFormErrors()` for error display. The `formatFormErrors` utility handles both string errors (from inline validators) and Zod error objects (from schema validators):

```typescript
import { formatFormErrors } from "@/hooks/form";

<form.Field name="email">
  {(field) => {
    const isValid = field.state.meta.isValid;
    const errors = field.state.meta.errors;
    return (
      <div>
        <label htmlFor={field.name}>Email</label>
        <input
          id={field.name}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          className={!isValid ? "border-destructive" : ""}
        />
        {!isValid && (
          <p className="text-destructive text-sm mt-1" role="alert">
            {formatFormErrors(errors)}
          </p>
        )}
      </div>
    );
  }}
</form.Field>
```

**Important:** Do NOT use `errors.join(", ")` directly - errors from Zod validators are objects with a `message` property, not strings. Always use `formatFormErrors()` to handle both cases.

---

## Submit Button State

Use `form.Subscribe` with `canSubmit` and `isSubmitting`:

```typescript
<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
  {([canSubmit, isSubmitting]) => (
    <Button disabled={!canSubmit} isLoading={isSubmitting} type="submit">
      Save
    </Button>
  )}
</form.Subscribe>
```

---

## Performance

- **Avoid** `const x = form.state.values...` in parent components; it rerenders on every field change.
- **Prefer**:
  - `form.Subscribe(selector)` for derived read-only UI and submit gating (in JSX).
  - `useStore(form.store, selector)` for reactive values in component logic (outside JSX).
  - `form.Field` / `form.AppField` render props for inputs.

### `useStore` for Reactive Values

Use `useStore` when you need form state in component logic (not just JSX). **Always use a selector** - never subscribe to the entire store:

```typescript
import { useStore } from "@tanstack/react-store";

// Correct: subscribe to specific values
const firstName = useStore(form.store, (state) => state.values.firstName);
const errors = useStore(form.store, (state) => state.errorMap);
const isDirty = useStore(form.store, (state) => state.isDirty);

// Incorrect: subscribes to everything, re-renders on any change
const store = useStore(form.store); // Don't do this!
```

Use `useStore` when you need the value in logic (conditionals, effects, callbacks):

```typescript
function MyFormSection({ form }) {
  // Subscribe to a value for conditional logic
  const selectedType = useStore(form.store, (state) => state.values.type);

  // Now you can use it in logic
  const showAdvancedOptions = selectedType === "advanced";

  return (
    <>
      {showAdvancedOptions && <AdvancedOptions />}
    </>
  );
}
```

### `form.Subscribe` for JSX

Use `form.Subscribe` when you only need values for rendering:

```typescript
<form.Subscribe selector={(s) => [s.values.a, s.values.b]}>
  {([a, b]) => <DerivedDisplay a={a} b={b} />}
</form.Subscribe>
```

### When to Use Which

| Need | Use |
|------|-----|
| Value in JSX only | `form.Subscribe` |
| Value in component logic | `useStore(form.store, selector)` |
| Input field binding | `form.Field` / `form.AppField` |
| Submit button state | `form.Subscribe` with `canSubmit`/`isSubmitting` |

---

## Async Initial Values & Record Switching

TanStack Form does not "auto-reinitialize" on new async data. Pick one:

### Option 1 (Preferred): Keyed Remount

Render the form component with `key={recordId}`:

```typescript
// Container
function MyDrawer({ recordId }) {
  const { data: record, isPending } = useRecord(recordId);

  if (isPending) return <Skeleton />;
  if (!record) return <NotFound />;

  return <MyForm key={record.id} record={record} />;
}

// Form (no useEffect for reset needed)
function MyForm({ record }) {
  const form = useAppForm({
    defaultValues: recordToFormValues(record),
  });
}
```

- Only remount when identity changes; do not remount on refetch for the same id.
- Keeps user edits intact on refetch.

### Option 2: Reset-on-ID-Change

In an effect keyed on `record?.id`, call `form.reset(mappedValues)`:

```typescript
const previousIdRef = useRef<string | null>(null);

useEffect(() => {
  if (record?.id !== previousIdRef.current) {
    previousIdRef.current = record?.id ?? null;
    if (record) {
      form.reset(recordToFormValues(record));
    }
  }
}, [record?.id, form]);
```

**Note:** Do NOT reset on every data object change; key off identity only.

---

## Accessing Form State in Parent Components

When a parent component needs access to form state (e.g., `isDirty` for unsaved changes modals), use `useStore` from `@tanstack/react-store`.

### Pattern: Hoisted Form Provider (Preferred)

Create the form in a keyed wrapper component that owns both the form and the unsaved changes modal. This eliminates the need for refs and state syncing:

```typescript
// Parent component - thin shell that handles data fetching
function MyDrawer({ recordId, open, onOpenChange }) {
  const { activeId, closeDrawer, isDrawerOpen } = useAnimatedDrawerState(...);
  const { data: record, isPending } = useRecord(activeId);

  // No form state management here - delegated to FormProvider
  return (
    <DrawerBodyContent
      record={record}
      isLoading={isPending}
      isDrawerOpen={isDrawerOpen}
      closeDrawer={closeDrawer}
      onOpenChange={onOpenChange}
    />
  );
}

// Body content - routes to form provider when record is loaded
function DrawerBodyContent({ record, isLoading, isDrawerOpen, closeDrawer, onOpenChange }) {
  // When record is loaded, delegate to FormProvider which handles close attempts
  if (!isLoading && record) {
    return (
      <MyFormProvider
        key={record.id}  // Keyed remount here
        record={record}
        isDrawerOpen={isDrawerOpen}
        closeDrawer={closeDrawer}
        onOpenChange={onOpenChange}
      />
    );
  }

  // Loading or not found states - simple close behavior
  return (
    <DetailDrawerShell onCloseAttempt={closeDrawer} open={isDrawerOpen} ...>
      {isLoading ? <Skeleton /> : <NotFound />}
    </DetailDrawerShell>
  );
}

// Form provider - creates form and handles unsaved changes
function MyFormProvider({ record, isDrawerOpen, closeDrawer, onOpenChange }) {
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const mutation = useUpdateRecord();

  const form = useAppForm({
    defaultValues: recordToFormValues(record),
    onSubmit: ({ value }) => {
      mutation.mutate(value, { onSuccess: closeDrawer });
    },
  });

  // Direct useStore access - no callbacks or refs needed
  const isDirty = useStore(form.store, (state) => state.isDirty);

  const handleCloseAttempt = useCallback(() => {
    if (isDirty) {
      setShowUnsavedModal(true);
    } else {
      closeDrawer();
    }
  }, [isDirty, closeDrawer]);

  // Direct form method access - no refs needed
  const handleDiscard = useCallback(() => {
    setShowUnsavedModal(false);
    form.reset();
    closeDrawer();
  }, [form, closeDrawer]);

  const handleSave = useCallback(() => {
    setShowUnsavedModal(false);
    form.handleSubmit();
  }, [form]);

  return (
    <>
      <DetailDrawerShell onCloseAttempt={handleCloseAttempt} open={isDrawerOpen} ...>
        <form.AppForm>
          <FormContent form={form} />
        </form.AppForm>
      </DetailDrawerShell>

      <UnsavedChangesModal
        open={showUnsavedModal}
        onDiscard={handleDiscard}
        onSave={handleSave}
      />
    </>
  );
}
```

**Benefits of this pattern:**
- No `formActionsRef` needed - direct access to `form.reset()` and `form.handleSubmit()`
- No `useLayoutEffect` for syncing state - `useStore` provides reactive access
- No `onIsDirtyChange` callbacks - isDirty is used directly where needed
- Cleaner data flow - no two-way sync between parent and child
- The keyed remount (`key={record.id}`) gives clean form state when switching records

### Anti-Pattern: Refs and Callbacks for Form State

**Avoid this pattern** - it requires unnecessary state syncing and refs:

```typescript
// AVOID: Parent manages form state via callbacks and refs
function MyDrawer({ recordId }) {
  const [isDirty, setIsDirty] = useState(false);
  const formActionsRef = useRef<{ reset: () => void } | null>(null);

  return (
    <MyForm
      key={record.id}
      record={record}
      onIsDirtyChange={setIsDirty}  // Unnecessary callback
      formActionsRef={formActionsRef}  // Unnecessary ref
    />
  );
}

function MyForm({ record, onIsDirtyChange, formActionsRef }) {
  const form = useAppForm({ ... });
  const isDirty = useStore(form.store, (state) => state.isDirty);

  // Unnecessary sync - hoist the form instead
  useLayoutEffect(() => {
    onIsDirtyChange(isDirty);
  }, [isDirty, onIsDirtyChange]);

  // Unnecessary ref exposure - hoist the form instead
  useLayoutEffect(() => {
    formActionsRef.current = { reset: () => form.reset() };
  }, [form, formActionsRef]);
}
```

**Also avoid using refs to bypass React's reactivity:**

```typescript
// WRONG: Uses refs to bypass React's reactivity
const formRef = useRef<typeof form>(null!);
formRef.current = form;

const handleClose = useCallback(() => {
  if (formRef.current.state.isDirty) { // Anti-pattern!
    setShowUnsavedModal(true);
  }
}, []);
```

---

## Reset Semantics (Modals/Drawers)

- **Close/Cancel:** `form.reset()` + clear local UI state.
- **Discard:** `form.reset()` (returns to defaults; defaults should represent "last loaded" values in edit flows).
- **Reset to snapshot:** `form.reset(values, opts)`.

---

## UI Conventions

- Non-submit buttons inside a form must use `type="button"`.
- Always `e.preventDefault()` and `e.stopPropagation()` before calling `form.handleSubmit()`.
- Keep `id` usage consistent via `useId()` and wire labels with `htmlFor`.
- Use `role="alert"` on error messages for accessibility.

---

## Code Review Checklist

- [ ] Zod schemas passed directly to validators (no adapter).
- [ ] `useForm` for basic forms, `useAppForm` for complex forms.
- [ ] Side effects use `listeners.onChange`.
- [ ] Validation dependencies use `validators.onChangeListenTo`.
- [ ] No broad reads of `form.state` in large components (use `Subscribe`/fields).
- [ ] Async initial values handled (keyed remount preferred).
- [ ] Reset semantics match UX (close vs discard vs record switch).
- [ ] Form state accessed via `useStore(form.store, selector)` - NOT refs to `form.state`.
- [ ] Error display uses `isValid` and `formatFormErrors(errors)` with `role="alert"`.
- [ ] Submit button uses `form.Subscribe` with `canSubmit`/`isSubmitting`.
- [ ] Drawer/modal forms use hoisted form provider pattern (no `formActionsRef` or `onIsDirtyChange`).
