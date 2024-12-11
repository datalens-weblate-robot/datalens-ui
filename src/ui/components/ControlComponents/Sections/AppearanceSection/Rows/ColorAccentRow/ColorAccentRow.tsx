import React from 'react';

import {FormRow} from '@gravity-ui/components';
import {Checkbox} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import {I18n} from 'i18n';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectorDialogItem} from 'ui/store/actions/controlDialog';
import {
    selectIsControlConfigurationDisabled,
    selectSelectorDialog,
} from 'ui/store/selectors/controlDialog';

import '../../AppearanceSection.scss';

const b = block('control2-appearance-section');

const i18n = I18n.keyset('dash.control-dialog.edit');

export const ColorAccentRow = () => {
    const dispatch = useDispatch();
    const {accentType} = useSelector(selectSelectorDialog);
    const isFieldDisabled = useSelector(selectIsControlConfigurationDisabled);

    const handleaccentTypeUpdate = React.useCallback(
        (enableAccent) => {
            const updatedType = enableAccent ? 'info' : null;

            dispatch(
                setSelectorDialogItem({
                    accentType: updatedType,
                }),
            );
        },
        [dispatch],
    );

    return (
        <FormRow label={i18n('field_color-accent')}>
            <div className={b('setting-container')}>
                <Checkbox
                    disabled={isFieldDisabled}
                    onUpdate={handleaccentTypeUpdate}
                    checked={Boolean(accentType)}
                    size="l"
                    className={b('setting-checkbox')}
                />
            </div>
        </FormRow>
    );
};
