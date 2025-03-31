import { NgModule } from '@angular/core';
import { NgWidgetPlaceholder } from './components/NgWidgetPlaceholder';
import { NgWidget } from './directives/NgWidget';
import { NgWidgetContainer } from './directives/NgWidgetContainer';

@NgModule({
    imports: [],
    declarations: [NgWidgetPlaceholder, NgWidget, NgWidgetContainer],
    exports: [NgWidgetPlaceholder, NgWidgetContainer, NgWidget] // Ensure all are exported
})
export class NgDraggableWidgetModule { }
