/// <reference path="Component.ts" />

namespace App {
  // Project input class
  export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputEl: HTMLInputElement;
    descriptionInputEl: HTMLInputElement;
    peopleInputEl: HTMLInputElement;

    constructor() {
      super("project-input", "app", true, "user-input");

      this.titleInputEl = this.element.querySelector(
        "#title"
      ) as HTMLInputElement;
      this.descriptionInputEl = this.element.querySelector(
        "#description"
      ) as HTMLInputElement;
      this.peopleInputEl = this.element.querySelector(
        "#people"
      ) as HTMLInputElement;

      this.configure();
    }

    configure() {
      this.element.addEventListener("submit", this.submitHandler);
    }

    renderContent() {}

    private gatherUserInput(): [string, string, number] | void {
      const title = this.titleInputEl.value;
      const description = this.descriptionInputEl.value;
      const people = this.peopleInputEl.value;

      const inputValues: [string, string, number] = [
        title,
        description,
        +people,
      ];

      if (
        !validate({value: title, required: true}) ||
        !validate({value: description, required: true, minLength: 5}) ||
        !validate({value: +people, required: true, min: 1})
      ) {
        alert("Invalid inputs");
        return;
      }

      return inputValues;
    }

    @autobind
    private submitHandler(e: Event) {
      e.preventDefault();

      const userInput = this.gatherUserInput();

      if (Array.isArray(userInput)) {
        const [title, description, people] = userInput;
        projectState.addProject(title, description, people);
        this.clearInputs();
      }
    }

    private clearInputs() {
      this.titleInputEl.value = "";
      this.descriptionInputEl.value = "";
      this.peopleInputEl.value = "";
    }
  }
}
