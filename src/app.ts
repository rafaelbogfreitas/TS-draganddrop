class ProjectInput {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  element: HTMLFormElement;

  titleInputEl: HTMLInputElement;
  descriptionInputEl: HTMLInputElement;
  peopleInputEl: HTMLInputElement;

  constructor() {
    this.templateEl = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById("app")! as HTMLDivElement;

    const importNode = document.importNode(this.templateEl.content, true);
    this.element = importNode.firstElementChild as HTMLFormElement;
    this.element.id = 'user-input'
    this.attach();

    this.titleInputEl = document.querySelector('#title')! as HTMLInputElement;
    this.descriptionInputEl = document.querySelector('#description')! as HTMLInputElement;
    this.peopleInputEl = document.querySelector('#people')! as HTMLInputElement;
  }

  private submitHandler(e: Event) {
    e.preventDefault();
  }

  private configure() {
    this.element.addEventListener('click', this.submitHandler.bind(this))
  }

  private attach() {
    this.hostEl.insertAdjacentElement("afterbegin", this.element);
  }
}

const projInput = new ProjectInput();
