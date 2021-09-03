namespace App {
  interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  }

  export function validate(config: Validatable): boolean {
    let isValid = true;
    if (config.required) {
      isValid = isValid && config.value.toString().trim().length > 0;
    }
    if (config.minLength != null && typeof config.value === "string") {
      isValid = isValid && config.value.length > config.minLength;
    }
    if (config.maxLength != null && typeof config.value === "string") {
      isValid = isValid && config.value.length < config.maxLength;
    }
    if (config.min != null && typeof config.value === "number") {
      isValid = isValid && config.value > config.min;
    }
    if (config.max != null && typeof config.value === "number") {
      isValid = isValid && config.value > config.max;
    }
    return isValid;
  }
}
