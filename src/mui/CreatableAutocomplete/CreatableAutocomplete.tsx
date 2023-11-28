import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'

type TOption = {
  inputValue?: string;
  label: string;
  value: string;
}
type TProps = {
  label: string;
  list: TOption[];
  onSelect: (item: { value: string; label: string; } | null) => void;
  defaultValue?: TOption;
}

const filter = createFilterOptions<TOption>()

export const CreatableAutocomplete = ({
  label,
  list,
  onSelect,
  defaultValue,
}: TProps) => {
  const [selectedOption, setSelectedOption] = React.useState<TOption | null>(defaultValue || null)

  React.useLayoutEffect(() => {
    onSelect(selectedOption)
  }, [selectedOption])

  return (
    <Autocomplete
      value={selectedOption?.value}
      onChange={(_event, newValue) => {
        if (typeof newValue === 'string') {
          setSelectedOption({
            value: newValue,
            label: newValue,
          })
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setSelectedOption({
            label: newValue.inputValue,
            value: newValue.inputValue,
          });
        } else {
          setSelectedOption(newValue);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.label);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            inputValue,
            label: `Add "${inputValue}"`,
            value: inputValue,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={list}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.label;
      }}
      renderOption={(props, option) => <li {...props}>{option.label}</li>}
      sx={{ width: '100%' }}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} size='small' label={label} />
      )}
    />
  );
}
