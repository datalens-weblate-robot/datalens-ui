import React from 'react';

import {BucketPaint} from '@gravity-ui/icons';
import {Button, Dialog, Icon} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import DialogManager from 'components/DialogManager/DialogManager';
import {i18n} from 'i18n';
import {connect} from 'react-redux';
import type {Dispatch} from 'redux';
import {bindActionCreators} from 'redux';
import type {ColorsConfig, Field} from 'shared';
import {ColorMode, isMeasureValue} from 'shared';
import type {DatalensGlobalState} from 'ui';
import {setDialogColorPaletteState} from 'units/wizard/actions/dialogColor';
import {selectDataset, selectParameters} from 'units/wizard/selectors/dataset';
import {selectUpdates} from 'units/wizard/selectors/preview';
import {selectDashboardParameters, selectFilters} from 'units/wizard/selectors/visualization';

import {
    isGradientDialog,
    selectDialogColorGradientState,
    selectDialogColorPaletteState,
    selectDialogColorVisualizationId,
} from '../../../selectors/dialogColor';

import ColorSettingsContainer from './ColorSettingsContainer/ColorSettingsContainer';

import './DialogColor.scss';

const b = block('dialog-color');

export const DIALOG_COLOR = Symbol('DIALOG_COLOR');

export interface ExtraSettings {
    polygonBorders?: boolean;
    numericDimensionByGradient?: boolean;
    extraDistinctsForDiscreteMode?: string[];
}

interface OwnProps {
    item: Field;
    items?: Field[];
    // this prop is used only when multiple colors supported in colors section; otherwise it will be undefined;
    colorSectionFields?: Field[] | undefined;
    onApply: (colorsConfig: ColorsConfig) => void;
    onCancel: () => void;
    colorsConfig: ColorsConfig;
    extra?: ExtraSettings;
    isColorModeChangeAvailable: boolean;
}

type StateProps = ReturnType<typeof mapStateToProps>;

type DispatchProps = ReturnType<typeof mapDispatchToProps>;

interface Props extends OwnProps, StateProps, DispatchProps {}

export type OpenDialogColorArgs = {
    id: typeof DIALOG_COLOR;
    props: OwnProps;
};

interface State {
    colorMode: ColorMode;
}

class DialogColorComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        const colorMode = props.colorsConfig?.colorMode;

        if (colorMode && props.isColorModeChangeAvailable) {
            this.state = {
                colorMode,
            };
        } else {
            const isGradient = isGradientDialog({
                item: props.item,
                items: props.items,
                extra: props.extra,
            });

            this.state = {
                colorMode: isGradient ? ColorMode.GRADIENT : ColorMode.PALETTE,
            };
        }
    }

    render() {
        const {item, items, dataset, isColorModeChangeAvailable, colorSectionFields} = this.props;
        const {mountedColors = {}} = this.props.paletteState;
        const {validationStatus} = this.props.gradientState;
        const {colorMode} = this.state;

        if (!item || !dataset) {
            return null;
        }

        return (
            <Dialog open={true} onClose={this.onClose} disableFocusTrap={true}>
                <div className={b({[`${colorMode}-mode`]: true})}>
                    <Dialog.Header
                        insertBefore={
                            <div className={b('title-icon')}>
                                <Icon data={BucketPaint} size={18} />
                            </div>
                        }
                        caption={i18n('wizard', 'label_colors-settings')}
                    />
                    <Dialog.Body>
                        <ColorSettingsContainer
                            colorsConfig={this.props.colorsConfig}
                            item={item}
                            items={items}
                            colorSectionFields={colorSectionFields}
                            extra={this.props.extra}
                            colorMode={this.state.colorMode}
                            isColorModeChangeAvailable={isColorModeChangeAvailable}
                            onColorModeChange={this.onColorModeChange}
                            visualizationId={this.props.visualizationId}
                        />
                    </Dialog.Body>
                    <Dialog.Footer
                        preset="default"
                        onClickButtonCancel={this.onCancelButtonClick}
                        onClickButtonApply={this.onApplyButtonClick}
                        textButtonApply={i18n('wizard', 'button_apply')}
                        textButtonCancel={i18n('wizard', 'button_cancel')}
                        propsButtonApply={{
                            disabled: Boolean(validationStatus),
                            qa: 'color-dialog-apply-button',
                        }}
                    >
                        {item.type !== 'MEASURE' && !isMeasureValue(item) && (
                            <Button
                                view="outlined"
                                size="l"
                                disabled={!Object.keys(mountedColors).length}
                                onClick={this.onResetButtonClick}
                            >
                                {i18n('wizard', 'button_reset')}
                            </Button>
                        )}
                    </Dialog.Footer>
                </div>
            </Dialog>
        );
    }

    onColorModeChange = (colorMode: ColorMode) => {
        this.setState({colorMode});
    };

    onResetButtonClick = () => {
        this.props.actions.setDialogColorPaletteState({
            ...this.props.paletteState,
            mountedColors: {},
        });
    };

    onCancelButtonClick = () => {
        this.onClose();
    };

    onApplyButtonClick = () => {
        this.props.onApply(this.getColorsConfig());
        this.onClose();
    };

    getColorsConfig = () => {
        const {item, items} = this.props;

        const {colorMode} = this.state;

        let config: ColorsConfig;

        if (colorMode === ColorMode.GRADIENT) {
            const {
                gradientMode,
                gradientPalette,
                polygonBorders,
                reversed,
                thresholdsMode,
                leftThreshold,
                middleThreshold,
                rightThreshold,
                nullMode,
            } = this.props.gradientState;

            config = {
                gradientMode,
                gradientPalette,
                polygonBorders,
                reversed,
                thresholdsMode,
                leftThreshold: leftThreshold ? leftThreshold : undefined,
                middleThreshold: middleThreshold ? middleThreshold : undefined,
                rightThreshold: rightThreshold ? rightThreshold : undefined,
                colorMode,
                nullMode,
            };

            return config;
        } else {
            const {mountedColors, polygonBorders, palette} = this.props.paletteState;

            config = {
                polygonBorders,
                palette,
                mountedColors,
                fieldGuid: item.guid,
                coloredByMeasure: Boolean((items || []).length),
                colorMode,
            };
        }

        return config;
    };

    onClose = () => {
        this.props.onCancel();
    };
}

const mapStateToProps = (state: DatalensGlobalState) => {
    return {
        parameters: selectParameters(state),
        updates: selectUpdates(state),
        filters: selectFilters(state),
        dashboardParameters: selectDashboardParameters(state),
        dataset: selectDataset(state),
        gradientState: selectDialogColorGradientState(state),
        paletteState: selectDialogColorPaletteState(state),
        visualizationId: selectDialogColorVisualizationId(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        actions: bindActionCreators(
            {
                setDialogColorPaletteState,
            },
            dispatch,
        ),
    };
};

export const DialogColorContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(DialogColorComponent);

DialogManager.registerDialog(DIALOG_COLOR, DialogColorContainer);
