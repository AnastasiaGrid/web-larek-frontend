import {Component} from "../base/Component";
import {IEvents} from "../base/events";
import {ensureElement} from "../../utils/utils";
import { IFormState, TFormName, TOrderUserData } from "../../types";




export class Form extends Component<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;
    protected events: IEvents;

    constructor(protected container: HTMLFormElement, events: IEvents) {
        super(container);
        this.events = events
        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);


        this.container.addEventListener('input', (e: Event) => {             
            const target = e.target as HTMLInputElement;
            const field = target.name;
            const value = target.value;
            this.onInputChange(field as keyof TOrderUserData, value);    
        });
        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();                        
            this.events.emit(`${this.container.name}:submit`);
        });
    }
    protected onInputChange(field: keyof TOrderUserData, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, ({
            field: field as keyof TOrderUserData,
            value,
            formName: this.container.name as TFormName,
        }));
    }

    set valid(value: boolean) {
        this.setDisabled(this._submit, !value)
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    render() {
        return this.container;

    }
    clearForm() {
        this.container.reset()
        this.valid = false
    }
}