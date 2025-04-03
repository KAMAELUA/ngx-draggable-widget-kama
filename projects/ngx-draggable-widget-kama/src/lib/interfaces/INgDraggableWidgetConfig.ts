import {ElementRef, ViewContainerRef} from '@angular/core';

export interface INgWidgetContainerConfig {
    margins?: number[];
    draggable?: boolean;
    resizable?: boolean;
    max_cols?: number;
    max_rows?: number;
    visible_cols?: number;
    visible_rows?: number;
    min_cols?: number;
    min_rows?: number;
    col_width?: number;
    row_height?: number;
    cascade?: string;
    min_width?: number;
    min_height?: number;
    fix_to_grid?: boolean;
    auto_style?: boolean;
    auto_resize?: boolean;
    maintain_ratio?: boolean;
    prefer_new?: boolean;
    zoom_on_drag?: boolean;
    limit_to_screen?: boolean;
    allow_overlap?: boolean;
    widget_width_factor?: number;
    widget_height_factor?: number;
    debug?: boolean;
}

export interface INgWidgetConfig {
    payload?: any;
    col?: number;
    row?: number;
    sizex?: number;
    sizey?: number;
    dragHandle?: string;
    resizeHandle?: string;
    fixed?: boolean;
    draggable?: boolean;
    resizable?: boolean;
    borderSize?: number;
    maxCols?: number;
    minCols?: number;
    maxRows?: number;
    minRows?: number;
    minWidth?: number;
    minHeight?: number;
    unitx?: number;
    unity?: number;
    debug?: false;
}

export interface INgWidgetEvent {
    payload: any;
    col: number;
    row: number;
    sizex: number;
    sizey: number;
    width: number;
    height: number;
    left: number;
    top: number;
}

export interface INgWidgetSize {
    x: number;
    y: number;
}

export interface INgWidgetPosition {
    col: number;
    row: number;
}

export interface INgWidgetContainerRawPosition {
    left: number;
    top: number;
}

export interface INgWidgetDimensions {
    width: number;
    height: number;
    z_index: number;
}

export interface INgWidgetPlaceholder {
    registerGrid(ngGrid: INgWidgetContainer): void;

    setSize(newSize: INgWidgetSize): void;

    setGridPosition(newPosition: INgWidgetPosition): void;

    setCascadeMode(cascade: string): void;
}

export interface INgWidgetContainer {
    colWidth: number;
    rowHeight: number;
    minCols: number;
    minRows: number;
    marginTop: number;
    marginRight: number;
    marginBottom: number;
    marginLeft: number;
    isDragging: boolean;
    isResizing: boolean;
    autoStyle: boolean;
    resizeEnable: boolean;
    dragEnable: boolean;
    cascade: string;
    minWidth: number;
    minHeight: number;
    zIndex: number;
    allowOverlap: boolean;
    widget_width_factor: number;
    widget_height_factor: number;

    config: INgWidgetContainerConfig;

    getConfig(): INgWidgetContainerConfig;

    setConfig(config: INgWidgetContainerConfig): void;

    getItemPosition(index: number): INgWidgetPosition;

    getItemSize(index: number): INgWidgetSize;

    setMargins(margins: Array<string>): void;

    enableDrag(): void;

    disableDrag(): void;

    enableResize(): void;

    disableResize(): void;

    addItem(ngItem: INgWidget): void;

    removeItem(ngItem: INgWidget): void;

    updateItem(ngWidget: INgWidget): void;

    triggerCascade(): void;

    triggerResize(): void;
}

export interface INgWidget {
    isFixed: boolean;
    isDraggable: boolean;
    isResizable: boolean;
    minWidth: number;
    minHeight: number;

    config: INgWidgetConfig;

    sizex: number;
    sizey: number;
    col: number;
    row: number;
    currentCol: number;
    currentRow: number;

    containerRef: ViewContainerRef;

    canDrag(e: any): boolean;

    findHandle(handleSelector: string, startElement: HTMLElement): boolean;

    canResize(e: any): string;

    getResizeDirection(e: MouseEvent): string;

    getElement(): ElementRef;

    getDragHandle(): string;

    getResizeHandle(): string;

    getDimensions(): INgWidgetDimensions;

    getSize(): INgWidgetSize;

    getPosition(): INgWidgetContainerRawPosition;

    getWidgetPosition(): INgWidgetPosition;

    getWidgetDragStartPosition(): INgWidgetPosition;

    setWidgetDragStartPosition(position: INgWidgetPosition): void;

    setConfig(config: INgWidgetConfig): void;

    setSize(newSize: INgWidgetSize, update?: boolean): void;

    setGridPosition(widgetPosition: INgWidgetPosition, update?: boolean): void;

    getEventOutput(): INgWidgetEvent;

    setPosition(x: number, y: number): void;

    setCascadeMode(cascade: string): void;

    setDimensions(w: number, h: number): void;

    startMoving(): void;

    stopMoving(): void;

    fixResize(newSize: INgWidgetSize): INgWidgetSize;

    recalculateSelf(): void;

    onCascadeEvent(): void;

    onDragStopEvent(): void;

    onDragEvent(): void;

    onResizeStopEvent(): void;

    onMouseMove(e: any): void;

    onResizeEvent(): void;

    onResizeStartEvent(): void;

    onDragStartEvent(): void;
}
