import {
    INgWidgetConfig,
    INgWidgetEvent,
    INgWidgetPosition,
    INgWidgetSize,
    INgWidgetContainerRawPosition,
    INgWidgetDimensions,
    INgWidget
} from '../interfaces/INgDraggableWidgetConfig';
import {
    Directive,
    ElementRef,
    EventEmitter,
    KeyValueDiffer,
    KeyValueDiffers,
    OnInit,
    OnDestroy,
    DoCheck,
    ViewContainerRef,
    Output, Input, Renderer2
} from '@angular/core';
import {NgWidgetContainer} from './NgWidgetContainer';

/**
 *    inputs array instead of @input decorator for ionic compatibility
 */
@Directive({
    selector: '[ngWidget]',
    // inputs: ['config: ngWidget']
})
export class NgWidget implements OnInit, OnDestroy, DoCheck, INgWidget {
    private static CONST_DEFAULT_CONFIG: INgWidgetConfig = {
        col: 1,
        row: 1,
        sizex: 1,
        sizey: 1,
        dragHandle: null,
        resizeHandle: null,
        fixed: false,
        draggable: true,
        resizable: true,
        borderSize: 25,
        unitx: 0,
        unity: 0,
        debug: false
    };
    // 	event Emitters
    @Output() public onItemChange: EventEmitter<INgWidgetEvent> = new EventEmitter<INgWidgetEvent>(false);
    @Output() public onDragStart: EventEmitter<INgWidgetEvent> = new EventEmitter<INgWidgetEvent>();
    @Output() public onDrag: EventEmitter<INgWidgetEvent> = new EventEmitter<INgWidgetEvent>();
    @Output() public onDragStop: EventEmitter<INgWidgetEvent> = new EventEmitter<INgWidgetEvent>();
    @Output() public onDragAny: EventEmitter<INgWidgetEvent> = new EventEmitter<INgWidgetEvent>();
    @Output() public onResizeStart: EventEmitter<INgWidgetEvent> = new EventEmitter<INgWidgetEvent>();
    @Output() public onResize: EventEmitter<INgWidgetEvent> = new EventEmitter<INgWidgetEvent>();
    @Output() public onResizeStop: EventEmitter<INgWidgetEvent> = new EventEmitter<INgWidgetEvent>();
    @Output() public onResizeAny: EventEmitter<INgWidgetEvent> = new EventEmitter<INgWidgetEvent>();
    @Output() public onChangeStart: EventEmitter<INgWidgetEvent> = new EventEmitter<INgWidgetEvent>();
    @Output() public onChange: EventEmitter<INgWidgetEvent> = new EventEmitter<INgWidgetEvent>();
    @Output() public onChangeStop: EventEmitter<INgWidgetEvent> = new EventEmitter<INgWidgetEvent>();
    @Output() public onChangeAny: EventEmitter<INgWidgetEvent> = new EventEmitter<INgWidgetEvent>();
    @Output() public ngWidgetChange: EventEmitter<INgWidgetConfig> = new EventEmitter<INgWidgetConfig>();

    // 	default config


    public isFixed = false;
    public isDraggable = true;
    public isResizable = true;
    public minWidth = 0;
    public minHeight = 0;

    // 	private variables
    private _payload: any;
    private _currentPosition: INgWidgetPosition = {col: 1, row: 1};
    private _size: INgWidgetSize = {x: 1, y: 1};
    private _config: INgWidgetConfig = NgWidget.CONST_DEFAULT_CONFIG;
    private _dragHandle: string | null = null;
    private _resizeHandle: string | null = null;
    private _borderSize: number = 0;
    private _elemWidth: number = 0;
    private _elemHeight: number = 0;
    private _elemLeft: number = 0;
    private _elemTop: number = 0;
    private _added: boolean = false;
    private _differ: KeyValueDiffer<string, any> | null = null;
    private _cascadeMode: string = '';
    private _maxCols: number = 0;
    private _minCols: number = 0;
    private _maxRows: number = 0;
    private _minRows: number = 0;
    private _dragStartPosition: INgWidgetPosition = {col: 1, row: 1};
    private _z_index: number = 0;

    private debugLog(...optionalParams: any[]): void {
        if (this._config.debug) {
            console.log(...optionalParams);
        }
    }

    // 	[ng-widget] handler
    @Input('ngWidget')
    set config(v: INgWidgetConfig) {
        const defaults = NgWidget.CONST_DEFAULT_CONFIG;

        for (const x in defaults) {
            if (!v[x]) {
                v[x] = defaults[x];
            }
        }

        this.setConfig(v);

        if (this._differ == null && v != null) {
            this._differ = this._differs.find(this._config).create();
        }

        if (!this._added) {
            this._added = true;
            this._ngWidgetContainer.addItem(this);
        }

        this._recalculateDimensions();
        this._recalculatePosition();
    }

    get sizex(): number {
        return this._size.x;
    }

    get sizey(): number {
        return this._size.y;
    }

    get col(): number {
        return this._currentPosition.col;
    }

    get row(): number {
        return this._currentPosition.row;
    }

    get currentCol(): number {
        return this._currentPosition.col;
    }

    get currentRow(): number {
        return this._currentPosition.row;
    }

    // 	constructor
    constructor(private _differs: KeyValueDiffers, private _ngEl: ElementRef, private _renderer2: Renderer2,
                private _ngWidgetContainer: NgWidgetContainer, public containerRef: ViewContainerRef) {
    }

    public onResizeStartEvent(): void {
        const event: INgWidgetEvent = this.getEventOutput();
        this._z_index = ++this._ngWidgetContainer.zIndex;
        this._renderer2.setStyle(this._ngEl.nativeElement, 'z-index', String(this._z_index));
        this.onResizeStart.emit(event);
        this.onResizeAny.emit(event);
        this.onChangeStart.emit(event);
        this.onChangeAny.emit(event);
    }

    public onResizeEvent(): void {
        const event: INgWidgetEvent = this.getEventOutput();
        this.onResize.emit(event);
        this.onResizeAny.emit(event);
        this.onChange.emit(event);
        this.onChangeAny.emit(event);
    }

    public onResizeStopEvent(): void {
        const event: INgWidgetEvent = this.getEventOutput();
        this.onResizeStop.emit(event);
        this.onResizeAny.emit(event);
        this.onChangeStop.emit(event);
        this.onChangeAny.emit(event);

        this._config.sizex = this._size.x;
        this._config.sizey = this._size.y;
        this.ngWidgetChange.emit(this._config);
    }

    public onDragStartEvent(): void {
        const event: INgWidgetEvent = this.getEventOutput();
        this._z_index = ++this._ngWidgetContainer.zIndex;
        this._renderer2.setStyle(this._ngEl.nativeElement, 'z-index', String(this._z_index));
        this.onDragStart.emit(event);
        this.onDragAny.emit(event);
        this.onChangeStart.emit(event);
        this.onChangeAny.emit(event);
    }

    public onDragEvent(): void {
        const event: INgWidgetEvent = this.getEventOutput();
        this.onDrag.emit(event);
        this.onDragAny.emit(event);
        this.onChange.emit(event);
        this.onChangeAny.emit(event);
    }

    public onDragStopEvent(): void {
        const event: INgWidgetEvent = this.getEventOutput();
        this.onDragStop.emit(event);
        this.onDragAny.emit(event);
        this.onChangeStop.emit(event);
        this.onChangeAny.emit(event);

        this._config.col = this._currentPosition.col;
        this._config.row = this._currentPosition.row;
        this.ngWidgetChange.emit(this._config);
    }

    public onCascadeEvent(): void {
        this._config.sizex = this._size.x;
        this._config.sizey = this._size.y;
        this._config.col = this._currentPosition.col;
        this._config.row = this._currentPosition.row;
        this.ngWidgetChange.emit(this._config);
    }

    public ngOnInit(): void {
        this.debugLog('ngOnInit');
        this._renderer2.addClass(this._ngEl.nativeElement, 'widget');
        if (this._ngWidgetContainer.autoStyle) {
            this._renderer2.setStyle(this._ngEl.nativeElement, 'position', 'absolute');
        }
        this._recalculateDimensions();
        this._recalculatePosition();

        if (!this._added) {
            this._added = true;
            this._ngWidgetContainer.addItem(this);
        }
    }

    // 	public methods
    public canDrag(e: any): boolean {
        if (!this.isDraggable) {
            return false;
        }

        if (this._dragHandle) {
            return this.findHandle(this._dragHandle, e.target);
        }

        return true;
    }

    public findHandle(handleSelector: string, startElement: HTMLElement): boolean {
        try {
            let targetElem: any = startElement;

            while (targetElem && targetElem !== this._ngEl.nativeElement) {
                if (this.elementMatches(targetElem, handleSelector)) {
                    return true;
                }

                targetElem = targetElem.parentElement;
            }

        } catch (err) {
        }

        return false;
    }

    public canResize(e: any): string {
        this.debugLog('isResizable,_resizeHandle,_borderSize', this.isResizable, this._resizeHandle, this._borderSize);
        if (!this.isResizable) {
            return null;
        }

        if (this._resizeHandle) {
            return this.findHandle(this._resizeHandle, e.target) ? 'both' : null;
        }

        if (this._borderSize <= 0) {
            return null;
        }

        return this.getResizeDirection(e);
    }

    public getResizeDirection(e: MouseEvent): string {
        const mousePos: INgWidgetContainerRawPosition = this._getMousePosition(e);

        if (mousePos.left < this._elemWidth && mousePos.left > this._elemWidth - this._borderSize
            && mousePos.top < this._elemHeight && mousePos.top > this._elemHeight - this._borderSize) {
            return 'both';
        } else if (mousePos.left < this._elemWidth && mousePos.left > this._elemWidth - this._borderSize) {
            return 'width';
        } else if (mousePos.top < this._elemHeight && mousePos.top > this._elemHeight - this._borderSize) {
            return 'height';
        } else {
            return null;
        }
    }

    public onMouseMove(e: any): void {
        if (this._ngWidgetContainer.autoStyle) {
            if (this._ngWidgetContainer.resizeEnable && !this._resizeHandle && this.isResizable) {
                const mousePos: INgWidgetContainerRawPosition = this._getMousePosition(e);
                if (mousePos.left < this._elemWidth && mousePos.left > this._elemWidth - this._borderSize
                    && mousePos.top < this._elemHeight && mousePos.top > this._elemHeight - this._borderSize) {
                    this._renderer2.setStyle(this._ngEl.nativeElement, 'cursor', 'nwse-resize');
                } else if (mousePos.left < this._elemWidth && mousePos.left > this._elemWidth - this._borderSize) {
                    this._renderer2.setStyle(this._ngEl.nativeElement, 'cursor', 'ew-resize');
                } else if (mousePos.top < this._elemHeight && mousePos.top > this._elemHeight - this._borderSize) {
                    this._renderer2.setStyle(this._ngEl.nativeElement, 'cursor', 'ns-resize');
                } else if (this._ngWidgetContainer.dragEnable && this.canDrag(e)) {
                    this._renderer2.setStyle(this._ngEl.nativeElement, 'cursor', 'move');
                } else {
                    this._renderer2.setStyle(this._ngEl.nativeElement, 'cursor', 'default');
                }
            } else if (this._ngWidgetContainer.resizeEnable && this.canResize(e)) {
                this._renderer2.setStyle(this._ngEl.nativeElement, 'cursor', 'nwse-resize');
            } else if (this._ngWidgetContainer.dragEnable && this.canDrag(e)) {
                this._renderer2.setStyle(this._ngEl.nativeElement, 'cursor', 'move');
            } else {
                this._renderer2.setStyle(this._ngEl.nativeElement, 'cursor', 'default');
            }
        }
    }

    public ngOnDestroy(): void {
        if (this._added) {
            this._ngWidgetContainer.removeItem(this);
        }
    }

    // 	getters
    public getElement(): ElementRef {
        return this._ngEl;
    }

    public getDragHandle(): string | null {
        return this._dragHandle;
    }

    public getResizeHandle(): string | null {
        return this._resizeHandle;
    }

    public getDimensions(): INgWidgetDimensions {
        return {'width': this._elemWidth, 'height': this._elemHeight, 'z_index': this._z_index};
    }

    public getSize(): INgWidgetSize {
        return this._size;
    }

    public getPosition(): INgWidgetContainerRawPosition {
        return {'left': this._elemLeft, 'top': this._elemTop};
    }

    public getWidgetPosition(): INgWidgetPosition {
        return this._currentPosition;
    }

    public getWidgetDragStartPosition(): INgWidgetPosition {
        return this._dragStartPosition;
    }

    // 	setters
    public setWidgetDragStartPosition(position: INgWidgetPosition) {
        this._dragStartPosition = position;
    }

    public setConfig(config: INgWidgetConfig): void {
        if (config.debug) {
            this.debugLog('setConfig', config);
        }
        this._config = config;

        this._payload = config.payload;
        this._currentPosition.col = config.col || NgWidget.CONST_DEFAULT_CONFIG.col;
        this._currentPosition.row = config.row || NgWidget.CONST_DEFAULT_CONFIG.row;

        if (!this._added && ((this._ngWidgetContainer.getConfig().widget_width_factor && config.unitx) != null)) {
            this._size.x = this._ngWidgetContainer.widget_width_factor * config.unitx;
            this.debugLog(this._size.x, this._ngWidgetContainer.widget_width_factor * config.unitx);
        } else {
            this._size.x = config.sizex || NgWidget.CONST_DEFAULT_CONFIG.sizex;
        }

        if (!this._added && ((this._ngWidgetContainer.getConfig().widget_height_factor && config.unity) != null)) {
            this._size.y = this._ngWidgetContainer.widget_height_factor * config.unity;
        } else {
            this._size.y = config.sizey || NgWidget.CONST_DEFAULT_CONFIG.sizey;
        }

        this._dragHandle = config.dragHandle;
        this._resizeHandle = config.resizeHandle;
        this._borderSize = config.borderSize;
        this.isDraggable = !!config.draggable;
        this.isResizable = !!config.resizable;
        this.isFixed = !!config.fixed;

        this._maxCols = !isNaN(config.maxCols) && isFinite(config.maxCols) ? config.maxCols : 0;
        this._minCols = !isNaN(config.minCols) && isFinite(config.minCols) ? config.minCols : 0;
        this._maxRows = !isNaN(config.maxRows) && isFinite(config.maxRows) ? config.maxRows : 0;
        this._minRows = !isNaN(config.minRows) && isFinite(config.minRows) ? config.minRows : 0;

        this.minWidth = !isNaN(config.minWidth) && isFinite(config.minWidth) ? config.minWidth : 0;
        this.minHeight = !isNaN(config.minHeight) && isFinite(config.minHeight) ? config.minHeight : 0;

        if (this._minCols > 0 && this._maxCols > 0 && this._minCols > this._maxCols) {
            this._minCols = 0;
        }
        if (this._minRows > 0 && this._maxRows > 0 && this._minRows > this._maxRows) {
            this._minRows = 0;
        }

        if (this._added) {
            this._ngWidgetContainer.updateItem(this);
        }

        this._size = this.fixResize(this._size);

        this._recalculatePosition();
        this._recalculateDimensions();
    }

    public ngDoCheck(): boolean {
        if (this._differ != null) {
            const changes: any = this._differ.diff(this._config);

            if (changes != null) {
                this.debugLog('ngDoCheck -> NgWidget');
                this._applyChanges(changes);

                return true;
            }
        }

        return false;
    }

    public setSize(newSize: INgWidgetSize, update: boolean = true): void {
        newSize = this.fixResize(newSize);
        this._size = newSize;
        if (update) {
            this._recalculateDimensions();
        }

        this.onItemChange.emit(this.getEventOutput());
    }

    public setGridPosition(widgetPosition: INgWidgetPosition, update: boolean = true): void {
        this.debugLog('widget -> setGridPosition', widgetPosition);
        this._currentPosition = widgetPosition;
        if (update) {
            this._recalculatePosition();
        }

        this.onItemChange.emit(this.getEventOutput());
    }

    public getEventOutput(): INgWidgetEvent {
        return <INgWidgetEvent>{
            payload: this._payload,
            col: this._currentPosition.col,
            row: this._currentPosition.row,
            sizex: this._size.x,
            sizey: this._size.y,
            width: this._elemWidth,
            height: this._elemHeight,
            left: this._elemLeft,
            top: this._elemTop
        };
    }

    public setPosition(x: number, y: number): void {
        switch (this._cascadeMode) {
            case 'up':
            case 'left':
            default:
                this._renderer2.setStyle(this._ngEl.nativeElement, 'left', x + 'px');
                this._renderer2.setStyle(this._ngEl.nativeElement, 'top', y + 'px');
                break;
            case 'right':
                this._renderer2.setStyle(this._ngEl.nativeElement, 'right', x + 'px');
                this._renderer2.setStyle(this._ngEl.nativeElement, 'top', y + 'px');
                break;
            case 'down':
                this._renderer2.setStyle(this._ngEl.nativeElement, 'left', x + 'px');
                this._renderer2.setStyle(this._ngEl.nativeElement, 'bottom', y + 'px');
                break;
        }

        this._elemLeft = x;
        this._elemTop = y;
    }

    public setCascadeMode(cascade: string): void {
        this._cascadeMode = cascade;
        switch (cascade) {
            case 'up':
            case 'left':
            default:
                this._renderer2.setStyle(this._ngEl.nativeElement, 'left', this._elemLeft + 'px');
                this._renderer2.setStyle(this._ngEl.nativeElement, 'top', this._elemTop + 'px');
                this._renderer2.removeStyle(this._ngEl.nativeElement, 'right');
                this._renderer2.removeStyle(this._ngEl.nativeElement, 'bottom');
                break;
            case 'right':
                this._renderer2.setStyle(this._ngEl.nativeElement, 'right', this._elemLeft + 'px');
                this._renderer2.setStyle(this._ngEl.nativeElement, 'top', this._elemTop + 'px');
                this._renderer2.removeStyle(this._ngEl.nativeElement, 'left');
                this._renderer2.removeStyle(this._ngEl.nativeElement, 'bottom');
                break;
            case 'down':
                this._renderer2.setStyle(this._ngEl.nativeElement, 'left', this._elemLeft + 'px');
                this._renderer2.setStyle(this._ngEl.nativeElement, 'bottom', this._elemTop + 'px');
                this._renderer2.removeStyle(this._ngEl.nativeElement, 'right');
                this._renderer2.removeStyle(this._ngEl.nativeElement, 'top');
                break;
        }
    }

    public setDimensions(w: number, h: number): void {
        if (w < this.minWidth) {
            w = this.minWidth;
        }
        if (h < this.minHeight) {
            h = this.minHeight;
        }

        this._renderer2.setStyle(this._ngEl.nativeElement, 'width', w + 'px');
        this._renderer2.setStyle(this._ngEl.nativeElement, 'height', h + 'px');

        this._elemWidth = w;
        this._elemHeight = h;
    }

    public startMoving(): void {
        this._renderer2.addClass(this._ngEl.nativeElement, 'moving');
        const style: any = window.getComputedStyle(this._ngEl.nativeElement);
        if (this._ngWidgetContainer.autoStyle) {
            this._z_index = (parseInt(style.getPropertyValue('z-index'), 10) + 1);
            this._renderer2.setStyle(this._ngEl.nativeElement, 'z-index', this._z_index.toString());
        }
    }

    public stopMoving(): void {
        this._renderer2.removeClass(this._ngEl.nativeElement, 'moving');
        const style: any = window.getComputedStyle(this._ngEl.nativeElement);
        if (this._ngWidgetContainer.autoStyle) {
            this._z_index = (parseInt(style.getPropertyValue('z-index'), 10) - 1);
            this._renderer2.setStyle(this._ngEl.nativeElement, 'z-index', this._z_index.toString());
        }
    }

    public recalculateSelf(): void {
        this._recalculatePosition();
        this._recalculateDimensions();
    }

    public fixResize(newSize: INgWidgetSize): INgWidgetSize {
        if (this._maxCols > 0 && newSize.x > this._maxCols) {
            newSize.x = this._maxCols;
        }
        if (this._maxRows > 0 && newSize.y > this._maxRows) {
            newSize.y = this._maxRows;
        }

        if (this._minCols > 0 && newSize.x < this._minCols) {
            newSize.x = this._minCols;
        }
        if (this._minRows > 0 && newSize.y < this._minRows) {
            newSize.y = this._minRows;
        }

        const itemWidth = (newSize.x * this._ngWidgetContainer.colWidth) + ((this._ngWidgetContainer.marginLeft + this._ngWidgetContainer.marginRight) * (newSize.x - 1));
        if (itemWidth < this.minWidth) {
            newSize.x = Math.round(Math.ceil((this.minWidth + this._ngWidgetContainer.marginRight + this._ngWidgetContainer.marginLeft) / (this._ngWidgetContainer.colWidth + this._ngWidgetContainer.marginRight + this._ngWidgetContainer.marginLeft)));
        }

        const itemHeight = (newSize.y * this._ngWidgetContainer.rowHeight) + ((this._ngWidgetContainer.marginTop + this._ngWidgetContainer.marginBottom) * (newSize.y - 1));
        if (itemHeight < this.minHeight) {
            newSize.y = Math.round(Math.ceil((this.minHeight + this._ngWidgetContainer.marginBottom + this._ngWidgetContainer.marginTop) / (this._ngWidgetContainer.rowHeight + this._ngWidgetContainer.marginBottom + this._ngWidgetContainer.marginTop)));
        }

        return newSize;
    }

    // 	private methods
    private elementMatches(element: any, selector: string): boolean {
        if (!element) {
            return false;
        }
        if (element.matches) {
            return element.matches(selector);
        }
        if (element.oMatchesSelector) {
            return element.oMatchesSelector(selector);
        }
        if (element.msMatchesSelector) {
            return element.msMatchesSelector(selector);
        }
        if (element.mozMatchesSelector) {
            return element.mozMatchesSelector(selector);
        }
        if (element.webkitMatchesSelector) {
            return element.webkitMatchesSelector(selector);
        }

        if (!element.document || !element.ownerDocument) {
            return false;
        }

        const matches: any = (element.document || element.ownerDocument).querySelectorAll(selector);
        let i: number = matches.length;
        while (--i >= 0 && matches.item(i) !== element) {
        }
        return i > -1;
    }

    private _recalculatePosition(): void {
        const x: number = (this._ngWidgetContainer.colWidth + this._ngWidgetContainer.marginLeft + this._ngWidgetContainer.marginRight) * (this._currentPosition.col - 1) + this._ngWidgetContainer.marginLeft;
        const y: number = (this._ngWidgetContainer.rowHeight + this._ngWidgetContainer.marginTop + this._ngWidgetContainer.marginBottom) * (this._currentPosition.row - 1) + this._ngWidgetContainer.marginTop;

        this.setPosition(x, y);
    }

    private _recalculateDimensions(): void {
        if (this._size.x < this._ngWidgetContainer.minCols) {
            this._size.x = this._ngWidgetContainer.minCols;
        }
        if (this._size.y < this._ngWidgetContainer.minRows) {
            this._size.y = this._ngWidgetContainer.minRows;
        }

        const newWidth: number = (this._ngWidgetContainer.colWidth * this._size.x) + ((this._ngWidgetContainer.marginLeft + this._ngWidgetContainer.marginRight) * (this._size.x - 1));
        const newHeight: number = (this._ngWidgetContainer.rowHeight * this._size.y) + ((this._ngWidgetContainer.marginTop + this._ngWidgetContainer.marginBottom) * (this._size.y - 1));

        const w: number = Math.max(this.minWidth, this._ngWidgetContainer.minWidth, newWidth);
        const h: number = Math.max(this.minHeight, this._ngWidgetContainer.minHeight, newHeight);

        this.setDimensions(w, h);
    }

    private _getMousePosition(e: any): INgWidgetContainerRawPosition {
        if (e.originalEvent && e.originalEvent.touches) {
            const oe: any = e.originalEvent;
            e = oe.touches.length ? oe.touches[0] : (oe.changedTouches.length ? oe.changedTouches[0] : e);
        } else if (e.touches) {
            e = e.touches.length ? e.touches[0] : (e.changedTouches.length ? e.changedTouches[0] : e);
        }

        const refPos: INgWidgetContainerRawPosition = this._ngEl.nativeElement.getBoundingClientRect();

        return {
            left: e.clientX - refPos.left,
            top: e.clientY - refPos.top
        };
    }

    private _applyChanges(changes: any): void {
        changes.forEachAddedItem((record: any) => {
            this._config[record.key] = record.currentValue;
        });
        changes.forEachChangedItem((record: any) => {
            this._config[record.key] = record.currentValue;
        });
        changes.forEachRemovedItem((record: any) => {
            delete this._config[record.key];
        });

        this.setConfig(this._config);
    }
}
