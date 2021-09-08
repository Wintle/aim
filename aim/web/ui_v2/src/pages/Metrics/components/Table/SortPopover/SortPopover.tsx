import React from 'react';
import { Button, Checkbox, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank,
} from '@material-ui/icons';

import { ISortPopoverProps } from 'types/pages/metrics/components/SortPopover/SortPopover';
import { IGroupingSelectOption } from 'types/services/models/metrics/metricsAppModel';
import ToggleButton from 'components/ToggleButton/ToggleButton';
import Icon from 'components/Icon/Icon';

import './SortPopover.scss';

function SortPopover({
  sortOptions,
}: ISortPopoverProps): React.FunctionComponentElement<React.ReactNode> {
  const [selectedFields, setSelectedFields] = React.useState<
    IGroupingSelectOption[]
  >([]);

  function onChange(e: object, values: IGroupingSelectOption[]): void {
    setSelectedFields(values);
  }

  function handleDelete(field: string): void {
    let fieldData = [...selectedFields].filter(
      (opt: any) => opt.label !== field,
    );
    setSelectedFields(fieldData);
  }

  const selectOptions: IGroupingSelectOption[] = React.useMemo(() => {
    const filtered: IGroupingSelectOption[] = [...sortOptions].filter(
      (options) => options.group === 'params',
    );
    return filtered;
  }, [sortOptions]);

  const handleResetSorting = React.useCallback(() => {
    setSelectedFields([]);
  }, [selectedFields]);

  return (
    <div className='SortPopover__container'>
      <div className='SortPopover__select__container'>
        <Autocomplete
          id='select-sort'
          size='small'
          multiple
          disableCloseOnSelect
          options={selectOptions}
          value={selectedFields}
          onChange={onChange}
          groupBy={(option) => option.group}
          getOptionLabel={(option) => option.label}
          getOptionSelected={(option, value) => option.value === value.value}
          renderTags={() => null}
          renderInput={(params) => (
            <TextField
              {...params}
              variant='outlined'
              label='Select Metrics'
              placeholder='Select'
            />
          )}
          ListboxProps={{
            style: {
              height: 250,
            },
          }}
          renderOption={(option, { selected }) => (
            <div className='SortPopover__select__item'>
              <Checkbox
                color='primary'
                icon={<CheckBoxOutlineBlank />}
                checkedIcon={<CheckBoxIcon />}
                style={{ marginRight: 4 }}
                checked={selected}
              />
              <span>{option.label}</span>
            </div>
          )}
        />
      </div>
      <div className='SortPopover__chip__container'>
        {selectedFields.map((field) => (
          <div className='SortPopover__chip' key={field.value}>
            <div className='SortPopover__chip__left'>
              <span
                className='SortPopover__chip__delete'
                onClick={() => handleDelete(field.label)}
              >
                <Icon name='close' />
              </span>
            </div>
            <ToggleButton
              className='TooltipContentPopover__toggle__button'
              onChange={() => null}
              leftLabel={'Asc'}
              rightLabel={'Desc'}
              leftValue={'Asc'}
              rightValue={'Desc'}
              value={'Asc'}
              title={field.label}
            />
          </div>
        ))}
      </div>
      <div className='SortPopover__reset__sorting'>
        <Button onClick={handleResetSorting} variant='outlined' size='small'>
          Reset Sorting
        </Button>
      </div>
    </div>
  );
}

export default SortPopover;