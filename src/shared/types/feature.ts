export enum Feature {
    ChartkitAlerts = 'chartkitAlerts',
    UseConfigurableChartkit = 'UseConfigurableChartkit',
    Ql = 'ql',
    HideOldRelations = 'hideOldRelations',
    AsideHeaderEnabled = 'AsideHeaderEnabled',
    /** Enable redesign of dash controls */
    DashFloatControls = 'DashFloatControls',
    FieldEditorDocSection = 'FieldEditorDocSection',
    UsePublicDistincts = 'UsePublicDistincts',
    EnablePublishEntry = 'EnablePublishEntry',
    EnableChartEditorDocs = 'EnableChartEditorDocs',
    EnableSaveAsEditorScript = 'EnableSaveAsEditorScript',
    EnableCustomMonitoring = 'EnableCustomMonitoring',
    EnableDashChartStat = 'EnableDashChartStat',
    EnableAutocreateDataset = 'EnableAutocreateDataset',
    ShowCreateEntryWithMenu = 'ShowCreateEntryWithMenu',
    RevisionsListNoLimit = 'RevisionsListNoLimit',
    UseNavigation = 'UseNavigation',
    AuthUpdateWithTimeout = 'AuthUpdateWithTimeout',
    UseComponentHeader = 'UseComponentHeader',
    FetchDocumentation = 'FetchDocumentation',
    Comments = 'Comments',
    EmptySelector = 'emptySelector',
    ChartEditorDeveloperModeCheck = 'ChartEditorDeveloperModeCheck',
    QLPrometheus = 'QLPrometheus',
    QLMonitoring = 'QLMonitoring',
    CollectionsEnabled = 'CollectionsEnabled',
    CollectionsAccessEnabled = 'CollectionsAccessEnabled',
    DashBoardAccessDescription = 'DashBoardAccessDescription',
    DashBoardSupportDescription = 'DashBoardSupportDescription',
    DashAutorefresh = 'DashAutorefresh',
    GSheetsV2Enabled = 'GSheetsV2Enabled',
    ShowInspectorDetails = 'ShowInspectorDetails',
    NoJsonFn = 'NoJsonFn',
    GSheetGoogleAuthEnabled = 'GSheetGoogleAuthEnabled',
    DatasetsRLS = 'DatasetsRLS',
    XlsxFilesEnabled = 'XlsxFilesEnabled',
    XlsxChartExportEnabled = 'XlsxChartExportEnabled',
    GroupControls = 'GroupControls',
    EscapeUserHtmlInDefaultHcTooltip = 'EscapeUserHtmlInDefaultHcTooltip',
    HolidaysOnChart = 'HolidaysOnChart',
    ReadOnlyMode = 'ReadOnlyMode',
    MenuItemsFlatView = 'MenuItemsFlatView',
    EntryMenuItemCopy = 'EntryMenuItemCopy',
    EntryMenuItemMove = 'EntryMenuItemMove',
    EntryMenuEditor = 'EntryMenuEditor',
    ExternalSelectors = 'ExternalSelectors',
    DashBoardWidgetParamsStrictValidation = 'DashBoardWidgetParamsStrictValidation',
    D3Visualizations = 'D3Visualizations',
    HideMultiDatasets = 'HideMultiDatasets',
    ShouldCheckEditorAccess = 'ShouldCheckEditorAccess',
    HideMultitenant = 'HideMultitenant',
    EnableMobileHeader = 'EnableMobileHeader',
    UseYqlFolderKey = 'UseYqlFolderKey',
    UseGrpcOptions = 'UseGrpcOptions',
    ShowChartsEngineDebugInfo = 'ShowChartsEngineDebugInfo',
    UseChartsEngineResponseConfig = 'UseChartsEngineResponseConfig',
    UseChartsEngineLogin = 'UseChartsEngineLogin',
    CopyEntriesToWorkbook = 'CopyEntriesToWorkbook',
    QlAutoExecuteMonitoringChart = 'QlAutoExecuteMonitoringChart',
    MultipleColorsInVisualization = 'MultipleColorsInVisualization',
    ConnectionBasedControl = 'ConnectionBasedControl',
    EnableServerlessEditor = 'EnableServerlessEditor',
    ChartWithFnLogging = 'ChartWithFnLogging',
    EnableFooter = 'EnableFooter',
    MassRemoveCollectionsWorkbooks = 'MassRemoveCollectionsWorkbooks',
    /* Enable dashboard fixed header */
    EnableDashFixedHeader = 'EnableDashFixedHeader',
    EnableEmbedsInDialogShare = 'EnableEmbedsInDialogShare',
    EnableEntryMenuItemShare = 'EnableEntryMenuItemShare',
    NewTableWidgetForCE = 'NewTableWidgetForCE',
    /** Use BI data for connector icons rendering (connections, ql, workbooks, navigation) */
    EnableBIConnectorIcons = 'EnableBIConnectorIcons',
    /** Enable undo/redo buttons & hotkeys in ql */
    EnableEditHistoryQL = 'EnableEditHistoryQL',
    /** Depends on US feature UseMovePermAction.
     * It checks admin permission for move entries instead of edit permission.
     */
    UseMovePermAction = 'UseMovePermAction',
    /** An empty chart for drawing something unusual */
    BlankChart = 'BlankChart',
}

export type FeatureConfig = Record<string, boolean>;
