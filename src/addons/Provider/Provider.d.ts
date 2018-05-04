import * as React from 'react';
import { CheckboxProps } from '../../modules/Checkbox';

export interface ProviderProps extends CheckboxProps {
  [key: string]: any;
}

declare const Provider: React.StatelessComponent<ProviderProps>;

export default Provider;
