import { FormArray, FormControl, ValidatorFn } from '@angular/forms';

export function minSelectedCheckboxesValidator(min = 1) {
    const validator: ValidatorFn = (formArray: FormArray) => {
        const totalSelected = formArray.controls
            .map(control => control.value)
            .reduce((prev, next) => next ? prev + next : prev, 0);

        return totalSelected >= min ? null : { required: true };
    };

    return validator;
}

export function addCheckboxes(length: number, formArray: FormArray) {
    for (let i = 0; i < length; i++) {
        formArray.push(new FormControl(false));
    }
}

export function updateCheckboxes(data: number[], formArray: FormArray) {
    data.forEach(index => {
        formArray.controls[index].setValue(true);
    });
}

export function booleanArrayToIndicesString(data: boolean[]) {
    const selectedCheckboxes = data.reduce(
        (out, bool, index) => bool ? out.concat(index) : out,
        []
    );

    return selectedCheckboxes.toString();
}

export function isEmptyOrNullOrUndefined(str: string) {
    return (str === "" || str === null || str === "null" || str === undefined || str === "undefined");
}
