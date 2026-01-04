import * as React from 'react';
import { useForm } from 'react-hook-form';

export type ExploreInput = {
  search: string;
};

type UseSearchOptions = {
  onSubmit?: (data: ExploreInput) => void;
};

export function useSearch({ onSubmit }: UseSearchOptions = {}) {
  const [showDescription, setShowDescription] = React.useState(true);
  const { control, handleSubmit } = useForm<ExploreInput>();

  const submit = React.useCallback(() => {
    handleSubmit((data) => {
      onSubmit?.(data);
    })();
  }, [handleSubmit, onSubmit]);

  const handleFocus = React.useCallback(() => {
    setShowDescription(true);
  }, []);

  const handleBlur = React.useCallback(
    (fieldOnBlur: () => void) => () => {
      fieldOnBlur();
      setShowDescription(false);
    },
    []
  );

  const handleSubmitEditing = React.useCallback(() => {
    submit();
  }, [submit]);

  const handleChangeText = React.useCallback(
    (fieldOnChange: (value: string) => void) => (text: string) => {
      fieldOnChange(text);
    },
    []
  );

  const placeholder = showDescription
    ? 'Search by area, street, or landmark'
    : 'Where do you need a toilet?';

  return {
    control,
    placeholder,
    handleFocus,
    handleBlur,
    handleSubmitEditing,
    handleChangeText,
  };
}
