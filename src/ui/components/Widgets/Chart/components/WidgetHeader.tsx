import React from 'react';

import {AdaptiveTabs} from '@gravity-ui/components';
import {ArrowLeft} from '@gravity-ui/icons';
import {Button, Icon} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import DebugInfoTool from 'components/DashKit/plugins/DebugInfoTool/DebugInfoTool';
import type {CurrentTab} from 'components/DashKit/plugins/Widget/types';
import {useDispatch} from 'react-redux';
import {ChartkitMenuDialogsQA, ControlQA, Feature} from 'shared';
import {DL} from 'ui/constants/common';
import {DL_ADAPTIVE_TABS_BREAK_POINT_CONFIG} from 'ui/constants/misc';
import {setSkipReload} from 'ui/units/dash/store/actions/dashTyped';
import {MOBILE_SIZE} from 'ui/utils/mobile';
import Utils from 'ui/utils';
import Loader from '../../../../libs/DatalensChartkit/components/ChartKitBase/components/Loader/Loader';
import type {ChartsData} from '../../../../libs/DatalensChartkit/modules/data-provider/charts';
import type {
    CombinedError,
    LoadedWidgetData,
    ControlWidget,
    OnChangeData,
} from '../../../../libs/DatalensChartkit/types';

import {DRAGGABLE_HANDLE_CLASS_NAME} from '../helpers/helpers';
import type {ChartProviderPropsWithRefProps, DataProps, ChartWidgetDataRef} from '../types';

import {Header as ChartHeader} from './Header';

import iconClearActionParams from '../../../../assets/icons/funnel-clear.svg';

import './WidgetHeader.scss';

type TabItem = {
    id: string;
    title: string;
    disabled?: boolean;
};

export type HeaderProps = {
    widgetId: string;
    isFullscreen: boolean;
    onFullscreenClick: () => void;
    editMode: boolean;
    hideTabs: boolean;
    tabsItems?: Array<TabItem>;
    currentTab?: CurrentTab;
    onSelectTab?: (param: string) => void;
    hideDebugTool?: boolean;
    showActionParamsFilter?: boolean;
    onFiltersClear?: () => void;
    title?: string;
    noControls?: boolean;
};

export type HeaderWithControlsProps = HeaderProps & Pick<ChartProviderPropsWithRefProps, 'compactLoader'| 'loaderDelay'| 'menuType'| 'menuChartkitConfig'| 'dataProvider'> & {
    error: CombinedError | null;
    dataProps?: DataProps;
    requestId: ChartsData['requestId'];

    loadedData:
            | LoadedWidgetData<ChartsData>
            | (LoadedWidgetData<ChartsData> & ControlWidget & ChartsData['extra']);
    widgetDataRef: ChartWidgetDataRef;
    widgetRenderTimeRef: React.MutableRefObject<number | null>;
    yandexMapAPIWaiting?: number | null;
    enableActionParams?: boolean;
    isWidgetMenuDataChanged?: boolean;
    showLoader?: boolean;
    veil?: boolean;

    onChange: (changedData: OnChangeData,
        _state: {forceUpdate: boolean},
        callExternalOnChange?: boolean,
        callChangeByClick?: boolean,) => void;
};

const b = block('widget-header');

export const WidgetHeader = (props: HeaderProps | HeaderWithControlsProps) => {
    const {
        widgetId,
        isFullscreen,
        onFullscreenClick,
        editMode,
        hideTabs,
        tabsItems,
        currentTab,
        onSelectTab,
        hideDebugTool,
        showActionParamsFilter,
        onFiltersClear,
        title,
        noControls,
    } = props;

    const headerWithControlsProps = (props as HeaderWithControlsProps);

    const size = DL.IS_MOBILE ? MOBILE_SIZE.TABS : 'm';

    const showTabs = !hideTabs && tabsItems && currentTab && onSelectTab;

    const widgetTitle = currentTab?.title || title;

    const showFloatControls = Utils.isEnabledFeature(Feature.DashFloatControls);

    const showFiltersClear = showActionParamsFilter && onFiltersClear && !showFloatControls;

    const [isExportLoading, setIsExportLoading] = React.useState(false);
    const dispatch = useDispatch();

    const handleExportLoading = React.useCallback(
        (isLoading: boolean) => {
            setIsExportLoading(isLoading);
            dispatch(setSkipReload(isLoading));
        },
        [dispatch],
    );

    const showContentLoader = headerWithControlsProps.showLoader || isExportLoading;
    const showLoaderVeil = headerWithControlsProps.veil && !isExportLoading;

    const renderTabs = () => (
        <div
            className={b(
                'tabs',
                {'edit-mode': editMode, 'no-controls': noControls},
                DRAGGABLE_HANDLE_CLASS_NAME,
            )}
        >
            {showTabs && (
                <AdaptiveTabs
                    size={size}
                    items={tabsItems}
                    activeTab={currentTab.id}
                    onSelectTab={onSelectTab}
                    breakpointsConfig={DL_ADAPTIVE_TABS_BREAK_POINT_CONFIG}
                    wrapTo={(tab, node) => {
                        const isActive = tab?.id === currentTab.id;

                        return (
                            <div
                                className={b('tab', {active: isActive})}
                                data-qa={ChartkitMenuDialogsQA.widgetTab}
                            >
                                {hideDebugTool === undefined
                                    ? true
                                    : Boolean(hideDebugTool && !isActive) && (
                                          <DebugInfoTool
                                              label={'tabId'}
                                              value={tab?.id || ''}
                                              modType={'right'}
                                          />
                                      )}
                                {node}
                            </div>
                        );
                    }}
                />
            )}
        </div>
    );

    return (
        <React.Fragment>
            {!hideDebugTool && <DebugInfoTool label="id" value={widgetId || ''} modType="outer" />}
            <div
                className={b({
                    mobile: DL.IS_MOBILE,
                    fullscreen: isFullscreen,
                })}
            >
                {isFullscreen && (
                    <span
                        className={b('back-icon')}
                        onClick={onFullscreenClick}
                        data-qa="chart-widget-back-icon"
                    >
                        <Icon data={ArrowLeft} />
                    </span>
                )}
                {isFullscreen ? <div className={b('title')}>{widgetTitle}</div> : renderTabs()}
                {showFiltersClear && (
                    <div className={b('icons')}>
                        <div className={b('filters-controls')}>
                            <Button qa={ControlQA.filtersClear} onClick={onFiltersClear}>
                                <Icon
                                    data={iconClearActionParams}
                                    size={16}
                                    className={b('icon-filter-clear')}
                                />
                            </Button>
                        </div>
                    </div>
                )}
                {showFloatControls && (
                    <React.Fragment>
                        <Loader
                            visible={showContentLoader}
                            compact={headerWithControlsProps.compactLoader}
                            veil={showLoaderVeil}
                            delay={headerWithControlsProps.loaderDelay}
                        />
                        <ChartHeader
                            dataProvider={headerWithControlsProps.dataProvider}
                            chartsInsightsData={headerWithControlsProps.loadedData?.chartsInsightsData}
                            menuType={headerWithControlsProps.menuType}
                            customMenuOptions={{} as unknown as ChartProviderPropsWithRefProps['customMenuOptions']}
                            menuChartkitConfig={headerWithControlsProps.menuChartkitConfig}
                            isMenuAvailable={!noControls}
                            error={headerWithControlsProps.error || null}
                            dataProps={headerWithControlsProps.dataProps}
                            requestId={headerWithControlsProps.requestId || ''}
                            loadedData={headerWithControlsProps.loadedData}
                            widgetDataRef={headerWithControlsProps.widgetDataRef}
                            widgetRenderTimeRef={headerWithControlsProps.widgetRenderTimeRef}
                            yandexMapAPIWaiting={headerWithControlsProps.yandexMapAPIWaiting}
                            onChange={headerWithControlsProps.onChange}
                            isWidgetMenuDataChanged={headerWithControlsProps.isWidgetMenuDataChanged}
                            onExportLoading={handleExportLoading}
                            enableActionParams={headerWithControlsProps.enableActionParams}
                            onFullscreenClick={onFullscreenClick}
                            showActionParamsFilter={showActionParamsFilter}
                            onFiltersClear={onFiltersClear}
                            showFilters={true}
                        />
                    </React.Fragment>
                )}
            </div>
        </React.Fragment>
    );
};
