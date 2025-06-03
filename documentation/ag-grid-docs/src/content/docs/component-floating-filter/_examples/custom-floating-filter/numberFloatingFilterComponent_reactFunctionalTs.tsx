import React, { ChangeEvent, Fragment } from 'react';

import type { CustomFloatingFilterDisplayProps } from 'ag-grid-react';

export interface CustomProps extends CustomFloatingFilterDisplayProps {
    color: string;
}

export default ({ model, onModelChange, color }: CustomProps) => {
    const value = (model && model.filter) || '';

    const onInput = ({ target: { value: newValue } }: ChangeEvent<HTMLInputElement>) => {
        onModelChange(
            newValue === ''
                ? null
                : {
                      ...(model || {
                          type: 'greaterThan',
                      }),
                      filter: Number(newValue),
                  }
        );
    };

    const style = {
        borderColor: color,
        width: '30px',
    };

    return (
        <Fragment>
            &gt; <input value={value} style={style} type="number" min="0" onInput={onInput} />
        </Fragment>
    );
};
