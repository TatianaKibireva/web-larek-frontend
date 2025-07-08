/**
 * Базовый компонент. Component - это View (Представление) в паттерне MVC/MVP/MVVM.
 * Его задача — отображать данные (из Model) и обрабатывать пользовательские события
 *  (передавая их в Presenter/ViewModel).
 */
export abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {
		// Учитывайте что код в конструкторе исполняется ДО всех объявлений в дочернем классе
		// компонент принимает container, который сохранен защищенное свойство класса
		//
	}

	// Инструментарий для работы с DOM в дочерних компонентах

	// Переключить класс
	toggleClass(element: HTMLElement, className: string, force?: boolean) {
		element.classList.toggle(className, force);
	}

	// Установить текстовое содержимое
	protected setText(element: HTMLElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}

	// Сменить статус блокировки
	setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}

	// Скрыть
	protected setHidden(element: HTMLElement) {
		element.style.display = 'none';
	}

	// Показать
	protected setVisible(element: HTMLElement) {
		element.style.removeProperty('display');
	}

	// Установить изображение с алтернативным текстом
	protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
			element.src = src;
			if (alt) {
				element.alt = alt;
			}
		}
	}

	getContainer(): HTMLElement {
		return this.container;
	}

	// Вернуть корневой DOM-элемент
	// возвращать будем результат рендера с помощью функции render,
	// которая получает опционально данные и если эти даннеые есть,
	// она попытается установить их в объект
	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}
